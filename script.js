// ===========================================================================
// DATA
// ===========================================================================

const NEIGHBOURHOODS_BY_BOROUGH = {
  "Bronx": ["Allerton","Baychester","Belmont","Bronxdale","Castle Hill","City Island",
    "Claremont Village","Clason Point","Co-op City","Concourse","Concourse Village",
    "East Morrisania","Eastchester","Edenwald","Fieldston","Fordham","Highbridge",
    "Hunts Point","Kingsbridge","Longwood","Melrose","Morris Heights","Morris Park",
    "Morrisania","Mott Haven","Mount Eden","Mount Hope","North Riverdale","Norwood",
    "Olinville","Parkchester","Pelham Bay","Pelham Gardens","Port Morris","Riverdale",
    "Schuylerville","Soundview","Spuyten Duyvil","Throgs Neck","Tremont","Unionport",
    "University Heights","Van Nest","Wakefield","West Farms","Westchester Square",
    "Williamsbridge","Woodlawn"],
  "Brooklyn": ["Bath Beach","Bay Ridge","Bedford-Stuyvesant","Bensonhurst","Bergen Beach",
    "Boerum Hill","Borough Park","Brighton Beach","Brooklyn Heights","Brownsville",
    "Bushwick","Canarsie","Carroll Gardens","Clinton Hill","Cobble Hill",
    "Columbia St","Coney Island","Crown Heights","Cypress Hills","DUMBO",
    "Downtown Brooklyn","Dyker Heights","East Flatbush","East New York","Flatbush",
    "Flatlands","Fort Greene","Fort Hamilton","Gowanus","Gravesend","Greenpoint",
    "Kensington","Manhattan Beach","Midwood","Mill Basin","Navy Yard","Park Slope",
    "Prospect Heights","Prospect-Lefferts Gardens","Red Hook","Sea Gate","Sheepshead Bay",
    "South Slope","Sunset Park","Vinegar Hill","Williamsburg","Windsor Terrace"],
  "Manhattan": ["Battery Park City","Chelsea","Chinatown","Civic Center","East Harlem",
    "East Village","Financial District","Flatiron District","Gramercy",
    "Greenwich Village","Harlem","Hell's Kitchen","Inwood","Kips Bay","Little Italy",
    "Lower East Side","Marble Hill","Midtown","Morningside Heights","Murray Hill",
    "NoHo","Nolita","Roosevelt Island","SoHo","Stuyvesant Town","Theater District",
    "Tribeca","Two Bridges","Upper East Side","Upper West Side","Washington Heights",
    "West Village"],
  "Queens": ["Arverne","Astoria","Bay Terrace","Bayside","Bayswater","Belle Harbor",
    "Bellerose","Breezy Point","Briarwood","Cambria Heights","College Point","Corona",
    "Ditmars Steinway","Douglaston","East Elmhurst","Edgemere","Elmhurst",
    "Far Rockaway","Flushing","Forest Hills","Fresh Meadows","Glendale","Hollis",
    "Holliswood","Howard Beach","Jackson Heights","Jamaica","Jamaica Estates",
    "Jamaica Hills","Kew Gardens","Kew Gardens Hills","Laurelton","Little Neck",
    "Long Island City","Maspeth","Middle Village","Neponsit","Ozone Park",
    "Queens Village","Rego Park","Richmond Hill","Ridgewood","Rockaway Beach",
    "Rosedale","South Ozone Park","Springfield Gardens","St. Albans","Sunnyside",
    "Whitestone","Woodhaven","Woodside"],
  "Staten Island": ["Arden Heights","Arrochar","Bay Terrace, Staten Island","Bull's Head",
    "Castleton Corners","Clifton","Concord","Dongan Hills","Eltingville",
    "Emerson Hill","Graniteville","Grant City","Great Kills","Grymes Hill",
    "Howland Hook","Huguenot","Mariners Harbor","Midland Beach","New Brighton",
    "New Dorp","New Dorp Beach","New Springville","Oakwood","Port Richmond",
    "Prince's Bay","Randall Manor","Rosebank","Rossville","Shore Acres","Silver Lake",
    "South Beach","St. George","Stapleton","Todt Hill","Tompkinsville","Tottenville",
    "West Brighton","Westerleigh","Willowbrook"],
};

const BOROUGH_CENTERS = {
  "Manhattan": [40.7831, -73.9712],
  "Brooklyn": [40.6782, -73.9442],
  "Queens": [40.7282, -73.7949],
  "Bronx": [40.8448, -73.8648],
  "Staten Island": [40.5795, -74.1502],
};

