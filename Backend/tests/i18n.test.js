import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { resolveLanguage, languageDirective, LANGUAGES } from '../src/config/languages.js';
import { attachLanguage } from '../src/middleware/language.js';

// The OpenAI SDK captures global fetch when its client is constructed, so the
// stub must be installed before ai.service.js is first imported.
const sent = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  if (String(url).includes('groq.com')) {
    const body = JSON.parse(opts.body);
    sent.push(body);
    const json = body.messages.some((m) => /JSON/.test(m.content))
      ? '{"subject":"s","body":"b","category":"other","department":"d","priority":"Low","confidence":1,"reasoning":"r","steps":[],"requiredDocuments":[]}'
      : 'reply';
    return new Response(
      JSON.stringify({ id: 'x', object: 'chat.completion', created: 0, model: body.model, choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: json } }] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return realFetch(url, opts);
};
process.env.GROQ_API_KEY ||= 'test-key';
const ai = await import('../src/services/ai.service.js');

const lastPrompt = () => sent.at(-1).messages.map((m) => m.content).join('\n');

describe('language registry', () => {
  test('resolveLanguage normalises regional tags and falls back to English', () => {
    assert.equal(resolveLanguage('hi'), 'hi');
    assert.equal(resolveLanguage('hi-IN'), 'hi');
    assert.equal(resolveLanguage(' BN_in '), 'bn');
    assert.equal(resolveLanguage('ta-IN,en;q=0.8'), 'ta');
    assert.equal(resolveLanguage('xx'), 'en');
    assert.equal(resolveLanguage(undefined), 'en');
    assert.equal(resolveLanguage({ $ne: 1 }), 'en');
    assert.equal(resolveLanguage('__proto__'), 'en');
    assert.equal(resolveLanguage('constructor'), 'en');
  });

  test('covers English + the 22 scheduled languages, each with a native name', () => {
    assert.equal(Object.keys(LANGUAGES).length, 23);
    for (const l of Object.values(LANGUAGES)) assert.ok(l.name && l.native);
  });

  test('English adds nothing to a prompt', () => {
    assert.equal(languageDirective('en'), '');
    assert.equal(languageDirective(undefined), '');
    assert.match(languageDirective('hi'), /Hindi/);
  });
});

describe('middleware', () => {
  const run = (headers = {}, body = {}) => {
    const req = { body, get: (h) => headers[h.toLowerCase()] };
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; } };
    let called = false;
    attachLanguage(req, res, () => { called = true; });
    assert.ok(called);
    return { req, res };
  };

  test('header beats body beats Accept-Language beats default', () => {
    assert.equal(run({ 'x-app-language': 'bn', 'accept-language': 'hi' }, { language: 'ta' }).req.language, 'bn');
    assert.equal(run({ 'accept-language': 'hi' }, { language: 'ta' }).req.language, 'ta');
    assert.equal(run({ 'accept-language': 'te-IN,en;q=0.5' }).req.language, 'te');
    assert.equal(run().req.language, 'en');
  });

  test('unknown language is ignored, never an error; Content-Language is set', () => {
    const { req, res } = run({ 'x-app-language': 'klingon' });
    assert.equal(req.language, 'en');
    assert.equal(res.headers['Content-Language'], 'en');
  });
});

describe('AI prompts follow the language', () => {
  beforeEach(() => { sent.length = 0; });

  test('chat: system prompt names the chosen language; English is unchanged', async () => {
    await ai.chatWithAssistant([{ sender: 'user', text: 'hello' }], { language: 'hi' });
    assert.match(lastPrompt(), /Always reply in Hindi/);
    await ai.chatWithAssistant([{ sender: 'user', text: 'hello' }], { language: 'en' });
    assert.doesNotMatch(lastPrompt(), /LANGUAGE:/);
    await ai.chatWithAssistant([{ sender: 'user', text: 'hello' }]);
    assert.doesNotMatch(lastPrompt(), /LANGUAGE:/);
  });

  test('complaint email, document guide, scheme match and categorisation all carry the directive', async () => {
    await ai.generateComplaintEmail({ issueCategory: 'waterlogging', area: 'Salt Lake', details: 'x', citizenName: 'Divya', language: 'bn' });
    assert.match(lastPrompt(), /Bengali/);
    await ai.generateDocumentGuide({ documentName: 'Aadhaar', action: 'create', officialLink: null, language: 'ta' });
    assert.match(lastPrompt(), /Tamil/);
    await ai.matchSchemes({ profile: {}, seedSchemes: [], language: 'mr' }).catch(() => {});
    assert.match(lastPrompt(), /Marathi/);
    await ai.categorizeIssue('big pothole', { language: 'gu' });
    assert.match(lastPrompt(), /Gujarati/);
  });

  test('categorisation keeps DB enums in English even when translating prose', async () => {
    await ai.categorizeIssue('big pothole', { language: 'hi' });
    assert.match(lastPrompt(), /"priority" \(Low \| Medium \| High\)/);
    assert.match(lastPrompt(), /"department" \(English/);
  });

  test('scheme names stay verifiable against the English reference list', async () => {
    await ai.matchSchemes({ profile: {}, seedSchemes: [], language: 'hi' }).catch(() => {});
    assert.match(lastPrompt(), /must match the reference list exactly, in English/);
  });

  test('English prompts contain no language block (no regression)', async () => {
    await ai.generateDocumentGuide({ documentName: 'PAN', action: 'update', language: 'en' });
    assert.doesNotMatch(lastPrompt(), /LANGUAGE REQUIREMENT/);
  });
});
