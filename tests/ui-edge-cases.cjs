const {chromium}=require('C:/Users/pavlo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const base='http://127.0.0.1:8763/';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const ctx=await browser.newContext();const page=await ctx.newPage();
 let mode='session-failure',postCount=0,release;
 await ctx.route('**/api/lead.php',async route=>{
  if(route.request().method()==='GET'){
   if(mode==='session-failure')return route.abort('failed');
   return route.fulfill({contentType:'application/json',body:JSON.stringify({csrf:'test-session-token'})});
  }
  postCount++;
  if(mode==='offline')return route.abort('failed');
  if(mode==='pending')await new Promise(resolve=>{release=resolve});
  const status=mode==='expired'?403:mode==='limited'?429:mode==='ok-false'?200:503;
  return route.fulfill({status,contentType:'application/json',body:JSON.stringify({ok:false,message:'Test-only failure; retry is available.'})});
 });
 await page.goto(base+'audit.html');await page.getByRole('button',{name:'Retry connection'}).waitFor();assert.ok(await page.locator('[type=submit]').isDisabled());
 mode='ready';await page.getByRole('button',{name:'Retry connection'}).click();await page.waitForFunction(()=>!document.querySelector('[type=submit]').disabled);
 await page.locator('#name').fill('QA Retry');await page.locator('#email').fill('qa@agency.test');await page.locator('#website').fill('https://agency.test');await page.locator('#business_type').selectOption('E-commerce');await page.locator('#need').selectOption('Account Audit');await page.locator('#privacy').check();
 const submit=page.locator('[type=submit]');
 for(const failure of ['offline','expired','limited','ok-false']){
  mode=failure;await submit.click();await page.waitForFunction(()=>document.querySelector('.form-status').dataset.kind==='error'&&!document.querySelector('[type=submit]').disabled);
  assert.equal(await page.locator('#name').inputValue(),'QA Retry');assert.notEqual(await page.locator('.form-status').getAttribute('data-kind'),'success');
 }
 mode='pending';const before=postCount;await submit.click();await page.waitForFunction(()=>document.querySelector('[data-audit-form]').getAttribute('aria-busy')==='true');
 assert.equal(await submit.textContent(),'Sending…');assert.ok(await submit.isDisabled());
 await page.locator('[data-audit-form]').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 assert.equal(postCount,before+1);release();await page.waitForFunction(()=>!document.querySelector('[type=submit]').disabled);
 await page.goto(base+'audit.html?need=untrusted');await page.waitForLoadState('networkidle');assert.equal(await page.locator('#need').inputValue(),'');
 const cfg=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../web/config/site.json')));cfg.brand.name='A thoughtful performance agency for you';cfg.brand.email='a-long-team-name-for-campaigns@agency.test';cfg.features.animations=false;
 await ctx.route('**/config/site.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(cfg)}));
 for(const width of [360,390,768,834,1024,1199,1200,1440,1920]){
  await page.setViewportSize({width,height:1000});await page.goto(base);await page.waitForLoadState('networkidle');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Long brand at '+width);
  assert.equal(await page.locator('.desktop-nav').isVisible(),width>=1200);assert.equal(await page.locator('.menu-toggle').isVisible(),width<1200);
  assert.equal(await page.locator('.reveal-ready').count(),0);
 }
 for(const size of [[1600,160],[160,1600]]){
  cfg.brand.logo='assets/qa-logo.svg';await ctx.route('**/assets/qa-logo.svg',r=>r.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="${size[0]}" height="${size[1]}" viewBox="0 0 ${size[0]} ${size[1]}"><rect width="100%" height="100%" fill="#1967d2"/></svg>`}));
  await page.setViewportSize({width:360,height:844});await page.goto(base);await page.waitForLoadState('networkidle');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('.site-header .brand img').evaluate(el=>el.naturalWidth>0));await ctx.unroute('**/assets/qa-logo.svg');
 }
 cfg.brand.logo='';await page.goto(base);await page.waitForLoadState('networkidle');await page.locator('.menu-toggle').click();
 const close=page.getByRole('button',{name:'Close navigation'});await close.focus();await page.keyboard.press('Shift+Tab');assert.ok(await page.evaluate(()=>document.activeElement.closest('dialog')!==null));
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.body.classList.contains('menu-open'));
 await page.locator('.menu-toggle').click();await page.locator('dialog').getByRole('link',{name:'How we work',exact:true}).click();await page.waitForFunction(()=>location.hash==='#process');assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
 // Enlarge text only to 200%; this is a QA perturbation, never a layout implementation technique.
 cfg.brand.name='SIGNAL';for(const file of ['index.html','google-ads.html','tracking-automation.html','results.html','audit.html']){
  await page.goto(base+file);await page.waitForLoadState('networkidle');await page.evaluate(()=>{const elements=[...document.querySelectorAll('main h1,main h2,main h3,main p,main a,main label,main input,main select,main textarea,main button,main summary,main strong,main small')];const sizes=elements.map(el=>[el,parseFloat(getComputedStyle(el).fontSize),parseFloat(getComputedStyle(el).lineHeight)]);for(const [el,size,line]of sizes){el.style.setProperty('font-size',size*2+'px','important');if(Number.isFinite(line))el.style.setProperty('line-height',line*2+'px','important')}});
  const textLayout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();return !el.closest('.honeypot')&&r.width>0&&(r.right>innerWidth+1||r.left< -1)}).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,60),right:el.getBoundingClientRect().right}))}));
  if(textLayout.scroll>textLayout.width)console.log(JSON.stringify({file,...textLayout}));
  assert.ok(textLayout.scroll<=textLayout.width,'200% text '+file);
 }
 console.log('PASS: session retry, offline, CSRF retry, 429, ok=false, pending/double submit, unknown query, 9 long-brand widths, logo shapes, animation flag, menu focus/anchor, 200% text.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
