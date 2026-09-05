"""Additional homepage content requested after the initial reference implementation."""

def expand_home(home, section, heading, icon, arrow, cta, raster, faq):
    def insert_before(anchor, content):
        nonlocal home
        marker=f'<section id="{anchor}"'
        assert home.count(marker)==1, f'Missing or duplicated home anchor: {anchor}'
        home=home.replace(marker,content+marker,1)

    management_items=[
        ('Account structure & budget','Separate buying intent, markets and product priorities. Give each campaign a clear role and decide where the next part of your budget belongs.','search','blue'),
        ('Ads, assets & landing pages','Review the message from search to enquiry. Plan creative tests and identify landing-page changes that could help visitors take the next step.','cursor','red'),
        ('Products, audiences & signals','Connect feed quality, audience insights and conversion goals so your campaign setup reflects what your business actually sells.','bag','green'),
        ('Ongoing testing & optimisation','Review search terms, bids and budget allocation. Record what changed, evaluate the available evidence and use it to plan the next test.','target','yellow')
    ]
    rows=''.join(f'<article class="management-row {color}">{icon(ico,color)}<div><h3>{title}</h3><p>{copy}</p></div></article>' for title,copy,ico,color in management_items)
    insert_before('measurement',section('management',f'''<div class="home-management"><div class="management-intro"><p class="eyebrow">Google Ads management</p><h2>A complete account.<br>A clear direction.</h2><p>Good campaign management connects the details: who you reach, what they see, where they land and how you measure the response.</p><p>Whether you are launching a new account or reviewing an existing one, we start with your commercial priorities and build a plan around them.</p><a class="text-link" href="google-ads.html">Explore Google Ads management {arrow}</a><div class="management-note">{icon('document')}<p><strong>From plan to practical work</strong><br>Campaign structure, creative priorities, measurement checks and a clear sequence of tests.</p></div></div><div class="management-rows">{rows}</div></div>''','home-expanded'))

    automation_items=[
        ('Reporting that answers a question','Bring spend, conversions and available revenue data into a review your team can use.','report','blue'),
        ('Changes worth investigating','Use budget and anomaly alerts to flag unusual patterns for a closer look.','bell','red'),
        ('Lead quality from your CRM','Feed qualification stages and offline outcomes into campaign evaluation where your tools support it.','contact','green'),
        ('Product feed checks','Identify missing attributes and feed issues before they become recurring manual work.','gear','yellow')
    ]
    automation=''.join(f'<article class="home-automation-card {color}">{icon(ico,color)}<h3>{title}</h3><p>{copy}</p></article>' for title,copy,ico,color in automation_items)
    insert_before('process',section('automation-home',f'''<div class="home-automation-panel"><div class="section-heading"><div><p class="eyebrow">Tracking &amp; automation</p><h2>Less manual work.<br>More time to act.</h2></div><p>A report is useful when it helps you decide what to do next. We connect the repeatable parts of measurement and reporting so your team can spend more time on decisions.</p></div><div class="home-automation-grid">{automation}</div><div class="automation-bottom"><p>{icon('spark','yellow')}<span>AI assists analysis. People review decisions.</span></p><a class="text-link" href="tracking-automation.html">Explore tracking &amp; automation {arrow}</a></div></div>''','home-expanded'))

    examples=f'''{heading('The thinking behind better performance.','Explore the questions, campaign decisions and measurement work behind two example business scenarios. These are illustrative approaches, not client results.')}<div class="home-examples-grid"><article class="home-example"><div class="example-top blue">{icon('cart','green')}<div><span class="example-label">Illustrative approach · Ecommerce</span><h3>Find the products worth prioritising.</h3></div></div><p>A growing catalogue can hide uneven product performance. The useful question is where your spend creates value across the range.</p><dl><div><dt>What we review</dt><dd>Feed quality, product groups, margins and the purchase signals available to your account.</dd></div><div><dt>How we approach it</dt><dd>Review segmentation and budget allocation, then connect campaign decisions to product-level outcomes.</dd></div></dl><a class="text-link" href="results.html#case-ecommerce">Explore the ecommerce example {arrow}</a></article><article class="home-example"><div class="example-top green">{icon('contact','green')}<div><span class="example-label">Illustrative approach · Lead generation</span><h3>Understand which enquiries become opportunities.</h3></div></div><p>A low cost per form submission tells only part of the story. Sales feedback helps show which enquiries are relevant to your business.</p><dl><div><dt>What we review</dt><dd>Search intent, enquiry sources, qualification stages and available CRM feedback.</dd></div><div><dt>How we approach it</dt><dd>Connect campaign activity to lead quality and use that evidence to refine targeting and messaging.</dd></div></dl><a class="text-link" href="results.html#case-leads">Explore the lead generation example {arrow}</a></article></div><div class="examples-bottom"><p>Longer sales cycle? See how the same thinking applies to demo requests and pipeline.</p><a class="text-link" href="results.html#case-saas">View the B2B &amp; SaaS example {arrow}</a></div>'''
    examples_section=section('work-examples',examples,'home-expanded').replace('id="work-examples"','id="work-examples" data-illustrative',1)
    insert_before('about',examples_section)

    partnership=f'''<div class="home-partnership"><div><p class="eyebrow">Working together</p><h2>Know what changed.<br>Understand what comes next.</h2><p>You should be able to connect the work in your account to the priorities of your business. Clear reporting and a shared plan keep that conversation practical.</p><a class="text-link" href="index.html#process">See how we work {arrow}</a></div><ol class="partnership-list"><li><span>01</span><div><h3>Performance in context</h3><p>Review results alongside your budget, seasonality and sales cycle. Distinguish a useful signal from a short-term fluctuation.</p></div></li><li><span>02</span><div><h3>A record of the work</h3><p>Understand the tests, account changes and measurement checks behind the report, including what still needs more evidence.</p></div></li><li><span>03</span><div><h3>Priorities for the next step</h3><p>Agree which opportunities to investigate, what is needed from your team and how the next decision will be evaluated.</p></div></li></ol></div>'''
    insert_before('faq',section('partnership',partnership,'home-expanded'))

    audit_preview=f'''<div class="home-audit-panel"><div class="audit-preview-copy"><p class="eyebrow">Your starting point</p><h2>A useful first step.<br>A clearer plan for your account.</h2><p>The free audit starts with your business goals and current setup. We look for account issues, measurement gaps and opportunities that deserve a closer review.</p><ul class="audit-scope"><li>Tell us what you sell and what you want to improve.</li><li>We discuss the access needed for the agreed review.</li><li>Use the findings to decide on practical next steps.</li></ul>{cta()}<p class="audit-preview-note">No changes to your account without agreement.</p></div><div class="audit-roadmap"><div class="roadmap-heading">{icon('document')}<div><span>What the review covers</span><h3>Your audit roadmap</h3></div></div><ol><li><span class="blue">01</span><div><strong>Account structure</strong><p>Campaign roles, targeting, search terms and budget priorities.</p></div></li><li><span class="yellow">02</span><div><strong>Measurement gaps</strong><p>Conversion actions, available data and the journey after the click.</p></div></li><li><span class="green">03</span><div><strong>Opportunity shortlist</strong><p>Questions to investigate, tests to consider and the next useful steps.</p></div></li></ol></div></div>'''
    insert_before('faq',section('audit-preview',audit_preview,'home-expanded'))

    descriptions={
        'Capture high-intent demand when it matters most.':'Reach people actively looking for your products or services. Build around relevant search intent, clear ad messages and meaningful conversions.',
        'Explore opportunities across Google’s channels.':'Connect your goals, creative assets and audience signals across Google’s channels. Evaluate the mix through the outcomes that matter to your business.',
        'Show your products to ready-to-buy customers.':'Put your product range in front of shoppers. Give feed quality, product priorities and purchase value a clear role in campaign decisions.',
        'Build awareness and demand with engaging creative.':'Introduce your offer to relevant audiences through YouTube, Display and Demand Gen. Test creative ideas and understand their role in the customer journey.'
    }
    for short,long in descriptions.items():
        home=home.replace(short,long,1)

    audience_data=[('Ecommerce','cart','green','Connect product feeds, purchase value and margin priorities to the way you allocate campaign spend.','Focus: products, purchases & value'),('Lead generation','group','red','Look beyond enquiry volume. Use buying intent and available sales feedback to understand lead quality.','Focus: enquiries & qualification'),('B2B &amp; SaaS','building','yellow','Account for longer buying journeys and connect demo requests to meaningful stages in your pipeline.','Focus: demos & sales opportunities'),('Mobile apps','mobile','blue','Plan acquisition around installs and useful in-app activity, with event validation before performance evaluation.','Focus: acquisition & engagement')]
    audience_cards=''.join(f'<li class="{color}">{icon(ico,color)}<div><strong>{title}</strong><p>{copy}</p><span>{focus}</span></div></li>' for title,ico,color,copy,focus in audience_data)
    old_start=home.index('<section id="about"')
    old_end=home.index('</section>',old_start)+len('</section>')
    about=section('about',f'''<div class="home-audiences-panel">{heading('Built around your business.','The goal, sales cycle and available data shape the way an account should work. SIGNAL combines Google Ads management, measurement and automation around those differences.')}<ul class="audiences audience-details">{audience_cards}</ul></div>''','about home-expanded')
    about=about.replace('SIGNAL combines','<span data-brand="name">SIGNAL</span> combines')
    home=home[:old_start]+about+home[old_end:]

    old_faq_start=home.index('<section id="faq"')
    old_faq_end=home.index('</section>',old_faq_start)+len('</section>')
    home=home[:old_faq_start]+faq(['audit','access','next','existing','budget','crm'],True)+home[old_faq_end:]
    return home
