/* =========================================================================
   PINK WAVE 2026 · app
   Phases 0–2: content spine, single journey, Myth-or-Fact, Spot the Sign,
   7-step trainer, pattern picker, certificate, gated brochure download.
   ========================================================================= */

/* ---- EDIT BEFORE DEPLOY ------------------------------------------------ */
const SITE_URL     = "https://mithleshw.github.io/sgpgibreasthealth/";
const REGISTER_URL = "https://forms.gle/REPLACE_ME";   /* ← your registration form */
const ANALYTICS    = "";     /* Supabase endpoint; empty = collect nothing at all */
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
function track(event, data = {}) {
  if (!ANALYTICS) return;                       /* nothing configured → no-op */
  const body = JSON.stringify({
    session_id: sessionId, ts: new Date().toISOString(),
    lang, event, ...data
  });
  try {
    navigator.sendBeacon
      ? navigator.sendBeacon(ANALYTICS, new Blob([body], {type:"application/json"}))
      : fetch(ANALYTICS, {method:"POST", body, headers:{"Content-Type":"application/json"}, keepalive:true});
  } catch (e) { /* analytics must never break the app */ }
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
  renderQ(); renderSign(); renderStep(); renderPatterns();
  renderEvent(); renderVideos(); renderResult();
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

function drawCert(name) {
  const cv = $("#pcanvas"), g = cv.getContext("2d"), W = cv.width, H = cv.height, cx = W / 2;
  const L = k => C.cert[k][lang];

  /* ---- background: poster gradient ---- */
  const bg = g.createLinearGradient(0, 0, W * .3, H);
  bg.addColorStop(0, "#ffc0e0"); bg.addColorStop(.28, "#f5479f");
  bg.addColorStop(.7, "#d5147e"); bg.addColorStop(1, "#7a0846");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  /* ---- flowing ribbon waves ---- */
  const wave = (y, amp, alpha, thick) => {
    g.globalAlpha = alpha; g.fillStyle = "#fff";
    g.beginPath(); g.moveTo(-40, y);
    g.bezierCurveTo(W * .25, y - amp, W * .55, y + amp, W + 40, y - amp * .5);
    g.lineTo(W + 40, y - amp * .5 + thick);
    g.bezierCurveTo(W * .55, y + amp + thick, W * .25, y - amp + thick, -40, y + thick);
    g.closePath(); g.fill(); g.globalAlpha = 1;
  };
  wave(190, 120, .16, 70); wave(250, 90, .10, 46);
  wave(1120, 110, .14, 64); wave(1215, 80, .09, 40);

  /* ---- drifting petals ---- */
  g.fillStyle = "#fff";
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * W, y = Math.random() * H,
          s = 7 + Math.random() * 15, a = Math.random() * Math.PI;
    g.save(); g.translate(x, y); g.rotate(a); g.globalAlpha = .10 + Math.random() * .20;
    g.beginPath(); g.ellipse(0, 0, s, s * .5, 0, 0, 7); g.fill(); g.restore();
  }
  g.globalAlpha = 1;

  /* ---- header ---- */
  g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.fillStyle = "rgba(255,255,255,.9)"; g.font = "700 23px system-ui, sans-serif";
  sp(g, L("eyebrow"), cx, 92, 2.4);

  g.fillStyle = "#fff"; g.font = "900 92px system-ui, sans-serif";
  g.fillText("PINK WAVE 2026", cx, 186);
  g.fillStyle = "rgba(255,255,255,.92)"; g.font = "800 26px system-ui, sans-serif";
  sp(g, "#JOINTHEWAVE", cx, 228, 5);

  /* ---- white card ---- */
  const CX = 84, CY = 286, CW = W - 168, CH = 800;
  g.save(); g.shadowColor = "rgba(70,0,40,.35)"; g.shadowBlur = 44; g.shadowOffsetY = 14;
  g.fillStyle = "#fffafc"; rr(g, CX, CY, CW, CH, 34); g.fill(); g.restore();
  g.strokeStyle = "#f7c9e2"; g.lineWidth = 3; rr(g, CX + 14, CY + 14, CW - 28, CH - 28, 24); g.stroke();

  /* ribbon emblem at the top of the card */
  g.save(); g.translate(cx, CY + 74); g.scale(.92, .92);
  g.strokeStyle = "#e91e8c"; g.lineWidth = 13; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(-24, 56); g.lineTo(6, -6);
  g.bezierCurveTo(-30, -34, -30, -76, 2, -84);
  g.bezierCurveTo(34, -76, 34, -34, -2, -6);
  g.lineTo(28, 56);
  g.stroke(); g.restore();

  g.fillStyle = "#b3126b"; g.font = "800 25px system-ui, sans-serif";
  sp(g, L("label"), cx, CY + 176, 3);
  g.strokeStyle = "#f2b9d8"; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx - 150, CY + 200); g.lineTo(cx + 150, CY + 200); g.stroke();

  g.fillStyle = "#7c6c76"; g.font = "400 30px system-ui, sans-serif";
  g.fillText(L("certify"), cx, CY + 252);

  /* name */
  const nm = (name || (lang === "hi" ? "एक जागरूक मित्र" : "A Breast-Aware Friend")).slice(0, 24);
  g.fillStyle = "#2a1b25";
  let fs = 74; g.font = `900 ${fs}px system-ui, sans-serif`;
  while (g.measureText(nm).width > CW - 140 && fs > 38) { fs -= 3; g.font = `900 ${fs}px system-ui, sans-serif`; }
  g.fillText(nm, cx, CY + 330);
  g.strokeStyle = "#e91e8c"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(cx - 110, CY + 352); g.lineTo(cx + 110, CY + 352); g.stroke();

  g.fillStyle = "#5d4c56"; g.font = "400 29px system-ui, sans-serif";
  g.fillText(L("did"), cx, CY + 404);

  /* score pill */
  const pw = 250, ph = 70, px = cx - pw / 2, py = CY + 432;
  const pg = g.createLinearGradient(px, py, px + pw, py + ph);
  pg.addColorStop(0, "#f5479f"); pg.addColorStop(1, "#b3126b");
  g.fillStyle = pg; rr(g, px, py, pw, ph, 35); g.fill();
  g.fillStyle = "rgba(255,255,255,.85)"; g.font = "800 19px system-ui, sans-serif";
  sp(g, L("score"), cx, py + 27, 2.6);
  g.fillStyle = "#fff"; g.font = "900 34px system-ui, sans-serif";
  g.fillText(`${total()} / ${MAX}`, cx, py + 58);

  /* pledge */
  g.fillStyle = "#5d4c56"; g.font = "400 28px system-ui, sans-serif";
  g.fillText(L("took"), cx, CY + 556);
  g.font = "700 29px system-ui, sans-serif";
  C.pledgeLines[lang].forEach((l, i) => {
    const y = CY + 604 + i * 50;
    g.fillStyle = "#e91e8c"; g.beginPath(); g.arc(cx - 252, y - 9, 6.5, 0, 7); g.fill();
    g.fillStyle = "#2a1b25"; g.textAlign = "left"; g.fillText(l, cx - 234, y); g.textAlign = "center";
  });

  /* script accent, separated by a hairline */
  g.strokeStyle = "#f2b9d8"; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx - 120, CY + 728); g.lineTo(cx + 120, CY + 728); g.stroke();
  g.fillStyle = "#b3126b";
  /* Georgia has no Devanagari — italic serif only for Latin */
  g.font = lang === "hi" ? "800 36px system-ui, sans-serif"
                         : "italic 700 38px Georgia, 'Times New Roman', serif";
  g.fillText(L("script"), cx, CY + 776);

  /* ---- footer ---- */
  g.fillStyle = "#fff"; g.font = "700 27px system-ui, sans-serif";
  g.fillText(L("where"), cx, 1174);
  g.fillStyle = "rgba(255,255,255,.88)"; g.font = "800 20px system-ui, sans-serif";
  sp(g, L("motto"), cx, 1222, 2.2);
  g.fillStyle = "rgba(255,255,255,.62)"; g.font = "500 19px system-ui, sans-serif";
  g.fillText("Made by drmithleshw using Claude AI  ·  © drmithleshw", cx, 1290);

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
  track("brochure_download", {name, city, role, language_downloaded: which});
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

