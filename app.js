/* =========================================================================
   PINK WAVE 2026 · app
   Phases 0–2: content spine, single journey, Myth-or-Fact, Spot the Sign,
   7-step trainer, pattern picker, certificate, gated brochure download.
   ========================================================================= */

/* ---- EDIT BEFORE DEPLOY ------------------------------------------------ */
const SITE_URL     = "https://mithleshw.github.io/sgpgibreasthealth/";
const REGISTER_URL = "https://forms.gle/REPLACE_ME";   /* ← your registration form */
/* Supabase collector. Country is resolved server-side from the request and the
   IP is discarded; nothing identifiable is sent from here. Set to "" to switch
   off all collection instantly. */
const ANALYTICS    = "https://sbhiuachwiuipgsybcqa.supabase.co/functions/v1/collect";
/* ----------------------------------------------------------------------- */

const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const T  = (k) => C.ui[k] ? C.ui[k][lang] : k;

let lang  = localStorage.getItem("pw_lang") === "hi" ? "hi" : "en";
let deck  = [];                 /* shuffled myths   */
let qi = 0, mythScore = 0, answered = false;
let si = 0, signScore = 0, sAnswered = false;
let ti = 0, stepsDone = 0;
let sessionId = localStorage.getItem("pw_sid") || (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2));
localStorage.setItem("pw_sid", sessionId);

const MAX = C.myths.length + C.signs.length + C.steps.length;   /* 14 + 9 + 7 = 30 */

/* ----------------------------------------------------------- feedback --- */
const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const OK_BUZZ = 18, NO_BUZZ = [22, 60, 22], WIN_BUZZ = [15, 50, 15, 50, 40];

/* drifting petal burst */
function burst(n = 16, ox = null, oy = null) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host = document.createElement("div");
  host.className = "petals";
  document.body.appendChild(host);
  const X = ox ?? innerWidth / 2, Y = oy ?? innerHeight * .34;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 170;
    p.style.cssText =
      `left:${X}px;top:${Y}px;` +
      `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 120}px;` +
      `--rot:${(Math.random() * 720 - 360)}deg;` +
      `width:${7 + Math.random() * 11}px;height:${4 + Math.random() * 7}px;` +
      `animation-delay:${Math.random() * .18}s;` +
      `background:${["#ff8ec6", "#e91e8c", "#ffb3da", "#fff"][(Math.random() * 4) | 0]}`;
    host.appendChild(p);
  }
  setTimeout(() => host.remove(), 1500);
}