// sklearn sorts class labels alphabetically; used only if the API returns a plain list
const CLASS_ORDER = ["Entire home/apt", "Private room", "Shared room"];

const SVG_ATTR = 'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"';

const ROOM_META = {
  "Entire home/apt": {
    color: "#f5a623", rgb: "245, 166, 35",
    blurb: "The guest gets the whole place to themselves: kitchen, bathroom, everything. These listings usually have higher nightly prices.",
    icon: `<svg ${SVG_ATTR}><path d="M6 22 24 7l18 15"/><path d="M10 20v21h28V20"/><path d="M20 41V29h8v12"/></svg>`,
  },
  "Private room": {
    color: "#35c9c1", rgb: "53, 201, 193",
    blurb: "A private bedroom inside a home where some spaces, like the kitchen or bathroom, may be shared with the host or others.",
    icon: `<svg ${SVG_ATTR}><rect x="12" y="6" width="24" height="36" rx="2.5"/><circle cx="30" cy="25" r="1.8" fill="currentColor"/><path d="M6 42h36"/></svg>`,
  },
  "Shared room": {
    color: "#a78bfa", rgb: "167, 139, 250",
    blurb: "A bed or space in a room that is shared with other people. Usually the most budget-friendly option.",
    icon: `<svg ${SVG_ATTR}><path d="M6 42V6M42 42V6"/><path d="M6 19h36M6 35h36"/><path d="M10 19v-5h12v5M26 35v-5h12v5"/></svg>`,
  },
};
const FALLBACK_META = { color: "#f5a623", rgb: "245, 166, 35", blurb: "", icon: ROOM_META["Entire home/apt"].icon };

const EXAMPLES = [
  { borough: "Manhattan", hood: "East Village", lat: 40.7265, lng: -73.9815, price: 185, nights: 3, reviews: 42, rpm: 1.8, host: 2, avail: 210 },
  { borough: "Brooklyn", hood: "Bedford-Stuyvesant", lat: 40.6872, lng: -73.9418, price: 65, nights: 2, reviews: 18, rpm: 0.9, host: 1, avail: 120 },
  { borough: "Queens", hood: "Jamaica", lat: 40.7027, lng: -73.7890, price: 35, nights: 1, reviews: 9, rpm: 0.4, host: 3, avail: 300 },
];

const LOADING_MESSAGES = [
  "Reading the location…",
  "Weighing price and availability…",
  "Checking review activity…",
  "Asking the model…",
];

const DEFAULT_API_URL = "https://nyc-room-type-predictor-1-1er9.onrender.com";
const TOTAL_STEPS = 3;

// ===========================================================================
// HELPERS
// ===========================================================================

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const money = (n) => "$" + Number(n).toLocaleString("en-US");

// ===========================================================================
// SKYLINE BACKGROUND + PARALLAX
// ===========================================================================

function buildSkyline(svgId, opts) {
  const svg = $(svgId);
  const ns = "http://www.w3.org/2000/svg";
  const width = 1700, base = 260;
  let x = 0;
  while (x < width) {
    const w = opts.minW + Math.random() * (opts.maxW - opts.minW);
    const h = opts.minH + Math.random() * (opts.maxH - opts.minH);
    const b = document.createElementNS(ns, "rect");
    b.setAttribute("x", x); b.setAttribute("y", base - h);
    b.setAttribute("width", w); b.setAttribute("height", h);
    b.setAttribute("class", "building");
    svg.appendChild(b);

    if (opts.windows) {
      const cols = Math.floor((w - 6) / 11);
      const rows = Math.floor((h - 10) / 15);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > opts.windowChance) continue;
          const win = document.createElementNS(ns, "rect");
          win.setAttribute("x", x + 5 + c * 11);
          win.setAttribute("y", base - h + 8 + r * 15);
          win.setAttribute("width", 5); win.setAttribute("height", 7);
          win.setAttribute("class", "window" + (Math.random() > 0.8 ? " cyan" : ""));
          win.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
          win.style.animationDuration = (3 + Math.random() * 5).toFixed(2) + "s";
          svg.appendChild(win);
        }
      }
    }
    x += w + opts.gap;
  }
}

buildSkyline("sky-far",  { minW: 30, maxW: 70, minH: 90, maxH: 230, gap: 4, windows: false });
buildSkyline("sky-near", { minW: 44, maxW: 90, minH: 60, maxH: 190, gap: 8, windows: true, windowChance: 0.42 });

