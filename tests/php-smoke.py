"""Run ONLY against a local server started with AGENCY_ENV=test and a test outbox.
No external email delivery. See docs/RUN-LOCALLY.md.
"""
import sys, json, urllib.request, urllib.parse, urllib.error, http.cookiejar

base=(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8080').rstrip('/')
assert urllib.parse.urlparse(base).hostname in ('localhost','127.0.0.1','::1'), 'Local test server only'
print('Requires AGENCY_ENV=test, test outbox and non-example test mailboxes.')
opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
def request(payload=None, method=None):
 data=urllib.parse.urlencode(payload).encode() if payload is not None else None
 req=urllib.request.Request(base+'/api/lead.php',data=data,method=method)
 try:
  response=opener.open(req);return response.status,json.load(response)
 except urllib.error.HTTPError as e:return e.code,json.load(e)
status,token=request();assert status==200 and len(token['csrf'])==64
data=dict(name='QA Test',email='qa@agency.test',website='https://agency.test',company='',business_type='E-commerce',budget='',need='Account Audit',message='Local smoke test',privacy='1',csrf=token['csrf'])
assert request({**data,'csrf':'invalid'})[0]==403
s,r=request({**data,'email':'not-an-email'});assert s==422 and 'email' in r['errors']
s,r=request({**data,'need':'Unconfigured value'});assert s==422 and 'need' in r['errors']
assert request({**data,'company_url':'bot-filled'})[0]==422
s,r=request(data);assert s==200 and r['ok'] is True, (s,r)
assert request(data)[0]==403, 'A used token must be invalidated'
s,t=request();assert s==200 and t['csrf']!=token['csrf']
assert request({**data,'csrf':t['csrf']})[0]==200
assert request({**data,'csrf':request()[1]['csrf']})[0]==429
assert request(method='PUT')[0]==405
print('PASS: token, invalid token, field errors, option allowlist, honeypot, success, token rotation, replay, rate limit, method.')
