/*
  build.mjs — generates the localized static pages from a single source each.

    node build.mjs             generate every page in both languages
    node build.mjs --check     validate only, write nothing
    node build.mjs --verify-en additionally scan each English output for
                               leftover Spanish copy

  Source of truth (one template + two dictionaries per page):
    i18n/template.html             i18n/es.json  i18n/en.json   → liveengines.html, en/index.html
    i18n/library.template.html    i18n/library.es.json  i18n/library.en.json
                                                        → library.html, en/library.html

  To add a page: append an entry to PAGES with its template, dictionaries and
  output paths. Nothing else changes.

  Zero dependencies. Output is committed so the host needs no Node.
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname);
const TPL_DIR = path.join(ROOT, 'i18n');

const args = new Set(process.argv.slice(2));
const CHECK = args.has('--check');
const VERIFY_EN = args.has('--verify-en');

const readJSON = (f) => JSON.parse(fs.readFileSync(path.join(TPL_DIR, f), 'utf8'));

/* Single source of truth for anything shared by every page. Keeps the contact
   address from drifting across templates and dictionaries. */
const SITE = {
  email: 'hola@liveengines.com',
  origin: 'https://liveengines.com'
};

// `root` prefixes every relative asset path so both outputs resolve correctly.
// `url_es` / `url_en` point at the real .html files (never bare directories):
// opening the site over file:// or from a static host that does not rewrite
// directory URLs would otherwise land on a directory index instead on a page.
const PAGES = [
  {
    id: 'landing',
    tpl: 'template.html',
    dicts: { es: 'es.json', en: 'en.json' },
    paths: { es: 'liveengines.html', en: 'en/index.html' },
    targets: [
      { lang: 'es', out: 'liveengines.html', root: './',
        canonical: '/', ogLocale: 'es_419', ogLocaleAlt: 'en_US',
        altHref: '/', altHreflang: 'es', flags: { is_es: true, is_en: false } },
      { lang: 'en', out: 'en/index.html', root: '../',
        canonical: '/en/', ogLocale: 'en_US', ogLocaleAlt: 'es_419',
        altHref: '/', altHreflang: 'es', flags: { is_es: false, is_en: true } }
    ]
  },
  {
    id: 'library',
    tpl: 'library.template.html',
    dicts: { es: 'library.es.json', en: 'library.en.json' },
    paths: { es: 'library.html', en: 'en/library.html' },
    targets: [
      { lang: 'es', out: 'library.html', root: './',
        canonical: '/library.html', ogLocale: 'es_419', ogLocaleAlt: 'en_US',
        altHref: '/library.html', altHreflang: 'es', flags: { is_es: true, is_en: false } },
      { lang: 'en', out: 'en/library.html', root: '../',
        canonical: '/en/library.html', ogLocale: 'en_US', ogLocaleAlt: 'es_419',
        altHref: '/library.html', altHreflang: 'es', flags: { is_es: false, is_en: true } }
    ]
  },
  {
    id: 'privacy',
    tpl: 'privacy.template.html',
    dicts: { es: 'privacy.es.json', en: 'privacy.en.json' },
    paths: { es: 'politica-de-privacidad.html', en: 'en/privacy.html' },
    targets: [
      { lang: 'es', out: 'politica-de-privacidad.html', root: './',
        canonical: '/politica-de-privacidad.html', ogLocale: 'es_419', ogLocaleAlt: 'en_US',
        altHref: '/politica-de-privacidad.html', altHreflang: 'es', flags: { is_es: true, is_en: false } },
      { lang: 'en', out: 'en/privacy.html', root: '../',
        canonical: '/en/privacy.html', ogLocale: 'en_US', ogLocaleAlt: 'es_419',
        altHref: '/politica-de-privacidad.html', altHreflang: 'es', flags: { is_es: false, is_en: true } }
    ]
  }
];

const pageById = Object.fromEntries(PAGES.map((p) => [p.id, p]));

