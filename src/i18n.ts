/** Static, literal localization of platform-owned UI; user-authored content remains unchanged.
 * No third-party translation API is called, and no text is sent off-platform.
 */
import { translations, languageNames, type Locale } from './translations';
export { languageNames, type Locale } from './translations';
export const rtlLanguages = new Set(['fa', 'ar', 'ur']);
export const locales = (Object.keys(languageNames) as Locale[]).filter(x => x === 'en' || Object.keys(translations[x] || {}).length >= 300);
export function selectLocale(raw?: string | null): Locale {
  if (!raw) return 'en';
  const choice = raw.split(',')[0]?.split(';')[0]?.trim().replace('_', '-').toLowerCase() || 'en';
  const canonical: Record<string, Locale> = { 'zh': 'zh-CN', 'zh-cn': 'zh-CN', 'zh-hans': 'zh-CN', 'pt': 'pt-BR', 'pt-br': 'pt-BR', 'es-mx': 'es', 'es-es': 'es', 'fr-fr': 'fr', 'en-us': 'en', 'en-gb': 'en' };
  if (canonical[choice]) return canonical[choice];
  return locales.find(x => x.toLowerCase() === choice) || locales.find(x => x.toLowerCase().split('-')[0] === choice.split('-')[0]) || 'en';
}
const entityDecode = (s: string) => s.replace(/&(amp|quot|apos|lt|gt|nbsp|#39|#x27|#8217|#x2019);/gi, (_, e) => ({amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', '#39': "'", '#x27': "'", '#8217':'’', '#x2019':'’'} as any)[e.toLowerCase()] || _);
const htmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,'&gt;').replace(/"/g, '&quot;');
const trimText = (s: string) => s.trim().replace(/\s+/g,' ');
const findTranslation = (input: string, lang: Locale) => {
  const map = translations[lang] || {};
  return map[input] || map[input.replace(/\.$/, '')] || null;
};
function localText(input: string, lang: Locale): string {
  if (lang === 'en') return input;
  const raw = entityDecode(input);
  const lead = /^\s*/.exec(raw)?.[0] || '';
  const tail = /\s*$/.exec(raw)?.[0] || '';
  const body = trimText(raw);
  if (!body || /^\d+$/.test(body)) return input;
  const exact = findTranslation(body, lang);
  if (exact) return lead + htmlEscape(exact) + tail;
  // Keep numbers and proper IDs intact while translating complete UI suffixes.
  const dynamic = /^(\d+)(\s+)(XP after acceptance|XP after review|pending\.| pending\.| pending|registered builders|real submissions|accepted contributions|open missions)$/i.exec(body);
  if (dynamic) {
    const t = findTranslation(dynamic[3], lang);
    if (t) return lead + dynamic[1] + dynamic[2] + htmlEscape(t) + tail;
  }
  return input;
}
function translateAttributes(html: string, lang: Locale) {
  return html.replace(/\b(placeholder|aria-label|title|content)=("[^"]*"|'[^']*')/g, (all, attr, quoted) => {
    const value = entityDecode(quoted.slice(1,-1));
    const t = findTranslation(value, lang);
    return t ? attr+'="'+htmlEscape(t)+'"' : all;
  });
}
export function localizeHtml(html: string, lang: Locale, currentPath: string): string {
  // Internationalized page metadata + full RTL document flow; brand/URLs/inputs remain stable.
  const rtl = rtlLanguages.has(lang);
  html = html.replace(/<html\b[^>]*>/i, `<html lang="${lang}" dir="${rtl?'rtl':'ltr'}">`);
  const returnTo = /^\/(?!\/)/.test(currentPath) ? currentPath : '/';
  const languages = Object.entries(languageNames).filter(([code]) => locales.includes(code as Locale)).map(([code,label]) => `<option value="${code}" ${code===lang?'selected':''}>${htmlEscape(label)}</option>`).join('');
  const chooser = `<form class="language-select" action="/language" method="get"><input type="hidden" name="return_to" value="${htmlEscape(returnTo)}"><label class="sr-only" for="language-choice">Language</label><select id="language-choice" name="lang" aria-label="Language" onchange="this.form.submit()">${languages}</select><noscript><button type="submit">Apply</button></noscript></form>`;
  html = html.replace('<div class="auth">', chooser+'<div class="auth">');
  const extraCss = `\n.language-select{display:flex;align-items:center;margin-inline-start:auto;margin-inline-end:6px}.language-select select{color:#ecf2e7;background:#101b21;border:1px solid #49615e;border-radius:9px;padding:8px 9px;font-size:12px;max-width:165px}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}[dir=rtl] .brand{direction:ltr;unicode-bidi:isolate}[dir=rtl] .label{letter-spacing:0}[dir=rtl] .artrow:nth-child(2){margin-left:0;margin-right:30px}[dir=rtl] .artrow:nth-child(3){margin-left:0;margin-right:60px}[dir=rtl] .auth{margin-left:0;margin-right:auto}[dir=rtl] .hero h1{letter-spacing:-1px}[dir=rtl] .navlinks{direction:rtl}[dir=rtl] input[type=email],[dir=rtl] input[type=url],[dir=rtl] input[name=handle],[dir=rtl] input[name=ref]{direction:ltr;text-align:left}@media(max-width:820px){.language-select select{max-width:113px}.navin{gap:8px}.language-select{margin-inline-start:auto}}`;
  html = html.replace('</style>', extraCss+'</style>');
  if (lang === 'en') return html;
  // This tokenization only changes complete static UI phrases. Dynamic user submissions
  // are never generically machine translated or sent to any remote service.
  const tokens = html.split(/(<[^>]*>)/g);
  let inertTag = '';
  for(let i=0;i<tokens.length;i++) {
    const t=tokens[i];
    if(t.startsWith('<')) {
      if(/^<(style|script|pre|textarea)\b/i.test(t)) inertTag=t.match(/^<([a-z]+)/i)?.[1]||'';
      if(/^<\/(style|script|pre|textarea)/i.test(t)) inertTag='';
      tokens[i]=translateAttributes(t, lang);
    } else if(!inertTag) tokens[i]=localText(t,lang);
  }
  return tokens.join('');
}
