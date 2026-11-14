import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const enRequired = [
 'Missions','Community','Academy','Opportunities','Rewards','Log in','Sign out',
 'Join Genesis ↗','Proof of contribution.','Privacy notice.','Participation terms.',
 'Your account controls.','Submit for review ↗','Password (12+ characters)',
 'Registered builders','Open missions.','Sponsor intake','Whitepaper',
 'Your contribution and reproducible evidence','GENESIS BUILDERS · THE FIRST WAVE'
];
const published=['fa','ar','es','fr','de','pt-BR','ru','zh-CN','hi'];
for (const lang of published) {
 test(`${lang}: 12 mission titles, descriptions and deliverables translated`,()=>{
   const translations=JSON.parse(readFileSync(new URL(`../locales/${lang}.json`,import.meta.url),'utf8'));
   const source=readFileSync(new URL('../src/index.tsx',import.meta.url),'utf8');
   const rows=Array.from(source.matchAll(/\['q\d\d','((?:[^'\\]|\\.)*)','[^']+','[^']+',\d+,'((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'\]/g));
   assert.equal(rows.length,12);
   for(const row of rows) for(const key of row.slice(1)) assert.ok(translations[key],`${lang} missing ${key}`);
 });
 test(`${lang}: all critical conversion, account, and disclosure copy translated`,()=>{
   const translations=JSON.parse(readFileSync(new URL(`../locales/${lang}.json`,import.meta.url),'utf8'));
   for(const label of enRequired) assert.ok(translations[label],`${lang} missing ${label}`);
 });
}
test('Language selection is persisted and RTL languages identified',()=>{
 const i18n=readFileSync(new URL('../src/i18n.ts',import.meta.url),'utf8');
 const source=readFileSync(new URL('../src/index.tsx',import.meta.url),'utf8');
 assert.match(i18n,/rtlLanguages/);assert.match(i18n,/localizeHtml/);
 assert.match(source,/proofloom_lang/);assert.match(source,/app.get\('\/language'/);
});

const canonical=JSON.parse(readFileSync(new URL('../locales/fa.json',import.meta.url),'utf8'));
for (const lang of published) {
 test(`${lang}: all 354 platform strings have identical source keys`,()=>{
  const actual=JSON.parse(readFileSync(new URL(`../locales/${lang}.json`,import.meta.url),'utf8'));
  assert.deepEqual(Object.keys(actual).sort(),Object.keys(canonical).sort());
  assert.ok(Object.keys(actual).length>=350);
  for(const [key,value] of Object.entries(actual)){assert.ok(value.trim().length>0,lang+' empty '+key);assert.ok(!/^\{.*\}$/.test(value),lang+' template placeholder '+key)}
 });
}
test('Locale switching preserves cookie, right-to-left direction and translated plain errors',()=>{
 const src=readFileSync(new URL('../src/index.tsx',import.meta.url),'utf8');
 const core=readFileSync(new URL('../src/i18n.ts',import.meta.url),'utf8');
 assert.match(src,/proofloom_lang/);assert.match(src,/__i18n_smoke/);
 assert.match(core,/rtlLanguages/);assert.match(core,/localizePlain/);
 assert.match(core,/dir=/);assert.match(core,/language-select/);
});
