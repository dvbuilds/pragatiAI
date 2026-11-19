#!/usr/bin/env node
/**
 * i18n consistency check.  Usage:  node scripts/i18n-check.mjs [lang ...]
 * With no args, checks every language folder. Exits 1 on any error.
 *
 *  1. Every t('ns.key') used in src/ exists in the English dictionary.
 *  2. Every translation file has exactly the English keys (none missing/extra).
 *  3. {placeholders} match English for every key.
 *  4. No empty values; warns when a non-Latin-script language still has the
 *     English sentence verbatim (probably untranslated).
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SRC = path.resolve('src');
const LOCALES = path.join(SRC, 'i18n/locales');
const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

async function loadLang(code) {
  const dir = path.join(LOCALES, code);
  const out = {};
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) {
    const mod = await import(pathToFileURL(path.join(dir, f)).href);
    out[f.replace(/\.js$/, '')] = mod.default;
  }
  return out;
}
const flat = (byNs) => Object.fromEntries(Object.entries(byNs).flatMap(([ns, d]) => Object.entries(d).map(([k, v]) => [`${ns}.${k}`, v])));

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!p.startsWith(LOCALES)) walk(p, acc); }
    else if (/\.(jsx?|mjs)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

let errors = 0, warnings = 0;
const err = (m) => { errors++; console.error('ERROR ', m); };
const warn = (m) => { warnings++; console.warn('warn  ', m); };

const en = await loadLang('en');
const enFlat = flat(en);

// 1. keys used in code
const used = new Map();
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\bt\(\s*(['"`])([A-Za-z0-9_.-]+)\1/g)) {
    if (!used.has(m[2])) used.set(m[2], path.relative(SRC, file));
  }
}
for (const [key, file] of used) if (!(key in enFlat)) err(`${file}: t('${key}') has no English entry`);
const unused = Object.keys(enFlat).filter((k) => !used.has(k));
if (unused.length) warn(`${unused.length} English keys are never referenced literally (fine if built dynamically): ${unused.slice(0, 8).join(', ')}${unused.length > 8 ? ', …' : ''}`);

// 2-4. each language vs English
const langs = process.argv.slice(2).length ? process.argv.slice(2)
  : fs.readdirSync(LOCALES).filter((d) => d !== 'en' && fs.statSync(path.join(LOCALES, d)).isDirectory());

for (const code of langs) {
  if (!fs.existsSync(path.join(LOCALES, code))) { err(`${code}: no folder`); continue; }
  const tr = await loadLang(code);
  for (const ns of Object.keys(en)) if (!tr[ns]) err(`${code}: missing file ${ns}.js`);
  for (const ns of Object.keys(tr)) if (!en[ns]) err(`${code}: extra file ${ns}.js`);
  const trFlat = flat(tr);
  let same = 0;
  for (const k of Object.keys(enFlat)) {
    if (!(k in trFlat)) { if (tr[k.split('.')[0]]) err(`${code}: missing key ${k}`); continue; }
    const v = trFlat[k];
    if (typeof v !== 'string' || !v.trim()) { err(`${code}: empty value for ${k}`); continue; }
    if (placeholders(v) !== placeholders(enFlat[k])) err(`${code}: placeholder mismatch in ${k}: en {${placeholders(enFlat[k])}} vs {${placeholders(v)}}`);
    if (v === enFlat[k] && /[A-Za-z]{4,}/.test(v) && code !== 'en') same++;
  }
  for (const k of Object.keys(trFlat)) if (!(k in enFlat)) err(`${code}: extra key ${k}`);
  if (same > 15) warn(`${code}: ${same} values are identical to English — possibly untranslated`);
}

console.log(`\ni18n check: ${used.size} keys used in code, ${Object.keys(enFlat).length} English keys, ${langs.length} language(s) checked — ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
