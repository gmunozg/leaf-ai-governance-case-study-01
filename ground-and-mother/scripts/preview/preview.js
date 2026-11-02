/* Ground & Mother — static preview runtime.
   Re-creates the site's client interactions without the Next.js server. */
(function () {
  var d = document, root = d.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var es = root.lang === "es" || location.pathname.indexOf("/es/") > -1;

  /* Reveals */
  var io = null;
  if (!reduce && "IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  }
  d.querySelectorAll("[data-reveal]").forEach(function (el) { io ? io.observe(el) : el.classList.add("is-in"); });

  /* Header: compress on scroll, hide going down, return going up */
  var header = d.querySelector(".site-header"), lastY = 0, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.dataset.scrolled = String(y > 24);
    var hide = y > 320 && y > lastY + 4;
    if (y < lastY - 4 || y < 320) hide = false;
    if (header.dataset.menu !== "true") header.dataset.hidden = String(hide);
    lastY = y; ticking = false;
  }
  if (header) {
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  var btn = d.querySelector(".menu-btn"), menu = d.getElementById("mobile-menu");
  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? (es ? "Cerrar menú" : "Close menu") : (es ? "Abrir menú" : "Open menu"));
    menu.dataset.open = String(open);
    menu.setAttribute("aria-hidden", String(!open));
    if (open) menu.removeAttribute("inert"); else menu.setAttribute("inert", "");
    header.dataset.menu = String(open);
    if (open) header.dataset.dark = "false";
    d.body.style.overflow = open ? "hidden" : "";
    if (open) { var a = menu.querySelector("a"); a && a.focus({ preventScroll: true }); }
  }
  if (btn) {
    btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setMenu(false); btn.focus(); }
    });
  }

  /* Botanical cursor (desktop pointers only) */
  var sprig = d.querySelector(".sprig-cursor");
  if (sprig && !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var x = -100, y = -100, tx = -100, ty = -100, rot = 0, running = false;
    var tick = function () {
      var dx = tx - x, dy = ty - y;
      x += dx * 0.16; y += dy * 0.16;
      var tr = Math.max(-28, Math.min(28, dx * 0.9));
      rot += (tr - rot) * 0.12;
      sprig.style.transform = "translate3d(" + x + "px," + y + "px,0) rotate(" + rot + "deg)";
      if (Math.abs(dx) + Math.abs(dy) + Math.abs(rot) > 0.15) requestAnimationFrame(tick); else running = false;
    };
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (x < -50) { x = tx; y = ty; }
      sprig.dataset.visible = "true";
      var t = e.target;
      sprig.dataset.active = String(!!(t.closest && t.closest("a, button, summary, input, [data-cursor]")));
      sprig.dataset.dark = String(!!(t.closest && t.closest(".on-dark")));
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
    root.addEventListener("pointerleave", function () { sprig.dataset.visible = "false"; });
  }

  /* Chapter index: photograph follows the pointer */
  var pindex = d.querySelector(".pindex");
  if (pindex) {
    var float = pindex.querySelector(".pindex__float");
    var medias = float ? float.querySelectorAll(".media") : [];
    pindex.querySelectorAll(".pindex__row").forEach(function (row, i) {
      row.addEventListener("pointerenter", function () {
        if (!float) return;
        float.dataset.show = "true";
        medias.forEach(function (m, j) { m.dataset.active = String(i === j); });
      });
    });
    pindex.addEventListener("pointerleave", function () { if (float) float.dataset.show = "false"; });
    pindex.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || !float) return;
      var r = pindex.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      float.style.transform = "translate3d(" + (px + 40) + "px," + py + "px,0) translate(0,-50%) rotate(" + ((px / r.width - 0.5) * 6) + "deg)";
    });
  }

  /* Shop: filter by collection */
  var filters = d.querySelector(".shop-filters");
  if (filters) {
    var cards = d.querySelectorAll(".pcard[data-collection]");
    var count = filters.querySelector(".count");
    var ids = ["all", "mother", "first-foods", "first-years", "family"];
    var labelsEn = ["Everything", "Mother", "First Foods", "First Years", "Family"];
    var labelsEs = ["Todo", "Madre", "Primeros alimentos", "Primeros años", "Familia"];
    filters.querySelectorAll(".chip").forEach(function (chip) {
      var text = chip.textContent.trim();
      var idx = Math.max(labelsEn.indexOf(text), labelsEs.indexOf(text));
      var id = ids[idx] || "all";
      chip.addEventListener("click", function () {
        filters.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        var n = 0;
        cards.forEach(function (c) {
          var show = id === "all" || c.dataset.collection === id;
          c.hidden = !show; if (show) { n++; c.classList.add("is-in"); }
        });
        if (count) count.textContent = es ? n + (n === 1 ? " producto" : " productos") : n + (n === 1 ? " item" : " items");
      });
    });
  }

  /* Library: search + category filter */
  var search = d.getElementById("lib-search");
  if (search) {
    var tools = search.closest(".lib-tools");
    var items = d.querySelectorAll(".lib-list .lib-item[data-category]");
    var result = tools.querySelector("p.label");
    var cat = "all";
    var catIds = ["all", "traditional-nourishment", "maternal-nutrition", "first-foods", "family-food-culture", "food-preparation"];
    var apply = function () {
      var q = search.value.trim().toLocaleLowerCase(), n = 0;
      items.forEach(function (li) {
        var ok = (cat === "all" || li.dataset.category === cat) && (!q || li.textContent.toLocaleLowerCase().indexOf(q) > -1);
        li.hidden = !ok; if (ok) n++;
      });
      if (result) result.textContent = es ? n + (n === 1 ? " ensayo" : " ensayos") : n + (n === 1 ? " essay" : " essays");
      var empty = d.getElementById("lib-empty");
      if (!empty) {
        empty = d.createElement("p"); empty.id = "lib-empty"; empty.className = "lede muted";
        empty.textContent = es ? "Todavía no hay ensayos que coincidan con esa búsqueda." : "No essays match that search yet.";
        tools.parentNode.appendChild(empty);
      }
      empty.hidden = n !== 0;
    };
    search.addEventListener("input", apply);
    tools.querySelectorAll(".chip").forEach(function (chip, i) {
      chip.addEventListener("click", function () {
        cat = catIds[i] || "all";
        tools.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        apply();
      });
    });
  }


  /* Header over the dark soil */
  var heroEl = d.querySelector(".seed-hero");
  function headerTone() {
    if (!header || !heroEl) return;
    var r = heroEl.getBoundingClientRect();
    var ivory = parseFloat(getComputedStyle(heroEl).getPropertyValue("--ivory")) || 0;
    header.dataset.dark = String(r.bottom > 72 && ivory < 0.5 && header.dataset.menu !== "true");
  }

  /* Opening scene: scroll-mapped growth, pointer proximity, touch light */
  if (heroEl && !reduce) {
    heroEl.classList.add("is-live");
    var seedEl = heroEl.querySelector(".seed"), stageEl = heroEl.querySelector(".seed-hero__stage");
    var clamp = function (n) { return n < 0 ? 0 : n > 1 ? 1 : n; };
    var setv = function (k, v) { heroEl.style.setProperty(k, v.toFixed(4)); };
    var heroScroll = function () {
      var r = heroEl.getBoundingClientRect(), total = r.height - innerHeight;
      var pp = clamp(total > 0 ? -r.top / total : 0);
      setv("--p", pp); setv("--open", clamp((pp - 0.03) / 0.14)); setv("--rp", clamp((pp - 0.1) / 0.6));
      setv("--shoot", clamp((pp - 0.26) / 0.34)); setv("--leaf", clamp((pp - 0.46) / 0.2)); setv("--copy", clamp((pp - 0.04) / 0.2));
      setv("--ivory", clamp((pp - 0.7) / 0.2)); setv("--cap", clamp((pp - 0.8) / 0.12));
      heroEl.dataset.stage = String(Math.min(3, Math.floor(pp * 4.2)));
      headerTone();
    };
    var hraf = 0;
    window.addEventListener("scroll", function () { cancelAnimationFrame(hraf); hraf = requestAnimationFrame(heroScroll); }, { passive: true });
    window.addEventListener("resize", heroScroll);
    heroScroll();
    var tx = 0, ty = 0, cx = 0, cy = 0, near = 0, cn = 0, run = false;
    var anim = function () {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08; cn += (near - cn) * 0.08;
      seedEl.style.setProperty("--tilt", (cx * 7).toFixed(2) + "deg");
      seedEl.style.setProperty("--lift", (cy * -4 - cn * 3).toFixed(2) + "px");
      seedEl.style.setProperty("--near", cn.toFixed(3));
      if (Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(near - cn) > 0.002) requestAnimationFrame(anim); else run = false;
    };
    var aim = function (x, y) {
      var s = seedEl.getBoundingClientRect(), dx = x - (s.left + s.width / 2), dy = y - (s.top + s.height / 2);
      tx = Math.max(-1, Math.min(1, dx / 380)); ty = Math.max(-1, Math.min(1, dy / 380)); near = clamp(1 - Math.hypot(dx, dy) / 260);
      var st = stageEl.getBoundingClientRect();
      stageEl.style.setProperty("--lx", ((x - st.left) / st.width * 100).toFixed(1) + "%");
      stageEl.style.setProperty("--ly", ((y - st.top) / st.height * 100).toFixed(1) + "%");
      if (!run) { run = true; requestAnimationFrame(anim); }
    };
    stageEl.addEventListener("pointermove", function (e) { aim(e.clientX, e.clientY); });
    stageEl.addEventListener("pointerleave", function () { tx = ty = near = 0; if (!run) { run = true; requestAnimationFrame(anim); } });
    stageEl.addEventListener("touchmove", function (e) { var t = e.touches[0]; if (t) aim(t.clientX, t.clientY); }, { passive: true });
    stageEl.addEventListener("touchstart", function (e) { var t = e.touches[0]; if (t) aim(t.clientX, t.clientY); }, { passive: true });
    seedEl.addEventListener("click", function () { seedEl.classList.remove("is-stirring"); void seedEl.getBoundingClientRect(); seedEl.classList.add("is-stirring"); });
  }
  if (header) window.addEventListener("scroll", headerTone, { passive: true });
  headerTone();

  /* Root line grows with reading progress */
  var rootline = d.querySelector(".rootline");
  if (rootline) {
    var rl = function () {
      var r = rootline.getBoundingClientRect();
      rootline.style.setProperty("--g", reduce ? "1" : Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / r.height)).toFixed(4));
    };
    window.addEventListener("scroll", rl, { passive: true }); rl();
  }

  /* Botanical notes */
  d.querySelectorAll(".root-note").forEach(function (note) {
    var nb = note.querySelector(".root-note__node"), panel = note.querySelector(".root-note__panel");
    var set = function (o) { note.dataset.open = String(o); nb.setAttribute("aria-expanded", String(o)); panel.hidden = !o; };
    nb.addEventListener("click", function () { set(nb.getAttribute("aria-expanded") !== "true"); });
    note.querySelector(".root-note__close").addEventListener("click", function () { set(false); nb.focus(); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    d.addEventListener("pointerdown", function (e) { if (!note.contains(e.target)) set(false); });
  });

  /* Food journal entries */
  var dlg = d.querySelector(".fj-dialog");
  if (dlg) {
    var entries = dlg.querySelectorAll(".fj-entry"), trigs = d.querySelectorAll(".fj-item"), cur = -1;
    var show = function (i) {
      cur = (i + entries.length) % entries.length;
      entries.forEach(function (en, j) { en.hidden = j !== cur; });
      dlg.setAttribute("aria-labelledby", "fj-title-" + cur);
      dlg.scrollTop = 0;
    };
    trigs.forEach(function (t, i) { t.addEventListener("click", function () { show(i); if (!dlg.open) { dlg.showModal(); root.style.overflow = "hidden"; } }); });
    dlg.addEventListener("close", function () { root.style.overflow = ""; if (trigs[cur]) trigs[cur].focus({ preventScroll: true }); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); } });
    dlg.querySelectorAll(".fj-close").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
    dlg.querySelectorAll(".fj-prev").forEach(function (b) { b.addEventListener("click", function () { show(cur - 1); }); });
    dlg.querySelectorAll(".fj-next").forEach(function (b) { b.addEventListener("click", function () { show(cur + 1); }); });
    var sx = null;
    dlg.addEventListener("touchstart", function (e) { sx = e.touches[0] ? e.touches[0].clientX : null; }, { passive: true });
    dlg.addEventListener("touchend", function (e) { var ex = e.changedTouches[0] && e.changedTouches[0].clientX; if (sx != null && ex != null && Math.abs(ex - sx) > 60) show(cur + (ex < sx ? 1 : -1)); sx = null; });
  }

  /* Remember the chosen language */
  d.querySelectorAll(".lang-switch a").forEach(function (a) {
    a.addEventListener("click", function () { try { localStorage.setItem("gm_locale", a.getAttribute("hreflang")); } catch (e) {} });
  });

  /* Forms have nowhere to submit in the preview */
  d.querySelectorAll("form").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); }); });
})();
