// Format conversion only: retain the original generated artwork unchanged.
const sharp=require('C:/Users/pavlo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const path=require('node:path');
const root=path.resolve(__dirname,'../web/assets/images');
async function run(){
 const names=['search','spark','bag','video','cursor','contact','chart','phone','report','bell','target','crm'];
 const sprite=path.resolve(__dirname,'../artifacts/generated/reference-icons.png');
 const meta=await sharp(sprite).metadata();
 const xs=[216,555,895,1234],ys=[200,540,880];
 await Promise.all(names.map((name,i)=>sharp(sprite).extract({left:Math.round((xs[i%4]-160)*meta.width/1448),top:Math.round((ys[Math.floor(i/4)]-160)*meta.height/1086),width:Math.round(320*meta.width/1448),height:Math.round(320*meta.height/1086)}).resize(240,240).webp({quality:90}).toFile(path.join(root,'icon-'+name+'.webp'))));
 const extra=['cart','group','building','mobile','sale','browser','bulb','gear','warning','idea','link','document'];
 const source=path.resolve(__dirname,'../artifacts/generated/reference-extra-icons.png');
 const em=await sharp(source).metadata(),ex=[214,554,894,1234],ey=[220,536,850];
 await Promise.all(extra.map((name,i)=>sharp(source).extract({left:Math.round((ex[i%4]-136)*em.width/1448),top:Math.round((ey[Math.floor(i/4)]-136)*em.height/1086),width:Math.round(272*em.width/1448),height:Math.round(272*em.height/1086)}).resize(240,240).webp({quality:90}).toFile(path.join(root,'icon-'+name+'.webp'))));
 await Promise.all(['reference-campaign-art','reference-lead-art','service-campaign-planning','service-creative-testing','service-event-validation','service-crm-feedback'].map(name=>sharp(path.resolve(__dirname,'../artifacts/generated',name+(name==='service-campaign-planning'?'-v2':'')+'.png')).webp({quality:90}).toFile(path.join(root,name+'.webp'))));
 console.log('Prepared reference-based illustration and icon assets.');
}
run().catch(error=>{console.error(error);process.exit(1)});
