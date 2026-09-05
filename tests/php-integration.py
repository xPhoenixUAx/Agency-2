"""Isolated PHP integration tests. mail() is disabled; only temporary local outboxes are used."""
import subprocess, tempfile, shutil, os, time, json, urllib.request, urllib.parse, urllib.error, http.cookiejar
from pathlib import Path

root=Path(__file__).resolve().parents[1]
php=shutil.which('php')
assert php, 'PHP is required'

def check_server(kind, callback):
    with tempfile.TemporaryDirectory(prefix='signal-qa-') as folder:
        folder=Path(folder)
        web=folder/'web';shutil.copytree(root/'web',web)
        outbox=folder/'outbox';outbox.mkdir()
        sessions=folder/'sessions';sessions.mkdir()
        env=os.environ.copy();env.update(AGENCY_ENV='test',AGENCY_TEST_OUTBOX=str(outbox),AGENCY_MAIL_FROM='sender@agency.test',AGENCY_MAIL_TO='qa@agency.test')
        if kind=='failure':env['AGENCY_TEST_OUTBOX']=str(folder/'missing-outbox')
        if kind=='config':
            cfg=json.loads((web/'config/site.json').read_text());cfg['brand']['email']='qa@agency.test';cfg['form']['needs']=['Custom Audit'];(web/'config/site.json').write_text(json.dumps(cfg));env['AGENCY_MAIL_TO']=''
        proc=subprocess.Popen([php,'-d','disable_functions=mail','-d',f'session.save_path={sessions}','-d',f'sys_temp_dir={folder}','-S','127.0.0.1:8764','-t',str(web)],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        base='http://127.0.0.1:8764'
        opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        def request(data=None,method=None):
            body=urllib.parse.urlencode(data).encode() if data is not None else None
            try:r=opener.open(urllib.request.Request(base+'/api/lead.php',data=body,method=method))
            except urllib.error.HTTPError as e:r=e
            return r.status,json.load(r),r.headers
        try:
            for _ in range(40):
                try:request();break
                except urllib.error.URLError:time.sleep(.1)
            callback(request,outbox,sessions,base)
        finally:
            proc.terminate();proc.wait(timeout=10)

def smoke(request,outbox,sessions,base):
    subprocess.run([shutil.which('python'),str(root/'tests/php-smoke.py'),base],check=True)
    assert len(list(outbox.glob('*.txt')))==2

def payload(request):
    status,data,headers=request()
    return dict(name='QA Test',email='qa@agency.test',website='https://agency.test',business_type='E-commerce',need='Account Audit',privacy='1',csrf=data['csrf'])

def validation(request,outbox,sessions,base):
    data=payload(request)
    for change,key in [({'website':'javascript:alert(1)'},'website'),({'name':'','name[]':'array'},'name'),({'privacy':'0'},'privacy'),({'message':'я'*2100},'message')]:
        status,body,_=request({**data,**change});assert status==422 and key in body['errors'],(status,body)
    status,_,_=request({**data,'message':'x'*33000});assert status==413
    assert not list(outbox.glob('*'))
    print('PASS: URL, array, consent, UTF-8 byte limits, payload size.')

def failure(request,outbox,sessions,base):
    status,body,_=request(payload(request));assert status==503 and body['ok'] is False
    assert not list(outbox.glob('*'));print('PASS: transport failure never reports success.')

def config(request,outbox,sessions,base):
    data=payload(request)
    assert request(data)[0]==422
    status,body,_=request({**data,'need':'Custom Audit'});assert status==200 and body['ok'] is True
    assert len(list(outbox.glob('*')))==1
    print('PASS: recipient and option allowlist follow changed site.json.')

def expired(request,outbox,sessions,base):
    data=payload(request)
    for session in sessions.glob('sess_*'):
        value=session.read_text();import re
        session.write_text(re.sub(r'issued\|i:\d+;',f'issued|i:{int(time.time())-3601};',value))
    assert request(data)[0]==403
    token=request()[1]['csrf'];assert token!=data['csrf']
    assert request({**data,'csrf':token})[0]==200
    print('PASS: expired CSRF, fresh session and retry.')

for kind,callback in [('smoke',smoke),('validation',validation),('failure',failure),('config',config),('expired',expired)]:check_server(kind,callback)
print('All PHP tests passed. Temporary outboxes removed; no external delivery.')
