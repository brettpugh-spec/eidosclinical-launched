window.__EIDOS_BUILD = 'kit-uid-4625fa2552-r4';
window.__EIDOS_FILE = '/Users/brettpugh/Desktop/eidos/index.html';

// ══════════════════════════════════════════
// HOMEPAGE ROUTING
// ══════════════════════════════════════════
function setUIRoute(view) {
  try { sessionStorage.setItem('eidos_ui_view', view); } catch (_) {}
}

function getUIRoute() {
  try { return sessionStorage.getItem('eidos_ui_view') || ''; } catch (_) { return ''; }
}

const EIDOS_LAST_PAGE_KEY = 'eidos_last_page_id';
const EIDOS_LAST_MODE_KEY = 'eidos_last_mode';
const EIDOS_CONTACT_KEY = 'eidos_contact_v1';

function setLastPageId(pageId) {
  try {
    if (pageId) sessionStorage.setItem(EIDOS_LAST_PAGE_KEY, pageId);
    else sessionStorage.removeItem(EIDOS_LAST_PAGE_KEY);
  } catch (_) {}
}

function getLastPageId() {
  try { return sessionStorage.getItem(EIDOS_LAST_PAGE_KEY) || ''; } catch (_) { return ''; }
}

function persistRefreshRoute() {
  try {
    const hp = document.getElementById('pageHome');
    const onHome = !!(hp && getComputedStyle(hp).display !== 'none');
    if (onHome) {
      setUIRoute('home');
      setLastPageId('pageHome');
      sessionStorage.removeItem(EIDOS_LAST_MODE_KEY);
      return;
    }
    setUIRoute('split');
    const activePage = document.querySelector('.page.active');
    setLastPageId(activePage ? activePage.id : 'page0');
    if (state && state.mode) sessionStorage.setItem(EIDOS_LAST_MODE_KEY, state.mode);
    else sessionStorage.removeItem(EIDOS_LAST_MODE_KEY);
  } catch (_) {}
}

function ensureGlobalOverlaysMounted() {
  ['aboutOverlay', 'emailOverlay'].forEach((overlayId) => {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;
    if (overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }
  });
}

function _splitDataHandlerStatements(code) {
  const out = [];
  let current = '';
  let quote = '';
  let escape = false;
  for (let i = 0; i < code.length; i += 1) {
    const ch = code[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      current += ch;
      escape = true;
      continue;
    }
    if (quote) {
      current += ch;
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '\'' || ch === '"') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === ';') {
      const trimmed = current.trim();
      if (trimmed) out.push(trimmed);
      current = '';
      continue;
    }
    current += ch;
  }
  const final = current.trim();
  if (final) out.push(final);
  return out;
}

function _splitDataHandlerArgs(argsCode) {
  const out = [];
  let current = '';
  let quote = '';
  let escape = false;
  let depth = 0;
  for (let i = 0; i < argsCode.length; i += 1) {
    const ch = argsCode[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      current += ch;
      escape = true;
      continue;
    }
    if (quote) {
      current += ch;
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '\'' || ch === '"') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '(') {
      depth += 1;
      current += ch;
      continue;
    }
    if (ch === ')') {
      depth = Math.max(0, depth - 1);
      current += ch;
      continue;
    }
    if (ch === ',' && depth === 0) {
      out.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  const final = current.trim();
  if (final) out.push(final);
  return out;
}

function _decodeDataHandlerString(token) {
  const quote = token[0];
  const inner = token.slice(1, -1);
  return inner
    .replace(/\\\\/g, '\\')
    .replace(new RegExp(`\\\\${quote}`, 'g'), quote);
}

function _parseDataHandlerArg(token, el, event) {
  const t = String(token || '').trim();
  if (!t) return undefined;
  if (t === 'this') return el;
  if (t === 'event') return event;
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (t === 'null') return null;
  if (t === 'undefined') return undefined;
  if ((t.startsWith('\'') && t.endsWith('\'')) || (t.startsWith('"') && t.endsWith('"'))) {
    return _decodeDataHandlerString(t);
  }
  if (/^-?\d+(?:\.\d+)?$/.test(t)) return Number(t);
  return t;
}

function _resolveDataHandlerFn(path) {
  const cleanPath = String(path || '').trim();
  if (!cleanPath) return { fn: null, ctx: null };
  const parts = cleanPath.split('.');
  let ctx = window;
  let idx = 0;
  if (parts[0] === 'window') idx = 1;
  for (; idx < parts.length - 1; idx += 1) {
    const key = parts[idx];
    if (!key || !/^[A-Za-z_$][\w$]*$/.test(key)) return { fn: null, ctx: null };
    if (!ctx || !(key in ctx)) return { fn: null, ctx: null };
    ctx = ctx[key];
  }
  const lastKey = parts[parts.length - 1];
  if (!lastKey || !/^[A-Za-z_$][\w$]*$/.test(lastKey)) return { fn: null, ctx: null };
  const fn = ctx && ctx[lastKey];
  if (typeof fn !== 'function') return { fn: null, ctx: null };
  return { fn, ctx };
}

function _runDataHandler(el, code, event) {
  if (!el || !code) return;
  const calls = _splitDataHandlerStatements(String(code || ''));
  for (const callCode of calls) {
    const match = callCode.match(/^([A-Za-z_$][\w$.]*)\s*(?:\((.*)\))?$/);
    if (!match) {
      console.warn('Unsupported data handler expression:', callCode);
      continue;
    }
    const callPath = match[1];
    const argsSrc = (match[2] || '').trim();
    const { fn, ctx } = _resolveDataHandlerFn(callPath);
    if (!fn) {
      console.warn('Unknown data handler:', callPath);
      continue;
    }
    const argTokens = argsSrc ? _splitDataHandlerArgs(argsSrc) : [];
    const args = argTokens.map(token => _parseDataHandlerArg(token, el, event));
    try {
      const result = fn.apply(ctx || el, args);
      if (result === false && event) {
        event.preventDefault();
        event.stopPropagation();
        break;
      }
    } catch (err) {
      console.error('Failed to execute data handler:', callCode, err);
    }
  }
}

function initDataInlineHandlers() {
  document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-click]');
    if (!el) return;
    _runDataHandler(el, el.getAttribute('data-click') || '', event);
  });
  document.addEventListener('input', (event) => {
    const el = event.target.closest('[data-input]');
    if (!el) return;
    _runDataHandler(el, el.getAttribute('data-input') || '', event);
  });
}

const HOME_EXIT_ANIM_MS = 550;
let _homeHideTimer = null;

function syncHomeBackgroundHeight() {
  const hp = document.getElementById('pageHome');
  if (!hp || getComputedStyle(hp).display === 'none') return;
  const bg = hp.querySelector('.home-bg');
  if (!bg) return;
  const targetHeight = Math.max(hp.scrollHeight, window.innerHeight);
  bg.style.height = `${targetHeight}px`;
}

function showHomePage() {
  const hp = document.getElementById('pageHome');
  if (!hp) return;
  if (_homeHideTimer) {
    clearTimeout(_homeHideTimer);
    _homeHideTimer = null;
  }
  const container = document.querySelector('.container');
  if (container) container.style.display = 'none';
  if (_activeModal) _closeModal(_activeModal);
  hp.classList.remove('hidden');
  hp.style.display = 'flex';
  hp.scrollTop = 0;
  syncHomeBackgroundHeight();
  requestAnimationFrame(syncHomeBackgroundHeight);
  setTimeout(syncHomeBackgroundHeight, 160);
  // Preserve in-progress state when returning to Home.
  // State is only cleared via explicit reset/start-over actions.
  persistRefreshRoute();
}

function hideHomePage(cb) {
  const hp = document.getElementById('pageHome');
  if (!hp) { if (cb) cb(); return; }
  if (hp.style.display === 'none' || getComputedStyle(hp).display === 'none') {
    if (cb) cb();
    return;
  }
  if (_homeHideTimer) clearTimeout(_homeHideTimer);
  hp.classList.add('hidden');
  _homeHideTimer = setTimeout(() => {
    _homeHideTimer = null;
    hp.style.display = 'none';
    hp.classList.remove('hidden');
    if (cb) cb();
  }, HOME_EXIT_ANIM_MS);
}

function goToSplitScreen() {
  hideHomePage(() => {
    document.querySelector('.container').style.display = '';
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const p0 = document.getElementById('page0');
    if (p0) p0.classList.add('active');
    const pb = document.getElementById('progressBar');
    if (pb) pb.style.display = 'none';
    const sob = document.getElementById('startOverBtn');
    if (sob) sob.style.display = 'none';
    setUIRoute('split');
    setLastPageId('page0');
  });
}

function initSplitCardHover() {
  const wrap = document.querySelector('.role-cards');
  if (!wrap) return;
  const cards = wrap.querySelectorAll('.role-card');
  if (cards.length < 2) return;
  const left = cards[0];
  const right = cards[1];
  const clearHover = () => wrap.classList.remove('is-hover-left', 'is-hover-right');
  const clearFocus = () => wrap.classList.remove('is-focus-left', 'is-focus-right');

  left.addEventListener('mouseenter', () => {
    wrap.classList.add('is-hover-left');
    wrap.classList.remove('is-hover-right');
  });
  right.addEventListener('mouseenter', () => {
    wrap.classList.add('is-hover-right');
    wrap.classList.remove('is-hover-left');
  });
  wrap.addEventListener('mouseleave', clearHover);

  left.addEventListener('focusin', () => {
    wrap.classList.add('is-focus-left');
    wrap.classList.remove('is-focus-right');
  });
  right.addEventListener('focusin', () => {
    wrap.classList.add('is-focus-right');
    wrap.classList.remove('is-focus-left');
  });
  wrap.addEventListener('focusout', () => {
    window.requestAnimationFrame(() => {
      if (!wrap.contains(document.activeElement)) clearFocus();
    });
  });
}

function launchPath(path) {
  const collectTargetByPath = {
    cases: 'cases',
    clinician: 'clinician',
    patient: 'patient_redflags'
  };
  const collectTarget = collectTargetByPath[path] || 'patient_redflags';

  hideHomePage(() => {
    document.querySelector('.container').style.display = '';
    setUIRoute('split');
    // Hard gate: homepage cards must pass through pageCollect first.
    state._collectComplete = false;
    state._collectTarget = collectTarget;
    goToCollect(collectTarget);
  });
}

// ========= DATA =========
const state = {
  mode: null, // 'clinician' or 'patient'
  userName: '',
  userEmail: '',
  _collectTarget: 'patient',
  _collectComplete: false,
  area: null,
  age: null,
  sex: null,
  slrRight: null,
  slrLeft: null,
  slrFlag: null,
  symptoms: new Set(),
  duration: null,  // 'acute' | 'subacute' | 'chronic' | 'unknown' | null
  symptomText: '',
  agg: new Set(),
  aggText: '',
  alle: new Set(),
  alleText: '',
  objective: {},
  specialTests: {}
};

const SYMPTOM_CHIPS = {
  lumbar: ['Diffuse axial low back pain','Deep ache','Sharp pain','Radiating pain (leg)','Leg pain greater than back pain','Numbness','Tingling','Burning','Paresthesias (dermatomal)','Stiffness','Muscle spasm / guarding','Weakness (lower extremity)','Night pain','Morning stiffness (<30 min)','Bilateral leg symptoms','Unilateral buttock pain','Posterior pelvic pain','Neurogenic claudication','Giving way / instability','Pain with transitional movements'],
  pelvis: ['Deep groin pain','Anterior hip / groin pain','Lateral hip pain','Posterior hip pain / buttock','Mid-buttock pain','Deep ache','Sharp pain','Clicking / snapping (hip)','Audible snap with hip motion','Groin tightness','Referred pain to thigh','Referred pain to knee','Sciatica / burning pain down leg','Lower abdominal pain','Stiffness','Weakness','Night pain','Pain at rest','Morning stiffness (<30 min)','Morning stiffness (>30 min)','Locking / catching sensation','Giving way','Swelling','Numbness / tingling (thigh)','Pain with weight-bearing','Antalgic gait','Leg length discrepancy','Ecchymosis (acute)','Pain with sitting >30 min'],
  thoracic: ['Deep ache','Sharp pain','Mid-back pain','Upper back pain','Interscapular pain','Band-like pain','Chest wall pain','Radiating pain','Stiffness','Muscle spasm','Rib pain','Sharp pain with breathing','Fatigue / postural fatigue','Numbness','Tingling','Weakness (upper extremity)','Night pain','Pain with coughing/sneezing','Postural complaints','Arm fatigue'],
  cervical: ['Unilateral arm pain','Bilateral arm pain','Neck pain','Radiating pain (arm)','Paresthesias','Numbness (dermatomal)','Tingling','Deep ache','Sharp pain','Headache (unilateral)','Headache (bilateral)','Neck stiffness','Muscle spasm','Weakness (arm/hand)','Dizziness','Visual changes','Nausea','Photophobia','Phonophobia','Night pain','Autonomic symptoms'],
  shoulder: ['Anterolateral shoulder pain','Deep shoulder pain','Superior shoulder pain','Pain at AC joint','Anteromedial chest pain','Pain at base of neck','Localised anterior chest wall pain','Visible swelling / deformity at SC joint','Sharp pain','Deep ache','Night pain / sleep disturbance','Clicking / popping / catching','Crepitus','Weakness with lifting','Weakness with overhead','Stiffness','Progressive loss of motion','Giving way / instability','Apprehension','Pain radiating down arm / biceps','Paresthesias (C8/T1 distribution)','Arm fatigue','Difficulty reaching behind back','Difficulty dressing / toileting','Painful arc (60–120°)','Difficulty swallowing','Hoarse voice'],
  elbow: ['Lateral elbow pain','Medial elbow pain','Anterior elbow pain','Proximal lateral forearm pain','Volar forearm aching','Deep ache','Sharp pain','Burning','Weakness of grip','Weakness with supination','Weakness of finger extension','Numbness','Tingling','Paresthesias (ring / little fingers)','Paresthesias (thumb / index / middle fingers)','Intrinsic muscle atrophy','Clicking / popping','Stiffness','Night pain','Audible pop (acute)','Ecchymosis (acute)','Decline in throwing performance'],
  knee: ['Deep ache','Sharp pain','Burning','Anterior knee pain','Medial knee pain','Lateral knee pain','Posterior knee pain','Clicking/popping','Crepitus','Swelling/effusion','Morning stiffness (<30 min)','Morning stiffness (>30 min)','Stiffness after sitting','Giving way/instability','Locking','Catching sensation','Numbness','Tingling','Night pain','Buckling','Tenderness at patellar tendon','Bony enlargement','Pain during / after running'],
  ankle: ['Lateral ankle pain','Medial ankle pain','Anterior ankle pain','Posterior ankle pain','Medial leg / shin pain','Calf pain','Plantar heel pain','Arch pain / medial foot pain','Forefoot / metatarsal head pain','Burning pain','Numbness','Tingling / electrical sensations','Deep ache','Sharp pain','Swelling / effusion','Stiffness','Instability / giving way','Clicking / popping','Bruising / ecchymosis','Night pain','Morning pain (first steps)','Pain improves with activity then worsens','Weakness','Antalgic gait','Progressive flatfoot deformity','Cramping (medial arch)','Pain out of proportion to injury','Pain at rest'],
};

const AGG_CHIPS = {
  lumbar: ['Prolonged sitting','Prolonged standing','Bending forward (flexion)','Bending backward (extension)','Rotation / twisting','Lifting','Repetitive movements','Prolonged walking','Sneezing / coughing (Valsalva)','Standing on one leg','Stair climbing','Transitional movements (sit-to-stand)','Weight-bearing activities','Activities requiring dynamic spinal control'],
  pelvis: ['Walking / ambulation','Running / sprinting','Ascending stairs','Descending stairs','Prolonged sitting (>30 min)','Prolonged standing','Hip flexion activities','Deep squatting','Pivoting / rotation','Kicking','Cutting / lateral movements','Transitional movements (sit-to-stand)','Turning in bed','Standing on one leg','End-range hip movements','Impact activities','Hill running','Sitting on hard surfaces','Increased training load','Coughing / sneezing'],
  thoracic: ['Prolonged sitting','Prolonged standing','End-range movements','Trunk rotation','Extension','Reaching overhead','Repetitive arm movements','Weight-bearing activities','Activities requiring upright posture','Deep breathing','Coughing / sneezing','Direct pressure on rib/chest','Sports participation','Carrying objects','Sustained arm positions'],
  cervical: ['Neck movement (any)','Looking down (flexion)','Looking up (extension)','Rotation','Lateral flexion','Sustained neck positions','Prolonged sitting','Driving','Reading','Overhead activities','Valsalva / sneezing / coughing','Weight-bearing on upper extremities','External pressure on posterior neck'],
  shoulder: ['Overhead activities (60–120° arc)','Arm elevation','Repetitive overhead motion','Reaching behind back','Cross-body / horizontal adduction','Lifting above shoulder level','Side lying on affected shoulder','Throwing / sport activities','Carrying objects','Sustained arm positions','Reaching forward','Abduction + external rotation','Dressing / toileting'],
  elbow: ['Gripping','Lifting (even light objects)','Wrist extension activities','Wrist flexion activities','Forearm pronation','Forearm supination','Forearm rotation >4 hrs/day','Throwing (late cocking / acceleration)','Elbow flexion (prolonged)','Leaning on elbow','Typing / keyboard use','Carrying','Overhead activities','Valgus stress activities','Elbow flexion during sleep'],
  knee: ['Squatting','Descending stairs','Ascending stairs','Prolonged sitting','Prolonged walking','Running','Cycling','Hill running','Kneeling','Pivoting/cutting','Jumping/landing','Weight-bearing activities','Getting up from chair','Twisting movements','Deep knee flexion','Repetitive knee flexion/extension','Increased training load'],
  ankle: ['Inversion injury','Weight-bearing activities','Prolonged standing','First steps in morning','Prolonged walking','Running','Running on hard surfaces','Push-off / toe-off','Ascending stairs','Descending stairs','Uneven terrain','Impact activities','Sudden acceleration / push-off','Tight / constrictive footwear','High-heeled shoes','Walking barefoot','Dorsiflexion activities','External rotation of foot','Eversion activities','Increased training load','Hill running','Sprinting'],
};

const ALLE_CHIPS = {
  lumbar: ['Lying down','Rest','Walking','Bending forward','Extension / back bend','Sitting','Bending forward over shopping cart','Position changes','Activity modification','Heat','Ice','Lumbar support / brace','Core stabilization','Avoiding asymmetric loading'],
  pelvis: ['Rest','Ice','Heat','Lying down','Non-weight-bearing','Complete activity cessation (stress fracture)','Activity modification','Avoiding deep hip flexion','Avoiding pivoting','Avoiding side-lying on affected hip','Avoiding asymmetric loading','Pelvic support belt','Hip abductor strengthening','Anti-inflammatory medication'],
  thoracic: ['Rest','Heat','Ice','Lying down / supine','Gentle movement','Activity modification','Supported posture','Scapular stabilization exercises','Avoiding provocative movements','Splinting (rib)','Shoulder abduction (hand on head)'],
  cervical: ['Rest','Heat','Ice','Lying down','Cervical support / collar','Traction','Manual therapy','Resting arm on head (Bakody position)','Activity modification','Gentle movement','Changing positions'],
  shoulder: ['Rest','Ice','Heat','Arm supported / sling','Avoiding overhead activities','Avoiding end-range movements','Avoiding provocative positions','Shoulder abduction (hand on head)','Activity modification','Immobilization (acute instability)'],
  elbow: ['Rest','Ice','Heat','Activity modification','Avoiding gripping','Avoiding throwing','Elbow extension','Counterforce brace','Elbow sleeve','Arm elevated','Stretching','Avoiding elbow flexion','Immobilization (acute rupture)'],
  knee: ['Rest','Ice','Heat','Elevation','Compression','Bracing/support','Activity modification','Non-weight-bearing','Avoiding pivoting','Avoiding deep flexion'],
  ankle: ['Rest','Ice','Elevation','Compression','Immobilization / boot','Bracing / ankle support','Orthotics / arch support','Cushioned footwear','Wide-toed shoes','Removing shoes','Reduced weight-bearing','Stretching calf','Activity modification','Taping','Loose footwear'],
};

// ── PATIENT-FRIENDLY CHIP LABELS ──
const SYMPTOM_CHIPS_PATIENT = {
  lumbar: ['Aching lower back','Sharp lower back pain','Pain shooting down the leg','Leg pain worse than back pain','Numbness in leg or foot','Tingling in leg or foot','Burning sensation','Back stiffness','Muscle tightness / spasm','Leg weakness','Pain at night','Stiff in the morning','Pain in both legs','Pain in one buttock','Pain deep in the pelvis','Legs feel heavy when walking','Back gives way','Pain when changing position'],
  pelvis: ['Deep groin pain','Pain at the front of the hip','Pain on the outside of the hip','Pain in the buttock','Deep buttock pain','Aching hip','Sharp hip pain','Hip clicks or snaps','Groin tightness','Pain spreading to the thigh','Pain spreading to the knee','Burning pain down the leg','Lower tummy pain','Hip stiffness','Hip weakness','Pain at night','Pain at rest','Stiff in the morning','Hip locks or catches','Hip gives way','Swelling','Numbness or tingling in the thigh','Pain when standing','Limping','Legs feel different lengths','Bruising (recent injury)','Pain after sitting a while'],
  thoracic: ['Aching mid back','Sharp mid back pain','Upper back pain','Pain between the shoulder blades','Pain that wraps around the chest','Chest wall pain','Radiating pain','Back stiffness','Muscle tightness','Rib pain','Sharp pain when breathing','Tiredness from poor posture','Arm numbness','Arm tingling','Arm weakness','Night pain','Pain when coughing or sneezing','Slouching / posture concerns','Arm fatigue'],
  cervical: ['Pain down one arm','Pain down both arms','Neck pain','Pain radiating into the arm','Numbness in the arm or hand','Tingling in the arm or hand','Aching neck','Sharp neck pain','One-sided headache','Headache at the back of the head','Neck stiffness','Neck muscle tightness','Arm or hand weakness','Dizziness','Blurred vision','Nausea','Sensitivity to light','Sensitivity to sound','Pain at night','Feeling faint or unwell'],
  shoulder: ['Pain at the front of the shoulder','Deep shoulder pain','Pain at the top of the shoulder','Pain where the collarbone meets the shoulder','Sharp shoulder pain','Aching shoulder','Night pain / can\'t sleep on it','Shoulder clicks or pops','Weak when lifting','Weak when reaching overhead','Shoulder stiffness','Shoulder getting stiffer over time','Shoulder feels unstable','Shoulder feels like it will pop out','Pain going down the arm','Numbness or tingling in the arm','Arm tires quickly','Can\'t reach behind your back','Trouble getting dressed','Painful arc when lifting arm','Pain at the front of the chest near the collarbone','Swelling or bump at the base of the neck','Difficulty swallowing or breathing with shoulder injury'],
  elbow: ['Pain on the outside of the elbow','Pain on the inside of the elbow','Pain at the front of the elbow','Pain in the upper forearm','Aching forearm','Sharp elbow pain','Burning elbow pain','Weak grip','Weak when twisting forearm','Fingers won\'t straighten','Numbness in hand','Tingling in hand','Tingling in ring and little finger','Tingling in thumb and first two fingers','Hand muscle wasting','Elbow clicks or pops','Elbow stiffness','Night pain','Felt or heard a pop (injury)','Bruising (recent injury)','Throwing performance has dropped'],
  knee: ['Aching knee','Sharp knee pain','Pain at the front of the knee','Pain on the inside of the knee','Pain on the outside of the knee','Pain at the back of the knee','Knee clicks or pops','Grinding / crunching feeling','Knee swelling','Morning stiffness (under 30 min)','Morning stiffness (over 30 min)','Stiff after sitting','Knee gives way','Knee locks up','Knee catches','Numbness around the knee','Tingling around the knee','Night pain','Knee buckles','Pain at the kneecap tendon','Bony lump on the knee'],
  ankle: ['Pain on the outside of the ankle','Pain on the inside of the ankle','Pain at the front of the ankle','Pain at the back of the ankle','Heel pain (bottom of foot)','Arch pain','Ball-of-foot pain','Burning pain','Numbness in the foot','Tingling / electric sensations','Deep aching','Sharp pain','Swelling','Stiffness','Ankle feels unstable / gives way','Clicking or popping','Bruising','Night pain','Pain with first steps in the morning','Pain eases then comes back','Weakness in the foot','Limping','Arch is collapsing / flat foot','Cramping in the arch','Pain that seems out of proportion'],
};

const AGG_CHIPS_PATIENT = {
  lumbar: ['Sitting for a long time','Standing for a long time','Bending forward','Bending backward','Twisting','Lifting','Repetitive movements','Long walks','Sneezing or coughing','Standing on one leg','Climbing stairs','Getting up from a chair','Any weight-bearing activity','Activities needing core control'],
  pelvis: ['Walking','Running','Going up stairs','Going down stairs','Sitting for a while','Standing for a long time','Bending the hip','Deep squats','Pivoting / turning','Kicking','Side-to-side movements','Getting up from a chair','Turning in bed','Standing on one leg','Moving the hip to end of range','High-impact activity','Running hills','Sitting on hard surfaces','Doing more than usual','Coughing or sneezing'],
  thoracic: ['Sitting for a long time','Standing for a long time','Moving the spine','Twisting the trunk','Arching back','Reaching overhead','Repetitive arm use','Weight-bearing activity','Sitting upright','Deep breathing','Coughing or sneezing','Pressure on the ribs or chest','Playing sport','Carrying things','Holding the arms up'],
  cervical: ['Moving the neck (any direction)','Looking down','Looking up','Turning the head','Tilting the head','Staying in one position','Sitting for a long time','Driving','Reading','Overhead activities','Sneezing or coughing','Leaning on the arms'],
  shoulder: ['Reaching overhead','Lifting the arm','Repetitive overhead movements','Reaching behind the back','Crossing the arm across the body','Lifting above shoulder height','Sleeping on the shoulder','Throwing / sport','Carrying bags','Holding the arm in one position','Reaching forward','Arm out to the side and rotated back','Getting dressed'],
  elbow: ['Gripping anything','Lifting (even light things)','Extending the wrist','Bending the wrist','Turning the forearm palm-down','Turning the forearm palm-up','Repetitive forearm rotation','Throwing','Bending the elbow for a long time','Leaning on the elbow','Typing','Carrying','Overhead activity','Elbow bent while sleeping'],
  knee: ['Squatting','Going down stairs','Going up stairs','Sitting for a long time','Long walks','Running','Kneeling','Twisting or pivoting','Jumping or landing','Any weight on the leg','Getting up from a chair','Twisting movements','Bending the knee deeply','Repeated bending and straightening'],
  ankle: ['Rolling the ankle (injury)','Standing or walking','Standing for a long time','First steps in the morning','Long walks','Running','Pushing off / walking fast','Climbing stairs','Going down stairs','Uneven ground','High-impact activity','Tight shoes','High heels','Walking barefoot','Pointing the foot down','Turning the foot out','Turning the foot in','Doing more activity than usual'],
};

const ALLE_CHIPS_PATIENT = {
  lumbar: ['Lying down','Resting','Going for a walk','Bending forward','Arching back','Sitting','Leaning on a shopping trolley','Changing position','Taking it easier','Heat pack','Ice pack','Wearing a back brace','Doing core exercises','Keeping weight even on both feet'],
  pelvis: ['Rest','Ice pack','Heat pack','Lying down','Taking weight off it','Stopping activity completely','Doing less','Avoiding deep hip bends','Avoiding twisting','Not lying on the sore side','Keeping weight even','Wearing a pelvic support belt','Hip strengthening exercises','Anti-inflammatories'],
  thoracic: ['Rest','Heat','Ice','Lying flat','Gentle movement','Doing less','Good posture support','Shoulder blade exercises','Avoiding movements that hurt','Strapping the ribs','Resting arm on head'],
  cervical: ['Rest','Heat pack','Ice pack','Lying down','Wearing a soft collar','Traction / neck stretching','Manual therapy / physio','Resting arm on head','Taking it easier','Gentle movement','Changing positions often'],
  shoulder: ['Rest','Ice pack','Heat pack','Supporting the arm / sling','Avoiding overhead activities','Avoiding painful positions','Avoiding putting arm behind back','Resting arm on head','Doing less','Keeping it still (fresh injury)'],
  elbow: ['Rest','Ice','Heat','Doing less','Not gripping things','Not throwing','Straightening the elbow','Wearing an elbow strap','Elbow sleeve','Keeping arm raised','Stretching','Avoiding keeping elbow bent','Keeping still (fresh injury)'],
  knee: ['Rest','Ice pack','Heat pack','Elevating the leg','Compression bandage','Knee brace / support','Doing less','Staying off it','Avoiding twisting','Avoiding deep bends'],
  ankle: ['Rest','Ice pack','Elevating the foot','Compression bandage','Moon boot / immobilisation','Ankle brace','Orthotics / shoe inserts','Cushioned shoes','Wider shoes','Taking shoes off','Staying off it','Calf stretches','Doing less activity','Taping the ankle','Loose footwear'],
};


const OBJECTIVE_FIELDS = {
  lumbar: {
    mmt: [
      // Myotomal testing by nerve root level
      'L2/L3 — Hip flexion (iliopsoas)',
      'L3/L4 — Knee extension (quadriceps)',
      'L4 — Dorsiflexion (tibialis anterior)',
      'L4/L5 — Hip extension (gluteus maximus)',
      'L4/L5 — Hip abduction (gluteus medius)',
      'L5 — Great toe extension (EHL)',
      'L5/S1 — Hip abduction (gluteus medius)',
      'S1 — Plantar flexion (gastroc/soleus)',
      'S1 — Ankle eversion (peroneals)',
      // Reflexes
      'DTR — Patellar (L3/L4)',
      'DTR — Achilles (S1)',
    ],
    rom: [
      {label:'Lumbar Flexion (°)',         norm:'40–60°'},
      {label:'Lumbar Extension (°)',       norm:'20–35°'},
      {label:'Lateral Flexion R (°)',      norm:'15–25°'},
      {label:'Lateral Flexion L (°)',      norm:'15–25°'},
      {label:'Rotation R (°)',             norm:'3–18°'},
      {label:'Rotation L (°)',             norm:'3–18°'},
      {label:'Finger-to-floor distance (cm)', norm:'0 cm (fingers reach floor)'},
      {label:'Hip Flexion R (°)',          norm:'110–120°'},
      {label:'Hip Flexion L (°)',          norm:'110–120°'},
      {label:'Hip Extension R (°)',        norm:'10–20°'},
      {label:'Hip Extension L (°)',        norm:'10–20°'},
    ]
  },
  pelvis: {
    mmt: [
      'Hip flexors (iliopsoas) — R',
      'Hip flexors (iliopsoas) — L',
      'Hip extensors (gluteus maximus) — R',
      'Hip extensors (gluteus maximus) — L',
      'Hip abductors (gluteus medius) — R',
      'Hip abductors (gluteus medius) — L',
      'Hip adductors — R',
      'Hip adductors — L',
      'Hip ER (piriformis / deep 6) — R',
      'Hip ER (piriformis / deep 6) — L',
      'Hip IR — R',
      'Hip IR — L',
      'Quadriceps (L3/L4)',
      'Hamstrings (L5/S1)',
    ],
    rom: [
      {label:'Hip Flexion R (°)',              norm:'110–120°'},
      {label:'Hip Flexion L (°)',              norm:'110–120°'},
      {label:'Hip Extension R (°)',            norm:'10–20°'},
      {label:'Hip Extension L (°)',            norm:'10–20°'},
      {label:'Hip Abduction R (°)',            norm:'40–50°'},
      {label:'Hip Abduction L (°)',            norm:'40–50°'},
      {label:'Hip Adduction R (°)',            norm:'20–30°'},
      {label:'Hip Adduction L (°)',            norm:'20–30°'},
      {label:'Hip ER (hip flexed 90°) R (°)',  norm:'40–60°'},
      {label:'Hip ER (hip flexed 90°) L (°)',  norm:'40–60°'},
      {label:'Hip IR (hip flexed 90°) R (°)',  norm:'30–40°'},
      {label:'Hip IR (hip flexed 90°) L (°)',  norm:'30–40°'},
      {label:'FABER distance R (cm)',          norm:'~15–20 cm; compare bilaterally'},
      {label:'FABER distance L (cm)',          norm:'~15–20 cm; compare bilaterally'},
      {label:'Leg Length — True (cm)',         norm:'Difference <1 cm'},
      {label:'Leg Length — Apparent (cm)',     norm:'Compare bilaterally'},
    ]
  },
  thoracic: {
    mmt: [
      'Back extensor strength / endurance (Biering-Sørensen)',
      'Scapular retraction (mid-trap)',
      'Scapular depression (lower trap)',
      'Serratus anterior',
      'Trunk rotation R',
      'Trunk rotation L',
      'Core activation (transversus abdominis)',
    ],
    rom: [
      {label:'Thoracic Flexion (°)',       norm:'21° (↓~5°/decade with age)'},
      {label:'Thoracic Extension (°)',     norm:'13° (↓~5°/decade with age)'},
      {label:'Rotation R (°)',             norm:'40° (↓~5°/decade with age)'},
      {label:'Rotation L (°)',             norm:'40° (↓~5°/decade with age)'},
      {label:'Lateral Flex R (°)',         norm:'26° (↓~5°/decade with age)'},
      {label:'Lateral Flex L (°)',         norm:'26° (↓~5°/decade with age)'},
      {label:'Thoracic Kyphosis (°)',      norm:'34–40° standing T1–T12'},
      {label:'Rib expansion (cm)',         norm:'≥3 cm'},
      {label:'Finger-to-floor distance (cm)', norm:'0 cm (fingers reach floor)'},
    ]
  },
  cervical: {
    mmt: [
      // Deep cervical stabilizers
      'Deep neck flexors (CCFT)',
      'Neck flexor endurance (sec)',
      'SCM',
      'Upper trapezius',
      // Myotomal testing by level
      'C4 — Shoulder elevation / shrug',
      'C5 — Shoulder abduction (deltoid)',
      'C5/C6 — Elbow flexion (biceps)',
      'C6 — Wrist extension (ECRB)',
      'C7 — Elbow extension (triceps)',
      'C7 — Wrist flexion',
      'C8 — Finger flexion (FDP)',
      'T1 — Finger abduction (interossei)',
    ],
    rom: [
      // Cervical ROM
      {label:'Cervical Flexion (°)',        norm:'45–50°'},
      {label:'Cervical Extension (°)',      norm:'60–75°'},
      {label:'Rotation R (°)',              norm:'60–80°'},
      {label:'Rotation L (°)',              norm:'60–80°'},
      {label:'Lateral Flex R (°)',          norm:'40–45°'},
      {label:'Lateral Flex L (°)',          norm:'40–45°'},
      // Shoulder ROM — relevant for differentiating cervical vs shoulder pathology
      {label:'Shoulder Flexion R (°)',      norm:'150–180°'},
      {label:'Shoulder Flexion L (°)',      norm:'150–180°'},
      {label:'Shoulder Abduction R (°)',    norm:'150–180°'},
      {label:'Shoulder Abduction L (°)',    norm:'150–180°'},
      {label:'Shoulder ER R (°)',           norm:'60–90°'},
      {label:'Shoulder ER L (°)',           norm:'60–90°'},
      {label:'Shoulder IR R (°)',           norm:'60–90°'},
      {label:'Shoulder IR L (°)',           norm:'60–90°'},
    ]
  },
  shoulder: {
    mmt: [
      // Rotator cuff
      'Supraspinatus (empty can / full can)',
      'Infraspinatus (ER at side)',
      'Teres minor (ER at 90° ABD)',
      'Subscapularis (lift-off / belly press)',
      // Deltoid
      'Anterior deltoid (flexion)',
      'Middle deltoid (abduction)',
      'Posterior deltoid (extension)',
      // Scapular stabilizers
      'Serratus anterior (wall push-up plus)',
      'Lower trapezius',
      'Middle trapezius',
      // Biceps / other
      'Biceps (elbow flexion + supination)',
      'Grip strength (dynamometer)',
    ],
    rom: [
      {label:'Flexion — Active (°)',              norm:'150–180°'},
      {label:'Flexion — Passive (°)',             norm:'150–180°'},
      {label:'Abduction — Active (°)',            norm:'150–180°'},
      {label:'Abduction — Passive (°)',           norm:'150–180°'},
      {label:'ER at side — Active (°)',           norm:'60–90°'},
      {label:'ER at side — Passive (°)',          norm:'60–90°'},
      {label:'ER at 90° ABD — Active (°)',        norm:'90°'},
      {label:'IR at side — Active (°)',           norm:'60–90°'},
      {label:'IR at 90° ABD — Active (°)',        norm:'60–70°'},
      {label:'Extension (°)',                     norm:'45–60°'},
      {label:'Horizontal Adduction (°)',          norm:'30–45°'},
      {label:'Painful arc — onset (°)',           norm:'No pain through range'},
      {label:'Painful arc — resolution (°)',      norm:'No pain through range'},
    ]
  },
  elbow: {
    mmt: [
      'Elbow flexion — biceps (C5/C6)',
      'Elbow extension — triceps (C7)',
      'Forearm supination — biceps / supinator (C6)',
      'Forearm pronation — pronator teres (C7)',
      'Wrist extension — ECRB/ECRL (C6/C7)',
      'Wrist flexion — FCR/FCU (C7)',
      'Grip strength (dynamometer — compare bilaterally)',
      'Finger extension — EDC (PIN / C7)',
      'Thumb extension — EPL (PIN / C8)',
      'Intrinsic hand muscles (interossei / lumbricals — ulnar nerve)',
    ],
    rom: [
      {label:'Elbow Flexion (°)',            norm:'140–150°'},
      {label:'Elbow Extension (°)',          norm:'0° (full extension)'},
      {label:'Carrying Angle (°)',           norm:'5–15° valgus; compare bilaterally'},
      {label:'Forearm Pronation (°)',        norm:'75–80°'},
      {label:'Forearm Supination (°)',       norm:'80–85°'},
      {label:'Wrist Flexion (°)',            norm:'60–80°'},
      {label:'Wrist Extension (°)',          norm:'55–70°'},
      {label:'Grip Strength (kg / lbs)',     norm:'Compare to contralateral; a clinically meaningful side-to-side asymmetry warrants further assessment'},
    ]
  },
  knee: {
    mmt: ['Quadriceps (L3/L4)','VMO isolation','Hamstrings (L5/S1)','Hip Abductors (L4/L5)','Hip Flexors (L1/L2)','Hip Extensors (L5/S1)','Gastroc/Soleus (S1/S2)','Hip ER','Hip IR'],
    rom: [
      {label:'Knee Flexion (°)',                  norm:'130–150°'},
      {label:'Knee Extension (°)',                norm:'0° (full)'},
      {label:'Knee Extension Deficit (°)',        norm:'0° deficit'},
      {label:'Hip Flexion (°)',                   norm:'110–120°'},
      {label:'Hip Abduction (°)',                 norm:'40–50°'},
      {label:'Ankle DF – knee straight (°)',      norm:'10–20°'},
      {label:'Ankle DF – knee bent (°)',          norm:'35–45°'},
      {label:'Patellar Mobility (mm)',            norm:'~10 mm each direction'},
      {label:'Thigh Girth – 10cm above patella (cm)', norm:'Compare bilaterally'},
      {label:'Effusion (cm diff)',                norm:'0 cm diff'},
    ]
  },
  ankle: {
    mmt: [
      'Dorsiflexion — tibialis anterior (L4)',
      'Plantar flexion — gastroc/soleus (S1)',
      'Inversion — tibialis posterior (L4)',
      'Eversion — peroneals (L5/S1)',
      'Great toe extension — EHL (L5)',
      'Great toe flexion — FHL',
      'Intrinsic foot muscles',
      'Single heel raise (endurance — reps to fatigue)',
    ],
    rom: [
      {label:'Dorsiflexion — knee straight (°)',         norm:'10–20°; reduced DF associated with plantar fasciitis & Achilles tendinopathy'},
      {label:'Dorsiflexion — knee bent (weight-bearing) (°)', norm:'35–45°; <38° = risk factor for lower limb injury'},
      {label:'Plantar Flexion (°)',                      norm:'40–50°'},
      {label:'Inversion (°)',                            norm:'30–35°'},
      {label:'Eversion (°)',                             norm:'15–20°'},
      {label:'1st MTP Extension (°)',                    norm:'60–90°; reduced = plantar fasciitis risk factor'},
      {label:'Subtalar Neutral (varus/valgus)',          norm:'Document & compare bilaterally'},
      {label:'Hindfoot alignment (varus/valgus)',        norm:'Neutral to slight valgus; hindfoot varus = peroneal risk'},
      {label:'Navicular Drop (mm)',                      norm:'<10 mm; >10 mm = excessive pronation / PTTD risk'},
      {label:'Arch Height Index (cm)',                   norm:'Document & compare bilaterally'},
      {label:'Calf Girth — 10 cm below tibial tuberosity (cm)', norm:'Compare bilaterally; asymmetry suggests atrophy'},
      {label:'Achilles tendon thickening (palpation)',  norm:'Uniform, no nodule; thickening suggests tendinopathy'},
    ]
  },
};

const SPECIAL_TESTS = {
  lumbar: [
    {name:'SLR — Ipsilateral (straight leg raise)',    purpose:'Lumbar disc herniation / nerve root irritation — commonly used to evaluate nerve root tension; positive when leg pain is reproduced at a limited angle'},
    {name:'SLR — Crossed (contralateral)',             purpose:'Disc herniation with central involvement — reproduction of contralateral leg symptoms is associated with more significant nerve root involvement; interpret alongside full clinical picture'},
    {name:'Slump Test',                                purpose:'Neurodynamic tension — disc herniation, radiculopathy; useful for detecting neural tension when SLR is equivocal; reproduces symptomatic leg pain in the lumbar dural sleeve'},
    {name:'Femoral Nerve Tension Test',                purpose:'Upper lumbar nerve root irritation — L2/L3/L4; positive with anterior thigh pain'},
    {name:'Prone Instability Test',                    purpose:'Lumbar segmental instability — pain reduced when muscles activated in prone'},
    {name:'Aberrant Movement Pattern Observation',     purpose:'Lumbar instability — painful arc, Gower\'s sign, lateral shift, instability catch'},
    {name:'Spring Test (posterior-anterior pressure)', purpose:'Segmental mobility / facet dysfunction — stiffness or pain reproduction at segment'},
    {name:'SI Provocation — Distraction',              purpose:'SI joint dysfunction — one test of the ≥3 cluster needed for diagnosis'},
    {name:'SI Provocation — Compression',              purpose:'SI joint dysfunction — pelvic compression in sidelying'},
    {name:'SI Provocation — Thigh Thrust',             purpose:'SI joint dysfunction — considered the most clinically informative single test from the SI provocation cluster; posterior force on flexed femur stresses the posterior SI ligaments'},
    {name:'SI Provocation — Gaenslen\'s Test',         purpose:'SI joint dysfunction — hip extension stress in sidelying'},
    {name:'SI Provocation — Sacral Thrust',            purpose:'SI joint dysfunction — anterior force through sacrum prone'},
    {name:'FABER Test (Patrick\'s)',                   purpose:'SI joint / hip pathology — reproduction of posterior pelvic pain'},
    {name:'Romberg Test',                              purpose:'Lumbar spinal stenosis / neurological compromise — balance/proprioception screening'},
    {name:'Vibration Sense (malleoli / great toe)',    purpose:'Lumbar spinal stenosis — decreased vibration sense in lower extremities'},
    {name:'Gait Assessment (wide-based)',              purpose:'Lumbar spinal stenosis — wide-based or cautious gait pattern is associated with central canal compromise; interpret alongside symptom behaviour and provocation findings'},
    {name:'Dermatomal Sensory Testing',                purpose:'Nerve root level mapping — L3 (anterolateral thigh), L4 (medial leg), L5 (dorsum foot), S1 (lateral foot)'},
    {name:'Waddell\'s Signs (non-organic)',            purpose:'Psychosocial / non-organic pain factors — 3+ of 5 signs suggests non-organic component'}
  ],
  thoracic: [
    {name:'Thoracic Active ROM (inclinometer)',      purpose:'Segmental mobility — more reliable than visual estimate; note: rotation 40°, lat bend 26°, flex 21°, ext 13° are norms'},
    {name:'Segmental Mobility Testing (spring test)', purpose:'Thoracic segmental hypomobility / hypermobility — each vertebral level'},
    {name:'Thoracic Facet Loading (Ext + Rotation)', purpose:'Thoracic facet joint dysfunction — reproduction of local/referred pain'},
    {name:'Adam Forward Bend Test',                  purpose:'Structural scoliosis / Scheuermann\'s kyphosis — rib hump with forward flexion'},
    {name:'Rib Spring / Compression Test',           purpose:'Rib sprain / costovertebral dysfunction — pain with direct rib spring or lateral compression'},
    {name:'Costovertebral Joint Palpation',          purpose:'Costochondral / costovertebral injury — point tenderness over junction'},
    {name:'Scapular Assistance Test',                purpose:'Scapular dyskinesia — symptoms change when therapist manually assists scapular rotation'},
    {name:'Scapular Retraction Test',                purpose:'Scapular dyskinesia — symptoms change with passive scapular retraction'},
    {name:'Scapular Position Assessment (at rest)',  purpose:'Protraction, winging, asymmetry — visual inspection bilateral'},
    {name:'Dynamic Scapular Observation (arm raise)', purpose:'Scapular dyskinesia — abnormal scapular rhythm or winging during overhead motion'},
    {name:'Elevated Arm Stress Test (EAST / Roos)', purpose:'Thoracic outlet syndrome — sustained arm elevation reproduces UE symptoms'},
    {name:'Adson Test',                              purpose:'Thoracic outlet syndrome — radial pulse change with neck rotation + inspiration'},
    {name:'Wright Test (Hyperabduction)',            purpose:'Thoracic outlet syndrome — radial pulse or symptoms with full shoulder abduction'},
    {name:'Slump Test',                              purpose:'Thoracic neural tension / dural involvement'},
    {name:'Kyphosis Assessment (inclinometer)',      purpose:'Hyperkyphosis — normal standing T1–T12: 34–40°; rigid vs flexible differentiation'},
    {name:'Back Extensor Endurance (Biering-Sørensen)', purpose:'Kyphotic posture / Scheuermann\'s — back extensor weakness screening'}
  ],
  cervical: [
    {name:'Spurling Test (Compression)',        purpose:'Cervical radiculopathy — foraminal compression (positive LR for radiculopathy)'},
    {name:'Cervical Distraction Test',          purpose:'Radiculopathy / discogenic — relief with distraction suggests nerve root involvement'},
    {name:'Shoulder Abduction Relief Test',     purpose:'Radiculopathy — relief with hand-on-head position suggests foraminal compression'},
    {name:'Upper Limb Tension Test 1 (ULTT1)',  purpose:'Median nerve neurodynamics — C5/C6/C7 nerve root tension'},
    {name:'Upper Limb Tension Test 2 (ULTT2b)', purpose:'Radial nerve neurodynamics — C6/C7 nerve root tension'},
    {name:'Upper Limb Tension Test 3 (ULTT3)',  purpose:'Ulnar nerve neurodynamics — C8/T1 nerve root tension'},
    {name:'Cervical Flexion-Rotation Test',     purpose:'C1–C2 hypomobility — cervicogenic headache (>10° asymmetry = positive)'},
    {name:'Upper Cervical Segmental Mobility (C1–C3)', purpose:'Cervicogenic headache — manual assessment of upper cervical joints'},
    {name:'Cranial Cervical Flexion Test (CCFT)',purpose:'Deep neck flexor endurance — whiplash / instability screening'},
    {name:'Neck Flexor Endurance Test',         purpose:'Cervical muscle endurance — whiplash / postural dysfunction'},
    {name:'Facet Loading Maneuver (Ext + Rotation)', purpose:'Cervical facet syndrome — reproduction of local/referred pain'},
    {name:'Sharp-Purser Test',                  purpose:'Atlantoaxial instability (C1–C2) — use with caution; screen before manual Rx'},
    {name:'Vertebral Artery / VBI Screening',   purpose:'Vertebrobasilar insufficiency — mandatory before cervical manipulation'},
    {name:'DTR — Biceps (C5/C6)',               purpose:'Upper motor neuron / nerve root assessment'},
    {name:'DTR — Brachioradialis (C6)',         purpose:'C6 nerve root assessment'},
    {name:'DTR — Triceps (C7)',                 purpose:'C7 nerve root / upper motor neuron assessment'},
    {name:'Dermatomal Sensory Testing',         purpose:'Map numbness/tingling to cervical dermatome level'},
    {name:'Myotomal Strength Testing',          purpose:'Key muscles by level: C5 deltoid, C6 wrist ext, C7 triceps, C8 FDP, T1 interossei'}
  ],
  shoulder: [
    // Impingement / subacromial
    {name:'Hawkins-Kennedy Test',                 purpose:'Subacromial impingement / RC tendinopathy — commonly used provocative test; reproduction of anterior shoulder pain associated with subacromial pain patterns; interpret alongside full shoulder assessment'},
    {name:'Neer Impingement Sign',                purpose:'Subacromial impingement — commonly used provocative test; pain with passive forward flexion and internal rotation is associated with subacromial pathology; interpret alongside symptom behaviour'},
    {name:'Painful Arc Sign (60–120°)',           purpose:'Subacromial impingement / RC pathology — pain between 60–120° abduction is associated with subacromial and rotator cuff pathology; interpret alongside strength, ROM, and symptom patterns'},
    {name:'Infraspinatus Strength Test',          purpose:'RC impingement cluster — when Hawkins, painful arc, and infraspinatus weakness are all present, literature supports increased pattern consistency with subacromial pathology; interpret as a cluster'},
    // Rotator cuff integrity
    {name:'External Rotation Lag Test',           purpose:'Full-thickness RC tear (supraspinatus/infraspinatus) — inability to maintain ER against gravity is a clinically meaningful finding associated with significant rotator cuff disruption; interpret with strength testing'},
    {name:'Internal Rotation Lag Test',           purpose:'Full-thickness subscapularis tear — inability to maintain IR in the lift-off position is associated with subscapularis disruption; interpret alongside IR strength and palpation findings'},
    {name:'Drop Arm Test',                        purpose:'Full-thickness supraspinatus tear — inability to lower the arm slowly from 90° abduction is associated with significant supraspinatus disruption; interpret alongside other RC findings'},
    {name:'Empty Can Test (Jobe)',                purpose:'Supraspinatus tear / weakness — resisted elevation in scapular plane with IR'},
    {name:'Full Can Test',                        purpose:'Supraspinatus — resisted elevation in scapular plane with ER (less impingement provocation than empty can)'},
    {name:'Lift-Off Test',                        purpose:'Subscapularis tear — inability to lift hand off back in IR behind back'},
    {name:'Belly Press Test',                     purpose:'Subscapularis tear — resisted IR with elbow flexed; alternative to lift-off if IR limited'},
    // Labral / SLAP
    {name:'O\'Brien Active Compression Test',     purpose:'SLAP lesion — pain or a click reproduced in forearm pronation but not supination is associated with superior labral involvement; best interpreted alongside other shoulder findings'},
    {name:'Dynamic Labral Shear Test',            purpose:'SLAP lesion — reproduction of pain or clicking with this dynamic shear manoeuvre is associated with superior labral pathology; interpret in conjunction with the O\'Brien test and full clinical assessment'},
    {name:'Crank Test',                           purpose:'Labral tear — axial load with rotation in 160° elevation; used in combination with O\'Brien test to increase overall sensitivity for labral pathology'},
    {name:'Anterior Slide Test',                  purpose:'SLAP lesion — anterosuperior shoulder pain with resisted forward lean'},
    // Instability
    {name:'Apprehension Test',                    purpose:'Anterior GH instability — patient apprehension or muscle guarding with abduction and external rotation is a clinically significant finding strongly associated with anterior instability; interpret in context of history'},
    {name:'Relocation Test',                      purpose:'Anterior instability — relief of apprehension with posterior humeral force supports anterior instability; interpret alongside apprehension test and clinical history'},
    {name:'Release Test (Surprise Test)',          purpose:'Anterior instability — most predictive; sudden release of relocation force reproduces apprehension'},
    {name:'Load and Shift Test',                  purpose:'GH laxity/instability — grading of anterior/posterior humeral head translation is associated with capsuloligamentous laxity; positive findings warrant interpretation in the context of symptom reproduction'},
    {name:'Sulcus Sign',                          purpose:'Multidirectional instability (MDI) — ≥2 cm inferior sulcus with distraction suggests MDI'},
    // Adhesive capsulitis / GH OA
    {name:'Global Passive ROM Assessment',        purpose:'Adhesive capsulitis / GH OA — global restriction of passive ROM, especially ER at side'},
    // AC joint
    {name:'AC Joint Palpation / Tenderness',      purpose:'AC joint pathology — direct tenderness over the AC joint is a commonly used and clinically meaningful finding for AC joint involvement; interpret alongside cross-body adduction and functional findings'},
    {name:'Cross-Body Adduction Test',            purpose:'AC joint pathology — horizontal adduction reproduces superior/anterior shoulder pain'},
    {name:'Paxinos Test',                         purpose:'AC joint OA — superior AC joint pressure reproducing pain is associated with AC joint involvement; a positive test combined with confirmatory imaging increases clinical confidence; interpret in clinical context'},
    // Biceps
    {name:'Speed\'s Test',                        purpose:'LHB tendinopathy — pain with resisted shoulder flexion in forearm supination is associated with long head of biceps pathology; most useful when interpreted alongside palpation and other biceps tests'},
    {name:'Yergason\'s Test',                     purpose:'LHB tendinopathy — pain or click with resisted supination and external rotation at 90° elbow flexion is associated with LHB pathology; interpret alongside bicipital groove tenderness and Speed\'s test'},
    {name:'Upper Cut Test',                       purpose:'LHB tendinopathy — pain with resisted shoulder flexion from hip level is associated with LHB pathology; combining this finding with bicipital groove tenderness increases clinical pattern consistency'},
    {name:'Bicipital Groove Tenderness',          purpose:'LHB tendinopathy — most common isolated finding; palpate with arm in 10° IR'},
    // Scapular
    {name:'Scapular Assistance Test',             purpose:'Scapular dyskinesis — symptoms improve with manual scapular upward rotation assistance'},
    {name:'Scapular Retraction Test',             purpose:'Scapular dyskinesis — strength or symptoms improve with passive scapular retraction'},
    {name:'Scapular Position / Winging Observation', purpose:'Scapular dyskinesis — yes/no classification of abnormal scapular position at rest and during arm elevation is reliable'},
    // TOS
    {name:'Elevated Arm Stress Test (EAST / Roos)', purpose:'Thoracic outlet syndrome — 3 min elevated arm opening/closing reproducing upper extremity symptoms is associated with neurogenic TOS; considered the most clinically informative provocation test for this presentation'},
    {name:'Adson Test',                           purpose:'Thoracic outlet syndrome — radial pulse change with neck rotation + inspiration; scalene compression'},
    {name:'Wright Test (Hyperabduction)',          purpose:'Thoracic outlet syndrome — radial pulse or symptoms with full shoulder ABD; pec minor compression'},
  ,
    {name:'SC Joint Palpation (direct tenderness)',       purpose:'Sternoclavicular joint pathology — direct palpation tenderness at the SC joint is the primary clinical indicator; assess for visible swelling, asymmetry, or step deformity compared to contralateral side'},
    {name:'Shoulder Horizontal Adduction Provocation',    purpose:'SC joint provocation — horizontal adduction loads the SC joint; reproduction of anteromedial pain at the medial clavicle suggests SC joint involvement; compare with AC joint provocation which causes lateral pain'}
  ],
  elbow: [
    // Lateral elbow
    {name:'Cozen Test / Thomsen Test',                purpose:'Lateral epicondylalgia — reproduction of lateral elbow pain with resisted wrist extension is strongly associated with common extensor origin pathology; among the most commonly used tests for LE'},
    {name:'Mill\'s Test',                             purpose:'Lateral epicondylalgia — passive wrist flexion + forearm pronation + elbow extension stretches common extensor origin'},
    {name:'Lateral Epicondyle Palpation',             purpose:'Lateral epicondylalgia — direct tenderness at lateral epicondyle / ECRB origin; most consistent isolated finding'},
    {name:'Grip Strength Assessment (dynamometer)',   purpose:'Lateral epicondylalgia — bilateral grip strength comparison is clinically meaningful; a significant deficit on the affected side is commonly associated with lateral epicondylalgia and useful for monitoring progress'},
    // Medial elbow
    {name:'Medial Epicondyle Palpation',              purpose:'Medial epicondylalgia — direct tenderness at medial epicondyle / common flexor-pronator origin'},
    {name:'Resisted Wrist Flexion Test',              purpose:'Medial epicondylalgia — pain with resisted wrist flexion; also screens for UCL stress'},
    {name:'Resisted Forearm Pronation Test',          purpose:'Medial epicondylalgia / pronator teres syndrome — pain with resisted forearm pronation'},
    // UCL
    {name:'Valgus Stress Test (20–30° flexion)',      purpose:'UCL sprain / insufficiency — medial joint line pain or laxity with valgus force at 20–30° elbow flexion'},
    {name:'Milking Maneuver',                         purpose:'UCL sprain — valgus stress applied by pulling thumb with elbow flexed >90° and forearm supinated'},
    {name:'Moving Valgus Stress Test',                purpose:'UCL sprain — most reliable test; valgus stress maintained while elbow cycled from full flexion to extension; pain at 70–120° = positive'},
    {name:'UCL / Sublime Tubercle Palpation',         purpose:'UCL sprain — tenderness 2 cm distal to medial epicondyle over UCL and sublime tubercle of ulna'},
    // Cubital tunnel / ulnar nerve
    {name:'Tinel\'s Sign (cubital tunnel)',           purpose:'Cubital tunnel syndrome — tapping over ulnar nerve at medial epicondyle reproduces tingling in ring/little fingers'},
    {name:'Elbow Flexion Test',                       purpose:'Cubital tunnel syndrome — sustained full elbow flexion + wrist extension for 60 sec reproduces ulnar paresthesias'},
    {name:'Shoulder IR Elbow Flexion Test',           purpose:'Cubital tunnel syndrome — reproduction of ulnar paresthesias with shoulder IR, elbow flexion, and wrist extension is strongly associated with cubital tunnel syndrome; considered the most diagnostically valuable positional test'},
    {name:'Scratch Collapse Test',                    purpose:'Cubital tunnel syndrome — low-reliability adjunct only; any transient resistance change should be interpreted with stronger confirmatory findings, not used as a standalone diagnostic result'},
    // Radial tunnel / PIN
    {name:'Radial Tunnel Palpation (3–4 cm distal to LE)', purpose:'Radial tunnel syndrome — tenderness 3–4 cm distal to lateral epicondyle over radial tunnel (anterior to radial neck)'},
    {name:'Resisted Supination Test',                 purpose:'Radial tunnel syndrome — pain with resisted supination stresses supinator / PIN at arcade of Frohse'},
    {name:'Resisted Middle Finger Extension Test',    purpose:'Radial tunnel syndrome — pain with resisted middle finger extension loads ECRB / PIN; differentiates from lateral epicondylalgia'},
    {name:'Finger Drop Assessment',                   purpose:'Posterior interosseous nerve syndrome (supinator syndrome) — inability to extend fingers / thumb with wrist in radial deviation (ECRL preserved)'},
    // Pronator teres / median nerve
    {name:'Pronator Teres Palpation',                 purpose:'Pronator teres syndrome — tenderness over proximal pronator teres, 4–6 cm distal to medial epicondyle'},
    {name:'Resisted Elbow Flexion (lacertus fibrosus)', purpose:'Pronator teres syndrome — pain with resisted elbow flexion + forearm supination compresses median nerve under lacertus fibrosus'},
    {name:'Resisted FDS Middle Finger Flexion',       purpose:'Pronator teres syndrome — pain with resisted PIP flexion of middle finger compresses median nerve at FDS arch'},
    {name:'Palmar Cutaneous Branch Sensation',        purpose:'Pronator teres vs CTS — palmar cutaneous branch is affected in pronator syndrome (spared in CTS); test sensation in proximal palm'},
    // Distal biceps
    {name:'Biceps Provocation Test',                  purpose:'Distal biceps tendinopathy — reproduction of anterior elbow pain with resisted supination at 90° is strongly associated with distal biceps pathology; interpret alongside hook test and palpation findings'},
    {name:'Resisted Hook Test',                       purpose:'Distal biceps tendinopathy / rupture — inability to hook a finger under the biceps tendon from the lateral side is associated with tendon disruption; a clearly positive finding warrants urgent assessment'},
    {name:'Palpation-Rotation Test',                  purpose:'Distal biceps partial tear — tenderness at the bicipital tuberosity during passive pronation/supination is associated with partial biceps tendon disruption; interpret alongside provocation tests and imaging'},
    {name:'Hook Test (rupture)',                      purpose:'Distal biceps complete rupture — inability to hook finger under intact tendon from lateral side; most reliable single test'},
    {name:'Biceps Crease Interval (BCI)',             purpose:'Distal biceps rupture — BCI >6 cm (distance from antecubital crease to biceps muscle belly) suggests rupture'},
    {name:'Passive Forearm Pronation Test',           purpose:'Distal biceps rupture — asymmetric pain or movement with passive forearm pronation is associated with biceps tendon disruption; this test combined with the hook test and BCI measurement increases clinical pattern consistency'},
    {name:'Biceps Squeeze Test',                      purpose:'Distal biceps rupture — squeeze biceps belly produces forearm supination if tendon intact; absent = rupture'},
    // Elbow OA / general
    {name:'End-Range Elbow Stress (flexion/extension)', purpose:'Elbow OA / loose bodies — pain at end-range flexion or extension with overpressure; crepitus on palpation'},
  ],
  knee: [
    {name:'Lachman Test', purpose:'ACL integrity — anterior tibial displacement with reduced or absent endpoint is associated with ACL disruption; among the most reliable clinical tests for ligament continuity; interpret alongside pivot shift and clinical history'},
    {name:'Anterior Drawer Test', purpose:'ACL laxity (supplementary to Lachman)'},
    {name:'Pivot Shift Test', purpose:'ACL rotational instability — anterolateral tibial subluxation during this test is strongly associated with ACL disruption when positive; best used to confirm instability after positive Lachman; interpret in context of clinical history'},
    {name:'Posterior Drawer Test', purpose:'PCL integrity – posterior tibial sag sign'},
    {name:'Valgus Stress Test (0° and 30°)', purpose:'MCL integrity – grade I/II/III laxity'},
    {name:'Varus Stress Test (0° and 30°)', purpose:'LCL integrity / posterolateral corner'},
    {name:'McMurray Test', purpose:'Meniscal pathology — reproduction of joint-line pain or a click with tibia rotation is associated with meniscal pathology; interpret alongside joint line palpation, Thessaly test, and symptom history'},
    {name:'Thessaly Test', purpose:'Meniscal tear – performed at 20° flexion'},
    {name:'Joint Line Palpation', purpose:'Meniscal tear — direct joint line tenderness is a clinically meaningful and commonly used finding associated with meniscal pathology; most reliable when combined with McMurray and Thessaly tests'},
    {name:'Patellar Grind / Clarke\'s Sign', purpose:'Patellofemoral pain syndrome / chondromalacia'},
    {name:'Patellar Compression Test', purpose:'PFPS – pain with sustained compression'},
    {name:'Patellar Apprehension Test', purpose:'Patellar instability / subluxation'},
    {name:'Ober Test', purpose:'IT band / TFL tightness'},
    {name:'Noble Compression Test', purpose:'IT band syndrome – pain at 30° flexion over lateral epicondyle'},
    {name:'Pes Anserine Palpation', purpose:'Pes anserine bursitis – 2cm distal to medial tibial plateau'},
    {name:'Patellar Tendon Palpation', purpose:'Patellar tendinopathy – inferior pole tenderness'},
    {name:'Single-Leg Squat Assessment', purpose:'Dynamic valgus / neuromuscular control screen'},
    {name:'Dial Test (30° and 90°)', purpose:'Posterolateral corner / external rotation asymmetry'},
    {name:'Calf muscle belly palpation',                    purpose:'Calf strain (gastrocnemius/soleus) — direct palpation tenderness in the muscle belly distinguishes muscle tear from tendon pathology; most sensitive acutely'},
    {name:'Distal hamstring palpation (medial / lateral knee)', purpose:'Distal hamstring tendinopathy — focal tenderness at the hamstring insertions on the posteromedial tibia and fibular head; compare bilaterally'},
    {name:'Hop test (single-leg)',                           purpose:'Bone stress injury / load tolerance — inability or pain with single-leg hopping is a sensitive screen for tibial stress fractures and femoral neck stress reactions; always pair with palpation findings'},
    {name:'ITB / lateral femoral epicondyle palpation',     purpose:'IT band syndrome — focal tenderness at the lateral femoral epicondyle at ~30° flexion (Noble compression point) is the hallmark palpation finding'},
    {name:'Medial tibial border palpation',                  purpose:'Medial tibial stress syndrome (shin splints) — diffuse tenderness over ≥5cm of the posteromedial tibial border is the primary diagnostic criterion; distinguish from focal point tenderness of stress fracture'},
    {name:'Quadriceps tendon palpation (superior pole patella)', purpose:'Quadriceps tendinopathy — tenderness at the superior pole of the patella at the quadriceps tendon insertion; compare with patellar tendon palpation at inferior pole'},
    {name:'Tibial stress fracture palpation (focal)',        purpose:'Tibial stress fracture — focal point tenderness over the tibia is highly sensitive; combine with hop test and fulcrum test; requires imaging (MRI preferred over X-ray acutely) if positive'}
  ],
  ankle: [
    // Lateral ankle ligament
    {name:'Anterior Drawer Test',                           purpose:'ATFL laxity — anterior talar displacement is a key test for lateral ligament integrity; accuracy improves when performed after the acute inflammatory phase (4–7 days post-injury); interpret alongside clinical history and Ottawa Rules'},
    {name:'Talar Tilt Test',                                purpose:'CFL laxity (dorsiflexion position) / ATFL laxity (plantarflexion position); compare bilaterally; >5° asymmetry positive'},
    {name:'Ottawa Ankle Rules Assessment',                  purpose:'Fracture screening — bone tenderness at malleoli or base 5th metatarsal + inability to weight-bear; guides imaging'},
    // Syndesmosis / high ankle
    {name:'Syndesmosis Ligament Palpation',                 purpose:'High ankle sprain — tenderness directly over the anterior tibiofibular ligament is associated with syndesmotic involvement; interpret alongside provocation tests and Ottawa Rules for Maisonneuve fracture screening'},
    {name:'Dorsiflexion-External Rotation Stress Test',     purpose:'Syndesmotic sprain — reproduction of anterior ankle pain with dorsiflexion and external rotation stress is associated with syndesmotic injury; best interpreted in conjunction with squeeze test and ligament palpation'},
    {name:'Squeeze Test (fibular compression)',             purpose:'Syndesmotic sprain — proximal fibular compression transmitting pain to the distal syndesmosis is a clinically useful finding associated with syndesmotic injury; combine with DF-ER stress test for best clinical accuracy'},
    // Achilles
    {name:'Thompson Test',                                  purpose:'Achilles tendon rupture — absence of plantarflexion with calf squeeze is a clinically significant finding strongly associated with complete tendon disruption; a positive result warrants urgent assessment and imaging'},
    {name:'Painful Arc Sign (Achilles)',                    purpose:'Achilles tendinopathy — pain that moves with the tendon during ankle movement (rather than staying fixed) is associated with mid-portion involvement and helps differentiate from insertional pathology; interpret alongside palpation findings'},
    {name:'Royal London Hospital Test',                     purpose:'Mid-portion Achilles tendinopathy — reduction of palpation tenderness when the tendon is under tension (ankle dorsiflexion) is associated with mid-portion tendinopathy; supports distinction from peritendinitis or insertional involvement'},
    {name:'Mid-portion Achilles Palpation (2–6 cm)',        purpose:'Achilles tendinopathy — point tenderness 2–6 cm proximal to insertion distinguishes mid-portion from insertional'},
    {name:'Single Heel Raise Test (endurance)',             purpose:'Achilles / calf function — count to fatigue; compare bilaterally; <25 reps = clinically significant deficit'},
    // Plantar fascia
    {name:'Windlass Test (weight-bearing)',                 purpose:'Plantar fasciitis — passive great toe extension; the weight-bearing position increases tensile load on the plantar fascia and is more clinically informative than the non-weight-bearing version'},
    {name:'Medial Calcaneal Tuberosity Palpation',          purpose:'Plantar fasciitis — tenderness at medial calcaneal tuberosity is the most common isolated clinical finding'},
    // Tibialis posterior / PTTD
    {name:'Single-Limb Heel Raise Test',                    purpose:'PTTD — pain or inability to complete single heel raise; progressive inability indicates advancing PTTD stage'},
    {name:'Too Many Toes Sign',                             purpose:'PTTD / flatfoot — >2 toes visible lateral to tibia from behind due to hindfoot valgus and forefoot abduction'},
    {name:'Resisted Inversion (plantarflexed foot)',        purpose:'PTTD — pain or weakness with resisted inversion in plantarflexion isolates tibialis posterior'},
    {name:'Medial Arch Palpation (tibialis posterior)',     purpose:'PTTD — tenderness along tibialis posterior tendon from medial malleolus to navicular insertion'},
    // Anterior tibialis
    {name:'Resisted Dorsiflexion Test',                     purpose:'Anterior tibialis tendinopathy — pain with resisted dorsiflexion reproduces anterior ankle / medial midfoot pain'},
    {name:'Tibialis Anterior Passive Stretch',              purpose:'Anterior tibialis tendinopathy — pain with passive plantarflexion + inversion stretches tendon over dorsum'},
    // Peroneal
    {name:'Peroneal Compression Test',                      purpose:'Peroneal tendinopathy — pain along fibular groove with resisted plantarflexion/eversion'},
    {name:'Resisted Eversion & Plantarflexion',             purpose:'Peroneal tendinopathy — pain or weakness with combined resisted eversion and plantarflexion'},
    {name:'Peroneal Tendon Subluxation Test',               purpose:'Peroneal subluxation — tendon snaps over posterior fibula with active dorsiflexion/eversion + palpation'},
    // Tarsal tunnel
    {name:'Tinel\'s Sign (posterior tibial nerve)',         purpose:'Tarsal tunnel syndrome — tapping posterior to medial malleolus reproduces burning/tingling; sensory loss sparing heel is distinctive'},
    {name:'Dorsiflexion-Eversion Test',                     purpose:'Tarsal tunnel syndrome — maximal DF + eversion sustains for 5–10 sec reproduces symptoms'},
    {name:'Plantar Flexion-Inversion Test',                 purpose:'Tarsal tunnel syndrome — maximal PF + inversion sustains for 5–10 sec reproduces symptoms'},
    // Morton's neuroma
    {name:'Thumb-Index Finger Squeeze (webspace)',          purpose:'Morton\'s neuroma — tenderness with webspace compression between MT heads; 3rd–4th interspace most common'},
    {name:'Mulder\'s Sign',                                 purpose:'Morton\'s neuroma — a palpable click with simultaneous metatarsal head compression is associated with interdigital neuroma; when clinically present, this finding has been consistent with histological diagnosis in published series; combine with thumb-index finger squeeze test'},
    // Metatarsalgia / forefoot
    {name:'Metatarsal Head Palpation',                      purpose:'Metatarsalgia — tenderness over MT heads with plantar pressure; assess for callus pattern'},
    {name:'Ankle OA End-Range Stress Test',                 purpose:'Ankle OA — pain reproduced at end-range dorsiflexion and plantarflexion with overpressure'},
    // Functional
    {name:'Single Leg Balance (eyes open / closed)',        purpose:'Proprioception / chronic ankle instability — compare bilaterally; eyes closed <10 sec = significant deficit'},
    {name:'Y-Balance Test (anterior reach)',                purpose:'Dynamic balance / injury risk — anterior reach asymmetry >4 cm = elevated re-injury risk'},
    {name:'Navicular Drop Test',                            purpose:'Tibialis posterior dysfunction / pronation — >10 mm navicular drop = abnormal; risk factor for PTTD and plantar fasciitis'},
    {name:'Coleman Block Test',                             purpose:'Rigid vs flexible cavovarus — differentiates hindfoot-driven from forefoot-driven deformity'},
  ],
  pelvis: [
    // Hip intra-articular
    {name:'FADIR Test',                                  purpose:'FAI / labral tear — a commonly used screening test for intra-articular hip pathology; reproduction of groin or anterior hip pain is associated with FAI or labral involvement; a negative result lowers but does not eliminate clinical suspicion'},
    {name:'FABER Test (Patrick\'s)',                     purpose:'Hip OA / labral tear / SI joint — groin pain = hip intra-articular; buttock pain = SI joint'},
    {name:'Arlington / Anterior Impingement Test (AIT)', purpose:'Hip labral tear — reproduction of groin pain with this anterior impingement manoeuvre is associated with labral pathology; when combined with a positive FABER test, pattern consistency with labral involvement is increased'},
    {name:'Log Roll Test',                               purpose:'Intra-articular hip pathology — passive IR/ER in supine; groin pain suggests capsular/labral involvement'},
    {name:'Hip Scour Test',                              purpose:'Intra-articular hip pathology — circumduction under axial load reproduces groin pain'},
    {name:'Squat Test',                                  purpose:'Hip OA — reproduction of posterior or groin pain during squat is associated with hip joint pathology; most useful when interpreted as part of a clinical cluster alongside ROM restriction, stiffness, and age/sex profile'},
    {name:'Passive Hip Adduction (range & pain)',        purpose:'Hip OA — reduced passive adduction is among the earliest and most restricted motions in hip OA; loss of this range alongside IR restriction is a commonly used clinical indicator of joint involvement'},
    {name:'Restricted IR at 90° hip flexion',             purpose:'FAI — restricted IR at 90° hip flexion is the strongest single clinical finding to rule in FAI; compare bilaterally and note end-feel'},
    // Hip flexor / iliopsoas
    {name:'Resisted Hip Flexion (seated)',               purpose:'Hip flexor strain / iliopsoas tendinopathy — pain with resisted hip flexion in seated position'},
    {name:'HEC Test (Hip Extension / External Rotation Compression)', purpose:'Iliopsoas tendinopathy — compression of the iliopsoas against the anterior hip capsule in this position is associated with iliopsoas pathology; considered among the more diagnostically informative tests when positive; interpret with palpation findings'},
    {name:'Passive Hip Extension (stretch)',             purpose:'Hip flexor strain — pain with passive hip extension stretches anterior hip structures'},
    {name:'Thomas Test',                                 purpose:'Hip flexor tightness — contralateral hip rises from table with ipsilateral hip flexion'},
    // Hamstring / proximal
    {name:'Active Hamstring Test at 30°',                purpose:'Proximal hamstring tendinopathy — restricted or painful active knee extension at both 30° and 90° hip flexion is associated with proximal hamstring tendinopathy; the combined test has strong support in the literature; interpret alongside palpation and load-response'},
    {name:'Active Hamstring Test at 90°',                purpose:'Proximal hamstring tendinopathy — combined with 30° test; pain at ischial tuberosity'},
    {name:'Puranen-Orava Test',                          purpose:'Proximal hamstring tendinopathy — standing stretch: hand to ipsilateral foot with knee extended'},
    {name:'Ischial Tuberosity Palpation',                purpose:'Proximal hamstring tendinopathy / hamstring strain — point tenderness at ischial tuberosity'},
    {name:'Resisted Knee Flexion (prone)',               purpose:'Hamstring strain — pain or weakness with resisted knee flexion; assess for strength deficit'},
    // Adductor / athletic pubalgia
    {name:'Adductor Squeeze Test (0° and 45°)',          purpose:'Adductor strain — pain with resisted adduction at both 0° and 45° hip flexion; the 45° position is particularly associated with adductor origin pathology'},
    {name:'Cross-Body Sit-Up Test',                      purpose:'Athletic pubalgia / sports hernia — reproduction of groin pain with resisted diagonal sit-up is strongly associated with posterior inguinal wall involvement; interpret alongside adductor findings and clinical history'},
    {name:'Pubic Tubercle / Rectus Insertion Palpation', purpose:'Athletic pubalgia — tenderness over pubic tubercle or rectus abdominis insertion'},
    {name:'Adductor Contracture Test',                   purpose:'Athletic pubalgia — restricted passive hip abduction associated with adductor tightness is a commonly reported finding in athletic pubalgia; interpret alongside cross-body sit-up and adductor squeeze tests'},
    // Gluteal / lateral hip
    {name:'Single Leg Stance Test (30 sec)',             purpose:'Gluteal tendinopathy — reproduction of lateral hip pain within 30 seconds of single-leg stance is associated with gluteal tendinopathy; this is a widely used and clinically informative test for lateral hip tendon pathology; interpret alongside palpation and compressive load response'},
    {name:'Resisted External Derotation Test',           purpose:'Gluteal tendinopathy / GTPS — resisted ER in hip flexion reproduces lateral hip pain'},
    {name:'Greater Trochanter Palpation',                purpose:'GTPS / gluteal tendinopathy — direct tenderness over the greater trochanteric footprint is a clinically meaningful and commonly used finding associated with gluteal tendinopathy; interpret alongside single-leg stance and functional loading tests'},
    {name:'Trendelenburg Test',                          purpose:'Gluteus medius weakness / GTPS — positive if pelvis drops on contralateral side in single leg stance'},
    // Piriformis / deep gluteal
    {name:'Seated Piriformis Stretch Test',              purpose:'Piriformis / deep gluteal syndrome — seated hip IR reproduces buttock/sciatic pain'},
    {name:'Pace Sign',                                   purpose:'Piriformis syndrome — pain with resisted hip abduction + ER in seated position'},
    {name:'Sciatic Notch Palpation',                     purpose:'Deep gluteal syndrome — tenderness over greater sciatic notch / piriformis belly'},
    // Snapping hip
    {name:'Dynamic Hip Snap Observation',                purpose:'Snapping hip syndrome — audible/palpable snap with active hip flexion/extension; lateral = IT band; anterior = iliopsoas'},
    // SI joint
    {name:'SI Provocation — Thigh Thrust',               purpose:'SI joint dysfunction — posterior-directed force through the femur reproducing posterior pelvic pain is associated with SI joint involvement; considered among the more clinically informative single SI provocation tests'},
    {name:'SI Provocation — Distraction',                purpose:'SI joint dysfunction — part of ≥3 positive cluster required for diagnosis'},
    {name:'SI Provocation — Compression',                purpose:'SI joint dysfunction — pelvic compression in sidelying'},
    {name:'SI Provocation — Gaenslen\'s Test',           purpose:'SI joint dysfunction — hip extension stress in sidelying'},
    {name:'SI Provocation — Sacral Thrust',              purpose:'SI joint dysfunction — anterior force through sacrum prone'},
    // Pelvic girdle pain
    {name:'Active Straight Leg Raise (ASLR)',            purpose:'Pelvic girdle pain / PGP — inability to raise leg without pelvic instability; improves with pelvic compression'},
    {name:'Posterior Pelvic Pain Provocation (P4)',      purpose:'Pelvic girdle pain — posterior pelvic pain with hip flexion + axial load in sidelying'},
    {name:'Long Dorsal Ligament Palpation',              purpose:'Pelvic girdle pain — tenderness over the posterior SIJ and long dorsal sacroiliac ligament is associated with pelvic girdle pain and posterior pelvic involvement; interpret alongside SI provocation cluster tests'},
    // Stress fracture
    {name:'Hop Test',                                    purpose:'Femoral neck stress fracture — single-leg hop reproduces pain; urgent refer if positive'},
    {name:'Fulcrum Test',                                purpose:'Femoral neck stress fracture — thigh fulcrum with fist reproduces anterior groin/thigh pain'},
    {name:'Heel Percussion Test',                        purpose:'Femoral neck / pubic ramus stress fracture — heel strike vibration transmits to fracture site'},
    // Other
    {name:'Ober Test',                                   purpose:'IT band / TFL tightness — hip fails to adduct to neutral in sidelying'},
    {name:'Ely\'s Test',                                 purpose:'Rectus femoris tightness — prone knee flexion causes ipsilateral hip to flex'},
    {name:'Step-Down Test',                              purpose:'Hip abductor control — contralateral pelvic drop and ipsilateral knee cave during step descent'},
  ],
  
};

// ======== PATIENT-FRIENDLY EDUCATION ========
// Plain-language explanations for every diagnosis — used in patient mode only.
// Clinical edu text (stats, test sensitivity etc.) is preserved in each dx's .edu field for clinicians.
const PATIENT_EDU = {
  // ── LUMBAR ──
  'Lumbar Disc Herniation': `Think of the discs in your spine like small cushions between each vertebra. When one of those cushions gets squeezed too hard — often from lifting, prolonged sitting, or a sudden movement — part of it can bulge out and press on a nearby nerve. That's what causes the shooting, burning, or tingling pain that travels down your leg. The good news is that most disc herniations settle down on their own with the right exercises and movement. Surgery is rarely needed. Staying active (even when it's uncomfortable) and avoiding prolonged rest is one of the most important things you can do.`,

  'Lumbar Spinal Stenosis': `As we age, the tunnel that your spinal nerves travel through can gradually narrow — a bit like a garden hose with a kink in it. This is called spinal stenosis. It tends to cause aching, heaviness, or cramping in the legs when you walk or stand, which eases when you sit down or lean forward (like pushing a shopping trolley). It's more common in people over 60 and isn't dangerous, but it can limit how far you can walk. Staying active with low-impact exercise like cycling or swimming is often very helpful.`,

  'Lumbar Radiculopathy': `Radiculopathy is the medical word for a pinched nerve in your lower back. One of the nerves that travels from your spine down to your leg is being irritated or compressed — which is why you feel pain, tingling, or numbness somewhere along its path (your buttock, thigh, calf, or foot), often on just one side. It can feel sharp, burning, or electric. The most common culprits are a bulging disc or a narrowed space where the nerve exits the spine. Physiotherapy focused on gentle movement and nerve mobility exercises works well for most people.`,

  'Sacroiliac Joint Dysfunction': `Your sacroiliac (SI) joints sit at the very base of your spine, connecting your spine to your pelvis — one on each side. These joints don't move much, but when they do move unevenly or become irritated, they can cause a deep, achy pain in the lower back, buttock, or even the back of the thigh. It's often one-sided and tends to flare with sitting for long periods, standing on one leg, or rolling over in bed. It's extremely common and responds well to targeted hip and pelvic stability exercises.`,

  'Lumbar Instability': `Lumbar instability means the muscles and joints around your lower spine aren't quite holding things steady the way they should — particularly during movement or when you change positions. You might notice your back "gives way" or feels unreliable, or that you get sharp pain with certain movements like standing up from a chair. This is different from a structural problem — the spine itself is usually fine, but the control system needs retraining. Deep core strengthening (especially exercises that target the muscles closest to the spine) is very effective.`,

  'Lumbar Osteoarthritis / Degenerative Joint Disease': `Like any joint in the body, the small joints in your lower spine can develop wear and tear over time — this is osteoarthritis. It's extremely common and doesn't mean your back is fragile or "broken." Most people with back OA on imaging have no symptoms at all. The pain is usually a stiff, deep ache that's worse in the morning or after sitting for a while, and eases once you get moving. Regular movement, staying strong, and maintaining a healthy weight are the best things you can do. This is very manageable with the right approach.`,

  'Chronic Non-Specific Low Back Pain': `Non-specific back pain just means there's no single structural "cause" that explains everything — and that's actually the most common type of back pain there is. The pain is very real, but it's often driven by a combination of muscle tension, movement habits, stress, sleep, and how your nervous system has learned to respond over time. The brain can get really good at sending pain signals even when there's no ongoing damage. The best treatment is active rehab — graded movement, building strength, and gradually doing more of the things you've been avoiding.`,

  // ── PELVIS / HIP ──
  'Hip Osteoarthritis': `Hip osteoarthritis is wear and tear of the cartilage lining your hip joint — the smooth surface that lets your hip glide freely. When that surface wears down, the joint can become stiff, achy, and painful. The pain is usually felt in the groin or front of the hip, sometimes radiating into the thigh or knee. Morning stiffness that warms up after 15–20 minutes is very typical. The good news is that exercise is one of the most effective treatments — it keeps the joint mobile, builds the muscles around it, and can significantly reduce pain. Many people avoid surgery for years with the right program.`,

  'Hip Labral Tear': `Your hip socket has a ring of cartilage around its rim called the labrum — it acts like a seal, helping keep the ball of your hip joint stable and lubricated. When this gets torn (often from repetitive movements, sport, or the shape of your hip), it can cause a deep catching or clicking sensation in the groin, pain with prolonged sitting, or discomfort when pivoting or squatting. Many labral tears are managed very successfully with physiotherapy focused on hip strength and movement control. Surgery is sometimes needed but isn't always the answer.`,

  'Femoroacetabular Impingement (FAI)': `FAI (femoroacetabular impingement) happens when there's a small abnormality in the shape of the hip ball or socket — sometimes both — that causes them to pinch together at the end of certain movements. It's especially common in active people and causes deep groin pain or a pinching sensation when you squat, sit for long periods, or rotate your hip. It doesn't mean your hip is worn out — many people manage it very well with physiotherapy that focuses on hip mobility and strengthening the muscles around the joint to reduce how much load the joint itself has to handle.`,

  'Hip Flexor Strain': `Your hip flexors are the muscles at the front of your hip that lift your knee towards your chest. A strain means some of the muscle fibres have been overstretched or partially torn — usually from a sudden sprint, kick, or lunge. You'll feel it as a sharp pain or pull at the front of the hip or groin that's worse when you try to lift your leg or when the hip flexors are stretched. Most strains heal well with relative rest, gentle stretching once the acute pain settles, and a gradual return to activity. Don't rush back — hip flexor strains have a habit of recurring if you do.`,

  'Iliopsoas Tendinopathy': `The iliopsoas is a large muscle-tendon unit that runs from your lower spine, through the pelvis, and attaches to the top of your thigh bone. When it's overloaded — often from running, cycling, or activities involving repeated hip flexion — the tendon can become irritated and painful. You'll typically feel a deep ache at the front of the hip or groin that builds gradually rather than coming from a sudden injury. It can also cause an audible "snapping" sensation when the hip moves. Load management and progressive strengthening of the hip flexors is the key to recovery.`,

  'Hamstring Strain': `Your hamstrings are three muscles running down the back of your thigh from your sit bone to your knee. A strain means you've overstretched or torn some of those muscle fibres — usually during a sprint or sudden change of direction. You'll feel it as a sharp pain in the back of the thigh, sometimes with bruising. Hamstring strains are graded 1 (mild) to 3 (complete tear). The most important thing is not to rush back — hamstrings are notorious for re-injury if you return too soon. Gradual progressive strengthening, especially eccentric exercises (loading the muscle as it lengthens), is key.`,

  'Proximal Hamstring Tendinopathy': `This is irritation of the hamstring tendon right where it attaches to your sit bone (the bony prominence you feel when you sit down). It's most common in middle-aged runners and cyclists. The hallmark is pain deep in the buttock when sitting, especially on hard surfaces, or during uphill running. Unlike a hamstring strain, it usually builds gradually rather than coming on suddenly. Avoid sitting for long periods on hard surfaces and stretching the hamstring aggressively — both can make it worse in the short term. Progressive loading through exercises like Nordic curls is the evidence-based treatment.`,

  'Hip Adductor Tendinopathy / Strain': `Your adductor muscles run along the inner thigh and pull your legs together. A strain — especially at the groin — is one of the most common sports injuries, typically happening during a sharp sideways movement, tackle, or kick. You'll feel pain along the inner thigh or groin, often reproduced when you try to squeeze your legs together. Most adductor strains recover well with progressive strengthening, but they need time — typically 4–8 weeks for moderate strains. Returning too early is the main reason they become recurring problems.`,

  'Gluteal Tendinopathy (Glute Med / Min)': `Your gluteal tendons are the tendons of the medium and small muscles on the outer side of your hip. When they become overloaded — often in middle-aged women, walkers, or people who stand a lot — they can become persistently painful. You'll feel it as an ache on the outer hip, sometimes radiating into the outer thigh, that's worse when lying on that side, crossing your legs, or walking uphill. Counterintuitively, complete rest makes it worse — these tendons need progressive loading to recover. Avoid positions that compress the tendon (like crossing your legs) and work with a physio on a graduated strengthening program.`,

  'Greater Trochanteric Pain Syndrome (GTPS)': `GTPS causes pain on the outer side of the hip, over the bony bump you can feel at the top of your thigh. It involves the tendons and sometimes the bursa (a small fluid sac) at that point. It's especially common in women between 40–60 and often flares with lying on that side, prolonged walking, or stairs. Despite feeling like "hip pain," the actual hip joint is fine — this is all about the soft tissues on the outside. The key treatment is gradually loading the outer hip muscles while avoiding positions that compress or irritate the area.`,

  'Piriformis Syndrome / Deep Gluteal Syndrome': `The piriformis is a small muscle deep in your buttock that helps rotate your hip outward. When it becomes tight or irritated, it can press on the sciatic nerve nearby, causing pain, tingling, or numbness that runs from the buttock down the back of the leg. It often feels like sciatica — but the irritation is in the buttock, not the spine. Sitting on hard surfaces for long periods or activities like hill running tend to aggravate it. Stretching the piriformis and strengthening the surrounding hip muscles is usually very effective.`,

  'Snapping Hip Syndrome': `Snapping hip is exactly what it sounds like — a snapping, clicking, or popping sensation in the hip when you move it. Most of the time it's completely painless and is just a tendon flicking over a bony prominence. When it does cause pain, it's usually a sign of irritation in the tendon involved. There are two common types: one at the front of the hip (the iliopsoas tendon snapping over the pelvis) and one on the outer hip (the IT band snapping over the thigh bone). It's rarely serious and usually responds well to activity modification and targeted exercises.`,

  'Pelvic Girdle Pain (PGP)': `Pelvic girdle pain is pain felt at the front or back of the pelvis — around the pubic bone or the joints where the pelvis meets the spine (SI joints). It's most common during and after pregnancy, but can affect anyone. Movement like walking, climbing stairs, rolling in bed, or standing on one leg often brings it on. It happens when the joints of the pelvis aren't moving quite in sync, putting uneven strain on the surrounding structures. Core and pelvic floor strengthening, along with some activity modification, makes a big difference for most people.`,

  'Athletic Pubalgia (Sports Hernia)': `Despite the name, a sports hernia isn't actually a hernia in the traditional sense — there's no bulge. It's an injury to the muscles or tendons around the lower abdominal wall and groin, usually from the repeated high-intensity twisting and kicking movements in sports like football or hockey. You'll feel a deep aching pain in the groin and lower abdomen that's worse with exertion and better with rest. Conservative rehabilitation focusing on core and hip strength is first-line; some people need a minor surgical repair if conservative management doesn't work.`,

  'Femoral Neck Stress Fracture': `A stress fracture in the hip area is a small crack in the bone, usually from repetitive loading rather than a single trauma. In the femoral neck (the top of the thigh bone just below the hip joint), this is a serious injury that needs urgent medical attention — if missed, it can progress to a complete fracture. If you're a runner with groin pain that gets worse with activity and doesn't settle with rest, especially if you've recently increased your training load, please see a doctor promptly for imaging. Don't push through this one.`,

  'SI Joint Dysfunction': `Your sacroiliac joints connect your spine to your pelvis at the base of your back, one on each side. When these joints become stiff or move unevenly, they cause a deep, achy pain in the lower back, buttock, or the back of the thigh — usually on one side. It often flares with prolonged sitting, standing on one leg, or getting in and out of the car. It's very common and very treatable. Physiotherapy focusing on hip and core strengthening, along with hands-on treatment to restore normal joint movement, works well.`,

  // ── CERVICAL ──
  'Cervical Radiculopathy': `A pinched nerve in your neck. The nerves that control feeling and strength in your arm, hand, and fingers exit your spine through small openings between each vertebra. When one of those openings gets squeezed — often by a disc bulge or arthritis — the nerve gets irritated, causing pain, tingling, numbness, or weakness that travels from your neck down into your arm or hand. The distribution tells you which nerve is involved. Most cervical radiculopathy cases improve significantly with physiotherapy over 6–12 weeks without needing surgery.`,

  'Cervicogenic Headache': `A cervicogenic headache is a headache that actually starts in the neck — not in the head itself. The nerves of the upper cervical spine (the top three vertebrae) share connections with the nerve that supplies sensation to your head, so stiffness or irritation in the neck can produce a headache that feels like it's coming from behind the eye, the temple, or across the forehead. It's usually one-sided, tends to be brought on by neck movement or sustained postures (like looking down at a phone), and often feels like a dull, steady pressure. Manual therapy and neck-specific exercise work very well.`,

  'Cervical Whiplash / Movement Coordination Impairment': `Whiplash happens when the neck is suddenly snapped back and forth — most commonly in a car accident. It can sprain the muscles, ligaments, and joints of the neck all at once. Symptoms often include neck pain and stiffness, headaches, shoulder or arm pain, dizziness, and difficulty concentrating. The good news is that most people recover fully, especially with early, gentle movement. The worst thing you can do is keep the neck completely still — a gradual return to normal activity and targeted physiotherapy is the most evidence-based approach.`,

  'Cervical Facet Joint Syndrome': `Between each vertebra in your neck are small joints called facet joints. Like any joint, they can become stiff, irritated, or arthritic, causing neck pain that's usually felt on one side and often spreads to the shoulder or upper back. It tends to be worse in the morning and with sustained postures — like looking at a screen or driving. You might find it hard to turn your head fully in one direction. Manual therapy (hands-on joint mobilisation) combined with neck strengthening exercises is the most effective treatment.`,

  'Cervical Disc Herniation': `A cervical disc herniation is when one of the cushioning discs between your neck vertebrae bulges out and presses on a nearby nerve or the spinal cord. Depending on which level is affected, you might feel pain, tingling, or numbness travelling into your shoulder, arm, or hand. Weakness in the hand or arm can also occur. It sounds alarming, but most cervical disc herniations settle down significantly with physiotherapy. Surgery is reserved for cases where the nerve compression is causing significant, progressive weakness or when conservative treatment hasn't worked after 3 months.`,

  'Cervical Mobility Deficit / Mechanical Neck Pain': `Mechanical neck pain is the most common type of neck pain — it comes from the joints, muscles, and discs of the neck rather than from a compressed nerve. It causes stiffness, achiness, and reduced range of motion, often concentrated in the neck and spreading to the shoulders and upper back. Prolonged postures (particularly looking down at screens), stress, and poor sleep tend to make it worse. The treatment is fairly straightforward: hands-on physio treatment to restore mobility, combined with strengthening and posture retraining.`,

  // ── THORACIC ──
  'Thoracic Mobility Deficits / Spondylosis': `The middle part of your spine (between your neck and lower back) can become stiff and achy, especially with age or from spending a lot of time in a bent-forward posture. This is called thoracic stiffness or spondylosis. You might notice it as a dull ache across the mid-back, difficulty rotating your upper body, or a general feeling of tightness. Because the thoracic spine is less mobile by design, it often becomes the source of pain that affects the shoulders and neck too. Mobility exercises and postural strengthening are very effective.`,

  'Age-Related Hyperkyphosis': `Over time, many people develop an increased forward curve in their upper back — the kind of rounded posture you might associate with getting older. This is called hyperkyphosis. It's partly driven by vertebral changes in the spine but also strongly influenced by weakness of the back extensor muscles. It can cause upper back pain, fatigue, and eventually make it harder to stand fully upright. The encouraging thing is that targeted back extensor strengthening can genuinely slow its progression and reduce pain — it's not something you just have to accept.`,

  'Scapular Dyskinesia': `Your shoulder blade (scapula) acts as the platform your shoulder moves from. When the muscles that control it aren't working in sync, the shoulder blade can sit or move abnormally — which then puts extra stress on the shoulder joint and rotator cuff. You might notice a "winging" of the shoulder blade, pain between the shoulder blades, or shoulder pain that gets worse with overhead activities. It's rarely a problem in isolation — usually it's a sign that the shoulder itself needs attention too. Scapular strengthening and thoracic mobility work is the main treatment.`,

  'Thoracic Muscle Strain': `Thoracic muscle strain involves overload of the muscles and soft tissues around the ribs and mid-back, often after twisting, coughing, awkward lifting, or repetitive activity. The pain is usually localized and sharp with deep breathing, coughing, or trunk rotation, then settles to an ache at rest. It can feel alarming because chest wall pain is sensitive, but this is typically a musculoskeletal issue rather than a cardiac source. Most cases improve well over 4–8 weeks with activity modification, breathing control, and gradual return to movement.`,

  'Thoracic Outlet Syndrome (Neurogenic)': `Thoracic outlet syndrome (TOS) happens when the nerves and blood vessels that travel from the neck down into the arm get compressed in the space between the collarbone and first rib. It can cause aching, tingling, or numbness in the arm and hand — often worse when you reach overhead, carry bags, or hold your arms out for a long time. It's more common in people with forward-head posture or tight neck and chest muscles. Physiotherapy to open up the thoracic outlet through stretching, postural correction, and targeted strengthening is the main treatment.`,

  'Thoracic Facet Joint Dysfunction': `The facet joints in your mid-back can become stiff or irritated, causing a localised aching pain that's usually felt on one or both sides of the spine. It tends to be worse with certain movements — particularly twisting or extending backwards — and often eases with gentle movement once you warm up. You might also notice it during deep breaths. It's a very common, benign condition that responds well to hands-on physiotherapy treatment and targeted mobility and strengthening exercises.`,

  // ── SHOULDER ──
  'Shoulder Impingement Syndrome (Subacromial)': `Shoulder impingement is one of the most common shoulder problems. The tendons of your rotator cuff (the group of muscles that stabilise your shoulder) pass through a narrow space under the bony arch at the top of your shoulder. When that space gets cramped — from poor movement mechanics, weakness, or postural changes — the tendons get pinched and become irritated and painful. You'll typically feel it as a painful arc of movement when lifting your arm, especially between 60 and 120 degrees. The good news is it responds very well to physiotherapy focused on rotator cuff and scapular strengthening.`,

  'Rotator Cuff Tear': `Your rotator cuff is a group of four muscles (and their tendons) that wrap around your shoulder joint, keeping the ball centred in the socket. A tear can happen suddenly (like catching yourself from a fall) or gradually from years of wear. Small tears are surprisingly common and often don't cause significant pain. Larger tears cause weakness — especially lifting the arm away from the body or rotating it outward. Many partial and even full-thickness tears are managed very successfully with physiotherapy. Surgery is considered when strength doesn't recover or there's been a significant acute tear in an active person.`,

  'Rotator Cuff Tendinopathy': `Rotator cuff tendinopathy means the tendons of the shoulder's stabilising muscles have been overloaded and become irritated — not torn, just unhappy. It's common in people who do a lot of overhead work or sport, and causes a dull ache in the shoulder that's worse with overhead activities and sometimes at night when lying on that side. Tendinopathy responds well to a progressive loading program — the tendons need to be gradually stressed to stimulate healing. Complete rest actually makes tendons worse over time.`,

  'Subacromial Bursitis': `A bursa is a small fluid-filled sac that acts as a cushion between tendons and bones. There's one in the space above your rotator cuff tendons, and when it becomes inflamed — from overuse, a direct knock, or shoulder impingement — it causes a sharp, often intense aching pain at the top or outer side of the shoulder. It's frequently seen alongside rotator cuff tendinopathy. Anti-inflammatory measures (ice, relative rest) help in the acute phase, but the key to lasting recovery is addressing the underlying shoulder mechanics with physiotherapy.`,

  'Labral Tear (SLAP)': `The labrum is a ring of cartilage around the edge of your shoulder socket that deepens the socket and helps anchor the biceps tendon. A SLAP tear (Superior Labrum Anterior to Posterior) is a tear at the top of this ring, often from repetitive overhead movements or a sudden force through an outstretched arm. It can cause a deep, hard-to-pinpoint shoulder ache, clicking, and a sense of instability — particularly during throwing or overhead activities. Many SLAP tears are managed conservatively with physiotherapy; surgery is considered for active overhead athletes who don't respond.`,

  'Glenohumeral Instability / Dislocation': `Shoulder instability means the ball of the shoulder joint is too loose in its socket — it may partially or fully dislocate. This can happen after a traumatic dislocation (most commonly the shoulder dislocating forward) or gradually in hypermobile people. Symptoms include a feeling of the shoulder "slipping" or "going out," apprehension with certain movements (especially reaching overhead or behind), and pain. After a first-time dislocation, there's a high risk of recurrence without proper rehabilitation. Rotator cuff and scapular strengthening is essential — the muscles need to take over the stabilising role.`,

  'Adhesive Capsulitis (Frozen Shoulder)': `Frozen shoulder is exactly what it sounds like — the capsule (the lining) of the shoulder joint gradually tightens and thickens, causing progressive stiffness and pain. It typically goes through three phases: a painful "freezing" phase, a stiff "frozen" phase, and a gradual "thawing" phase. The whole process can last 1–3 years. The cause isn't fully understood, but it's more common in women aged 40–60, people with diabetes, and those who've had prolonged immobility. Physiotherapy during the freezing phase focuses on pain management; during the frozen phase, gentle mobility work; and in thawing, progressive strengthening.`,

  'Biceps Tendinopathy (Long Head)': `The long head of the biceps tendon runs from the muscle down through a groove at the front of the shoulder. When it becomes irritated from overuse or impingement, it causes a deep, aching pain at the front of the shoulder — often mistaken for general shoulder pain. It tends to be worse with lifting and reaching overhead. It usually coexists with rotator cuff problems and responds to the same type of treatment: progressive loading and addressing the underlying shoulder mechanics that are causing the tendon to be overloaded.`,

  'AC Joint Osteoarthritis / Dysfunction': `The AC (acromioclavicular) joint is the small joint at the very top of your shoulder where your collarbone meets the bony arch of the shoulder blade. It can become painful from a direct injury (like a fall onto the shoulder), or gradually develop arthritis with age. You'll feel it as a localised pain right at the top of the shoulder, often worse when reaching across your body or lifting overhead. Most AC joint problems are managed conservatively — physiotherapy to offload the joint and address shoulder mechanics, with occasional injections in stubborn cases.`,

  'Glenohumeral Osteoarthritis': `Just like the hip and knee, the shoulder joint itself can develop osteoarthritis — where the cartilage lining the joint wears down over time. It's less common than hip or knee OA but causes similar symptoms: a deep, stiff ache in the shoulder that's worse with movement and better with rest, progressive loss of range of motion, and sometimes a grinding sensation. Exercise and physiotherapy are still the best first-line treatment and can significantly reduce pain and improve function, even with advanced OA.`,

  'Scapular Dyskinesis': `Your shoulder blade (scapula) needs to move in a coordinated way with your shoulder joint. When the muscles controlling it — particularly the serratus anterior and lower trapezius — are weak or inhibited, the shoulder blade can move abnormally ("wing" outward or tip forward), which puts extra load on the rotator cuff and shoulder joint. It's rarely the main problem in isolation — usually it's a secondary finding alongside a shoulder or thoracic spine issue. Shoulder blade-specific strengthening is a core part of most shoulder rehab programs.`,

  'Thoracic Outlet Syndrome (Neurogenic) — Shoulder presentation': `This is the same condition as thoracic outlet syndrome — compression of nerves and blood vessels between the collarbone and first rib — but presenting with shoulder-predominant symptoms. You might feel aching, heaviness, tingling, or weakness in the shoulder and arm, particularly when holding the arm in certain positions. Physiotherapy to improve posture, open the thoracic outlet, and strengthen the surrounding muscles is the primary treatment.`,

  // ── KNEE ──
  'Knee Osteoarthritis': `Knee OA is the most common joint condition worldwide. The cartilage inside your knee gradually wears down, reducing the cushioning between the bones. This causes pain, stiffness, and sometimes swelling — usually worse with activity and first thing in the morning. It's a progressive condition, but it's very manageable. Despite what many people believe, exercise is one of the single best treatments for knee OA — it reduces pain, improves function, and protects the joint. Staying active and keeping the muscles around the knee strong is far more effective than resting it.`,

  'Patellofemoral Pain Syndrome (PFPS)': `Patellofemoral pain (sometimes called "runner's knee") is pain at or around the kneecap. It happens when the kneecap doesn't track smoothly in its groove as the knee bends and straightens — often because of weakness in the hip or thigh muscles. It's very common in runners, cyclists, and people who do a lot of squatting or stair climbing. It causes an aching, sometimes sharp pain at the front of the knee that's worse going downstairs, squatting, or sitting for long periods with bent knees (the "cinema sign"). It responds very well to hip and quad strengthening.`,

  'Patellar Tendinopathy (Jumper\'s Knee)': `Your patellar tendon connects your kneecap to your shin bone and transmits the force your quad muscle generates. When it's repeatedly overloaded — common in jumping sports like basketball or volleyball — the tendon can become irritated and painful. You'll feel it as a pain just below the kneecap that's worse at the start of exercise and sometimes after. Unlike most injuries, it tends to warm up during activity and hurt more afterwards. A progressive loading program (particularly eccentric loading) is the most effective treatment — but it needs to be done carefully to avoid flaring it up.`,

  'ACL Sprain / Tear': `The ACL (anterior cruciate ligament) is one of the main stabilising ligaments inside the knee. It most commonly tears during sports with sudden twisting, pivoting, or landing movements. The typical story is a sharp pain, a pop you might hear or feel, immediate swelling, and a feeling that the knee "gave way." Partial tears can sometimes be managed conservatively. Complete tears in active people are often treated surgically, followed by a thorough 9–12 month rehabilitation program. Return to sport too early is the main risk factor for re-injury.`,

  'PCL Sprain / Tear': `The PCL (posterior cruciate ligament) is less commonly injured than the ACL but can be damaged by a direct impact to the front of the bent knee — like hitting a dashboard in a car accident, or falling directly onto a bent knee. It usually causes pain, swelling, and a feeling of instability when going downstairs or decelerating. Most isolated PCL injuries are managed conservatively (without surgery) with a focused quadriceps strengthening program, which compensates for the ligament's reduced function.`,

  'MCL Sprain': `The MCL (medial collateral ligament) runs along the inner side of your knee and resists the knee being pushed inward (knocked-kneed). It's usually injured by a force coming from the outer side of the knee — common in contact sports. A sprain causes pain and tenderness along the inner knee. Grade I and II sprains (partial tears) heal very well with physiotherapy over 4–8 weeks. Grade III (complete tears) may need a brace and longer rehab, but surgery is rarely required for isolated MCL tears.`,

  'LCL Sprain / Posterolateral Corner': `The LCL (lateral collateral ligament) runs along the outer side of the knee and is less commonly injured than the MCL. It's usually damaged by a force to the inner side of the knee, or a hyperextension injury. Pain on the outer knee, swelling, and sometimes a feeling of instability when fully straightening the leg are typical. Isolated LCL sprains usually heal well with physiotherapy. More complex posterolateral corner injuries (involving multiple structures) may need surgical assessment.`,

  'Meniscal Tear (Traumatic)': `Your menisci are two C-shaped pads of cartilage inside your knee that act as shock absorbers and help distribute weight across the joint. A traumatic tear usually happens from a sudden twisting movement with the foot planted — the kind of injury that happens in sport. Symptoms include pain, swelling, and sometimes a locking or catching sensation where the knee gets stuck. Younger, active people with a significant mechanical locking problem sometimes need surgery (to repair or trim the tear). Many traumatic tears, especially in older people, respond well to physiotherapy.`,

  'Meniscal Tear (Degenerative)': `In people over 40, the meniscus can develop wear-and-tear tears that happen without any obvious injury — a bit like a fraying piece of rubber. They're actually very common on MRI scans in this age group, and many cause no symptoms at all. When they do cause pain, it's usually a dull ache on the inner or outer knee, sometimes with swelling. The evidence strongly shows that physiotherapy is just as effective as surgery for most degenerative meniscal tears. Quadriceps strengthening and activity modification is the recommended first approach.`,

  'Pes Anserine Bursitis': `The pes anserine bursa is a small fluid-filled cushion on the inner side of your knee, just below the joint line. When it becomes inflamed — often in people with knee arthritis, obesity, or diabetes — it causes a specific, localised pain on the inner knee that's about 2–3 cm below where you'd expect joint-line pain. It often aches at night or when climbing stairs. Ice, activity modification, hamstring stretching, and quad strengthening are the mainstays of treatment. It usually settles with conservative care.`,

  // ── ANKLE / FOOT ──
  'Lateral Ankle Sprain (ATFL/CFL)': `A lateral ankle sprain is the most common musculoskeletal injury there is — the classic "rolled ankle" where the foot turns inward and the ligaments on the outer side of the ankle get overstretched or torn. You'll feel immediate pain on the outer ankle, often with swelling and bruising within hours. Most ankle sprains heal well, but the real risk is developing chronic instability — about 1 in 3 people have ongoing problems if they don't do proper rehabilitation. The key is not just resting it until the pain goes, but retraining your ankle's balance and strength to prevent it happening again.`,

  'High Ankle Sprain (Syndesmotic)': `A high ankle sprain is a different — and more serious — injury than the common rolled ankle. Instead of the ligaments on the outer side, it involves the ligaments that hold the two bones of your lower leg together above the ankle joint. It typically happens from an outward rotation of the foot. The hallmark is pain higher up the ankle (above the joint line) that's disproportionately bad for what seems like a "simple" sprain, and it takes significantly longer to heal — 6–12 weeks is typical, compared to 2–4 for a standard sprain. Don't rush the return to sport with this one.`,

  'Ankle Osteoarthritis': `Ankle OA is less common than hip or knee OA and usually follows a previous ankle fracture or a history of chronic instability. It causes stiffness, a deep ache, and reduced range of motion in the ankle — particularly the up-and-down movement — that's worse with activity and first thing in the morning. Like all forms of OA, it's very manageable with the right approach: progressive calf and ankle strengthening, footwear advice, and orthotics to redistribute load can make a significant difference to daily function.`,

  'Plantar Fasciitis': `The plantar fascia is a thick band of tissue running along the bottom of your foot from the heel to the base of the toes. It supports the arch and absorbs load with every step. Plantar fasciitis is one of the most common foot problems — an irritation of this tissue that causes a sharp, stabbing pain at the heel, classically worst with the first steps in the morning or after sitting for a while. It tends to ease once you've been walking for a few minutes. It's not dangerous, but it can be stubbornly persistent. Calf stretching, foot strengthening, and load management are the core treatment.`,

  'Achilles Tendinopathy': `Your Achilles tendon is the thick cord at the back of your ankle connecting your calf muscles to your heel bone. It's the strongest tendon in the body — and one of the most commonly injured. Tendinopathy means the tendon has been overloaded and isn't coping. You'll feel a stiff, achy pain at the back of the ankle that's worst first thing in the morning and often eases somewhat during a run (only to ache again afterwards). Complete rest is not the answer — the tendon needs progressive loading to heal. Calf strengthening, particularly with heavy slow resistance exercises, is the gold-standard treatment.`,

  'Posterior Tibial Tendon Dysfunction (PTTD)': `The posterior tibial tendon runs down the inside of your ankle and is the main support for your foot's arch. When it becomes overloaded and starts to fail, it can cause progressive flattening of the arch (flat foot), pain along the inner ankle and arch, and difficulty standing on tiptoe on that foot. It's most common in middle-aged adults and tends to worsen gradually if not addressed. Early-stage PTTD responds well to physiotherapy and orthotics. More advanced cases may need surgical assessment.`,

  'Anterior Tibialis Tendinopathy': `The tibialis anterior tendon runs across the front of your ankle and is responsible for pulling your foot up (dorsiflexion). When it's overloaded — usually from increased running volume or hill walking — it can become sore and achy along the front of the ankle or inner midfoot. It's less common than Achilles or plantar fascia problems. Rest from the aggravating activity, followed by a gradual return with progressive loading, is usually all that's needed.`,

  'Peroneal Tendinopathy': `The peroneal tendons run behind the outer ankle bone and help prevent the ankle from rolling inward. When overloaded — often in runners who pronate, or after a significant ankle sprain — they can become irritated and painful along the outer ankle or foot. You'll notice an ache that worsens with activity and tenderness when pressing along the tendon behind the ankle bone. Like other tendinopathies, progressive loading exercises are the mainstay of treatment, alongside addressing any ankle instability.`,

  'Tarsal Tunnel Syndrome': `Tarsal tunnel syndrome is compression of the posterior tibial nerve as it passes through a tight space behind the inner ankle bone — similar to carpal tunnel in the wrist, but at the ankle. It causes burning, tingling, or electric pain along the inner ankle and into the sole of the foot. It can be caused by flat feet, swelling, or a space-occupying lesion. Conservative treatment (orthotics, activity modification, physiotherapy) is first-line; some cases need a cortisone injection or surgical release.`,

  'Metatarsalgia': `Metatarsalgia is pain under the ball of the foot — the area where the long bones of the foot (metatarsals) meet the toes. It's essentially overload of the tissue under the front of the foot and can feel like you're walking on a pebble or bruised bone. It's common in runners, people who wear high heels, and those who spend a lot of time on their feet. Cushioned insoles, footwear changes, and foot strengthening exercises are usually very effective.`,

  'Chronic Ankle Instability (CAI)': `Chronic ankle instability develops in about 1 in 3 people after an ankle sprain when the injured ligaments and proprioceptive (balance) system don't fully recover. You'll notice the ankle feels wobbly or "gives way" with uneven ground, sport, or even just walking. It's not just a ligament problem — the brain's control of the ankle is also affected. The treatment is focused on balance and proprioception retraining, combined with strengthening the muscles that support the ankle. Most cases respond well to a structured physiotherapy program.`,

  // ── ELBOW ──
  'Cubital Tunnel Syndrome (Ulnar Nerve)': `Cubital tunnel syndrome is the elbow version of carpal tunnel — it's compression of the ulnar nerve where it passes through a groove on the inner side of your elbow (the "funny bone" spot). It causes tingling and numbness in the ring and little fingers, especially when the elbow is bent. Prolonged elbow flexion (like sleeping with the elbow bent or holding a phone to your ear for long periods) tends to aggravate it. Activity modification, nerve gliding exercises, and avoiding sustained elbow flexion usually works well. Severe cases may need surgical decompression.`,

  'Radial Tunnel Syndrome': `The radial nerve passes through a small tunnel of muscles just below the outer elbow. When that tunnel becomes tight and compresses the nerve, it causes a deep, aching pain in the forearm — often mistaken for lateral epicondylalgia (tennis elbow). The key difference is that the pain is usually in the muscle belly (3–4 cm below the outer elbow), not right at the elbow itself, and it doesn't respond to treatment for tennis elbow. Rest, activity modification, and nerve mobilisation exercises are the main treatment.`,

  'Posterior Interosseous Nerve Syndrome (Supinator Syndrome)': `This is a compression of the posterior interosseous nerve — a branch of the radial nerve — as it passes through the supinator muscle just below the outer elbow. It causes weakness in the muscles that extend the fingers and thumb, without the sensation changes you'd expect with full radial nerve involvement. It can be associated with a mass, after a dislocation, or from repetitive supination. Physiotherapy and activity modification are first-line; surgery is considered if there's significant, persistent motor weakness.`,

  'Pronator Teres Syndrome (Median Nerve)': `The median nerve (the one involved in carpal tunnel) can also be compressed at the elbow, as it passes between the two heads of the pronator teres muscle in the forearm. Unlike carpal tunnel, the tingling and numbness will include the palm of the hand (not just the fingers), and it's often aggravated by activities involving repetitive forearm rotation. Activity modification to reduce forearm pronation load and nerve mobilisation are the main treatments.`,

  'Ulnar Collateral Ligament (UCL) Sprain': `The UCL runs along the inner side of the elbow and is the primary stabiliser against valgus stress — the kind of force that happens at the elbow during throwing, especially at the top of a baseball pitch. It can be sprained or completely ruptured (the famous "Tommy John" surgery). Pain on the inner elbow with throwing, gripping, or with any valgus stress to the elbow are the main symptoms. Grade I and II sprains often recover with physiotherapy; complete tears in throwing athletes typically need surgical reconstruction.`,

  'Distal Biceps Tendinopathy': `The biceps tendon attaches at the front of the elbow to the radius bone (forearm). When overloaded — usually from heavy lifting or repetitive forearm supination (palm-up rotation) — it can become painful without tearing. You'll feel it as a deep ache at the front of the elbow, especially with lifting or forearm rotation. It responds well to a progressive loading program that gradually builds the tendon's capacity — similar to other tendinopathies in the body.`,

  'Distal Biceps Tendon Rupture (Complete)': `A complete distal biceps rupture happens when the biceps tendon tears away from the bone at the front of the elbow — usually from a sudden, heavy lifting load with the elbow bent. It's dramatic: a sharp pop, immediate pain and weakness, and often a visible deformity ("Popeye" bulge in the upper arm as the muscle retracts). In active people under 60, surgical repair within 2–3 weeks gives the best functional outcome. Without surgery, you'll lose significant forearm supination strength (about 40%) though elbow flexion strength recovers reasonably well.`,

  // Lateral/Medial epicondylalgia (if present)
  'Lateral Epicondylalgia (Tennis Elbow)': `Tennis elbow — despite the name — affects far more non-tennis players than tennis players. It's an overload injury of the tendons that attach at the outer elbow and control wrist and finger extension. Repeated gripping, lifting, and wrist extension activities gradually overload these tendons. You'll feel a tenderness right at the outer elbow bump and pain with gripping, lifting a kettle, or shaking hands. It can be stubbornly persistent but responds well to a progressive tendon loading program — the key is not to avoid all use, but to gradually increase the load the tendon can tolerate.`,

  'Medial Epicondylalgia (Golfer\'s Elbow)': `Golfer's elbow is the mirror image of tennis elbow — it affects the tendons at the inner elbow that control wrist flexion and forearm pronation. Despite the name, it's common in anyone who does repetitive gripping, throwing, or wrist flexion activities. You'll feel tenderness at the inner elbow bump and pain with gripping or flexing the wrist against resistance. Like tennis elbow, a progressive loading program for the flexor-pronator tendons is the evidence-based treatment.`,
};


// ======== FREE-TEXT KEYWORD ENGINE ========
// Scans the free-text fields against a keyword map and injects matched
// clinical symptom/agg/alle terms into the scoring sets before the DDx runs.
// The user never sees this happening — it just improves scoring silently.

const KEYWORD_MAP = {
  // Each entry: keyword/phrase (lowercase) → { type: 'symp'|'agg'|'alle', term: <clinical chip value> }
  // 'term' must exactly match a value in SYMPTOM_CHIPS, AGG_CHIPS, or ALLE_CHIPS

  // ── Pain descriptors ──
  'shooting':           { type:'symp', term:'Radiating pain (leg)' },
  'shoots down':        { type:'symp', term:'Radiating pain (leg)' },
  'electric':           { type:'symp', term:'Tingling' },
  'electrical':         { type:'symp', term:'Tingling' },
  'burning':            { type:'symp', term:'Burning' },
  'burns':              { type:'symp', term:'Burning' },
  'pins and needles':   { type:'symp', term:'Tingling' },
  'pins & needles':     { type:'symp', term:'Tingling' },
  'numb':               { type:'symp', term:'Numbness' },
  'numbness':           { type:'symp', term:'Numbness' },
  'can\'t feel':        { type:'symp', term:'Numbness' },
  'tingling':           { type:'symp', term:'Tingling' },
  'tingle':             { type:'symp', term:'Tingling' },
  'throbbing':          { type:'symp', term:'Deep ache' },
  'dull ache':          { type:'symp', term:'Deep ache' },
  'deep ache':          { type:'symp', term:'Deep ache' },
  'aching':             { type:'symp', term:'Deep ache' },
  'stabbing':           { type:'symp', term:'Sharp pain' },
  'sharp':              { type:'symp', term:'Sharp pain' },
  'knife':              { type:'symp', term:'Sharp pain' },
  'cramping':           { type:'symp', term:'Muscle spasm / guarding' },
  'cramp':              { type:'symp', term:'Muscle spasm / guarding' },
  'spasm':              { type:'symp', term:'Muscle spasm / guarding' },
  'tight':              { type:'symp', term:'Stiffness' },
  'tightness':          { type:'symp', term:'Stiffness' },
  'stiff':              { type:'symp', term:'Stiffness' },
  'stiffness':          { type:'symp', term:'Stiffness' },
  'sore':               { type:'symp', term:'Deep ache' },

  // ── Mechanical symptoms ──
  'clicking':           { type:'symp', term:'Clicking / popping' },
  'clicks':             { type:'symp', term:'Clicking / popping' },
  'popping':            { type:'symp', term:'Clicking / popping' },
  'pops':               { type:'symp', term:'Clicking / popping' },
  'cracking':           { type:'symp', term:'Clicking / popping' },
  'crunching':          { type:'symp', term:'Crepitus' },
  'grinding':           { type:'symp', term:'Crepitus' },
  'grating':            { type:'symp', term:'Crepitus' },
  'locking':            { type:'symp', term:'Locking' },
  'locks up':           { type:'symp', term:'Locking' },
  'catches':            { type:'symp', term:'Catching sensation' },
  'catching':           { type:'symp', term:'Catching sensation' },
  'gives way':          { type:'symp', term:'Giving way / instability' },
  'giving way':         { type:'symp', term:'Giving way / instability' },
  'buckles':            { type:'symp', term:'Giving way / instability' },
  'buckling':           { type:'symp', term:'Giving way / instability' },
  'unstable':           { type:'symp', term:'Giving way / instability' },
  'wobbly':             { type:'symp', term:'Giving way / instability' },
  'snapping':           { type:'symp', term:'Clicking / popping' },
  'swollen':            { type:'symp', term:'Swelling/effusion' },
  'swelling':           { type:'symp', term:'Swelling/effusion' },
  'puffy':              { type:'symp', term:'Swelling/effusion' },
  'bruising':           { type:'symp', term:'Bruising / ecchymosis' },
  'bruised':            { type:'symp', term:'Bruising / ecchymosis' },
  'black and blue':     { type:'symp', term:'Bruising / ecchymosis' },

  // ── Weakness / function ──
  'weak':               { type:'symp', term:'Weakness (lower extremity)' },
  'weakness':           { type:'symp', term:'Weakness (lower extremity)' },
  'can\'t lift':        { type:'symp', term:'Weakness (lower extremity)' },
  'dropping things':    { type:'symp', term:'Weakness of grip' },
  'drop things':        { type:'symp', term:'Weakness of grip' },
  'limp':               { type:'symp', term:'Antalgic gait' },
  'limping':            { type:'symp', term:'Antalgic gait' },

  // ── Location / radiation ──
  'down my leg':        { type:'symp', term:'Sciatica / burning pain down leg' },
  'down the leg':       { type:'symp', term:'Radiating pain (leg)' },
  'into my leg':        { type:'symp', term:'Radiating pain (leg)' },
  'radiates':           { type:'symp', term:'Radiating pain (leg)' },
  'radiating':          { type:'symp', term:'Radiating pain (leg)' },
  'down my arm':        { type:'symp', term:'Radiating pain (arm)' },
  'into my arm':        { type:'symp', term:'Radiating pain (arm)' },
  'down the arm':       { type:'symp', term:'Radiating pain (arm)' },
  'into my hand':       { type:'symp', term:'Radiating pain (arm)' },
  'buttock':            { type:'symp', term:'Unilateral buttock pain' },
  'butt':               { type:'symp', term:'Unilateral buttock pain' },
  'groin':              { type:'symp', term:'Deep groin pain' },
  'behind the knee':    { type:'symp', term:'Posterior knee pain' },
  'back of knee':       { type:'symp', term:'Posterior knee pain' },
  'front of knee':      { type:'symp', term:'Anterior knee pain' },
  'kneecap':            { type:'symp', term:'Anterior knee pain' },
  'heel':               { type:'symp', term:'Plantar heel pain' },
  'heel pain':          { type:'symp', term:'Plantar heel pain' },
  'arch':               { type:'symp', term:'Arch pain / medial foot pain' },
  'ball of foot':       { type:'symp', term:'Forefoot / metatarsal head pain' },

  // ── Timing / behaviour ──
  'worse in morning':   { type:'symp', term:'Morning stiffness (<30 min)' },
  'morning stiffness':  { type:'symp', term:'Morning stiffness (<30 min)' },
  'morning pain':       { type:'symp', term:'Morning pain (first steps)' },
  'first thing':        { type:'symp', term:'Morning pain (first steps)' },
  'first steps':        { type:'symp', term:'Morning pain (first steps)' },
  'wakes me up':        { type:'symp', term:'Night pain' },
  'wakes me':           { type:'symp', term:'Night pain' },
  'night pain':         { type:'symp', term:'Night pain' },
  'at night':           { type:'symp', term:'Night pain' },
  'trouble sleeping':   { type:'symp', term:'Night pain' },
  'can\'t sleep':       { type:'symp', term:'Night pain' },
  'headache':           { type:'symp', term:'Headache (unilateral)' },
  'head pain':          { type:'symp', term:'Headache (unilateral)' },
  'dizzy':              { type:'symp', term:'Dizziness' },
  'dizziness':          { type:'symp', term:'Dizziness' },

  // ── Aggravating factors ──
  'sitting too long':   { type:'agg', term:'Prolonged sitting' },
  'sitting for long':   { type:'agg', term:'Prolonged sitting' },
  'sitting a lot':      { type:'agg', term:'Prolonged sitting' },
  'desk':               { type:'agg', term:'Prolonged sitting' },
  'driving':            { type:'agg', term:'Prolonged sitting' },
  'car':                { type:'agg', term:'Prolonged sitting' },
  'standing too long':  { type:'agg', term:'Prolonged standing' },
  'standing for long':  { type:'agg', term:'Prolonged standing' },
  'on my feet':         { type:'agg', term:'Prolonged standing' },
  'bending over':       { type:'agg', term:'Bending forward (flexion)' },
  'bending forward':    { type:'agg', term:'Bending forward (flexion)' },
  'leaning forward':    { type:'agg', term:'Bending forward (flexion)' },
  'leaning back':       { type:'agg', term:'Bending backward (extension)' },
  'arching back':       { type:'agg', term:'Bending backward (extension)' },
  'twisting':           { type:'agg', term:'Rotation / twisting' },
  'rotating':           { type:'agg', term:'Rotation / twisting' },
  'lifting':            { type:'agg', term:'Lifting' },
  'carrying':           { type:'agg', term:'Carrying objects' },
  'going upstairs':     { type:'agg', term:'Ascending stairs' },
  'up stairs':          { type:'agg', term:'Ascending stairs' },
  'going downstairs':   { type:'agg', term:'Descending stairs' },
  'down stairs':        { type:'agg', term:'Descending stairs' },
  'running':            { type:'agg', term:'Running' },
  'jogging':            { type:'agg', term:'Running' },
  'squatting':          { type:'agg', term:'Squatting' },
  'squat':              { type:'agg', term:'Squatting' },
  'kneeling':           { type:'agg', term:'Kneeling' },
  'jumping':            { type:'agg', term:'Jumping/landing' },
  'landing':            { type:'agg', term:'Jumping/landing' },
  'overhead':           { type:'agg', term:'Overhead activities (60–120° arc)' },
  'reaching up':        { type:'agg', term:'Overhead activities (60–120° arc)' },
  'coughing':           { type:'agg', term:'Sneezing / coughing (Valsalva)' },
  'sneezing':           { type:'agg', term:'Sneezing / coughing (Valsalva)' },
  'looking down':       { type:'agg', term:'Looking down (flexion)' },
  'looking at phone':   { type:'agg', term:'Looking down (flexion)' },
  'screen':             { type:'agg', term:'Prolonged sitting' },
  'gripping':           { type:'agg', term:'Gripping' },
  'typing':             { type:'agg', term:'Typing / keyboard use' },
  'keyboard':           { type:'agg', term:'Typing / keyboard use' },
  'walking':            { type:'agg', term:'Prolonged walking' },

  // ── Alleviating factors ──
  'rest':               { type:'alle', term:'Rest' },
  'resting':            { type:'alle', term:'Rest' },
  'lying down':         { type:'alle', term:'Lying down / supine' },
  'sitting down':       { type:'alle', term:'Sitting' },
  'ice':                { type:'alle', term:'Ice' },
  'icing':              { type:'alle', term:'Ice' },
  'cold pack':          { type:'alle', term:'Ice' },
  'heat':               { type:'alle', term:'Heat' },
  'hot pack':           { type:'alle', term:'Heat' },
  'hot shower':         { type:'alle', term:'Heat' },
  'ibuprofen':          { type:'alle', term:'Anti-inflammatories (NSAIDs)' },
  'nurofen':            { type:'alle', term:'Anti-inflammatories (NSAIDs)' },
  'advil':              { type:'alle', term:'Anti-inflammatories (NSAIDs)' },
  'panadol':            { type:'alle', term:'Anti-inflammatories (NSAIDs)' },
  'paracetamol':        { type:'alle', term:'Anti-inflammatories (NSAIDs)' },
  'anti-inflammatory':  { type:'alle', term:'Anti-inflammatories (NSAIDs)' },
  'massage':            { type:'alle', term:'Massage / soft tissue therapy' },
  'stretching':         { type:'alle', term:'Stretching' },
  'movement':           { type:'alle', term:'Position changes' },
  'walking helps':      { type:'alle', term:'Walking' },
  'moving around':      { type:'alle', term:'Position changes' },
  // ── Shin / lower leg ──
  'shin':               { type:'symp', term:'Medial leg / shin pain' },
  'shin splints':       { type:'symp', term:'Medial leg / shin pain' },
  'shin pain':          { type:'symp', term:'Medial leg / shin pain' },
  'shin bone':          { type:'symp', term:'Medial leg / shin pain' },
  'tibia':              { type:'symp', term:'Medial leg / shin pain' },
  'tibial':             { type:'symp', term:'Medial leg / shin pain' },
  'lower leg pain':     { type:'symp', term:'Medial leg / shin pain' },
  'inner leg':          { type:'symp', term:'Medial leg / shin pain' },
  'medial leg':         { type:'symp', term:'Medial leg / shin pain' },
  'stress fracture':    { type:'symp', term:'Pain out of proportion to injury' },
  'bone pain':          { type:'symp', term:'Pain at rest' },

  // ── Calf ──
  'calf':               { type:'symp', term:'Calf pain' },
  'calf pain':          { type:'symp', term:'Calf pain' },
  'calf strain':        { type:'symp', term:'Calf pain' },
  'calf muscle':        { type:'symp', term:'Calf pain' },
  'gastrocnemius':      { type:'symp', term:'Calf pain' },
  'tennis leg':         { type:'symp', term:'Calf pain' },
  'pulled calf':        { type:'symp', term:'Calf pain' },
  'back of leg':        { type:'symp', term:'Calf pain' },

  // ── IT band / lateral knee ──
  'it band':            { type:'symp', term:'Lateral knee pain' },
  'itb':                { type:'symp', term:'Lateral knee pain' },
  'iliotibial':         { type:'symp', term:'Lateral knee pain' },
  'lateral knee':       { type:'symp', term:'Lateral knee pain' },
  'outside of knee':    { type:'symp', term:'Lateral knee pain' },
  'outer knee':         { type:'symp', term:'Lateral knee pain' },
  'runner\'s knee':    { type:'symp', term:'Lateral knee pain' },

  // ── Running aggravators ──
  'when i run':         { type:'agg',  term:'Running' },
  'after running':      { type:'agg',  term:'Running' },
  'during running':     { type:'agg',  term:'Running' },
  'sprinting':          { type:'agg',  term:'Sprinting' },
  'training':           { type:'agg',  term:'Increased training load' },
  'overtraining':       { type:'agg',  term:'Increased training load' },
  'increased mileage':  { type:'agg',  term:'Increased training load' },
  'new exercise':       { type:'agg',  term:'Increased training load' },
  'started running':    { type:'agg',  term:'Increased training load' },
  'impact':             { type:'agg',  term:'Impact activities' },
  'hard surface':       { type:'agg',  term:'Running on hard surfaces' },
  'pavement':           { type:'agg',  term:'Running on hard surfaces' },
  'concrete':           { type:'agg',  term:'Running on hard surfaces' },
  'hills':              { type:'agg',  term:'Hill running' },
  'hill running':       { type:'agg',  term:'Hill running' },
  'cycling':            { type:'agg',  term:'Cycling' },
  'bike':               { type:'agg',  term:'Cycling' },
  'biking':             { type:'agg',  term:'Cycling' },

  // ── Sciatica / nerve down leg ──
  'sciatica':           { type:'symp', term:'Sciatica / burning pain down leg' },
  'sciatic':            { type:'symp', term:'Sciatica / burning pain down leg' },
  'radiates to leg':    { type:'symp', term:'Radiating pain (leg)' },
  'leg pain':           { type:'symp', term:'Radiating pain (leg)' },
  'nerve pain':         { type:'symp', term:'Sciatica / burning pain down leg' },
  'nerve':              { type:'symp', term:'Tingling' },

  // ── Hip / outer hip ──
  'outer hip':          { type:'symp', term:'Lateral hip pain' },
  'outside of hip':     { type:'symp', term:'Lateral hip pain' },
  'side of hip':        { type:'symp', term:'Lateral hip pain' },
  'trochanter':         { type:'symp', term:'Lateral hip pain' },
  'hip bursitis':       { type:'symp', term:'Lateral hip pain' },
  'bursitis':           { type:'symp', term:'Lateral hip pain' },

};

// Longer phrases must match before shorter ones to avoid false positives
const _KW_SORTED = Object.keys(KEYWORD_MAP).sort((a, b) => b.length - a.length);

// Define a comprehensive dictionary of negation words
const NEGATION_WORDS = new Set([
  'no', 'not', 'none', 'never', 'without', 'zero', 'lacks',
  'hardly', 'rarely', 'isn\'t', 'isnt', 'aren\'t', 'arent',
  'wasn\'t', 'wasnt', 'haven\'t', 'havent', 'hasn\'t', 'hasnt',
  'don\'t', 'dont', 'doesn\'t', 'doesnt', 'didn\'t', 'didnt'
]);
// Define boundaries so a negation doesn't bleed into the next thought
const CLAUSE_BREAKS = ['.', ',', '!', '?', ';', '\n', ' but ', ' however ', ' although '];

// ── TOAST NOTIFICATION ──
let _toastTimer = null;
function _showToast(msg, duration) {
  const el = document.getElementById('eidos-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, duration || 3000);
}

function extractKeywordMatches(text) {
  const result = { symp: new Set(), agg: new Set(), alle: new Set() };
  if (!text || !text.trim()) return result;

  // Lowercase the text, but keep punctuation intact for boundary detection
  const lowerText = text.toLowerCase();

  const _upperAreas = ['cervical','shoulder','elbow','thoracic'];
  const _isUpper = _upperAreas.includes(state.area);
  for (const kw of _KW_SORTED) {
    // Create a regex to match the exact phrase with word boundaries
    const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'g');

    let match;
    let foundValidMatch = false;
    // Loop through every time this keyword appears in the text
    while ((match = regex.exec(lowerText)) !== null) {
      // 1. Look back up to 40 characters before the matched keyword
      const windowStart = Math.max(0, match.index - 40);
      let precedingText = lowerText.substring(windowStart, match.index);

      // 2. Prevent negations from bleeding across sentences or contrasting clauses ("but")
      let latestBreak = -1;
      for (const cb of CLAUSE_BREAKS) {
        const breakIndex = precedingText.lastIndexOf(cb);
        if (breakIndex > latestBreak) latestBreak = breakIndex;
      }
      if (latestBreak !== -1) {
        // Only keep the text AFTER the punctuation/clause break
        precedingText = precedingText.substring(latestBreak + 1);
      }

      // 3. Split the remaining preceding text into individual words
      const precedingWords = precedingText.split(/[\s]+/).filter(w => w.length > 0);

      // 4. Check if any of the preceding words (up to 5 words back) is a negation
      const isNegated = precedingWords.slice(-5).some(word => NEGATION_WORDS.has(word));

      if (!isNegated) {
        foundValidMatch = true;
        break; // Stop checking this keyword once we find a valid, non-negated instance
      }
    }
    if (foundValidMatch) {
      let { type, term } = KEYWORD_MAP[kw];
      // Region-aware remapping: radiating pain → arm vs leg
      if (term === 'Radiating pain (leg)' && _isUpper) term = 'Radiating pain (arm)';

      result[type].add(term);
    }
  }
  return result;
}

function getTextWithKeywords(containerId, textareaId) {
  // Returns chip selections merged with keyword-matched terms from the textarea
  const chips = getSelectedChips(containerId);
  const text = document.getElementById(textareaId)?.value || '';
  const matched = extractKeywordMatches(text);
  const typeKey = containerId === 'symptomChips' ? 'symp'
                : containerId === 'aggChips'     ? 'agg'
                : 'alle';
  matched[typeKey].forEach(term => chips.add(term));
  return chips;
}


// ======== ONSET / DURATION PROFILES ========
// Maps every diagnosis name → expected onset category.
// 'variable' = can be either acute or chronic (no penalty either way).
// Used in buildResults() to boost/penalise scores based on user-reported duration.

const ONSET_PROFILE = {
  // ── ACUTE ──
  "Lateral Ankle Sprain":                 'acute',
  "High Ankle Sprain":                    'acute',
  "Syndesmotic Ankle Sprain":             'acute',
  "ACL Tear":                             'acute',
  "PCL Tear":                             'acute',
  "MCL Sprain":                           'acute',
  "LCL Sprain":                           'acute',
  "ACL Sprain/Tear":                      'acute',
  "Glenohumeral Instability":             'acute',
  "Glenohumeral Dislocation":             'acute',
  "Shoulder Dislocation / Instability":   'acute',
  "Ulnar Collateral Ligament Sprain":     'acute',
  "Distal Biceps Rupture":                'acute',
  "Biceps Rupture (Distal)":              'acute',
  "Hip Flexor Strain":                    'acute',
  "Hamstring Strain":                     'acute',
  "Hamstring Tear / Strain":              'acute',
  "Adductor Strain":                      'acute',
  "Hip Adductor Strain":                  'acute',
  "Thoracic Muscle Strain":               'acute',
  "Hip Pointer":                          'acute',
  "Cervical Sprain":                      'acute',
  "Whiplash":                             'acute',
  "Cervical Sprain / Whiplash":           'acute',
  "Gout":                                 'acute',
  "Septic Arthritis":                     'acute',
  "Septic Olecranon Bursitis":            'acute',
  "Olecranon Bursitis":                   'acute',

  // ── SUBACUTE ──
  "Patellar Tendinopathy":                'subacute',
  "Patellar Tendinopathy (Jumper's Knee)":'subacute',
  "Rotator Cuff Tendinopathy":            'subacute',
  "Achilles Tendinopathy":                'subacute',
  "Hip Flexor Tendinopathy":              'subacute',
  "Iliopsoas Tendinopathy":               'subacute',
  "Adductor Tendinopathy":                'subacute',
  "Rectus Femoris Tendinopathy":          'subacute',
  "Peroneal Tendinopathy":                'subacute',
  "Anterior Tibialis Tendinopathy":       'subacute',
  "Biceps Tendinopathy (Long Head)":      'subacute',
  "Biceps Tendinopathy":                  'subacute',
  "Lateral Epicondylalgia":               'subacute',
  "Medial Epicondylalgia":                'subacute',
  "Tennis Elbow (Lateral Epicondylalgia)":'subacute',
  "Golfer's Elbow (Medial Epicondylalgia)":'subacute',
  "Subacromial Bursitis":                 'variable',
  "Pes Anserine Bursitis":               'subacute',
  "Greater Trochanteric Pain Syndrome":   'subacute',
  "Cervicogenic Headache":               'subacute',
  "Mechanical Neck Pain":                 'subacute',
  "Subacute Low Back Pain":               'subacute',
  "Scapular Dyskinesia":                  'subacute',
  "Scapular Dyskinesia / Winging":        'subacute',

  // ── CHRONIC ──
  "Knee Osteoarthritis":                  'chronic',
  "Hip Osteoarthritis":                   'chronic',
  "Shoulder Osteoarthritis":              'chronic',
  "AC Joint Osteoarthritis":              'chronic',
  "Ankle Osteoarthritis":                 'chronic',
  "Glenohumeral Osteoarthritis":          'chronic',
  "Acromioclavicular (AC) Joint Arthritis":'chronic',
  "Cervical Spondylosis":                 'chronic',
  "Thoracic Spondylosis":                 'chronic',
  "Lumbar Spondylosis":                   'chronic',
  "Lumbar Degenerative Disc Disease":     'chronic',
  "Degenerative Disc Disease":            'chronic',
  "Gluteal Tendinopathy":                 'chronic',
  "Proximal Hamstring Tendinopathy":      'chronic',
  "Posterior Tibial Tendon Dysfunction":  'chronic',
  "Plantar Fasciitis":                    'chronic',
  "Chronic Low Back Pain":                'chronic',
  "Fibromyalgia":                         'chronic',
  "Piriformis Syndrome":                  'chronic',
  "Deep Gluteal Syndrome":                'chronic',
  "Piriformis / Deep Gluteal Syndrome":   'chronic',
  "Postural Syndrome":                    'chronic',
  "Upper Crossed Syndrome":               'chronic',
  "Kyphotic Posture":                     'chronic',
  "Scheuermann's Kyphosis":               'chronic',
  "Cervical Facet Joint Dysfunction":     'chronic',
  "Thoracic Facet Joint Dysfunction":     'chronic',
  "Lumbar Facet Joint Dysfunction":       'chronic',
  "Spondylolisthesis":                    'chronic',
  "Cubital Tunnel Syndrome":              'chronic',
  "Radial Tunnel Syndrome":               'chronic',
  "Pronator Teres Syndrome":              'chronic',
  "Tarsal Tunnel Syndrome":               'chronic',
  "Morton's Neuroma":                     'chronic',
  "SI Joint Dysfunction":                 'chronic',
  "Sacroiliac Joint Dysfunction":         'chronic',
  "Sacral / Innominate Dysfunction":      'chronic',
  "Lumbopelvic Instability":              'chronic',
  "Carpal Tunnel Syndrome":               'chronic',

  // ── VARIABLE (no penalty either way) ──
  "Lumbar Disc Herniation":               'variable',
  "Cervical Disc Herniation":             'variable',
  "Lumbar Spinal Stenosis":               'variable',
  "Cervical Spinal Stenosis":             'variable',
  "Hip Labral Tear":                      'variable',
  "Femoroacetabular Impingement (FAI)":   'variable',
  "Femoroacetabular Impingement":         'variable',
  "SLAP Lesion":                          'variable',
  "SLAP Tear":                            'variable',
  "Meniscal Tear":                        'variable',
  "Rotator Cuff Tear":                    'variable',
  "Rotator Cuff Tear (Partial or Full)":  'variable',
  "Snapping Hip Syndrome":                'variable',
  "Athletic Pubalgia":                    'variable',
  "Osteitis Pubis":                       'variable',
  "Sciatica":                             'variable',
  "Thoracic Outlet Syndrome":             'variable',
  "De Quervain's Tenosynovitis":          'variable',
  "Trigger Finger":                       'variable',
  "Patellofemoral Pain Syndrome":         'subacute',
  "IT Band Syndrome":                     'subacute',
  "Iliotibial Band Syndrome":             'subacute',
  "Trochanteric Bursitis":               'subacute',

  // ── RED FLAG ──
  "Femoral Neck Stress Fracture":         'variable',
  "Pubic Ramus Stress Fracture":          'variable',
  "Avascular Necrosis of the Hip":        'variable',
};

// Duration scoring: how much to add/subtract based on match
function applyDurationScore(baseScore, diagnosisName, userDuration) {
  if (!userDuration || userDuration === 'unknown' || baseScore <= 0) return baseScore;
  const profile = ONSET_PROFILE[diagnosisName] || 'variable';
  if (profile === 'variable') return baseScore; // variable onset — no modifier
  const delta = Math.max(1, Math.round(baseScore * 0.15)); // proportional ±15%, min 1
  if (profile === userDuration) return baseScore + delta;   // onset matches: boost
  return Math.max(0, baseScore - delta);                    // onset mismatch: penalise
}

const DDX_LOGIC = {
  lumbar: [
    {
      name: 'Lumbar Disc Herniation (Slipped / Bulging Disc)',
      ageNote: 'Peak 30–50 years; more common in males',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Radiating pain (leg)')||s.has('Leg pain greater than back pain')) score+=4;
        if(s.has('Paresthesias (dermatomal)')||s.has('Numbness')||s.has('Tingling')) score+=3;
        if(s.has('Weakness (lower extremity)')) score+=2;
        if(a.has('Bending forward (flexion)')||a.has('Prolonged sitting')) score+=2;
        if(a.has('Sneezing / coughing (Valsalva)')||a.has('Lifting')) score+=3;
        if(al.has('Walking')||al.has('Lying down')||al.has('Extension / back bend')) score+=2;
        // Penalties: sitting relieving disc pain is atypical (disc classically worsens with flexion/sitting)
        if(al.has('Sitting')) score=Math.max(0,score-3);
        // No radicular features strongly suggests against disc herniation
        if(!s.has('Radiating pain (leg)')&&!s.has('Leg pain greater than back pain')&&!s.has('Paresthesias (dermatomal)')&&!s.has('Numbness')&&!s.has('Tingling')) score=Math.max(0,score-3);
        // Bilateral leg pain less consistent with single disc herniation
        if(s.has('Bilateral leg symptoms')) score=Math.max(0,score-2);
        if(tests['SLR — Ipsilateral (straight leg raise)']==='+') score+=4;
        if(tests['SLR — Crossed (contralateral)']==='+') score+=4;
        if(tests['Slump Test']==='+') score+=3;
        if(age) {
          if(age >= 30 && age <= 50) score+=3;
          else if(age >= 25 && age < 30) score+=1;
          else if(age >= 51 && age <= 60) score+=1;
          else if(age > 60) score = Math.max(0, score - 1);
        }
        if(sex === 'male') score+=1;
        // Penalties: sharp rib/chest wall pain with breathing is costochondral, not spondylosis
        if(s.has('Chest wall pain')||s.has('Sharp pain with breathing')) score=Math.max(0,score-3);
        // Arm neurological features suggest TOS or cervical involvement
        if(s.has('Numbness')||s.has('Tingling')||s.has('Weakness (upper extremity)')) score=Math.max(0,score-3);
        // Band-like pain is more consistent with rib sprain or visceral referral
        if(s.has('Band-like pain')&&!s.has('Stiffness')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Lumbar disc herniation peaks at 30–50 years and is more common in males. The classic presentation is leg pain greater than back pain in a dermatomal distribution, often with associated paresthesias. The ipsilateral SLR is a well-established nerve tension screening test; a crossed SLR is associated with more significant nerve root involvement. Key nerve root deficits: L5 causes great toe weakness; S1 causes plantar flexion weakness and reduced ankle reflex. Conservative PT including McKenzie extension, neural mobilization, and core stabilization is first-line; refer if progressive neurological deficit.',
      exercises:[
        {icon:'🔄', name:'McKenzie Extension Press-Ups', sets:'3x10 reps', desc:'Promotes posterior disc movement if centralization occurs with extension — reassess response.', focus:'Centralise disc material posteriorly and restore extension range', diagram:'prone_press_up'},
        {icon:'🚶', name:'Walking Program', sets:'20–30 min/day', desc:'Extension-biased activity that promotes disc nutrition and nerve mobility.', focus:'Extension-biased loading promotes disc nutrition and neural mobility', diagram:'walking'},
        {icon:'🔄', name:'Neural Flossing (sciatic nerve)', sets:'2x10 gentle glides', desc:'Sciatic nerve mobilization to reduce neural adhesion — stop if symptoms worsen.', focus:'Mobilise sciatic nerve to reduce adhesion and restore neural glide', diagram:'nerve_floss_supine'},
        {icon:'💪', name:'Dead Bug (core stabilization)', sets:'3x8 each side', desc:'Deep core stability in lumbar-neutral position to protect recovering disc.', focus:'Activate deep core stabilisers in lumbar-neutral without spinal loading', diagram:'dead_bug'}
      ]
    },
    {
      name: 'Lumbar Spinal Stenosis (Spinal Narrowing)',
      ageNote: 'Typically >60 years; prevalence 47.2% in >60 years vs 20% in <40 years',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Neurogenic claudication')) score+=5;
        if(s.has('Bilateral leg symptoms')) score+=3;
        if(s.has('Numbness')||s.has('Tingling')||s.has('Paresthesias (dermatomal)')) score+=2;
        if(s.has('Weakness (lower extremity)')) score+=1;
        if(a.has('Prolonged walking')||a.has('Prolonged standing')) score+=3;
        if(a.has('Bending backward (extension)')) score+=3;
        if(al.has('Sitting')||al.has('Bending forward')||al.has('Bending forward over shopping cart')) score+=4;
        // Penalties: extension relieving is the opposite of the stenosis pattern
        if(al.has('Extension / back bend')) score=Math.max(0,score-4);
        // Unilateral symptoms and young age are inconsistent with typical stenosis
        if(!s.has('Bilateral leg symptoms')&&!s.has('Neurogenic claudication')) score=Math.max(0,score-2);
        // Sharp focal pain uncommon in stenosis
        if(s.has('Sharp pain')&&!s.has('Neurogenic claudication')) score=Math.max(0,score-2);
        if(tests['Romberg Test']==='+') score+=2;
        if(tests['Gait Assessment (wide-based)']==='+') score+=3;
        if(tests['Vibration Sense (malleoli / great toe)']==='+') score+=2;
        if(age) {
          if(age >= 70) score+=5;
          else if(age >= 60) score+=4;
          else if(age >= 50) score+=2;
          else if(age < 40) score = Math.max(0, score - 2);
        }
        return score;
      },
      edu:'Lumbar spinal stenosis is the most common spinal surgery indication in adults over 65. The hallmark is neurogenic claudication — bilateral leg pain, heaviness, or paresthesias with walking or standing that relieves within minutes of sitting or flexing forward ("shopping cart sign"). Wide-based gait is associated with central canal compromise. Absence of pain while sitting is a commonly described feature of neurogenic claudication. Flexion-based PT, aquatic therapy, and stationary cycling are well-tolerated; refer if conservative management fails after 6–12 weeks.',
      exercises:[
        {icon:'🚲', name:'Recumbent / Stationary Cycling', sets:'15–20 min', desc:'Flexed spinal position maintains canal space while building cardiovascular endurance.', focus:'Flexed spine position maintains canal space while building endurance', diagram:'cycling'},
        {icon:'🧘', name:'Lumbar Flexion in Lying (knees to chest)', sets:'3x10 reps', desc:'Gentle canal-opening flexion exercise in unloaded position.', focus:'Open posterior spinal canal and relieve neurogenic claudication', diagram:'knees_to_chest'},
        {icon:'💺', name:'Seated Forward Lean', sets:'3x30 sec', desc:'Opens the spinal canal and relieves neurogenic claudication during daily activities.', focus:'Decompress lumbar canal in weight-bearing position for daily activity', diagram:'seated_lean'},
        {icon:'🦵', name:'Aquatic Walking / Pool Therapy', sets:'20–30 min', desc:'Buoyancy reduces spinal load — ideal for patients limited by claudication on land.', focus:'Reduce joint load while maintaining aerobic and movement conditioning', diagram:'walking'}
      ]
    },
    {
      name: 'Lumbar Radiculopathy (Sciatica)',
      ageNote: 'Prevalence 3–5% of population; peak varies — disc herniation 30–50 years, stenosis >60 years',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Leg pain greater than back pain')) score+=5;
        if(s.has('Radiating pain (leg)')||s.has('Paresthesias (dermatomal)')) score+=3;
        if(s.has('Numbness')||s.has('Tingling')) score+=2;
        if(s.has('Weakness (lower extremity)')) score+=2;
        if(a.has('Prolonged sitting')||a.has('Sneezing / coughing (Valsalva)')) score+=2;
        if(al.has('Position changes')||al.has('Walking')) score+=1;
        // Penalties: purely local back pain without leg symptoms is not radiculopathy
        if(!s.has('Radiating pain (leg)')&&!s.has('Leg pain greater than back pain')&&!s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-4);
        // Bilateral leg symptoms suggest stenosis or cauda equina, not simple radiculopathy
        if(s.has('Bilateral leg symptoms')) score=Math.max(0,score-2);
        // Sitting relieving is atypical for L4/L5/S1 radiculopathy
        if(al.has('Sitting')) score=Math.max(0,score-2);
        if(tests['SLR — Ipsilateral (straight leg raise)']==='+') score+=4;
        if(tests['Slump Test']==='+') score+=3;
        if(tests['Dermatomal Sensory Testing']==='+') score+=3;
        return score;
      },
      edu:'Lumbar radiculopathy is defined by leg pain in a dermatomal distribution, typically greater than back pain. It results from nerve root compression (most commonly L4/L5/S1) due to disc herniation or stenosis. Key neurological findings by level: L4 (medial leg/foot, quad weakness, reduced patellar reflex), L5 (dorsum of foot, EHL weakness), S1 (lateral foot/heel, plantar flexion weakness, reduced Achilles reflex). Neurodynamic mobilization, directional preference exercises, and nerve root-specific motor re-education are cornerstones of treatment.',
      exercises:[
        {icon:'🔄', name:'Neural Flossing — Sciatic (L4/L5/S1)', sets:'2x10 gentle glides', desc:'Nerve mobilization — use sliding technique (not tensioning) acutely to avoid aggravation.', focus:'Mobilise sciatic nerve at the appropriate spinal level', diagram:'nerve_floss_supine'},
        {icon:'🔄', name:'Neural Flossing — Femoral (L2/L3/L4)', sets:'2x10 gentle glides', desc:'For anterior thigh/knee symptoms — prone knee bend with hip extension.', focus:'Mobilise femoral nerve for anterior thigh and knee symptoms', diagram:'nerve_floss_prone'},
        {icon:'💪', name:'Level-Specific Motor Re-education', sets:'3x15 target muscle', desc:'L4: quad sets; L5: toe extension; S1: calf raises — targeted to weak myotome.', focus:'Target the specific weak myotome with isolated motor exercises matched to nerve root level', diagram:'walking'},
        {icon:'🧘', name:'Directional Preference Exercise (McKenzie)', sets:'3x10 reps', desc:'Extension or flexion bias based on centralization response — individualize to patient.', focus:'Exploit centralisation direction to reduce discogenic loading', diagram:'prone_press_up'}
      ]
    },
    {
      name: 'Sacroiliac Joint Dysfunction (SIJ Pain)',
      ageNote: 'Any age; more common in women, especially postpartum',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Unilateral buttock pain')||s.has('Posterior pelvic pain')) score+=4;
        if(s.has('Deep ache')) score+=1;
        // SIJ pain rarely goes below knee — penalize if distal leg symptoms dominate
        if(s.has('Leg pain greater than back pain')) score = Math.max(0, score - 2);
        // SIJ pain doesn't produce neurogenic symptoms — penalise if present
        if(s.has('Paresthesias (dermatomal)')||s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-3);
        // Neurogenic claudication (walking-induced bilateral leg pain) points to stenosis
        if(s.has('Neurogenic claudication')) score=Math.max(0,score-3);
        // Bilateral leg symptoms uncommon with SIJ dysfunction
        if(s.has('Bilateral leg symptoms')) score=Math.max(0,score-3);
        if(a.has('Standing on one leg')||a.has('Transitional movements (sit-to-stand)')) score+=3;
        if(a.has('Prolonged sitting')||a.has('Stair climbing')) score+=2;
        if(al.has('Avoiding asymmetric loading')||al.has('Rest')) score+=2;
        // SI cluster — ≥3 positive tests significantly increases diagnostic probability
        const siTests = [
          tests['SI Provocation — Distraction'],
          tests['SI Provocation — Compression'],
          tests['SI Provocation — Thigh Thrust'],
          tests['SI Provocation — Gaenslen\'s Test'],
          tests['SI Provocation — Sacral Thrust'],
          tests['FABER Test (Patrick\'s)']
        ].filter(t => t === '+').length;
        if(siTests >= 3) score+=6;
        else if(siTests === 2) score+=3;
        else if(siTests === 1) score+=1;
        if(sex === 'female') score+=2;
        // SIJ pain is mechanical — centrally-mediated neurogenic symptoms strongly suggest radiculopathy or stenosis
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        // Anterior groin pain or anterior thigh pain uncommon in SIJ — suggests hip or lumbar origin
        if(s.has('Groin pain')||s.has('Anterior thigh pain')) score=Math.max(0,score-2);
        // Bilateral symmetrical symptoms are atypical for SIJ — suggest lumbar or central cause
        if(s.has('Bilateral leg symptoms')&&!s.has('Unilateral buttock pain')) score=Math.max(0,score-2);
        return score;
      },
      edu:'SI joint dysfunction causes unilateral buttock and posterior pelvic pain that rarely radiates below the knee (distinguishing it from radiculopathy). Pain with weight-bearing on the affected side and transitional movements (sit-to-stand) are characteristic. Diagnosis requires ≥3 positive SI provocation tests from the cluster (distraction, compression, thigh thrust, Gaenslen\'s, sacral thrust) — a single positive test is insufficient. The thigh thrust is considered the most clinically informative single test from the SI provocation cluster. Treatment includes lumbopelvic stabilization, SIJ manipulation, and postpartum pelvic girdle rehabilitation.',
      exercises:[
        {icon:'🌉', name:'Glute Bridges (bilateral → single leg progression)', sets:'3x15 reps', desc:'Posterior chain activation and lumbopelvic stability — cornerstone of SIJ rehab.', focus:'Progress posterior chain loading from bilateral to single-leg control', diagram:'bridge'},
        {icon:'💪', name:'Clamshells / Hip Abduction', sets:'3x15 each side', desc:'Gluteus medius strengthening to reduce asymmetric pelvic loading.', focus:'Strengthen gluteus medius to reduce asymmetric pelvic loading', diagram:'clamshell'},
        {icon:'🧘', name:'Active SIJ Self-Mobilization', sets:'3x10 reps', desc:'Supine posterior rotation technique to restore SIJ mobility.', focus:'Restore posterior rotation mobility at the sacroiliac joint', diagram:'bridge'},
        {icon:'🦵', name:'Single Leg Balance Progression', sets:'3x30 sec each leg', desc:'Proprioception and lumbopelvic stability — progress to dynamic surfaces.', focus:'Restore proprioception and single-leg control critical for ankle stability', diagram:'single_leg_balance'}
      ]
    },
    {
      name: 'Lumbar Instability (Unstable Lower Back)',
      ageNote: 'Variable age; may be associated with spondylolisthesis or degenerative changes',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Giving way / instability')) score+=5;
        if(s.has('Pain with transitional movements')) score+=4;
        if(s.has('Deep ache')||s.has('Muscle spasm / guarding')) score+=1;
        if(a.has('Activities requiring dynamic spinal control')||a.has('Repetitive movements')||a.has('Lifting')) score+=2;
        if(a.has('Transitional movements (sit-to-stand)')) score+=2;
        if(al.has('Lumbar support / brace')||al.has('Core stabilization')) score+=3;
        if(tests['Prone Instability Test']==='+') score+=4;
        // Penalties: neurogenic symptoms point elsewhere
        if(s.has('Neurogenic claudication')||s.has('Bilateral leg symptoms')) score=Math.max(0,score-3);
        if(s.has('Paresthesias (dermatomal)')||s.has('Radiating pain (leg)')) score=Math.max(0,score-2);
        // Morning stiffness suggests OA or inflammatory, not instability
        if(s.has('Morning stiffness (<30 min)')) score=Math.max(0,score-2);
        if(tests['Aberrant Movement Pattern Observation']==='+') score+=4;
        return score;
      },
      edu:'Lumbar instability is characterized by a "giving way" sensation, pain with movement transitions, and aberrant movement patterns (painful arc, lateral shift, Gower\'s sign). It may be associated with spondylolisthesis or degenerative changes. The prone instability test helps differentiate — pain reproduced in prone that resolves when the patient activates their muscles suggests instability. Core stabilization targeting the transversus abdominis and multifidus is the primary treatment.',
      exercises:[
        {icon:'💪', name:'Transversus Abdominis Activation', sets:'3x10, 10 sec hold', desc:'Foundation of lumbar stabilization — "drawing in" in neutral spinal position.', focus:'Activate the primary segmental spinal stabiliser before functional loading', diagram:'dead_bug'},
        {icon:'🌉', name:'Multifidus Co-Contraction (bird-dog)', sets:'3x8 each side, 5 sec hold', desc:'Deep segmental stabilizer activation — progress to dynamic with limb loading.', focus:'Co-activate multifidus and contralateral glute for segmental stability', diagram:'bird_dog'},
        {icon:'🧘', name:'Side Plank Progression', sets:'3x20–45 sec', desc:'Lateral core stability to control frontal plane instability.', focus:'Develop lateral core stability to control frontal plane loading', diagram:'side_plank'},
        {icon:'🦵', name:'Functional Movement Retraining', sets:'3x10 reps', desc:'Sit-to-stand, step training, and lifting mechanics — addresses provocative transitional movements.', focus:'Retrain sit-to-stand and lifting mechanics to reduce provocative loading', diagram:'squat'}
      ]
    },
    {
      name: 'Lumbar Osteoarthritis / Degenerative Joint Disease',
      ageNote: 'Increases with age; more common >45 years',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Deep ache')||s.has('Diffuse axial low back pain')) score+=3;
        if(s.has('Morning stiffness (<30 min)')) score+=3;
        if(s.has('Stiffness')) score+=2;
        // No radicular symptoms
        if(!s.has('Radiating pain (leg)') && !s.has('Leg pain greater than back pain')) score+=2;
        // Penalties: radicular features suggest disc or nerve pathology
        if(s.has('Radiating pain (leg)')||s.has('Leg pain greater than back pain')) score=Math.max(0,score-3);
        if(s.has('Neurogenic claudication')) score=Math.max(0,score-2);
        // OA pain is mechanical, not neurological
        if(s.has('Paresthesias (dermatomal)')||s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-3);
        if(a.has('Weight-bearing activities')||a.has('Prolonged standing')) score+=2;
        if(a.has('Bending backward (extension)')||a.has('Rotation / twisting')) score+=2;
        if(al.has('Rest')||al.has('Heat')) score+=2;
        if(tests['Spring Test (posterior-anterior pressure)']==='+') score+=2;
        if(age) {
          if(age >= 65) score+=4;
          else if(age >= 55) score+=3;
          else if(age >= 45) score+=2;
          else if(age < 40) score = Math.max(0, score - 2);
        }
        return score;
      },
      edu:'Lumbar osteoarthritis involves degeneration of the facet joints and intervertebral discs. Morning stiffness lasting less than 30 minutes, axial back pain worsening with activity, and reduced extension/rotation are characteristic. Imaging typically shows degenerative changes but must correlate clinically — degeneration on MRI is common in asymptomatic adults. Exercise therapy (aquatic, cycling, strengthening) is the most evidence-based treatment; activity modification and load management are key.',
      exercises:[
        {icon:'🚲', name:'Stationary Cycling', sets:'15–20 min, low resistance', desc:'Joint-friendly aerobic exercise that maintains lumbar mobility without impact loading.', focus:'Low-impact aerobic activity that avoids provocative extension or impact', diagram:'cycling'},
        {icon:'🌀', name:'Cat-Cow Mobilization', sets:'3x10 reps', desc:'Controlled lumbar mobility through available range — reduces stiffness.', focus:'Restore thoracic and lumbar mobility through gentle reciprocal movement', diagram:'cat_cow'},
        {icon:'💪', name:'Core Strengthening (plank progression)', sets:'3x20–45 sec', desc:'Spinal support without excessive extension loading.', focus:'Build global spinal stiffness and anterior core endurance', diagram:'plank'},
        {icon:'🧘', name:'Aquatic Walking / Hydrotherapy', sets:'20–30 min', desc:'Buoyancy reduces spinal compressive load — ideal for activity-limited patients.', focus:'Offload spinal structures while maintaining aerobic conditioning', diagram:'walking'}
      ]
    },
    {
      name: 'Chronic Non-Specific Low Back Pain (Chronic Back Pain)',
      ageNote: 'Peak 40–69 years; more common in women (40.6% vs 37.2% in men); 84% lifetime prevalence',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Diffuse axial low back pain')) score+=4;
        if(s.has('Deep ache')||s.has('Stiffness')||s.has('Muscle spasm / guarding')) score+=2;
        // Non-specific: no radicular or instability features
        if(!s.has('Leg pain greater than back pain') && !s.has('Radiating pain (leg)') && !s.has('Neurogenic claudication') && !s.has('Giving way / instability')) score+=3;
        if(a.has('Prolonged sitting')||a.has('Prolonged standing')||a.has('Bending forward (flexion)')) score+=2;
        if(al.has('Rest')||al.has('Position changes')||al.has('Activity modification')) score+=2;
        // Diagnosis of exclusion — penalize if specific tests positive
        // Penalties: any specific diagnostic features exclude non-specific diagnosis
        if(s.has('Neurogenic claudication')||s.has('Bilateral leg symptoms')) score=Math.max(0,score-4);
        if(s.has('Radiating pain (leg)')||s.has('Leg pain greater than back pain')) score=Math.max(0,score-3);
        if(s.has('Night pain')||s.has('Pain at rest')) score=Math.max(0,score-3);
        if(tests['SLR — Ipsilateral (straight leg raise)']==='+') score = Math.max(0, score - 3);
        if(tests['SI Provocation — Thigh Thrust']==='+') score = Math.max(0, score - 2);
        if(tests['Prone Instability Test']==='+') score = Math.max(0, score - 2);
        if(age) {
          if(age >= 40 && age <= 69) score+=2;
        }
        if(sex === 'female') score+=1;
        // Penalties: lateral knee pain is not consistent with pes anserine (medial-distal)
        if(s.has('Lateral knee pain')&&!s.has('Medial knee pain')) score=Math.max(0,score-4);
        // Locking/catching suggests meniscal pathology, not bursitis
        if(s.has('Locking')||s.has('Catching sensation')) score=Math.max(0,score-3);
        // Instability/giving way is not a feature of pes anserine bursitis
        if(s.has('Giving way/instability')) score=Math.max(0,score-2);
        // Penalties: local neck pain without arm symptoms makes TOS unlikely
        if(!s.has('Numbness')&&!s.has('Tingling')&&!s.has('Arm fatigue')&&!s.has('Weakness (upper extremity)')) score=Math.max(0,score-4);
        // Chest wall pain and breathing symptoms suggest rib/costochondral, not TOS
        if(s.has('Sharp pain with breathing')||s.has('Chest wall pain')) score=Math.max(0,score-3);
        // Isolated headache without arm symptoms is not TOS
        if(s.has('Headache (unilateral)')&&!s.has('Arm fatigue')&&!s.has('Numbness')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Non-specific LBP is a diagnosis of exclusion after ruling out red flags (malignancy, fracture, infection, cauda equina) and specific pathology. It represents the large majority of low back pain presentations. Pain is diffuse, difficult to localize, without radicular or neurological features. Biopsychosocial factors (fear-avoidance, catastrophizing, sleep, work demands) are major contributors to chronicity. Active rehabilitation, graded exposure, pain education, and addressing psychosocial factors are strongly supported as first-line interventions — passive modalities alone are insufficient.',
      exercises:[
        {icon:'🚶', name:'Graded Walking Program', sets:'Start 10 min, progress by 5 min/week', desc:'Most evidence-based aerobic intervention for non-specific LBP — reduces pain and disability.', focus:'Graduated aerobic stimulus improves spinal endurance and pain tolerance', diagram:'walking'},
        {icon:'💪', name:'General Strengthening (deadlift progression)', sets:'3x10 reps, progressive load', desc:'Hip-hinge and posterior chain strengthening — reduces LBP recurrence.', focus:'Progressive posterior chain loading to build tensile capacity', diagram:'deadlift'},
        {icon:'🧘', name:'Pain Neuroscience Education', sets:'1–2 sessions', desc:'Reconceptualizing pain as a protective response — reduces fear-avoidance and catastrophizing.', focus:'Reconceptualise pain as modifiable neural sensitivity rather than tissue damage', diagram:'walking'},
        {icon:'🌀', name:'Yoga / Mind-Body Movement', sets:'2–3x/week', desc:'Combines mobility, strengthening, and relaxation — strong evidence for chronic LBP.', focus:'Combine mobility, breath control, and relaxation to modulate pain', diagram:'cat_cow'}
      ]
    }
    ,{
      name: 'Sciatica (Lumbar Radiculopathy / Nerve Pain Down the Leg)',
      ageNote: 'Peak 40–60 years; affects ~5% of people at some point; disc herniation is the most common cause under 50',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Radiating pain (leg)')||s.has('Leg pain greater than back pain')) score+=5;
        if(s.has('Sciatica / burning pain down leg')) score+=5;
        if(s.has('Burning')||s.has('Paresthesias (dermatomal)')) score+=3;
        if(s.has('Numbness')||s.has('Tingling')) score+=2;
        if(s.has('Weakness (lower extremity)')) score+=2;
        if(a.has('Prolonged sitting')||a.has('Sneezing / coughing (Valsalva)')) score+=2;
        if(al.has('Walking')||al.has('Position changes')) score+=1;
        // Penalties: purely local pain without radiating component is not sciatica
        if(!s.has('Radiating pain (leg)')&&!s.has('Leg pain greater than back pain')&&!s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-5);
        // Extension/walking relieving suggests stenosis not disc-driven sciatica
        if(al.has('Extension / back bend')) score=Math.max(0,score-2);
        // Pain concentrated in lower back only without leg component is not sciatica
        if(s.has('Diffuse axial low back pain')&&!s.has('Radiating pain (leg)')) score=Math.max(0,score-3);
        if(tests['SLR — Ipsilateral (straight leg raise)']==='+') score+=4;
        if(tests['Slump Test']==='+') score+=3;
        if(tests['Dermatomal Sensory Testing']==='+') score+=3;
        return score;
      },
      edu:'Sciatica is the common name for lumbar radiculopathy — pain, numbness, or tingling that travels from the lower back down the leg along the sciatic nerve path. The most common cause is a disc herniation pressing on a nerve root (L4, L5, or S1). Key features: leg pain greater than back pain, burning or electric quality, and reproduction with nerve tension tests (SLR, Slump). The good news is that most sciatica resolves within 6–12 weeks with the right management. Staying gently active, avoiding prolonged sitting, and nerve mobilisation exercises are first-line treatment. Surgery is rarely needed.',
      exercises:[
        {icon:'🔄', name:'Neural Flossing — Sciatic (L4/L5/S1)', sets:'2x10 gentle glides', desc:'Nerve mobilisation — use sliding technique to reduce neural tension without aggravation.', focus:'Mobilise sciatic nerve to reduce adhesion and restore neural glide', diagram:'nerve_floss_supine'},
        {icon:'💪', name:'McKenzie Extension Press-Ups', sets:'3x10 reps', desc:'Centralisation strategy — if symptoms move toward the back (centralise), continue. Stop if they peripheralise.', focus:'Centralise disc material posteriorly and restore extension range', diagram:'prone_press_up'},
        {icon:'🌉', name:'Walking Program', sets:'20–30 min/day', desc:'Best general activity for sciatica — extension-biased movement promotes nerve healing.', focus:'Extension-biased loading promotes disc nutrition and neural mobility', diagram:'walking'},
        {icon:'🧘', name:'Dead Bug (core stabilization)', sets:'3x8 each side', desc:'Deep core stability in lumbar-neutral to protect recovering disc.', focus:'Activate deep core stabilisers in lumbar-neutral without spinal loading', diagram:'dead_bug'}
      ]
    }
  ],
  pelvis: [
    {
      name: 'Hip Osteoarthritis',
      ageNote: '>45 years; more common in women; prevalence increases with age',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Deep groin pain')||s.has('Anterior hip / groin pain')) score+=4;
        if(s.has('Morning stiffness (<30 min)')) score+=3;
        if(s.has('Stiffness')||s.has('Deep ache')) score+=2;
        if(s.has('Referred pain to thigh')||s.has('Referred pain to knee')) score+=1;
        if(a.has('Walking / ambulation')||a.has('Ascending stairs')) score+=2;
        if(a.has('End-range hip movements')||a.has('Transitional movements (sit-to-stand)')) score+=2;
        if(al.has('Rest')||al.has('Non-weight-bearing')) score+=2;
        // Penalties: neurological symptoms are not features of hip OA
        if(s.has('Sciatica / burning pain down leg')||s.has('Numbness / tingling (thigh)')) score=Math.max(0,score-4);
        if(s.has('Paresthesias (dermatomal)')||s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-3);
        // Lateral hip pain is more consistent with gluteal tendinopathy/GTPS
        if(s.has('Lateral hip pain')&&!s.has('Deep groin pain')) score=Math.max(0,score-3);
        // Posterior buttock pain without groin pain is more consistent with SIJ or piriformis
        if(s.has('Posterior hip pain / buttock')&&!s.has('Deep groin pain')&&!s.has('Anterior hip / groin pain')) score=Math.max(0,score-3);
        // Clicking/catching without stiffness is more consistent with labral tear
        if(s.has('Clicking / snapping (hip)')&&!s.has('Morning stiffness (<30 min)')) score=Math.max(0,score-2);
        if(tests['Squat Test']==='+') score+=4;
        if(tests['Passive Hip Adduction (range & pain)']==='+') score+=3;
        if(tests['FABER Test (Patrick\'s)']==='+') score+=2;
        if(tests['Log Roll Test']==='+') score+=2;
        // ≥4 positive findings from the clinical cluster increases pattern consistency
        const oaFindings = [tests['Squat Test'], tests['Passive Hip Adduction (range & pain)'], tests['FABER Test (Patrick\'s)'], tests['Log Roll Test'], tests['Hip Scour Test']].filter(t=>t==='+').length;
        if(oaFindings >= 4) score+=5;
        if(age) {
          if(age >= 65) score+=4;
          else if(age >= 55) score+=3;
          else if(age >= 45) score+=2;
          else if(age < 40) score=Math.max(0,score-3);
        }
        if(sex==='female') score+=1;
        // Penalties: focal point tenderness with rest/night pain = stress fracture not MTSS
        if(s.has('Night pain')&&s.has('Pain at rest')) score=Math.max(0,score-4);
        // Neurological symptoms suggest tarsal tunnel or lumbar pathology
        if(s.has('Numbness')||s.has('Tingling / electrical sensations')||s.has('Burning pain')) score=Math.max(0,score-3);
        // Calf pain (not shin) = calf strain
        if(s.has('Calf pain')&&!s.has('Medial leg / shin pain')) score=Math.max(0,score-4);
        // Penalties: lateral ankle pain is peroneal/ATFL territory, not PTTD
        if(s.has('Lateral ankle pain')&&!s.has('Medial ankle pain')) score=Math.max(0,score-4);
        // Neurological symptoms suggest tarsal tunnel, not PTTD
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        // Acute onset with bruising suggests sprain, not PTTD (which is insidious)
        if(s.has('Bruising / ecchymosis')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Hip OA presents with deep groin pain, morning stiffness under 30 minutes, and progressive loss of internal rotation and adduction (the earliest and most restricted motions). The squat test and decreased passive adduction are among the most clinically informative findings; a cluster of positive clinical findings increases pattern consistency with hip OA. Exercise therapy (strengthening, aquatic, cycling) is well-supported by evidence; total hip replacement is highly effective when conservative management fails.',
      exercises:[
        {icon:'🚲', name:'Stationary Cycling (raised seat)', sets:'15–20 min, low resistance', desc:'Joint-friendly aerobic exercise — maintains hip ROM and builds quad/glute strength.', focus:'Raised saddle reduces hip flexion angle to protect tendon compression', diagram:'cycling'},
        {icon:'💪', name:'Hip Abductor Strengthening (sidelying)', sets:'3x15 each side', desc:'Reduces joint loading forces and compensatory Trendelenburg gait.', focus:'Isolate gluteus medius activation without compressive hip adduction', diagram:'clamshell'},
        {icon:'🌉', name:'Glute Bridges', sets:'3x15 reps', desc:'Hip extensor activation with minimal joint compressive load.', focus:'Activate gluteus maximus and stabilise the lumbopelvic region', diagram:'bridge'},
        {icon:'🧘', name:'Aquatic Walking / Hydrotherapy', sets:'20–30 min', desc:'Buoyancy reduces hip compressive load — ideal for activity-limited patients.', focus:'Offload spinal structures while maintaining aerobic conditioning', diagram:'walking'}
      ]
    },
    {
      name: 'Hip Labral Tear',
      ageNote: 'Young athletes 20–40 years; associated with sports requiring hip rotation',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior hip / groin pain')||s.has('Deep groin pain')) score+=3;
        if(s.has('Clicking / snapping (hip)')||s.has('Locking / catching sensation')) score+=4;
        if(s.has('Giving way')) score+=2;
        if(a.has('Pivoting / rotation')||a.has('Deep squatting')) score+=3;
        if(a.has('Prolonged sitting (>30 min)')||a.has('Hip flexion activities')) score+=2;
        if(al.has('Rest')||al.has('Avoiding deep hip flexion')) score+=2;
        // Penalties: FAI is a structural joint condition — no neurological features
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-4);
        // Lateral hip pain (not groin) suggests GTPS
        if(s.has('Lateral hip pain')&&!s.has('Deep groin pain')&&!s.has('Anterior hip / groin pain')) score=Math.max(0,score-3);
        // Night pain at rest more consistent with OA or fracture
        if(s.has('Night pain')&&!s.has('Deep groin pain')) score=Math.max(0,score-2);
        // Penalties: OA features suggest degenerative diagnosis instead
        if(s.has('Morning stiffness (>30 min)')) score=Math.max(0,score-3);
        if(s.has('Bony enlargement')) score=Math.max(0,score-3);
        // Lateral hip pain is more consistent with GTPS
        if(s.has('Lateral hip pain')&&!s.has('Deep groin pain')) score=Math.max(0,score-3);
        // Neurological features point away from labral tear
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-3);
        if(tests['FADIR Test']==='+') score+=4;
        if(tests['Arlington / Anterior Impingement Test (AIT)']==='+') score+=5;
        if(tests['FABER Test (Patrick\'s)']==='+') score+=3;
        if(tests['Arlington / Anterior Impingement Test (AIT)']==='+' && tests['FABER Test (Patrick\'s)']==='+') score+=4;
        if(age) {
          if(age >= 18 && age <= 40) score+=3;
          else if(age >= 41 && age <= 50) score+=1;
          else if(age > 55) score=Math.max(0,score-2);
        }
        return score;
      },
      edu:'Hip labral tears commonly present with anterior groin pain, a "C-sign," and mechanical symptoms (clicking, catching, locking). The Arlington Impingement Test is a commonly used provocative test associated with anterior labral pathology; combining it with a positive FABER test increases pattern consistency with labral involvement. MR arthrography is the preferred imaging investigation for diagnosis confirmation. Conservative PT (hip stabilizer strengthening, movement retraining, activity modification) is first-line; surgical labral repair is considered after 3–6 months failed conservative management.',
      exercises:[
        {icon:'💪', name:'Hip Stabilizer Strengthening (ABD, ER)', sets:'3x15 each', desc:'Reduces abnormal femoral translation that stresses the labrum.', focus:'Comprehensively load the lateral hip stabiliser complex', diagram:'clamshell'},
        {icon:'🧘', name:'Movement Pattern Retraining', sets:'3x10 functional reps', desc:'Hip hinge and squat mechanics — avoid hip adduction/IR loading pattern.', focus:'Correct biomechanical faults amplifying load on the injured structure', diagram:'squat'},
        {icon:'🌉', name:'Glute Bridges → Single Leg Progression', sets:'3x15 → 3x10 SL', desc:'Progressive posterior chain loading in non-provocative range.', focus:'Advance posterior chain loading to replicate single-leg stance demands', diagram:'bridge'},
        {icon:'🚲', name:'Stationary Cycling (raised seat)', sets:'15 min', desc:'Aerobic conditioning with reduced impingement range exposure.', focus:'Raised saddle reduces hip flexion angle to protect tendon compression', diagram:'cycling'}
      ]
    },
    {
      name: 'Femoroacetabular Impingement (Hip Impingement)',
      ageNote: 'Young, athletic patients; gradual onset; history of SCFE or DDH increases risk',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Deep groin pain')||s.has('Anterior hip / groin pain')) score+=3;
        if(s.has('Stiffness')) score+=2;
        if(a.has('Hip flexion activities')||a.has('Prolonged sitting (>30 min)')) score+=3;
        if(a.has('Pivoting / rotation')||a.has('Deep squatting')) score+=3;
        if(al.has('Rest')||al.has('Avoiding deep hip flexion')) score+=2;
        if(tests['FADIR Test']==='+') score+=5;
        if(tests['FABER Test (Patrick\'s)']==='+') score+=3;
        if(tests['Restricted IR at 90° hip flexion']==='+') score+=4; // best to rule in
        if(age) {
          if(age >= 16 && age <= 40) score+=3;
          else if(age >= 41 && age <= 50) score+=1;
          else if(age > 55) score=Math.max(0,score-2);
        }
        return score;
      },
      edu:'FAI results from abnormal bony morphology (cam = femoral head asphericity; pincer = acetabular overcoverage) causing mechanical impingement during hip flexion and rotation. The FADIR test is the best screening tool — its absence helps rule out FAI. Restricted IR at 90° hip flexion is the best single clinical finding to rule in FAI; loss of IR in neutral is more indicative of hip OA. Conservative PT is first-line; surgical FAI correction (arthroscopic osteoplasty) is considered after 3–6 months failed conservative management.',
      exercises:[
        {icon:'💪', name:'Hip Abductor & ER Strengthening', sets:'3x15 each direction', desc:'Reduces femoral adduction/IR during dynamic activities — decreases impingement forces.', focus:'Strengthen the primary stabilisers of the lateral hip complex', diagram:'clamshell'},
        {icon:'🧘', name:'Hip Mobility (pain-free range only)', sets:'2x10 each direction', desc:'Maintain available ROM without provoking impingement at end range.', focus:'Maintain hip joint mobility within the non-impinging range', diagram:'hip_circles'},
        {icon:'🌉', name:'Glute Bridges (neutral hip position)', sets:'3x15 reps', desc:'Hip extensor activation avoiding provocative end-range flexion.', focus:'Activate gluteal tendons without compressive hip adduction', diagram:'bridge'},
        {icon:'🔄', name:'Movement Retraining (avoid adduction/IR)', sets:'3x10 functional reps', desc:'Correct Trendelenburg and hip adduction pattern during gait and stairs.', focus:'Correct compressive hip positions during functional movements', diagram:'squat'}
      ]
    },
    {
      name: 'Hip Flexor Strain',
      ageNote: 'Any age; athletes; overuse or acute eccentric injury',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior hip / groin pain')) score+=3;
        if(s.has('Deep groin pain')) score+=2;
        if(s.has('Ecchymosis (acute)')) score+=3;
        if(a.has('Hip flexion activities')||a.has('Kicking')||a.has('Running / sprinting')) score+=4;
        if(al.has('Rest')||al.has('Avoiding deep hip flexion')) score+=3;
        if(tests['Resisted Hip Flexion (seated)']==='+') score+=4;
        if(tests['Passive Hip Extension (stretch)']==='+') score+=3;
        if(tests['Thomas Test']==='+') score+=2;
        // Differentiate from tendinopathy: acute onset, possible ecchymosis
        if(s.has('Ecchymosis (acute)')||s.has('Antalgic gait')) score+=2;
        // Penalties: insidious onset, bilateral symptoms, or neurological features exclude strain
        if(s.has('Lateral hip pain')||s.has('Posterior hip pain / buttock')) score=Math.max(0,score-3);
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-3);
        // Morning stiffness suggests degenerative/inflammatory cause
        if(s.has('Morning stiffness (<30 min)')||s.has('Morning stiffness (>30 min)')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Hip flexor strains involve the iliopsoas or rectus femoris and present with acute anterior groin pain, tenderness over the ASIS/AIIS or pubic symphysis, and pain with resisted hip flexion or passive extension. Ecchymosis indicates a higher-grade tear. Acute management includes relative rest, ice, and gentle ROM; rehabilitation progresses through isometric → isotonic → sport-specific loading.',
      exercises:[
        {icon:'🧘', name:'Gentle Hip Flexor Stretching (when pain allows)', sets:'Hold 20 sec x3 each', desc:'Begin gentle stretching once acute inflammation settles — avoid aggressive stretch early.', focus:'Restore hip flexor length without provoking psoas attachment irritation', diagram:'hip_flexor_stretch'},
        {icon:'💪', name:'Isometric Hip Flexion (seated)', sets:'5x10 sec holds', desc:'Early tendon/muscle loading — pain-free isometrics before progressing.', focus:'Initiate iliopsoas loading isometrically to reduce pain before dynamic movement', diagram:'seated_lean'},
        {icon:'🌀', name:'Progressive Hip Flexion Strengthening', sets:'3x15 reps, progressive load', desc:'Graded return to full hip flexion strength — isotonic when isometrics pain-free.', focus:'Systematically build hip flexor capacity for running and cutting demands', diagram:'seated_lean'},
        {icon:'🚶', name:'Graded Return to Running / Kicking', sets:'Progressive volume', desc:'Structured return to sport once full pain-free strength and ROM restored.', focus:'Graduated reintroduction of high-demand rotational activity', diagram:'walking'}
      ]
    },
    {
      name: 'Iliopsoas Tendinopathy',
      ageNote: 'Any age; athletes, dancers; insidious onset from repetitive hip flexion',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior hip / groin pain')||s.has('Deep groin pain')) score+=3;
        if(s.has('Groin tightness')) score+=2;
        // Insidious onset differentiates from strain
        if(!s.has('Ecchymosis (acute)')) score+=2;
        // Penalties: acute onset with ecchymosis = strain, not tendinopathy
        if(s.has('Ecchymosis (acute)')) score=Math.max(0,score-4);
        // Lateral or posterior pain patterns exclude iliopsoas
        if(s.has('Lateral hip pain')||s.has('Posterior hip pain / buttock')) score=Math.max(0,score-3);
        // Neurological features point to nerve root or piriformis
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-3);
        if(a.has('Running / sprinting')||a.has('Kicking')||a.has('Hip flexion activities')) score+=3;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        // Penalties: lateral/posterior hip pain is not consistent with adductor strain
        if(s.has('Lateral hip pain')||s.has('Posterior hip pain / buttock')) score=Math.max(0,score-3);
        if(s.has('Mid-buttock pain')) score=Math.max(0,score-3);
        // Neurological features point to nerve root, not adductor
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-3);
        if(tests['HEC Test (Hip Extension / External Rotation Compression)']==='+') score+=5;
        if(tests['Resisted Hip Flexion (seated)']==='+') score+=3;
        return score;
      },
      edu:'Iliopsoas tendinopathy presents with insidious anterior groin pain worsened by repetitive hip flexion activities (running, kicking, dancing). The HEC test is commonly used in clinical evaluation and is associated with iliopsoas pathology when positive — considered among the more informative tests for this presentation. Iliopsoas palpation at the lesser trochanter confirms local tenderness. Progressive tendon loading (isometric → isotonic → sport-specific) is the evidence-based treatment.',
      exercises:[
        {icon:'💪', name:'Isometric Hip Flexion Holds', sets:'5x45 sec, 70% effort', desc:'Pain-modulating isometrics — cornerstone of tendinopathy management.', focus:'Load the hip flexor isometrically as a pain-safe first stage of rehab', diagram:'seated_lean'},
        {icon:'🔄', name:'Isotonic Hip Flexion Progression (band/cable)', sets:'4x8 heavy slow resistance', desc:'Tendon remodeling loading — progress from isometrics when pain <3/10.', focus:'Progress iliopsoas loading dynamically once isometric pain is controlled', diagram:'seated_lean'},
        {icon:'🧘', name:'Hip Flexor Stretching (symptom-guided)', sets:'Hold 30 sec x3', desc:'Restore flexibility — avoid aggressive stretch in acute phase.', focus:'Maintain hip flexor length to reduce anterior pelvic tilt and impingement loading', diagram:'hip_flexor_stretch'},
        {icon:'🏃', name:'Graded Return to Running / Dance', sets:'Progressive volume and speed', desc:'Structured sport-specific loading once full pain-free strength achieved.', focus:'Graduated reintroduction of high-demand activity after groin or hip injury', diagram:'walking'}
      ]
    },
    {
      name: 'Hamstring Strain',
      ageNote: 'Athletes; acute injury with eccentric contraction (sprinting, kicking)',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Posterior hip pain / buttock')) score+=2;
        if(s.has('Ecchymosis (acute)')) score+=4;
        if(s.has('Weakness')) score+=2;
        if(a.has('Running / sprinting')||a.has('Kicking')) score+=4;
        if(al.has('Rest')||al.has('Non-weight-bearing')) score+=2;
        if(tests['Ischial Tuberosity Palpation']==='+') score+=3;
        if(tests['Resisted Knee Flexion (prone)']==='+') score+=4;
        // Active hamstring tests at 30° and 90° are key — negative helps rule out tendinopathy
        if(tests['Active Hamstring Test at 30°']==='+') score+=2;
        // Acute strain: pain with passive stretch
        if(s.has('Ecchymosis (acute)')||a.has('Running / sprinting')) score+=1;
        // Penalties: insidious onset sitting pain = proximal hamstring tendinopathy
        if(s.has('Pain with sitting >30 min')&&!s.has('Ecchymosis (acute)')) score=Math.max(0,score-3);
        // Groin or anterior hip pain suggests adductor or hip flexor, not hamstring
        if(s.has('Anterior hip / groin pain')||s.has('Deep groin pain')) score=Math.max(0,score-3);
        // Neurological symptoms suggest nerve root involvement
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Hamstring strains are the most common muscle injury in sprinting sports. They occur acutely with eccentric contraction during late swing phase sprinting. Ecchymosis and a palpable defect at the myotendinous junction or ischial tuberosity indicate higher-grade tears. Active knee extension deficit in prone is a useful functional indicator of severity. The Nordic hamstring curl is the most evidence-based prevention and rehabilitation exercise.',
      exercises:[
        {icon:'🧘', name:'Gentle Hamstring Stretch (pain-free range)', sets:'Hold 20 sec x3', desc:'Restore mobility gradually — avoid aggressive stretch in acute phase (grade II/III).', focus:'Maintain extensibility without provoking tendon compression at the ischium', diagram:'hamstring_stretch'},
        {icon:'💪', name:'Isometric Knee Flexion (prone)', sets:'5x10 sec holds', desc:'Early pain-free loading before progressing to isotonic exercises.', focus:'Load hamstring tendon isometrically before introducing dynamic movement', diagram:'prone_extension'},
        {icon:'🔄', name:'Nordic Hamstring Curl (eccentric)', sets:'3x6–8 reps (progressive)', desc:'Well-supported eccentric exercise associated with reduced hamstring re-injury risk in published rehabilitation literature.', focus:'Eccentric hamstring loading — most evidence-based re-injury prevention exercise', diagram:'nordic_curl'},
        {icon:'🏃', name:'Graded Return to Running Protocol', sets:'Progressive speed and volume', desc:'Structured sprint re-introduction — criterion-based, not time-based.', focus:'Graduated running progression to manage tendon load during return to sport', diagram:'walking'}
      ]
    },
    {
      name: 'Proximal Hamstring Tendinopathy',
      ageNote: 'Athletes; overuse with hip extension activities; runners and cyclists particularly affected',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Posterior hip pain / buttock')) score+=3;
        if(s.has('Pain with sitting >30 min')) score+=4;
        if(s.has('Deep ache')) score+=2;
        if(a.has('Running / sprinting')||a.has('Hill running')) score+=3;
        if(a.has('Sitting on hard surfaces')||a.has('Prolonged sitting (>30 min)')) score+=3;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        if(tests['Active Hamstring Test at 30°']==='+' && tests['Active Hamstring Test at 90°']==='+') score+=8;
        else if(tests['Active Hamstring Test at 30°']==='+') score+=4;
        else if(tests['Active Hamstring Test at 90°']==='+') score+=4;
        if(tests['Puranen-Orava Test']==='+') score+=3;
        // Penalties: acute onset with ecchymosis = strain, not tendinopathy
        if(s.has('Ecchymosis (acute)')) score=Math.max(0,score-4);
        // Anterior groin pain is not a feature of proximal hamstring tendinopathy
        if(s.has('Anterior hip / groin pain')||s.has('Deep groin pain')) score=Math.max(0,score-3);
        // Lateral hip pain suggests GTPS
        if(s.has('Lateral hip pain')) score=Math.max(0,score-3);
        // Neurological features distinguish from piriformis/lumbar cause
        if(s.has('Sciatica / burning pain down leg')&&!s.has('Pain with sitting >30 min')) score=Math.max(0,score-2);
        if(tests['Ischial Tuberosity Palpation']==='+') score+=3;
        return score;
      },
      edu:'Proximal hamstring tendinopathy presents with deep buttock pain at the ischial tuberosity, worsened by prolonged sitting, running, and hill work. The combined active hamstring test at 30° and 90° is well-supported in the literature and associated with proximal hamstring tendinopathy; restricted or painful findings at both angles increase pattern consistency with proximal tendon involvement. Compressive loads (sitting, hip flexion with knee extended) are the primary provocateur — must be managed during rehabilitation. Progressive tendon loading using the heavy slow resistance protocol is the evidence-based first-line treatment.',
      exercises:[
        {icon:'💪', name:'Isometric Hamstring Bridge (hip neutral)', sets:'5x45 sec holds', desc:'Initial pain-modulating tendon loading — avoid hip flexion that increases proximal tendon compression.', focus:'Load hamstring tendon isometrically to reduce pain and stimulate adaptation', diagram:'bridge'},
        {icon:'🌉', name:'Heavy Slow Resistance Deadlift Progression', sets:'4x8 reps, 3–4 sec tempo', desc:'Evidence-supported tendon remodeling — Romanian deadlift, progress to full deadlift.', focus:'Build posterior chain strength through the full kinetic chain', diagram:'deadlift'},
        {icon:'🧘', name:'Avoid Sustained Sitting Compression', sets:'Postural modification', desc:'Sit on padded surfaces, avoid end-range hip flexion — reduces tendon compression on ischium.', focus:'Reduce ischial tuberosity load by avoiding prolonged sitting on hard surfaces', diagram:'seated_lean'},
        {icon:'🏃', name:'Graded Return to Running (avoid hills early)', sets:'Progressive flat-surface volume', desc:'Flat running before hills — hill running markedly increases proximal hamstring tendon load.', focus:'Manage tissue load during return to running — hills increase eccentric demand', diagram:'walking'}
      ]
    },
    {
      name: 'Hip Adductor Tendinopathy / Strain',
      ageNote: 'Athletes; acute injury or overuse from kicking, cutting, and lateral movements',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Deep groin pain')||s.has('Anterior hip / groin pain')) score+=3;
        if(s.has('Ecchymosis (acute)')) score+=3; // grade II/III strain
        if(s.has('Antalgic gait')) score+=1;
        if(a.has('Kicking')||a.has('Cutting / lateral movements')) score+=4;
        if(a.has('Running / sprinting')) score+=2;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        if(tests['Adductor Squeeze Test (0° and 45°)']==='+') score+=5;
        if(tests['Pubic Tubercle / Rectus Insertion Palpation']==='+') score+=2;
        // Penalties: lateral/posterior hip pain inconsistent with adductor strain
        if(s.has('Lateral hip pain')||s.has('Posterior hip pain / buttock')) score=Math.max(0,score-3);
        if(s.has('Mid-buttock pain')) score=Math.max(0,score-3);
        // Neurological features point to nerve root, not adductor
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Adductor strains are the most common groin injury in field and ice sports, involving the adductor longus origin at the pubic symphysis. Pain is medial groin, reproduced by resisted adduction and tenderness at the adductor origin. The Copenhagen adductor exercise is the most evidence-based prevention and rehabilitation protocol (Hölmich protocol). Differentiate from athletic pubalgia by the absence of cross-body sit-up pain.',
      exercises:[
        {icon:'💪', name:'Copenhagen Adductor Exercise', sets:'3x8–12 reps', desc:'Evidence-supported eccentric adductor loading — a well-established exercise associated with reduced adductor strain recurrence.', focus:'High-demand adductor strengthening — best evidence for groin injury prevention', diagram:'copenhagen'},
        {icon:'🧘', name:'Isometric Adductor Squeeze (0° and 45°)', sets:'5x10 sec holds', desc:'Early phase pain-free loading before progressing to dynamic exercises.', focus:'Isometric loading immediately reduces adductor pain and begins adaptation', diagram:'adductor_squeeze'},
        {icon:'🌀', name:'Lateral Lunge / Skating Progression', sets:'3x10 reps', desc:'Sport-specific multiplanar loading for return-to-sport readiness.', focus:'Introduce lateral loading to challenge adductor and hip abductor capacity', diagram:'squat'},
        {icon:'🦵', name:'Adductor Flexibility (symptom-guided)', sets:'Hold 30 sec x3 each', desc:'Restore flexibility — progress as pain allows.', focus:'Restore adductor extensibility without provoking pubic or groin pain', diagram:'adductor_stretch'}
      ]
    },
    {
      name: 'Gluteal Tendinopathy (Hip Bursitis / Outer Hip Pain)',
      ageNote: 'Women 40–60 years; prevalence 10–25% in middle-aged women; BMI and running load are risk factors',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Lateral hip pain')) score+=5;
        if(s.has('Night pain')||s.has('Pain at rest')) score+=3;
        if(s.has('Pain with weight-bearing')) score+=2;
        if(a.has('Walking / ambulation')||a.has('Ascending stairs')) score+=2;
        if(a.has('Prolonged standing')||a.has('Standing on one leg')) score+=3;
        if(a.has('Hill running')||a.has('Increased training load')) score+=2;
        if(al.has('Rest')||al.has('Avoiding side-lying on affected hip')) score+=2;
        if(tests['Single Leg Stance Test (30 sec)']==='+') score+=6;
        if(tests['Resisted External Derotation Test']==='+') score+=4;
        if(tests['Greater Trochanter Palpation']==='+') score+=3;
        if(tests['Trendelenburg Test']==='+') score+=2;
        if(age) {
          if(age >= 40 && age <= 65) score+=3;
          else if(age < 30) score=Math.max(0,score-2);
        }
        if(sex==='female') score+=3;
        // Penalties: PGP is predominantly a female pregnancy-related condition
        if(sex==='male') score=Math.max(0,score-5);
        // Neurological features (dermatomal numbness/tingling) suggest lumbar not PGP
        if(s.has('Paresthesias (dermatomal)')||s.has('Numbness / tingling (thigh)')) score=Math.max(0,score-3);
        // Lateral or anterior hip pain not typical of PGP
        if(s.has('Lateral hip pain')||s.has('Anterior hip / groin pain')) score=Math.max(0,score-2);
        // Penalties: groin pain is not consistent with gluteal tendinopathy
        if(s.has('Deep groin pain')||s.has('Anterior hip / groin pain')) score=Math.max(0,score-3);
        // Neurological symptoms suggest nerve root or piriformis
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-3);
        // Clicking/catching suggests labral tear or FAI
        if(s.has('Locking / catching sensation')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Gluteal tendinopathy (formerly called trochanteric bursitis or GTPS) involves the gluteus medius/minimus at their greater trochanteric insertion. True isolated bursitis is uncommon — most cases represent tendinopathy at the trochanteric footprint. Reproduction of lateral hip pain within 30 seconds of single-leg stance is strongly associated with gluteal tendinopathy. Compressive loading (adducted hip positions: crossing legs, hip drop, lying on affected side) is the primary aggravator. Heavy slow resistance loading of the gluteal tendons is the most evidence-supported rehabilitation approach (Grimaldi protocol).',
      exercises:[
        {icon:'💪', name:'Isometric Hip Abduction (wall press)', sets:'5x45 sec holds', desc:'Pain-modulating isometrics — avoids compressive tendon loading that worsens symptoms.', focus:'Activate hip abductors isometrically without provoking lateral tendon compression', diagram:'wall_sit'},
        {icon:'🌉', name:'Heavy Slow Resistance Hip ABD (cable/band)', sets:'4x8 reps, 3–4 sec tempo', desc:'Tendon remodeling — slow, heavy eccentric loading is the most evidence-supported approach for gluteal tendinopathy rehabilitation.', focus:'Provide sufficient tendon loading stimulus to drive structural adaptation', diagram:'clamshell'},
        {icon:'🦵', name:'Lateral Step-Ups (controlled eccentric)', sets:'3x10 slow reps', desc:'Functional progressive loading targeting gluteus medius.', focus:'Develop eccentric hip and knee control for stairs and uneven terrain', diagram:'step_down'},
        {icon:'🧘', name:'Compressive Load Education', sets:'Ongoing', desc:'Avoid: crossing legs, hip drop in standing, lying on affected side — these compress the tendon.', focus:'Teach the patient to identify and avoid positions that compress the affected tendon', diagram:'seated_lean'}
      ]
    },

    {
      name: 'Piriformis Syndrome (Deep Buttock Pain)',
      ageNote: 'Any age; more common in women; associated with running and prolonged sitting',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Mid-buttock pain')) score+=4;
        if(s.has('Sciatica / burning pain down leg')) score+=4;
        if(s.has('Numbness / tingling (thigh)')) score+=3;
        if(s.has('Pain with sitting >30 min')) score+=3;
        if(a.has('Prolonged sitting (>30 min)')||a.has('Sitting on hard surfaces')) score+=4;
        if(a.has('Running / sprinting')) score+=2;
        if(al.has('Rest')||al.has('Non-weight-bearing')) score+=1;
        if(tests['Seated Piriformis Stretch Test']==='+') score+=4;
        if(tests['Pace Sign']==='+') score+=4;
        if(tests['Sciatic Notch Palpation']==='+') score+=3;
        if(sex==='female') score+=2;
        // Penalties: diffuse shin pain without rest/night pain = MTSS not stress fracture
        if(!s.has('Night pain')&&!s.has('Pain at rest')&&!s.has('Pain out of proportion to injury')) score=Math.max(0,score-3);
        // Calf pain without shin involvement suggests calf strain
        if(s.has('Calf pain')&&!s.has('Medial leg / shin pain')) score=Math.max(0,score-4);
        // Neurological symptoms are not features of stress fracture
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        // Penalties: anterior groin / lateral hip pain is not piriformis
        if(s.has('Anterior hip / groin pain')||s.has('Deep groin pain')) score=Math.max(0,score-3);
        if(s.has('Lateral hip pain')) score=Math.max(0,score-2);
        // Low back pain dominating over buttock pain suggests lumbar origin
        if(s.has('Diffuse axial low back pain')&&!s.has('Mid-buttock pain')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Piriformis / deep gluteal syndrome causes mid-buttock pain and sciatica-like symptoms from compression of the sciatic nerve by the piriformis or other deep external rotators. Key differentiator from lumbar radiculopathy: pain is deep in the buttock (not lower back), worse with sitting, and reproduced by piriformis provocation tests without lumbar findings. Piriformis stretching, sciatic nerve mobilization, and deep external rotator strengthening are the primary treatments.',
      exercises:[
        {icon:'🧘', name:'Piriformis Stretch (figure-4 / seated)', sets:'Hold 30 sec x3 each side', desc:'Primary treatment — stretch in hip flexion/IR/adduction position.', focus:'Release piriformis tension to decompress sciatic nerve in deep buttock', diagram:'piriformis_stretch'},
        {icon:'🔄', name:'Neural Mobilization (sciatic nerve)', sets:'2x10 gentle glides', desc:'Reduces sciatic nerve adhesion — use sliding technique to avoid aggravation.', focus:'Restore sciatic nerve excursion and reduce radicular sensitisation', diagram:'nerve_floss_supine'},
        {icon:'💪', name:'Hip ER Eccentric Strengthening', sets:'3x15 reps', desc:'Builds piriformis resilience to reduce muscle over-activation and guarding.', focus:'Build eccentric rotator control to protect the labrum during deceleration', diagram:'clamshell'},
        {icon:'🌀', name:'Hip Stabilizer Strengthening', sets:'3x15 each direction', desc:'Addresses the underlying hip weakness that increases piriformis demand.', focus:'Activate hip stabilisers to reduce Trendelenburg loading pattern', diagram:'clamshell'}
      ]
    },
    {
      name: 'Snapping Hip Syndrome',
      ageNote: 'Young adults; dancers and athletes; may be painless or painful',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Clicking / snapping (hip)')||s.has('Audible snap with hip motion')) score+=6;
        if(s.has('Lateral hip pain')) score+=2; // external type
        if(s.has('Anterior hip / groin pain')) score+=2; // internal type
        if(a.has('Hip flexion activities')||a.has('Running / sprinting')) score+=3;
        if(al.has('Rest')||al.has('Avoiding pivoting')) score+=1;
        if(tests['Dynamic Hip Snap Observation']==='+') score+=5;
        // Penalties: pain without snapping is not snapping hip
        if(!s.has('Clicking / snapping (hip)')&&!s.has('Audible snap with hip motion')) score=Math.max(0,score-5);
        // Night pain / rest pain suggests a different diagnosis
        if(s.has('Night pain')||s.has('Pain at rest')) score=Math.max(0,score-2);
        // Neurological features are not part of snapping hip
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-3);
        if(age) {
          if(age >= 15 && age <= 35) score+=2;
        }
        return score;
      },
      edu:'Snapping hip syndrome has two forms: external (IT band snapping over greater trochanter — lateral snap) and internal (iliopsoas snapping over the iliopectineal eminence — anterior/groin snap). Most snapping is painless; intervention is only needed if painful or functionally limiting. Dynamic ultrasound supports the diagnosis when clinical findings are equivocal. Treatment addresses the underlying tightness: IT band/TFL stretching for external type, iliopsoas stretching and progressive loading for internal type.',
      exercises:[
        {icon:'🧘', name:'IT Band / TFL Stretch (external type)', sets:'Hold 30 sec x3 each', desc:'Primary treatment for external snapping hip — reduces IT band tension over greater trochanter.', focus:'Reduce ITB tension to offload the lateral femoral epicondyle', diagram:'itb_stretch'},
        {icon:'🧘', name:'Iliopsoas Stretch (internal type)', sets:'Hold 30 sec x3 each', desc:'Primary treatment for internal snapping hip — reduces iliopsoas tension over iliopectineal eminence.', focus:'Target the internal snapping hip by lengthening the psoas through extension', diagram:'hip_flexor_stretch'},
        {icon:'💪', name:'Hip Abductor Strengthening', sets:'3x15 reps each side', desc:'Reduces IT band tension and improves dynamic hip control.', focus:'Build hip abductor capacity to reduce compressive tendon loading', diagram:'clamshell'},
        {icon:'🔄', name:'Eccentric Iliopsoas Loading', sets:'3x15 reps', desc:'Builds tendon resilience for internal type — slow eccentric hip flexion lowering.', focus:'Eccentrically load the iliopsoas to stimulate tendon adaptation and reduce snapping', diagram:'hip_flexor_stretch'}
      ]
    },
    {
      name: 'Pelvic Girdle Pain (Pregnancy-Related Pelvic Pain)',
      ageNote: 'Pregnant/postpartum women; prevalence 20% in pregnancy',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Posterior hip pain / buttock')) score+=3;
        if(s.has('Pain with weight-bearing')) score+=2;
        if(s.has('Deep groin pain')) score+=1;
        if(a.has('Walking / ambulation')||a.has('Ascending stairs')) score+=2;
        if(a.has('Turning in bed')) score+=3;
        if(al.has('Rest')||al.has('Pelvic support belt')) score+=3;
        if(tests['Active Straight Leg Raise (ASLR)']==='+') score+=5;
        if(tests['Posterior Pelvic Pain Provocation (P4)']==='+') score+=4;
        if(tests['Long Dorsal Ligament Palpation']==='+') score+=4;
        if(sex==='female') score+=3;
        // Penalties: PGP is predominantly a female pregnancy-related condition
        if(sex==='male') score=Math.max(0,score-5);
        // Neurological features (dermatomal numbness/tingling) suggest lumbar not PGP
        if(s.has('Paresthesias (dermatomal)')||s.has('Numbness / tingling (thigh)')) score=Math.max(0,score-3);
        // Lateral or anterior hip pain not typical of PGP
        if(s.has('Lateral hip pain')||s.has('Anterior hip / groin pain')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Pelvic girdle pain is common during pregnancy and postpartum. Pain is located in the SI joints, pubic symphysis, or both, worsened by weight-bearing activities and turning in bed. The long dorsal ligament palpation test is a commonly used assessment finding associated with posterior pelvic girdle involvement. Pelvic support belts provide immediate symptom relief. Lumbopelvic stabilization exercises are the cornerstone of rehabilitation; asymmetric loading activities should be avoided.',
      exercises:[
        {icon:'🧘', name:'Pelvic Floor & Transversus Abdominis Activation', sets:'3x10, 10 sec hold', desc:'Restores inner unit stability to reduce SIJ shear forces.', focus:'Establish pelvic floor and deep core co-activation as a foundation for load management', diagram:'dead_bug'},
        {icon:'🌉', name:'Clam Shells / Hip Abduction (sidelying)', sets:'3x15 each side', desc:'Gluteus medius activation — improves lumbopelvic force closure.', focus:'Activate hip abductors in a low-load position away from compression', diagram:'clamshell'},
        {icon:'💪', name:'Glute Bridges (supported)', sets:'3x15 reps', desc:'Posterior chain stability — avoid single-leg loading until symptoms controlled.', focus:'Begin posterior chain activation in a low-load, pain-safe position', diagram:'bridge'},
        {icon:'🧘', name:'Pelvic Belt Education + Activity Modification', sets:'Ongoing', desc:'Reduce asymmetric loading — avoid one-leg standing, wide-leg movements, and unsupported positions.', focus:'Use pelvic support belt during high-load activity to provide SIJ compression', diagram:'seated_lean'}
      ]
    },
    {
      name: 'Athletic Pubalgia (Sports Hernia)',
      ageNote: 'Young male athletes; sports requiring kicking, cutting, and sprinting',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Lower abdominal pain')) score+=4;
        if(s.has('Deep groin pain')) score+=3;
        if(s.has('Anterior hip / groin pain')) score+=2;
        if(a.has('Kicking')||a.has('Cutting / lateral movements')||a.has('Running / sprinting')) score+=4;
        if(a.has('Coughing / sneezing')) score+=3;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        if(tests['Cross-Body Sit-Up Test']==='+') score+=6;
        if(tests['Adductor Contracture Test']==='+') score+=5;
        if(tests['Pubic Tubercle / Rectus Insertion Palpation']==='+') score+=4;
        if(age) {
          if(age >= 15 && age <= 35) score+=2;
        }
        if(sex==='male') score+=3;
        // Penalties: lateral or posterior hip pain inconsistent with athletic pubalgia
        if(s.has('Lateral hip pain')||s.has('Posterior hip pain / buttock')) score=Math.max(0,score-3);
        // Neurological features point to nerve root rather than core muscle injury
        if(s.has('Numbness / tingling (thigh)')||s.has('Sciatica / burning pain down leg')) score=Math.max(0,score-3);
        // Clicking/catching is not a feature of athletic pubalgia
        if(s.has('Locking / catching sensation')||s.has('Clicking / snapping (hip)')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Athletic pubalgia (sports hernia / core muscle injury) involves disruption of the posterior inguinal wall at the pubic symphysis, typically at the conjoint tendon or rectus abdominis insertion. The cross-body sit-up test and adductor contracture test are both strongly associated with this presentation and are among the most informative clinical tests. MRI or dynamic ultrasound are the preferred investigations for confirmation. Conservative PT (core stabilization, progressive abdominal and adductor loading) is first-line; surgical repair is considered if symptoms persist beyond 3 months.',
      exercises:[
        {icon:'💪', name:'Transversus Abdominis Activation', sets:'3x10, 10 sec hold', desc:'Foundation of athletic pubalgia rehabilitation — deep core before outer core.', focus:'Activate the primary segmental spinal stabiliser before functional loading', diagram:'dead_bug'},
        {icon:'🌀', name:'Progressive Abdominal Strengthening (avoid twisting early)', sets:'3x10–15 reps', desc:'Straight-plane loading before rotational — avoid provocative twisting until pain-free.', focus:'Restore abdominal wall strength while protecting the pubic attachment', diagram:'dead_bug'},
        {icon:'🧘', name:'Adductor Isometric → Copenhagen Progression', sets:'5x10 sec → 3x8 reps', desc:'Concurrent adductor rehab — adductor involvement is consistently present alongside posterior inguinal wall injury in this presentation.', focus:'Progress adductor loading from isometric to high-demand Copenhagen', diagram:'adductor_squeeze'},
        {icon:'🏃', name:'Graded Return to Kicking / Cutting', sets:'Progressive sport-specific loading', desc:'Structured return — criterion-based progression only after full pain-free strength.', focus:'Structured reintroduction of rotational load to avoid re-injury', diagram:'walking'}
      ]
    },
    {
      name: 'Femoral Neck Stress Fracture',
      ageNote: 'Military recruits, endurance athletes 20–30 years; postmenopausal women',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior hip / groin pain')||s.has('Deep groin pain')) score+=2;
        if(s.has('Night pain')||s.has('Pain at rest')) score+=3;
        if(s.has('Pain with weight-bearing')||s.has('Antalgic gait')) score+=3;
        if(a.has('Running / sprinting')||a.has('Increased training load')) score+=4;
        if(al.has('Non-weight-bearing')||al.has('Complete activity cessation (stress fracture)')) score+=4;
        if(tests['Hop Test']==='+') score+=5;
        if(tests['Fulcrum Test']==='+') score+=5;
        if(tests['Heel Percussion Test']==='+') score+=4;
        // Penalties: absence of rest/night pain makes stress fracture unlikely
        if(!s.has('Night pain')&&!s.has('Pain at rest')&&!s.has('Pain with weight-bearing')) score=Math.max(0,score-3);
        // Pain that fully resolves with rest is more consistent with tendinopathy
        if(al.has('Rest')&&!s.has('Night pain')&&!s.has('Pain at rest')) score=Math.max(0,score-2);
        // Neurological features suggest lumbar pathology not stress fracture
        if(s.has('Sciatica / burning pain down leg')||s.has('Numbness / tingling (thigh)')) score=Math.max(0,score-3);
        return score;
      },
      edu:'⚠️ RED FLAG: Femoral neck stress fractures are limb-threatening if missed. Suspect in endurance athletes or military recruits with anterior groin pain and night pain. The hop test, fulcrum test, and heel percussion test are screening tools — a positive test warrants urgent MRI, which is the preferred imaging investigation for confirmation. TENSION-SIDE femoral neck fractures require URGENT surgical consultation (high risk of complete fracture and avascular necrosis). Complete non-weight-bearing rest and immediate orthopaedic referral are mandatory if suspected.',
      exercises:[
        {icon:'⚠️', name:'NON-WEIGHT-BEARING REST', sets:'Until fracture ruled out by MRI', desc:'Do NOT load the hip until stress fracture is definitively ruled out — risk of complete fracture.', focus:'Protect healing structures by removing axial load completely', diagram:'walking'},
        {icon:'🚲', name:'Pool Running / Aquatic Therapy (if cleared)', sets:'As per orthopaedic clearance', desc:'Maintain cardiovascular fitness with no impact loading during healing phase.', focus:'Maintain running fitness with minimal spinal or joint load', diagram:'walking'},
        {icon:'💪', name:'Upper Body & Core Maintenance', sets:'As tolerated', desc:'Maintain strength and fitness in unaffected areas during healing.', focus:'Maintain conditioning of non-injured structures during protected recovery', diagram:'dead_bug'},
        {icon:'🏃', name:'Graded Return to Running (post-clearance)', sets:'12–16 week structured protocol', desc:'MRI-guided return — only after radiological evidence of healing confirmed.', focus:'Structured mileage progression after clinical clearance from injury', diagram:'walking'}
      ]
    }
    ,{
      name: 'Greater Trochanteric Pain Syndrome (GTPS / Lateral Hip Pain)',
      ageNote: 'Women 40–60 years; prevalence 10–25% in middle-aged women; associated with BMI, running load, and OA',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Lateral hip pain')) score+=5;
        if(s.has('Night pain')||s.has('Pain at rest')) score+=2;
        if(s.has('Pain with weight-bearing')) score+=2;
        if(a.has('Walking / ambulation')||a.has('Ascending stairs')) score+=2;
        if(a.has('Standing on one leg')||a.has('Prolonged standing')) score+=3;
        if(a.has('Hill running')||a.has('Increased training load')) score+=2;
        if(al.has('Rest')||al.has('Avoiding side-lying on affected hip')) score+=2;
        if(tests['Single Leg Stance Test (30 sec)']==='+') score+=6;
        if(tests['Resisted External Derotation Test']==='+') score+=4;
        if(tests['Greater Trochanter Palpation']==='+') score+=3;
        if(tests['Trendelenburg Test']==='+') score+=2;
        if(age && age >= 40 && age <= 65) score+=3;
        if(sex==='female') score+=3;
        // Penalties: deep groin pain is not consistent with GTPS
        if(s.has('Deep groin pain')||s.has('Anterior hip / groin pain')) score=Math.max(0,score-3);
        // Neurological symptoms suggest lumbar radiculopathy not GTPS
        if(s.has('Sciatica / burning pain down leg')||s.has('Numbness / tingling (thigh)')) score=Math.max(0,score-3);
        // Clicking/catching suggests labral tear or FAI rather than GTPS
        if(s.has('Locking / catching sensation')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Greater trochanteric pain syndrome (GTPS) is the updated term for what was previously called trochanteric bursitis. Most cases are actually gluteal tendinopathy — irritation of the gluteus medius/minimus tendons at their greater trochanteric attachment — rather than true isolated bursitis. The hallmark is lateral hip pain worsened by positions that compress the tendons: crossing legs, hip drop, lying on the affected side, or standing with weight shifted to one side. Reproduction of pain within 30 seconds of single-leg stance is a reliable clinical sign. Heavy slow resistance loading of the gluteal tendons is the most evidence-supported rehabilitation approach.',
      exercises:[
        {icon:'💪', name:'Isometric Hip Abduction (wall press)', sets:'5x45 sec holds', desc:'Pain-modulating isometrics — load tendon without compression.', focus:'Activate hip abductors isometrically without provoking lateral tendon compression', diagram:'wall_sit'},
        {icon:'🌉', name:'Heavy Slow Resistance Hip ABD (cable/band)', sets:'4x8 reps, 3–4 sec tempo', desc:'Evidence-based tendon remodelling stimulus — slow and heavy.', focus:'Provide the loading stimulus needed to drive gluteal tendon structural adaptation', diagram:'clamshell'},
        {icon:'🦵', name:'Lateral Step-Ups (controlled eccentric)', sets:'3x10 slow reps', desc:'Functional progressive loading targeting gluteus medius.', focus:'Develop eccentric gluteal control through functional step-down movement', diagram:'step_down'},
        {icon:'🧘', name:'Compressive Load Education', sets:'Ongoing habit change', desc:'Avoid: crossing legs, hip drop, lying directly on affected side — compressive positions worsen the tendon.', focus:'Eliminate positions that compress the gluteal tendons against the trochanter', diagram:'seated_lean'}
      ]
    }
  ],
  cervical: [
    {
      name: 'Cervical Radiculopathy (Pinched Nerve in Neck)',
      ageNote: 'Peak 50–54 years; more common in males (peak 40–60 years)',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Unilateral arm pain')||s.has('Radiating pain (arm)')) score+=4;
        if(s.has('Paresthesias')||s.has('Numbness (dermatomal)')||s.has('Tingling')) score+=3;
        if(s.has('Weakness (arm/hand)')) score+=2;
        if(a.has('Valsalva / sneezing / coughing')||a.has('Overhead activities')) score+=2;
        if(a.has('Neck movement (any)')||a.has('Sustained neck positions')) score+=1;
        if(al.has('Resting arm on head (Bakody position)')||al.has('Shoulder abduction (hand on head)')||al.has('Resting arm on head (Bakody position)')||al.has('Traction')) score+=3;
        if(tests['Spurling Test (Compression)']==='+') score+=4;
        if(tests['Cervical Distraction Test']==='+') score+=3;
        if(tests['Shoulder Abduction Relief Test']==='+') score+=3;
        if(tests['Upper Limb Tension Test 1 (ULTT1)']==='+') score+=3;
        if(tests['Upper Limb Tension Test 2 (ULTT2b)']==='+') score+=2;
        if(tests['Upper Limb Tension Test 3 (ULTT3)']==='+') score+=2;
        // Peak 40–60; more common in males
        if(age) {
          if(age >= 40 && age <= 60) score+=3;
          else if(age >= 35 && age < 40) score+=1;
          else if(age > 60) score+=1;
        }
        if(sex === 'male') score+=1;
        // Penalties: bilateral arm symptoms suggest myelopathy or TOS, not single-level radiculopathy
        if(s.has('Bilateral arm symptoms')) score=Math.max(0,score-3);
        // Purely local neck pain without arm radiation is not radiculopathy
        if(!s.has('Unilateral arm pain')&&!s.has('Radiating pain (arm)')&&!s.has('Paresthesias')&&!s.has('Numbness (dermatomal)')) score=Math.max(0,score-4);
        // Sitting relieving (vs worsening with flexion) is atypical for cervical radiculopathy
        if(al.has('Sitting')&&!al.has('Resting arm on head (Bakody position)')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Cervical radiculopathy involves compression or irritation of a cervical nerve root, typically causing unilateral arm pain in a dermatomal distribution with associated paresthesias. The Spurling test is associated with cervical nerve root involvement when positive; relief with shoulder abduction (Bakody position) supports radiculopathy. Common levels: C6 (thumb/index), C7 (middle finger), C8 (ring/little). Conservative management includes neural mobilization, cervical traction, and postural correction.',
      exercises:[
        {icon:'🔄', name:'Neural Flossing — Level-Specific', sets:'2x10 reps each nerve', desc:'ULTT-based nerve gliding for median (C6/7), radial (C6/7), or ulnar (C8/T1) depending on dermatome.', focus:'Target nerve mobilisation to the clinically identified spinal level', diagram:'nerve_floss_supine'},
        {icon:'🧘', name:'Chin Tucks (Cervical Retraction)', sets:'3x10 reps', desc:'Promotes cervical retraction, reduces foraminal compression, and activates deep neck flexors.', focus:'Re-establish cervical neutral through deep flexor activation and upper retraction', diagram:'chin_tuck'},
        {icon:'🌀', name:'Cervical Lateral Glide (McKenzie)', sets:'2x10 reps', desc:'Away from symptomatic side — used when lateral shift or peripheralization is present.', focus:'Lateral glide to open the symptomatic cervical foramen and centralise symptoms', diagram:'chin_tuck'},
        {icon:'💪', name:'Cervical Isometrics (pain-free directions)', sets:'3x10 sec hold each direction', desc:'Builds deep neck stabilizer strength without provoking radicular symptoms.', focus:'Begin cervical loading in pain-free planes to maintain strength without provocation', diagram:'cervical_isometric'}
      ]
    },
    {
      name: 'Cervicogenic Headache',
      ageNote: 'Any age; history of whiplash or upper cervical dysfunction common',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Headache (unilateral)')) score+=4;
        if(s.has('Neck pain')||s.has('Neck stiffness')) score+=2;
        if(s.has('Dizziness')||s.has('Nausea')||s.has('Photophobia')||s.has('Phonophobia')) score+=1;
        if(s.has('Autonomic symptoms')) score+=1;
        if(a.has('Neck movement (any)')||a.has('Sustained neck positions')) score+=2;
        if(a.has('External pressure on posterior neck')) score+=3;
        if(al.has('Manual therapy')||al.has('Rest')) score+=2;
        if(tests['Cervical Flexion-Rotation Test']==='+') score+=4;
        if(tests['Upper Cervical Segmental Mobility (C1–C3)']==='+') score+=3;
        // Penalties: bilateral headache more consistent with tension-type or migraine
        if(s.has('Headache (bilateral)')&&!s.has('Headache (unilateral)')) score=Math.max(0,score-3);
        // Arm symptoms point to radiculopathy, not cervicogenic headache
        if(s.has('Unilateral arm pain')||s.has('Radiating pain (arm)')) score=Math.max(0,score-3);
        // Photophobia/phonophobia with nausea suggest migraine not cervicogenic
        if(s.has('Photophobia')&&s.has('Phonophobia')&&s.has('Nausea')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Cervicogenic headache originates from the upper cervical spine (C1–C3) and presents as unilateral head pain starting in the neck and radiating to the frontotemporal region. A hallmark is that neck movement or pressure on the posterior neck reproduces the headache. The cervical flexion-rotation test is the most commonly used and best-supported clinical test — restriction on the symptomatic side is the primary finding. Manual therapy targeting C1–C3 and deep neck flexor training are the most evidence-based treatments.',
      exercises:[
        {icon:'🔄', name:'Cervical Flexion-Rotation Self-Mobilization', sets:'2x10 reps toward restricted side', desc:'Active C1–C2 mobility in the direction of restriction identified on examination.', focus:'Target C1/C2 joint specifically — most effective for cervicogenic headache', diagram:'cervical_rotation'},
        {icon:'🧘', name:'Cranial Cervical Flexion (Chin Tuck)', sets:'3x10 reps, progressing pressure levels', desc:'Deep neck flexor activation targeting longus colli and capitis — reduces upper cervical joint load.', focus:'Activate the deep cervical flexors at progressively higher effort levels', diagram:'chin_tuck'},
        {icon:'💪', name:'Neck Flexor Endurance Training', sets:'3x progressively timed holds', desc:'Build endurance in deep cervical flexors to reduce headache frequency.', focus:'Build deep cervical flexor endurance — protects the cervical spine under sustained load', diagram:'chin_tuck'},
        {icon:'🌀', name:'Upper Cervical Self-Mobilization (C1–C2)', sets:'2x10 gentle rotations', desc:'Patient-performed upper cervical mobility exercise in supported supine position.', focus:'Self-mobilise the atlanto-axial joint to restore rotation and headache symptoms', diagram:'cervical_rotation'}
      ]
    },
    {
      name: 'Cervical Whiplash / Movement Coordination Impairment',
      ageNote: 'Any age following acceleration-deceleration trauma',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Neck pain')||s.has('Neck stiffness')) score+=3;
        if(s.has('Muscle spasm')) score+=2;
        if(s.has('Headache (unilateral)')||s.has('Headache (bilateral)')) score+=1;
        if(s.has('Dizziness')) score+=2;
        if(a.has('Neck movement (any)')||a.has('Sustained neck positions')) score+=2;
        if(al.has('Rest')||al.has('Cervical support / collar')) score+=2;
        if(tests['Cranial Cervical Flexion Test (CCFT)']==='+') score+=3;
        if(tests['Neck Flexor Endurance Test']==='+') score+=3;
        // Penalties: arm neurological features suggest radiculopathy, not whiplash
        if(s.has('Unilateral arm pain')&&s.has('Paresthesias')&&s.has('Numbness (dermatomal)')) score=Math.max(0,score-3);
        // Gradual insidious onset is inconsistent with whiplash (requires trauma mechanism)
        if(!a.has('Sustained neck positions')&&!a.has('Neck movement (any)')) score=Math.max(0,score-1);
        return score;
      },
      edu:'Whiplash (WAD) results from rapid acceleration-deceleration forces to the cervical spine. Key features include neck pain/stiffness, muscle spasm, reduced ROM with altered movement quality (reduced speed, smoothness, irregular axes), and possible neurological findings. Early active mobilization is superior to collar immobilization. Deep neck flexor retraining and graded motor imagery are evidence-based approaches for persistent symptoms.',
      exercises:[
        {icon:'🔄', name:'Active Cervical ROM (early mobilization)', sets:'2x10 reps all planes', desc:'Gentle active movement in all planes — early movement outperforms immobilization.', focus:'Restore cervical mobility early to prevent capsular stiffening', diagram:'cervical_rotation'},
        {icon:'🧘', name:'Cranial Cervical Flexion (progressive levels)', sets:'3x10 reps, 5 pressure levels', desc:'CCFT-based retraining of deep neck flexors — cornerstone of WAD rehabilitation.', focus:'Progressively increase deep flexor demand through biofeedback-guided stages', diagram:'chin_tuck'},
        {icon:'💪', name:'Cervical Proprioception / Gaze Stability', sets:'3x30 sec', desc:'Head-to-target exercises to restore cervico-ocular coordination and reduce dizziness.', focus:'Retrain cervicogenic proprioception and vestibular integration after neck injury', diagram:'cervical_rotation'},
        {icon:'🌀', name:'Scapular Stabilization', sets:'3x15 reps', desc:'Restores upper quadrant stability and reduces cervical load during arm activities.', focus:'Establish scapular neuromuscular control before loading the rotator cuff', diagram:'scapular_retraction'}
      ]
    },
    {
      name: 'Cervical Facet Joint Syndrome',
      ageNote: 'Any age; more common with degenerative changes; C2–C3 and C5–C6 most common levels',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Neck pain')) score+=2;
        if(s.has('Deep ache')) score+=1;
        if(s.has('Headache (unilateral)')||s.has('Headache (bilateral)')) score+=1;
        if(s.has('Muscle spasm')) score+=1;
        if(a.has('Looking up (extension)')||a.has('Rotation')) score+=3;
        if(a.has('Sustained neck positions')) score+=2;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        if(tests['Facet Loading Maneuver (Ext + Rotation)']==='+') score+=4;
        if(tests['Spurling Test (Compression)']==='-') score+=1; // helps rule out radiculopathy
        // Penalties: arm radiation with dermatomal numbness suggests radiculopathy
        if(s.has('Unilateral arm pain')&&(s.has('Paresthesias')||s.has('Numbness (dermatomal)'))) score=Math.max(0,score-3);
        // Weakness indicates nerve root involvement, not isolated facet syndrome
        if(s.has('Weakness (arm/hand)')) score=Math.max(0,score-3);
        // Dizziness suggests upper cervical dysfunction (C1–C2), not facet syndrome
        if(s.has('Dizziness')&&!s.has('Neck pain')) score=Math.max(0,score-2);
        // More common with age/degenerative changes
        if(age) {
          if(age >= 50) score+=2;
          else if(age >= 40) score+=1;
        }
        return score;
      },
      edu:'Cervical facet (zygapophyseal) joint pain is a common source of axial neck pain, typically worsened by extension and ipsilateral rotation. Pain can radiate to the head (C2–C3), shoulder, or upper arm but without dermatomal neurological features. Paraspinal tenderness has some predictive value for treatment response. Diagnostic medial branch blocks are the reference standard investigation but are not typically available in physiotherapy settings. Manual therapy, postural correction, and deep cervical flexor training are first-line interventions.',
      exercises:[
        {icon:'🧘', name:'Chin Tucks', sets:'3x10 reps', desc:'Reduces upper cervical extension and facet joint loading.', focus:'Retrain deep cervical flexors and restore optimal upper cervical alignment', diagram:'chin_tuck'},
        {icon:'🌀', name:'Cervical AROM (away from pain)', sets:'2x10 reps', desc:'Mobility in non-provocative directions to maintain range.', focus:'Begin range restoration in non-provocative direction first', diagram:'cervical_rotation'},
        {icon:'💪', name:'Scapular Retraction / Mid-Trap', sets:'3x15 reps', desc:'Improves thoracic posture to offload cervical facet joints.', focus:'Strengthen mid-trapezius to normalise scapular position under load', diagram:'scapular_retraction'},
        {icon:'🧘', name:'Levator Scapulae & Upper Trap Stretch', sets:'Hold 30 sec x3 each', desc:'Reduces tension in paraspinal muscles that load facet joints.', focus:'Release upper cervical myofascial tension contributing to headache', diagram:'neck_stretch'}
      ]
    },
    {
      name: 'Cervical Disc Herniation (Slipped Disc in Neck)',
      ageNote: 'Peak 40–60 years; more common in males',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Radiating pain (arm)')||s.has('Unilateral arm pain')) score+=3;
        if(s.has('Paresthesias')||s.has('Numbness (dermatomal)')||s.has('Tingling')) score+=3;
        if(s.has('Neck pain')) score+=1;
        if(a.has('Looking down (flexion)')||a.has('Valsalva / sneezing / coughing')) score+=3;
        if(al.has('Rest')||al.has('Traction')) score+=2;
        if(tests['Spurling Test (Compression)']==='+') score+=3;
        if(tests['Upper Limb Tension Test 1 (ULTT1)']==='+') score+=2;
        if(tests['Cervical Distraction Test']==='+') score+=3;
        // Peak 40–60; more common in males
        if(age) {
          if(age >= 40 && age <= 60) score+=2;
          else if(age >= 35) score+=1;
        }
        if(sex === 'male') score+=1;
        // Penalties: no arm neurological symptoms makes cervical disc herniation unlikely
        if(!s.has('Radiating pain (arm)')&&!s.has('Unilateral arm pain')&&!s.has('Paresthesias')&&!s.has('Numbness (dermatomal)')) score=Math.max(0,score-4);
        // Extension relieving is more consistent with disc herniation, not cervical OA
        if(al.has('Extension / back bend')&&!al.has('Traction')) score=Math.max(0,score-1);
        // Bilateral symptoms suggest stenosis/myelopathy not single disc
        if(s.has('Bilateral arm symptoms')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Cervical disc herniation can present as radiculopathy (arm pain/paresthesias in dermatomal pattern) or contribute to mechanical neck pain without neurological features. Flexion and Valsalva maneuvers typically increase intradiscal pressure and worsen symptoms. MRI can identify herniation but findings must correlate clinically — incidental findings are common. Conservative PT is first-line; refer for surgical opinion if myelopathy signs, severe weakness, or failed 6–8 weeks of PT.',
      exercises:[
        {icon:'🔄', name:'Cervical Retraction / Extension (McKenzie)', sets:'3x10 reps', desc:'Extension bias to promote posterior disc displacement if centralization occurs with extension.', focus:'Reduce discogenic cervical loading through retraction and extension direction', diagram:'chin_tuck'},
        {icon:'🧘', name:'Neural Flossing (nerve-level specific)', sets:'2x10 gentle glides', desc:'Nerve mobilization to reduce neural adhesion and improve radicular symptoms.', focus:'Restore neural mobility at the affected spinal segment', diagram:'nerve_floss_supine'},
        {icon:'💪', name:'Cervical Isometrics (extension bias)', sets:'3x10 sec hold', desc:'Stabilize in extension-biased position to support disc recovery.', focus:'Extension-biased loading to support the cervical facet joints', diagram:'cervical_isometric'},
        {icon:'🌀', name:'Thoracic Mobility (extension)', sets:'3x10 over foam roller', desc:'Reduces compensatory cervical loading from thoracic kyphosis.', focus:'Prioritise extension mobility in the thoracic spine to reduce kyphosis loading', diagram:'thoracic_extension'}
      ]
    },
    {
      name: 'Cervical Mobility Deficit / Mechanical Neck Pain',
      ageNote: 'Any age; 15% prevalence at any time; 30–50% develop chronic symptoms; mobility deficits increase with age',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        if(s.has('Neck stiffness')||s.has('Neck pain')) score+=3;
        if(s.has('Deep ache')) score+=1;
        if(s.has('Muscle spasm')) score+=1;
        // No arm symptoms (differentiates from radiculopathy)
        if(!s.has('Unilateral arm pain') && !s.has('Radiating pain (arm)') && !s.has('Numbness (dermatomal)')) score+=2;
        // Penalties: any arm neurological features exclude non-specific mechanical neck pain
        if(s.has('Unilateral arm pain')||s.has('Radiating pain (arm)')) score=Math.max(0,score-4);
        if(s.has('Weakness (arm/hand)')) score=Math.max(0,score-4);
        if(s.has('Numbness (dermatomal)')||s.has('Paresthesias')) score=Math.max(0,score-4);
        // Headache as primary complaint points to cervicogenic headache
        if(s.has('Headache (unilateral)')&&!s.has('Neck stiffness')) score=Math.max(0,score-2);
        if(a.has('Prolonged sitting')||a.has('Sustained neck positions')||a.has('Looking down (flexion)')) score+=2;
        if(a.has('Neck movement (any)')) score+=1;
        if(al.has('Gentle movement')||al.has('Activity modification')||al.has('Heat')) score+=2;
        if(tests['Spurling Test (Compression)']==='-') score+=1;
        if(tests['Cervical Distraction Test']==='-') score+=1;
        // Age-related mobility loss increases prevalence
        if(age) {
          if(age >= 50) score+=2;
          else if(age >= 40) score+=1;
        }
        return score;
      },
      edu:'Mechanical neck pain / cervical mobility deficits are among the most common musculoskeletal presentations. Pain is typically diffuse, difficult to localize, and may radiate to the shoulders or head without neurological features. Prolonged static postures (especially forward head posture at screens) are a major contributing factor. Manual therapy combined with exercise is the most evidence-based approach. Mobility deficits increase with age and are generally longer-lasting in males.',
      exercises:[
        {icon:'🌀', name:'Cervical AROM All Planes', sets:'2x10 reps each direction', desc:'Active mobility to restore range — the primary treatment for mobility deficits.', focus:'Restore full cervical mobility through all physiological planes', diagram:'cervical_rotation'},
        {icon:'🧘', name:'Chin Tucks + Capital Extension', sets:'3x10 reps', desc:'Corrects forward head posture and activates deep cervical flexors.', focus:'Combine retraction with capital extension to restore mid-cervical mobility', diagram:'chin_tuck'},
        {icon:'💪', name:'Cervical Strengthening (isometrics all planes)', sets:'3x10 sec hold each direction', desc:'Builds endurance in cervical stabilizers to support postural correction.', focus:'Systematically load the cervical musculature in all planes for full recovery', diagram:'cervical_isometric'},
        {icon:'🪑', name:'Thoracic Foam Roller Extension', sets:'2 min across multiple segments', desc:'Restores thoracic extension to reduce compensatory cervical loading.', focus:'Use a foam roller to mobilise thoracic extension through segmental distraction', diagram:'thoracic_extension'}
      ]
    }
  ],
  thoracic: [
    {
      name: 'Thoracic Mobility Deficits / Spondylosis',
      ageNote: 'Increases with age; earlier onset and longer duration in males; ROM decreases ~5° per decade',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Stiffness')||s.has('Mid-back pain')||s.has('Deep ache')) score+=3;
        if(s.has('Interscapular pain')) score+=1;
        if(a.has('Prolonged sitting')||a.has('End-range movements')||a.has('Trunk rotation')) score+=3;
        if(a.has('Extension')||a.has('Activities requiring upright posture')) score+=1;
        if(al.has('Gentle movement')||al.has('Activity modification')) score+=2;
        if(tests['Thoracic Active ROM (inclinometer)']==='+') score+=3;
        if(tests['Segmental Mobility Testing (spring test)']==='+') score+=3;
        if(age) {
          if(age >= 60) score+=3;
          else if(age >= 45) score+=2;
          else if(age >= 35) score+=1;
        }
        if(sex === 'male') score+=1;
        // Penalties: sharp rib/chest wall pain with breathing is costochondral, not spondylosis
        if(s.has('Chest wall pain')||s.has('Sharp pain with breathing')) score=Math.max(0,score-3);
        // Arm neurological features suggest TOS or cervical involvement
        if(s.has('Numbness')||s.has('Tingling')||s.has('Weakness (upper extremity)')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Thoracic mobility deficits are extremely common and worsen with age (~5° per decade loss in all planes). Lower thoracic segments (T8–T12) are most affected with aging. Stiffness with trunk rotation and extension are the hallmark functional complaints. Thoracic mobility directly impacts cervical and shoulder function — restricted thoracic rotation is a major contributor to neck pain and shoulder impingement. Manual therapy and active mobility exercises are highly effective.',
      exercises:[
        {icon:'🌀', name:'Thoracic Rotation in Seated (hands on shoulders)', sets:'3x10 each direction', desc:'Primary mobility exercise for thoracic rotation — most functionally limited plane.', focus:'Restore thoracic rotation in a stabilised position', diagram:'seated_rotation'},
        {icon:'🪑', name:'Foam Roller Thoracic Extension', sets:'2–3 min across T4–T10', desc:'Segmental extension mobilization — addresses the most common restriction pattern.', focus:'Segmental thoracic extension mobilisation using body weight', diagram:'thoracic_extension'},
        {icon:'🧘', name:'Thread the Needle', sets:'3x10 each side', desc:'Combined rotation and extension in quadruped — excellent for lower thoracic segments.', focus:'Mobilise thoracic rotation in quadruped — avoids end-range lumbar loading', diagram:'thread_needle'},
        {icon:'💪', name:'Thoracic Extension over Towel Roll', sets:'3x30 sec', desc:'Targeted extension stretch at specific stiff segments.', focus:'Target a specific thoracic segment with a rolled towel bolster', diagram:'thoracic_extension'}
      ]
    },
    {
      name: 'Age-Related Hyperkyphosis',
      ageNote: 'Older adults; prevalence 20–40% in geriatric population; kyphosis increases ~3° per decade',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Postural complaints')||s.has('Fatigue / postural fatigue')) score+=4;
        if(s.has('Interscapular pain')||s.has('Upper back pain')) score+=2;
        if(a.has('Weight-bearing activities')||a.has('Prolonged standing')||a.has('Activities requiring upright posture')) score+=3;
        if(al.has('Lying down / supine')||al.has('Rest')) score+=2;
        if(tests['Kyphosis Assessment (inclinometer)']==='+') score+=4;
        if(tests['Back Extensor Endurance (Biering-Sørensen)']==='+') score+=3;
        if(age) {
          if(age >= 70) score+=5;
          else if(age >= 60) score+=4;
          else if(age >= 50) score+=2;
          else if(age < 40) score = Math.max(0, score - 3);
        }
        // Penalties: acute onset pain is not consistent with hyperkyphosis (which is insidious)
        if(s.has('Sharp pain with breathing')||s.has('Chest wall pain')) score=Math.max(0,score-3);
        // Neurological arm features suggest TOS or cervical pathology
        if(s.has('Numbness')||s.has('Tingling')||s.has('Weakness (upper extremity)')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Age-related hyperkyphosis involves progressive increase in thoracic kyphosis (~3° per decade). Normal standing T1–T12 kyphosis falls within a well-described range; values above this with associated functional impairment indicate hyperkyphosis. Importantly, many cases have no vertebral fractures — muscle weakness and posture are key modifiable factors. Back extensor weakness is a key modifiable contributor. Exercise targeting back extensors, hip extensors, and thoracic mobility is the most evidence-based intervention.',
      exercises:[
        {icon:'💪', name:'Back Extensor Strengthening (prone)', sets:'3x15 reps', desc:'Addresses the primary modifiable driver of progressive kyphosis.', focus:'Strengthen lumbar erectors to support degenerative disc and facet joints', diagram:'prone_extension'},
        {icon:'🧘', name:'Thoracic Extension Stretch', sets:'3x30 sec over towel roll', desc:'Passive stretch targeting stiff thoracic segments.', focus:'Restore thoracic extension range to reduce compensatory cervical and shoulder loading', diagram:'thoracic_extension'},
        {icon:'🌉', name:'Hip Extension Strengthening', sets:'3x15 reps', desc:'Hip extensor weakness contributes to anterior pelvic tilt and compensatory kyphosis.', focus:'Strengthen gluteal complex to reduce posterior chain load on the tendon', diagram:'bridge'},
        {icon:'🪑', name:'Postural Retraining (wall angels)', sets:'3x10 reps', desc:'Active thoracic extension and scapular retraction in supported upright position.', focus:'Retrain scapular and thoracic alignment against a fixed wall reference', diagram:'wall_slides'}
      ]
    },
    {
      name: 'Thoracic Muscle Strain',
      ageNote: 'Any age; can occur with coughing, minor trauma, or repetitive activities',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Chest wall pain')||s.has('Rib pain')) score+=4;
        if(s.has('Sharp pain with breathing')) score+=4;
        if(s.has('Sharp pain')) score+=1;
        if(a.has('Deep breathing')||a.has('Coughing / sneezing')) score+=4;
        if(a.has('Trunk rotation')||a.has('Direct pressure on rib/chest')) score+=3;
        if(al.has('Splinting (rib)')||al.has('Avoiding provocative movements')) score+=3;
        if(tests['Rib Spring / Compression Test']==='+') score+=4;
        if(tests['Costovertebral Joint Palpation']==='+') score+=4;
        // Penalties: neurological features of arm are inconsistent with rib pathology
        if(s.has('Numbness')||s.has('Tingling')||s.has('Weakness (upper extremity)')) score=Math.max(0,score-4);
        // Diffuse mid-back stiffness is more consistent with spondylosis
        if(s.has('Stiffness')&&!s.has('Sharp pain with breathing')&&!s.has('Chest wall pain')) score=Math.max(0,score-3);
        // Arm fatigue suggests TOS not rib
        if(s.has('Arm fatigue')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Thoracic muscle strain and related rib/chest wall soft-tissue irritation present with highly localized chest wall pain, classically sharp with breathing, coughing, or trunk rotation. Point tenderness directly over the affected rib or costochondral region is a key finding. Most heal well with activity modification and time (4–8 weeks). Splinting with a pillow during coughing helps manage acute pain. Rib stress fractures should be considered in overhead athletes or those with repetitive loading.',
      exercises:[
        {icon:'🧘', name:'Supported Breathing / Diaphragmatic Breathing', sets:'5 min x2 daily', desc:'Reduces respiratory splinting and maintains rib cage mobility during healing.', focus:'Restore diaphragmatic breathing pattern to reduce accessory muscle overload', diagram:'seated_lean'},
        {icon:'🌀', name:'Pain-Free Trunk Rotation (seated)', sets:'2x10 gentle range', desc:'Maintain thoracic mobility within pain-free range to prevent stiffness.', focus:'Restore pain-free rotation as the foundation for return to activity', diagram:'seated_rotation'},
        {icon:'💪', name:'Postural Correction (supported posture)', sets:'Ongoing', desc:'Avoid sustained forward flexion which loads costochondral junctions.', focus:'Reduce postural load on the thoracic spine through supported positioning', diagram:'seated_lean'},
        {icon:'🔄', name:'Gradual Return to Activity', sets:'Progressive loading over 4–8 weeks', desc:'Graded return once pain with deep breathing resolves.', focus:'Structured load progression toward full activity based on tissue response', diagram:'walking'}
      ]
    },
    {
      name: 'Thoracic Outlet Syndrome (Nerve Compression in Neck/Shoulder)',
      ageNote: 'More common in females; associated with trauma, repetitive overhead work, or congenital anomalies',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Numbness')||s.has('Tingling')) score+=3;
        if(s.has('Weakness (upper extremity)')||s.has('Arm fatigue')) score+=3;
        if(s.has('Radiating pain')) score+=2;
        if(a.has('Sustained arm positions')||a.has('Carrying objects')) score+=3;
        if(a.has('Overhead activities')||a.has('Reaching overhead')||a.has('Repetitive arm movements')) score+=3;
        if(al.has('Resting arm on head (Bakody position)')||al.has('Shoulder abduction (hand on head)')||al.has('Rest')) score+=2;
        if(tests['Elevated Arm Stress Test (EAST / Roos)']==='+') score+=4;
        if(tests['Adson Test']==='+') score+=3;
        if(tests['Wright Test (Hyperabduction)']==='+') score+=3;
        if(sex === 'female') score+=1;
        // Penalties: local neck pain without arm symptoms makes TOS unlikely
        if(!s.has('Numbness')&&!s.has('Tingling')&&!s.has('Arm fatigue')&&!s.has('Weakness (upper extremity)')) score=Math.max(0,score-4);
        // Chest wall pain and breathing symptoms suggest rib/costochondral, not TOS
        if(s.has('Sharp pain with breathing')||s.has('Chest wall pain')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Neurogenic TOS involves compression of the brachial plexus (typically C8–T1) between the clavicle and first rib or by scalene/pectoralis minor muscles. Paresthesias in the C8/T1 distribution (ring/little finger, medial forearm), arm fatigue with elevation, and thenar/hypothenar atrophy in severe cases are hallmarks. The EAST/Roos test (symptoms reproduced with 3 minutes of elevated arm opening/closing) is a commonly used and clinically informative provocation test. Conservative PT (postural correction, scalene/pec minor stretching, first rib mobilization) is first-line.',
      exercises:[
        {icon:'🧘', name:'Scalene Stretch', sets:'Hold 30 sec x3 each side', desc:'Reduces anterior and middle scalene compression of the brachial plexus.', focus:'Reduce anterior scalene tension compressing the brachial plexus outlet', diagram:'neck_stretch'},
        {icon:'🌀', name:'Pectoralis Minor Stretch (corner stretch)', sets:'Hold 30 sec x3', desc:'Releases pec minor compression on brachial plexus beneath the coracoid.', focus:'Doorframe stretch to systematically elongate pectoralis minor', diagram:'pec_stretch'},
        {icon:'💪', name:'First Rib Mobilization (self)', sets:'2x10 reps', desc:'Reduces first rib elevation contributing to thoracic outlet narrowing.', focus:'Self-mobilise the first rib to restore thoracic outlet space', diagram:'neck_stretch'},
        {icon:'🪑', name:'Postural Correction & Thoracic Extension', sets:'3x10 reps + sustained posture work', desc:'Forward head and rounded shoulder posture are primary TOS contributors.', focus:'Combine postural retraining with thoracic extension to reduce compressive loading', diagram:'thoracic_extension'}
      ]
    },
    {
      name: "Scheuermann's Kyphosis",
      ageNote: 'Develops before puberty, presents in adolescence; prevalence 0.4–10%; may be more common in males',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Postural complaints')||s.has('Fatigue / postural fatigue')) score+=3;
        if(s.has('Mid-back pain')||s.has('Deep ache')) score+=2;
        if(a.has('Activities requiring upright posture')||a.has('Sports participation')||a.has('Prolonged sitting')) score+=2;
        if(al.has('Rest')||al.has('Avoiding provocative movements')) score+=1;
        if(tests['Adam Forward Bend Test']==='+') score+=3;
        if(tests['Kyphosis Assessment (inclinometer)']==='+') score+=3;
        if(age) {
          if(age >= 10 && age <= 20) score+=5;
          else if(age >= 21 && age <= 40) score+=2;
          else if(age > 50) score = Math.max(0, score - 2);
        }
        if(sex === 'male') score+=1;
        return score;
      },
      edu:"Scheuermann's kyphosis is a structural thoracic deformity defined radiographically by anterior vertebral wedging ≥5° in 3 or more adjacent vertebrae, endplate irregularities, disc space narrowing, and Schmorl nodes. The kyphosis is rigid — it does not correct with positioning (differentiating it from postural kyphosis). Symptoms often diminish at skeletal maturity. Conservative PT focuses on thoracic extension mobility, back extensor and core strengthening, and postural retraining. Refer for orthopaedic evaluation if curves are severe or progressive.",
      exercises:[
        {icon:'💪', name:'Back Extensor Strengthening (prone)', sets:'3x15 reps', desc:'Key intervention to counteract progressive kyphotic deformity.', focus:'Strengthen lumbar erectors to support degenerative disc and facet joints', diagram:'prone_extension'},
        {icon:'🧘', name:'Thoracic Extension over Bolster', sets:'3x30 sec at apex of curve', desc:'Passive extension stretching at the apex of structural deformity.', focus:'Use passive load over a bolster to restore thoracic extension mobility', diagram:'thoracic_extension'},
        {icon:'🌀', name:'Thoracic Rotation Mobility', sets:'3x10 each direction', desc:'Maintains available rotation ROM which is often preserved in Scheuermann\'s.'},
        {icon:'🪑', name:'Core Stabilization', sets:'3x10 reps varied', desc:'Lumbopelvic stability to counteract compensatory lumbar hyperlordosis.', focus:'Establish deep core activation as the foundation for all movement', diagram:'dead_bug'}
      ]
    },
    {
      name: 'Thoracic Facet Joint Dysfunction',
      ageNote: 'Any age; increases with degenerative changes; prevalence 34–48% in chronic thoracic pain patients',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Mid-back pain')||s.has('Upper back pain')) score+=3;
        if(s.has('Deep ache')) score+=1;
        if(s.has('Chest wall pain')||s.has('Rib pain')) score+=1; // referred pain
        // No neurological features
        if(!s.has('Numbness') && !s.has('Tingling') && !s.has('Weakness (upper extremity)')) score+=2;
        // Penalties: neurological arm symptoms point to TOS or cervical pathology
        if(s.has('Numbness')||s.has('Tingling')||s.has('Weakness (upper extremity)')) score=Math.max(0,score-4);
        // Sharp pain with breathing is more specific to rib/costochondral injury
        if(s.has('Sharp pain with breathing')) score=Math.max(0,score-3);
        // Arm fatigue is more consistent with TOS than facet syndrome
        if(s.has('Arm fatigue')) score=Math.max(0,score-2);
        if(a.has('Extension')||a.has('Trunk rotation')) score+=3;
        if(a.has('Prolonged sitting')||a.has('Weight-bearing activities')) score+=2;
        if(al.has('Rest')||al.has('Avoiding provocative movements')) score+=2;
        if(tests['Thoracic Facet Loading (Ext + Rotation)']==='+') score+=4;
        if(tests['Segmental Mobility Testing (spring test)']==='+') score+=2;
        if(age) {
          if(age >= 50) score+=2;
          else if(age >= 40) score+=1;
        }
        return score;
      },
      edu:'Thoracic facet joint dysfunction is a recognised contributor to chronic thoracic pain and is associated with a substantial proportion of axial pain presentations in the literature. Pain is typically axial (mid or upper back), may refer to the chest wall or ribs, but lacks neurological features. Extension and ipsilateral rotation are the provocative movements. There are no reliable standalone physical exam tests — diagnosis is primarily clinical and supported by response to treatment. Manual therapy targeting the affected segments is highly effective.',
      exercises:[
        {icon:'🌀', name:'Thoracic Rotation AROM (away from pain)', sets:'2x10 reps', desc:'Mobility in non-provocative direction to maintain range.', focus:'Begin thoracic rotation in the non-painful direction to restore mobility', diagram:'seated_rotation'},
        {icon:'🪑', name:'Foam Roller Thoracic Extension', sets:'2 min at affected segments', desc:'Extension mobilization to unload facet joints and restore extension range.', focus:'Segmental thoracic extension mobilisation using body weight', diagram:'thoracic_extension'},
        {icon:'💪', name:'Scapular Retraction / Mid-Trap', sets:'3x15 reps', desc:'Improves thoracic posture and reduces sustained facet loading.', focus:'Strengthen mid-trapezius to normalise scapular position under load', diagram:'scapular_retraction'},
        {icon:'🧘', name:'Thread the Needle', sets:'3x10 each side', desc:'Rotational mobility drill targeting thoracic segments.', focus:'Mobilise thoracic rotation in quadruped — avoids end-range lumbar loading', diagram:'thread_needle'}
      ]
    }
  ],
  shoulder: [
    {
      name: 'Shoulder Impingement Syndrome (Subacromial)',
      ageNote: 'Most common cause of shoulder pain; middle-aged adults',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterolateral shoulder pain')) score+=3;
        if(s.has('Painful arc (60–120°)')) score+=3;
        if(s.has('Night pain / sleep disturbance')) score+=2;
        if(s.has('Difficulty reaching behind back')) score+=1;
        if(a.has('Overhead activities (60–120° arc)')||a.has('Arm elevation')||a.has('Repetitive overhead motion')) score+=3;
        if(al.has('Avoiding overhead activities')||al.has('Rest')) score+=2;
        if(tests['Hawkins-Kennedy Test']==='+') score+=3;
        if(tests['Neer Impingement Sign']==='+') score+=3;
        if(tests['Painful Arc Sign (60–120°)']==='+') score+=3;
        // Combination: Hawkins + painful arc + infraspinatus — positive cluster increases pattern consistency
        if(tests['Hawkins-Kennedy Test']==='+' && tests['Painful Arc Sign (60–120°)']==='+' && tests['Infraspinatus Strength Test']==='+') score+=5;
        // Penalties: impingement is a local shoulder condition — no neurological features
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-3);
        // Progressive loss of motion in all planes = adhesive capsulitis, not impingement
        if(s.has('Progressive loss of motion')&&s.has('Stiffness')) score=Math.max(0,score-3);
        // Instability/apprehension points to GHJ instability, not impingement
        if(s.has('Giving way / instability')||s.has('Apprehension')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Subacromial impingement is the most common cause of shoulder pain in adults, involving compression of the rotator cuff tendons and bursa under the acromion during arm elevation. The painful arc (60–120° abduction) is a hallmark. When Hawkins-Kennedy, painful arc, and infraspinatus weakness are all present, the clinical pattern is consistent with literature-described subacromial impingement. Rotator cuff strengthening, scapular stabilization, and posterior capsule stretching are the cornerstones of treatment.',
      exercises:[
        {icon:'💪', name:'Sidelying External Rotation', sets:'3x15 reps', desc:'Infraspinatus/teres minor strengthening — depresses humeral head and widens subacromial space.', focus:'Isolate infraspinatus and teres minor — cornerstone of RC strengthening', diagram:'sidelying_er'},
        {icon:'🏋️', name:'Scaption (Scapular Plane Elevation)', sets:'3x15 reps', desc:'Supraspinatus in safe scapular plane — avoids peak impingement zone.', focus:'Load rotator cuff in the safest plane — avoids subacromial impingement', diagram:'scapular_retraction'},
        {icon:'🔄', name:'Scapular Retraction & Depression (band)', sets:'3x15 reps', desc:'Lower and middle trapezius — restores scapular upward rotation rhythm.', focus:'Activate lower and middle trapezius to restore scapular upward rotation', diagram:'scapular_retraction'},
        {icon:'🧘', name:'Sleeper Stretch', sets:'Hold 30 sec x3', desc:'Posterior capsule stretch — reduces superior humeral head migration by improving IR.', focus:'Stretch the posterior capsule to restore internal rotation and reduce GIRD', diagram:'sleeper_stretch'}
      ]
    },
    {
      name: 'Rotator Cuff Tear',
      ageNote: 'Degenerative: >40 years; traumatic: any age; more common in males',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Weakness with lifting')||s.has('Weakness with overhead')) score+=4;
        if(s.has('Night pain / sleep disturbance')) score+=3;
        if(s.has('Anterolateral shoulder pain')||s.has('Deep shoulder pain')) score+=2;
        if(s.has('Difficulty dressing / toileting')||s.has('Difficulty reaching behind back')) score+=1;
        if(a.has('Overhead activities (60–120° arc)')||a.has('Lifting above shoulder level')||a.has('Reaching behind back')) score+=2;
        if(al.has('Rest')||al.has('Avoiding overhead activities')) score+=1;
        if(tests['External Rotation Lag Test']==='+') score+=5;
        if(tests['Internal Rotation Lag Test']==='+') score+=5;
        if(tests['Drop Arm Test']==='+') score+=4;
        if(tests['Painful Arc Sign (60–120°)']==='+') score+=3;
        if(tests['Empty Can Test (Jobe)']==='+') score+=2;
        if(tests['Lift-Off Test']==='+') score+=3;
        if(age) {
          if(age >= 60) score+=3;
          else if(age >= 50) score+=2;
          else if(age >= 40) score+=1;
        }
        if(sex === 'male') score+=1;
        // Penalties: neurological features suggest radiculopathy or TOS, not rotator cuff
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-4);
        if(s.has('Radiating pain (arm)')) score=Math.max(0,score-3);
        // Progressive global stiffness = adhesive capsulitis, not RC tear
        if(s.has('Progressive loss of motion')&&s.has('Stiffness')) score=Math.max(0,score-3);
        // Instability/apprehension = GHJ instability, not RC tear
        if(s.has('Apprehension')||s.has('Giving way / instability')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Rotator cuff tears range from partial to full-thickness and can be degenerative (insidious, >40 years) or traumatic (any age, often with acute event). The external rotation lag test and internal rotation lag test are among the most clinically meaningful findings associated with full-thickness rotator cuff disruption. Passive ROM is often preserved despite reduced active ROM. Conservative PT (progressive RC loading, scapular stability) is first-line for partial tears; refer for surgical evaluation if full-thickness tear with significant weakness or failed 3 months of PT.',
      exercises:[
        {icon:'💪', name:'Isometric ER & ABD (pain-free angles)', sets:'3x10 sec holds', desc:'Early tendon loading — isometrics reduce pain and begin strength recovery.', focus:'Pain-free isometric loading to maintain RC activation during acute phase', diagram:'sidelying_er'},
        {icon:'🔄', name:'Pendulum Exercises', sets:'2 min each direction', desc:'Gentle distraction and passive mobility for irritable phase.', focus:'Use gravity to provide gentle GH joint distraction and passive mobility', diagram:'pendulum'},
        {icon:'🏋️', name:'Scapular Plane ABD (to pain-free range)', sets:'3x15 reps', desc:'Progressive supraspinatus loading in safe scapular plane.', focus:'Maintain shoulder mobility within the pain-free arc', diagram:'scapular_retraction'},
        {icon:'🧘', name:'Sidelying ER → Standing ER with Band', sets:'3x15 reps, progressive load', desc:'Full rotator cuff progression — progress load as strength and pain allow.', focus:'Progress external rotation strengthening to functional loaded positions', diagram:'clamshell'}
      ]
    },
    {
      name: 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)',
      ageNote: 'Middle-aged adults; accounts for 65% of all shoulder pain visits',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterolateral shoulder pain')) score+=3;
        if(s.has('Painful arc (60–120°)')) score+=2;
        // Tendinopathy: pain without significant weakness distinguishes from tear
        if(!s.has('Weakness with lifting') && !s.has('Weakness with overhead')) score+=2;
        // Penalties: significant weakness suggests tear not tendinopathy
        if(s.has('Weakness with lifting')&&s.has('Weakness with overhead')) score=Math.max(0,score-3);
        // Neurological features suggest cervical radiculopathy or TOS
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-4);
        if(s.has('Radiating pain (arm)')) score=Math.max(0,score-3);
        // Progressive loss of motion = adhesive capsulitis
        if(s.has('Progressive loss of motion')) score=Math.max(0,score-3);
        if(a.has('Repetitive overhead motion')||a.has('Overhead activities (60–120° arc)')) score+=3;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        if(tests['Hawkins-Kennedy Test']==='+') score+=3;
        if(tests['Neer Impingement Sign']==='+') score+=2;
        if(tests['Empty Can Test (Jobe)']==='+') score+=2;
        // Lag tests negative helps differentiate from tear
        if(tests['External Rotation Lag Test']==='-') score+=2;
        if(tests['Drop Arm Test']==='-') score+=2;
        if(age) {
          if(age >= 40 && age <= 60) score+=2;
        }
        return score;
      },
      edu:'RC tendinopathy (without tear) accounts for the majority of shoulder pain presentations. Pain is anterolateral, worsened by overhead activity, with gradual onset. Strength is typically diminished by pain rather than structural deficit — lag tests should be negative. No single test is definitive; use a combination of history, Hawkins-Kennedy, Neer, and empty can. Progressive tendon loading (isometric → isotonic → functional) is the evidence-based treatment; avoid complete rest.',
      exercises:[
        {icon:'💪', name:'Isometric RC Loading (all planes)', sets:'5x45 sec holds', desc:'Pain-modulating isometrics — start at moderate effort in pain-free positions.', focus:'Multi-plane isometric stimulus to maintain rotator cuff capacity', diagram:'sidelying_er'},
        {icon:'🔄', name:'Isotonic ER / IR Progression (band)', sets:'3x15 reps', desc:'Progress from isometrics when pain <3/10 — slow, controlled tempo.', focus:'Progress to dynamic RC loading through the full available range', diagram:'sidelying_er'},
        {icon:'🏋️', name:'Scaption to 90° (progressive load)', sets:'3x15 reps', desc:'Functional supraspinatus loading — key for overhead return.', focus:'Progress scapular plane elevation load as shoulder stability improves', diagram:'scapular_retraction'},
        {icon:'🧘', name:'Posterior Capsule Stretch (sleeper)', sets:'Hold 30 sec x3', desc:'Reduces GIRD (glenohumeral IR deficit) — major modifiable contributor to RC tendinopathy.', focus:'Target glenohumeral posterior capsule in the most effective position', diagram:'sleeper_stretch'}
      ]
    },
    {
      name: 'Subacromial Bursitis',
      ageNote: 'Any age; often accompanies rotator cuff pathology',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterolateral shoulder pain')) score+=3;
        if(s.has('Painful arc (60–120°)')) score+=3;
        if(s.has('Night pain / sleep disturbance')) score+=2;
        if(a.has('Arm elevation')||a.has('Overhead activities (60–120° arc)')||a.has('Repetitive overhead motion')) score+=3;
        if(al.has('Rest')||al.has('Ice')) score+=2;
        if(tests['Hawkins-Kennedy Test']==='+') score+=3;
        if(tests['Neer Impingement Sign']==='+') score+=3;
        // Bursitis is clinically indistinguishable from impingement — very similar scoring
        if(tests['External Rotation Lag Test']==='-') score+=2; // helps differentiate from tear
        // Penalties: progressive loss of motion in all planes = capsulitis, not bursitis
        if(s.has('Progressive loss of motion')&&s.has('Stiffness')) score=Math.max(0,score-3);
        // Instability/apprehension points to instability, not bursitis
        if(s.has('Giving way / instability')||s.has('Apprehension')) score=Math.max(0,score-3);
        // Neurological symptoms point to radiculopathy or TOS
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-3);
        if(tests['Drop Arm Test']==='-') score+=2;
        return score;
      },
      edu:'Subacromial bursitis is often clinically indistinguishable from impingement syndrome and frequently coexists with rotator cuff pathology. Diagnostic injection (corticosteroid + local anaesthetic) can help differentiate — complete pain relief suggests predominantly bursal involvement. The same tests (Hawkins-Kennedy, Neer, painful arc) are positive. Acute management includes ice and activity modification; subacute treatment mirrors impingement rehabilitation.',
      exercises:[
        {icon:'🧊', name:'Ice / Cryotherapy', sets:'10–15 min x3 daily', desc:'Reduces acute bursal inflammation — most effective in the first 48–72 hours.', focus:'Reduce acute inflammation and provide analgesia in the first 48–72 hours', diagram:'walking'},
        {icon:'🔄', name:'Pendulum / Codman Exercises', sets:'2 min each direction', desc:'Gentle distraction movement to prevent stiffness without loading the bursa.', focus:'Gravity-assisted shoulder distraction — safe first mobilisation after frozen shoulder or surgery', diagram:'pendulum'},
        {icon:'💪', name:'Scapular Stabilization (no overhead)', sets:'3x15 reps', desc:'Improve subacromial space through scapular positioning — avoid overhead loading until inflammation settles.', focus:'Restore scapular stability without provocative overhead loading', diagram:'scapular_retraction'},
        {icon:'🏋️', name:'Progressive RC Strengthening (as tolerated)', sets:'3x15 reps', desc:'Transition to full impingement protocol once acute inflammation resolves.', focus:'Progressively load the rotator cuff as pain and range allow', diagram:'sidelying_er'}
      ]
    },
    {
      name: 'Labral Tear (SLAP)',
      ageNote: 'Young athletes in overhead sports; traumatic or repetitive microtrauma',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Deep shoulder pain')) score+=3;
        if(s.has('Clicking / popping / catching')) score+=3;
        if(s.has('Giving way / instability')) score+=2;
        if(s.has('Anterolateral shoulder pain')) score+=1;
        if(a.has('Throwing / sport activities')||a.has('Throwing / sport activities')) score+=4;
        if(a.has('Repetitive overhead motion')||a.has('Overhead activities (60–120° arc)')) score+=2;
        if(al.has('Rest')||al.has('Avoiding provocative positions')) score+=1;
        // Penalties: progressive global stiffness = capsulitis not SLAP
        if(s.has('Progressive loss of motion')&&s.has('Stiffness')) score=Math.max(0,score-4);
        // Neurological features point to TOS or cervical radiculopathy
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-3);
        // Night pain and significant weakness more consistent with RC tear
        if(s.has('Night pain / sleep disturbance')&&s.has('Weakness with overhead')) score=Math.max(0,score-2);
        if(tests['Dynamic Labral Shear Test']==='+') score+=6;
        if(tests['O\'Brien Active Compression Test']==='+') score+=4;
        if(tests['Crank Test']==='+') score+=3;
        if(tests['Anterior Slide Test']==='+') score+=2;
        if(age) {
          if(age >= 15 && age <= 35) score+=2;
        }
        return score;
      },
      edu:'SLAP tears involve the superior labrum from anterior to posterior at the biceps anchor. Deep shoulder pain, mechanical symptoms (clicking/catching), and instability with overhead throwing are hallmarks. The dynamic labral shear test is a commonly used provocative test associated with superior labral pathology; the O\'Brien test is a widely used screening tool, and combining it with the crank test is consistent with patterns described in the literature for increasing labral detection. Conservative PT (RC strengthening, posterior capsule stretching, scapular stability) is first-line; surgical repair considered if conservative management fails after 3–6 months.',
      exercises:[
        {icon:'💪', name:'RC Strengthening (below 90°)', sets:'3x15 reps each direction', desc:'Rebuild RC strength to reduce superior labral load — avoid provocative end-range initially.', focus:'Load rotator cuff below the painful arc to avoid subacromial provocation', diagram:'sidelying_er'},
        {icon:'🧘', name:'Posterior Capsule Stretch (sleeper)', sets:'Hold 30 sec x3', desc:'GIRD is a major risk factor for SLAP tears in throwers — must address.', focus:'Target glenohumeral posterior capsule in the most effective position', diagram:'sleeper_stretch'},
        {icon:'🔄', name:'Scapular Stability Training', sets:'3x15 reps each', desc:'Serratus anterior and lower trap activation to restore scapular upward rotation.', focus:'Build dynamic scapular control to optimise the subacromial space', diagram:'scapular_retraction'},
        {icon:'🏋️', name:'Interval Throwing Program (return phase)', sets:'Graded volume/intensity', desc:'Structured return to throwing — only after full strength and pain-free overhead ROM restored.', focus:'Final phase of throwing progression targeting sport-specific velocity and volume', diagram:'walking'}
      ]
    },
    {
      name: 'Glenohumeral Instability / Dislocation',
      ageNote: 'Peak 15–25 years; males > females; recurrence up to 92% in young athletes',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Giving way / instability')) score+=5;
        if(s.has('Apprehension')) score+=4;
        if(s.has('Clicking / popping / catching')) score+=2;
        if(s.has('Pain radiating down arm / biceps')) score+=1;
        if(a.has('Abduction + external rotation')||a.has('Throwing / sport activities')) score+=3;
        if(a.has('Overhead activities (60–120° arc)')) score+=1;
        if(al.has('Immobilization (acute instability)')||al.has('Avoiding provocative positions')) score+=3;
        if(tests['Apprehension Test']==='+') score+=5;
        if(tests['Relocation Test']==='+') score+=3;
        if(tests['Release Test (Surprise Test)']==='+') score+=4; // most predictive
        if(tests['Load and Shift Test']==='+') score+=4;
        if(tests['Sulcus Sign']==='+') score+=3;               // ≥2cm = MDI
        if(age) {
          if(age >= 15 && age <= 25) score+=3;
          else if(age >= 26 && age <= 35) score+=1;
        }
        if(sex === 'male') score+=1;
        // Penalties: progressive global stiffness = capsulitis, not instability
        if(s.has('Progressive loss of motion')&&s.has('Stiffness')&&!s.has('Apprehension')) score=Math.max(0,score-4);
        // Neurological features suggest radiculopathy or TOS, not GHJ instability
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-3);
        // Significant weakness without instability = RC tear pattern
        if(s.has('Weakness with lifting')&&s.has('Weakness with overhead')&&!s.has('Apprehension')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Anterior glenohumeral instability is the most common direction of shoulder instability, typically occurring with abduction and external rotation (e.g., tackling, fall on outstretched arm). Recurrence rates are high in young, active patients — surgical stabilisation should be discussed early in this population. The apprehension test and release test are among the most clinically informative tests when positive. MDI is suggested by a positive sulcus sign with significant inferior translation. Rehabilitation focuses on dynamic stabilizers (subscapularis, infraspinatus) and proprioceptive retraining.',
      exercises:[
        {icon:'💪', name:'Subscapularis Strengthening (IR)', sets:'3x15 reps, progressive load', desc:'Primary dynamic stabiliser against anterior translation — sidelying IR, belly press.', focus:'Target the anterior stabiliser of the GH joint to restore dynamic stability', diagram:'sidelying_er'},
        {icon:'🔄', name:'Rhythmic Stabilization (IR/ER)', sets:'3x30 sec', desc:'Dynamic neuromuscular stability with therapist perturbation.', focus:'Develop co-contraction and reactive RC stability for overhead demands', diagram:'sidelying_er'},
        {icon:'🧘', name:'Proprioceptive Ball Rolling on Wall', sets:'2x60 sec each position', desc:'Joint position sense retraining — progress from stable to unstable surfaces.', focus:'Restore shoulder proprioception and dynamic stability through reactive ball contact', diagram:'single_leg_balance'},
        {icon:'🌀', name:'Progressive Sport-Specific Loading', sets:'Graded return', desc:'Throwing, contact, or overhead sport mechanics — only after full RC strength and proprioception restored.', focus:'Progressively introduce the specific demands of the patient target activity', diagram:'squat'}
      ]
    },
    {
      name: 'Adhesive Capsulitis (Frozen Shoulder)',
      ageNote: '40–60 years; more common in females (2–5% prevalence); higher risk with diabetes and hypothyroidism',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Progressive loss of motion')) score+=5;
        if(s.has('Stiffness')) score+=3;
        if(s.has('Night pain / sleep disturbance')) score+=2;
        if(s.has('Deep shoulder pain')) score+=2;
        if(s.has('Difficulty dressing / toileting')||s.has('Difficulty reaching behind back')) score+=2;
        if(a.has('Dressing / toileting')||a.has('Reaching behind back')) score+=2;
        if(al.has('Avoiding end-range movements')||al.has('Rest')) score+=2;
        // Global passive ROM restriction is the diagnostic hallmark
        if(tests['Global Passive ROM Assessment']==='+') score+=6;
        // No specific provocative tests — penalise if SLAP/instability tests positive
        if(tests['Apprehension Test']==='-') score+=1;
        // Penalties: instability/giving way is the opposite of frozen shoulder (which is stiff, not unstable)
        if(s.has('Giving way / instability')||s.has('Apprehension')) score=Math.max(0,score-5);
        // Acute traumatic onset is not consistent with adhesive capsulitis
        if(s.has('Ecchymosis (acute)')) score=Math.max(0,score-3);
        // Neurological features suggest TOS or cervical radiculopathy
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-3);
        if(tests['O\'Brien Active Compression Test']==='-') score+=1;
        if(age) {
          if(age >= 40 && age <= 60) score+=3;
          else if(age < 35 || age > 70) score=Math.max(0, score-2);
        }
        if(sex === 'female') score+=2;
        return score;
      },
      edu:'Adhesive capsulitis presents in 3 phases: freezing (increasing pain, early stiffness), frozen (reduced pain but severe stiffness), and thawing (gradual ROM return). The diagnostic hallmark is global restriction of BOTH active and passive ROM, with greatest loss in passive ER at the side. Most cases resolve in 1–3 years but residual stiffness is common. Risk is significantly higher with diabetes and hypothyroidism. Treatment includes mobilisation, stretching, and corticosteroid injection for the painful freezing phase; hydrodilation is an option for frozen phase.',
      exercises:[
        {icon:'🌀', name:'Pendulum / Codman Exercises', sets:'2 min each direction', desc:'Gravity-assisted distraction mobilisation — critical in all phases.', focus:'Gravity-assisted shoulder distraction — safe first mobilisation after frozen shoulder or surgery', diagram:'pendulum'},
        {icon:'🧘', name:'Progressive Passive Stretching (ER priority)', sets:'3x30 sec holds, all planes', desc:'ER at side is the primary target — most restricted motion in adhesive capsulitis.', focus:'Systematically restore capsular range with ER prioritised throughout', diagram:'wand_exercise'},
        {icon:'🔄', name:'Active-Assisted ROM (pulley / wand)', sets:'3x10 reps all planes', desc:'Maintain and progressively restore ROM across all phases.', focus:'Use the uninjured arm to guide the injured shoulder through greater range', diagram:'wand_exercise'},
        {icon:'💪', name:'RC Strengthening (pain-free range)', sets:'3x15 reps', desc:'Maintain strength through restricted range — prevent atrophy during frozen phase.', focus:'Maintain rotator cuff activation within non-provocative range', diagram:'sidelying_er'}
      ]
    },
    {
      name: 'Biceps Tendinopathy (Long Head)',
      ageNote: 'Middle-aged adults; commonly associated with rotator cuff pathology or SLAP lesion',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterolateral shoulder pain')||s.has('Deep shoulder pain')) score+=2;
        if(s.has('Pain radiating down arm / biceps')) score+=4;
        if(a.has('Repetitive overhead motion')||a.has('Overhead activities (60–120° arc)')) score+=2;
        if(al.has('Rest')||al.has('Avoiding provocative positions')) score+=1;
        if(tests['Bicipital Groove Tenderness']==='+') score+=4;
        if(tests['Upper Cut Test']==='+') score+=4;
        if(tests['Speed\'s Test']==='+') score+=3;
        if(tests['Yergason\'s Test']==='+') score+=3;
        // Combination of upper cut + bicipital groove tenderness is optimal
        if(tests['Upper Cut Test']==='+' && tests['Bicipital Groove Tenderness']==='+') score+=3;
        // Penalties: progressive global stiffness = capsulitis, not biceps tendinopathy
        if(s.has('Progressive loss of motion')&&s.has('Stiffness')) score=Math.max(0,score-3);
        // Neurological features point to cervical radiculopathy
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-3);
        // Instability is not a feature of biceps tendinopathy
        if(s.has('Giving way / instability')||s.has('Apprehension')) score=Math.max(0,score-3);
        if(age) {
          if(age >= 40 && age <= 60) score+=2;
        }
        return score;
      },
      edu:'LHB tendinopathy presents as deep, throbbing anterior shoulder pain often radiating down the biceps. The bicipital groove is tender with the arm in 10° IR. Importantly, LHB tendinopathy is commonly associated with rotator cuff pathology or SLAP lesion — always evaluate the full shoulder. The upper cut test combined with bicipital groove tenderness is a well-supported clinical combination. Speed\'s and Yergason\'s are commonly used confirmatory tests. Progressive biceps and RC loading is the primary treatment.',
      exercises:[
        {icon:'💪', name:'Isometric Biceps Loading (elbow 90°)', sets:'5x10 sec holds', desc:'Pain-modulating isometrics — start in position of comfort before progressing.', focus:'Isometric biceps stimulus to control pain before dynamic loading', diagram:'elbow_flexion'},
        {icon:'🔄', name:'Eccentric Bicep Curls', sets:'3x15 slow eccentric', desc:'Tendon remodeling loading — slow 3–4 sec lowering phase.', focus:'Eccentric loading to drive biceps tendon adaptation and restore strength', diagram:'elbow_flexion'},
        {icon:'🏋️', name:'RC Strengthening (concurrent)', sets:'3x15 reps', desc:'Address the associated RC pathology that commonly co-exists with LHB tendinopathy.', focus:'Address concurrent rotator cuff involvement alongside primary pathology', diagram:'sidelying_er'},
        {icon:'🧘', name:'Posterior Capsule Stretch', sets:'Hold 30 sec x3', desc:'Reduces anterior shoulder translation that loads the biceps anchor.', focus:'Address posterior capsular tightness contributing to anterior superior migration', diagram:'sleeper_stretch'}
      ]
    },
    {
      name: 'AC Joint Osteoarthritis / Dysfunction',
      ageNote: 'Middle-aged adults; most common AC joint disorder',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Superior shoulder pain')||s.has('Pain at AC joint')) score+=5;
        if(s.has('Anterolateral shoulder pain')) score+=1;
        if(a.has('Cross-body / horizontal adduction')||a.has('Cross-body / horizontal adduction')) score+=4;
        if(a.has('Overhead activities (60–120° arc)')||a.has('Side lying on affected shoulder')) score+=2;
        if(al.has('Avoiding provocative positions')||al.has('Rest')) score+=2;
        // Penalties: AC joint is a local condition — no neurological features
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-4);
        // Progressive motion loss = capsulitis
        if(s.has('Progressive loss of motion')) score=Math.max(0,score-3);
        // Instability/apprehension points to GHJ, not AC joint
        if(s.has('Giving way / instability')||s.has('Apprehension')) score=Math.max(0,score-3);
        if(tests['AC Joint Palpation / Tenderness']==='+') score+=5;
        if(tests['Cross-Body Adduction Test']==='+') score+=4;
        if(tests['Paxinos Test']==='+') score+=4;
        if(age) {
          if(age >= 40) score+=2;
          else if(age >= 30) score+=1;
        }
        return score;
      },
      edu:'AC joint OA is the most common AC joint disorder and presents with anterior/superior shoulder pain localised to the AC joint, worsened by cross-body adduction and overhead activity. AC joint tenderness is a clinically meaningful and commonly used finding; the Paxinos test adds useful information when positive. Diagnostic local anaesthetic injection helps confirm the AC joint as the primary pain source. A positive Paxinos test combined with confirmatory imaging increases clinical confidence in the diagnosis. Conservative treatment includes activity modification and AC joint mobilisation; corticosteroid injection is effective for persistent symptoms.',
      exercises:[
        {icon:'🔄', name:'Scapular Retraction & Postural Correction', sets:'3x15 reps + sustained posture', desc:'Reduces AC joint compressive loading from rounded shoulder posture.', focus:'Correct scapular dyskinesis to reduce rotator cuff impingement', diagram:'scapular_retraction'},
        {icon:'💪', name:'RC Strengthening (avoid cross-body)', sets:'3x15 reps each direction', desc:'Maintain rotator cuff strength — modify to avoid horizontal adduction provocation.', focus:'Strengthen RC while avoiding compressive AC joint loading positions', diagram:'sidelying_er'},
        {icon:'🧘', name:'Pectoralis Minor Stretch', sets:'Hold 30 sec x3', desc:'Releases anterior shoulder tightness contributing to AC joint loading.', focus:'Open the costoclavicular space and reduce pectoralis minor neural compression', diagram:'pec_stretch'},
        {icon:'🌀', name:'Gradual Return to Overhead / Cross-Body', sets:'Progressive load', desc:'Graded reintroduction of provocative movements as symptoms settle.', focus:'Structured reintroduction of shoulder demand after injury', diagram:'walking'}
      ]
    },
    {
      name: 'Glenohumeral Osteoarthritis',
      ageNote: 'Most common >60 years; more common in women; prevalence 94% in women >80 years',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Progressive loss of motion')) score+=4;
        if(s.has('Stiffness')) score+=3;
        if(s.has('Deep shoulder pain')) score+=2;
        if(s.has('Clicking / popping / catching')) score+=1; // crepitus
        if(a.has('Overhead activities (60–120° arc)')||a.has('Arm elevation')) score+=2;
        if(al.has('Rest')||al.has('Avoiding provocative positions')) score+=2;
        if(tests['Global Passive ROM Assessment']==='+') score+=4;
        if(age) {
          if(age >= 70) score+=5;
          else if(age >= 60) score+=4;
          else if(age >= 50) score+=2;
          else if(age < 45) score=Math.max(0, score-3);
        }
        if(sex === 'female') score+=1;
        // Penalties: instability/apprehension = GHJ instability, not OA
        if(s.has('Apprehension')||s.has('Giving way / instability')) score=Math.max(0,score-3);
        // Neurological features suggest radiculopathy or TOS
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-3);
        // No crepitus or stiffness makes GH OA unlikely
        if(!s.has('Stiffness')&&!s.has('Clicking / popping / catching')&&!s.has('Progressive loss of motion')) score=Math.max(0,score-3);
        return score;
      },
      edu:'GH OA presents with progressive pain and stiffness over months to years, with global passive ROM restriction (greatest in external rotation) and possible crepitus. Prevalence increases substantially with age, particularly in older women. Radiographs show joint space narrowing, osteophytes, and posterior humeral head subluxation. There are no pathognomonic provocative tests — diagnosis is clinical combined with radiographic assessment. Conservative PT (mobility, RC strengthening, activity modification) is first-line; total shoulder arthroplasty is highly effective when conservative management fails.',
      exercises:[
        {icon:'🌀', name:'Pendulum & Active-Assisted ROM', sets:'2 min + 3x10 reps each direction', desc:'Maintain available ROM and prevent further capsular contracture.', focus:'Combine gravity-assisted distraction with guided range progression', diagram:'pendulum'},
        {icon:'💪', name:'RC Strengthening (pain-free range)', sets:'3x15 reps', desc:'Maintain dynamic joint stability and slow functional decline.', focus:'Maintain rotator cuff activation within non-provocative range', diagram:'sidelying_er'},
        {icon:'🧘', name:'ER Stretching at Side (towel/wand)', sets:'Hold 30 sec x3', desc:'Priority stretch — ER is the most restricted motion in GH OA.', focus:'Prioritise external rotation — the most restricted plane in adhesive capsulitis', diagram:'wand_exercise'},
        {icon:'🚲', name:'Aquatic / Low-Load Functional Activities', sets:'20–30 min', desc:'Buoyancy reduces GH compressive load — ideal for pain-limited patients.', focus:'Restore functional movement patterns with reduced joint loading', diagram:'walking'}
      ]
    },
    {
      name: 'Scapular Dyskinesis',
      ageNote: 'Common in athletes and patients with shoulder pathology; any age',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterolateral shoulder pain')) score+=2;
        if(s.has('Giving way / instability')) score+=2;
        if(s.has('Difficulty reaching behind back')) score+=1;
        if(a.has('Overhead activities (60–120° arc)')||a.has('Repetitive overhead motion')) score+=3;
        if(al.has('Rest')) score+=1;
        if(tests['Scapular Assistance Test']==='+') score+=5;
        if(tests['Scapular Retraction Test']==='+') score+=4;
        if(tests['Scapular Position / Winging Observation']==='+') score+=3;
        // Penalties: neurological symptoms (numbness/tingling) point away from pure dyskinesis
        if(s.has('Paresthesias (C8/T1 distribution)')||s.has('Numbness')) score=Math.max(0,score-3);
        // Instability/apprehension = GHJ instability, not scapular dysfunction
        if(s.has('Apprehension')||s.has('Giving way / instability')) score=Math.max(0,score-2);
        // Progressive global stiffness = capsulitis
        if(s.has('Progressive loss of motion')&&s.has('Stiffness')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Scapular dyskinesis refers to abnormal scapular position or motion — typically protraction at rest and abnormal upward rotation rhythm during arm elevation. It is rarely an isolated diagnosis; it is usually secondary to shoulder pathology, thoracic stiffness, or RC dysfunction. The scapular assistance test (symptoms improve with manual upward rotation assistance) is key for diagnosis and treatment planning. Scapular stabilizer strengthening and thoracic mobility are the primary treatments.',
      exercises:[
        {icon:'💪', name:'Lower Trap Strengthening (prone Y)', sets:'3x15 reps', desc:'Primary scapular depressor and upward rotator — cornerstone of dyskinesis rehab.', focus:'Activate lower trapezius in its most effective position for upward rotation', diagram:'prone_y'},
        {icon:'🔄', name:'Wall Slides (serratus activation)', sets:'3x15 reps', desc:'Serratus anterior — restores scapular protraction control and upward rotation.', focus:'Activate serratus anterior to restore protraction and upward scapular rotation', diagram:'wall_slides'},
        {icon:'🌀', name:'Thoracic Rotation Mobility', sets:'3x10 each direction', desc:'Thoracic restriction is a primary driver of scapular dyskinesis.', focus:'Maintain thoracic rotation range to reduce compensatory load on adjacent structures', diagram:'seated_rotation'},
        {icon:'🧘', name:'Prone Y-T-W', sets:'3x10 each position', desc:'Comprehensive lower trap, mid-trap, and rhomboid activation for scapular stability.', focus:'Comprehensively load the scapular stabiliser complex in prone', diagram:'prone_y'}
      ]
    }
  ,
    {
      name: 'Sternoclavicular (SC) Joint Sprain or Disruption',
      ageNote: 'Any age; anterior dislocation most common; posterior dislocation is a surgical emergency',
      match:(s,a,al,obj,tests,age,sex) => {
        let score = 0;
        // SC joint pain is anteromedial chest / base-of-neck — highly specific location
        if(s.has('Anteromedial chest pain')||s.has('Pain at base of neck')) score+=4;
        if(s.has('Localised anterior chest wall pain')) score+=3;
        // Mechanism: direct blow, fall on outstretched hand, compressive force on shoulder
        if(a.has('Overhead activities')||a.has('Arm elevation')) score+=2;
        if(s.has('Visible swelling / deformity at SC joint')) score+=5;
        if(s.has('Crepitus')) score+=1;
        // Aggravating movements
        if(a.has('Cross-body / horizontal adduction')||a.has('Reaching forward')) score+=2;
        // Palpation / provocation
        if(tests['SC Joint Palpation (direct tenderness)']==='+') score+=5;
        if(tests['Shoulder Horizontal Adduction Provocation']==='+') score+=3;
        // Posterior dislocation red flag — dysphagia, stridor, venous congestion
        if(s.has('Difficulty swallowing')||s.has('Shortness of breath')||s.has('Hoarse voice')) score+=4;
        // Penalise if symptoms are lateral — suggests AC or RC
        if(s.has('Lateral shoulder pain')||s.has('Deltoid region pain')) score=Math.max(0,score-3);
        if(tests['Hawkins-Kennedy Test']==='+') score=Math.max(0,score-2);
        return score;
      },
      edu:'The SC joint is the only bony articulation between the upper limb and the axial skeleton and is frequently overlooked in shoulder assessments. Anterior SC dislocations are most common and present with a visible anterior prominence at the medial clavicle, localised tenderness, and pain with shoulder elevation and horizontal adduction. POSTERIOR SC dislocation is a rare but life-threatening emergency — posterior displacement can compress the trachea, great vessels, or oesophagus causing dysphagia, stridor, or venous congestion. Any suspicion of posterior dislocation requires immediate emergency referral. Imaging with CT is the gold standard for SC joint assessment as plain X-ray has poor sensitivity. Mild sprains are managed conservatively; significant dislocations require orthopaedic management.',
      exercises:[
        {icon:'🌀', name:'Scapular Retraction and Depression', sets:'3x15 reps', desc:'Restores scapular control and unloads the SC joint via improved kinetic chain alignment.', focus:'Restore scapular stability and reduce compressive load at SC joint', diagram:'seated_rotation'},
        {icon:'💪', name:'Isometric Shoulder Stabilisation', sets:'3x10 sec holds', desc:'Low-load isometric shoulder exercises within pain-free range while SC joint heals.', focus:'Maintain upper limb muscle activity without stressing the SC joint', diagram:'shoulder_er'},
        {icon:'🧘', name:'Postural Correction and Thoracic Extension', sets:'3x10 reps', desc:'Thoracic mobility work to reduce forward head posture loading on the SC complex.', focus:'Reduce compressive SC joint loading via thoracic mobility and posture', diagram:'prone_y'}
      ]
    }
  ],
  knee: [
    {
      name: 'Knee Osteoarthritis (Knee Arthritis)',
      ageNote: 'Most common ≥45 years; rare under 30',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Crepitus')||s.has('Bony enlargement')) score+=3;
        if(s.has('Morning stiffness (<30 min)')||s.has('Swelling/effusion')) score+=2;
        if(s.has('Deep ache')||s.has('Night pain')) score+=1;
        if(a.has('Weight-bearing activities')||a.has('Prolonged walking')||a.has('Ascending stairs')||a.has('Descending stairs')) score+=2;
        if(a.has('Squatting')||a.has('Kneeling')) score+=1;
        if(al.has('Rest')||al.has('Activity modification')) score+=1;
        if(tests['Patellar Grind / Clarke\'s Sign']==='+') score+=1;
        // Age weighting: OA is rare under 40, common over 55
        if(age) {
          if(age >= 65) score+=4;
          else if(age >= 55) score+=3;
          else if(age >= 45) score+=2;
          else if(age >= 40) score+=1;
          else if(age < 35) score = Math.max(0, score - 3);
        }
        // Penalties: acute locking/giving way suggests meniscal/ligament injury, not OA
        if(s.has('Locking')&&!s.has('Crepitus')) score=Math.max(0,score-3);
        // Neurological features point to lumbar radiculopathy
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-3);
        // Marked instability is more consistent with ligament injury
        if(s.has('Giving way/instability')&&!s.has('Deep ache')&&!s.has('Crepitus')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Knee osteoarthritis involves breakdown of joint cartilage and is the most common musculoskeletal condition in adults over 45. Morning stiffness lasting less than 30 minutes and crepitus are hallmark signs. Exercise therapy is the most evidence-based treatment — the joint needs movement to stay healthy. Weight loss (if applicable), aquatic therapy, and activity modification are also beneficial.',
      exercises:[
        {icon:'🚲', name:'Stationary Cycling', sets:'15–20 min, low resistance', desc:'Joint-friendly aerobic exercise that maintains ROM and builds quad strength without impact.', focus:'Low-impact aerobic activity that avoids provocative extension or impact', diagram:'cycling'},
        {icon:'💪', name:'Quad Sets', sets:'3x15, 10 sec hold', desc:'Isometric quad activation to reduce pain and maintain strength.', focus:'Re-establish VMO activation and reduce inhibitory pain arc', diagram:'quad_set'},
        {icon:'🌉', name:'Seated Leg Press (partial range)', sets:'3x15', desc:'Closed-chain strengthening within comfortable range.', focus:'Re-establish knee extensor strength with reduced patellofemoral stress', diagram:'leg_press'},
        {icon:'🧘', name:'Aquatic Walking / Pool Therapy', sets:'20–30 min', desc:'Buoyancy reduces joint load while allowing full movement and strength work.', focus:'Reduce joint load while maintaining aerobic and movement conditioning', diagram:'walking'}
      ]
    },
    {
      name: 'Patellofemoral Pain Syndrome (Runner\'s Knee)',
      ageNote: 'Peak incidence 16–25 years; can occur up to ~40 years',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior knee pain')) score+=3;
        if(s.has('Stiffness after sitting')) score+=2;
        if(s.has('Crepitus')) score+=1;
        if(a.has('Squatting')) score+=3;
        if(a.has('Prolonged sitting')||a.has('Descending stairs')||a.has('Running')||a.has('Repetitive knee flexion/extension')) score+=2;
        if(a.has('Kneeling')) score+=1;
        if(al.has('Rest')||al.has('Activity modification')) score+=1;
        if(tests['Patellar Grind / Clarke\'s Sign']==='+') score+=2;
        if(tests['Patellar Compression Test']==='+') score+=2;
        if(tests['Single-Leg Squat Assessment']==='+') score+=2;
        // Peak incidence 16–25; more common in females
        if(age) {
          if(age >= 16 && age <= 25) score+=3;
          else if(age >= 26 && age <= 40) score+=1;
          else if(age > 50) score = Math.max(0, score - 2);
        }
        if(sex === 'female') score+=2;
        return score;
      },
      edu:'PFPS causes anterior or peripatellar knee pain due to abnormal patellofemoral stress, often from quad weakness, hip weakness, or poor patellar tracking. The "theater sign" (pain with prolonged sitting) is a classic clue. Avoid provocative activities initially, but progressive loading is essential for recovery.',
      exercises:[
        {icon:'💪', name:'VMO Quad Sets (slight knee bend)', sets:'3x15, 10 sec hold', desc:'Targeted VMO activation — key muscle for patellar tracking.', focus:'Preferentially activate VMO at slight flexion to restore patellar tracking', diagram:'quad_set'},
        {icon:'🦵', name:'Hip Abduction & ER Strengthening', sets:'3x20 each', desc:'Glute med and ER weakness are major contributors to PFPS via femoral adduction.', focus:'Target the posterior gluteal footprint to offload compressive tendon forces', diagram:'clamshell'},
        {icon:'🌀', name:'Terminal Knee Extension (TKE)', sets:'3x20', desc:'VMO activation at terminal range with resistance band.', focus:'Activate VMO in terminal extension to restore full active extension', diagram:'tke'},
        {icon:'🧘', name:'Step-Downs (eccentric control)', sets:'3x10 slow', desc:'Controlled eccentric quad loading for functional carry-over.', focus:'Train eccentric quadriceps control through functional descent', diagram:'step_down'}
      ]
    },
    {
      name: 'Patellar Tendinopathy (Jumper\'s Knee)',
      ageNote: 'Athletes in jumping sports (basketball, volleyball); any age',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Tenderness at patellar tendon')) score+=4;
        if(s.has('Anterior knee pain')||s.has('Sharp pain')) score+=1;
        if(a.has('Jumping/landing')||a.has('Running')) score+=3;
        if(a.has('Squatting')||a.has('Kneeling')||a.has('Repetitive knee flexion/extension')) score+=2;
        if(al.has('Rest')||al.has('Activity modification')) score+=1;
        if(tests['Patellar Tendon Palpation']==='+') score+=4;
        // Common in young athletic population
        if(age) {
          if(age >= 15 && age <= 35) score+=2;
          else if(age > 50) score = Math.max(0, score - 1);
        }
        return score;
      },
      edu:'Patellar tendinopathy presents with localized pain at the inferior pole of the patella, typically load-related. Resisted knee extension is often painful. Tendon thickening on imaging can support the diagnosis when combined with clinical findings. Unlike most injuries, complete rest is counterproductive — progressive tendon loading is the evidence-based first-line treatment.',
      exercises:[
        {icon:'🏋️', name:'Isometric Leg Press / Wall Sit', sets:'5x45 sec holds', desc:'Isometric loading for immediate pain relief and early tendon loading.', focus:'Provide immediate analgesia through sustained isometric tendon loading', diagram:'wall_sit'},
        {icon:'🔄', name:'Spanish Squat (Isotonic)', sets:'4x8, heavy and slow', desc:'Progress to heavy slow resistance — most evidence-based for tendon remodeling.', focus:'Isometric-to-isotonic patellar tendon loading with reduced knee shear', diagram:'squat'},
        {icon:'🦵', name:'Decline Squat (25° decline board)', sets:'3x15', desc:'Isolates patellar tendon loading more effectively than flat squats.', focus:'Isolate patellar tendon load in a declination position for tendinopathy', diagram:'squat'},
        {icon:'💪', name:'Single-Leg Press (progressive load)', sets:'3x12, increase load weekly', desc:'Functional progressive loading toward return to sport.', focus:'Develop single-limb strength and control through progressive loading', diagram:'leg_press'}
      ]
    },
    {
      name: 'ACL Sprain / Tear (Knee Ligament Injury)',
      ageNote: 'Peak 15–25 years; more common in females',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        // Mechanism is the strongest pre-test indicator
        if(a.has('Pivoting/cutting')) score+=4;
        if(a.has('Jumping/landing')) score+=3;
        // Classic acute symptom triad
        if(s.has('Giving way/instability')) score+=3;
        if(s.has('Swelling/effusion')) score+=3;
        if(s.has('Giving way/instability') && s.has('Swelling/effusion')) score+=2; // both together: stronger signal
        if(s.has('Clicking/popping')) score+=1; // audible pop at moment of injury
        // Special tests
        if(tests['Lachman Test']==='+') score+=5;
        if(tests['Pivot Shift Test']==='+') score+=4;
        if(tests['Anterior Drawer Test']==='+') score+=2;
        if(age) {
          if(age >= 15 && age <= 25) score+=3;
          else if(age >= 26 && age <= 35) score+=1;
        }
        if(sex === 'female') score+=2;
        // Penalties: insidious onset without mechanism is inconsistent with ACL tear
        if(!a.has('Pivoting/cutting')&&!a.has('Jumping/landing')) score=Math.max(0,score-3);
        // Medial knee pain with valgus mechanism = MCL, not ACL primarily
        if(s.has('Medial knee pain')&&!s.has('Giving way/instability')) score=Math.max(0,score-2);
        // Neurological features suggest lumbar, not knee
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        return score;
      },
      edu:'ACL tears often occur with pivoting, cutting, or landing mechanisms and frequently produce an audible "pop" with acute effusion. The Lachman test is the most clinically informative test for ACL continuity and is commonly used as the primary assessment tool. Both surgical and conservative options exist depending on activity level, age, and associated injuries. Early rehabilitation focuses on swelling control and quad activation.',
      exercises:[
        {icon:'💪', name:'Quad Sets & Straight Leg Raises', sets:'3x15', desc:'Immediate post-injury quad activation to prevent atrophy.', focus:'Quadriceps activation and straight-leg loading in non-compressive range', diagram:'quad_set'},
        {icon:'🌉', name:'Heel Slides', sets:'3x15', desc:'Gentle ROM restoration — target full extension first.', focus:'Restore passive knee flexion range through active-assisted motion', diagram:'heel_slide'},
        {icon:'🦵', name:'Hip Abduction & Extension', sets:'3x20', desc:'Proximal strength to reduce dynamic valgus at return to sport.', focus:'Simultaneously strengthen abductors and extensors to reduce impingement loading', diagram:'clamshell'},
        {icon:'🚲', name:'Stationary Cycling (short crank)', sets:'15 min', desc:'ROM and quad activation with a controlled, safe environment.', focus:'Reduced crank length minimises hip flexion excursion', diagram:'cycling'}
      ]
    },
    {
      name: 'PCL Sprain / Tear',
      ageNote: 'Any age; less common than ACL; mechanism: dashboard injury or fall on flexed knee',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Posterior knee pain')) score+=3;
        if(s.has('Swelling/effusion')) score+=2;
        if(a.has('Descending stairs')||a.has('Weight-bearing activities')) score+=2;
        if(a.has('Kneeling')) score+=1;
        if(al.has('Bracing/support')) score+=1;
        if(tests['Posterior Drawer Test']==='+') score+=6;
        if(tests['Lachman Test']==='-') score+=2; // negative ACL laxity supports PCL hypothesis
        // Penalties: instability/giving way pattern of ACL, not PCL
        if(s.has('Giving way/instability')&&!s.has('Posterior knee pain')) score=Math.max(0,score-3);
        // Neurological features suggest lumbar pathology, not PCL
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        // Lateral knee pain more consistent with LCL/PLC
        if(s.has('Lateral knee pain')&&!s.has('Posterior knee pain')) score=Math.max(0,score-2);
        return score;
      },
      edu:'PCL injuries often result from a direct blow to the anterior tibia (dashboard injury) or falling on a flexed knee. They produce less instability than ACL tears and frequently have minimal trauma recalled. The posterior tibial sag sign is pathognomonic. Most isolated PCL tears respond well to conservative PT.',
      exercises:[
        {icon:'💪', name:'Prone Hamstring Curls (avoid)', sets:'— Contraindicated acutely', desc:'Hamstring activation pulls tibia posteriorly — avoid in acute PCL injury.', focus:'Avoid: end-range knee flexion compresses the proximal tendon — contraindicated', diagram:'hamstring_stretch'},
        {icon:'🌉', name:'Quad Sets & SLRs', sets:'3x15', desc:'Quad dominance preferred early — quads stabilize against posterior tibial translation.', focus:'Activate quadriceps and introduce loaded movement without knee flexion', diagram:'quad_set'},
        {icon:'🦵', name:'Closed Chain Leg Press (0–60°)', sets:'3x15', desc:'Safe strengthening arc for PCL protection.', focus:'Strengthen the quadriceps through a safe compressive range', diagram:'leg_press'},
        {icon:'🚲', name:'Stationary Cycling', sets:'15 min', desc:'Joint-friendly quad strengthening and ROM restoration.', focus:'Low-impact aerobic activity that avoids provocative extension or impact', diagram:'cycling'}
      ]
    },
    {
      name: 'MCL Sprain',
      ageNote: 'Any age; most common collateral ligament injury',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial knee pain')||s.has('Swelling/effusion')) score+=2;
        if(a.has('Pivoting/cutting')) score+=2;
        if(al.has('Rest')||al.has('Bracing/support')) score+=1;
        if(tests['Valgus Stress Test (0° and 30°)']==='+') score+=5;
        // Penalties: lateral knee pain is LCL/PLC, not MCL
        if(s.has('Lateral knee pain')&&!s.has('Medial knee pain')) score=Math.max(0,score-4);
        // Neurological features suggest lumbar pathology, not MCL
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        // Posterior knee pain pattern is more consistent with PCL
        if(s.has('Posterior knee pain')&&!s.has('Medial knee pain')) score=Math.max(0,score-3);
        return score;
      },
      edu:'MCL sprains are the most common knee ligament injury, typically from a valgus force (e.g., soccer tackle). Graded I–III based on laxity. Grade I–II injuries heal well conservatively; Grade III may require bracing or surgical consult if associated with ACL/meniscal injury. Medial joint line tenderness and valgus stress test are key findings.',
      exercises:[
        {icon:'💪', name:'Quad Sets & SLRs', sets:'3x15', desc:'Maintains quad strength without stressing the healing MCL.', focus:'Activate quadriceps and introduce loaded movement without knee flexion', diagram:'quad_set'},
        {icon:'🦵', name:'Hip Abduction Strengthening', sets:'3x20', desc:'Reduces dynamic valgus stresses on the MCL.', focus:'Strengthen abductors to improve single-leg stance and gait control', diagram:'clamshell'},
        {icon:'🌉', name:'Mini Squats (pain-free range)', sets:'3x15', desc:'Begin closed chain loading as swelling resolves.', focus:'Introduce weight-bearing knee flexion within a comfortable range', diagram:'squat'},
        {icon:'🧘', name:'Single-Leg Balance Progression', sets:'3x30 sec', desc:'Proprioception restoration for return to sport readiness.', focus:'Progressively challenge neuromuscular control to prevent re-injury', diagram:'single_leg_balance'}
      ]
    },
    {
      name: 'LCL Sprain / Posterolateral Corner',
      ageNote: 'Any age; rare in isolation — often combined injury',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Lateral knee pain')) score+=2;
        if(tests['Varus Stress Test (0° and 30°)']==='+') score+=4;
        if(tests['Dial Test (30° and 90°)']==='+') score+=3;
        // Penalties: medial knee pain = MCL, not LCL
        if(s.has('Medial knee pain')&&!s.has('Lateral knee pain')) score=Math.max(0,score-4);
        // Neurological features suggest lumbar pathology, not knee ligament
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        return score;
      },
      edu:'Isolated LCL sprains are uncommon. When the varus stress test is positive, screen carefully for posterolateral corner (PLC) involvement and PCL injury. PLC injuries have a high failure rate when missed. Lateral knee tenderness and varus laxity are key findings. Refer for imaging if combined injury suspected.',
      exercises:[
        {icon:'💪', name:'Hip Abduction & ER Strengthening', sets:'3x20', desc:'Supports lateral knee stability by controlling proximal mechanics.', focus:'Target the posterior gluteal footprint to offload compressive tendon forces', diagram:'clamshell'},
        {icon:'🌉', name:'Quad Sets & Terminal Knee Extension', sets:'3x15', desc:'Maintains quad strength while avoiding varus stress.', focus:'Target VMO at terminal extension — critical for functional stability', diagram:'quad_set'},
        {icon:'🧘', name:'Balance Perturbation Training', sets:'3x30 sec each leg', desc:'Proprioception and lateral stabilizer re-education.', focus:'Develop reactive stabilisation responses to prevent chronic instability', diagram:'single_leg_balance'},
        {icon:'🦵', name:'Side-Lying Hip Strengthening Series', sets:'3x20 each', desc:'Glute med/max and TFL activation for posterolateral stability.', focus:'Systematically load the hip abductor and external rotator chain', diagram:'clamshell'}
      ]
    },
    {
      name: 'Meniscal Tear / Traumatic (Knee Cartilage Tear)',
      ageNote: 'Typically <40 years with twisting mechanism',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Locking')||s.has('Catching sensation')) score+=3;
        if(s.has('Swelling/effusion')||s.has('Clicking/popping')) score+=2;
        if(s.has('Medial knee pain')||s.has('Lateral knee pain')) score+=1;
        if(a.has('Twisting movements')||a.has('Pivoting/cutting')||a.has('Deep knee flexion')) score+=3;
        if(al.has('Rest')||al.has('Avoiding deep flexion')) score+=1;
        if(tests['McMurray Test']==='+') score+=3;
        if(tests['Thessaly Test']==='+') score+=3;
        if(tests['Joint Line Palpation']==='+') score+=3;
        // Penalties: no trauma mechanism in young patient = unlikely traumatic tear
        if(!a.has('Twisting movements')&&!a.has('Pivoting/cutting')&&age&&age<50) score=Math.max(0,score-3);
        // Neurological features are not consistent with meniscal pathology
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        // Giving way without locking more consistent with ACL/instability
        if(s.has('Giving way/instability')&&!s.has('Locking')&&!s.has('Catching sensation')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Traumatic meniscal tears typically occur with twisting mechanisms and present with joint line tenderness, possible effusion, and mechanical symptoms (locking, catching). McMurray test and joint line tenderness are key clinical tests associated with meniscal pathology; findings should be interpreted in the context of mechanism, symptom behaviour, and functional assessment. Conservative PT works well for many tears; surgical consult for locked knees or failed conservative management.',
      exercises:[
        {icon:'💪', name:'Quad Sets (full extension)', sets:'3x15, 10 sec hold', desc:'Quad activation without compressive load on meniscus.', focus:'Stimulate quadriceps contraction through the last degrees of extension', diagram:'quad_set'},
        {icon:'🌉', name:'Straight Leg Raises', sets:'3x15', desc:'Strengthens quad without requiring knee flexion.', focus:'Load quadriceps without knee flexion, protecting the patellofemoral joint', diagram:'slr'},
        {icon:'🦵', name:'Hip Strengthening Series (sidelying)', sets:'3x20 each direction', desc:'Reduces meniscal load through improved proximal control.', focus:'Progressive series targeting the full lateral hip stabiliser chain', diagram:'clamshell'},
        {icon:'🚲', name:'Stationary Cycling (low resistance)', sets:'15–20 min', desc:'Joint mobility with minimal compressive and shear load.', focus:'Joint-friendly aerobic stimulus with minimal axial load', diagram:'cycling'}
      ]
    },
    {
      name: 'Meniscal Tear / Degenerative (Knee Cartilage Wear)',
      ageNote: 'Typically ≥40 years; often coexists with osteoarthritis',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial knee pain')||s.has('Lateral knee pain')) score+=2;
        if(s.has('Swelling/effusion')||s.has('Deep ache')) score+=1;
        if(a.has('Weight-bearing activities')||a.has('Twisting movements')||a.has('Prolonged walking')) score+=2;
        if(al.has('Rest')||al.has('Activity modification')) score+=1;
        if(tests['McMurray Test']==='+') score+=2;
        if(tests['Joint Line Palpation']==='+') score+=3;
        // Age weighting: degenerative tears are uncommon under 40
        if(age) {
          if(age >= 55) score+=3;
          else if(age >= 40) score+=2;
          else if(age < 35) score = Math.max(0, score - 2);
        }
        // Penalties: neurological symptoms suggest lumbar radiculopathy
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        // Locking/catching in older patient without joint line pain = unlikely meniscal
        if(s.has('Locking')&&!s.has('Medial knee pain')&&!s.has('Lateral knee pain')) score=Math.max(0,score-2);
        // Instability > pain suggests ligamentous laxity, not meniscal
        if(s.has('Giving way/instability')&&!s.has('Locking')&&!s.has('Deep ache')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Degenerative meniscal tears are common in adults over 40 and frequently coexist with osteoarthritis. Mechanical symptoms do not predict surgical need in this population — strong evidence supports conservative PT over surgery for most degenerative tears. Focus on quadriceps strength, activity modification, and load management.',
      exercises:[
        {icon:'💪', name:'Quad Sets & SLRs', sets:'3x15', desc:'Foundation of conservative meniscal rehab regardless of tear type.', focus:'Activate quadriceps and introduce loaded movement without knee flexion', diagram:'quad_set'},
        {icon:'🚲', name:'Stationary Cycling', sets:'15–20 min', desc:'Aerobic capacity and quad strength with minimal joint stress.', focus:'Low-impact aerobic activity that avoids provocative extension or impact', diagram:'cycling'},
        {icon:'🌉', name:'Seated Leg Press (shallow range)', sets:'3x15', desc:'Progressive loading with controlled range of motion.', focus:'Initiate loading in a low-compression arc before progressing flexion', diagram:'leg_press'},
        {icon:'🧘', name:'Gait Training / Walking Program', sets:'20–30 min, level surface', desc:'Graded return to functional activity with load management.', focus:'Restore normal gait mechanics and build activity tolerance', diagram:'walking'}
      ]
    },
    {
      name: 'Pes Anserine Bursitis',
      ageNote: 'Middle-aged to older adults, especially females; associated with knee OA',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial knee pain')) score+=2;
        if(s.has('Night pain')) score+=1;
        if(a.has('Ascending stairs')||a.has('Running')||a.has('Weight-bearing activities')) score+=2;
        if(al.has('Rest')||al.has('Ice')) score+=1;
        if(tests['Pes Anserine Palpation']==='+') score+=5;
        // More common in middle-aged/older females
        if(age) {
          if(age >= 50) score+=2;
          else if(age >= 40) score+=1;
        }
        if(sex === 'female') score+=1;
        // Penalties: lateral knee pain is not consistent with pes anserine (medial-distal)
        if(s.has('Lateral knee pain')&&!s.has('Medial knee pain')) score=Math.max(0,score-4);
        // Locking/catching suggests meniscal pathology, not bursitis
        if(s.has('Locking')||s.has('Catching sensation')) score=Math.max(0,score-3);
        // Instability/giving way is not a feature of pes anserine bursitis
        if(s.has('Giving way/instability')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Pes anserine bursitis causes medial knee pain approximately 2 cm distal to the medial tibial plateau — distal and inferior to the joint line (distinguishing it from MCL or meniscal pathology). It is commonly associated with obesity, knee OA, and diabetes. Pain often radiates proximally along the semitendinosus. Ice, activity modification, and hamstring/quad stretching are first-line treatments.',
      exercises:[
        {icon:'🧘', name:'Hamstring Stretching (supine)', sets:'Hold 30 sec x3 each', desc:'Reduces tension at the pes anserine insertion.', focus:'Restore hamstring extensibility while protecting the proximal tendon attachment', diagram:'hamstring_stretch'},
        {icon:'💪', name:'Quad Sets', sets:'3x15, 10 sec hold', desc:'Maintains quad strength without provoking the bursa.', focus:'Re-establish VMO activation and reduce inhibitory pain arc', diagram:'quad_set'},
        {icon:'🔄', name:'Hip Adductor Stretching', sets:'Hold 30 sec x3 each', desc:'Reduces valgus load contributing to bursal irritation.', focus:'Maintain adductor flexibility within pain-free range', diagram:'adductor_stretch'},
        {icon:'🌉', name:'Stationary Cycling (low resistance)', sets:'15 min', desc:'Maintains fitness with low friction over the medial knee.', focus:'Joint-friendly aerobic stimulus with minimal axial load', diagram:'cycling'}
      ]
    }
    ,{
      name: 'IT Band Syndrome (Iliotibial Band Syndrome / Lateral Knee Pain)',
      ageNote: 'Common in runners and cyclists; peak 20–40 years; females at slightly higher risk',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Lateral knee pain')) score+=5;
        if(s.has('Burning')) score+=3;
        if(s.has('Pain during / after running')) score+=4;
        if(s.has('Deep ache')) score+=1;
        if(a.has('Running')||a.has('Cycling')) score+=4;
        if(a.has('Descending stairs')) score+=3;
        if(a.has('Increased training load')||a.has('Hill running')) score+=3;
        if(al.has('Rest')) score+=2;
        if(tests['Noble Compression Test']==='+') score+=5;
        if(tests['Ober Test']==='+') score+=3;
        if(tests['ITB / lateral femoral epicondyle palpation']==='+') score+=4;
        // Penalties: medial knee pain is not consistent with ITB syndrome
        if(s.has('Medial knee pain')&&!s.has('Lateral knee pain')) score=Math.max(0,score-4);
        // Significant swelling/effusion is atypical for ITB syndrome
        if(s.has('Swelling/effusion')) score=Math.max(0,score-3);
        // Locking/catching = meniscal, not ITB
        if(s.has('Locking')||s.has('Catching sensation')) score=Math.max(0,score-3);
        // Neurological features suggest lumbar radiculopathy
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        return score;
      },
      edu:'IT band syndrome (ITBS) is the most common cause of lateral knee pain in runners, caused by repetitive friction of the iliotibial band over the lateral femoral epicondyle. The hallmark is lateral knee pain that begins at a predictable distance or time into a run. Noble compression test at 30° knee flexion and Ober test are the most clinically useful findings. Hip abductor weakness and increased hip adduction during running are consistently associated with ITBS. Treatment centres on load management and hip strengthening; excessive ITB stretching alone is not sufficient.',
      exercises:[
        {icon:'💪', name:'Hip Abductor & ER Strengthening', sets:'3x15 each side', desc:'Hip weakness is the primary modifiable risk factor — target glute med and deep hip rotators.', focus:'Strengthen the hip abductors to reduce ITB compressive load at the lateral knee', diagram:'clamshell'},
        {icon:'🦵', name:'Graded Return to Running (avoid hills early)', sets:'Increase by 10% per week', desc:'Load management — reduce weekly mileage then rebuild gradually.', focus:'Graduated running progression to allow ITB irritation to settle before reloading', diagram:'walking'},
        {icon:'🧘', name:'Movement Retraining (avoid adduction/IR)', sets:'During all functional tasks', desc:'Reduce hip adduction and internal rotation — these increase ITB compressive force.', focus:'Correct hip drop and crossover running gait pattern that drives ITB compression', diagram:'squat'},
        {icon:'🌉', name:'Single Leg Balance Progression', sets:'3x30 sec, progress to perturbation', desc:'Improve frontal plane hip control to reduce dynamic valgus and ITB load.', focus:'Develop single-leg stability to prevent hip adduction that tensions the ITB', diagram:'single_leg_balance'}
      ]
    },
    {
      name: 'Quadriceps Tendinopathy',
      ageNote: 'Less common than patellar tendinopathy; peak in strength athletes and jumpers 25–45 years; males more affected',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior knee pain')) score+=3;
        if(s.has('Deep ache')) score+=2;
        if(a.has('Jumping/landing')) score+=4;
        if(a.has('Ascending stairs')||a.has('Running')) score+=2;
        if(a.has('Squatting')) score+=3;
        if(a.has('Increased training load')) score+=2;
        if(al.has('Rest')) score+=2;
        if(tests['Quadriceps tendon palpation (superior pole patella)']==='+') score+=6;
        if(tests['Single-Leg Squat Assessment']==='+') score+=2;
        if(sex==='male') score+=1;
        // Penalties: lateral elbow pain excludes distal biceps (anterior/anterior-medial)
        if(s.has('Lateral elbow pain')&&!s.has('Anterior elbow pain')) score=Math.max(0,score-3);
        // Audible pop with acute ecchymosis = rupture, not tendinopathy
        if(s.has('Audible pop (acute)')&&s.has('Ecchymosis (acute)')) score=Math.max(0,score-4);
        // Neurological symptoms suggest cubital tunnel or pronator teres
        if(s.has('Paresthesias (ring / little fingers)')||s.has('Paresthesias (thumb / index / middle fingers)')) score=Math.max(0,score-3);
        // Penalties: medial or lateral knee pain is not quad tendon
        if(s.has('Medial knee pain')&&!s.has('Anterior knee pain')) score=Math.max(0,score-3);
        if(s.has('Lateral knee pain')&&!s.has('Anterior knee pain')) score=Math.max(0,score-3);
        // Locking/catching = meniscal, not tendinopathy
        if(s.has('Locking')||s.has('Catching sensation')) score=Math.max(0,score-3);
        // Neurological symptoms suggest lumbar radiculopathy, not local tendinopathy
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        return score;
      },
      edu:'Quadriceps tendinopathy is irritation of the quadriceps tendon just above the patella, caused by overloading the tendon beyond its capacity. It shares features with patellar tendinopathy: anterior knee pain with jumping, squatting, and stairs that often warms up during activity. It is more common in strength athletes and older jumping athletes, tender just above the patella. Progressive tendon loading is the most effective treatment.',
      exercises:[
        {icon:'🦵', name:'Isometric Leg Press / Wall Sit', sets:'5x45 sec holds', desc:'Immediate analgesia through isometric quadriceps loading.', focus:'Provide immediate analgesia through sustained isometric tendon loading', diagram:'wall_sit'},
        {icon:'💪', name:'Decline Squat (25° decline board)', sets:'3x15 reps, slow tempo', desc:'Isolates quadriceps tendon load through a controlled range.', focus:'Isolate quad tendon load in a decline position for tendinopathy rehabilitation', diagram:'squat'},
        {icon:'🌉', name:'Seated Leg Press (partial range)', sets:'4x8 heavy, 3 sec down', desc:'Heavy slow resistance — drives tendon structural adaptation.', focus:'Provide heavy slow resistance stimulus to drive quadriceps tendon remodelling', diagram:'leg_press'},
        {icon:'🏃', name:'Graded Return to Running / Kicking', sets:'Progressive return program', desc:'Sport-specific reloading once pain with strength work is controlled.', focus:'Structured reintroduction of high-demand quadriceps loading for return to sport', diagram:'walking'}
      ]
    },
    {
      name: 'Distal Hamstring Tendinopathy',
      ageNote: 'Associated with cyclists, rowers, and endurance athletes; less common than proximal hamstring tendinopathy',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Posterior knee pain')) score+=5;
        if(s.has('Deep ache')) score+=2;
        if(s.has('Stiffness after sitting')) score+=2;
        if(a.has('Running')||a.has('Cycling')) score+=3;
        if(a.has('Ascending stairs')) score+=2;
        if(a.has('Increased training load')) score+=3;
        if(al.has('Rest')) score+=2;
        if(tests['Distal hamstring palpation (medial / lateral knee)']==='+') score+=6;
        if(tests['Resisted Knee Flexion (prone)']==='+') score+=3;
        if(tests['Resisted Knee Flexion (prone)']==='+') score+=3;
        // Penalties: anterior knee pain is not consistent with posterior hamstring tendinopathy
        if(s.has('Anterior knee pain')&&!s.has('Posterior knee pain')) score=Math.max(0,score-4);
        // Medial or lateral pain (not posterior) is a different structure
        if(!s.has('Posterior knee pain')) score=Math.max(0,score-4);
        // Locking/catching suggests meniscal pathology
        if(s.has('Locking')||s.has('Catching sensation')) score=Math.max(0,score-3);
        // Neurological features suggest lumbar origin, not local tendinopathy
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        return score;
      },
      edu:'Distal hamstring tendinopathy involves the hamstring tendons at their knee attachments (medial: semimembranosus/semitendinosus; lateral: biceps femoris). It causes posterior knee pain that worsens with running, cycling, and sustained knee flexion. Management follows the same principles as proximal hamstring tendinopathy: avoid aggressive stretching early, use progressive tendon loading, and address training load.',
      exercises:[
        {icon:'💪', name:'Isometric Knee Flexion (prone)', sets:'5x45 sec holds', desc:'Isometric hamstring loading at the distal attachment — reduces pain and begins tendon adaptation.', focus:'Load hamstring tendon isometrically to reduce pain and stimulate distal tendon adaptation', diagram:'prone_extension'},
        {icon:'🌉', name:'Nordic Hamstring Curl (eccentric)', sets:'3x6–8 reps, build gradually', desc:'Gold-standard eccentric hamstring exercise — most evidence-based tendon loading stimulus.', focus:'Eccentric hamstring loading to drive tendon remodelling at the distal attachment', diagram:'nordic_curl'},
        {icon:'🧘', name:'Gentle Hamstring Stretch (pain-free range)', sets:'3x30 sec, avoid end-range', desc:'Maintain extensibility without provoking distal tendon compression.', focus:'Maintain hamstring extensibility without loading the distal tendon insertion', diagram:'hamstring_stretch'},
        {icon:'🦵', name:'Stationary Cycling (raised seat)', sets:'20–30 min, low resistance', desc:'Raised seat reduces knee flexion range — allows cardiovascular conditioning without tendon aggravation.', focus:'Maintain cardiovascular fitness while avoiding provocative knee flexion angles', diagram:'cycling'}
      ]
    }
  ],
  ankle: [
    {
      name: 'Lateral Ankle Sprain (ATFL/CFL)',
      ageNote: 'Any age; most common musculoskeletal injury; athletes and general population',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Lateral ankle pain')) score+=4;
        if(s.has('Swelling / effusion')||s.has('Bruising / ecchymosis')) score+=3;
        if(s.has('Instability / giving way')) score+=2;
        if(a.has('Inversion injury')) score+=5;
        if(a.has('Uneven terrain')||a.has('Weight-bearing activities')) score+=2;
        if(al.has('Rest')||al.has('Immobilization / boot')) score+=2;
        if(tests['Anterior Drawer Test']==='+') score+=5;
        if(tests['Talar Tilt Test']==='+') score+=3;
        if(tests['Ottawa Ankle Rules Assessment']==='-') score+=1;
        // Penalties: medial ankle pain is not consistent with ATFL/CFL sprain
        if(s.has('Medial ankle pain')&&!s.has('Lateral ankle pain')) score=Math.max(0,score-4);
        // Neurological features (burning, tingling) suggest tarsal tunnel not sprain
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        // Gradual onset/insidious mechanism is not consistent with acute ankle sprain
        if(!a.has('Inversion injury')&&!a.has('Uneven terrain')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Lateral ankle sprains are the most common musculoskeletal injury, involving the ATFL (most commonly) followed by the CFL. Ottawa Rules screen for fracture. The anterior drawer test is most reliable when performed after the acute inflammatory phase (4–7 days post-injury); early examination can be limited by pain and guarding. Chronic ankle instability develops in a significant proportion — proprioceptive retraining is essential to reduce recurrence risk. Early weight-bearing and functional rehabilitation outperform immobilisation.',
      exercises:[
        {icon:'🔄', name:'Alphabet Ankle (active ROM)', sets:'3 reps (full alphabet)', desc:'Restore mobility in all planes — begin as soon as weight-bearing tolerated.', focus:'Restore full active ankle range and reduce morning stiffness', diagram:'ankle_circles'},
        {icon:'🧘', name:'Single Leg Balance Progression', sets:'3x30 sec → eyes closed → unstable surface', desc:'Proprioception is the most important factor in preventing re-sprain.', focus:'Restore proprioception and single-leg control critical for ankle stability', diagram:'single_leg_balance'},
        {icon:'🌀', name:'Resistance Band Eversion (peroneal strengthening)', sets:'3x20 reps', desc:'Peroneals are the primary dynamic lateral stabilisers — critical for recurrence prevention.', focus:'Progressively load peroneal tendons to restore lateral ankle stability', diagram:'ankle_circles'},
        {icon:'🦵', name:'Heel-Toe Walking → Hopping Progression', sets:'Graded return', desc:'Criterion-based functional return — not time-based.', focus:'Restore confident heel-toe gait before advancing to high-load activities', diagram:'walking'}
      ]
    },
    {
      name: 'High Ankle Sprain (Syndesmotic)',
      ageNote: 'Athletes; eversion / external rotation mechanism; longer recovery than lateral sprain',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior ankle pain')) score+=3;
        if(s.has('Pain out of proportion to injury')) score+=4;
        if(a.has('External rotation of foot')||a.has('Push-off / toe-off')) score+=4;
        if(a.has('Weight-bearing activities')||a.has('Running')) score+=2;
        if(al.has('Rest')||al.has('Immobilization / boot')) score+=2;
        if(tests['Syndesmosis Ligament Palpation']==='+') score+=5;
        if(tests['Squeeze Test (fibular compression)']==='+') score+=4;
        if(tests['Dorsiflexion-External Rotation Stress Test']==='+') score+=3;
        if(tests['Syndesmosis Ligament Palpation']==='+' && tests['Squeeze Test (fibular compression)']==='+') score+=3;
        // Penalties: lateral ankle pain from inversion = ATFL not syndesmotic
        if(s.has('Lateral ankle pain')&&a.has('Inversion injury')&&!s.has('Anterior ankle pain')) score=Math.max(0,score-3);
        // Neurological symptoms suggest tarsal tunnel
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        // Heel pain is not consistent with syndesmotic sprain
        if(s.has('Plantar heel pain')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Syndesmotic (high ankle) sprains involve the anterior tibiofibular ligament and recover significantly slower than lateral sprains. Syndesmosis ligament palpation and the squeeze test are commonly used clinical tests for syndesmotic involvement — combining both increases pattern consistency. Ottawa Rules apply — screen for associated Maisonneuve fracture. Return to sport requires full pain-free dorsiflexion and hop test clearance — typically 6–12 weeks minimum.',
      exercises:[
        {icon:'🧘', name:'Isometric Ankle Stabilisation', sets:'5x10 sec holds', desc:'Early-phase pain-free loading — protect healing syndesmosis.', focus:'Activate ankle stabilisers isometrically before dynamic loading', diagram:'single_leg_balance'},
        {icon:'🔄', name:'Progressive Dorsiflexion Range Work', sets:'3x10 reps', desc:'Restore DF — the primary motion limited by syndesmotic tightness.', focus:'Systematically restore dorsiflexion range critical for all gait and sport', diagram:'calf_stretch'},
        {icon:'💪', name:'Calf Strengthening Progression', sets:'3x15 → single heel raise', desc:'Restores push-off strength — bilateral before unilateral.', focus:'Progress calf load from bilateral to single-leg to replicate functional demands', diagram:'heel_raise'},
        {icon:'🦵', name:'Graduated Return to Running / Cutting', sets:'Progressive load ~6–12 weeks', desc:'Slower return than lateral sprain — hop test symmetry required before sport clearance.', focus:'Careful load management for return to multidirectional sport after injury', diagram:'walking'}
      ]
    },
    {
      name: 'Ankle Osteoarthritis',
      ageNote: 'Increases with age; prevalence ~7% in older adults; often post-traumatic',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Deep ache')||s.has('Anterior ankle pain')) score+=2;
        if(s.has('Stiffness')) score+=3;
        if(s.has('Clicking / popping')) score+=1;
        if(s.has('Morning pain (first steps)')) score+=1;
        if(a.has('Weight-bearing activities')||a.has('Prolonged standing')||a.has('Prolonged walking')) score+=3;
        if(a.has('Ascending stairs')||a.has('Descending stairs')) score+=2;
        if(al.has('Rest')||al.has('Orthotics / arch support')) score+=2;
        if(tests['Ankle OA End-Range Stress Test']==='+') score+=4;
        if(age) {
          if(age >= 65) score+=4;
          else if(age >= 55) score+=3;
          else if(age >= 45) score+=2;
          else if(age < 35) score=Math.max(0,score-2);
        }
        // Penalties: neurological features (burning/tingling) suggest tarsal tunnel
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        // Instability without stiffness or crepitus is more consistent with CAI
        if(s.has('Instability / giving way')&&!s.has('Stiffness')&&!s.has('Clicking / popping')) score=Math.max(0,score-2);
        // Plantar heel pain = plantar fasciitis, not ankle OA
        if(s.has('Plantar heel pain')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Ankle OA is often post-traumatic (prior fracture or chronic instability) rather than primary. Morning stiffness, end-range pain, crepitus, and bony enlargement are characteristic. Radiographs confirm joint space narrowing and osteophytes. Conservative PT (ROM, strengthening, orthotics, activity modification) is first-line; surgical options (arthroscopy, fusion, arthroplasty) are considered when conservative management fails.',
      exercises:[
        {icon:'🔄', name:'Ankle ROM (alphabet / circles)', sets:'3 reps twice daily', desc:'Maintain available range — most critical for preserving function in ankle OA.', focus:'Maintain ankle mobility and synovial fluid distribution after injury', diagram:'ankle_circles'},
        {icon:'💪', name:'Progressive Calf Strengthening', sets:'3x15 reps', desc:'Absorbs ground reaction force and reduces ankle joint compressive load.', focus:'Systematically increase calf loading to restore functional capacity', diagram:'heel_raise'},
        {icon:'🧘', name:'Aquatic Walking / Pool Therapy', sets:'20–30 min', desc:'Buoyancy reduces ankle compressive load — ideal for activity-limited patients.', focus:'Reduce joint load while maintaining aerobic and movement conditioning', diagram:'walking'},
        {icon:'🌀', name:'Balance & Proprioception Training', sets:'3x30 sec each', desc:'Restores neuromuscular control often impaired in ankle OA.', focus:'Systematically retrain the neuromuscular system after injury', diagram:'single_leg_balance'}
      ]
    },
    {
      name: 'Plantar Fasciitis (Heel Spur Pain)',
      ageNote: 'Peak 45–64 years; 1% annual prevalence; equal male/female; BMI >30 increases risk (OR 5.6)',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Plantar heel pain')) score+=5;
        if(s.has('Morning pain (first steps)')) score+=4;
        if(s.has('Pain improves with activity then worsens')) score+=3;
        if(s.has('Arch pain / medial foot pain')) score+=2;
        if(a.has('First steps in morning')) score+=4;
        if(a.has('Prolonged standing')||a.has('Weight-bearing activities')) score+=2;
        if(al.has('Rest')||al.has('Cushioned footwear')||al.has('Stretching calf')) score+=2;
        if(tests['Windlass Test (weight-bearing)']==='+') score+=4;
        if(tests['Medial Calcaneal Tuberosity Palpation']==='+') score+=4;
        if(age) { if(age >= 45 && age <= 65) score+=2; }
        // Penalties: neurological symptoms are NOT features of plantar fasciitis
        if(s.has('Numbness')||s.has('Tingling / electrical sensations')||s.has('Burning pain')) score=Math.max(0,score-4);
        // Lateral ankle pain is not consistent with plantar fasciitis
        if(s.has('Lateral ankle pain')&&!s.has('Plantar heel pain')) score=Math.max(0,score-4);
        // Swelling/instability suggests ankle sprain, not plantar fasciitis
        if(s.has('Instability / giving way')||s.has('Bruising / ecchymosis')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Plantar fasciitis is the most common cause of heel pain. Pain is worst with first steps in the morning, improves with walking, then worsens with prolonged standing. Elevated BMI is an established risk factor. The weight-bearing Windlass test is more clinically informative than the non-weight-bearing version. Reduced ankle dorsiflexion is a key modifiable risk factor. Calf stretching, plantar fascia stretching, intrinsic strengthening, and orthotics are evidence-based interventions. Shockwave therapy is effective for chronic cases.',
      exercises:[
        {icon:'🦶', name:'Plantar Fascia Stretch (before first steps)', sets:'Hold 30 sec x3 before standing', desc:'Most important exercise — passive toe extension pre-loads fascia before first steps.', focus:'Pre-load stretch prevents fascial snap on first morning weight-bearing', diagram:'plantar_stretch'},
        {icon:'🧘', name:'Calf Stretch — gastroc (knee straight) + soleus (knee bent)', sets:'Hold 30 sec x3 each', desc:'Soleus (knee bent) specifically reduces plantar fascia load — both variants required.', focus:'Restore both gastrocnemius and soleus extensibility to reduce tendon load', diagram:'calf_stretch'},
        {icon:'🌀', name:'Short Foot / Intrinsic Foot Activation', sets:'3x15 reps, 5 sec hold', desc:'Restores active arch support — reduces passive plantar fascia load.', focus:'Activate intrinsic foot muscles to dynamically support the arch', diagram:'foot_doming'},
        {icon:'🔄', name:'Frozen Water Bottle Roll', sets:'5 min twice daily', desc:'Myofascial release + cryotherapy — symptomatic relief between loading sessions.', focus:'Massage plantar fascia while providing combined stretch and cryotherapy', diagram:'plantar_stretch'}
      ]
    },
    {
      name: 'Achilles Tendinopathy (Achilles Tendon Pain)',
      ageNote: 'Peak 45–69 years; equal male/female; fluoroquinolone use is a risk factor',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Posterior ankle pain')) score+=3;
        if(s.has('Deep ache')||s.has('Stiffness')) score+=2;
        if(s.has('Morning pain (first steps)')) score+=2;
        if(s.has('Pain improves with activity then worsens')) score+=3;
        if(a.has('Running')||a.has('Increased training load')) score+=3;
        if(a.has('Push-off / toe-off')||a.has('Ascending stairs')) score+=2;
        if(al.has('Rest')) score+=1;
        if(tests['Thompson Test']==='-') score+=2;
        if(tests['Painful Arc Sign (Achilles)']==='+') score+=3;
        if(tests['Royal London Hospital Test']==='+') score+=3;
        if(tests['Mid-portion Achilles Palpation (2–6 cm)']==='+') score+=4;
        if(tests['Single Heel Raise Test (endurance)']==='+') score+=2;
        if(age) { if(age >= 45 && age <= 69) score+=2; }
        // Penalties: neurological symptoms point to tarsal tunnel, not Achilles tendinopathy
        if(s.has('Numbness')||s.has('Tingling / electrical sensations')||s.has('Burning pain')) score=Math.max(0,score-4);
        // Plantar heel pain is plantar fasciitis territory
        if(s.has('Plantar heel pain')&&!s.has('Posterior ankle pain')) score=Math.max(0,score-3);
        // Instability/giving way suggests ligamentous laxity or CAI
        if(s.has('Instability / giving way')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Achilles tendinopathy presents with mid-portion (2–6 cm above insertion) or insertional pain. The painful arc sign and the Royal London Hospital test are associated with mid-portion Achilles involvement and help differentiate from insertional pathology. Pain is worst on initiating activity, improves with light activity, then worsens with prolonged loading. Mid-portion and insertional types have different management — insertional: avoid end-range dorsiflexion stretching. The Alfredson eccentric protocol and heavy slow resistance loading are the most evidence-supported rehabilitation approaches.',
      exercises:[
        {icon:'🦵', name:'Eccentric Heel Drop — Alfredson (step edge)', sets:'3x15 twice daily (knee straight + knee bent)', desc:'Evidence-supported protocol for mid-portion tendinopathy — slow lowering through full range; avoid for insertional type.', focus:'Eccentric calf loading — gold standard tendon remodelling stimulus', diagram:'heel_drop'},
        {icon:'💪', name:'Isometric Calf Holds', sets:'5x45 sec, 70% effort', desc:'Pain-modulating isometrics — especially effective during high-irritability phase.', focus:'Analgesic isometric loading before progressing to eccentric work', diagram:'heel_raise'},
        {icon:'🔄', name:'Heavy Slow Resistance Calf Raise', sets:'4x8 reps, 3–4 sec tempo', desc:'Tendon remodeling — bilateral to unilateral, bodyweight to loaded.', focus:'High-load slow resistance calf work to drive tendon structural adaptation', diagram:'heel_raise'},
        {icon:'🧘', name:'Calf Stretching (mid-portion only)', sets:'Hold 30 sec x3; avoid for insertional type', desc:'Mid-portion: gastroc + soleus stretch; insertional: avoid aggressive end-range DF.', focus:'Restore flexibility without inserting stretch at the calcaneal attachment', diagram:'calf_stretch'}
      ]
    },
    {
      name: 'Posterior Tibial Tendon Dysfunction (Flat Foot Tendon Pain)',
      ageNote: 'Adults; prevalence 10% in adults >65 years; risk factors: obesity, diabetes, hypertension',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial ankle pain')) score+=3;
        if(s.has('Arch pain / medial foot pain')) score+=3;
        if(s.has('Progressive flatfoot deformity')) score+=5;
        if(s.has('Weakness')) score+=2;
        if(a.has('Weight-bearing activities')||a.has('Prolonged walking')||a.has('Prolonged standing')) score+=3;
        if(al.has('Rest')||al.has('Orthotics / arch support')||al.has('Immobilization / boot')) score+=2;
        if(tests['Too Many Toes Sign']==='+') score+=4;
        if(tests['Single-Limb Heel Raise Test']==='+') score+=4;
        if(tests['Resisted Inversion (plantarflexed foot)']==='+') score+=4;
        if(tests['Navicular Drop Test']==='+') score+=3;
        if(age) {
          if(age >= 65) score+=3;
          else if(age >= 50) score+=2;
        }
        if(sex==='female') score+=1;
        // Penalties: lateral ankle pain is peroneal/ATFL territory, not PTTD
        if(s.has('Lateral ankle pain')&&!s.has('Medial ankle pain')) score=Math.max(0,score-4);
        // Neurological symptoms suggest tarsal tunnel, not PTTD
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        // Acute onset with bruising suggests sprain, not PTTD (which is insidious)
        if(s.has('Bruising / ecchymosis')) score=Math.max(0,score-3);
        return score;
      },
      edu:'PTTD is the most common cause of adult-acquired flatfoot, occurring more commonly in older adults. Progressive posteromedial ankle pain, hindfoot valgus, medial arch collapse, and inability to perform a single heel raise are hallmarks. MRI is the preferred imaging modality for confirming posterior tibial tendon involvement; ultrasound is a useful first-line imaging option. Early stages respond to conservative PT, orthotics, and progressive strengthening; advanced stages with rigid deformity often require surgical reconstruction.',
      exercises:[
        {icon:'💪', name:'Eccentric Tibialis Posterior Inversion', sets:'3x15 slow reps', desc:'Primary rehabilitation — slow eccentric lowering from inverted to everted position.', focus:'Target tibialis posterior eccentrically to restore medial arch control', diagram:'ankle_circles'},
        {icon:'🦶', name:'Short Foot Exercise / Arch Doming', sets:'3x15, 5 sec hold', desc:'Intrinsic foot activation — restores active arch support independent of tibialis posterior.', focus:'Build intrinsic foot strength to reduce fascial tensile load', diagram:'foot_doming'},
        {icon:'🧘', name:'Single Heel Raise Progression', sets:'Bilateral → unilateral, reps to 25', desc:'Systematically rebuilds tibialis posterior strength and push-off capacity.', focus:'Advance to single-leg loading to meet functional sport/activity demands', diagram:'heel_raise'},
        {icon:'🌀', name:'Orthotics + Medial Arch Support', sets:'Full-time in all footwear', desc:'Offloads tibialis posterior — essential adjunct to prevent progressive deformity.', focus:'Combined intrinsic and extrinsic arch support strategy', diagram:'foot_doming'}
      ]
    },
    {
      name: 'Anterior Tibialis Tendinopathy',
      ageNote: 'Any age; overuse from dorsiflexion activities; runners and hikers',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior ankle pain')) score+=4;
        if(s.has('Deep ache')) score+=2;
        if(a.has('Dorsiflexion activities')||a.has('Running')||a.has('Prolonged walking')) score+=3;
        if(a.has('Ascending stairs')||a.has('Descending stairs')) score+=2;
        if(al.has('Rest')||al.has('Immobilization / boot')) score+=2;
        if(tests['Resisted Dorsiflexion Test']==='+') score+=5;
        if(tests['Tibialis Anterior Passive Stretch']==='+') score+=4;
        // Penalties: plantar heel or posterior ankle pain excludes anterior tibialis
        if(s.has('Plantar heel pain')||s.has('Posterior ankle pain')) score=Math.max(0,score-4);
        // Neurological symptoms suggest tarsal tunnel, not local tendinopathy
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')||s.has('Numbness')) score=Math.max(0,score-3);
        // Instability/giving way suggests ligamentous cause
        if(s.has('Instability / giving way')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Anterior tibialis tendinopathy causes anterior ankle and medial midfoot pain, reproduced by resisted dorsiflexion and passive plantarflexion/inversion stretch. It is less common than posterior or peroneal tendinopathy. Footwear lace pressure over the tendon is a common aggravating factor. Progressive tendon loading (isometric → isotonic) and lace modification are the primary treatments.',
      exercises:[
        {icon:'💪', name:'Isometric Dorsiflexion Holds', sets:'5x45 sec, 70% effort', desc:'Pain-modulating isometrics — begin pain-free before progressing.', focus:'Load anterior tibialis isometrically to initiate tendon adaptation', diagram:'ankle_circles'},
        {icon:'🔄', name:'Isotonic Dorsiflexion with Band', sets:'3x15 reps slow tempo', desc:'Progressive tendon loading — 3–4 sec eccentric lowering.', focus:'Progress to dynamic tibialis anterior loading through full ROM', diagram:'ankle_circles'},
        {icon:'🧘', name:'Plantar Flexion Stretch (gentle)', sets:'Hold 20 sec x3', desc:'Maintain tendon extensibility — avoid aggressive stretch acutely.', focus:'Maintain plantar flexor extensibility without provocative loading', diagram:'calf_stretch'},
        {icon:'🌀', name:'Footwear Lace Modification', sets:'Ongoing', desc:'Reduce direct tendon compression — re-lace to avoid pressure over anterior ankle.', focus:'Reduce extensor tendon compressive pressure through lace pattern modification', diagram:'walking'}
      ]
    },
    {
      name: 'Peroneal Tendinopathy',
      ageNote: 'Any age; athletes; often accompanies lateral ankle sprains; hindfoot varus is a risk factor',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Lateral ankle pain')||s.has('Posterior ankle pain')) score+=3;
        if(s.has('Instability / giving way')) score+=2;
        if(a.has('Running')||a.has('Eversion activities')) score+=3;
        if(a.has('Inversion injury')||a.has('Uneven terrain')) score+=2;
        if(al.has('Rest')||al.has('Orthotics / arch support')) score+=2;
        if(tests['Peroneal Compression Test']==='+') score+=4;
        if(tests['Resisted Eversion & Plantarflexion']==='+') score+=4;
        if(tests['Peroneal Tendon Subluxation Test']==='+') score+=3;
        // Penalties: medial ankle or heel pain excludes peroneal tendinopathy
        if(s.has('Medial ankle pain')&&!s.has('Lateral ankle pain')) score=Math.max(0,score-4);
        if(s.has('Plantar heel pain')) score=Math.max(0,score-3);
        // Neurological symptoms suggest tarsal tunnel rather than peroneal tendinopathy
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')||s.has('Numbness')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Peroneal tendinopathy involves peroneus longus (lateral cuboid pain) and/or brevis (posterior to lateral malleolus). It frequently accompanies chronic ankle instability. Hindfoot varus increases peroneal load. Ultrasound is a valuable imaging tool for assessing peroneal instability and tendon integrity. Brevis longitudinal split tears are common with recurrent subluxation. Progressive eccentric loading and ankle stabilisation are primary treatments; surgical exploration for confirmed split tears or subluxation.',
      exercises:[
        {icon:'🌀', name:'Eccentric Peroneal Inversion-to-Eversion', sets:'3x15 slow reps', desc:'Progressive tendon loading — slow eccentric from inversion back to neutral.', focus:'Eccentrically load peroneal tendons to drive adaptive remodelling', diagram:'ankle_circles'},
        {icon:'💪', name:'Isometric Eversion Holds', sets:'5x45 sec', desc:'Pain-modulating isometrics — begin in pain-free position.', focus:'Activate peroneal tendons isometrically — first stage of loading protocol', diagram:'ankle_circles'},
        {icon:'🧘', name:'Single Leg Balance + Perturbation', sets:'3x30 sec with perturbation', desc:'Address underlying ankle instability that drives peroneal overload.', focus:'Add external perturbation to develop reactive ankle stabilisation', diagram:'single_leg_balance'},
        {icon:'🌀', name:'Lateral Wedge Orthotics', sets:'Full-time in all footwear', desc:'Reduces peroneal tendon compression from hindfoot varus.', focus:'Reduce medial compartment compressive load through footwear modification', diagram:'walking'}
      ]
    },
    {
      name: 'Tarsal Tunnel Syndrome',
      ageNote: 'Any age; associated with pes planus, ankle trauma, and space-occupying lesions',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Burning pain')) score+=3;
        if(s.has('Numbness')||s.has('Tingling / electrical sensations')) score+=4;
        if(s.has('Cramping (medial arch)')) score+=3;
        if(s.has('Medial ankle pain')) score+=2;
        if(a.has('Prolonged standing')||a.has('Prolonged walking')||a.has('Running')) score+=3;
        if(al.has('Rest')||al.has('Loose footwear')||al.has('Elevation')) score+=2;
        if(tests['Tinel\'s Sign (posterior tibial nerve)']==='+') score+=4;
        if(tests['Dorsiflexion-Eversion Test']==='+') score+=4;
        if(tests['Plantar Flexion-Inversion Test']==='+') score+=3;
        if(tests['Navicular Drop Test']==='+') score+=2;
        // Penalties: pure mechanical pain without neurological features is not tarsal tunnel
        if(!s.has('Burning pain')&&!s.has('Tingling / electrical sensations')&&!s.has('Numbness')) score=Math.max(0,score-4);
        // Lateral ankle instability suggests ligamentous cause, not tarsal tunnel
        if(s.has('Instability / giving way')&&a.has('Inversion injury')) score=Math.max(0,score-3);
        // Plantar heel pain in morning = plantar fasciitis, not tarsal tunnel
        if(s.has('Morning pain (first steps)')&&!s.has('Burning pain')&&!s.has('Numbness')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Tarsal tunnel syndrome involves compression of the posterior tibial nerve beneath the flexor retinaculum. Burning, tingling, and cramping in the medial plantar foot are characteristic — sensory loss sparing the heel distinguishes it from plantar fasciitis. Nerve conduction studies confirm diagnosis; MRI identifies space-occupying lesions. Conservative treatment includes orthotics, neural mobilisation, and activity modification; surgical decompression for refractory cases.',
      exercises:[
        {icon:'🔄', name:'Neural Mobilisation (tibial nerve)', sets:'2x10 gentle glides', desc:'Reduces nerve adhesion in tarsal tunnel — use sliding technique to avoid aggravation.', focus:'Release tarsal tunnel neural tension to reduce distal tibial nerve symptoms', diagram:'nerve_floss_supine'},
        {icon:'🧘', name:'Medial Arch Support (orthotics)', sets:'Full-time in all footwear', desc:'Reduces tarsal tunnel pressure from excessive pronation.', focus:'Extrinsic arch support to reduce plantar fascia tensile load', diagram:'foot_doming'},
        {icon:'🌀', name:'Calf Flexibility', sets:'Hold 30 sec x3', desc:'Reduces posterior compartment tension contributing to tarsal tunnel compression.', focus:'Maintain calf extensibility to offload the Achilles tendon during activity', diagram:'calf_stretch'},
        {icon:'💪', name:'Intrinsic Foot Strengthening', sets:'3x15 reps', desc:'Improves arch control — reduces tibial nerve traction during pronation.', focus:'Strengthen foot intrinsics to support the medial arch and offload fascia', diagram:'foot_doming'}
      ]
    },
    {
      name: "Morton's Neuroma",
      ageNote: "Peak 45–54 years; women:men >4:1; bilateral in 21%",
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Burning pain')) score+=4;
        if(s.has('Numbness')||s.has('Tingling / electrical sensations')) score+=4;
        if(s.has('Forefoot / metatarsal head pain')) score+=3;
        if(a.has('Tight / constrictive footwear')||a.has('High-heeled shoes')) score+=4;
        if(a.has('Prolonged walking')||a.has('Running')) score+=2;
        if(al.has('Wide-toed shoes')||al.has('Removing shoes')||al.has('Rest')) score+=4;
        if(tests["Thumb-Index Finger Squeeze (webspace)"]==='+') score+=4;
        if(tests["Mulder's Sign"]==='+') score+=5;
        if(sex==='female') score+=2;
        if(age) { if(age >= 45 && age <= 60) score+=2; }
        return score;
      },
      edu:"Morton's neuroma is perineural fibrosis around the common digital nerve, most commonly between 3rd and 4th metatarsals. Pain with walking, worsening with tight footwear, and relief when shoes are removed are characteristic features. Mulder's sign is considered a clinically meaningful finding when present. US and MRI are both useful imaging options for confirmation. Footwear modification is first-line; corticosteroid or sclerosant injections for persistent symptoms.",
      exercises:[
        {icon:'🦶', name:'Metatarsal Pad Positioning', sets:'Daily in all footwear', desc:'Offloads the interspace — most important intervention for Morton\'s neuroma.'},
        {icon:'🌀', name:'Intrinsic Foot Muscle Activation (toe spreaders)', sets:'3x15 reps', desc:'Decompress metatarsal heads and reduce interdigital nerve compression.', focus:'Isolate intrinsic activation to develop independent arch control', diagram:'foot_doming'},
        {icon:'🧘', name:'Forefoot Stretching (toe extension)', sets:'Hold 30 sec x3', desc:'Reduces forefoot plantar tension contributing to nerve compression.', focus:'Stretch metatarsophalangeal joints to reduce metatarsalgia compressive forces', diagram:'plantar_stretch'},
        {icon:'💆', name:'Metatarsal Mobilisation (MT head glides)', sets:'Gentle, 2 min', desc:'Dorsal/plantar glides to reduce stiffness and interspace compression.', focus:'Address restricted MT head gliding to redistribute forefoot pressure', diagram:'foot_doming'}
      ]
    },
    {
      name: 'Metatarsalgia',
      ageNote: 'Any age; associated with high-heeled shoes and high-impact activities',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Forefoot / metatarsal head pain')) score+=5;
        if(s.has('Deep ache')) score+=1;
        if(a.has('Weight-bearing activities')||a.has('Running')) score+=3;
        if(a.has('High-heeled shoes')||a.has('Tight / constrictive footwear')) score+=3;
        if(a.has('Prolonged standing')||a.has('Prolonged walking')) score+=2;
        if(al.has('Rest')||al.has('Cushioned footwear')) score+=2;
        if(tests['Metatarsal Head Palpation']==='+') score+=4;
        if(tests["Mulder's Sign"]==='-') score+=2;
        if(tests["Thumb-Index Finger Squeeze (webspace)"]==='-') score+=1;
        // Penalties: heel pain is not metatarsalgia (which is forefoot)
        if(s.has('Plantar heel pain')&&!s.has('Forefoot / metatarsal head pain')) score=Math.max(0,score-4);
        // Neurological burning/tingling without interspace pain suggests tarsal tunnel
        if((s.has('Burning pain')||s.has('Tingling / electrical sensations'))&&!s.has('Forefoot / metatarsal head pain')) score=Math.max(0,score-3);
        // Posterior ankle pain is Achilles territory
        if(s.has('Posterior ankle pain')&&!s.has('Forefoot / metatarsal head pain')) score=Math.max(0,score-4);
        return score;
      },
      edu:"Metatarsalgia is a broad term for forefoot pain under the metatarsal heads, from abnormal load distribution. Assess for callus pattern, Morton's neuroma, plantar plate injury, and stress fracture. Metatarsal pads, cushioned footwear, orthotics, and activity modification are first-line. Refer for MRI if plantar plate tear or stress fracture suspected.",
      exercises:[
        {icon:'🦶', name:'Metatarsal Pad + Cushioned Insole', sets:'Daily in all footwear', desc:'Redistributes forefoot load — primary symptom management.', focus:'Redistribute metatarsal head pressure and reduce plantar forefoot loading', diagram:'foot_doming'},
        {icon:'🌀', name:'Toe Flexor Strengthening', sets:'3x20 towel curls / marble pickups', desc:'Restores intrinsic foot strength to improve forefoot load distribution.', focus:'Strengthen toe flexors to share propulsive load with the plantar fascia', diagram:'foot_doming'},
        {icon:'🧘', name:'Calf Stretching (reduce forefoot load)', sets:'Hold 30 sec x3', desc:'Reduces forefoot pressure by improving ankle dorsiflexion.', focus:'Reduce plantar forefoot compression through improved calf extensibility', diagram:'calf_stretch'},
        {icon:'💆', name:'MT Head Mobilisation', sets:'Gentle, 2 min', desc:'Restore metatarsal mobility and reduce stiffness contributing to abnormal load.', focus:'Restore metatarsal head mobility to offload metatarsalgia', diagram:'foot_doming'}
      ]
    },
    {
      name: 'Chronic Ankle Instability',
      ageNote: 'Any age; follows lateral ankle sprain; affects 30–40% of initial sprain patients',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Instability / giving way')) score+=5;
        if(s.has('Lateral ankle pain')) score+=2;
        if(s.has('Clicking / popping')) score+=1;
        if(a.has('Uneven terrain')||a.has('Impact activities')) score+=3;
        if(a.has('Running')) score+=2;
        if(al.has('Bracing / ankle support')||al.has('Taping')) score+=3;
        if(tests['Anterior Drawer Test']==='+') score+=3;
        if(tests['Talar Tilt Test']==='+') score+=3;
        if(tests['Single Leg Balance (eyes open / closed)']==='+') score+=4;
        if(tests['Y-Balance Test (anterior reach)']==='+') score+=3;
        // Penalties: neurological burning/tingling suggest tarsal tunnel, not CAI
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        // Plantar heel pain = plantar fasciitis, not instability
        if(s.has('Plantar heel pain')&&!s.has('Instability / giving way')) score=Math.max(0,score-3);
        // Medial ankle dominant without instability = PTTD or tarsal tunnel
        if(s.has('Medial ankle pain')&&!s.has('Instability / giving way')) score=Math.max(0,score-2);
        return score;
      },
      edu:'Chronic ankle instability results from inadequate rehabilitation after acute lateral ankle sprain — 30–40% of initial sprains develop into CAI. Both mechanical laxity and sensorimotor deficits must be addressed. Balance training is the most evidence-based intervention; peroneal strengthening and sport-specific agility reduce re-injury risk. Ankle bracing reduces re-sprain risk during return to sport.',
      exercises:[
        {icon:'🧘', name:'Progressive Balance Training (BOSU/wobble board)', sets:'3x45 sec, increasing difficulty weekly', desc:'Sensorimotor retraining — most evidence-based intervention for CAI.', focus:'Build dynamic stability on unstable surfaces to replicate sport demands', diagram:'single_leg_balance'},
        {icon:'🌀', name:'Peroneal Eccentric Strengthening', sets:'3x15 slow reps', desc:'Builds peroneal tendon resilience and dynamic lateral stability.', focus:'Provide the eccentric stimulus needed for peroneal tendon adaptation', diagram:'ankle_circles'},
        {icon:'🦵', name:'Lateral Agility Drills', sets:'3x30 sec', desc:'Sport-specific neuromuscular control — progress from stable to unstable, slow to fast.', focus:'Rebuild sport-specific multi-directional movement confidence', diagram:'walking'},
        {icon:'🔄', name:'Ankle Proprioception (eyes closed, unstable surface)', sets:'3x30 sec each foot', desc:'Restores joint position sense — critical for preventing recurrence on uneven terrain.', focus:'Maximise proprioceptive challenge by removing visual compensation', diagram:'single_leg_balance'}
      ]
    }
    ,{
      name: 'Medial Tibial Stress Syndrome (Shin Splints)',
      ageNote: 'Common in runners, military recruits, and dancers; peak 15–35 years; females at higher risk',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial leg / shin pain')) score+=6;
        if(s.has('Deep ache')) score+=2;
        if(s.has('Pain with weight-bearing')) score+=2;
        if(a.has('Running')||a.has('Impact activities')||a.has('Running on hard surfaces')) score+=4;
        if(a.has('Increased training load')) score+=4;
        if(a.has('Hill running')||a.has('Sprinting')) score+=2;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        if(tests['Medial tibial border palpation']==='+') score+=5;
        if(tests['Hop test (single-leg)']==='+') score+=3;
        if(age && age < 40) score+=2;
        if(sex==='female') score+=1;
        // Penalties: focal point tenderness with rest/night pain = stress fracture not MTSS
        if(s.has('Night pain')&&s.has('Pain at rest')) score=Math.max(0,score-4);
        // Neurological symptoms suggest tarsal tunnel or lumbar pathology
        if(s.has('Numbness')||s.has('Tingling / electrical sensations')||s.has('Burning pain')) score=Math.max(0,score-3);
        // Calf pain (not shin) = calf strain
        if(s.has('Calf pain')&&!s.has('Medial leg / shin pain')) score=Math.max(0,score-4);
        return score;
      },
      edu:'Medial tibial stress syndrome (MTSS), commonly called shin splints, causes diffuse pain along the inner border of the tibia in runners who have recently increased their training load. Key differentiator from tibial stress fracture: MTSS pain is diffuse along the posteromedial tibial border (>5 cm), whereas stress fracture pain is focal and point-tender. A graduated return to running, addressing hip weakness and running mechanics, is the primary treatment. Most cases resolve within 8–12 weeks.',
      exercises:[
        {icon:'🦵', name:'Graded Return to Running Protocol', sets:'Build by 10% per week', desc:'Structured load management — most MTSS resolves with modified training, not complete rest.', focus:'Graduated running progression to manage tibial stress load during return to sport', diagram:'walking'},
        {icon:'💪', name:'Hip Abductor Strengthening', sets:'3x15 each side', desc:'Hip weakness increases tibial bending moments — address the proximal cause.', focus:'Strengthen hip abductors to reduce tibial bending stress during running', diagram:'clamshell'},
        {icon:'🌉', name:'Calf Strengthening Progression', sets:'3x15, bilateral to single-leg', desc:'Tibialis posterior and calf strengthening reduces tibial stress.', focus:'Build lower leg strength to share tibial load and reduce periosteal stress', diagram:'heel_raise'},
        {icon:'🧘', name:'Balance & Proprioception Training', sets:'3x30 sec each leg', desc:'Neuromuscular retraining to improve shock absorption and landing mechanics.', focus:'Improve neuromuscular control to reduce impact forces on the tibia', diagram:'single_leg_balance'}
      ]
    },
    {
      name: 'Calf Strain (Gastrocnemius / Soleus Muscle Tear)',
      ageNote: 'Common in recreational athletes 35–55 years; often called tennis leg; medial gastrocnemius is most common site',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Calf pain')) score+=6;
        if(s.has('Posterior ankle pain')) score+=2;
        if(s.has('Sharp pain')) score+=2;
        if(s.has('Swelling / effusion')) score+=2;
        if(s.has('Bruising / ecchymosis')) score+=3;
        if(s.has('Pain with weight-bearing')) score+=2;
        if(a.has('Running')||a.has('Sprinting')) score+=4;
        if(a.has('Sudden acceleration / push-off')||a.has('Push-off / toe-off')) score+=4;
        if(a.has('Weight-bearing activities')) score+=1;
        if(al.has('Rest')||al.has('Non-weight-bearing')) score+=3;
        if(tests['Calf muscle belly palpation']==='+') score+=5;
        if(tests['Thompson Test']==='+') score+=3;
        // Penalties: Thompson test positive = Achilles rupture, not calf strain
        if(tests['Thompson Test']==='+') score=Math.max(0,score-3); // net 0 — flag but keep competitive
        // Shin pain rather than calf = MTSS or stress fracture
        if(s.has('Medial leg / shin pain')&&!s.has('Calf pain')) score=Math.max(0,score-4);
        // Neurological symptoms suggest tarsal tunnel or lumbar pathology
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        // Insidious onset without acute mechanism is not typical of calf strain
        if(!a.has('Running')||!a.has('Sudden acceleration / push-off')) {
          if(s.has('Stiffness')&&!s.has('Bruising / ecchymosis')&&!s.has('Sharp pain')) score=Math.max(0,score-2);
        }
        return score;
      },
      edu:'Calf strain typically involves the medial head of the gastrocnemius at its musculotendinous junction — often called "tennis leg" when it occurs acutely during push-off. Grades 1–2 (mild to partial tear) are most common and resolve within 4–8 weeks. The Thompson test distinguishes a calf strain from complete Achilles rupture. Avoid complete rest — early protected loading is far superior to prolonged immobilisation for healing.',
      exercises:[
        {icon:'💪', name:'Isometric Calf Holds', sets:'5x30–45 sec, pain-free', desc:'First-stage loading — isometric stimulus without provocative muscle lengthening.', focus:'Initiate calf loading isometrically to reduce pain and begin tissue adaptation', diagram:'heel_raise'},
        {icon:'🌉', name:'Progressive Calf Strengthening', sets:'3x15 bilateral → single-leg', desc:'Progress from double-leg to single-leg calf raises through pain-free range.', focus:'Systematically restore calf strength before return to running demands', diagram:'heel_raise'},
        {icon:'🧘', name:'Calf Stretch — gastroc (knee straight) + soleus (knee bent)', sets:'3x30 sec each position', desc:'Restore extensibility once acute phase settles — avoid aggressive stretch acutely.', focus:'Restore calf extensibility to offload the healing muscle-tendon junction', diagram:'calf_stretch'},
        {icon:'🏃', name:'Graded Return to Running Protocol', sets:'Walk/run program, 4–8 weeks post-injury', desc:'Structured return — the primary risk is re-injury from premature return.', focus:'Graduated loading to restore full running capacity without re-tear', diagram:'walking'}
      ]
    },
    {
      name: 'Tibial Stress Fracture (Stress Fracture of the Shin)',
      ageNote: 'Common in runners, military recruits, and female athletes with low bone density; ages 15–35 peak',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial leg / shin pain')) score+=3;
        if(s.has('Night pain')) score+=4;
        if(s.has('Pain at rest')) score+=4;
        if(s.has('Pain out of proportion to injury')) score+=4;
        if(a.has('Running')||a.has('Impact activities')||a.has('Running on hard surfaces')) score+=3;
        if(a.has('Increased training load')) score+=4;
        if(al.has('Non-weight-bearing')||al.has('Rest')) score+=3;
        if(tests['Tibial stress fracture palpation (focal)']==='+') score+=6;
        if(tests['Hop test (single-leg)']==='+') score+=4;
        if(age && age < 35) score+=2;
        if(sex==='female') score+=2;
        // Penalties: diffuse shin pain without rest/night pain = MTSS not stress fracture
        if(!s.has('Night pain')&&!s.has('Pain at rest')&&!s.has('Pain out of proportion to injury')) score=Math.max(0,score-3);
        // Calf pain without shin involvement suggests calf strain
        if(s.has('Calf pain')&&!s.has('Medial leg / shin pain')) score=Math.max(0,score-4);
        // Neurological symptoms are not features of stress fracture
        if(s.has('Burning pain')||s.has('Tingling / electrical sensations')) score=Math.max(0,score-3);
        return score;
      },
      edu:'A tibial stress fracture is a partial or complete cortical break caused by repetitive mechanical loading exceeding the bone remodelling rate. Key differentiator from shin splints: stress fracture pain is focal and point-tender over a specific area of the tibia, present at rest and at night. MRI is the gold standard (X-ray is often negative early). Important: These require imaging and medical clearance before loading. High-risk locations (anterior cortex of mid-tibia) risk complete fracture and need orthopaedic referral.',
      exercises:[
        {icon:'🚫', name:'NON-WEIGHT-BEARING REST', sets:'4–8 weeks as directed by clinician', desc:'Bone stress fractures require protection from loading — follow medical guidance strictly.', focus:'Protect healing bone from further stress while maintaining general conditioning', diagram:'walking'},
        {icon:'🚲', name:'Stationary Cycling (low resistance)', sets:'20–30 min', desc:'Non-impact cardiovascular maintenance during protected weight-bearing phase.', focus:'Maintain aerobic fitness without tibial loading during bone healing', diagram:'cycling'},
        {icon:'💪', name:'Upper Body & Core Maintenance', sets:'3x15 reps', desc:'Maintain overall conditioning while lower limb is protected.', focus:'Preserve upper body and core strength to minimise deconditioning during recovery', diagram:'dead_bug'},
        {icon:'🦵', name:'Graded Return to Running (post-clearance)', sets:'Walk/run program over 6–8 weeks', desc:'Medical clearance required before return — structured progressive loading only.', focus:'Graduated tibial loading after confirmed bony healing on imaging', diagram:'walking'}
      ]
    }
  ],
  elbow: [
    {
      name: 'Lateral Epicondylalgia (Tennis Elbow)',
      ageNote: 'Peak 40–49 years; 1–3% of adults; equal male/female; risk factors: smoking, obesity, forearm rotation >4 hrs/day',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Lateral elbow pain')) score+=5;
        if(s.has('Weakness of grip')) score+=3;
        if(s.has('Deep ache')) score+=1;
        if(a.has('Gripping')||a.has('Lifting (even light objects)')) score+=4;
        if(a.has('Wrist extension activities')||a.has('Forearm rotation >4 hrs/day')) score+=3;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        if(tests['Cozen Test / Thomsen Test']==='+') score+=5;
        if(tests['Mill\'s Test']==='+') score+=3;
        if(tests['Lateral Epicondyle Palpation']==='+') score+=4;
        if(tests['Grip Strength Assessment (dynamometer)']==='+') score+=3;
        if(age) {
          if(age >= 40 && age <= 55) score+=2;
        }
        // Penalties: neurological features suggest radial tunnel or cubital tunnel, not LE
        if(s.has('Numbness')||s.has('Tingling')||s.has('Paresthesias (thumb / index / middle fingers)')) score=Math.max(0,score-4);
        if(s.has('Paresthesias (ring / little fingers)')) score=Math.max(0,score-4);
        // Medial elbow pain = medial epicondylalgia or UCL, not lateral
        if(s.has('Medial elbow pain')&&!s.has('Lateral elbow pain')) score=Math.max(0,score-5);
        // Finger extension weakness = posterior interosseous nerve syndrome
        if(s.has('Weakness of finger extension')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Lateral epicondylalgia (LE) is a tendinopathy of the common extensor origin (primarily ECRB) at the lateral epicondyle. The Cozen test is a commonly used and clinically meaningful provocative test; reduced grip strength is a consistent and functional finding associated with LE. Insidious onset, pain with lifting even light objects, and pain with resisted wrist extension are hallmarks. Progressive tendon loading (isometric → isotonic eccentric → functional) is the evidence-based approach — avoid complete rest. A counterforce brace provides short-term symptom relief. Differentiate from radial tunnel syndrome (pain 3–4 cm distal to epicondyle) and PIN syndrome (motor weakness).',
      exercises:[
        {icon:'💪', name:'Isometric Wrist Extension Holds', sets:'5x45 sec, 70% effort', desc:'Pain-modulating isometrics — essential first phase of tendon loading; associated with pain reduction in tendinopathy literature.', focus:'Pain-free isometric loading as first-line treatment for lateral epicondylalgia', diagram:'wrist_isometric'},
        {icon:'🔄', name:'Eccentric Wrist Extension (Tyler Twist / slow lowering)', sets:'3x15, slow 3–4 sec eccentric', desc:'Evidence-based eccentric loading — lower weight slowly from full extension back to flexion.', focus:'Eccentric ECRB loading — evidence-based stimulus for lateral tendinopathy remodelling', diagram:'wrist_eccentric'},
        {icon:'🌀', name:'Forearm Pronation/Supination (light weight)', sets:'3x15 reps', desc:'Rotational tendon loading — progress to heavier load as tolerance improves.', focus:'Restore functional forearm rotation range in a pain-controlled manner', diagram:'forearm_rotation'},
        {icon:'🧘', name:'Wrist Flexor Stretch (elbow extended)', sets:'Hold 30 sec x3', desc:'Reduces common extensor origin tension — stretch with elbow straight for maximum effect.', focus:'Restore flexor extensibility with elbow extended for maximal tissue load', diagram:'wrist_stretch'}
      ]
    },
    {
      name: 'Medial Epicondylalgia (Golfer\'s Elbow)',
      ageNote: 'Peak 40–60 years; associated with repetitive wrist flexion/pronation; overhead athletes',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial elbow pain')) score+=5;
        if(s.has('Weakness of grip')) score+=2;
        if(s.has('Deep ache')) score+=1;
        if(a.has('Wrist flexion activities')||a.has('Forearm pronation')) score+=4;
        if(a.has('Gripping')||a.has('Throwing (late cocking / acceleration)')) score+=3;
        if(al.has('Rest')||al.has('Activity modification')) score+=2;
        if(tests['Medial Epicondyle Palpation']==='+') score+=4;
        if(tests['Resisted Wrist Flexion Test']==='+') score+=4;
        if(tests['Resisted Forearm Pronation Test']==='+') score+=3;
        // Must differentiate from UCL and cubital tunnel
        if(tests['Moving Valgus Stress Test']==='-') score+=2;
        if(tests['Tinel\'s Sign (cubital tunnel)']==='-') score+=1;
        if(age) {
          if(age >= 40 && age <= 60) score+=2;
        }
        return score;
      },
      edu:'Medial epicondylalgia involves the common flexor-pronator origin (primarily FCR and pronator teres). Pain is at the medial epicondyle, worsened by wrist flexion, pronation, and gripping. Must differentiate from UCL injury (pain more distal, at sublime tubercle; positive moving valgus stress test) and cubital tunnel syndrome (paresthesias in ring/little fingers; positive Tinel\'s). Progressive flexor-pronator loading is the evidence-based treatment approach, mirroring lateral epicondylalgia rehabilitation.',
      exercises:[
        {icon:'💪', name:'Isometric Wrist Flexion Holds', sets:'5x45 sec, 70% effort', desc:'Initial pain-modulating isometrics — begin at comfortable wrist angle.', focus:'Isometric flexor loading as the first pain-safe stage of medial epicondylalgia rehab', diagram:'wrist_isometric'},
        {icon:'🔄', name:'Eccentric Wrist Flexion Loading', sets:'3x15, slow 3–4 sec eccentric', desc:'Slow eccentric lowering from full wrist flexion back to extension — tendon remodeling.', focus:'Eccentric flexor loading to stimulate adaptive remodelling at the medial epicondyle', diagram:'wrist_flexion'},
        {icon:'🌀', name:'Forearm Pronation/Supination (progressive)', sets:'3x15 reps', desc:'Pronator teres loading — progress to heavier resistance as pain settles.', focus:'Progressively load forearm rotation to restore occupational capacity', diagram:'forearm_rotation'},
        {icon:'🧘', name:'Wrist Extensor Stretch (elbow extended)', sets:'Hold 30 sec x3', desc:'Reduces common flexor origin tension — stretch antagonist with elbow extended.', focus:'Stretch the extensor origin with elbow extended to maximise tissue length', diagram:'wrist_stretch'}
      ]
    },
    {
      name: 'Cubital Tunnel Syndrome (Ulnar Nerve)',
      ageNote: 'Any age; associated with repetitive elbow flexion, external compression, and occupational activities',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial elbow pain')) score+=2;
        if(s.has('Paresthesias (ring / little fingers)')) score+=5;
        if(s.has('Numbness')) score+=3;
        if(s.has('Intrinsic muscle atrophy')) score+=4;
        if(s.has('Weakness of grip')) score+=2;
        if(a.has('Elbow flexion (prolonged)')||a.has('Elbow flexion during sleep')) score+=4;
        if(a.has('Leaning on elbow')) score+=3;
        if(al.has('Elbow extension')||al.has('Avoiding elbow flexion')) score+=3;
        if(tests['Tinel\'s Sign (cubital tunnel)']==='+') score+=4;
        if(tests['Elbow Flexion Test']==='+') score+=3;
        if(tests['Shoulder IR Elbow Flexion Test']==='+') score+=5;
        // Penalties: lateral elbow pain is not consistent with cubital tunnel
        if(s.has('Lateral elbow pain')&&!s.has('Medial elbow pain')) score=Math.max(0,score-4);
        // Thumb/index/middle finger paresthesias = median nerve (CTS or pronator teres), not ulnar
        if(s.has('Paresthesias (thumb / index / middle fingers)')&&!s.has('Paresthesias (ring / little fingers)')) score=Math.max(0,score-4);
        // Finger extension weakness = posterior interosseous nerve, not cubital tunnel
        if(s.has('Weakness of finger extension')&&!s.has('Intrinsic muscle atrophy')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Cubital tunnel syndrome is the second most common peripheral nerve entrapment after CTS, involving the ulnar nerve at the medial elbow. Paresthesias in the ring and little fingers, worsened by sustained elbow flexion, are hallmark. The shoulder IR elbow flexion test is among the most clinically informative tests when positive, with strong literature support. Intrinsic muscle atrophy indicates severe or long-standing compression. Ultrasound at the medial epicondyle can provide supporting evidence when clinical findings are equivocal. Nerve gliding, elbow padding, and nocturnal extension splinting are first-line; surgical decompression for refractory cases.',
      exercises:[
        {icon:'🔄', name:'Ulnar Nerve Gliding Exercises', sets:'2x10 gentle glides', desc:'Mobilises ulnar nerve through the cubital tunnel — use sliding technique; avoid tension-loading.', focus:'Mobilise ulnar nerve through the cubital tunnel to reduce compressive sensitisation', diagram:'nerve_floss_supine'},
        {icon:'🧘', name:'Nocturnal Elbow Extension Splinting', sets:'Nightly', desc:'Prevents sustained elbow flexion during sleep — the most common aggravating position.', focus:'Maintain elbow in extension overnight to reduce ulnar nerve compression during sleep', diagram:'wrist_isometric'},
        {icon:'💪', name:'Elbow Padding / Cubital Tunnel Protection', sets:'During provocative activities', desc:'Reduces external nerve compression at the medial epicondyle during desk work and driving.', focus:'Reduce direct external compression on the cubital tunnel during daily activity', diagram:'wrist_isometric'},
        {icon:'🌀', name:'Intrinsic Hand Strengthening (late stage)', sets:'3x15 reps', desc:'Restore intrinsic muscle strength — begin only when acute neural symptoms are controlled.', focus:'Rebuild intrinsic muscle capacity as the final stage of nerve recovery', diagram:'finger_extension'}
      ]
    },
    {
      name: 'Radial Tunnel Syndrome',
      ageNote: 'Any age; often coexists with lateral epicondylalgia (44% of treatment-resistant LE cases)',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Proximal lateral forearm pain')) score+=5;
        if(s.has('Deep ache')) score+=2;
        // Key differentiator from LE: pain is distal, NO motor weakness
        if(!s.has('Weakness of finger extension')) score+=2;
        if(a.has('Forearm pronation')||a.has('Forearm supination')||a.has('Forearm rotation >4 hrs/day')) score+=3;
        if(a.has('Gripping')||a.has('Wrist extension activities')) score+=2;
        if(al.has('Rest')||al.has('Avoiding gripping')) score+=2;
        if(tests['Radial Tunnel Palpation (3–4 cm distal to LE)']==='+') score+=5;
        if(tests['Resisted Supination Test']==='+') score+=4;
        if(tests['Resisted Middle Finger Extension Test']==='+') score+=4;
        // LE tests negative helps differentiate
        if(tests['Cozen Test / Thomsen Test']==='-') score+=2;
        if(tests['Lateral Epicondyle Palpation']==='-') score+=2;
        // Penalties: neurological numbness/tingling = PIN syndrome or cubital tunnel, not radial tunnel (pure pain)
        if(s.has('Numbness')||s.has('Tingling')||s.has('Paresthesias (ring / little fingers)')) score=Math.max(0,score-3);
        // Medial elbow pain excludes radial tunnel
        if(s.has('Medial elbow pain')&&!s.has('Proximal lateral forearm pain')) score=Math.max(0,score-4);
        // Motor weakness = PIN syndrome not radial tunnel (which is pure pain)
        if(s.has('Weakness of finger extension')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Radial tunnel syndrome involves compression of the radial nerve (before motor branch division) in the radial tunnel, 3–4 cm distal to the lateral epicondyle. Pain is in the proximal lateral forearm — more distal than LE — without motor weakness (distinguishes from PIN syndrome). It coexists with LE in 44% of treatment-resistant cases, explaining why LE treatment fails. Electrodiagnostic studies are often normal. Nerve decompression exercises, activity modification, and addressing the underlying repetitive forearm rotation are the primary treatments. PIN nerve block with pain relief is used to support the diagnosis when clinical findings are equivocal.',
      exercises:[
        {icon:'🔄', name:'Radial Nerve Gliding / Neural Mobilisation', sets:'2x10 gentle glides', desc:'Mobilises radial nerve through the radial tunnel — key differentiating treatment from LE.', focus:'Restore radial nerve mobility to reduce radial tunnel neural tension', diagram:'nerve_floss_supine'},
        {icon:'🧘', name:'Supinator Stretch', sets:'Hold 30 sec x3', desc:'Stretches supinator muscle compressing PIN at arcade of Frohse.', focus:'Restore supinator extensibility and reduce radial tunnel compressive pressure', diagram:'wrist_stretch'},
        {icon:'💪', name:'Forearm Rotation Load Management', sets:'Activity modification', desc:'Reduce repetitive supination/pronation that provokes radial tunnel compression.', focus:'Identify and modify activities driving cumulative forearm rotation load', diagram:'forearm_rotation'},
        {icon:'🌀', name:'Wrist Extensor Strengthening (pain-free range)', sets:'3x15 reps', desc:'Progressive loading once neural symptoms are controlled — similar to LE protocol.', focus:'Progressive wrist extensor loading to restore tendon capacity', diagram:'wrist_isometric'}
      ]
    },
    {
      name: 'Posterior Interosseous Nerve Syndrome (Supinator Syndrome)',
      ageNote: 'Any age; associated with space-occupying lesions (lipoma), synovitis, or repetitive forearm rotation',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Weakness of finger extension')) score+=6;
        // Motor only — no sensory symptoms is key differentiator
        if(!s.has('Numbness')&&!s.has('Tingling')&&!s.has('Paresthesias (ring / little fingers)')) score+=4;
        // Penalties: sensory symptoms = not pure PIN syndrome
        if(s.has('Numbness')||s.has('Tingling')) score=Math.max(0,score-4);
        if(s.has('Paresthesias (ring / little fingers)')||s.has('Paresthesias (thumb / index / middle fingers)')) score=Math.max(0,score-4);
        // Medial elbow pain = UCL or cubital tunnel, not PIN
        if(s.has('Medial elbow pain')) score=Math.max(0,score-3);
        // Without finger extension weakness, PIN is very unlikely
        if(!s.has('Weakness of finger extension')) score=Math.max(0,score-5);
        if(a.has('Forearm rotation >4 hrs/day')||a.has('Gripping')) score+=2;
        if(tests['Finger Drop Assessment']==='+') score+=6;
        if(tests['Resisted Supination Test']==='+') score+=3;
        return score;
      },
      edu:'PIN syndrome (supinator syndrome) causes pure motor weakness — finger drop and thumb extension weakness — without sensory symptoms. Wrist extension is preserved (ECRL is spared as it branches proximal to the arcade of Frohse), but with radial deviation. This pattern distinguishes PIN syndrome from radial tunnel (sensory/pain only) and from lateral epicondylalgia (no motor loss). MRI evaluates for space-occupying lesions (lipoma is most common). Surgical decompression is often required.',
      exercises:[
        {icon:'💪', name:'Finger Extension Strengthening', sets:'3x15 reps with band', desc:'Rehabilitate EDC after decompression — progress from assisted to resisted.', focus:'Strengthen finger extensors to restore intrinsic hand function after nerve injury', diagram:'finger_extension'},
        {icon:'🔄', name:'Wrist Extensor Strengthening (ECRL preserved)', sets:'3x15 reps', desc:'Maintain ECRL function and begin re-education of PIN-supplied muscles.', focus:'Selectively load extensor carpi radialis longus while avoiding ECRB', diagram:'wrist_isometric'},
        {icon:'🧘', name:'Thumb Extension / Abduction Exercises', sets:'3x15 reps', desc:'EPL / EPB strengthening — key functional deficit in PIN syndrome.', focus:'Rebuild thumb extensor and abductor strength to restore pinch and grip function', diagram:'finger_extension'},
        {icon:'🌀', name:'Forearm Rotation Strengthening (post-decompression)', sets:'3x15 reps', desc:'Progressive supinator strengthening after surgical or conservative management.', focus:'Rebuild forearm rotation strength after surgical decompression', diagram:'forearm_rotation'}
      ]
    },
    {
      name: 'Pronator Teres Syndrome (Median Nerve)',
      ageNote: 'Any age; associated with repetitive pronation/supination and forceful gripping',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Volar forearm aching')) score+=4;
        if(s.has('Paresthesias (thumb / index / middle fingers)')) score+=4;
        if(s.has('Numbness')) score+=2;
        if(s.has('Weakness of grip')) score+=2;
        if(a.has('Forearm pronation')||a.has('Gripping')) score+=3;
        if(a.has('Elbow flexion (prolonged)')) score+=2;
        if(al.has('Rest')||al.has('Avoiding gripping')) score+=2;
        if(tests['Pronator Teres Palpation']==='+') score+=4;
        if(tests['Resisted Forearm Pronation Test']==='+') score+=3;
        if(tests['Resisted Elbow Flexion (lacertus fibrosus)']==='+') score+=3;
        if(tests['Resisted FDS Middle Finger Flexion']==='+') score+=3;
        if(tests['Palmar Cutaneous Branch Sensation']==='+') score+=4; // distinguishes from CTS
        // Penalties: ring/little finger paresthesias = ulnar nerve, not median
        if(s.has('Paresthesias (ring / little fingers)')&&!s.has('Paresthesias (thumb / index / middle fingers)')) score=Math.max(0,score-4);
        // Lateral elbow pain suggests lateral epicondylalgia or radial tunnel
        if(s.has('Lateral elbow pain')) score=Math.max(0,score-3);
        // Finger extension weakness = PIN syndrome, not pronator teres
        if(s.has('Weakness of finger extension')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Pronator teres syndrome involves median nerve compression at the proximal forearm (pronator teres, lacertus fibrosus, or FDS arch). Paresthesias are in the thumb/index/middle fingers (same as CTS), but the palmar cutaneous branch IS affected — causing proximal palm numbness not seen in CTS. Symptoms worsen with cyclic forearm stress rather than nocturnal wrist position. Electrodiagnostic studies are often normal. Activity modification, nerve gliding, and progressive pronator loading are first-line.',
      exercises:[
        {icon:'🔄', name:'Median Nerve Gliding Exercises', sets:'2x10 gentle glides', desc:'Mobilises median nerve through the pronator teres and FDS arch.', focus:'Restore median nerve excursion to reduce carpal tunnel or pronator compression', diagram:'nerve_floss_supine'},
        {icon:'🧘', name:'Pronator Teres Stretch', sets:'Hold 30 sec x3', desc:'Supination stretch decompresses the median nerve at the pronator teres.', focus:'Reduce pronator teres compressive tension on the radial nerve', diagram:'wrist_stretch'},
        {icon:'💪', name:'Progressive Pronation/Supination Loading', sets:'3x15 reps', desc:'Graded forearm rotation loading — reduces muscle tightness compressing median nerve.', focus:'Systematically increase forearm rotation load to restore full functional capacity', diagram:'forearm_rotation'},
        {icon:'🌀', name:'Activity & Ergonomic Modification', sets:'Ongoing', desc:'Reduce repetitive pronation tasks — ergonomic assessment essential for occupational cases.', focus:'Identify and modify the specific activities driving symptom load', diagram:'seated_lean'}
      ]
    },
    {
      name: 'Ulnar Collateral Ligament (UCL) Sprain',
      ageNote: 'Overhead throwing athletes (especially baseball pitchers); acute or chronic onset',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Medial elbow pain')) score+=3;
        if(s.has('Decline in throwing performance')) score+=4;
        if(s.has('Clicking / popping')) score+=2;
        if(s.has('Paresthesias (ring / little fingers)')) score+=1; // occasional ulnar involvement
        if(a.has('Throwing (late cocking / acceleration)')) score+=5;
        if(a.has('Overhead activities')) score+=2;
        if(al.has('Rest')||al.has('Avoiding throwing')) score+=2;
        if(tests['Moving Valgus Stress Test']==='+') score+=5; // most reliable
        if(tests['Valgus Stress Test (20–30° flexion)']==='+') score+=4;
        if(tests['Milking Maneuver']==='+') score+=3;
        if(tests['UCL / Sublime Tubercle Palpation']==='+') score+=3;
        // Differentiate from medial epicondylalgia: pain at sublime tubercle, not epicondyle
        if(tests['Medial Epicondyle Palpation']==='-') score+=2;
        // Penalties: lateral elbow pain is not consistent with medial UCL
        if(s.has('Lateral elbow pain')&&!s.has('Medial elbow pain')) score=Math.max(0,score-4);
        // No throwing mechanism in a non-throwing athlete makes UCL sprain unlikely
        if(!a.has('Throwing (late cocking / acceleration)')&&!a.has('Overhead activities')&&!s.has('Decline in throwing performance')) score=Math.max(0,score-3);
        // Finger extension weakness = PIN syndrome, not UCL
        if(s.has('Weakness of finger extension')) score=Math.max(0,score-3);
        return score;
      },
      edu:'UCL injuries are the most common elbow injury in overhead throwing athletes, with a dramatic increase in incidence over recent decades. The moving valgus stress test is among the most clinically informative tests for UCL involvement. Pain is just distal to the medial epicondyle at the sublime tubercle — more distal than medial epicondylalgia. MR arthrography is the preferred imaging investigation and provides detailed assessment of ligament integrity. Conservative rehabilitation (UCL strengthening, scapular control, posterior shoulder stretching) is first-line for partial tears; UCL reconstruction (Tommy John surgery) for complete tears or failed conservative management in competitive throwers.',
      exercises:[
        {icon:'🧘', name:'Posterior Shoulder Capsule Stretching (sleeper stretch)', sets:'Hold 30 sec x3', desc:'GIRD is a primary contributor to UCL injury in throwers — must address.', focus:'Restore IR range by stretching the posterior capsule against the mattress', diagram:'sleeper_stretch'},
        {icon:'💪', name:'Forearm Flexor-Pronator Strengthening', sets:'3x15 progressive load', desc:'Strengthens dynamic UCL stabilisers — FCR and pronator teres.', focus:'Load the common flexor origin to drive medial tendinopathy remodelling', diagram:'wrist_flexion'},
        {icon:'🔄', name:'Interval Throwing Program (graded return)', sets:'6–9 months return to pitching', desc:'Criterion-based throwing return — begin at 45 ft flat ground, progress to full velocity.', focus:'Graduated distance/intensity throwing progression to protect healing structures', diagram:'walking'},
        {icon:'🌀', name:'Scapular Stabilization + Rotator Cuff', sets:'3x15 each', desc:'Full kinetic chain rehabilitation — elbow UCL receives forces from proximal chain mechanics.', focus:'Simultaneously target the scapular stabilisers and rotator cuff', diagram:'scapular_retraction'}
      ]
    },
    {
      name: 'Distal Biceps Tendinopathy',
      ageNote: 'Middle-aged males; associated with repetitive elbow flexion/supination',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Anterior elbow pain')) score+=4;
        if(s.has('Weakness with supination')) score+=3;
        if(s.has('Deep ache')) score+=2;
        if(a.has('Elbow flexion (prolonged)')||a.has('Lifting (even light objects)')) score+=3;
        if(a.has('Forearm supination')) score+=3;
        if(al.has('Rest')||al.has('Avoiding gripping')) score+=2;
        if(tests['Biceps Provocation Test']==='+') score+=6;
        if(tests['Resisted Hook Test']==='+') score+=3;
        if(tests['Palpation-Rotation Test']==='+') score+=4;
        // Differentiate from rupture: absent hook test finding is associated with intact tendon
        if(tests['Hook Test (rupture)']==='-') score+=2;
        if(sex==='male') score+=1;
        if(age) { if(age >= 35 && age <= 55) score+=2; }
        // Penalties: lateral elbow pain excludes distal biceps (anterior/anterior-medial)
        if(s.has('Lateral elbow pain')&&!s.has('Anterior elbow pain')) score=Math.max(0,score-3);
        // Audible pop with acute ecchymosis = rupture, not tendinopathy
        if(s.has('Audible pop (acute)')&&s.has('Ecchymosis (acute)')) score=Math.max(0,score-4);
        // Neurological symptoms suggest cubital tunnel or pronator teres
        if(s.has('Paresthesias (ring / little fingers)')||s.has('Paresthesias (thumb / index / middle fingers)')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Distal biceps tendinopathy involves the biceps tendon at its insertion on the radial tuberosity. The biceps provocation test is among the most clinically informative single tests for distal biceps pathology — a positive result with anterior elbow pain reproduction at 90° elbow flexion is associated with tendon involvement. The palpation-rotation test is associated with partial tear involvement. MRI in the FABS position (flexion-abduction-supination) is the preferred imaging investigation for confirmation. Progressive biceps loading (isometric → isotonic → sport-specific) is the evidence-based treatment.',
      exercises:[
        {icon:'💪', name:'Isometric Elbow Flexion + Supination Holds', sets:'5x45 sec, 70% effort', desc:'Pain-modulating isometrics — begin at 90° elbow flexion in neutral rotation.', focus:'Combined elbow flexion and supination isometric — matches LHB functional demand', diagram:'elbow_flexion'},
        {icon:'🔄', name:'Eccentric Elbow Flexion Lowering (biceps curl)', sets:'3x15, 3–4 sec eccentric', desc:'Evidence-supported tendon remodeling — slow lowering from flexion to extension.', focus:'Eccentric biceps loading to remodel the distal biceps tendon insertion', diagram:'elbow_flexion'},
        {icon:'🌀', name:'Forearm Supination Loading (progressive)', sets:'3x15 reps with resistance', desc:'Biceps supinator loading — most functionally important motion for distal biceps.', focus:'Progressively load supinator to restore strength after LHB or nerve injury', diagram:'forearm_rotation'},
        {icon:'🧘', name:'Biceps Stretch (shoulder extension + pronation)', sets:'Hold 30 sec x3', desc:'Restores biceps flexibility — stretch in shoulder extension with forearm pronated.', focus:'Reduce LHB tendon load by lengthening through extension and pronation', diagram:'biceps_stretch'}
      ]
    },
    {
      name: 'Distal Biceps Tendon Rupture (Complete)',
      ageNote: 'Males 40–60 years; dominant arm; acute eccentric load mechanism',
      match:(s,a,al,obj,tests,age,sex) => {
        let score=0;
        if(s.has('Audible pop (acute)')) score+=5;
        if(s.has('Anterior elbow pain')) score+=2;
        if(s.has('Ecchymosis (acute)')) score+=3;
        if(s.has('Weakness with supination')) score+=4;
        if(s.has('Weakness of grip')) score+=2;
        if(tests['Hook Test (rupture)']==='+') score+=5;
        if(tests['Biceps Crease Interval (BCI)']==='+') score+=4;
        if(tests['Passive Forearm Pronation Test']==='+') score+=4;
        if(tests['Biceps Squeeze Test']==='+') score+=4;

        const ruptureTests = [tests['Hook Test (rupture)'], tests['Biceps Crease Interval (BCI)'], tests['Passive Forearm Pronation Test']].filter(t=>t==='+').length;
        if(ruptureTests >= 3) score+=6;
        if(sex==='male') score+=2;
        if(age) { if(age >= 40 && age <= 60) score+=2; }
        // Penalties: no acute mechanism/pop = tendinopathy, not rupture
        if(!s.has('Audible pop (acute)')&&!s.has('Ecchymosis (acute)')) score=Math.max(0,score-3);
        // Gradual insidious onset is not consistent with complete tendon rupture
        if(!s.has('Weakness with supination')) score=Math.max(0,score-3);
        // Neurological features suggest nerve entrapment, not tendon rupture
        if(s.has('Paresthesias (ring / little fingers)')||s.has('Paresthesias (thumb / index / middle fingers)')) score=Math.max(0,score-3);
        return score;
      },
      edu:'Complete distal biceps rupture presents acutely with a "pop," anterior ecchymosis, weakness with supination and flexion, and the classic "Popeye" deformity (muscle belly retracts proximally). The combination of the hook test, biceps crease interval measurement, and passive pronation test provides strong clinical pattern consistency with complete rupture when all three findings are present. Refer urgently for surgical evaluation — repair within 2–3 weeks achieves superior outcomes in strength and endurance compared to delayed repair. Conservative management is reserved for elderly sedentary patients who accept permanent supination and flexion weakness.',
      exercises:[
        {icon:'🦵', name:'Pre-operative Elbow ROM Maintenance', sets:'Active ROM 3x daily', desc:'Maintain motion before surgical repair — begin immediately after injury.', focus:'Preserve available range before surgery to optimise post-operative recovery', diagram:'elbow_flexion'},
        {icon:'🔄', name:'Post-operative Protocol (weeks 0–6)', sets:'Surgeon-guided ROM in brace', desc:'Gradual ROM — no resisted supination or flexion until tendon healing confirmed.', focus:'Controlled early mobilisation within surgical healing constraints', diagram:'walking'},
        {icon:'💪', name:'Progressive Biceps Loading (weeks 6–12)', sets:'Isometric → isotonic', desc:'Begin resisted loading under surgical protocol — bilateral comparison throughout.', focus:'Systematically progress biceps loading after LHB repair or tendinopathy', diagram:'elbow_flexion'},
        {icon:'🌀', name:'Return to Full Activity (months 4–6)', sets:'Sport/work-specific loading', desc:'Full supination strength typically recovers by 4–6 months post-repair.', focus:'Criteria-based return to full loading after adequate tissue healing', diagram:'walking'}
      ]
    }
  ]
};

// ======== RENDERING ========
function renderChips(containerId, area, dataObj) {
  const chips = dataObj[area] || dataObj['lumbar'] || [];
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  chips.forEach((c, idx) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = c;
    btn.setAttribute('tabindex', '0');
    btn.onclick = () => { btn.classList.toggle('selected'); };
    btn.onkeydown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); btn.classList.toggle('selected'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); const next = el.querySelectorAll('.chip')[idx+1]; if(next) next.focus(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); const prev = el.querySelectorAll('.chip')[idx-1]; if(prev) prev.focus(); }
    };
    el.appendChild(btn);
  });
}

function getSelectedChips(containerId) {
  const chips = document.querySelectorAll(`#${containerId} .chip.selected`);
  return new Set([...chips].map(c => c.textContent));
}

function renderObjectiveFields() {
  const area = state.area || 'lumbar';
  const fields = OBJECTIVE_FIELDS[area];
  const container = document.getElementById('objectiveFields');
  container.innerHTML = '';

  if(fields.mmt.length) {
    const lbl = document.createElement('div');
    lbl.className = 'section-label';
    lbl.textContent = 'Manual Muscle Testing (MMT) — Grade 0–5';
    container.appendChild(lbl);
    const grid = document.createElement('div');
    grid.className = 'objective-grid';
    fields.mmt.forEach(f => {
      const g = document.createElement('div');
      g.className = 'field-group';
      g.innerHTML = `<label>${f}</label><input type="text" data-key="mmt_${f}" placeholder="e.g. 4+/5" />`;
      grid.appendChild(g);
    });
    container.appendChild(grid);
  }

  if(fields.rom.length) {
    const lbl2 = document.createElement('div');
    lbl2.className = 'section-label';
    lbl2.textContent = 'Range of Motion (ROM)';
    container.appendChild(lbl2);
    const grid2 = document.createElement('div');
    grid2.className = 'objective-grid';
    fields.rom.forEach(f => {
      const g = document.createElement('div');
      g.className = 'field-group';
      g.innerHTML = `
        <label style="display:flex;align-items:center;justify-content:space-between;">
          <span>${f.label}</span>
          <span class="norm-badge">Norm: ${f.norm}</span>
        </label>
        <input type="text" data-key="rom_${f.label}" placeholder="Enter value" />`;
      grid2.appendChild(g);
    });
    container.appendChild(grid2);
  }

  // Hamstring length — only relevant for lower extremity and spinal regions
  const slrRegions = ['lumbar', 'thoracic', 'pelvis', 'knee', 'ankle'];
  if (slrRegions.includes(area)) {
    const slrLbl = document.createElement('div');
    slrLbl.className = 'section-label';
    slrLbl.textContent = 'Hamstring Length — Straight Leg Raise (SLR)';
    container.appendChild(slrLbl);

    const slrDesc = document.createElement('p');
    slrDesc.style.cssText = 'font-size:0.82rem;color:var(--muted);margin-bottom:14px;line-height:1.5;';
    slrDesc.textContent = 'Supine, contralateral knee extended. Record angle at which posterior thigh tension limits motion. Norms are compared against age/sex entered on page 2.';
    container.appendChild(slrDesc);

    const slrGrid = document.createElement('div');
    slrGrid.className = 'objective-grid';
    slrGrid.innerHTML = `
      <div class="field-group">
        <label>SLR — Right (°)</label>
        <input type="number" id="slrRight" placeholder="e.g. 65" min="0" max="120" oninput="renderSLRFeedback()" />
      </div>
      <div class="field-group">
        <label>SLR — Left (°)</label>
        <input type="number" id="slrLeft" placeholder="e.g. 70" min="0" max="120" oninput="renderSLRFeedback()" />
      </div>`;
    container.appendChild(slrGrid);

    const slrFb = document.createElement('div');
    slrFb.id = 'slrFeedback';
    slrFb.style.marginTop = '16px';
    container.appendChild(slrFb);
  }
}

// ── SPECIAL TEST → DIAGNOSIS MAPPING ──
// Each entry: { ruleIn: [...], ruleOut: [...] }
// ruleIn = tests with strong positive signal; ruleOut = tests whose negative result lowers suspicion
const DDX_TESTS = {
  // ── LUMBAR ──
  'Lumbar Disc Herniation': {
    ruleIn:  ['SLR — Crossed (contralateral)'],   // contralateral SLR is associated with significant nerve root involvement
    ruleOut: ['SLR — Ipsilateral (straight leg raise)','Slump Test','Dermatomal Sensory Testing']  // ipsilateral SLR is a commonly used nerve tension screening test
  },
  'Lumbar Spinal Stenosis': {
    ruleIn:  ['Romberg Test','Gait Assessment (wide-based)'],  // associated with central canal compromise when positive
    ruleOut: ['Romberg Test','Vibration Sense (malleoli / great toe)']  // used to evaluate sensory pathway involvement
  },
  'Lumbar Radiculopathy': {
    ruleIn:  ['SLR — Crossed (contralateral)','Dermatomal Sensory Testing'],
    ruleOut: ['SLR — Ipsilateral (straight leg raise)','Slump Test','Femoral Nerve Tension Test']
  },
  'Sacroiliac Joint Dysfunction': {
    ruleIn:  ['SI Provocation — Thigh Thrust','SI Provocation — Distraction','SI Provocation — Compression','SI Provocation — Gaenslen\'s Test','SI Provocation — Sacral Thrust'],  // ≥3 positive from the cluster increases pattern consistency
    ruleOut: ['SI Provocation — Thigh Thrust','SI Provocation — Distraction','FABER Test (Patrick\'s)']
  },
  'Lumbar Facet Syndrome': {
    ruleIn:  ['Spring Test (posterior-anterior pressure)'],
    ruleOut: ['Prone Instability Test','Waddell\'s Signs (non-organic)']
  },
  'Lumbar Segmental Instability': {
    ruleIn:  ['Prone Instability Test','Aberrant Movement Pattern Observation'],
    ruleOut: ['Spring Test (posterior-anterior pressure)']
  },
  'Lumbar Muscle Strain': {
    ruleIn:  ['Spring Test (posterior-anterior pressure)'],
    ruleOut: ['Waddell\'s Signs (non-organic)','SLR — Ipsilateral (straight leg raise)']
  },
  // ── THORACIC ──
  'Thoracic Disc Pathology': {
    ruleIn:  ['Slump Test','Segmental Mobility Testing (spring test)'],
    ruleOut: ['Slump Test','Thoracic Active ROM (inclinometer)']
  },
  'Thoracic Facet Syndrome': {
    ruleIn:  ['Thoracic Facet Loading (Ext + Rotation)','Segmental Mobility Testing (spring test)'],
    ruleOut: ['Thoracic Active ROM (inclinometer)']
  },
  'Scheuermann\'s Kyphosis': {
    ruleIn:  ['Adam Forward Bend Test','Kyphosis Assessment (inclinometer)'],
    ruleOut: ['Back Extensor Endurance (Biering-Sørensen)','Kyphosis Assessment (inclinometer)']
  },
  'Thoracic Muscle Strain': {
    ruleIn:  ['Costovertebral Joint Palpation','Segmental Mobility Testing (spring test)'],
    ruleOut: ['Rib Spring / Compression Test','Thoracic Active ROM (inclinometer)']
  },
  'Thoracic Outlet Syndrome': {
    ruleIn:  ['Adson Test','Wright Test (Hyperabduction)'],
    ruleOut: ['Elevated Arm Stress Test (EAST / Roos)']
  },
  'Postural Kyphosis': {
    ruleIn:  ['Kyphosis Assessment (inclinometer)','Scapular Position Assessment (at rest)'],
    ruleOut: ['Back Extensor Endurance (Biering-Sørensen)','Adam Forward Bend Test']
  },
  // ── CERVICAL ──
  'Cervical Radiculopathy': {
    ruleIn:  ['Spurling Test (Compression)'],   // positive result associated with foraminal nerve root involvement
    ruleOut: ['Upper Limb Tension Test 1 (ULTT1)','Upper Limb Tension Test 2 (ULTT2b)','Upper Limb Tension Test 3 (ULTT3)','Cervical Distraction Test']  // combined negative ULNT cluster lowers clinical suspicion for radiculopathy
  },
  'Cervical Disc Herniation': {
    ruleIn:  ['Spurling Test (Compression)','Upper Limb Tension Test 3 (ULTT3)'],
    ruleOut: ['Cervical Distraction Test','Shoulder Abduction Relief Test','Upper Limb Tension Test 1 (ULTT1)']
  },
  'Cervical Facet Syndrome': {
    ruleIn:  ['Facet Loading Maneuver (Ext + Rotation)','Upper Cervical Segmental Mobility (C1–C3)'],
    ruleOut: ['Cervical Flexion-Rotation Test','Spurling Test (Compression)']
  },
  'Cervicogenic Headache': {
    ruleIn:  ['Cervical Flexion-Rotation Test','Upper Cervical Segmental Mobility (C1–C3)'],  // restricted rotation on symptomatic side supports C1–C3 involvement
    ruleOut: ['Cranial Cervical Flexion Test (CCFT)','Cervical Flexion-Rotation Test']
  },
  'Whiplash-Associated Disorder': {
    ruleIn:  ['Cranial Cervical Flexion Test (CCFT)'],
    ruleOut: ['Neck Flexor Endurance Test','Vertebral Artery / VBI Screening']
  },
  'Cervical Myelopathy': {
    ruleIn:  ['DTR — Biceps (C5/C6)','DTR — Brachioradialis (C6)','DTR — Triceps (C7)'],
    ruleOut: ['Myotomal Strength Testing','Dermatomal Sensory Testing']
  },
  // ── SHOULDER ──
  'RC Impingement / Subacromial Pain Syndrome': {
    ruleIn:  ['Hawkins-Kennedy Test','Neer Impingement Sign','Infraspinatus Strength Test'],  // subacromial pain pattern is best supported by this provocation/weakness cluster
    ruleOut: ['Hawkins-Kennedy Test','Neer Impingement Sign','Painful Arc Sign (60–120°)']  // negative provocative tests lower suspicion for subacromial involvement
  },
  'Rotator Cuff Tear': {
    ruleIn:  ['External Rotation Lag Test','Internal Rotation Lag Test','Drop Arm Test'],  // lag signs associated with full-thickness RC disruption
    ruleOut: ['Internal Rotation Lag Test']  // normal IRLT lowers suspicion for subscapularis tear
  },
  'SLAP Lesion': {
    ruleIn:  ['Dynamic Labral Shear Test'],  // positive result strongly associated with superior labral pathology
    ruleOut: ['O\'Brien Active Compression Test','Crank Test']  // negative O\'Brien and crank combination lowers labral suspicion
  },
  'GH Instability (Anterior)': {
    ruleIn:  ['Relocation Test','Release Test (Surprise Test)','Load and Shift Test'],  // positive cluster strongly associated with anterior instability
    ruleOut: ['Apprehension Test']  // absence of apprehension reduces clinical suspicion for instability
  },
  'Adhesive Capsulitis': {
    ruleIn:  ['Global Passive ROM Assessment'],  // clinical diagnosis — global passive restriction especially ER
    ruleOut: ['Global Passive ROM Assessment']
  },
  'LHB Tendinopathy': {
    ruleIn:  ['Bicipital Groove Tenderness','Upper Cut Test','Yergason\'s Test'],  // combination increases pattern consistency with LHB pathology
    ruleOut: ['Speed\'s Test','Bicipital Groove Tenderness']  // negative provocation tests lower suspicion for LHB involvement
  },
  'Scapular Dyskinesis': {
    ruleIn:  ['Scapular Retraction Test','Scapular Position / Winging Observation'],
    ruleOut: ['Scapular Assistance Test','Dynamic Scapular Observation (arm raise)']
  },
  // ── ELBOW ──
  'Lateral Epicondylalgia': {
    ruleIn:  ['Cozen Test / Thomsen Test','Lateral Epicondyle Palpation'],  // positive result associated with common extensor origin pathology
    ruleOut: ['Grip Strength Assessment (dynamometer)','Mill\'s Test']
  },
  'Medial Epicondylalgia': {
    ruleIn:  ['Medial Epicondyle Palpation','Resisted Wrist Flexion Test'],
    ruleOut: ['Resisted Forearm Pronation Test','Moving Valgus Stress Test']
  },
  'UCL Sprain': {
    ruleIn:  ['Moving Valgus Stress Test','Valgus Stress Test (20–30° flexion)'],  // Moving valgus most reliable
    ruleOut: ['Milking Maneuver','UCL / Sublime Tubercle Palpation']
  },
  'Cubital Tunnel Syndrome': {
    ruleIn:  ['Shoulder IR Elbow Flexion Test',"Tinel's Sign (cubital tunnel)",'Elbow Flexion Test'],
    ruleOut: ["Tinel's Sign (cubital tunnel)",'Elbow Flexion Test']
  },
  'Radial Tunnel Syndrome': {

    ruleIn:  ['Resisted Middle Finger Extension Test','Radial Tunnel Palpation (3–4 cm distal to LE)'],
    ruleOut: ['Resisted Supination Test']
  },
  'Distal Biceps Tendon Rupture': {
    ruleIn:  ['Hook Test (rupture)','Biceps Crease Interval (BCI)'],  // Hook test most reliable; BCI >6cm suggests rupture
    ruleOut: ['Biceps Squeeze Test','Passive Forearm Pronation Test']  // combined negative provocation cluster is associated with intact distal biceps tendon
  },
  'Posterior Interosseous Nerve Syndrome': {
    ruleIn:  ['Finger Drop Assessment','Resisted Middle Finger Extension Test'],
    ruleOut: ['Radial Tunnel Palpation (3–4 cm distal to LE)']
  },
  'Pronator Teres Syndrome': {
    ruleIn:  ['Pronator Teres Palpation','Palmar Cutaneous Branch Sensation'],
    ruleOut: ['Resisted Elbow Flexion (lacertus fibrosus)','Resisted FDS Middle Finger Flexion']
  },
  // ── HIP / PELVIS ──
  'Hip Osteoarthritis': {
    ruleIn:  ['FABER Test'],  // restricted or painful FABER associated with hip joint involvement
    ruleOut: ['FADIR Test']  // negative FADIR with multiple absent cluster findings lowers hip OA suspicion
  },
  'Femoroacetabular Impingement': {
    ruleIn:  ['FADIR Test','FABER Test'],
    ruleOut: ['FADIR Test','Trendelenburg Test']
  },
  'Hip Labral Tear': {
    ruleIn:  ['FABER Test','FADIR Test'],  // positive impingement cluster associated with intra-articular hip pathology
    ruleOut: ['FABER Test']  // negative FABER and impingement tests lower clinical suspicion for FAI/labral involvement
  },
  'Greater Trochanteric Pain Syndrome': {
    ruleIn:  ['Trendelenburg Test'],  // lateral hip pain reproduced in single-leg stance strongly associated with gluteal tendinopathy
    ruleOut: ['Ober Test']  // absence of greater trochanter tenderness lowers suspicion for gluteal tendinopathy
  },
  'Piriformis Syndrome': {
    ruleIn:  ['FADIR Test'],
    ruleOut: ['Ober Test','FABER Test']
  },
  'Snapping Hip Syndrome': {
    ruleIn:  ['Ober Test','Trendelenburg Test'],
    ruleOut: ['FABER Test']
  },
  'Gluteal Tendinopathy': {
    ruleIn:  ['Trendelenburg Test'],
    ruleOut: ['Ober Test']
  },
  'Proximal Hamstring Tendinopathy': {
    ruleIn:  ['Prone Hip Extension Test'],  // combined positive test associated with proximal hamstring tendinopathy
    ruleOut: ['Prone Hip Extension Test']   // negative combined test lowers clinical suspicion for proximal tendinopathy
  },
  'SIJ Dysfunction (Pelvic)': {
    ruleIn:  ['SI Provocation — Thigh Thrust','SI Provocation — Compression','SI Provocation — Distraction','SI Provocation — Gaenslen\'s Test','SI Provocation — Sacral Thrust'],
    ruleOut: ['FABER Test']
  },
  '⚠️ Femoral Neck Stress Fracture': {
    ruleIn:  ['Fulcrum Test','Heel Percussion Test'],  // positive test warrants urgent imaging; indicates potential stress fracture
    ruleOut: ['Hop Test (single leg)']  // localizes pain
  },
  // ── KNEE ──
  'ACL Tear': {
    ruleIn:  ['Lachman Test','Pivot Shift Test'],  // positive Lachman and pivot shift associated with ACL disruption
    ruleOut: ['Lachman Test','Anterior Drawer Test']  // negative laxity tests lower clinical suspicion for ACL tear
  },
  'PCL Tear': {
    ruleIn:  ['Posterior Drawer Test'],
    ruleOut: ['Posterior Drawer Test','Varus Stress Test (0° and 30°)']
  },
  'Meniscal Tear': {
    ruleIn:  ['Joint Line Palpation','Thessaly Test'],  // joint line tenderness and load-based provocation associated with meniscal pathology
    ruleOut: ['McMurray Test','Thessaly Test']  // negative McMurray and Thessaly lower clinical suspicion for meniscal tear
  },
  'MCL Sprain': {
    ruleIn:  ['Valgus Stress Test (0° and 30°)'],
    ruleOut: ['Valgus Stress Test (0° and 30°)','Joint Line Palpation']
  },
  'LCL/PLC Injury': {
    ruleIn:  ['Dial Test (30° and 90°)','Varus Stress Test (0° and 30°)'],
    ruleOut: ['Varus Stress Test (0° and 30°)']
  },
  'Patellofemoral Pain Syndrome': {
    ruleIn:  ['Patellar Compression Test','Patellar Grind / Clarke\'s Sign'],
    ruleOut: ['Single-Leg Squat Assessment']
  },
  'Patellar Tendinopathy': {
    ruleIn:  ['Patellar Tendon Palpation'],
    ruleOut: ['Single-Leg Squat Assessment','Patellar Tendon Palpation']
  },
  'IT Band Syndrome': {
    ruleIn:  ['Noble Compression Test'],
    ruleOut: ['Ober Test']
  },
  'Pes Anserine Bursitis': {
    ruleIn:  ['Pes Anserine Palpation'],
    ruleOut: ['Valgus Stress Test (0° and 30°)']
  },
  'Knee Osteoarthritis': {
    ruleIn:  ['Joint Line Palpation','Patellar Grind / Clarke\'s Sign'],
    ruleOut: ['Single-Leg Squat Assessment']
  },
  'Patellar Instability': {
    ruleIn:  ['Patellar Apprehension Test'],
    ruleOut: ['Single-Leg Squat Assessment']
  },
  // ── ANKLE ──
  'Lateral Ankle Sprain (ATFL/CFL)': {
    ruleIn:  ['Talar Tilt Test'],
    ruleOut: ['Anterior Drawer Test','Ottawa Ankle Rules Assessment']  // negative anterior drawer and Ottawa Rules lower suspicion for significant ATFL laxity and fracture
  },
  'High Ankle Sprain (Syndesmosis)': {
    ruleIn:  ['Squeeze Test (fibular compression)','Dorsiflexion-External Rotation Stress Test'],  // positive provocation associated with syndesmotic involvement
    ruleOut: ['Syndesmosis Ligament Palpation']  // absence of anterior tibiofibular ligament tenderness lowers syndesmotic suspicion
  },
  'Achilles Tendinopathy': {
    ruleIn:  ['Royal London Hospital Test','Arc Sign (Achilles)'],
    ruleOut: ['Matles Test (Achilles)']
  },
  'Achilles Tendon Rupture': {
    ruleIn:  ['Thompson Test','Matles Test (Achilles)'],
    ruleOut: ['Thompson Test']
  },
  'Plantar Fasciitis': {
    ruleIn:  ['Windlass Test (weight-bearing)'],
    ruleOut: ['Windlass Test']
  },
  'Posterior Tibial Tendon Dysfunction': {
    ruleIn:  ['Too Many Toes Sign','Single Heel Raise Test'],
    ruleOut: ['Single Heel Raise Fatigue Test']
  },
  'Peroneal Tendinopathy': {
    ruleIn:  ['Talar Tilt Test'],
    ruleOut: ['Anterior Drawer Test']
  },
  'Ankle Osteoarthritis': {
    ruleIn:  ['Ottawa Ankle Rules Assessment'],
    ruleOut: ['Anterior Drawer Test']
  },
  'Tarsal Tunnel Syndrome': {
    ruleIn:  ['Tinel\'s Sign (tarsal tunnel)'],
    ruleOut: ['Dorsiflexion-Eversion Test']
  },
  'Morton\'s Neuroma': {
    ruleIn:  ['Mulder\'s Click Test'],
    ruleOut: ['Metatarsal Squeeze Test']
  },
  'Stress Fracture (Foot)': {
    ruleIn:  ['Percussion / Tuning Fork Test'],
    ruleOut: ['Ottawa Ankle Rules Assessment']
  },
  'Sinus Tarsi Syndrome': {
    ruleIn:  ['Anterior Drawer Test'],
    ruleOut: ['Talar Tilt Test']
  },
};

function buildInterimResults() {
  // Score using only subjective + objective (no special tests yet)
  const area = state.area || 'lumbar';
  const syms = getTextWithKeywords('symptomChips', 'symptomText');
  const agg  = getTextWithKeywords('aggChips',     'aggText');
  const alle = getTextWithKeywords('alleChips',    'alleText');
  const objective = collectObjectiveInputs();
  const age  = state.age;
  const sex  = state.sex;

  const ddxList = DDX_LOGIC[area] || [];
  const duration = state.duration;
  const scored = ddxList
    .map(d => {
      const raw = d.match(syms, agg, alle, objective, {}, age, sex);
      return { ...d, score: applyDurationScore(raw, d.name, duration) };
    })
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score);

  const interimEl = document.getElementById('interimDdx');
  interimEl.innerHTML = '';

  if (scored.length === 0) {
    interimEl.innerHTML = '<p style="color:var(--muted);font-size:0.84rem;padding:8px 0;">Not enough data to narrow diagnoses yet — complete the fields above and try again.</p>';
    return;
  }

  const top = scored.slice(0, 3);
  const maxScore = top[0].score;

  interimEl.innerHTML = '<div class="section-label" style="margin:0 0 16px">Probable Diagnoses — Subjective & Objective</div>';

  top.forEach((d, i) => {
    const ratio = d.score / maxScore;
    const barW = Math.round(ratio * 100);
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : 'rank-other';
    const rankLabel = i === 0 ? 'Most likely' : i === 1 ? 'Also consider' : 'Less likely';
    const div = document.createElement('div');
    div.className = `ddx-card ${rankClass}`;
    div.style.marginBottom = '6px';
    div.innerHTML = `
      <div class="ddx-card-top">
        <h3>${d.name.replace('⚠️ ','')}</h3>
        <span class="likelihood ${i === 0 ? 'lk-high' : i === 1 ? 'lk-med' : 'lk-low'}">${rankLabel}</span>
      </div>
      ${d.ageNote ? `<div class="age-note">Typical: ${d.ageNote}</div>` : ''}
      <div class="score-bar-wrap"><div class="score-bar-bg"><div class="score-bar-fill" style="--bar-target:${barW}%"></div></div></div>`;
    interimEl.appendChild(div);
  });

  // Animate score bars after paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('#interimDdx .score-bar-fill').forEach(el => el.classList.add('animate'));
  }));

  // Build focused test list from top diagnoses
  buildFocusedTests(top, area);
}

function buildFocusedTests(topDiagnoses, area) {
  const allTests = SPECIAL_TESTS[area] || [];
  const testMap = {};
  allTests.forEach(t => { testMap[t.name] = t; });

  const container = document.getElementById('focusedTestsList');
  container.innerHTML = '';
  const titleEl = document.getElementById('focusedTestsTitle');
  const subEl   = document.getElementById('focusedTestsSub');

  // Build per-test metadata: which dx uses it and as ruleIn or ruleOut
  // Structure: { testName → { ruleIn: [dxNames], ruleOut: [dxNames] } }
  const testMeta = {};

  topDiagnoses.forEach(d => {
    const dxName = d.name.replace('⚠️ ', '');
    const entry  = DDX_TESTS[dxName] || DDX_TESTS['⚠️ ' + dxName] || null;
    if (!entry) return;
    (entry.ruleIn  || []).forEach(tName => {
      if (!testMeta[tName]) testMeta[tName] = { ruleIn: [], ruleOut: [] };
      if (!testMeta[tName].ruleIn.includes(dxName)) testMeta[tName].ruleIn.push(dxName);
    });
    (entry.ruleOut || []).forEach(tName => {
      if (!testMeta[tName]) testMeta[tName] = { ruleIn: [], ruleOut: [] };
      if (!testMeta[tName].ruleOut.includes(dxName)) testMeta[tName].ruleOut.push(dxName);
    });
  });

  // Only keep tests that exist in this region's SPECIAL_TESTS pool
  const validTests = Object.keys(testMeta).filter(t => testMap[t]);

  if (validTests.length === 0) {
    titleEl.textContent = 'Recommended Tests';
    subEl.textContent = 'No specific differentiating tests identified — review clinical history and imaging.';
    return;
  }

  const topNames = topDiagnoses.map(d => d.name.replace('⚠️ ', '')).join(' · ');
  subEl.textContent = `Targeted to differentiate: ${topNames}`;
  titleEl.textContent = `${validTests.length} Recommended Test${validTests.length !== 1 ? 's' : ''}`;

  // Sort: tests serving both ruleIn AND ruleOut first, then ruleIn-only, then ruleOut-only
  // Within each tier, sort by total diagnoses covered
  validTests.sort((a, b) => {
    const aTotal = testMeta[a].ruleIn.length + testMeta[a].ruleOut.length;
    const bTotal = testMeta[b].ruleIn.length + testMeta[b].ruleOut.length;
    const aBoth = testMeta[a].ruleIn.length > 0 && testMeta[a].ruleOut.length > 0 ? 1 : 0;
    const bBoth = testMeta[b].ruleIn.length > 0 && testMeta[b].ruleOut.length > 0 ? 1 : 0;
    return (bBoth - aBoth) || (bTotal - aTotal);
  });

  // Render each test
  validTests.forEach(tName => {
    const t    = testMap[tName];
    const meta = testMeta[tName];
    const div  = document.createElement('div');
    div.className = 'test-item';

    const ruleInBadges  = meta.ruleIn.map(dx =>
      `<span class="test-dx-badge badge-rule-in">▲ Supports: ${dx}</span>`).join('');
    const ruleOutBadges = meta.ruleOut.map(dx =>
      `<span class="test-dx-badge badge-rule-out">▽ Lowers suspicion: ${dx}</span>`).join('');

    div.innerHTML = `
      <div class="test-info">
        <div class="test-name">${t.name}</div>
        <div class="test-purpose">${t.purpose}</div>
        <div class="test-dx-badges">${ruleInBadges}${ruleOutBadges}</div>
      </div>
      <div class="toggle-group">
        <button class="toggle-btn pos" data-test="${t.name}" data-val="+">+</button>
        <button class="toggle-btn neg" data-test="${t.name}" data-val="-">–</button>
      </div>`;
    container.appendChild(div);
  });

  // Wire toggles
  container.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function buildSpecialTests() {
  // Legacy — now delegates to buildInterimResults
  buildInterimResults();
}

function collectSpecialTests() {
  const results = {};
  document.querySelectorAll('.toggle-btn.active').forEach(btn => {
    const val = btn.dataset.val === '–' ? '-' : btn.dataset.val;
    results[btn.dataset.test] = val;
  });
  return results;
}

function collectObjectiveInputs() {
  const out = {};
  document.querySelectorAll('#objectiveFields [data-key]').forEach(input => {
    const key = input.dataset.key;
    const val = (input.value || '').trim();
    if (key && val) out[key] = val;
  });

  const slrRightEl = document.getElementById('slrRight');
  const slrLeftEl  = document.getElementById('slrLeft');
  if (slrRightEl && String(slrRightEl.value || '').trim() !== '') out.slrRight = String(slrRightEl.value).trim();
  if (slrLeftEl  && String(slrLeftEl.value  || '').trim() !== '') out.slrLeft  = String(slrLeftEl.value).trim();

  state.objective = out;
  return out;
}

function restoreObjectiveInputs(obj) {
  if (!obj || typeof obj !== 'object') return;

  document.querySelectorAll('#objectiveFields [data-key]').forEach(input => {
    const key = input.dataset.key;
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      input.value = obj[key];
    }
  });

  ['slrRight', 'slrLeft'].forEach(id => {
    if (Object.prototype.hasOwnProperty.call(obj, id)) {
      const el = document.getElementById(id);
      if (el) el.value = obj[id];
    }
  });

  // Backward compatibility for older saved sessions that used element ids as keys.
  Object.entries(obj).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && !el.dataset.key && (id !== 'slrRight' && id !== 'slrLeft')) el.value = val;
  });

  renderSLRFeedback();
}

// Build patient→clinical translation maps from the parallel arrays
function buildChipMap(clinicalObj, patientObj) {
  const map = {};
  for (const area in clinicalObj) {
    const clinical = clinicalObj[area];
    const patient = patientObj[area] || [];
    patient.forEach((label, i) => {
      if (clinical[i]) map[label] = clinical[i];
    });
  }
  return map;
}
const _SYMP_MAP = buildChipMap(SYMPTOM_CHIPS, SYMPTOM_CHIPS_PATIENT);
const _AGG_MAP  = buildChipMap(AGG_CHIPS, AGG_CHIPS_PATIENT);
const _ALLE_MAP = buildChipMap(ALLE_CHIPS, ALLE_CHIPS_PATIENT);

function translateSet(selectedSet, map) {
  const out = new Set();
  selectedSet.forEach(label => out.add(map[label] || label));
  return out;
}

function getFlaggedRedFlagLabels() {
  if (!state._rfFlagged || state._rfFlagged.size === 0) return [];
  return [...state._rfFlagged]
    .map((idx) => RED_FLAGS[idx] && RED_FLAGS[idx].label ? RED_FLAGS[idx].label : '')
    .filter(Boolean);
}

function renderPatientRedFlagHardStop(flagLabels) {
  const ddxEl = document.getElementById('ddxResults');
  const recEl = document.getElementById('recSection');
  const eduEl = document.getElementById('eduSection');
  const exEl = document.getElementById('exSection');
  const footerEl = document.getElementById('patientFooter');
  const disclaimerEl = document.getElementById('resultsDisclaimer');

  const listItems = flagLabels
    .map((label) => `<li style="margin:0 0 6px 18px;">${escapeHtml(label)}</li>`)
    .join('');

  if (disclaimerEl) {
    disclaimerEl.innerHTML = '<strong>Urgent care notice —</strong> Your safety responses include one or more red-flag signs. This pathway should not be used as next-step guidance until you are assessed in person.';
  }

  if (ddxEl) {
    ddxEl.innerHTML = `
      <div class="card" style="padding-top:20px;">
        <div class="card-header" style="margin-bottom:16px;">
          <h2 style="color:var(--negative);">Urgent Medical Review Recommended</h2>
          <p class="subtitle">Based on your responses, this tool cannot safely provide condition matching right now.</p>
        </div>
        <div style="background:var(--surface);border:1px solid rgba(192,112,112,0.4);border-left:2px solid var(--negative);padding:14px 16px;margin-bottom:16px;">
          <div style="font-family:'DM Sans',sans-serif;font-size:0.64rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--negative);margin-bottom:8px;">Flagged Safety Items</div>
          <ul style="margin:0;padding:0;color:var(--muted2);font-size:0.8rem;line-height:1.5;list-style:none;">${listItems}</ul>
        </div>
      </div>`;
  }

  if (recEl) {
    recEl.innerHTML = `
      <div class="rec-box">
        <div class="rec-box-label">Safety First</div>
        <h3>Pause this symptom pathway</h3>
        <p>Please contact your doctor, urgent care, or emergency services based on symptom severity. If symptoms are rapidly worsening or include bladder/bowel changes, severe weakness, chest pain, shortness of breath, or fever with unwellness, seek emergency care immediately.</p>
        <p class="rec-disclaimer">This tool does not replace in-person medical assessment.</p>
      </div>`;
  }

  if (eduEl) {
    eduEl.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2>What to do now</h2>
          <p class="subtitle">Immediate next steps</p>
        </div>
        <div class="edu-item"><strong>1) Stop this self-guided pathway</strong>Do not rely on online symptom matching until you have been assessed by a clinician.</div>
        <div class="edu-item"><strong>2) Arrange urgent in-person care</strong>Use same-day primary care, urgent care, or emergency services depending on severity.</div>
        <div class="edu-item"><strong>3) Bring this summary with you</strong>Show the flagged items above to your clinician to speed up triage.</div>
      </div>`;
  }

  if (exEl) exEl.innerHTML = '';

  if (footerEl) {
    footerEl.innerHTML = '<div class="patient-footer"><strong>Urgent care recommended.</strong><p style="margin-top:6px;">If symptoms are severe, rapidly worsening, or involve neurological/bowel/bladder changes, call emergency services now.</p></div>';
  }
}

function buildResults() {
  evaluateSLR();
  const area = state.area || 'lumbar';
  const isPatient = state.mode === 'patient';
  // Hide "Get Updates" button at results if user already submitted email via pageCollect
  const emailBtn = document.getElementById('emailResultsBtn');
  if (emailBtn) emailBtn.style.display = (isPatient && state.userEmail) ? 'none' : '';
  const rawSyms = getTextWithKeywords('symptomChips', 'symptomText');
  const rawAgg  = getTextWithKeywords('aggChips',     'aggText');
  const rawAlle = getTextWithKeywords('alleChips',    'alleText');
  const syms = isPatient ? translateSet(rawSyms, _SYMP_MAP) : rawSyms;
  const agg  = isPatient ? translateSet(rawAgg,  _AGG_MAP)  : rawAgg;
  const alle = isPatient ? translateSet(rawAlle, _ALLE_MAP) : rawAlle;
  const objective = isPatient ? {} : collectObjectiveInputs();
  const tests = isPatient ? {} : collectSpecialTests();
  const age = state.age;
  const sex = state.sex;
  const ddxEl = document.getElementById('ddxResults');
  if (!ddxEl) return;

  // Clinical safety hard-stop for patient mode: any flagged red-flag response
  // suppresses diagnosis ranking and provides urgent care messaging.
  if (isPatient) {
    const flaggedLabels = getFlaggedRedFlagLabels();
    if (flaggedLabels.length > 0) {
      renderPatientRedFlagHardStop(flaggedLabels);
      _track('patient_redflag_hardstop');
      return;
    }
  }

  const ddxList = DDX_LOGIC[area] || [];
  const duration = state.duration;
  const scored = ddxList
    .map(d => {
      const raw = d.match(syms, agg, alle, objective, tests, age, sex);
      return { ...d, score: applyDurationScore(raw, d.name, duration) };
    }).filter(d => d.score > 0).sort((a,b) => b.score - a.score);

  ddxEl.innerHTML = '';

  // Track report generation — no symptom/result data sent
  _track('report_generated');

  // Show duration tag in results header if duration was selected
  const durationTagEl = document.getElementById('resultsDurationTag');
  if (durationTagEl) {
    const durLabels = { acute: 'Acute onset (< 6 weeks)', subacute: 'Subacute onset (6 wks – 3 months)', chronic: 'Chronic onset (> 3 months)', unknown: '' };
    if (state.duration && state.duration !== 'unknown' && durLabels[state.duration]) {
      durationTagEl.textContent = durLabels[state.duration];
      durationTagEl.style.display = 'inline-block';
    } else {
      durationTagEl.style.display = 'none';
    }
  }

  // SLR summary (clinician only, lumbar/pelvis region only)
  const _slrRelevantAreas = ['lumbar','pelvis'];
  if (!isPatient && _slrRelevantAreas.includes(area) && (state.slrRight !== null || state.slrLeft !== null)) {
    const norm = getSLRNorm(age || 35, sex || 'other');
    const worstSide = (state.slrRight !== null && state.slrLeft !== null)
      ? (state.slrRight < state.slrLeft ? `Right (${state.slrRight}°)` : `Left (${state.slrLeft}°)`)
      : (state.slrRight !== null ? `Right (${state.slrRight}°)` : `Left (${state.slrLeft}°)`);
    const flagColor = state.slrFlag === 'severe' ? 'var(--negative)' : state.slrFlag === 'mild' ? 'var(--warn)' : 'var(--positive)';
    const flagText = state.slrFlag === 'severe' ? 'Significantly restricted — may contribute to posterior chain loading deficits'
      : state.slrFlag === 'mild' ? 'Mildly restricted — consider hamstring flexibility in treatment planning'
      : 'Within normal limits for age / sex';
    ddxEl.innerHTML += `
      <div style="background:var(--surface);border:1px solid var(--border);border-left:2px solid ${flagColor};border-radius:0 4px 4px 0;padding:14px 20px;margin-bottom:12px;">
        <div style="font-family:'DM Sans',sans-serif;font-size:0.6rem;font-weight:500;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);margin-bottom:8px;">Hamstring Flexibility — SLR</div>
        <div style="font-family:'Cormorant Garamond',serif;font-weight:400;font-size:1.05rem;color:var(--text);margin-bottom:4px;">Most Limited: ${worstSide}</div>
        <div style="font-family:'DM Sans',sans-serif;font-size:0.72rem;color:var(--muted2);">Expected min for age ${age || '?'} ${sex ? '(' + sex + ')' : ''}: ${norm.min}° &nbsp;·&nbsp; ${flagText}</div>
      </div>`;
  }

  ddxEl.innerHTML += `<div class="section-label" style="margin:20px 0 12px">${isPatient ? 'Possible Conditions' : 'Differential Diagnoses'}</div>`;

  if (scored.length === 0) {
    ddxEl.innerHTML += `
      <div style="padding:40px 0;text-align:center;border-top:1px solid var(--border-light);">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:300;font-style:italic;color:var(--muted);margin-bottom:12px;">Not enough data</div>
        <p style="font-size:0.8rem;color:var(--muted);font-weight:300;max-width:320px;margin:0 auto 20px;line-height:1.7;">Select at least 3–4 symptoms or aggravating factors to generate a differential. The more you enter, the more accurate the ranking.</p>
        <button class="btn btn-secondary" onclick="goTo(3)" style="font-size:0.68rem;">← Add more symptoms</button>
      </div>`;
    return;
  }

  const maxScore = scored[0].score;
  const displayCount = isPatient ? 3 : 4;
  scored.slice(0, displayCount).forEach((d, i) => {
    const ratio = d.score / maxScore;
    const barWidth = Math.round(ratio * 100);
    let lkClass = 'lk-low';
    let lkText = isPatient ? 'Less likely' : 'Lower likelihood';
    let rankClass = 'rank-other';
    if (i === 0 && ratio > 0.7) {
      lkClass = 'lk-high';
      lkText = isPatient ? 'Most likely match' : 'Highest likelihood';
      rankClass = 'rank-1';
    } else if (i <= 1 && ratio >= 0.5) {
      lkClass = 'lk-med';
      lkText = isPatient ? 'Possible match' : 'Moderate likelihood';
      rankClass = 'rank-2';
    }
    const card = document.createElement('div');
    card.className = `ddx-card ${rankClass}`;
    const displayName = d.name.replace('⚠️ ', '');
    const whyId = `why-${i}`;
    const onsetProfile = ONSET_PROFILE[d.name] || 'variable';
    const onsetLabel   = { acute: 'Acute onset', subacute: 'Subacute onset', chronic: 'Chronic onset', variable: 'Variable onset' }[onsetProfile];
    const onsetColour  = { acute: '#4a8fa8', subacute: '#6a8fa8', chronic: '#7a90a8', variable: '#9aa5af' }[onsetProfile];
    card.innerHTML = `
      <div class="ddx-card-top">
        <h3>${displayName}</h3>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="likelihood ${lkClass}">${lkText}</span>
          <span style="font-family:'DM Sans',sans-serif;font-size:0.55rem;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:${onsetColour};opacity:0.85;">${onsetLabel}</span>
        </div>
      </div>
      ${d.ageNote && !isPatient ? `<div class="age-note">Typical: ${d.ageNote}</div>` : ''}
      <div class="score-bar-wrap">
        <div class="score-bar-bg"><div class="score-bar-fill" style="--bar-target:${barWidth}%"></div></div>
      </div>
      ${!isPatient ? `<div id="${whyId}"></div>` : ''}
    `;
    ddxEl.appendChild(card);
    // Defer why panel render to avoid blocking first paint
    if (!isPatient) {
      const _d = d, _whyId = whyId;
      setTimeout(() => renderWhyPanel(_whyId, _d, syms, agg, alle, tests, age, sex, scored), 0);
    }
  });

  // Animate score bars after DOM paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('#ddxResults .score-bar-fill').forEach(el => el.classList.add('animate'));
  }));

  // Top result deep-dive
  const top = scored[0];
  const topName = top.name.replace('⚠️ ', '');
  const recEl = document.getElementById('recSection');
  const patientEduText = PATIENT_EDU[topName] || top.edu;

  if (isPatient) {
    recEl.innerHTML = `
      <div class="rec-box">
        <div class="rec-box-label">What this might be</div>
        <h3>${topName}</h3>
        <p>${patientEduText}</p>
        <p class="rec-disclaimer">This is a guide to help you have better conversations with your physio or doctor — not a diagnosis. Always see a qualified clinician for a proper assessment.</p>
      </div>`;
  } else {
    recEl.innerHTML = `
      <div class="rec-box">
        <div class="rec-box-label">Clinical Impression</div>
        <h3>${topName}</h3>
        <p>${top.edu}</p>
        <p class="rec-disclaimer">All findings must be interpreted by a licensed clinician. This output does not constitute a medical diagnosis.</p>
      </div>`;
  }

  // Education section
  const eduEl = document.getElementById('eduSection');
  if (isPatient) {
    eduEl.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2>Understanding your symptoms</h2>
          <p class="subtitle">${topName}</p>
        </div>
        <div class="edu-item"><strong>Keep moving — gently</strong>Try to stay as active as you can without pushing through sharp or severe pain. A mild ache during movement is usually okay — think of it as a 3–4 out of 10. Total rest often makes things worse over time, not better.</div>
        <div class="edu-item"><strong>Ice or heat?</strong>For fresh or swollen pain (first couple of days), ice for 10–15 minutes can help calm things down. For longer-standing stiffness or muscle tightness, heat tends to feel better. Always wrap in a cloth — never apply directly to skin.</div>
        <div class="edu-item"><strong>When to get checked out</strong>Book in with a physio or doctor if your pain is severe, getting worse week by week, or affecting your sleep, work, or daily life. If you have numbness, tingling, or weakness in your arms or legs — see someone promptly.</div>
      </div>`;
  } else {
    eduEl.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2>Patient Education</h2>
          <p class="subtitle">${topName}</p>
        </div>
        <div class="edu-item"><strong>Understanding Your Condition</strong>${top.edu}</div>
        <div class="edu-item"><strong>Activity Modification</strong>Identify and temporarily avoid high-pain activities. Use a pain scale — stay below 4/10 with all exercises. Gradual return to activity is the goal, not complete rest.</div>
        <div class="edu-item"><strong>Posture & Body Mechanics</strong>Be mindful of positions that load the injured area. Use proper body mechanics with lifting, sitting, and daily activities. Ergonomic adjustments at work may be warranted.</div>
        <div class="edu-item"><strong>Heat vs. Ice</strong>Ice for acute inflammation (first 48–72 hours). Heat for chronic stiffness and muscle tightness. Always use a cloth barrier between skin and ice or heat source.</div>
      </div>`;
  }

  // ── EXERCISE DIAGRAM LIBRARY ──
  // Clean stick-figure SVGs keyed by movement archetype
  const EX_DIAGRAMS = {
    bridge: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="10" r="5"/>
      <line x1="32" y1="15" x2="32" y2="32"/>
      <line x1="32" y1="20" x2="20" y2="28"/>
      <line x1="32" y1="20" x2="44" y2="28"/>
      <line x1="32" y1="32" x2="20" y2="44"/>
      <line x1="32" y1="32" x2="44" y2="44"/>
      <line x1="20" y1="44" x2="20" y2="56"/>
      <line x1="44" y1="44" x2="44" y2="56"/>
      <path d="M10 56 Q20 40 32 38 Q44 40 54 56" stroke-dasharray="3,2"/>
    </svg>`,
    clamshell: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="18" r="5"/>
      <line x1="14" y1="23" x2="14" y2="38"/>
      <line x1="14" y1="28" x2="6" y2="34"/>
      <line x1="14" y1="28" x2="22" y2="34"/>
      <line x1="14" y1="38" x2="8" y2="50"/>
      <line x1="14" y1="38" x2="22" y2="48"/>
      <line x1="22" y1="48" x2="42" y2="42"/>
      <line x1="8" y1="50" x2="28" y2="50"/>
      <path d="M22 48 Q30 36 42 42" stroke-dasharray="3,2"/>
    </svg>`,
    nordic_curl: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="18" x2="22" y2="24"/>
      <line x1="32" y1="18" x2="42" y2="24"/>
      <line x1="32" y1="28" x2="28" y2="44"/>
      <line x1="32" y1="28" x2="36" y2="44"/>
      <line x1="28" y1="44" x2="20" y2="56"/>
      <line x1="36" y1="44" x2="44" y2="56"/>
      <line x1="10" y1="56" x2="54" y2="56"/>
    </svg>`,
    hamstring_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="36" r="5"/>
      <line x1="14" y1="41" x2="14" y2="54"/>
      <line x1="14" y1="47" x2="8" y2="54"/>
      <line x1="14" y1="47" x2="20" y2="54"/>
      <line x1="14" y1="41" x2="20" y2="30"/>
      <line x1="20" y1="30" x2="50" y2="20"/>
      <line x1="14" y1="41" x2="10" y2="30"/>
      <line x1="8" y1="54" x2="30" y2="54"/>
    </svg>`,
    dead_bug: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="30" r="5"/>
      <line x1="32" y1="35" x2="32" y2="48"/>
      <line x1="32" y1="40" x2="16" y2="34"/>
      <line x1="16" y1="34" x2="10" y2="22"/>
      <line x1="32" y1="40" x2="48" y2="50"/>
      <line x1="48" y1="50" x2="56" y2="44"/>
      <line x1="32" y1="48" x2="20" y2="58"/>
      <line x1="32" y1="48" x2="44" y2="54"/>
      <line x1="8" y1="32" x2="56" y2="32" stroke-dasharray="3,2"/>
    </svg>`,
    bird_dog: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="18" r="5"/>
      <line x1="32" y1="23" x2="32" y2="36"/>
      <line x1="22" y1="36" x2="42" y2="36"/>
      <line x1="22" y1="36" x2="22" y2="50"/>
      <line x1="42" y1="36" x2="42" y2="50"/>
      <line x1="32" y1="28" x2="16" y2="22"/>
      <line x1="32" y1="32" x2="48" y2="44"/>
    </svg>`,
    plank: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="26" r="5"/>
      <line x1="14" y1="31" x2="46" y2="38"/>
      <line x1="18" y1="28" x2="12" y2="36"/>
      <line x1="12" y1="36" x2="10" y2="50"/>
      <line x1="46" y1="38" x2="50" y2="52"/>
      <line x1="46" y1="38" x2="54" y2="52"/>
      <line x1="8" y1="50" x2="56" y2="50" stroke-dasharray="2,2"/>
    </svg>`,
    side_plank: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="20" r="5"/>
      <line x1="16" y1="25" x2="42" y2="38"/>
      <line x1="24" y1="28" x2="30" y2="18"/>
      <line x1="42" y1="38" x2="50" y2="52"/>
      <line x1="42" y1="38" x2="52" y2="45"/>
      <line x1="10" y1="52" x2="56" y2="52" stroke-dasharray="2,2"/>
    </svg>`,
    knees_to_chest: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="20" cy="28" r="5"/>
      <line x1="20" y1="33" x2="20" y2="46"/>
      <line x1="20" y1="38" x2="12" y2="44"/>
      <line x1="20" y1="38" x2="28" y2="44"/>
      <line x1="20" y1="46" x2="30" y2="40"/>
      <line x1="30" y1="40" x2="34" y2="30"/>
      <line x1="20" y1="46" x2="32" y2="48"/>
      <line x1="32" y1="48" x2="38" y2="38"/>
      <line x1="8" y1="56" x2="56" y2="56" stroke-dasharray="2,2"/>
    </svg>`,
    prone_press_up: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="18" r="5"/>
      <line x1="14" y1="23" x2="22" y2="36"/>
      <line x1="10" y1="26" x2="4" y2="34"/>
      <line x1="18" y1="26" x2="32" y2="22"/>
      <line x1="22" y1="36" x2="40" y2="42"/>
      <line x1="40" y1="42" x2="46" y2="56"/>
      <line x1="40" y1="42" x2="50" y2="54"/>
      <line x1="8" y1="56" x2="56" y2="56" stroke-dasharray="2,2"/>
    </svg>`,
    prone_extension: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="24" r="5"/>
      <line x1="14" y1="29" x2="44" y2="38"/>
      <line x1="14" y1="32" x2="6" y2="28"/>
      <line x1="24" y1="32" x2="30" y2="22"/>
      <line x1="44" y1="38" x2="48" y2="52"/>
      <line x1="44" y1="38" x2="56" y2="48"/>
      <line x1="8" y1="52" x2="58" y2="52" stroke-dasharray="2,2"/>
    </svg>`,
    cat_cow: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="24" r="5"/>
      <line x1="12" y1="29" x2="12" y2="40"/>
      <line x1="12" y1="40" x2="8" y2="52"/>
      <line x1="12" y1="40" x2="16" y2="52"/>
      <path d="M12 34 Q28 42 44 34 Q52 30 52 38"/>
      <line x1="52" y1="38" x2="48" y2="50"/>
      <line x1="52" y1="38" x2="56" y2="50"/>
    </svg>`,
    seated_lean: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="14" r="5"/>
      <line x1="24" y1="19" x2="24" y2="36"/>
      <line x1="24" y1="24" x2="12" y2="30"/>
      <line x1="24" y1="24" x2="36" y2="30"/>
      <line x1="24" y1="36" x2="16" y2="46"/>
      <line x1="24" y1="36" x2="32" y2="46"/>
      <line x1="10" y1="46" x2="54" y2="46"/>
      <line x1="10" y1="36" x2="10" y2="46"/>
    </svg>`,
    squat: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="18" x2="20" y2="24"/>
      <line x1="32" y1="18" x2="44" y2="24"/>
      <line x1="32" y1="28" x2="22" y2="44"/>
      <line x1="32" y1="28" x2="42" y2="44"/>
      <line x1="22" y1="44" x2="18" y2="56"/>
      <line x1="42" y1="44" x2="46" y2="56"/>
    </svg>`,
    walking: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="30"/>
      <line x1="32" y1="18" x2="20" y2="26"/>
      <line x1="32" y1="18" x2="44" y2="24"/>
      <line x1="32" y1="30" x2="24" y2="46"/>
      <line x1="32" y1="30" x2="40" y2="44"/>
      <line x1="24" y1="46" x2="20" y2="58"/>
      <line x1="40" y1="44" x2="46" y2="56"/>
    </svg>`,
    cycling: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="10" r="5"/>
      <circle cx="16" cy="46" r="10"/>
      <circle cx="48" cy="46" r="10"/>
      <line x1="32" y1="15" x2="32" y2="30"/>
      <line x1="32" y1="20" x2="20" y2="26"/>
      <line x1="32" y1="20" x2="44" y2="24"/>
      <line x1="32" y1="30" x2="22" y2="40"/>
      <line x1="32" y1="30" x2="42" y2="38"/>
      <line x1="22" y1="40" x2="16" y2="46"/>
      <line x1="42" y1="38" x2="48" y2="46"/>
      <line x1="16" y1="46" x2="48" y2="46"/>
    </svg>`,
    quad_set: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="28" r="5"/>
      <line x1="14" y1="33" x2="14" y2="46"/>
      <line x1="14" y1="38" x2="8" y2="44"/>
      <line x1="14" y1="38" x2="20" y2="44"/>
      <line x1="14" y1="46" x2="44" y2="44"/>
      <line x1="44" y1="44" x2="54" y2="44"/>
      <line x1="8" y1="54" x2="56" y2="54" stroke-dasharray="2,2"/>
      <line x1="44" y1="44" x2="44" y2="54"/>
    </svg>`,
    slr: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="30" r="5"/>
      <line x1="14" y1="35" x2="14" y2="48"/>
      <line x1="14" y1="40" x2="8" y2="46"/>
      <line x1="14" y1="40" x2="20" y2="46"/>
      <line x1="14" y1="48" x2="44" y2="38"/>
      <line x1="44" y1="38" x2="54" y2="34"/>
      <line x1="14" y1="48" x2="44" y2="52"/>
      <line x1="8" y1="56" x2="56" y2="56" stroke-dasharray="2,2"/>
    </svg>`,
    heel_slide: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="28" r="5"/>
      <line x1="14" y1="33" x2="14" y2="46"/>
      <line x1="14" y1="38" x2="8" y2="44"/>
      <line x1="14" y1="38" x2="20" y2="44"/>
      <line x1="14" y1="46" x2="22" y2="52"/>
      <line x1="22" y1="52" x2="36" y2="56"/>
      <line x1="14" y1="46" x2="32" y2="48"/>
      <line x1="8" y1="56" x2="56" y2="56" stroke-dasharray="2,2"/>
      <path d="M32 48 Q42 44 50 50" stroke-dasharray="3,2"/>
    </svg>`,
    tke: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="28" cy="8" r="5"/>
      <line x1="28" y1="13" x2="28" y2="28"/>
      <line x1="28" y1="18" x2="18" y2="24"/>
      <line x1="28" y1="18" x2="38" y2="24"/>
      <line x1="28" y1="28" x2="22" y2="44"/>
      <line x1="22" y1="44" x2="18" y2="56"/>
      <line x1="28" y1="28" x2="34" y2="42"/>
      <line x1="34" y1="42" x2="50" y2="46"/>
      <line x1="10" y1="56" x2="56" y2="56" stroke-dasharray="2,2"/>
      <path d="M40 26 L50 26" stroke-dasharray="3,2"/>
    </svg>`,
    leg_press: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="24" r="5"/>
      <line x1="12" y1="29" x2="12" y2="44"/>
      <line x1="12" y1="34" x2="6" y2="40"/>
      <line x1="12" y1="34" x2="18" y2="38"/>
      <line x1="12" y1="44" x2="26" y2="36"/>
      <line x1="26" y1="36" x2="38" y2="42"/>
      <line x1="12" y1="44" x2="28" y2="48"/>
      <line x1="28" y1="48" x2="40" y2="46"/>
      <line x1="46" y1="28" x2="46" y2="56"/>
      <line x1="38" y1="28" x2="54" y2="28"/>
    </svg>`,
    wall_sit: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="54" y1="4" x2="54" y2="60"/>
      <circle cx="36" cy="16" r="5"/>
      <line x1="36" y1="21" x2="36" y2="36"/>
      <line x1="36" y1="26" x2="24" y2="32"/>
      <line x1="36" y1="26" x2="48" y2="30"/>
      <line x1="36" y1="36" x2="26" y2="48"/>
      <line x1="26" y1="48" x2="26" y2="56"/>
      <line x1="36" y1="36" x2="46" y2="36"/>
      <line x1="46" y1="36" x2="54" y2="36"/>
    </svg>`,
    step_down: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="28" cy="8" r="5"/>
      <line x1="28" y1="13" x2="28" y2="28"/>
      <line x1="28" y1="18" x2="16" y2="24"/>
      <line x1="28" y1="18" x2="40" y2="24"/>
      <line x1="28" y1="28" x2="20" y2="44"/>
      <line x1="20" y1="44" x2="14" y2="56"/>
      <line x1="28" y1="28" x2="34" y2="42"/>
      <line x1="34" y1="42" x2="38" y2="56"/>
      <line x1="8" y1="56" x2="52" y2="56"/>
      <line x1="8" y1="46" x2="32" y2="46"/>
    </svg>`,
    heel_drop: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="18" x2="20" y2="24"/>
      <line x1="32" y1="18" x2="44" y2="24"/>
      <line x1="32" y1="28" x2="26" y2="44"/>
      <line x1="26" y1="44" x2="26" y2="58"/>
      <line x1="32" y1="28" x2="38" y2="44"/>
      <line x1="38" y1="44" x2="38" y2="58"/>
      <line x1="10" y1="50" x2="54" y2="50"/>
      <line x1="10" y1="58" x2="54" y2="58"/>
    </svg>`,
    heel_raise: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="18" x2="20" y2="24"/>
      <line x1="32" y1="18" x2="44" y2="24"/>
      <line x1="32" y1="28" x2="26" y2="44"/>
      <line x1="26" y1="44" x2="22" y2="54"/>
      <line x1="22" y1="54" x2="30" y2="56"/>
      <line x1="32" y1="28" x2="38" y2="44"/>
      <line x1="38" y1="44" x2="42" y2="54"/>
      <line x1="42" y1="54" x2="34" y2="56"/>
      <line x1="10" y1="56" x2="54" y2="56"/>
    </svg>`,
    calf_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="4" x2="8" y2="58"/>
      <circle cx="22" cy="14" r="5"/>
      <line x1="22" y1="19" x2="22" y2="34"/>
      <line x1="22" y1="24" x2="10" y2="26"/>
      <line x1="22" y1="24" x2="34" y2="24"/>
      <line x1="22" y1="34" x2="16" y2="50"/>
      <line x1="16" y1="50" x2="10" y2="56"/>
      <line x1="22" y1="34" x2="34" y2="44"/>
      <line x1="34" y1="44" x2="38" y2="56"/>
      <line x1="8" y1="56" x2="54" y2="56"/>
    </svg>`,
    plantar_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="28" r="5"/>
      <line x1="14" y1="33" x2="14" y2="46"/>
      <line x1="14" y1="38" x2="8" y2="44"/>
      <line x1="14" y1="38" x2="20" y2="44"/>
      <line x1="14" y1="46" x2="18" y2="56"/>
      <line x1="18" y1="56" x2="36" y2="52"/>
      <path d="M18 56 Q28 48 36 52" stroke-dasharray="3,2"/>
      <line x1="14" y1="46" x2="26" y2="52"/>
    </svg>`,
    foot_doming: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="52" x2="56" y2="52"/>
      <path d="M12 52 Q26 38 40 52"/>
      <line x1="24" y1="52" x2="22" y2="44"/>
      <line x1="32" y1="48" x2="30" y2="40"/>
      <line x1="40" y1="52" x2="38" y2="44"/>
      <line x1="14" y1="52" x2="12" y2="44"/>
    </svg>`,
    ankle_circles: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="20" cy="28" r="5"/>
      <line x1="20" y1="33" x2="20" y2="46"/>
      <line x1="20" y1="38" x2="14" y2="44"/>
      <line x1="20" y1="38" x2="26" y2="44"/>
      <line x1="20" y1="46" x2="20" y2="54"/>
      <circle cx="20" cy="58" r="4"/>
      <path d="M32 52 Q44 46 44 58 Q44 66 32 64" stroke-dasharray="3,2"/>
    </svg>`,
    single_leg_balance: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="6" r="5"/>
      <line x1="32" y1="11" x2="32" y2="28"/>
      <line x1="32" y1="16" x2="20" y2="24"/>
      <line x1="32" y1="16" x2="44" y2="22"/>
      <line x1="32" y1="28" x2="28" y2="44"/>
      <line x1="28" y1="44" x2="26" y2="58"/>
      <line x1="32" y1="28" x2="36" y2="40"/>
      <line x1="36" y1="40" x2="48" y2="36"/>
      <line x1="18" y1="58" x2="40" y2="58"/>
    </svg>`,
    adductor_squeeze: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="12" r="5"/>
      <line x1="32" y1="17" x2="32" y2="30"/>
      <line x1="32" y1="22" x2="20" y2="28"/>
      <line x1="32" y1="22" x2="44" y2="28"/>
      <line x1="32" y1="30" x2="22" y2="44"/>
      <line x1="22" y1="44" x2="22" y2="56"/>
      <line x1="32" y1="30" x2="42" y2="44"/>
      <line x1="42" y1="44" x2="42" y2="56"/>
      <ellipse cx="32" cy="52" rx="10" ry="4"/>
    </svg>`,
    adductor_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="12" r="5"/>
      <line x1="32" y1="17" x2="32" y2="30"/>
      <line x1="32" y1="22" x2="20" y2="28"/>
      <line x1="32" y1="22" x2="44" y2="28"/>
      <line x1="32" y1="30" x2="14" y2="46"/>
      <line x1="14" y1="46" x2="12" y2="56"/>
      <line x1="32" y1="30" x2="50" y2="46"/>
      <line x1="50" y1="46" x2="52" y2="56"/>
      <line x1="10" y1="56" x2="54" y2="56"/>
    </svg>`,
    copenhagen: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="36" x2="56" y2="36"/>
      <circle cx="18" cy="20" r="5"/>
      <line x1="18" y1="25" x2="18" y2="38"/>
      <line x1="18" y1="30" x2="8" y2="34"/>
      <line x1="18" y1="30" x2="28" y2="32"/>
      <line x1="18" y1="38" x2="14" y2="52"/>
      <line x1="18" y1="38" x2="28" y2="36"/>
      <line x1="28" y1="36" x2="44" y2="42"/>
    </svg>`,
    hip_flexor_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="30" cy="8" r="5"/>
      <line x1="30" y1="13" x2="30" y2="28"/>
      <line x1="30" y1="18" x2="20" y2="24"/>
      <line x1="30" y1="18" x2="40" y2="24"/>
      <line x1="30" y1="28" x2="20" y2="40"/>
      <line x1="20" y1="40" x2="16" y2="56"/>
      <line x1="30" y1="28" x2="40" y2="38"/>
      <line x1="40" y1="38" x2="52" y2="36"/>
      <line x1="52" y1="36" x2="54" y2="50"/>
      <line x1="8" y1="56" x2="56" y2="56"/>
    </svg>`,
    itb_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="4" x2="8" y2="58"/>
      <circle cx="24" cy="12" r="5"/>
      <line x1="24" y1="17" x2="24" y2="32"/>
      <line x1="24" y1="22" x2="10" y2="24"/>
      <line x1="24" y1="22" x2="36" y2="24"/>
      <line x1="24" y1="32" x2="18" y2="48"/>
      <line x1="18" y1="48" x2="14" y2="56"/>
      <line x1="24" y1="32" x2="34" y2="44"/>
      <line x1="34" y1="44" x2="36" y2="56"/>
      <line x1="36" y1="32" x2="8" y2="32"/>
    </svg>`,
    hip_circles: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="18" x2="20" y2="24"/>
      <line x1="32" y1="18" x2="44" y2="24"/>
      <line x1="32" y1="28" x2="26" y2="44"/>
      <line x1="26" y1="44" x2="24" y2="58"/>
      <line x1="32" y1="28" x2="38" y2="44"/>
      <line x1="38" y1="44" x2="40" y2="58"/>
      <path d="M38 28 Q48 22 44 30 Q40 38 38 28" stroke-dasharray="3,2"/>
    </svg>`,
    piriformis_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="24" r="5"/>
      <line x1="14" y1="29" x2="14" y2="42"/>
      <line x1="14" y1="34" x2="8" y2="40"/>
      <line x1="14" y1="34" x2="20" y2="38"/>
      <line x1="14" y1="42" x2="14" y2="54"/>
      <line x1="14" y1="42" x2="28" y2="40"/>
      <line x1="28" y1="40" x2="36" y2="50"/>
      <line x1="8" y1="54" x2="40" y2="54" stroke-dasharray="2,2"/>
    </svg>`,
    pendulum: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="26"/>
      <line x1="32" y1="18" x2="20" y2="14"/>
      <line x1="32" y1="20" x2="44" y2="22"/>
      <line x1="32" y1="26" x2="28" y2="40"/>
      <line x1="28" y1="40" x2="26" y2="54"/>
      <line x1="32" y1="26" x2="36" y2="40"/>
      <line x1="36" y1="40" x2="38" y2="54"/>
      <line x1="20" y1="14" x2="24" y2="40"/>
      <path d="M18 52 Q24 44 30 52 Q36 60 42 52" stroke-dasharray="3,2"/>
    </svg>`,
    wand_exercise: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="18" x2="18" y2="14"/>
      <line x1="18" y1="14" x2="8" y2="22"/>
      <line x1="32" y1="18" x2="46" y2="26"/>
      <line x1="32" y1="28" x2="24" y2="44"/>
      <line x1="32" y1="28" x2="40" y2="44"/>
      <line x1="24" y1="44" x2="20" y2="56"/>
      <line x1="40" y1="44" x2="44" y2="56"/>
      <line x1="8" y1="22" x2="46" y2="26"/>
    </svg>`,
    sidelying_er: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="20" r="5"/>
      <line x1="14" y1="25" x2="14" y2="38"/>
      <line x1="14" y1="30" x2="6" y2="24"/>
      <line x1="14" y1="30" x2="22" y2="26"/>
      <line x1="22" y1="26" x2="36" y2="22"/>
      <line x1="14" y1="38" x2="30" y2="44"/>
      <line x1="30" y1="44" x2="46" y2="44"/>
      <line x1="8" y1="52" x2="54" y2="52" stroke-dasharray="2,2"/>
    </svg>`,
    scapular_retraction: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="30"/>
      <line x1="32" y1="18" x2="16" y2="24"/>
      <line x1="16" y1="24" x2="10" y2="18"/>
      <line x1="32" y1="18" x2="48" y2="24"/>
      <line x1="48" y1="24" x2="54" y2="18"/>
      <line x1="32" y1="30" x2="24" y2="46"/>
      <line x1="32" y1="30" x2="40" y2="46"/>
      <line x1="24" y1="46" x2="20" y2="58"/>
      <line x1="40" y1="46" x2="44" y2="58"/>
    </svg>`,
    prone_y: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="26" r="5"/>
      <line x1="32" y1="31" x2="32" y2="44"/>
      <line x1="32" y1="36" x2="24" y2="44"/>
      <line x1="32" y1="36" x2="40" y2="44"/>
      <line x1="32" y1="44" x2="28" y2="56"/>
      <line x1="32" y1="44" x2="36" y2="56"/>
      <line x1="32" y1="28" x2="16" y2="14"/>
      <line x1="32" y1="28" x2="48" y2="14"/>
      <line x1="8" y1="56" x2="56" y2="56" stroke-dasharray="2,2"/>
    </svg>`,
    wall_slides: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="56" y1="4" x2="56" y2="60"/>
      <circle cx="36" cy="14" r="5"/>
      <line x1="36" y1="19" x2="36" y2="34"/>
      <line x1="36" y1="22" x2="48" y2="18"/>
      <line x1="48" y1="18" x2="54" y2="10"/>
      <line x1="36" y1="26" x2="46" y2="28"/>
      <line x1="36" y1="34" x2="30" y2="48"/>
      <line x1="36" y1="34" x2="42" y2="48"/>
      <line x1="30" y1="48" x2="28" y2="58"/>
      <line x1="42" y1="48" x2="44" y2="58"/>
    </svg>`,
    sleeper_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="18" r="5"/>
      <line x1="14" y1="23" x2="14" y2="36"/>
      <line x1="14" y1="28" x2="8" y2="22"/>
      <line x1="14" y1="28" x2="22" y2="24"/>
      <line x1="22" y1="24" x2="32" y2="16"/>
      <line x1="32" y1="16" x2="40" y2="24"/>
      <line x1="14" y1="36" x2="40" y2="44"/>
      <line x1="40" y1="44" x2="54" y2="44"/>
      <line x1="8" y1="52" x2="56" y2="52" stroke-dasharray="2,2"/>
    </svg>`,
    biceps_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="18" x2="18" y2="28"/>
      <line x1="18" y1="28" x2="12" y2="40"/>
      <line x1="32" y1="18" x2="44" y2="24"/>
      <line x1="32" y1="28" x2="26" y2="44"/>
      <line x1="32" y1="28" x2="38" y2="44"/>
      <line x1="26" y1="44" x2="22" y2="56"/>
      <line x1="38" y1="44" x2="42" y2="56"/>
    </svg>`,
    wrist_eccentric: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="32" x2="36" y2="32"/>
      <line x1="36" y1="32" x2="42" y2="24"/>
      <line x1="36" y1="32" x2="40" y2="40"/>
      <line x1="42" y1="24" x2="56" y2="24"/>
      <circle cx="49" cy="20" r="4"/>
      <path d="M42 40 Q50 44 50 38" stroke-dasharray="3,2"/>
    </svg>`,
    wrist_isometric: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="36" x2="36" y2="36"/>
      <line x1="36" y1="36" x2="42" y2="28"/>
      <line x1="42" y1="28" x2="56" y2="28"/>
      <circle cx="49" cy="24" r="4"/>
      <line x1="49" y1="28" x2="49" y2="44"/>
      <line x1="42" y1="44" x2="56" y2="44"/>
    </svg>`,
    wrist_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="32" x2="38" y2="32"/>
      <line x1="38" y1="32" x2="38" y2="20"/>
      <line x1="30" y1="20" x2="46" y2="20"/>
      <line x1="38" y1="20" x2="38" y2="12"/>
      <path d="M30 20 Q28 14 34 12" stroke-dasharray="3,2"/>
      <line x1="34" y1="12" x2="42" y2="12"/>
    </svg>`,
    wrist_flexion: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="32" x2="36" y2="32"/>
      <line x1="36" y1="32" x2="42" y2="40"/>
      <line x1="42" y1="40" x2="56" y2="40"/>
      <circle cx="49" cy="44" r="4"/>
      <path d="M36 32 Q40 24 44 30" stroke-dasharray="3,2"/>
    </svg>`,
    forearm_rotation: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="14" y1="32" x2="42" y2="32"/>
      <line x1="42" y1="32" x2="46" y2="24"/>
      <line x1="46" y1="24" x2="56" y2="26"/>
      <circle cx="53" cy="22" r="4"/>
      <path d="M42 32 Q50 38 50 28 Q50 20 42 22" stroke-dasharray="3,2"/>
    </svg>`,
    elbow_flexion: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="20" x2="44" y2="26"/>
      <line x1="44" y1="26" x2="52" y2="18"/>
      <line x1="32" y1="20" x2="20" y2="26"/>
      <line x1="32" y1="28" x2="26" y2="44"/>
      <line x1="32" y1="28" x2="38" y2="44"/>
      <line x1="26" y1="44" x2="22" y2="56"/>
      <line x1="38" y1="44" x2="42" y2="56"/>
    </svg>`,
    finger_extension: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="16" y1="44" x2="48" y2="44"/>
      <line x1="22" y1="44" x2="20" y2="28"/>
      <line x1="28" y1="44" x2="28" y2="26"/>
      <line x1="34" y1="44" x2="34" y2="26"/>
      <line x1="40" y1="44" x2="40" y2="28"/>
      <line x1="46" y1="44" x2="46" y2="32"/>
      <line x1="16" y1="44" x2="16" y2="52"/>
    </svg>`,
    nerve_floss_supine: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="24" r="5"/>
      <line x1="14" y1="29" x2="14" y2="42"/>
      <line x1="14" y1="34" x2="8" y2="40"/>
      <line x1="14" y1="34" x2="20" y2="40"/>
      <line x1="14" y1="42" x2="30" y2="36"/>
      <line x1="30" y1="36" x2="48" y2="28"/>
      <line x1="14" y1="42" x2="30" y2="46"/>
      <line x1="30" y1="46" x2="48" y2="46"/>
      <line x1="8" y1="54" x2="54" y2="54" stroke-dasharray="2,2"/>
    </svg>`,
    nerve_floss_prone: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="20" r="5"/>
      <line x1="14" y1="25" x2="14" y2="38"/>
      <line x1="14" y1="30" x2="8" y2="26"/>
      <line x1="14" y1="30" x2="22" y2="28"/>
      <line x1="14" y1="38" x2="30" y2="40"/>
      <line x1="30" y1="40" x2="46" y2="38"/>
      <line x1="46" y1="38" x2="52" y2="26"/>
      <line x1="30" y1="40" x2="32" y2="52"/>
      <line x1="8" y1="50" x2="56" y2="50" stroke-dasharray="2,2"/>
    </svg>`,
    chin_tuck: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="10" r="6"/>
      <line x1="32" y1="16" x2="32" y2="32"/>
      <line x1="32" y1="22" x2="20" y2="28"/>
      <line x1="32" y1="22" x2="44" y2="28"/>
      <line x1="32" y1="32" x2="26" y2="48"/>
      <line x1="32" y1="32" x2="38" y2="48"/>
      <line x1="26" y1="48" x2="24" y2="60"/>
      <line x1="38" y1="48" x2="40" y2="60"/>
      <path d="M26 14 Q28 18 32 16" stroke-dasharray="2,2"/>
    </svg>`,
    cervical_isometric: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="10" r="6"/>
      <line x1="32" y1="16" x2="32" y2="32"/>
      <line x1="32" y1="22" x2="20" y2="28"/>
      <line x1="32" y1="22" x2="44" y2="28"/>
      <line x1="32" y1="32" x2="26" y2="48"/>
      <line x1="32" y1="32" x2="38" y2="48"/>
      <line x1="26" y1="48" x2="24" y2="58"/>
      <line x1="38" y1="48" x2="40" y2="58"/>
      <line x1="44" y1="12" x2="56" y2="12"/>
      <line x1="50" y1="8" x2="50" y2="16"/>
    </svg>`,
    cervical_rotation: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="10" r="6"/>
      <line x1="32" y1="16" x2="32" y2="32"/>
      <line x1="32" y1="22" x2="20" y2="28"/>
      <line x1="32" y1="22" x2="44" y2="28"/>
      <line x1="32" y1="32" x2="26" y2="48"/>
      <line x1="32" y1="32" x2="38" y2="48"/>
      <line x1="26" y1="48" x2="24" y2="58"/>
      <line x1="38" y1="48" x2="40" y2="58"/>
      <path d="M24 8 Q32 4 40 8" stroke-dasharray="3,2"/>
      <line x1="40" y1="8" x2="38" y2="12"/>
    </svg>`,
    neck_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="10" r="6"/>
      <line x1="24" y1="16" x2="24" y2="30"/>
      <line x1="24" y1="22" x2="12" y2="28"/>
      <line x1="24" y1="22" x2="36" y2="28"/>
      <line x1="24" y1="30" x2="18" y2="46"/>
      <line x1="24" y1="30" x2="30" y2="46"/>
      <line x1="18" y1="46" x2="16" y2="58"/>
      <line x1="30" y1="46" x2="32" y2="58"/>
      <line x1="36" y1="28" x2="44" y2="14"/>
    </svg>`,
    pec_stretch: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="8" x2="8" y2="56"/>
      <line x1="56" y1="8" x2="56" y2="56"/>
      <circle cx="32" cy="16" r="5"/>
      <line x1="32" y1="21" x2="32" y2="36"/>
      <line x1="32" y1="26" x2="8" y2="26"/>
      <line x1="32" y1="26" x2="56" y2="26"/>
      <line x1="32" y1="36" x2="26" y2="50"/>
      <line x1="32" y1="36" x2="38" y2="50"/>
      <line x1="26" y1="50" x2="24" y2="58"/>
      <line x1="38" y1="50" x2="40" y2="58"/>
    </svg>`,
    thoracic_extension: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="14" cy="22" r="5"/>
      <path d="M14 27 Q28 34 42 28"/>
      <line x1="14" y1="30" x2="8" y2="36"/>
      <line x1="30" y1="30" x2="36" y2="24"/>
      <line x1="42" y1="28" x2="48" y2="36"/>
      <line x1="42" y1="28" x2="56" y2="34"/>
      <line x1="8" y1="50" x2="56" y2="50" stroke-dasharray="2,2"/>
      <line x1="14" y1="44" x2="14" y2="50"/>
      <line x1="42" y1="44" x2="42" y2="50"/>
    </svg>`,
    seated_rotation: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="28" cy="12" r="5"/>
      <line x1="28" y1="17" x2="28" y2="32"/>
      <line x1="28" y1="22" x2="16" y2="20"/>
      <line x1="28" y1="22" x2="44" y2="26"/>
      <line x1="28" y1="32" x2="20" y2="44"/>
      <line x1="28" y1="32" x2="36" y2="44"/>
      <line x1="14" y1="44" x2="50" y2="44"/>
      <line x1="14" y1="44" x2="14" y2="56"/>
      <line x1="50" y1="44" x2="50" y2="56"/>
    </svg>`,
    thread_needle: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18" cy="18" r="5"/>
      <line x1="18" y1="23" x2="18" y2="34"/>
      <line x1="18" y1="34" x2="8" y2="46"/>
      <line x1="18" y1="34" x2="28" y2="46"/>
      <line x1="8" y1="46" x2="8" y2="56"/>
      <line x1="28" y1="46" x2="28" y2="56"/>
      <line x1="18" y1="26" x2="28" y2="20"/>
      <line x1="28" y1="20" x2="46" y2="32"/>
      <line x1="46" y1="32" x2="54" y2="26"/>
    </svg>`,
    deadlift: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="36" y2="30"/>
      <line x1="32" y1="18" x2="20" y2="22"/>
      <line x1="32" y1="18" x2="46" y2="24"/>
      <line x1="36" y1="30" x2="28" y2="46"/>
      <line x1="36" y1="30" x2="44" y2="46"/>
      <line x1="28" y1="46" x2="24" y2="58"/>
      <line x1="44" y1="46" x2="48" y2="58"/>
      <line x1="8" y1="58" x2="56" y2="58"/>
      <line x1="8" y1="54" x2="56" y2="54"/>
    </svg>`,
    generic: `<svg viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="8" r="5"/>
      <line x1="32" y1="13" x2="32" y2="28"/>
      <line x1="32" y1="18" x2="20" y2="26"/>
      <line x1="32" y1="18" x2="44" y2="26"/>
      <line x1="32" y1="28" x2="24" y2="44"/>
      <line x1="32" y1="28" x2="40" y2="44"/>
      <line x1="24" y1="44" x2="20" y2="56"/>
      <line x1="40" y1="44" x2="44" y2="56"/>
    </svg>`,
  };

  // Exercises
  const exEl = document.getElementById('exSection');
  const exTitle = isPatient ? 'Exercises to Try' : 'Starter Exercise Program';
  const exSub = isPatient
    ? `Gentle exercises that may help with ${topName}. Start slowly and stop if pain increases beyond a 4/10.`
    : `Evidence-based starting point for ${topName} — progress as tolerated, modify based on response.`;
  exEl.innerHTML = `<div class="card"><div class="card-header"><h2>${exTitle}</h2><p class="subtitle">${exSub}</p></div><div class="exercise-grid" id="exGrid"></div></div>`;
  const exGrid = document.getElementById('exGrid');
  (top.exercises || []).forEach((ex, idx) => {
    const card = document.createElement('div');
    card.className = 'ex-card';
    const svg = EX_DIAGRAMS[ex.diagram] || EX_DIAGRAMS.generic;
    const focusHtml = ex.focus
      ? `<div class="ex-focus">${ex.focus}</div>`
      : '';
    card.innerHTML = `
      <div class="ex-card-inner">
        <div class="ex-text">
          <div class="ex-number">0${idx + 1}</div>
          <strong>${ex.name}</strong>
          ${focusHtml}
          <p>${ex.desc}</p>
          <div class="sets">${ex.sets}</div>
        </div>
      </div>`;
    exGrid.appendChild(card);
  });

  // Patient footer disclaimer
  const footerEl = document.getElementById('patientFooter');
  if (isPatient && footerEl) {
    footerEl.innerHTML = `<div class="patient-footer"><strong>Educational guidance only; not a medical diagnosis.</strong><p style="margin-top:6px;">EIDOS is designed to help you understand your symptoms — not replace a clinical assessment. Always consult a qualified healthcare professional for diagnosis and treatment.</p></div>`;
  } else if (footerEl) {
    footerEl.innerHTML = '';
  }
}

function selectDuration(btn) {
  document.querySelectorAll('#durationChips .chip').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.duration = btn.dataset.dur;
}

function selectSex(btn) {
  document.querySelectorAll('#sexChips .chip').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.sex = btn.dataset.sex;
}

// SLR normal ranges by age/sex (degrees) — based on published normative data
// Sources: Gajdosik & Lusin 1983, Youdas et al 1993, Hamberg et al
function getSLRNorm(age, sex) {
  // Returns {min, typical, label}
  const isFemale = sex === 'female';
  if (age < 20)        return { min: isFemale ? 75 : 70, typical: isFemale ? 90 : 85, label: 'Under 20' };
  if (age < 30)        return { min: isFemale ? 75 : 68, typical: isFemale ? 88 : 82, label: '20–29' };
  if (age < 40)        return { min: isFemale ? 72 : 65, typical: isFemale ? 85 : 78, label: '30–39' };
  if (age < 50)        return { min: isFemale ? 68 : 62, typical: isFemale ? 82 : 75, label: '40–49' };
  if (age < 60)        return { min: isFemale ? 65 : 58, typical: isFemale ? 78 : 70, label: '50–59' };
  if (age < 70)        return { min: isFemale ? 62 : 55, typical: isFemale ? 74 : 67, label: '60–69' };
  return               { min: isFemale ? 58 : 50, typical: isFemale ? 70 : 62, label: '70+' };
}

function evaluateSLR() {
  const ageEl = document.getElementById('patientAge');
  const slrREl = document.getElementById('slrRight');
  const slrLEl = document.getElementById('slrLeft');
  const age = ageEl ? parseInt(ageEl.value) : NaN;
  const slrR = slrREl ? parseFloat(slrREl.value) : NaN;
  const slrL = slrLEl ? parseFloat(slrLEl.value) : NaN;

  state.age = isNaN(age) ? state.age : age; // preserve age from page 2 if not re-entered
  state.slrRight = isNaN(slrR) ? null : slrR;
  state.slrLeft = isNaN(slrL) ? null : slrL;

  if (!state.age || (state.slrRight === null && state.slrLeft === null)) {
    state.slrFlag = null;
    return;
  }

  const norm = getSLRNorm(state.age, state.sex || 'other');
  const worst = Math.min(
    state.slrRight !== null ? state.slrRight : 999,
    state.slrLeft !== null ? state.slrLeft : 999
  );

  if (worst < norm.min - 15)  state.slrFlag = 'severe';
  else if (worst < norm.min)  state.slrFlag = 'mild';
  else                        state.slrFlag = 'normal';
}

function renderSLRFeedback() {
  const feedbackEl = document.getElementById('slrFeedback');
  if (!feedbackEl) return;
  const ageEl = document.getElementById('patientAge');
  const slrREl = document.getElementById('slrRight');
  const slrLEl = document.getElementById('slrLeft');
  const age = ageEl ? parseInt(ageEl.value) : NaN;
  const slrR = slrREl ? parseFloat(slrREl.value) : NaN;
  const slrL = slrLEl ? parseFloat(slrLEl.value) : NaN;
  const sex = state.sex || 'other';

  if (isNaN(age) || (isNaN(slrR) && isNaN(slrL))) { feedbackEl.innerHTML = ''; return; }

  const norm = getSLRNorm(age, sex);
  const sexLabel = sex === 'female' ? 'Female' : sex === 'male' ? 'Male' : 'General';

  let rows = '';
  if (!isNaN(slrR)) {
    const status = slrR >= norm.min ? '✅ Within normal limits' : slrR >= norm.min - 15 ? '⚠️ Mildly restricted' : '🔴 Significantly restricted';
    rows += `<tr><td style="padding:6px 10px;font-weight:500;">Right</td><td style="padding:6px 10px;">${slrR}°</td><td style="padding:6px 10px;">${norm.min}–${norm.typical + 15}°</td><td style="padding:6px 10px;">${status}</td></tr>`;
  }
  if (!isNaN(slrL)) {
    const status = slrL >= norm.min ? '✅ Within normal limits' : slrL >= norm.min - 15 ? '⚠️ Mildly restricted' : '🔴 Significantly restricted';
    rows += `<tr><td style="padding:6px 10px;font-weight:500;">Left</td><td style="padding:6px 10px;">${slrL}°</td><td style="padding:6px 10px;">${norm.min}–${norm.typical + 15}°</td><td style="padding:6px 10px;">${status}</td></tr>`;
  }

  feedbackEl.innerHTML = `
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;">
      <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--accent);margin-bottom:10px;">
        Normative Reference — Age ${age}, ${sexLabel} (Age group: ${norm.label})
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
        <thead><tr style="border-bottom:1px solid var(--border);">
          <th style="text-align:left;padding:4px 10px;color:var(--muted);font-weight:600;">Side</th>
          <th style="text-align:left;padding:4px 10px;color:var(--muted);font-weight:600;">Measured</th>
          <th style="text-align:left;padding:4px 10px;color:var(--muted);font-weight:600;">Expected Range</th>
          <th style="text-align:left;padding:4px 10px;color:var(--muted);font-weight:600;">Interpretation</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="font-size:0.73rem;color:var(--muted);margin-top:8px;">Based on Gajdosik & Lusin (1983) and Youdas et al. (1993). Female norms are typically 5–10° greater than male across age groups.</div>
    </div>`;
}

// ======== ROLE / MODE ========
let _activeModal = null;
let _lastFocusedEl = null;

function _getFocusable(el) {
  return Array.from(el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter(n => !n.disabled && n.offsetParent !== null);
}

function _openModal(overlayId, dialogSelector) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  _lastFocusedEl = document.activeElement;
  _activeModal = overlayId;
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const dialog = overlay.querySelector(dialogSelector);
  const focusables = _getFocusable(overlay);
  if (focusables.length > 0) focusables[0].focus();
  else if (dialog) dialog.focus();
}

function _closeModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (_activeModal === overlayId) _activeModal = null;
  if (_lastFocusedEl && typeof _lastFocusedEl.focus === 'function') _lastFocusedEl.focus();
}

function _handleModalKeydown(e) {
  if (!_activeModal) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    if (_activeModal === 'rfOverlay') closeRedFlags();
    if (_activeModal === 'emailOverlay') closeEmailModal();
    if (_activeModal === 'aboutOverlay') closeAbout();
    return;
  }

  if (e.key !== 'Tab') return;
  const overlay = document.getElementById(_activeModal);
  if (!overlay) return;
  const focusables = _getFocusable(overlay);
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

document.addEventListener('keydown', _handleModalKeydown);

// ======== RED FLAG SCREENER ========
const RED_FLAGS = [
  { label: 'Unexplained weight loss', note: 'Significant unintentional loss — possible malignancy' },
  { label: 'Night sweats / fever / chills', note: 'Constitutional symptoms — possible infection or malignancy' },
  { label: 'History of malignancy', note: 'Prior cancer diagnosis — spinal / bone metastases must be excluded' },
  { label: 'Severe night pain (not positional)', note: 'Pain unrelieved by position change — red flag for malignancy' },
  { label: 'Bladder or bowel dysfunction', note: 'Retention, incontinence, or saddle anaesthesia — possible cauda equina syndrome' },
  { label: 'Saddle anaesthesia / perianal numbness', note: 'Cauda equina — medical emergency, refer immediately' },
  { label: 'Progressive bilateral lower limb weakness', note: 'Bilateral neurological deficit — possible cord compression' },
  { label: 'Recent significant trauma', note: 'Fracture must be excluded in all ages; low-energy in osteoporotic patients' },
  { label: 'Age > 50 with new onset back pain', note: 'New MSK pain in older adults warrants screening for systemic cause' },
  { label: 'Prolonged corticosteroid use', note: 'Osteoporotic fracture risk — low-energy mechanism may cause fracture' },
  { label: 'Intravenous drug use', note: 'Spinal infection / discitis risk' },
  { label: 'Immunosuppression (HIV, transplant, medication)', note: 'Atypical infection or unusual presentation possible' },
  { label: 'Severe unremitting rest pain', note: 'Pain with no position of relief — vascular or visceral referral possible' },
  { label: 'Bilateral upper limb neurological symptoms', note: 'Possible cervical myelopathy or upper motor neuron lesion' },
  { label: 'Gait ataxia / balance loss', note: 'Possible cervical cord involvement or central pathology' },
  { label: 'Chest pain / dyspnea with musculoskeletal symptoms', note: 'Cardiac or pulmonary origin must be excluded' },
  { label: 'Abdominal pulsatile mass / vascular history', note: 'Abdominal aortic aneurysm can present as low back pain' },
  { label: 'Unilateral calf/leg swelling, warmth, or redness', note: 'Deep vein thrombosis must be excluded — Wells criteria applies; refer urgently' },
];

function openRedFlags(role) {
  state._pendingRole = role;
  if (!state._rfFlagged) state._rfFlagged = new Set();
  const container = document.getElementById('rfItems');
  if (!container) return;
  container.innerHTML = '';
  RED_FLAGS.forEach((rf, i) => {
    const item = document.createElement('div');
    item.className = 'rf-item' + (state._rfFlagged.has(i) ? ' flagged' : '');
    item.dataset.index = i;
    item.innerHTML = `
      <div class="rf-checkbox"></div>
      <div>
        <div class="rf-item-label">${rf.label}</div>
        <div class="rf-item-note">${rf.note}</div>
      </div>`;
    item.addEventListener('click', () => {
      item.classList.toggle('flagged');
      const idx = parseInt(item.dataset.index);
      if (item.classList.contains('flagged')) state._rfFlagged.add(idx);
      else state._rfFlagged.delete(idx);
      updateRFAlert();
    });
    container.appendChild(item);
  });
  updateRFAlert();
  _openModal('rfOverlay', '.rf-modal');
}

function updateRFAlert() {
  const flagged = document.querySelectorAll('.rf-item.flagged').length;
  const alert = document.getElementById('rfAlert');
  const btn = document.getElementById('rfProceedBtn');
  const hardStop = document.getElementById('rfHardStop');
  const isPatient = state._pendingRole === 'patient';
  if (flagged > 0) {
    if (alert) alert.classList.add('show');
    if (btn) btn.style.display = 'none';
    if (hardStop) {
      hardStop.style.display = 'block';
      // Patient mode: strong safety hard-stop — do not encourage clearing flags to proceed
      // Clinician mode: allow clearing flags and re-assessing
      const titleEl = document.getElementById('rfHardStopTitle');
      const msgEl = document.getElementById('rfHardStopMsg');
      if (isPatient) {
        if (titleEl) titleEl.textContent = 'Please seek medical assessment.';
        if (msgEl) msgEl.textContent = 'One or more of your responses suggests you may need urgent medical attention rather than a symptom guide. Please contact your doctor or seek in-person care. If you believe this does not apply to you, deselect the item and continue.';
      } else {
        if (titleEl) titleEl.textContent = 'Red flag(s) identified — clinical judgement required.';
        if (msgEl) msgEl.textContent = 'The selected findings may indicate serious pathology. This tool is not appropriate as a primary assessment in this context. Deselect to proceed if clinically appropriate, or close to exit.';
      }
    }
  } else {
    if (alert) alert.classList.remove('show');
    if (btn) {
      btn.style.display = 'block';
      btn.textContent = 'Proceed to Assessment →';
    }
    if (hardStop) hardStop.style.display = 'none';
  }
  // Update header badge
  const badge = document.getElementById('rfHeaderBadge');
  if (badge && state._rfFlagged && state._rfFlagged.size > 0) {
    badge.style.display = 'block';
    badge.textContent = `⚠ ${state._rfFlagged.size} red flag${state._rfFlagged.size > 1 ? 's' : ''}`;
  } else if (badge) {
    badge.style.display = 'none';
  }
}

function closeRedFlags() {
  _closeModal('rfOverlay');
  state._pendingRole = null;
}

function proceedAfterRedFlags() {
  const role = state._pendingRole;
  if (role === 'patient' && state._rfFlagged && state._rfFlagged.size > 0) {
    updateRFAlert();
    return;
  }
  _closeModal('rfOverlay');
  state._pendingRole = null;
  if (role === 'patient') {
    selectRole('patient');
  } else {
    selectRole(role);
  }
}

// ======== CONFIDENCE INFERENCE ENGINE ========
function inferWhyPanel(d, syms, agg, alle, tests, age, sex, allScored) {
  const baseScore = d.score;
  const maxPossible = estimateMaxScore(d, age, sex);

  // Supporting positives — factors that contributed to score
  const supporting = [];
  const testLabels = { syms, agg, alle };

  // Test each symptom individually
  syms.forEach(sym => {
    const withSet = new Set([sym]);
    const emptySet = new Set();
    const withScore = d.match(withSet, emptySet, emptySet, {}, {}, age, sex);
    if (withScore > 0) supporting.push({ label: sym, type: 'symptom', weight: withScore });
  });
  agg.forEach(f => {
    const withScore = d.match(new Set(), new Set([f]), new Set(), {}, {}, age, sex);
    if (withScore > 0) supporting.push({ label: f, type: 'agg', weight: withScore });
  });
  alle.forEach(f => {
    const withScore = d.match(new Set(), new Set(), new Set([f]), {}, {}, age, sex);
    if (withScore > 0) supporting.push({ label: f, type: 'alle', weight: withScore });
  });
  Object.keys(tests).forEach(t => {
    const testObj = { [t]: tests[t] };
    const withScore = d.match(new Set(), new Set(), new Set(), {}, testObj, age, sex);
    if (withScore > 0) supporting.push({ label: `${t} (${tests[t]})`, type: 'test', weight: withScore });
  });

  // Sort by weight desc, take top 6
  supporting.sort((a, b) => b.weight - a.weight);
  const topSupporting = supporting.slice(0, 7);

  // Disconfirming negatives — high-value factors NOT present
  // Run match with each potential high-value symptom to see what it would add
  const allKnownSymptoms = Object.values(SYMPTOM_CHIPS).flat();
  const allKnownAgg = Object.values(AGG_CHIPS).flat();
  const missingHigh = [];

  allKnownSymptoms.forEach(sym => {
    if (syms.has(sym)) return;
    const addScore = d.match(new Set([sym]), new Set(), new Set(), {}, {}, age, sex);
    if (addScore >= 3) missingHigh.push({ label: sym, weight: addScore });
  });
  allKnownAgg.forEach(f => {
    if (agg.has(f)) return;
    const addScore = d.match(new Set(), new Set([f]), new Set(), {}, {}, age, sex);
    if (addScore >= 3) missingHigh.push({ label: f, weight: addScore });
  });
  missingHigh.sort((a, b) => b.weight - a.weight);
  const topMissing = missingHigh.slice(0, 5);

  // Next best discriminators — tests/questions that would best separate top conditions
  const discriminators = getDiscriminators(d, allScored, syms, agg, alle, age, sex);

  // Confidence score
  const confidencePct = maxPossible > 0 ? Math.min(100, Math.round((baseScore / maxPossible) * 100)) : 0;
  const dataPct = Math.min(100, Math.round(((syms.size + agg.size + alle.size + Object.keys(tests).length) / 20) * 100));

  // Qualitative tier — replaces numeric display
  const patternTier = confidencePct >= 65 ? 'High pattern consistency'
                    : confidencePct >= 35 ? 'Moderate pattern consistency'
                    : 'Low pattern consistency';
  const dataTier = dataPct >= 60 ? 'Substantial data entered'
                 : dataPct >= 30 ? 'Partial data entered'
                 : 'Limited data entered';
  return { topSupporting, topMissing, discriminators, confidencePct, dataPct, patternTier, dataTier, baseScore, maxPossible };
}

const _maxScoreCache = {};
function estimateMaxScore(d, age, sex) {
  const key = d.name + '|' + (age||40) + '|' + (sex||'male');
  if (_maxScoreCache[key] !== undefined) return _maxScoreCache[key];
  const allSyms = new Set(Object.values(SYMPTOM_CHIPS).flat());
  const allAgg  = new Set(Object.values(AGG_CHIPS).flat());
  const allAlle = new Set(Object.values(ALLE_CHIPS).flat());
  const allTests = {};
  ['SLR — Ipsilateral (straight leg raise)','SLR — Crossed (contralateral)','Slump Test',
   'Hawkins-Kennedy Test','Neer Impingement Sign','Empty Can Test',"Speed's Test",
   'McMurray Test','Lachman Test','FABER Test','FADIR Test',
   'Valgus Stress Test (0° and 30°)','Varus Stress Test (0° and 30°)',
   "Tinel's Sign (cubital tunnel)","Cozen Test / Thomsen Test","Mill's Test",
   'Spurling Test (Compression)','External Rotation Lag Test','Drop Arm Test',
   'Apprehension Test','Dynamic Labral Shear Test',"O'Brien Active Compression Test"
  ].forEach(t => allTests[t] = '+');
  const result = d.match(allSyms, allAgg, allAlle, {}, allTests, age||40, sex||'male');
  _maxScoreCache[key] = result;
  return result;
}

function getDiscriminators(topDx, allScored, syms, agg, alle, age, sex) {
  const area = state.area || 'lumbar';
  const candidateTests = [];
  const competitors = allScored.filter(d => d !== topDx).slice(0, 2);
  const discriminators = [];

  // Pull ruleIn and ruleOut tests from the top dx's DDX_TESTS entry
  const dxName = topDx.name.replace('⚠️ ','');
  const entry = DDX_TESTS[dxName] || DDX_TESTS['⚠️ ' + dxName];
  if (entry) {
    (entry.ruleIn  || []).forEach(t => { if (!candidateTests.includes(t)) candidateTests.push(t); });
    (entry.ruleOut || []).forEach(t => { if (!candidateTests.includes(t)) candidateTests.push(t); });
  }

  candidateTests.forEach(test => {
    if (syms.has(test)) return;
    const topWithTest = topDx.match(syms, agg, alle, {}, { [test]: '+' }, age, sex);
    const topGain = topWithTest - topDx.score;
    let compGain = 0;
    if (competitors.length > 0) {
      const compScores = competitors.map(c => c.match(syms, agg, alle, {}, { [test]: '+' }, age, sex));
      const avgCompBefore = competitors.reduce((s, c) => s + c.score, 0) / competitors.length;
      const avgCompAfter  = compScores.reduce((s, v) => s + v, 0) / compScores.length;
      compGain = avgCompAfter - avgCompBefore;
    }
    const discriminatingPower = Math.abs(topGain - compGain);
    if (discriminatingPower > 0 || topGain > 2) {
      discriminators.push({ label: test, type: 'test', power: discriminatingPower + topGain });
    }
  });

  // Only add generic history questions if fewer than 3 test discriminators found
  if (discriminators.length < 3) {
    const HISTORY_QUESTIONS = [
      'Onset — sudden trauma or insidious?',
      'History of prior episodes in this region?',
      'Night pain — does it wake from sleep?',
      'Morning stiffness — duration and pattern?',
      'Bilateral vs unilateral symptoms?',
    ];
    HISTORY_QUESTIONS.slice(0, 3 - discriminators.length).forEach(q => {
      discriminators.push({ label: q, type: 'history', power: 0.5 });
    });
  }

  discriminators.sort((a, b) => b.power - a.power);
  return discriminators.slice(0, 3);
}

function renderWhyPanel(containerId, d, syms, agg, alle, tests, age, sex, allScored) {
  const why = inferWhyPanel(d, syms, agg, alle, tests, age, sex, allScored);
  const el = document.getElementById(containerId);
  if (!el) return;

  const panelId = `why-panel-${containerId}`;
  const toggleId = `why-toggle-${containerId}`;

  el.innerHTML = `
    <button class="why-toggle" id="${toggleId}" onclick="toggleWhyPanel('${panelId}','${toggleId}')">
      <span class="why-toggle-icon">+</span>
      Show reasoning
    </button>
    <div class="why-panel" id="${panelId}">
      <div class="why-section">
        <div class="why-section-title">Match Strength</div>
        <div class="why-confidence-row">
          <span class="why-conf-label">Pattern</span>
          <div class="why-conf-bar"><div class="why-conf-fill" style="width:${why.confidencePct}%"></div></div>
          <span class="why-conf-tier">${why.patternTier}</span>
        </div>
        <div class="why-confidence-row">
          <span class="why-conf-label">Data</span>
          <div class="why-conf-bar"><div class="why-conf-fill" style="width:${why.dataPct}%;opacity:0.5"></div></div>
          <span class="why-conf-tier">${why.dataTier}</span>
        </div>
      </div>
      ${why.topSupporting.length ? `
      <div class="why-section">
        <div class="why-section-title">Supporting Findings</div>
        <div class="why-tags">${why.topSupporting.map(f => `<span class="why-tag pos">${f.label}</span>`).join('')}</div>
      </div>` : ''}
      ${why.topMissing.length ? `
      <div class="why-section">
        <div class="why-section-title">Would Strengthen — Not Reported</div>
        <div class="why-tags">${why.topMissing.map(f => `<span class="why-tag neg">${f.label}</span>`).join('')}</div>
      </div>` : ''}
      ${why.discriminators.length ? `
      <div class="why-section">
        <div class="why-section-title">Next Best Discriminators</div>
        <div class="why-tags">${why.discriminators.map(f => `<span class="why-tag disc">${f.type === 'test' ? '▷ ' : '? '}${f.label}</span>`).join('')}</div>
      </div>` : ''}
    </div>`;
}

function toggleWhyPanel(panelId, toggleId) {
  const panel = document.getElementById(panelId);
  const toggle = document.getElementById(toggleId);
  panel.classList.toggle('open');
  toggle.classList.toggle('open');
}

// ======== USER COLLECTION ========
function goToCollect(target = 'patient') {
  loadContactFromStorage();
  state._collectTarget = target || 'patient';
  state._collectComplete = false;
  const nameEl  = document.getElementById('collectName');
  const emailEl = document.getElementById('collectEmail');
  if (state.userName)  nameEl.value  = state.userName;
  if (state.userEmail) emailEl.value = state.userEmail;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('pageCollect').classList.add('active');
  const progressBarEl = document.getElementById('progressBar');
  if (progressBarEl) {
    progressBarEl.style.display = 'none';
    progressBarEl.classList.remove('patient-mode');
  }
  document.getElementById('startOverBtn').style.display = 'inline-block';
  _currentPage = -1;
  setUIRoute('split');
  syncHeaderPostCollect();
}

function continueAfterCollect() {
  state._collectComplete = true;
  syncHeaderPostCollect();
  const target = state._collectTarget || 'patient';
  state._collectTarget = 'patient';

  if (target === 'cases') {
    document.body.style.overflow = '';
    csResetChallengeContext({ preserveOwnerLinks: true, clearRoute: true });
    csState.active = true;
    setUIRoute('split');
    document.getElementById('progressBar').style.display = 'none';
    document.getElementById('startOverBtn').style.display = 'none';
    csGoTo('pagCS0');
    return;
  }

  if (target === 'patient_redflags') {
    openRedFlags('patient');
    return;
  }

  if (target === 'clinician_gateway') {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page0').classList.add('active');
    document.getElementById('progressBar').style.display = 'none';
    document.getElementById('startOverBtn').style.display = 'none';
    _currentPage = 0;
    openClinicianGateway();
    return;
  }

  if (target === 'clinician') {
    selectRole('clinician');
    return;
  }

  selectRole('patient');
}

function _isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function _collectUserFallback(name, email) {
  const sendKitFn = (typeof window !== 'undefined' && typeof window.sendEmailToKit === 'function')
    ? window.sendEmailToKit
    : (typeof sendEmailToKit === 'function' ? sendEmailToKit : null);

  const result = (email && sendKitFn)
    ? await sendKitFn(email, name)
    : (email ? { ok: false, source: 'kit_config', detail: 'sendEmailToKit_unavailable' } : { ok: true, skipped: true });

  _track('user_identified');
  return result;
}

function _resolveCollectUserFn() {
  if (typeof window !== 'undefined' && typeof window._collectUser === 'function') return window._collectUser;
  return _collectUserFallback;
}

async function submitCollect() {
  const name  = document.getElementById('collectName').value.trim();
  const email = document.getElementById('collectEmail').value.trim();
  const emailEl = document.getElementById('collectEmail');
  const hasEmail = email.length > 0;
  const collectTarget = state._collectTarget || 'patient';
  const submitBtn = document.getElementById('collectSubmitBtn');
  const originalLabel = submitBtn ? submitBtn.textContent : 'Continue →';

  if (hasEmail && !_isValidEmail(email)) {
    if (emailEl) {
      emailEl.style.borderBottomColor = 'var(--negative)';
      emailEl.focus();
      setTimeout(() => emailEl.style.borderBottomColor = '', 2000);
    }
    _showToast('Enter a valid email, or continue without updates.', 3500);
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Continuing...';
  }

  state.userName  = name;
  state.userEmail = email;
  saveContactToStorage();
  // Never block progression on email capture; Kit call is best-effort in background.
  const collectUserFn = _resolveCollectUserFn();
  void (async () => {
    try {
      const kitResult = await collectUserFn(name, email);
      if (hasEmail && !kitResult.ok) {
        const errMsg = _formatKitError(kitResult);
        const fullMsg = errMsg
          ? `Could not subscribe your email right now (${errMsg}). Try again from the results page.`
          : 'Could not subscribe your email right now. You can try again from the results page.';
        _showToast(fullMsg, 5500);
        console.error('Kit subscribe failed (collect flow):', kitResult);
      }
      if (hasEmail && kitResult.ok) console.info('Kit subscribe success (collect flow):', kitResult);
    } catch (err) {
      console.error('Kit subscribe threw (collect flow):', err);
    }
  })();

  state._collectComplete = true;
  syncHeaderPostCollect();

  try {
    // Primary navigation path.
    continueAfterCollect();
  } catch (navErr) {
    console.error('Collect navigation fallback triggered:', navErr);
    if (collectTarget === 'cases') {
      try {
        document.body.style.overflow = '';
        csResetChallengeContext({ preserveOwnerLinks: true, clearRoute: true });
        csState.active = true;
        setUIRoute('split');
        const progressBar = document.getElementById('progressBar');
        const startOverBtn = document.getElementById('startOverBtn');
        if (progressBar) progressBar.style.display = 'none';
        if (startOverBtn) startOverBtn.style.display = 'none';
        csGoTo('pagCS0');
      } catch (_) {}
    } else if (collectTarget === 'clinician_gateway') {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const page0 = document.getElementById('page0');
      if (page0) page0.classList.add('active');
      const progressBar = document.getElementById('progressBar');
      const startOverBtn = document.getElementById('startOverBtn');
      if (progressBar) progressBar.style.display = 'none';
      if (startOverBtn) startOverBtn.style.display = 'none';
      _currentPage = 0;
      try { openClinicianGateway(); } catch (_) {}
    } else if (collectTarget === 'patient_redflags') {
      try {
        openRedFlags('patient');
      } catch (_) {
        state.mode = 'patient';
        const progressBar = document.getElementById('progressBar');
        const startOverBtn = document.getElementById('startOverBtn');
        if (progressBar) progressBar.style.display = 'flex';
        if (startOverBtn) startOverBtn.style.display = 'inline-block';
        if (typeof goTo === 'function') {
          try { goTo(1); } catch (_) {}
        }
      }
    } else {
      // Hard fallback: route to requested assessment mode.
      state.mode = collectTarget === 'clinician' ? 'clinician' : 'patient';
      const progressBar = document.getElementById('progressBar');
      const startOverBtn = document.getElementById('startOverBtn');
      if (progressBar) progressBar.style.display = 'flex';
      if (startOverBtn) startOverBtn.style.display = 'inline-block';

      if (typeof goTo === 'function') {
        try { goTo(1); } catch (_) {}
      } else {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const page1 = document.getElementById('page1');
        if (page1) page1.classList.add('active');
      }
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  }
}

function skipCollect() {
  state.userName  = '';
  state.userEmail = '';
  saveContactToStorage();
  continueAfterCollect();
}

// ======== ANALYTICS TRACKING (GA4) ========
// Sends anonymous event metadata only (no symptoms/diagnostic output).
function _track(event, extra) {
  const payload = {
    mode: state.mode || undefined,
    area: state.area || undefined,
    ...(extra || {})
  };
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, payload);
      return;
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: `eidos_${event}`, ...payload });
    }
  } catch (_) {
    // fail silently — analytics is non-critical
  }
}

function _trackPageView() {
  // sessionStorage guard: fires once per browser session, not on every refresh
  try {
    if (sessionStorage.getItem('eidos_pv_sent')) return;
    sessionStorage.setItem('eidos_pv_sent', '1');
  } catch (_) {} // if sessionStorage blocked, still fire once per load
  _track('page_view');
}

// ── Kit (ConvertKit) subscription transport ──
// Kit embed UID and site host.
const _KIT_SITE_HOST = 'eidos-2.kit.com';
const _KIT_UID = '4625fa2552';
const _KIT_SCRIPT_SRC = `https://${_KIT_SITE_HOST}/${_KIT_UID}/index.js`;
const _KIT_SCRIPT_ID = 'kit-embed-script';
const _KIT_WORKER_ENDPOINT_STORAGE_KEY = 'eidos_kit_worker_endpoint';
const _KIT_DEFAULT_WORKER_ENDPOINT = '';
const _KIT_USE_WORKER_FALLBACK = true;
const _KIT_DIRECT_FETCH_ENABLED = false;
const _KIT_FORM_ACTION_STORAGE_KEY = 'eidos_kit_form_action';
const _KIT_DEFAULT_FORM_ACTION = 'https://app.kit.com/forms/9146349/subscriptions';
// IMPORTANT: use the real form action URL from Kit embed HTML, e.g.
// https://app.kit.com/forms/1234567/subscriptions
let _KIT_FORM_ACTION = '';
let _KIT_ENDPOINTS = [];
let _KIT_WORKER_ENDPOINT = '';
let _KIT_WORKER_ENDPOINTS = [];

function _loadSavedKitFormAction() {
  try {
    const saved = localStorage.getItem(_KIT_FORM_ACTION_STORAGE_KEY);
    return (saved || '').trim();
  } catch (_) {
    return '';
  }
}

function _loadSavedKitWorkerEndpoint() {
  try {
    const saved = localStorage.getItem(_KIT_WORKER_ENDPOINT_STORAGE_KEY);
    return (saved || '').trim();
  } catch (_) {
    return '';
  }
}

function _normalizeKitWorkerEndpoint(endpointUrl) {
  const endpoint = (endpointUrl || '').trim();
  if (!endpoint) return '';
  return endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
}

function _buildWorkerEndpoints(endpointUrl) {
  const endpoint = _normalizeKitWorkerEndpoint(endpointUrl);
  if (!endpoint) return [];

  const endpoints = [];
  const root = endpoint.replace(/\/subscribe\/?$/i, '/');
  const subscribe = `${root}subscribe`;
  endpoints.push(subscribe, root);

  // Legacy fallback for previously mistyped host.
  if (root.includes('brettpugh.workers.dev')) {
    const legacyRoot = root.replace('brettpugh.workers.dev', 'brettpughh.workers.dev');
    const legacySubscribe = `${legacyRoot}subscribe`;
    endpoints.push(legacySubscribe, legacyRoot);
  }

  return Array.from(new Set(endpoints));
}

function _extractKitFormToken(actionUrl) {
  if (!actionUrl) return '';
  const m = String(actionUrl).match(/\/forms\/([A-Za-z0-9_-]+)\/subscriptions/i);
  return m ? m[1] : '';
}

function _buildKitEndpoints(actionUrl) {
  const endpoints = [];
  const action = (actionUrl || '').trim();
  const formToken = _extractKitFormToken(action);
  if (action) endpoints.push(action);

  // If we know a form token from the action URL, try canonical Kit hosts.
  if (formToken) {
    endpoints.push(`https://app.kit.com/forms/${formToken}/subscriptions`);
    endpoints.push(`https://app.convertkit.com/forms/${formToken}/subscriptions`);
    endpoints.push(`https://${_KIT_SITE_HOST}/forms/${formToken}/subscriptions`);
  }

  // Best-effort fallback using embed UID when no explicit action is configured yet.
  if (!action && _KIT_UID) {
    endpoints.push(`https://${_KIT_SITE_HOST}/forms/${_KIT_UID}/subscriptions`);
    endpoints.push(`https://app.kit.com/forms/${_KIT_UID}/subscriptions`);
    endpoints.push(`https://app.convertkit.com/forms/${_KIT_UID}/subscriptions`);
  }
  return Array.from(new Set(endpoints));
}

function _setKitFormActionInternal(actionUrl, persist) {
  _KIT_FORM_ACTION = (actionUrl || '').trim();
  _KIT_ENDPOINTS = _buildKitEndpoints(_KIT_FORM_ACTION);
  if (persist) {
    try {
      if (_KIT_FORM_ACTION) localStorage.setItem(_KIT_FORM_ACTION_STORAGE_KEY, _KIT_FORM_ACTION);
      else localStorage.removeItem(_KIT_FORM_ACTION_STORAGE_KEY);
    } catch (_) {}
  }
}

function _setKitWorkerEndpointInternal(endpointUrl, persist) {
  _KIT_WORKER_ENDPOINT = _normalizeKitWorkerEndpoint(endpointUrl);
  _KIT_WORKER_ENDPOINTS = _buildWorkerEndpoints(_KIT_WORKER_ENDPOINT);
  if (persist) {
    try {
      if (_KIT_WORKER_ENDPOINT) localStorage.setItem(_KIT_WORKER_ENDPOINT_STORAGE_KEY, _KIT_WORKER_ENDPOINT);
      else localStorage.removeItem(_KIT_WORKER_ENDPOINT_STORAGE_KEY);
    } catch (_) {}
  }
}

_setKitFormActionInternal(_loadSavedKitFormAction() || _KIT_DEFAULT_FORM_ACTION, false);
_setKitWorkerEndpointInternal(_loadSavedKitWorkerEndpoint() || _KIT_DEFAULT_WORKER_ENDPOINT, false);

function _updateKitDebugGlobals() {
  window.EIDOS_KIT_DEBUG = {
    uid: _KIT_UID,
    scriptSrc: _KIT_SCRIPT_SRC,
    workerEndpoint: _KIT_WORKER_ENDPOINT,
    workerEndpoints: _KIT_WORKER_ENDPOINTS.slice(),
    workerFallbackEnabled: _KIT_USE_WORKER_FALLBACK,
    directFetchEnabled: _KIT_DIRECT_FETCH_ENABLED,
    formAction: _KIT_FORM_ACTION,
    formToken: _extractKitFormToken(_KIT_FORM_ACTION),
    endpoints: _KIT_ENDPOINTS.slice()
  };
  window._KIT_UID = _KIT_UID;
  window._KIT_FORM_ACTION = _KIT_FORM_ACTION;
  window._KIT_ENDPOINTS = _KIT_ENDPOINTS.slice();
  window._KIT_WORKER_ENDPOINT = _KIT_WORKER_ENDPOINT;
  window._KIT_WORKER_ENDPOINTS = _KIT_WORKER_ENDPOINTS.slice();
  window.setKitFormAction = function(actionUrl) {
    _setKitFormActionInternal(actionUrl, true);
    _updateKitDebugGlobals();
    return window.EIDOS_KIT_DEBUG;
  };
  window.setKitFormId = function(formToken) {
    const token = (formToken || '').toString().trim();
    if (!token) return window.setKitFormAction('');
    return window.setKitFormAction(`https://app.kit.com/forms/${token}/subscriptions`);
  };
  window.setKitWorkerEndpoint = function(endpointUrl) {
    _setKitWorkerEndpointInternal(endpointUrl, true);
    _updateKitDebugGlobals();
    return window.EIDOS_KIT_DEBUG;
  };
}

_updateKitDebugGlobals();
// Console-friendly alias for Safari/WebKit.
var EIDOS_KIT_DEBUG = window.EIDOS_KIT_DEBUG;

function _ensureKitScript() {
  if (document.getElementById(_KIT_SCRIPT_ID)) return;
  const s = document.createElement('script');
  s.async = true;
  s.id = _KIT_SCRIPT_ID;
  s.setAttribute('data-uid', _KIT_UID);
  s.src = _KIT_SCRIPT_SRC;
  document.head.appendChild(s);
}

async function _postKitEndpoint(url, email, name) {
  const data = new FormData();
  data.append('email_address', email);
  if (name) {
    data.append('first_name', name);
    data.append('fields[first_name]', name);
    data.append('name', name);
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: data
  });

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch (_) {}
    return { ok: false, source: 'kit', endpoint: url, status: res.status, detail };
  }

  if (!contentType.includes('application/json')) {
    let text = '';
    try { text = await res.text(); } catch (_) {}
    return {
      ok: false,
      source: 'kit',
      endpoint: url,
      status: res.status,
      detail: text ? `non_json_response:${text.slice(0, 260)}` : 'non_json_response'
    };
  }

  let body = null;
  try { body = await res.json(); } catch (_) {}
  if (!body) return { ok: false, source: 'kit', endpoint: url, status: res.status, detail: 'empty_json_body' };
  if (body.error || body.errors) {
    const detail = body.error || (Array.isArray(body.errors) ? body.errors.join(', ') : 'kit_json_error');
    return { ok: false, source: 'kit', endpoint: url, status: res.status, detail };
  }
  if (body.subscription || body.subscriber || body.subscriber_id || body.id || body.data) {
    return { ok: true, source: 'kit', endpoint: url, status: res.status, payload: body };
  }
  return { ok: false, source: 'kit', endpoint: url, status: res.status, detail: 'json_missing_subscription' };
}

async function _postKitViaWorker(email, name, directAttempts) {
  const payload = {
    email,
    name: name || '',
    uid: _KIT_UID,
    form_action: _KIT_FORM_ACTION || null,
    endpoints: _KIT_ENDPOINTS.slice(),
    direct_attempts: Array.isArray(directAttempts) ? directAttempts : []
  };

  const workerEndpoints = _KIT_WORKER_ENDPOINTS.length
    ? _KIT_WORKER_ENDPOINTS.slice()
    : (_KIT_WORKER_ENDPOINT ? [_KIT_WORKER_ENDPOINT] : []);
  if (!workerEndpoints.length) {
    return { ok: false, source: 'worker', detail: 'missing_worker_endpoint' };
  }

  const workerAttempts = [];
  for (const workerEndpoint of workerEndpoints) {
    try {
      const res = await fetch(workerEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let detail = '';
        try { detail = await res.text(); } catch (_) {}
        workerAttempts.push({ ok: false, source: 'worker', endpoint: workerEndpoint, status: res.status, detail });
        continue;
      }

      const contentType = (res.headers.get('content-type') || '').toLowerCase();
      if (contentType.includes('application/json')) {
        let body = null;
        try { body = await res.json(); } catch (_) {}
        if (!body) {
          workerAttempts.push({ ok: false, source: 'worker', endpoint: workerEndpoint, status: res.status, detail: 'empty_json_body' });
          continue;
        }
        if (body.error || body.errors) {
          const detail = body.error || (Array.isArray(body.errors) ? body.errors.join(', ') : 'worker_json_error');
          workerAttempts.push({ ok: false, source: 'worker', endpoint: workerEndpoint, status: res.status, detail, payload: body });
          continue;
        }
        const hasSuccess = body.ok === true || body.success === true || body.subscribed === true;
        const hasSubscriberData = !!(body.subscription || body.subscriber || body.subscriber_id || body.id || body.data);
        if (hasSuccess || hasSubscriberData) {
          return { ok: true, source: 'worker', endpoint: workerEndpoint, status: res.status, payload: body };
        }
        workerAttempts.push({
          ok: false,
          source: 'worker',
          endpoint: workerEndpoint,
          status: res.status,
          detail: 'worker_json_missing_subscription',
          payload: body
        });
        continue;
      }

      let text = '';
      try { text = await res.text(); } catch (_) {}
      workerAttempts.push({
        ok: false,
        source: 'worker',
        endpoint: workerEndpoint,
        status: res.status,
        detail: text ? `non_json_response:${text.slice(0, 260)}` : 'worker_non_json_response'
      });
    } catch (err) {
      workerAttempts.push({
        ok: false,
        source: 'worker',
        endpoint: workerEndpoint,
        error: (err && err.message) ? err.message : 'network_error'
      });
    }
  }

  if (!workerAttempts.length) return { ok: false, source: 'worker', detail: 'worker_request_failed' };
  const lastAttempt = workerAttempts[workerAttempts.length - 1];
  return { ...lastAttempt, attempts: workerAttempts };
}

function _submitKitViaHiddenForm(actionUrl, email, name) {
  try {
    const findKitFormTemplate = () => {
      const forms = Array.from(document.querySelectorAll('form[action*="/forms/"][action*="/subscriptions"]'));
      if (!forms.length) return null;
      const preferred = forms.find(f => {
        const a = (f.getAttribute('action') || '').toLowerCase();
        return a.includes('app.kit.com') || a.includes('app.convertkit.com') || a.includes(_KIT_SITE_HOST.toLowerCase());
      });
      return preferred || forms[0];
    };

    const setFieldValues = (form, testFn, value) => {
      let found = false;
      Array.from(form.querySelectorAll('input')).forEach(input => {
        if (testFn(input)) {
          input.value = value;
          found = true;
        }
      });
      return found;
    };

    const targetName = `kit_iframe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const iframe = document.createElement('iframe');
    iframe.name = targetName;
    iframe.style.display = 'none';

    const template = findKitFormTemplate();
    const form = template || document.createElement('form');
    const createdForm = !template;
    const addedInputs = [];
    const originalTarget = !createdForm ? (form.getAttribute('target') || '') : '';
    const originalNoValidate = !createdForm ? form.noValidate : false;
    const originalMethod = !createdForm ? (form.getAttribute('method') || form.method || '') : '';
    const originalAction = !createdForm ? (form.getAttribute('action') || form.action || '') : '';

    form.method = 'POST';
    if (createdForm) {
      form.action = actionUrl || form.action;
    } else if (!form.action && actionUrl) {
      form.action = actionUrl;
    }
    form.target = targetName;
    form.noValidate = true;
    if (createdForm) form.style.display = 'none';

    if (createdForm) {
      const formToken = _extractKitFormToken(form.action || actionUrl || _KIT_FORM_ACTION || _KIT_DEFAULT_FORM_ACTION);
      form.className = 'seva-form formkit-form';
      if (formToken) form.setAttribute('data-sv-form', formToken);
      form.setAttribute('data-uid', _KIT_UID);
      form.setAttribute('data-format', 'inline');
      form.setAttribute('data-version', '5');
    }

    const hasEmail = setFieldValues(
      form,
      input => input.type === 'email' || input.name === 'email_address' || input.name === 'email',
      email
    );
    if (!hasEmail) {
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email_address';
      emailInput.value = email;
      form.appendChild(emailInput);
      addedInputs.push(emailInput);

      const emailAlias = document.createElement('input');
      emailAlias.type = 'hidden';
      emailAlias.name = 'email';
      emailAlias.value = email;
      form.appendChild(emailAlias);
      addedInputs.push(emailAlias);
    }

    if (name) {
      setFieldValues(
        form,
        input => input.name === 'first_name' || input.name === 'fields[first_name]' || input.name === 'name',
        name
      );
      // If there are no name fields in template, include common fallbacks.
      const hasAnyNameField = Array.from(form.querySelectorAll('input')).some(
        i => i.name === 'first_name' || i.name === 'fields[first_name]' || i.name === 'name'
      );
      if (!hasAnyNameField) {
        const nameInput = document.createElement('input');
        nameInput.type = 'hidden';
        nameInput.name = 'first_name';
        nameInput.value = name;
        form.appendChild(nameInput);
        addedInputs.push(nameInput);

        const fieldNameInput = document.createElement('input');
        fieldNameInput.type = 'hidden';
        fieldNameInput.name = 'fields[first_name]';
        fieldNameInput.value = name;
        form.appendChild(fieldNameInput);
        addedInputs.push(fieldNameInput);
      }
    }

    if (createdForm) {
      const appendHidden = (name, value) => {
        const already = Array.from(form.querySelectorAll('input')).some(input => input.name === name);
        if (already) return;
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = name;
        hidden.value = value;
        form.appendChild(hidden);
        addedInputs.push(hidden);
      };
      appendHidden('landing_page', window.location.href);
      appendHidden('referrer', document.referrer || window.location.href);
      appendHidden('api_source', 'custom_js');
      appendHidden('source', 'website');
    }

    document.body.appendChild(iframe);
    if (createdForm) document.body.appendChild(form);
    form.submit();

    // Cleanup after submit; we only need best-effort delivery.
    setTimeout(() => {
      addedInputs.forEach(input => { try { input.remove(); } catch (_) {} });
      if (!createdForm) {
        try {
          if (originalTarget) form.setAttribute('target', originalTarget);
          else form.removeAttribute('target');
          form.noValidate = originalNoValidate;
          if (originalMethod) form.setAttribute('method', originalMethod);
          if (originalAction) form.setAttribute('action', originalAction);
        } catch (_) {}
      } else {
        try { form.remove(); } catch (_) {}
      }
      try { iframe.remove(); } catch (_) {}
    }, 4000);

    return { ok: true, source: 'form_post', endpoint: form.action || actionUrl, detail: template ? 'submitted_via_hidden_form_template' : 'submitted_via_hidden_form' };
  } catch (err) {
    return {
      ok: false,
      source: 'form_post',
      endpoint: actionUrl,
      error: (err && err.message) ? err.message : 'hidden_form_submit_failed'
    };
  }
}

async function sendEmailToKit(email, name) {
  if (!email) return { ok: false, skipped: true };
  _ensureKitScript();
  if (!_KIT_ENDPOINTS.length && !_KIT_USE_WORKER_FALLBACK) {
    return {
      ok: false,
      source: 'kit_config',
      detail: 'missing_form_action',
      hint: 'Set _KIT_FORM_ACTION in code or run setKitFormAction("https://app.kit.com/forms/<numeric_id>/subscriptions"), or enable worker fallback.'
    };
  }

  const attempts = [];
  // Best-effort direct POST first.
  if (_KIT_DIRECT_FETCH_ENABLED && _KIT_ENDPOINTS.length) {
    for (const endpoint of _KIT_ENDPOINTS) {
      try {
        const result = await _postKitEndpoint(endpoint, email, name);
        if (result.ok) return result;
        attempts.push(result);
      } catch (err) {
        attempts.push({
          ok: false,
          source: 'kit',
          endpoint,
          error: (err && err.message) ? err.message : 'network_error'
        });
      }
    }
  }

  if (_KIT_USE_WORKER_FALLBACK) {
    try {
      const workerResult = await _postKitViaWorker(email, name, attempts);
      if (workerResult.ok) return workerResult;
      // Final fallback: browser form POST (no fetch CORS requirement).
      const formEndpoint = _KIT_FORM_ACTION || (attempts[0] && attempts[0].endpoint) || _KIT_DEFAULT_FORM_ACTION;
      const formResult = _submitKitViaHiddenForm(formEndpoint, email, name);
      if (formResult.ok) return formResult;
      return { ok: false, source: 'kit_multi_worker_form', attempts, worker: workerResult, form: formResult };
    } catch (err) {
      const formEndpoint = _KIT_FORM_ACTION || (attempts[0] && attempts[0].endpoint) || _KIT_DEFAULT_FORM_ACTION;
      const formResult = _submitKitViaHiddenForm(formEndpoint, email, name);
      if (formResult.ok) return formResult;
      return {
        ok: false,
        source: 'kit_multi_worker_form',
        attempts,
        worker: {
          ok: false,
          source: 'worker',
          endpoint: _KIT_WORKER_ENDPOINTS[0] || _KIT_WORKER_ENDPOINT,
          error: (err && err.message) ? err.message : 'network_error'
        },
        form: formResult
      };
    }
  }

  return { ok: false, source: 'kit_multi', attempts };
}

async function _collectUser(name, email) {
  // Send email to Kit for marketing list.
  let kitResult = { ok: true, skipped: true };
  if (email) kitResult = await sendEmailToKit(email, name);
  // Analytics event only — no PII sent
  _track('user_identified');
  return kitResult;
}

// Explicit globals for inline onclick usage and Safari/WebKit scope quirks.
if (typeof window !== 'undefined') {
  const _collectUserImpl = _collectUser;
  window._collectUser = async function(name, email) {
    return _collectUserImpl(name, email);
  };
  window.sendEmailToKit = sendEmailToKit;
  window.submitCollect = submitCollect;
  window.submitEmailResults = submitEmailResults;
}

function _formatKitError(kitResult) {
  if (!kitResult || kitResult.ok) return '';
  if (kitResult.skipped) return '';
  if (kitResult.source === 'kit_config') {
    return kitResult.hint || kitResult.detail || 'Kit not configured';
  }
  if (kitResult.source === 'kit') {
    const endpoint = kitResult.endpoint ? kitResult.endpoint.replace(/^https?:\/\//, '') : 'kit endpoint';
    return `${endpoint} (${kitResult.status || kitResult.error || kitResult.detail || 'failed'})`;
  }
  if (kitResult.source === 'kit_multi' && Array.isArray(kitResult.attempts)) {
    return kitResult.attempts.map(a => {
      const endpoint = a.endpoint ? a.endpoint.replace(/^https?:\/\//, '') : 'kit endpoint';
      const detail = a.status || a.error || a.detail || 'failed';
      return `${endpoint} (${detail})`;
    }).join('; ');
  }
  if (kitResult.source === 'worker') {
    const endpoint = kitResult.endpoint ? kitResult.endpoint.replace(/^https?:\/\//, '') : 'worker endpoint';
    return `${endpoint} (${kitResult.status || kitResult.error || kitResult.detail || 'failed'})`;
  }
  if (kitResult.source === 'kit_multi_worker') {
    const direct = Array.isArray(kitResult.attempts)
      ? kitResult.attempts.map(a => {
          const endpoint = a.endpoint ? a.endpoint.replace(/^https?:\/\//, '') : 'kit endpoint';
          const detail = a.status || a.error || a.detail || 'failed';
          return `${endpoint} (${detail})`;
        }).join('; ')
      : '';
    const worker = kitResult.worker
      ? (() => {
          const endpoint = kitResult.worker.endpoint ? kitResult.worker.endpoint.replace(/^https?:\/\//, '') : 'worker endpoint';
          const detail = kitResult.worker.status || kitResult.worker.error || kitResult.worker.detail || 'failed';
          return `${endpoint} (${detail})`;
        })()
      : '';
    return [direct, worker].filter(Boolean).join('; ');
  }
  if (kitResult.source === 'form_post') {
    const endpoint = kitResult.endpoint ? kitResult.endpoint.replace(/^https?:\/\//, '') : 'form endpoint';
    return `${endpoint} (${kitResult.status || kitResult.error || kitResult.detail || 'submitted'})`;
  }
  if (kitResult.source === 'kit_multi_worker_form') {
    const direct = Array.isArray(kitResult.attempts)
      ? kitResult.attempts.map(a => {
          const endpoint = a.endpoint ? a.endpoint.replace(/^https?:\/\//, '') : 'kit endpoint';
          const detail = a.status || a.error || a.detail || 'failed';
          return `${endpoint} (${detail})`;
        }).join('; ')
      : '';
    const worker = kitResult.worker
      ? (() => {
          const endpoint = kitResult.worker.endpoint ? kitResult.worker.endpoint.replace(/^https?:\/\//, '') : 'worker endpoint';
          const detail = kitResult.worker.status || kitResult.worker.error || kitResult.worker.detail || 'failed';
          return `${endpoint} (${detail})`;
        })()
      : '';
    const form = kitResult.form
      ? (() => {
          const endpoint = kitResult.form.endpoint ? kitResult.form.endpoint.replace(/^https?:\/\//, '') : 'form endpoint';
          const detail = kitResult.form.status || kitResult.form.error || kitResult.form.detail || 'submitted';
          return `${endpoint} (${detail})`;
        })()
      : '';
    return [direct, worker, form].filter(Boolean).join('; ');
  }
  return kitResult.error || kitResult.detail || 'Kit request failed';
}

// ======== EMAIL RESULTS MODAL ========
function openEmailModal() {
  const nameEl  = document.getElementById('emailModalName');
  const emailEl = document.getElementById('emailModalAddress');
  if (state.userName)  nameEl.value  = state.userName;
  if (state.userEmail) emailEl.value = state.userEmail;
  const successTitle = document.querySelector('#emailSuccess h4');
  const successBody  = document.querySelector('#emailSuccess p');
  if (successTitle) successTitle.textContent = 'Got it, thanks';
  if (successBody)  successBody.textContent = 'We\'ll let you know when there\'s something worth sharing. In the meantime, consider booking with a physio if you haven\'t already.';
  _setEmailModalMessage('');
  document.getElementById('emailFormBody').style.display = 'block';
  document.getElementById('emailSuccess').classList.remove('show');
  _openModal('emailOverlay', '.email-modal');
}

function closeEmailModal() {
  _closeModal('emailOverlay');
}

function openAbout() {
  initAboutOverlayClose();
  _openModal('aboutOverlay', '.about-modal');
}

function closeAbout() {
  _closeModal('aboutOverlay');
}

function initAboutOverlayClose() {
  const el = document.getElementById('aboutOverlay');
  if (!el || el.dataset.boundClose === '1') return;
  el.addEventListener('click', function(e) {
    if (e.target === el) closeAbout();
  });
  el.dataset.boundClose = '1';
}


function _setEmailModalMessage(msg, isError) {
  let el = document.getElementById('emailModalInlineMsg');
  if (!el) {
    el = document.createElement('p');
    el.id = 'emailModalInlineMsg';
    el.style.cssText = 'font-family:DM Sans,sans-serif;font-size:0.7rem;line-height:1.5;margin:4px 0 14px;';
    const btnRow = document.querySelector('#emailFormBody .email-modal-btns');
    if (btnRow && btnRow.parentNode) btnRow.parentNode.insertBefore(el, btnRow);
  }
  if (!el) return;
  if (!msg) {
    el.textContent = '';
    el.style.display = 'none';
    return;
  }
  el.textContent = msg;
  el.style.display = 'block';
  el.style.color = isError ? 'var(--negative)' : 'var(--muted)';
}

async function submitEmailResults() {
  const name  = document.getElementById('emailModalName').value.trim();
  const email = document.getElementById('emailModalAddress').value.trim();
  const emailEl = document.getElementById('emailModalAddress');
  const hasEmail = email.length > 0;
  const submitBtn = document.getElementById('emailModalSubmitBtn');
  const originalLabel = submitBtn ? submitBtn.textContent : 'Save details →';

  _setEmailModalMessage('');

  if (hasEmail && !_isValidEmail(email)) {
    const el = document.getElementById('emailModalAddress');
    el.style.borderBottomColor = 'var(--negative)';
    el.focus();
    _setEmailModalMessage('Enter a valid email address, or leave email blank.', true);
    setTimeout(() => el.style.borderBottomColor = '', 2000);
    return;
  }

  // Optional flow: if both fields are empty, treat as skip.
  if (!name && !email) {
    closeEmailModal();
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
  }

  try {
    const collectUserFn = _resolveCollectUserFn();
    const kitResult = await collectUserFn(name, email);
    if (hasEmail && !kitResult.ok) {
      if (emailEl) emailEl.style.borderBottomColor = 'var(--negative)';
      const errMsg = _formatKitError(kitResult);
      const fullMsg = errMsg
        ? `Could not subscribe this email right now (${errMsg}). Please try again.`
        : 'Could not subscribe this email right now. Please try again.';
      _setEmailModalMessage(fullMsg, true);
      console.error('Kit subscribe failed (modal flow):', kitResult);
      return;
    }
    if (hasEmail && kitResult.ok) console.info('Kit subscribe success (modal flow):', kitResult);

    state.userName = name || state.userName;
    state.userEmail = email || state.userEmail;
    saveContactToStorage();

    const successTitle = document.querySelector('#emailSuccess h4');
    const successBody  = document.querySelector('#emailSuccess p');
    if (hasEmail) {
      if (successTitle) successTitle.textContent = 'Subscribed';
      if (successBody)  successBody.textContent = 'Thanks — you\'ll receive product updates and early-access notices at this email.';
    } else {
      if (successTitle) successTitle.textContent = 'Details saved';
      if (successBody)  successBody.textContent = 'Name saved. Add an email later if you want product updates.';
    }

    if (emailEl) emailEl.style.borderBottomColor = '';
    document.getElementById('emailFormBody').style.display = 'none';
    document.getElementById('emailSuccess').classList.add('show');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  }
}

// Close modals on overlay click
{
  const emailOverlayEl = document.getElementById('emailOverlay');
  if (emailOverlayEl) {
    emailOverlayEl.addEventListener('click', function(e) {
      if (e.target === this) closeEmailModal();
    });
  }
}

// ======== ROLE / MODE ========
function selectRole(role) {
  state.mode = role;

  // Show progress bar
  const progressBarEl = document.getElementById('progressBar');
  if (progressBarEl) {
    progressBarEl.style.display = 'flex';
    progressBarEl.classList.toggle('patient-mode', role === 'patient');
  }
  document.getElementById('startOverBtn').style.display = 'inline-block';

  const isPatient = role === 'patient';

  // Update step dots visibility — hide obj/tests steps for patient
  document.getElementById('stepDot6').style.display = isPatient ? 'none' : 'flex';
  document.getElementById('stepDot7').style.display = isPatient ? 'none' : 'flex';

  // Update clinician-only abbr visibility
  document.querySelectorAll('.clinician-only').forEach(el => {
    el.style.display = isPatient ? 'none' : 'block';
  });
  const painMap = document.getElementById('painMap');
  if (painMap) painMap.style.display = isPatient ? 'block' : 'none';

  // Update page copy to match mode
  if (isPatient) {
    document.getElementById('page1Title').textContent = 'Where does it hurt?';
    document.getElementById('page1Sub').textContent = 'Tap the area of your body that\'s bothering you most.';
    document.getElementById('page2Title').textContent = 'A little about you';
    document.getElementById('page2Sub').textContent = 'Your age and sex help us give you more relevant information about what might be going on.';
    document.getElementById('durationTitle').textContent = 'How long has this been going on?';
    document.getElementById('durationSub').textContent = 'Even a rough idea helps — pick the closest option.';
    document.getElementById('ageLabel').textContent = 'Your Age';
    document.getElementById('page3Title').textContent = 'What are you feeling?';
    document.getElementById('page3Sub').textContent = 'Pick everything that sounds like your pain or discomfort. No need to be exact — go with what feels closest.';
    document.getElementById('page4Title').textContent = 'What makes it worse?';
    document.getElementById('page4Sub').textContent = 'Select anything that tends to bring on your pain or make it flare up.';
    document.getElementById('page5Title').textContent = 'What gives you relief?';
    document.getElementById('page5Sub').textContent = 'Select anything that helps ease the pain, even a little.';
    document.getElementById('page5Next').onclick = () => { buildResults(); goTo(8); };
    document.getElementById('page5Next').textContent = 'Show me results →';
    document.getElementById('page8Title').textContent = 'Here\'s what we found';
    document.getElementById('page8Sub').textContent = 'Based on what you\'ve shared. Remember — this is a guide, not a diagnosis.';
    document.getElementById('resultsDisclaimer').innerHTML = '<strong>This is a guide, not a diagnosis.</strong> EIDOS helps you understand your symptoms and have better conversations with your physio or doctor. It doesn\'t replace a proper clinical assessment — please see a qualified professional if your pain is severe or not improving.';
  } else {
    document.getElementById('page1Title').textContent = 'Select Region';
    document.getElementById('page1Sub').textContent = 'Which body region is being evaluated?';
    document.getElementById('page2Title').textContent = 'Patient Information';
    document.getElementById('page2Sub').textContent = 'Age and biological sex influence differential diagnosis likelihood based on population epidemiology.';
    document.getElementById('ageLabel').textContent = 'Patient Age (years)';
    document.getElementById('page3Title').textContent = 'Symptom Profile';
    document.getElementById('page3Sub').textContent = 'Select all symptoms the patient reports, or type additional ones below.';
    document.getElementById('page4Title').textContent = 'Aggravating Factors';
    document.getElementById('page4Sub').textContent = 'What activities or positions worsen the patient\'s symptoms?';
    document.getElementById('page5Title').textContent = 'Alleviating Factors';
    document.getElementById('page5Sub').textContent = 'What provides the patient relief?';
    document.getElementById('page5Next').onclick = () => goTo(6);
    document.getElementById('page5Next').textContent = 'Next →';
    document.getElementById('page8Title').textContent = 'Clinical Impression';
    document.getElementById('page8Sub').textContent = 'Based on the subjective and objective data collected.';
    document.getElementById('resultsDisclaimer').innerHTML = '<strong>Clinical Decision Support Only —</strong> This tool is not a diagnostic instrument. Results are intended to support clinical reasoning by a licensed physical therapist and do not constitute a medical diagnosis.';
  }

  goTo(1);
}

// ======== NAVIGATION ========
let _currentPage = 0;

function syncHeaderPostCollect() {
  const onHome = !!document.getElementById('page0')?.classList.contains('active');
  const onCollect = !!document.getElementById('pageCollect')?.classList.contains('active');
  const hideHeaderMeta = !!state._collectComplete && !onHome && !onCollect;
  document.body.classList.toggle('header-post-collect', hideHeaderMeta);
}

function goTo(n) {
  if (n === 0) { /* allow — landing page */ }
  else if (n === 1) { /* allow */ }
  else if (n === 2 && !state.area) { _showToast('Please select a region first.'); return; }

  const direction = (n === 0) ? 'none' : n >= _currentPage ? 'fwd' : 'back';

  // Collect data on leaving pages — always, in both directions
  if (_currentPage === 3) {
    state.symptoms = getSelectedChips('symptomChips');
    state.symptomText = document.getElementById('symptomText').value;
  }
  if (_currentPage === 4) {
    state.agg = getSelectedChips('aggChips');
    state.aggText = document.getElementById('aggText').value;
  }
  if (_currentPage === 5) {
    state.alle = getSelectedChips('alleChips');
    state.alleText = document.getElementById('alleText').value;
  }
  if (_currentPage === 6) {
    state.objective = collectObjectiveInputs();
  }
  if (_currentPage === 7) {
    state.specialTests = collectSpecialTests();
  }

  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active','slide-fwd','slide-back');
  });

  const nextPage = document.getElementById('page' + n);
  if (!nextPage) return;
  nextPage.classList.add('active');
  if (direction !== 'none') nextPage.classList.add(direction === 'fwd' ? 'slide-fwd' : 'slide-back');

  // Re-populate chips from state when navigating back
  // Clear pending restore timers to prevent race conditions on rapid navigation
  if (window._restoreTimers) window._restoreTimers.forEach(clearTimeout);
  window._restoreTimers = [];
  if (n === 3) {
    if (state.symptoms && state.symptoms.size > 0) window._restoreTimers.push(setTimeout(() => restoreChips('symptomChips', state.symptoms), 0));
    if (state.symptomText) window._restoreTimers.push(setTimeout(() => { const el = document.getElementById('symptomText'); if (el) el.value = state.symptomText; }, 0));
  }
  if (n === 4) {
    if (state.agg && state.agg.size > 0) window._restoreTimers.push(setTimeout(() => restoreChips('aggChips', state.agg), 0));
    if (state.aggText) window._restoreTimers.push(setTimeout(() => { const el = document.getElementById('aggText'); if (el) el.value = state.aggText; }, 0));
  }
  if (n === 5) {
    if (state.alle && state.alle.size > 0) window._restoreTimers.push(setTimeout(() => restoreChips('alleChips', state.alle), 0));
    if (state.alleText) window._restoreTimers.push(setTimeout(() => { const el = document.getElementById('alleText'); if (el) el.value = state.alleText; }, 0));
  }
  if (n === 6 && state.objective) {
    window._restoreTimers.push(setTimeout(() => restoreObjectiveInputs(state.objective), 0));
  }

  // Re-run interim results if navigating back to 7 then forward again
  if (n === 7) {
    setTimeout(() => buildInterimResults(), 50);
  }

  _currentPage = n;
  setUIRoute('split');
  setLastPageId('page' + n);
  try {
    if (state && state.mode) sessionStorage.setItem(EIDOS_LAST_MODE_KEY, state.mode);
  } catch (_) {}

  // Hide progress bar on landing
  const progressBarEl = document.getElementById('progressBar');
  if (progressBarEl) progressBarEl.style.display = n === 0 ? 'none' : 'flex';
  const startOverBtnEl = document.getElementById('startOverBtn');
  if (startOverBtnEl) startOverBtnEl.style.display = n === 0 ? 'none' : 'inline-block';

  // In patient mode, hide clinician-only steps and remap Results to visual step 6.
  const isPatient = state.mode === 'patient';
  const toVisualStep = (step) => {
    if (!isPatient) return step;
    if (step === 8) return 6;
    if (step === 6 || step === 7) return 6;
    return step;
  };
  const displayStep = toVisualStep(n);

  document.querySelectorAll('.step-dot').forEach(d => {
    const s = parseInt(d.dataset.step);
    const visualS = toVisualStep(s);
    d.classList.remove('active', 'done');
    if (visualS < displayStep) d.classList.add('done');
    if (visualS === displayStep) d.classList.add('active');
  });

  // Show chip selection counts on done steps
  updateStepCounts();

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: (coarsePointer || reduceMotion) ? 'auto' : 'smooth' });
  syncHeaderPostCollect();
  saveToStorage();
}

function updateStepCounts() {
  // For the current page, count live chip selections; for others use saved state
  const liveCounts = {
    3: _currentPage === 3 ? document.querySelectorAll('#symptomChips .chip.selected').length : (state.symptoms ? state.symptoms.size : 0),
    4: _currentPage === 4 ? document.querySelectorAll('#aggChips .chip.selected').length : (state.agg ? state.agg.size : 0),
    5: _currentPage === 5 ? document.querySelectorAll('#alleChips .chip.selected').length : (state.alle ? state.alle.size : 0),
  };
  const counts = liveCounts;
  const isPatient = state.mode === 'patient';
  const toVisualStep = (step) => {
    if (!isPatient) return step;
    if (step === 8) return 6;
    if (step === 6 || step === 7) return 6;
    return step;
  };
  document.querySelectorAll('.step-dot').forEach(d => {
    const s = parseInt(d.dataset.step);
    const visualS = toVisualStep(s);
    const circle = d.querySelector('.dot-circle');
    if (!circle) return;
    if (d.classList.contains('done') && counts[s] !== undefined && counts[s] > 0) {
      circle.textContent = counts[s];
      circle.title = counts[s] + ' selected';
    } else if (d.classList.contains('done') && counts[s] !== undefined) {
      circle.textContent = '✓';
    } else {
      circle.textContent = visualS;
    }
  });
}

function restoreChips(containerId, savedSet) {
  if (!savedSet || savedSet.size === 0) return;
  document.querySelectorAll('#' + containerId + ' .chip').forEach(btn => {
    if (savedSet.has(btn.textContent)) {
      btn.classList.add('selected');
    }
  });
}


function validateAndGoTo3() {
  const ageEl = document.getElementById('patientAge');
  const ageRaw = ageEl ? ageEl.value.trim() : '';

  if (ageRaw) {
    const age = parseInt(ageRaw, 10);
    if (!age || age < 5 || age > 110) {
      ageEl.style.borderBottomColor = 'var(--negative)';
      ageEl.placeholder = 'Please enter a valid age (5–110)';
      ageEl.focus();
      setTimeout(() => {
        ageEl.style.borderBottomColor = '';
        ageEl.placeholder = 'e.g. 42';
      }, 2500);
      return;
    }
    state.age = age;
  } else {
    state.age = null;
  }

  // Duration is optional — nudge but don't block
  const durHint = document.getElementById('durationHint');
  if (!state.duration && durHint) {
    durHint.style.opacity = '1';
    setTimeout(() => { if (durHint) durHint.style.opacity = '0'; }, 2500);
  }
  goTo(3);
}

// ======== COPY SUMMARY ========
function copySummary() {
  const area = (state.area || 'unknown').charAt(0).toUpperCase() + (state.area || '').slice(1);
  const mode = state.mode === 'clinician' ? 'Clinician' : 'Patient';
  const date = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

  // Gather top results from DOM
  const cards = document.querySelectorAll('#ddxResults .ddx-card h3');
  const likelihoods = document.querySelectorAll('#ddxResults .likelihood');
  let ddxLines = '';
  cards.forEach((h, i) => {
    const lk = likelihoods[i] ? likelihoods[i].textContent : '';
    ddxLines += `  ${i+1}. ${h.textContent.trim()}${lk ? ' — ' + lk : ''}\n`;
  });

  // Red flags
  const flagged = state._rfFlagged && state._rfFlagged.size > 0
    ? [...state._rfFlagged].map(i => RED_FLAGS[i].label).join(', ')
    : 'None identified';

  // Special tests — read from state (persisted on page 7 departure)
  const _stateTests = state.specialTests && Object.keys(state.specialTests).length > 0 ? state.specialTests : collectSpecialTests();
  const testLines = Object.keys(_stateTests).length > 0
    ? Object.entries(_stateTests).map(([k,v]) => `  ${k}: ${v === '+' ? 'Positive' : 'Negative'}`).join('\n')
    : '  Not recorded';

  const summary = `EIDOS — Clinical Summary
Generated: ${date} | Mode: ${mode} | Region: ${area}
Patient: Age ${state.age || '—'}, ${state.sex || '—'}
${'─'.repeat(48)}
RED FLAGS
  ${flagged}

SYMPTOMS
  ${[...state.symptoms].join(', ') || 'None recorded'}${state.symptomText ? '\n  Free text: ' + state.symptomText : ''}

AGGRAVATING FACTORS
  ${[...state.agg].join(', ') || 'None recorded'}${state.aggText ? '\n  Free text: ' + state.aggText : ''}

ALLEVIATING FACTORS
  ${[...state.alle].join(', ') || 'None recorded'}${state.alleText ? '\n  Free text: ' + state.alleText : ''}

SPECIAL TESTS
${testLines}

DIFFERENTIAL DIAGNOSES
${ddxLines || '  No results generated'}
${'─'.repeat(48)}
Clinical Decision Support Only — not a medical diagnosis.
EIDOS | eidos.health`;

  const btn = document.getElementById('copyBtn');
  const origText = btn ? btn.textContent : '';

  const _showCopied = () => {
    if (!btn) return;
    btn.textContent = 'Copied ✓';
    btn.style.borderColor = 'var(--positive)';
    btn.style.color = 'var(--positive)';
    setTimeout(() => {
      btn.textContent = origText;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2200);
  };

  const _showFailed = () => {
    if (!btn) return;
    btn.textContent = 'Copy failed — try selecting manually';
    btn.style.borderColor = 'var(--negative)';
    btn.style.color = 'var(--negative)';
    setTimeout(() => {
      btn.textContent = origText;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 3000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(summary).then(_showCopied).catch(_showFailed);
  } else {
    // Graceful fallback for non-secure contexts (note: execCommand is deprecated
    // but included as a last resort; failure is surfaced to the user)
    try {
      const ta = document.createElement('textarea');
      ta.value = summary;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) { _showCopied(); } else { _showFailed(); }
    } catch(e) {
      _showFailed();
    }
  }
}

function resetAll() {
  _currentPage = 0;
  state.mode = null;
  state.userName = '';
  state.userEmail = '';
  state._collectTarget = 'patient';
  state._collectComplete = false;
  state.area = null;
  state.duration = null;
  state.age = null;
  state.sex = null;
  state.slrRight = null;
  state.slrLeft = null;
  state.slrFlag = null;
  state.symptoms = new Set();
  state.symptomText = '';
  state.agg = new Set();
  state.aggText = '';
  state.alle = new Set();
  state.alleText = '';
  state.objective = {};
  state.specialTests = {};
  state._rfFlagged = new Set();
  const ageEl = document.getElementById('patientAge');
  if (ageEl) ageEl.value = '';
  const _stEl = document.getElementById('symptomText'); if (_stEl) _stEl.value = '';
  const _agEl = document.getElementById('aggText'); if (_agEl) _agEl.value = '';
  const _alEl = document.getElementById('alleText'); if (_alEl) _alEl.value = '';
  document.querySelectorAll('#sexChips .chip').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('#durationChips .chip').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.chip').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.area-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('ddxResults').innerHTML = '';
  document.getElementById('recSection').innerHTML = '';
  document.getElementById('eduSection').innerHTML = '';
  document.getElementById('exSection').innerHTML = '';
  const _pf = document.getElementById('patientFooter'); if (_pf) _pf.innerHTML = '';
  // Show/restore clinician-only elements
  document.querySelectorAll('.clinician-only').forEach(el => el.style.display = '');
  const painMap = document.getElementById('painMap');
  if (painMap) painMap.style.display = 'none';
  const areaGrid = document.getElementById('areaGrid');
  if (areaGrid) areaGrid.style.display = 'grid';
  clearPainSelection();
  syncPainMapSelection(null);
  document.getElementById('stepDot6').style.display = 'flex';
  document.getElementById('stepDot7').style.display = 'flex';
  document.getElementById('progressBar').style.display = 'none';
  document.getElementById('startOverBtn').style.display = 'none';
  goTo(0);
  sessionStorage.removeItem('eidos_state');
  sessionStorage.removeItem('eidos_csState');
  sessionStorage.removeItem(EIDOS_CONTACT_KEY);
  sessionStorage.removeItem(CS_CHALLENGE_SESSION_STORAGE_KEY);
  csResetChallengeContext({ clearRoute: true });
  // Return to homepage
  const container = document.querySelector('.container');
  if (container) container.style.display = 'none';
  showHomePage();
}

// ══════════════════════════════════════════════════════════════════════════
// CLINICIAN GATEWAY
// ══════════════════════════════════════════════════════════════════════════

function openClinicianGateway() {
  document.getElementById('cgOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function openPatientTrack() {
  goToCollect('patient_redflags');
}
function openClinicianStudent() {
  goToCollect('clinician_gateway');
}
function closeCGOverlay() {
  document.getElementById('cgOverlay').classList.remove('active');
  document.body.style.overflow = '';
  syncHeaderPostCollect();
}
function startEvaluation() {
  closeCGOverlay();
  openRedFlags('clinician');
}
function startCaseStudies() {
  closeCGOverlay();
  document.body.style.overflow = '';
  csResetChallengeContext({ preserveOwnerLinks: true, clearRoute: true });
  csState.active = true;
  setUIRoute('split');
  // Show progress bar / start-over for case study mode
  document.getElementById('progressBar').style.display = 'none';
  document.getElementById('startOverBtn').style.display = 'none';
  csGoTo('pagCS0');
  csRefreshCasePoolStatus();
}
function closeCaseStudies() {
  csState.active = false;
  csResetChallengeContext({ preserveOwnerLinks: true, clearRoute: true });
  // Return to landing
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active','slide-fwd','slide-back'));
  document.getElementById('page0').classList.add('active');
  setUIRoute('split');
  syncHeaderPostCollect();
}

// ══════════════════════════════════════════════════════════════════════════
// CASE STUDY STATE
// ══════════════════════════════════════════════════════════════════════════

const csState = {
  active: false,
  level: null,           // 'beginner' | 'intermediate' | 'advanced'
  caseIndex: 0,
  case: null,            // current CASE_DATA entry
  tokensTotal: 8,
  tokensUsed: 0,
  revealed: [],          // [{category, name, result, valence}]
  ddx1: '', ddx2: '', ddx3: '',
  reasoning1: '',
  updDdx1: '', updDdx2: '', updDdx3: '',
  reasoning2: '',
  finalDx: '',
  finalReasoning: '',
  management: '',
  imagingSuggestion: '',
  confidence: 50,
  redFlags: [],
  filterRegion: 'all',
  filterLevel: 'any',
  examRowOrder: {},
  examRowOrderCaseKey: '',
  attemptSummary: null,
  lastScoreResult: null,
};

const CS_CHALLENGE_ROUTE_PARAM = 'challenge';
const CS_OWNER_LINKS_STORAGE_KEY = 'eidos_cs_owner_links_v1';
const CS_CHALLENGE_SESSION_STORAGE_KEY = 'eidos_cs_challenge_state_v1';
const CS_CHALLENGE_API_ENDPOINTS = ['/challenge', '/functions/challenge', '/api/challenge', '/.netlify/functions/challenge'];
let csChallengeApiPreferredEndpoint = '';

const csChallengeState = {
  mode: 'none',                // 'none' | 'invitee' | 'owner'
  token: '',
  inviteId: '',
  ownerAccessKey: '',
  originalAttempt: null,
  invitedAttempt: null,
  comparison: null,
  shareUrl: '',
  createdAt: '',
  pending: false,
  caseSnapshot: null,
};

function csGetChallengeApiCandidates() {
  const preferred = String(csChallengeApiPreferredEndpoint || '').trim();
  if (!preferred) return CS_CHALLENGE_API_ENDPOINTS.slice();
  return [preferred].concat(CS_CHALLENGE_API_ENDPOINTS.filter((endpoint) => endpoint !== preferred));
}

function csShouldRetryChallengeEndpoint(err) {
  const code = String((err && err.message) || '');
  if (!code) return false;
  if (code === 'challenge_timeout') return true;
  if (code === 'challenge_invalid_response') return true;
  if (/^challenge_(post|get)_(404|405|500|502|503)$/.test(code)) return true;
  if (code.includes('Failed to fetch') || code.includes('NetworkError') || code.includes('Load failed')) return true;
  if (code === 'challenge_unavailable') return true;
  return false;
}

function csIsChallengeJsonResponse(response, data) {
  const contentType = String(response && response.headers && response.headers.get('content-type') || '').toLowerCase();
  if (!contentType.includes('application/json')) return false;
  if (!data || typeof data !== 'object') return false;
  if (Array.isArray(data)) return false;
  if (!Object.keys(data).length) return false;
  return true;
}

// ══════════════════════════════════════════════════════════════════════════
// CASE LIBRARY (loaded from cases/case-library.js)
// ══════════════════════════════════════════════════════════════════════════

const CASE_LIBRARY = (window.EIDOS_CASES && window.EIDOS_CASES.CASE_LIBRARY) || {
  beginner: [],
  intermediate: [],
  advanced: []
};

const CS_SEEN_CASES_STORAGE_KEY = 'eidos_cs_seen_cases_by_filter_v1';

function csSetFilter(type, val, btnEl) {
  if (type === 'region') {
    csState.filterRegion = val;
    document.querySelectorAll('#csRegionChips .chip').forEach(c => c.classList.remove('selected'));
  } else {
    csState.filterLevel = val;
    document.querySelectorAll('#csLevelChips .chip').forEach(c => c.classList.remove('selected'));
  }
  if (btnEl && btnEl.classList) btnEl.classList.add('selected');
  csRefreshCasePoolStatus();
}

function csCaseHasRenderableVignette(caseObj) {
  if (!caseObj || typeof caseObj !== 'object') return false;
  const html = String(caseObj.vignette || '');
  if (!html.trim()) return false;
  const plain = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length >= 12;
}

function csBuildFilterPoolKey(region, level) {
  const normRegion = String(region || 'all').trim().toLowerCase() || 'all';
  const normLevel = String(level || 'any').trim().toLowerCase() || 'any';
  return `region:${normRegion}|level:${normLevel}`;
}

function csReadSeenCaseStore() {
  try {
    const raw = localStorage.getItem(CS_SEEN_CASES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  } catch (_) {
    return {};
  }
}

function csWriteSeenCaseStore(store) {
  try {
    localStorage.setItem(CS_SEEN_CASES_STORAGE_KEY, JSON.stringify(store || {}));
  } catch (_) {}
}

function csGetSeenCaseSet(filterKey) {
  const store = csReadSeenCaseStore();
  const arr = Array.isArray(store[filterKey]) ? store[filterKey] : [];
  return new Set(arr.map(v => String(v || '')).filter(Boolean));
}

function csSetSeenCaseSet(filterKey, seenSet) {
  const store = csReadSeenCaseStore();
  store[filterKey] = Array.from(seenSet || []).map(v => String(v || '')).filter(Boolean);
  csWriteSeenCaseStore(store);
}

function csBuildFilteredCasePool(region = csState.filterRegion, level = csState.filterLevel) {
  const selectedLevel = String(level || 'any').toLowerCase();
  const selectedRegion = String(region || 'all').trim();
  const regionNeedle = selectedRegion.toLowerCase();
  const levels = selectedLevel === 'any' ? ['beginner', 'intermediate', 'advanced'] : [selectedLevel];
  const pool = [];

  levels.forEach((lvl) => {
    const cases = Array.isArray(CASE_LIBRARY[lvl]) ? CASE_LIBRARY[lvl] : [];
    cases.forEach((c) => {
      if (!c || typeof c !== 'object') return;
      const regionLabel = String(c.region || '').trim();
      if (!regionLabel) return;
      const regionMatch = selectedRegion === 'all' || regionLabel.toLowerCase().includes(regionNeedle);
      if (!regionMatch) return;
      pool.push(Object.assign({}, c, { _level: lvl }));
    });
  });

  const renderablePool = pool.filter(csCaseHasRenderableVignette);
  const sourcePool = renderablePool.length ? renderablePool : pool;
  const filterKey = csBuildFilterPoolKey(selectedRegion, selectedLevel);
  return {
    filterKey,
    selectedRegion,
    selectedLevel,
    pool: sourcePool
  };
}

function csCasePoolProgress(region = csState.filterRegion, level = csState.filterLevel) {
  const state = csBuildFilteredCasePool(region, level);
  const seenSet = csGetSeenCaseSet(state.filterKey);
  const idsInPool = state.pool.map(c => `${String(c._level || '').toLowerCase()}:${String(c.id || c.title || '').trim()}`);
  const completed = idsInPool.reduce((acc, id) => acc + (seenSet.has(id) ? 1 : 0), 0);
  const total = state.pool.length;
  return {
    ...state,
    total,
    completed,
    remaining: Math.max(0, total - completed),
    exhausted: total > 0 && completed >= total
  };
}

function csRefreshCasePoolStatus() {
  const statusEl = document.getElementById('csPoolStatus');
  const progressEl = document.getElementById('csPoolProgress');
  const emptyEl = document.getElementById('csPoolEmptyMsg');
  const startBtn = document.getElementById('csStartRandomBtn');
  if (!statusEl && !progressEl && !emptyEl && !startBtn) return;

  const progress = csCasePoolProgress();
  const total = progress.total;

  if (statusEl) {
    statusEl.textContent = total === 0
      ? '0 matching cases available'
      : `${total} matching case${total === 1 ? '' : 's'} available`;
  }

  if (total === 0) {
    if (progressEl) progressEl.textContent = '';
    if (emptyEl) emptyEl.textContent = 'No cases match your selected filters. Try Any Region or Any Level.';
    if (startBtn) startBtn.disabled = true;
    return;
  }

  if (progressEl) {
    progressEl.textContent = `${progress.completed} of ${total} completed`;
  }
  if (emptyEl) {
    emptyEl.textContent = progress.exhausted
      ? 'You have completed this pool. Starting another random case will reset and recycle this pool.'
      : '';
  }
  if (startBtn) startBtn.disabled = false;
}

function csStartFilteredCase() {
  try {
    try { csResetChallengeContext({ preserveOwnerLinks: true, clearRoute: true }); } catch (_) {}

    const poolState = csCasePoolProgress();
    if (!poolState.total) {
      csRefreshCasePoolStatus();
      _showToast('No matching cases found. Try Any Region / Any Level and retry.');
      return;
    }

    let seenSet = csGetSeenCaseSet(poolState.filterKey);
    let unseenPool = poolState.pool.filter((caseObj) => {
      const caseKey = `${String(caseObj._level || '').toLowerCase()}:${String(caseObj.id || caseObj.title || '').trim()}`;
      return !seenSet.has(caseKey);
    });

    if (!unseenPool.length) {
      seenSet = new Set();
      csSetSeenCaseSet(poolState.filterKey, seenSet);
      unseenPool = poolState.pool.slice();
    }

    const randomCase = unseenPool[Math.floor(Math.random() * unseenPool.length)];
    if (!randomCase) {
      csRefreshCasePoolStatus();
      _showToast('No matching cases found. Try Any Region / Any Level and retry.');
      return;
    }

    const pickedLevel = String(randomCase._level || csState.level || 'beginner').toLowerCase();
    const caseKey = `${pickedLevel}:${String(randomCase.id || randomCase.title || '').trim()}`;
    seenSet.add(caseKey);
    csSetSeenCaseSet(poolState.filterKey, seenSet);

    csState.case = randomCase;
    csState.level = pickedLevel;
    csState.tokensTotal = pickedLevel === 'beginner' ? 8 : pickedLevel === 'intermediate' ? 6 : 5;
    csResetSessionData();
    updateDdxDatalistForCase(randomCase);
    csRenderVignette();
    csGoTo('pagCS1');
  } catch (err) {
    console.error('Failed to start random case:', err);
    _showToast('Could not start a case right now. Please refresh once and try again.');
  } finally {
    csRefreshCasePoolStatus();
  }
}

function csResetSessionData() {
  csState.tokensUsed = 0;
  csState.revealed = [];
  csState.ddx1 = ''; csState.ddx2 = ''; csState.ddx3 = '';
  csState.reasoning1 = '';
  csState.updDdx1 = ''; csState.updDdx2 = ''; csState.updDdx3 = '';
  csState.reasoning2 = '';
  csState.finalDx = '';
  csState.finalReasoning = '';
  csState.management = '';
  csState.imagingSuggestion = '';
  csState.confidence = 50;
  csState.redFlags = [];
  csState.aiFeedbackHtml = null;
  csState.redHerringPool = null;
  csState.redHerringWasted = new Set();
  csState.activeExamTab = null;
  csState.examRowOrder = {};
  csState.examRowOrderCaseKey = '';
  csState.attemptSummary = null;
  csState.lastScoreResult = null;
  // Reset inputs
  ['csDdx1','csDdx2','csDdx3','csReasoning1','csUpdDdx1','csUpdDdx2','csUpdDdx3',
   'csReasoning2','csFinalDx','csFinalReasoning','csManagement','csImagingSuggestion'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const confidenceEl = document.getElementById('csConfidence');
  if (confidenceEl) confidenceEl.value = '50';
  csRenderConfidenceLabel();
}

function csInfoDurationFromOnset(onsetText, fallbackDuration) {
  const txt = String(onsetText || '').toLowerCase().replace(/-/g, ' ');
  if (!txt) return fallbackDuration || '';
  const nMatch = txt.match(/(\d+(?:\.\d+)?)/);
  const n = nMatch ? parseFloat(nMatch[1]) : null;
  if (/hour|day|week/.test(txt)) return 'Acute';
  if (/month/.test(txt)) return (n !== null && n <= 3) ? 'Subacute' : 'Chronic';
  if (/year/.test(txt)) return 'Chronic';
  return fallbackDuration || '';
}

function csDeriveInfoFromVignette(vignette, fallbackInfo) {
  const defaults = {
    age: 'Not stated',
    sex: 'Not stated',
    occupation: 'Not specified',
    onset: 'Not stated',
    duration: 'Not stated'
  };
  const out = { ...defaults };
  const isEmptyValue = value => /^(?:not\s*(?:stated|specified|provided|available)|n\/?a|unknown|none)$/i.test(String(value || '').trim());
  const hasValue = value => {
    const txt = String(value || '').trim();
    return !!txt && !isEmptyValue(txt);
  };
  const mergeFallback = src => {
    if (!src || typeof src !== 'object') return;
    Object.keys(defaults).forEach(key => {
      const value = src[key];
      if (hasValue(value)) out[key] = String(value).trim();
    });
  };
  mergeFallback(fallbackInfo);

  const plain = String(vignette || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^\w\s/+\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return out;

  const sentences = (plain.match(/[^.!?]+[.!?]?/g) || [plain]).map(s => s.trim()).filter(Boolean);
  const firstSentence = sentences[0] || plain;
  const introText = sentences.slice(0, 2).join(' ') || plain;

  const ageMatch = plain.match(/\b(\d{1,3})\s*[- ]?\s*year\s*[- ]?\s*old\b/i);
  if (ageMatch) out.age = ageMatch[1];

  const sexMatch = plain.match(/\b(male|female|man|woman)\b/i);
  if (sexMatch) {
    const sx = sexMatch[1].toLowerCase();
    out.sex = (sx === 'female' || sx === 'woman') ? 'Female' : 'Male';
  }

  const timespan = '(?:\\d+(?:\\s*[-–]\\s*\\d+)?\\s*[- ]?\\s*(?:hour|hours|day|days|week|weeks|month|months|year|years))';
  const onsetMatchers = [
    new RegExp(`\\b(${timespan})\\s*(?:'s)?\\s+(?:duration|history)\\b`, 'i'),
    new RegExp(`\\bof\\s+(?:approximately|about|around|roughly)?\\s*(${timespan})\\b`, 'i'),
    new RegExp(`\\b(?:for|over|past|last)\\s+(?:the\\s+)?(?:past\\s+|last\\s+)?(?:approximately|about|around|roughly)?\\s*(${timespan})\\b`, 'i'),
    new RegExp(`\\b(?:started|began|commenced|came on)\\b[^.?!]{0,100}?\\b(${timespan}\\s+ago)\\b`, 'i'),
    new RegExp(`\\b(${timespan}\\s+ago)\\b`, 'i')
  ];
  let onset = '';
  [introText, plain].some(source => onsetMatchers.some(pattern => {
    const match = source.match(pattern);
    if (!match || !match[1]) return false;
    onset = match[1];
    return true;
  }));
  if (onset) {
    out.onset = onset.replace(/[-–]/g, ' ').replace(/\s+/g, ' ').trim();
    out.duration = csInfoDurationFromOnset(out.onset, out.duration);
  } else if (!hasValue(out.duration)) {
    if (/\bsubacute\b/i.test(plain)) out.duration = 'Subacute';
    else if (/\bchronic\b/i.test(plain)) out.duration = 'Chronic';
    else if (/\bacute\b/i.test(plain)) out.duration = 'Acute';
  }

  const cleanOccupation = raw => {
    let occupation = String(raw || '')
      .replace(/^(a|an|the)\s+/i, '')
      .replace(/\b(?:who|that)\b.*$/i, '')
      .replace(/\bwith\b.*$/i, '')
      .replace(/\b(?:presents|arrives|comes|reports|is brought|is seen|attends)\b.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!occupation) return '';
    if (occupation.length < 3 || occupation.length > 90) return '';
    if (/^\d/.test(occupation)) return '';
    if (/\b(?:pain|history|duration|onset|symptom|weeks?|months?|years?|days?|hours?)\b/i.test(occupation)) return '';
    return occupation.charAt(0).toUpperCase() + occupation.slice(1);
  };

  const occPatterns = [
    /\b\d{1,3}\s*[- ]?\s*year\s*[- ]?\s*old\s+(?:(?:male|female|man|woman)\s+)?(.+?)\s+(?:presents|arrives|comes|reports|is brought|is seen|attends)\b/i,
    /\boccupation\s*[:\-]\s*([^.;]+)/i,
    /\bworks as (?:an?|the)\s+([^.,;]+)/i,
    /\bworks in (?:an?|the)?\s*([^.,;]+)/i
  ];
  let occupation = '';
  [firstSentence, plain].some(source => occPatterns.some(pattern => {
    const match = source.match(pattern);
    if (!match || !match[1]) return false;
    const cleaned = cleanOccupation(match[1]);
    if (!cleaned) return false;
    occupation = cleaned;
    return true;
  }));
  if (occupation) out.occupation = occupation;

  return out;
}

function csSoftenDiagnosticLanguage(text) {
  let out = String(text || '');
  if (!out) return out;
  out = out
    .replace(/\bpathognomonic\b/gi, 'highly suggestive')
    .replace(/\brules?\s+out\b/gi, 'makes less likely')
    .replace(/\bruled\s+out\b/gi, 'made less likely')
    .replace(/\bexcluded\b/gi, 'considered less likely')
    .replace(/\bexcludes\b/gi, 'makes less likely')
    .replace(/\bexclude\b/gi, 'consider less likely')
    .replace(/\bconfirms?\b/gi, 'supports')
    .replace(/\bconfirmed\b/gi, 'supported')
    .replace(/\bnot implicated\b/gi, 'less likely to be primary')
    .replace(/\bnot involved\b/gi, 'less likely to be involved')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
  return out;
}

function csSanitizeVignetteHtml(vignetteHtml) {
  let html = String(vignetteHtml || '');
  if (!html) return html;
  html = html
    .replace(/\brequesting urgent medical liaison\b\.?/gi, 'Requesting medical liaison.')
    .replace(/\burgent medical (?:liaison|review|assessment|referral)\b/gi, 'medical follow-up')
    .replace(/\b(?:x-?ray|mri|ct|ultrasound)[^.!?]{0,140}\b(?:confirm(?:s|ed)|show(?:s|ed)|reveal(?:s|ed)|demonstrat(?:es|ed))[^.!?]*[.!?]/gi, 'Imaging had been arranged and was pending clinical correlation.')
    .replace(/\bacutely aware of the likely diagnosis\b/gi, 'very concerned about the severity of the injury');
  return csSoftenDiagnosticLanguage(html);
}

function csRenderVignette() {
  const c = csState.case;
  if (!c) return;
  if (!Array.isArray(c.keyDifferentials)) c.keyDifferentials = [];
  if (!c.info || typeof c.info !== 'object') c.info = {};
  const rawVignette = String(c.vignette || '').trim();
  const derivedInfo = csDeriveInfoFromVignette(rawVignette, c.info || {});
  c.info = {
    age: (derivedInfo && derivedInfo.age) || 'Not stated',
    sex: (derivedInfo && derivedInfo.sex) || 'Not stated',
    occupation: (derivedInfo && derivedInfo.occupation) || 'Not specified',
    onset: (derivedInfo && derivedInfo.onset) || 'Not stated',
    duration: (derivedInfo && derivedInfo.duration) || 'Not stated'
  };
  updateDdxDatalistForCase(c);
  // Info grid
  const grid = document.getElementById('csInfoGrid');
  if (grid) {
    const infoKeys = ['age', 'sex', 'occupation', 'onset', 'duration'];
    grid.innerHTML = infoKeys.map(k => {
      const label = k.charAt(0).toUpperCase() + k.slice(1);
      const value = (c.info && c.info[k]) ? c.info[k] : (k === 'occupation' ? 'Not specified' : 'Not stated');
      return `<div class="cs-info-item"><span class="cs-info-label">${label}</span><span class="cs-info-value">${escapeHtml(csImperializeText(value))}</span></div>`;
    }).join('');
  }
  // Vignette body
  const body = document.getElementById('csVignetteBody');
  if (body) {
    body.innerHTML = rawVignette
      ? csImperializeHtml(csSanitizeVignetteHtml(rawVignette))
      : '<p>Case history unavailable for this scenario.</p>';
  }
  // Subtitle
  const sub = document.getElementById('cs1Sub');
  if (sub) sub.textContent = `${c.region}${c.info && c.info.duration ? ' · ' + c.info.duration : ''} · ${(csState.level||'').charAt(0).toUpperCase()+(csState.level||'').slice(1)} case`;
}

function csDeepClone(value) {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

function csCreateId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function csNormalizeCompareText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function csGetChallengeTokenFromUrl() {
  try {
    const url = new URL(window.location.href);
    return (url.searchParams.get(CS_CHALLENGE_ROUTE_PARAM) || '').trim();
  } catch (_) {
    return '';
  }
}

function csSetChallengeTokenInUrl(token) {
  try {
    const url = new URL(window.location.href);
    if (token) url.searchParams.set(CS_CHALLENGE_ROUTE_PARAM, token);
    else url.searchParams.delete(CS_CHALLENGE_ROUTE_PARAM);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  } catch (_) {}
}

function csReadOwnerLinks() {
  try {
    const raw = localStorage.getItem(CS_OWNER_LINKS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

function csWriteOwnerLinks(payload) {
  try {
    localStorage.setItem(CS_OWNER_LINKS_STORAGE_KEY, JSON.stringify(payload || {}));
  } catch (_) {}
}

function csSaveOwnerLinkRecord(token, record) {
  if (!token || !record) return;
  const all = csReadOwnerLinks();
  all[token] = {
    token,
    owner_access_key: record.owner_access_key || '',
    invite_id: record.invite_id || '',
    share_url: record.share_url || '',
    created_at: record.created_at || '',
    original_attempt_id: record.original_attempt_id || '',
    case_id: record.case_id || '',
  };
  csWriteOwnerLinks(all);
}

function csGetOwnerLinkRecord(token) {
  if (!token) return null;
  const all = csReadOwnerLinks();
  return all[token] || null;
}

function csResetChallengeContext(options) {
  const cfg = options || {};
  csChallengeState.mode = 'none';
  csChallengeState.token = '';
  csChallengeState.inviteId = '';
  csChallengeState.ownerAccessKey = '';
  csChallengeState.originalAttempt = null;
  csChallengeState.invitedAttempt = null;
  csChallengeState.comparison = null;
  csChallengeState.shareUrl = '';
  csChallengeState.createdAt = '';
  csChallengeState.pending = false;
  csChallengeState.caseSnapshot = null;

  const keepRoute = cfg.clearRoute === false;
  if (!keepRoute) csSetChallengeTokenInUrl('');
  csUpdateChallengeControls();
}

function csBuildTopDifferentials() {
  const updated = [csState.updDdx1, csState.updDdx2, csState.updDdx3]
    .map(v => String(v || '').trim())
    .filter(Boolean);
  if (updated.length) return updated;
  return [csState.ddx1, csState.ddx2, csState.ddx3]
    .map(v => String(v || '').trim())
    .filter(Boolean);
}

function csBuildAttemptSummary(includeExpert) {
  const includeExpertReasoning = includeExpert !== false;
  csSaveFieldState();
  const selectedTests = (csState.revealed || []).map(r => ({
    name: r.name || '',
    category: r.category || '',
    result: csNeutralizeSpecialTestResult(r.result, r.category, r.name) || '',
    valence: r.valence || 'neutral',
  }));

  return {
    id: csCreateId(),
    attempt_id: csCreateId(),
    completed_at: new Date().toISOString(),
    top_differentials: csBuildTopDifferentials(),
    selected_tests: selectedTests,
    final_diagnosis: String(csState.finalDx || '').trim(),
    final_conclusion: String(csState.finalReasoning || '').trim(),
    confidence: Math.round(csClampConfidence(csState.confidence)),
    management: String(csState.management || '').trim(),
    imaging_suggestion: String(csState.imagingSuggestion || '').trim(),
    reasoning_initial: String(csState.reasoning1 || '').trim(),
    reasoning_updated: String(csState.reasoning2 || '').trim(),
    expert_reasoning_html: includeExpertReasoning ? (csState.aiFeedbackHtml || '') : '',
  };
}

async function csChallengeApiPost(action, payload) {
  const body = Object.assign({ action }, payload || {});
  let lastErr = null;
  for (const endpoint of csGetChallengeApiCandidates()) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (err && err.name === 'AbortError') {
        lastErr = new Error('challenge_timeout');
      } else {
        lastErr = err;
      }
      if (!csShouldRetryChallengeEndpoint(lastErr)) throw lastErr;
      continue;
    } finally {
      clearTimeout(timer);
    }

    const data = await response.json().catch(() => null);
    if (!csIsChallengeJsonResponse(response, data)) {
      lastErr = new Error('challenge_invalid_response');
      if (!csShouldRetryChallengeEndpoint(lastErr)) throw lastErr;
      continue;
    }
    if (!response.ok || data.ok === false) {
      lastErr = new Error(data.error || `challenge_post_${response.status}`);
      lastErr.data = data;
      if (!csShouldRetryChallengeEndpoint(lastErr)) throw lastErr;
      continue;
    }

    csChallengeApiPreferredEndpoint = endpoint;
    return data;
  }
  throw lastErr || new Error('challenge_unavailable');
}

async function csChallengeApiGetInvite(token) {
  let lastErr = null;
  for (const endpoint of csGetChallengeApiCandidates()) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let response;
    const url = `${endpoint}?token=${encodeURIComponent(token)}`;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (err && err.name === 'AbortError') {
        lastErr = new Error('challenge_timeout');
      } else {
        lastErr = err;
      }
      if (!csShouldRetryChallengeEndpoint(lastErr)) throw lastErr;
      continue;
    } finally {
      clearTimeout(timer);
    }

    const data = await response.json().catch(() => null);
    if (!csIsChallengeJsonResponse(response, data)) {
      lastErr = new Error('challenge_invalid_response');
      if (!csShouldRetryChallengeEndpoint(lastErr)) throw lastErr;
      continue;
    }
    if (!response.ok || data.ok === false) {
      lastErr = new Error(data.error || `challenge_get_${response.status}`);
      lastErr.data = data;
      if (!csShouldRetryChallengeEndpoint(lastErr)) throw lastErr;
      continue;
    }

    csChallengeApiPreferredEndpoint = endpoint;
    return data;
  }
  throw lastErr || new Error('challenge_unavailable');
}

function csSetChallengeLinkUI(shareUrl, metaText) {
  const box = document.getElementById('csChallengeLinkBox');
  const input = document.getElementById('csChallengeLinkInput');
  const meta = document.getElementById('csChallengeLinkMeta');
  if (!box || !input || !meta) return;
  if (!shareUrl) {
    box.hidden = true;
    input.value = '';
    return;
  }
  input.value = shareUrl;
  meta.textContent = metaText || 'Challenge link ready';
  box.hidden = false;
}

function csUpdateChallengeControls() {
  const btn = document.getElementById('csChallengeBtn');
  const helper = document.getElementById('csChallengeHelper');
  if (!btn || !helper) return;

  btn.disabled = !!csChallengeState.pending;
  if (csChallengeState.mode === 'invitee') {
    if (csChallengeState.comparison) {
      btn.textContent = 'View challenge comparison';
      helper.textContent = 'Your submission is complete. Open the side-by-side comparison below.';
    } else {
      btn.textContent = 'Submit challenge attempt';
      helper.textContent = 'Finish your debrief, then submit your attempt to unlock side-by-side comparison.';
    }
    csSetChallengeLinkUI('', '');
    return;
  }

  if (csChallengeState.mode === 'owner' && csChallengeState.token) {
    btn.textContent = 'Check challenge comparison';
    helper.textContent = 'Challenge link created. Share it, then return to check agreement and differences.';
    csSetChallengeLinkUI(
      csChallengeState.shareUrl || `${window.location.origin}${window.location.pathname}?${CS_CHALLENGE_ROUTE_PARAM}=${encodeURIComponent(csChallengeState.token)}`,
      csChallengeState.createdAt ? `Created ${new Date(csChallengeState.createdAt).toLocaleString()}` : 'Challenge link ready'
    );
    return;
  }

  btn.textContent = 'Challenge someone';
  helper.textContent = 'Send this case to a classmate or colleague and compare your reasoning after both of you finish.';
  csSetChallengeLinkUI('', '');
}

function csRenderCompareList(targetId, values, emptyText) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const list = (values || []).filter(Boolean);
  if (!list.length) {
    el.innerHTML = `<li>${escapeHtml(csImperializeText(emptyText || 'Not provided'))}</li>`;
    return;
  }
  el.innerHTML = list.map(v => `<li>${escapeHtml(csImperializeText(v))}</li>`).join('');
}

function csToTestNames(testRows) {
  return (testRows || [])
    .map(t => t && (t.name || t.test || t.label || ''))
    .map(v => String(v || '').trim())
    .filter(Boolean);
}

function csBuildComparisonPayload(originalAttempt, invitedAttempt) {
  const original = originalAttempt || {};
  const invited = invitedAttempt || {};

  const origDdx = (original.top_differentials || []).map(v => String(v || '').trim()).filter(Boolean);
  const invDdx = (invited.top_differentials || []).map(v => String(v || '').trim()).filter(Boolean);
  const origTests = csToTestNames(original.selected_tests);
  const invTests = csToTestNames(invited.selected_tests);

  const origDdxSet = new Set(origDdx.map(csNormalizeCompareText).filter(Boolean));
  const invDdxSet = new Set(invDdx.map(csNormalizeCompareText).filter(Boolean));
  const origTestSet = new Set(origTests.map(csNormalizeCompareText).filter(Boolean));
  const invTestSet = new Set(invTests.map(csNormalizeCompareText).filter(Boolean));

  const ddxAgreement = origDdx.filter(v => invDdxSet.has(csNormalizeCompareText(v)));
  const ddxOrigOnly = origDdx.filter(v => !invDdxSet.has(csNormalizeCompareText(v)));
  const ddxInvOnly = invDdx.filter(v => !origDdxSet.has(csNormalizeCompareText(v)));
  const testsAgreement = origTests.filter(v => invTestSet.has(csNormalizeCompareText(v)));
  const testsOrigOnly = origTests.filter(v => !invTestSet.has(csNormalizeCompareText(v)));
  const testsInvOnly = invTests.filter(v => !origTestSet.has(csNormalizeCompareText(v)));

  const originalDx = String(original.final_diagnosis || '').trim();
  const invitedDx = String(invited.final_diagnosis || '').trim();
  const diagnosisMatch = originalDx && invitedDx && csNormalizeCompareText(originalDx) === csNormalizeCompareText(invitedDx);

  return {
    original_attempt: original,
    invited_attempt: invited,
    agreement: {
      top_differentials: ddxAgreement,
      selected_tests: testsAgreement,
      diagnosis_match: diagnosisMatch,
    },
    differences: {
      original_only_differentials: ddxOrigOnly,
      invited_only_differentials: ddxInvOnly,
      original_only_tests: testsOrigOnly,
      invited_only_tests: testsInvOnly,
      original_final_diagnosis: originalDx,
      invited_final_diagnosis: invitedDx,
    },
    expert_reasoning_html: original.expert_reasoning_html || '',
  };
}

function csRenderChallengeComparison(comparison) {
  const data = comparison || {};
  const original = data.original_attempt || {};
  const invited = data.invited_attempt || {};
  const agreement = data.agreement || {};
  const differences = data.differences || {};

  const waiting = document.getElementById('csCompareWaiting');
  const grid = document.getElementById('csCompareGrid');
  const agreementWrap = document.getElementById('csCompareAgreementWrap');
  const expertWrap = document.getElementById('csCompareExpertWrap');
  const compareSub = document.getElementById('csCompareSub');
  if (waiting) waiting.hidden = true;
  if (grid) grid.hidden = false;
  if (agreementWrap) agreementWrap.hidden = false;
  if (compareSub) {
    compareSub.textContent = 'Read-only side-by-side comparison after both attempts were completed.';
  }

  csRenderCompareList('csCompareOrigDdx', original.top_differentials, 'No differentials entered');
  csRenderCompareList('csCompareInvDdx', invited.top_differentials, 'No differentials entered');
  csRenderCompareList('csCompareOrigTests', csToTestNames(original.selected_tests), 'No tests selected');
  csRenderCompareList('csCompareInvTests', csToTestNames(invited.selected_tests), 'No tests selected');

  const origFinal = document.getElementById('csCompareOrigFinal');
  const invFinal = document.getElementById('csCompareInvFinal');
  if (origFinal) {
    origFinal.innerHTML = `<strong>Diagnosis:</strong> ${escapeHtml(csImperializeText(original.final_diagnosis || '—'))}<br><strong>Conclusion:</strong> ${escapeHtml(csImperializeText(original.final_conclusion || '—'))}`;
  }
  if (invFinal) {
    invFinal.innerHTML = `<strong>Diagnosis:</strong> ${escapeHtml(csImperializeText(invited.final_diagnosis || '—'))}<br><strong>Conclusion:</strong> ${escapeHtml(csImperializeText(invited.final_conclusion || '—'))}`;
  }

  const agreeEl = document.getElementById('csCompareAgreement');
  if (agreeEl) {
    const dxMatch = agreement.diagnosis_match
      ? '<span class="cs-compare-chip match">Final diagnosis matched</span>'
      : '<span class="cs-compare-chip diff">Final diagnosis differed</span>';
    const ddxShared = (agreement.top_differentials || []).map(v => `<span class="cs-compare-chip match">${escapeHtml(csImperializeText(v))}</span>`).join('');
    const testsShared = (agreement.selected_tests || []).map(v => `<span class="cs-compare-chip match">${escapeHtml(csImperializeText(v))}</span>`).join('');
    agreeEl.innerHTML = `
      <div>${dxMatch}</div>
      <div>${ddxShared || '<span class="cs-compare-note">No overlapping top differentials.</span>'}</div>
      <div>${testsShared || '<span class="cs-compare-note">No overlapping selected tests.</span>'}</div>
    `;
  }

  const diffEl = document.getElementById('csCompareDifference');
  if (diffEl) {
    const origOnlyDx = (differences.original_only_differentials || []).map(v => `<span class="cs-compare-chip diff">Original: ${escapeHtml(csImperializeText(v))}</span>`).join('');
    const invOnlyDx = (differences.invited_only_differentials || []).map(v => `<span class="cs-compare-chip diff">Invited: ${escapeHtml(csImperializeText(v))}</span>`).join('');
    const origOnlyTests = (differences.original_only_tests || []).map(v => `<span class="cs-compare-chip diff">Original test: ${escapeHtml(csImperializeText(v))}</span>`).join('');
    const invOnlyTests = (differences.invited_only_tests || []).map(v => `<span class="cs-compare-chip diff">Invited test: ${escapeHtml(csImperializeText(v))}</span>`).join('');
    const dxDiffHtml = `${origOnlyDx}${invOnlyDx}` || '<span class="cs-compare-note">No differential differences.</span>';
    const testDiffHtml = `${origOnlyTests}${invOnlyTests}` || '<span class="cs-compare-note">No test-selection differences.</span>';
    diffEl.innerHTML = `
      <div>${dxDiffHtml}</div>
      <div>${testDiffHtml}</div>
    `;
  }

  const expertEl = document.getElementById('csCompareExpert');
  if (expertEl) {
    const html = String(data.expert_reasoning_html || '').trim();
    if (html) {
      expertEl.innerHTML = csImperializeHtml(html);
      if (expertWrap) expertWrap.hidden = false;
    } else if (expertWrap) {
      expertWrap.hidden = true;
    }
  }
}

function csRenderChallengeWaiting(message) {
  const waiting = document.getElementById('csCompareWaiting');
  const grid = document.getElementById('csCompareGrid');
  const agreementWrap = document.getElementById('csCompareAgreementWrap');
  const expertWrap = document.getElementById('csCompareExpertWrap');
  const compareSub = document.getElementById('csCompareSub');
  if (compareSub) compareSub.textContent = 'The shared case is active. Comparison appears after the invited user submits.';
  if (waiting) {
    waiting.hidden = false;
    waiting.textContent = message || 'Waiting for the invited attempt to be completed.';
  }
  if (grid) grid.hidden = true;
  if (agreementWrap) agreementWrap.hidden = true;
  if (expertWrap) expertWrap.hidden = true;
}

async function csCreateChallengeInvite() {
  const c = csState.case;
  if (!c) return;
  const btn = document.getElementById('csChallengeBtn');
  const initialLabel = btn ? btn.textContent : 'Challenge someone';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Creating…';
  }
  csChallengeState.pending = true;
  csUpdateChallengeControls();

  try {
    const waitState = await csWaitForDebriefReady(7000);
    if (waitState && waitState.timedOut) {
      _showToast('Expert reasoning is still loading. Creating challenge with current results.', 2200);
    }
    const originalAttempt = csBuildAttemptSummary(true);
    csState.attemptSummary = originalAttempt;
    const caseSnapshot = csDeepClone(c);
    caseSnapshot._frozenLevel = csState.level || '';
    caseSnapshot._frozenTokensTotal = csState.tokensTotal || 0;

    const data = await csChallengeApiPost('create_invite', {
      created_by_user_id: null,
      original_attempt: originalAttempt,
      original_attempt_id: originalAttempt.id,
      case_id: c.id || c.title || 'case',
      case_snapshot: caseSnapshot,
      expires_at: null
    });

    const invite = data.share_invite || {};
    const token = String(invite.token || data.token || '').trim();
    if (!token) throw new Error('missing_challenge_token');

    const shareUrl = data.share_url || `${window.location.origin}${window.location.pathname}?${CS_CHALLENGE_ROUTE_PARAM}=${encodeURIComponent(token)}`;
    csChallengeState.mode = 'owner';
    csChallengeState.token = token;
    csChallengeState.inviteId = invite.id || '';
    csChallengeState.ownerAccessKey = data.owner_access_key || '';
    csChallengeState.originalAttempt = originalAttempt;
    csChallengeState.shareUrl = shareUrl;
    csChallengeState.createdAt = invite.created_at || new Date().toISOString();
    csChallengeState.caseSnapshot = caseSnapshot;

    csSaveOwnerLinkRecord(token, {
      owner_access_key: csChallengeState.ownerAccessKey,
      invite_id: csChallengeState.inviteId,
      share_url: shareUrl,
      created_at: csChallengeState.createdAt,
      original_attempt_id: originalAttempt.id,
      case_id: c.id || c.title || 'case',
    });

    csUpdateChallengeControls();
    saveToStorage();

    const shareText = 'I just completed an Eidos case. Run through the same case and compare your reasoning with mine.';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'EIDOS Challenge Case', text: shareText, url: shareUrl });
        _showToast('Challenge link shared.', 1800);
      } catch (_) {
        // user canceled share sheet
      }
    }
  } catch (err) {
    console.warn('Challenge invite creation failed', err);
    const code = String((err && err.message) || '');
    if (code === 'challenge_timeout' || code === 'challenge_unavailable' || code.includes('challenge_post_404') || code.includes('challenge_get_404')) {
      _showToast('Challenge service is unavailable on this deployment right now.', 3200);
    } else {
      _showToast('Could not create challenge link right now.', 2400);
    }
    if (btn) btn.textContent = initialLabel;
  } finally {
    csChallengeState.pending = false;
    csUpdateChallengeControls();
    if (btn) btn.disabled = false;
  }
}

async function csSubmitChallengeAttempt() {
  if (csChallengeState.mode !== 'invitee' || !csChallengeState.token) return;

  const btn = document.getElementById('csChallengeBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Submitting…';
  }
  csChallengeState.pending = true;
  csUpdateChallengeControls();

  try {
    const waitState = await csWaitForDebriefReady(7000);
    if (waitState && waitState.timedOut) {
      _showToast('Expert reasoning is still loading. Submitting current attempt.', 2200);
    }
    const invitedAttempt = csBuildAttemptSummary(true);
    csState.attemptSummary = invitedAttempt;

    const data = await csChallengeApiPost('submit_attempt', {
      token: csChallengeState.token,
      user_id: null,
      attempt: invitedAttempt
    });

    const comparison = data.comparison || csBuildComparisonPayload(data.original_attempt, invitedAttempt);
    csChallengeState.invitedAttempt = invitedAttempt;
    csChallengeState.comparison = comparison;
    csUpdateChallengeControls();
    csRenderChallengeComparison(comparison);
    csGoTo('pagCS7');
    _showToast('Challenge submitted. Comparison ready.', 2200);
  } catch (err) {
    console.warn('Challenge submit failed', err);
    const code = String((err && err.message) || '');
    if (code === 'challenge_timeout' || code === 'challenge_unavailable' || code.includes('challenge_post_404') || code.includes('challenge_get_404')) {
      _showToast('Challenge service is unavailable on this deployment right now.', 3200);
    } else {
      _showToast('Could not submit challenge attempt right now.', 2400);
    }
  } finally {
    csChallengeState.pending = false;
    csUpdateChallengeControls();
    if (btn) btn.disabled = false;
  }
}

async function csCheckOwnerChallengeComparison() {
  if (!csChallengeState.token || !csChallengeState.ownerAccessKey) {
    csRenderChallengeWaiting('Share the challenge link first, then check back after completion.');
    csGoTo('pagCS7');
    return;
  }

  csChallengeState.pending = true;
  csUpdateChallengeControls();
  try {
    const data = await csChallengeApiPost('get_comparison', {
      token: csChallengeState.token,
      owner_access_key: csChallengeState.ownerAccessKey
    });
    if (data && data.comparison) {
      csChallengeState.comparison = data.comparison;
      csRenderChallengeComparison(data.comparison);
    } else {
      csRenderChallengeWaiting('No invited submission yet. Send the link to a classmate or colleague and check back.');
    }
    csGoTo('pagCS7');
  } catch (err) {
    console.warn('Owner comparison fetch failed', err);
    const code = String((err && err.message) || '');
    if (code === 'challenge_timeout' || code === 'challenge_unavailable' || code.includes('challenge_post_404') || code.includes('challenge_get_404')) {
      csRenderChallengeWaiting('Challenge service is unavailable on this deployment right now.');
    } else {
      csRenderChallengeWaiting('Could not load comparison right now.');
    }
    csGoTo('pagCS7');
  } finally {
    csChallengeState.pending = false;
    csUpdateChallengeControls();
  }
}

function csHandleChallengeAction() {
  _showToast('Challenge mode is temporarily disabled.', 2200);
}

async function csCopyChallengeLink() {
  const input = document.getElementById('csChallengeLinkInput');
  if (!input || !input.value) return;
  try {
    await navigator.clipboard.writeText(input.value);
    _showToast('Challenge link copied.', 1500);
  } catch (_) {
    input.select();
    document.execCommand('copy');
    _showToast('Challenge link copied.', 1500);
  }
}

async function csBootChallengeFromUrl(token) {
  if (!token) return false;
  csSetChallengeTokenInUrl('');
  csResetChallengeContext({ clearRoute: false });
  _showToast('Challenge mode is temporarily disabled.', 2200);
  return false;
}

function csRenderProgress(activePageId) {
  const steps = [
    { page: 'pagCS1', label: 'History' },
    { page: 'pagCS2', label: 'Differential' },
    { page: 'pagCS3', label: 'Examine' },
    { page: 'pagCS4', label: 'Update' },
    { page: 'pagCS5', label: 'Diagnose' },
    { page: 'pagCS6', label: 'Debrief' },
  ];
  const activeIdx = steps.findIndex(s => s.page === activePageId);
  if (activeIdx < 0) return;

  steps.forEach((step, i) => {
    const el = document.getElementById('csProgress' + (i + 1));
    if (!el) return;
    el.innerHTML = steps.map((s, j) => {
      const state = j < i ? 'done' : j === i ? 'active' : '';
      const dot = j < i ? '✓' : (j + 1).toString();
      return `<div class="cs-flow-step ${state}">
        <div class="cs-flow-dot">${dot}</div>
        <span class="cs-flow-label">${s.label}</span>
      </div>`;
    }).join('');
  });
}

function csValidateAndGoToExam() {
  const ddx1 = (document.getElementById('csDdx1')?.value || '').trim();
  if (!ddx1) {
    const slot = document.getElementById('csDdx1');
    if (slot) {
      slot.style.borderBottomColor = 'var(--negative)';
      slot.placeholder = 'Enter at least one diagnosis to proceed…';
      slot.focus();
      setTimeout(() => { slot.style.borderBottomColor = ''; slot.placeholder = 'Most likely diagnosis…'; }, 2500);
    }
    return;
  }
  csGoTo('pagCS3');
}

function csGoTo(pageId) {
  // Save current field state before navigating
  csSaveFieldState();
  csCloseInlineDdxDropdown();
  csCloseMobileDdxPicker(false);

  const pages = ['pagCS0','pagCS1','pagCS2','pagCS3','pagCS4','pagCS5','pagCS6'];
  const fromPage = pages.find(p => document.getElementById(p)?.classList.contains('active'));
  const fromIdx = pages.indexOf(fromPage);
  const toIdx = pages.indexOf(pageId);
  const dir = toIdx > fromIdx ? 'fwd' : 'back';

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active','slide-fwd','slide-back'));
  const target = document.getElementById(pageId);
  if (!target) return;
  target.classList.add('active', dir === 'fwd' ? 'slide-fwd' : 'slide-back');
  setTimeout(() => target.classList.remove('slide-fwd','slide-back'), 350);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Render page-specific content
  if (pageId === 'pagCS3') csRenderExamination();
  if (pageId === 'pagCS4') csRenderRevealedFindings();
  if (pageId === 'pagCS5') csRenderRedFlags();
  if (pageId === 'pagCS0') csRefreshCasePoolStatus();
  csRenderProgress(pageId);
  if (pageId === 'pagCS6') csUpdateChallengeControls();
  setUIRoute('split');
  setLastPageId(pageId);
  syncHeaderPostCollect();
  saveToStorage();
}

function csSaveFieldState() {
  const get = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  csState.ddx1 = get('csDdx1');
  csState.ddx2 = get('csDdx2');
  csState.ddx3 = get('csDdx3');
  csState.reasoning1 = get('csReasoning1');
  csState.updDdx1 = get('csUpdDdx1');
  csState.updDdx2 = get('csUpdDdx2');
  csState.updDdx3 = get('csUpdDdx3');
  csState.reasoning2 = get('csReasoning2');
  csState.finalDx = get('csFinalDx');
  csState.finalReasoning = get('csFinalReasoning');
  csState.management = get('csManagement');
  csState.imagingSuggestion = get('csImagingSuggestion');
  csState.confidence = csClampConfidence(get('csConfidence'));
}

const CS_MOBILE_DDX_INPUT_IDS = [
  'csDdx1', 'csDdx2', 'csDdx3',
  'csUpdDdx1', 'csUpdDdx2', 'csUpdDdx3',
  'csFinalDx'
];
const csMobileDdx = {
  enabled: false,
  initialized: false,
  activeInput: null,
  overlay: null,
  panel: null,
  title: null,
  search: null,
  list: null,
  useTyped: null,
};
const csInlineDdx = {
  initialized: false,
  dropdown: null,
  list: null,
  activeInput: null,
  options: [],
  highlightedIndex: -1,
};

function csSupportsMobileDdxPicker() {
  const narrow = window.matchMedia('(max-width: 900px)').matches;
  const touchCapable = window.matchMedia('(pointer: coarse)').matches || (navigator.maxTouchPoints || 0) > 0;
  return narrow && touchCapable;
}

function csGetDdxAreasForCase(c) {
  const regionText = String((c && c.region) || '').toLowerCase();
  const areas = [];
  const addArea = (key) => {
    if (!key || !DDX_LOGIC[key] || areas.includes(key)) return;
    areas.push(key);
  };

  if (regionText) {
    if (regionText.includes('cervical') || regionText.includes('neck')) addArea('cervical');
    if (regionText.includes('thoracic') || regionText.includes('mid-back') || regionText.includes('mid back')) addArea('thoracic');
    if (regionText.includes('lumbar') || regionText.includes('low back')) addArea('lumbar');
    if (regionText.includes('hip') || regionText.includes('pelvis') || regionText.includes('groin')) addArea('pelvis');
    if (regionText.includes('shoulder')) addArea('shoulder');
    if (regionText.includes('elbow')) addArea('elbow');
    if (regionText.includes('knee')) addArea('knee');
    if (regionText.includes('ankle') || regionText.includes('foot')) addArea('ankle');
  }

  if (areas.length === 0 && state && state.area && DDX_LOGIC[state.area]) {
    addArea(state.area);
  }

  if (areas.length === 0 && regionText) {
    Object.keys(DDX_LOGIC).forEach(key => {
      if (regionText.includes(key)) addArea(key);
    });
  }

  return areas;
}

const CS_GENERIC_DDX_LABELS = new Set([
  'alternative musculoskeletal pathology',
  'neural involvement',
  'referred pain source'
]);

const CS_DDX_CANONICAL_MAP = {
  'lcl sprain': 'LCL Sprain / Posterolateral Corner',
  'lcl strain': 'LCL Sprain / Posterolateral Corner',
  'lcl sprain posterolateral corner': 'LCL Sprain / Posterolateral Corner',
  'lcl strain posterolateral corner': 'LCL Sprain / Posterolateral Corner',
  'lcl plc injury': 'LCL Sprain / Posterolateral Corner',
  'lcl plc': 'LCL Sprain / Posterolateral Corner',
  'lcl posterolateral corner': 'LCL Sprain / Posterolateral Corner',
  'posterolateral corner injury': 'LCL Sprain / Posterolateral Corner',
  'rotator cuff related shoulder pain': 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)',
  'rotator cuff related': 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)',
  'subacromial pain': 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)',
  'subacromial impingement rc tendinopathy': 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)',
  'impingement': 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)',
  'rc tendinopathy': 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)',
  'rc tear': 'Rotator Cuff Tear (Partial Tear)',
  'rc tear partial or full': 'Rotator Cuff Tear (Partial Tear)',
  'rotator cuff tear': 'Rotator Cuff Tear (Partial Tear)',
  'rotator cuff partial tear suspected urgent imaging': 'Rotator Cuff Tear (Partial Tear)',
  'rotator cuff tear partial or full': 'Rotator Cuff Tear (Partial Tear)',
  'full thickness rotator cuff tear': 'Full Thickness Rotator Cuff Tear Suspected (urgent imaging)',
  'full thickness rotator cuff tear suspected': 'Full Thickness Rotator Cuff Tear Suspected (urgent imaging)',
  'full thickness rotator cuff tear suspected urgent referral': 'Full Thickness Rotator Cuff Tear Suspected (urgent imaging)',
  'full thickness rotator cuff tear suspected urgent imaging': 'Full Thickness Rotator Cuff Tear Suspected (urgent imaging)',
  'rotator cuff full tear suspected urgent imaging': 'Full Thickness Rotator Cuff Tear Suspected (urgent imaging)',
  'femoral neck stress fracture suspected': 'Femoral Neck Stress Fracture',
  'femoral neck stress fracture suspected urgent imaging': 'Femoral Neck Stress Fracture',
  'stress fracture femoral neck pubic ramus red flag': 'Femoral Neck Stress Fracture',
  'slap lesion': 'Labral Tear (SLAP)',
  'slap tear': 'Labral Tear (SLAP)',
  'labral tear slap': 'Labral Tear (SLAP)',
  'acl tear': 'ACL Sprain / Tear',
  'acl sprain tear': 'ACL Sprain / Tear',
  'acl sprain tear knee ligament injury': 'ACL Sprain / Tear',
  'acl injury suspected': 'ACL Sprain / Tear',
  'anterior cruciate ligament tear': 'ACL Sprain / Tear',
  'pcl tear': 'PCL Sprain / Tear',
  'posterior cruciate ligament tear': 'PCL Sprain / Tear',
  'pcl injury suspected': 'PCL Sprain / Tear',
  'medial meniscus': 'Medial Meniscal Tear',
  'medial meniscus tear': 'Medial Meniscal Tear',
  'medial meniscal tear': 'Medial Meniscal Tear',
  'meniscal tear medial traumatic pattern': 'Medial Meniscal Tear',
  'meniscal tear degenerative knee cartilage wear': 'Medial Meniscal Tear',
  'meniscal tear degenerative': 'Medial Meniscal Tear',
  'meniscal tear': 'Medial Meniscal Tear',
  'meniscus injury suspected': 'Medial Meniscal Tear',
  'meniscus injury': 'Medial Meniscal Tear',
  'meniscus tear': 'Medial Meniscal Tear',
  'lateral meniscus': 'Lateral Meniscal Tear',
  'lateral meniscus tear': 'Lateral Meniscal Tear',
  'lateral meniscal tear': 'Lateral Meniscal Tear',
  'lateral meniscal injury': 'Lateral Meniscal Tear',
  'meniscal tear traumatic knee cartilage tear': 'Lateral Meniscal Tear',
  'meniscal tear traumatic': 'Lateral Meniscal Tear',
  'it band syndrome': 'Iliotibial Band Syndrome (ITBS)',
  'it band syndrome iliotibial band syndrome lateral knee pain': 'Iliotibial Band Syndrome (ITBS)',
  'iliotibial band syndrome': 'Iliotibial Band Syndrome (ITBS)',
  'iliotibial band syndrome itbs': 'Iliotibial Band Syndrome (ITBS)',
  'itbs': 'Iliotibial Band Syndrome (ITBS)',
  'patellar tendinopathy': 'Patellar Tendinopathy (Jumper\'s Knee)',
  'jumper s knee': 'Patellar Tendinopathy (Jumper\'s Knee)',
  'jumpers knee': 'Patellar Tendinopathy (Jumper\'s Knee)',
  'patellar tendinopathy jumper s knee': 'Patellar Tendinopathy (Jumper\'s Knee)',
  'knee oa': 'Knee Osteoarthritis',
  'knee oa flare': 'Knee Osteoarthritis',
  'knee osteoarthritis flare': 'Knee Osteoarthritis',
  'knee osteoarthritis knee arthritis': 'Knee Osteoarthritis',
  'lumbar disc herniation slipped bulging disc': 'Lumbar Disc Herniation',
  'recurrent disc herniation at l4 5': 'Lumbar Disc Herniation',
  'recurrent disc herniation l4 5': 'Lumbar Disc Herniation',
  'recurrent lumbar disc herniation at l4 5': 'Lumbar Disc Herniation',
  'lumbar disc herniation with radiculopathy': 'Lumbar Radiculopathy',
  'lumbar disc herniation with l5 radiculopathy': 'Lumbar Radiculopathy',
  'lumbar disc hernation with radiculopathy': 'Lumbar Radiculopathy',
  'lumbar disc hernation with l5 radiculopathy': 'Lumbar Radiculopathy',
  'lumbar sprain strain': 'Acute Lumbar Strain',
  'lumbar strain sprain': 'Acute Lumbar Strain',
  'low back sprain strain': 'Acute Lumbar Strain',
  'low back strain sprain': 'Acute Lumbar Strain',
  'chronic non specific low back pain': 'Chronic Non-Specific Low Back Pain (Chronic Back Pain)',
  'chronic nonspecific low back pain': 'Chronic Non-Specific Low Back Pain (Chronic Back Pain)',
  'non specific low back pain': 'Chronic Non-Specific Low Back Pain (Chronic Back Pain)',
  'nonspecific low back pain': 'Chronic Non-Specific Low Back Pain (Chronic Back Pain)',
  'disc irritation with neural sensitization': 'Lumbar Radiculopathy',
  'disc irritation neural sensitization': 'Lumbar Radiculopathy',
  'lumbar radiculopathy sciatica': 'Lumbar Radiculopathy',
  'sciatica lumbar radiculopathy nerve pain down the leg': 'Lumbar Radiculopathy',
  'lumbar radiculopathy l5 s1': 'Lumbar Radiculopathy',
  'lumbar spinal stenosis': 'Lumbar Spinal Stenosis (Spinal Narrowing)',
  'isolated lumbar spinal stenosis neurogenic claudication': 'Lumbar Spinal Stenosis (Spinal Narrowing)',
  'hip osteoarthritis': 'Hip Osteoarthritis',
  'hip osteoarthritis hip arthritis': 'Hip Osteoarthritis',
  'hip arthritis': 'Hip Osteoarthritis',
  'hip oa': 'Hip Osteoarthritis',
  'femoroacetabular impingement': 'Femoroacetabular Impingement (Hip Impingement)',
  'hip flexor overload': 'Hip Flexor Strain',
  'hip flexor overload iliopsoas': 'Hip Flexor Strain',
  'iliopsoas overload': 'Hip Flexor Strain',
  'hip flexor iliopsoas strain': 'Hip Flexor Strain',
  'adductor longus strain': 'Hip Adductor Tendinopathy / Strain',
  'adductor longus strain acute on chronic groin strain': 'Hip Adductor Tendinopathy / Strain',
  'adductor longus tendinopathy': 'Hip Adductor Tendinopathy / Strain',
  'adductor strain': 'Hip Adductor Tendinopathy / Strain',
  'adductor tendinopathy': 'Hip Adductor Tendinopathy / Strain',
  'hip adductor strain': 'Hip Adductor Tendinopathy / Strain',
  'hip adductor tendinopathy strain': 'Hip Adductor Tendinopathy / Strain',
  'hamstring strain': 'Proximal Hamstring Tendinopathy / Strain',
  'hamstring tear strain': 'Proximal Hamstring Tendinopathy / Strain',
  'proximal hamstring tendinopathy': 'Proximal Hamstring Tendinopathy / Strain',
  'proximal hamstring tendinopathy hamstring tendon pain sit bone pain': 'Proximal Hamstring Tendinopathy / Strain',
  'hamstring tendinopathy': 'Proximal Hamstring Tendinopathy / Strain',
  'high hamstring tendinopathy': 'Proximal Hamstring Tendinopathy / Strain',
  'proximal hamstring': 'Proximal Hamstring Tendinopathy / Strain',
  'ischial tendinopathy': 'Proximal Hamstring Tendinopathy / Strain',
  'quadriceps tendinopathy quad tendon pain above the kneecap': 'Quadriceps Tendinopathy',
  'distal hamstring tendinopathy hamstring tendon pain behind the knee': 'Distal Hamstring Tendinopathy',
  'greater trochanteric pain syndrome': 'Greater Trochanteric Pain Syndrome',
  'greater trochanteric pain syndrome gtps lateral hip pain': 'Greater Trochanteric Pain Syndrome',
  'gtps': 'Greater Trochanteric Pain Syndrome',
  'gluteal tendinopathy': 'Gluteal Tendinopathy (Hip Bursitis / Outer Hip Pain)',
  'athletic pubalgia sports hernia': 'Athletic Pubalgia (Sports Hernia)',
  'athletic pubalgia sports hernia groin strain': 'Athletic Pubalgia (Sports Hernia)',
  'athletic pubalgia sports hernia core muscle injury': 'Athletic Pubalgia (Sports Hernia)',
  'osteitis pubis pubic symphysis overload': 'Osteitis Pubis',
  'sij dysfunction': 'Sacroiliac Joint Dysfunction (SIJ Pain)',
  'sij dysfunction pelvic': 'Sacroiliac Joint Dysfunction (SIJ Pain)',
  'si joint dysfunction': 'Sacroiliac Joint Dysfunction (SIJ Pain)',
  'sacroiliac joint dysfunction': 'Sacroiliac Joint Dysfunction (SIJ Pain)',
  'sacroiliac joint dysfunction sij pain': 'Sacroiliac Joint Dysfunction (SIJ Pain)',
  'cervical radiculopathy pinched nerve in neck': 'Cervical Radiculopathy',
  'cervical radiculopathy c6': 'Cervical Radiculopathy',
  'cervical radiculopathy bilateral': 'Cervical Radiculopathy',
  'cervical facet joint syndrome': 'Cervical Facet Syndrome',
  'cervical disc herniation slipped disc in neck': 'Cervical Disc Herniation',
  'cervical myelopathy': 'Cervical Spondylotic Myelopathy',
  'cervical myelopathy suspected urgent referral': 'Cervical Spondylotic Myelopathy',
  'thoracic segmental dysfunction mechanical thoracic pain': 'Thoracic Mobility Deficit',
  'thoracic segmental dysfunction': 'Thoracic Mobility Deficit',
  'mechanical thoracic pain': 'Thoracic Mobility Deficit',
  'thoracic mobility deficits spondylosis': 'Thoracic Mobility Deficit',
  'thoracic mobility deficits': 'Thoracic Mobility Deficit',
  'thoracic disc pathology': 'Thoracic Disc Pathology',
  'thoracic disc herniation': 'Thoracic Disc Pathology',
  'thoracic disc herniation with radiculopathy': 'Thoracic Disc Pathology',
  'thoracic disc hernation with radiculopathy': 'Thoracic Disc Pathology',
  'thoracic disc radiculopathy': 'Thoracic Disc Pathology',
  'rib sprain': 'Thoracic Muscle Strain',
  'rib sprain costochondral injury': 'Thoracic Muscle Strain',
  'rib sprain costovertebral dysfunction': 'Thoracic Muscle Strain',
  'costochondral injury': 'Thoracic Muscle Strain',
  'costovertebral dysfunction': 'Thoracic Muscle Strain',
  'thoracic muscle sprain': 'Thoracic Muscle Strain',
  'intercostal muscle sprain': 'Thoracic Muscle Strain',
  'thoracic strain rib irritation': 'Thoracic Muscle Strain',
  'thoracic disc herniation with myelopathy': 'Thoracic Myelopathy — Suspected Metastatic Spinal Cord Compression (MSCC) — Emergency Referral Required',
  'thoracic outlet syndrome nerve compression in neck shoulder': 'Thoracic Outlet Syndrome',
  'thoracic facet joint dysfunction': 'Thoracic Facet Syndrome',
  'rib stress fracture fatigue fracture right rib 6': 'Rib Stress Fracture',
  'rib stress fracture': 'Rib Stress Fracture',
  'intercostal strain': 'Thoracic Muscle Strain',
  'intercostal muscle strain': 'Thoracic Muscle Strain',
  'subacromial bursitis traumatic': 'Subacromial Bursitis',
  'long head of biceps lhb tendinopathy': 'Long Head of Biceps Tendinopathy',
  'biceps tendinopathy long head': 'Long Head of Biceps Tendinopathy',
  'cubital tunnel syndrome ulnar nerve': 'Cubital Tunnel Syndrome',
  'radial tunnel syndrome posterior interosseous nerve': 'Radial Tunnel Syndrome',
  'pronator teres syndrome': 'Pronator Teres Syndrome (Median Nerve)',
  'ucl sprain': 'Ulnar Collateral Ligament (UCL) Sprain',
  'ucl sprain partial tear': 'Ulnar Collateral Ligament (UCL) Sprain',
  'ulnar collateral ligament sprain': 'Ulnar Collateral Ligament (UCL) Sprain',
  'ulnar collateral ligament ucl sprain': 'Ulnar Collateral Ligament (UCL) Sprain',
  'ulnar collateral ligament ucl sprain partial tear': 'Ulnar Collateral Ligament (UCL) Sprain',
  'distal biceps rupture suspected urgent referral': 'Distal Biceps Tendon Rupture',
  'distal biceps tendon rupture complete': 'Distal Biceps Tendon Rupture',
  'patellofemoral pain syndrome': 'Patellofemoral Pain Syndrome (PFPS)',
  'piriformis syndrome': 'Piriformis Syndrome (Deep Buttock Pain)',
  'lateral ankle sprain': 'Lateral Ankle Sprain (ATFL/CFL)',
  'lateral ankle sprain atfl': 'Lateral Ankle Sprain (ATFL/CFL)',
  'lateral ankle sprain atfl cfl': 'Lateral Ankle Sprain (ATFL/CFL)',
  'lateral ankle ligament sprain': 'Lateral Ankle Sprain (ATFL/CFL)',
  'chronic ankle instability weak ankle repeated sprains': 'Chronic Ankle Instability',
  'chronic ankle instability cai': 'Chronic Ankle Instability',
  'high ankle sprain syndesmotic': 'High Ankle Sprain (Syndesmosis)',
  'high ankle sprain syndesmosis': 'High Ankle Sprain (Syndesmosis)',
  'syndesmosis sprain high ankle sprain': 'High Ankle Sprain (Syndesmosis)',
  'plantar fasciitis heel spur pain': 'Plantar Fasciitis',
  'achilles tendinopathy achilles tendon pain': 'Achilles Tendinopathy',
  'achilles tendinopathy mid portion': 'Achilles Tendinopathy',
  'mid portion achilles tendinopathy': 'Achilles Tendinopathy',
  'insertional achilles tendinopathy': 'Achilles Tendinopathy',
  'achilles tendon rupture': 'Achilles Tendon Rupture Suspected (urgent referral)',
  'achilles rupture': 'Achilles Tendon Rupture Suspected (urgent referral)',
  'achilles tendon rupture partial': 'Achilles Tendon Rupture Suspected (urgent referral)',
  'achilles tendon rupture suspected urgent referral': 'Achilles Tendon Rupture Suspected (urgent referral)'
};

function csCanonicalDdxLabel(name) {
  const raw = String(name || '');
  const key = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return CS_DDX_CANONICAL_MAP[key] || raw;
}

function csNormalizeDdxLabel(name) {
  return String(csCanonicalDdxLabel(name) || '').replace(/^⚠️\s*/, '').replace(/\s+/g, ' ').trim();
}

function csIsGenericDdxLabel(name) {
  return CS_GENERIC_DDX_LABELS.has(csNormalizeDdxLabel(name).toLowerCase());
}

function csAreaKeywords(area) {
  switch (area) {
    case 'cervical':
      return ['cervical', 'cervicogenic', 'myelopathy', 'whiplash'];
    case 'thoracic':
      return ['thoracic', 'mid-back', 'mid back', 'rib', 'costochond', 'kyphosis'];
    case 'lumbar':
      return ['lumbar', 'low back', 'sciatica', 'cauda equina', 'lumbopelvic'];
    case 'pelvis':
      return ['hip', 'hip labral', 'acetabular', 'pelvis', 'pelvic', 'groin', 'femoroacetabular', 'fai', 'trochanter', 'sacroiliac', 'sij', 'pubic'];
    case 'shoulder':
      return ['shoulder', 'rotator cuff', 'acrom', 'glenohumeral', 'slap', 'bankart', 'ac joint', 'sc joint'];
    case 'elbow':
      return ['elbow', 'epicondyl', 'cubital', 'radial tunnel', 'pronator', 'biceps'];
    case 'knee':
      return ['knee', 'patellar', 'meniscal', 'acl', 'mcl', 'pcl', 'osgood', 'pfps', 'tibial'];
    case 'ankle':
      return ['ankle', 'foot', 'achilles', 'plantar', 'tarsal', 'metatars', 'syndesmosis', 'tal'];
    default:
      return [area];
  }
}

function csNormalizePhraseForMatch(v) {
  return ` ${String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

function csDiagnosisMatchesAreas(name, areas) {
  const haystack = csNormalizePhraseForMatch(csNormalizeDdxLabel(name));
  if (haystack.trim().length === 0) return false;
  return (areas || []).some(area =>
    csAreaKeywords(area).some(k => {
      const needle = csNormalizePhraseForMatch(k);
      return haystack.includes(needle);
    })
  );
}

function csCollectRegionDdxOptions(c) {
  const areas = csGetDdxAreasForCase(c);
  if (!areas.length) return [];
  const seen = new Set();
  const out = [];
  const addOption = (name) => {
    const clean = csNormalizeDdxLabel(name);
    const key = clean.toLowerCase();
    if (!clean || csIsGenericDdxLabel(clean) || seen.has(key)) return;
    seen.add(key);
    out.push(clean);
  };

  areas.forEach(area => {
    (DDX_LOGIC[area] || []).forEach(dx => {
      addOption(dx && dx.name);
    });
  });

  ['beginner', 'intermediate', 'advanced'].forEach(level => {
    (CASE_LIBRARY[level] || []).forEach(caseObj => {
      if (!caseObj) return;
      const caseAreas = csGetDdxAreasForCase(caseObj);
      if (!caseAreas.some(a => areas.includes(a))) return;
      addOption(caseObj.correctDx);
      const caseDifferentials = Array.isArray(caseObj.keyDifferentials) ? caseObj.keyDifferentials : [];
      caseDifferentials.forEach(addOption);
    });
  });

  Object.keys(DDX_TESTS || {}).forEach(dxName => {
    if (csDiagnosisMatchesAreas(dxName, areas)) addOption(dxName);
  });

  return out;
}

function csCollectDdxOptions() {
  const dl = document.getElementById('ddx-options');
  if (!dl) return [];
  const seen = new Set();
  const out = [];
  Array.from(dl.options).forEach(opt => {
    const val = String(opt.value || '').trim();
    const key = val.toLowerCase();
    if (val && !seen.has(key)) {
      seen.add(key);
      out.push(val);
    }
  });
  return out;
}

function csEnsureMobileDdxPicker() {
  if (csMobileDdx.initialized) return;
  const overlay = document.createElement('div');
  overlay.className = 'cs-mobile-ddx-overlay';
  overlay.id = 'csMobileDdxOverlay';
  overlay.innerHTML = `
    <div class="cs-mobile-ddx-sheet" role="dialog" aria-modal="true" aria-labelledby="csMobileDdxTitle">
      <div class="cs-mobile-ddx-head">
        <span class="cs-mobile-ddx-kicker">Diagnosis Picker</span>
        <button type="button" class="cs-mobile-ddx-close" id="csMobileDdxClose">Done</button>
      </div>
      <p class="cs-mobile-ddx-title" id="csMobileDdxTitle">Select a diagnosis</p>
      <input type="text" class="cs-mobile-ddx-search" id="csMobileDdxSearch" placeholder="Type to filter or enter your own diagnosis" autocomplete="off" />
      <div class="cs-mobile-ddx-actions">
        <button type="button" class="cs-mobile-ddx-action" id="csMobileDdxUseTyped">Use typed text</button>
        <button type="button" class="cs-mobile-ddx-action" id="csMobileDdxClear">Clear field</button>
      </div>
      <div class="cs-mobile-ddx-list" id="csMobileDdxList"></div>
    </div>`;
  document.body.appendChild(overlay);

  csMobileDdx.overlay = overlay;
  csMobileDdx.panel = overlay.querySelector('.cs-mobile-ddx-sheet');
  csMobileDdx.title = overlay.querySelector('#csMobileDdxTitle');
  csMobileDdx.search = overlay.querySelector('#csMobileDdxSearch');
  csMobileDdx.list = overlay.querySelector('#csMobileDdxList');
  csMobileDdx.useTyped = overlay.querySelector('#csMobileDdxUseTyped');

  const closeBtn = overlay.querySelector('#csMobileDdxClose');
  const clearBtn = overlay.querySelector('#csMobileDdxClear');
  if (closeBtn) closeBtn.addEventListener('click', () => csCloseMobileDdxPicker(true));
  if (clearBtn) clearBtn.addEventListener('click', () => {
    csApplyMobileDdxValue('');
    csCloseMobileDdxPicker(true);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) csCloseMobileDdxPicker(true);
  });
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') csCloseMobileDdxPicker(true);
  });
  if (csMobileDdx.search) {
    csMobileDdx.search.addEventListener('input', () => {
      csRenderMobileDdxList(csMobileDdx.search.value);
    });
    csMobileDdx.search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if ((csMobileDdx.search.value || '').trim()) {
          csApplyMobileDdxValue(csMobileDdx.search.value);
          csCloseMobileDdxPicker(true);
        }
      }
    });
  }
  if (csMobileDdx.useTyped) {
    csMobileDdx.useTyped.addEventListener('click', () => {
      if (!(csMobileDdx.search && csMobileDdx.search.value.trim())) return;
      csApplyMobileDdxValue(csMobileDdx.search.value);
      csCloseMobileDdxPicker(true);
    });
  }

  const syncViewportOffset = () => {
    if (!csMobileDdx.overlay) return;
    if (!window.visualViewport) {
      csMobileDdx.overlay.style.setProperty('--cs-mobile-kb-offset', '0px');
      return;
    }
    const vv = window.visualViewport;
    const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    csMobileDdx.overlay.style.setProperty('--cs-mobile-kb-offset', `${inset}px`);
  };
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncViewportOffset);
    window.visualViewport.addEventListener('scroll', syncViewportOffset);
  }
  window.addEventListener('resize', syncViewportOffset);
  csMobileDdx.syncViewportOffset = syncViewportOffset;

  csMobileDdx.initialized = true;
}

function csApplyMobileDdxValue(value) {
  if (!csMobileDdx.activeInput) return;
  const nextValue = String(value || '').trim();
  csMobileDdx.activeInput.value = nextValue;
  csMobileDdx.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
  csMobileDdx.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
}

function csRenderMobileDdxList(filterText) {
  if (!csMobileDdx.list) return;
  const query = String(filterText || '').trim().toLowerCase();
  const options = csCollectDdxOptions();
  const matches = query
    ? options.filter(name => name.toLowerCase().includes(query))
    : options;
  csMobileDdx.list.innerHTML = '';

  const typed = csMobileDdx.search ? csMobileDdx.search.value.trim() : '';
  if (csMobileDdx.useTyped) {
    csMobileDdx.useTyped.disabled = typed.length === 0;
    csMobileDdx.useTyped.textContent = typed ? `Use "${typed}"` : 'Use typed text';
  }

  if (matches.length === 0) {
    csMobileDdx.list.innerHTML = '<div class="cs-mobile-ddx-empty">No matching diagnoses in the list. Use "Use typed text" to keep your custom entry.</div>';
    return;
  }

  matches.forEach(name => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cs-mobile-ddx-option';
    btn.textContent = name;
    btn.addEventListener('click', () => {
      csApplyMobileDdxValue(name);
      csCloseMobileDdxPicker(true);
    });
    csMobileDdx.list.appendChild(btn);
  });
}

function csOpenMobileDdxPicker(inputEl) {
  if (!csMobileDdx.enabled) return;
  csEnsureMobileDdxPicker();
  if (!csMobileDdx.overlay) return;
  csMobileDdx.activeInput = inputEl;
  const fieldLabel = (inputEl.getAttribute('placeholder') || 'Select diagnosis').replace(/[….]+$/g, '').trim();
  if (csMobileDdx.title) csMobileDdx.title.textContent = fieldLabel || 'Select diagnosis';
  if (csMobileDdx.search) csMobileDdx.search.value = inputEl.value || '';
  csRenderMobileDdxList(inputEl.value || '');
  csMobileDdx.overlay.classList.add('open');
  document.body.classList.add('cs-mobile-ddx-open');
  if (typeof csMobileDdx.syncViewportOffset === 'function') csMobileDdx.syncViewportOffset();
}

function csCloseMobileDdxPicker(refocusInput) {
  if (!csMobileDdx.overlay) return;
  const input = csMobileDdx.activeInput;
  csMobileDdx.overlay.classList.remove('open');
  document.body.classList.remove('cs-mobile-ddx-open');
  csMobileDdx.activeInput = null;
  if (typeof csMobileDdx.syncViewportOffset === 'function') {
    csMobileDdx.syncViewportOffset();
  }
  if (refocusInput && input) setTimeout(() => input.blur(), 0);
}

function csInitMobileDdxPicker() {
  csMobileDdx.enabled = csSupportsMobileDdxPicker();
  if (!csMobileDdx.enabled) return;
  csEnsureMobileDdxPicker();
  CS_MOBILE_DDX_INPUT_IDS.forEach(id => {
    const input = document.getElementById(id);
    if (!input || input.dataset.mobileDdxBound === '1') return;
    input.dataset.mobileDdxBound = '1';
    input.removeAttribute('list');
    input.classList.add('cs-mobile-ddx-target');
    input.readOnly = true;
    input.autocomplete = 'off';
    input.setAttribute('inputmode', 'none');
    input.setAttribute('aria-haspopup', 'dialog');
    const open = (e) => {
      e.preventDefault();
      csOpenMobileDdxPicker(input);
    };
    input.addEventListener('focus', open);
    input.addEventListener('click', open);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        csOpenMobileDdxPicker(input);
      }
    });
  });
}

function csEnsureInlineDdxDropdown() {
  if (csInlineDdx.initialized) return;
  const dropdown = document.createElement('div');
  dropdown.id = 'csInlineDdxDropdown';
  dropdown.className = 'cs-inline-ddx-dropdown hidden';
  dropdown.setAttribute('role', 'listbox');

  const list = document.createElement('div');
  list.id = 'csInlineDdxList';
  dropdown.appendChild(list);
  document.body.appendChild(dropdown);

  csInlineDdx.dropdown = dropdown;
  csInlineDdx.list = list;

  dropdown.addEventListener('mousedown', (e) => {
    const optionBtn = e.target.closest('.cs-inline-ddx-option');
    if (!optionBtn) return;
    e.preventDefault();
    const idx = Number(optionBtn.dataset.idx);
    if (!Number.isFinite(idx) || idx < 0 || idx >= csInlineDdx.options.length) return;
    csInlineDdx.highlightedIndex = idx;
    csApplyInlineDdxValue(csInlineDdx.options[idx]);
  });

  document.addEventListener('mousedown', (e) => {
    if (!csInlineDdx.activeInput || !csInlineDdx.dropdown) return;
    if (csInlineDdx.dropdown.contains(e.target)) return;
    if (e.target === csInlineDdx.activeInput) return;
    csCloseInlineDdxDropdown();
  });

  window.addEventListener('resize', () => csPositionInlineDdxDropdown());
  window.addEventListener('scroll', () => csPositionInlineDdxDropdown(), true);
  csInlineDdx.initialized = true;
}

function csPositionInlineDdxDropdown() {
  if (!csInlineDdx.dropdown || !csInlineDdx.activeInput) return;
  const rect = csInlineDdx.activeInput.getBoundingClientRect();
  const viewportPad = 10;
  const left = Math.max(viewportPad, rect.left);
  const width = Math.max(300, rect.width);

  let top = rect.bottom + 6;
  let maxHeight = Math.min(320, window.innerHeight - top - viewportPad);
  if (maxHeight < 150 && rect.top > 170) {
    maxHeight = Math.min(320, rect.top - viewportPad - 6);
    top = Math.max(viewportPad, rect.top - maxHeight - 6);
  }

  csInlineDdx.dropdown.style.left = `${Math.round(left)}px`;
  csInlineDdx.dropdown.style.top = `${Math.round(top)}px`;
  csInlineDdx.dropdown.style.width = `${Math.round(Math.min(width, window.innerWidth - viewportPad - left))}px`;
  csInlineDdx.dropdown.style.maxHeight = `${Math.max(140, Math.round(maxHeight))}px`;
}

function csRenderInlineDdxDropdown(filterText) {
  if (!csInlineDdx.list) return;
  const query = String(filterText || '').trim().toLowerCase();
  const options = csCollectDdxOptions();
  const matches = query ? options.filter(name => name.toLowerCase().includes(query)) : options;
  csInlineDdx.options = matches;
  if (csInlineDdx.options.length === 0) {
    csInlineDdx.highlightedIndex = -1;
    csInlineDdx.list.innerHTML = '<div class="cs-inline-ddx-empty">No matching diagnoses.</div>';
    return;
  }
  if (csInlineDdx.highlightedIndex < 0 || csInlineDdx.highlightedIndex >= csInlineDdx.options.length) {
    csInlineDdx.highlightedIndex = 0;
  }
  csInlineDdx.list.innerHTML = csInlineDdx.options.map((name, idx) => {
    const active = idx === csInlineDdx.highlightedIndex ? ' active' : '';
    return `<button type="button" class="cs-inline-ddx-option${active}" data-idx="${idx}" role="option">${escapeHtml(name)}</button>`;
  }).join('');
}

function csApplyInlineDdxValue(value) {
  if (!csInlineDdx.activeInput) return;
  csInlineDdx.activeInput.value = String(value || '').trim();
  csInlineDdx.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
  csInlineDdx.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
  csCloseInlineDdxDropdown();
}

function csOpenInlineDdxDropdown(inputEl) {
  if (csMobileDdx.enabled) return;
  csEnsureInlineDdxDropdown();
  if (!csInlineDdx.dropdown) return;
  csInlineDdx.activeInput = inputEl;
  csInlineDdx.highlightedIndex = 0;
  csRenderInlineDdxDropdown(inputEl.value || '');
  csPositionInlineDdxDropdown();
  csInlineDdx.dropdown.classList.remove('hidden');
  inputEl.setAttribute('aria-expanded', 'true');
}

function csCloseInlineDdxDropdown() {
  if (!csInlineDdx.dropdown) return;
  if (csInlineDdx.activeInput) csInlineDdx.activeInput.setAttribute('aria-expanded', 'false');
  csInlineDdx.activeInput = null;
  csInlineDdx.options = [];
  csInlineDdx.highlightedIndex = -1;
  csInlineDdx.dropdown.classList.add('hidden');
}

function csMoveInlineDdxSelection(direction) {
  if (!csInlineDdx.options.length) return;
  if (csInlineDdx.highlightedIndex < 0) csInlineDdx.highlightedIndex = 0;
  else csInlineDdx.highlightedIndex = (csInlineDdx.highlightedIndex + direction + csInlineDdx.options.length) % csInlineDdx.options.length;
  csRenderInlineDdxDropdown(csInlineDdx.activeInput ? csInlineDdx.activeInput.value : '');
  const active = csInlineDdx.list ? csInlineDdx.list.querySelector('.cs-inline-ddx-option.active') : null;
  if (active && typeof active.scrollIntoView === 'function') active.scrollIntoView({ block: 'nearest' });
}

function csInitInlineDdxDropdown() {
  if (csMobileDdx.enabled) return;
  csEnsureInlineDdxDropdown();
  CS_MOBILE_DDX_INPUT_IDS.forEach(id => {
    const input = document.getElementById(id);
    if (!input || input.dataset.inlineDdxBound === '1') return;
    input.dataset.inlineDdxBound = '1';
    input.removeAttribute('list');
    input.autocomplete = 'off';
    input.setAttribute('aria-haspopup', 'listbox');
    input.setAttribute('aria-expanded', 'false');

    input.addEventListener('focus', () => csOpenInlineDdxDropdown(input));
    input.addEventListener('click', () => csOpenInlineDdxDropdown(input));
    input.addEventListener('input', () => {
      if (csInlineDdx.activeInput !== input) csOpenInlineDdxDropdown(input);
      else csRenderInlineDdxDropdown(input.value || '');
    });
    input.addEventListener('blur', () => {
      setTimeout(() => {
        if (csInlineDdx.activeInput === input) csCloseInlineDdxDropdown();
      }, 120);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (csInlineDdx.activeInput !== input) csOpenInlineDdxDropdown(input);
        else csMoveInlineDdxSelection(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (csInlineDdx.activeInput !== input) csOpenInlineDdxDropdown(input);
        else csMoveInlineDdxSelection(-1);
      } else if (e.key === 'Enter') {
        if (csInlineDdx.activeInput === input && csInlineDdx.options.length > 0) {
          e.preventDefault();
          const idx = csInlineDdx.highlightedIndex >= 0 ? csInlineDdx.highlightedIndex : 0;
          csApplyInlineDdxValue(csInlineDdx.options[idx]);
        }
      } else if (e.key === 'Escape') {
        csCloseInlineDdxDropdown();
      }
    });
  });
}

function populateDdxDatalist(forCase) {
  const dl = document.getElementById('ddx-options');
  if (!dl) return;
  dl.innerHTML = '';
  const seen = new Set();
  const addOption = (name) => {
    const clean = String(name || '').replace(/^⚠️\s*/, '').trim();
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) return;
    seen.add(key);
    const opt = document.createElement('option');
    opt.value = clean;
    dl.appendChild(opt);
  };

  const targetCase = forCase || (csState && csState.case ? csState.case : null);
  const regional = csCollectRegionDdxOptions(targetCase);
  if (regional.length > 0) {
    regional.forEach(addOption);
    return;
  }

  Object.values(DDX_LOGIC).forEach(arr => {
    (arr || []).forEach(dx => addOption(dx && dx.name));
  });
}

// Call this when a case is loaded so the dropdown reflects the case region.
// Keep key differentials available even if authored labels differ from DDX_LOGIC names.
function updateDdxDatalistForCase(c) {
  const dl = document.getElementById('ddx-options');
  if (!dl || !c) return;
  populateDdxDatalist(c);
  const existing = new Set(Array.from(dl.options).map(o => o.value.toLowerCase()));
  const keyDifferentials = Array.isArray(c.keyDifferentials) ? c.keyDifferentials : [];
  keyDifferentials.forEach(name => {
    const clean = csNormalizeDdxLabel(name);
    const key = clean.toLowerCase();
    if (clean && !csIsGenericDdxLabel(clean) && !existing.has(key)) {
      existing.add(key);
      const opt = document.createElement('option');
      opt.value = clean;
      dl.appendChild(opt);
    }
  });
  if (csMobileDdx.activeInput && csMobileDdx.search) {
    csRenderMobileDdxList(csMobileDdx.search.value);
  }
  if (csInlineDdx.activeInput) {
    csRenderInlineDdxDropdown(csInlineDdx.activeInput.value || '');
    csPositionInlineDdxDropdown();
  }
}

function csIsMmtScoredItem(item) {
  const txt = `${item?.name || ''} ${item?.result || ''}`.toLowerCase();
  return /\b[0-5](?:\+)?\s*\/\s*5\b/.test(txt);
}

function csNormalizeCaseExamCategoriesForMmt(c) {
  if (!c || c._mmtNormalized || !Array.isArray(c.examCategories)) return;

  const hasAdditionalMmt = (c.additionalTests || []).some(csIsMmtScoredItem);
  const movedMmtItems = [];
  const normalized = [];

  (c.examCategories || []).forEach(cat => {
    const items = Array.isArray(cat.items) ? cat.items : [];
    const keep = [];
    items.forEach(item => {
      if (csIsMmtScoredItem(item)) movedMmtItems.push(item);
      else keep.push(item);
    });
    if (keep.length > 0) normalized.push(Object.assign({}, cat, { items: keep }));
  });

  const mmtNameMatch = n => /\bmmt\b|manual muscle/i.test(String(n || ''));
  const dedupeItems = arr => {
    const seen = new Set();
    return (arr || []).filter(it => {
      const key = `${String(it?.name || '').toLowerCase()}|${String(it?.result || '').toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  let mmtIdx = normalized.findIndex(cat => mmtNameMatch(cat.name));
  if (mmtIdx < 0 && (movedMmtItems.length > 0 || hasAdditionalMmt)) {
    let insertIdx = normalized.findIndex(cat => /palpat/i.test(String(cat.name || '')));
    if (insertIdx < 0) insertIdx = normalized.findIndex(cat => /special|provoc|additional/i.test(String(cat.name || '')));
    if (insertIdx < 0) {
      const romIdx = normalized.findIndex(cat => /rom|range of motion|movement/i.test(String(cat.name || '')));
      insertIdx = romIdx >= 0 ? romIdx + 1 : normalized.length;
    }
    normalized.splice(insertIdx, 0, { name: 'MMT', items: [] });
    mmtIdx = insertIdx;
  }

  if (mmtIdx >= 0) {
    const existingItems = normalized[mmtIdx].items || [];
    normalized[mmtIdx] = Object.assign({}, normalized[mmtIdx], {
      name: 'MMT',
      items: dedupeItems([...existingItems, ...movedMmtItems]),
    });
  }

  c.examCategories = normalized.filter(cat =>
    Array.isArray(cat.items) && (cat.items.length > 0 || mmtNameMatch(cat.name))
  );
  c._mmtNormalized = true;
}

function csIsSpecialTestContext(categoryName, testName) {
  const cat = String(categoryName || '').toLowerCase();
  const name = String(testName || '').toLowerCase();
  return /special|provoc|additional/.test(cat) || /\b(test|sign|cluster|screen)\b/.test(name);
}

function csNormalizeExamTestName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function csNeutralizeSpecialTestResult(resultText, categoryName, testName) {
  let text = String(resultText || '').trim();
  if (!text) return text;
  if (!csIsSpecialTestContext(categoryName, testName)) {
    return csSoftenDiagnosticLanguage(text);
  }

  // Keep the primary finding sentence, then strip "answer-giving" diagnostic conclusions.
  const firstSentence = text.match(/^[^.!?]+[.!?]?/);
  text = (firstSentence ? firstSentence[0] : text).trim();

  text = text
    .replace(/\b[Cc]onfirm(?:s|ed)?\b[^.;:!?]*/g, '')
    .replace(/\b[Rr]ule(?:s|d)? out\b[^.;:!?]*/g, '')
    .replace(/\b[Ee]xclud(?:e|es|ed)\b[^.;:!?]*/g, '')
    .replace(/\b[Nn]ot (?:the )?primary[^.;:!?]*/g, '')
    .replace(/\b[Nn]ot implicated\b[^.;:!?]*/g, '')
    .replace(/\b[Nn]ot involved\b[^.;:!?]*/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/[—-]\s*$/g, '')
    .trim();

  text = csSoftenDiagnosticLanguage(text);
  if (text && !/[.!?]$/.test(text)) text += '.';
  return text;
}

function csRenderExamination() {
  const c = csState.case;
  if (!c) return;
  csNormalizeCaseExamCategoriesForMmt(c);
  const tokensLeft = csState.tokensTotal - csState.tokensUsed;

  // Token dots
  const dots = document.getElementById('csTokenDots');
  const count = document.getElementById('csTokenCount');
  if (dots) {
    dots.innerHTML = '';
    for (let i = 0; i < csState.tokensTotal; i++) {
      const d = document.createElement('div');
      d.className = 'cs-token' + (i < csState.tokensUsed ? ' used' : '');
      dots.appendChild(d);
    }
  }
  if (count) count.textContent = `${tokensLeft} remaining`;

  const flatList = document.getElementById('csExamFlatList');
  const tabsEl = document.getElementById('csExamTabs');
  if (!flatList) return;
  flatList.innerHTML = '';
  if (tabsEl) tabsEl.innerHTML = '';

  // Track which additional tests have been revealed
  if (!csState.redHerringWasted) csState.redHerringWasted = new Set();
  // Use the case's authored additionalTests — no random generation
  const authoredAdditionalTests = c.additionalTests || [];
  const existingTestKeys = new Set();
  (c.examCategories || []).forEach(cat => {
    (cat.items || []).forEach(item => {
      const key = csNormalizeExamTestName(item && item.name);
      if (key) existingTestKeys.add(key);
    });
  });
  const additionalSeenKeys = new Set();
  const additionalTests = authoredAdditionalTests.filter(test => {
    const key = csNormalizeExamTestName(test && test.name);
    if (!key) return false;
    if (existingTestKeys.has(key) || additionalSeenKeys.has(key)) return false;
    additionalSeenKeys.add(key);
    return true;
  });
  const additionalMmtTests = additionalTests.filter(csIsMmtScoredItem);
  const additionalNonMmtTests = additionalTests.filter(t => !csIsMmtScoredItem(t));

  const caseOrderKey = String(c.id || c.title || 'case');
  if (csState.examRowOrderCaseKey !== caseOrderKey) {
    csState.examRowOrderCaseKey = caseOrderKey;
    csState.examRowOrder = {};
  }
  if (!csState.examRowOrder || typeof csState.examRowOrder !== 'object') {
    csState.examRowOrder = {};
  }

  function getGroupRowOrder(groupOrderKey, baseEntries, extraEntries) {
    const allEntries = [...baseEntries, ...extraEntries];
    if (extraEntries.length === 0) return allEntries;

    const byKey = new Map(allEntries.map(entry => [entry.key, entry]));
    const savedOrder = csState.examRowOrder[groupOrderKey];
    if (Array.isArray(savedOrder) && savedOrder.length === allEntries.length && savedOrder.every(k => byKey.has(k))) {
      return savedOrder.map(k => byKey.get(k));
    }

    // Insert authored additional tests into random positions within the visible list.
    const ordered = baseEntries.slice();
    extraEntries.forEach(entry => {
      const idx = Math.floor(Math.random() * (ordered.length + 1));
      ordered.splice(idx, 0, entry);
    });

    csState.examRowOrder[groupOrderKey] = ordered.map(entry => entry.key);
    return ordered;
  }

  // Helper: make a row button
  function makeRow(name, right, isRevealed, isWasted, onClickFn) {
    const btn = document.createElement('button');
    btn.className = 'cs-exam-row' +
      (isWasted ? ' wasted' : '') +
      (isRevealed ? ' revealed' : '');
    btn.dataset.testName = name.toLowerCase();
    btn.type = 'button';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'cs-exam-row-name';
    nameSpan.textContent = csImperializeText(name);
    btn.appendChild(nameSpan);

    const rightDiv = document.createElement('span');
    rightDiv.className = 'cs-exam-row-right';
    rightDiv.innerHTML = csImperializeHtml(right);
    btn.appendChild(rightDiv);

    if (isWasted) {
      btn.disabled = true;
    } else if (isRevealed) {
      btn.style.cursor = 'default';
      btn.style.pointerEvents = 'none';
    } else if (tokensLeft <= 0) {
      btn.disabled = true;
      rightDiv.innerHTML = `<span class="cs-exam-row-cost">No tokens</span>`;
    } else if (onClickFn) {
      btn.addEventListener('click', onClickFn);
    }
    return btn;
  }

  // Build all groups (case categories + red herrings tab)
  const allGroups = [];

  // ── Build case category groups ──
  // Route additional tests into their matching category tabs.
  const specialTestsCatIdx = c.examCategories.findIndex(cat =>
    /special|provoc|additional/i.test(cat.name)
  );
  const mmtCatIdx = c.examCategories.findIndex(cat =>
    /\bmmt\b|manual muscle/i.test(String(cat.name || ''))
  );
  const specialMergeIdx = specialTestsCatIdx >= 0 ? specialTestsCatIdx : c.examCategories.length - 1;
  const mmtMergeIdx = mmtCatIdx >= 0 ? mmtCatIdx : specialMergeIdx;

  c.examCategories.forEach((cat, ci) => {
    const group = document.createElement('div');
    group.className = 'cs-exam-group';
    group.dataset.groupId = ci.toString();

    const extraItems = [];
    if (ci === specialMergeIdx && additionalNonMmtTests.length > 0) extraItems.push(...additionalNonMmtTests);
    if (ci === mmtMergeIdx && additionalMmtTests.length > 0) extraItems.push(...additionalMmtTests);
    const totalItems = cat.items.length + extraItems.length;

    const header = document.createElement('div');
    header.className = 'cs-exam-group-header';
    const revealedInCat = cat.items.filter(item => csState.revealed.find(r => r.name === item.name)).length
      + extraItems.filter(t => csState.redHerringWasted.has(t.name)).length;
    header.innerHTML = `
      <span class="cs-exam-group-name">${escapeHtml(csImperializeText(cat.name))}</span>
      <span class="cs-exam-group-line"></span>
      <span class="cs-exam-group-count">${revealedInCat > 0 ? revealedInCat + ' done · ' : ''}${totalItems} test${totalItems !== 1 ? 's' : ''}</span>`;
    group.appendChild(header);

    const baseEntries = cat.items.map((item, ii) => ({
      key: `core:${ii}:${csNormalizeExamTestName(item && item.name)}`,
      kind: 'core',
      item,
      itemIndex: ii
    }));
    const extraEntries = extraItems.map((testObj, idx) => ({
      key: `extra:${idx}:${csNormalizeExamTestName(testObj && testObj.name)}`,
      kind: 'extra',
      testObj
    }));
    const orderedEntries = getGroupRowOrder(`group:${ci}:${cat.name}`, baseEntries, extraEntries);

    orderedEntries.forEach(entry => {
      if (entry.kind === 'core') {
        const item = entry.item;
        const revealed = csState.revealed.find(r => r.name === item.name);
        let rightHtml;
        if (revealed) {
          const cls = revealed.valence === 'pos' ? 'positive' : revealed.valence === 'neg' ? 'negative' : 'neutral';
          const shownResult = csNeutralizeSpecialTestResult(revealed.result, cat.name, item.name);
          rightHtml = `<span class="cs-exam-row-result ${cls}">${escapeHtml(csImperializeText(shownResult))}</span>`;
        } else {
          rightHtml = `<span class="cs-exam-row-cost">− 1 token</span>`;
        }
        const row = makeRow(item.name, rightHtml, !!revealed, false,
          revealed ? null : () => csRevealTest(ci, entry.itemIndex)
        );
        group.appendChild(row);
        return;
      }

      const t = entry.testObj;
      const revealed = csState.redHerringWasted.has(t.name);
      let rightHtml;
      if (revealed) {
        const cls = t.valence === 'pos' ? 'positive' : t.valence === 'neg' ? 'negative' : 'neutral';
        const shownResult = csNeutralizeSpecialTestResult(t.result, cat.name, t.name);
        rightHtml = `<span class="cs-exam-row-result ${cls}">${escapeHtml(csImperializeText(shownResult))}</span>`;
      } else {
        rightHtml = `<span class="cs-exam-row-cost">− 1 token</span>`;
      }
      const row = makeRow(t.name, rightHtml, revealed, false,
        revealed ? null : () => csRevealAdditionalTest(t, row, cat.name)
      );
      if (!revealed && tokensLeft <= 0) { row.disabled = true; const ce = row.querySelector('.cs-exam-row-cost'); if (ce) ce.textContent = 'No tokens'; }
      group.appendChild(row);
    });

    flatList.appendChild(group);
    allGroups.push({ id: ci.toString(), label: cat.name, revealedCount: revealedInCat });
  });

  // additionalTests are merged into Special Tests / MMT tabs above — no separate group needed

  // ── Build tab bar ──
  if (tabsEl && allGroups.length > 1) {
    // Track active tab in csState
    if (!csState.activeExamTab) csState.activeExamTab = allGroups[0].id;

    function showTab(groupId) {
      csState.activeExamTab = groupId;
      flatList.querySelectorAll('.cs-exam-group').forEach(g => {
        g.style.display = g.dataset.groupId === groupId ? '' : 'none';
      });
      tabsEl.querySelectorAll('.cs-exam-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tabId === groupId);
      });
    }

    allGroups.forEach(grp => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'cs-exam-tab' + (grp.id === csState.activeExamTab ? ' active' : '');
      tab.dataset.tabId = grp.id;
      tab.textContent = csImperializeText(grp.label);
      if (grp.revealedCount > 0) {
        const badge = document.createElement('span');
        badge.className = 'cs-tab-badge';
        badge.textContent = grp.revealedCount;
        tab.appendChild(badge);
      }
      tab.addEventListener('click', () => showTab(grp.id));
      tabsEl.appendChild(tab);
    });

    showTab(csState.activeExamTab);
  }
}

function csRevealAdditionalTest(testObj, rowEl, categoryName) {
  if (csState.tokensUsed >= csState.tokensTotal) return;
  if (!csState.redHerringWasted) csState.redHerringWasted = new Set();
  if (csState.redHerringWasted.has(testObj.name)) return;

  csState.tokensUsed++;
  csState.redHerringWasted.add(testObj.name);

  // Animate token dot
  const dots = document.getElementById('csTokenDots');
  if (dots) {
    const tokenEls = dots.querySelectorAll('.cs-token');
    const justUsed = tokenEls[csState.tokensUsed - 1];
    if (justUsed) {
      justUsed.classList.add('pulse');
      setTimeout(() => { justUsed.classList.remove('pulse'); justUsed.classList.add('used'); }, 300);
    }
  }
  const count = document.getElementById('csTokenCount');
  if (count) count.textContent = `${csState.tokensTotal - csState.tokensUsed} remaining`;

  // Show the authored result with correct valence colour
  const cls = testObj.valence === 'pos' ? 'positive' : testObj.valence === 'neg' ? 'negative' : 'neutral';
  rowEl.classList.remove('wasted');
  rowEl.classList.add('revealed');
  rowEl.style.cursor = 'default';
  rowEl.style.pointerEvents = 'none';
  const rightDiv = rowEl.querySelector('.cs-exam-row-right');
  if (rightDiv) {
    const shownResult = csNeutralizeSpecialTestResult(testObj.result, categoryName, testObj.name);
    rightDiv.innerHTML = `<span class="cs-exam-row-result ${cls}">${escapeHtml(csImperializeText(shownResult))}</span>`;
  }

  // Disable remaining additional tests rows if no tokens left
  if (csState.tokensUsed >= csState.tokensTotal) {
    const flatList = document.getElementById('csExamFlatList');
    if (flatList) {
      flatList.querySelectorAll('.cs-exam-row:not(.revealed):not(.wasted)').forEach(r => {
        r.disabled = true;
        const costEl = r.querySelector('.cs-exam-row-cost');
        if (costEl) costEl.textContent = 'No tokens';
      });
    }
  }

  // Update the tab badge for whichever category the additional tests were merged into
  const tabsEl = document.getElementById('csExamTabs');
  if (tabsEl) {
    tabsEl.querySelectorAll('.cs-exam-tab').forEach(tab => {
      const groupId = tab.dataset.tabId;
      const grpEl = document.querySelector(`[data-group-id="${groupId}"]`);
      if (!grpEl) return;
      const rows = grpEl.querySelectorAll('.cs-exam-row');
      const done = Array.from(rows).filter(r => r.classList.contains('revealed')).length;
      let badge = tab.querySelector('.cs-tab-badge');
      if (done > 0) {
        if (!badge) { badge = document.createElement('span'); badge.className = 'cs-tab-badge'; tab.appendChild(badge); }
        badge.textContent = done;
      }
    });
  }
}

// Legacy stub — kept for any saved sessions that serialized old redHerringPool format
function csRevealRedHerring(testName, negResult, rowEl) {
  csRevealAdditionalTest({ name: testName, result: negResult || 'Negative.', valence: 'neg' }, rowEl, 'Special Tests');
}

function csRevealTest(catIdx, itemIdx) {
  if (csState.tokensUsed >= csState.tokensTotal) return;
  const c = csState.case;
  const item = c.examCategories[catIdx].items[itemIdx];
  if (csState.revealed.find(r => r.name === item.name)) return;

  csState.tokensUsed++;
  csState.revealed.push({ category: c.examCategories[catIdx].name, name: item.name, result: item.result, valence: item.valence });

  // Animate token dot
  const dots = document.getElementById('csTokenDots');
  if (dots) {
    const tokenEls = dots.querySelectorAll('.cs-token');
    const justUsed = tokenEls[csState.tokensUsed - 1];
    if (justUsed) {
      justUsed.classList.add('pulse');
      setTimeout(() => { justUsed.classList.remove('pulse'); justUsed.classList.add('used'); }, 300);
    }
  }
  const count = document.getElementById('csTokenCount');
  if (count) count.textContent = `${csState.tokensTotal - csState.tokensUsed} remaining`;

  // Update this row in-place (preserves search filter state)
  const flatList = document.getElementById('csExamFlatList');
  if (flatList) {
    const matchingRow = Array.from(flatList.querySelectorAll('.cs-exam-row')).find(
      r => r.dataset.testName === item.name.toLowerCase()
    );
    if (matchingRow) {
      matchingRow.classList.add('revealed');
      matchingRow.style.cursor = 'default';
      matchingRow.style.pointerEvents = 'none';
      const rightDiv = matchingRow.querySelector('.cs-exam-row-right');
      if (rightDiv) {
        const cls = item.valence === 'pos' ? 'positive' : item.valence === 'neg' ? 'negative' : 'neutral';
        const shownResult = csNeutralizeSpecialTestResult(item.result, c.examCategories[catIdx].name, item.name);
        rightDiv.innerHTML = `<span class="cs-exam-row-result ${cls}">${escapeHtml(csImperializeText(shownResult))}</span>`;
      }
    }
    // Update group header count
    const groups = flatList.querySelectorAll('.cs-exam-group');
    groups.forEach(grp => {
      const countEl = grp.querySelector('.cs-exam-group-count');
      if (!countEl) return;
      const rows = grp.querySelectorAll('.cs-exam-row');
      const total = rows.length;
      const done = Array.from(rows).filter(r => r.classList.contains('revealed')).length;
      if (total > 0 && countEl) {
        countEl.textContent = (done > 0 ? done + ' done · ' : '') + total + ' test' + (total !== 1 ? 's' : '');
      }
    });
    // Disable remaining unrevealed rows if no tokens left
    if (csState.tokensUsed >= csState.tokensTotal) {
      flatList.querySelectorAll('.cs-exam-row:not(.revealed):not(.wasted)').forEach(r => {
        r.disabled = true;
        const costEl = r.querySelector('.cs-exam-row-cost');
        if (costEl) costEl.textContent = 'No tokens';
      });
    }

    // Update tab badge count for the category tab
    const tabsEl = document.getElementById('csExamTabs');
    if (tabsEl) {
      const groupId = catIdx.toString();
      const tab = tabsEl.querySelector(`[data-tab-id="${groupId}"]`);
      if (tab) {
        const grpEl = document.querySelector(`[data-group-id="${groupId}"]`);
        const done = grpEl ? Array.from(grpEl.querySelectorAll('.cs-exam-row.revealed')).length : 0;
        let badge = tab.querySelector('.cs-tab-badge');
        if (done > 0) {
          if (!badge) { badge = document.createElement('span'); badge.className = 'cs-tab-badge'; tab.appendChild(badge); }
          badge.textContent = done;
        }
      }
    }
  }
}

function csRenderRevealedFindings() {
  const tags = document.getElementById('csRevealedTags');
  if (!tags) return;
  if (csState.revealed.length === 0) {
    tags.innerHTML = '<span style="font-size:0.74rem;color:var(--muted);font-style:italic;">No tests performed.</span>';
    return;
  }
  tags.innerHTML = csState.revealed.map(r =>
    `<div class="cs-rtag ${r.valence}"><strong>${r.name}</strong> — ${csNeutralizeSpecialTestResult(r.result, r.category, r.name)}</div>`
  ).join('');

  // Pre-fill updated DDx from initial if empty
  const set = (id, val) => { const el = document.getElementById(id); if (el && !el.value) el.value = val; };
  set('csUpdDdx1', csState.ddx1);
  set('csUpdDdx2', csState.ddx2);
  set('csUpdDdx3', csState.ddx3);
}

function csRenderRedFlags() {
  const c = csState.case;
  if (!c) return;
  const container = document.getElementById('csRedFlagsCheck');
  if (!container) return;
  container.innerHTML = '';
  c.redFlags.forEach((flag, i) => {
    const id = `rfCheck${i}`;
    // Use cs-rf-item structure to match the CSS that styles the custom checkbox via .cs-rf-cb
    const row = document.createElement('label');
    row.className = 'cs-rf-item';
    row.htmlFor = id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = id;
    cb.checked = csState.redFlags.includes(flag);
    cb.addEventListener('change', () => {
      if (cb.checked) { if (!csState.redFlags.includes(flag)) csState.redFlags.push(flag); }
      else { csState.redFlags = csState.redFlags.filter(f => f !== flag); }
    });

    // Custom checkbox visual — matches the CSS ::after rule on .cs-rf-cb
    const box = document.createElement('span');
    box.className = 'cs-rf-cb';

    const txt = document.createElement('span');
    txt.className = 'cs-rf-text';
    txt.textContent = flag;

    row.appendChild(cb);
    row.appendChild(box);
    row.appendChild(txt);
    container.appendChild(row);
  });

  // Improve flow: seed "Working diagnosis" from Updated Differential #1 if it's still empty.
  const finalDxInput = document.getElementById('csFinalDx');
  const updatedPrimaryDx = String(csState.updDdx1 || '').trim();
  const currentFinalDx = String((finalDxInput && finalDxInput.value) || csState.finalDx || '').trim();
  if (finalDxInput && !currentFinalDx && updatedPrimaryDx) {
    finalDxInput.value = updatedPrimaryDx;
    csState.finalDx = updatedPrimaryDx;
  }

  csRenderConfidenceLabel();
}

function csConfidenceLabel(value) {
  const numeric = csClampConfidence(value);
  if (numeric < 34) return 'Low';
  if (numeric > 66) return 'High';
  return 'Moderate';
}

function csClampConfidence(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 50;
  return Math.min(100, Math.max(0, numeric));
}

function csRenderConfidenceLabel() {
  const slider = document.getElementById('csConfidence');
  const valueEl = document.getElementById('csConfidenceValue');
  if (!slider) return;
  const confidence = csClampConfidence(slider.value);
  slider.value = String(confidence);
  const label = csConfidenceLabel(confidence);
  if (valueEl) valueEl.textContent = `${label} (${Math.round(confidence)}%)`;
  slider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${confidence}%, var(--border) ${confidence}%, var(--border) 100%)`;
  csState.confidence = confidence;
}

// Sanitize strings before injecting into innerHTML to prevent XSS
function escapeHtml(str) {
  return String(str === null || str === undefined ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function csFormatImperialNumber(value, decimals) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  const fixed = n.toFixed(Math.max(0, Number(decimals) || 0));
  return fixed
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.0+$/, '');
}

function csMetricToImperial(value, rawUnit) {
  const n = Number(value);
  if (!Number.isFinite(n)) return { value: String(value), unit: String(rawUnit || '') };
  const unit = String(rawUnit || '').toLowerCase();

  if (unit === 'kg') {
    const lb = n * 2.2046226218;
    return { value: csFormatImperialNumber(lb, lb >= 20 ? 0 : 1), unit: 'lb' };
  }
  if (unit === 'km') {
    const mi = n * 0.6213711922;
    return { value: csFormatImperialNumber(mi, mi >= 20 ? 0 : 1), unit: 'mi' };
  }
  if (unit === 'cm') {
    const inches = n * 0.3937007874;
    return { value: csFormatImperialNumber(inches, 1), unit: 'in' };
  }
  if (unit === 'mm') {
    const inches = n * 0.0393700787;
    return { value: csFormatImperialNumber(inches, 2), unit: 'in' };
  }
  if (unit === 'm' || unit === 'meter' || unit === 'meters' || unit === 'metre' || unit === 'metres') {
    if (n >= 1609.34) {
      return { value: csFormatImperialNumber(n / 1609.34, 1), unit: 'mi' };
    }
    return { value: csFormatImperialNumber(n * 3.280839895, 0), unit: 'ft' };
  }
  return { value: String(value), unit: String(rawUnit || '') };
}

function csImperializeText(text) {
  if (text === null || text === undefined) return '';
  let out = String(text);

  // Convert ranges first, then single values.
  out = out.replace(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*(kg|km|cm|mm|m(?:eters?|etres?)?)\b/gi, (_, a, b, unit) => {
    const left = csMetricToImperial(a, unit);
    const right = csMetricToImperial(b, unit);
    if (left.unit === right.unit) return `${left.value}–${right.value} ${left.unit}`;
    return `${left.value} ${left.unit}–${right.value} ${right.unit}`;
  });

  out = out.replace(/(\d+(?:\.\d+)?)\s*(kg|km|cm|mm|m(?:eters?|etres?)?)\b/gi, (_, value, unit) => {
    const converted = csMetricToImperial(value, unit);
    return `${converted.value} ${converted.unit}`;
  });

  return out;
}

function csImperializeHtml(html) {
  const wrap = document.createElement('div');
  wrap.innerHTML = String(html || '');
  const walker = document.createTreeWalker(wrap, NodeFilter.SHOW_TEXT, null);
  let node = walker.nextNode();
  while (node) {
    node.nodeValue = csImperializeText(node.nodeValue);
    node = walker.nextNode();
  }
  return wrap.innerHTML;
}

function _containsAlias(text, aliases) {
  const v = (text || '').toLowerCase().trim();
  return (aliases || []).some(a => {
    const alias = String(a || '').toLowerCase();
    return alias && (v.includes(alias) || (alias.includes(v) && v.length > 3));
  });
}

function _plainText(v) {
  return String(v || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^\w\s/+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function _extractCriterionAnchors(criterionText) {
  const cleaned = _plainText(criterionText).toLowerCase();
  if (!cleaned) return [];
  const chunks = cleaned
    .split(/[+,;/]|\band\b/g)
    .map(s => s
      .replace(/\b(management|reasoning|correct|correctly|primary|diagnosis|includes|include|involves|involve|identifies|identified|identify|recognizes|recognises|cites|targets|focuses|focus|is|are|as|to|for|of|the|a|an|both|completed|screened|screening|appropriate|pathway|consideration|need|needs)\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim())
    .filter(Boolean)
    .filter(s => s.length >= 4);
  return [...new Set(chunks)];
}

function _extractCaseFindingAnchors(c) {
  const findings = Array.isArray(c?.keyFindings) ? c.keyFindings : [];
  const anchors = [];
  findings.slice(0, 6).forEach(f => {
    const raw = typeof f === 'string' ? f : (f && f.text) ? f.text : '';
    const plain = _plainText(raw).toLowerCase();
    if (!plain) return;
    const lead = plain.split('—')[0].trim();
    const shortLead = lead.split(/\s+/).filter(Boolean).slice(0, 6).join(' ');
    if (shortLead.length >= 6) anchors.push(shortLead);
  });
  return [...new Set(anchors)];
}

function _anchorHitCount(text, anchors) {
  const src = (text || '').toLowerCase();
  const srcWords = new Set((src.match(/[a-z0-9]+/g) || []).filter(w => w.length > 2));
  const ignore = new Set(['with','without','from','into','that','this','then','than','were','have','has','had','you','your','for']);

  let hits = 0;
  (anchors || []).forEach(anchor => {
    const a = String(anchor || '').toLowerCase().trim();
    if (!a) return;
    if (src.includes(a)) { hits += 1; return; }
    const aWords = (a.match(/[a-z0-9]+/g) || []).filter(w => w.length > 2 && !ignore.has(w));
    if (!aWords.length) return;
    let matched = 0;
    aWords.forEach(w => { if (srcWords.has(w)) matched += 1; });
    const required = aWords.length <= 2
      ? aWords.length
      : aWords.length <= 5
      ? aWords.length - 1
      : Math.max(2, Math.ceil(aWords.length * 0.6));
    if (matched >= required) hits += 1;
  });
  return hits;
}

function _scoreManagement(c, managementText, maxWeight, criterionText) {
  const mgmt = (managementText || '').toLowerCase().trim();
  if (mgmt.length < 10) return { score: 0, note: 'No management provided' };

  const criterionAnchors = _extractCriterionAnchors(criterionText);
  const findingAnchors = _extractCaseFindingAnchors(c);
  const mentionsDx = _containsAlias(mgmt, c.correctDxAliases || []);
  const criterionHits = _anchorHitCount(mgmt, criterionAnchors);
  const findingHits = _anchorHitCount(mgmt, findingAnchors);
  const safetyTerms = ['urgent','immediate','refer','referral','emergency','crutches','non-weight-bearing'];
  const safetyHits = safetyTerms.filter(t => mgmt.includes(t)).length;

  if (criterionHits >= 2 || (criterionHits >= 1 && (findingHits >= 1 || mentionsDx || safetyHits > 0))) {
    return { score: maxWeight, note: 'Management addressed case-specific actions and safety priorities' };
  }
  if (criterionHits >= 1 || (findingHits >= 1 && (mentionsDx || safetyHits > 0))) {
    return { score: Math.max(1, Math.round(maxWeight * 0.75)), note: 'Management was mostly aligned with case priorities' };
  }
  return { score: Math.max(1, Math.round(maxWeight * 0.45)), note: 'Management was broad; add more case-specific detail for full credit' };
}

function _scoreReasoning(c, reasoningText, maxWeight, criterionText) {
  const txt = (reasoningText || '').toLowerCase().trim();
  if (txt.length < 20) return { score: 0, note: 'No reasoning provided' };

  const links = ['because','therefore','consistent with','less likely','ruled out','differential','given'];
  const hasLinkingLanguage = links.some(k => txt.includes(k));
  const mentionsDx = _containsAlias(txt, c.correctDxAliases || []);
  const criterionAnchors = _extractCriterionAnchors(criterionText);
  const findingAnchors = _extractCaseFindingAnchors(c);
  const differentialAnchors = (c.keyDifferentials || []).map(d => _plainText(d).toLowerCase());
  const criterionHits = _anchorHitCount(txt, criterionAnchors);
  const findingHits = _anchorHitCount(txt, findingAnchors);
  const differentialHits = _anchorHitCount(txt, differentialAnchors);
  const comparesAlternatives = /less likely|ruled out|rule out|exclude|versus|vs\.?|differential|unlikely/.test(txt) || differentialHits > 0;

  if (mentionsDx && hasLinkingLanguage && criterionHits >= 1 && findingHits >= 1) {
    return { score: maxWeight, note: 'Reasoning connected diagnosis to discriminating case findings' };
  }
  if (hasLinkingLanguage && ((criterionHits >= 1 && mentionsDx) || (findingHits >= 1 && comparesAlternatives))) {
    return { score: Math.max(1, Math.round(maxWeight * 0.8)), note: 'Reasoning was specific and on track, with room for sharper discrimination' };
  }
  if ((criterionHits >= 1 || findingHits >= 1) && (mentionsDx || hasLinkingLanguage)) {
    return { score: Math.max(1, Math.round(maxWeight * 0.65)), note: 'Reasoning was present but could be more case-specific' };
  }
  return { score: Math.max(1, Math.round(maxWeight * 0.4)), note: 'Reasoning provided; link it more directly to key discriminating findings for full credit' };
}

function csImagingChoiceLabel(value) {
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  if (value === 'not_now') return 'Not at this time';
  return 'Not selected';
}

function csExpectedImagingSuggestion(c) {
  const typedDxRaw = String(csState.finalDx || '').trim();
  const typedDx = typedDxRaw ? csNormalizeDdxLabel(typedDxRaw) : '';
  const fallbackDx = csNormalizeDdxLabel(c?.correctDx || '');
  const basisDx = typedDx || fallbackDx || '';
  const dxText = basisDx.toLowerCase();

  // Highest priority: diagnoses where imaging workup is typically warranted now.
  const yesPattern = /\b(acl|pcl|mcl|lcl|ucl|meniscal tear|meniscus tear|fracture|stress fracture|rupture|dislocation|myelopathy|cauda equina|mscc|metastatic|cord compression|tumou?r|cancer|osteosarcoma|avulsion|full thickness rotator cuff tear|massive rotator cuff tear)\b/;
  if (yesPattern.test(dxText)) {
    return { expected: 'yes', basisDx, basisSource: typedDx ? 'your suspected diagnosis' : 'case diagnosis' };
  }

  // Common PT diagnoses where imaging is often deferred unless non-response/red flags.
  const notNowPattern = /\b(osteoarthritis| oa |degenerative|spondylosis|stenosis|tendinopathy|tendonopathy|tendinitis|fasciitis|bursitis|strain|sprain|sciatica|radiculopathy|impingement|labral|epicondylalgia|instability|sacroiliac|sij|frozen shoulder|adhesive capsulitis)\b/;
  if (notNowPattern.test(` ${dxText} `)) {
    return { expected: 'not_now', basisDx, basisSource: typedDx ? 'your suspected diagnosis' : 'case diagnosis' };
  }

  // Diagnoses where routine imaging is generally not needed initially.
  const noPattern = /\b(mechanical neck pain|postural|patellofemoral pain|pfps|itbs|iliotibial band syndrome|chronic non specific low back pain|non specific low back pain)\b/;
  if (noPattern.test(dxText)) {
    return { expected: 'no', basisDx, basisSource: typedDx ? 'your suspected diagnosis' : 'case diagnosis' };
  }

  // Conservative default for uncertain labels.
  return { expected: 'not_now', basisDx, basisSource: typedDx ? 'your suspected diagnosis' : 'case diagnosis' };
}

function csScoreImagingSuggestion(c, selection, maxWeight) {
  const choice = String(selection || '').trim();
  const expectedCtx = csExpectedImagingSuggestion(c);
  const expected = expectedCtx.expected;
  const expectedLabel = csImagingChoiceLabel(expected);
  const choiceLabel = csImagingChoiceLabel(choice);
  const basisDxText = expectedCtx.basisDx ? ` (${expectedCtx.basisDx})` : '';
  const basisSource = expectedCtx.basisSource || 'case context';

  if (!choice) {
    return {
      score: Math.max(1, Math.round(maxWeight * 0.5)),
      maxScore: maxWeight,
      note: `No selection made — expected ${expectedLabel.toLowerCase()} based on ${basisSource}${basisDxText}`,
    };
  }
  if (choice === expected) {
    return { score: maxWeight, maxScore: maxWeight, note: `Appropriate recommendation (${choiceLabel}) based on ${basisSource}${basisDxText}` };
  }

  const reasonablyClose =
    (expected === 'yes' && choice === 'not_now') ||
    (expected === 'no' && choice === 'not_now') ||
    (expected === 'not_now' && (choice === 'yes' || choice === 'no'));

  if (reasonablyClose) {
    return {
      score: Math.max(1, Math.round(maxWeight * 0.5)),
      maxScore: maxWeight,
      note: `Reasonable recommendation (${choiceLabel}); best-fit was ${expectedLabel} based on ${basisSource}${basisDxText}`,
    };
  }

  return {
    score: 0,
    maxScore: maxWeight,
    note: `Recommendation (${choiceLabel}) was less aligned; best-fit was ${expectedLabel} based on ${basisSource}${basisDxText}`,
  };
}

function csTrimReasoningText(v, maxLen) {
  const clean = String(_plainText(v || '')).replace(/\s+/g, ' ').trim();
  const limit = Number(maxLen) > 0 ? Number(maxLen) : 180;
  if (!clean) return '';
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, Math.max(0, limit - 1)).trim()}…`;
}

function csJoinReasoningBits(list, maxItems) {
  const items = (list || []).filter(Boolean).slice(0, Math.max(1, maxItems || 3));
  if (!items.length) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join('; ')}; and ${items[items.length - 1]}`;
}

function csCollectReasoningEvidence(c, opts) {
  const cfg = opts || {};
  const posLimit = Number(cfg.posLimit) > 0 ? Number(cfg.posLimit) : 5;
  const negLimit = Number(cfg.negLimit) > 0 ? Number(cfg.negLimit) : 4;
  const hxLimit = Number(cfg.historyLimit) > 0 ? Number(cfg.historyLimit) : 2;

  const positive = [];
  const negative = [];
  const history = [];
  const seen = new Set();

  const pushUnique = (bucket, text, key, limit) => {
    if (!text || bucket.length >= limit) return;
    const normalized = String(key || text).toLowerCase();
    if (seen.has(normalized)) return;
    seen.add(normalized);
    bucket.push(text);
  };

  (c.keyFindings || []).forEach(f => {
    const text = csTrimReasoningText(f && f.text, 180);
    pushUnique(positive, text, `key:${text}`, posLimit);
  });

  const collectExamItem = (item) => {
    if (!item) return;
    const val = String(item.valence || '').toLowerCase();
    const name = csTrimReasoningText(item.name, 70);
    const result = csTrimReasoningText(item.result, 180);
    if (!name || !result) return;
    const line = `${name}: ${result}`;
    if (val === 'pos') pushUnique(positive, line, `pos:${name}:${result}`, posLimit);
    if (val === 'neg') pushUnique(negative, line, `neg:${name}:${result}`, negLimit);
  };

  (c.examCategories || []).forEach(cat => {
    (cat && cat.items || []).forEach(collectExamItem);
  });

  (c.additionalTests || []).forEach(collectExamItem);

  const vignetteText = csTrimReasoningText(c && c.vignette ? _plainText(c.vignette) : '', 1200);
  if (vignetteText) {
    const sentences = (vignetteText.match(/[^.!?]+[.!?]?/g) || [vignetteText]).map(s => s.trim()).filter(Boolean);
    const prioritised = sentences.filter(s =>
      /\b(night pain|weight[- ]?bear|unable|sudden|gradual|swelling|weak|numb|tingling|stiff|worse|better|trauma|pop|instability|incontinence|fever|weight loss|red flag)\b/i.test(s)
    );
    const source = prioritised.length ? prioritised : sentences;
    source.slice(0, hxLimit).forEach(s => {
      const text = csTrimReasoningText(s, 180);
      pushUnique(history, text, `hx:${text}`, hxLimit);
    });
  }

  return { positive, negative, history };
}

function csBuildPatientReasoningFallback(c) {
  const evidence = csCollectReasoningEvidence(c, { posLimit: 5, negLimit: 4, historyLimit: 2 });
  const differentials = (c.keyDifferentials || []).map(d => csNormalizeDdxLabel(d)).filter(Boolean).slice(0, 3);
  const imagingCtx = csExpectedImagingSuggestion(c);
  const isUrgentPattern =
    imagingCtx.expected === 'yes' ||
    /\b(urgent|emergency|red flag|fracture|rupture|myelopathy|cauda equina|metastatic|mscc|dislocation|tumou?r|cancer)\b/i.test(String(c.correctDx || ''));

  const positiveSummaryBits = [];
  if (evidence.history.length) {
    positiveSummaryBits.push(`history clues included ${csJoinReasoningBits(evidence.history, 2)}`);
  }
  if (evidence.positive.length) {
    positiveSummaryBits.push(`exam evidence included ${csJoinReasoningBits(evidence.positive, 3)}`);
  }
  const findingSummary = positiveSummaryBits.length
    ? `This diagnosis fits because ${positiveSummaryBits.join('. ')}.`
    : 'This diagnosis fits because the history pattern and objective exam findings align with the expected presentation.';

  let lessLikely = 'Other common causes were less likely because their expected findings were not present on this exam.';
  if (differentials.length && evidence.negative.length) {
    lessLikely = `${csJoinReasoningBits(differentials, 3)} were less likely because findings such as ${csJoinReasoningBits(evidence.negative, 3)} argued against them.`;
  } else if (differentials.length) {
    lessLikely = `${csJoinReasoningBits(differentials, 3)} were less likely because the strongest findings matched ${c.correctDx} more closely.`;
  } else if (evidence.negative.length) {
    lessLikely = `Other common causes were less likely because findings such as ${csJoinReasoningBits(evidence.negative, 3)} were absent.`;
  }

  const recoveryText = isUrgentPattern
    ? 'This pattern can represent a higher-risk injury, so recovery depends on confirming severity quickly and protecting the area before progressive rehab.'
    : 'Most people improve with structured loading, symptom-guided progression, and regular reassessment over the next several weeks.';

  const nextSteps = isUrgentPattern
    ? 'Stop provoking activity, protect the region, and arrange urgent medical review and imaging as recommended before continuing rehab.'
    : 'Continue clinician-guided rehab, track your 24-hour symptom response after loading, and progress only when pain and function are steadily improving.';

  return `<span class="cs-ai-section-label">Expert Reasoning Report</span>
    <p><strong>1. LIKELY DIAGNOSIS</strong> — ${escapeHtml(c.correctDx)}.</p>
    <p><strong>2. WHY THIS DIAGNOSIS FITS</strong> — ${escapeHtml(findingSummary)}</p>
    <p><strong>3. WHY OTHER COMMON CAUSES ARE LESS LIKELY</strong> — ${escapeHtml(lessLikely)}</p>
    <p><strong>4. WHAT THIS MEANS FOR RECOVERY</strong> — ${escapeHtml(recoveryText)}</p>
    <p><strong>5. NEXT STEPS</strong> — ${escapeHtml(nextSteps)}</p>`;
}

const CS_WEIGHTED_SCORE_MODEL = Object.freeze({
  differential: 40,
  testSelection: 25,
  redFlags: 15,
  efficiency: 20
});

const CS_WEIGHTED_ESCALATION_TERMS = [
  'urgent', 'immediate', 'emergency', 'same-day', 'refer', 'referral',
  'non-weight-bearing', 'non weight bearing', 'crutches', 'mri', 'ct', 'x-ray'
];

function csWeightedNormalize(value) {
  return String(value || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function csWeightedClamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function csWeightedList(list) {
  return (Array.isArray(list) ? list : []).map(v => String(v || '').trim()).filter(Boolean);
}

function csWeightedUnique(list) {
  const seen = new Set();
  const out = [];
  csWeightedList(list).forEach((value) => {
    const key = csWeightedNormalize(value);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(value);
  });
  return out;
}

function csWeightedToSet(list) {
  const out = new Set();
  csWeightedList(list).forEach(v => out.add(csWeightedNormalize(v)));
  return out;
}

function csWeightedDiagnosisMatches(input, aliases) {
  const src = csWeightedNormalize(input);
  if (!src || src.length < 3) return false;
  return csWeightedList(aliases).some((alias) => {
    const target = csWeightedNormalize(alias);
    return target && (src.includes(target) || (target.includes(src) && src.length >= 4));
  });
}

function csWeightedCollectRankedDifferential() {
  return csWeightedUnique([
    csState.finalDx,
    csState.updDdx1, csState.updDdx2, csState.updDdx3,
    csState.ddx1, csState.ddx2, csState.ddx3
  ]);
}

function csWeightedBuildConfig(c) {
  const raw = (c && c.scoring && typeof c.scoring === 'object') ? c.scoring : {};
  const testsRaw = (raw.tests && typeof raw.tests === 'object') ? raw.tests : {};
  const redFlagsRaw = (raw.redFlags && typeof raw.redFlags === 'object') ? raw.redFlags : {};
  const efficiencyRaw = (raw.efficiency && typeof raw.efficiency === 'object') ? raw.efficiency : {};
  const differentialRaw = (raw.differential && typeof raw.differential === 'object') ? raw.differential : {};

  const defaultIdealMax = Math.min(5, Math.max(3, Number(csState.tokensTotal || 8) - 1));

  return {
    differential: {
      maxPoints: CS_WEIGHTED_SCORE_MODEL.differential,
      plausibleRelated: csWeightedList(differentialRaw.plausibleRelated || c.keyDifferentials || [])
    },
    tests: {
      maxPoints: CS_WEIGHTED_SCORE_MODEL.testSelection,
      keyTests: csWeightedList(testsRaw.keyTests),
      supportiveTests: csWeightedList(testsRaw.supportiveTests),
      neutralTests: csWeightedList(testsRaw.neutralTests),
      irrelevantTests: csWeightedList(testsRaw.irrelevantTests),
      points: {
        key: Number.isFinite(Number(testsRaw.points && testsRaw.points.key)) ? Number(testsRaw.points.key) : 5,
        supportive: Number.isFinite(Number(testsRaw.points && testsRaw.points.supportive)) ? Number(testsRaw.points.supportive) : 2,
        neutral: Number.isFinite(Number(testsRaw.points && testsRaw.points.neutral)) ? Number(testsRaw.points.neutral) : 0,
        irrelevantPenalty: Number.isFinite(Number(testsRaw.points && testsRaw.points.irrelevantPenalty)) ? Number(testsRaw.points.irrelevantPenalty) : 2,
      }
    },
    redFlags: {
      maxPoints: CS_WEIGHTED_SCORE_MODEL.redFlags,
      mode: String(redFlagsRaw.mode || '').trim().toLowerCase(),
      criticalFlags: csWeightedList(redFlagsRaw.criticalFlags || []),
      escalationRequired: redFlagsRaw.escalationRequired !== false
    },
    efficiency: {
      maxPoints: CS_WEIGHTED_SCORE_MODEL.efficiency,
      idealMin: Number.isFinite(Number(efficiencyRaw.idealMin)) ? Number(efficiencyRaw.idealMin) : 3,
      idealMax: Number.isFinite(Number(efficiencyRaw.idealMax)) ? Number(efficiencyRaw.idealMax) : defaultIdealMax,
      softMax: Number.isFinite(Number(efficiencyRaw.softMax)) ? Number(efficiencyRaw.softMax) : Math.min(Number(csState.tokensTotal || 8), defaultIdealMax + 2),
      underusePenalty: Number.isFinite(Number(efficiencyRaw.underusePenalty)) ? Number(efficiencyRaw.underusePenalty) : 3,
      overusePenalty: Number.isFinite(Number(efficiencyRaw.overusePenalty)) ? Number(efficiencyRaw.overusePenalty) : 2,
      excessivePenalty: Number.isFinite(Number(efficiencyRaw.excessivePenalty)) ? Number(efficiencyRaw.excessivePenalty) : 3,
      irrelevantPenalty: Number.isFinite(Number(efficiencyRaw.irrelevantPenalty)) ? Number(efficiencyRaw.irrelevantPenalty) : 3
    }
  };
}

function csWeightedInferRedFlagMode(c, configuredMode) {
  if (configuredMode === 'identify' || configuredMode === 'rule_out') return configuredMode;
  const src = csWeightedNormalize(`${c && c.title ? c.title : ''} ${c && c.correctDx ? c.correctDx : ''} ${c && c.expertReasoningPrompt ? c.expertReasoningPrompt : ''}`);
  const highRiskPattern = /(urgent|emergency|red flag|cauda equina|myelopathy|stress fracture|spinal cord compression|metastatic|mscc|fracture suspected|rupture suspected|surgical referral)/;
  return highRiskPattern.test(src) ? 'identify' : 'rule_out';
}

function csWeightedBuildTestBuckets(c, testsCfg) {
  const key = csWeightedToSet(testsCfg.keyTests);
  const supportive = csWeightedToSet(testsCfg.supportiveTests);
  const neutral = csWeightedToSet(testsCfg.neutralTests);
  const irrelevant = csWeightedToSet(testsCfg.irrelevantTests);
  const hasBucket = (name) => key.has(name) || supportive.has(name) || neutral.has(name) || irrelevant.has(name);

  (c.examCategories || []).forEach((cat) => {
    (cat && cat.items || []).forEach((item) => {
      const name = csWeightedNormalize(item && item.name ? item.name : '');
      if (!name || hasBucket(name)) return;
      const valence = String(item && item.valence || '').toLowerCase();
      if (valence === 'pos') key.add(name);
      else if (valence === 'neg') supportive.add(name);
      else neutral.add(name);
    });
  });

  (c.additionalTests || []).forEach((item) => {
    const name = csWeightedNormalize(item && item.name ? item.name : '');
    if (!name || hasBucket(name)) return;
    const valence = String(item && item.valence || '').toLowerCase();
    if (valence === 'pos') key.add(name);
    else if (valence === 'neg') supportive.add(name);
    else neutral.add(name);
  });

  csWeightedList(csState.redHerringPool || []).forEach(name => irrelevant.add(csWeightedNormalize(name)));
  return { key, supportive, neutral, irrelevant };
}

function csWeightedScoreDifferential(c, cfg) {
  const maxPoints = cfg.differential.maxPoints;
  const ranked = csWeightedCollectRankedDifferential();
  const primaryDx = ranked[0] || '';
  const correctAliases = csWeightedUnique([c.correctDx].concat(c.correctDxAliases || []));
  const primaryCorrect = csWeightedDiagnosisMatches(primaryDx, correctAliases);
  const includedIndex = ranked.findIndex(dx => csWeightedDiagnosisMatches(dx, correctAliases));
  const plausibleAliases = csWeightedUnique((cfg.differential.plausibleRelated || []).concat(c.keyDifferentials || []));
  const plausibleCount = ranked.filter(dx => csWeightedDiagnosisMatches(dx, plausibleAliases)).length;

  if (primaryCorrect) {
    return {
      key: 'differential',
      label: 'Differential Diagnosis',
      score: maxPoints,
      maxScore: maxPoints,
      note: `Correct diagnosis selected as primary (${c.correctDx}).`,
      details: { primaryCorrect: true, includedIndex: 0, plausibleCount: plausibleCount, ranked: ranked }
    };
  }
  if (includedIndex >= 0) {
    return {
      key: 'differential',
      label: 'Differential Diagnosis',
      score: 25,
      maxScore: maxPoints,
      note: 'Correct diagnosis included in your differential but not ranked first.',
      details: { primaryCorrect: false, includedIndex: includedIndex, plausibleCount: plausibleCount, ranked: ranked }
    };
  }
  if (plausibleCount > 0) {
    return {
      key: 'differential',
      label: 'Differential Diagnosis',
      score: 10,
      maxScore: maxPoints,
      note: 'Plausible related diagnoses were listed, but the best-fit diagnosis was omitted.',
      details: { primaryCorrect: false, includedIndex: -1, plausibleCount: plausibleCount, ranked: ranked }
    };
  }
  return {
    key: 'differential',
    label: 'Differential Diagnosis',
    score: 0,
    maxScore: maxPoints,
    note: 'Differential list was clinically inappropriate for this presentation.',
    details: { primaryCorrect: false, includedIndex: -1, plausibleCount: 0, ranked: ranked }
  };
}

function csWeightedScoreTests(c, cfg) {
  const maxPoints = cfg.tests.maxPoints;
  const buckets = csWeightedBuildTestBuckets(c, cfg.tests);
  const selectedCaseTests = csWeightedUnique((csState.revealed || []).map(r => r && r.name ? r.name : ''));
  const selectedIrrelevant = csWeightedUnique(Array.from(csState.redHerringWasted || []));

  let keyHits = 0;
  let supportiveHits = 0;
  let neutralHits = 0;
  let irrelevantHits = 0;
  let raw = 0;

  selectedCaseTests.forEach((name) => {
    const key = csWeightedNormalize(name);
    if (buckets.key.has(key)) {
      keyHits += 1;
      raw += cfg.tests.points.key;
    } else if (buckets.supportive.has(key)) {
      supportiveHits += 1;
      raw += cfg.tests.points.supportive;
    } else if (buckets.irrelevant.has(key)) {
      irrelevantHits += 1;
      raw -= cfg.tests.points.irrelevantPenalty;
    } else {
      neutralHits += 1;
      raw += cfg.tests.points.neutral;
    }
  });

  selectedIrrelevant.forEach(() => {
    irrelevantHits += 1;
    raw -= cfg.tests.points.irrelevantPenalty;
  });

  const score = csWeightedClamp(Math.round(raw), 0, maxPoints);
  const selectedTotal = selectedCaseTests.length + selectedIrrelevant.length;
  const parts = [];
  if (keyHits > 0) parts.push(`${keyHits} high-value`);
  if (supportiveHits > 0) parts.push(`${supportiveHits} supportive`);
  if (neutralHits > 0) parts.push(`${neutralHits} neutral`);
  if (irrelevantHits > 0) parts.push(`${irrelevantHits} irrelevant`);
  const note = selectedTotal > 0
    ? `Selected tests: ${parts.join(', ') || 'none scored'}.`
    : 'No examination tests selected.';

  return {
    key: 'tests',
    label: 'Test Selection',
    score: score,
    maxScore: maxPoints,
    note: note,
    details: {
      selectedTotal: selectedTotal,
      keyHits: keyHits,
      supportiveHits: supportiveHits,
      neutralHits: neutralHits,
      irrelevantHits: irrelevantHits,
      selectedCaseTests: selectedCaseTests,
      selectedIrrelevant: selectedIrrelevant
    }
  };
}

function csWeightedFlagMatch(selected, target) {
  const a = csWeightedNormalize(selected);
  const b = csWeightedNormalize(target);
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
}

function csWeightedHasEscalation(c) {
  const managementText = csWeightedNormalize(`${csState.management || ''} ${csState.finalReasoning || ''}`);
  if (CS_WEIGHTED_ESCALATION_TERMS.some(term => managementText.includes(term))) return true;
  if (String(csState.imagingSuggestion || '').trim().toLowerCase() === 'yes') return true;
  return false;
}

function csWeightedScoreRedFlags(c, cfg) {
  const maxPoints = cfg.redFlags.maxPoints;
  const mode = csWeightedInferRedFlagMode(c, cfg.redFlags.mode);
  const selected = csWeightedList(csState.redFlags || []);
  const selectedCount = selected.length;
  const critical = cfg.redFlags.criticalFlags.length
    ? cfg.redFlags.criticalFlags
    : (mode === 'identify' ? (c.redFlags || []).slice(0, 2) : []);
  const criticalHits = selected.filter(flag => critical.some(target => csWeightedFlagMatch(flag, target))).length;
  const escalationHit = csWeightedHasEscalation(c);

  if (mode === 'identify') {
    if (selectedCount === 0) {
      return {
        key: 'red_flags',
        label: 'Red Flag Recognition',
        score: 0,
        maxScore: maxPoints,
        note: 'Meaningful safety concerns were not documented in this high-risk case.',
        details: { mode: mode, selectedCount: selectedCount, criticalHits: criticalHits, escalationHit: escalationHit }
      };
    }
    if (criticalHits > 0 && (!cfg.redFlags.escalationRequired || escalationHit)) {
      return {
        key: 'red_flags',
        label: 'Red Flag Recognition',
        score: maxPoints,
        maxScore: maxPoints,
        note: 'Critical safety findings were identified with appropriate escalation.',
        details: { mode: mode, selectedCount: selectedCount, criticalHits: criticalHits, escalationHit: escalationHit }
      };
    }
    return {
      key: 'red_flags',
      label: 'Red Flag Recognition',
      score: csWeightedClamp(Math.round(maxPoints * 0.7), 0, maxPoints),
      maxScore: maxPoints,
      note: 'Some safety concerns were recognized, but escalation or prioritization was incomplete.',
      details: { mode: mode, selectedCount: selectedCount, criticalHits: criticalHits, escalationHit: escalationHit }
    };
  }

  if (selectedCount > 0) {
    return {
      key: 'red_flags',
      label: 'Red Flag Recognition',
      score: maxPoints,
      maxScore: maxPoints,
      note: 'Major red flags were screened and appropriately ruled out.',
      details: { mode: mode, selectedCount: selectedCount, criticalHits: criticalHits, escalationHit: escalationHit }
    };
  }
  return {
    key: 'red_flags',
    label: 'Red Flag Recognition',
    score: 0,
    maxScore: maxPoints,
    note: 'No red flag screening was documented.',
    details: { mode: mode, selectedCount: selectedCount, criticalHits: criticalHits, escalationHit: escalationHit }
  };
}

function csWeightedScoreEfficiency(cfg, testResult) {
  const maxPoints = cfg.efficiency.maxPoints;
  const totalSelected = Number(testResult && testResult.details ? testResult.details.selectedTotal : 0) || 0;
  const irrelevantHits = Number(testResult && testResult.details ? testResult.details.irrelevantHits : 0) || 0;
  const idealMin = Math.max(1, Math.round(cfg.efficiency.idealMin));
  const idealMax = Math.max(idealMin, Math.round(cfg.efficiency.idealMax));
  const softMax = Math.max(idealMax, Math.round(cfg.efficiency.softMax));

  let score = maxPoints;
  if (totalSelected === 0) score -= 12;
  else if (totalSelected < idealMin) score -= (idealMin - totalSelected) * cfg.efficiency.underusePenalty;

  if (totalSelected > idealMax) {
    const softOver = Math.max(0, Math.min(totalSelected, softMax) - idealMax);
    const hardOver = Math.max(0, totalSelected - softMax);
    score -= softOver * cfg.efficiency.overusePenalty;
    score -= hardOver * cfg.efficiency.excessivePenalty;
  }
  if (irrelevantHits > 0) score -= irrelevantHits * cfg.efficiency.irrelevantPenalty;
  score = csWeightedClamp(Math.round(score), 0, maxPoints);

  let note = '';
  if (score >= Math.round(maxPoints * 0.9)) {
    note = `Focused examination strategy (${totalSelected} test${totalSelected === 1 ? '' : 's'} selected).`;
  } else if (totalSelected === 0) {
    note = 'No tests were selected, which limited diagnostic efficiency.';
  } else if (totalSelected > idealMax) {
    note = `Selected ${totalSelected} tests; a more focused set (${idealMin}-${idealMax}) would improve efficiency.`;
  } else if (totalSelected < idealMin) {
    note = `Only ${totalSelected} tests selected; a slightly broader focused exam would improve confidence.`;
  } else {
    note = 'Test selection was reasonably focused with minor efficiency losses.';
  }
  if (irrelevantHits > 0) note += ` ${irrelevantHits} unnecessary test${irrelevantHits === 1 ? '' : 's'} reduced efficiency.`;

  return {
    key: 'efficiency',
    label: 'Diagnostic Efficiency',
    score: score,
    maxScore: maxPoints,
    note: note,
    details: {
      totalSelected: totalSelected,
      irrelevantHits: irrelevantHits,
      idealMin: idealMin,
      idealMax: idealMax
    }
  };
}

function csWeightedBuildSummary(c, result) {
  const parts = [];
  const diffMeta = result.meta.differential;
  const testMeta = result.meta.tests;
  const rfMeta = result.meta.redFlags;

  if (diffMeta.primaryCorrect) parts.push(`You correctly identified ${c.correctDx} as the primary diagnosis.`);
  else if (diffMeta.includedIndex >= 0) parts.push(`You included ${c.correctDx} in the differential but did not rank it first.`);
  else if (diffMeta.plausibleCount > 0) parts.push('You selected plausible related diagnoses, but omitted the best-fit diagnosis.');
  else parts.push('Your differential was not aligned with the case pattern.');

  if (testMeta.keyHits > 0 && testMeta.irrelevantHits === 0) {
    parts.push('Your selected tests were high-value and diagnostically focused.');
  } else if (testMeta.keyHits > 0) {
    parts.push(`Your selected tests included key discriminators, but ${testMeta.irrelevantHits} added limited value.`);
  } else if (testMeta.selectedTotal === 0) {
    parts.push('No tests were selected, which limited objective discrimination.');
  } else {
    parts.push('Your test selection was broad but not weighted toward high-yield findings.');
  }

  if (rfMeta.mode === 'identify') {
    if (rfMeta.score >= CS_WEIGHTED_SCORE_MODEL.redFlags) parts.push('You recognized the key safety concern and escalated appropriately.');
    else parts.push('Safety recognition and escalation need to be sharper for this presentation.');
  } else {
    if (rfMeta.score >= CS_WEIGHTED_SCORE_MODEL.redFlags) parts.push('You appropriately ruled out major red flags.');
    else parts.push('Red flag screening documentation was insufficient.');
  }

  const weakest = result.breakdown.slice().sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))[0];
  if (weakest) parts.push(`Most important improvement target: ${weakest.label.toLowerCase()} (${weakest.score}/${weakest.maxScore}).`);
  return parts.join(' ');
}

function csComputeWeightedScore(c) {
  if (!c) return null;
  const cfg = csWeightedBuildConfig(c);
  const differential = csWeightedScoreDifferential(c, cfg);
  const tests = csWeightedScoreTests(c, cfg);
  const redFlags = csWeightedScoreRedFlags(c, cfg);
  const efficiency = csWeightedScoreEfficiency(cfg, tests);
  const breakdown = [differential, tests, redFlags, efficiency];
  const total = csWeightedClamp(
    breakdown.reduce((sum, item) => sum + Number(item.score || 0), 0),
    0,
    100
  );

  const result = {
    totalScore: total,
    maxScore: 100,
    differentialScore: differential.score,
    testSelectionScore: tests.score,
    redFlagScore: redFlags.score,
    efficiencyScore: efficiency.score,
    breakdown: breakdown,
    detailedFeedback: breakdown.map(item => ({
      criterion: item.label,
      note: item.note,
      score: item.score,
      maxScore: item.maxScore
    })),
    feedbackSummary: '',
    meta: {
      differential: {
        primaryCorrect: !!(differential.details && differential.details.primaryCorrect),
        includedIndex: Number(differential.details && differential.details.includedIndex != null ? differential.details.includedIndex : -1),
        plausibleCount: Number(differential.details && differential.details.plausibleCount || 0)
      },
      tests: {
        selectedTotal: Number(tests.details && tests.details.selectedTotal || 0),
        keyHits: Number(tests.details && tests.details.keyHits || 0),
        supportiveHits: Number(tests.details && tests.details.supportiveHits || 0),
        neutralHits: Number(tests.details && tests.details.neutralHits || 0),
        irrelevantHits: Number(tests.details && tests.details.irrelevantHits || 0),
        selectedCaseTests: tests.details && tests.details.selectedCaseTests || [],
        selectedIrrelevant: tests.details && tests.details.selectedIrrelevant || []
      },
      redFlags: {
        mode: redFlags.details && redFlags.details.mode || 'rule_out',
        selectedCount: Number(redFlags.details && redFlags.details.selectedCount || 0),
        criticalHits: Number(redFlags.details && redFlags.details.criticalHits || 0),
        escalationHit: !!(redFlags.details && redFlags.details.escalationHit),
        score: redFlags.score
      }
    }
  };

  result.feedbackSummary = csWeightedBuildSummary(c, result);
  return result;
}

function csGetWeightedScoreResult() {
  const cached = csState.lastScoreResult;
  if (cached && Number.isFinite(Number(cached.totalScore))) return cached;
  if (!csState.case) return null;
  const computed = csComputeWeightedScore(csState.case);
  if (computed) {
    csState.lastScoreResult = computed;
    return computed;
  }
  return null;
}

async function csGenerateDebrief() {
  csSaveFieldState();
  csGoTo('pagCS6');

  const c = csState.case;
  if (!c) return;
  csState.attemptSummary = csBuildAttemptSummary(false);
  const scoreResult = csComputeWeightedScore(c);
  if (!scoreResult) return;
  csState.lastScoreResult = scoreResult;

  const totalScore = Number(scoreResult.totalScore) || 0;
  const verdict = totalScore >= 85 ? 'Strong reasoning' : totalScore >= 65 ? 'Developing reasoning' : 'Needs focused review';
  const verdictSub = scoreResult.feedbackSummary || 'Review the category scores and expert reasoning report to refine your next attempt.';
  const dxCorrect = !!(scoreResult.meta && scoreResult.meta.differential && scoreResult.meta.differential.primaryCorrect);
  const rubricRows = scoreResult.detailedFeedback || [];

  // ── Render score ring ──
  document.getElementById('csScoreNum').textContent = `${totalScore}`;
  document.getElementById('csScoreDen').textContent = `/ ${scoreResult.maxScore || 100}`;
  document.getElementById('csVerdict').textContent = csImperializeText(verdict);
  document.getElementById('csVerdictSub').textContent = csImperializeText(verdictSub);

  // ── Diagnosis comparison ──
  const dxComp = document.getElementById('csDxComparison');
  if (dxComp) {
    dxComp.innerHTML = `
      <div class="cs-dx-row">
        <div class="cs-dx-block">
          <span class="cs-dx-block-label">Your diagnosis</span>
          <span class="cs-dx-block-value ${dxCorrect ? 'correct' : 'incorrect'}">${escapeHtml(csImperializeText(csState.finalDx)) || '—'}</span>
          <span class="cs-dx-block-meta">Confidence: ${csConfidenceLabel(csState.confidence)} (${Math.round(csClampConfidence(csState.confidence))}%)</span>
        </div>
        <div class="cs-dx-block">
          <span class="cs-dx-block-label">Correct diagnosis</span>
          <span class="cs-dx-block-value correct">${escapeHtml(csImperializeText(c.correctDx))}</span>
        </div>
      </div>
      <div class="cs-dx-differentials">
        <span class="cs-dx-diff-label">Key differentials to consider</span>
        ${(c.keyDifferentials || []).map(d => `<span class="cs-dx-diff-tag">${escapeHtml(csImperializeText(d))}</span>`).join('')}
      </div>`;
  }

  // ── Key findings ──
  const kf = document.getElementById('csKeyFindings');
  if (kf) {
    kf.innerHTML = (c.keyFindings || []).map(f =>
      `<div class="cs-key-finding">
        <span class="cs-key-finding-icon">${f.icon}</span>
        <span class="cs-key-finding-text">${csImperializeHtml(f.text)}</span>
      </div>`
    ).join('');
  }

  // ── Rubric table ──
  const tbody = document.getElementById('csRubricBody');
  if (tbody) {
    tbody.innerHTML = rubricRows.map(r =>
      `<tr>
        <td>${escapeHtml(csImperializeText(r.criterion || 'Category'))}</td>
        <td style="font-size:0.72rem;color:var(--muted)">${escapeHtml(csImperializeText(r.note || 'No feedback.'))}</td>
        <td class="cs-rubric-score ${Number(r.score) >= Number(r.maxScore) ? 'full' : Number(r.score) > 0 ? 'partial' : 'zero'}">${Number(r.score) || 0}/${Number(r.maxScore) || 0}</td>
      </tr>`
    ).join('');
  }

  // ── AI feedback via Claude API ──
  const aiFeedback = document.getElementById('csAiFeedback');
  if (aiFeedback) {
    // If feedback was already generated and cached, restore it without re-fetching
    if (csState.aiFeedbackHtml) {
      aiFeedback.className = 'cs-ai-feedback';
      aiFeedback.innerHTML = csImperializeHtml(csState.aiFeedbackHtml);
    } else {
    aiFeedback.className = 'cs-ai-feedback loading';
    aiFeedback.innerHTML = `<span class="cs-ai-section-label">Generating expert reasoning report<span class="cs-ai-loading-dots"></span></span>Building a case-specific explanation that links this diagnosis directly to the findings.`;

    const reasoningEvidence = csCollectReasoningEvidence(c, { posLimit: 6, negLimit: 5, historyLimit: 3 });
    const historyLines = reasoningEvidence.history.length
      ? reasoningEvidence.history.map(s => `- ${csImperializeText(s)}`).join('\n')
      : '- No additional history cues extracted.';
    const positiveLines = reasoningEvidence.positive.length
      ? reasoningEvidence.positive.map(s => `- ${csImperializeText(s)}`).join('\n')
      : '- Positive objective findings not available.';
    const negativeLines = reasoningEvidence.negative.length
      ? reasoningEvidence.negative.map(s => `- ${csImperializeText(s)}`).join('\n')
      : '- Negative/disconfirming findings not available.';
    const differentialLines = (c.keyDifferentials || []).length
      ? c.keyDifferentials.map(d => `- ${csImperializeText(csNormalizeDdxLabel(d))}`).join('\n')
      : '- Alternative differentials not provided.';
    const imagingCtx = csExpectedImagingSuggestion(c);
    const imagingExpectation = `${csImagingChoiceLabel(imagingCtx.expected)} (${csImperializeText(imagingCtx.basisSource)}${imagingCtx.basisDx ? `: ${csImperializeText(imagingCtx.basisDx)}` : ''})`;
    const vignetteSummary = csImperializeText(csTrimReasoningText(c && c.vignette ? _plainText(c.vignette) : '', 900)) || 'Not available.';

    const prompt = `You are an expert physiotherapist writing a patient-facing explanation report.

CASE: ${c.title}
CORRECT DIAGNOSIS: ${c.correctDx}
EXPERT CLINICAL REASONING: ${csImperializeText(c.expertReasoningPrompt)}

CASE HISTORY SUMMARY:
${vignetteSummary}

KEY HISTORY CLUES:
${historyLines}

KEY POSITIVE FINDINGS (supporting diagnosis):
${positiveLines}

KEY NEGATIVE OR DISCONFIRMING FINDINGS:
${negativeLines}

KEY DIFFERENTIALS TO ADDRESS:
${differentialLines}

IMAGING EXPECTATION:
${imagingExpectation}

Write the report using these exact section headers:
1. LIKELY DIAGNOSIS
2. WHY THIS DIAGNOSIS FITS
3. WHY OTHER COMMON CAUSES ARE LESS LIKELY
4. WHAT THIS MEANS FOR RECOVERY
5. NEXT STEPS

Requirements:
- Use plain, non-technical language suitable for a patient.
- Keep each section concise (2-4 short sentences).
- In section 2, explicitly reference at least three specific findings (including test names when provided) and explain what each finding suggests.
- In section 3, explicitly compare against at least two listed differentials and state which findings make each less likely.
- Avoid vague phrases such as "pattern recognition" or "aligns with the presentation" unless followed by concrete case evidence.
- Do not mention student performance, scoring, rubric, tokens, or that this was AI-generated.
- Format as plain paragraphs with section headers in uppercase.`;

    try {
      // Route through serverless proxy — never call Anthropic directly from the browser.
      // Cloudflare Pages Function at /functions/debrief.js handles auth server-side.
      const response = await fetch('/functions/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
      const data = await response.json();
      const text = (data.text || '');

      aiFeedback.className = 'cs-ai-feedback';
      const renderedHtml = '<span class="cs-ai-section-label">Expert Reasoning Report</span>' +
        text.split('\n').filter(l => l.trim()).map(line => {
          // Bold section headers — escape all interpolated AI text before inserting into DOM
          const headerMatch = line.match(/^\*?\*?(\d+\.\s+[A-Z][A-Z\s]+)\*?\*?[:—]?(.*)/);
          if (headerMatch) {
            return `<p><strong>${escapeHtml(headerMatch[1].trim())}</strong>${headerMatch[2] ? ' — ' + escapeHtml(headerMatch[2].trim()) : ''}</p>`;
          }
          return `<p>${escapeHtml(line)}</p>`;
        }).join('');
      const renderedImperial = csImperializeHtml(renderedHtml);
      aiFeedback.innerHTML = renderedImperial;
      csState.aiFeedbackHtml = renderedImperial; // Cache to avoid re-fetch on session restore
    } catch (e) {
      aiFeedback.className = 'cs-ai-feedback';
      const fallbackHtml = csImperializeHtml(csBuildPatientReasoningFallback(c));
      aiFeedback.innerHTML = fallbackHtml;
      csState.aiFeedbackHtml = fallbackHtml;
    }
    } // end else (not cached)
  }

  csState.attemptSummary = csBuildAttemptSummary(true);
  csUpdateChallengeControls();
}

// ======== SESSION PERSISTENCE ========

function saveContactToStorage() {
  try {
    const payload = {
      userName: state.userName || '',
      userEmail: state.userEmail || ''
    };
    sessionStorage.setItem(EIDOS_CONTACT_KEY, JSON.stringify(payload));
  } catch (_) {}
}

function loadContactFromStorage() {
  try {
    const raw = sessionStorage.getItem(EIDOS_CONTACT_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) || {};
    state.userName = parsed.userName || '';
    state.userEmail = parsed.userEmail || '';
  } catch (_) {}
}

function saveToStorage() {
  try {
    if (_currentPage === 6) state.objective = collectObjectiveInputs();
    if (_currentPage === 7) state.specialTests = collectSpecialTests();
    saveContactToStorage();

    // Serialize assessment state only (contact details are stored separately).
    const sState = Object.assign({}, state, {
      symptoms:    [...(state.symptoms || [])],
      agg:         [...(state.agg      || [])],
      alle:        [...(state.alle     || [])],
      _rfFlagged:  [...(state._rfFlagged || [])],
      _currentPage: _currentPage,
    });
    delete sState.userName;
    delete sState.userEmail;
    sessionStorage.setItem('eidos_state', JSON.stringify(sState));

    // Serialize csState in a compact form to reduce sessionStorage quota failures.
    const caseRefId = csState.case && csState.case.id ? csState.case.id : '';
    const trimmedAiFeedback = (
      typeof csState.aiFeedbackHtml === 'string' &&
      csState.aiFeedbackHtml.length <= 12000
    ) ? csState.aiFeedbackHtml : null;

    const sCs = {
      active: !!csState.active,
      level: csState.level || null,
      caseIndex: csState.caseIndex || 0,
      case: csState.case || null,
      caseId: caseRefId || null,
      caseLevel: csState.level || null,
      tokensTotal: csState.tokensTotal || 8,
      tokensUsed: csState.tokensUsed || 0,
      revealed: csState.revealed || [],
      ddx1: csState.ddx1 || '',
      ddx2: csState.ddx2 || '',
      ddx3: csState.ddx3 || '',
      reasoning1: csState.reasoning1 || '',
      updDdx1: csState.updDdx1 || '',
      updDdx2: csState.updDdx2 || '',
      updDdx3: csState.updDdx3 || '',
      reasoning2: csState.reasoning2 || '',
      finalDx: csState.finalDx || '',
      finalReasoning: csState.finalReasoning || '',
      management: csState.management || '',
      imagingSuggestion: csState.imagingSuggestion || '',
      confidence: csClampConfidence(csState.confidence),
      redFlags: csState.redFlags || [],
      filterRegion: csState.filterRegion || 'all',
      filterLevel: csState.filterLevel || 'any',
      examRowOrder: csState.examRowOrder || {},
      examRowOrderCaseKey: csState.examRowOrderCaseKey || '',
      activeExamTab: csState.activeExamTab || null,
      redHerringPool: csState.redHerringPool || null,
      redHerringWasted: [...(csState.redHerringWasted || [])],
      aiFeedbackHtml: trimmedAiFeedback,
      attemptSummary: csState.attemptSummary || null,
      lastScoreResult: csState.lastScoreResult || null,
    };
    // Store the active cs page so we can restore it
    const csPages = ['pagCS0','pagCS1','pagCS2','pagCS3','pagCS4','pagCS5','pagCS6'];
    const activeCsPage = csPages.find(p => document.getElementById(p)?.classList.contains('active')) || null;
    sCs._activePage = activeCsPage;
    sessionStorage.setItem('eidos_csState', JSON.stringify(sCs));
  } catch(e) {
    // sessionStorage unavailable or quota exceeded — fail silently
  }
}

function loadFromStorage() {
  try {
    const rawState = sessionStorage.getItem('eidos_state');
    const rawCs    = sessionStorage.getItem('eidos_csState');
    loadContactFromStorage();
    if (!rawState) return false; // Nothing stored

    // ── Restore state ──
    const s = JSON.parse(rawState);
    state.mode        = s.mode;
    state._collectTarget = s._collectTarget || 'patient';
    state._collectComplete = (typeof s._collectComplete === 'boolean')
      ? s._collectComplete
      : (!!s.mode || (typeof s._currentPage === 'number' && s._currentPage >= 0));
    state.area        = s.area        || null;
    state.age         = s.age         || null;
    state.sex         = s.sex         || null;
    state.slrRight    = s.slrRight    || null;
    state.slrLeft     = s.slrLeft     || null;
    state.slrFlag     = s.slrFlag     || null;
    state.symptoms    = new Set(s.symptoms  || []);
    state.duration    = s.duration    || null;
    state.symptomText = s.symptomText || '';
    state.agg         = new Set(s.agg       || []);
    state.aggText     = s.aggText     || '';
    state.alle        = new Set(s.alle      || []);
    state.alleText    = s.alleText    || '';
    state.objective   = s.objective   || {};
    state.specialTests= s.specialTests|| {};
    Object.keys(state.specialTests).forEach(k => { if (state.specialTests[k] === '–') state.specialTests[k] = '-'; });
    state._rfFlagged  = new Set(s._rfFlagged || []);

    const savedPage   = typeof s._currentPage === 'number' ? s._currentPage : 0;

    // ── Restore csState ──
    let activeCsPage = null;
    if (rawCs) {
      const cs = JSON.parse(rawCs);
      csState.active          = cs.active          || false;
      csState.level           = cs.level           || null;
      csState.caseIndex       = cs.caseIndex       || 0;
      csState.case            = cs.case            || null;
      csState.tokensTotal     = cs.tokensTotal      || 8;
      csState.tokensUsed      = cs.tokensUsed       || 0;
      csState.revealed        = cs.revealed         || [];
      csState.ddx1            = cs.ddx1            || '';
      csState.ddx2            = cs.ddx2            || '';
      csState.ddx3            = cs.ddx3            || '';
      csState.reasoning1      = cs.reasoning1      || '';
      csState.updDdx1         = cs.updDdx1         || '';
      csState.updDdx2         = cs.updDdx2         || '';
      csState.updDdx3         = cs.updDdx3         || '';
      csState.reasoning2      = cs.reasoning2      || '';
      csState.finalDx         = cs.finalDx         || '';
      csState.finalReasoning  = cs.finalReasoning  || '';
      csState.management      = cs.management      || '';
      csState.imagingSuggestion = cs.imagingSuggestion || '';
      csState.confidence      = csClampConfidence(cs.confidence);
      csState.redFlags        = cs.redFlags         || [];
      csState.filterRegion    = cs.filterRegion     || 'all';
      csState.filterLevel     = cs.filterLevel      || 'any';
      csState.redHerringWasted= new Set(cs.redHerringWasted || []);
      csState.redHerringPool  = cs.redHerringPool  || null;
      csState.aiFeedbackHtml  = cs.aiFeedbackHtml  || null;
      csState.attemptSummary  = cs.attemptSummary  || null;
      csState.lastScoreResult = cs.lastScoreResult || null;
      csState.examRowOrder    = cs.examRowOrder    || {};
      csState.examRowOrderCaseKey = cs.examRowOrderCaseKey || '';
      csState.activeExamTab   = cs.activeExamTab   || null;
      activeCsPage            = cs._activePage     || null;

      if (!csState.case && cs.caseId) {
        const preferredLevel = cs.caseLevel || cs.level || '';
        const levels = preferredLevel ? [preferredLevel, 'beginner', 'intermediate', 'advanced'] : ['beginner', 'intermediate', 'advanced'];
        for (const lvl of levels) {
          const hit = (CASE_LIBRARY[lvl] || []).find(c => c && c.id === cs.caseId);
          if (hit) {
            csState.case = JSON.parse(JSON.stringify(hit));
            break;
          }
        }
      }

      // Refresh stored case from current CASE_LIBRARY by id to avoid stale/mismatched
      // serialized case objects after template-generation changes.
      if (csState.case && csState.case.id) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        let refreshedCase = null;
        for (const lvl of levels) {
          const hit = (CASE_LIBRARY[lvl] || []).find(c => c && c.id === csState.case.id);
          if (hit) { refreshedCase = hit; break; }
        }
        if (refreshedCase) {
          csState.case = JSON.parse(JSON.stringify(refreshedCase));
        }
      }
    }
    csResetChallengeContext({ clearRoute: false });

    // ── Nothing meaningful to restore — bail ──
    if (!state.mode && !csState.active) return false;

    // ── Restore case study flow ──
    const csPagesSet = new Set(['pagCS0','pagCS1','pagCS2','pagCS3','pagCS4','pagCS5','pagCS6']);
    if (csState.active && activeCsPage && csPagesSet.has(activeCsPage)) {
      // Re-apply mode side effects (progress bar, step dot visibility)
      if (state.mode) _applyModeUI(state.mode);

      // Show the case study page
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active','slide-fwd','slide-back'));
      const target = document.getElementById(activeCsPage);
      if (target) target.classList.add('active');

      // Re-render page content
      if (csState.case) {
        updateDdxDatalistForCase(csState.case);
        csRenderVignette();
        if (activeCsPage === 'pagCS3') csRenderExamination();
        if (activeCsPage === 'pagCS4') csRenderRevealedFindings();
        if (activeCsPage === 'pagCS5') csRenderRedFlags();
        if (activeCsPage === 'pagCS6') csGenerateDebrief();
      }

      // Restore text inputs
      _restoreCsFields();
      csUpdateChallengeControls();
      syncHeaderPostCollect();
      return true;
    }

    // ── Restore normal evaluation flow ──
    if (state.mode) {
      _applyModeUI(state.mode);

      // Restore area selection
      if (state.area) {
        const areaBtn = document.querySelector(`.area-btn[data-area="${state.area}"]`);
        if (areaBtn) areaBtn.classList.add('selected');
        syncPainMapSelection(state.area);
        renderChips('symptomChips', state.area, state.mode === 'patient' ? SYMPTOM_CHIPS_PATIENT : SYMPTOM_CHIPS);
        renderChips('aggChips',     state.area, state.mode === 'patient' ? AGG_CHIPS_PATIENT     : AGG_CHIPS);
        renderChips('alleChips',    state.area, state.mode === 'patient' ? ALLE_CHIPS_PATIENT    : ALLE_CHIPS);
        renderObjectiveFields();
      }

      // Navigate to saved page — use goTo which will handle chip/field restore
      if (savedPage > 0) {
        // Directly show the page without triggering validation guards
        _currentPage = savedPage;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active','slide-fwd','slide-back'));
        const pg = document.getElementById('page' + savedPage);
        if (pg) pg.classList.add('active');

        // Re-populate each page's fields
        setTimeout(() => {
          if (savedPage >= 2) {
            // age / sex
            const ageEl = document.getElementById('patientAge');
            if (ageEl && state.age) ageEl.value = state.age;
            // sex chips
            if (state.sex) {
              document.querySelectorAll('#sexChips .chip').forEach(c => {
                c.classList.toggle('selected', c.dataset.sex === state.sex || c.textContent.trim().toLowerCase() === state.sex.toLowerCase());
              });
            }
            // duration chips
            if (state.duration) {
              document.querySelectorAll('#durationChips .chip').forEach(c => {
                c.classList.toggle('selected', c.dataset.dur === state.duration || c.textContent.trim().toLowerCase() === state.duration.toLowerCase());
              });
            }
          }
          if (savedPage >= 3 && state.symptoms.size > 0) restoreChips('symptomChips', state.symptoms);
          if (savedPage >= 3 && state.symptomText) { const el = document.getElementById('symptomText'); if (el) el.value = state.symptomText; }
          if (savedPage >= 4 && state.agg.size > 0) restoreChips('aggChips', state.agg);
          if (savedPage >= 4 && state.aggText) { const el = document.getElementById('aggText'); if (el) el.value = state.aggText; }
          if (savedPage >= 5 && state.alle.size > 0) restoreChips('alleChips', state.alle);
          if (savedPage >= 5 && state.alleText) { const el = document.getElementById('alleText'); if (el) el.value = state.alleText; }
          if (savedPage >= 6 && state.objective) restoreObjectiveInputs(state.objective);
          if (savedPage === 7) setTimeout(() => buildInterimResults(), 50);
          if (savedPage === 8) buildResults();

          // Update progress bar UI
          document.getElementById('progressBar').style.display = 'flex';
          document.getElementById('startOverBtn').style.display = 'inline-block';
          updateStepCounts();
        }, 0);
      }
      csUpdateChallengeControls();
      syncHeaderPostCollect();
      return true;
    }

    return false;
  } catch(e) {
    // Corrupt storage — clear and start fresh
    sessionStorage.removeItem('eidos_state');
    sessionStorage.removeItem('eidos_csState');
    sessionStorage.removeItem(EIDOS_CONTACT_KEY);
    sessionStorage.removeItem(CS_CHALLENGE_SESSION_STORAGE_KEY);
    csResetChallengeContext({ clearRoute: false });
    return false;
  }
}

// Applies mode-specific UI changes (progress bar visibility, step dots, copy)
// without calling goTo() — avoids validation guards on restore
function _applyModeUI(role) {
  const isPatient = role === 'patient';
  const progressBarEl = document.getElementById('progressBar');
  if (progressBarEl) {
    progressBarEl.style.display = 'flex';
    progressBarEl.classList.toggle('patient-mode', isPatient);
  }
  document.getElementById('startOverBtn').style.display = 'inline-block';
  document.getElementById('stepDot6').style.display = isPatient ? 'none' : 'flex';
  document.getElementById('stepDot7').style.display = isPatient ? 'none' : 'flex';
  document.querySelectorAll('.clinician-only').forEach(el => { el.style.display = isPatient ? 'none' : 'block'; });
  const painMap = document.getElementById('painMap');
  if (painMap) painMap.style.display = isPatient ? 'block' : 'none';

  // Restore patient/clinician copy changes
  if (isPatient) {
    document.getElementById('page1Title').textContent = 'Where does it hurt?';
    document.getElementById('page1Sub').textContent = 'Tap the area of your body that\'s bothering you most.';
    document.getElementById('page2Title').textContent = 'A little about you';
    document.getElementById('page2Sub').textContent = 'Your age and sex help us give you more relevant information about what might be going on.';
    document.getElementById('durationTitle').textContent = 'How long has this been going on?';
    document.getElementById('durationSub').textContent = 'Even a rough idea helps — pick the closest option.';
    document.getElementById('ageLabel').textContent = 'Your Age';
    document.getElementById('page3Title').textContent = 'What are you feeling?';
    document.getElementById('page3Sub').textContent = 'Pick everything that sounds like your pain or discomfort. No need to be exact — go with what feels closest.';
    document.getElementById('page4Title').textContent = 'What makes it worse?';
    document.getElementById('page4Sub').textContent = 'Select anything that tends to bring on your pain or make it flare up.';
    document.getElementById('page5Title').textContent = 'What gives you relief?';
    document.getElementById('page5Sub').textContent = 'Select anything that helps ease the pain, even a little.';
    document.getElementById('page5Next').onclick = () => { buildResults(); goTo(8); };
    document.getElementById('page5Next').textContent = 'Show me results →';
    document.getElementById('page8Title').textContent = 'Here\'s what we found';
    document.getElementById('page8Sub').textContent = 'Based on what you\'ve shared. Remember — this is a guide, not a diagnosis.';
    document.getElementById('resultsDisclaimer').innerHTML = '<strong>This is a guide, not a diagnosis.</strong> EIDOS helps you understand your symptoms and have better conversations with your physio or doctor. It doesn\'t replace a proper clinical assessment — please see a qualified professional if your pain is severe or not improving.';
  } else {
    document.getElementById('page1Title').textContent = 'Select Region';
    document.getElementById('page1Sub').textContent = 'Which body region is being evaluated?';
    document.getElementById('page2Title').textContent = 'Patient Information';
    document.getElementById('page2Sub').textContent = 'Age and biological sex influence differential diagnosis likelihood based on population epidemiology.';
    document.getElementById('ageLabel').textContent = 'Patient Age (years)';
    document.getElementById('page3Title').textContent = 'Symptom Profile';
    document.getElementById('page3Sub').textContent = 'Select all symptoms the patient reports, or type additional ones below.';
    document.getElementById('page4Title').textContent = 'Aggravating Factors';
    document.getElementById('page4Sub').textContent = 'What activities or positions worsen the patient\'s symptoms?';
    document.getElementById('page5Title').textContent = 'Alleviating Factors';
    document.getElementById('page5Sub').textContent = 'What provides the patient relief?';
    document.getElementById('page5Next').onclick = () => goTo(6);
    document.getElementById('page5Next').textContent = 'Next →';
    document.getElementById('page8Title').textContent = 'Clinical Impression';
    document.getElementById('page8Sub').textContent = 'Based on the subjective and objective data collected.';
    document.getElementById('resultsDisclaimer').innerHTML = '<strong>Clinical Decision Support Only —</strong> This tool is not a diagnostic instrument. Results are intended to support clinical reasoning by a licensed physical therapist and do not constitute a medical diagnosis.';
  }
}

// Restores csState text fields to their DOM inputs after a session restore
function _restoreCsFields() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (val !== undefined && val !== null && val !== '') el.value = val;
  };
  set('csDdx1',          csState.ddx1);
  set('csDdx2',          csState.ddx2);
  set('csDdx3',          csState.ddx3);
  set('csReasoning1',    csState.reasoning1);
  set('csUpdDdx1',       csState.updDdx1);
  set('csUpdDdx2',       csState.updDdx2);
  set('csUpdDdx3',       csState.updDdx3);
  set('csReasoning2',    csState.reasoning2);
  set('csFinalDx',       csState.finalDx);
  set('csFinalReasoning',csState.finalReasoning);
  set('csManagement',    csState.management);
  set('csImagingSuggestion', csState.imagingSuggestion);
  set('csConfidence',    csClampConfidence(csState.confidence));
  csRenderConfidenceLabel();
}

// Run on DOM load

document.addEventListener('DOMContentLoaded', () => {
  ensureGlobalOverlaysMounted();
  initDataInlineHandlers();
  initAboutOverlayClose();
  _trackPageView();
  const uiRoute = getUIRoute();
  const shouldTryRestore = uiRoute === 'split';
  const restored = shouldTryRestore ? loadFromStorage() : false;
  const hp = document.getElementById('pageHome');
  const container = document.querySelector('.container');
  if (restored) {
    if (hp) hp.style.display = 'none';
    if (container) container.style.display = '';
    setUIRoute('split');
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    if (uiRoute === 'split') {
      if (hp) hp.style.display = 'none';
      if (container) container.style.display = '';
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active','slide-fwd','slide-back'));
      const lastPageId = getLastPageId();
      let targetId = 'page0';
      if (lastPageId && lastPageId !== 'pageHome' && document.getElementById(lastPageId)) {
        targetId = lastPageId;
      }
      // Without full saved state, case pages beyond pagCS0 cannot safely restore.
      if (targetId.startsWith('pagCS') && targetId !== 'pagCS0') targetId = 'pagCS0';
      // If restoring a non-landing clinician/patient page, re-apply last known mode.
      if (targetId.startsWith('page') && targetId !== 'page0') {
        let lastMode = '';
        try { lastMode = sessionStorage.getItem(EIDOS_LAST_MODE_KEY) || ''; } catch (_) {}
        if (lastMode === 'patient' || lastMode === 'clinician') {
          state.mode = lastMode;
          _applyModeUI(lastMode);
        } else if (targetId !== 'page1') {
          targetId = 'page0';
        }
      }
      const target = document.getElementById(targetId) || document.getElementById('page0');
      if (target) target.classList.add('active');
      const pb = document.getElementById('progressBar');
      if (pb) pb.style.display = (targetId === 'page0' || targetId === 'pagCS0') ? 'none' : 'flex';
      const sob = document.getElementById('startOverBtn');
      if (sob) sob.style.display = (targetId === 'page0' || targetId === 'pagCS0') ? 'none' : 'inline-block';
      _currentPage = targetId.startsWith('page') ? (parseInt(targetId.replace('page', ''), 10) || 0) : 0;
    } else {
      if (container) container.style.display = 'none';
      if (hp) {
        hp.classList.remove('hidden');
        hp.style.display = 'flex';
      }
      syncHomeBackgroundHeight();
      requestAnimationFrame(syncHomeBackgroundHeight);
      setUIRoute('home');
    }
  }
  window.addEventListener('resize', () => requestAnimationFrame(syncHomeBackgroundHeight), { passive: true });
  syncHeaderPostCollect();
  populateDdxDatalist();
  csInitMobileDdxPicker();
  csInitInlineDdxDropdown();

  // ── Wire up homepage buttons via addEventListener (safe — no inline onclick) ──
  const _hb = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  _hb('homeAboutBtn',     () => openAbout());
  _hb('homeExploreBtn',   () => goToSplitScreen());
  _hb('homeExploreCta',   () => goToSplitScreen());
  _hb('homeLearnBtn',     () => openAbout());
  _hb('homeCardCases',    (e) => { if (e) e.preventDefault(); launchPath('cases'); });
  _hb('homeCardClinician',(e) => { if (e) e.preventDefault(); launchPath('clinician'); });
  _hb('homeCardPatient',  (e) => { if (e) e.preventDefault(); launchPath('patient'); });
  _hb('csStartRandomBtn', (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    csStartFilteredCase();
  });
  _hb('headerHomeBtn',    () => showHomePage());
  _hb('headerAboutBtn',   () => openAbout());
  _hb('rfHeaderBadge',    () => openRedFlags(state.mode || 'clinician'));
  _hb('homeWordmark',     (e) => { e.preventDefault(); });
  _hb('appHeaderWordmark',(e) => { e.preventDefault(); showHomePage(); });
  const rfBadgeEl = document.getElementById('rfHeaderBadge');
  if (rfBadgeEl) {
    rfBadgeEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        rfBadgeEl.click();
      }
    });
  }
  initSplitCardHover();
  window.addEventListener('beforeunload', persistRefreshRoute);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persistRefreshRoute();
  });
});

// ======== PDF EXPORT ========

let _csHtml2PdfLibPromise = null;

function csEnsureHtml2PdfLib() {
  if (window.html2pdf) return Promise.resolve(window.html2pdf);
  if (_csHtml2PdfLibPromise) return _csHtml2PdfLibPromise;

  const scriptSources = [
    './assets/html2pdf.bundle.min.js',
    'assets/html2pdf.bundle.min.js',
    '/assets/html2pdf.bundle.min.js'
  ];

  const loadOneSource = (src, idx) => new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve(window.html2pdf);
      return;
    }
    const scriptId = `csHtml2PdfBundle${idx}`;
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
    }

    const started = Date.now();
    const maxWait = 2500;
    const poll = setInterval(() => {
      if (window.html2pdf) {
        clearInterval(poll);
        resolve(window.html2pdf);
      } else if ((Date.now() - started) > maxWait) {
        clearInterval(poll);
        reject(new Error('html2pdf_load_timeout'));
      }
    }, 120);

    script.addEventListener('error', () => {
      clearInterval(poll);
      reject(new Error('html2pdf_load_error'));
    }, { once: true });
  });

  _csHtml2PdfLibPromise = (async () => {
    let lastErr = null;
    for (let i = 0; i < scriptSources.length; i += 1) {
      try {
        await loadOneSource(scriptSources[i], i);
        if (window.html2pdf) return window.html2pdf;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('html2pdf_load_unavailable');
  })();

  return _csHtml2PdfLibPromise;
}

function csResolvePdfApiUrl() {
  const explicitGlobal = String(window.EIDOS_PDF_EXPORT_URL || '').trim();
  const metaEl = document.querySelector('meta[name="eidos-pdf-export-url"]');
  const explicitMeta = metaEl ? String(metaEl.getAttribute('content') || '').trim() : '';
  const explicit = explicitGlobal || explicitMeta;
  if (explicit) return explicit;
  if (window.location && window.location.protocol === 'file:') {
    return 'http://127.0.0.1:8787/api/case/export-pdf';
  }
  return '/api/case/export-pdf';
}

function csWaitForDebriefReady(maxWaitMs = 7000) {
  return new Promise((resolve) => {
    const started = Date.now();
    const check = () => {
      const loading = document.getElementById('csAiFeedback')?.classList.contains('loading');
      if (!loading) {
        resolve({ ready: true, timedOut: false });
        return;
      }
      if ((Date.now() - started) >= maxWaitMs) {
        resolve({ ready: false, timedOut: true });
        return;
      }
      setTimeout(check, 180);
    };
    check();
  });
}

function csGetReportFileName() {
  const raw = (csState.case?.title || 'clinical-case-report')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `eidos-${raw || 'clinical-case-report'}.pdf`;
}

function csBuildDebriefExportNode() {
  const source = document.querySelector('#pagCS6 .cs-page-inner');
  if (!source) return null;

  const clone = source.cloneNode(true);
  clone.querySelectorAll('.cs-try-another, #csPdfHeaderEl, #csPdfFooterEl').forEach((el) => el.remove());
  clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  clone.querySelectorAll('button').forEach((btn) => btn.remove());

  const wrap = document.createElement('div');
  wrap.className = 'cs-export-light';
  wrap.style.cssText = 'width:780px;max-width:780px;padding:22px 22px 18px;background:#ffffff;color:#1a2630;';

  const exportStyle = document.createElement('style');
  exportStyle.textContent = `
    .cs-export-light, .cs-export-light .cs-page-inner {
      background: #ffffff !important;
      color: #1a2630 !important;
    }
    .cs-export-light .cs-debrief-section,
    .cs-export-light .cs-dx-block,
    .cs-export-light .cs-key-finding,
    .cs-export-light .cs-ai-feedback {
      background: #ffffff !important;
      border-color: #d0dae0 !important;
    }
    .cs-export-light .cs-debrief-section-title,
    .cs-export-light .cs-dx-block-label,
    .cs-export-light .cs-dx-block-meta,
    .cs-export-light .cs-dx-diff-label,
    .cs-export-light .cs-ai-section-label,
    .cs-export-light .cs-rubric-table th,
    .cs-export-light .cs-debrief-score-den,
    .cs-export-light .cs-debrief-verdict-sub,
    .cs-export-light .cs-rubric-table td:nth-child(2) {
      color: #4e6375 !important;
    }
    .cs-export-light .cs-rubric-table th,
    .cs-export-light .cs-rubric-table td {
      border-bottom: 1px solid #d0dae0 !important;
    }
    .cs-export-light .cs-rubric-table td,
    .cs-export-light .cs-key-finding-text,
    .cs-export-light .cs-ai-feedback,
    .cs-export-light .cs-ai-feedback p,
    .cs-export-light .cs-dx-block-value,
    .cs-export-light .cs-dx-diff-tag,
    .cs-export-light .cs-debrief-score-num,
    .cs-export-light .cs-debrief-verdict {
      color: #1a2630 !important;
    }
    .cs-export-light .cs-rubric-score.full { color: #2f6c47 !important; }
    .cs-export-light .cs-rubric-score.partial { color: #8a6d18 !important; }
    .cs-export-light .cs-rubric-score.zero { color: #904040 !important; }
  `;
  wrap.appendChild(exportStyle);

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #d0dae0;';

  const left = document.createElement('div');
  const title = document.createElement('div');
  title.style.cssText = "font-family:'Cormorant Garamond',serif;font-size:1.45rem;line-height:1.2;color:#1a2630;";
  title.textContent = csState.case?.title || 'Clinical Case Simulation Debrief';
  const meta = document.createElement('div');
  meta.style.cssText = "margin-top:4px;font-family:'DM Sans',sans-serif;font-size:0.66rem;letter-spacing:0.06em;text-transform:uppercase;color:#4e6375;";
  const level = csState.level ? csState.level.charAt(0).toUpperCase() + csState.level.slice(1) : '';
  const region = csState.case?.region || '';
  meta.textContent = [region, level && `${level} Case`].filter(Boolean).join(' · ');
  left.appendChild(title);
  left.appendChild(meta);

  const right = document.createElement('div');
  right.style.cssText = "font-family:'DM Sans',sans-serif;font-size:0.62rem;line-height:1.45;text-align:right;color:#4e6375;";
  right.textContent = `Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  header.appendChild(left);
  header.appendChild(right);
  wrap.appendChild(header);
  wrap.appendChild(clone);

  return wrap;
}

function csExtractPlainTextForPdf(node) {
  if (!node) return 'EIDOS Clinical Case Report';

  const clone = node.cloneNode(true);
  if (clone.querySelectorAll) {
    // Remove non-content nodes so CSS/JS never leaks into text-PDF fallback.
    clone.querySelectorAll('style,script,noscript,template').forEach((el) => el.remove());

    // Preserve readable breaks for common content blocks.
    clone.querySelectorAll('br').forEach((el) => el.replaceWith('\n'));
    clone.querySelectorAll('p,div,section,article,header,footer,h1,h2,h3,h4,h5,h6,tr').forEach((el) => {
      el.appendChild(document.createTextNode('\n'));
    });
    clone.querySelectorAll('li').forEach((el) => {
      if (el.firstChild) el.insertBefore(document.createTextNode('• '), el.firstChild);
      el.appendChild(document.createTextNode('\n'));
    });

    // Add spacing between tag-like chips that are rendered inline in the app.
    clone.querySelectorAll('.cs-dx-diff-tag,.cs-compare-chip,.cs-key-finding,.cs-dx-block').forEach((el) => {
      el.appendChild(document.createTextNode('\n'));
    });
  }

  const raw = String(clone.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!raw) return 'EIDOS Clinical Case Report';
  return raw;
}

function csWrapPdfLine(text, maxChars) {
  const value = String(text || '');
  if (value.length <= maxChars) return [value];
  const words = value.split(/\s+/).filter(Boolean);
  const out = [];
  let current = '';
  words.forEach((word) => {
    if (!current) {
      current = word;
      return;
    }
    const candidate = `${current} ${word}`;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      out.push(current);
      current = word;
    }
  });
  if (current) out.push(current);
  return out.length ? out : [''];
}

function csEscapePdfText(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function csBuildSimplePdfBlobFromText(text) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginLeft = 40;
  const marginTop = 805;
  const marginBottom = 44;
  const lineHeight = 14;
  const maxChars = 95;
  const linesPerPage = Math.max(1, Math.floor((marginTop - marginBottom) / lineHeight));

  const normalizedLines = String(text || '')
    .split('\n')
    .flatMap((line) => {
      const trimmed = line.trim();
      if (!trimmed) return [''];
      return csWrapPdfLine(trimmed, maxChars);
    });

  const pages = [];
  for (let i = 0; i < normalizedLines.length; i += linesPerPage) {
    pages.push(normalizedLines.slice(i, i + linesPerPage));
  }
  if (!pages.length) pages.push(['EIDOS Clinical Case Report']);

  const encoder = new TextEncoder();
  const objects = [];
  const fontId = 3;
  const firstPageId = 4;
  const maxObjectId = firstPageId + (pages.length * 2) - 1;

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  const kids = pages.map((_, idx) => `${firstPageId + (idx * 2)} 0 R`).join(' ');
  objects[2] = `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`;
  objects[fontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  pages.forEach((pageLines, idx) => {
    const pageId = firstPageId + (idx * 2);
    const contentId = pageId + 1;
    const textCommands = [];
    pageLines.forEach((line, lineIdx) => {
      if (lineIdx === 0) textCommands.push(`1 0 0 1 ${marginLeft} ${marginTop} Tm`);
      else textCommands.push(`1 0 0 1 ${marginLeft} ${marginTop - (lineIdx * lineHeight)} Tm`);
      textCommands.push(`(${csEscapePdfText(line)}) Tj`);
    });
    const streamBody = `BT\n/F1 10 Tf\n${textCommands.join('\n')}\nET\n`;
    const streamLength = encoder.encode(streamBody).length;
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${streamLength} >>\nstream\n${streamBody}endstream`;
  });

  const chunks = ['%PDF-1.4\n'];
  const offsets = [0];
  let cursor = encoder.encode(chunks[0]).length;

  for (let id = 1; id <= maxObjectId; id += 1) {
    const body = objects[id] || '<< >>';
    offsets[id] = cursor;
    const objStr = `${id} 0 obj\n${body}\nendobj\n`;
    chunks.push(objStr);
    cursor += encoder.encode(objStr).length;
  }

  const xrefOffset = cursor;
  let xref = `xref\n0 ${maxObjectId + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= maxObjectId; id += 1) {
    xref += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size ${maxObjectId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  chunks.push(xref + trailer);
  return new Blob(chunks, { type: 'application/pdf' });
}

async function csGenerateDebriefPdfBlob() {
  const exportNode = csBuildDebriefExportNode();
  if (!exportNode) return null;

  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;';
  host.appendChild(exportNode);
  document.body.appendChild(host);

  try {
    try {
      await csEnsureHtml2PdfLib();
      if (window.html2pdf) {
        const worker = window.html2pdf().set({
          margin: [8, 8, 10, 8],
          filename: csGetReportFileName(),
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] }
        }).from(exportNode).toPdf();
        const libBlob = await worker.outputPdf('blob');
        if (libBlob) return libBlob;
      }
    } catch (libErr) {
      console.warn('html2pdf unavailable; falling back to native text-PDF export.', libErr);
    }
    return csBuildSimplePdfBlobFromText(csExtractPlainTextForPdf(exportNode));
  } finally {
    host.remove();
  }
}

function csDownloadSimpleFallbackPdf() {
  try {
    const exportNode = csBuildDebriefExportNode();
    if (!exportNode) return false;
    const text = csExtractPlainTextForPdf(exportNode);
    const blob = csBuildSimplePdfBlobFromText(text);
    csDownloadBlob(blob, csGetReportFileName());
    return true;
  } catch (err) {
    console.warn('Simple fallback PDF failed.', err);
    return false;
  }
}

function csDownloadBlob(blob, fileName) {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
  if (isIOS) {
    // iOS Safari often ignores the download attribute; opening in a new tab allows save/share from preview.
    a.target = '_blank';
    a.rel = 'noopener';
  } else {
    a.download = fileName || 'eidos-report.pdf';
  }
  document.body.appendChild(a);
  try {
    a.click();
  } catch (_) {
    if (isIOS) {
      try { window.open(url, '_blank', 'noopener'); } catch (_) {}
    }
  }
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), isIOS ? 9000 : 1200);
}

function csWithTimeout(promise, timeoutMs, timeoutCode) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(timeoutCode || 'timeout')), timeoutMs))
  ]);
}

function csReportPlainText(value) {
  return csImperializeText(String(_plainText(value || '')).replace(/\s+/g, ' ').trim());
}

function csReportTitleCase(value) {
  const txt = csReportPlainText(value).toLowerCase();
  if (!txt) return '';
  return txt.replace(/\b([a-z])/g, (m, chr) => chr.toUpperCase());
}

function csSplitDiagnosisForReport(value) {
  const full = csReportPlainText(value);
  const match = full.match(/^(.*?)(\s*\([^)]*\))$/);
  if (match) {
    return { title: match[1].trim(), sub: match[2].trim() };
  }
  return { title: full, sub: '' };
}

function csReportGeneratedDate() {
  const stamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return `Generated ${stamp}`;
}

function csReportScoreBreakdown() {
  const scoreResult = csGetWeightedScoreResult();
  if (scoreResult) {
    return {
      score: Number(scoreResult.totalScore) || 0,
      scoreTotal: Number(scoreResult.maxScore) || 100
    };
  }

  const denText = csReportPlainText(document.getElementById('csScoreDen')?.textContent || '');
  const fullMatch = denText.match(/(\d+)\s*\/\s*(\d+)/);
  if (fullMatch) {
    return { score: Number(fullMatch[1]), scoreTotal: Number(fullMatch[2]) };
  }
  const denOnly = denText.match(/(\d+)/);
  if (denOnly) {
    const numText = csReportPlainText(document.getElementById('csScoreNum')?.textContent || '');
    const scoreNum = Number(String(numText).replace(/[^\d.]/g, ''));
    if (Number.isFinite(scoreNum)) {
      return { score: scoreNum, scoreTotal: Number(denOnly[1]) || 100 };
    }
  }

  let earned = 0;
  let total = 0;
  document.querySelectorAll('#csRubricBody tr td:last-child').forEach((cell) => {
    const part = csReportPlainText(cell.textContent);
    const m = part.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return;
    earned += Number(m[1]);
    total += Number(m[2]);
  });
  return { score: earned, scoreTotal: total };
}

function csReportRubricRows() {
  const scoreResult = csGetWeightedScoreResult();
  if (scoreResult && Array.isArray(scoreResult.detailedFeedback)) {
    return scoreResult.detailedFeedback.map((row) => {
      const score = Number(row.score) || 0;
      const maxScore = Number(row.maxScore) || 0;
      let scoreColor = 'amber';
      if (score <= 0) scoreColor = 'red';
      else if (maxScore > 0 && score >= maxScore) scoreColor = 'green';
      return {
        criterion: csReportPlainText(row.criterion || 'Category') || 'Category',
        response: csReportPlainText(row.note || 'No response') || 'No response',
        score: `${score}/${maxScore}`,
        score_color: scoreColor
      };
    });
  }

  const rows = [];
  document.querySelectorAll('#csRubricBody tr').forEach((tr) => {
    const cells = tr.querySelectorAll('td');
    if (!cells || cells.length < 3) return;

    const criterion = csReportPlainText(cells[0].textContent);
    const response = csReportPlainText(cells[1].textContent);
    const score = csReportPlainText(cells[2].textContent).replace(/\s+/g, '');
    const scoreCell = cells[2];

    let scoreColor = 'amber';
    if (scoreCell.classList.contains('full')) scoreColor = 'green';
    else if (scoreCell.classList.contains('zero')) scoreColor = 'red';
    else if (scoreCell.classList.contains('partial')) scoreColor = 'amber';
    else {
      const m = score.match(/(\d+)\s*\/\s*(\d+)/);
      if (m) {
        const earned = Number(m[1]);
        const max = Number(m[2]);
        if (earned <= 0) scoreColor = 'red';
        else if (earned >= max) scoreColor = 'green';
      }
    }

    rows.push({
      criterion: criterion || 'Criterion',
      response: response || 'No response',
      score: score || '0/0',
      score_color: scoreColor
    });
  });
  return rows;
}

function csReportFallbackExpertSections() {
  const c = csState.case || {};
  const dx = csSplitDiagnosisForReport(c.correctDx || '');
  const finding = csReportPlainText((c.keyFindings && c.keyFindings[0] && c.keyFindings[0].text) || '');
  const differentials = (c.keyDifferentials || []).map(csReportPlainText).filter(Boolean).slice(0, 3);
  const nextSteps = csReportPlainText(csState.management || '') || 'Continue clinician-guided rehabilitation and reassess based on symptom response.';

  return [
    {
      number: '1',
      title: 'Likely Diagnosis',
      color: 'accent',
      body: `${dx.title || 'Diagnosis not specified'}${dx.sub ? ` ${dx.sub}` : ''}.`
    },
    {
      number: '2',
      title: 'Why This Diagnosis Fits',
      color: 'accent2',
      body: finding || 'History and exam findings align with the current diagnosis.'
    },
    {
      number: '3',
      title: 'Why Other Common Causes Are Less Likely',
      color: 'gold',
      body: differentials.length
        ? `Alternatives considered: ${differentials.join(', ')}.`
        : 'Alternative causes were less supported by the current findings.'
    },
    {
      number: '4',
      title: 'What This Means for Recovery',
      color: 'green',
      body: 'Recovery planning should match irritability, objective findings, and ongoing reassessment.'
    },
    {
      number: '5',
      title: 'Next Steps',
      color: 'amber',
      body: nextSteps
    }
  ];
}

function csReportExpertSections() {
  const html = String(csState.aiFeedbackHtml || document.getElementById('csAiFeedback')?.innerHTML || '').trim();
  if (!html) return csReportFallbackExpertSections();

  const host = document.createElement('div');
  host.innerHTML = html;
  host.querySelectorAll('.cs-ai-section-label').forEach((el) => el.remove());

  const palette = ['accent', 'accent2', 'gold', 'green', 'amber', 'red'];
  const sections = [];

  const paragraphs = Array.from(host.querySelectorAll('p'));
  paragraphs.forEach((p) => {
    const line = csReportPlainText(p.textContent);
    if (!line) return;

    const headerMatch = line.match(/^(\d+)\.\s*([^—:\-]+?)(?:\s*[—:\-]\s*(.*))?$/);
    if (!headerMatch) return;

    const number = headerMatch[1];
    const title = csReportTitleCase(headerMatch[2]);
    let body = csReportPlainText(headerMatch[3] || '');

    if (!body) {
      const clone = p.cloneNode(true);
      clone.querySelectorAll('strong').forEach((el) => el.remove());
      body = csReportPlainText(clone.textContent);
    }

    sections.push({
      number,
      title: title || `Section ${number}`,
      color: palette[Math.min(sections.length, palette.length - 1)],
      body: body || 'No additional details provided.'
    });
  });

  return sections.length ? sections : csReportFallbackExpertSections();
}

function csBuildReportDataPayload() {
  const c = csState.case;
  if (!c) return null;

  const level = String(csState.level || '').trim();
  const levelTitle = level ? `${level.charAt(0).toUpperCase()}${level.slice(1)} Template` : 'Case Simulation';
  const levelUpper = level ? level.toUpperCase() : '';
  const regionUpper = csReportPlainText(c.region || '').toUpperCase();
  const caseMatch = csReportPlainText(c.title || '').match(/case\s*([0-9]{2})/i) || String(c.id || '').match(/([0-9]{2})$/);
  const caseToken = caseMatch ? `CASE ${caseMatch[1]}` : '';
  const breadcrumb = [regionUpper, levelUpper, caseToken].filter(Boolean).join(' · ');
  const scoreResult = csGetWeightedScoreResult();
  const scoreData = csReportScoreBreakdown();
  const rubricRows = csReportRubricRows();
  const correctDx = csSplitDiagnosisForReport(c.correctDx || '');
  const verdictTitle = csReportPlainText(document.getElementById('csVerdict')?.textContent || '');
  const verdictSubtitle = csReportPlainText(document.getElementById('csVerdictSub')?.textContent || '');
  const scoreBreakdown = scoreResult && Array.isArray(scoreResult.breakdown)
    ? scoreResult.breakdown.map((row) => ({
        key: row.key || '',
        label: csReportPlainText(row.label || 'Category') || 'Category',
        score: Number(row.score) || 0,
        max_score: Number(row.maxScore) || 0,
        note: csReportPlainText(row.note || '')
      }))
    : [];
  const reasoningSummary = csReportPlainText(
    (scoreResult && scoreResult.feedbackSummary) || verdictSubtitle || 'Clinical reasoning summary.'
  ) || 'Clinical reasoning summary.';
  const selectedDifferential = csWeightedCollectRankedDifferential().slice(0, 6).map(csReportPlainText).filter(Boolean);
  const selectedTests = csWeightedUnique(
    ((csState.revealed || []).map(r => r && r.name ? r.name : '')).concat(Array.from(csState.redHerringWasted || []))
  ).map(csReportPlainText).filter(Boolean);

  return {
    case_title: csReportPlainText(c.title || 'Clinical Case'),
    case_subtitle: levelTitle,
    case_breadcrumb: breadcrumb || csReportPlainText(c.title || 'Case Simulation').toUpperCase(),
    generated_date: csReportGeneratedDate(),
    score: Number.isFinite(scoreData.score) ? scoreData.score : 0,
    score_total: Number.isFinite(scoreData.scoreTotal) ? scoreData.scoreTotal : 0,
    verdict_title: verdictTitle || 'Debrief',
    verdict_subtitle: reasoningSummary,
    user_diagnosis: csReportPlainText(csState.finalDx || '') || 'Not submitted',
    user_confidence: `${csConfidenceLabel(csState.confidence)} confidence ${Math.round(csClampConfidence(csState.confidence))}%`,
    correct_diagnosis: correctDx.title || csReportPlainText(c.correctDx || 'Not specified'),
    correct_diagnosis_sub: correctDx.sub || '',
    differentials: (c.keyDifferentials || []).map(csReportPlainText).filter(Boolean).slice(0, 3),
    key_finding: csReportPlainText((c.keyFindings && c.keyFindings[0] && c.keyFindings[0].text) || '') || 'See key findings in debrief.',
    scoring_model_version: 'clinical-reasoning-v1',
    score_breakdown: scoreBreakdown,
    reasoning_summary: reasoningSummary,
    selected_differential: selectedDifferential,
    selected_tests: selectedTests,
    rubric_rows: rubricRows,
    expert_diagnosis_title: correctDx.title || csReportPlainText(c.correctDx || 'Not specified'),
    expert_diagnosis_sub: correctDx.sub || '',
    expert_sections: csReportExpertSections(),
    disclaimer: null
  };
}

window.__EIDOS_PDF_EXPORT_IMPL = 'api-case-export-v6-20260309';
window.__EIDOS_TRACE_PDF_EXPORT = function __EIDOS_TRACE_PDF_EXPORT() {
  const btn = document.getElementById('csPdfBtn');
  const shareBtn = document.getElementById('csShareBtn');
  const fnText = String(window.csExportPDF || '');
  const shareFnText = String(window.csShareReport || '');
  const resolvedPdfApiUrl = csResolvePdfApiUrl();
  return {
    impl: window.__EIDOS_PDF_EXPORT_IMPL || '',
    resolvedPdfApiUrl,
    buttonId: btn ? btn.id : null,
    buttonOnclickAttr: btn ? (btn.getAttribute('onclick') || '') : '',
    buttonDataClickAttr: btn ? (btn.getAttribute('data-click') || '') : '',
    shareButtonId: shareBtn ? shareBtn.id : null,
    shareButtonDataClickAttr: shareBtn ? (shareBtn.getAttribute('data-click') || '') : '',
    hasApiFetchInFunction: fnText.includes('csResolvePdfApiUrl'),
    hasApiFetchInShareFunction: shareFnText.includes('csResolvePdfApiUrl'),
    hasLegacyWindowPrintInFunction: fnText.includes('window.print'),
    hasLegacyHtml2PdfInShareFunction: shareFnText.includes('csGenerateDebriefPdfBlob('),
    scriptFile: Array.from(document.querySelectorAll('script[src]')).map(s => s.getAttribute('src'))
  };
};

async function csShareReport() {
  const c = csState.case;
  if (!c) return;

  const btn = document.getElementById('csShareBtn');
  const originalLabel = btn ? btn.textContent : 'Share report';
  let uiWatchdog = null;
  if (btn) { btn.textContent = 'Preparing…'; btn.disabled = true; }
  if (btn) {
    uiWatchdog = setTimeout(() => {
      if (!btn.disabled) return;
      btn.textContent = originalLabel;
      btn.disabled = false;
      _showToast('Share timed out. Try again.', 2200);
    }, 26000);
  }

  try {
    const waitState = await csWaitForDebriefReady(7000);
    if (waitState && waitState.timedOut) {
      _showToast('Expert reasoning is still loading. Exporting current report.', 2200);
    }

    const payload = csBuildReportDataPayload();
    if (!payload) throw new Error('pdf_payload_unavailable');
    const pdfApiUrl = csResolvePdfApiUrl();

    const response = await csWithTimeout(
      fetch(pdfApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
      22000,
      'pdf_api_timeout'
    );
    if (!response || !response.ok) {
      const status = response ? response.status : 'no_response';
      throw new Error(`pdf_api_${status}`);
    }

    const blob = await csWithTimeout(
      response.blob(),
      10000,
      'pdf_blob_timeout'
    );
    if (!blob) throw new Error('pdf_blob_unavailable');

    const fileName = csGetReportFileName();
    const canMakeFile = (typeof File !== 'undefined');
    const file = canMakeFile ? new File([blob], fileName, { type: 'application/pdf' }) : null;
    const shareBase = {
      title: 'EIDOS Clinical Case Report',
      text: `Clinical Case Simulation report: ${c.title}`
    };

    const canNativeShare = !!navigator.share;
    const canShareFile = !!(canNativeShare && file && (!navigator.canShare || navigator.canShare({ files: [file] })));

    if (canShareFile) {
      await csWithTimeout(navigator.share({ ...shareBase, files: [file] }), 15000, 'share_sheet_timeout');
      return;
    }

    csDownloadBlob(blob, fileName);

    if (canNativeShare) {
      await csWithTimeout(navigator.share({ ...shareBase, url: window.location.href }), 15000, 'share_sheet_timeout');
      return;
    }

    _showToast('Report downloaded. Use your share menu to send it.', 3200);
  } catch (err) {
    if (err && err.name === 'AbortError') {
      _showToast('Share canceled.', 1600);
      return;
    }
    console.warn('Share report failed.', err);
    const code = String((err && err.message) || '');
    if (code === 'share_sheet_timeout') {
      _showToast('Share sheet timed out. Try again.', 2800);
    } else if ((window.location && window.location.protocol === 'file:') && (code.includes('Failed to fetch') || code.includes('NetworkError') || code.includes('Load failed'))) {
      _showToast('Could not reach local PDF server at 127.0.0.1:8787. Start server/app.py and retry.', 3600);
    } else if (code === 'pdf_api_timeout' || code === 'pdf_blob_timeout') {
      _showToast('PDF service timed out. Please try again.', 2800);
    } else if (code.startsWith('pdf_api_')) {
      _showToast('PDF service unavailable right now. Please try again.', 2800);
    } else if (code === 'pdf_payload_unavailable') {
      _showToast('Could not build report payload. Please refresh and retry.', 2800);
    } else {
      _showToast('Could not prepare report for sharing right now. Downloading local PDF…', 2600);
    }
    if (csDownloadSimpleFallbackPdf()) {
      _showToast('Downloaded local PDF report.', 2200);
    } else {
      _showToast('Could not generate report PDF right now.', 2600);
    }
  } finally {
    if (uiWatchdog) clearTimeout(uiWatchdog);
    if (btn) { btn.textContent = originalLabel; btn.disabled = false; }
  }
}

async function csExportPDF() {
  const c = csState.case;
  if (!c) return;

  const btn = document.getElementById('csPdfBtn');
  const originalLabel = btn ? btn.textContent : 'Save as PDF';
  let uiWatchdog = null;
  if (btn) { btn.textContent = 'Preparing…'; btn.disabled = true; }
  if (btn) {
    uiWatchdog = setTimeout(() => {
      if (!btn.disabled) return;
      btn.textContent = originalLabel;
      btn.disabled = false;
      _showToast('PDF export timed out. Try again.', 2400);
    }, 28000);
  }

  try {
    const waitState = await csWaitForDebriefReady(7000);
    if (waitState && waitState.timedOut) {
      _showToast('Expert reasoning is still loading. Exporting current report.', 2200);
    }

    const payload = csBuildReportDataPayload();
    if (!payload) throw new Error('pdf_payload_unavailable');
    const pdfApiUrl = csResolvePdfApiUrl();

    const response = await csWithTimeout(
      fetch(pdfApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
      22000,
      'pdf_api_timeout'
    );
    if (!response || !response.ok) {
      const status = response ? response.status : 'no_response';
      throw new Error(`pdf_api_${status}`);
    }

    const blob = await csWithTimeout(
      response.blob(),
      10000,
      'pdf_blob_timeout'
    );
    if (!blob) throw new Error('pdf_blob_unavailable');

    csDownloadBlob(new Blob([blob], { type: 'application/pdf' }), csGetReportFileName());
    _showToast('PDF downloaded.', 1800);
  } catch (err) {
    console.warn('PDF export failed.', err);
    const code = String((err && err.message) || '');
    if ((window.location && window.location.protocol === 'file:') && (code.includes('Failed to fetch') || code.includes('NetworkError') || code.includes('Load failed'))) {
      _showToast('Could not reach local PDF server at 127.0.0.1:8787. Downloading local PDF fallback.', 3600);
    } else
    if (code === 'pdf_api_timeout' || code === 'pdf_blob_timeout') {
      _showToast('PDF service timed out. Please try again.', 2600);
    } else if (code.startsWith('pdf_api_')) {
      _showToast('PDF service unavailable right now. Please try again.', 2600);
    } else if (code === 'pdf_payload_unavailable') {
      _showToast('Could not build report payload. Please refresh and retry.', 2600);
    } else {
      _showToast('Could not export styled PDF right now. Downloading local PDF…', 2600);
    }
    if (csDownloadSimpleFallbackPdf()) {
      _showToast('Downloaded local PDF report.', 2200);
    } else {
      _showToast('Could not generate PDF. Please try again.', 2600);
    }
  } finally {
    if (uiWatchdog) clearTimeout(uiWatchdog);
    if (btn) { btn.textContent = originalLabel; btn.disabled = false; }
  }
}

// ======== PAIN LOCATION SELECTOR ========
// Edit/add landmarks here. Coordinates are normalized (0..1) within each FRONT/BACK figure.
const PAIN_PIN_DATA = {
  front: [
    // x/y values are calibrated to the exact center of each orange dot in assets/front.png
    { id:'front_shoulder_right',  label:'Shoulder',                side:'right',   view:'front', area:'shoulder', x:0.67995, y:0.20985, color:'pin-orange' },
    { id:'front_elbow_right',     label:'Elbow',                   side:'right',   view:'front', area:'elbow',    x:0.74699, y:0.35962, color:'pin-orange' },
    { id:'front_hip_right',       label:'Hip',                     side:'right',   view:'front', area:'pelvis',   x:0.62500, y:0.40965, color:'pin-orange' },
    { id:'front_knee_right',      label:'Knee / Thigh',            side:'right',   view:'front', area:'knee',     x:0.62970, y:0.59134, color:'pin-orange' },
    { id:'front_ankle_right',     label:'Ankle / Foot',            side:'right',   view:'front', area:'ankle',    x:0.61336, y:0.78156, color:'pin-orange' },
  ],
  back: [
    // x/y values are calibrated to the exact center of each orange dot in assets/back.PNG
    { id:'back_neck_mid',         label:'Neck',                    side:'midline', view:'back',  area:'cervical', x:0.49149, y:0.19145, color:'pin-orange' },
    { id:'back_thoracic_mid',     label:'Mid Back',                side:'midline', view:'back',  area:'thoracic', x:0.49143, y:0.27701, color:'pin-orange' },
    { id:'back_lumbar_mid',       label:'Lower Back',              side:'midline', view:'back',  area:'lumbar',   x:0.49182, y:0.38883, color:'pin-orange' },
    { id:'back_knee_right',       label:'Knee / Back of Thigh',    side:'right',   view:'back',  area:'knee',     x:0.63909, y:0.59666, color:'pin-orange' },
    { id:'back_ankle_left',       label:'Posterior Ankle',                   side:'left',    view:'back',  area:'ankle',    x:0.34887, y:0.77711, color:'pin-orange' },
  ]
};

const PAIN_PIN_COLOR_BY_AREA = {
  cervical: 'pin-orange',
  shoulder: 'pin-orange',
  elbow: 'pin-orange',
  thoracic: 'pin-orange',
  lumbar: 'pin-orange',
  pelvis: 'pin-orange',
  knee: 'pin-orange',
  ankle: 'pin-orange',
};

const painPinIndex = new Map();
const painSelectedIds = new Set();
let painTooltipTimer = null;
let painMapRoutingFromPin = false;

function _removeImageBackdrop(imgEl) {
  if (!imgEl || imgEl.dataset.bgProcessed === '1') return;
  if (!imgEl.complete || !imgEl.naturalWidth || !imgEl.naturalHeight) return;

  const w = imgEl.naturalWidth;
  const h = imgEl.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  ctx.drawImage(imgEl, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;

  const idx = (x, y) => ((y * w + x) * 4);
  const cornerSamples = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [Math.floor(w * 0.02), Math.floor(h * 0.02)],
    [Math.floor(w * 0.98), Math.floor(h * 0.02)],
    [Math.floor(w * 0.02), Math.floor(h * 0.98)],
    [Math.floor(w * 0.98), Math.floor(h * 0.98)]
  ];

  let br = 0, bg = 0, bb = 0;
  cornerSamples.forEach(([x, y]) => {
    const i = idx(Math.max(0, Math.min(w - 1, x)), Math.max(0, Math.min(h - 1, y)));
    br += d[i];
    bg += d[i + 1];
    bb += d[i + 2];
  });
  br /= cornerSamples.length;
  bg /= cornerSamples.length;
  bb /= cornerSamples.length;

  const tol = 32;
  const edgeLike = (x, y) => {
    const i = idx(x, y);
    if (d[i + 3] < 8) return true;
    return (
      Math.abs(d[i] - br) <= tol &&
      Math.abs(d[i + 1] - bg) <= tol &&
      Math.abs(d[i + 2] - bb) <= tol
    );
  };

  const seen = new Uint8Array(w * h);
  const qx = new Int32Array(w * h);
  const qy = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const push = (x, y) => {
    const p = y * w + x;
    if (seen[p]) return;
    if (!edgeLike(x, y)) return;
    seen[p] = 1;
    qx[tail] = x;
    qy[tail] = y;
    tail++;
  };

  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }

  while (head < tail) {
    const x = qx[head];
    const y = qy[head];
    head++;
    const i = idx(x, y);
    d[i + 3] = 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  ctx.putImageData(imgData, 0, 0);
  imgEl.src = canvas.toDataURL('image/png');
  imgEl.dataset.bgProcessed = '1';
}

function getPainLocationSelection() {
  return [...painSelectedIds]
    .map(id => painPinIndex.get(id))
    .filter(Boolean)
    .map(pin => ({ id: pin.id, label: pin.label, side: pin.side, view: pin.view }));
}

function renderPainPins() {
  ['front','back'].forEach(view => {
    const layer = document.querySelector(`#painMap [data-pin-layer="${view}"]`);
    if (!layer) return;
    layer.innerHTML = '';
    (PAIN_PIN_DATA[view] || []).forEach(pin => {
      const btn = document.createElement('button');
      const pinColor = pin.color || PAIN_PIN_COLOR_BY_AREA[pin.area] || 'pin-orange';
      btn.type = 'button';
      btn.className = `pain-pin ${pinColor}${pin.virtual ? ' pain-pin-created' : ''}`;
      btn.dataset.id = pin.id;
      btn.dataset.view = pin.view;
      btn.dataset.side = pin.side;
      btn.dataset.area = pin.area;
      btn.dataset.label = pin.label;
      btn.style.setProperty('--x', `${(pin.x * 100).toFixed(2)}%`);
      btn.style.setProperty('--y', `${(pin.y * 100).toFixed(2)}%`);
      btn.setAttribute('aria-label', pin.label);
      btn.setAttribute('aria-pressed', 'false');
      btn.title = pin.label;
      layer.appendChild(btn);
      painPinIndex.set(pin.id, pin);
    });
  });
}

function updatePainSubmitOutput() {
  // Optional on-page JSON output removed by request.
}

function syncPainPinUI() {
  document.querySelectorAll('#painMap .pain-pin').forEach(pin => {
    const active = painSelectedIds.has(pin.dataset.id);
    pin.classList.toggle('selected', active);
    pin.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  updatePainSubmitOutput();
}

function clearPainSelection() {
  painSelectedIds.clear();
  syncPainPinUI();
}

function showPainTooltip(pinEl, text) {
  const tooltip = document.getElementById('painTooltip');
  if (!tooltip || !pinEl || !text) return;
  tooltip.textContent = text;
  const rect = pinEl.getBoundingClientRect();
  tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
  tooltip.style.top = `${Math.max(8, rect.top - 8)}px`;
  tooltip.classList.add('show');
  tooltip.setAttribute('aria-hidden', 'false');
}

function hidePainTooltip() {
  const tooltip = document.getElementById('painTooltip');
  if (!tooltip) return;
  tooltip.classList.remove('show');
  tooltip.setAttribute('aria-hidden', 'true');
}

function syncPainMapSelection(area) {
  document.querySelectorAll('#painMap .pain-pin').forEach(pin => {
    pin.classList.toggle('area-match', !!area && pin.dataset.area === area);
  });
}

window.getPainLocationSelection = getPainLocationSelection;
window.submitPainLocations = function submitPainLocations() {
  const payload = getPainLocationSelection();
  updatePainSubmitOutput();
  const mapEl = document.getElementById('painMap');
  if (mapEl) mapEl.dispatchEvent(new CustomEvent('pain-location-submit', { detail: payload }));
  return payload;
};

renderPainPins();
syncPainPinUI();
document.querySelectorAll('.pain-diagram-img').forEach(img => {
  if (img.complete) _removeImageBackdrop(img);
  else img.addEventListener('load', () => _removeImageBackdrop(img), { once: true });
});

{
  const areaGridEl = document.getElementById('areaGrid');
  if (areaGridEl) {
    areaGridEl.addEventListener('click', function(e) {
      const btn = e.target.closest('.area-btn');
      if(!btn) return;
      const prevArea = state.area;
      document.querySelectorAll('.area-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.area = btn.dataset.area;
      syncPainMapSelection(state.area);

      // Manual region switches should clear stale pin selection rings.
      if (!painMapRoutingFromPin) {
        clearPainSelection();
      }

      // If area changed, clear all downstream state to prevent stale chip selections
      if (prevArea && prevArea !== state.area) {
        state.symptoms = new Set(); state.symptomText = '';
        state.agg = new Set();      state.aggText = '';
        state.alle = new Set();     state.alleText = '';
        state.objective = {};       state.specialTests = {};
        const _st = document.getElementById('symptomText'); if (_st) _st.value = '';
        const _ag = document.getElementById('aggText');     if (_ag) _ag.value = '';
        const _al = document.getElementById('alleText');    if (_al) _al.value = '';
      }

      // Render downstream chips
      renderChips('symptomChips', state.area, state.mode === 'patient' ? SYMPTOM_CHIPS_PATIENT : SYMPTOM_CHIPS);
      renderChips('aggChips', state.area, state.mode === 'patient' ? AGG_CHIPS_PATIENT : AGG_CHIPS);
      renderChips('alleChips', state.area, state.mode === 'patient' ? ALLE_CHIPS_PATIENT : ALLE_CHIPS);
      renderObjectiveFields();
    });
  }
}

const painMapEl = document.getElementById('painMap');
if (painMapEl) {
  painMapEl.addEventListener('click', function(e) {
    const pin = e.target.closest('.pain-pin');
    if (!pin) return;
    const pinId = pin.dataset.id;
    const wasSelected = painSelectedIds.has(pinId);
    painSelectedIds.clear();
    if (!wasSelected) painSelectedIds.add(pinId);
    syncPainPinUI();
    showPainTooltip(pin, pin.dataset.label || pin.getAttribute('aria-label'));
    clearTimeout(painTooltipTimer);
    painTooltipTimer = setTimeout(hidePainTooltip, 1100);

    // Route to the same pathway as the legacy area buttons.
    const mappedArea = pin.dataset.area;
    if (mappedArea) {
      const areaBtn = document.querySelector(`.area-btn[data-area="${mappedArea}"]`);
      if (areaBtn) {
        painMapRoutingFromPin = true;
        try {
          areaBtn.click();
        } finally {
          painMapRoutingFromPin = false;
        }
      }
    }
  });

  painMapEl.addEventListener('touchend', function(e) {
    const pin = e.target.closest('.pain-pin');
    if (!pin) return;
    e.preventDefault();
    pin.click();
  }, { passive: false });

  painMapEl.addEventListener('mouseover', function(e) {
    const pin = e.target.closest('.pain-pin');
    if (!pin) return;
    showPainTooltip(pin, pin.dataset.label || pin.getAttribute('aria-label'));
  });
  painMapEl.addEventListener('mouseout', function(e) {
    if (e.target.closest('.pain-pin')) hidePainTooltip();
  });
  painMapEl.addEventListener('focusin', function(e) {
    const pin = e.target.closest('.pain-pin');
    if (!pin) return;
    showPainTooltip(pin, pin.dataset.label || pin.getAttribute('aria-label'));
  });
  painMapEl.addEventListener('focusout', function(e) {
    if (e.target.closest('.pain-pin')) hidePainTooltip();
  });
}

// ======== AREA GRID KEYBOARD NAV ========
{
  const areaGridEl = document.getElementById('areaGrid');
  if (areaGridEl) {
    areaGridEl.addEventListener('keydown', function(e) {
      const btns = Array.from(this.querySelectorAll('.area-btn'));
      const idx = btns.indexOf(document.activeElement);
      if (idx === -1) return;
      const cols = Math.round(areaGridEl.offsetWidth / (areaGridEl.querySelector('.area-btn') ? areaGridEl.querySelector('.area-btn').offsetWidth : 160)) || (window.innerWidth < 520 ? 2 : 4);
      let next = -1;
      if (e.key === 'ArrowRight') next = idx + 1;
      else if (e.key === 'ArrowLeft') next = idx - 1;
      else if (e.key === 'ArrowDown') next = idx + cols;
      else if (e.key === 'ArrowUp') next = idx - cols;
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btns[idx].click(); return; }
      if (next >= 0 && next < btns.length) btns[next].focus();
    });
  }
}