const skyFar = $("sky-far-wrap");
const skyNear = $("sky-near-wrap");
window.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  skyFar.style.transform = `translateX(${(x * -16).toFixed(1)}px)`;
  skyNear.style.transform = `translateX(${(x * -36).toFixed(1)}px)`;
});

// ===========================================================================
// VIEWS
// ===========================================================================

const views = { form: $("view-form"), loading: $("view-loading"), result: $("view-result") };
let currentView = "form";

function setView(name) {
  currentView = name;
  Object.entries(views).forEach(([key, el]) => {
    el.hidden = key !== name;
    el.classList.remove("view-enter");
  });
  void views[name].offsetWidth; // restart the animation
  views[name].classList.add("view-enter");
  document.body.dataset.view = name;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("popstate", () => {
  if (currentView === "result") setView("form");
});

if (location.hash === "#result") history.replaceState(null, "", location.pathname);

// ===========================================================================
// FORM ELEMENTS
// ===========================================================================

const form = $("predict-form");
const boroughSelect = $("borough");
const hoodSelect = $("neighbourhood");
const latInput = $("latitude");
const lngInput = $("longitude");
const priceInput = $("price");
const nightsInput = $("minimum_nights");
const availInput = $("availability_365");
const reviewsInput = $("number_of_reviews");
const rpmInput = $("reviews_per_month");
const hostInput = $("calculated_host_listings_count");
const useCenterBtn = $("use-center-btn");

let coordsAutofilled = false;
let exampleIndex = 0;

// ---------- Borough -> neighbourhood ----------
function populateNeighbourhoods(borough, selected) {
  const list = NEIGHBOURHOODS_BY_BOROUGH[borough] || [];
  hoodSelect.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = ""; ph.disabled = true; ph.selected = true;
  ph.textContent = list.length ? `Select a neighbourhood (${list.length})` : "Choose a borough first";
  hoodSelect.appendChild(ph);
  list.forEach((n) => {
    const o = document.createElement("option");
    o.value = n; o.textContent = n;
    hoodSelect.appendChild(o);
  });
  hoodSelect.disabled = list.length === 0;
  if (selected) hoodSelect.value = selected;
}

function highlightBorough(borough) {
  document.querySelectorAll(".borough-shape").forEach((s) => {
    s.classList.toggle("active", s.dataset.borough === borough);
  });
}

function applyCentre() {
  const c = BOROUGH_CENTERS[boroughSelect.value];
  if (!c) return;
  latInput.value = c[0];
  lngInput.value = c[1];
  coordsAutofilled = true;
}

boroughSelect.addEventListener("change", () => {
  populateNeighbourhoods(boroughSelect.value);
  highlightBorough(boroughSelect.value);
  useCenterBtn.disabled = !BOROUGH_CENTERS[boroughSelect.value];
  // Save the user some typing: pre-fill coordinates unless they typed their own
  if (!latInput.value || !lngInput.value || coordsAutofilled) applyCentre();
});

document.querySelectorAll(".borough-shape").forEach((shape) => {
  shape.addEventListener("click", () => {
    boroughSelect.value = shape.dataset.borough;
    boroughSelect.dispatchEvent(new Event("change"));
  });
});

useCenterBtn.addEventListener("click", applyCentre);
[latInput, lngInput].forEach((i) => i.addEventListener("input", () => { coordsAutofilled = false; }));

// ---------- Price chips ----------
function syncPriceChips() {
  document.querySelectorAll("#price-chips button").forEach((b) => {
    b.classList.toggle("on", b.dataset.price === String(priceInput.value));
  });
}
document.querySelectorAll("#price-chips button").forEach((b) => {
  b.addEventListener("click", () => { priceInput.value = b.dataset.price; syncPriceChips(); });
});
priceInput.addEventListener("input", syncPriceChips);

// ---------- Number steppers ----------
document.querySelectorAll(".num-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const step = parseFloat(input.step) || 1;
    const min = input.min !== "" ? parseFloat(input.min) : -Infinity;
    const max = input.max !== "" ? parseFloat(input.max) : Infinity;
    const cur = parseFloat(input.value);
    let next = (isNaN(cur) ? (min === -Infinity ? 0 : min) : cur) + Number(btn.dataset.dir) * step;
    next = Math.min(max, Math.max(min, next));
    input.value = step < 1 ? next.toFixed(1) : String(Math.round(next));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
});