/* ================================================== MENU SHEET ========= */
const MENU = [
  ["myths","m1Title"], ["signs","m2Title"], ["train","m3Title"],
  ["pledge","pledgeTitle"], ["broch","brochureTitle"], ["videos","videoChip"], ["event","eventTitle"]
];
$("#menuBtn").onclick = () => {
  $("#sheetIn").innerHTML = `<h3>${T("menu")}</h3>` +
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
$("#pmake").onclick = () => { drawCert($("#pname").value.trim()); track("pledge", {name: $("#pname").value.trim()}); };
$("#pshare").onclick = shareCert;
$("#toBroch").onclick = () => go("broch");
$("#toEvent").onclick = () => go("event");
$("#toVideos").onclick = () => go("videos");
$("#bEnBtn").onclick = () => getBrochure("en");
$("#bHiBtn").onclick = () => getBrochure("hi");
$("#inviteBtn").onclick = () => waShare(
  (lang === "hi"
    ? "पिंक वेव 2026 — स्तन कैंसर जागरूकता वॉकाथॉन 🩷 रविवार, 4 अक्टूबर 2026, सुबह 6:30, 1090 चौराहा, लखनऊ। साथ चलिए: "
    : "Pink Wave 2026 — Breast Cancer Awareness Walkathon 🩷 Sunday 4 October 2026, 6:30 AM, 1090 Chauraha, Lucknow. Walk with us: ") + SITE_URL);

deck = shuffle(C.myths);
setLang(lang);
go("splash");
