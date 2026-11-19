/**
 * Dictionary loading.
 *
 * Layout: ./locales/<lang>/<namespace>.js, each `export default { 'some.key': 'text' }`.
 * Final keys are `<namespace>.<key>`, e.g. file locales/en/sos.js + key
 * 'call.title'  →  the key 'sos.call.title'.
 *
 * English is bundled (it is the fallback for every other language). Other
 * languages are separate chunks fetched only when selected.
 */
const englishModules = import.meta.glob('./locales/en/*.js', { eager: true });
const lazyModules = import.meta.glob('./locales/*/*.js');

const namespaceOf = (path) => path.split('/').pop().replace(/\.js$/, '');

function flatten(entries) {
  const dict = {};
  for (const [path, mod] of entries) {
    const ns = namespaceOf(path);
    for (const [key, value] of Object.entries(mod.default || {})) dict[`${ns}.${key}`] = value;
  }
  return dict;
}

export const englishDictionary = flatten(Object.entries(englishModules));

const cache = { en: englishDictionary };

export async function loadDictionary(code) {
  if (cache[code]) return cache[code];
  const entries = Object.entries(lazyModules).filter(([p]) => p.startsWith(`./locales/${code}/`));
  const loaded = await Promise.all(entries.map(async ([p, load]) => [p, await load()]));
  cache[code] = flatten(loaded);
  return cache[code];
}

/** `Hello {name}` + { name: 'Divya' } → `Hello Divya`. Unknown placeholders are left visible. */
export function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, k) => (vars[k] === undefined || vars[k] === null ? m : String(vars[k])));
}
