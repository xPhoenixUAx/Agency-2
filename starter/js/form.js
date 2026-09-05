import {configReady} from './brand.js';
const form=document.querySelector('[data-audit-form]');
const endpoint=new URL('../api/lead.php',import.meta.url);
if(form){
  const status=form.querySelector('[role=status]');
  const submit=form.querySelector('[type=submit]');
  let csrf='';let sending=false;let cfg;
  const say=(text,kind='info')=>{status.textContent=text;status.dataset.kind=kind;};
  async function token(){
    const r=await fetch(endpoint,{credentials:'same-origin',cache:'no-store'});
    const data=await r.json();
    if(!r.ok || typeof data.csrf!=='string')throw new Error('Session unavailable');
    csrf=data.csrf;
  }
  submit.disabled=true;
  Promise.all([configReady,token()]).then(([c])=>{cfg=c;submit.disabled=false;})
    .catch(()=>say('The form is unavailable. Reload the page or use the contact email below.','error'));
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(sending || !csrf || !cfg)return;
    form.querySelectorAll('[aria-invalid]').forEach(el=>{
      el.removeAttribute('aria-invalid');
      const ids=(el.getAttribute('aria-describedby')||'').split(' ').filter(id=>id && id!==`${el.id}-error`);
      if(ids.length)el.setAttribute('aria-describedby',ids.join(' '));else el.removeAttribute('aria-describedby');
    });
    form.querySelectorAll('[data-server-error]').forEach(el=>el.remove());
    if(!form.reportValidity())return;
    sending=true;submit.disabled=true;form.setAttribute('aria-busy','true');say('Sending your request…');
    const data=new FormData(form);data.set('csrf',csrf);
    try{
      const response=await fetch(endpoint,{method:'POST',body:data,credentials:'same-origin'});
      const result=await response.json();
      if(!response.ok || !result.ok){
        for(const [name,message] of Object.entries(result.errors || {})){
          const field=form.elements.namedItem(name);
          if(field instanceof HTMLElement){
            field.setAttribute('aria-invalid','true');
            const note=document.createElement('p');note.className='error-text';note.dataset.serverError='';note.id=`${field.id}-error`;note.textContent=String(message);
            field.closest('.field')?.append(note);
            field.setAttribute('aria-describedby',`${field.getAttribute('aria-describedby')||''} ${note.id}`.trim());
          }
        }
        say(result.message || 'Your request could not be sent. Please try again.','error');
        if(response.status===403) await token();
        form.querySelector('[aria-invalid=true]')?.focus();
        return;
      }
      form.reset();say(cfg.content.success,'success');status.focus();
      // Keep the confirmed success state even if the next session fetch fails.
      try{await token();}catch{csrf='';}
    }catch{
      say('We could not confirm submission. Check your connection before trying again.','error');
    }finally{sending=false;submit.disabled=!csrf;form.removeAttribute('aria-busy');}
  });
}