/* count a number up */
function countUp(el, to, ms = 700, suffix = "") {
  const t0 = performance.now(), from = 0;
  (function step(t) {
    const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (to - from) * e) + suffix;
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

/* ripple on every .btn press */
document.addEventListener("pointerdown", e => {
  const b = e.target.closest(".btn, .ans button, .grow, .docbar, .pat");
  if (!b) return;
  buzz(8);
  const r = b.getBoundingClientRect(), d = document.createElement("span");
  d.className = "ripple";
  d.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px`;
  b.style.position = b.style.position || "relative";
  b.appendChild(d);
  setTimeout(() => d.remove(), 620);
});

/* ------------------------------------------------------------ analytics -- */
let firstBeacon = !localStorage.getItem("pw_seen");   /* geo lookup once per visitor */
const SRC = new URLSearchParams(location.search).get("src")
         || (document.referrer.includes("whatsapp") ? "wa" : "direct");
const DEVICE = /android/i.test(navigator.userAgent) ? "android"
             : /iphone|ipad/i.test(navigator.userAgent) ? "ios" : "other";

function post(table, row, first = false) {
  if (!ANALYTICS) return;                       /* switch off by blanking the URL */
  const body = JSON.stringify({ table, row, first });
  /* text/plain keeps this a CORS "simple request": no preflight, and no
     credentials — so the collector can stay on a wildcard origin. Sending
     application/json here triggers a preflight that sendBeacon fails. */
  const TYPE = "text/plain;charset=UTF-8";
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(ANALYTICS, new Blob([body], {type:TYPE}))) return;
    fetch(ANALYTICS, {
      method: "POST", body, headers: {"Content-Type": TYPE},
      mode: "cors", credentials: "omit", keepalive: true
    }).catch(() => {});
  } catch (e) { /* analytics must never break the app */ }
}

function track(event, data = {}) {
  const { name, city, role, language_downloaded, ...rest } = data;

  /* the two tables that hold something a person typed themselves */
  if (event === "pledge")
    return post("pledges", {
      session_id: sessionId, lang, name,
      score: rest.score ?? total(), max_score: MAX,
      myth_score: mythScore, sign_score: signScore, steps_done: stepsDone
    });
  if (event === "brochure_download")
    return post("brochure_downloads", {session_id:sessionId, name, city, role,
                                       language_downloaded, pledged: rest.pledged});
  if (event === "game_over")
    /* best_combo carries the ribbon count for this game */
    return post("game_scores", {session_id:sessionId, lang, game:"runner",
                                score:rest.score, best_combo:rest.best_combo, duration_s:rest.duration_s});

  post("events", {
    session_id: sessionId, lang, source: SRC, device: DEVICE,
    event, module: rest.module, item_id: rest.item_id,
    correct: rest.correct, ms: rest.ms, score: rest.score,
    meta: rest.meta
  }, firstBeacon);

  if (firstBeacon) { firstBeacon = false; localStorage.setItem("pw_seen", "1"); }
}

/* ------------------------------------------------------------ language --- */
function setLang(l) {
  lang = l;
  localStorage.setItem("pw_lang", l);
  document.documentElement.lang = l;
  $("#bEn").classList.toggle("on", l === "en");
  $("#bHi").classList.toggle("on", l === "hi");
  $$("[data-t]").forEach(el => { const k = el.dataset.t; if (C.ui[k]) el.textContent = C.ui[k][l]; });
  $("#stM").textContent = T("myth");
  $("#stF").textContent = T("fact");
  $("#pname").placeholder = T("yourName");
  $("#bName").placeholder = T("fldName");
  $("#bCity").placeholder = T("fldCity");
  $("#whenBox").innerHTML = "<b>" + T("bestTime") + "</b><br>" + C.examWhen[l];
  $("#techText").textContent = C.examTechnique[l];
  $("#patEnd").textContent = C.procedureEnd[l];
  $("#signPrompt").textContent = T("tapPrompt");
  $("#bRole").innerHTML = C.roles.map(r => `<option value="${r.v}">${r.t[l]}</option>`).join("");
  const gl = C.game.menu[l];
  const g1 = $("#gameBtnTxt"), g2 = $("#gameBtnTxt2");
  if (g1) g1.textContent = gl;
  if (g2) g2.textContent = gl;
  renderSource();
  renderQ(); renderSign(); renderStep(); renderPatterns();
  renderEvent(); renderVideos(); renderArt(); renderResult();
}

/* --------------------------------------------------------------- nav ----- */
function go(id) {
  $$(".screen").forEach(s => s.classList.remove("on"));
  $("#s-" + id).classList.add("on");
  document.body.dataset.screen = id;
  $("#backBtn").hidden = (id === "splash");
  $("#prog").hidden = !["myths","signs","train","tech"].includes(id);
  updateProg();
  window.scrollTo(0, 0);
  track("view", {module: id});
}
function updateProg() {
  const bars = $$("#prog i b");
  bars[0].style.width = Math.min(100, qi / C.myths.length * 100) + "%";
  bars[1].style.width = Math.min(100, si / C.signs.length * 100) + "%";
  bars[2].style.width = Math.min(100, ti / C.steps.length * 100) + "%";
}

/* ------------------------------------------------------------- videos --- */
const thumb = id => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
function openVideo(id) {
  track("video_play", {item_id: id});
  window.open("https://www.youtube.com/watch?v=" + id, "_blank", "noopener");
}
const vidRow = v => `<button class="vid" data-v="${v.id}">
  <img src="${thumb(v.id)}" alt="" loading="lazy"><b>${v.t[lang]}</b></button>`;

/* Source credit block, appended under the disclaimer on every screen. */
function renderSource() {
  const html =
    `<div class="srcbox">
       <img src="img/logo.png" srcset="img/logo.png 1x, img/logo@2x.png 2x" alt="">
       <div>${T("sourceLead")}
         <a href="${C.sourceUrl}" target="_blank" rel="noopener"><b>${T("sourceName")}</b></a>
         ${T("sourceTail")}
         <a class="srclink" href="${C.sourceUrl}" target="_blank" rel="noopener">${T("sourceVisit")} ↗</a>
       </div>
     </div>`;
  $$(".screen").forEach(s => {
    let box = s.querySelector(".srcbox");
    if (box) box.outerHTML = html;
    else {
      const d = s.querySelector(".disc");
      if (d) d.insertAdjacentHTML("afterend", html);
      else s.insertAdjacentHTML("beforeend", html);
    }
  });
}

function renderArt() {
  $("#artRail").innerHTML = C.artwork.map(a =>
    `<div class="artcard">
       <picture><source srcset="img/${a.img}.webp" type="image/webp">
       <img src="img/${a.img}.jpg" alt="${a.t[lang]}" loading="lazy"></picture>
       <span>${a.t[lang]}</span>
     </div>`).join("");
  $("#artCredit").textContent = C.artCredit[lang];
  document.querySelector(".arthead").textContent = C.artTitle[lang];
}

function renderVideos() {
  $("#vidSeries").innerHTML  = C.videoSeries.map(vidRow).join("");
  $("#vidFeature").innerHTML = C.videoFeature.map(vidRow).join("");
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-v]");
  if (b) openVideo(b.dataset.v);
});

/* ================================================== 1 · MYTH OR FACT ==== */
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

function startMyths() {
  deck = shuffle(C.myths); qi = 0; mythScore = 0; streak = 0;
  renderQ(); go("myths");
}

function renderQ() {
  const c = deck[qi] || C.myths[0];
  if (!c) return;
  $("#qtext").textContent = c.q[lang];
  $("#qrev").className = "reveal";
  $("#qans").style.display = "grid";
  $("#stM").style.opacity = 0; $("#stF").style.opacity = 0;
  $("#qcard").style.transform = ""; $("#qcard").style.opacity = 1;
  $("#qvid").innerHTML = "";
  answered = false;
  updateProg();
}

let streak = 0;
function answerQ(choice) {
  if (answered) return;
  answered = true;
  const c = deck[qi], right = choice === c.a;
  if (right) { mythScore++; streak++; buzz(OK_BUZZ); } else { streak = 0; buzz(NO_BUZZ); }
  track("answer", {module:"myths", item_id:c.id, correct:right, chose:choice});

  const card = $("#qcard"), r0 = card.getBoundingClientRect();
  if (right) burst(streak >= 3 ? 22 : 12, r0.left + r0.width / 2, r0.top + r0.height / 2);
  else { card.classList.add("shakeNo"); setTimeout(() => card.classList.remove("shakeNo"), 420); }

  $("#streak").textContent = streak >= 2
    ? (lang === "hi" ? `लगातार ${streak} सही 🔥` : `${streak} in a row 🔥`) : "";
  $("#st" + (c.a === "myth" ? "M" : "F")).style.opacity = 1;
  $("#qans").style.display = "none";
  const r = $("#qrev");
  r.className = "reveal on " + (right ? "r" : "w");
  $("#qv").innerHTML = (right ? "✓ " + T("correct") : "✕ " + T("wrong")) +
    ` &nbsp;<span style="color:${c.a === "myth" ? "var(--no)" : "var(--ok)"}">` +
    (c.a === "myth" ? T("myth") : T("fact")) + "</span>";
  $("#qe").textContent = c.e[lang];
  qi++; updateProg();
}

function nextQ() {
  if (qi >= deck.length) { si = 0; signScore = 0; renderSign(); go("signs"); }
  else renderQ();
}

/* swipe */
(function () {
  const card = $("#qcard"); let x0 = null, dx = 0, live = false;
  card.addEventListener("pointerdown", e => { if (answered) return; live = true; x0 = e.clientX; dx = 0; card.setPointerCapture(e.pointerId); });
  card.addEventListener("pointermove", e => {
    if (!live) return;
    dx = e.clientX - x0;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 24}deg)`;
    $("#stM").style.opacity = dx < -20 ? Math.min(1, -dx / 90) : 0;
    $("#stF").style.opacity = dx > 20 ? Math.min(1, dx / 90) : 0;
  });
  const end = () => {
    if (!live) return; live = false;
    if (Math.abs(dx) > 70) answerQ(dx < 0 ? "myth" : "fact");
    else { card.style.transform = ""; $("#stM").style.opacity = 0; $("#stF").style.opacity = 0; }
  };
  card.addEventListener("pointerup", end);
  card.addEventListener("pointercancel", end);
})();

/* ================================================== 2 · SPOT THE SIGN === */
const SK = "#f2d3b8", SH = "#d9a888", NP = "#b07b5c", LN = "#a97a58",
      PK = "#e91e8c", RD = "#cf3040";

