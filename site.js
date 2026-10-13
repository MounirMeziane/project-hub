/* Shared pieces for every page: top bar, slide-out menu, search, hover effects. */
(function () {
  const NAME = "Mounir Meziane";
  const page = document.body.dataset.page || "projects";
  const projects = window.PROJECTS || [];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const icons = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>'
  };

  const letters = [...NAME].map((c, i) => `<span class="ch" style="transition-delay:${i * 18}ms">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");

  const chrome = document.createElement("div");
  chrome.innerHTML = `
    <div class="glow" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="dots" aria-hidden="true"></div>
    <header class="topbar">
      <button class="burger" id="burger" aria-label="Open menu" aria-controls="menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <a class="brand" href="index.html" aria-label="${NAME}, home">${letters}</a>
      <span class="tag">Software Engineering · uOttawa</span>
    </header>
    <div class="scrim" id="scrim"></div>
    <nav class="menu" id="menu" aria-label="Main menu" aria-hidden="true">
      <div class="menu-head"><span class="label">Menu</span><button class="close" id="close" aria-label="Close menu">✕</button></div>
      <div class="nav">
        <a href="index.html" class="${page === "projects" ? "active" : ""}"><span class="ico">${icons.grid}</span><span>Projects<small>Everything I've built</small></span></a>
        <button id="searchToggle" type="button"><span class="ico">${icons.search}</span><span>Search<small>Find a project</small></span></button>
        <div class="searchbox" id="searchbox" hidden>
          <input id="q" type="search" placeholder="Search projects…" autocomplete="off">
          <div class="results" id="results"></div>
        </div>
        <a href="about.html" class="${page === "about" ? "active" : ""}"><span class="ico">${icons.user}</span><span>About me<small>My story</small></span></a>
      </div>
      <div class="menu-foot">${NAME} · ${new Date().getFullYear()}</div>
    </nav>`;
  document.body.prepend(...chrome.childNodes);

  // ----- menu open / close -----
  const body = document.body, burger = document.getElementById("burger"), menu = document.getElementById("menu");
  const setMenu = open => {
    body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    menu.setAttribute("aria-hidden", !open);
    if (open) setTimeout(() => menu.querySelector("a,button").focus(), 200);
  };
  burger.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  document.getElementById("close").addEventListener("click", () => setMenu(false));
  document.getElementById("scrim").addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  // ----- search -----
  const box = document.getElementById("searchbox"), q = document.getElementById("q"), results = document.getElementById("results");
  const runSearch = () => {
    const term = q.value.trim().toLowerCase();
    if (!projects.length) { results.innerHTML = `<div class="none">No projects yet. They'll show up here as we build them.</div>`; return; }
    const hits = projects.filter(p => [p.title, p.description, ...(p.tags || [])].join(" ").toLowerCase().includes(term));
    results.innerHTML = hits.length
      ? hits.map(p => `<a href="project.html#${esc(p.id)}"><b>${esc(p.title)}</b><span>${esc(p.description)}</span></a>`).join("")
      : `<div class="none">Nothing matches "${esc(q.value)}".</div>`;
  };
  document.getElementById("searchToggle").addEventListener("click", () => {
    box.hidden = !box.hidden;
    if (!box.hidden) { runSearch(); q.focus(); }
  });
  q.addEventListener("input", runSearch);

  // ----- name: letters pop one by one when the page loads -----
  const chs = document.querySelectorAll(".brand .ch");
  chs.forEach((c, i) => setTimeout(() => { c.classList.add("pop"); setTimeout(() => c.classList.remove("pop"), 260); }, 300 + i * 45));

  // ----- tiles tilt toward the mouse -----
  window.enableTilt = function (root) {
    root.querySelectorAll(".tile").forEach(t => {
      t.addEventListener("pointermove", e => {
        const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        t.style.setProperty("--ry", ((x - .5) * 8).toFixed(2) + "deg");
        t.style.setProperty("--rx", ((.5 - y) * 8).toFixed(2) + "deg");
        t.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        t.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      t.addEventListener("pointerleave", () => { t.style.removeProperty("--rx"); t.style.removeProperty("--ry"); });
    });
  };
  window.esc = esc;
})();
