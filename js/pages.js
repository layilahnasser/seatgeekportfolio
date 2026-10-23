/* Page renderers — each HTML page sets <body data-page="..."> and this fills <main>. */
(function () {
  const P = window.PORTFOLIO;
  const me = P.profile;
  const { esc, t, isTodo, plain, img, ballSVG, logo, portrait } = window.LANES;
  const INL = window.INLINE || { logos: {}, sticker: "assets/img/layilah-sticker.png" };
  const main = document.getElementById("main");
  const page = document.body.dataset.page;

  // Section ids stay the same; only the visible names change per kind of project.
  const FRAME_KEYS = ["problem", "research", "define", "ideate", "iterate", "execution", "outcome"];
  const FRAME_SETS = {
    design: ["Problem", "Research", "Design Goals", "Wireframes", "Design System", "Final Design", "Reflection"]
  };
  // Research projects use their own seven frames and their own content fields (layout: "research")
  const RESEARCH_FRAMES = [
    { key: "problem", label: "Problem" },
    { key: "objectives", label: "Objectives" },
    { key: "methods", label: "Methods" },
    { key: "findings", label: "Findings" },
    { key: "insights", label: "Insights" },
    { key: "recommendations", label: "Recommendations" },
    { key: "impact", label: "Impact" }
  ];
  const framesFor = (p) => FRAME_KEYS.map((key, i) => ({ key, label: FRAME_SETS[p.frames || "design"][i] }));

  // A frame can hold one image or a list of images
  const imgs = (x, cls = "") => (!x ? "" : Array.isArray(x) ? x.map((i) => img(i, cls)).join("") : img(x, cls));

  // relative luminance, used to pick readable text on a color swatch
  const lum = (hex) => {
    const c = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };

  const brandBlock = (palette, typefaces) =>
    `<ul class="swatches" aria-label="Brand colors">${(palette || [])
      .map((c) => `<li style="--sw:${esc(c.hex)};--on:${(lum(c.hex) + 0.05) / 0.054 > 1.05 / (lum(c.hex) + 0.05) ? "#0d0a14" : "#fff"}"><b>${esc(c.name)}</b><span>${esc(c.hex)}</span></li>`)
      .join("")}</ul>${(typefaces || []).length ? `<ul class="typefaces">${typefaces.map((f) => `<li><span>${esc(f.role)}</span><strong>${esc(f.name)}</strong></li>`).join("")}</ul>` : ""}`;

  const listsBlock = (lists) =>
    (lists || []).map((l) => `<h3>${esc(l.heading)}</h3><ol class="insights">${l.items.map((x) => `<li>${t(x)}</li>`).join("")}</ol>`).join("");
  const mapBlock = (m) =>
    m
      ? `<h3>${esc(m.heading)}</h3><div class="goal-map">${m.rows
          .map((r) => `<div class="gm-row"><b>${esc(r.tag)}</b><div><p class="gm-need">${t(r.need)}</p><p class="gm-do">${t(r.design)}</p></div><span class="gm-where">${esc(r.where)}</span></div>`)
          .join("")}</div>`
      : "";

  const ext = (href, label) =>
    `<a href="${esc(href)}" target="_blank" rel="noopener">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;

  /* ---------- Project table (home): Focus / Approach / Case study ---------- */
  const STEPS = [
    { k: "Problem", t: "I start by naming the problem with the people closest to it, like why Root customers leave or why the USDA import portal is hard to use." },
    { k: "Research", t: "Interviews, surveys, and usability tests: 12 stakeholder and 6 customer interviews at Root, and 15+ interviews at USDA." },
    { k: "Define", t: "Affinity mapping groups what we heard into themes, like Root’s retention levers and USDA’s findability barriers." },
    { k: "Ideate", t: "Insight becomes ideas: 15 net-new retention concepts at Root, and five learning barriers turned into three product recommendations for ElevateED." },
    { k: "Iterate", t: "Refining the work: wireframes and a shared component library for Milk & Froth, and live usability testing at Root." },
    { k: "Execute", t: "Building the deliverable: final screens for Milk & Froth and Crown Code, and a centralized research repository at Root built with Claude Code." },
    { k: "Impact", t: "Sharing what changed: final shareouts to leadership at Root and Instructure, and recommendations now live on USDA’s national portal." }
  ];
  const pad = (n) => String(n).padStart(2, "0");
  function scoreboard() {
    return `
      <div class="scoreboard">
        <div class="sb-head" aria-hidden="true">
          <span class="sb-h-project">Project</span>
          <span class="sb-h"><small>Focus</small></span>
          <span class="sb-h"><small>Approach</small></span>
          <span class="sb-h"><small>Case study</small></span>
        </div>
        <ol class="sb-list">
        ${P.projects
          .map(
            (p, i) => `
          <li><a class="sb-row" href="project.html?p=${esc(p.id)}" style="--ball:${esc(p.ballColor)}">
            <span class="sb-project">${ballSVG(p.ballColor, "sb-ball")}<b class="sb-num"><span class="sr-only">Project </span>${pad(i + 1)}</b><span class="sb-title"><strong>${t(p.title)}</strong><small>${t(p.subtitle)}</small></span></span>
            <span class="sb-cell" data-label="Focus">${t(p.focus)}</span>
            <span class="sb-cell" data-label="Approach">${t(p.approach)}</span>
            <span class="sb-go"><span class="sb-btn">View case study <span aria-hidden="true">→</span></span></span>
          </a></li>`
          )
          .join("")}
        </ol>
      </div>`;
  }


  /* ---------- Pages ---------- */
  const pages = {
    home() {
      const cover = (p) => (p.hero && (p.hero.src || (p.hero.row && p.hero.row[0] && p.hero.row[0].src))) || "";
      const spark = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 4.4L14 7l-4.400 1.600L8 13l-1.600-4.400L2 7l4.400-1.600z" fill="currentColor"/></svg>';
      const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.500s-8-4.900-8-11A4.500 4.500 0 0 1 12 7a4.500 4.500 0 0 1 8 2.500c0 6.100-8 11-8 11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
      const QS = [
        ["Which project had the biggest outcome?", "outcome"],
        ["Show me interview research", "interviews"],
        ["Where did you use AI?", "ai"],
        ["What did you do at Root?", "root"],
        ["Best design work", "design"]
      ];
      return `
        <div class="fp">
          <h1 class="fp-h">Front-row seats to my projects.</h1>
          <p class="fp-sub">${esc(me.headline).replace("Google, Adobe &amp; Meta", `<span class="lg"><img src="${INL.logos.google}" alt="Google"></span><span class="lg"><img src="${INL.logos.adobe}" alt="Adobe"></span><span class="lg"><img src="${INL.logos.meta}" alt="Meta"></span>`)}</p>
          <form class="fp-search" id="fp-form" role="search">
            <svg class="fp-mag" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.500" cy="10.500" r="6" fill="none" stroke="currentColor" stroke-width="2.400"/><path d="M15 15l5 5" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/></svg>
            <label class="sr-only" for="fp-q">Search projects, or ask anything</label>
            <input id="fp-q" type="search" placeholder="Search projects, or ask anything" autocomplete="off">
            <button type="submit" class="fp-ask"><span class="fp-sp">${spark}</span> Ask</button>
          </form>
          <ul class="fp-chips" aria-label="Suggested questions">${QS.map(([q, k]) => `<li><button type="button" class="fp-chip" data-k="${k}"><span class="fp-sp">${spark}</span>${esc(q)}</button></li>`).join("")}</ul>
          <section class="fp-answer" id="fp-answer" aria-live="polite" tabindex="-1" hidden></section>

          <section class="fp-embed" aria-labelledby="seat-t">
            <h2 class="fp-embed-h" id="seat-t">Pick your seat</h2>
            ${pages.projects().replace(/<aside class="sg-notify"[\s\S]*?<\/aside>/, "")}
          </section>
          <p class="sr-only" id="fp-live" role="status" aria-live="polite"></p>
        </div>`;
    },

    projects() {
      const cover = (p) => (p.hero && (p.hero.src || (p.hero.row && p.hero.row[0] && p.hero.row[0].src))) || "";
      const META = {
        "root-insurance": { badge: ["15", "Figma concepts"], big: "18 sessions", small: "12 stakeholders + 6 customers", flag: "Most recent", ai: true, pin: [40, 89] },
        "usda-acir": { badge: ["3", "recommendations"], big: "15+ interviews", small: "10+ usability sessions", pin: [26, 6] },
        "instructure-elevated": { badge: ["3", "recommendations"], big: "10 interviews", small: "5 learning barriers", ai: true, pin: [70, 6] },
        "milk-and-froth": { badge: ["5", "pages designed"], big: "2 designers", small: "Jan–Mar 2026", pin: [18, 55] },
        "crown-code": { badge: ["4", "core tabs"], big: "Solo", small: "brief to final design", flag: "Solo project", pin: [84, 56] }
      };
      const metaOf = (p) => META[p.id] || { badge: ["", ""], big: p.year || "", small: p.focus || "", pin: [50, 50] };
      const bolt = '<svg viewBox="0 0 12 16" aria-hidden="true"><path d="M7 0L1 9h4l-1 7 7-10H7z" fill="currentColor"/></svg>';
      const row = (p) => {
        const m = metaOf(p);
        return `
        <li class="sg-row" data-id="${esc(p.id)}" data-layout="${esc(p.layout || "design")}" data-both="${p.id === "root-insurance" ? 1 : 0}" data-ai="${m.ai ? 1 : 0}" data-year="${esc(p.year || "")}">
          <span class="sg-thumb" aria-hidden="true">${cover(p) ? `<img src="${esc(cover(p))}" alt="" loading="lazy">` : ""}<i class="sg-m">LC</i></span>
          <div class="sg-main">
            <h2 class="sg-t"><a href="project.html?p=${esc(p.id)}">${t(p.title)}</a></h2>
            <p class="sg-meta">${esc(p.focus)} · ${esc(p.timeline || p.year || "")} <span class="sg-bolt" title="Full case study" aria-hidden="true">${bolt}</span></p>
            <p class="sg-tags">${m.badge[0] ? `<span class="sg-badge"><b>${esc(m.badge[0])}</b>${esc(m.badge[1])}</span>` : ""}${(p.tags || []).slice(0, 2).map((x) => `<span class="sg-tag">${esc(x)}</span>`).join("")}</p>
          </div>
          <div class="sg-side">
            <p class="sg-big">${esc(m.big)}</p>
            <p class="sg-small">${esc(m.small)}</p>
            ${m.flag ? `<p class="sg-flag${m.flag === "Solo project" ? " sg-flag--o" : ""}">${m.flag}</p>` : ""}
          </div>
        </li>`;
      };
      const STAGES = ["Problem", "Research", "Define", "Ideate", "Iterate", "Execute", "Impact"];
      const sticker = (window.INLINE && window.INLINE.sticker) || "assets/img/layilah-sticker.png";
      return `
        <h1 class="sr-only">${esc(me.firstName)} ${esc(me.lastName)}: ${esc(me.heroTitle)}</h1>
        <div class="sg-app">
          <section class="sg-list" aria-label="Projects">
            <div class="sg-chips" role="group" aria-label="Filter projects">
              <button type="button" class="sg-chip sg-chip--tune" data-chip="all" aria-label="Reset filters"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="15" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
              <button type="button" class="sg-chip is-on" data-chip="all" aria-pressed="true"><span id="sg-count">${P.projects.length}</span> projects</button>
              <button type="button" class="sg-chip" data-chip="research" aria-pressed="false">Research</button>
              <button type="button" class="sg-chip" data-chip="design" aria-pressed="false">Design</button>
              <button type="button" class="sg-chip" data-chip="ai" aria-pressed="false"><span class="sg-chip-ic">${bolt}</span> AI-assisted</button>
            </div>
            <div class="sg-sub">
              <p class="sg-official"><i class="sg-m sg-m--sm">LC</i> Official project marketplace of ${esc(me.firstName)} ${esc(me.lastName)}</p>
              <label class="sg-sort"><span class="sr-only">Sort projects</span><select id="sg-sort"><option value="top">Top picks</option><option value="new">Newest first</option><option value="old">Oldest first</option></select></label>
            </div>
            <ul class="sg-rows" id="rows">${P.projects.map(row).join("")}</ul>
            <p class="sg-empty" id="sg-empty" hidden>No projects match that filter.</p>
          </section>

          <section class="sg-map" id="sg-map" aria-label="Project map">
            <div class="sg-zoom"><button type="button" id="z-in" aria-label="Zoom in">+</button><button type="button" id="z-out" aria-label="Zoom out">−</button></div>
            <div class="sg-venue" id="sg-venue">
              <svg viewBox="0 0 900 680" aria-hidden="true" focusable="false">
                <path d="M70 130 H640 L700 70 H830 L850 110 V560 H70 Z" fill="#fff" stroke="#c9cce6" stroke-width="3"/>
                <g fill="#eef0f7" stroke="#b8bcd8" stroke-width="2">${STAGES.slice(0, 4).map((n, i) => `<rect x="${170 + i * 150}" y="150" width="120" height="70" rx="6"/>`).join("")}${STAGES.slice(4).map((n, i) => `<rect x="${230 + i * 170}" y="480" width="140" height="62" rx="6"/>`).join("")}<rect x="95" y="260" width="62" height="150" rx="6"/><rect x="760" y="260" width="62" height="150" rx="6"/></g>
                <g font-family="Manrope, sans-serif" font-size="15" font-weight="700" fill="#5b6270" text-anchor="middle">${STAGES.slice(0, 4).map((n, i) => `<text x="${230 + i * 150}" y="190">${i + 1} ${n}</text>`).join("")}${STAGES.slice(4).map((n, i) => `<text x="${300 + i * 170}" y="516">${i + 5} ${n}</text>`).join("")}</g>
                <rect x="200" y="250" width="500" height="200" rx="100" fill="#fff" stroke="#525c78" stroke-width="5"/>
                <line x1="450" y1="250" x2="450" y2="450" stroke="#d6393b" stroke-width="3" stroke-dasharray="7 6"/><line x1="360" y1="252" x2="360" y2="448" stroke="#2d57c9" stroke-width="3"/><line x1="540" y1="252" x2="540" y2="448" stroke="#2d57c9" stroke-width="3"/>
                <circle cx="450" cy="350" r="62" fill="none" stroke="#2d57c9" stroke-width="2.5"/>
                <circle cx="290" cy="300" r="34" fill="none" stroke="#d6393b" stroke-width="2"/><circle cx="290" cy="400" r="34" fill="none" stroke="#d6393b" stroke-width="2"/><circle cx="610" cy="300" r="34" fill="none" stroke="#d6393b" stroke-width="2"/><circle cx="610" cy="400" r="34" fill="none" stroke="#d6393b" stroke-width="2"/>
                <image href="${esc(sticker)}" x="378" y="288" width="144" height="124" preserveAspectRatio="xMidYMid meet"/>
              </svg>
              ${P.projects.map((p) => { const m = metaOf(p); return `<a class="sg-pin" href="project.html?p=${esc(p.id)}" data-id="${esc(p.id)}" style="left:${m.pin[0]}%;top:${m.pin[1]}%" aria-label="Open ${esc(plain(p.title))}: ${esc(m.big)}"><i></i><span class="sg-pt"><b>${esc(plain(p.title))}</b><span class="sg-pm">${esc(m.big)}</span></span></a>`; }).join("")}
            </div>
          </section>

          <aside class="sg-notify" id="sg-notify" aria-label="Say hello" hidden>
            <button type="button" class="sg-x" id="sg-x" aria-label="Close">✕</button>
            <h2>Want to talk about a role?</h2>
            <div class="sg-ncard"><span class="sg-nic" aria-hidden="true">${bolt}</span><div><b>${esc(me.firstName)} ${esc(me.lastName)}</b><small>${esc(me.title)} · ${esc(me.location)}</small></div></div>
            <div class="sg-nbtns"><a class="sg-btn" href="mailto:${esc(me.email)}">Email me</a><a class="sg-btn sg-btn--line" href="resume.html">View resume</a></div>
          </aside>
          <button type="button" class="sg-mapbtn" id="sg-mapbtn" aria-pressed="false">Map</button>
        </div>`;
    },

    about() {
      const A = P.about;
      const pill = (t) => `<span class="frame-pill">${t}</span>`;
      return `
        <section class="page-head page-head--split">
          <div>
            <p class="eyebrow">About Me · ${esc(A.kicker)}</p>
            <h1>${esc(A.title)} <span class="h1-sub">(${esc(A.pronunciation)})</span></h1>
            <p class="lede lede--big">${esc(A.lede)}</p>
          </div>
          ${portrait({ cls: "player-card--about", header: A.card.header, title: A.card.title, lines: A.card.lines, photo: A.card.photo, alt: A.card.photoAlt })}
        </section>

        <section class="section path-section" aria-labelledby="path-title">
          ${pill("My path")}
          <h2 id="path-title" class="h-md">${esc(A.path.heading)}</h2>
          <p class="path-lead">${esc(A.path.lead)}</p>
          <blockquote class="path-quote"><p>${esc(A.path.quote)}</p></blockquote>
          <p class="path-bridge">${esc(A.path.bridge)}</p>
          <div class="jmap-wrap">
            <ol class="jmap" style="--n:${A.path.steps.length}" aria-label="My path into UX, in order">
              <li class="jline" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
                <defs><linearGradient id="jmapG" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#ff2fb4"/><stop offset="1" stop-color="#27d9f5"/></linearGradient></defs>
                <polyline points="${A.path.steps.map((_, i) => `${(100 / (A.path.steps.length * 2)) * (2 * i + 1)},${i % 2 === 0 ? 30 : 70}`).join(" ")}" fill="none" stroke="url(#jmapG)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
              </svg></li>
              ${A.path.steps
                .map((st, i) => {
                  const up = i % 2 === 0;
                  return `<li class="jstep jstep--${up ? "up" : "down"}${i === A.path.steps.length - 1 ? " jstep--now" : ""}" style="--i:${i + 1}">
                    <div class="jcard"><h3>${esc(st.label)}</h3><p class="jorg">${esc(st.org)}</p><p>${esc(st.text)}</p></div>
                    <div class="jmark"><i class="jdot" aria-hidden="true"><b>${i + 1}</b></i></div>
                  </li>`;
                })
                .join("")}
            </ol>
          </div>
          <p class="path-turn">${esc(A.path.turn)}</p>
          <p class="path-extra">${esc(A.path.extra)}</p>
        </section>

        <section class="section" aria-labelledby="how-title">
          ${pill("Skills")}
          <h2 id="how-title" class="h-md">${esc(A.toolsHeading)}</h2>
          <ul class="tool-row" aria-label="Tools I use">${A.tools.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          <div class="cap-grid">
            ${A.capabilities.map((c) => `<article class="cap"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></article>`).join("")}
          </div>
          ${A.accessNote ? `<article class="a11y-note" id="accessibility" aria-labelledby="a11y-title"><h3 id="a11y-title">${esc(A.accessNote.title)}</h3><p>${esc(A.accessNote.text)}</p><ul>${A.accessNote.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article>` : ""}
        </section>

        <section class="section" aria-labelledby="edu-title">
          ${pill("Education")}
          <h2 id="edu-title" class="h-md">${esc(A.educationHeading)}</h2>
          <div class="edu-grid">
            ${A.education
              .map((e) => `<article class="edu"><h3>${esc(e.school)}</h3><p class="edu-program">${esc(e.program)}</p><p>${esc(e.text)}</p></article>`)
              .join("")}
          </div>
        </section>

        <section class="section" aria-labelledby="more-title">
          ${pill("Beyond UX")}
          <h2 id="more-title" class="h-md">${esc(A.moreHeading)}</h2>
          <div class="more-grid">
            ${A.more
              .map((m) => `<article class="more"><p class="more-v">${esc(m.value)}</p><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></article>`)
              .join("")}
          </div>
          <article class="league">
            <figure class="league-photo"><img src="${esc(A.league.image.src)}" alt="${esc(A.league.image.alt)}" width="536" height="524" loading="lazy"></figure>
            <div class="league-body">
                            <h3>${esc(A.league.title)}</h3>
              <p>${esc(A.league.text)}</p>
              ${A.league.tie ? `<p class="league-tie">${esc(A.league.tie)}</p>` : ""}
            </div>
          </article>
        </section>

        <section class="section cta-band">
          <p>Want to talk about research, design, or a role?</p>
          <div class="cta-actions">
            <a class="btn btn--ghost" href="contact.html">Get in touch</a>
            <a class="btn btn--pink" href="work.html">See my work</a>
          </div>
        </section>`;
    },

    work() {
      return `
        <section class="page-head">
          <p class="eyebrow">My Work</p>
          <h1>Selected work</h1>
          <p class="lede">Explore my UX research and design work. See how I turn questions into insights and insights into better experiences.</p>
        </section>
        <section class="section" aria-label="Case studies">
          <h2 class="work-label">Featured projects</h2>
          <div class="rack rack--featured">
            ${P.projects
              .slice(0, 3)
              .map(
                (p, i) => `
              <a class="rack-card" href="project.html?p=${esc(p.id)}" style="--ball:${esc(p.ballColor)}">
                <div class="rack-media" aria-hidden="true">${(p.hero?.src || p.hero?.row?.[0]?.src) ? `<img src="${esc(p.hero.src || p.hero.row[0].src)}" alt="" loading="lazy"${(p.hero.row || ["phone", "phones"].includes(p.hero.fit)) ? ' class="rack-img--contain"' : ""}>` : ""}</div>
                <div class="rack-body">
                  <div class="rack-head">
                    <span class="rack-ballwrap" aria-hidden="true"><span class="rack-ball"></span><b class="rack-num">${i + 1}</b></span>
                    <div>
                      <p class="rack-lane">Project ${i + 1}${p.year ? " · " + esc(p.year) : ""}</p>
                      <h3>${t(p.title)}</h3>
                    </div>
                  </div>
                  <p>${t(p.summary || p.subtitle)}</p>
                  <span class="rack-go">View case study <span aria-hidden="true">→</span></span>
                </div>
              </a>`
              )
              .join("")}
          </div>
          <h2 class="work-label work-label--more">More research</h2>
          <div class="work-rows">
            ${P.projects
              .slice(3)
              .map(
                (p, k) => `
              <a class="work-row" href="project.html?p=${esc(p.id)}" style="--ball:${esc(p.ballColor)}">
                <div class="work-row-img" aria-hidden="true">${p.hero?.src ? `<img src="${esc(p.hero.src)}" alt="" loading="lazy">` : ""}</div>
                <div class="work-row-tx">
                  <span class="rack-ballwrap" aria-hidden="true"><span class="rack-ball"></span><b class="rack-num">${k + 4}</b></span>
                  <div>
                    <p class="rack-lane">Project ${k + 4}${p.year ? " · " + esc(p.year) : ""}</p>
                    <h3>${t(p.title)}</h3>
                    <p>${t(p.summary || p.subtitle)}</p>
                  </div>
                </div>
                <span class="work-row-go">View <span aria-hidden="true">→</span></span>
              </a>`
              )
              .join("")}
          </div>
        </section>`;
    },

    resume() {
      const R = P.resume;
      const item = (x) => `<li>
          <div class="tl-head"><h3>${t(x.role)}</h3><span class="tl-dates">${t(x.dates)}</span></div>
          <p class="tl-org">${t(x.org)}</p>
          <ul>${x.points.map((pt) => `<li>${t(pt)}</li>`).join("")}</ul>
        </li>`;
      return `
        <section class="page-head page-head--row">
          <div>
            <p class="eyebrow">Resume</p>
            <h1>Career scorecard</h1>
            <p class="lede">${t(R.summary)}</p>
          </div>
          <a class="btn btn--pink" href="${esc(me.resumePdf)}" download>Download PDF</a>
        </section>
        <section class="section resume-grid">
          <div>
            ${R.sections.map((s) => `<h2 class="h-sm">${esc(s.title)}</h2><ol class="timeline">${s.items.map(item).join("")}</ol>`).join("")}
            <h2 class="h-sm">Education</h2>
            <ol class="timeline">
              ${R.education
                .map(
                  (e) => `<li><div class="tl-head"><h3>${t(e.degree)}</h3><span class="tl-dates">${t(e.dates)}</span></div><p class="tl-org">${t(e.school)}${e.detail ? ` · ${esc(e.detail)}` : ""}</p></li>`
                )
                .join("")}
            </ol>
          </div>
          <aside class="skills" aria-label="Skills and coursework">
            <h2 class="h-sm">Skills &amp; tools</h2>
            ${Object.entries(R.skills)
              .map(([k, list]) => `<div class="skill-block"><h3>${esc(k)}</h3><ul class="tags">${list.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>`)
              .join("")}
            <h2 class="h-sm h-sm--gap">Coursework</h2>
            <ul class="tags">${R.coursework.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
          </aside>
        </section>`;
    },

    contact() {
      const rows = [
        me.email && ["Email", `<a href="mailto:${esc(me.email)}">${esc(me.email)}</a>`],
        me.phone && ["Phone", `<a href="tel:+1${esc(me.phone.replace(/\D/g, ""))}">${esc(me.phone)}</a>`],
        me.linkedin && ["LinkedIn", ext(me.linkedin, esc(me.linkedin.replace(/^https?:\/\/(www\.)?/, "")))],
        me.location && ["Location", esc(me.location)]
      ].filter(Boolean);
      return `
        <section class="page-head page-head--contact">
          <p class="eyebrow">Contact</p>
          <h1>Let’s talk</h1>
          <p class="lede">I’d love to talk about research, design, and how I can help build experiences people love.</p>
          <dl class="contact-list">
            ${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
          </dl>
        </section>`;
    },

    project() {
      const id = new URLSearchParams(location.search).get("p");
      const idx = Math.max(0, P.projects.findIndex((p) => p.id === id));
      const p = P.projects[idx];
      const next = P.projects[(idx + 1) % P.projects.length];
      const isLast = idx === P.projects.length - 1;
      const isResearch = p.layout === "research";
      const FRAMES = isResearch ? RESEARCH_FRAMES : framesFor(p);
      document.title = `${plain(p.title)} — ${me.firstName} ${me.lastName}`;

      const frameHead = (n, title) =>
        `<header class="frame-head"><span class="frame-no">Step ${n}</span><h2>${title}</h2></header>`;


      const gallery = (designs) =>
        (designs || [])
          .map(
            (d) => `<article class="design-block"><h3 class="design-label">${esc(d.label)}</h3><div class="design-shots${d.images.length > 1 ? " design-shots--multi" : ""}">${imgs(d.images)}</div></article>`
          )
          .join("");
      const cards = (items) =>
        (items || []).length
          ? `<div class="decision-grid">${items.map((d, i) => `<div class="decision"><span class="card-num">0${i + 1}</span><h4>${t(d.title)}</h4><p>${t(d.why)}</p></div>`).join("")}</div>`
          : "";
      /* Concise, screenshot-led research layout: one line + chips + images up top, full write-up folded under "Read the details". */
      const first = (x) => String(x || "").split(/(?<=[.?!])\s+/)[0];
      const rest = (x) => String(x || "").split(/(?<=[.?!])\s+/).slice(1).join(" ");
      const rp = (x) => (rest(x) ? `<p>${t(rest(x))}</p>` : "");
      const more = (html) => (html.trim() ? `<details class="more"><summary>Read the details</summary><div class="more-body">${html}</div></details>` : "");
      const chips = (arr) => ((arr || []).length ? `<ul class="chips" role="list">${arr.map((c) => `<li class="chip">${t(c)}</li>`).join("")}</ul>` : "");
      const grid = (x) => {
        const list = !x ? [] : Array.isArray(x) ? x : [x];
        return list.length ? `<div class="glance-grid glance-grid--${Math.min(list.length, 3)}">${list.map((i) => img(i, "")).join("")}</div>` : "";
      };
      const researchBody = isResearch
        ? (() => {
            const rec = p.recommendations || {};
            const imp = p.impact || {};
            const mapRows = (rec.map && rec.map.rows) || [];
            const designs = (rec.designs || []).map((d) => {
              const row = mapRows.find((r) => r.tag === d.label);
              return `<figure class="concept"><div class="concept-img">${imgs(d.images)}</div><figcaption>${row ? `<span class="heard">${t(first(row.need))}</span>` : ""}<strong>${esc(d.label)}</strong></figcaption></figure>`;
            });
            const decisions = imp.decisions || [];
            return `
              <section id="problem" class="frame">
                ${frameHead(1, FRAMES[0].label)}
                <p class="callout"><span class="callout-label">Research question</span>${t(p.problem.statement)}</p>
                ${more(`<h3>Context</h3><p>${t(p.problem.context)}</p>${p.problem.challenge ? `<h3>The challenge</h3><p>${t(p.problem.challenge)}</p>` : ""}<h3>My role</h3><p>${t(p.problem.role)}</p>`)}
              </section>

              <section id="objectives" class="frame">
                ${frameHead(2, FRAMES[1].label)}
                <p class="glance">${t(first(p.objectives.summary))}</p>
                <ol class="obj-grid${p.objectives.items.length === 3 ? " obj-grid--three" : ""}">${p.objectives.items.map((x, i) => `<li><span class="card-num">0${i + 1}</span>${typeof x === "string" ? t(x) : `<strong class="obj-title">${t(x.title)}</strong><span class="obj-text">${t(x.text)}</span>`}</li>`).join("")}</ol>
              </section>

              <section id="methods" class="frame">
                ${frameHead(3, FRAMES[2].label)}
                <p class="glance">${t(first(p.methods.summary))}</p>
                ${chips(p.methods.items.map((m) => m.name))}
                ${grid(p.methods.image)}
                ${more(`<div class="method-grid">${p.methods.items.map((m) => `<div class="method"><h3>${t(m.name)}</h3><p>${t(m.detail)}</p></div>`).join("")}</div>`)}
              </section>

              <section id="findings" class="frame">
                ${frameHead(4, FRAMES[3].label)}
                <p class="glance">${t(first(p.findings.summary))}</p>
                ${p.findings.callout ? `<p class="callout">${t(p.findings.callout)}</p>` : ""}
                ${grid(p.findings.image)}
                ${more(`${rp(p.findings.summary)}<h3>What we observed</h3><ol class="insights">${p.findings.items.map((x) => `<li>${t(x)}</li>`).join("")}</ol>`)}
              </section>

              <section id="insights" class="frame">
                ${frameHead(5, FRAMES[4].label)}
                <p class="glance">${t(first(p.insights.summary))}</p>
                ${chips(((p.insights.lists || [])[0] || { items: [] }).items.map(first))}
                ${grid(p.insights.image)}
                ${more(`${rp(p.insights.summary)}${listsBlock(p.insights.lists)}`)}
              </section>

              <section id="recommendations" class="frame">
                ${frameHead(6, FRAMES[5].label)}
                <p class="glance">${t(first(rec.summary))}</p>
                ${designs.length ? `<div class="concept-grid">${designs.join("")}</div>` : ""}
                ${grid(rec.image)}
                ${more(`${mapBlock(rec.map)}`)}
              </section>

              <section id="impact" class="frame">
                ${frameHead(7, FRAMES[6].label)}
                <div class="results">${(imp.results || []).map((r) => `<div class="result"><strong>${t(r.value)}</strong><span>${esc(r.label)}</span></div>`).join("")}</div>
                ${decisions.length ? `<h3 class="strikes-h">${esc(imp.decisionsHeading || "Decisions influenced")}</h3><ol class="strikes">${decisions.map((d, i) => `<li class="strike"><span class="strike-x" aria-hidden="true">✓</span><div class="strike-tx"><span class="strike-n">Outcome ${i + 1}</span><h4>${t(d.title)}</h4><p>${t(d.statement || first(d.why))}</p></div></li>`).join("")}</ol>` : ""}
                ${grid(imp.image)}
                ${imp.imageCaption ? `<p class="grid-caption">${t(imp.imageCaption)}</p>` : ""}
                ${imp.quote ? `<figure class="pull-quote"><blockquote><p>\u201C${t(imp.quote.text)}\u201D</p></blockquote><figcaption>${t(imp.quote.source)}</figcaption></figure>` : ""}
                ${(imp.documents || []).length ? `<div class="docs"><h3>Deck and paper</h3><ul class="doc-list">${imp.documents.map((x) => `<li><a class="btn btn--ghost" href="${esc(x.file)}" target="_blank" rel="noopener">${esc(x.title)}<span class="sr-only"> (opens in a new tab)</span></a><span>${esc(x.note || "")}</span></li>`).join("")}</ul></div>` : ""}
                ${more(`${decisions.filter((d) => d.statement || rest(d.why)).length ? `<h3>${esc(imp.decisionsHeading || "Decisions influenced")}</h3>${cards(decisions.filter((d) => d.statement || rest(d.why)))}` : ""}${imp.reflection ? `<h3>Reflection</h3><p>${t(imp.reflection)}</p>` : ""}`)}
              </section>
`;
          })()
        : "";

      const ok = (x) => (x && !/^TODO/.test(x) ? x : "");
      const swatch = (c, extra = "") => `<li class="ds-sw" style="--sw:${esc(c.hex)};--on:${(lum(c.hex) + 0.05) / 0.054 > 1.05 / (lum(c.hex) + 0.05) ? "#0d0a14" : "#fff"}"><b>${esc(c.step || c.name)}</b><span>${esc(c.hex)}</span></li>`;
      const dsBlock = (ds) => {
        if (!ds) return "";
        let n = 0;
        const sec = (title, small, body) => (body ? `<h3 class="ds-h"><span class="ds-n">${++n}</span> ${title}${small ? ` <small>${small}</small>` : ""}</h3>${body}` : "");
        const one = (im) => (im && (im.src || im.video || im.embed) ? img(im) : "");
        return `<div class="ds">
          ${ds.intro ? `<p class="glance">${t(ds.intro)}</p>` : ""}
          ${sec("Brand colors", "", ds.brand ? brandBlock(ds.brand, ds.typefaces) : "")}
          ${sec("Color system", "primitives and semantic tokens", one(ds.colorImage))}
          ${sec("Typography", "tap to open full size", ds.typography && (ds.typography.src) ? `<div class="ds-type">${img(ds.typography)}</div>` : "")}
          ${sec("Buttons", "", one(ds.buttons))}
          ${sec("Components", "", one(ds.components))}
        </div>`;
      };
      const designBody = isResearch ? "" : (() => {
        const ex = p.execution || {};
        const goalCards = p.define.goalCards || [];
        const rIters = p.iterations || [];
        const iterImgs = rIters.flatMap((it) => (Array.isArray(it.image) ? it.image : it.image ? [it.image] : [])).filter((i) => i && (i.src || i.video || i.embed));
        const rMethods = ((p.research && p.research.methods) || []).filter((m) => ok(m.name));
        const rInsights = ((p.research && p.research.insights) || []).filter(ok);
        const palette = ex.palette || (rIters.find((it) => it.palette) || {}).palette;
        const typefaces = ex.typefaces || (rIters.find((it) => it.typefaces) || {}).typefaces;
        return `
              <section id="problem" class="frame">
                ${frameHead(1, FRAMES[0].label)}
                <p class="callout">${t(p.problem.statement)}</p>
                ${p.problem.contribution ? `<div class="contrib"><b>My contribution</b><p>${t(p.problem.contribution)}</p></div>` : ""}
                ${more(`<h3>How I identified it</h3><p>${t(p.problem.context)}</p><h3>Goal</h3><p>${t(p.problem.goal)}</p>`)}
              </section>

              <section id="research" class="frame">
                ${frameHead(2, FRAMES[1].label)}
                ${ok(p.research.summary) ? `<p class="glance">${t(first(p.research.summary))}</p>` : ""}
                ${chips(rMethods.map((m) => m.name))}
                ${p.research.competitors ? (() => { const k = p.research.competitors; const mark = (v) => (v ? `<span aria-hidden="true">\u2713</span><span class="sr-only">Yes</span>` : `<span aria-hidden="true">\u2013</span><span class="sr-only">No</span>`); return `<div class="comp"><h3>${esc(k.heading)}</h3><p class="glance">${t(k.intro)}</p><div class="comp-cards">${k.items.map((i) => `<article class="comp-card"><small>${esc(i.tag)}</small><h4>${esc(i.name)}</h4><p>${t(i.text)}</p></article>`).join("")}</div><div class="comp-wrap" tabindex="0" role="region" aria-label="${esc(k.matrixHeading)} table, scrolls sideways on small screens"><table class="comp-table"><caption>${esc(k.matrixHeading)}</caption><thead><tr><th scope="col"><span class="sr-only">Feature</span></th>${k.cols.map((c, i) => `<th scope="col"${i === k.cols.length - 1 ? ' class="comp-us"' : ""}>${esc(c)}</th>`).join("")}</tr></thead><tbody>${k.rows.map((r) => `<tr><th scope="row">${esc(r.label)}</th>${r.has.map((v, i) => `<td class="${v ? "yes" : "no"}${i === r.has.length - 1 ? " comp-us" : ""}">${mark(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><div class="contrib"><b>Crown Code differentiator</b><p>${t(k.differentiator)}</p></div></div>`; })() : ""}
                ${grid(p.research.image)}
                ${more(`${rp(p.research.summary)}<div class="method-grid">${p.research.methods.map((m) => `<div class="method"><h3>${t(m.name)}</h3><p>${t(m.detail)}</p></div>`).join("")}</div>${rInsights.length ? `<h3>Key insights</h3><ol class="insights">${rInsights.map((x) => `<li>${t(x)}</li>`).join("")}</ol>` : ""}`)}
              </section>

              <section id="define" class="frame">
                ${frameHead(3, FRAMES[2].label)}
                ${goalCards.length ? `<div class="obj-grid obj-grid--3">${goalCards.map((g) => `<div class="goal-mini"><span class="card-num">${esc(g.tag)}</span>${t(g.text)}</div>`).join("")}</div>` : p.define.callout ? `<p class="callout">${t(p.define.callout)}</p>` : ""}
                ${grid(p.define.image)}
                ${more(`${p.define.callout && goalCards.length ? `<p class="callout">${t(p.define.callout)}</p>` : ""}${p.define.persona || p.define.journey ? `<div class="two-col"><div><h3>Who we’re designing for</h3><p>${t(p.define.persona)}</p></div><div><h3>Where it breaks down</h3><p>${t(p.define.journey)}</p></div></div>` : ""}${p.define.painPoints ? `<h3>${esc(p.define.painPointsHeading || "Common pain points")}</h3><ol class="insights">${p.define.painPoints.map((x) => `<li>${t(x)}</li>`).join("")}</ol>` : ""}${listsBlock(p.define.lists)}${mapBlock(p.define.map)}`)}
              </section>

              <section id="ideate" class="frame">
                ${frameHead(4, FRAMES[3].label)}
                ${ok(p.ideate.summary) ? `<p class="glance">${t(first(p.ideate.summary))}</p>` : ""}
                ${p.ideate.callout ? `<p class="callout">${t(p.ideate.callout)}</p>` : ""}
                ${grid(p.ideate.image)}
                ${more(`${ok(p.ideate.summary) ? rp(p.ideate.summary) : ""}${listsBlock(p.ideate.lists)}`)}
              </section>

              <section id="iterate" class="frame">
                ${frameHead(5, FRAMES[4].label)}
                ${p.designSystem ? dsBlock({ ...p.designSystem, brand: palette, typefaces }) : `${palette ? brandBlock(palette, typefaces) : ""}${grid(iterImgs)}`}
                ${more(`<ol class="iterations">${rIters.map((it) => `<li class="iteration"><div class="iteration-text"><h3>${t(it.version)}</h3>${ok(it.change) ? `<p><b>${esc((p.iterLabels || ["What changed", "What testing showed"])[0])}:</b> ${t(it.change)}</p>` : ""}${ok(it.feedback) ? `<p><b>${esc((p.iterLabels || ["What changed", "What testing showed"])[1])}:</b> ${t(it.feedback)}</p>` : ""}</div></li>`).join("")}</ol>`)}
              </section>

              <section id="execution" class="frame">
                ${frameHead(6, FRAMES[5].label)}
                ${ok(ex.summary) ? `<p class="glance">${t(first(ex.summary))}</p>` : ""}
                ${(ex.newPages || []).length ? `<h3>${esc(ex.newPagesHeading || "New pages")}</h3>${ex.newPagesNote ? `<p>${t(ex.newPagesNote)}</p>` : ""}<ul class="chips" role="list">${ex.newPages.map((n) => `<li class="chip"><span class="frame-no">New</span> ${esc(n)}</li>`).join("")}</ul>` : ""}
                ${(ex.designs || []).length && (ex.darkMode || (ex.darkScreens || []).length) ? `<h3 class="mode-h">Light mode</h3>` : ""}
                ${(ex.designs || []).length ? `<div class="design-grid">${(ex.designs || []).map((d) => d.phones ? `<article class="design-cell design-cell--phones"><h3 class="design-label">${d.isNew ? `<span class="frame-no">New</span> ` : ""}${esc(d.label)}</h3>${img({ row: d.images })}</article>` : `<article class="design-cell"><h3 class="design-label">${d.isNew ? `<span class="frame-no">New</span> ` : ""}${esc(d.label)}</h3>${imgs(d.images)}</article>`).join("")}</div><p class="hint">Tap a screen to open it full size.</p>` : ""}
                ${ex.darkMode || (ex.darkScreens || []).length ? `<h3 class="mode-h">Dark mode</h3>${ex.darkMode ? `<div class="ds-dark">${img(ex.darkMode)}</div>` : ""}${(ex.darkScreens || []).length ? img({ row: ex.darkScreens.map((d) => ({ ...d, fit: "phone" })) }) : ""}` : ""}
                ${(ex.goals || []).map((g) => `<article class="goal-card"><header class="goal-head"><span class="frame-no">${esc(g.tag)}</span><p class="goal-statement">${esc(g.title || g.statement)}</p></header><div class="goal-body${g.images ? " goal-body--shot" : ""}"><p class="goal-why">${t(g.why)}</p>${g.images ? `<div class="goal-shots">${imgs(g.images)}</div>` : ""}</div>${g.before && g.after ? `<div class="compare-pair"><div class="cmp-col"><p class="cmp-tag">Before</p>${img(g.before)}</div><div class="cmp-col"><p class="cmp-tag cmp-tag--after">After</p>${img(g.after)}</div></div>` : ""}</article>`).join("")}
                ${(ex.images || []).length ? `<div class="shots">${ex.images.map((im) => img(im)).join("")}</div>` : ""}
                ${ex.compare ? `<h3>Before and after</h3>${ex.compare.map((c) => `<div class="compare"><p class="compare-label">${esc(c.label)}</p><div class="compare-pair">${img(c.before)}${img(c.after)}</div></div>`).join("")}` : ""}
                ${ex.prototypeUrl ? `<p>${ext(ex.prototypeUrl, "Open prototype ↗").replace("<a ", '<a class="btn btn--ghost" ')}</p>` : ""}
                ${(ex.decisions || []).length ? `<h3>${esc(ex.decisionsHeading || "Why it looks and works this way")}</h3><div class="decision-grid">${ex.decisions.map((d, i) => `<div class="decision"><span class="card-num">0${i + 1}</span><h4>${t(d.title)}</h4><p>${t(d.why)}</p></div>`).join("")}</div>` : ""}
                ${(ex.screenReasons || []).length ? `<h3>${esc(ex.screenReasonsHeading || "Why each screen works this way")}</h3><dl class="screen-reasons">${ex.screenReasons.map((d) => `<div><dt>${t(d.screen)}</dt><dd>${t(d.why)}</dd></div>`).join("")}</dl>` : ""}
                ${more(`${ok(ex.summary) ? rp(ex.summary) : ""}${mapBlock(ex.map)}`)}
              </section>

              <section id="outcome" class="frame">
                ${frameHead(7, FRAMES[6].label)}
                ${ok(p.outcome.reflection) ? `<p class="glance">${t(p.outcome.reflection)}</p>` : ""}
                <div class="results">${p.outcome.results.map((r) => `<div class="result"><strong>${t(r.value)}</strong><span>${esc(r.label)}</span></div>`).join("")}</div>
                ${p.outcome.compare ? p.outcome.compare.map((c) => `<div class="compare compare--page"><p class="compare-label">${c.goal ? `<span class="frame-no">${esc(c.goal)}</span> ` : ""}${esc(c.label)}</p><div class="compare-pair${c.before ? "" : " compare-pair--single"}">${c.before ? `<div class="cmp-col"><p class="cmp-tag">Before</p>${img(c.before)}</div>` : ""}<div class="cmp-col"><p class="cmp-tag cmp-tag--after">After</p><div class="cmp-after${Array.isArray(c.after) ? " cmp-after--multi" : ""}">${imgs(c.after)}</div></div></div>${c.why ? `<div class="cmp-why"><b>What changed and why</b><p>${t(c.why)}</p></div>` : ""}</div>`).join("") : ""}
                
              </section>
`;
      })();

      return `
        <article class="case" style="--ball:${esc(p.ballColor)}">
          <header class="case-hero">
            <a class="back" href="projects.html"><span aria-hidden="true">◂</span> All projects</a>
            <div class="case-title">
              ${ballSVG(p.ballColor, "case-ball")}
              <div>
                <p class="eyebrow">Case study ${idx + 1}${p.year ? " · " + esc(p.year) : ""}</p>
                <h1>${t(p.title)}</h1>
                <p class="lede">${t(p.subtitle)}</p>
                ${p.intro ? `<p class="case-intro">${t(p.intro)}</p>` : ""}
              </div>
            </div>
            ${img(p.hero, "shot--hero" + (p.hero && p.hero.fit === "phone" ? " shot--phone" : ""))}
            <dl class="case-meta">
              <div><dt>Role</dt><dd>${t(p.role)}</dd></div>
              <div><dt>Team</dt><dd>${String(p.team).split("\n").map((l) => t(l)).join("<br>")}</dd></div>
              <div><dt>Timeline</dt><dd>${t(p.timeline)}</dd></div>
              <div><dt>${esc(p.toolsLabel || "Tools & methods")}</dt><dd>${String(p.tools).split("\n").map((l) => t(l)).join("<br>")}</dd></div>
            </dl>
            ${p.glance ? `<ul class="glance-boxes" aria-label="Case study at a glance">${[["Problem", p.glance.problem], ["What I did", p.glance.did], ["What changed", p.glance.changed]].map(([k, v]) => `<li><b>${k}</b><span>${t(v)}</span></li>`).join("")}</ul>` : ""}
            <div class="expand-bar"><p>Skim the summaries, or open every section to see the methods, evidence, and reasons behind them.</p><button type="button" class="expand-all" aria-pressed="false">Open all details</button></div>
          </header>

          <nav class="fstrip-nav" aria-label="Case study frames"><span class="fprog" id="fprog" aria-hidden="true"></span>
            <ol class="fstrip">${FRAMES.map((f, i) => `<li class="fcell"><a href="#${f.key}" data-frame="${f.key}"><span class="fn">${i + 1}<span class="fl"> ${f.label}</span></span><span class="fm" aria-hidden="true"></span><span class="sr-only fstate"></span></a></li>`).join("")}</ol>
          </nav>

          <div class="case-layout">
            <div class="case-body">
              ${isResearch ? researchBody : designBody}

              <section class="strike-panel" id="strike" aria-labelledby="strike-title">
                <h2 id="strike-title" class="sp-big">${isLast ? "Thanks for reading" : "Next project"}</h2>
                ${
                  isLast
                    ? `<p>That was the last case study.</p>
                <div class="sp-btns"><a class="btn btn--pink" href="work.html">Back to all projects</a><a class="btn btn--ghost" href="contact.html">Get in touch</a></div>`
                    : `<p>You finished: ${esc(plain(p.title))}. Up next: ${esc(plain(next.title))}.</p>
                <div class="sp-btns"><a class="btn btn--pink" href="project.html?p=${esc(next.id)}">${esc(plain(next.title))} <span aria-hidden="true">→</span></a><a class="btn btn--ghost" href="work.html">Back to all projects</a></div>`
                }
              </section>
            </div>
          </div>
        </article>`;
    }
  };

  if (pages[page]) main.innerHTML = pages[page]();

  /* ---------- Page behaviours ---------- */
  if (page === "home") {
    const byId = (id) => P.projects.find((x) => x.id === id);
    const lnk = (id, label) => `<a href="project.html?p=${esc(id)}">${esc(label || plain(byId(id).title))}</a>`;
    const ANS = {
      outcome: { h: "Which project had the biggest outcome?", t: `Two stand out. At <b>Root Insurance</b>, the research produced <b>15 net-new retention concepts</b>, shared out in three executive readouts, plus a centralized research repository. For the <b>USDA ACIR portal</b>, the work ended in <b>three recommendations, and new features now live on USDA’s national portal</b>.`, ids: ["root-insurance", "usda-acir"] },
      interviews: { h: "Show me interview research", t: `<b>Root Insurance:</b> 12 stakeholder and 6 customer interviews. <b>USDA ACIR:</b> 15+ interviews with importers, brokers, and officials. <b>Instructure ElevateED:</b> 10 interviews with learners, HR professionals, and an Instructure partner.`, ids: ["root-insurance", "usda-acir", "instructure-elevated"] },
      ai: { h: "Where did you use AI?", t: `For <b>Instructure ElevateED</b>, I built the recommendations as prototypes with AI-assisted prototyping in Figma Make. For <b>Root Insurance</b>, I built a centralized research repository with Claude Code so teams could find user insights.`, ids: ["instructure-elevated", "root-insurance"] },
      root: { h: "What did you do at Root?", t: `As a UX research intern, I ran an end-to-end mixed-methods study across <b>18 sessions</b> (12 stakeholder and 6 customer interviews, plus live usability testing), delivered <b>three executive readouts</b> to leaders including the Director of Design and the SVP of Product, turned the findings into <b>15 retention concepts in Figma</b>, and built the research repository.`, ids: ["root-insurance"] },
      design: { h: "Best design work", t: `<b>Crown Code</b> is a pageant interview-prep app I designed solo, from the design system to every screen. <b>Milk & Froth</b> is a website redesign where I built the design system first, then designed the location, e-commerce, and 404 pages as one of two designers.`, ids: ["crown-code", "milk-and-froth"] }
    };
    const box = document.getElementById("fp-answer"), live = document.getElementById("fp-live"), input = document.getElementById("fp-q");
    const show = (a, lead) => {
      box.innerHTML = `<div class="fp-ans-top"><span class="fp-sp">${'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 4.4L14 7l-4.400 1.600L8 13l-1.600-4.400L2 7l4.400-1.600z" fill="currentColor"/></svg>'}</span><h2>${lead || a.h}</h2><button type="button" class="fp-close" aria-label="Close answer">✕</button></div><p>${a.t}</p><ul class="fp-ans-links">${a.ids.map((id) => `<li>${lnk(id)}</li>`).join("")}</ul><p class="fp-note">Written from my case studies, not generated live.</p>`;
      box.hidden = false; box.focus({ preventScroll: false }); box.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      box.querySelector(".fp-close").addEventListener("click", () => { box.hidden = true; input.focus(); });
      live.textContent = "Answer shown";
    };
    document.querySelectorAll(".fp-chip").forEach((c) => c.addEventListener("click", () => { input.value = c.textContent.trim(); show(ANS[c.dataset.k]); }));
    const KW = [["outcome", /outcome|biggest|impact|result/i], ["interviews", /interview/i], ["ai", /\bai\b|figma make|claude|artificial/i], ["root", /root/i], ["design", /design|ui|app|website/i]];
    document.getElementById("fp-form").addEventListener("submit", (e) => {
      e.preventDefault(); const q = input.value.trim(); if (!q) return;
      const hit = KW.find(([, re]) => re.test(q));
      const matches = P.projects.filter((x) => [plain(x.title), x.focus, (x.tags || []).join(" "), x.summary || "", x.approach || ""].join(" ").toLowerCase().includes(q.toLowerCase()));
      if (matches.length && !(hit && q.length > 12)) show({ t: `${matches.length === 1 ? "One project matches" : matches.length + " projects match"} “${esc(q)}”.`, ids: matches.map((m) => m.id) }, `Results for “${esc(q)}”`);
      else if (hit) show(ANS[hit[0]]);
      else show({ t: `I don’t have a written answer for that yet. Try one of the suggestions above, or <a href="projects.html">browse all the projects</a>, or <a href="contact.html">ask me directly</a>.`, ids: [] }, "No match");
    });
  }

  if (page === "projects" || page === "home") {
    const rows = document.getElementById("rows"), empty = document.getElementById("sg-empty"), cnt = document.getElementById("sg-count");
    const chips = [...document.querySelectorAll(".sg-chip")];
    let f = "all";
    const qf = page === "projects" ? new URLSearchParams(location.search).get("f") : null; if (["research", "design", "ai"].includes(qf)) f = qf;
    const apply = () => {
      let n = 0;
      [...rows.children].forEach((li) => {
        const show = f === "all" || (f === "ai" ? li.dataset.ai === "1" : (li.dataset.layout === f || li.dataset.both === "1"));
        li.hidden = !show; if (show) n++;
        const pin = document.querySelector(`.sg-pin[data-id="${li.dataset.id}"]`); if (pin) pin.hidden = !show;
      });
      cnt.textContent = n; empty.hidden = n > 0;
      chips.forEach((c) => { if (c.classList.contains("sg-chip--tune")) return; const on = c.dataset.chip === f; c.classList.toggle("is-on", on); c.setAttribute("aria-pressed", String(on)); });
    };
    chips.forEach((c) => c.addEventListener("click", () => { f = c.classList.contains("sg-chip--tune") ? "all" : (f === c.dataset.chip && f !== "all" ? "all" : c.dataset.chip); apply(); }));
    const orig = [...rows.children];
    document.getElementById("sg-sort").addEventListener("change", (e) => {
      const v = e.target.value, arr = orig.slice();
      if (v === "new") arr.sort((a, b) => (+b.dataset.year || 0) - (+a.dataset.year || 0));
      if (v === "old") arr.sort((a, b) => (+a.dataset.year || 0) - (+b.dataset.year || 0));
      arr.forEach((li) => rows.appendChild(li));
    });
    // row <-> pin highlight
    const hot = (id, on) => { const pin = document.querySelector(`.sg-pin[data-id="${id}"]`); if (pin) pin.classList.toggle("is-hot", on); const r = rows.querySelector(`[data-id="${id}"]`); if (r) r.classList.toggle("is-hot", on); };
    rows.querySelectorAll(".sg-row").forEach((li) => { li.addEventListener("mouseenter", () => hot(li.dataset.id, true)); li.addEventListener("mouseleave", () => hot(li.dataset.id, false)); li.addEventListener("focusin", () => hot(li.dataset.id, true)); li.addEventListener("focusout", () => hot(li.dataset.id, false)); });
    document.querySelectorAll(".sg-pin").forEach((pn) => { pn.addEventListener("mouseenter", () => hot(pn.dataset.id, true)); pn.addEventListener("mouseleave", () => hot(pn.dataset.id, false)); pn.addEventListener("focus", () => hot(pn.dataset.id, true)); pn.addEventListener("blur", () => hot(pn.dataset.id, false)); });
    // whole-row click
    rows.addEventListener("click", (e) => { const li = e.target.closest(".sg-row"); if (li && !e.target.closest("a")) li.querySelector(".sg-t a").click(); });
    // zoom
    const venue = document.getElementById("sg-venue"); let z = 1;
    const setZ = (v) => { z = Math.max(0.8, Math.min(1.6, v)); venue.style.transform = `scale(${z})`; };
    document.getElementById("z-in").addEventListener("click", () => setZ(z + 0.2)); document.getElementById("z-out").addEventListener("click", () => setZ(z - 0.2));
    // mobile map toggle
    const mapBtn = document.getElementById("sg-mapbtn"), app = document.querySelector(".sg-app");
    mapBtn.addEventListener("click", () => { const on = !app.classList.contains("show-map"); app.classList.toggle("show-map", on); mapBtn.setAttribute("aria-pressed", String(on)); mapBtn.textContent = on ? "List" : "Map"; });
    // notify card (list-and-map page only)
    const nt = document.getElementById("sg-notify");
    if (nt) {
      let gone = false; try { gone = sessionStorage.getItem("sg-notify") === "1"; } catch (e) {}
      if (!gone) setTimeout(() => (nt.hidden = false), 1200);
      document.getElementById("sg-x").addEventListener("click", () => { nt.hidden = true; try { sessionStorage.setItem("sg-notify", "1"); } catch (e) {} });
    }
    apply();
  }

  if (page === "project") {
    // Make the details easy to find: say what is inside, open the process frames, and offer expand/collapse all.
    const hints = { problem: "how I identified it and the goal", research: "every method and the key insights", methods: "every method and why I chose it", define: "who we designed for and what it means", ideate: "the thinking behind the wireframes", iterate: "each round, what changed and how I checked it", execution: "the full build notes", objectives: "the full objectives and questions", findings: "the full findings and evidence", insights: "the patterns and what they mean", recommendations: "the full recommendations and evidence", impact: "the decisions this influenced and my reflection" };
    const open = new Set(["research", "methods", "iterate", "ideate"]);
    const lab = (d, on) => { const sm = d.querySelector("summary"); const id = d.closest(".frame") && d.closest(".frame").id; const h = hints[id]; sm.textContent = on ? "Hide the details" : "Read the details" + (h ? ": " + h : ""); };
    document.querySelectorAll(".frame details.more").forEach((d) => {
      const id = d.closest(".frame").id;
      if (open.has(id)) d.open = true;
      lab(d, d.open);
      d.addEventListener("toggle", () => lab(d, d.open));
    });
    const all = document.querySelector(".expand-all");
    if (all) all.addEventListener("click", () => {
      const on = all.getAttribute("aria-pressed") !== "true";
      document.querySelectorAll(".frame details.more").forEach((d) => { d.open = on; });
      all.setAttribute("aria-pressed", String(on));
      all.textContent = on ? "Close all details" : "Open all details";
    });
    const links = [...document.querySelectorAll(".fstrip a")];
    const fprog = document.getElementById("fprog");
    if (fprog) { const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; fprog.style.width = (h > 0 ? Math.min(100, (scrollY / h) * 100) : 0) + "%"; }; addEventListener("scroll", upd, { passive: true }); upd(); }
    const frames = [...document.querySelectorAll(".frame")];
    const paint = (cur) => {
      links.forEach((l, i) => {
        const state = i < cur ? "done" : i === cur ? "now" : "todo";
        l.parentElement.dataset.state = state;
        l.querySelector(".fstate").textContent = state === "done" ? " (completed)" : state === "now" ? " (current)" : "";
        if (state === "now") l.setAttribute("aria-current", "true");
        else l.removeAttribute("aria-current");
      });
    };
    paint(0);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) paint(frames.indexOf(e.target));
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    frames.forEach((f) => io.observe(f));

    const sp = document.getElementById("strike");
    if (sp) {
      const io2 = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            sp.classList.add("is-hit");
            // reaching the strike panel completes every frame
            links.forEach((l) => { l.parentElement.dataset.state = "done"; l.removeAttribute("aria-current"); });
            io2.disconnect();
          }
        },
        { threshold: 0.45 }
      );
      io2.observe(sp);
    }
  }
})();
