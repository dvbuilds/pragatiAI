#!/usr/bin/env node
/**
 * Authoring helper for translators.
 *
 *   node scripts/i18n-build.mjs dump  > en.tsv          numbered English reference
 *   node scripts/i18n-build.mjs build <lang> <file.tsv> writes src/i18n/locales/<lang>/*.js
 *
 * A translation file has one line per string:  <number>TAB<translated text>
 * Numbers come from `dump`. Every number must appear exactly once and every
 * {placeholder} must be preserved; otherwise nothing is written.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const LOCALES = path.resolve('src/i18n/locales');
const en = {};
for (const f of fs.readdirSync(path.join(LOCALES, 'en')).filter((f) => f.endsWith('.js')).sort()) {
  en[f.replace(/\.js$/, '')] = (await import(pathToFileURL(path.join(LOCALES, 'en', f)).href)).default;
}
const rows = Object.entries(en).flatMap(([ns, d]) => Object.entries(d).map(([k, v]) => ({ ns, k, v })));
const ph = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

const [cmd, lang, file] = process.argv.slice(2);
if (cmd === 'dump') {
  rows.forEach((r, i) => console.log(`${i + 1}\t${r.v}`));
} else if (cmd === 'keys') {
  rows.forEach((r, i) => console.log(`${i + 1}\t${r.ns}.${r.k}`));
} else if (cmd === 'build') {
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter((l) => l.trim());
  const map = new Map();
  const errs = [];
  for (const l of lines) {
    const tab = l.indexOf('\t');
    const n = Number(l.slice(0, tab));
    const text = l.slice(tab + 1).trim();
    if (!Number.isInteger(n) || n < 1 || n > rows.length) { errs.push(`bad line: ${l.slice(0, 40)}`); continue; }
    if (map.has(n)) errs.push(`duplicate #${n}`);
    map.set(n, text);
  }
  rows.forEach((r, i) => {
    const t = map.get(i + 1);
    if (!t) return errs.push(`missing #${i + 1} (${r.ns}.${r.k})`);
    if (ph(t) !== ph(r.v)) errs.push(`placeholder mismatch #${i + 1} (${r.ns}.${r.k}): en {${ph(r.v)}} vs {${ph(t)}}`);
  });
  if (errs.length) { console.error(errs.slice(0, 40).join('\n')); console.error(`${errs.length} problem(s); nothing written`); process.exit(1); }
  const out = path.join(LOCALES, lang);
  fs.mkdirSync(out, { recursive: true });
  for (const ns of Object.keys(en)) {
    const body = rows.map((r, i) => ({ ...r, i })).filter((r) => r.ns === ns)
      .map((r) => `  ${JSON.stringify(r.k)}: ${JSON.stringify(map.get(r.i + 1))},`).join('\n');
    fs.writeFileSync(path.join(out, `${ns}.js`), `// ${lang} — translation of ../en/${ns}.js (keys and {placeholders} must match English)\nexport default {\n${body}\n};\n`);
  }
  console.log(`wrote ${Object.keys(en).length} files, ${rows.length} strings to ${out}`);
} else {
  console.error('usage: dump | keys | build <lang> <file>'); process.exit(2);
}
