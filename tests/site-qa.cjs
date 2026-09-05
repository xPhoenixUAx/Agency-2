const {chromium} = require('C:/Users/pavlo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const output = path.resolve(__dirname,'../artifacts/qa');
fs.mkdirSync(output,{recursive:true});
const pages=['index.html','google-ads.html','tracking-automation.html','results.html','audit.html'];
const widths=[360,390,768,834,1024,1199,1200,1440,1920];
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const results=[];
 for(const route of process.env.QA_INTERACTIONS_ONLY ? [] : pages.filter(route=>!process.env.QA_ROUTE||route===process.env.QA_ROUTE+'.html')){
  for(const width of widths){
   await page.setViewportSize({width,height:1000});
   await page.goto('http://127.0.0.1:8763/'+route);await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
   const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,overflow:[...document.querySelectorAll('main *,header *,footer *')].filter(el=>{const r=el.getBoundingClientRect();return !el.closest('.honeypot')&&r.width>0&&(r.right>innerWidth+1||r.left< -1)&&getComputedStyle(el).position!=='absolute'}).map(el=>el.tagName+'.'+el.className)}));
   assert.equal(layout.h1,1,route+' h1');
   results.push({route,...layout});
   if([390,834,1440].includes(width)){
    for(const img of await page.locator('img:visible').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(output,route.replace('.html','')+'-'+width+'.png'),fullPage:true});
   }
  }
 }
 if(results.length) fs.writeFileSync(path.join(output,'layout.json'),JSON.stringify(results,null,2));
 console.log('Overflow results:',JSON.stringify(results.filter(r=>r.scroll>r.width||r.overflow.length)));
 assert.ok(results.every(r=>r.scroll<=r.width),'Horizontal overflow');
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:8763/index.html');
 const menu=page.getByRole('button',{name:'Open navigation'});await menu.focus();await page.keyboard.press('Enter');
 assert.ok(await page.locator('dialog').evaluate(el=>el.open));
 assert.equal(await page.evaluate(()=>document.body.classList.contains('menu-open')),true);
 await page.keyboard.press('Escape');assert.ok(await menu.evaluate(el=>el===document.activeElement));
 await menu.click();await page.getByRole('button',{name:'Close navigation'}).click();
 assert.equal(await page.evaluate(()=>document.body.classList.contains('menu-open')),false);
 await menu.click();await page.setViewportSize({width:1440,height:1000});await page.waitForFunction(()=>!document.querySelector('dialog').open);
 assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
 const services=page.getByRole('button',{name:'Services',exact:true});await services.focus();await page.keyboard.press('Enter');
 assert.equal(await services.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');
 assert.equal(await services.getAttribute('aria-expanded'),'false');
 const faq=page.locator('#faq summary').first();await faq.focus();await page.keyboard.press('Enter');
 assert.equal(await faq.evaluate(el=>el.parentElement.open),false);
 await page.goto('http://127.0.0.1:8763/results.html');await page.getByRole('button',{name:'Ecommerce',exact:true}).click();
 assert.equal(await page.locator('article[data-category]:visible').count(),1);
 assert.match(await page.locator('[data-filter-status]').textContent(),/^1 illustrative/);
 await page.getByRole('button',{name:'All',exact:true}).click();assert.equal(await page.locator('article[data-category]:visible').count(),3);
 await page.goto('http://127.0.0.1:8763/audit.html?need=tracking');await page.waitForLoadState('networkidle');
 assert.equal(await page.locator('#need').inputValue(),'Tracking & Analytics');
 await page.getByRole('button',{name:'Request my audit',exact:true}).click();assert.equal(await page.locator('#name').evaluate(el=>el===document.activeElement),true);
 await page.locator('#name').fill('QA Test');await page.locator('#email').fill('bad');
 assert.equal(await page.locator('#email').evaluate(el=>el.validity.typeMismatch),true);
 await page.locator('#website').fill('bad');assert.equal(await page.locator('#website').evaluate(el=>el.validity.typeMismatch),true);
 // Response interception tests UI only. No messages are sent and no production code simulates delivery.
 let reply={status:503,body:{ok:false,message:'Test: transport unavailable'}};
 await page.route('**/api/lead.php',async route=>route.request().method()==='POST'?route.fulfill({status:reply.status,contentType:'application/json',body:JSON.stringify(reply.body)}):route.continue());
 await page.locator('#email').fill('qa@agency.test');await page.locator('#website').fill('https://agency.test');await page.locator('#business_type').selectOption('E-commerce');await page.locator('#privacy').check();
 await page.getByRole('button',{name:'Request my audit',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.form-status').dataset.kind==='error');
 assert.equal(await page.locator('#name').inputValue(),'QA Test');
 reply={status:422,body:{ok:false,errors:{email:'Test email error'},message:'Check fields'}};
 await page.getByRole('button',{name:'Request my audit',exact:true}).click();await page.locator('#email-error').waitFor();assert.equal(await page.locator('#email').getAttribute('aria-invalid'),'true');
 reply={status:200,body:{ok:true}};await page.getByRole('button',{name:'Request my audit',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.form-status').dataset.kind==='success');assert.equal(await page.locator('#name').inputValue(),'');
 assert.equal(await page.locator('[data-server-error]').count(),0);
 // Rebrand comes from the same JSON request used on real pages.
 const cfg=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../web/config/site.json')));
 cfg.brand.name='A thoughtful performance agency for you';cfg.brand.email='team@agency.test';cfg.content.heroTitle='A longer headline to check that every opportunity still has enough room to be understood.';cfg.features.showIllustrativeCases=false;
 await context.route('**/config/site.json',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(cfg)}));
 for(const route of [...pages,'privacy.html','terms.html']){
  await page.setViewportSize({width:360,height:844});await page.goto('http://127.0.0.1:8763/'+route);await page.waitForLoadState('networkidle');
  assert.ok((await page.title()).includes(cfg.brand.name));
  assert.equal(await page.locator('.site-header [data-brand=name]').textContent(),cfg.brand.name);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Rebrand overflow '+route);
  if(route==='results.html'){assert.equal(await page.locator('article[data-category]:visible').count(),0);assert.equal(await page.locator('[data-case-filters]').isVisible(),false);assert.equal(await page.locator('[data-cases-empty]').isVisible(),true);}
 }
 await context.unroute('**/config/site.json');
 await context.route('**/config/site.json',route=>route.fulfill({status:503,body:'unavailable'}));
 await page.goto('http://127.0.0.1:8763/audit.html');await page.waitForLoadState('networkidle');assert.ok(await page.locator('[data-config-error]').isVisible());assert.ok(await page.locator('[type=submit]').isDisabled());
 await context.unroute('**/config/site.json');
 await page.goto('http://127.0.0.1:8763/rebrand.html');await page.waitForLoadState('networkidle');await page.locator('#brand-name').fill('QA Agency');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Завантажити site.json',exact:true}).click();const download=await downloadPromise;const file=await download.path();assert.equal(JSON.parse(fs.readFileSync(file)).brand.name,'QA Agency');
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const fallback=await nojs.newPage();await fallback.goto('http://127.0.0.1:8763/index.html');await fallback.locator('#faq summary').first().click();assert.equal(await fallback.locator('#faq details').first().getAttribute('open'),null);assert.ok(await fallback.locator('noscript').isVisible());
 assert.deepEqual(errors,[]);
 console.log('PASS: '+results.length+' viewport checks, menu/keyboard/FAQ, filters, required fields, tracking preselect, UI transport/validation/success, rebrand across 7 pages, hidden cases, config failure, editor download, no-JS.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