// ---------- Availability slider ----------
function syncAvailability() {
  const v = Number(availInput.value);
  const pct = Math.round((v / 365) * 100);
  $("availability-value").textContent = v;
  $("availability-pct").textContent = pct;
  availInput.style.setProperty("--fill", ((v / 365) * 100).toFixed(1) + "%");
}
availInput.addEventListener("input", syncAvailability);
syncAvailability();

// ===========================================================================
// WIZARD
// ===========================================================================

const stepEls = document.querySelectorAll(".step");
const navItems = document.querySelectorAll("#steps-nav li");
const backBtn = $("back-btn");
const nextBtn = $("next-btn");
const predictBtn = $("predict-btn");
let currentStep = 1;

function goToStep(n, goingBack) {
  currentStep = n;
  stepEls.forEach((el) => {
    const active = Number(el.dataset.step) === n;
    el.classList.toggle("active", active);
    el.classList.toggle("back", active && !!goingBack);
  });
  navItems.forEach((li) => {
    const i = Number(li.dataset.go);
    li.classList.toggle("active", i === n);
    li.classList.toggle("done", i < n);
    li.querySelector(".dot").textContent = i < n ? "✓" : i;
  });
  $("progress-fill").style.width = ((n - 1) / (TOTAL_STEPS - 1)) * 100 + "%";
  backBtn.hidden = n === 1;
  nextBtn.hidden = n === TOTAL_STEPS;
  predictBtn.hidden = n !== TOTAL_STEPS;
}

function validateStep(n) {
  const fields = document.querySelectorAll(`.step[data-step="${n}"] [required]`);
  for (const f of fields) {
    if (!f.checkValidity()) {
      f.reportValidity();
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener("click", () => {
  hideFormError();
  if (validateStep(currentStep)) goToStep(currentStep + 1, false);
});
backBtn.addEventListener("click", () => goToStep(currentStep - 1, true));
predictBtn.addEventListener("click", predict);

navItems.forEach((li) => {
  li.addEventListener("click", () => {
    const target = Number(li.dataset.go);
    if (target < currentStep) goToStep(target, true);
  });
});

// Enter key moves forward instead of submitting the page
form.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName === "INPUT") {
    e.preventDefault();
    currentStep < TOTAL_STEPS ? nextBtn.click() : predict();
  }
});
form.addEventListener("submit", (e) => e.preventDefault());

// ---------- Example / clear ----------
function fillExample() {
  const ex = EXAMPLES[exampleIndex % EXAMPLES.length];
  exampleIndex++;
  boroughSelect.value = ex.borough;
  populateNeighbourhoods(ex.borough, ex.hood);
  highlightBorough(ex.borough);
  useCenterBtn.disabled = false;
  latInput.value = ex.lat; lngInput.value = ex.lng; coordsAutofilled = false;
  priceInput.value = ex.price; syncPriceChips();
  nightsInput.value = ex.nights;
  reviewsInput.value = ex.reviews;
  rpmInput.value = ex.rpm;
  hostInput.value = ex.host;
  availInput.value = ex.avail; syncAvailability();
  hideFormError();
  showToast(`Loaded example: ${ex.hood}, ${ex.borough}`);
}
$("example-btn").addEventListener("click", fillExample);

function clearAll() {
  form.reset();
  populateNeighbourhoods("");
  highlightBorough("");
  useCenterBtn.disabled = true;
  coordsAutofilled = false;
  syncPriceChips();
  syncAvailability();
  hideFormError();
  goToStep(1, true);
}
$("clear-btn").addEventListener("click", clearAll);

// ===========================================================================
// ERRORS, TOAST, MODAL, API STATUS
// ===========================================================================

function showFormError(msg) { const el = $("form-error"); el.textContent = msg; el.hidden = false; }
function hideFormError() { $("form-error").hidden = true; }

let toastTimer;
function showToast(message, isError) {
  const t = $("toast");
  t.textContent = message;
  t.className = "toast" + (isError ? " error" : "");
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 3000);
}

function getApiUrl() {
  try { return localStorage.getItem("nycRoomPredictorApiUrl") || DEFAULT_API_URL; }
  catch { return DEFAULT_API_URL; }
}

