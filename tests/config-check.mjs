// Run from any directory: node tests/config-check.mjs
// Tests real exported validation logic. This is not a browser layout test.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const source=await fs.readFile(new URL('../web/js/brand.js',import.meta.url),'utf8');
const config=JSON.parse(await fs.readFile(new URL('../web/config/site.json',import.meta.url),'utf8'));
globalThis.document={baseURI:'https://agency.test/',querySelectorAll:()=>[]};
globalThis.fetch=async()=>({ok:false});
// Replace only import.meta.url-based asset resolution so the unchanged module can load from a data URL.
const moduleSource=source.replace("new URL('../config/site.json', import.meta.url)","new URL('https://agency.test/config/site.json')");
const {validateConfig,configReady}=await import('data:text/javascript;base64,'+Buffer.from(moduleSource).toString('base64'));
await configReady.catch(()=>{});
assert.equal(validateConfig(config).brand.name,'SIGNAL');
for(const mutation of [c=>c.colors.primary='not-a-color',c=>c.brand.email='bad',c=>c.form.needs=[],c=>c.links.audit='javascript:alert(1)',c=>c.links.audit='data:text/html,test',c=>c.features.animations='yes']){
 const c=structuredClone(config);mutation(c);assert.throws(()=>validateConfig(c));
}
const c=structuredClone(config);c.brand.name='New Agency';c.colors.primary='#123456';c.links.audit='https://agency.test/audit';assert.equal(validateConfig(c).brand.name,'New Agency');
console.log('PASS: base config, rebrand, malformed color/email/options/flags, unsafe URL schemes.');
