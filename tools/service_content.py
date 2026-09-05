"""Expanded service narratives and generated illustrations requested by the owner."""

def expand_services(ads, tracking, section, heading, icon, arrow, cta, raster, faq):
    def before(page, marker, content):
        assert page.count(marker)==1, f'Service insertion point missing: {marker}'
        return page.replace(marker,content+marker,1)

    def story(id, eyebrow, title, paragraphs, image, alt, points, reverse=False, link=None):
        copy=''.join(f'<p>{p}</p>' for p in paragraphs)
        bullets='<ul class="service-story-points">'+''.join(f'<li>{p}</li>' for p in points)+'</ul>'
        action=f'<a class="text-link" href="{link[0]}">{link[1]} {arrow}</a>' if link else ''
        return section(id,f'<div class="service-story {"art-first" if reverse else ""}"><div class="service-story-copy"><p class="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy}{bullets}{action}</div>{raster(image,alt,"service-story-art")}</div>','service-expanded')

    strategy=story('campaign-strategy','Start with the business','A campaign mix with<br>a job for every channel.',[
        'Your customer’s intent, your offer and your sales cycle should shape the account. We start by understanding what people are looking for and which actions are valuable to your business.',
        'That gives Search, Shopping, Performance Max and video a clear role. It also gives us a reason for how we group campaigns, allocate budget and decide what to test first.'
    ],'service-campaign-planning','Campaign planner connecting business goals, Search, Shopping, Video and budget priorities.',[
        '<strong>Define the goal.</strong> Agree on the conversion and the commercial context behind it.',
        '<strong>Map the demand.</strong> Review search intent, audiences, markets and product priorities.',
        '<strong>Choose the mix.</strong> Build a plan around the signals and creative assets available.'
    ],reverse=True,link=('#channels','Explore the campaign types'))
    ads=before(ads,'<section id="channels"',strategy)

    deliverables=[
        ('Plan the account','An account structure that reflects your products, services and commercial priorities.','document','blue',['Campaign roles and market segmentation','Keyword themes and negative-keyword review','Budget priorities and measurement requirements']),
        ('Build the foundations','The assets and configuration needed to put the agreed strategy into practice.','gear','yellow',['Ad copy and creative asset requirements','Audience signals and product feed checks','Conversion goals and launch validation']),
        ('Keep improving','A repeatable cycle of review, testing and decisions grounded in the available evidence.','target','green',['Search terms, bids and budget allocation','Creative tests and landing-page recommendations','Performance context and next-step priorities'])
    ]
    cards=''.join(f'<article class="service-scope-card {color}">{icon(ico,color)}<h3>{title}</h3><p>{copy}</p><ul>'+''.join(f'<li>{point}</li>' for point in points)+'</ul></article>' for title,copy,ico,color,points in deliverables)
    ads=before(ads,'<section id="process"',section('account-deliverables',f'<div class="service-scope-panel">{heading("What goes into managing your account.","A clear scope connects the strategy to the day-to-day work. We agree on priorities, access and responsibilities before implementation.")}<div class="service-scope-grid">{cards}</div><p class="scope-note">Starting with an existing account? We review the current setup and discuss proposed changes before making them.</p></div>','service-expanded'))

    creative=story('creative-testing','Ads &amp; landing pages','A good click needs<br>a clear next step.',[
        'An ad sets an expectation. Your landing page needs to carry that message through to the product, enquiry or offer the visitor came to see.',
        'We review the journey as a whole: relevance, message, creative assets and conversion friction. Each test starts with a question, so the result can inform a useful next decision.'
    ],'service-creative-testing','Two advertising messages connected to a landing page as part of a creative testing plan.',[
        '<strong>Message match:</strong> connect the search or audience need to a relevant offer.',
        '<strong>Creative coverage:</strong> identify the copy, images and video assets the campaign needs.',
        '<strong>Test priorities:</strong> document a hypothesis and agree how to evaluate it.'
    ],link=('audit.html','Discuss your campaign priorities'))
    ads=before(ads,'<div class="outcomes-faq">',creative)

    measurement=f'''{heading('Know what the numbers mean.','A useful review connects platform performance to your business model. We agree on the definition of success before interpreting the results.')}<div class="service-review-table" role="table" aria-label="Performance review by business goal"><div class="review-table-head" role="row"><span role="columnheader">Business goal</span><span role="columnheader">What we look at</span><span role="columnheader">Context that matters</span></div><div class="review-table-row" role="row"><div role="cell">{icon('contact','green')}<h3>Qualified enquiries</h3></div><p role="cell">Enquiry sources, qualification stages and cost per meaningful lead.</p><p role="cell">Sales feedback, response process and the quality of the available CRM data.</p></div><div class="review-table-row" role="row"><div role="cell">{icon('bag','green')}<h3>Ecommerce value</h3></div><p role="cell">Purchase value, product performance and return on advertising spend.</p><p role="cell">Margins, returns, stock availability and differences across the product range.</p></div><div class="review-table-row" role="row"><div role="cell">{icon('building','yellow')}<h3>Pipeline progress</h3></div><p role="cell">Demo quality and progress from initial interest to an opportunity.</p><p role="cell">Sales-cycle length, conversion definitions and the attribution window.</p></div></div><div class="service-review-note">{icon('report')}<p><strong>More useful reporting starts with useful measurement.</strong><br>If the data cannot answer the question, the next step may be a tracking review before a campaign change.</p><a class="text-link" href="tracking-automation.html">Explore measurement {arrow}</a></div>'''
    ads=before(ads,'<div class="outcomes-faq">',section('performance-review',measurement,'service-expanded'))

    plan=story('measurement-plan','Measurement strategy','Define the action.<br>Make the signal useful.',[
        'A tracking setup starts with a shared definition of what matters: an enquiry, a connected call, a purchase or a qualified opportunity. Different actions need different measurement rules.',
        'We map the journey, review the existing GA4 and GTM setup, and agree which events should inform reporting and campaign decisions. The aim is a setup your team can understand and validate.'
    ],'service-event-validation','Website form, phone call and purchase events checked in a measurement validation panel.',[
        '<strong>Event definitions:</strong> what triggers an event and what it represents.',
        '<strong>Parameters and value:</strong> the information needed to interpret the action.',
        '<strong>Implementation scope:</strong> tools, access and dependencies to confirm before setup.'
    ],reverse=True,link=('#capabilities','Explore measurement capabilities'))
    tracking=before(tracking,'<section id="capabilities"',plan)

    crm=story('crm-integration','Beyond the form submission','Let sales feedback<br>inform your campaigns.',[
        'An enquiry is the start of a sales journey. Your CRM may hold the information that explains which leads were relevant, which became opportunities and which turned into customers.',
        'We review the stages, identifiers and workflow your tools support. From there, we scope a practical connection between lead quality, offline outcomes and campaign evaluation.'
    ],'service-crm-feedback','CRM stages from new enquiry through qualified lead to customer, with a feedback loop to campaigns.',[
        '<strong>Agree the stages.</strong> Use qualification definitions your sales team can apply consistently.',
        '<strong>Map the records.</strong> Review identifiers, field mappings and how outcomes are updated.',
        '<strong>Validate the feedback.</strong> Test the agreed route before relying on it for decisions.'
    ],link=('audit.html?need=tracking','Review your CRM feedback setup'))
    tracking=before(tracking,'<section id="automation"',crm)

    checks=[
        ('Does the right action fire?','Test the agreed forms, calls and purchase journeys across the relevant pages and devices. Confirm the trigger represents the intended action.','cursor','blue'),
        ('Is the event consistent?','Check missing or duplicate events, required parameters and value handling. Review how the setup behaves with the site’s consent settings.','target','green'),
        ('Can the data be reconciled?','Compare test records across the website, measurement tools and CRM. Document differences and the limits of each data source.','report','yellow')
    ]
    check_cards=''.join(f'<article class="validation-card {color}"><div class="validation-card-top">{icon(ico,color)}<span>Check {i+1:02d}</span></div><h3>{title}</h3><p>{copy}</p></article>' for i,(title,copy,ico,color) in enumerate(checks))
    tracking=before(tracking,'<section id="setup"',section('validation',f'<div class="validation-panel">{heading("A setup is only useful when it is checked.","Validation turns an implementation into something you can review. We document test scenarios, investigate discrepancies and make unresolved questions visible.")}<div class="service-scope-grid">{check_cards}</div><div class="validation-footer">{icon("document")}<p><strong>The output: a record of what was tested.</strong><br>Event definitions, test outcomes, known limitations and the next actions to investigate.</p></div></div>','service-expanded'))

    handover_rows=[('Measurement map','The agreed events, conversion definitions and the role of each data source.'),('Implementation notes','A record of the connections, field mappings and configuration your team needs to understand.'),('Validation findings','What passed the agreed checks, which gaps remain and what further access or work is required.'),('Maintenance priorities','Changes to forms, checkout or CRM stages that should trigger another review.')]
    handover_list=''.join(f'<li><span>{i+1:02d}</span><div><h3>{title}</h3><p>{copy}</p></div></li>' for i,(title,copy) in enumerate(handover_rows))
    tracking=before(tracking,'<section id="faq"',section('handover',f'''<div class="service-handover"><div><p class="eyebrow">Documentation &amp; next steps</p><h2>A setup your team<br>can work with.</h2><p>Measurement should remain understandable after implementation. A clear handover helps your team maintain the setup and recognise when the business or website has changed.</p><p>We agree on ownership of the tools and ongoing responsibilities, then document the work and the next priorities.</p>{cta(True)}</div><ol>{handover_list}</ol></div>''','service-expanded'))

    ad_copy={
        'Capture high-intent demand and explore relevant audiences across Google.':'Capture existing buying intent with Search and explore additional reach with Performance Max. Align campaign structure, assets and bidding with the quality of your conversion signals.',
        'Connect product data to the customers ready to buy.':'Connect a useful product feed to the customers ready to buy. Review Merchant Center issues, product segmentation and the commercial priorities behind your Shopping campaigns.',
        'Build awareness with YouTube, Display and engaging creative.':'Introduce your offer with YouTube, Display and Demand Gen. Plan the creative assets, audiences and remarketing approach around their role in the customer journey.',
        'Plan acquisition around meaningful activity in your app.':'Plan acquisition around installs and meaningful in-app activity. Review event quality and the value of the actions you want to encourage before evaluating campaign performance.'
    }
    for old,new in ad_copy.items():ads=ads.replace(old,new,1)
    tracking_copy={
        'GA4/GTM and call tracking help measure the actions that matter.':'Review GA4/GTM, form events and call tracking to measure the actions that matter. Define triggers, parameters and conversion goals, then validate the agreed journeys.',
        'Review CRM integration and offline conversions to understand which leads turn into customers.':'Review CRM integration and offline conversions to understand which leads turn into customers. Align qualification stages and available sales feedback with your measurement plan.',
        'Connect revenue tracking and attribution to commercial decisions.':'Connect revenue tracking and attribution to commercial decisions. Review transaction value, data sources and the limits of the reporting view before interpreting business outcomes.'
    }
    for old,new in tracking_copy.items():tracking=tracking.replace(old,new,1)

    # Keep approved FAQ answers, while covering the extra questions a service buyer needs.
    def replace_faq(page, keys, first, intro):
        start=page.index('<section id="faq"');end=page.index('</section>',start)+len('</section>')
        return page[:start]+faq(keys,first,intro=intro)+page[end:]
    ads=replace_faq(ads,['campaigns','existing','success','budget','access','next'],False,'Straight answers about campaign planning, account access and the next steps.')
    tracking=replace_faq(tracking,['crm','offline','timing','success','access','next'],True,'Quick answers about tracking, CRM feedback, validation and implementation.')
    # Config continues to own the audit route, including newly added inline links.
    ads=ads.replace('href="audit.html">Discuss your campaign priorities','data-link="audit" href="audit.html">Discuss your campaign priorities')
    tracking=tracking.replace('href="audit.html?need=tracking">Review your CRM feedback setup','data-tracking-link href="audit.html?need=tracking">Review your CRM feedback setup')
    return ads,tracking