const modal = $("modal-backdrop");
function openModal() { $("api-url").value = getApiUrl(); modal.hidden = false; }
function closeModal() { modal.hidden = true; }
$("settings-btn").addEventListener("click", openModal);
$("footer-settings-btn").addEventListener("click", openModal);
$("modal-cancel").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
$("modal-save").addEventListener("click", () => {
  const v = $("api-url").value.trim().replace(/\/$/, "");
  if (v) { try { localStorage.setItem("nycRoomPredictorApiUrl", v); } catch {} }
  closeModal();
  showToast("API URL saved");
  checkApi();
});

const statusPill = $("api-status");
function setStatus(state) {
  statusPill.dataset.state = state;
  statusPill.querySelector(".status-text").textContent =
    state === "online" ? "API online" : state === "offline" ? "API offline" : "Checking API…";
}
async function checkApi() {
  setStatus("checking");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3500);
  try {
    const res = await fetch(getApiUrl() + "/", { signal: ctrl.signal });
    setStatus(res.ok ? "online" : "offline");
  } catch {
    setStatus("offline");
  } finally {
    clearTimeout(timer);
  }
}
statusPill.addEventListener("click", checkApi);
checkApi();

// ===========================================================================
// PREDICT FLOW
// ===========================================================================

let busy = false;
let lastPayload = null;
let tickerTimer;

function startTicker() {
  let i = 0;
  const el = $("loading-text");
  el.textContent = LOADING_MESSAGES[0];
  tickerTimer = setInterval(() => {
    i = (i + 1) % LOADING_MESSAGES.length;
    el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
    el.textContent = LOADING_MESSAGES[i];
  }, 700);
}
function stopTicker() { clearInterval(tickerTimer); }

function collectPayload() {
  return {
    latitude: parseFloat(latInput.value),
    longitude: parseFloat(lngInput.value),
    price: parseFloat(priceInput.value),
    minimum_nights: parseInt(nightsInput.value, 10),
    number_of_reviews: parseInt(reviewsInput.value, 10),
    reviews_per_month: parseFloat(rpmInput.value),
    calculated_host_listings_count: parseInt(hostInput.value, 10),
    availability_365: parseInt(availInput.value, 10),
    neighbourhood_group: boroughSelect.value,
    neighbourhood: hoodSelect.value,
  };
}

function formatApiError(body, status) {
  if (body && Array.isArray(body.detail)) {
    return body.detail.map((d) => `${(d.loc || []).slice(-1)[0] || "field"}: ${d.msg}`).join(" · ");
  }
  if (body && typeof body.detail === "string") return body.detail;
  return `The server responded with status ${status}.`;
}