const ART = {
  base: (extra = "", outline = "M100 40c42 0 74 32 74 72s-32 72-74 72-74-32-74-72 32-72 74-72Z") =>
    `<path d="${outline}" fill="${SK}" stroke="${LN}" stroke-width="2"/>
     <circle cx="100" cy="112" r="19" fill="${SH}"/><circle cx="100" cy="112" r="7.5" fill="${NP}"/>${extra}`,

  normal:  () => ART.base(),
  dimple:  () => ART.base(
    `<path d="M170 76q-16 10-28 14M174 92q-18 4-32 4M162 62q-12 12-24 18" stroke="${SH}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
     <ellipse cx="152" cy="86" rx="12" ry="7" fill="${SH}" opacity=".75" transform="rotate(-38 152 86)"/>`,
    "M100 40c30 0 56 15 68 38 -16 2 -26 14 -18 26 -6 46 -26 80 -50 80 -42 0 -74-32-74-72s32-72 74-72Z"),
  retract: () => `<path d="M100 40c42 0 74 32 74 72s-32 72-74 72-74-32-74-72 32-72 74-72Z" fill="${SK}" stroke="${LN}" stroke-width="2"/>
     <circle cx="100" cy="112" r="19" fill="${SH}"/>
     <path d="M88 106q12 16 24 0" fill="${NP}"/>
     <path d="M84 100q16 6 32 0M86 122q14-6 28 0" stroke="${NP}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  peau: () => { let d = ""; for (let i = 0; i < 74; i++) { const t = Math.random() * 6.283, r = 26 + Math.random() * 44;
      d += `<circle cx="${(100 + r * Math.cos(t)).toFixed(1)}" cy="${(112 + r * Math.sin(t)).toFixed(1)}" r="${(1.6 + Math.random() * 1.7).toFixed(1)}" fill="${SH}" opacity=".85"/>`; }
    return ART.base(d); },
  red: () => ART.base(`<ellipse cx="118" cy="92" rx="40" ry="32" fill="${RD}" opacity=".32"/>
     <ellipse cx="118" cy="92" rx="26" ry="20" fill="${RD}" opacity=".26"/>`),
  contour: () => ART.base(`<ellipse cx="156" cy="78" rx="15" ry="13" fill="${SH}" opacity=".7"/>`,
    "M100 40c28 0 52 14 64 34 14 6 18 26 4 34 -6 42 -34 76 -68 76 -42 0-74-32-74-72s32-72 74-72Z"),
  axilla: () => `
    <ellipse cx="112" cy="40" rx="20" ry="23" fill="${SK}"/>
    <path d="M91 38c0-16 8-24 21-24s21 8 21 24c0-9-9-12-21-12s-21 3-21 12Z" fill="#4a3b36"/>
    <path d="M78 88q40-12 74 0l-5 100q-34 9-64 0Z" fill="${SK}" stroke="${LN}" stroke-width="2"/>
    <path d="M78 96C58 90 52 72 62 58" fill="none" stroke="${SK}" stroke-width="13" stroke-linecap="round"/>
    <circle cx="78" cy="96" r="12" fill="${SH}"/>
    <path d="M92 122c2 16 10 22 19 17" fill="none" stroke="${SH}" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="103" cy="130" r="3" fill="${NP}"/>`,
  discharge: () => ART.base(`<path d="M100 126q-6 12 0 16 6-4 0-16Z" fill="${RD}"/>
     <circle cx="100" cy="152" r="4.5" fill="${RD}" opacity=".9"/><circle cx="100" cy="166" r="3" fill="${RD}" opacity=".65"/>`),
  size: () => `
    <ellipse cx="56" cy="118" rx="38" ry="40" fill="${SK}" stroke="${LN}" stroke-width="2"/>
    <circle cx="56" cy="118" r="10" fill="${SH}"/>
    <ellipse cx="146" cy="112" rx="50" ry="52" fill="${SK}" stroke="${LN}" stroke-width="2"/>
    <circle cx="146" cy="112" r="12" fill="${SH}"/>`
};

function renderSign() {
  const s = C.signs[si]; if (!s) return;
  $("#signArt").innerHTML =
    `<svg id="svgS" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${ART[s.art]()}</svg>`;
  $("#srev").className = "reveal";
  $("#sNone").hidden = false;
  $("#signPrompt").textContent = T("tapPrompt");
  sAnswered = false;
  updateProg();
  $("#svgS").addEventListener("click", onSignTap);
}

function svgPoint(evt) {
  const svg = $("#svgS"), r = svg.getBoundingClientRect();
  return { x: (evt.clientX - r.left) / r.width * 200, y: (evt.clientY - r.top) / r.height * 200 };
}

function onSignTap(evt) {
  if (sAnswered) return;
  const s = C.signs[si], p = svgPoint(evt);
  if (!s.hot) return resolveSign(false, p);            /* normal round: tapping = wrong */
  const hit = Math.hypot(p.x - s.hot.x, p.y - s.hot.y) <= s.hot.r;
  resolveSign(hit, p);
}

function resolveSign(hit, p) {
  sAnswered = true;
  const s = C.signs[si];
  if (hit) signScore++;
  buzz(hit ? OK_BUZZ : NO_BUZZ);
  if (hit) { const r = $("#signArt").getBoundingClientRect(); burst(14, r.left + r.width / 2, r.top + r.height / 2); }
  else { $("#signArt").classList.add("shakeNo"); setTimeout(() => $("#signArt").classList.remove("shakeNo"), 420); }
  track("tap_sign", {module:"signs", item_id:s.id, correct:hit});

  const svg = $("#svgS");
  if (s.hot) {
    svg.insertAdjacentHTML("beforeend",
      `<circle cx="${s.hot.x}" cy="${s.hot.y}" r="${s.hot.r}" fill="none"
        stroke="${hit ? "#17825a" : PK}" stroke-width="4" stroke-dasharray="7 6" class="${hit ? "" : "pulse"}"/>`);
  }
  if (p && !hit) svg.insertAdjacentHTML("beforeend",
    `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="${RD}" opacity=".8"/>`);

  $("#sNone").hidden = true;
  const r = $("#srev");
  r.className = "reveal on " + (hit ? "r" : "w");
  $("#sv").textContent = hit ? "✓ " + (s.hot ? T("goodSpot") : T("rightNormal"))
                             : "✕ " + (s.hot ? T("missed") : T("wasNormal"));
  $("#se").textContent = s.h[lang] + " — " + s.p[lang];
  si++; updateProg();
}

$("#sNone").onclick = () => {
  if (sAnswered) return;
  const s = C.signs[si];
  resolveSign(!s.hot, null);                            /* correct only if normal round */
};

function nextSign() {
  if (si >= C.signs.length) { ti = 0; stepsDone = 0; renderStep(); go("train"); }
  else renderSign();
}

/* ================================================== 3 · SELF-EXAM ======= */
function renderStep() {
  const s = C.steps[ti]; if (!s) return;
  $("#tchip").textContent = (lang === "hi" ? "चरण " : "STEP ") + s.n + " / " + C.steps.length;
  $("#tphoto").innerHTML = s.photo
    ? `<picture><source srcset="img/${s.photo}.webp" type="image/webp">
       <img src="img/${s.photo}.jpg" alt="${s.h[lang]}" loading="lazy"></picture>`
    : `<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
        <rect width="240" height="150" fill="#fdf1f7"/>
        <circle cx="76" cy="75" r="40" fill="${SK}" stroke="${LN}" stroke-width="2"/>
        <circle cx="164" cy="75" r="40" fill="${SK}" stroke="${LN}" stroke-width="2"/>
        <circle cx="76" cy="75" r="12" fill="${SH}"/><circle cx="164" cy="75" r="12" fill="${SH}"/>
        <circle cx="60" cy="54" r="7" fill="${SH}" opacity=".85"/><circle cx="180" cy="54" r="7" fill="${SH}" opacity=".85"/>
        <circle cx="60" cy="54" r="15" fill="none" stroke="${PK}" stroke-width="2.6" stroke-dasharray="6 5"/>
        <circle cx="180" cy="54" r="15" fill="none" stroke="${PK}" stroke-width="2.6" stroke-dasharray="6 5"/>
        <path d="M78 54h84" stroke="${PK}" stroke-width="2.2" stroke-dasharray="5 5"/>
      </svg>`;
  $("#th").textContent = s.h[lang];
  $("#tp").textContent = s.p[lang];
  $("#tdots").innerHTML = C.steps.map((_, i) => `<i class="${i === ti ? "on" : ""}"></i>`).join("");
  $("#tprev").style.visibility = ti === 0 ? "hidden" : "visible";
  $("#tnext").textContent = ti === C.steps.length - 1 ? T("continue") : T("gotIt");
  updateProg();
}

$("#tprev").onclick = () => { if (ti > 0) { ti--; renderStep(); } };
$("#tnext").onclick = () => {
  stepsDone = Math.max(stepsDone, ti + 1);
  track("step_done", {module:"trainer", item_id:"step" + C.steps[ti].n});
  if (ti === C.steps.length - 1) { renderPatterns(); go("tech"); }
  else { ti++; renderStep(); }
};

/* patterns */
let pat = null;
function renderPatterns() {
  $("#patgrid").innerHTML = C.procedures.map(p =>
    `<button class="pat${pat === p.id ? " on" : ""}" data-p="${p.id}">
      <picture><source srcset="img/${p.photo}.webp" type="image/webp"><img src="img/${p.photo}.jpg" alt=""></picture>
      <span>${p.h[lang]}</span></button>`).join("");
  const p = C.procedures.find(x => x.id === pat);
  $("#patBox").hidden = !p;
  if (p) { $("#patH").textContent = p.h[lang]; $("#patP").textContent = p.p[lang] + " " + C.ui.patternNote[lang]; }
}
$("#patgrid").addEventListener("click", e => {
  const b = e.target.closest("[data-p]"); if (!b) return;
  pat = b.dataset.p; track("pattern_pick", {item_id: pat}); renderPatterns();
});

