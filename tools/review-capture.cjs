// Refresh visual review artifacts and verify the section inventory from the supplied MD.
const {chromium}=require('C:/Users/pavlo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(__dirname,'../artifacts/qa');
const inventory={
 'index':['hero','services','management','measurement','automation-home','process','work-examples','about','partnership','audit-preview','faq','final-cta'],
 'google-ads':['hero','campaign-strategy','channels','account-deliverables','process','creative-testing','performance-review','outcomes','faq','final-cta'],
 'tracking-automation':['hero','measurement-plan','capabilities','crm-integration','automation','validation','setup','handover','faq','final-cta'],
 'results':['hero','filters','case-ecommerce','case-leads','case-saas','method','final-cta'],
 'audit':['intro','audit-form','next','faq']
};
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({reducedMotion:'reduce'}),report=[];
 for(const [route,expected] of Object.entries(inventory).filter(([route])=>!process.env.QA_ROUTE||process.env.QA_ROUTE.split(',').includes(route))){
  for(const width of [390,834,1440]){
   await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:8763/'+route+'.html');await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
   const actual=await page.locator('main [id]').evaluateAll((els,ids)=>els.map(el=>el.id).filter(id=>ids.includes(id)),expected);
   assert.deepEqual(actual,expected,route+' section order');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow');
   for(const img of await page.locator('img:visible').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,route+'-'+width+'.png'),fullPage:true});
   if(width===390)await page.screenshot({path:path.join(out,route+'-mobile-top.png')});
   if(route==='index'&&[390,1440].includes(width)){
    const captureStyle=await page.addStyleTag({content:'.site-header,.skip-link{visibility:hidden!important}'});
    for(const id of ['management','automation-home','work-examples','about','audit-preview'])await page.locator('#'+id).screenshot({path:path.join(out,'home-'+id+'-'+width+'.png')});
    await captureStyle.evaluate(el=>el.remove());
   }
   if(route==='index'&&width===1440){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,'home-preview.png')});}
   if(['google-ads','tracking-automation'].includes(route)&&[390,1440].includes(width)){
    const captureStyle=await page.addStyleTag({content:'.site-header,.skip-link{visibility:hidden!important}'});
    for(const id of expected.filter(id=>!['hero','faq','final-cta'].includes(id)))await page.locator('#'+id).screenshot({path:path.join(out,route+'-'+id+'-'+width+'.png')});
    await captureStyle.evaluate(el=>el.remove());
   }
   if(width===1440){const counts=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,headings:[...document.querySelectorAll('main h2')].map(el=>el.innerText.replace(/\s+/g,' ')),services:document.querySelectorAll('.service-grid article').length,channels:document.querySelectorAll('.channel-grid article').length,capabilities:document.querySelectorAll('.capability-grid article').length,automation:document.querySelectorAll('.automation-grid article').length,cases:document.querySelectorAll('[data-category]').length,faq:document.querySelectorAll('#faq details').length,steps:document.querySelectorAll('.process-list>li').length,audiences:document.querySelectorAll('.audiences>li').length}));report.push({route,sections:actual,...counts});}
  }
 }
 const find=name=>report.find(item=>item.route===name);
 if(find('index')){assert.equal(find('index').services,4);assert.equal(find('index').steps,5);assert.equal(find('index').audiences,4);assert.equal(find('index').faq,6);}
 if(find('google-ads')){assert.equal(find('google-ads').channels,4);assert.equal(find('google-ads').steps,5);assert.equal(find('google-ads').faq,6);}
 if(find('tracking-automation')){assert.equal(find('tracking-automation').capabilities,3);assert.equal(find('tracking-automation').automation,4);assert.equal(find('tracking-automation').steps,4);assert.equal(find('tracking-automation').faq,6);}
 if(find('results'))assert.equal(find('results').cases,3);
 if(find('audit')){assert.equal(find('audit').steps,3);assert.equal(find('audit').faq,2);}
 const inventoryFile=path.join(out,'content-inventory.json');
 const saved=process.env.QA_ROUTE&&fs.existsSync(inventoryFile)?JSON.parse(fs.readFileSync(inventoryFile)):[];
 fs.writeFileSync(inventoryFile,JSON.stringify([...saved.filter(item=>!find(item.route)),...report],null,2));
 await page.goto('file:///'+path.join(out,'reference-review.html').replaceAll('\\','/'));
 for(const route of ['0','1','2','3','4'])for(const device of ['desktop','tablet','mobile']){await page.locator('#route').selectOption(route);await page.locator('#device').selectOption(device);for(const img of await page.locator('img').all())await img.evaluate(el=>el.decode());}
 await browser.close();console.log('PASS: section order and counts for '+report.length+' page(s); '+report.length*3+' current screenshots; all 35 review images decode.');
})().catch(e=>{console.error(e);process.exit(1)});