async function predict() {
  if (busy) return;
  // check every step so nothing is missing
  for (let s = 1; s <= TOTAL_STEPS; s++) {
    if (!validateStep(s)) { goToStep(s, s < currentStep); validateStep(s); return; }
  }

  busy = true;
  hideFormError();
  lastPayload = collectPayload();
  setView("loading");
  startTicker();
  const minimumWait = sleep(2300); // so the loading animation is actually seen

  try {
    const res = await fetch(`${getApiUrl()}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lastPayload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(formatApiError(body, res.status));
    }
    const data = await res.json();
    await minimumWait;
    stopTicker();
    renderResult(data, lastPayload);
    setView("result");
    history.pushState({ view: "result" }, "", "#result");
    $("verdict-label").focus({ preventScroll: true });
    fireBurst();
    animateResult();
    setStatus("online");
  } catch (err) {
    stopTicker();
    await minimumWait;
    const offline = err instanceof TypeError;
    setStatus(offline ? "offline" : "online");
    setView("form");
    goToStep(TOTAL_STEPS, false);
    showFormError(
      offline
        ? `Could not reach the API at ${getApiUrl()}. Make sure your FastAPI server is running (uvicorn main:app --reload), then try again.`
        : `The API rejected the request: ${err.message}`
    );
    showToast("Prediction failed", true);
  } finally {
    busy = false;
  }
}

// ===========================================================================
// RESULT RENDERING
// ===========================================================================

let pendingResult = null;

function normalizeProbs(p) {
  // Supports both {label: prob} and a plain list [p0, p1, p2]
  if (Array.isArray(p)) {
    const out = {};
    p.forEach((v, i) => { out[CLASS_ORDER[i] || `Class ${i}`] = v; });
    return out;
  }
  return p || {};
}

function renderResult(data, payload) {
  const probs = normalizeProbs(data.probability);
  const predicted = data.Predicted_room_type;
  const entries = Object.entries(probs).sort((a, b) => b[1] - a[1]);
  const meta = ROOM_META[predicted] || FALLBACK_META;
  const topProb = (probs[predicted] ?? (entries[0] ? entries[0][1] : 0)) * 100;

  const view = views.result;
  view.style.setProperty("--accent", meta.color);
  view.style.setProperty("--accent-rgb", meta.rgb);

  $("verdict-icon").innerHTML = meta.icon;
  $("verdict-label").textContent = predicted;
  $("verdict-blurb").textContent = meta.blurb;

  // Confidence message
  const runnerUp = entries.find(([label]) => label !== predicted);
  let level, note;
  if (topProb >= 75) {
    level = "High confidence";
    note = `<strong>${level}.</strong> The model strongly favours this answer.`;
  } else if (topProb >= 55) {
    level = "Moderate confidence";
    note = `<strong>${level}.</strong> A clear lean, but not a certainty.`;
  } else {
    level = "Low confidence";
    note = `<strong>${level}.</strong> This is a close call.`;
  }
  if (runnerUp && topProb < 75) {
    note += ` ${runnerUp[0]} came second at ${(runnerUp[1] * 100).toFixed(1)}%.`;
  }
  $("confidence-note").innerHTML = note;

  // Bars
  const bars = $("bars");
  bars.innerHTML = "";
  entries.forEach(([label, p], idx) => {
    const m = ROOM_META[label] || FALLBACK_META;
    const row = document.createElement("div");
    row.className = "bar-row" + (label === predicted ? " leader" : "");
    row.style.setProperty("--c", m.color);
    row.style.animationDelay = (0.15 + idx * 0.12) + "s";
    row.innerHTML = `
      <div class="bar-top">
        <span class="bar-name"><i class="bar-dot"></i>${label}</span>
        <span class="bar-pct">0.0%</span>
      </div>
      <div class="bar-track"><div class="bar-fill"></div></div>`;
    row.dataset.pct = (p * 100).toFixed(1);
    bars.appendChild(row);
  });

  // Summary
  const items = [
    ["Borough", payload.neighbourhood_group],
    ["Neighbourhood", payload.neighbourhood],
    ["Price per night", money(payload.price)],
    ["Minimum nights", payload.minimum_nights],
    ["Reviews", payload.number_of_reviews],
    ["Reviews / month", payload.reviews_per_month],
    ["Host listings", payload.calculated_host_listings_count],
    ["Available", `${payload.availability_365} days / year`],
  ];
  $("summary").innerHTML = items
    .map(([k, v]) => `<div class="sum-item"><span>${k}</span><b>${v}</b></div>`)
    .join("");

  // Reset ring before it animates
  const ring = $("ring-fg");
  ring.style.transition = "none";
  ring.style.strokeDashoffset = "326.73";
  $("ring-pct").textContent = "0";

  pendingResult = { topProb };
}

function animateResult() {
  if (!pendingResult) return;
  const { topProb } = pendingResult;

  const ring = $("ring-fg");
  void ring.getBoundingClientRect();
  ring.style.transition = "";
  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = (326.73 * (1 - topProb / 100)).toFixed(2);
  });
  countUp($("ring-pct"), topProb, 1400, 0);

  document.querySelectorAll("#bars .bar-row").forEach((row, idx) => {
    const pct = parseFloat(row.dataset.pct);
    setTimeout(() => {
      row.querySelector(".bar-fill").style.width = pct + "%";
      countUp(row.querySelector(".bar-pct"), pct, 1100, 1, "%");
    }, 250 + idx * 130);
  });
}

function countUp(el, target, duration, decimals, suffix = "") {
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (eased * target).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function fireBurst() {
  const burst = $("burst");
  burst.innerHTML = "";
  for (let i = 0; i < 26; i++) {
    const s = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const dist = 70 + Math.random() * 100;
    s.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(1) + "px");
    s.style.setProperty("--dy", (Math.sin(angle) * dist).toFixed(1) + "px");
    s.style.animationDelay = (Math.random() * 0.2).toFixed(2) + "s";
    s.style.background = i % 3 === 0 ? "#ffffff" : "var(--accent)";
    burst.appendChild(s);
  }
}

// ---------- Result actions ----------
function backToEdit() {
  setView("form");
  goToStep(1, true);
  if (location.hash === "#result") history.back();
}
$("edit-btn").addEventListener("click", backToEdit);
$("edit-btn-2").addEventListener("click", backToEdit);
$("another-btn").addEventListener("click", () => {
  clearAll();
  setView("form");
  if (location.hash === "#result") history.back();
});

// ---------- Init ----------
goToStep(1, false);