/* ================================================== RESULT ============== */
function total() { return mythScore + signScore + stepsDone; }
function renderResult(animate) {
  if (animate) { countUp($("#rBig"), total(), 900, "/" + MAX); buzz(WIN_BUZZ); burst(40); setTimeout(() => burst(30), 400); }
  else $("#rBig").textContent = total() + "/" + MAX;
  $("#sc1").textContent = mythScore + "/" + C.myths.length;
  $("#sc2").textContent = signScore + "/" + C.signs.length;
  $("#sc3").textContent = stepsDone + "/" + C.steps.length;
  let band = C.bands[0];
  C.bands.forEach(b => { if (total() >= b.min) band = b; });
  $("#rT").textContent = band.t[lang];
  $("#rM").textContent = band.m[lang];
}

/* ================================================== CERTIFICATE =========
   Visual language lifted from the Pink Wave 2026 poster: magenta gradient,
   flowing ribbon waves, drifting petals, a white card, script accent line.
   ------------------------------------------------------------------------ */
function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);         g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
/* Letter-spaced centred text. NEVER applied to Devanagari — splitting the
   string per character would break conjuncts and detach matras. */
function sp(g, text, cx, y, gap) {
  if (/[ऀ-ॿ]/.test(text)) { g.fillText(text, cx, y); return; }
  const chars = [...text];
  const w = chars.reduce((a, c) => a + g.measureText(c).width + gap, -gap);
  let x = cx - w / 2;
  chars.forEach(c => { g.fillText(c, x + g.measureText(c).width / 2, y); x += g.measureText(c).width + gap; });
}

let certBg = null;
function loadCertBg() {
  if (certBg) return Promise.resolve(certBg);
  const webpOK = document.createElement("canvas").toDataURL("image/webp").indexOf("webp") > -1;
  const tries  = webpOK ? ["img/cert.webp", "img/cert.jpg"] : ["img/cert.jpg"];
  /* Try each source in turn — a 404 or a decode failure on the webp must still
     leave the participant with a certificate. */
  return new Promise((res, rej) => {
    (function attempt(i) {
      if (i >= tries.length) return rej(new Error("certificate background unavailable"));
      const im = new Image();
      im.onload  = () => { certBg = im; res(im); };
      im.onerror = () => attempt(i + 1);
      im.src = tries[i];
    })(0);
  });
}

async function drawCert(name) {
  const cv = $("#pcanvas"), g = cv.getContext("2d");
  let bg;
  try { bg = await loadCertBg(); }
  catch (e) { return; }                 /* no background → don't draw a broken card */

  cv.width  = bg.naturalWidth;          /* 1600 x 1131, the official artwork */
  cv.height = bg.naturalHeight;
  const W = cv.width, H = cv.height;
  g.drawImage(bg, 0, 0, W, H);

  /* The design leaves a gap between "Certificate of Participation" and
     "In Recognition of..." — that is where the participant's name belongs. */
  const cx = W * 0.514, base = H * 0.472;

  const nm = (name || (lang === "hi" ? "एक जागरूक मित्र" : "A Breast-Aware Friend")).trim().slice(0, 30);
  g.textAlign = "center";
  g.fillStyle = "#1f2a51";                       /* the navy used by the body text */
  const serif = lang === "hi" ? "700" : "italic 700";
  const face  = lang === "hi" ? "system-ui, sans-serif" : "Georgia, 'Times New Roman', serif";

  let fs = Math.round(H * 0.072);
  g.font = `${serif} ${fs}px ${face}`;
  while (g.measureText(nm).width > W * 0.52 && fs > 22) {
    fs -= 2; g.font = `${serif} ${fs}px ${face}`;
  }
  g.save();
  g.shadowColor = "rgba(255,255,255,.85)"; g.shadowBlur = 12;
  g.fillText(nm, cx, base);
  g.restore();

  /* score, small and deferential to the original layout */
  g.font = `600 ${Math.round(H * 0.026)}px system-ui, sans-serif`;
  g.fillStyle = "rgba(31,42,81,.78)";
  g.fillText(
    lang === "hi" ? `जागरूकता स्कोर ${total()} / ${MAX}` : `Awareness score ${total()} / ${MAX}`,
    cx, base + H * 0.045
  );

  $("#pdl").href = cv.toDataURL("image/png");
  $("#pout").hidden = false;
  burst(26);
}

