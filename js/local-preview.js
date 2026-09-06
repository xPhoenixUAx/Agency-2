/* Generated from js/app.js; see its rebuild command. */ (() => { const localPreviewScriptURL = document.currentScript.src;
(() => {
  // js/brand.js
  var configURL = new URL("../config/site.json", localPreviewScriptURL);
  var siteLinks = Object.freeze({
    audit: "audit.html",
    privacy: "privacy.html",
    terms: "terms.html",
    cookies: "cookies.html"
  });
  var pageFiles = [
    "index.html",
    "google-ads.html",
    "tracking-automation.html",
    "results.html",
    "audit.html",
    "privacy.html",
    "terms.html",
    "cookies.html"
  ];
  var safeLink = (value) => {
    if (typeof value !== "string" || /[\r\n]/.test(value)) return null;
    try {
      const u = new URL(value, document.baseURI);
      return ["https:", "http:"].includes(u.protocol) ? u.href : null;
    } catch {
      return null;
    }
  };
  function validateConfig(c) {
    if (!c || typeof c !== "object" || Array.isArray(c)) throw new Error("Config must be an object.");
    c = structuredClone(c);
    const trim = (value) => {
      for (const key of Object.keys(value)) {
        if (typeof value[key] === "string") value[key] = value[key].trim();
        else if (value[key] && typeof value[key] === "object") trim(value[key]);
      }
    };
    trim(c);
    for (const key of [
      "name",
      "legalName",
      "email",
      "address",
      "website",
      "description",
      "logo",
      "favicon"
    ]) {
      if (typeof c.brand?.[key] !== "string") throw new Error(`Missing brand.${key}`);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.brand.email)) throw new Error("Invalid contact email.");
    if (c.legal !== void 0) {
      if (!c.legal || typeof c.legal !== "object" || Array.isArray(c.legal))
        throw new Error("Invalid legal settings.");
      for (const [key, value] of Object.entries(c.legal)) {
        if (typeof value !== "string") throw new Error(`Invalid legal.${key}`);
      }
      if (c.legal.privacyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.legal.privacyEmail))
        throw new Error("Invalid privacy email.");
      if (c.legal.updatedOn) {
        const date = /* @__PURE__ */ new Date(`${c.legal.updatedOn}T00:00:00Z`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(c.legal.updatedOn) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== c.legal.updatedOn)
          throw new Error("Use a valid YYYY-MM-DD date for legal.updatedOn.");
      }
      if (c.legal.supervisoryAuthorityUrl && (!/^https?:\/\//i.test(c.legal.supervisoryAuthorityUrl) || !safeLink(c.legal.supervisoryAuthorityUrl)))
        throw new Error("Invalid supervisory authority URL.");
    }
    for (const key of [
      "name",
      "legalName",
      "email",
      "address",
      "website",
      "description",
      "favicon"
    ]) {
      if (!c.brand[key].trim()) throw new Error("Empty brand." + key);
    }
    for (const key of ["logo", "favicon"]) {
      if (c.brand[key] && (!safeLink(c.brand[key]) || /[\x00-\x20\\]/.test(c.brand[key]) || c.brand[key].startsWith("//")))
        throw new Error("Invalid brand." + key);
    }
    let website;
    try {
      website = new URL(c.brand.website);
    } catch {
      throw new Error("Enter a full website URL.");
    }
    if (!["https:", "http:"].includes(website.protocol) || website.username || website.password || website.search || website.hash)
      throw new Error("Website must be an HTTP(S) base URL without credentials, query or fragment.");
    for (const page of pageFiles) {
      if (typeof c.pageTitles?.[page] !== "string" || !c.pageTitles[page].trim())
        throw new Error("Missing pageTitles." + page);
    }
    for (const key of ["recipient", "from", "subject"]) {
      const value = c.mail?.[key];
      if (typeof value !== "string" || /[\r\n]/.test(value)) throw new Error("Invalid mail." + key);
      if (key !== "subject" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        throw new Error("Invalid mail." + key);
    }
    if (!c.mail.subject.trim()) throw new Error("Enter an email subject.");
    for (const key of ["businessTypes", "budgets", "needs"]) {
      if (!Array.isArray(c.form?.[key]) || !c.form[key].length || c.form[key].some(
        (x) => typeof x !== "string" || !x.trim() || new TextEncoder().encode(x).length > 100
      ))
        throw new Error(`Invalid form.${key}`);
    }
    for (const key of ["heroTitle", "heroDescription", "cta", "trackingCta", "submit", "success"]) {
      if (typeof c.content?.[key] !== "string" || !c.content[key].trim())
        throw new Error(`Missing content.${key}`);
    }
    if (!c.form.needs.includes(c.form.trackingNeed))
      throw new Error("form.trackingNeed must match one of form.needs.");
    if (typeof c.features?.showIllustrativeCases !== "boolean")
      throw new Error("Invalid features.showIllustrativeCases.");
    return c;
  }
  var legalFallbacks = /* @__PURE__ */ new WeakMap();
  function applyBrand(c) {
    document.querySelectorAll("[data-brand]").forEach((el) => {
      const value = c.brand[el.dataset.brand];
      if (typeof value === "string") el.textContent = value;
    });
    document.querySelectorAll("[data-content]").forEach((el) => {
      const value = c.content[el.dataset.content];
      if (typeof value === "string") el.textContent = value;
    });
    document.querySelectorAll("[data-title-first]").forEach((el) => {
      const first = el.dataset.titleFirst, second = el.dataset.titleSecond, accent = el.dataset.titleAccent;
      if (c.content.heroTitle === `${first} ${second}${accent}`) {
        const mark = document.createElement("span");
        mark.className = "accent";
        mark.textContent = accent;
        el.replaceChildren(
          document.createTextNode(first + " "),
          document.createElement("br"),
          document.createTextNode(second),
          mark
        );
      }
    });
    document.querySelectorAll("[data-link]").forEach((el) => {
      const href = safeLink(siteLinks[el.dataset.link]);
      if (href) {
        const url = new URL(href);
        if (el.dataset.linkFragment) url.hash = el.dataset.linkFragment;
        el.href = url.href;
      }
    });
    document.querySelectorAll("[data-tracking-link]").forEach((el) => {
      const href = safeLink(siteLinks.audit);
      if (href) {
        const url = new URL(href);
        url.searchParams.set("need", "tracking");
        el.href = url.href;
      }
    });
    document.querySelectorAll("[data-email]").forEach((el) => {
      el.textContent = c.brand.email;
      el.href = `mailto:${c.brand.email}`;
    });
    document.querySelectorAll("[data-legal]").forEach((el) => {
      if (!legalFallbacks.has(el))
        legalFallbacks.set(el, { text: el.textContent, dateTime: el.getAttribute("datetime") });
      const value = c.legal?.[el.dataset.legal]?.trim();
      const fallback = legalFallbacks.get(el);
      el.textContent = value || fallback.text;
      if (el.dataset.legal === "updatedOn" && !value && fallback.dateTime)
        el.dateTime = fallback.dateTime;
      if (el.dataset.legal === "updatedOn" && value) {
        el.dateTime = value;
        el.textContent = new Intl.DateTimeFormat("en", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC"
        }).format(/* @__PURE__ */ new Date(`${value}T00:00:00Z`));
      }
    });
    document.querySelectorAll("[data-legal-optional]").forEach((el) => {
      el.hidden = !c.legal?.[el.dataset.legalOptional]?.trim();
    });
    document.querySelectorAll("[data-privacy-email]").forEach((el) => {
      const email = c.legal?.privacyEmail || c.brand.email;
      el.textContent = email;
      el.href = `mailto:${email}`;
    });
    document.querySelectorAll("[data-business-website]").forEach((el) => {
      const href = safeLink(c.brand.website);
      el.textContent = c.brand.website;
      if (href) el.href = href;
      else el.removeAttribute("href");
    });
    document.querySelectorAll("[data-authority-link]").forEach((el) => {
      const href = safeLink(c.legal?.supervisoryAuthorityUrl);
      el.hidden = !href;
      if (href) el.href = href;
      else el.removeAttribute("href");
    });
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String((/* @__PURE__ */ new Date()).getFullYear());
    });
    document.querySelectorAll("[data-logo]").forEach((el) => {
      const fallback = () => {
        const name = document.createElement("span");
        name.dataset.brand = "name";
        name.textContent = c.brand.name;
        const dots = document.createElement("span");
        dots.className = "brand-dots";
        dots.setAttribute("aria-hidden", "true");
        for (let i = 0; i < 4; i++) dots.append(document.createElement("i"));
        el.replaceChildren(name, dots);
      };
      const url = c.brand.logo && safeLink(c.brand.logo);
      if (!url) {
        fallback();
        return;
      }
      const current2 = el.querySelector("img");
      if (current2?.src === url) {
        current2.alt = c.brand.name;
        if (current2.complete && !current2.naturalWidth) fallback();
        else
          current2.addEventListener(
            "error",
            () => {
              if (el.contains(current2)) fallback();
            },
            { once: true }
          );
        return;
      }
      const img = document.createElement("img");
      img.src = url;
      img.alt = c.brand.name;
      img.addEventListener(
        "error",
        () => {
          if (el.contains(img)) fallback();
        },
        { once: true }
      );
      el.replaceChildren(img);
    });
    document.querySelectorAll("[data-favicon]").forEach((el) => {
      el.href = safeLink(c.brand.favicon);
      el.removeAttribute("sizes");
      el.removeAttribute("type");
    });
    document.querySelectorAll("select[data-options]").forEach((el) => {
      const options = c.form[el.dataset.options];
      el.replaceChildren(new Option(el.dataset.placeholder || "Select an option", ""));
      options.forEach((value) => el.add(new Option(value, value)));
    });
    document.querySelectorAll("[data-illustrative]").forEach((el) => {
      el.hidden = !c.features.showIllustrativeCases;
    });
    document.documentElement.dataset.animations = "on";
    const page = document.documentElement.dataset.page;
    if (c.pageTitles[page]) document.title = `${c.pageTitles[page]} | ${c.brand.name}`;
  }
  var embeddedConfig = document.querySelector("#site-config");
  var configReady = location.protocol === "file:" ? (
    // Folder preview keeps the HTML defaults; PHP remains the config source on hosting.
    Promise.resolve({ features: { showIllustrativeCases: true } }).then((config2) => {
      document.documentElement.dataset.animations = "on";
      return config2;
    })
  ) : (embeddedConfig ? Promise.resolve().then(() => JSON.parse(embeddedConfig.textContent)) : fetch(configURL, { cache: "no-cache" }).then((response) => {
    if (!response.ok) throw new Error("Cannot load site.json");
    return response.json();
  })).then(validateConfig).then((c) => {
    applyBrand(c);
    return c;
  });
  configReady.catch(() => {
    document.querySelectorAll("[data-config-error]").forEach((el) => {
      el.hidden = false;
    });
  });

  // js/motion-scenes.js
  var pathLengths = /* @__PURE__ */ new WeakMap();
  var searchRuns = /* @__PURE__ */ new WeakMap();
  var searchPhrases = [
    "Turn searches into customers",
    "Reach more people with Google Ads",
    "Bring in more qualified leads",
    "Make every ad click count",
    "Turn better data into growth"
  ];
  function prepareScenes(root = document) {
    const assign = (selector, name) => root.querySelectorAll(selector).forEach((el) => {
      el.dataset.scene = name;
    });
    assign(".search-scene", "search");
    assign("#measurement .flow", "conversion-flow");
    assign(".feedback-scene", "tracking-loop");
    assign(".automation-grid, .home-automation-grid", "automation");
    assign(".cta-panel", "final-cta");
    root.querySelectorAll('[data-scene="conversion-flow"], .feedback-scene .flow').forEach((flow) => {
      flow.classList.add("motion-connectors");
      [...flow.children].slice(0, -1).forEach((node) => {
        if (node.querySelector(".motion-connector")) return;
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        svg.classList.add("motion-connector");
        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", "M3 12H21M15 6L21 12L15 18");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "1.6");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        svg.append(path);
        node.append(svg);
      });
    });
    const caption = root.querySelector(".feedback-caption");
    if (caption && !caption.querySelector("svg")) {
      caption.classList.add("motion-return");
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.classList.add("motion-return-svg");
      svg.setAttribute("viewBox", "0 0 600 24");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("aria-hidden", "true");
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", "M599 0V10Q599 23 586 23H14Q1 23 1 10V0");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.5");
      svg.append(path);
      caption.prepend(svg);
    }
    return [...root.querySelectorAll("[data-scene]")];
  }
  function sceneParts(name, element) {
    if (name === "search") return [...element.querySelectorAll(".search-bar, .scene-tile")];
    if (name === "tracking-loop") return [...element.querySelectorAll(".flow > li")];
    if (name === "conversion-flow") return [...element.children];
    if (name === "automation") return [...element.querySelectorAll("article")];
    if (name === "final-cta") return [...element.children];
    return [];
  }
  async function typeSearch(bar, signal, motion, delay) {
    const text = bar?.querySelector(".search-query-text");
    if (!text || signal.aborted || !motion.allowed()) return;
    let state = searchRuns.get(bar);
    if (!state) {
      state = { original: text.textContent, index: 0, run: null };
      searchRuns.set(bar, state);
    }
    state.run = signal;
    const phrases = [state.original, ...searchPhrases];
    const restore = () => {
      if (state.run !== signal) return;
      text.textContent = state.original;
      state.run = null;
    };
    signal.addEventListener("abort", restore, { once: true });
    try {
      while (!signal.aborted && motion.allowed()) {
        text.textContent = phrases[state.index];
        const completed = await typePhrase(bar, signal, motion, delay);
        if (!completed || signal.aborted) break;
        state.index = (state.index + 1) % phrases.length;
        delay = 0;
      }
    } finally {
      signal.removeEventListener("abort", restore);
      restore();
    }
  }
  async function typePhrase(bar, signal, motion, delay) {
    const text = bar?.querySelector(".search-query-text");
    const caret = bar?.querySelector(".search-caret");
    const node = text?.firstChild;
    if (!node || node.nodeType !== Node.TEXT_NODE || !caret || signal.aborted) return;
    const range = document.createRange();
    range.selectNodeContents(text);
    const width = text.getBoundingClientRect().width;
    if (!width || range.getClientRects().length !== 1) return;
    const tokens2 = motion.tokens();
    const letters = typeof Intl.Segmenter === "function" ? [...new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(node.data)].map(
      (part) => part.segment
    ) : Array.from(node.data);
    const points = [{ time: 0, fraction: 0 }];
    let time = 0;
    let end = 0;
    range.setStart(node, 0);
    letters.forEach((letter, index) => {
      end += letter.length;
      range.setEnd(node, end);
      time += /\s/u.test(letter) ? tokens2.typeSpace : tokens2.typeLetter + index % 4 * 7;
      points.push({ time, fraction: Math.min(1, range.getBoundingClientRect().width / width) });
    });
    if (!time) return;
    points.at(-1).fraction = 1;
    const clearAt = time + tokens2.typeHold;
    const clearedAt = clearAt + tokens2.typeClear;
    const finish = clearedAt + tokens2.typeRest;
    const reveal = points.map(({ time: at, fraction }) => ({
      clipPath: `inset(0 ${(1 - fraction) * 100}% 0 0)`,
      offset: at / finish,
      easing: "steps(1, end)"
    }));
    reveal.push(
      { clipPath: "inset(0 0% 0 0)", offset: clearAt / finish, easing: "ease-in-out" },
      { clipPath: "inset(0 100% 0 0)", offset: clearedAt / finish },
      { clipPath: "inset(0 100% 0 0)", offset: 1 }
    );
    const cursor = points.map(({ time: at, fraction }) => ({
      translate: `${(fraction - 1) * 100}% 0`,
      opacity: 1,
      offset: at / finish,
      easing: "steps(1, end)"
    }));
    [320, 560, 880, 1200].forEach((pause, index) => {
      cursor.push({
        translate: "0% 0",
        opacity: index % 2,
        offset: (time + pause) / finish,
        easing: "steps(1, end)"
      });
    });
    cursor.push(
      { translate: "0% 0", opacity: 1, offset: clearAt / finish, easing: "ease-in-out" },
      { translate: "-100% 0", opacity: 1, offset: clearedAt / finish },
      { translate: "-100% 0", opacity: 1, offset: 1 }
    );
    const timing = { delay, duration: finish, easing: "linear", signal };
    const completed = await Promise.all([
      motion.animate(text, reveal, timing),
      motion.animate(caret, cursor, timing)
    ]);
    return completed.every(Boolean);
  }
  async function playScene(name, element, signal, motion) {
    const tokens2 = motion.tokens();
    const parts = sceneParts(name, element).filter(motion.visible);
    const jobs = [];
    const enter = (el, delay, duration = tokens2.node, options = {}) => {
      if (!el || signal.aborted) return;
      jobs.push(motion.enter(el, { delay, duration, signal, ...options }));
    };
    const draw = (path, delay, duration = tokens2.flowStep * 1.4) => {
      if (!path || signal.aborted) return;
      if (!pathLengths.has(path)) pathLengths.set(path, path.getTotalLength());
      const length = pathLengths.get(path);
      jobs.push(
        motion.animate(
          path,
          [
            { strokeDasharray: `${length}`, strokeDashoffset: length },
            { strokeDasharray: `${length}`, strokeDashoffset: 0 }
          ],
          { delay, duration, signal, easing: tokens2.enterEase }
        )
      );
    };
    if (name === "search") {
      const selectors = [
        ".search-bar",
        ".search-query",
        ".ad-tile",
        ".product-tile",
        ".lead-tile",
        ".growth-tile"
      ];
      const origin = element.hasAttribute("data-motion-intro") ? 0 : tokens2.heroDelays[3];
      selectors.forEach((selector, index) => {
        const el = element.querySelector(selector);
        if (el && motion.visible(el)) {
          if (index === 1) {
            return;
          }
          const delay = tokens2.heroDelays[index + 3] - origin;
          enter(el, delay, tokens2.heroDurations[index + 3], {
            profile: index < 2 ? "text" : "tile",
            direction: index < 4 ? 1 : -1,
            distance: index === 1 ? 0 : tokens2.distance
          });
          const icon = index > 1 ? el.querySelector(".icon-shell") : null;
          enter(icon, delay + tokens2.node * 0.5, tokens2.node, { profile: "badge" });
        }
      });
      element.querySelectorAll(".scene-dot, .scene-arc").forEach((el, index) => {
        if (motion.visible(el)) {
          enter(el, tokens2.heroDelays[5] - origin + index * tokens2.step, tokens2.scene, {
            profile: "art",
            distance: tokens2.distance * 0.5
          });
        }
      });
    } else if (name === "final-cta") {
      parts.forEach((el, index) => {
        const decor = el.classList.contains("cta-decor");
        enter(
          el,
          decor ? tokens2.step * 2 : index * tokens2.step,
          decor ? tokens2.scene : tokens2.enter,
          {
            profile: decor ? "art" : "text"
          }
        );
      });
    } else if (name === "automation") {
      parts.forEach((el, index) => {
        const delay = Math.min(index * tokens2.step, tokens2.cap);
        enter(el, delay, tokens2.enter, { profile: "card" });
        enter(el.querySelector(".icon-shell"), delay + tokens2.enter * 0.4, tokens2.node, {
          profile: "badge"
        });
      });
    } else {
      const interval = tokens2.flowStep;
      parts.forEach((el, index) => {
        enter(el, index * interval, tokens2.node, { profile: "card" });
        enter(el.querySelector(".icon-shell"), index * interval + tokens2.node * 0.4, tokens2.node, {
          profile: "badge"
        });
        draw(el.querySelector(".motion-connector path"), (index + 1) * interval);
      });
      const caption = name === "tracking-loop" ? element.querySelector(".feedback-caption") : element.parentElement.querySelector(".caption");
      enter(caption, parts.length * interval, tokens2.enter);
      const path = element.querySelector(".motion-return-svg path");
      draw(path, parts.length * interval, tokens2.scene);
    }
    await Promise.all(jobs);
  }

  // js/scroll-decor.js
  var motifs = [
    ["brands/google-ads.png", "#4285f4"],
    ["brands/youtube-ads.png", "#ea4335"],
    ["brands/google-analytics.png", "#fbbc05"],
    ["brands/google-tag-manager.png", "#4285f4"],
    ["brands/merchant-center.png", "#4285f4"],
    ["brands/looker-studio.png", "#4285f4"],
    ["brands/search-console.png", "#34a853"],
    ["brands/google-sheets.png", "#34a853"],
    ["brands/firebase.png", "#fbbc05"],
    ["brands/google-cloud.png", "#4285f4"],
    ["brands/gmail.png", "#ea4335"],
    ["icon-search.webp", "#4285f4"],
    ["icon-chart.webp", "#fbbc05"],
    ["icon-cart.webp", "#34a853"],
    ["icon-target.webp", "#34a853"],
    ["icon-gear.webp", "#fbbc05"],
    ["icon-report.webp", "#4285f4"],
    ["icon-bell.webp", "#ea4335"],
    ["icon-cursor.webp", "#4285f4"],
    ["icon-video.webp", "#ea4335"],
    ["icon-mobile.webp", "#4285f4"],
    ["icon-contact.webp", "#34a853"],
    ["icon-group.webp", "#ea4335"],
    ["icon-bag.webp", "#fbbc05"],
    ["icon-sale.webp", "#34a853"],
    ["icon-link.webp", "#4285f4"],
    ["icon-document.webp", "#4285f4"],
    ["icon-browser.webp", "#4285f4"],
    ["icon-phone.webp", "#34a853"],
    ["icon-spark.webp", "#fbbc05"],
    ["icon-idea.webp", "#fbbc05"],
    ["icon-bulb.webp", "#fbbc05"],
    ["icon-building.webp", "#fbbc05"],
    ["icon-warning.webp", "#fbbc05"]
  ];
  var shuffle = (items) => {
    const deck = [...items];
    for (let index = deck.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [deck[index], deck[other]] = [deck[other], deck[index]];
    }
    return deck;
  };
  var motifDeck = [
    ...shuffle(motifs.slice(0, 3)),
    ...shuffle(motifs.slice(3, 6)),
    ...shuffle(motifs.slice(6))
  ];
  var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  var physicsLoader;
  var savedPile;
  function loadPhysics() {
    if (window.Matter) return Promise.resolve(window.Matter);
    if (!physicsLoader) {
      physicsLoader = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = new URL("./vendor/matter.js", localPreviewScriptURL).href;
        script.onload = () => {
          script.remove();
          resolve(window.Matter);
        };
        script.onerror = () => {
          script.remove();
          physicsLoader = null;
          reject(new Error("Side decoration physics could not load."));
        };
        document.head.append(script);
      });
    }
    return physicsLoader;
  }
  function initScrollDecor(signal, allowed) {
    const section = document.querySelector(".page-home main > section:nth-of-type(2)");
    const container = section?.querySelector(".container");
    if (!container || !allowed()) return;
    const header2 = document.querySelector(".site-header");
    const footer = document.querySelector("body > footer");
    const layer = document.createElement("div");
    layer.className = "scroll-decor";
    layer.setAttribute("aria-hidden", "true");
    layer.inert = true;
    const world = document.createElement("div");
    world.className = "scroll-decor-world";
    layer.append(world);
    document.body.append(layer);
    let physics;
    let engine;
    let loading = false;
    let failed = false;
    let walls = [];
    const balls = [];
    let geometry;
    let worldGeometry;
    let frame = 0;
    let previousTime = 0;
    let accumulator = 0;
    let nextDrop = 0;
    let presence = 0;
    let presenceVelocity = 0;
    let furthest = savedPile?.furthest || 0;
    let needsMeasure = true;
    let lastPresence;
    let lastShift;
    let lastHeight;
    const timestep = 1e3 / 120;
    const setActive = (active2) => {
      const value = String(active2);
      if (layer.dataset.active !== value) layer.dataset.active = value;
    };
    const measure = () => {
      const bounds = container.getBoundingClientRect();
      const style = getComputedStyle(container);
      const top = header2?.offsetHeight || 0;
      const width = document.documentElement.clientWidth;
      const outerGutter = Math.min(bounds.left, width - bounds.right);
      const contentGutter = Math.min(
        bounds.left + parseFloat(style.paddingLeft),
        width - bounds.right + parseFloat(style.paddingRight)
      ) - 12;
      const compact = width < 1680;
      const gutter = width >= 1024 && outerGutter < 72 ? Math.min(76, contentGutter) : outerGutter;
      const diameter = clamp(gutter - 32, 40, compact ? 48 : 64);
      const height = Math.max(1, innerHeight - top);
      geometry = {
        top,
        height,
        gutter,
        diameter,
        capacity: clamp(
          Math.floor((gutter - 16) / diameter) * Math.floor(height * (compact ? 0.58 : 0.6) / diameter) * 2,
          compact ? 12 : 10,
          compact ? 28 : 72
        ),
        width,
        start: section.getBoundingClientRect().top + scrollY - top,
        end: footer ? footer.getBoundingClientRect().top + scrollY : document.body.scrollHeight
      };
      layer.style.top = `${top}px`;
      world.style.height = `${height}px`;
      needsMeasure = false;
    };
    const draw = () => {
      for (const ball of balls) {
        const { body, element, radius } = ball;
        if (body.isSleeping && ball.lastTransform) continue;
        const { x, y } = body.position;
        const transform = `translate3d(${(x - radius).toFixed(2)}px, ${(y - radius).toFixed(2)}px, 0) rotate(${body.angle.toFixed(4)}rad)`;
        if (transform !== ball.lastTransform) {
          element.style.transform = transform;
          ball.lastTransform = transform;
        }
      }
    };
    const present = (visibleHeight) => {
      const opacity = presence.toFixed(4);
      const shift = ((1 - presence) * 72 + visibleHeight - geometry.height).toFixed(2);
      if (opacity !== lastPresence) {
        layer.style.opacity = opacity;
        lastPresence = opacity;
      }
      if (shift !== lastShift) {
        world.style.transform = `translate3d(0, ${shift}px, 0)`;
        lastShift = shift;
      }
      if (visibleHeight !== lastHeight) {
        layer.style.height = `${visibleHeight}px`;
        lastHeight = visibleHeight;
      }
    };
    const syncWalls = (floor) => {
      const { width, gutter, height, diameter } = geometry;
      if (worldGeometry?.width === width && worldGeometry?.floor === floor && worldGeometry?.gutter === gutter)
        return;
      const { Bodies, Body, Composite, Sleeping } = physics;
      while (balls.length > geometry.capacity) {
        const ball = balls.pop();
        Composite.remove(engine.world, ball.body);
        ball.element.remove();
      }
      if (worldGeometry) {
        for (const ball of balls) {
          const oldOrigin = ball.side ? worldGeometry.width - worldGeometry.gutter : 0;
          const origin = ball.side ? width - gutter : 0;
          const fraction = (ball.body.position.x - oldOrigin) / worldGeometry.gutter;
          const radius = diameter * ball.scale / 2;
          if (radius !== ball.radius) {
            Body.scale(ball.body, radius / ball.radius, radius / ball.radius);
            ball.radius = radius;
            ball.element.style.width = `${radius * 2}px`;
            ball.element.style.height = `${radius * 2}px`;
          }
          Body.setPosition(ball.body, {
            x: origin + clamp(fraction * gutter, radius + 10, gutter - radius - 10),
            y: Math.min(ball.body.position.y + floor - worldGeometry.floor, floor - radius)
          });
          Sleeping.set(ball.body, false);
        }
      }
      Composite.remove(engine.world, walls);
      walls = [];
      for (const origin of [0, width - gutter]) {
        const material = { isStatic: true, friction: 0.3, restitution: 0.25 };
        walls.push(
          Bodies.rectangle(origin - 40, height / 2 - 500, 96, height + 3e3, material),
          Bodies.rectangle(origin + gutter + 40, height / 2 - 500, 96, height + 3e3, material),
          Bodies.rectangle(origin + gutter / 2, floor + 100, gutter + 100, 200, material)
        );
      }
      Composite.add(engine.world, walls);
      worldGeometry = { width, gutter, floor };
    };
    const addBall = (index, restored) => {
      const { Bodies, Body, Composite } = physics;
      const side = index % 2;
      const scale = 0.86 + index % 3 * 0.07;
      const radius = geometry.diameter * scale / 2;
      const origin = side ? geometry.width - geometry.gutter : 0;
      const fraction = restored?.fraction ?? 0.22 + index * 0.618034 % 1 * 0.56;
      const x = origin + clamp(fraction * geometry.gutter, radius + 12, geometry.gutter - radius - 12);
      const y = restored ? worldGeometry.floor - restored.fromFloor : -radius - 12;
      const body = Bodies.circle(x, Math.min(y, worldGeometry.floor - radius), radius, {
        restitution: 0.48,
        friction: 0.16,
        frictionStatic: 0.55,
        frictionAir: 6e-3,
        density: 1e-3,
        sleepThreshold: 75
      });
      Body.setAngle(body, restored?.angle ?? Math.sin(index * 2.4) * 0.4);
      Body.setVelocity(body, restored?.velocity ?? { x: Math.sin(index * 2.1 + 0.7) * 1.1, y: 0.5 });
      Body.setAngularVelocity(body, restored?.angularVelocity ?? Math.sin(index + 1) * 0.025);
      const [asset, tint] = motifDeck[(index + Math.floor(index / motifDeck.length)) % motifDeck.length];
      const element = document.createElement("span");
      element.className = "scroll-decor-ball";
      if (asset.startsWith("brands/")) element.classList.add("scroll-decor-ball--brand");
      element.style.width = `${radius * 2}px`;
      element.style.height = `${radius * 2}px`;
      element.style.setProperty("--ball-tint", tint);
      const image = document.createElement("img");
      image.src = new URL(`../assets/images/${asset}`, localPreviewScriptURL).href;
      image.alt = "";
      image.width = 80;
      image.height = 80;
      image.decoding = "async";
      image.draggable = false;
      element.append(image);
      world.append(element);
      balls.push({ body, element, radius, scale, side });
      Composite.add(engine.world, body);
    };
    const startPhysics = () => {
      if (loading || failed) return;
      loading = true;
      loadPhysics().then((module) => {
        if (signal.aborted || !allowed()) return;
        physics = module;
        engine = physics.Engine.create({
          enableSleeping: true,
          positionIterations: 8,
          velocityIterations: 8
        });
        engine.gravity.y = 0.75;
        syncWalls(geometry.height - 16);
        if (savedPile) {
          savedPile.balls.slice(0, geometry.capacity).forEach((ball, index) => addBall(index, ball));
        }
        draw();
        schedule();
      }).catch(() => {
        failed = true;
        setActive(false);
      });
    };
    const update = (time) => {
      frame = 0;
      if (!allowed() || signal.aborted) return;
      if (needsMeasure) measure();
      const elapsed = Math.min(time - previousTime, 50);
      previousTime = time;
      const visibleHeight = clamp(geometry.end - scrollY - geometry.top, 0, geometry.height);
      const hasRoom = geometry.gutter >= 72 && visibleHeight >= 100;
      if (!hasRoom || failed) {
        presence = 0;
        presenceVelocity = 0;
        setActive(false);
        accumulator = 0;
        return;
      }
      const progress = clamp((scrollY - geometry.start) / 240, 0, 1);
      const targetPresence = progress * progress * (3 - 2 * progress);
      const seconds = elapsed / 1e3;
      const response = 7;
      const offset = presence - targetPresence;
      const impulse = presenceVelocity + response * offset;
      const decay = Math.exp(-response * seconds);
      presence = clamp(targetPresence + (offset + impulse * seconds) * decay, 0, 1);
      presenceVelocity = (presenceVelocity - response * impulse * seconds) * decay;
      const revealing = Math.abs(presence - targetPresence) >= 5e-4 || Math.abs(presenceVelocity) >= 2e-3;
      if (!revealing) {
        presence = targetPresence;
        presenceVelocity = 0;
      }
      present(visibleHeight);
      setActive(presence > 0 || targetPresence > 0);
      if (presence === 0 && targetPresence === 0) {
        accumulator = 0;
        return;
      }
      if (!engine) {
        startPhysics();
        if (revealing) frame = requestAnimationFrame(update);
        return;
      }
      syncWalls(geometry.height - 16);
      furthest = Math.max(furthest, scrollY - geometry.start);
      const spacing = Math.max(
        80,
        (geometry.end - geometry.start - geometry.height) * 0.72 / geometry.capacity
      );
      const wanted = Math.min(geometry.capacity, 2 + Math.floor(furthest / spacing));
      const canDrop = targetPresence > 0 && balls.length < wanted;
      if (canDrop && time >= nextDrop) {
        addBall(balls.length);
        nextDrop = time + 260;
      }
      if (balls.some(({ body }) => !body.isSleeping)) {
        accumulator += elapsed;
        while (accumulator >= timestep) {
          physics.Engine.update(engine, timestep);
          accumulator -= timestep;
        }
        draw();
      } else {
        accumulator = 0;
      }
      if (revealing || canDrop || balls.some(({ body }) => !body.isSleeping)) {
        frame = requestAnimationFrame(update);
      }
    };
    const schedule = () => {
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(update);
      }
    };
    const resize = () => {
      needsMeasure = true;
      schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true, signal });
    window.addEventListener("resize", resize, { passive: true, signal });
    const observer = new ResizeObserver(resize);
    observer.observe(document.querySelector("main"));
    if (header2) observer.observe(header2);
    signal.addEventListener(
      "abort",
      () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        if (engine) {
          savedPile = {
            furthest,
            balls: balls.map(({ body, side }) => ({
              fraction: (body.position.x - (side ? worldGeometry.width - worldGeometry.gutter : 0)) / worldGeometry.gutter,
              fromFloor: worldGeometry.floor - body.position.y,
              angle: body.angle,
              velocity: { ...body.velocity },
              angularVelocity: body.angularVelocity
            }))
          };
          physics.Composite.clear(engine.world, false);
          physics.Engine.clear(engine);
        }
        layer.remove();
      },
      { once: true }
    );
    measure();
    schedule();
  }

  // js/motion.js
  var reduced = matchMedia("(prefers-reduced-motion: reduce)");
  var mobile = matchMedia("(max-width: 767px)");
  var tablet = matchMedia("(max-width: 1199px)");
  var seen = /* @__PURE__ */ new WeakSet();
  var splitScenes = /* @__PURE__ */ new WeakSet();
  var active = /* @__PURE__ */ new Map();
  var sceneRuns = /* @__PURE__ */ new Map();
  var uiFinalizers = /* @__PURE__ */ new Set();
  var config;
  var lifetime;
  var revealObserver;
  var sceneObserver;
  var typingObserver;
  var typingRun;
  var heroScrollRun;
  var scrollDecorRun;
  var tokens;
  var sceneElements = [];
  var revealElements = [];
  var early = false;
  var hasInitialized = false;
  function readMotionTokens() {
    const style = getComputedStyle(document.documentElement);
    const value = (name) => style.getPropertyValue(name).trim();
    const time = (name) => {
      const text = value(name);
      return parseFloat(text) * (text.endsWith("ms") ? 1 : 1e3);
    };
    tokens = {
      feedback: time("--motion-feedback"),
      ui: time("--motion-ui"),
      enter: time("--motion-enter"),
      scene: time("--motion-scene"),
      step: time("--motion-step"),
      cap: time("--motion-cap"),
      node: time("--motion-node"),
      flowStep: time("--motion-flow-step"),
      typeLetter: time("--motion-type-letter"),
      typeSpace: time("--motion-type-space"),
      typeHold: time("--motion-type-hold"),
      typeClear: time("--motion-type-clear"),
      typeRest: time("--motion-type-rest"),
      close: time("--motion-close"),
      faqClose: time("--motion-faq-close"),
      menu: time("--motion-menu"),
      menuStep: time("--motion-menu-step"),
      menuCap: time("--motion-menu-cap"),
      late: time("--motion-late"),
      distance: parseFloat(value("--reveal-distance")),
      easing: value("--ease-standard"),
      enterEase: value("--ease-enter"),
      exitEase: value("--ease-exit"),
      mode: mobile.matches ? "mobile" : tablet.matches ? "tablet" : "desktop",
      heroDelays: value("--hero-delays").split(",").map(Number),
      heroDurations: value("--hero-durations").split(",").map(Number)
    };
    return tokens;
  }
  function isMotionAllowed() {
    return Boolean(
      lifetime && config && !reduced.matches && !document.hidden && typeof Element.prototype.animate === "function" && "IntersectionObserver" in window && CSS.supports("translate", "0 1px")
    );
  }
  function cancelElementMotion(element) {
    active.get(element)?.cancel();
  }
  function markRevealed(element) {
    seen.add(element);
    revealObserver?.unobserve(element);
  }
  function animateElement(element, frames, options = {}) {
    if (!element || !isMotionAllowed() || options.signal?.aborted) return Promise.resolve(false);
    cancelElementMotion(element);
    const { signal, ...timing } = options;
    const priorHint = element.style.willChange;
    element.style.willChange = "transform, opacity";
    let animation;
    try {
      animation = element.animate(frames, {
        duration: tokens.ui,
        easing: tokens.easing,
        fill: "both",
        ...timing
      });
    } catch {
      element.style.willChange = priorHint;
      return Promise.resolve(false);
    }
    const release = () => {
      if (active.get(element) !== entry) return;
      active.delete(element);
      element.style.willChange = priorHint;
      if (!element.getAttribute("style")) element.removeAttribute("style");
    };
    const entry = {
      cancel() {
        animation.cancel();
        release();
      }
    };
    active.set(element, entry);
    const abort = () => entry.cancel();
    signal?.addEventListener("abort", abort, { once: true });
    return animation.finished.then(
      () => true,
      () => false
    ).then((completed) => {
      signal?.removeEventListener("abort", abort);
      release();
      animation.cancel();
      return completed;
    });
  }
  function enterElement(element, options = {}) {
    if (!element) return Promise.resolve();
    const { distance = tokens?.distance ?? 0, profile = "text", direction = 1, ...timing } = options;
    const compact = tokens?.mode === "mobile";
    const ease = tokens?.enterEase;
    let frames = [
      { opacity: 0, translate: `0 ${distance}px` },
      { opacity: 1, translate: "0 0" }
    ];
    let duration = tokens?.enter;
    let easing = ease;
    if (profile === "card" || profile === "art") {
      duration = profile === "art" ? tokens?.scene : tokens?.enter;
      frames = [
        {
          opacity: 0,
          translate: `0 ${distance * 1.2}px`,
          scale: profile === "art" ? "0.94" : "0.97"
        },
        { opacity: 1, translate: "0 0", scale: "1" }
      ];
    } else if (profile === "tile" || profile === "badge") {
      const badge = profile === "badge";
      const x = compact || badge ? 0 : direction * 36;
      const angle = compact ? 0 : direction * (badge ? 8 : 3);
      duration = badge ? tokens?.node : tokens?.scene;
      easing = "linear";
      frames = [
        {
          opacity: 0,
          translate: `${x}px ${badge ? 8 : distance}px`,
          scale: badge ? "0.72" : "0.92",
          rotate: `${angle}deg`,
          offset: 0,
          easing: ease
        },
        {
          opacity: 1,
          translate: `0 ${badge ? 0 : -2}px`,
          scale: badge ? "1.06" : "1",
          rotate: `${compact ? 0 : -direction * 0.35}deg`,
          offset: 0.78,
          easing: "ease-in-out"
        },
        { opacity: 1, translate: "0 0", scale: "1", rotate: "0deg", offset: 1 }
      ];
    }
    return animateElement(element, frames, { duration, easing, ...timing });
  }
  function revealProfile(element) {
    if (element.matches(".generated-visual")) return "art";
    if (element.matches(".scene-tile")) return "tile";
    if (element.matches("article, .card, li, .review-table-row")) return "card";
    return "text";
  }
  function revealTarget(element, delay = 0) {
    const profile = revealProfile(element);
    enterElement(element, { profile, delay });
    const icon = element.querySelector(":scope > .icon-shell");
    if (icon && profile === "card") {
      enterElement(icon, { profile: "badge", delay: delay + tokens.enter * 0.35 });
    }
  }
  function registerUIFinalizer(callback) {
    uiFinalizers.add(callback);
    return () => uiFinalizers.delete(callback);
  }
  function cancelAllMotion() {
    scrollDecorRun?.abort();
    scrollDecorRun = null;
    heroScrollRun?.abort();
    heroScrollRun = null;
    typingRun?.abort();
    typingRun = null;
    for (const controller of sceneRuns.values()) controller.abort();
    sceneRuns.clear();
    for (const entry of [...active.values()]) entry.cancel();
    for (const finish of [...uiFinalizers]) finish();
  }
  function initSideDecor() {
    if (!isMotionAllowed()) return;
    scrollDecorRun = new AbortController();
    initScrollDecor(scrollDecorRun.signal, isMotionAllowed);
  }
  function initHeroScroll() {
    if (!isMotionAllowed() || tablet.matches) return;
    const scene = document.querySelector(".page-home .search-scene");
    const hero = scene?.closest(".hero");
    if (!hero) return;
    const controller = new AbortController();
    heroScrollRun = controller;
    let frame = 0;
    let previousTime = 0;
    let needsMeasure = false;
    let velocity = 0;
    const targetAngle = () => {
      const progress = Math.min(
        1,
        Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight)
      );
      return progress * 360;
    };
    let target = targetAngle();
    let angle = target;
    const render = () => scene.style.setProperty("--hero-orbit", `${angle.toFixed(3)}deg`);
    const update = (time) => {
      frame = 0;
      if (!isMotionAllowed()) return;
      if (needsMeasure) {
        target = targetAngle();
        needsMeasure = false;
      }
      const elapsed = Math.min((time - previousTime) / 1e3, 0.064);
      previousTime = time;
      const response = 5.5;
      const offset = angle - target;
      const impulse = velocity + response * offset;
      const decay = Math.exp(-response * elapsed);
      angle = target + (offset + impulse * elapsed) * decay;
      velocity = (velocity - response * impulse * elapsed) * decay;
      if (Math.abs(angle - target) < 0.02 && Math.abs(velocity) < 0.05) {
        angle = target;
        velocity = 0;
        render();
        return;
      }
      render();
      frame = requestAnimationFrame(update);
    };
    const schedule = () => {
      needsMeasure = true;
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(update);
      }
    };
    const options = { passive: true, signal: controller.signal };
    window.addEventListener("scroll", schedule, options);
    window.addEventListener("resize", schedule, options);
    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    controller.signal.addEventListener(
      "abort",
      () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        scene.style.removeProperty("--hero-orbit");
      },
      { once: true }
    );
    render();
  }
  function initTyping() {
    typingObserver?.disconnect();
    if (!isMotionAllowed()) return;
    const bar = document.querySelector(".search-bar");
    if (!bar) return;
    let delay = early ? tokens.heroDelays[3] + tokens.heroDurations[3] * 0.65 : tokens.ui;
    typingObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
          typingRun?.abort();
          typingRun = null;
          return;
        }
        if (typingRun || !isMotionAllowed()) return;
        const controller = new AbortController();
        typingRun = controller;
        typeSearch(
          bar,
          controller.signal,
          {
            tokens: () => tokens,
            animate: animateElement,
            allowed: isMotionAllowed
          },
          delay
        ).catch(() => controller.abort()).finally(() => {
          if (typingRun === controller) typingRun = null;
        });
        delay = tokens.ui;
      },
      { threshold: [0, 0.5] }
    );
    typingObserver.observe(bar);
  }
  function visible(element) {
    return Boolean(element.getClientRects().length && !element.closest("[hidden]"));
  }
  function inViewport(element, margin = 0) {
    if (!visible(element)) return false;
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight + margin && rect.right > 0 && rect.left < innerWidth;
  }
  function fullyVisible(element) {
    const rect = element.getBoundingClientRect();
    return visible(element) && rect.top >= 0 && rect.bottom <= innerHeight;
  }
  function prepareTargets(root) {
    sceneElements = prepareScenes(root);
    const selectors = [
      ".section-heading",
      "main article",
      ".process-list > li",
      ".audiences > li",
      ".service-handover li",
      ".partnership-grid > *",
      ".review-table-row",
      ".service-story-copy > h2",
      ".service-story-copy > p:not(.eyebrow)",
      ".service-story-points",
      ".generated-visual",
      ".faq-items > details",
      ".home-management-copy",
      ".home-about-copy",
      ".audit-preview-copy"
    ];
    const candidates = [...root.querySelectorAll(selectors.join(","))].filter(
      (el) => !el.closest("[data-scene], #hero, #intro, form, .legal-copy")
    );
    const candidateSet = new Set(candidates);
    revealElements = candidates.filter((el) => {
      for (let parent = el.parentElement; parent; parent = parent.parentElement) {
        if (candidateSet.has(parent)) return false;
      }
      return true;
    });
    revealElements.push(...root.querySelectorAll("#hero .generated-visual"));
    revealElements.forEach((el) => {
      el.dataset.reveal = "";
      el.parentElement.dataset.revealGroup = "";
    });
    root.querySelectorAll("article, .card").forEach((el) => {
      if (el.querySelector("a[href], button")) el.classList.add("card--interactive");
    });
    sceneElements.forEach(
      (el) => sceneParts(el.dataset.scene, el).forEach((part) => {
        part.dataset.motionPart = "";
      })
    );
  }
  function observeReveal(element, skipCurrent = true) {
    if (seen.has(element) || !visible(element)) return;
    if (skipCurrent && element.getBoundingClientRect().top < innerHeight) {
      seen.add(element);
      return;
    }
    revealObserver?.observe(element);
  }
  function initReveals() {
    revealObserver?.disconnect();
    if (!isMotionAllowed()) return;
    revealObserver = new IntersectionObserver(
      (entries) => {
        const groups = /* @__PURE__ */ new Map();
        let count = 0;
        entries.filter((entry) => entry.isIntersecting).sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left
        ).forEach(({ target, boundingClientRect }) => {
          revealObserver.unobserve(target);
          if (seen.has(target) || !visible(target)) return;
          seen.add(target);
          if (!isMotionAllowed() || count++ >= 6) return;
          const group = target.parentElement;
          const row = groups.get(group);
          const index = row && Math.abs(row.top - boundingClientRect.top) < tokens.distance * 2 ? row.index : 0;
          groups.set(group, { top: boundingClientRect.top, index: index + 1 });
          revealTarget(target, Math.min(index * tokens.step, tokens.cap));
        });
      },
      { threshold: 0, rootMargin: "0px 0px -32px 0px" }
    );
    revealElements.forEach((el) => {
      if (early && el.closest("#hero") && inViewport(el)) return;
      observeReveal(el);
    });
  }
  function playScene2(name, element, signal) {
    return playScene(name, element, signal, {
      tokens: () => tokens,
      visible,
      enter: enterElement,
      animate: animateElement
    });
  }
  function startScene(element, name = element.dataset.scene) {
    seen.add(element);
    sceneParts(name, element).forEach((part) => seen.add(part));
    const controller = new AbortController();
    sceneRuns.set(element, controller);
    playScene2(name, element, controller.signal).catch(() => {
      controller.abort();
    }).finally(() => {
      if (sceneRuns.get(element) === controller) sceneRuns.delete(element);
      sceneObserver?.unobserve(element);
    });
  }
  function initScenes() {
    sceneObserver?.disconnect();
    if (!isMotionAllowed()) return;
    sceneObserver = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting, intersectionRatio } of entries) {
          if (!isIntersecting) {
            sceneRuns.get(target)?.abort();
            continue;
          }
          if (seen.has(target) || !isMotionAllowed()) continue;
          const split = splitScenes.has(target) || target.getBoundingClientRect().height > innerHeight || tokens.mode === "mobile";
          if (split) {
            splitScenes.add(target);
            seen.add(target);
            sceneParts(target.dataset.scene, target).forEach((part) => observeReveal(part, false));
            sceneObserver.unobserve(target);
          } else if (intersectionRatio >= 0.18) startScene(target);
        }
      },
      { threshold: [0, 0.18, 1] }
    );
    for (const element of sceneElements) {
      if (visible(element) && element.getBoundingClientRect().bottom <= 0) {
        seen.add(element);
        sceneParts(element.dataset.scene, element).forEach((part) => seen.add(part));
        continue;
      }
      if (splitScenes.has(element)) {
        sceneParts(element.dataset.scene, element).forEach((part) => observeReveal(part));
        continue;
      }
      if (seen.has(element)) continue;
      if (inViewport(element)) {
        if (early && element.closest("#hero")) {
          if (fullyVisible(element)) {
            element.dataset.motionIntro = "";
            startScene(element);
            sceneObserver.observe(element);
          } else {
            splitScenes.add(element);
            seen.add(element);
            sceneParts(element.dataset.scene, element).forEach((part) => observeReveal(part, false));
          }
        } else {
          splitScenes.add(element);
          seen.add(element);
          sceneParts(element.dataset.scene, element).forEach((part) => observeReveal(part));
        }
      } else sceneObserver.observe(element);
    }
  }
  function initHero() {
    const hero = document.querySelector("#hero, #intro");
    if (!hero || !early || !isMotionAllowed()) return;
    const h1 = hero.querySelector("h1");
    const copy = h1?.parentElement;
    const elements = [
      h1,
      copy?.querySelector(":scope > p:not(.eyebrow)"),
      copy?.querySelector(".hero-actions, .service-actions, :scope > .button")
    ];
    elements.forEach((el, index) => {
      if (el && inViewport(el) && !seen.has(el)) {
        seen.add(el);
        enterElement(el, {
          delay: tokens.heroDelays[index],
          duration: tokens.heroDurations[index]
        });
      }
    });
    const art = hero.querySelector(".generated-visual");
    if (art && !seen.has(art)) {
      if (inViewport(art)) {
        seen.add(art);
        enterElement(art, {
          profile: "art",
          delay: tokens.heroDelays[3],
          duration: tokens.heroDurations[3]
        });
      } else observeReveal(art);
    }
  }
  function initFAQ(root) {
    root.querySelectorAll(".faq details").forEach((details) => {
      const summary = details.querySelector("summary");
      if (!summary) return;
      let answer = details.querySelector(".faq-answer");
      if (!answer) {
        answer = document.createElement("div");
        answer.className = "faq-answer";
        while (summary.nextSibling) answer.append(summary.nextSibling);
        details.append(answer);
      }
      let revision = 0;
      let desired = details.open;
      let pending = false;
      const settle = () => {
        if (!pending) return;
        revision++;
        pending = false;
        cancelElementMotion(answer);
        details.open = desired;
        answer.style.removeProperty("overflow");
        details.removeAttribute("data-motion-open");
      };
      const unregister = registerUIFinalizer(settle);
      lifetime.signal.addEventListener("abort", unregister, { once: true });
      summary.addEventListener(
        "click",
        (event) => {
          if (!isMotionAllowed()) return;
          event.preventDefault();
          const height = details.open ? answer.getBoundingClientRect().height : 0;
          const opacity = details.open ? getComputedStyle(answer).opacity : 0;
          desired = pending ? !desired : !details.open;
          const operation = ++revision;
          pending = true;
          cancelElementMotion(answer);
          details.open = true;
          details.dataset.motionOpen = String(desired);
          const naturalHeight = answer.scrollHeight;
          answer.style.overflow = "hidden";
          animateElement(
            answer,
            [
              { height: `${height}px`, opacity },
              {
                height: `${desired ? naturalHeight : 0}px`,
                opacity: desired ? 1 : 0
              }
            ],
            { duration: desired ? tokens.ui : tokens.faqClose }
          ).then(() => {
            if (operation === revision) settle();
          });
        },
        { signal: lifetime.signal }
      );
    });
  }
  function refreshPolicy() {
    cancelAllMotion();
    revealObserver?.disconnect();
    sceneObserver?.disconnect();
    typingObserver?.disconnect();
    readMotionTokens();
    document.documentElement.dataset.motion = isMotionAllowed() ? "on" : "off";
    if (isMotionAllowed()) {
      initReveals();
      initScenes();
      initTyping();
      initHeroScroll();
      initSideDecor();
    }
  }
  function destroyMotion() {
    cancelAllMotion();
    revealObserver?.disconnect();
    sceneObserver?.disconnect();
    typingObserver?.disconnect();
    lifetime?.abort();
    lifetime = null;
    document.documentElement.dataset.motion = "off";
  }
  function initMotion(nextConfig) {
    destroyMotion();
    config = nextConfig;
    lifetime = new AbortController();
    readMotionTokens();
    const navigation = performance.getEntriesByType("navigation")[0];
    const domReady = navigation?.domContentLoadedEventStart;
    const firstPaint = performance.getEntriesByName("first-contentful-paint")[0]?.startTime;
    const readableAt = firstPaint || domReady || performance.now();
    const fromSite = document.referrer && new URL(document.referrer).origin === location.origin;
    const pageEntry = ["native", "fallback"].includes(window.signalPageTransition?.mode);
    const pageChange = (fromSite || pageEntry) && navigation?.type !== "reload";
    early = !hasInitialized && !pageChange && performance.now() - readableAt < tokens.late;
    hasInitialized = true;
    prepareTargets(document);
    initFAQ(document);
    document.documentElement.dataset.motion = isMotionAllowed() ? "on" : "off";
    initReveals();
    initHero();
    initScenes();
    initTyping();
    initHeroScroll();
    initSideDecor();
    early = false;
    const options = { signal: lifetime.signal };
    reduced.addEventListener("change", refreshPolicy, options);
    mobile.addEventListener("change", refreshPolicy, options);
    tablet.addEventListener("change", refreshPolicy, options);
    document.addEventListener("visibilitychange", refreshPolicy, options);
    window.addEventListener(
      "pageshow",
      (event) => {
        if (event.persisted) refreshPolicy();
      },
      options
    );
    window.addEventListener(
      "resize",
      () => {
        for (const finish of [...uiFinalizers]) finish();
        for (const controller of sceneRuns.values()) controller.abort();
        typingRun?.abort();
        typingRun = null;
        initTyping();
      },
      options
    );
    document.addEventListener(
      "focusin",
      (event) => {
        for (const [element, entry] of active) {
          if (element === event.target || element.contains(event.target)) entry.cancel();
        }
      },
      options
    );
    window.addEventListener("pagehide", cancelAllMotion, options);
    const instance = lifetime;
    return () => {
      if (lifetime === instance) destroyMotion();
    };
  }

  // js/cookie-banner.js
  function initCookieBanner() {
    const preferences = window.signalCookiePreferences;
    if (!preferences || document.querySelector("#cookie-banner")) return;
    const banner = document.createElement("aside");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.hidden = true;
    banner.setAttribute("aria-labelledby", "cookie-banner-title");
    banner.innerHTML = `
    <p class="cookie-eyebrow">Your privacy</p>
    <h2 id="cookie-banner-title">Cookies, on your terms.</h2>
    <p>Essential cookies keep our form secure. Optional navigation storage helps smooth
      transitions between pages. We use no advertising or analytics trackers.</p>
    <a class="cookie-policy-link" href="cookies.html">Read our Cookie Policy</a>
    <div class="cookie-actions">
      <button type="button" class="button secondary" data-cookie-choice="essential">Essential only</button>
      <button type="button" class="button secondary" data-cookie-choice="all">Allow all</button>
    </div>
    <button type="button" class="cookie-text-button" data-cookie-settings>Choose settings</button>`;
    const modal = document.createElement("dialog");
    modal.id = "cookie-settings";
    modal.className = "cookie-settings";
    modal.setAttribute("aria-labelledby", "cookie-settings-title");
    modal.innerHTML = `
    <div class="cookie-modal-header">
      <div><p class="cookie-eyebrow">Privacy preferences</p><h2 id="cookie-settings-title">Cookie settings</h2></div>
      <button type="button" class="cookie-close" aria-label="Close cookie settings" autofocus>\xD7</button>
    </div>
    <p>Choose which storage this website can use. You can change your choice at any time.</p>
    <div class="cookie-category">
      <div class="cookie-category-heading"><h3>Essential</h3><span class="cookie-required">Always on</span></div>
      <p>Protects the audit form and remembers your privacy choice. These functions are needed
        to provide the service and honour your settings.</p>
    </div>
    <div class="cookie-category">
      <label class="cookie-category-heading" for="cookie-navigation">
        <span>Navigation preferences</span>
        <input id="cookie-navigation" type="checkbox" role="switch" aria-describedby="cookie-navigation-description" />
      </label>
      <p id="cookie-navigation-description">Temporarily remembers your destination for smoother
        transitions between pages and sections. Links still work when this is off.</p>
    </div>
    <p class="cookie-tracking-note">Advertising and analytics tracking are not installed.</p>
    <a class="cookie-policy-link" href="cookies.html">Read our Cookie Policy</a>
    <div class="cookie-actions">
      <button type="button" class="button secondary" data-cookie-choice="essential">Essential only</button>
      <button type="button" class="button secondary" data-cookie-choice="all">Allow all</button>
      <button type="button" class="button" data-cookie-save>Save my settings</button>
    </div>`;
    const status2 = document.createElement("p");
    status2.className = "cookie-save-status";
    status2.setAttribute("role", "status");
    status2.setAttribute("aria-live", "polite");
    document.body.append(banner, modal, status2);
    let returnFocus;
    let statusTimer;
    const toggle = modal.querySelector("#cookie-navigation");
    const footerSettings = document.querySelector("footer [data-cookie-settings]");
    document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", () => {
        returnFocus = button;
        toggle.checked = preferences.get()?.navigation === true;
        modal.showModal();
        document.body.classList.add("cookie-settings-open");
        if (isMotionAllowed()) enterElement(modal, { distance: 12, duration: 420 });
      });
    });
    function close() {
      modal.close();
    }
    modal.querySelector(".cookie-close").addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target !== modal) return;
      const rect = modal.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
        close();
    });
    modal.addEventListener("close", () => {
      document.body.classList.remove("cookie-settings-open");
      if (returnFocus?.getClientRects().length) returnFocus.focus({ preventScroll: true });
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const controls = [...modal.querySelectorAll("button, input, a[href]")].filter(
        (element) => !element.disabled && element.getClientRects().length
      );
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    function update() {
      const choice = preferences.get();
      const wasHidden = banner.hidden;
      banner.hidden = Boolean(choice);
      if (modal.open) toggle.checked = choice?.navigation === true;
      if (!choice && wasHidden && isMotionAllowed())
        enterElement(banner, { distance: 16, duration: 600 });
    }
    function save(navigation) {
      const focusWasInside = banner.contains(document.activeElement) || modal.contains(document.activeElement);
      const persisted = preferences.save(navigation);
      if (modal.open) {
        if (returnFocus && banner.contains(returnFocus)) returnFocus = footerSettings;
        close();
      } else if (focusWasInside) footerSettings?.focus({ preventScroll: true });
      clearTimeout(statusTimer);
      status2.textContent = persisted ? "Cookie preferences saved." : "Your choice applies to this page. Your browser could not save it for future visits.";
      statusTimer = setTimeout(
        () => {
          status2.textContent = "";
        },
        persisted ? 4e3 : 1e4
      );
    }
    for (const panel of [banner, modal]) {
      panel.querySelectorAll("[data-cookie-choice]").forEach((button) => {
        button.addEventListener("click", () => save(button.dataset.cookieChoice === "all"));
      });
    }
    modal.querySelector("[data-cookie-save]").addEventListener("click", () => save(toggle.checked));
    addEventListener("signal:cookie-preferences", update);
    update();
  }

  // js/anchor-navigation.js
  var intentKey = "signal:anchor-navigation";
  var transitionKey = "signal:page-transition";
  var allowsNavigationMotion = () => document.documentElement.dataset.animations !== "off" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sitePages = /* @__PURE__ */ new Set([
    "index.html",
    "google-ads.html",
    "tracking-automation.html",
    "results.html",
    "audit.html",
    "privacy.html",
    "terms.html",
    "cookies.html"
  ]);
  var pagePath = (pathname) => pathname.replace(/\/index\.html$/, "/");
  var samePage = (a, b) => a.origin === b.origin && pagePath(a.pathname) === pagePath(b.pathname) && a.search === b.search;
  function anchorTarget(url) {
    try {
      return document.getElementById(decodeURIComponent(url.hash.slice(1)));
    } catch {
      return null;
    }
  }
  function scrollToTarget(target) {
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
      target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    }
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: allowsNavigationMotion() ? "smooth" : "instant",
      block: "start"
    });
  }
  function consumeIntent() {
    if (!window.signalCookiePreferences?.allowsNavigationStorage()) return null;
    try {
      const saved = sessionStorage.getItem(intentKey);
      sessionStorage.removeItem(intentKey);
      if (!saved) return null;
      const intent = JSON.parse(saved);
      const url = new URL(intent.href);
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation?.type !== "navigate" || !url.hash || !samePage(url, new URL(location.href)) || !Number.isFinite(intent.created) || Date.now() - intent.created > 6e4)
        return null;
      return url;
    } catch {
      return null;
    }
  }
  function initAnchorNavigation() {
    const pending = consumeIntent();
    const interruption = new AbortController();
    let interrupted = false;
    if (pending) {
      for (const name of ["wheel", "touchstart", "pointerdown", "keydown"]) {
        window.addEventListener(
          name,
          () => {
            interrupted = true;
          },
          {
            once: true,
            passive: true,
            signal: interruption.signal
          }
        );
      }
      window.addEventListener(
        "pagehide",
        () => {
          interrupted = true;
        },
        {
          once: true,
          signal: interruption.signal
        }
      );
    }
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = event.target.closest("a[href]");
      if (!link || link.hasAttribute("download") || link.target && link.target !== "_self") return;
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      if (!samePage(url, new URL(location.href))) {
        if (!sitePages.has(url.pathname.split("/").pop() || "index.html")) return;
        const motion = allowsNavigationMotion();
        if (!window.signalCookiePreferences?.allowsNavigationStorage()) return;
        try {
          sessionStorage.setItem(
            transitionKey,
            JSON.stringify({ href: url.href, created: Date.now(), motion })
          );
        } catch {
        }
        if (!url.hash || !motion) return;
        try {
          sessionStorage.setItem(intentKey, JSON.stringify({ href: url.href, created: Date.now() }));
        } catch {
          return;
        }
        event.preventDefault();
        url.hash = "";
        location.assign(url.href);
        return;
      }
      if (!url.hash) return;
      const target = anchorTarget(url);
      if (!target || !target.getClientRects().length) return;
      event.preventDefault();
      if (url.href !== location.href) history.pushState(history.state, "", url);
      scrollToTarget(target);
    });
    return async function completeAnchorNavigation2() {
      if (!pending) return;
      try {
        if (document.readyState !== "complete") {
          await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
        }
        await document.fonts.ready;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        await window.signalPageTransition?.finished;
        if (interrupted) return;
        history.replaceState(history.state, "", pending.href);
        const target = anchorTarget(pending);
        if (target?.getClientRects().length) scrollToTarget(target);
      } finally {
        interruption.abort();
      }
    };
  }

  // js/main.js
  var header = document.querySelector(".site-header");
  var serviceButton = document.querySelector(".nav-button");
  var services = document.querySelector("#services-links");
  var dialog = document.querySelector("#mobile-menu");
  var opener = document.querySelector(".menu-toggle");
  function closeServices(returnFocus = false) {
    if (!serviceButton) return;
    const wasOpen = serviceButton.getAttribute("aria-expanded") === "true";
    serviceButton.setAttribute("aria-expanded", "false");
    cancelElementMotion(services);
    services.hidden = true;
    if (returnFocus && wasOpen) serviceButton.focus();
  }
  serviceButton?.addEventListener("click", () => {
    const open = serviceButton.getAttribute("aria-expanded") !== "true";
    serviceButton.setAttribute("aria-expanded", String(open));
    services.hidden = !open;
    cancelElementMotion(services);
    if (open) enterElement(services, { distance: -6, duration: readMotionTokens().ui });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".services-menu") || event.target.closest("#services-links a")) {
      closeServices();
    }
  });
  document.addEventListener("focusin", (event) => {
    if (!event.target.closest(".services-menu")) closeServices();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeServices(true);
  });
  if (dialog && opener) {
    opener.hidden = false;
    const panel = dialog.querySelector(".menu-inner");
    let desired = false;
    let pending = false;
    let operation = 0;
    let savedScroll = 0;
    let returnFocus = true;
    const cancelParts = () => {
      cancelElementMotion(panel);
      dialog.querySelectorAll("nav a").forEach(cancelElementMotion);
    };
    const settleMenu = () => {
      if (!pending) return;
      pending = false;
      operation++;
      cancelParts();
      dialog.classList.remove("is-closing");
      if (!desired && dialog.open) {
        dialog.close();
        document.body.classList.remove("menu-open");
        window.scrollTo({ top: savedScroll, behavior: "instant" });
      }
      opener.setAttribute("aria-expanded", String(desired));
    };
    registerUIFinalizer(settleMenu);
    const closeMenu = (immediate = false) => {
      if (!dialog.open) return;
      if (pending && !desired && !immediate) return;
      desired = false;
      pending = true;
      const current2 = ++operation;
      cancelParts();
      if (immediate || !isMotionAllowed()) {
        settleMenu();
        return;
      }
      dialog.classList.add("is-closing");
      const tokens2 = readMotionTokens();
      animateElement(
        panel,
        [
          { opacity: 1, translate: "0 0" },
          { opacity: 0, translate: "0 -6px" }
        ],
        { duration: tokens2.close, easing: tokens2.exitEase }
      ).then(() => {
        if (current2 === operation) settleMenu();
      });
    };
    opener.addEventListener("click", () => {
      if (dialog.open && desired) {
        closeMenu();
        return;
      }
      desired = true;
      returnFocus = true;
      pending = true;
      const current2 = ++operation;
      cancelParts();
      dialog.classList.remove("is-closing");
      if (!dialog.open) {
        savedScroll = scrollY;
        dialog.showModal();
      }
      document.body.classList.add("menu-open");
      opener.setAttribute("aria-expanded", "true");
      dialog.querySelector(".menu-close").focus({ preventScroll: true });
      if (!isMotionAllowed()) {
        settleMenu();
        return;
      }
      const tokens2 = readMotionTokens();
      enterElement(panel, { distance: -8, duration: tokens2.menu }).then(() => {
        if (current2 === operation) {
          pending = false;
        }
      });
      dialog.querySelectorAll("nav a").forEach((link, index) => {
        enterElement(link, {
          distance: 6,
          duration: tokens2.ui,
          delay: Math.min(index * tokens2.menuStep, tokens2.menuCap)
        });
      });
    });
    dialog.querySelector(".menu-close").addEventListener("click", () => closeMenu());
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeMenu();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const controls = [...dialog.querySelectorAll("a[href],button:not([disabled])")].filter(
        (el) => el.getClientRects().length
      );
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeMenu();
    });
    dialog.querySelectorAll("a").forEach(
      (link) => link.addEventListener("click", () => {
        returnFocus = false;
        closeMenu(true);
      })
    );
    dialog.addEventListener("close", () => {
      if (dialog.open) return;
      desired = false;
      pending = false;
      operation++;
      cancelParts();
      document.body.classList.remove("menu-open");
      dialog.classList.remove("is-closing");
      opener.setAttribute("aria-expanded", "false");
      if (returnFocus && opener.getClientRects().length) opener.focus({ preventScroll: true });
    });
    const desktop = matchMedia("(min-width: 1200px)");
    desktop.addEventListener("change", () => {
      closeServices();
      if (desktop.matches) closeMenu(true);
    });
  }
  var headerFrame = 0;
  var updateHeader = () => {
    headerFrame = 0;
    header?.classList.toggle("scrolled", scrollY > 8);
  };
  addEventListener(
    "scroll",
    () => {
      if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
    },
    { passive: true }
  );
  updateHeader();
  var current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach((link) => {
    const url = new URL(link.href);
    if (url.pathname.split("/").pop() === current && !url.hash) {
      link.setAttribute("aria-current", "page");
    }
  });
  var completeAnchorNavigation = initAnchorNavigation();
  initCookieBanner();
  configReady.then(initMotion).catch(() => {
    document.documentElement.dataset.motion = "off";
  }).then(completeAnchorNavigation);

  // js/form.js
  var form = document.querySelector("[data-audit-form]");
  var endpoint = new URL("../api/lead.php", localPreviewScriptURL);
  if (form && location.protocol === "file:") {
    form.querySelector("[type=submit]").disabled = true;
    form.querySelector("[role=status]").textContent = "Local preview: sending an enquiry is available when the site runs on PHP hosting.";
    form.addEventListener("submit", (event) => event.preventDefault());
  } else if (form) {
    const status2 = form.querySelector("[role=status]");
    const submit = form.querySelector("[type=submit]");
    let sending = false;
    let cfg;
    const say = (text, kind = "info") => {
      cancelElementMotion(status2);
      status2.textContent = text;
      status2.dataset.kind = kind;
      if (text && kind !== "info" && isMotionAllowed()) {
        const tokens2 = readMotionTokens();
        if (kind === "success") {
          animateElement(status2, [{ opacity: 0 }, { opacity: 1 }], {
            duration: tokens2.feedback
          });
        } else enterElement(status2, { duration: tokens2.feedback, distance: 0 });
      }
    };
    async function token() {
      const r = await fetch(endpoint, {
        credentials: "same-origin",
        cache: "no-store",
        signal: AbortSignal.timeout(1e4)
      });
      const data = await r.json();
      if (!r.ok || typeof data.csrf !== "string") throw new Error("Session unavailable");
      return data.csrf;
    }
    let csrfReady = token().catch(() => "");
    submit.disabled = true;
    async function connect() {
      try {
        const c = await configReady;
        cfg = c;
        submit.disabled = false;
        if (new URLSearchParams(location.search).get("need") === "tracking" && c.form.needs.includes(c.form.trackingNeed))
          form.elements.need.value = c.form.trackingNeed;
        say("");
      } catch {
      }
    }
    connect();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending || !cfg) return;
      if (!form.reportValidity()) return;
      sending = true;
      submit.disabled = true;
      submit.textContent = "Sending\u2026";
      form.setAttribute("aria-busy", "true");
      say("Sending your request\u2026");
      const data = new FormData(form);
      try {
        const csrf = await csrfReady || await token().catch(() => "");
        data.set("csrf", csrf);
        await fetch(endpoint, {
          method: "POST",
          body: data,
          credentials: "same-origin",
          signal: AbortSignal.timeout(15e3)
        });
      } catch {
      } finally {
        form.reset();
        say(cfg.content.success, "success");
        status2.focus();
        submit.textContent = cfg.content.submit;
        form.removeAttribute("aria-busy");
        csrfReady = token().catch(() => "");
        sending = false;
        submit.disabled = false;
      }
    });
  }

  // js/results.js
  var cards = [...document.querySelectorAll("article[data-category]")];
  var filters = document.querySelector("[data-case-filters]");
  var status = document.querySelector("[data-filter-status]");
  var empty = document.querySelector("[data-cases-empty]");
  configReady.then((config2) => {
    if (!filters || !status || !empty) return;
    const show = config2.features.showIllustrativeCases;
    filters.hidden = !show;
    empty.hidden = show;
    if (!show) {
      status.textContent = "Approved case studies will be added here.";
      return;
    }
    status.textContent = `${cards.length} illustrative case studies shown.`;
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      filters.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      cards.forEach((card) => {
        markRevealed(card);
        cancelElementMotion(card);
        card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) enterElement(card, { distance: 6, duration: readMotionTokens().ui });
      });
      const count = cards.filter((card) => !card.hidden).length;
      status.textContent = `${count} illustrative case ${count === 1 ? "study" : "studies"} shown.`;
    });
  }).catch(() => {
    if (filters) filters.hidden = true;
  });
})();
})();