for (const page of PAGES) {
  const canonicalByLang = Object.fromEntries(page.targets.map((t) => [t.lang, t.canonical]));
  for (const t of page.targets) {
    t.url_es = `${t.root}${page.paths.es}`;
    t.url_en = `${t.root}${page.paths.en}`;
    // Absolute hreflang targets: a relative path would be wrong inside
    // <link rel="alternate">, which is always resolved from the domain root.
    t.hreflang_es = SITE.origin + canonicalByLang.es;
    t.hreflang_en = SITE.origin + canonicalByLang.en;
    // Cross-page links (footer legal, nav), resolved in the reader's language.
    // Never concatenate these by hand: they already end in a filename.
    for (const id of ['landing', 'library', 'privacy']) {
      t['url_' + id] = `${t.root}${t.lang === 'en' ? pageById[id].paths.en : pageById[id].paths.es}`;
    }
    t.privacy_url = t.url_privacy;
  }
}

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeAttr = (s) => s.replace(/[&<>"']/g, (c) => ESC[c]);

const problems = [];
const warnings = [];

for (const page of PAGES) {
  const tpl = fs.readFileSync(path.join(TPL_DIR, page.tpl), 'utf8');
  const year = String(new Date().getFullYear());

  for (const t of page.targets) {
    const dict = readJSON(page.dicts[t.lang]);
    const used = new Set();
    const ctx = {
      root: t.root,
      lang: t.lang,
      canonical: t.canonical,
      og_locale: t.ogLocale,
      og_locale_alt: t.ogLocaleAlt,
      alt_url: t.altHref,
      alt_lang: t.altHreflang,
      hreflang_es: t.hreflang_es,
      hreflang_en: t.hreflang_en,
      url_es: t.url_es,
      url_en: t.url_en,
      contact_email: SITE.email,
      url_landing: t.url_landing,
      url_library: t.url_library,
      url_privacy: t.url_privacy,
      privacy_url: t.privacy_url,
      today: new Date().toISOString().slice(0, 10),
      year,
      ...t.flags
    };

    // 1. conditional blocks  {{#flag}} ... {{/flag}}
    let html = tpl.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, flag, body) =>
      ctx[flag] ? body : ''
    );

    // 2. text tokens (unescaped on purpose: values may contain inline markup)
    html = html.replace(/\{\{t:([\w.-]+)\}\}/g, (_, key) => {
      if (!(key in dict)) { problems.push(`[${page.id}/${t.lang}] missing key: t:${key}`); return `{{t:${key}}}`; }
      used.add(key);
      return dict[key];
    });

    // 3. attribute tokens (escaped — they land inside quoted attributes)
    html = html.replace(/\{\{attr:([\w-]+)\|([\w.-]+)\}\}/g, (_, attr, key) => {
      if (!(key in dict)) { problems.push(`[${page.id}/${t.lang}] missing key: attr:${key}`); return `{{attr:${attr}|${key}}}`; }
      used.add(key);
      return escapeAttr(dict[key]);
    });

    // 4. plain variables
    html = html.replace(/\{\{(\w+)\}\}/g, (whole, name) => {
      if (name in ctx) return ctx[name];
      problems.push(`[${page.id}/${t.lang}] unknown variable: ${whole}`);
      return whole;
    });

    const leftovers = html.match(/\{\{[#/\w:|-]+\}\}/g);
    if (leftovers) problems.push(`[${page.id}/${t.lang}] unresolved tokens: ${[...new Set(leftovers)].join(', ')}`);

    for (const key of Object.keys(dict)) {
      if (!used.has(key)) warnings.push(`[${page.id}/${t.lang}] unused key: ${key}`);
    }

    if (VERIFY_EN && t.lang === 'en') {
      const body = html.slice(html.indexOf('<body'));
      const text = body
        .replace(/<script[\s\S]*?<\/script>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ');
      // Brand-level strings (contact address, domains) are identical in both
      // languages, and their parts collide with Spanish words — skip them.
      const probe = text.replace(/[\w.+-]+@[\w.-]+\.\w+/g, ' ');
      const ES = /\b(el|la|los|las|una|unos|unas|del|con|para|como|más|pero|sus|este|esta|esto|porque|entre|cuando|muy|sin|sobre|también|hasta|donde|quien|está|están|que|qué|se|su|ya|ni|usted|nuestros|nuestras|exploración|técnico|técnica|servicios|precios|proceso|industrias|entrega|entregamos|gracias|hola|años|mes|meses)\b/gi;
      const hits = [...new Set((probe.match(ES) || []).map((w) => w.toLowerCase()))];
      if (hits.length) problems.push(`[${page.id}/en] possible Spanish residue: ${hits.join(', ')}`);
      if (/[¿¡]/.test(probe)) problems.push(`[${page.id}/en] inverted punctuation found (¿ or ¡)`);
    }

    const banner = `<!-- GENERATED by build.mjs from i18n/${page.tpl} + ${page.dicts[t.lang]} — do not edit. Run: npm run build -->`;
    const final = html.replace(/^<!DOCTYPE html>/i, `<!DOCTYPE html>\n${banner}`);

    const dest = path.join(ROOT, t.out);
    if (!CHECK) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, final);
    }
    console.log(`${CHECK ? 'check' : 'build'}  ${t.lang}  →  ${t.out}  (${used.size} keys)`);
  }
}

for (const w of warnings) console.warn('warn  ' + w);
if (problems.length) {
  console.error('\nbuild failed:');
  for (const p of problems) console.error('  ✗ ' + p);
  process.exit(1);
}