function waShare(text) { window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener"); }

async function shareCert() {
  const txt = (lang === "hi"
    ? `मैंने पिंक प्रतिज्ञा ली 🩷 स्कोर ${total()}/${MAX}। आप भी परखिए — 6 मिनट में जानिए स्तन कैंसर का सच। #JoinTheWave `
    : `I took the Pink Pledge 🩷 scored ${total()}/${MAX}. Can you beat me? Six minutes to learn what's really true about breast cancer. #JoinTheWave `) + SITE_URL;
  track("share", {from:"certificate"});
  try {
    const blob = await new Promise(r => $("#pcanvas").toBlob(r, "image/png"));
    const file = new File([blob], "pink-wave-2026.png", {type:"image/png"});
    if (navigator.canShare && navigator.canShare({files:[file]})) {
      await navigator.share({files:[file], text:txt}); return;
    }
  } catch (e) { /* fall through */ }
  waShare(txt);
}

/* ================================================== BROCHURE =========== */
function getBrochure(which) {
  const name = $("#bName").value.trim(), city = $("#bCity").value.trim(), role = $("#bRole").value;
  if (!name || !city) {
    alert(lang === "hi" ? "कृपया नाम और शहर भरें।" : "Please fill in your name and city.");
    return;
  }
  /* The pledge is deliberately optional — the brochure is a health resource and
     should never be held hostage. Recording false is as useful as recording true. */
  const pledged = $("#bPledge").checked;
  track("brochure_download", {name, city, role, language_downloaded: which, pledged});
  const a = document.createElement("a");
  a.href = which === "hi" ? "brochure_hin.pdf" : "brochure_eng.pdf";
  a.download = which === "hi" ? "SGPGI-स्तन-स्वास्थ्य-पुस्तिका.pdf" : "SGPGI-Breast-Health-Guide.pdf";
  document.body.appendChild(a); a.click(); a.remove();
}

/* ================================================== EVENT / CLINIC ===== */
function renderEvent() {
  $("#evRows").innerHTML = C.event.map(r =>
    r.map
      ? `<a class="row maprow" href="${C.mapUrl}" target="_blank" rel="noopener">
           <span class="k">${r.k[lang].toUpperCase()}</span>
           <span class="v">${r.v[lang]}<br><span class="mapcta">📍 ${C.mapCta[lang]} →</span></span></a>`
      : `<div class="row"><span class="k">${r.k[lang].toUpperCase()}</span><span class="v">${r.v[lang]}</span></div>`
  ).join("");
  $("#regBtn").href = REGISTER_URL;
  const c = C.clinic;
  $("#clinicBox").innerHTML = `<h3>${T("seeDoctor")}</h3>
    <p class="muted" style="margin-bottom:8px">${c.name[lang]}<br>${c.addr[lang]}<br>${c.hours[lang]}</p>
    <a class="btn sm" href="tel:${c.phone.replace(/[^+\d]/g,"")}">📞 ${c.phone}</a>`;
}


/* =========================================================================
   PINK WAVE RUNNER
   Three lanes, behind-the-back perspective. Ribbons to collect, myths to
   dodge. Short label on the sign; the full correction appears only on the
   game-over card, so playing never turns into reading.
   ========================================================================= */
const RUN = (() => {
  const el = {}, S = {};
  let g, W = 0, H = 0, DPR = 1, raf = 0, bound = false;
  let best = +(localStorage.getItem("pw_runBest") || 0);

  const HOR = () => H * 0.42, GND = () => H * 0.95;
  const proj = z => 1 / (1 + z * 6);
  const syy = (z, lift = 0) => HOR() + (GND() - HOR()) * proj(z) - lift * proj(z);
  const LW = () => W * 0.235;
  const sxx = (lane, z) => W / 2 + lane * LW() * proj(z);
  const rnd = (a, b) => a + Math.random() * (b - a);

  function size() {
    W = Math.min(innerWidth, 460); H = innerHeight;
    DPR = Math.min(2, devicePixelRatio || 1);
    el.cv.width = W * DPR; el.cv.height = H * DPR;
    el.cv.style.width = W + "px"; el.cv.style.height = H + "px";
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function reset() {
    Object.assign(S, {
      running:false, lane:0, laneT:0, jump:0, jumpV:0,
      dist:0, ribbons:0, speed:0.30, items:[], scen:[], floats:[],
      spawnZ:1, shake:0, magnet:0, beat:false, milestone:0, t0:0, started:0
    });
    for (let i = 0; i < 22; i++) S.scen.push({
      z:i/22, side:Math.random()<.5?-1:1, off:rnd(1.9,3.0),
      kind:Math.random()<.42?"lamp":(Math.random()<.5?"tree":"flag")
    });
  }

  /* ---------------- spawning ---------------- */
  function spawn() {
    const r = Math.random();
    if (r < 0.44) {
      const l = (Math.random()*3|0)-1, n = 2+(Math.random()*3|0);
      for (let i=0;i<n;i++) S.items.push({t:"rib",lane:l,z:1+i*0.055,gold:Math.random()<0.10});
    } else if (r < 0.85) {
      const ls = [-1,0,1].sort(()=>Math.random()-0.5).slice(0, Math.random()<0.26?2:1);
      const m = C.gameMyths[(Math.random()*C.gameMyths.length)|0];
      ls.forEach(l => S.items.push({t:"myth",lane:l,z:1,m}));
    } else {
      S.items.push({t:"bar",lane:(Math.random()*3|0)-1,z:1});
    }
  }

  /* ---------------- input ---------------- */
  function swipe(dx, dy) {
    if (!S.running) return;
    if (Math.abs(dx) > Math.abs(dy)) { S.lane = dx>0 ? Math.min(1,S.lane+1) : Math.max(-1,S.lane-1); buzz(8); }
    else if (dy < 0 && S.jump <= 0) { S.jumpV = 1.55; buzz(12); }
  }
  function bind() {
    if (bound) return; bound = true;
    let tx=0, ty=0, td=0, md=false;
    el.cv.addEventListener("touchstart", e=>{const t=e.touches[0];tx=t.clientX;ty=t.clientY;td=Date.now()},{passive:true});
    el.cv.addEventListener("touchend", e=>{const t=e.changedTouches[0];
      if (Date.now()-td<600) swipe(t.clientX-tx, t.clientY-ty)},{passive:true});
    el.cv.addEventListener("mousedown", e=>{md=true;tx=e.clientX;ty=e.clientY});
    addEventListener("mouseup", e=>{if(md){md=false;swipe(e.clientX-tx,e.clientY-ty)}});
    addEventListener("keydown", e=>{
      if (el.wrap.hidden) return;
      if (e.key==="ArrowLeft") swipe(-99,0);
      if (e.key==="ArrowRight") swipe(99,0);
      if (e.key==="ArrowUp"||e.key===" ") { e.preventDefault(); swipe(0,-99); }
      if (e.key==="Escape") close();
    });
    addEventListener("resize", ()=>{ if(!el.wrap.hidden){ size(); draw(); } });
  }

  /* ---------------- scenery ---------------- */
  function sky() {
    const b = HOR()+14;
    const grd = g.createLinearGradient(0,0,0,b);
    grd.addColorStop(0,"#ff6fae");grd.addColorStop(.30,"#ff9ec6");
    grd.addColorStop(.62,"#ffc7d8");grd.addColorStop(1,"#ffe8cb");
    g.fillStyle=grd;g.fillRect(0,0,W,b);

    const cx=W*0.5, cy=HOR()-H*0.075, R=H*0.062;
    const hal=g.createRadialGradient(cx,cy,R*0.5,cx,cy,R*4.2);
    hal.addColorStop(0,"rgba(255,246,214,.75)");hal.addColorStop(1,"rgba(255,246,214,0)");
    g.fillStyle=hal;g.beginPath();g.arc(cx,cy,R*4.2,0,7);g.fill();
    g.fillStyle="#fff6db";g.beginPath();g.arc(cx,cy,R,0,7);g.fill();

    g.fillStyle="rgba(255,255,255,.34)";
    for (let i=0;i<4;i++){
      const x=((i*W*0.42 - S.dist*2.2*(0.4+i*0.12))%(W*1.7))-W*0.35;
      const y=H*(0.07+i*0.052), s=H*(0.020+i*0.005);
      g.beginPath();
      g.ellipse(x,y,s*2.6,s,0,0,7);
      g.ellipse(x+s*1.7,y-s*.45,s*1.8,s*.8,0,0,7);
      g.ellipse(x-s*1.7,y+s*.15,s*1.5,s*.7,0,0,7);
      g.fill();
    }

    const u=W/430, shift=-(S.dist*0.55)%(W*1.2);
    g.fillStyle="rgba(196,104,150,.42)";
    for (const base of [shift, shift+W*1.2]) {
      g.beginPath();g.moveTo(base,b);
      g.lineTo(base,b-24*u);g.lineTo(base+34*u,b-24*u);g.lineTo(base+34*u,b-48*u);
      g.quadraticCurveTo(base+48*u,b-70*u,base+62*u,b-48*u);g.lineTo(base+62*u,b-24*u);
      g.lineTo(base+98*u,b-24*u);g.lineTo(base+98*u,b);
      g.lineTo(base+140*u,b);g.lineTo(base+140*u,b-38*u);
      g.quadraticCurveTo(base+158*u,b-98*u,base+176*u,b-38*u);g.lineTo(base+176*u,b);
      g.lineTo(base+226*u,b);g.lineTo(base+226*u,b-28*u);
      g.quadraticCurveTo(base+240*u,b-56*u,base+254*u,b-28*u);g.lineTo(base+254*u,b);
      g.lineTo(base+310*u,b);g.lineTo(base+310*u,b-56*u);
      g.quadraticCurveTo(base+330*u,b-108*u,base+350*u,b-56*u);g.lineTo(base+350*u,b);
      g.lineTo(base+W*1.2,b);g.closePath();g.fill();
    }
  }
  function ground() {
    const grd=g.createLinearGradient(0,HOR(),0,H);
    grd.addColorStop(0,"#efc2d5");grd.addColorStop(.30,"#e3a8c4");grd.addColorStop(1,"#d28fb0");
    g.fillStyle=grd;g.fillRect(0,HOR(),W,H-HOR());
  }
  function road() {
    const nearH=LW()*1.5, farH=nearH*proj(1);
    g.fillStyle="#c98cb0";
    g.beginPath();
    g.moveTo(W/2-nearH*1.34,GND());g.lineTo(W/2+nearH*1.34,GND());
    g.lineTo(W/2+farH*1.34,syy(1));g.lineTo(W/2-farH*1.34,syy(1));
    g.closePath();g.fill();
    const rg=g.createLinearGradient(0,syy(1),0,GND());
    rg.addColorStop(0,"#c9a3ba");rg.addColorStop(1,"#e0bdd0");
    g.fillStyle=rg;
    g.beginPath();
    g.moveTo(W/2-nearH,GND());g.lineTo(W/2+nearH,GND());
    g.lineTo(W/2+farH,syy(1));g.lineTo(W/2-farH,syy(1));
    g.closePath();g.fill();

    for (let k=0;k<26;k++){
      const z0=(k*0.04+(S.dist*0.06)%0.04), z1=z0+0.02;
      if (z1>1) continue;
      g.fillStyle=(k%2)?"#fff":"#f0a7c7";
      [-1,1].forEach(sg=>{
        g.beginPath();
        g.moveTo(W/2+sg*nearH*proj(z0),syy(z0));
        g.lineTo(W/2+sg*nearH*proj(z1),syy(z1));
        g.lineTo(W/2+sg*nearH*1.1*proj(z1),syy(z1));
        g.lineTo(W/2+sg*nearH*1.1*proj(z0),syy(z0));
        g.closePath();g.fill();
      });
    }
    g.strokeStyle="rgba(255,255,255,.72)";
    const off=(S.dist*0.06)%0.08;
    for (const l of [-0.5,0.5]) for (let k=0;k<13;k++){
      const z0=k*0.08+off, z1=z0+0.038;
      if (z0>1||z1>1) continue;
      g.lineWidth=Math.max(1,3.6*proj(z0));
      g.beginPath();
      g.moveTo(W/2+l*LW()*proj(z0),syy(z0));
      g.lineTo(W/2+l*LW()*proj(z1),syy(z1));
      g.stroke();
    }
  }
  function scenery(o) {
    const p=proj(o.z), x=W/2+o.side*LW()*o.off*p, y=syy(o.z);
    if (o.kind==="lamp") {
      const h=H*0.36*p;
      g.strokeStyle="rgba(116,54,88,.8)";g.lineWidth=Math.max(1.2,5.5*p);
      g.beginPath();g.moveTo(x,y);g.lineTo(x,y-h);g.stroke();
      g.beginPath();g.moveTo(x,y-h);g.quadraticCurveTo(x-o.side*10*p,y-h-6*p,x-o.side*18*p,y-h);g.stroke();
      const lx=x-o.side*18*p;
      g.fillStyle="rgba(255,226,170,.25)";g.beginPath();g.arc(lx,y-h,Math.max(4,22*p),0,7);g.fill();
      g.fillStyle="#ffeab5";g.beginPath();g.arc(lx,y-h,Math.max(2,7*p),0,7);g.fill();
    } else if (o.kind==="tree") {
      const h=H*0.26*p;
      g.strokeStyle="#8c5a3c";g.lineWidth=Math.max(1.4,7*p);
      g.beginPath();g.moveTo(x,y);g.lineTo(x,y-h*0.55);g.stroke();
      g.fillStyle="#4f9e6b";
      g.beginPath();g.arc(x,y-h*0.78,h*0.34,0,7);g.fill();
      g.beginPath();g.arc(x-h*0.22,y-h*0.60,h*0.26,0,7);g.fill();
      g.beginPath();g.arc(x+h*0.22,y-h*0.60,h*0.26,0,7);g.fill();
      g.fillStyle="rgba(255,150,200,.75)";
      for (let i=0;i<5;i++){g.beginPath();
        g.arc(x+Math.cos(i*1.7+o.z*9)*h*0.30,y-h*0.72+Math.sin(i*2.1)*h*0.22,Math.max(1,h*0.055),0,7);g.fill()}
    } else {
      const h=H*0.22*p;
      g.strokeStyle="rgba(116,54,88,.7)";g.lineWidth=Math.max(1,3.4*p);
      g.beginPath();g.moveTo(x,y);g.lineTo(x,y-h);g.stroke();
      g.fillStyle="#ff4fa6";
      g.beginPath();g.moveTo(x,y-h);g.lineTo(x-o.side*16*p,y-h+7*p);g.lineTo(x,y-h+14*p);g.closePath();g.fill();
    }
  }

  /* ---------------- items ---------------- */
  function ribbon(x,y,s,gold) {
    g.save();g.translate(x,y);g.scale(s,s);
    if (gold) {
      const hal=g.createRadialGradient(0,-4,2,0,-4,30);
      hal.addColorStop(0,"rgba(255,226,140,.65)");hal.addColorStop(1,"rgba(255,226,140,0)");
      g.fillStyle=hal;g.beginPath();g.arc(0,-4,30,0,7);g.fill();
    }
    g.strokeStyle=gold?"#f7c948":"#ff2f9c";g.lineWidth=5.4;g.lineCap="round";g.lineJoin="round";
    g.beginPath();
    g.moveTo(-7,16);g.lineTo(2,0);
    g.bezierCurveTo(-9,-7,-9,-21,1,-24);
    g.bezierCurveTo(11,-21,11,-7,-1,0);
    g.lineTo(8,16);
    g.stroke();
    g.strokeStyle="rgba(255,255,255,.55)";g.lineWidth=1.6;g.stroke();
    g.restore();
  }
  function rr(x,y,w,h,r){
    g.beginPath();g.moveTo(x+r,y);
    g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);
    g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();
  }
  function mythSign(o) {
    const p=proj(o.z), x=sxx(o.lane,o.z), y=syy(o.z);
    const w=LW()*p*0.90, h=w*0.52, postH=h*0.75;
    g.save();g.translate(x,y);
    g.fillStyle="rgba(70,10,45,.20)";
    g.beginPath();g.ellipse(0,0,w*.42,h*.10,0,0,7);g.fill();
    g.strokeStyle="#9a6b85";g.lineWidth=Math.max(1,w*0.05);
    g.beginPath();g.moveTo(-w*.3,0);g.lineTo(-w*.3,-postH);g.stroke();
    g.beginPath();g.moveTo( w*.3,0);g.lineTo( w*.3,-postH);g.stroke();
    const top=-postH-h;
    g.fillStyle="#fff";rr(-w/2,top,w,h,h*0.18);g.fill();
    g.strokeStyle="#e91e8c";g.lineWidth=Math.max(1.2,w*0.045);rr(-w/2,top,w,h,h*0.18);g.stroke();
    g.fillStyle="#e91e8c";g.fillRect(-w/2,top,w,h*0.17);
    const label=o.m.s[lang];
    let fs=h*0.30, lines=[];
    for (let pass=0;pass<7;pass++){
      g.font=`900 ${fs}px system-ui,sans-serif`;
      lines=[];let cur="";
      label.split(" ").forEach(wd=>{
        const t=(cur?cur+" ":"")+wd;
        if (g.measureText(t).width>w*0.84&&cur){lines.push(cur);cur=wd} else cur=t;
      });
      if (cur) lines.push(cur);
      if (lines.every(l=>g.measureText(l).width<=w*0.86)&&lines.length*fs*1.1<=h*0.70) break;
      fs*=0.86;
    }
    g.fillStyle="#7a1140";g.textAlign="center";g.textBaseline="middle";
    const cy=top+h*0.17+(h*0.83)/2;
    lines.forEach((l,i)=>g.fillText(l,0,cy+(i-(lines.length-1)/2)*fs*1.1));
    g.restore();
  }
  function hurdle(o) {
    const p=proj(o.z), x=sxx(o.lane,o.z), y=syy(o.z);
    const w=LW()*p*0.86, h=w*0.26;
    g.fillStyle="rgba(70,10,45,.18)";
    g.beginPath();g.ellipse(x,y,w*.45,h*.20,0,0,7);g.fill();
    for (let i=0;i<5;i++){g.fillStyle=(i%2)?"#fff":"#e91e8c";g.fillRect(x-w/2+i*w/5,y-h,w/5,h)}
    g.strokeStyle="#b3126b";g.lineWidth=Math.max(1,w*0.03);g.strokeRect(x-w/2,y-h,w,h);
  }
  function hero() {
    const z=0.06,p=proj(z);
    const x=W/2+S.laneT*LW()*p, y=syy(z,S.jump*H*0.30);
    const s=p*3.2, tilt=(S.lane-S.laneT)*0.22;
    g.save();g.translate(x,y);g.rotate(tilt);g.scale(s,s);
    const run=S.dist*9, sw=Math.sin(run)*7.5, bob=S.running?Math.abs(Math.sin(run))*-1.6:0;
    g.fillStyle="rgba(70,10,45,.26)";
    g.beginPath();g.ellipse(0,2,13*(1-S.jump*.45),4.2*(1-S.jump*.45),0,0,7);g.fill();
    g.translate(0,bob);
    g.strokeStyle="#4a2438";g.lineWidth=5;g.lineCap="round";
    g.beginPath();g.moveTo(0,-14);g.lineTo(sw*.62,0);g.stroke();
    g.beginPath();g.moveTo(0,-14);g.lineTo(-sw*.62,0);g.stroke();
    g.fillStyle="#fff";
    g.beginPath();g.ellipse(sw*.62,1,3.2,1.8,0,0,7);g.fill();
    g.beginPath();g.ellipse(-sw*.62,1,3.2,1.8,0,0,7);g.fill();
    const tg=g.createLinearGradient(0,-34,0,-13);
    tg.addColorStop(0,"#ff56ad");tg.addColorStop(1,"#e0197f");
    g.fillStyle=tg;
    g.beginPath();g.moveTo(-8,-34);g.lineTo(8,-34);g.lineTo(7,-13);g.lineTo(-7,-13);g.closePath();g.fill();
    g.strokeStyle="#f0c4a2";g.lineWidth=4;
    g.beginPath();g.moveTo(-7,-31);g.lineTo(-12,-20+sw*.34);g.stroke();
    g.beginPath();g.moveTo(7,-31);g.lineTo(12,-20-sw*.34);g.stroke();
    g.fillStyle="#f0c4a2";g.beginPath();g.arc(0,-41,7,0,7);g.fill();
    g.fillStyle="#37262f";g.beginPath();g.arc(0,-43,7.3,Math.PI,0);g.fill();
    const pt=Math.sin(run)*2.4;
    g.beginPath();g.moveTo(-6,-42);g.quadraticCurveTo(-13-pt,-37,-10-pt,-27);g.lineTo(-6,-33);g.closePath();g.fill();
    g.strokeStyle="#fff";g.lineWidth=1.7;g.lineCap="round";
    g.beginPath();g.moveTo(-2.4,-25);g.lineTo(1.2,-30);g.moveTo(3,-25);g.lineTo(-.4,-30);g.stroke();
    g.restore();
  }
  function addFloat(txt,x,y,col){S.floats.push({txt,x,y,col,t:0})}
  function drawFloats(dt) {
    S.floats.forEach(f=>{f.t+=dt;f.y-=dt*70});
    S.floats=S.floats.filter(f=>f.t<0.9);
    g.textAlign="center";g.textBaseline="middle";
    S.floats.forEach(f=>{
      g.globalAlpha=Math.max(0,1-f.t/0.9);
      g.font="900 21px system-ui,sans-serif";g.fillStyle=f.col;
      g.strokeStyle="rgba(255,255,255,.9)";g.lineWidth=3;
      g.strokeText(f.txt,f.x,f.y);g.fillText(f.txt,f.x,f.y);
    });
    g.globalAlpha=1;
  }

  /* ---------------- loop ---------------- */
  function step(ts) {
    if (!S.running) return;
    const dt=Math.min(0.05,(ts-S.t0)/1000||0.016); S.t0=ts;

    S.speed=0.30+Math.min(0.92,S.dist/850);
    S.dist+=S.speed*dt*60*0.55;
    S.laneT+=(S.lane-S.laneT)*Math.min(1,dt*13);
    if (S.jumpV>0||S.jump>0){S.jump+=S.jumpV*dt*3.2;S.jumpV-=dt*7.5;if(S.jump<=0){S.jump=0;S.jumpV=0}}

    S.scen.forEach(o=>{o.z-=S.speed*dt*0.9;
      if(o.z<0){o.z+=1;o.side=Math.random()<.5?-1:1;o.off=rnd(1.9,3.0);
        o.kind=Math.random()<.42?"lamp":(Math.random()<.5?"tree":"flag")}});

    S.spawnZ-=S.speed*dt*0.9;
    if (S.spawnZ<=0.62){spawn();S.spawnZ=1}

    for (const o of S.items) {
      o.z-=S.speed*dt*0.9;
      if (S.magnet>0&&o.t==="rib"&&o.z<0.32) o.lane+=(S.laneT-o.lane)*Math.min(1,dt*6);
    }
    for (const o of S.items) {
      if (o.z>0.10||o.z<0||o.hitDone) continue;
      if (Math.abs(o.lane-S.laneT)>=0.55) continue;
      o.hitDone=true;
      if (o.t==="rib") {
        S.ribbons+=o.gold?5:1;
        addFloat(o.gold?"+5 ⭐":"+1", sxx(o.lane,0.1), syy(0.1,H*0.09), o.gold?"#e8a200":"#e91e8c");
        if (o.gold) S.magnet=3.2;
        buzz(o.gold?[10,25,10]:8); o.dead=true;
      } else if (o.t==="bar") { if (S.jump<0.32) return crash(null); }
      else return crash(o.m);
    }
    if (S.magnet>0) S.magnet-=dt;
    S.items=S.items.filter(o=>o.z>-0.05&&!o.dead);

    if (Math.floor(S.dist/250)>S.milestone) {
      S.milestone=Math.floor(S.dist/250);
      addFloat(S.milestone*250+" m 🎀",W/2,H*0.30,"#b3126b");buzz([10,30,10]);
    }
    if (!S.beat&&best>0&&S.dist>best) {
      S.beat=true;addFloat(C.game.beat[lang],W/2,H*0.24,"#e8a200");buzz([15,40,15,40,30]);
    }
    draw(dt);
    raf=requestAnimationFrame(step);
  }

  function draw(dt=0.016) {
    g.clearRect(0,0,W,H);
    g.save();
    if (S.shake>0){g.translate((Math.random()-.5)*S.shake,(Math.random()-.5)*S.shake);S.shake*=0.88}
    sky();ground();road();
    S.scen.slice().sort((a,b)=>b.z-a.z).forEach(scenery);
    S.items.slice().sort((a,b)=>b.z-a.z).forEach(o=>{
      if (o.t==="rib") ribbon(sxx(o.lane,o.z),syy(o.z,H*0.052),LW()*proj(o.z)/30,o.gold);
      else if (o.t==="myth") mythSign(o);
      else hurdle(o);
    });
    hero();
    if (S.speed>0.72) {
      g.strokeStyle="rgba(255,255,255,.28)";g.lineWidth=2;
      for (let i=0;i<7;i++){
        const yy=H*0.5+((i*97+S.dist*70)%(H*0.45));
        const xx=(i%2?1:-1)*(W*0.30+(i*13)%40)+W/2;
        g.beginPath();g.moveTo(xx,yy);g.lineTo(xx,yy+18);g.stroke();
      }
    }
    g.restore();
    drawFloats(dt);

    g.textAlign="left";g.textBaseline="alphabetic";
    g.fillStyle="rgba(255,255,255,.96)";
    g.strokeStyle="rgba(120,20,80,.30)";g.lineWidth=4;
    g.font="900 31px system-ui,sans-serif";
    const m=Math.floor(S.dist)+" m";
    g.strokeText(m,16,H*0.085);g.fillText(m,16,H*0.085);
    g.font="800 14px system-ui,sans-serif";
    g.strokeText("🎀 "+S.ribbons,16,H*0.085+22);g.fillText("🎀 "+S.ribbons,16,H*0.085+22);
    if (best){g.textAlign="right";
      const b="best "+best+" m";
      g.strokeText(b,W-58,H*0.085);g.fillText(b,W-58,H*0.085)}
    if (S.magnet>0){g.textAlign="center";g.fillStyle="#ffe9a8";
      const t=C.game.magnet[lang];
      g.strokeText(t,W/2,H*0.085+22);g.fillText(t,W/2,H*0.085+22)}
  }

  /* ---------------- screens ---------------- */
  const G = k => C.game[k][lang];
  function gpanel(html){ el.panel.innerHTML=html; el.ui.classList.remove("hide"); }

  function crash(myth) {
    S.running=false;S.shake=20;buzz([30,80,30]);
    cancelAnimationFrame(raf);
    const score=Math.floor(S.dist), isBest=score>best;
    if (isBest){best=score;localStorage.setItem("pw_runBest",best)}
    draw();
    track("game_over",{score, best_combo:S.ribbons, duration_s:Math.round((Date.now()-S.started)/1000)});
    gpanel(`
      <div class="gbig">${score}<small>${G("metres")}</small></div>
      <div class="grow">
        <div><b>🎀 ${S.ribbons}</b><span>${G("ribbons")}</span></div>
        <div><b>${best}</b><span>${G("yourBest")}</span></div>
        <div><b>${(score/1000).toFixed(2)}</b><span>${G("km")}</span></div>
      </div>
      ${myth ? `<div class="ghit"><b>“${myth.s[lang]}” ${G("stopped")}</b>${myth.f[lang]}</div>`
             : `<div class="ghit"><b>${G("tripTtl")}</b>${G("tripBdy")}</div>`}
      ${isBest?`<div style="font-weight:900;color:#e8a200;margin:8px 0 2px">${G("newBest")}</div>`:""}
      <button class="btn" id="gAgain">${G("again")}</button>
      <button class="btn ghost" id="gDone">${G("close")}</button>`);
    el.panel.querySelector("#gAgain").onclick=play;
    el.panel.querySelector("#gDone").onclick=close;
  }

  function intro() {
    reset();size();draw();
    gpanel(`
      <h3>Pink <em>Wave</em> Runner</h3>
      <p class="gsub">${G("sub")}</p>
      <div class="ghow">
        <div><b>⬅➡</b>${G("how1")}</div>
        <div><b>⬆</b>${G("how2")}</div>
        <div><b>🎀</b>${G("how3")}</div>
      </div>
      <button class="btn" id="gPlay">${G("play")}</button>
      <p class="gsub" style="margin:12px 0 0;font-size:11px">${G("shared")}</p>`);
    el.panel.querySelector("#gPlay").onclick=play;
  }

  function play() {
    reset();size();S.running=true;S.started=Date.now();
    el.ui.classList.add("hide");
    S.t0=performance.now();raf=requestAnimationFrame(step);
    track("view",{module:"game"});
  }

  function open() {
    el.wrap.hidden=false;
    document.body.style.overflow="hidden";
    bind();intro();
  }
  function close() {
    S.running=false;cancelAnimationFrame(raf);
    el.wrap.hidden=true;
    document.body.style.overflow="";
  }

  function init() {
    el.wrap=$("#game");el.cv=$("#gcv");el.ui=$("#gui");el.panel=$("#gpanel");
    g=el.cv.getContext("2d");
    $("#gclose").onclick=close;
    reset();
  }
  return {init, open, close};
})();

/* ================================================== MENU SHEET ========= */
const MENU = [
  ["myths","m1Title"], ["signs","m2Title"], ["train","m3Title"],
  ["pledge","pledgeTitle"], ["broch","brochureTitle"], ["videos","videoChip"], ["event","eventTitle"]
];
const MENU_GAME = "__game__";
$("#menuBtn").onclick = () => {
  $("#sheetIn").innerHTML = `<h3>${T("menu")}</h3>` +
    `<button class="btn ghost sm mt8" data-go="${MENU_GAME}">🏃‍♀️ ${C.game.menu[lang]}</button>` +
    MENU.map(([id,k]) => `<button class="btn ghost sm mt8" data-go="${id}">${T(k)}</button>`).join("") +
    `<button class="btn ghost sm mt" id="closeSheet">✕</button>`;
  $("#sheet").classList.add("on");
};
$("#sheet").addEventListener("click", e => {
  if (e.target.id === "sheet" || e.target.id === "closeSheet") { $("#sheet").classList.remove("on"); return; }
  const b = e.target.closest("[data-go]");
  if (b) {
    $("#sheet").classList.remove("on");
    const d = b.dataset.go;
    if (d === MENU_GAME) return RUN.open();
    if (d === "myths") return startMyths();
    if (d === "signs") { si = 0; signScore = 0; renderSign(); }
    if (d === "train") { ti = 0; renderStep(); }
    go(d);
  }
});

/* ================================================== WIRING ============= */
$("#bEn").onclick = () => setLang("en");
$("#bHi").onclick = () => setLang("hi");
$("#home").onclick = () => go("splash");
$("#backBtn").onclick = () => {
  const s = document.body.dataset.screen;
  const parent = {myths:"splash", signs:"myths", train:"signs", tech:"train", result:"tech",
                  pledge:"result", broch:"pledge", event:"pledge", videos:"pledge"};
  go(parent[s] || "splash");
};

$("#goStart").onclick = startMyths;
$("#aM").onclick = () => answerQ("myth");
$("#aF").onclick = () => answerQ("fact");
$("#qnext").onclick = nextQ;
$("#snext").onclick = nextSign;
$("#techDone").onclick = () => { go("result"); renderResult(true); track("complete", {score: total(), max: MAX}); };
$("#toPledge").onclick = () => go("pledge");
$("#again").onclick = () => { startMyths(); };
$("#pmake").onclick = async () => { await drawCert($("#pname").value.trim()); track("pledge", {name: $("#pname").value.trim()}); };
$("#pshare").onclick = shareCert;
$("#toGame").onclick  = () => RUN.open();
$("#toGame2").onclick = () => RUN.open();
$("#toBroch").onclick = () => go("broch");
$("#toEvent").onclick = () => go("event");
$("#toVideos").onclick = () => go("videos");
$("#bPledge").onchange = (e) => {
  $("#bThanks").hidden = !e.target.checked;
  if (e.target.checked) {
    buzz(OK_BUZZ);
    const r = $("#bPledge").closest(".pledgebox").getBoundingClientRect();
    burst(14, r.left + 30, r.top + r.height / 2);
  }
};
$("#bEnBtn").onclick = () => getBrochure("en");
$("#bHiBtn").onclick = () => getBrochure("hi");
$("#inviteBtn").onclick = () => waShare(
  (lang === "hi"
    ? "पिंक वेव 2026 — स्तन कैंसर जागरूकता वॉकाथॉन 🩷 रविवार, 4 अक्टूबर 2026, सुबह 6:30, 1090 चौराहा, लखनऊ। साथ चलिए: "
    : "Pink Wave 2026 — Breast Cancer Awareness Walkathon 🩷 Sunday 4 October 2026, 6:30 AM, 1090 Chauraha, Lucknow. Walk with us: ") + SITE_URL);

RUN.init();
deck = shuffle(C.myths);
setLang(lang);
go("splash");
