"""Authoring helper: emits static HTML; no build step or Python needed to serve web/."""
from pathlib import Path
from html import escape
from home_content import expand_home
from service_content import expand_services
ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / 'web'

def icon(name, color='blue'):
    asset={'check':'target','arrow':'cursor'}.get(name,name)
    return f'<span class="icon-shell {color}" aria-hidden="true"><img src="assets/images/icon-{asset}.webp" width="240" height="240" alt=""></span>'

arrow = '<svg class="arrow-icon" aria-hidden="true" width="20" height="20"><use href="assets/icons.svg#arrow"></use></svg>'
chevron = '<svg class="chevron" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
brand = '<a class="brand" href="index.html" data-logo><span data-brand="name">SIGNAL</span><span class="brand-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></span></a>'
def cta(tracking=False):
    if tracking:
        return f'<a class="button" data-tracking-link href="audit.html?need=tracking"><span data-content="trackingCta">Review my tracking</span>{arrow}</a>'
    return f'<a class="button" data-link="audit" href="audit.html"><span data-content="cta">Get a free audit</span>{arrow}</a>'

links = '<a href="google-ads.html">Google Ads Management</a><a href="tracking-automation.html">Tracking &amp; Automation</a><a href="index.html#process">How we work</a><a href="results.html">Results</a><a href="index.html#about">About</a>'
header = f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="container">{brand}
<nav class="desktop-nav" aria-label="Main navigation"><div class="services-menu"><button class="nav-button" type="button" aria-expanded="false" aria-controls="services-links">Services {chevron}</button><div id="services-links" class="services-links" hidden><a href="google-ads.html">Google Ads Management</a><a href="tracking-automation.html">Tracking &amp; Automation</a></div></div><a href="index.html#process">How we work</a><a href="results.html">Results</a><a href="index.html#about">About</a></nav>
<div class="header-actions">{cta()}<button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="mobile-menu" aria-expanded="false" hidden><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18M3 12h18M3 19h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div></div></header>
<dialog id="mobile-menu" aria-labelledby="menu-title"><div class="menu-inner"><div class="menu-top"><span id="menu-title" data-brand="name">SIGNAL</span><button class="menu-close" type="button" aria-label="Close navigation" autofocus>×</button></div><nav aria-label="Mobile navigation"><a href="index.html">Home</a>{links}{cta()}</nav><p data-brand="description">Independent Google Ads performance agency</p></div></dialog>
<p class="config-error container" data-config-error hidden role="alert">Could not load site configuration. Reload this page or contact the site owner. The form is unavailable.</p>
<noscript><div class="container no-js"><p>Navigation: <a href="google-ads.html">Google Ads</a> · <a href="tracking-automation.html">Tracking</a> · <a href="results.html">Results</a> · <a href="audit.html">Audit</a></p><p>Enable JavaScript to use the form. Contact: <a href="mailto:hello@example.com">hello@example.com</a>.</p></div></noscript>'''
footer = f'''<footer class="footer"><div class="container"><div class="footer-top">{brand}<nav aria-label="Footer navigation"><a href="index.html#services">Services</a><a href="index.html#process">How we work</a><a href="results.html">Results</a><a href="index.html#about">About</a><a data-link="audit" href="audit.html">Contact</a></nav></div><div class="footer-bottom"><p>© <span data-year>2026</span> <span data-brand="name">SIGNAL</span>. <span data-content="footer">Independent Google Ads performance agency.</span></p><div><a data-email href="mailto:hello@example.com">hello@example.com</a><a data-link="privacy" href="privacy.html">Privacy</a><a data-link="terms" href="terms.html">Terms</a></div></div></div></footer>'''

def page(filename, title, content, css, script='', draft=False):
    scripts = '<script type="module" src="js/main.js"></script>' + (f'<script type="module" src="js/{script}.js"></script>' if script else '')
    text = f'''<!doctype html>
<html lang="en" data-page-title="{escape(title)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{escape(title)}. Google Ads management, measurement and automation built around your business goals.">{'<meta name="robots" content="noindex">' if draft else ''}<title>{escape(title)} | SIGNAL</title><link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/components.css"><link rel="stylesheet" href="css/pages/{css}.css">{scripts}</head>
<body class="page-{css}">{header}<main id="main">{content}</main>{footer}</body></html>'''
    text=text.replace(scripts, '<link rel="preload" href="assets/fonts/Inter.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="css/visuals.css">'+scripts)
    if css=='home':
        text=text.replace(scripts,'<link rel="stylesheet" href="css/pages/home-expanded.css">'+scripts)
    if css in ['google-ads','tracking']:
        text=text.replace(scripts,'<link rel="stylesheet" href="css/pages/service-expanded.css">'+scripts)
    (WEB / filename).write_text(text, encoding='utf-8')

def section(id, body, cls=''):
    return f'<section id="{id}" class="section {cls}"><div class="container">{body}</div></section>'
def raster(name, alt, cls='', eager=False):
    return f'<figure class="generated-visual {cls}"><img src="assets/images/{name}.webp" width="1536" height="1024" alt="{escape(alt)}" loading="{"eager" if eager else "lazy"}" decoding="async" {"fetchpriority=high" if eager else ""}></figure>'
def heading(title, desc=''):
    return f'<div class="section-heading"><h2>{title}</h2>{f"<p>{desc}</p>" if desc else ""}</div>'
def card(title, desc, ico, color='blue', link=None, bullets=None, id=None):
    return f'''<article class="card content-card {color}" {f'id="{id}"' if id else ''}>{icon(ico,color)}<div class="card-copy"><h3>{title}</h3><p>{desc}</p>{'<ul class="check-list">'+''.join(f'<li>{x}</li>' for x in bullets)+'</ul>' if bullets else ''}{f'<a class="text-link" href="{link}">Learn more {arrow}</a>' if link else ''}</div></article>'''

steps = [('Audit','We review your account, measurement and goals.'),('Strategy','We build a tailored plan around your audience and business priorities.'),('Setup &amp; Launch','We connect the signals and get your campaigns live.'),('Optimize','We test, learn and refine with useful performance data.'),('Scale','We expand what works and investigate new opportunities.')]
def process(title, values=steps, id='process', cls='', description='', symbols=None):
    colors=['blue','red','yellow','green','blue']
    items=''
    for i,(t,d) in enumerate(values):
        art=f'<span class="process-symbol">{icon(symbols[i],colors[i])}</span>' if symbols else ''
        if id in ['setup','next']:
            items+=f'<li class="{colors[i]} illustrated-step">{art}<div class="step-copy"><h3><span class="step-number">{i+1}</span>{t}</h3><p>{d}</p></div></li>'
        else:
            items+=f'<li class="{colors[i]}"><span class="step-number">{i+1}</span><div><h3>{t}</h3><p>{d}</p>{art}</div></li>'
    return section(id,heading(title,description)+f'<ol class="process-list count-{len(values)}">{items}</ol>',cls)

faq_answers={
'audit':('What does the free audit cover?','We review account structure, measurement gaps and opportunities to investigate.'),
'access':('Do you need account access?','We discuss the access needed for the agreed review. Never share passwords in the form.'),
'next':('What happens after the audit?','We review your request, clarify goals and agree on the next useful step.'),
'budget':('Is there a minimum budget?','The right approach depends on your goals, market and available budget. We discuss fit first.'),
'campaigns':('How do you choose the right campaigns for my business?','We select campaigns around buying intent, product data and measurable business goals.'),
'existing':('Can you work with our existing Google Ads account?','We can review the existing structure before proposing changes.'),
'success':('How do you measure success?','We agree on meaningful conversions and review the available business outcomes.'),
'crm':('Will this work with my existing CRM?','We review your tools and available data before recommending an integration.'),
'offline':('Do you set up offline conversions?','We assess the available identifiers, permissions and business workflow first.'),
'timing':('How long does setup take?','Timing depends on your tools, access and the complexity of the agreed setup.')}
def faq(keys, first=False, title='Frequently asked questions.', intro='Quick answers to common questions about working with <span data-brand="name">SIGNAL</span>.'):
    rows=''.join(f'<details {"open" if i==0 and first else ""}><summary>{faq_answers[k][0]}{chevron}</summary><p>{faq_answers[k][1]}</p></details>' for i,k in enumerate(keys))
    return section('faq',f'<div class="faq-layout">{heading(title,intro)}<div class="faq-items">{rows}</div></div>','faq')
def final(title, tracking=False):
    description='Get a free, no-obligation audit of your tracking and automation setup.' if tracking else 'Get a free, no-obligation audit of your Google Ads account.'
    return section('final-cta',f'<div class="cta-panel"><div><h2>{title}</h2><p>{description}<br>We’ll review your setup, find opportunities and share practical next steps.</p></div><div class="cta-decor" aria-hidden="true"><i></i><i></i><i></i></div>{cta(tracking)}</div>','final-cta')
def flow(items, cls=''):
    return f'<ol class="flow {cls}">'+''.join(f'<li>{icon(ico,color)}<div><strong>{title}</strong><p>{desc}</p></div></li>' for title,desc,ico,color in items)+'</ol>'

bars = '<div class="growth-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div>'
lines = '<span class="art-lines" aria-hidden="true"><i></i><i></i></span>'
ad_art = f'<div class="ad-example"><small>Sponsored · Example ad</small><strong>Find exactly what you need</strong>{lines}<span class="ad-label">Search that connects</span></div>'
product_art = f'<div class="product-example">{icon("spark","yellow")}<div><strong>The right campaign mix</strong><small>Search · Shopping · Video</small>{lines}</div></div>'
home_art = f'''<div class="search-scene" aria-label="Illustration of a search becoming a qualified lead"><div class="search-bar">{icon('search')}<span>Your next customer starts here</span><i aria-hidden="true"></i></div><div class="scene-tile ad-tile blue">{ad_art}</div><div class="scene-tile lead-tile green">{icon('contact','green')}<div><strong>Qualified lead</strong>{lines}</div></div><div class="scene-tile product-tile yellow">{product_art}</div><div class="scene-tile growth-tile"><strong>Growth you can measure</strong>{bars}</div><span class="scene-dot dot-one" aria-hidden="true"></span><span class="scene-dot dot-two" aria-hidden="true"></span><span class="scene-arc" aria-hidden="true"></span></div>'''
home = section('hero',f'''<div class="hero-copy"><p class="eyebrow">Google Ads performance agency</p><h1 data-content="heroTitle" data-title-first="Make every search" data-title-second="a new " data-title-accent="opportunity.">Make every search<br>a new <span class="accent">opportunity.</span></h1><p data-content="heroDescription">Connect your campaigns, customer data and business goals. Grow with Google Ads that work harder for you.</p><div class="hero-actions">{cta()}<a class="button secondary" href="#services">Explore services</a></div></div>{home_art}''','hero')
home += section('services',heading('The right Google Ads mix for your goals.','We build and manage campaigns around how your customers search, shop and discover.')+'<div class="grid grid-four service-grid">'+card('Search','Capture high-intent demand when it matters most.','search',link='google-ads.html#search-pmax')+card('Performance Max','Explore opportunities across Google’s channels.','spark','yellow','google-ads.html#search-pmax')+card('Shopping','Show your products to ready-to-buy customers.','bag','green','google-ads.html#shopping')+card('YouTube &amp; Demand Gen','Build awareness and demand with engaging creative.','video','red','google-ads.html#video')+'</div><p class="service-note">Growing a mobile app? Explore <a href="google-ads.html#apps">App campaigns</a>.</p>','tinted')
measurement = flow([('Ad click','People find your business.','cursor','blue'),('Qualified lead','Connect enquiries to quality.','contact','green'),('Sale','Track business outcomes.','bag','yellow')])
home += section('measurement',f'<div class="panel split"><div><h2>Better signals.<br>Smarter decisions.</h2><p>We review conversion tracking, connect available CRM signals and feed customer outcomes back into Google Ads. Make decisions around what matters to your business.</p><a class="text-link" href="tracking-automation.html">Explore tracking &amp; analytics {arrow}</a></div><div>{measurement}<p class="caption">Bring business outcomes back into your campaigns.</p></div></div>','measurement')
home += process('A clear process, from audit to growth.',description='A clear approach to getting more from your Google Ads, with practical steps and transparent communication.')
audiences=[('Ecommerce','cart','green'),('Lead generation','group','red'),('B2B &amp; SaaS','building','yellow'),('Mobile apps','mobile','blue')]
home += section('about','<div class="panel split"><div><h2>Built around your business.</h2><p><span data-brand="name">SIGNAL</span> combines Google Ads management, measurement and automation around your business goals.</p></div><ul class="audiences">'+''.join(f'<li>{icon(ico,col)}<strong>{t}</strong></li>' for t,ico,col in audiences)+'</ul></div>','about')
home += faq(['audit','access','next'],True)+final('Ready for a clearer growth plan?')

browser_art = f'<div class="browser-scene" aria-label="Search, Shopping, Video and App campaign illustration"><div class="browser-card"><div class="browser-chrome" aria-hidden="true"><i></i><i></i><i></i></div><div class="browser-search">{icon("search")}<span>Reach your next customer</span></div>{ad_art}<div class="browser-channels">'+''.join(f'<div>{icon(i,c)}<small>{t}</small></div>' for t,i,c in [('Search','search','blue'),('Shopping','bag','green'),('Video','video','red'),('Apps','phone','yellow')])+'</div></div></div>'
def service_hero(title, description, label, art, tracking=False):
    actions=cta(tracking) if tracking else f'<div class="service-actions">{cta()}<a class="button secondary" data-link="audit" href="audit.html">Talk to our team</a></div><ul class="hero-promises"><li>Strategic campaign planning</li><li>Transparent reporting</li><li>Built around your growth</li></ul>'
    return section('hero',f'<div class="service-hero"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html#services">Services</a><span aria-hidden="true">/</span><span>{label}</span></nav><h1>{title}</h1><p class="hero-description">{description}</p>{actions}</div>{art}</div>','hero')
ads = service_hero('The right campaign mix.<br>Built around <span class="accent">your goals.</span>','Strategic Google Ads management built around your audience, data and commercial goals.','Google Ads',browser_art)
channels = [('search-pmax','Search &amp; Performance Max','Capture high-intent demand and explore relevant audiences across Google.','search','blue',['Campaign structure','Audiences, assets and bidding','Budget allocation and search terms']),('shopping','Shopping &amp; feed strategy','Connect product data to the customers ready to buy.','bag','green',['Merchant Center diagnostics','Feed segmentation and attributes','Product-level profitability']),('video','Demand Gen &amp; video','Build awareness with YouTube, Display and engaging creative.','video','red',['Creative testing','Remarketing','Assisted outcomes']),('apps','App campaigns','Plan acquisition around meaningful activity in your app.','phone','yellow',['Installs and engagement','In-app event validation','Value-based evaluation'])]
ads += section('channels',heading('Four ways to reach your next customer.','Different goals call for different approaches. We build the campaign mix around your business.')+'<div class="grid grid-two channel-grid">'+''.join(card(t,d,i,c,bullets=b,id=id) for id,t,d,i,c,b in channels)+'</div>','tinted')
ads += process('From campaign setup to measurable growth.',cls='tinted detailed-process',description='A clear process to plan, launch and continually improve your Google Ads.',symbols=['report','target','spark','chart','cursor'])
ads += '<div class="outcomes-faq">'+section('outcomes',heading('Built around the right outcome.','Qualified leads and ecommerce sales require different signals. We tailor Google Ads to what success looks like for your business.')+'<div class="grid grid-two">'+card('More qualified leads','Reach people with buying intent and connect enquiries to useful CRM feedback.','contact','blue',bullets=['Target high-intent audiences','Review lead quality with your CRM'])+card('More ecommerce sales','Connect product feeds, purchases and revenue quality to campaign decisions.','bag','green',bullets=['Optimize product feeds','Measure purchases and value'])+'</div>')+faq(['campaigns','existing','success'],intro='Straight answers about our Google Ads management service.')+'</div>'+final('Ready to grow with Google Ads?')

tracking_flow = '<div class="panel feedback-scene">'+flow([('Google Ads','Campaigns drive traffic.','search','blue'),('Website','Visitors take action.','cursor','red'),('CRM','Leads and customers.','contact','green'),('Revenue','Business impact.','bag','yellow')],'four-nodes')+'<p class="feedback-caption">Business outcomes inform the next campaign decision.</p></div>'
tracking = service_hero('Turn better data into <span class="accent">better decisions.</span>','Connect conversion tracking, CRM feedback and revenue signals. Use marketing automation to get more from Google Ads.','Tracking &amp; automation',tracking_flow,True)
tracking += section('capabilities',heading('Know what happens after the click.','A clearer view from ad click to business outcome.')+'<div class="grid grid-three capability-grid">'+card('Conversion tracking','GA4/GTM and call tracking help measure the actions that matter.','cursor')+card('Lead quality','Review CRM integration and offline conversions to understand which leads turn into customers.','contact','green')+card('Revenue attribution','Connect revenue tracking and attribution to commercial decisions.','bag','yellow')+'</div>','tinted')
tracking += section('automation','<div class="panel yellow-panel automation-layout"><div><h2>Less manual work.<br>More useful signals.</h2><p>Use automation to keep data useful and make time for decisions.</p></div><div class="grid grid-two automation-grid">'+card('Reporting','Scheduled reporting with the information your team needs.','chart')+card('Campaign alerts','Spend and anomaly alerts that flag changes worth investigating.','bell','red')+card('CRM feedback','Qualified-lead feedback for better campaign evaluation.','contact','green')+card('Product feed checks','Feed diagnostics to identify missing or inconsistent product data.','bag','yellow')+'</div><p class="ai-note">'+icon('spark')+'AI assists analysis. People review decisions.</p></div>')
tracking += process('A clear setup, step by step.',[('Audit','Review your goals, tools and current tracking.'),('Map','Define meaningful events and how they flow through your funnel.'),('Connect','Implement the agreed tracking and CRM integrations.'),('Validate','Test events and check that the data matches the intended actions.')],'setup','tinted detailed-process',description='We handle the technical setup and validate the signals your business needs.',symbols=['search','report','crm','target'])+faq(['crm','offline','timing'],True,intro='Quick answers about tracking, automation and integrations.')+final('Ready for clearer data?',True)

def narrative(values):
    return '<div class="narrative">'+''.join(f'<div>{icon(ico,col)}<h3>{t}</h3><p>{d}</p></div>' for t,d,ico,col in zip(['Challenge','Strategy','Result'],values,['warning','idea','chart'],['red','yellow','green']))+'</div>'
results = section('hero','<div class="results-hero"><div><p class="eyebrow">Case studies</p><h1>See the decisions<br>behind <span class="accent">the results.</span></h1><p>Examples of how we structure a case study: the challenge, the thinking and the signals behind a decision.</p><p class="notice">Illustrative case studies — replace with approved client results.</p></div><div class="results-art" aria-hidden="true"><strong>More than<br>just clicks.</strong>'+bars+'</div></div>','hero')
results += section('filters','<h2 class="sr-only">Filter case studies</h2><div class="filter-buttons" data-case-filters hidden>'+''.join(f'<button type="button" data-filter="{key}" aria-pressed="{str(key=="all").lower()}">{label}</button>' for key,label in [('all','All'),('ecommerce','Ecommerce'),('leads','Lead generation'),('saas','B2B &amp; SaaS')])+'</div><p class="sr-only" role="status" data-filter-status></p>','filters')
case_data=[('ecommerce','Ecommerce','Scaling a product portfolio with clearer profit signals.',['Inconsistent product performance and limited visibility made campaign priorities difficult to identify.','Restructure campaigns, improve product feed signals and connect revenue quality to bidding decisions.','Clearer product-level decisions, with a more useful view of spend and commercial outcomes.']),('leads','Lead generation','Turning enquiries into qualified opportunities.',['High enquiry volume with uncertain lead quality made it difficult to identify valuable opportunities.','Connect CRM feedback with a review of buying intent, audience targeting and campaign messaging.','Clearer qualification signals and a more useful view of which enquiries progress through the pipeline.']),('saas','B2B &amp; SaaS','Connecting demo requests to pipeline.',['Demo requests were disconnected from pipeline, making campaign quality difficult to evaluate.','Align campaign intent with CRM stages and review the journey from demo request to opportunity.','More useful pipeline feedback and a clearer connection between advertising decisions and sales activity.'])]
case_intros={'ecommerce':'An example of an ecommerce business prioritizing products, managing spend and evaluating growth across its portfolio.','leads':'An example of a service business seeking a more consistent flow of high-quality opportunities from its enquiries.','saas':'An example of a B2B SaaS business connecting demo requests to meaningful progress through its sales pipeline.'}
cases=''
for cat,label,title,values in case_data:
    art = raster('reference-campaign-art' if cat=='ecommerce' else 'reference-lead-art', 'Illustration of '+('a campaign across search, shopping, video and apps' if cat=='ecommerce' else 'a qualified contact'),'case-art')
    if cat=='ecommerce':
        art=f'<div class="case-art portfolio-art" role="img" aria-label="Shopping campaigns connected to a product feed"><div class="portfolio-window"><div class="portfolio-chrome" aria-hidden="true"><i></i><i></i><i></i></div><div class="portfolio-content"><div class="portfolio-products">{icon("bag","green")}<div class="portfolio-thumbnails">{icon("cart","green")}{icon("sale","yellow")}{icon("bag","green")}</div></div><div class="portfolio-label"><strong>Shopping</strong><span>Product feed</span>{lines}<span class="portfolio-marker" aria-hidden="true"></span></div></div></div></div>'
    metrics = '<div class="case-metrics"><p class="caption">Illustrative data</p><dl>'+''.join(f'<div><dt>{label}</dt><dd>{value}</dd></div>' for label,value in [('Revenue','+38%'),('ROAS','5.4x'),('CPA','−19%')])+'</dl><p class="caption">Example figures only; no client, period or measured baseline is represented.</p></div>' if cat=='ecommerce' else ''
    cases += f'<article id="case-{cat}" class="case-card {"featured" if cat=="ecommerce" else "compact-case"}" data-category="{cat}" data-illustrative><div class="case-intro"><p class="case-tags"><span>Illustrative case study</span><span>{label}</span></p><h2>{title}</h2><p>{case_intros[cat]}</p></div>{art}{narrative(values)}{metrics}</article>'
results += '<div class="container case-list">'+cases+'<p class="card" data-cases-empty hidden>Approved case studies will be added here.</p></div>'
results += section('method','<div class="panel method-layout"><div><h2>How we read performance.</h2><p>Start with the business question, then examine the evidence.</p></div><div class="grid grid-three">'+card('Business context','Goals, market and customer journey.','search')+card('Verified signals','Connect and validate the data that matters.','chart','yellow')+card('Commercial outcomes','Translate performance into useful next steps.','check','green')+'</div></div>')+final('Want a clearer view of your account?')

demo = (ROOT/'starter/form-demo.html').read_text(encoding='utf-8')
form = '<form'+demo.split('<form',1)[1].split('</form>',1)[0]+'</form>'
form=form.replace('class="card" data-audit-form','id="audit-form" class="card" data-audit-form aria-labelledby="form-title"').replace('<h2>Request','<h2 id="form-title">Request')
form=form.replace('id="name" name="name"','id="name" name="name" placeholder="Your name"').replace('id="email" name="email"','id="email" name="email" placeholder="you@company.com"').replace('id="company" name="company"','id="company" name="company" placeholder="Your company name"').replace('id="message" name="message"','id="message" name="message" placeholder="Tell us about your goals, challenges or any specific questions…"')
form=form.replace('data-options="businessTypes"','data-options="businessTypes" data-placeholder="Select business type"').replace('data-options="budgets"','data-options="budgets" data-placeholder="Select budget range"')
audit = section('intro','<div class="audit-layout"><div class="audit-copy"><p class="eyebrow">Free Google Ads audit</p><h1>Let’s find your next growth <span class="accent">opportunity.</span></h1><p>Tell us about your business. We will review your goals and the next useful steps.</p><div class="benefits">'+card('Account structure','Review campaign structure and targeting for opportunities.','search')+card('Conversion tracking','Check how your setup measures meaningful actions.','chart','yellow')+card('Growth opportunities','Investigate keywords, audiences and campaign types.','spark','green')+'</div><p class="assurance">No changes to your account without agreement.</p><p>Questions? <a data-email href="mailto:hello@example.com">hello@example.com</a></p></div>'+form+'</div>','intro')
audit += process('What happens next?',[('Review your request','We review your information, business and goals.'),('Discuss access and goals','We clarify priorities and discuss the access needed for the agreed review.'),('Agree on next steps','We agree on practical recommendations and the next useful step.')],'next','tinted',description='A simple process to get you from insights to action.',symbols=['cursor','contact','report'])+faq(['access','budget'],title='Before you submit',intro='Quick answers to common questions about our free audit.')

# Preserve the approved compositions. Generated raster art replaces only the small illustrations.
ads=ads.replace(browser_art,raster('reference-campaign-art','Search, Shopping, Video and App campaign illustration.','campaign-generated-hero',True))
ads=ads.replace('</ul></div></article>',f'</ul><a class="text-link" data-link="audit" href="audit.html">Discuss your campaigns {arrow}</a></div></article>',4)
tracking=tracking.replace('</p></div></article>',f'</p><a class="text-link" data-tracking-link href="audit.html?need=tracking">Review my tracking {arrow}</a></div></article>',3)
results=results.replace('<strong>More than<br>just clicks.</strong>'+bars,'<div><strong>More than<br>just clicks.</strong><p>Strategy, data and execution that drive growth.</p></div>'+icon('chart','yellow'))
# The homepage copy and ordering remain static and accessible; generated icons provide the artwork.
home=home.replace('<strong>Growth you can measure</strong>'+bars,'<strong>Growth you can measure</strong><span class="growth-image">'+icon('chart','yellow')+'</span>')
home=home.replace('We build and manage campaigns around how your customers search, shop and discover.','We build and manage Google Ads strategies that fit your business, combining the right campaign types to reach, convert and grow your most valuable customers.')
home=home.replace('The right Google Ads mix for your goals.','The right Google Ads mix<br class="desktop-break"> for your goals.')
home=home.replace(icon('bag','yellow'),icon('sale','yellow'))
tracking=tracking.replace(icon('bag','yellow'),icon('sale','yellow')).replace("A clearer view from ad click to business outcome.",'Get a clearer view from ad click to revenue, with conversion tracking and CRM feedback to support smarter decisions.')
tracking=tracking.replace("Use automation to keep data useful and make time for decisions.",'Use automation to keep data accurate, flag opportunities and save time for decisions.')
tracking=tracking.replace(icon('chart','blue'),icon('report','blue'))
tracking=tracking.replace(icon('cursor','red')+'<div><strong>Website',icon('browser','blue')+'<div><strong>Website')
tracking=tracking.replace(icon('sale','yellow')+'<div class="card-copy"><h3>Product feed checks',icon('gear','yellow')+'<div class="card-copy"><h3>Product feed checks')
tracking=tracking.replace(icon('crm','yellow'),icon('link','green'))
audit=audit.replace(icon('spark','green'),icon('bulb','green')).replace(icon('report','yellow'),icon('document','blue'))
results=results.replace('Start with the business question, then examine the evidence.','Look beyond surface metrics to understand what drives results, connect the evidence and make better-informed growth decisions.')
home=home.replace('<div class="section-heading"><h2>A clear process, from audit to growth.</h2></div>',heading('A clear process, from audit to growth.','A clear approach to planning, testing and learning, with transparent communication at every step.'))
home=expand_home(home,section,heading,icon,arrow,cta,raster,faq)
ads,tracking=expand_services(ads,tracking,section,heading,icon,arrow,cta,raster,faq)
for filename,title,body,css,script in [('index.html','Google Ads Performance Agency',home,'home',''),('google-ads.html','Google Ads Management',ads,'google-ads',''),('tracking-automation.html','Tracking & Automation',tracking,'tracking',''),('results.html','Case Studies',results,'results','results'),('audit.html','Free Google Ads audit',audit,'audit','form')]:
    page(filename,title,body,css,script)
for filename,title in [('privacy.html','Privacy notice'),('terms.html','Terms of use')]:
    legal=f'<div class="legal-copy"><h1>{title}</h1><p class="notice"><strong>Draft — approved company text is required before launch.</strong></p><p>This is a placeholder, not a complete policy or contract.</p><h2>Company details</h2><p><span data-brand="legalName">Your registered company name</span><br><span data-brand="address">Your business address</span></p><p>Contact: <a data-email href="mailto:hello@example.com">hello@example.com</a></p>'
    if filename=='privacy.html':
        legal+='<h2>Current form behaviour</h2><p>The audit form uses a technical session cookie for CSRF protection. Submitted fields are processed by the server and sent to the configured recipient. No advertising or analytics scripts are enabled by default.</p><p>The owner must approve a complete notice describing the actual company, processors, retention periods and applicable rights before launch.</p>'
    legal+='<a href="audit.html">Back to the audit form</a></div>'
    page(filename,title,section('legal',legal),'audit',draft=True)
print('Generated five pages and two legal drafts in web/.')
