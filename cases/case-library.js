// ══════════════════════════════════════════════════════════════════════════
// CASE LIBRARY
// ══════════════════════════════════════════════════════════════════════════

(function() {
'use strict';

const CASE_LIBRARY = {

  beginner: [
    {
      id: 'b1',
      title: 'Lateral knee pain in a runner',
      region: 'Knee',
      info: { age: '28', sex: 'Female', occupation: 'Secondary school teacher / recreational runner', onset: '6 weeks', duration: 'Subacute' },
      vignette: `<p>A 28-year-old female teacher and recreational runner presents with <strong>right lateral knee pain</strong> that began gradually around 6 weeks ago, coinciding with increasing her weekly running mileage from 30 to 50 km in preparation for her first half-marathon.</p>
        <p>She describes a sharp, burning pain over the lateral knee that comes on predictably at approximately 20–25 minutes into a run, then worsens progressively to the point where she has to stop. The pain resolves within an hour of rest. She has no pain walking, cycling, or going up stairs — only descending stairs causes a mild ache. No swelling, locking, giving way, or trauma.</p>
        <p>She has trained on the same route for two years. She recently switched to a new pair of running shoes. She has no relevant past medical history and no medications.</p>`,
      redFlags: ['Unexplained night pain / rest pain not related to activity', 'Fever or constitutional symptoms', 'Significant unexplained weight loss', 'History of cancer'],
      examCategories: [
        { name: 'Observation & Gait', items: [
          { name: 'Gait analysis (walking)', result: 'Normal walking gait. Slight contralateral pelvic drop on right single-leg loading noted.', valence: 'neutral' },
          { name: 'Static posture / limb alignment', result: 'Mild bilateral genu varum. Slight ipsilateral hip drop in single-leg stance.', valence: 'neutral' },
        ]},
        { name: 'Range of Motion', items: [
          { name: 'Knee flexion / extension ROM', result: 'Full and pain-free bilaterally.', valence: 'neg' },
          { name: 'Hip IR / ER ROM', result: 'Full range bilaterally. No pain.', valence: 'neg' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Lateral joint line palpation', result: 'Mild tenderness at the lateral joint line, approximately 1–2 cm proximal.', valence: 'neutral' },
          { name: 'ITB / lateral femoral epicondyle palpation', result: 'Exquisite point tenderness over the lateral femoral epicondyle at approximately 30° knee flexion. Reproduces pain.', valence: 'pos' },
          { name: 'Popliteus / LCL palpation', result: 'No tenderness over LCL or popliteus origin.', valence: 'neg' },
          { name: 'Tibial attachment / fibular head', result: 'No tenderness.', valence: 'neg' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Noble compression test (30° flexion)', result: 'Positive — reproduces lateral knee pain at 30° knee flexion with direct compression over lateral epicondyle.', valence: 'pos' },
          { name: 'Ober test', result: 'Mildly positive — slight restriction of hip adduction with knee flexed, suggesting ITB / TFL tightness.', valence: 'pos' },
          { name: 'McMurray test', result: 'Negative — no pain or click with valgus/varus and rotation.', valence: 'neg' },
          { name: 'Lachman test', result: 'Negative — firm end-feel, no laxity.', valence: 'neg' },
          { name: 'Varus stress test (0° and 30°)', result: 'Negative — LCL intact, no laxity or pain.', valence: 'neg' },
        ]},
        { name: 'Strength & Functional', items: [
          { name: 'Single-leg squat (5 reps)', result: 'Dynamic valgus collapse at the knee bilaterally, right greater than left. Hip drop present.', valence: 'pos' },
          { name: 'Hip abductor strength (side-lying)', result: 'Reduced right hip abductor strength (4/5) compared to left (5/5).', valence: 'pos' },
          { name: 'Quadriceps / hamstring strength', result: 'Equal bilaterally, 5/5.', valence: 'neg' },
        ]},
        { name: 'Neurological', items: [
          { name: 'Lower limb sensation', result: 'Intact L3–S2 dermatomal distribution bilaterally.', valence: 'neg' },
          { name: 'Patellar / Achilles reflexes', result: 'Symmetric and normal bilaterally.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Iliotibial Band Syndrome (ITBS)',
      correctDxAliases: ['itbs', 'iliotibial band', 'iliotibial band syndrome', 'it band syndrome', 'it band friction syndrome', 'itb syndrome'],
      keyDifferentials: ['Lateral meniscus tear', 'LCL sprain', 'Popliteus tendinopathy'],
      keyFindings: [
        { icon: '✓', text: '<strong>Noble compression test positive</strong> — exquisite tenderness at the lateral epicondyle at exactly 30° flexion is the hallmark of ITB compression syndrome.' },
        { icon: '✓', text: '<strong>Predictable onset at 20–25 min of running</strong> — this "impingement zone" pattern is a classic ITBS feature absent in structural joint pathology.' },
        { icon: '✓', text: '<strong>Reduced hip abductor strength + dynamic valgus</strong> — hip weakness is the most important correctable biomechanical contributor.' },
        { icon: '✗', text: '<strong>Negative McMurray and joint line tenderness</strong> — effectively rules out meniscal pathology as the primary structure.' },
        { icon: '✗', text: '<strong>Negative Lachman and varus stress</strong> — rules out ACL and LCL involvement.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis', key: 'finalDx', weight: 3 },
        { criterion: 'ITBS in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes load modification + hip strengthening', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning explains discriminating features', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Patellar grind test', result: 'Negative — no crepitus or pain with patellar compression. Patellofemoral joint not implicated.', valence: 'neg' },
        { name: 'Valgus stress test (0° and 30°)', result: 'Negative — no medial joint opening or pain. MCL intact. Medial compartment pathology excluded.', valence: 'neg' },
        { name: 'Trendelenburg test', result: 'Positive right — pelvis drops on the left with right single-leg stance, confirming right gluteus medius weakness as a biomechanical contributor.', valence: 'pos' },
        { name: 'Thomas test', result: 'Mildly positive bilaterally — hip flexor tightness present. Right TFL visibly tighter than left, contributing to ITB tension.', valence: 'pos' },
        { name: 'McMurray test', result: 'Negative — no pain, click, or locking with valgus/varus stress and rotation. Meniscal pathology excluded as a pain source.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Iliotibial Band Syndrome (ITBS). Key reasoning: The "20-minute rule" (predictable onset at a consistent time/distance), Noble compression test positive at the lateral femoral epicondyle at 30° knee flexion, and absence of any mechanical joint signs (negative McMurray, Lachman, varus stress) are the discriminating cluster. Hip abductor weakness and dynamic valgus collapse on single-leg squat identify the primary biomechanical driver. Management centres on load management, hip strengthening, and progressive running return.`,
    },

    {
      id: 'b2',
      title: 'Anterior shoulder pain in a swimmer',
      region: 'Shoulder',
      info: { age: '34', sex: 'Male', occupation: 'Software developer / competitive Masters swimmer', onset: '8 weeks', duration: 'Subacute' },
      vignette: `<p>A 34-year-old male software developer and competitive Masters swimmer presents with a <strong>gradual onset of anterior shoulder pain</strong> over the past 8 weeks. He swims 5 mornings per week and recently increased his total weekly yardage by 30% ahead of a regional competition.</p>
        <p>He describes a deep, aching anterior shoulder pain that is present during freestyle and butterfly strokes — particularly at the catch phase (arm overhead with early pull-through). He has noticeable pain on the first few strokes of a session that tends to ease slightly with warm-up. He also reports pain when reaching overhead to retrieve items from shelves and when sleeping on the affected side.</p>
        <p>He denies any acute injury, locking, or instability. There is no radiation to the arm or neck. He has previously had mild shoulder discomfort in the same shoulder approximately 3 years ago that resolved with a period of rest.</p>`,
      redFlags: ['Axillary lymphadenopathy', 'Unexplained constitutional symptoms / weight loss', 'Pain unrelated to movement or loading', 'History of malignancy'],
      examCategories: [
        { name: 'Observation', items: [
          { name: 'Resting posture', result: 'Mild bilateral forward head posture and rounded shoulders. Slight low-grade anterior shoulder rounding right > left.', valence: 'neutral' },
          { name: 'Muscle bulk comparison', result: 'No wasting. Symmetric bulk bilaterally.', valence: 'neg' },
        ]},
        { name: 'Active ROM', items: [
          { name: 'Shoulder flexion', result: '170° right (pain at end range). 180° left.', valence: 'neutral' },
          { name: 'Shoulder ER / IR (at side)', result: 'ER 90°, IR 55° right. ER 85°, IR 70° left. Reduced IR on right.', valence: 'pos' },
          { name: 'Horizontal adduction', result: 'Positive pain reproduction at end range right.', valence: 'pos' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Bicipital groove / LHB tendon', result: 'Moderate tenderness directly over the bicipital groove with arm in 10° internal rotation.', valence: 'pos' },
          { name: 'Supraspinatus insertion', result: 'Mild tenderness at the anterior supraspinatus.', valence: 'neutral' },
          { name: 'AC joint', result: 'No tenderness.', valence: 'neg' },
          { name: 'Posterior capsule', result: 'Mild tightness and discomfort on posterior capsule palpation.', valence: 'neutral' },
        ]},
        { name: 'Special Tests — Impingement', items: [
          { name: 'Hawkins-Kennedy test', result: 'Positive — reproduces deep anterior shoulder pain.', valence: 'pos' },
          { name: 'Neer impingement sign', result: 'Positive — mild pain at end-range passive forward flexion.', valence: 'pos' },
          { name: 'Painful arc (60–120°)', result: 'Mild pain 90–120° elevation. Pain does not disappear completely in this arc.', valence: 'neutral' },
        ]},
        { name: 'Special Tests — LHB Tendon', items: [
          { name: "Speed's test", result: 'Positive — pain in the bicipital groove with resisted shoulder flexion, elbow extended, forearm supinated.', valence: 'pos' },
          { name: "Yergason's test", result: 'Positive — pain in bicipital groove with resisted supination and ER at 90° elbow flexion.', valence: 'pos' },
          { name: 'Upper cut test', result: 'Positive — bicipital groove pain with resisted shoulder flexion from hip level.', valence: 'pos' },
        ]},
        { name: 'Rotator Cuff Integrity', items: [
          { name: 'External rotation lag test', result: 'Negative — able to maintain ER against gravity. No lag.', valence: 'neg' },
          { name: 'Internal rotation lag test', result: 'Negative — subscapularis intact.', valence: 'neg' },
          { name: 'Drop arm test', result: 'Negative — able to lower arm slowly and with control.', valence: 'neg' },
          { name: 'Infraspinatus strength test', result: '5/5 bilaterally. No weakness or pain.', valence: 'neg' },
        ]},
        { name: 'Scapular Control', items: [
          { name: 'Dynamic scapular observation (arm elevation)', result: 'Mild dysrhythmia on right — slight early elevation and winging at 90–120° elevation.', valence: 'neutral' },
          { name: 'Scapular retraction test (impingement symptom change)', result: 'Hawkins pain reduced but not eliminated with manual scapular retraction.', valence: 'pos' },
        ]},
      ],
      correctDx: 'Long Head of Biceps (LHB) Tendinopathy',
      correctDxAliases: ['lhb', 'lhb tendinopathy', 'long head biceps', 'biceps tendinopathy', 'long head of biceps tendinopathy', 'bicipital tendinopathy'],
      keyDifferentials: ['Rotator Cuff Tendinopathy (Shoulder Tendon Pain)', 'SLAP lesion', 'AC Joint Pathology'],
      keyFindings: [
        { icon: '✓', text: '<strong>Triple positive LHB cluster</strong> — Speed\'s, Yergason\'s, and upper cut all positive and reproducing bicipital groove pain is the discriminating cluster for LHB tendinopathy.' },
        { icon: '✓', text: '<strong>Point tenderness over bicipital groove at 10° IR</strong> — confirms the LHB tendon as the pain source.' },
        { icon: '✓', text: '<strong>Intact rotator cuff (negative lag signs)</strong> — rules out significant RC tear despite positive impingement signs.' },
        { icon: '✗', text: '<strong>Reduced IR + posterior capsule tightness</strong> — suggests GIRD (glenohumeral internal rotation deficit) as a swimmer\'s predisposing factor.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (LHB tendinopathy)', key: 'finalDx', weight: 3 },
        { criterion: 'LHB or biceps tendinopathy in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes posterior capsule stretching / biceps loading', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning cites LHB cluster + intact RC findings', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'External rotation lag test', result: 'Negative — no lag present. Full strength maintained at end-range ER. Rules out supraspinatus / infraspinatus full-thickness tear.', valence: 'neg' },
        { name: 'O\'Brien test (SLAP)', result: 'Mildly positive — pain with the test but reduced on supination, suggesting possible LHB/superior labrum involvement consistent with the bicipital pathology.', valence: 'pos' },
        { name: 'Posterior capsule tightness (cross-body stretch)', result: 'Positive right — notable restriction and posterior shoulder discomfort with cross-body adduction, confirming posterior capsular contracture (GIRD).', valence: 'pos' },
        { name: 'Apprehension / relocation test', result: 'Negative — no sense of instability or apprehension with external rotation and abduction. GH instability excluded.', valence: 'neg' },
        { name: 'Lift-off test (subscapularis)', result: 'Negative — able to lift hand off lower back against resistance. Subscapularis integrity confirmed. Not the pain source.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Long Head of Biceps (LHB) tendinopathy. The triple-positive LHB cluster (Speed's, Yergason's, upper cut) combined with exquisite bicipital groove tenderness at 10° IR is the discriminating finding. The subacromial impingement signs (Hawkins, Neer) are common co-findings but do not represent the primary pain source — the intact rotator cuff (negative lag signs, no weakness) supports this. The swimmer's reduced IR and posterior capsule tightness (GIRD) is a key predisposing biomechanical factor. Management includes posterior capsule stretching, progressive biceps loading, and structured return to swim volume.`,
    },

    {
      id: 'b3',
      title: 'Heel pain in a middle-aged man',
      region: 'Ankle / Foot',
      info: { age: '47', sex: 'Male', occupation: 'Retail store manager', onset: '3 months', duration: 'Subacute–chronic' },
      vignette: `<p>A 47-year-old male store manager presents with <strong>right heel pain</strong> that has been present for approximately 3 months. He is on his feet for 8–10 hours per day and has gained approximately 8 kg over the past year following a change in role.</p>
        <p>He describes a <strong>sharp, stabbing pain on the underside of his right heel</strong> that is worst when he takes his first steps in the morning — so severe he has to limp for the first 5–10 minutes. The pain improves once he has been walking for 10–15 minutes, but returns with prolonged standing, particularly on hard floors. He also notices pain after sitting for a period and then standing up again.</p>
        <p>He wears work shoes that he describes as "flat and unsupportive." He is not a runner and does no regular structured exercise. He has no history of inflammatory arthritis, no trauma, no fever, and no referred pain into the leg. He denies numbness or tingling.</p>`,
      redFlags: ['Rest pain, night pain not related to position', 'Systemic features (fever, malaise)', 'Known inflammatory arthropathy flare', 'Bilateral heel pain (consider seronegative arthropathy)'],
      examCategories: [
        { name: 'Observation & Gait', items: [
          { name: 'Foot posture / arch assessment', result: 'Bilateral moderate pes planus (pronated foot posture). Right slightly greater than left.', valence: 'neutral' },
          { name: 'Antalgic gait', result: 'Mild antalgic gait on right — reduced heel strike, slight heel-off promotion.', valence: 'neutral' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Medial calcaneal tuberosity (plantar fascia origin)', result: 'Exquisite point tenderness at the medial calcaneal tuberosity — reproduces the chief complaint immediately.', valence: 'pos' },
          { name: 'Plantar fascia body (midsubstance)', result: 'Mild tenderness along the medial band distally, less severe than at origin.', valence: 'neutral' },
          { name: 'Posterior calcaneus / Achilles insertion', result: 'No tenderness. Achilles tendon itself non-tender.', valence: 'neg' },
          { name: 'Tarsal tunnel (medial malleolus)', result: "No Tinel's sign. No tenderness.', valence: 'neg" },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Windlass test (weight-bearing)', result: 'Positive — passive great toe extension reproduces medial heel pain immediately in weight-bearing.', valence: 'pos' },
          { name: 'Windlass test (non-weight-bearing)', result: 'Mildly positive — some discomfort but less than weight-bearing version.', valence: 'neutral' },
          { name: "Tinel's sign (tarsal tunnel)", result: 'Negative — no paraesthesias, no radiation to toes.', valence: 'neg' },
          { name: 'Dorsiflexion-eversion test (tarsal tunnel)', result: 'Negative — no neurological symptoms reproduced.', valence: 'neg' },
        ]},
        { name: 'Ankle ROM', items: [
          { name: 'Ankle dorsiflexion (weight-bearing lunge)', result: 'Right 7 cm (reduced). Left 10 cm. Bilateral limitation but right significantly restricted.', valence: 'pos' },
          { name: 'Subtalar / midfoot mobility', result: 'Mildly reduced subtalar eversion range bilaterally.', valence: 'neutral' },
        ]},
        { name: 'Neurological Screen', items: [
          { name: 'Sensation — plantar surface', result: 'Intact and equal bilaterally.', valence: 'neg' },
          { name: 'Ankle / toe power', result: '5/5 bilaterally.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Plantar Fasciitis',
      correctDxAliases: ['plantar fasciitis', 'plantar fasciopathy', 'plantar fascia', 'heel spur syndrome', 'plantar heel pain'],
      keyDifferentials: ['Tarsal tunnel syndrome', 'Calcaneal stress fracture', 'Insertional Achilles tendinopathy', 'Baxter\'s nerve entrapment'],
      keyFindings: [
        { icon: '✓', text: '<strong>First-step morning pain pattern</strong> — the classic start-up pain of plantar fasciitis is caused by the fascia contracting overnight and being loaded abruptly with weight-bearing.' },
        { icon: '✓', text: '<strong>Point tenderness at medial calcaneal tuberosity</strong> — the most consistent clinical finding in plantar fasciitis.' },
        { icon: '✓', text: '<strong>Positive weight-bearing Windlass test</strong> — passive great toe extension in weight-bearing reproduces origin pain by tensioning the plantar fascia.' },
        { icon: '✓', text: '<strong>Reduced ankle dorsiflexion</strong> — calf/Achilles tightness is the most important modifiable risk factor.' },
        { icon: '✗', text: '<strong>Negative Tinel\'s and dorsiflexion-eversion tests</strong> — rules out tarsal tunnel syndrome as a neurological mimicker.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (plantar fasciitis)', key: 'finalDx', weight: 3 },
        { criterion: 'Plantar fasciitis in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes dorsiflexion stretching + intrinsic loading', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning cites morning start-up pattern + Windlass + tuberosity tenderness', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Tinel\'s sign (posterior tibial nerve)', result: 'Negative — no tingling or burning reproduced posterior to medial malleolus. Tarsal tunnel syndrome excluded.', valence: 'neg' },
        { name: 'Dorsiflexion-eversion test', result: 'Negative — no tarsal tunnel symptoms with sustained dorsiflexion and eversion. Confirms no nerve entrapment.', valence: 'neg' },
        { name: 'Ankle dorsiflexion (knee extended)', result: 'Reduced bilaterally — right 6°, left 9°. Gastrocnemius tightness identified as a key biomechanical driver of plantar fascial load.', valence: 'pos' },
        { name: 'Navicular drop test', result: 'Positive — 12 mm navicular drop on right. Excessive pronation contributing to medial fascial strain.', valence: 'pos' },
        { name: 'Anterior drawer test (ankle)', result: 'Negative — firm end-feel, no anterior talar translation. ATFL intact. Lateral ligament injury excluded as the pain source.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is plantar fasciitis. The clinical triad — first-step morning pain, point tenderness at the medial calcaneal tuberosity, and positive weight-bearing Windlass test — provides strong pattern consistency. Negative Tinel's sign and dorsiflexion-eversion tests effectively exclude tarsal tunnel syndrome. Reduced ankle dorsiflexion identifies calf complex tightness as the key biomechanical driver. Management: calf and plantar fascia stretching (soleus specifically), intrinsic foot strengthening, supportive footwear, and progressive load management.`,
    },
    {
      id: 'b4',
      title: 'Heel cord pain in a runner',
      region: 'Ankle',
      info: { age: '42', sex: 'Male', occupation: 'Architect / marathon runner', onset: '3 months', duration: 'Chronic' },
      vignette: `<p>A 42-year-old male architect presents with <strong>posterior ankle pain</strong> that has been bothering him for 3 months. He is training for a marathon and recently incorporated hill sprints into his routine.</p><p>He describes a stiff, aching pain in the Achilles tendon. The pain is worst first thing in the morning when walking down the stairs, but it tends to "warm up" and feel better after 10-15 minutes of walking or a mile into his run. However, the pain returns intensely 2-3 hours after he finishes running.</p><p>He denies any sudden "pop" or acute trauma, has no numbness or tingling in the foot, and has no pain under the heel. He has tried resting completely for 2 weeks, which made the pain go away, but it returned immediately on his first run back.</p>`,
      redFlags: ['Recent fluoroquinolone antibiotic use', 'Painless progressive weakness', 'Fever or systemic symptoms', 'Prior corticosteroid injection to the tendon'],
      examCategories: [
        { name: 'Observation & Gait', items: [
          { name: 'Gait analysis', result: 'Mild antalgic gait during first few steps, normalizes quickly. Normal foot posture.', valence: 'neutral' },
          { name: 'Visual inspection of tendon', result: 'Visible localized thickening (nodule) approximately 4 cm proximal to the calcaneal insertion.', valence: 'pos' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Mid-portion Achilles palpation (2-6 cm)', result: 'Exquisite point tenderness 4 cm proximal to the calcaneus.', valence: 'pos' },
          { name: 'Calcaneal insertion palpation', result: 'No tenderness at the calcaneal insertion or retrocalcaneal bursa.', valence: 'neg' },
          { name: 'Medial calcaneal tuberosity (plantar fascia)', result: 'No tenderness under the heel.', valence: 'neg' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Thompson Test', result: 'Negative — normal plantarflexion with calf squeeze. Tendon is intact.', valence: 'neg' },
          { name: 'Painful Arc Sign (Achilles)', result: 'Positive — the tender nodule moves proximally and distally with ankle dorsiflexion and plantarflexion.', valence: 'pos' },
          { name: 'Royal London Hospital Test', result: 'Positive — the point tenderness significantly decreases when the ankle is actively dorsiflexed.', valence: 'pos' },
        ]},
        { name: 'Strength & Functional', items: [
          { name: 'Single Heel Raise Test (endurance)', result: 'Right 12 reps (painful). Left 28 reps (pain-free). Significant endurance deficit.', valence: 'pos' },
          { name: 'Ankle ROM', result: 'Dorsiflexion (knee straight) is 10° right, 15° left. Mildly restricted.', valence: 'neutral' },
        ]},
      ],
      correctDx: 'Achilles Tendinopathy',
      correctDxAliases: ['achilles tendinopathy', 'mid-portion achilles tendinopathy', 'achilles tendinosis', 'achilles tendonitis'],
      keyDifferentials: ['Achilles Tendon Rupture Suspected (urgent referral)', 'Plantar Fasciitis', 'Retrocalcaneal Bursitis', 'Tarsal Tunnel Syndrome'],
      keyFindings: [
        { icon: '✓', text: '<strong>Warm-up phenomenon</strong> — classic tendinopathic pain behavior.' },
        { icon: '✓', text: '<strong>Positive Painful Arc and Royal London Hospital tests</strong> — highly specific clinical tests for mid-portion Achilles tendinopathy.' },
        { icon: '✗', text: '<strong>Negative Thompson Test</strong> — effectively rules out complete Achilles rupture.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Achilles tendinopathy)', key: 'finalDx', weight: 3 },
        { criterion: 'Identified as mid-portion', key: 'reasoning', weight: 2 },
        { criterion: 'Management includes progressive heavy slow resistance', key: 'management', weight: 2 },
        { criterion: 'Ruled out complete rupture', key: 'reasoning', weight: 1 },
      ],
      additionalTests: [
        { name: 'Talar tilt test', result: 'Negative — no CFL laxity. Lateral ligament complex intact. Ankle instability excluded.', valence: 'neg' },
        { name: 'Anterior drawer test (ankle)', result: 'Negative — firm end-feel, no anterior talar translation. ATFL intact. Ligamentous injury excluded.', valence: 'neg' },
        { name: 'Insertional Achilles palpation (bone-tendon junction)', result: 'No tenderness at calcaneal insertion. Confirms mid-portion pathology — not insertional tendinopathy or retrocalcaneal bursitis.', valence: 'neg' },
        { name: 'Calf flexibility (ankle dorsiflexion knee bent)', result: 'Positive — right dorsiflexion 8° with knee bent (soleus tightness). Left 14°. Soleus restriction increases Achilles load during running.', valence: 'pos' },
        { name: 'Windlass test (weight-bearing)', result: 'Negative — no heel pain reproduced with passive great toe extension. Plantar fasciitis excluded as the pain source.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Achilles Tendinopathy. The patient exhibits the classic "warm-up" phenomenon where tendon pain improves during activity but worsens hours later. The objective exam confirms mid-portion localization (tenderness 4 cm proximal to insertion), verified by positive Painful Arc and Royal London Hospital tests. The negative Thompson test is critical to document to rule out rupture. Complete rest failed (as is typical for tendinopathy). Management should focus on progressive tendon loading (Alfredson eccentric protocol or heavy slow resistance) while managing running volume.`,
    },
    {
      id: 'b5',
      title: 'Achy lower back after starting an office job',
      region: 'Lumbar',
      info: { age: '24', sex: 'Female', occupation: 'Marketing coordinator', onset: '4 months', duration: 'Chronic' },
      vignette: `<p>A 24-year-old female presents with a 4-month history of <strong>diffuse, dull lower back pain</strong>. The pain started gradually after she transitioned from being a college student to working a full-time desk job. She sits for 8-9 hours a day.</p>
        <p>She describes the pain as an annoying, tight ache across her entire lower back (belt-line area). It is worst at the end of her workday and improves on weekends or when she goes for a walk. She has started cracking her own back to get temporary relief.</p>
        <p>She denies any sharp, shooting pain down her legs, no numbness or tingling, and no trauma. She joined a gym last week and noticed that doing deadlifts actually made her back feel slightly better the next day, though she is anxious about "slipping a disc."</p>`,
      redFlags: ['Night sweats or fever', 'Bowel or bladder changes', 'Pain unremitting with rest or position change', 'History of cancer'],
      examCategories: [
        { name: 'Observation & Posture', items: [
          { name: 'Standing posture', result: 'Mild increased lumbar lordosis. Anterior pelvic tilt. No lateral shift.', valence: 'neutral' },
          { name: 'Gait', result: 'Normal, pain-free gait.', valence: 'neg' },
        ]},
        { name: 'Range of Motion', items: [
          { name: 'Lumbar Flexion', result: 'Full range (fingers to floor). Mild tightness felt in lower back at end range, but no sharp pain.', valence: 'neutral' },
          { name: 'Lumbar Extension', result: 'Full range. Centralizes the mild ache, feels "good" to the patient.', valence: 'pos' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Lumbar paraspinals', result: 'Mild hypertonicity and diffuse tenderness bilaterally at L4-S1. No bony point tenderness.', valence: 'pos' },
          { name: 'SI Joint', result: 'No tenderness over the PSIS or long dorsal ligament.', valence: 'neg' },
        ]},
        { name: 'Neurological & Neural Tension', items: [
          { name: 'SLR (Straight Leg Raise)', result: 'Negative bilaterally to 80°. Normal hamstring tension, no nerve pain.', valence: 'neg' },
          { name: 'Slump Test', result: 'Negative.', valence: 'neg' },
          { name: 'Lower quarter neurological screen', result: 'Dermatomes, myotomes, and reflexes are completely normal.', valence: 'neg' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Prone Instability Test', result: 'Negative.', valence: 'neg' },
          { name: 'SIJ Provocation Cluster', result: 'Negative (0/5 positive).', valence: 'neg' },
        ]},
      ],
      correctDx: 'Chronic Non-Specific Low Back Pain',
      correctDxAliases: ['non-specific low back pain', 'mechanical low back pain', 'postural low back pain', 'chronic low back pain', 'muscle strain'],
      keyDifferentials: ['Lumbar Disc Herniation', 'SIJ Dysfunction', 'Lumbar Facet Syndrome'],
      keyFindings: [
        { icon: '✓', text: '<strong>Diffuse pain relieved by movement</strong> — classic mechanical/postural presentation driven by prolonged static positioning.' },
        { icon: '✓', text: '<strong>No neurological signs</strong> — negative SLR, Slump, and normal neuro screen completely rule out radiculopathy or disc involvement.' },
        { icon: '✗', text: '<strong>Negative SIJ Cluster</strong> — rules out the sacroiliac joint as the pain generator.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Non-specific LBP)', key: 'finalDx', weight: 3 },
        { criterion: 'Identified the absence of neurological features', key: 'reasoning', weight: 2 },
        { criterion: 'Management focuses on reassurance, activity, and graded loading', key: 'management', weight: 2 },
        { criterion: 'Red flags screened', key: 'redFlags', weight: 1 },
      ],
      additionalTests: [
        { name: 'SLR — Ipsilateral (straight leg raise)', result: 'Negative bilaterally at 80°. No radicular leg pain reproduced. Neural tension signs absent — disc herniation or radiculopathy excluded.', valence: 'neg' },
        { name: 'SI provocation — thigh thrust', result: 'Negative — no posterior pelvic pain reproduced. SI joint dysfunction not the primary driver.', valence: 'neg' },
        { name: 'Prone instability test', result: 'Positive — pain at L4/5 during passive posterior-anterior pressure reduces with active back extension. Suggests mild segmental instability component.', valence: 'pos' },
        { name: 'Hip flexion / extension ROM', result: 'Mild hip flexor tightness bilaterally (Thomas test positive) — contributing to anterior pelvic tilt and lumbar loading pattern.', valence: 'pos' },
        { name: 'SI provocation — FABER', result: 'Negative — no posterior pelvic or groin pain reproduced. SI joint not the primary pain source.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Chronic Non-Specific Low Back Pain (Mechanical/Postural). This is the most common presentation of LBP. The key to this case is recognizing the ABSENCE of specific pathology: the neurological screen is entirely normal, neural tension tests (SLR, Slump) are negative, and the SIJ cluster is negative. The pain is purely somatic and driven by prolonged static loading (sitting). The fact that deadlifts improved her symptoms is a strong clinical clue that her tissues need load capacity, not rest. Management should focus heavily on pain neuroscience education (reassuring her that her back is robust and not damaged), ergonomic advice to break up static postures, and progressive loading via resistance training.`,
    },
    {
      id: 'b6',
      title: 'Stiff neck and headaches in a desk worker',
      region: 'Cervical',
      info: { age: '28', sex: 'Female', occupation: 'Graphic Designer', onset: '3 weeks', duration: 'Subacute' },
      vignette: `<p>A 28-year-old female graphic designer presents with a 3-week history of <strong>aching neck pain and stiffness</strong>. She reports the pain is focused at the base of her neck and frequently spreads up into the back of her head, causing dull, pressure-like headaches by the mid-afternoon.</p>
        <p>Her symptoms are worst at the end of her workday after sitting at her dual-monitor setup, and they improve significantly after a hot shower or when she goes to her weekend yoga class. She feels like her head is "heavy" and she constantly wants to stretch her neck.</p>
        <p>She denies any sharp pain shooting down her arms, has no numbness or tingling in her fingers, and has not been in any recent car accidents or trauma. She states she has been under high stress recently due to a project deadline.</p>`,
      redFlags: ['Dizziness, drop attacks, or facial numbness (VBI)', 'Bilateral arm tingling', 'History of rheumatoid arthritis or Down syndrome (C1-C2 instability)'],
      examCategories: [
        { name: 'Observation & Posture', items: [
          { name: 'Seated posture', result: 'Marked forward head posture with increased lower cervical flexion and upper cervical extension. Shoulders protracted bilaterally.', valence: 'pos' },
        ]},
        { name: 'Cervical ROM', items: [
          { name: 'Active ROM', result: 'Flexion full. Extension limited by 25% with a "pinching" ache at C5-C7. Rotation limited bilaterally by 15° due to muscular tightness.', valence: 'pos' },
          { name: 'Passive ROM', result: 'Similar to active ROM, firm muscular end-feel on rotation.', valence: 'neutral' },
        ]},
        { name: 'Palpation & Muscle Length', items: [
          { name: 'Upper Trapezius & Levator Scapulae', result: 'Significant hypertonicity and trigger points bilaterally. Palpation of suboccipitals reproduces her familiar headache.', valence: 'pos' },
          { name: 'Cervical Facet Joints', result: 'Mild diffuse tenderness C5-C7 paraspinally, but no sharp localized facet pain.', valence: 'neutral' },
        ]},
        { name: 'Neurological & Special Tests', items: [
          { name: 'Spurling Test (Compression)', result: 'Negative — reproduces local neck ache, but NO radiating arm pain.', valence: 'neg' },
          { name: 'Upper Limb Tension Test 1 (ULTT1)', result: 'Negative bilaterally. Normal tissue stretch feeling only.', valence: 'neg' },
          { name: 'Dermatomes, Myotomes, Reflexes', result: 'Intact and normal C5-T1 bilaterally.', valence: 'neg' },
        ]},
        { name: 'Motor Control', items: [
          { name: 'Cranial Cervical Flexion Test (CCFT)', result: 'Poor activation of deep neck flexors. Patient substitutes with SCM immediately at 22mmHg.', valence: 'pos' },
        ]},
      ],
      correctDx: 'Cervical Mobility Deficit / Mechanical Neck Pain',
      correctDxAliases: ['mechanical neck pain', 'postural syndrome', 'cervicogenic headache', 'cervical mobility deficit', 'upper crossed syndrome'],
      keyDifferentials: ['Cervical Radiculopathy', 'Cervical Facet Syndrome', 'Thoracic Outlet Syndrome'],
      keyFindings: [
        { icon: '✓', text: '<strong>Postural driver</strong> — symptoms perfectly match a sustained forward-head loading pattern with suboccipital tension causing cervicogenic headaches.' },
        { icon: '✓', text: '<strong>Negative neuro screen</strong> — negative Spurling and ULTT1, combined with normal reflexes/strength, definitively rules out radiculopathy.' },
        { icon: '✓', text: '<strong>Deep neck flexor inhibition</strong> — failed CCFT is the classic motor control deficit associated with mechanical neck pain.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Mechanical Neck Pain / Postural)', key: 'finalDx', weight: 3 },
        { criterion: 'Recognizes absence of radicular symptoms', key: 'reasoning', weight: 2 },
        { criterion: 'Management targets deep neck flexors and postural education', key: 'management', weight: 2 },
      ],
      additionalTests: [
        { name: 'Upper limb tension test 1 (ULTT1)', result: 'Negative bilaterally — no arm symptoms reproduced. Median nerve neurodynamics normal. Cervical radiculopathy excluded.', valence: 'neg' },
        { name: 'Spurling\'s compression test', result: 'Negative — no arm pain or paresthesia with cervical compression and lateral flexion. No nerve root compromise.', valence: 'neg' },
        { name: 'Cranio-cervical flexion test (CCFT)', result: 'Positive — unable to maintain pressure beyond 22 mmHg without superficial muscle substitution. Deep neck flexor endurance deficit confirmed.', valence: 'pos' },
        { name: 'Cervical flexion-rotation test', result: 'Restricted rotation to the right at C1/C2 — 28° (normal >44°). Supports upper cervical joint contribution to the cervicogenic headache component.', valence: 'pos' },
        { name: 'Adson test (thoracic outlet)', result: 'Negative — no radial pulse change or arm symptoms with head rotation and shoulder depression. Thoracic outlet syndrome excluded.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Mechanical Neck Pain with secondary cervicogenic headaches (often framed as a Cervical Mobility Deficit or Postural Syndrome). The key to this case is ruling out nerve root involvement: the patient has no distal arm symptoms, and Spurling's, ULTT1, and the neuro screen are all negative. Her pain is entirely somatic and driven by sustained occupational postures (forward head). This posture mechanically loads the lower cervical joints and adaptively shortens the suboccipital muscles, which refers pain to the head. The failed CCFT highlights the underlying motor control issue: weak deep neck flexors overpowered by superficial muscles (SCM, Upper Trap). Management must center on ergonomic advice, deep neck flexor endurance training, and thoracic mobility.`,
    },

    {
      id: 'b7',
      title: 'Mid-back pain after a long road trip',
      region: 'Thoracic',
      info: { age: '31', sex: 'Male', occupation: 'Sales representative (frequent driver)', onset: '5 days', duration: 'Acute' },
      vignette: `<p>A 31-year-old male sales representative presents with <strong>acute mid-back pain</strong> that began after a 9-hour interstate road trip 5 days ago. He describes a dull, constant ache centred between his shoulder blades that occasionally spreads around to the anterior chest wall. He rates the pain 4/10 at rest and 7/10 with deep breathing and twisting.</p>
        <p>He notes the pain is worst after sitting for long periods and eases significantly when he gets up and moves around. Morning stiffness lasts about 20 minutes. He has no history of trauma, no fever, no unexplained weight loss, and the pain does not wake him from sleep. He has had similar but milder episodes twice before over the past 3 years — both resolved within 2 weeks with activity.</p>
        <p>He takes no regular medications and denies any arm symptoms, leg symptoms, or bladder/bowel changes. He is a casual gym-goer but has not trained for 3 weeks due to a busy work schedule.</p>`,
      redFlags: ['Night pain unrelated to position', 'Fever or constitutional symptoms', 'Unexplained weight loss', 'Chest pain with exertion / shortness of breath at rest', 'Bilateral limb symptoms'],
      examCategories: [
        { name: 'Observation & Posture', items: [
          { name: 'Standing posture', result: 'Increased thoracic kyphosis — exaggerated upper-thoracic flexion. Protracted scapulae bilaterally. Forward head posture.', valence: 'pos' },
          { name: 'Sitting posture', result: 'Marked lumbar flattening and thoracic rounding consistent with habitual driving posture.', valence: 'pos' },
        ]},
        { name: 'Active ROM', items: [
          { name: 'Thoracic rotation (seated)', result: 'Rotation right 30°, left 28°. Both restricted by 25% with mid-thoracic ache at end range. Symmetrical.', valence: 'pos' },
          { name: 'Thoracic extension (standing)', result: 'Limited to approximately 10° (normal ~13°). Reproduces interscapular ache.', valence: 'pos' },
          { name: 'Thoracic flexion (standing)', result: 'Full — no pain. Relieves symptoms slightly.', valence: 'neg' },
          { name: 'Deep breath / thoracic expansion', result: 'Mild discomfort at end-range inhalation over the lower thoracic region. No sharp stabbing.', valence: 'neutral' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Thoracic PA mobility (T5–T8)', result: 'Reduced posteroanterior mobility T5–T7. Tenderness on PA at T6/T7. No sharp/localised bony tenderness.', valence: 'pos' },
          { name: 'Costovertebral joint palpation', result: 'Mild bilateral costovertebral tenderness T6/T7 — consistent with stiffness, no sharp focal pain.', valence: 'neutral' },
          { name: 'Paraspinal muscle palpation', result: 'Bilateral rhomboid and mid-trapezius hypertonicity. Reproduces familiar interscapular ache on sustained pressure.', valence: 'pos' },
        ]},
        { name: 'Special Tests & Screens', items: [
          { name: 'Thoracic spring test (PA stiffness)', result: 'Stiff and slightly painful at T5/T6. No sharp instability or nerve referral.', valence: 'pos' },
          { name: 'Upper limb tension test (ULTT1)', result: 'Negative bilaterally — no arm symptoms.', valence: 'neg' },
          { name: 'Rib compression test', result: 'Negative — lateral rib compression does not reproduce or worsen pain. Rules out rib fracture/stress.', valence: 'neg' },
        ]},
        { name: 'Neurological Screen', items: [
          { name: 'Upper and lower limb sensation', result: 'Intact bilaterally. No dermatomal loss.', valence: 'neg' },
          { name: 'Upper limb reflexes', result: 'Biceps, triceps, brachioradialis — symmetric and normal bilaterally.', valence: 'neg' },
          { name: 'Grip strength', result: 'Equal bilaterally. No upper limb weakness.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Thoracic Segmental Dysfunction / Mechanical Thoracic Pain',
      correctDxAliases: ['thoracic segmental dysfunction', 'mechanical thoracic pain', 'thoracic stiffness', 'thoracic joint dysfunction', 'postural thoracic pain', 'costovertebral dysfunction'],
      keyDifferentials: ['Rib stress fracture', 'Thoracic disc pathology', 'Referred cardiac pain', 'Intercostal strain'],
      keyFindings: [
        { icon: '✓', text: '<strong>Prolonged static posture as driver + postural kyphosis</strong> — prolonged compressive loading in thoracic flexion is the primary mechanical driver.' },
        { icon: '✓', text: '<strong>Bilateral symmetrical ROM restriction + PA stiffness T5–T7</strong> — multi-segment stiffness consistent with sustained postural loading, not a single-level acute lesion.' },
        { icon: '✗', text: '<strong>Negative rib compression test</strong> — effectively rules out rib fracture or stress reaction as the pain source.' },
        { icon: '✗', text: '<strong>Negative ULTT and normal neurological screen</strong> — no evidence of thoracic disc herniation or radiculopathy.' },
        { icon: '✓', text: '<strong>Previous similar episodes resolving with activity</strong> — recurrence pattern consistent with positional mechanical sensitisation, not serious pathology.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (mechanical thoracic pain / segmental dysfunction)', key: 'finalDx', weight: 3 },
        { criterion: 'Mechanical thoracic / postural pain in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes thoracic mobilisation and postural retraining', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning identifies postural driver and rules out rib fracture / radiculopathy', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Rib compression test (lateral)', result: 'Negative — no pain with lateral rib compression. Rib fracture or costovertebral injury excluded.', valence: 'neg' },
        { name: 'Scapular assistance test', result: 'Positive — passive scapular upward rotation by examiner reduces interscapular pain during arm elevation. Confirms scapular stabiliser weakness as a contributor.', valence: 'pos' },
        { name: 'Thoracic rotation mobility (seated)', result: 'Restricted bilaterally — right 28°, left 32° (normal ~40°). Reduced segmental mobility at T5-T7 confirmed clinically.', valence: 'pos' },
        { name: 'Slump test', result: 'Negative — no distal neural tension signs. Thoracic disc herniation with cord or nerve root compromise excluded.', valence: 'neg' },
        { name: 'ULTT1 (median nerve tension test)', result: 'Negative bilaterally — no arm pain or paresthesia reproduced. Thoracic outlet / cervical radiculopathy not implicated.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Mechanical Thoracic Pain / Thoracic Segmental Dysfunction. The pattern is classic: interscapular pain exacerbated by prolonged thoracic flexion (9-hour drive), eased by movement, with symmetric PA stiffness and hypertonicity at T5–T7. The absence of night pain unrelated to position change, fever, and constitutional symptoms reliably removes serious pathology. The negative rib compression test rules out rib fracture; negative ULTT and intact neuro rules out disc herniation. Management is thoracic manual therapy (PA mobilisation T5–T7), thoracic self-mobilisation exercises (foam roller, thoracic rotation), scapular retractor strengthening (mid-trap, rhomboids), and driving ergonomics (lumbar support, frequent breaks).`,
    },

    {
      id: 'b8',
      title: 'Groin tightness in a recreational footballer',
      region: 'Hip',
      info: { age: '24', sex: 'Male', occupation: 'Tradesperson / recreational footballer', onset: '3 weeks', duration: 'Subacute' },
      vignette: `<p>A 24-year-old male tradesperson presents with a 3-week history of <strong>right groin pain</strong>. He plays Saturday afternoon social football and reports the pain started during a match when he kicked hard and felt a sudden onset of sharp groin pain. He rested for a week but groin pain has persisted.</p>
        <p>The pain is aching at rest but sharp with kicking, sprinting, and changing direction. He also notices tightness in the inner thigh when he gets in and out of the car and when climbing stairs quickly. The pain is localised to the medial groin/adductor region — he can point directly to it with one finger, approximately 3 cm distal to the pubic tubercle.</p>
        <p>He has no low back pain, no radiation below the knee, and no urinary or abdominal symptoms. He has not had any hip or groin injuries before. He is otherwise healthy and takes no medications.</p>`,
      redFlags: ['Inguinal hernia symptoms (cough impulse)', 'Testicular or scrotal pain', 'Urinary symptoms (dysuria, haematuria)'],
      examCategories: [
        { name: 'Observation & Gait', items: [
          { name: 'Gait analysis', result: 'Slight ipsilateral antalgic lean during right stance phase. Stance phase mildly shortened on right.', valence: 'neutral' },
          { name: 'Single-leg squat', result: 'Able to perform. Mild dynamic valgus at the right knee. No groin pain reproduced.', valence: 'neutral' },
        ]},
        { name: 'Hip ROM', items: [
          { name: 'Hip flexion', result: 'Full bilaterally. No pain.', valence: 'neg' },
          { name: 'Hip abduction (passive)', result: 'Right 30° (reduced from expected 40°). End-range tightness. Groin pulling at limit.', valence: 'pos' },
          { name: 'Hip adduction passive', result: 'Full range, slight tightness at end range right.', valence: 'neutral' },
          { name: 'Hip internal rotation', result: 'Right 25°, left 35°. Mildly restricted on right.', valence: 'neutral' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Adductor longus origin palpation', result: 'Point tenderness at the proximal adductor longus, approximately 3 cm distal to the pubic tubercle. Reproduces exact pain.', valence: 'pos' },
          { name: 'Pubic tubercle palpation', result: 'Mild tenderness at pubic tubercle — no bony step-off.', valence: 'neutral' },
          { name: 'Inguinal region palpation', result: 'No inguinal canal tenderness. No palpable hernia on valsalva.', valence: 'neg' },
          { name: 'Rectus femoris / psoas', result: 'No tenderness over anterior hip, psoas, or rectus femoris.', valence: 'neg' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Adductor squeeze test (0°)', result: 'Positive — groin pain reproduced with resisted adduction in supine with hips in neutral. Note: adductor longus is more active with the hip at 45° flexion, so 0° is less specific for this muscle than the 45° test below.', valence: 'pos' },
          { name: 'Adductor squeeze test (45°)', result: 'Strongly positive — marked groin pain reproduction at 45° hip flexion.', valence: 'pos' },
          { name: 'FADIR test', result: 'Negative — no groin pain with FAI screen.', valence: 'neg' },
          { name: 'Cross-body sit-up test', result: 'Negative — no groin pain with resisted diagonal sit-up.', valence: 'neg' },
          { name: 'Hop test (single-leg)', result: 'Able to perform. Mild groin discomfort but no severe pain.', valence: 'neutral' },
        ]},
        { name: 'Neurological Screen', items: [
          { name: 'Lower limb sensation', result: 'Normal bilaterally. No dermatomal sensory change.', valence: 'neg' },
          { name: 'SLR / femoral nerve', result: 'Negative bilaterally.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Hip Adductor Tendinopathy / Strain',
      correctDxAliases: ['hip adductor tendinopathy / strain', 'adductor strain', 'adductor longus strain', 'adductor longus tendinopathy', 'adductor tendinopathy', 'hip adductor strain', 'groin strain', 'adductor tear', 'groin muscle strain'],
      keyDifferentials: ['Hip flexor (iliopsoas) strain', 'Athletic pubalgia / sports hernia', 'Hip labral tear', 'Osteitis pubis'],
      keyFindings: [
        { icon: '✓', text: '<strong>Point tenderness at adductor longus origin + positive squeeze test</strong> — precise anatomical localisation with load-reproduction is the hallmark of adductor strain.' },
        { icon: '✓', text: '<strong>Mechanism: eccentric kicking load</strong> — maximum adductor stretch/contraction at ball contact is the classic adductor longus injury mechanism.' },
        { icon: '✗', text: '<strong>Negative cross-body sit-up test</strong> — rules out athletic pubalgia / sports hernia where posterior inguinal wall involvement is tested.' },
        { icon: '✗', text: '<strong>Negative FADIR test</strong> — no intra-articular hip pathology (labral tear / FAI) contributing.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Hip Adductor Tendinopathy / Strain)', key: 'finalDx', weight: 3 },
        { criterion: 'Hip Adductor Tendinopathy / Strain in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes graded adductor loading and sport-specific return', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed (hernia, urological)', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning differentiates adductor strain from sports hernia and hip labral tear', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'FADIR test', result: 'Negative — no groin pain reproduced with hip flexion, adduction and internal rotation. Intra-articular hip pathology (labral tear, FAI) excluded.', valence: 'neg' },
        { name: 'Resisted hip flexion (seated)', result: 'Mild discomfort with resisted hip flexion but 5/5 strength. Iliopsoas not the primary pain generator.', valence: 'neutral' },
        { name: 'Inguinal canal palpation / Valsalva test', result: 'Negative — no tenderness over inguinal canal, no pain with Valsalva. Sports hernia / athletic pubalgia excluded.', valence: 'neg' },
        { name: 'Cross-body sit-up test', result: 'Negative — no pain at posterior inguinal wall. Athletic pubalgia (sports hernia) excluded as the primary diagnosis.', valence: 'neg' },
        { name: 'FADIR test', result: 'Negative — no groin pain reproduced with hip flexion, adduction and internal rotation. Intra-articular hip pathology excluded as primary structure.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Hip Adductor Tendinopathy / Strain (acute adductor longus-dominant presentation). The mechanism (eccentric kicking load), precise pain location at the adductor longus origin (3 cm distal to pubic tubercle), and bilateral positive adductor squeeze tests (with 45° position most provocative — adductor longus is most active in this position) confirm the diagnosis. The negative cross-body sit-up test eliminates athletic pubalgia/sports hernia where posterior inguinal wall weakness is the primary issue. Negative FADIR removes intra-articular hip pathology. Management: initial relative rest (pain-guided), progressive isometric to isotonic adductor loading (Copenhagen adductor, adductor squeeze progressions), then sport-specific kicking return over 4–8 weeks.`,
    },

    {
      id: 'b9',
      title: 'Outer elbow pain in an office worker who plays tennis',
      region: 'Elbow',
      info: { age: '42', sex: 'Female', occupation: 'Project manager / recreational tennis player', onset: '8 weeks', duration: 'Subacute' },
      vignette: `<p>A 42-year-old female project manager presents with an 8-week history of <strong>right lateral elbow pain</strong>. She plays social tennis on weekends and the pain began after a particularly long 2-hour match, but has persisted and now affects her at work.</p>
        <p>She describes a dull ache along the outer elbow that flares sharply when she lifts her coffee mug, turns door handles, and types for extended periods. The pain is worst after a session of typing or following tennis — she has been unable to play for the past 3 weeks. Shaking hands is uncomfortable. She has no arm numbness or tingling, no neck pain, and no pain at rest.</p>
        <p>She has used a compression sleeve and taken ibuprofen for 2 weeks, which provides partial relief. No previous elbow problems. She mentions she recently changed to a new, stiffer tennis racquet 6 weeks ago.</p>`,
      redFlags: ['Constant rest pain unrelated to loading', 'Rapid progressive weakness', 'Bilateral symptoms'],
      examCategories: [
        { name: 'Observation', items: [
          { name: 'Carrying angle / forearm alignment', result: 'Normal bilateral carrying angle (~15°). No deformity or swelling.', valence: 'neg' },
          { name: 'Muscle bulk', result: 'No obvious forearm or hand muscle wasting.', valence: 'neg' },
        ]},
        { name: 'ROM', items: [
          { name: 'Elbow flexion/extension', result: 'Full and pain-free bilaterally (0–145°).', valence: 'neg' },
          { name: 'Forearm supination/pronation', result: 'Full. Mild lateral elbow discomfort at end-range pronation only.', valence: 'neutral' },
          { name: 'Wrist extension ROM', result: 'Full bilaterally. Lateral elbow ache at end-range passive wrist flexion with elbow extended.', valence: 'pos' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Lateral epicondyle palpation', result: 'Point tenderness directly at the lateral epicondyle. Reproduces familiar pain.', valence: 'pos' },
          { name: 'Common extensor origin palpation (ECRB)', result: 'Maximal tenderness just distal and anterior to lateral epicondyle — at ECRB footprint.', valence: 'pos' },
          { name: 'Radial head palpation', result: 'No tenderness over radial head. No pain with passive forearm pronation/supination.', valence: 'neg' },
          { name: 'Medial elbow / UCL', result: 'No medial elbow tenderness.', valence: 'neg' },
        ]},
        { name: 'Provocative Tests', items: [
          { name: 'Cozen\'s test (resisted wrist extension)', result: 'Strongly positive — lateral elbow pain reproduced with resisted wrist extension, elbow extended.', valence: 'pos' },
          { name: 'Mill\'s test (passive wrist flexion + elbow extension)', result: 'Positive — reproduction of lateral elbow pain.', valence: 'pos' },
          { name: 'Maudsley\'s test (resisted middle finger extension)', result: 'Positive — lateral epicondyle pain with resisted middle finger extension.', valence: 'pos' },
          { name: 'Chair lift test', result: 'Positive — pain reproduced lifting a chair with elbow extended, forearm pronated.', valence: 'pos' },
        ]},
        { name: 'Neurological Screen', items: [
          { name: 'Upper limb sensation', result: 'Intact bilaterally — no dermatomal sensory change.', valence: 'neg' },
          { name: 'Grip strength (dynamometry)', result: 'Right 18 kg, left 22 kg. Reduced on right, limited by pain.', valence: 'pos' },
          { name: 'Radial tunnel screen (resisted supination at 90° elbow flexion)', result: 'Negative — no posterior forearm pain with resisted supination.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Lateral Epicondylalgia (Tennis Elbow)',
      correctDxAliases: ['lateral epicondylalgia', 'tennis elbow', 'lateral epicondylitis', 'common extensor tendinopathy', 'lateral elbow tendinopathy'],
      keyDifferentials: ['Radial tunnel syndrome (posterior interosseous nerve)', 'Radiohumeral bursitis', 'Cervical radiculopathy (C6)', 'Lateral compartment OA'],
      keyFindings: [
        { icon: '✓', text: '<strong>Point tenderness at ECRB footprint + positive Cozen\'s, Mill\'s, Maudsley\'s</strong> — three positive extensor-loading tests is the hallmark cluster for lateral epicondylalgia.' },
        { icon: '✓', text: '<strong>Load-related onset (racquet change + long match)</strong> — sudden increase in extensor load with a stiffer racquet is a well-established provocateur.' },
        { icon: '✗', text: '<strong>Negative radial tunnel screen</strong> — resisted supination at 90° elbow flexion does not reproduce posterior forearm pain, distinguishing this from radial tunnel / PIN entrapment (which causes pain 4 cm distal to lateral epicondyle, not at the epicondyle itself).' },
        { icon: '✗', text: '<strong>Normal sensation and no neck pain</strong> — effectively excludes C6 radiculopathy as a contributor.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (lateral epicondylalgia)', key: 'finalDx', weight: 3 },
        { criterion: 'Lateral epicondylalgia in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes progressive extensor loading and load modification', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning differentiates from radial tunnel syndrome and cervical radiculopathy', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Radial tunnel screen (palpation 4 cm distal to epicondyle)', result: 'Negative — no tenderness at radial tunnel / posterior interosseous nerve zone. Radial tunnel syndrome excluded.', valence: 'neg' },
        { name: 'Cervical screen (rotation, Spurling\'s)', result: 'Negative — full pain-free cervical rotation bilaterally. No arm pain reproduced with cervical compression. Cervical radiculopathy excluded.', valence: 'neg' },
        { name: 'Grip strength dynamometry', result: 'Right grip 28 kg, left 41 kg. Significant 32% deficit on right. Confirms functional impairment consistent with lateral epicondylalgia.', valence: 'pos' },
        { name: 'Resisted middle finger extension (Maudsley\'s extended)', result: 'Positive — lateral elbow pain with resisted extension at the MCP joint of the middle finger. ECRB involvement confirmed.', valence: 'pos' },
        { name: 'Resisted supination (radial tunnel zone)', result: 'Negative — no pain at the radial tunnel with resisted supination. Posterior interosseous nerve entrapment excluded.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Lateral Epicondylalgia (common extensor tendinopathy). The classic triad is present: point tenderness at the ECRB footprint (just distal/anterior to the lateral epicondyle), pain with gripping and wrist extension activities, and three positive provocative tests (Cozen's, Mill's, Maudsley's). The load history — stiff new racquet + 2-hour match — aligns with a tendon overload mechanism. The key differential is radial tunnel syndrome (posterior interosseous nerve entrapment), where maximum tenderness is 4 cm distal to the epicondyle and resisted supination is more provocative than wrist extension; the negative radial tunnel screen here eliminates it. No neurological signs eliminate cervical radiculopathy. Management: extensor loading programme (Tyler Twist, wrist extension eccentrics), racquet grip assessment, and temporary load reduction.`,
    },

  ],

  intermediate: [
    {
      id: 'i1',
      title: 'Lateral hip pain in a woman who hikes',
      region: 'Hip',
      info: { age: '52', sex: 'Female', occupation: 'Physiotherapy receptionist / recreational hiker', onset: '4 months', duration: 'Chronic' },
      vignette: `<p>A 52-year-old female physio receptionist presents with a 4-month history of <strong>right lateral hip pain</strong>. The pain is diffuse over the greater trochanteric region and varies from a dull ache to a sharp pain. It is significantly worse after long walks or hikes, after prolonged sitting with legs crossed, and when transitioning from sitting to standing.</p>
        <p>She is post-menopausal (approximately 3 years). She is a recreational hiker and walks her dog 5 km daily. She describes a pain that can wake her from sleep when lying on the affected side, and she has started sleeping with a pillow between her knees. She denies groin pain, radiation below the knee, or any sensation of hip instability.</p>
        <p>She saw her GP 6 weeks ago who arranged a hip X-ray. The report noted "mild degenerative changes at the hip joint, within normal limits for age." She was prescribed NSAIDs which provide modest relief. She is otherwise healthy with no relevant past history.</p>`,
      redFlags: ['Night pain not relieved by any position change', 'Unexplained weight loss', 'Progressive neurological symptoms', 'History of cancer'],
      examCategories: [
        { name: 'Observation', items: [
          { name: 'Standing posture / pelvic alignment', result: 'Mild right pelvic drop in standing. Slight contralateral trunk lean to right in single-leg stance.', valence: 'neutral' },
          { name: 'Gait analysis', result: 'Mild Trendelenburg gait on right — slight pelvic drop on left swing phase. Compensatory lateral trunk lean.', valence: 'pos' },
        ]},
        { name: 'Hip ROM', items: [
          { name: 'Hip flexion ROM', result: 'Full bilaterally. No pain.', valence: 'neg' },
          { name: 'Hip IR / ER ROM', result: 'IR 40° right, 45° left. ER 50° right, 55° left. Slight reduction but no pain.', valence: 'neutral' },
          { name: 'Hip abduction ROM', result: 'Right 35°, left 45°. Reduced on right, mild lateral hip discomfort at end range.', valence: 'neutral' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Greater trochanteric footprint palpation', result: 'Moderate tenderness directly over the greater trochanteric footprint, reproducing the lateral hip pain.', valence: 'pos' },
          { name: 'Posterior hip / SIJ', result: 'No tenderness over SIJ or posterior hip.', valence: 'neg' },
          { name: 'Lumbar spine palpation', result: 'Mild generalised lumbar stiffness on PA assessment. No local tenderness replicating lateral hip pain.', valence: 'neutral' },
        ]},
        { name: 'Special Tests — Gluteal Tendon', items: [
          { name: 'Single-leg stance test (30 sec)', result: 'Positive — lateral hip pain reproduced within 20 seconds of right single-leg stance.', valence: 'pos' },
          { name: 'FADER test (hip flexion, ADD, ER)', result: 'Positive — lateral hip pain reproduced with combined flexion, adduction, and ER loading.', valence: 'pos' },
          { name: 'Ober test', result: 'Positive — reduced hip adduction in side-lying with slight lateral hip discomfort at end range.', valence: 'pos' },
        ]},
        { name: 'Special Tests — Hip Joint', items: [
          { name: 'FADIR test (FAI screening)', result: 'Negative — no groin pain, no anterior hip pain, no restriction.', valence: 'neg' },
          { name: 'FABER test (hip / SIJ)', result: 'Negative for groin pain. Slight lateral hip ache at end range but no SI or groin pain reproduction.', valence: 'neutral' },
          { name: 'Hip scour / quadrant test', result: 'Negative — no groin pain or crepitus in any quadrant.', valence: 'neg' },
        ]},
        { name: 'Lumbar Screen', items: [
          { name: 'Lumbar active ROM', result: 'Mildly reduced extension. No referred pain to lateral hip on any movement.', valence: 'neutral' },
          { name: 'SLR / Slump test', result: 'Negative bilaterally — no reproduction of lateral hip pain.', valence: 'neg' },
        ]},
        { name: 'Strength', items: [
          { name: 'Hip abductor strength (dynamometry)', result: 'Right 4/5, left 5/5. Painful arc on resisted abduction right.', valence: 'pos' },
          { name: 'Trendelenburg test (active)', result: 'Positive on right — pelvic drop on left swing phase with lateral trunk lean.', valence: 'pos' },
        ]},
      ],
      correctDx: 'Gluteal Tendinopathy',
      correctDxAliases: ['gluteal tendinopathy', 'gluteus medius tendinopathy', 'gtps', 'greater trochanteric pain syndrome', 'trochanteric tendinopathy', 'glut tendinopathy'],
      keyDifferentials: ['Hip Osteoarthritis', 'Trochanteric bursitis (isolated)', 'L4/5 lumbar referred pain', 'IT band syndrome (hip variant)'],
      keyFindings: [
        { icon: '✓', text: '<strong>Single-leg stance positive within 20 seconds</strong> — the most clinically informative test for gluteal tendinopathy; compressive load on tendon reproduces pain.' },
        { icon: '✓', text: '<strong>Compressive load pattern</strong> — pain with leg crossing, lying on side, and FADER are all compressive loading positions for the gluteal tendons.' },
        { icon: '✓', text: '<strong>Negative FADIR and hip scour</strong> — effectively excludes intra-articular hip pathology (FAI, labral) as the primary source.' },
        { icon: '✓', text: '<strong>Negative SLR / Slump</strong> — lumbar referral pattern does not account for the lateral hip pain in isolation.' },
        { icon: '⚠', text: '<strong>Hip X-ray "mild degenerative changes"</strong> — this is a common radiological red herring in this age group; does not change the clinical diagnosis or management approach.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (gluteal tendinopathy)', key: 'finalDx', weight: 3 },
        { criterion: 'Gluteal tendinopathy / GTPS in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management avoids compressive positions; includes progressive tendon loading', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning identifies compression as mechanism, excludes hip OA and lumbar referral', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'FADIR test', result: 'Positive right — anterior hip and lateral thigh discomfort. Note: FADIR adducts/compresses the gluteal tendons; a positive result here supports gluteal tendinopathy rather than intra-articular pathology in this clinical context.', valence: 'pos' },
        { name: 'Hip scour test', result: 'Negative — no groin pain or catching with circumduction under axial load. Intra-articular hip pathology (labral tear, OA) excluded as primary diagnosis.', valence: 'neg' },
        { name: 'Single-leg stance (20-second hold)', result: 'Positive right — lateral hip pain reproduced within 12 seconds in right single-leg stance. Classic load-sensitive gluteal tendinopathy response.', valence: 'pos' },
        { name: 'Lumbar neural tension (SLR)', result: 'Negative bilaterally. No radicular leg pain. Lumbar referral excluded as the primary pain source.', valence: 'neg' },
        { name: 'Trochanteric bursa direct palpation', result: 'Negative — no focal bursal tenderness directly over the greater trochanter. Trochanteric bursitis as isolated diagnosis less likely than tendinopathy.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is gluteal tendinopathy. The compression-loading pattern is the key clinical feature: pain with leg crossing, lying on the affected side, and FADER all compress the gluteal tendons against the greater trochanter. The single-leg stance test positive within 20 seconds confirms tendon load sensitivity. Negative FADIR and hip scour effectively exclude intra-articular hip pathology — the mild X-ray changes are a common age-related finding that should not redirect the diagnosis. Negative neurodynamic tests exclude lumbar referral. Management: eliminate compressive loading positions, progressive isometric to isotonic gluteal loading (Grimaldi protocol), gait retraining.`,
    },

    {
      id: 'i2',
      title: 'Deep buttock pain in a cyclist',
      region: 'Hip / Lumbar',
      info: { age: '44', sex: 'Male', occupation: 'Accountant / avid road cyclist', onset: '3 months', duration: 'Subacute–chronic' },
      vignette: `<p>A 44-year-old male accountant and competitive amateur road cyclist presents with <strong>deep right buttock pain</strong> of 3 months' duration. He describes the pain as a deep, aching discomfort centred in the right ischial tuberosity region, radiating mildly into the posterior thigh but not beyond the knee. The pain is particularly severe after long rides (>1.5 hours) and when sitting on hard surfaces — especially in his cycling position.</p>
        <p>The pain has prevented him from completing his usual 5-hour weekend rides. He manages short rides of 30–45 minutes before pain forces him to stop. He also notices pain when walking stairs and going from sitting to standing, but the walk from his car to the office (10 minutes) is manageable.</p>
        <p>He has no low back pain, no paraesthesias below the knee, and no bowel or bladder symptoms. He saw a physio 6 weeks ago who treated his lumbar spine; he reports minimal improvement. An MRI of the lumbar spine showed "mild L4/5 disc bulge with no significant neural compression."</p>`,
      redFlags: ['Bowel or bladder dysfunction', 'Saddle anaesthesia', 'Progressive bilateral neurological deficit', 'History of malignancy'],
      examCategories: [
        { name: 'Lumbar Screen', items: [
          { name: 'Lumbar active ROM', result: 'Full and pain-free in all directions. No reproduction of buttock pain.', valence: 'neg' },
          { name: 'SLR test', result: 'Negative bilaterally. No leg pain below knee.', valence: 'neg' },
          { name: 'Slump test', result: 'Negative — slight posterior thigh tension but does not reproduce the characteristic ischial buttock pain.', valence: 'neg' },
          { name: 'Lumbar PA spring test', result: 'Mild stiffness L4/5 but no pain reproduction into the buttock.', valence: 'neutral' },
        ]},
        { name: 'SIJ Screen', items: [
          { name: 'SIJ provocation cluster (3 tests)', result: 'Negative — distraction, thigh thrust, and compression do not reproduce buttock pain.', valence: 'neg' },
          { name: 'FABER test', result: 'Positive — posterior hip discomfort at end range. No groin or anterior hip pain.', valence: 'neutral' },
        ]},
        { name: 'Hip Screen', items: [
          { name: 'FADIR test', result: 'Negative — no groin pain or restriction.', valence: 'neg' },
          { name: 'Hip passive ROM', result: 'Full bilaterally with no pain reproduction.', valence: 'neg' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Ischial tuberosity palpation', result: 'Exquisite tenderness directly over the right ischial tuberosity, reproducing the chief complaint exactly.', valence: 'pos' },
          { name: 'Proximal hamstring muscle belly palpation', result: 'Mild tenderness in the proximal hamstring muscle belly 3–4 cm distal to IT.', valence: 'neutral' },
          { name: 'Piriformis / sciatic notch', result: 'Mild tenderness over the piriformis belly, but does not reproduce the ischial pain.', valence: 'neutral' },
        ]},
        { name: 'Special Tests — Hamstring Tendon', items: [
          { name: 'Bent knee stretch (active hamstring test at 90°)', result: 'Positive — reduced knee extension range (40° from full) and ischial tuberosity pain reproduced.', valence: 'pos' },
          { name: 'Bent knee stretch (active hamstring test at 30°)', result: 'Positive — pain reproduced at 30° hip flexion. Combined positive at both angles.', valence: 'pos' },
          { name: 'Puranen–Orava test (standing hip flexion at 90°)', result: 'Positive — ischial tuberosity pain reproduced with knee straight in standing.', valence: 'pos' },
        ]},
        { name: 'Provocative Loading', items: [
          { name: 'Resisted knee flexion (seated)', result: 'Mild weakness (4+/5) and ischial pain with resisted knee flexion on right.', valence: 'pos' },
          { name: 'Single leg bridge (10 reps)', result: 'Ischial buttock pain reproduced at rep 5–6 right.', valence: 'pos' },
          { name: 'Seated forward lean (simulate cycling position)', result: 'Ischial pain reproduced and worsened with forward lean in seated position.', valence: 'pos' },
        ]},
      ],
      correctDx: 'Proximal Hamstring Tendinopathy / Strain',
      correctDxAliases: ['proximal hamstring tendinopathy / strain', 'proximal hamstring tendinopathy', 'hamstring tendinopathy', 'hamstring strain', 'high hamstring tendinopathy', 'proximal hamstring', 'ischial tendinopathy'],
      keyDifferentials: ['Lumbar radiculopathy (L5/S1)', 'Piriformis syndrome', 'SIJ dysfunction', 'Ischial bursitis'],
      keyFindings: [
        { icon: '✓', text: '<strong>Exquisite ischial tuberosity point tenderness</strong> — the most consistent finding in proximal hamstring tendinopathy; precisely localised to the proximal attachment.' },
        { icon: '✓', text: '<strong>Positive bent knee stretch at both 30° and 90°</strong> — combined positive at both angles is strongly associated with proximal tendon involvement.' },
        { icon: '✓', text: '<strong>Cycling position reproduces pain</strong> — hip flexion in sitting compresses the proximal hamstring tendon against the ischial tuberosity; the classic compressive mechanism.' },
        { icon: '✗', text: '<strong>Negative SLR, Slump, and lumbar ROM</strong> — effectively excludes lumbar radiculopathy despite the L4/5 MRI finding (a common incidental finding at this age).' },
        { icon: '✗', text: '<strong>Negative SIJ provocation cluster</strong> — rules out SIJ as the pain generator.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Proximal Hamstring Tendinopathy / Strain)', key: 'finalDx', weight: 3 },
        { criterion: 'PHT in initial or updated differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes compressive load avoidance + heavy slow resistance', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning identifies compressive load + negative lumbar screen + IT tenderness', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Slump test', result: 'Negative — no reproduction of posterior thigh or buttock pain with neural tension. Sciatic nerve involvement excluded.', valence: 'neg' },
        { name: 'Piriformis palpation / stretch', result: 'Mild tenderness over piriformis. Stretch does not reproduce ischial tuberosity pain. Secondary finding — not the primary pain source.', valence: 'neutral' },
        { name: 'Resisted hip extension (prone)', result: 'Positive — pain at ischial tuberosity with resisted knee-extended hip extension. Confirms proximal hamstring tendon load sensitivity at the origin.', valence: 'pos' },
        { name: 'FADIR test', result: 'Negative — no groin or anterior hip pain. Hip intra-articular pathology excluded.', valence: 'neg' },
        { name: 'FABER test', result: 'Negative — no groin or SI pain reproduced. Hip intra-articular pathology and SI joint dysfunction excluded.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Proximal Hamstring Tendinopathy / Strain. The ischial tuberosity point tenderness plus combined positive bent knee stretch at 30° and 90° is the discriminating cluster. The cycling position (sustained hip flexion in sitting) is the primary compressive mechanism — this is a classic proximal hamstring tendon overload pattern. Despite the L4/5 MRI finding, the negative SLR, Slump, and lumbar ROM, together with no symptoms below the knee, effectively exclude radiculopathy as the primary driver. The piriformis tenderness is a common co-finding but does not explain the IT point tenderness or load response. Management: eliminate compressive seated loads (padded seat, avoid prolonged sitting/forward lean), isometric hamstring loading, progressive heavy slow resistance protocol.`,
    },

    {
      id: 'i3',
      title: 'Medial elbow pain in a climber',
      region: 'Elbow',
      info: { age: '31', sex: 'Female', occupation: 'Graphic designer / indoor rock climber', onset: '10 weeks', duration: 'Subacute' },
      vignette: `<p>A 31-year-old female graphic designer and indoor rock climber presents with <strong>right medial elbow pain</strong> that has progressively worsened over 10 weeks. She climbs 4 nights per week at an indoor climbing gym and has been working toward harder routes requiring more dynamic pulling movements.</p>
        <p>The pain is located over the medial epicondyle and into the proximal forearm. It is aggravated by gripping on the wall, wrist flexion, and forearm pronation. She also notices it during typing at work. The pain has occasionally caused her grip to feel "weaker" on hard moves, though she has never had an episode of complete grip failure or felt her elbow "give way."</p>
        <p>She denies any radiation into the ring and little fingers, paraesthesias, or nocturnal symptoms. She had a mild episode of similar pain in the same elbow 18 months ago that resolved with 3 weeks of rest. She has not modified her climbing volume or intensity despite the pain worsening over the past month.</p>`,
      redFlags: ['Progressive finger intrinsic muscle wasting', 'Constant paraesthesias in ulnar distribution', 'Night pain unrelated to position', 'Elbow valgus instability episode'],
      examCategories: [
        { name: 'Observation', items: [
          { name: 'Carrying angle / elbow alignment', result: 'Normal carrying angle bilaterally. No valgus deformity. Slight forearm pronator muscle hypertrophy right.', valence: 'neutral' },
          { name: 'Muscle wasting assessment', result: 'No intrinsic muscle wasting. Hypothenar and interossei full bilaterally.', valence: 'neg' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Medial epicondyle / common flexor origin', result: 'Moderate tenderness directly over the medial epicondyle at the common flexor-pronator origin. Reproduces pain.', valence: 'pos' },
          { name: 'Ulnar collateral ligament (sublime tubercle)', result: 'Mild tenderness 1–2 cm distal to medial epicondyle. Less severe than at the epicondyle itself.', valence: 'neutral' },
          { name: "Cubital tunnel / ulnar nerve (Tinel's)", result: "Negative Tinel's — no paraesthesias or radiation to ring/little finger with percussion.", valence: 'neg' },
          { name: 'Lateral epicondyle / common extensor origin', result: 'No tenderness.', valence: 'neg' },
        ]},
        { name: 'Special Tests — Medial Epicondyle', items: [
          { name: 'Resisted wrist flexion test', result: 'Positive — medial epicondyle pain reproduced with resisted wrist flexion, elbow extended.', valence: 'pos' },
          { name: 'Resisted forearm pronation', result: 'Positive — pain reproduced at medial epicondyle with resisted pronation.', valence: 'pos' },
          { name: 'Grip strength (dynamometer)', result: 'Right 28 kg, left 31 kg. Mild weakness on right. Medial elbow pain during squeeze.', valence: 'neutral' },
        ]},
        { name: 'Special Tests — UCL Integrity', items: [
          { name: 'Valgus stress test (20–30° flexion)', result: 'Negative — no medial gapping or pain at 20–30° elbow flexion with valgus stress.', valence: 'neg' },
          { name: 'Moving valgus stress test', result: 'Negative — no pain reproduction through arc of elbow flexion under valgus load.', valence: 'neg' },
        ]},
        { name: 'Cubital Tunnel Screen', items: [
          { name: 'Elbow flexion test (sustained 3 min)', result: 'Negative — no ulnar paraesthesias at 3 minutes of maximal elbow flexion.', valence: 'neg' },
          { name: 'Shoulder IR + elbow flexion + wrist extension (neural tension)', result: 'Slight medial elbow discomfort but no ulnar nerve paraesthesias reproduced.', valence: 'neutral' },
          { name: 'Sensation — ulnar distribution (ring / little fingers, medial forearm)', result: 'Intact bilaterally. No hypoaesthesia.', valence: 'neg' },
        ]},
        { name: 'Neurological', items: [
          { name: 'Grip / pinch strength', result: 'Mildly reduced on right (90% of left) but purely pain-inhibited — no true neurological weakness pattern.', valence: 'neutral' },
          { name: 'Finger abduction / adduction (intrinsic power)', result: '5/5 bilaterally. No ulnar nerve motor deficit.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Medial Epicondylalgia (Golfer\'s Elbow)',
      correctDxAliases: ['medial epicondylalgia', "golfer's elbow", 'medial epicondylitis', 'flexor-pronator tendinopathy', 'medial elbow tendinopathy', 'common flexor tendinopathy'],
      keyDifferentials: ['UCL sprain / partial tear', 'Cubital tunnel syndrome (ulnar nerve)', 'Pronator teres syndrome', 'Medial epicondyle avulsion (young athletes)'],
      keyFindings: [
        { icon: '✓', text: '<strong>Tenderness at common flexor-pronator origin (medial epicondyle)</strong> — primary pain location confirms the tendon origin as the pain source.' },
        { icon: '✓', text: '<strong>Positive resisted wrist flexion and pronation</strong> — pain with resisted loading of FCR and pronator teres confirms common flexor origin involvement.' },
        { icon: '✗', text: '<strong>Negative moving valgus stress test</strong> — the most reliable test for UCL integrity; negative result effectively rules out significant UCL pathology.' },
        { icon: '✗', text: '<strong>Negative elbow flexion test and Tinel\'s</strong> — no ulnar nerve symptoms; cubital tunnel syndrome excluded.' },
        { icon: '✓', text: '<strong>No intrinsic wasting and intact ulnar sensation</strong> — important negative finding confirming no motor or sensory ulnar nerve compromise.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (medial epicondylalgia)', key: 'finalDx', weight: 3 },
        { criterion: 'Medial epicondylalgia in initial or updated differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes progressive flexor-pronator loading', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning differentiates from UCL and cubital tunnel', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Elbow flexion test (cubital tunnel)', result: 'Negative — no ulnar nerve tingling or ring/little finger numbness with sustained elbow flexion. Cubital tunnel syndrome excluded.', valence: 'neg' },
        { name: 'Tinel\'s sign at elbow (ulnar nerve)', result: 'Negative — no electric tingling reproduced with tapping posterior to medial epicondyle. Ulnar nerve entrapment excluded.', valence: 'neg' },
        { name: 'Moving valgus stress test', result: 'Negative — no medial elbow pain with dynamic valgus stress through arc. UCL integrity confirmed. UCL sprain excluded.', valence: 'neg' },
        { name: 'Grip strength dynamometry', result: 'Right grip 24 kg, left 39 kg. 38% deficit. Significant functional impairment consistent with medial tendinopathy.', valence: 'pos' },
        { name: 'Resisted wrist extension (ECRB zone)', result: 'Negative — no lateral elbow pain with resisted wrist extension. Lateral epicondylalgia excluded — confirms the medial compartment is the primary structure.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is medial epicondylalgia. The common flexor-pronator origin tenderness with positive resisted wrist flexion and pronation confirms tendon origin involvement. The negative moving valgus stress test (the most reliable UCL test) and negative valgus stress effectively exclude UCL pathology — the mild distal sublime tubercle tenderness is a common secondary finding. The negative elbow flexion test, negative Tinel's, and intact ulnar nerve sensation and motor function exclude cubital tunnel syndrome. Management: progressive flexor-pronator loading (isometric → isotonic eccentric → sport-specific), climbing load management, technique coaching.`,
    },
    {
      id: 'i4',
      title: 'Sharp back and leg pain after lifting',
      region: 'Lumbar',
      info: { age: '35', sex: 'Female', occupation: 'Warehouse supervisor', onset: '4 days', duration: 'Acute' },
      vignette: `<p>A 35-year-old female warehouse supervisor presents with <strong>severe lower back pain shooting down her left leg</strong>. The pain started 4 days ago when she bent forward and twisted to lift a heavy 25kg box off the floor. She felt a sudden "twinge" in her back, but the leg pain developed the following morning.</p><p>The pain is a sharp, electric shock sensation that starts in her lower left back and shoots down the outside of her left thigh, wrapping around the outside of her calf and into the top of her foot and big toe. Her back pain is a 4/10, but her leg pain is an 8/10.</p><p>She finds sitting almost unbearable after 10 minutes, and bending forward to put on her socks is impossible. Lying flat on her back with her knees propped up offers the best relief. She has noticed that her left foot feels a bit "floppy" when she walks.</p>`,
      redFlags: ['Bowel or bladder dysfunction (Cauda Equina)', 'Saddle anesthesia', 'Progressive bilateral weakness', 'Unremitting night pain'],
      examCategories: [
        { name: 'Observation & Posture', items: [
          { name: 'Standing posture', result: 'Visible lateral shift away from the left side. Flattened lumbar lordosis.', valence: 'pos' },
          { name: 'Gait', result: 'Cautious, slow gait. Mild "foot drop" / steppage gait observed on the left.', valence: 'pos' },
        ]},
        { name: 'Lumbar ROM', items: [
          { name: 'Lumbar flexion', result: 'Markedly restricted. Reproduces sharp pain down left leg to the foot.', valence: 'pos' },
          { name: 'Lumbar extension', result: 'Restricted by back stiffness but does NOT shoot down the leg. Centralizes pain slightly.', valence: 'pos' },
        ]},
        { name: 'Neurological Assessment', items: [
          { name: 'Myotomes (Strength)', result: 'L4: 5/5. L5 (Great toe extension): 3/5 weak left. S1: 5/5.', valence: 'pos' },
          { name: 'Dermatomes (Sensation)', result: 'Diminished pinprick sensation over the dorsum of the left foot and web space of the big toe (L5).', valence: 'pos' },
          { name: 'Reflexes', result: 'Patellar (L4) 2+ bilateral. Achilles (S1) 2+ bilateral. Normal.', valence: 'neg' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'SLR — Ipsilateral', result: 'Positive at 35° on the left — produces sharp electric pain to the foot.', valence: 'pos' },
          { name: 'SLR — Crossed', result: 'Negative on the right.', valence: 'neg' },
          { name: 'Slump Test', result: 'Strongly positive left.', valence: 'pos' },
        ]},
      ],
      correctDx: 'Lumbar Disc Herniation with L5 Radiculopathy',
      correctDxAliases: ['lumbar disc herniation', 'sciatica', 'lumbar radiculopathy', 'l5 radiculopathy', 'disc bulge'],
      keyDifferentials: ['Lumbar sprain/strain', 'S1 Radiculopathy', 'Lumbar spinal stenosis', 'SIJ dysfunction'],
      keyFindings: [
        { icon: '✓', text: '<strong>Leg pain > Back pain with dermatomal mapping</strong> — indicates radiculopathy.' },
        { icon: '✓', text: '<strong>L5 Neurological Deficit</strong> — weakness and sensory loss map perfectly to L5 nerve root.' },
        { icon: '✓', text: '<strong>Directional preference</strong> — flexion worsens pain, extension centralizes it.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis', key: 'finalDx', weight: 3 },
        { criterion: 'Correctly identifies the L5 nerve root level', key: 'reasoning', weight: 2 },
        { criterion: 'Management includes extension-biased therapy', key: 'management', weight: 2 },
        { criterion: 'Cauda Equina red flags screened', key: 'redFlags', weight: 1 },
      ],
      additionalTests: [
        { name: 'Femoral nerve tension test', result: 'Negative — no anterior thigh pain with prone knee bend. L2/L3/L4 roots not involved. Confirms L5 as the affected level rather than upper lumbar.', valence: 'neg' },
        { name: 'SI provocation — thigh thrust', result: 'Negative — no posterior pelvic pain. SI joint dysfunction excluded as a contributor.', valence: 'neg' },
        { name: 'Waddell\'s signs', result: 'None of 5 signs present. No non-organic or psychosocial amplification pattern. Findings are organic and consistent.', valence: 'neg' },
        { name: 'Ankle clonus / Babinski', result: 'Negative bilaterally. No upper motor neuron signs. Central cord compression excluded — this is a peripheral L5 nerve root compression.', valence: 'neg' },
        { name: 'FABER test (SI joint screen)', result: 'Negative — no posterior pelvic pain. SI joint not contributing to the radicular presentation.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is a Lumbar Disc Herniation resulting in an L5 Radiculopathy. The mechanism of injury and resulting symptoms (worsened by sitting/flexion) strongly suggest a posterior disc herniation. The physical exam confirms specific nerve root involvement: weakness in great toe extension and sensory loss over the dorsum of the foot perfectly map to the L5 myotome and dermatome. Positive SLR and Slump tests confirm neural tension.`,
    },
    {
      id: 'i5',
      title: 'Medial elbow pain in a baseball pitcher',
      region: 'Elbow',
      info: { age: '19', sex: 'Male', occupation: 'Collegiate baseball pitcher', onset: '1 month', duration: 'Subacute' },
      vignette: `<p>A 19-year-old collegiate baseball pitcher presents with <strong>pain on the inside of his right (throwing) elbow</strong>. The pain began gradually a month ago during spring training but spiked sharply during a game two days ago.</p>
        <p>He reports a sharp pain specifically during the "late cocking and early acceleration" phases of his pitch. He notes his pitching velocity has dropped by 4 mph over the last two weeks because he is subconsciously protecting the arm. The pain aches for an hour after throwing and then subsides.</p>
        <p>He denies any numbness or tingling in his hand. He has no pain with typing, gripping everyday objects, or lifting weights in the gym. Rest helps, but the pain immediately returns when he tries to throw off the mound.</p>`,
      redFlags: ['Constant resting numbness in ring/little finger', 'Sudden inability to move the elbow', 'Visible deformity'],
      examCategories: [
        { name: 'Observation', items: [
          { name: 'Carrying angle', result: 'Mild increased valgus carrying angle on the right (15°) compared to left (10°).', valence: 'neutral' },
          { name: 'Muscle bulk', result: 'Normal flexor-pronator mass. No intrinsic hand wasting.', valence: 'neg' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Medial Epicondyle', result: 'No tenderness directly on the bony medial epicondyle.', valence: 'neg' },
          { name: 'Sublime Tubercle (UCL insertion)', result: 'Exquisite point tenderness 2cm distal to the medial epicondyle at the sublime tubercle of the ulna.', valence: 'pos' },
          { name: 'Cubital Tunnel', result: 'No tenderness over the ulnar nerve.', valence: 'neg' },
        ]},
        { name: 'Special Tests — Ligament', items: [
          { name: 'Valgus Stress Test (20-30° flexion)', result: 'Positive — 2mm of medial gapping compared to the left, with pain reproduction.', valence: 'pos' },
          { name: 'Moving Valgus Stress Test', result: 'Strongly positive — reproduces sharp medial elbow pain dynamically between 120° and 70° of extension.', valence: 'pos' },
          { name: 'Milking Maneuver', result: 'Positive — reproduces medial joint pain.', valence: 'pos' },
        ]},
        { name: 'Special Tests — Tendon & Nerve', items: [
          { name: 'Resisted Wrist Flexion / Pronation', result: 'Negative — strong and pain-free (rules out medial epicondylalgia).', valence: 'neg' },
          { name: 'Tinel\'s Sign (Cubital Tunnel)', result: 'Negative — no tingling to the 4th/5th digits.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Ulnar Collateral Ligament (UCL) Sprain',
      correctDxAliases: ['ucl sprain', 'ucl tear', 'ulnar collateral ligament', 'valgus extension overload'],
      keyDifferentials: ['Medial Epicondylalgia (Golfer\'s Elbow)', 'Cubital Tunnel Syndrome', 'Flexor-Pronator Strain'],
      keyFindings: [
        { icon: '✓', text: '<strong>Pain during late-cocking/acceleration</strong> — this is the phase of the throwing motion that places maximum valgus stress on the medial elbow.' },
        { icon: '✓', text: '<strong>Positive Moving Valgus Stress Test</strong> — the most sensitive and specific clinical test for UCL insufficiency.' },
        { icon: '✓', text: '<strong>Tenderness at the Sublime Tubercle</strong> — the anatomical insertion of the anterior bundle of the UCL, differentiating it from the medial epicondyle.' },
        { icon: '✗', text: '<strong>Negative resisted wrist flexion</strong> — effectively rules out medial epicondylalgia (Golfer\'s elbow) which is a tendon-loading issue.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (UCL Sprain)', key: 'finalDx', weight: 3 },
        { criterion: 'Differentiates UCL from Medial Epicondylalgia based on resisted tests', key: 'reasoning', weight: 2 },
        { criterion: 'Management includes throwing cessation and kinetic chain rehab', key: 'management', weight: 2 },
      ],
      additionalTests: [
        { name: 'Valgus stress test (0° and 30°)', result: 'Positive at 30° flexion — medial joint opening with valgus stress compared to unaffected side. UCL laxity confirmed.', valence: 'pos' },
        { name: 'Elbow flexion test (cubital tunnel)', result: 'Negative — no ulnar nerve tingling with sustained elbow flexion. Cubital tunnel syndrome not present.', valence: 'neg' },
        { name: 'Tinel\'s sign at elbow (ulnar nerve)', result: 'Negative — no paresthesia reproduced with ulnar groove tapping. Ulnar neuropathy excluded.', valence: 'neg' },
        { name: 'Resisted wrist flexion (medial epicondyle origin)', result: 'Negative — no lateral or medial elbow pain with resisted wrist flexion. Medial epicondylalgia excluded as primary structure.', valence: 'neg' },
        { name: 'Lateral epicondyle palpation', result: 'No tenderness at the lateral epicondyle. Lateral epicondylalgia excluded — pain is medial, confirming UCL / medial compartment involvement.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is an Ulnar Collateral Ligament (UCL) Sprain. The patient presents with classic Valgus Extension Overload symptoms: pain during the late-cocking/acceleration phase of throwing and a drop in pitching velocity. The physical exam perfectly isolates the ligament rather than the tendon: pain is at the sublime tubercle (not the epicondyle), the Moving Valgus and Milking tests are positive, and critically, resisted wrist flexion is painless (ruling out medial epicondylalgia/Golfer's elbow). The lack of ulnar nerve symptoms rules out cubital tunnel syndrome. Given his status as a collegiate pitcher and the drop in velocity, this patient requires an immediate cessation of throwing and a referral for an MR Arthrography to evaluate the grade of the tear to determine if Tommy John surgery or conservative rehab is indicated.`,
    },
    {
      id: 'i6',
      title: 'Shoulder pain after a cycling crash',
      region: 'Shoulder',
      info: { age: '29', sex: 'Male', occupation: 'Software engineer / cyclist', onset: '3 days', duration: 'Acute' },
      vignette: `<p>A 29-year-old male presents with <strong>sharp, localized pain at the top of his right shoulder</strong>. Three days ago, he was mountain biking and went over the handlebars, landing directly on the point of his right shoulder with his arm tucked by his side.</p><p>He complains of pain whenever he tries to lift his arm above shoulder height, particularly when reaching across his body to put on his seatbelt. He feels a clicking sensation at the top of the shoulder when moving. He has noted a slight "bump" on the top of his shoulder that wasn't there before.</p><p>He denies any numbness or tingling in his arm. He has full grip strength and no neck pain.</p>`,
      redFlags: ['Deformity suggesting fracture (Clavicle)', 'Loss of distal pulses or severe swelling', 'Cervical spine trauma mechanism'],
      examCategories: [
        { name: 'Observation', items: [
          { name: 'Visual inspection', result: 'Visible step-deformity (Type II/III) at the superior aspect of the shoulder. Clavicle appears slightly elevated relative to the acromion.', valence: 'pos' },
          { name: 'Muscle bulk', result: 'No wasting of the rotator cuff fossa.', valence: 'neutral' },
        ]},
        { name: 'Palpation', items: [
          { name: 'AC Joint palpation', result: 'Exquisite point tenderness directly over the acromioclavicular joint space.', valence: 'pos' },
          { name: 'Clavicle shaft palpation', result: 'No tenderness along the mid-shaft of the clavicle (rules out clavicle fracture).', valence: 'neg' },
          { name: 'Greater tuberosity (Supraspinatus)', result: 'Mild, diffuse tenderness, likely referred, but not the primary pain point.', valence: 'neutral' },
        ]},
        { name: 'Active ROM', items: [
          { name: 'Shoulder Flexion/Abduction', result: 'Painful arc of motion specifically at the very end-range (160-180°).', valence: 'pos' },
          { name: 'External/Internal Rotation', result: 'Full and pain-free at the side.', valence: 'neg' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Cross-Body Adduction Test', result: 'Strongly positive — reproduces sharp pain precisely at the AC joint.', valence: 'pos' },
          { name: 'Paxinos Test', result: 'Positive — compressing the acromion and clavicle together reproduces the exact pain.', valence: 'pos' },
          { name: 'Drop Arm Test / Lag Signs', result: 'Negative — rotator cuff is intact.', valence: 'neg' },
          { name: 'Apprehension Test', result: 'Negative — no feeling of GH joint instability.', valence: 'neg' },
        ]},
      ],
      correctDx: 'AC Joint Pathology',
      correctDxAliases: ['ac joint pathology', 'ac joint sprain', 'ac joint separation', 'ac sprain', 'acromioclavicular sprain', 'acromioclavicular joint separation', 'acromioclavicular (ac) joint sprain / separation'],
      keyDifferentials: ['Clavicle Fracture', 'Rotator Cuff Tear', 'Subacromial Bursitis (traumatic)'],
      keyFindings: [
        { icon: '✓', text: '<strong>Mechanism of injury</strong> — direct fall onto the point of the shoulder with the arm adducted is the textbook mechanism for an AC joint separation.' },
        { icon: '✓', text: '<strong>Step deformity + Point tenderness</strong> — visually and physically localizes the injury to the AC ligaments.' },
        { icon: '✓', text: '<strong>Positive Cross-Body Adduction</strong> — forcefully compresses the AC joint space, highly sensitive for AC pathology.' },
        { icon: '✗', text: '<strong>Negative lag signs</strong> — rules out an acute traumatic rotator cuff tear.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (AC Joint Pathology)', key: 'finalDx', weight: 3 },
        { criterion: 'Identifies mechanism of injury (direct lateral fall) as key', key: 'reasoning', weight: 2 },
        { criterion: 'Management involves acute sling (if severe), taping, and progressive ROM', key: 'management', weight: 2 },
        { criterion: 'Rules out clavicle fracture', key: 'reasoning', weight: 1 },
      ],
      additionalTests: [
        { name: 'Rotator cuff strength (external rotation lag)', result: 'Negative — no lag, full strength maintained at end-range ER. Rotator cuff integrity confirmed. Acute RC tear excluded.', valence: 'neg' },
        { name: 'Empty can test (supraspinatus)', result: 'Mild pain but 5/5 strength. No weakness. Pain is referred from AC joint stress, not supraspinatus dysfunction.', valence: 'neutral' },
        { name: 'Clavicle mid-shaft palpation', result: 'No tenderness over clavicle shaft. No deformity. Clavicle fracture excluded — pain localised to AC joint only.', valence: 'neg' },
        { name: 'Glenohumeral stability (apprehension test)', result: 'Negative — no apprehension or instability with external rotation. GH joint integrity confirmed.', valence: 'neg' },
        { name: 'Bicipital groove palpation (Speed\'s test)', result: 'Negative — no bicipital groove tenderness, no pain with resisted forward flexion. LHB tendon not implicated.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is AC Joint Pathology, specifically an Acromioclavicular (AC) Joint Sprain (likely Grade II/III given the visible step deformity). The mechanism of injury—a direct lateral blow to the point of the shoulder with the arm at the side—drives the acromion inferiorly while the clavicle remains stabilized, tearing the AC and potentially coracoclavicular (CC) ligaments. The physical exam confirms this with point tenderness over the AC joint, end-range pain (where the clavicle must rotate), and a positive cross-body adduction test. The lack of mid-shaft clavicle tenderness reduces the likelihood of a fracture. Because the rotator cuff tests are negative, we can rule out an acute traumatic tear. Management requires initial protection (taping or short-term sling for pain relief) followed by progressive scapular stabilization and deltoid strengthening.`,
    },

    {
      id: 'i7',
      title: 'Mid-back and rib pain in a rower',
      region: 'Thoracic',
      info: { age: '22', sex: 'Female', occupation: 'University student / competitive rower', onset: '3 weeks', duration: 'Subacute' },
      vignette: `<p>A 22-year-old competitive rower presents with <strong>right-sided mid-thoracic and lateral rib pain</strong> that has been worsening over the past 3 weeks. She is in the middle of her pre-season training block, rowing 6 sessions per week with increasing on-water volume. The pain began insidiously during a long steady-state session and has progressively worsened to the point where she can no longer row.</p>
        <p>She describes a sharp, catching pain over the right lateral chest wall (approximately ribs 5–7) that is reproduced with every rowing stroke — specifically at the drive phase. Deep inspiration and sneezing also reproduce the pain sharply. She can reproduce the pain herself by pressing on the lateral rib area.</p>
        <p>She has been using a stiffer sweep oar this season and her technique has been critiqued by her coach for excessive spinal rotation to the right. She denies fever, shortness of breath at rest, coughing, or any leg swelling. She has no history of prior chest wall or rib injury.</p>`,
      redFlags: ['Shortness of breath at rest or with minimal exertion', 'Fever or cough with haemoptysis', 'Pain radiating to jaw or left arm', 'Unexplained weight loss', 'History of cancer or immunosuppression'],
      examCategories: [
        { name: 'Observation & Posture', items: [
          { name: 'Thoracic posture', result: 'Mild right thoracic rotation in standing. Slightly reduced thoracic kyphosis (often seen in high-volume rowers — relative extension).', valence: 'neutral' },
          { name: 'Breathing pattern', result: 'Splinted breathing — patient is guard-breathing with reduced right lateral expansion.', valence: 'pos' },
        ]},
        { name: 'Active ROM', items: [
          { name: 'Thoracic rotation left', result: 'Full and pain-free.', valence: 'neg' },
          { name: 'Thoracic rotation right', result: 'Moderately restricted (25° loss) — reproduces right lateral rib pain at mid-range.', valence: 'pos' },
          { name: 'Deep inhalation', result: 'Sharp right lateral rib pain at full chest expansion. Cannot take a full breath.', valence: 'pos' },
          { name: 'Forward flexion', result: 'Full but slight right lateral rib discomfort at end range.', valence: 'neutral' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Rib shaft palpation (lateral ribs 5–7 right)', result: 'Exquisite point tenderness over the lateral shaft of right rib 6. Reproduces exact pain with minimal pressure.', valence: 'pos' },
          { name: 'Costovertebral junction (T6/T7)', result: 'Mild paraspinal tenderness adjacent to T6/T7. Does not reproduce the lateral rib pain.', valence: 'neutral' },
          { name: 'Intercostal muscle palpation', result: 'Diffuse intercostal tenderness overlying the area of bony tenderness — likely secondary muscle guarding.', valence: 'neutral' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Lateral rib compression test', result: 'Strongly positive — bilateral lateral compression of the thorax reproduces sharp right lateral rib pain.', valence: 'pos' },
          { name: 'AP rib compression test', result: 'Positive — anterior-posterior sternal compression also reproduces the pain. Note: this test has stronger evidence for acute traumatic rib fracture; here it supports but is secondary to the lateral compression test.', valence: 'pos' },
          { name: 'Tuning fork / percussion test (rib)', result: 'Positive — vibration applied to right rib 6 via tuning fork reproduces sharp focal pain at the lateral shaft.', valence: 'pos' },
          { name: 'Deep inspiration + rotation right (rowing simulation)', result: 'Reproduces exact pain within 3 repetitions — confirms rowing-related provocation pattern.', valence: 'pos' },
        ]},
        { name: 'Respiratory & Cardio Screen', items: [
          { name: 'Oxygen saturation', result: '99% on room air — normal.', valence: 'neg' },
          { name: 'Lung auscultation', result: 'Clear bilaterally — no crackles or wheeze.', valence: 'neg' },
          { name: 'Thoracic AROM full screen', result: 'All restricted movements limited by pain only — no neurological symptoms or upper motor neuron signs.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Rib Stress Fracture (Fatigue Fracture — Right Rib 6)',
      correctDxAliases: ['rib stress fracture', 'rib fatigue fracture', 'rib stress reaction', 'rowing rib fracture', 'costal stress fracture'],
      keyDifferentials: ['Intercostal muscle strain', 'Costovertebral joint dysfunction', 'Pleuritis / pneumothorax', 'Thoracic Disc Pathology'],
      keyFindings: [
        { icon: '⚠', text: '<strong>Point tenderness at lateral rib shaft + positive rib compression test</strong> — focal bony tenderness combined with positive compression from two directions is the hallmark cluster for rib stress fracture.' },
        { icon: '⚠', text: '<strong>Positive tuning fork test</strong> — stress-wave vibration transmitted to fracture site reproducing focal pain is associated with bony involvement, not pure soft tissue injury.' },
        { icon: '✓', text: '<strong>Load history: high-volume rowing with asymmetric technique</strong> — rib stress fractures are the #1 overuse injury in competitive rowers; right-sided at ribs 5–9 is the classic presentation from serratus anterior fatigue under repetitive loading.' },
        { icon: '✗', text: '<strong>Normal SpO2, clear lung fields</strong> — effectively rules out pneumothorax or pulmonary pathology.' },
        { icon: '✗', text: '<strong>No fever, no haemoptysis, no weight loss</strong> — excludes infectious or neoplastic thoracic pathology.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (rib stress fracture)', key: 'finalDx', weight: 3 },
        { criterion: 'Rib stress fracture or bony pathology in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management includes immediate rowing rest and graded return', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed (pneumothorax, cardiac, neoplastic)', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning identifies compression test + tuning fork as bony discriminators from muscle strain', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'AP rib compression test (sternum-to-spine)', result: 'Positive — anterior-posterior chest compression reproduces right posterolateral rib pain. Supportive of rib stress fracture.', valence: 'pos' },
        { name: 'Intercostal muscle palpation (right rib 6)', result: 'Tenderness along intercostal space, but maximal tenderness is at rib shaft — not purely intercostal. Intercostal strain alone does not explain bony percussion findings.', valence: 'neutral' },
        { name: 'Deep inspiration test', result: 'Positive — sharp right posterolateral pain at end-range deep breath. Consistent with rib stress fracture (or intercostal fracture) under respiratory load.', valence: 'pos' },
        { name: 'Scapular mobility assessment', result: 'Mild right scapular protraction pattern with limited retraction. Contributes to altered serratus anterior loading during rowing — biomechanical contributor identified.', valence: 'neutral' },
        { name: 'Thoracic PA joint spring testing (T5–T7)', result: 'Mild stiffness at T6/T7 but no reproduction of rib pain. Joint dysfunction alone does not explain the point-tender rib shaft or positive compression test.', valence: 'neutral', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is a Rib Stress Fracture (fatigue fracture, right rib 6). This is the most common overuse injury in competitive rowers — repetitive loading from serratus anterior and external oblique during the drive phase creates cyclic bending forces at the posterolateral rib shaft (ribs 5–9 most commonly). The clinical cluster is diagnostic: exquisite focal point tenderness at the rib shaft, positive lateral rib compression test (the primary finding — strongest evidence for rib stress fracture), positive tuning fork percussion (stress-wave vibration conducted through bone), and a supporting positive AP compression test (note: AP compression has stronger evidence for acute traumatic fractures; here it is a supportive finding only). An intercostal muscle strain would not produce positive compression from two planes or positive tuning fork percussion. Plain X-ray is insensitive (up to 50% false negative initially); bone scan or CT with bone windows confirms the diagnosis. Management: immediate complete rowing rest (typically 6 weeks), progressive return to ergo before water, technique correction. Failure to rest risks complete displacement.`,
    },

    {
      id: 'i8',
      title: 'Anterior knee pain in a female basketball player',
      region: 'Knee',
      info: { age: '17', sex: 'Female', occupation: 'Student / basketball player (State squad)', onset: '4 months', duration: 'Chronic' },
      vignette: `<p>A 17-year-old female State-level basketball player presents with a 4-month history of <strong>anterior knee pain bilaterally (right worse than left)</strong>. The pain is diffuse and centred behind and around her kneecap. It has been gradually worsening as she has progressed to full-season competition.</p>
        <p>She describes pain during and after training — specifically with jumping, landing, going down stairs, and after prolonged sitting (theatre sign). The pain eases within an hour of stopping activity. She has morning stiffness that resolves within 5 minutes. No history of acute injury, no swelling, no locking, and no giving way.</p>
        <p>She has grown 6 cm in the past 12 months and her training load has increased significantly with State squad selection. She denies any hip pain, back pain, or symptoms in her thighs. Her periods are regular. She is concerned about missing her upcoming State Championships.</p>`,
      redFlags: ['Acute locking', 'True giving way (not apprehension)', 'Significant swelling', 'Night pain'],
      examCategories: [
        { name: 'Observation', items: [
          { name: 'Static posture', result: 'Mild bilateral genu valgum. Bilateral foot pronation. Mild forward tilt of pelvis (anterior pelvic tilt).', valence: 'pos' },
          { name: 'Patella position (sitting)', result: 'Mild bilateral lateral patellar tilt noted on visual inspection. Right > left.', valence: 'neutral' },
        ]},
        { name: 'Patellar Assessment', items: [
          { name: 'Patellar glide test (medial/lateral)', result: 'Right patella: reduced medial glide (tight lateral retinaculum). Lateral glide within normal limits.', valence: 'pos' },
          { name: 'Clarke\'s test / patellar grind', result: 'Right: positive — pain with compression and slight distal traction. Left: equivocal.', valence: 'pos' },
          { name: 'Patella tilt test', result: 'Reduced lateral edge elevation bilaterally (tight lateral retinaculum).', valence: 'pos' },
        ]},
        { name: 'ROM', items: [
          { name: 'Knee flexion / extension ROM', result: 'Full bilaterally. Pain at end-range flexion right (peripatellar).', valence: 'neutral' },
          { name: 'Hip internal rotation (prone)', result: 'Increased bilaterally (45° R, 42° L) — consistent with femoral anteversion pattern.', valence: 'pos' },
          { name: 'Quadriceps flexibility (prone knee bend)', result: 'Right 95°, left 100° (normal >120°). Bilateral quadriceps tightness.', valence: 'pos' },
        ]},
        { name: 'Strength & Function', items: [
          { name: 'Single-leg squat (5 reps)', result: 'Bilateral dynamic valgus collapse — ipsilateral hip adduction, contralateral pelvic drop, internal rotation and valgus at the knee. Right worse than left.', valence: 'pos' },
          { name: 'Hip abductor strength (side-lying)', result: 'Right 3+/5, left 4/5. Reduced hip abductor strength bilaterally.', valence: 'pos' },
          { name: 'Quad strength (single-leg press 60°)', result: 'Right 85% of left. Pain-limited.', valence: 'pos' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Medial / lateral joint line palpation', result: 'No joint line tenderness bilaterally.', valence: 'neg' },
          { name: 'Patellar tendon palpation', result: 'No tenderness at patellar tendon origin or tibial tuberosity insertion.', valence: 'neg' },
          { name: 'Peripatellar palpation', result: 'Tenderness medial patella facet and along medial retinaculum on right.', valence: 'pos' },
        ]},
        { name: 'Meniscal / Ligament Screen', items: [
          { name: 'McMurray / Thessaly test', result: 'Negative bilaterally.', valence: 'neg' },
          { name: 'Lachman / Anterior Drawer', result: 'Negative bilaterally — firm end-feel.', valence: 'neg' },
          { name: 'Valgus / Varus stress', result: 'Negative bilaterally.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Patellofemoral Pain Syndrome (PFPS)',
      correctDxAliases: ['patellofemoral pain syndrome', 'pfps', 'patellofemoral pain', 'anterior knee pain syndrome', 'chondromalacia patella', 'runner\'s knee'],
      keyDifferentials: ['Patellar tendinopathy', 'Medial plica syndrome', 'Fat pad impingement'],
      keyFindings: [
        { icon: '✓', text: '<strong>Theatre sign + stair pain + activity-related bilateral anterior knee pain</strong> — classic PFPS symptom triad in a young female athlete during growth spurt.' },
        { icon: '✓', text: '<strong>Dynamic valgus collapse on single-leg squat + hip abductor weakness</strong> — proximal hip control deficit is the primary biomechanical driver in this age/sex group.' },
        { icon: '✓', text: '<strong>Tight lateral retinaculum (reduced medial glide + patellar tilt)</strong> — lateral soft tissue tightness contributes to abnormal patellar tracking.' },
        { icon: '✗', text: '<strong>Negative McMurray, Lachman, and joint line tenderness</strong> — rules out meniscal pathology and ligamentous injury.' },
        { icon: '✗', text: '<strong>Negative patellar tendon palpation</strong> — differentiates PFPS from patellar tendinopathy (Jumper\'s knee), where inferior pole patellar tendon tenderness is the key finding.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (PFPS)', key: 'finalDx', weight: 3 },
        { criterion: 'PFPS in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Management targets proximal (hip) and local (quadriceps, patellar mobility) factors', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
        { criterion: 'Reasoning differentiates from patellar tendinopathy and meniscal pathology', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Patellar tendon palpation (inferior pole)', result: 'No tenderness at inferior patellar pole or patellar tendon. Patellar tendinopathy (Jumper\'s knee) excluded.', valence: 'neg' },
        { name: 'Tibial tuberosity palpation', result: 'No bony prominence or tenderness at tibial tuberosity. Osgood-Schlatter disease excluded.', valence: 'neg' },
        { name: 'Medial patellar glide test', result: 'Restricted medial glide right — lateral retinacular tightness present. Contributes to increased lateral patellofemoral contact pressure.', valence: 'pos' },
        { name: 'Hip abductor strength (side-lying)', result: 'Reduced bilaterally — right 3+/5, left 4/5. Bilateral hip abductor weakness driving dynamic valgus collapse is the primary biomechanical driver.', valence: 'pos' },
        { name: 'Patellar tap test (effusion)', result: 'Negative — no ballotable effusion. Joint effusion absent, consistent with PFPS rather than intra-articular pathology.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Patellofemoral Pain Syndrome (PFPS). This is the most common knee complaint in adolescent female athletes. The classic presentation is bilateral, diffuse anterior knee pain worsened by loading activities (jumping, stairs, prolonged sitting — theatre sign), without acute injury, without joint line tenderness, and with negative ligament and meniscal tests. Key discriminators: the patellar tendon is not tender (ruling out patellar tendinopathy/Jumper's knee); no tibial tuberosity tenderness (ruling out Osgood-Schlatter's despite her age and growth history). The primary drivers are proximal (weak hip abductors producing dynamic valgus) and local (tight lateral retinaculum limiting medial patellar glide). Management must address the hip (abductor strengthening: clamshell, side-lying abduction, single-leg squat retraining), the knee locally (vastus medialis oblique activation, patellar taping), and quadriceps flexibility — in that order, as proximal control is the most evidence-supported intervention.`,
    },

  ],

  advanced: [
    {
      id: 'a1',
      title: 'Insidious low back pain with bilateral leg symptoms',
      region: 'Lumbar',
      info: { age: '67', sex: 'Male', occupation: 'Retired civil engineer', onset: '14 months', duration: 'Chronic' },
      vignette: `<p>A 67-year-old retired civil engineer presents with a <strong>14-month history of low back pain with bilateral leg symptoms</strong>. He describes a constant, dull low back ache, and bilateral leg heaviness and paraesthesias that begin in the buttocks and extend to both calves. Symptoms worsen significantly when walking — he can now only manage approximately 150 metres before needing to rest. Sitting and forward flexion (including shopping trolley position) relieves the leg symptoms within 2–3 minutes.</p>
        <p>He also reports intermittent right leg "weakness" when walking that he describes as a foot "not lifting properly." He denies any acute trauma. He had a lumbar laminectomy at L4/5 in 2011 for similar symptoms which gave excellent relief for approximately 8 years before the current symptoms began gradually. He has type 2 diabetes (well-controlled, HbA1c 52) and a 40 pack-year smoking history (stopped 5 years ago). BP well-controlled on medication.</p>
        <p>He mentions his right calf aches after walking and resolves with rest — he assumed this was "part of the same problem." He saw a vascular surgeon 2 years ago for varicose veins and was told his "circulation was fine at that point." He has never had ankle-brachial index testing.</p>`,
      redFlags: ['Progressive bilateral neurological deficit — urgent MRI', 'Bowel or bladder dysfunction — cauda equina', 'Night pain not relieved by position change', 'Unexplained weight loss', 'Fever or constitutional symptoms'],
      examCategories: [
        { name: 'Neurological Assessment', items: [
          { name: 'Lower limb sensation (dermatomal)', result: 'Mild symmetric reduction to light touch L4/L5/S1 bilaterally. Consistent with mild peripheral neuropathy vs. multilevel involvement.', valence: 'pos' },
          { name: 'Lower limb reflexes (patellar + Achilles)', result: 'Patellar reflex 2+ bilaterally. Achilles reflex absent bilaterally (consistent with diabetic peripheral neuropathy OR bilateral S1 compromise).', valence: 'pos' },
          { name: 'Myotomal strength testing (L4–S1)', result: 'Right EHL strength 4/5 (mild foot drop pattern on right). Plantarflexion 4/5 bilaterally. No focal pattern strongly suggesting single-level compression.', valence: 'pos' },
          { name: 'Babinski / upper motor neuron signs', result: 'Negative bilaterally.', valence: 'neg' },
        ]},
        { name: 'Lumbar Assessment', items: [
          { name: 'Lumbar active ROM', result: 'Extension markedly limited and reproduces bilateral buttock/thigh heaviness. Flexion full and relieves symptoms — classic stenotic pattern.', valence: 'pos' },
          { name: 'SLR test', result: 'Negative bilaterally at 70°. No radicular pain reproduction below knee.', valence: 'neg' },
          { name: 'Slump test', result: 'Negative — mild posterior thigh tension but no distal neural reproduction.', valence: 'neg' },
          { name: 'Walking / treadmill provocation', result: '150 m walk reproduces bilateral calf heaviness and right foot heaviness. Immediate relief sitting for 2 minutes.', valence: 'pos' },
        ]},
        { name: 'Vascular Screen', items: [
          { name: 'Peripheral pulses (dorsalis pedis + posterior tibial)', result: 'Right DP pulse: diminished but present. Left DP pulse: 2+. Right PT pulse: diminished. Asymmetric finding.', valence: 'pos' },
          { name: 'Capillary refill time', result: 'Right foot: 4 seconds (borderline prolonged). Left foot: 2 seconds.', valence: 'pos' },
          { name: 'Skin and hair changes (legs)', result: 'Loss of hair on right dorsum of foot. Right calf slightly cooler than left on palpation.', valence: 'pos' },
          { name: 'Buerger\'s test (limb elevation pallor)', result: 'Right foot: pallor with elevation at 45° within 30 seconds. Left foot: no pallor.', valence: 'pos' },
        ]},
        { name: 'Functional & Gait', items: [
          { name: 'Gait observation', result: 'Mild antalgic gait. Slight right foot drop on right swing phase (steppage gait). Wide-based stance.', valence: 'pos' },
          { name: 'Single-leg squat', result: 'Unable to perform on right due to right leg weakness. Left adequate.', valence: 'neutral' },
        ]},
      ],
      correctDx: 'Lumbar Spinal Stenosis with concurrent Peripheral Arterial Disease',
      correctDxAliases: [
        'lumbar spinal stenosis', 'neurogenic claudication', 'spinal stenosis',
        'lumbar stenosis with pad', 'lumbar stenosis and peripheral arterial disease',
        'mixed claudication', 'neurogenic and vascular claudication'
      ],
      keyDifferentials: ['Isolated lumbar spinal stenosis (neurogenic claudication)', 'Peripheral arterial disease (vascular claudication)', 'Diabetic peripheral neuropathy', 'Recurrent disc herniation at L4/5'],
      keyFindings: [
        { icon: '⚠', text: '<strong>Asymmetric peripheral pulses + trophic changes</strong> — diminished right DP/PT pulse, prolonged capillary refill, hair loss, and Buerger\'s positive indicate peripheral arterial disease on the right. This is not part of spinal stenosis.' },
        { icon: '✓', text: '<strong>Neurogenic claudication pattern (flexion relieves, extension provokes)</strong> — bilateral buttock-to-calf symptoms relieved by sitting/flexion is classic for central stenosis, consistent with prior L4/5 laminectomy history and recurrence.' },
        { icon: '✓', text: '<strong>Bilateral absent Achilles reflexes</strong> — could be diabetic neuropathy or bilateral S1 compromise; cannot differentiate without imaging, but is a multilevel finding.' },
        { icon: '⚠', text: '<strong>Right foot drop pattern (EHL 4/5)</strong> — could be L5 nerve root compromise from recurrent stenosis, but could also be ischaemic neuropathy from PAD; requires vascular workup.' },
        { icon: '✗', text: '<strong>Negative SLR / Slump bilaterally</strong> — nerve root tension signs are not expected in central canal stenosis (as opposed to lateral recess / foraminal stenosis with disc herniation).' },
      ],
      rubric: [
        { criterion: 'Identifies both neurogenic claudication and vascular component', key: 'finalDx', weight: 3 },
        { criterion: 'PAD or vascular claudication mentioned in differential', key: 'ddx1-3', weight: 3 },
        { criterion: 'Red flag screening and appropriate referral pathway identified', key: 'redFlags', weight: 2 },
        { criterion: 'Identifies asymmetric vascular signs as separate from spinal stenosis', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Femoral nerve tension test', result: 'Negative — no anterior thigh pain with prone knee bend. Upper lumbar nerve roots (L2/L3) not involved.', valence: 'neg' },
        { name: 'Treadmill / walking provocation test (timed)', result: 'Positive — bilateral calf heaviness and right foot heaviness at 150 m walk, resolving with 2 minutes of seated rest. Classic neurogenic claudication pattern confirmed.', valence: 'pos' },
        { name: 'ABI estimation (ankle-brachial index screen)', result: 'Estimated ABI right < 0.9 based on diminished pulse palpation. Peripheral arterial disease on right strongly suspected — formal ABI testing urgently required.', valence: 'pos' },
        { name: 'Waddell\'s signs', result: 'None of 5 signs present. Organic pathology consistent. No psychosocial amplification identified.', valence: 'neg' },
        { name: 'Femoral nerve tension test (prone knee bend)', result: 'Negative — no anterior thigh pain. L2/L3/L4 roots not involved. Upper lumbar pathology excluded.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `This case involves two concurrent conditions: recurrent lumbar spinal stenosis (neurogenic claudication) AND peripheral arterial disease (PAD) on the right. The bilateral buttock-to-calf symptoms with flexion relief and extension provocation are classic neurogenic claudication — consistent with recurrent stenosis following his 2011 laminectomy. However, the asymmetric peripheral vascular findings (diminished right DP/PT pulses, prolonged capillary refill, trophic changes, positive Buerger's test on right only) cannot be explained by spinal pathology alone. This is a masquerade case: the patient attributed all symptoms to "the same problem" but has two separate diagnoses requiring two separate pathways. Immediate vascular surgery referral for ABI testing and assessment is required alongside spinal workup. The right EHL weakness and absent bilateral Achilles reflexes require MRI to differentiate L5 nerve root vs. ischaemic neuropathy. Do not treat this as pure lumbar stenosis.`,
    },

    {
      id: 'a2',
      title: 'Shoulder pain in a 55-year-old with diabetes',
      region: 'Shoulder',
      info: { age: '55', sex: 'Female', occupation: 'Diabetes nurse educator', onset: '9 months', duration: 'Chronic' },
      vignette: `<p>A 55-year-old diabetes nurse educator presents with <strong>progressive right shoulder pain and stiffness</strong> of 9 months duration. The pain began insidiously with no trauma or specific onset event. Initially she noticed night pain, then difficulty reaching behind her back, and most recently significant restriction across all shoulder movements.</p>
        <p>She describes a constant dull ache in the anterior and lateral shoulder, significantly worse at night — she cannot find a comfortable position and rates her night pain 7/10. She has now stopped sleeping on the right side. Morning stiffness lasts over an hour. All overhead activities and reaching behind her back have been progressively limited.</p>
        <p>She has type 2 diabetes (insulin-dependent for 8 years, HbA1c currently 74 — suboptimal). She was prescribed NSAIDs by her GP with minimal effect and had a corticosteroid injection 4 months ago which gave partial relief for approximately 6 weeks before symptoms returned. She works full-time and is increasingly frustrated by the impact on her nursing duties.</p>
        <p>She mentions that she has been treated at a private physio for 3 months for "rotator cuff." She reports the exercises have not helped and the therapist is now recommending a subacromial injection.</p>`,
      redFlags: ['Unexplained progressive loss of passive ROM in a non-traumatic presentation', 'Night pain not related to position — screen for neoplasm', 'Systemic symptoms: fever, weight loss', 'Upper extremity neurological deficit'],
      examCategories: [
        { name: 'Range of Motion — Active', items: [
          { name: 'Active shoulder flexion', result: 'Right 90° (severely limited). Left 175°. Pain throughout available range.', valence: 'pos' },
          { name: 'Active abduction', result: 'Right 80°. Left 180°. Significant restriction.', valence: 'pos' },
          { name: 'Active external rotation (arm at side)', result: 'Right 10°. Left 65°. ER most restricted — loss of 55°.', valence: 'pos' },
          { name: 'Active internal rotation (behind back)', result: 'Right: thumb reaches to ipsilateral sacrum only. Left: T9. Severely restricted.', valence: 'pos' },
        ]},
        { name: 'Range of Motion — Passive', items: [
          { name: 'Passive external rotation (arm at side)', result: 'Right 12°. Hard end-feel at limitation. Identical to active — no passive gain.', valence: 'pos' },
          { name: 'Passive flexion', result: 'Right 92°. No meaningful gain over active. Firm capsular end-feel throughout.', valence: 'pos' },
          { name: 'Passive cross-body adduction', result: 'Markedly restricted and painful. No meaningful arc.', valence: 'pos' },
        ]},
        { name: 'Rotator Cuff Assessment', items: [
          { name: 'Infraspinatus strength test (resisted ER)', result: 'Cannot adequately test due to severe ER restriction. Within available range — 4/5 strength, no lag.', valence: 'neutral' },
          { name: 'External rotation lag test', result: 'Cannot adequately assess due to severe ER restriction — ER only to 12°.', valence: 'neutral' },
          { name: 'Drop arm test', result: 'Negative — able to maintain arm position within available range.', valence: 'neg' },
          { name: 'Supraspinatus (empty can)', result: 'Pain with test but 5/5 strength. No weakness.', valence: 'neutral' },
        ]},
        { name: 'Provocative Tests', items: [
          { name: 'Hawkins-Kennedy test', result: 'Cannot adequately perform — insufficient IR available for the test position.', valence: 'neutral' },
          { name: 'Neer impingement sign', result: 'Reproduces pain at 85° flexion, but this represents near end-range for this patient.', valence: 'neutral' },
          { name: 'AC joint palpation', result: 'Mild diffuse tenderness over anterior shoulder capsule. No focal AC joint tenderness.', valence: 'neutral' },
        ]},
        { name: 'Palpation & Neurovascular', items: [
          { name: 'Bicipital groove palpation (10° IR)', result: 'Diffuse anterior capsular tenderness. Cannot position arm to adequately palpate groove.', valence: 'neutral' },
          { name: 'Sensation (upper limb dermatomes)', result: 'Intact and equal bilaterally.', valence: 'neg' },
          { name: 'Cervical screen (Spurling, ULTTs)', result: 'No cervical referral pattern. ULTTs negative bilaterally. Cervical ROM full and pain-free.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Adhesive Capsulitis (Frozen Shoulder)',
      correctDxAliases: ['adhesive capsulitis', 'frozen shoulder', 'frozen shoulder syndrome', 'capsulitis', 'periarthritis shoulder'],
      keyDifferentials: ['Rotator Cuff Tendinopathy (Shoulder Tendon Pain)', 'Rotator Cuff Tear (Partial Tear)', 'Glenohumeral Osteoarthritis'],
      keyFindings: [
        { icon: '✓', text: '<strong>Global passive ROM restriction with firm capsular end-feel</strong> — the hallmark of adhesive capsulitis is loss of passive ROM in all planes; no passive gain over active is pathognomonic. ER is classically the most restricted.' },
        { icon: '✓', text: '<strong>Type 2 diabetes (insulin-dependent, suboptimal control)</strong> — the single strongest identifiable risk factor for frozen shoulder. Should dramatically raise clinical suspicion at the outset.' },
        { icon: '⚠', text: '<strong>Positive impingement tests at restricted end-range</strong> — these are false-positive impingement signs; the shoulder is being forced against the restricted capsule, not compressing the subacromial space. The prior "RC physio" treatment was treating the wrong diagnosis.' },
        { icon: '⚠', text: '<strong>Intact RC strength (where testable)</strong> — no lag signs, no weakness within available range. This is inconsistent with a significant RC tear as the primary pathology.' },
        { icon: '✓', text: '<strong>Insidious onset, progressive course, 9 months duration</strong> — the clinical timeline is consistent with the freezing phase transitioning to the frozen phase of adhesive capsulitis.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (adhesive capsulitis)', key: 'finalDx', weight: 3 },
        { criterion: 'Adhesive capsulitis / frozen shoulder in initial or updated differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Identifies diabetes as a major risk factor and poor prognostic indicator', key: 'reasoning', weight: 2 },
        { criterion: 'Management includes appropriate referral consideration (hydrodilation, manipulation)', key: 'management', weight: 2 },
        { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 },
      ],
      additionalTests: [
        { name: 'Passive glenohumeral distraction', result: 'Minimal pain relief with inferior GH distraction in supine. Confirms capsular pattern — not subacromial impingement where distraction typically reduces subacromial pain.', valence: 'neutral' },
        { name: 'Global passive ROM — all planes (overpressure)', result: 'Marked end-range firmness (capsular end-feel) in all planes. Greatest restriction: ER 12° (loss 53°), abduction 82°, IR severely restricted. Pathognomonic capsular pattern confirmed.', valence: 'pos' },
        { name: 'Cervical screen (Spurling\'s, rotation)', result: 'Negative — no arm pain with cervical compression or end-range rotation. Cervical radiculopathy mimicking shoulder pain excluded.', valence: 'neg' },
        { name: 'Speed\'s test (LHB tendon)', result: 'Unable to adequately test due to severe shoulder restriction. Cannot position arm for reliable assessment.', valence: 'neutral' },
        { name: 'Supraspinatus (empty can) strength test', result: 'Mild pain but 5/5 strength with no lag. Positive impingement signs are false-positive in the context of global ROM restriction — no genuine supraspinatus pathology.', valence: 'neutral', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is adhesive capsulitis (frozen shoulder). The critical clinical finding is global passive ROM restriction with a firm capsular end-feel and no meaningful passive gain over active — this pattern cannot be explained by subacromial impingement or a rotator cuff tear, where passive ROM is typically preserved. The positive impingement signs are false-positive: the Neer and Hawkins cannot be meaningfully interpreted when the shoulder is severely restricted. The most important clinical context: insulin-dependent type 2 diabetes with suboptimal glycaemic control (HbA1c 74) is the single strongest identifiable risk factor for adhesive capsulitis and predicts a more severe, prolonged course. The 3 months of RC-focused physiotherapy was treating the wrong diagnosis. Management: education on the natural history (12–36 months), appropriate glycaemic control counselling (liaise with endocrinologist), hydrodilatation as an evidence-based intervention to accelerate the frozen phase, and a PT program focused on maintaining and gradually restoring capsular range rather than RC loading.`,
    },

    {
      id: 'a3',
      title: 'Knee pain in an active adolescent',
      region: 'Knee',
      info: { age: '15', sex: 'Male', occupation: 'School student / competitive basketball player', onset: '5 months', duration: 'Subacute–chronic' },
      vignette: `<p>A 15-year-old male competitive basketball player is brought in by his parents with <strong>anterior knee pain</strong> of 5 months duration, progressively worsening over the playing season. He plays at state representative level and trains 5 days per week plus games on weekends.</p>
        <p>He describes pain at the front of the knee, specifically at the tibial tuberosity — he can point to it with one finger. The pain is rated 3/10 at rest, 7/10 after training, and up to 9/10 after game days. It is worse with jumping, landing, descending stairs, and getting up from prolonged sitting. There is a visible lump at the tibial tuberosity that has been present for approximately 3 months and is tender to direct pressure.</p>
        <p>His parents are concerned because his coach has told him to "train through it" and he has been given a patellar tendon strap. They want to know if he needs imaging, whether he should stop playing, and whether the lump is serious. He went through a significant growth spurt approximately 8 months ago — he grew 12 cm in 12 months.</p>
        <p>He denies locking, swelling, instability, or giving way. He has no constitutional symptoms, no night pain, and no pain in other joints. His left knee has mild anterior pain with no lump.</p>`,
      redFlags: ['Night pain not related to activity in a skeletally immature patient — screen for tumour', 'Rapidly enlarging bony mass', 'Constitutional symptoms (fever, weight loss, fatigue)', 'Pain in multiple joints'],
      examCategories: [
        { name: 'Inspection', items: [
          { name: 'Tibial tuberosity appearance', result: 'Prominent bilateral tibial tuberosities — right significantly more enlarged and tender than left. Visible bony prominence with erythema over right.', valence: 'pos' },
          { name: 'Patellar position and tracking', result: 'Patella alta bilaterally (high-riding). No lateral patellar tilt observed.', valence: 'neutral' },
          { name: 'Effusion assessment', result: 'No effusion bilaterally. Knee joint cool.', valence: 'neg' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Tibial tuberosity direct palpation', result: 'Exquisite tenderness at the right tibial tuberosity prominence — 9/10 pain. Left tuberosity mildly tender 3/10.', valence: 'pos' },
          { name: 'Patellar tendon body palpation', result: 'Mild tenderness along the inferior patellar tendon. Less severe than at tuberosity. No focal gap.', valence: 'neutral' },
          { name: 'Joint line palpation (medial/lateral)', result: 'No joint line tenderness bilaterally.', valence: 'neg' },
          { name: 'Patella facet palpation', result: 'Mild medial facet tenderness on right only.', valence: 'neutral' },
        ]},
        { name: 'ROM and Strength', items: [
          { name: 'Knee flexion ROM', result: 'Right: 130° before pain limits further flexion. Left: full 145°. Pain onset at ~110° right.', valence: 'pos' },
          { name: 'Quadriceps flexibility (prone heel-to-buttock)', result: 'Right: 30 cm buttock-to-heel distance (markedly tight quads). Left: 18 cm. Significant right-sided tightness.', valence: 'pos' },
          { name: 'Quadriceps strength (single-leg extension)', result: 'Right 4/5 (pain-inhibited). Left 5/5.', valence: 'pos' },
          { name: 'Hip abductor / external rotator strength', result: 'Right hip abductors 4/5. Left 5/5. Hip ER bilaterally reduced.', valence: 'neutral' },
        ]},
        { name: 'Functional Tests', items: [
          { name: 'Single-leg squat (movement analysis)', result: 'Right: significant contralateral pelvic drop and ipsilateral knee valgus on descent. Pain at tibial tuberosity at 60° of flexion.', valence: 'pos' },
          { name: 'Hop test (single-leg)', result: 'Unable to perform on right due to pain. Not attempted.', valence: 'pos' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Clarke\'s sign / patellar grind', result: 'Mildly positive — mild retropatellar discomfort with compression but not reproducing the tibial tuberosity pain.', valence: 'neutral' },
          { name: 'Patellar apprehension', result: 'Negative.', valence: 'neg' },
          { name: 'Lachman test', result: 'Negative — ACL intact, no laxity.', valence: 'neg' },
          { name: 'Ely test (rectus femoris length)', result: 'Positive right — hip flexion off the table with heel-to-buttock suggesting tight rectus femoris.', valence: 'pos' },
        ]},
      ],
      correctDx: 'Osgood-Schlatter Disease',
      correctDxAliases: ['osgood schlatter', 'osgood-schlatter', 'osgood schlatter disease', 'tibial tuberosity apophysitis', 'apophysitis', 'tibial apophysitis'],
      keyDifferentials: ['Patellar tendinopathy', 'Sinding-Larsen-Johansson syndrome (inferior pole)', 'Patellofemoral pain syndrome', 'Tibial tuberosity stress fracture (if acute)'],
      keyFindings: [
        { icon: '✓', text: '<strong>Tibial tuberosity tenderness + visible enlargement in a skeletally immature adolescent post-growth spurt</strong> — the classic presentation of Osgood-Schlatter disease; rapid bone growth increases traction forces through the patellar tendon onto the open tibial apophysis.' },
        { icon: '✓', text: '<strong>Quadriceps tightness (marked — 30 cm buttock-heel distance)</strong> — tight quads amplify traction on the tibial tuberosity apophysis; addressing this is a cornerstone of management.' },
        { icon: '✓', text: '<strong>Patella alta bilaterally</strong> — associated with increased patellar tendon tension and predisposes to tibial tuberosity overload.' },
        { icon: '⚠', text: '<strong>Red flag screen needed: bony lump in adolescent</strong> — while this presentation is highly consistent with OSD, a rapidly enlarging bony mass in a skeletally immature patient with any night pain or constitutional symptoms requires imaging to exclude osteosarcoma (distal femur / proximal tibia is the most common site).' },
        { icon: '✗', text: '<strong>No effusion, no joint line tenderness, negative Lachman</strong> — intra-articular pathology (ACL, meniscal) excluded; this is an extensor mechanism / apophyseal problem.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Osgood-Schlatter disease)', key: 'finalDx', weight: 3 },
        { criterion: 'OSD or tibial apophysitis in initial differential', key: 'ddx1-3', weight: 2 },
        { criterion: 'Identifies need to screen for serious pathology despite likely benign diagnosis', key: 'redFlags', weight: 2 },
        { criterion: 'Management includes load management, quad stretching, return-to-sport criteria', key: 'management', weight: 2 },
        { criterion: 'Reasoning addresses growth spurt, traction apophysitis mechanism, and parent/coach counselling', key: 'reasoning', weight: 1 },
      ],
      additionalTests: [
        { name: 'Patellar tendon palpation (mid-tendon)', result: 'No mid-tendon tenderness. Pain is exclusively at tibial tuberosity insertion — confirms traction apophysitis, not patellar tendinopathy.', valence: 'neg' },
        { name: 'McMurray test', result: 'Negative — no pain or click with valgus/varus and rotation. Meniscal pathology excluded.', valence: 'neg' },
        { name: 'Quadriceps flexibility (prone knee bend)', result: 'Significantly restricted bilaterally — right heel to buttock 18 cm deficit. Quadriceps tightness confirmed as primary driver of increased traction force at the apophysis.', valence: 'pos' },
        { name: 'Hip flexor flexibility (Thomas test)', result: 'Positive bilaterally — hip flexor tightness increasing anterior pelvic tilt, contributing to elevated quadriceps and patellar tendon tensile load.', valence: 'pos' },
        { name: 'McMurray test', result: 'Negative — no pain or click with valgus/varus stress and rotation. Meniscal pathology excluded. Pain is exclusively at the tibial tuberosity.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Osgood-Schlatter Disease — traction apophysitis at the tibial tuberosity in a skeletally immature adolescent. The mechanism is clear: rapid growth (12 cm in 12 months) has outpaced soft tissue adaptation, creating relative quadriceps tightness that amplifies traction forces through the patellar tendon onto the still-open tibial apophysis during the high loading demands of competitive basketball. The visible bony lump is heterotopic ossification at the apophysis — a normal response, not a tumour. However: the red flag screen is critically important. A bony lump at the distal femur/proximal tibia in an adolescent with any concerning features (night pain, constitutional symptoms, rapidly enlarging mass) requires imaging to exclude osteosarcoma. This case has none of those features, but the screen must be documented. Management: load management (not complete rest — graded reduction), aggressive quadriceps and hip flexor stretching, hip strengthening to reduce patellar tendon load, activity modification. The coach's "train through it" advice is incorrect — symptoms this severe indicate the apophysis is being damaged, not just irritated. Parent and coach education is a clinical task here.`,
    },
    {
      id: 'a4',
      title: 'Clumsy hands and neck stiffness in an older male',
      region: 'Cervical',
      info: { age: '68', sex: 'Male', occupation: 'Retired mechanic', onset: '6 months', duration: 'Chronic' },
      vignette: `<p>A 68-year-old retired mechanic presents with vague <strong>neck stiffness and bilateral hand "clumsiness"</strong> over the past 6 months. He states his hands feel stiff and cold, and he has started dropping his coffee mug and having trouble doing up the buttons on his shirts.</p><p>He reports a constant, dull ache in his lower neck and across both shoulders. He denies any sharp, shooting pain down his arms.</p><p>When asked about his walking, he mentions he has felt a bit "off-balance" recently and had a minor stumble in his garden last week. He has no history of stroke, diabetes, or heart disease. His bladder function is normal.</p>`,
      redFlags: ['Gait ataxia / balance loss', 'Bilateral upper limb neurological symptoms', 'Progressive neurological deficit', 'Hyperreflexia / upper motor neuron signs'],
      examCategories: [
        { name: 'Observation & Gait', items: [
          { name: 'Gait analysis', result: 'Noticeably broad-based and slightly unsteady gait. Tandem walking is impaired.', valence: 'pos' },
          { name: 'Hand observation', result: 'Mild wasting of the intrinsic muscles of both hands. No resting tremor.', valence: 'pos' },
        ]},
        { name: 'Cervical ROM', items: [
          { name: 'Active ROM', result: 'Extension limited to 20°. Flexion is full but patient reports a mild "electric" sensation down his back when looking all the way down (Lhermitte\'s sign).', valence: 'pos' },
        ]},
        { name: 'Neurological — Upper Extremity', items: [
          { name: 'Myotomal strength', result: 'Grip strength reduced bilaterally. Finger abduction 4/5 bilaterally.', valence: 'pos' },
          { name: 'Reflexes (Biceps, Brachioradialis, Triceps)', result: 'Biceps and Brachioradialis 3+ (brisk) bilaterally. Triceps 3+.', valence: 'pos' },
          { name: 'Hoffmann\'s Sign', result: 'Positive bilaterally — flicking the middle fingernail produces reflex flexion of the thumb and index finger.', valence: 'pos' },
        ]},
        { name: 'Neurological — Lower Extremity', items: [
          { name: 'Reflexes (Patellar, Achilles)', result: 'Patellar 3+ (hyperreflexic) bilaterally. Achilles 3+ with 2 beats of clonus on the right.', valence: 'pos' },
          { name: 'Babinski response', result: 'Positive (upgoing great toe) on the right. Equivocal on the left.', valence: 'pos' },
        ]},
        { name: 'Special Tests', items: [
          { name: 'Spurling Test', result: 'Negative — no unilateral shooting pain produced.', valence: 'neg' },
          { name: 'Upper Limb Tension Test 1 (ULTT1)', result: 'Negative.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Cervical Spondylotic Myelopathy',
      correctDxAliases: ['cervical myelopathy', 'myelopathy', 'spinal cord compression'],
      keyDifferentials: ['Cervical radiculopathy (bilateral)', 'Peripheral neuropathy', 'Amyotrophic lateral sclerosis (ALS)', 'Carpal tunnel syndrome (bilateral)'],
      keyFindings: [
        { icon: '⚠️', text: '<strong>Upper Motor Neuron Signs</strong> — Hyperreflexia (3+), positive Hoffmann\'s, and positive Babinski are definitive signs of central nervous system compression.' },
        { icon: '⚠️', text: '<strong>Gait ataxia and broad-based stance</strong> — progressive balance issues combined with upper extremity symptoms is a classic myelopathic triad.' },
        { icon: '✓', text: '<strong>Lhermitte\'s sign</strong> — electric shocks down the spine with cervical flexion indicates dorsal column irritation in the cervical cord.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Cervical Myelopathy)', key: 'finalDx', weight: 3 },
        { criterion: 'Identified Upper Motor Neuron (UMN) signs', key: 'reasoning', weight: 2 },
        { criterion: 'Management involves immediate medical/surgical referral', key: 'management', weight: 2 },
        { criterion: 'Red flags correctly identified', key: 'redFlags', weight: 2 },
      ],
      additionalTests: [
        { name: 'Upper limb tension test 1 (ULTT1)', result: 'Bilaterally limited — symptom reproduction in both arms with wrist extension and shoulder depression. Suggests widespread neural sensitisation consistent with multilevel cord compromise.', valence: 'pos' },
        { name: 'Romberg test', result: 'Positive — significant balance loss with eyes closed. Confirms proprioceptive/posterior column dysfunction consistent with myelopathy.', valence: 'pos' },
        { name: 'Spurling\'s test', result: 'Positive bilaterally — cervical compression reproduces arm symptoms. Foraminal involvement at multiple levels consistent with spondylotic change.', valence: 'pos' },
        { name: 'Grip-release test (10 seconds)', result: 'Positive — fewer than 20 grip-release cycles in 10 seconds. Hand dexterity deficit confirms upper motor neuron / cord dysfunction.', valence: 'pos' },
        { name: 'Adson test (thoracic outlet)', result: 'Negative — no radial pulse change or arm symptoms. Thoracic outlet syndrome does not explain the bilateral UMN signs, which point to cord compression.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Cervical Spondylotic Myelopathy. This is a critical "do not miss" red flag presentation. The patient's chief complaints of bilateral hand clumsiness and balance issues could easily be mistaken for normal aging. However, the physical exam reveals a cluster of Upper Motor Neuron (UMN) signs: hyperreflexia in both upper and lower extremities, positive Hoffmann's sign, positive Babinski, and clonus. Lhermitte's sign confirms spinal cord irritation. This patient requires urgent referral to a spinal orthopaedic surgeon or neurologist for an MRI and potential surgical decompression.`,
    },
    {
      id: 'a5',
      title: 'Groin pain in a marathon runner',
      region: 'Hip',
      info: { age: '26', sex: 'Female', occupation: 'Accountant / marathon runner', onset: '3 weeks', duration: 'Acute' },
      vignette: `<p>A 26-year-old female marathon runner presents with a 3-week history of <strong>worsening deep groin and anterior thigh pain</strong>. She is 5 weeks out from a major marathon and recently peaked her mileage at 80 km/week.</p>
        <p>She states the pain initially only bothered her at the end of long runs, but now it hurts with every step she takes, even walking around the office. The pain is a deep, unremitting ache. Most concerningly, the pain wakes her up at night, and she cannot find a comfortable position in bed.</p>
        <p>She has tried resting for 3 days and taking ibuprofen, which did not help. She assumed she had "pulled her hip flexor" and has been aggressively stretching it, which she says makes it feel slightly worse. She has no history of trauma, but mentions her periods have been irregular for the past year due to her high training volume.</p>`,
      redFlags: ['Night pain unrelated to position', 'Pain with all weight-bearing', 'Female athlete triad risk factors (amenorrhea, high volume)'],
      examCategories: [
        { name: 'Observation & Gait', items: [
          { name: 'Gait analysis', result: 'Marked antalgic gait. Patient is visibly avoiding loading the right leg. Shortened stance phase on the right.', valence: 'pos' },
          { name: 'Single-leg stance', result: 'Unable to stand on the right leg for more than 2 seconds due to deep groin pain.', valence: 'pos' },
        ]},
        { name: 'Range of Motion', items: [
          { name: 'Hip Active ROM', result: 'Flexion limited to 90° by deep pain. Internal rotation limited and highly provocative.', valence: 'pos' },
          { name: 'Hip Passive ROM', result: 'Empty, muscle-guarding end-feel with passive internal rotation and extension.', valence: 'pos' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Anterior hip / psoas', result: 'No superficial tenderness over the rectus femoris or psoas muscle bellies.', valence: 'neg' },
          { name: 'Greater trochanter', result: 'No tenderness.', valence: 'neg' },
        ]},
        { name: 'Special Tests — Intra-articular', items: [
          { name: 'FADIR Test', result: 'Strongly positive — severe groin pain with flexion, adduction, and internal rotation.', valence: 'pos' },
          { name: 'FABER Test', result: 'Positive — reproduces anterior groin pain.', valence: 'pos' },
        ]},
        { name: 'Special Tests — Bone Stress', items: [
          { name: 'Fulcrum Test', result: 'Strongly positive. Placing a forearm under the mid-thigh and applying downward pressure to the knee causes sharp, deep groin pain.', valence: 'pos' },
          { name: 'Hop Test', result: 'Test aborted. Patient refused to attempt hopping due to anticipated severe pain.', valence: 'pos' },
          { name: 'Resisted Hip Flexion', result: 'Painful, but weakness appears entirely due to pain inhibition, not a true contractile tissue tear.', valence: 'neutral' },
        ]},
      ],
      correctDx: 'Femoral Neck Stress Fracture',
      correctDxAliases: ['femoral neck stress fracture', 'stress fracture', 'bone stress injury', 'hip stress fracture'],
      keyDifferentials: ['Hip Flexor Strain', 'Hip Labral Tear', 'Osteitis Pubis'],
      keyFindings: [
        { icon: '⚠️', text: '<strong>Night pain & unremitting rest pain</strong> — musculoskeletal strains generally improve with rest. Deep, unremitting night pain in a runner is a massive red flag for bone stress.' },
        { icon: '⚠️', text: '<strong>Positive Fulcrum Test</strong> — applying a bending moment to the femur reproducing deep groin pain is highly sensitive for a femoral stress fracture.' },
        { icon: '✓', text: '<strong>Female Athlete Triad risk factors</strong> — high mileage running combined with irregular periods (amenorrhea) strongly predisposes to low bone mineral density and stress fractures.' },
        { icon: '✗', text: '<strong>No superficial muscle tenderness</strong> — rules against a simple hip flexor/psoas strain.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Femoral Neck Stress Fracture)', key: 'finalDx', weight: 3 },
        { criterion: 'Identified RED FLAG presentation (requires urgent medical referral)', key: 'reasoning', weight: 3 },
        { criterion: 'Management is STRICT non-weight-bearing / crutches and immediate medical referral', key: 'management', weight: 3 },
        { criterion: 'Identified RED-S / Female Athlete Triad risk factors', key: 'reasoning', weight: 1 },
      ],
      additionalTests: [
        { name: 'FADIR test', result: 'Positive — anterior groin pain reproduced. Note: FADIR is positive in both labral tears and femoral neck stress fractures; this finding alone cannot differentiate. Combined with positive fulcrum and inability to hop, bony pathology is the priority.', valence: 'pos' },
        { name: 'Log roll test', result: 'Positive — passive internal/external rotation in supine reproduces deep groin pain. Confirms intra-articular or femoral neck involvement.', valence: 'pos' },
        { name: 'FABER test', result: 'Positive — deep groin pain with hip in flexion, abduction and external rotation. Cannot differentiate labral tear from femoral neck stress fracture — imaging required.', valence: 'pos' },
        { name: 'Patellar tap test', result: 'Negative — no effusion. Knee joint not involved in this presentation.', valence: 'neg' },
        { name: 'Hip scour test', result: 'Positive — groin pain with circumduction under axial load. Important: this confirms intra-articular/bone involvement but cannot differentiate labral tear from femoral neck stress fracture. Imaging is mandatory.', valence: 'pos', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is a Femoral Neck Stress Fracture. This is a critical RED FLAG case. The patient presents with the classic triad for a bone stress injury: high-volume endurance training, unremitting deep pain that worsens with all weight-bearing, and night pain. The history of irregular periods suggests Relative Energy Deficiency in Sport (RED-S), lowering her bone density. The physical exam confirms bone involvement: the Fulcrum test is strongly positive, and she cannot tolerate single-leg loading (Hop test aborted). While the FADIR is positive, a labral tear does not typically cause severe night pain or total weight-bearing failure in 3 weeks without trauma. This patient must be placed on crutches immediately (STRICT non-weight-bearing) and referred for an urgent MRI. If a tension-side femoral neck fracture displaces, it is a surgical emergency with a high risk of avascular necrosis. Physiotherapy is contraindicated at this time.`,
    },
    {
      id: 'a6',
      title: 'Bilateral groin pain in a semi-professional footballer',
      region: 'Hip',
      info: { age: '24', sex: 'Male', occupation: 'Semi-professional footballer', onset: '6 weeks', duration: 'Subacute' },
      vignette: `<p>A 24-year-old semi-professional footballer presents with a <strong>6-week history of bilateral groin pain</strong>, worse on the left. The pain began insidiously during pre-season and has gradually worsened despite a self-imposed training reduction.</p>
        <p>He describes a deep, aching pain at the front of both groins and into the inner thighs, rated 5/10 at rest and 8/10 during kicking and change-of-direction drills. He specifically notes the pain is worst during the kicking action and when he tries to squeeze his knees together against resistance. He also reports a characteristic "start-up" pain — the first 10–15 minutes of any session are the worst, then the pain eases slightly, only to return severely in the cool-down.</p>
        <p>He has had two previous shorter episodes of groin soreness that resolved with rest over the past two seasons. He denies any testicular pain, urinary symptoms, or pain radiating into his thigh. Ibuprofen provides partial relief. His team physio has treated him with hip flexor stretches, which have not helped.</p>`,
      redFlags: ['Testicular pain or swelling', 'Systemic features (fever, weight loss)', 'Night pain unrelated to position'],
      examCategories: [
        { name: 'Observation & Gait', items: [
          { name: 'Gait analysis', result: 'Antalgic gait — mildly shortened stride length bilaterally. No Trendelenburg sign.', valence: 'pos' },
          { name: 'Single-leg stance', result: 'Able to complete bilaterally, but mild adductor discomfort reported on the left.', valence: 'neutral' },
        ]},
        { name: 'Palpation', items: [
          { name: 'Pubic symphysis palpation', result: 'Exquisite point tenderness directly over the pubic symphysis and bilateral superior pubic rami.', valence: 'pos' },
          { name: 'Adductor origin palpation', result: 'Tenderness at the left adductor longus origin at the pubis — 7/10. Right side 4/10.', valence: 'pos' },
          { name: 'Inguinal canal palpation', result: 'No tenderness over the inguinal canal. No palpable hernia.', valence: 'neg' },
        ]},
        { name: 'Provocative Tests', items: [
          { name: 'Squeeze test (0° hip flexion)', result: 'Strongly positive — bilateral groin pain, left > right, rated 8/10.', valence: 'pos' },
          { name: 'Squeeze test (45° hip flexion)', result: 'Positive — reproduces deep groin pain bilaterally.', valence: 'pos' },
          { name: 'Active straight leg raise (supine)', result: 'Positive left — groin pain and feeling of instability at the pubic symphysis.', valence: 'pos' },
        ]},
        { name: 'Hip Range of Motion', items: [
          { name: 'Hip internal rotation (bilateral)', result: '40° bilaterally — within normal limits.', valence: 'neg' },
          { name: 'Hip FADIR', result: 'Negative — no anterior groin pain. Rules out primary intra-articular hip pathology.', valence: 'neg' },
          { name: 'Hip abduction range', result: 'Mildly reduced bilaterally (35° vs normal 45°) with adductor tightness at end range.', valence: 'pos' },
        ]},
      ],
      correctDx: 'Osteitis Pubis (Pubic Symphysis Overload)',
      correctDxAliases: ['osteitis pubis', 'pubic symphysis overload', 'athletic pubalgia', 'groin overload', 'pubic symphysis dysfunction'],
      keyDifferentials: ['Hip Adductor Tendinopathy / Strain', 'Inguinal Hernia / Sports Hernia', 'Hip Flexor Strain', 'Femoroacetabular Impingement'],
      keyFindings: [
        { icon: '✓', text: '<strong>Bilateral presentation with pubic symphysis tenderness</strong> — bilateral groin pain with direct pubic tenderness is the hallmark of osteitis pubis, distinguishing it from unilateral adductor strains.' },
        { icon: '✓', text: '<strong>Positive squeeze test at 0° and 45°</strong> — the squeeze test is the most sensitive clinical test for groin overload pathology; bilateral positivity implicates the pubic symphysis specifically.' },
        { icon: '✓', text: '<strong>Start-up pain easing mid-session then worsening</strong> — this warm-up pattern is characteristic of tendinopathy and overload conditions at the pubic symphysis.' },
        { icon: '✗', text: '<strong>Negative FADIR and normal hip IR</strong> — effectively rules out FAI as the primary driver, redirecting diagnosis to the pubic symphysis complex.' },
      ],
      rubric: [
        { criterion: 'Correct primary diagnosis (Osteitis Pubis / Pubic Symphysis Overload)', key: 'finalDx', weight: 3 },
        { criterion: 'Correctly differentiates from adductor strain using bilateral presentation and pubic tenderness', key: 'reasoning', weight: 2 },
        { criterion: 'Management includes load management, adductor strengthening, and hip stability program', key: 'management', weight: 2 },
        { criterion: 'Considers inguinal hernia / sports hernia in differential', key: 'reasoning', weight: 1 },
      ],
      additionalTests: [
        { name: 'FADIR test', result: 'Negative bilaterally — no groin or anterior hip pain reproduced. Intra-articular hip pathology (labral tear, FAI) excluded.', valence: 'neg' },
        { name: 'Inguinal canal palpation', result: 'No tenderness over inguinal canal or external ring bilaterally. No pain on Valsalva manoeuvre. Sports hernia / athletic pubalgia excluded.', valence: 'neg' },
        { name: 'Single-leg squat (each side)', result: 'Pain reproduced on both sides when loading through single leg, but worse on right. Hip/pelvis stability deficit contributing to symphyseal shear.', valence: 'pos' },
        { name: 'Hip IR range of motion', result: 'Mildly restricted bilaterally — right 30°, left 35°. Hip mobility deficit increasing compensatory loading through the pubic symphysis.', valence: 'neutral' },
        { name: 'Hip flexor resisted test (Thomas position)', result: 'No pain with resisted hip flexion. Iliopsoas and hip flexor origin not the primary pain source — pain generator is at the pubic symphysis.', valence: 'neg', isDistractor: true },
      ],
      expertReasoningPrompt: `The correct diagnosis is Osteitis Pubis (Pubic Symphysis Overload). The bilateral presentation immediately shifts the diagnosis away from a unilateral adductor strain toward the pubic symphysis as the primary pain generator. The key discriminating features are: (1) exquisite tenderness directly over the pubic symphysis and bilateral superior pubic rami, (2) strongly positive squeeze test at both 0° and 45° reproducing his exact pain bilaterally, and (3) a normal FADIR ruling out intra-articular hip pathology as the driver. The 'start-up' pain pattern and worsening with kicking and adduction against resistance are characteristic of symphyseal overload. An inguinal or sports hernia must be excluded clinically (negative inguinal canal palpation, no Valsalva symptoms). Management centres on a structured load modification program, progressive adductor strengthening (isometric → isotonic → sport-specific), hip and lumbopelvic stability work, and a criterion-based return to kicking and change-of-direction drills. Pelvic X-ray and MRI may be warranted to exclude stress reaction if symptoms are severe or progress.`,
    },

    {
      id: 'a7',
      title: 'Thoracic pain with lower limb symptoms in a middle-aged man',
      region: 'Thoracic',
      info: { age: '58', sex: 'Male', occupation: 'Retired bus driver', onset: '6 months', duration: 'Chronic' },
      vignette: `<p>A 58-year-old retired bus driver presents with a <strong>6-month history of progressive mid-to-lower thoracic aching pain</strong>, initially attributed to his years of seated driving. Over the past 8 weeks, however, he has developed increasing bilateral leg heaviness and unsteadiness that his GP attributed to "old age." He describes the leg symptoms as a persistent heaviness and mild weakness that seems to come on when walking longer distances.</p>
        <p>He now uses a walking stick and has fallen twice in the past month. He has noticed that his balance is worse on uneven surfaces. He also reports recent onset of difficulty controlling his bladder urgency — he does not always make it to the toilet in time. His wife has noted that his walking pattern has changed over the past 3 months — he appears to walk with a "stiff" or "scissored" gait.</p>
        <p>He has a history of prostate cancer treated with radiotherapy 4 years ago (last PSA was "within normal limits" 14 months ago). He also has long-standing type 2 diabetes. His thoracic pain is constant and rated 5/10, and is not relieved by any position change. He has lost 4 kg in the past 2 months without intentional dietary change.</p>`,
      redFlags: ['Progressive bilateral neurological deficit (UMN signs)', 'Bladder urgency / incontinence (possible spinal cord involvement)', 'Unexplained weight loss', 'History of malignancy — metastatic disease must be excluded', 'Night pain not relieved by position change', 'Constant rest pain'],
      examCategories: [
        { name: 'Gait & Functional Observation', items: [
          { name: 'Gait observation', result: 'Spastic, scissored gait. Stiff knees with reduced hip flexion. Circumduction bilaterally. Cannot perform heel-toe walking.', valence: 'pos' },
          { name: 'Tandem walking (heel to toe)', result: 'Unable to perform — loses balance after one step.', valence: 'pos' },
          { name: 'Romberg test', result: 'Positive — significant sway with eyes closed requiring support.', valence: 'pos' },
        ]},
        { name: 'Lower Limb Neurological Assessment', items: [
          { name: 'Lower limb tone', result: 'Bilateral lower limb spasticity — increased resistance through range on passive hip flexion and knee extension bilaterally.', valence: 'pos' },
          { name: 'Patellar reflex', result: 'Hyperreflexia bilaterally (3+ on Jendrassik). Right > left.', valence: 'pos' },
          { name: 'Achilles reflex', result: 'Hyperreflexia bilaterally — 3+, with sustained clonus (4 beats) at right ankle.', valence: 'pos' },
          { name: 'Babinski sign', result: 'Positive bilaterally — upgoing plantar response.', valence: 'pos' },
          { name: 'Hoffmann\'s sign (upper limb)', result: 'Negative bilaterally — no upper limb UMN involvement.', valence: 'neg' },
          { name: 'Lower limb sensation (pinprick + vibration)', result: 'Bilaterally impaired vibration sense to the level of the knees. Reduced pinprick sensation below T8 level.', valence: 'pos' },
          { name: 'Proprioception (hallux)', result: 'Reduced bilaterally — 6/10 correct at hallux.', valence: 'pos' },
        ]},
        { name: 'Thoracic Assessment', items: [
          { name: 'Thoracic palpation / PA mobility', result: 'Thoracic bony point tenderness at T7/T8 — sharp and focal. Differs from usual muscular tenderness. Not relieved with PA pressure.', valence: 'pos' },
          { name: 'Thoracic ROM', result: 'Moderately restricted in all directions — primarily pain-limited. No radicular reproduction into arms or legs with movement testing.', valence: 'neutral' },
        ]},
        { name: 'Upper Limb Screen', items: [
          { name: 'Upper limb strength and sensation', result: 'Grossly intact bilaterally. No upper limb weakness or sensory change.', valence: 'neg' },
          { name: 'Upper limb reflexes', result: 'Normal bilaterally. Negative Hoffmann\'s.', valence: 'neg' },
        ]},
      ],
      correctDx: 'Thoracic Myelopathy — Suspected Metastatic Spinal Cord Compression (MSCC) — Emergency Referral Required',
      correctDxAliases: ['thoracic myelopathy', 'spinal cord compression', 'metastatic spinal cord compression', 'mscc', 'cord compression', 'thoracic cord compression'],
      keyDifferentials: ['Thoracic disc herniation with myelopathy', 'Primary spinal tumour', 'Transverse myelitis', 'Diabetic myelopathy'],
      keyFindings: [
        { icon: '⚠', text: '<strong>UMN signs below T8 (hyperreflexia, clonus, Babinski, spasticity)</strong> — bilateral UMN signs localise a lesion to the thoracic spinal cord above the level of sensory loss. This is a neurological emergency.' },
        { icon: '⚠', text: '<strong>Bladder urgency / incontinence</strong> — sphincter dysfunction indicates cord-level involvement. In the context of cancer history, this is a red flag until proven otherwise.' },
        { icon: '⚠', text: '<strong>Unexplained 4 kg weight loss + history of prostate cancer</strong> — even with a recent "normal" PSA, vertebral metastasis must be excluded. PSA testing was 14 months ago and bone metastases can occur with normal PSA.' },
        { icon: '⚠', text: '<strong>Focal bony thoracic tenderness at T7/T8 + constant rest pain</strong> — bony point tenderness that does not respond to PA pressure is more consistent with vertebral body involvement (e.g. metastatic lesion, compression fracture) than joint or muscular pathology.' },
        { icon: '✗', text: '<strong>Negative Hoffmann\'s and normal upper limb screen</strong> — lesion is below the cervical cord; the upper thoracic cord is spared. This helps localise rather than reassure.' },
      ],
      rubric: [
        { criterion: 'Identifies thoracic myelopathy / cord compression as primary concern', key: 'finalDx', weight: 3 },
        { criterion: 'Cancer history + unexplained weight loss flagged as critical red flags', key: 'redFlags', weight: 3 },
        { criterion: 'Appropriate action: emergency referral / same-day medical escalation', key: 'management', weight: 3 },
        { criterion: 'Reasoning identifies UMN signs as localising and differentiates from peripheral causes', key: 'reasoning', weight: 2 },
      ],
      additionalTests: [
        { name: 'Thoracic percussion test (spinous process)', result: 'Positive — exquisite focal bony tenderness at T7/T8 spinous process on direct percussion. Highly consistent with vertebral metastasis or pathological fracture at this level.', valence: 'pos' },
        { name: 'Bilateral lower limb sensation (pin-prick)', result: 'Reduced bilaterally below T8 dermatome. Clear sensory level at T8 confirming cord compression at that level.', valence: 'pos' },
        { name: 'Bladder function screen', result: 'Positive history — patient reports urinary urgency and two episodes of incontinence in the past week. Sphincter dysfunction confirms UMN cord involvement. Emergency referral mandatory.', valence: 'pos' },
        { name: 'Slump test', result: 'Positive — bilateral leg symptoms reproduced with neural tension. Combined with UMN signs, confirms cord-level pathology rather than peripheral nerve root.', valence: 'pos' },
        { name: 'Thoracic PA mobilisation test (T7/T8)', result: 'Focal tenderness at T7/T8 with PA pressure — but this is consistent with vertebral metastasis, not mechanical dysfunction. Manual therapy is CONTRAINDICATED here. Do not mobilise.', valence: 'pos', isDistractor: true },
      ],
      expertReasoningPrompt: `This is a critical emergency case — the correct diagnosis is Thoracic Myelopathy with suspected Metastatic Spinal Cord Compression (MSCC) at approximately T7/T8. This patient must NOT be managed conservatively. The constellation of findings is unambiguous: progressive bilateral UMN signs (hyperreflexia, clonus, bilateral Babinski, spastic gait), a sensory level at approximately T8 bilaterally, sphincter dysfunction (bladder urgency), constant rest pain with focal bony tenderness, unexplained 4 kg weight loss, and a background of prostate cancer (bone is the most common metastatic site). "Within normal limits" PSA 14 months ago does not exclude vertebral metastasis — PSA is unreliable for bone-only disease. This patient requires an immediate phone referral to emergency services (or a same-day emergency department presentation) for urgent whole-spine MRI to confirm and characterise cord compression. Important distinction: physiotherapy neurological assessment is not only appropriate here — it is central to identifying MSCC and communicating urgency to the medical team. However, physiotherapy intervention (manual therapy, exercise, loading) is contraindicated until the patient has been medically cleared and staged. The window for intervention to preserve neurological function is narrow — delayed diagnosis of MSCC results in permanent paraplegia.`,
    },

  ],

};
/* =========================================================
   AUTO-GENERATE 72 CASES (3 per region per level)
   Paste after CASE_LIBRARY ends and before meta-count sync.
   ========================================================= */

function generateCaseLibraryPack3() {
  const REGIONS = ['Cervical', 'Thoracic', 'Lumbar', 'Shoulder', 'Elbow', 'Hip', 'Knee', 'Ankle'];
  const LEVELS = ['beginner', 'intermediate', 'advanced'];

  const SEEDS = [
    { code: '01', focus: 'gradual onset related to daily activity and load tolerance' },
    { code: '02', focus: 'repetitive overuse with clear task-specific provocation' },
    { code: '03', focus: 'red-flag screening pattern appropriate to level complexity' }
  ];

  function baseRubric(primaryDxLabel) {
    return [
      { criterion: `Correct primary diagnosis (${primaryDxLabel})`, key: 'finalDx', weight: 3 },
      { criterion: 'Reasoning cites discriminating findings', key: 'reasoning', weight: 2 },
      { criterion: 'Initial differential includes plausible alternatives', key: 'ddx1-3', weight: 1 },
      { criterion: 'Management is appropriate to irritability and red flags', key: 'management', weight: 2 },
      { criterion: 'Red flag screening completed', key: 'redFlags', weight: 1 }
    ];
  }

  const DX_BANK = {
    Cervical: {
      beginner: { name: 'Mechanical Neck Pain', aliases: ['mechanical neck pain', 'neck strain', 'cervical strain', 'postural neck pain'] },
      intermediate: { name: 'Cervical Radicular Pain (suspected)', aliases: ['cervical radiculopathy', 'radicular pain', 'pinched nerve', 'nerve root irritation'] },
      advanced: { name: 'Cervical Myelopathy Suspected (urgent referral)', aliases: ['cervical myelopathy', 'myelopathy', 'cord compression', 'cervical stenosis with myelopathy'] }
    },
    Thoracic: {
      beginner: { name: 'Thoracic Muscle Strain', aliases: ['thoracic strain', 'intercostal strain', 'rib irritation', 'costovertebral irritation', 'thoracic muscle sprain', 'intercostal muscle sprain'] },
      intermediate: { name: 'Thoracic Mobility Deficit', aliases: ['thoracic mobility deficit', 'thoracic hypomobility', 'thoracic joint dysfunction'] },
      advanced: { name: 'Serious Pathology Screen Positive (medical workup needed)', aliases: ['serious pathology', 'red flag', 'medical workup', 'malignancy', 'infection'] }
    },
    Lumbar: {
      beginner: { name: 'Acute Lumbar Strain', aliases: ['lumbar strain', 'low back strain', 'back strain', 'lumbar sprain'] },
      intermediate: { name: 'Lumbar Radiculopathy', aliases: ['lumbar radiculopathy', 'nerve root irritation', 'sciatica', 'radicular pain'] },
      advanced: { name: 'Cauda Equina Syndrome Suspected (emergency referral)', aliases: ['cauda equina', 'saddle anesthesia', 'urinary retention', 'bowel bladder changes'] }
    },
    Shoulder: {
      beginner: { name: 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)', aliases: ['rotator cuff tendinopathy', 'shoulder tendon pain', 'rotator cuff related', 'subacromial pain', 'impingement', 'rc tendinopathy'] },
      intermediate: { name: 'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)', aliases: ['rotator cuff tendinopathy', 'shoulder tendon pain', 'rotator cuff related', 'subacromial pain', 'impingement', 'rc tendinopathy'] },
      advanced: { name: 'Full Thickness Rotator Cuff Tear Suspected (urgent imaging)', aliases: ['full thickness rotator cuff tear', 'massive rotator cuff tear', 'acute traumatic rotator cuff tear', 'cuff tear'] }
    },
    Elbow: {
      beginner: { name: 'Lateral Epicondylalgia', aliases: ['lateral epicondylalgia', 'tennis elbow', 'lateral epicondylitis', 'common extensor tendinopathy'] },
      intermediate: { name: 'Cubital Tunnel Syndrome', aliases: ['cubital tunnel', 'ulnar neuropathy', 'ulnar nerve', 'cubital tunnel syndrome'] },
      advanced: { name: 'Distal Biceps Rupture Suspected (urgent referral)', aliases: ['distal biceps rupture', 'biceps rupture', 'distal biceps'] }
    },
    Hip: {
      beginner: { name: 'Hip Flexor Strain', aliases: ['hip flexor strain', 'iliopsoas strain', 'hip flexor overload', 'psoas strain', 'iliopsoas'] },
      intermediate: { name: 'Greater Trochanteric Pain Syndrome', aliases: ['gtps', 'greater trochanteric', 'gluteal tendinopathy', 'trochanteric bursitis'] },
      advanced: { name: 'Femoral Neck Stress Fracture', aliases: ['stress fracture', 'femoral neck stress fracture', 'bone stress injury'] }
    },
    Knee: {
      beginner: { name: 'Patellofemoral Pain Syndrome', aliases: ['patellofemoral', 'pfps', 'anterior knee pain', 'runner\'s knee'] },
      intermediate: { name: 'Meniscus Injury Suspected', aliases: ['meniscus', 'meniscal tear', 'medial meniscus', 'lateral meniscus'] },
      advanced: { name: 'ACL Injury Suspected', aliases: ['acl', 'acl tear', 'anterior cruciate ligament'] }
    },
    Ankle: {
      beginner: { name: 'Lateral Ankle Sprain (ATFL)', aliases: ['ankle sprain', 'lateral ankle sprain', 'atfl sprain', 'inversion sprain'] },
      intermediate: { name: 'Syndesmosis Sprain (High Ankle Sprain)', aliases: ['syndesmosis', 'high ankle sprain', 'aitfl'] },
      advanced: { name: 'Achilles Tendon Rupture Suspected (urgent referral)', aliases: ['achilles rupture', 'achilles tendon rupture', 'tendon rupture'] }
    }
  };

  function redFlagList(level, region) {
    const common = ['Fever / chills', 'Unexplained weight loss', 'History of cancer'];
    if (region === 'Lumbar') return ['Bowel/bladder changes', 'Saddle anesthesia', 'Progressive leg weakness'].concat(level === 'advanced' ? common : []);
    if (region === 'Cervical') return ['Progressive weakness', 'Gait changes', 'Upper motor neuron signs'].concat(level === 'advanced' ? common : []);
    if (region === 'Thoracic') return ['Night pain not relieved by position', 'Chest pain', 'Shortness of breath at rest'].concat(level === 'advanced' ? common : []);
    if (region === 'Shoulder') return ['Acute loss of function', 'Visible deformity', 'Severe trauma'].concat(level === 'advanced' ? common : []);
    if (region === 'Elbow') return ['Sudden loss of strength', 'Large bruising', 'Constant numbness'].concat(level === 'advanced' ? common : []);
    if (region === 'Hip') return ['Night pain', 'Inability to bear weight', 'Progressive weight-bearing pain'].concat(level === 'advanced' ? common : []);
    if (region === 'Knee') return ['Large acute swelling', 'True locking', 'Hot swollen joint'].concat(level === 'advanced' ? common : []);
    if (region === 'Ankle') return ['Inability to bear weight for 4 steps', 'Bone tenderness at malleoli', 'Severe deformity'].concat(level === 'advanced' ? common : []);
    return common;
  }

  function makeVignette(level, region, seedIndex) {
    const V = {
      Knee: {
        beginner: [
          `<p>A 22-year-old female university student and recreational runner presents with <strong>bilateral anterior knee pain</strong>, worse on the right, of 5 weeks duration. She increased her weekly running mileage from 20 to 40 km over 3 weeks in preparation for a fun run after returning from semester break.</p><p>Pain is a diffuse ache behind and around the kneecap (5/10), provoked by running (onset after 15 minutes), descending stairs, prolonged sitting ("theatre sign"), and squatting at the gym. Absent in the morning. No locking, giving way, swelling, or traumatic mechanism.</p><p>Mild bilateral pes planus noted. No prior knee injuries. Sedentary desk job part-time. Ibuprofen taken with partial relief.</p>`,
          `<p>A 28-year-old male cyclist presents with <strong>left anterior knee pain</strong> of 4 weeks duration, onset during a cycling tour. He recently increased saddle height and added climbing intervals to his training block (12 hours/week). Pain came on insidiously over the final 2 days of the tour.</p><p>The pain is located diffusely around the kneecap, rated 4/10. Provoked by cycling (especially climbing), descending stairs, and prolonged sitting at his IT job. Eases with rest and stretching. No swelling, no locking, no instability. The knee feels stiff after sitting for more than 30 minutes.</p><p>No prior knee history. No lower limb injury. On no medications. Keen to return to training within 2 weeks for an upcoming sportive.</p>`,
          `<p>A 34-year-old female secondary school PE teacher presents with <strong>right anterior knee pain</strong> of 7 weeks duration. The pain began insidiously at the start of the school term when she resumed running fitness sessions and regular squatting demonstrations for students.</p><p>Pain is diffuse, around the kneecap (5/10), worsened by squatting, kneeling on hard floors, stair descending, and running. She notes the pain is worse after a full day of teaching. Theatre sign positive — uncomfortable in long staff meetings. No trauma, no giving way, no joint swelling.</p><p>Mildly increased Q-angle noted on observation. No prior knee history. BMI 22. On no regular medications.</p>`,
        ],
        intermediate: [
          `<p>A 38-year-old male presents with <strong>medial knee pain and intermittent swelling</strong> of 3 months duration. Onset during a social football match — a pivoting injury on a planted foot caused immediate medial pain and swelling that resolved over 2 weeks, but the knee has been unreliable since.</p><p>He reports catching, a sense of the knee "not being right" with direction changes, and sharp medial pain past 90° of squat. Stiffness after sitting more than 30 minutes. Occasional mild effusion after prolonged activity. No true locking.</p><p>Occupation: warehouse supervisor requiring heavy lifting and squatting. Previously active — football weekly for 10 years. No analgesics. No prior knee surgery. Requests assessment and imaging recommendation.</p>`,
          `<p>A 45-year-old female presents with <strong>lateral knee pain</strong> of 6 weeks duration following a hiking trip in which she descended 1200 m over rough terrain over 2 days. Pain was mild initially but has persisted and limits her usual walking routine.</p><p>Pain is lateral, sharp with stair descent and step-down tasks (6/10), and a dull ache after prolonged walking. She reports the knee occasionally "clunks" on flexion but no true locking or giving way. Mild lateral joint line tenderness. No effusion. No medial symptoms.</p><p>No prior knee injury. BMI 27. Works as a radiologist (prolonged sitting). GP referred after X-ray showed no fracture. On no regular medications. Asking about return to hiking.</p>`,
          `<p>A 52-year-old male tradesperson presents with a <strong>3-month history of medial knee pain and stiffness</strong> with no clear precipitating event. He attributes the onset to progressively increasing kneeling requirements at work after taking on a new tiling contract.</p><p>Pain is medial and deep (5/10), worse with kneeling, squatting past 90°, and prolonged walking on hard surfaces. Morning stiffness lasts 20–30 minutes. No acute effusion but the knee feels "puffy" after a full work day. No instability, no locking. Right-sided only.</p><p>BMI 31. Mild genu varum bilaterally. Prior left knee meniscectomy 8 years ago. On no medications. GP ordered X-ray — mild joint space narrowing medial compartment right knee.</p>`,
        ],
        advanced: [
          `<p>A 24-year-old female elite netball player presents 48 hours after an acute right knee injury sustained landing from a jump shot — a non-contact valgus collapse on landing. She heard a loud pop and immediately could not weight-bear. Significant haemarthrosis developed within 1 hour.</p><p>Currently on crutches. She reports marked subjective instability — the knee "gave way" twice attempting to mobilise. Pain 8/10 with any loading. Unable to fully extend or flex. Highly distressed regarding her upcoming national championship (6 weeks away).</p><p>No prior knee injuries. No anticoagulants. GP X-ray: no fracture. Referred for physiotherapy assessment, management, and imaging recommendation.</p>`,
          `<p>A 31-year-old male rugby union player presents after sustaining a right knee injury in a tackle 4 days ago — a direct valgus blow to the lateral knee while the foot was planted. He experienced immediate medial pain, rapid swelling, and instability. He was carried off the field.</p><p>Currently non-weight-bearing on crutches. Large haemarthrosis. He reports the knee "opened up" medially when stressed. Significant apprehension on any valgus loading. Pain 7/10 at rest. No lateral symptoms. No peroneal nerve symptoms.</p><p>Elite-level player, high priority return to sport. GP cleared fracture on X-ray. Referred for MRI recommendation and specialist follow-up if required.</p>`,
          `<p>A 38-year-old female presents 72 hours after a skiing injury — she caught an edge at high speed, resulting in a hyperextension and internal rotation mechanism. She felt two distinct "pops" and could not bear weight. Immediate large effusion.</p><p>Currently on crutches with a large haemarthrosis. She cannot fully extend the knee and describes a "block" rather than pain limiting full extension — suggesting possible mechanical block. Marked anterior instability on Lachman. Complains of both anterior and posteromedial pain.</p><p>No prior knee injuries. GP cleared fracture on X-ray. She is a sports medicine GP herself and understands the likely severity. Requesting MRI and specialist review.</p>`,
        ],
      },
      Shoulder: {
        beginner: [
          `<p>A 32-year-old female office administrator presents with a <strong>6-week history of right shoulder pain</strong> with no specific injury. Pain developed gradually during a busy project period involving prolonged mouse use and reaching across a wide desk.</p><p>Pain is anterior and lateral (5/10), provoked by overhead reaching, sleeping on the right, and a painful arc between 70°–120°. Morning stiffness of about 10 minutes. She denies arm tingling or weakness. No prior shoulder history. Cervical screen unremarkable per GP.</p><p>Works 9 hours/day at a desk. Tried ibuprofen — partial relief. No other medical history.</p>`,
          `<p>A 44-year-old male house painter presents with <strong>right shoulder pain</strong> of 8 weeks duration, worsening progressively. The pain came on insidiously — no specific incident — but he links it to a particularly intensive indoor ceiling painting contract.</p><p>Pain is lateral and posterior (6/10), worst with overhead painting, reaching behind, and lifting paint buckets. Painful arc present. He has difficulty sleeping on the right. No tingling or arm weakness. No locking or instability. He has tried to "work through it" with minimal improvement.</p><p>BMI 29. Right hand dominant. No prior shoulder injury. GP arranged X-ray — mild AC joint arthrosis. Referred for physiotherapy.</p>`,
          `<p>A 28-year-old female presents with <strong>right shoulder pain</strong> of 4 weeks duration after starting a new gym program. She introduced overhead pressing and pull-ups for the first time. Pain started midway through the second week and has not settled despite reducing training.</p><p>Pain is anterior and lateral (4/10), present with overhead pressing, lateral raises, and reaching overhead in daily life. Minimal at rest. No clicking, no instability, no night pain at rest. Full cervical range with no referral. She is eager to continue training.</p><p>No prior shoulder history. Fit and otherwise healthy. On no medications. No red flag features.</p>`,
        ],
        intermediate: [
          `<p>A 28-year-old female competitive swimmer presents with <strong>right anterior shoulder pain</strong> of 3 months, worsening over the competitive season. She trains 5 sessions/week (approx. 40 km/week) and recently added pull-buoy sets. Pain is during the catch and pull-through phase of freestyle.</p><p>Deep ache anteriorly (5/10), reduced stroke power on the right. Cross-body reaching is provocative. She has tried ice and anti-inflammatories without lasting benefit. No instability. Cervical screen normal. No systemic symptoms.</p><p>Prior right shoulder impingement 2 years ago, managed conservatively. No current medications. Referred by sports physician for physiotherapy assessment.</p>`,
          `<p>A 50-year-old male accountant presents with <strong>left shoulder pain and stiffness</strong> of 5 months progressive duration. No specific injury. He is type 2 diabetic (tablet-controlled, HbA1c 61) and noticed the shoulder stiffening gradually. His GP treated it as "rotator cuff" with NSAIDs for 8 weeks without improvement.</p><p>Pain is a constant dull ache anteriorly (5/10), with all overhead and behind-back movements severely restricted. Morning stiffness lasts over 1 hour. He cannot reach his back pocket or put on a jacket. Night pain is significant — unable to find a comfortable position.</p><p>No trauma. Left hand dominant. No prior shoulder injury. GP arranged X-ray — no significant findings. Referred to physiotherapy for further assessment.</p>`,
          `<p>A 38-year-old female masters tennis player presents with <strong>right shoulder pain during serving and overhead shots</strong> of 6 weeks duration. The pain came on after returning from a 6-week break and immediately resuming full competition. She noticed both pain and reduced serve speed.</p><p>Pain is posterosuperior (6/10) during late cocking and acceleration phases of overhead movements. Mild anterior shoulder discomfort also present. She reports reduced IR behind her back. No instability symptoms. Cervical screen normal. No neurological symptoms.</p><p>No prior shoulder surgery. Physiotherapy previously for lumbar pain only. GP referred. No current medications. Competition season ongoing — high motivation to return quickly.</p>`,
        ],
        advanced: [
          `<p>A 58-year-old male construction foreman presents after an acute right shoulder injury 1 week ago — he fell from a ladder and landed on an outstretched right arm with the shoulder abducted and externally rotated. Immediate severe pain and complete inability to elevate the arm.</p><p>He cannot actively raise the arm above 30°. Constant dull ache at rest (5/10), severe (9/10) with any active elevation attempt. Large bruising over the anterolateral shoulder. No tingling or numbness. X-ray: no fracture. His work requires heavy overhead lifting and he is the primary income earner — highly motivated for rapid return.</p><p>Left hand dominant. On no anticoagulants. GP referred with suspected RC tear. No prior shoulder surgery.</p>`,
          `<p>A 64-year-old female retired teacher presents with <strong>sudden onset right shoulder pain</strong> 3 weeks ago while lifting a heavy bag of compost — she felt a tearing sensation and heard a pop. Immediate severe pain. Now cannot actively lift the arm and has noticed progressive weakness.</p><p>Active elevation is limited to 40° before a painful shrug substitution pattern. Passive elevation to 160° with a marked drop-arm sign. Constant ache 4/10, severe with any active effort. She is extremely distressed as she lives alone and cannot dress herself or drive. No neurological symptoms.</p><p>No prior shoulder surgery. GP X-ray: no fracture. Referred for assessment and imaging recommendation. Currently on paracetamol and codeine.</p>`,
          `<p>A 45-year-old male elite surf lifesaver presents after an acute right shoulder dislocation during a beach rescue — a forceful external rotation and abduction mechanism. Reduced on-scene by ambulance staff. He has had 3 prior dislocations of the same shoulder over 10 years.</p><p>Post-reduction: pain 6/10 at rest, 9/10 with any external rotation. Significant apprehension with ER/abduction testing. He reports the shoulder "goes" easily now — a shift from prior dislocations. Neurovascularly intact. X-ray post-reduction normal.</p><p>Prior conservative management only for previous dislocations. He is asking directly whether he needs surgery and what the recurrence risk is. Highly active role requires reliable shoulder function. On NSAIDs.</p>`,
        ],
      },
      Cervical: {
        beginner: [
          `<p>A 29-year-old female graphic designer presents with <strong>right-sided neck pain and suboccipital headache</strong> of 5 weeks duration. She has recently started working from home, using a laptop on a kitchen table with no external monitor, in a sustained forward-head posture for 9+ hours daily.</p><p>Pain is posterior right neck and upper trapezius (4/10), with a dull right-sided headache from the suboccipital to the temple. Worst at end of day. Eases with position change and brief self-massage. No arm tingling, no weakness, no visual changes. Morning stiffness resolves within 15 minutes.</p><p>No prior neck history. Non-smoker. BMI 21. Tried ibuprofen — minimal benefit. No red flag features.</p>`,
          `<p>A 38-year-old male truck driver presents with <strong>left-sided neck pain</strong> of 3 weeks duration following a long interstate haul (14-hour drive). The pain began during the drive and has not fully settled. He attributes it to neck position during driving.</p><p>Pain is left-sided, posterior and lateral neck (5/10), provoked by left rotation and sustained neutral cervical posture. Eases with movement and heat. Morning stiffness lasting 20 minutes. No arm symptoms. No headache. No gait changes. He denies weakness.</p><p>Prior mild neck pain 2 years ago that resolved spontaneously. Works 60 hours/week. BMI 28. On no regular medications. Keen to return to work within the week.</p>`,
          `<p>A 34-year-old female primary school teacher presents with <strong>bilateral neck stiffness and central neck ache</strong> of 4 weeks duration. She links the onset to prolonged writing on a low whiteboard throughout a busy term. The pain is symmetrical and dull.</p><p>Central and bilateral posterior neck ache (4/10), stiff end-range rotation both directions. Provoked by sustained forward head flexion (writing, phone use) and eased by extension, heat, and lying supine. No arm symptoms. No headache. No neurological symptoms of any kind.</p><p>No trauma. No prior cervical history. On no medications. Works in a classroom with students aged 6–8 years. Asks about exercises to prevent recurrence.</p>`,
        ],
        intermediate: [
          `<p>A 42-year-old male electrician presents with <strong>right neck and arm pain</strong> of 5 weeks duration after a day of sustained overhead wiring with the neck extended and rotated right. Immediate onset of right posterior neck pain, spreading to the forearm over 2 weeks.</p><p>Burning pain from neck through posterior shoulder to forearm (6/10), with intermittent pins and needles to the right thumb and index finger. Worse with cervical extension, right rotation, and sustained overhead work. Partially relieved by resting the arm. No bilateral symptoms. No bowel/bladder changes.</p><p>No prior cervical history. GP started NSAIDs with partial benefit. Referred for physiotherapy. MRI not yet arranged.</p>`,
          `<p>A 48-year-old female dentist presents with a <strong>3-month history of left arm pain, forearm aching, and hand tingling</strong>. She works in a sustained right-rotated and left-side-flexed posture for 6–7 hours daily. The arm pain developed gradually and she initially attributed it to her shoulder.</p><p>Left arm pain from neck to elbow (5/10), worse with sustained postures, reaching overhead, and at end of a long day. Intermittent left hand tingling (ring and little fingers predominantly). No neck pain per se — just the arm. She denies weakness but finds fine dental work tiring.</p><p>Prior right-sided cervical issues 4 years ago responded to physiotherapy. On no medications. GP referred with suspected cervical radiculopathy — requesting assessment and management plan.</p>`,
          `<p>A 55-year-old male presents with <strong>right arm pain, weakness, and clumsiness</strong> of 2 months duration following a minor rear-end motor vehicle accident. He was appropriately restrained, low-speed impact. Neck pain was present initially but has largely resolved — the arm symptoms have persisted and slightly progressed.</p><p>Right posterior arm pain (5/10) with weakness gripping and difficulty with fine tasks (keyboard use, picking up small objects). Occasional right thumb numbness. Cervical extension and ipsilateral rotation reproduce arm symptoms. No bilateral symptoms. No gait changes. No bladder changes.</p><p>Litigation not pending. GP referred. No prior neurological history. On paracetamol currently. MRI referral pending.</p>`,
        ],
        advanced: [
          `<p>A 64-year-old retired engineer presents with a <strong>5-month progressive history of bilateral hand clumsiness and unsteady gait</strong>. He cannot button his shirt reliably, drops objects, and trips on uneven surfaces. Background of cervical spondylosis on X-ray 2 years ago.</p><p>Occasional electric shock sensation down the spine with neck flexion (Lhermitte's). Bilateral arm heaviness. Mild urinary urgency noted in the past month. No acute bowel or bladder changes. No fever or weight loss. Symptoms are bilateral and progressive over months — not episodic.</p><p>GP referred for further assessment. No prior neurological history. On amlodipine and atorvastatin. Not on anticoagulants. MRI spine not yet arranged.</p>`,
          `<p>A 71-year-old female retired librarian presents with a <strong>4-month history of progressive bilateral lower limb heaviness and poor balance</strong>. She has fallen twice in the past month on stairs. Her family has noticed her gait has changed — she shuffles and has a wide base. Background of multilevel cervical spondylosis.</p><p>Both hands feel clumsy (difficulty opening jars, writing). Bilateral leg stiffness worse in the morning. She denies pain as the primary complaint — the functional decline is the concern. Bladder urgency present for 2 months. No fever or constitutional symptoms.</p><p>GP referred for further assessment. On ramipril and omeprazole. No prior neurological history. Her family accompanies her and is very concerned. Neurologist appointment pending in 6 weeks.</p>`,
          `<p>A 58-year-old male professional with a <strong>3-month history of bilateral upper and lower limb symptoms</strong> presents having been discharged by two other practitioners as "functional." He reports progressive bilateral hand weakness, clumsiness, leg spasticity, and intermittent urinary urgency.</p><p>Bilateral hand grip weakness. He holds handrails on all stairs. He notes scapular winging and difficulty raising both arms above 90°. Reflexes described as "brisk" by GP. Bilateral Babinski positive per neurological referral letter. He has a high-powered job and has been dismissing symptoms for months.</p><p>MRI cervical spine arranged but 3 weeks away. GP referred for further assessment. On no anticoagulants. Prior history of atrial fibrillation on anticoagulation — IMPORTANT: check current medications before assessment.</p>`,
        ],
      },
      Thoracic: {
        beginner: [
          `<p>A 26-year-old male warehouse worker presents with <strong>right interscapular pain</strong> of 10 days duration following a day of heavy repetitive lifting and twisting. He felt a sudden sharp pain in the mid-back during a rotational lift — "like something locked up." Pain has since settled to a dull ache.</p><p>Pain at T5–T7 level, right of midline (5/10). Provoked by right rotation, prolonged sitting, and deep inspiration. Eases with movement and heat. No radiation. Mild morning stiffness resolving within 20 minutes. No red flag features. Non-smoker. On no medications.</p><p>No prior thoracic history. Works 5 days/week heavy manual. Paracetamol taken — minimal benefit. Asking when he can return to full duties.</p>`,
          `<p>A 22-year-old female university student presents with <strong>central thoracic ache</strong> of 3 weeks duration, beginning after a week of intensive study (10-hour desk sessions). She describes the pain as a constant tightness across T4–T6.</p><p>Pain is central and bilateral (4/10), worst at end of long study sessions and in sustained thoracic flexion. Eases with movement and standing. Deep breathing is slightly uncomfortable at maximum inspiration but not painful. No radiation, no arm tingling, no night pain unrelated to position. No systemic symptoms.</p><p>No prior thoracic history. Non-smoker. BMI 20. On oral contraceptive pill only. Lives a largely sedentary student lifestyle with minimal exercise. Requesting advice on posture and exercises.</p>`,
          `<p>A 34-year-old female nurse presents with <strong>left-sided thoracic and scapular pain</strong> of 2 weeks duration after a busy run of night shifts involving prolonged patient handling and awkward reaching. The pain came on gradually and has not settled with her usual rest.</p><p>Pain is left periscapular and midthoracic (4/10), provoked by sustained forward reaching, rotation to the left, and end-of-shift fatigue. Eases with rest and a hot shower. No chest pain, no shortness of breath. No arm symptoms. No constitutional features. Slightly sore with deep inspiration but no pleuritic quality.</p><p>GP assessed and cleared cardiac and respiratory causes. No prior thoracic history. BMI 23. On no regular medications.</p>`,
        ],
        intermediate: [
          `<p>A 46-year-old male dental surgeon presents with <strong>3 months of central thoracic stiffness</strong> worsening over a busy period. He works in a sustained right-rotated, forward-flexed posture for 6–8 hours daily. Onset was gradual with no specific incident.</p><p>Constant dull ache T4–T6 (4/10), worst after long operating sessions. Brief movement temporarily relieves. Slightly restricted deep breathing, no pain. Occasional headaches at end of operating day. No arm tingling, no radiation. No red flag features.</p><p>GP cleared cardiovascular and visceral causes. NSAIDs taken with partial benefit. No prior thoracic history. Referred for physiotherapy assessment and management.</p>`,
          `<p>A 52-year-old female accountant presents with <strong>bilateral interscapular pain and thoracic stiffness</strong> of 4 months duration with no precipitating event. She attributes it to prolonged desk work during an intensive audit period (12 hours/day for 8 weeks).</p><p>Bilateral T4–T7 ache (5/10), constant with peaks at end of day. Movement eases temporarily. Rotation bilaterally restricted and stiff. Prolonged sitting aggravates, standing and walking help. No arm symptoms. No chest pain. No night pain that wakes her. No constitutional symptoms.</p><p>No prior thoracic history. BMI 24. On antihypertensives. GP cleared cardiac and visceral causes. Requesting physiotherapy for postural rehabilitation.</p>`,
          `<p>A 40-year-old male professional cyclist presents with a <strong>4-month history of right thoracic pain</strong> that he initially attributed to his aggressive aerodynamic riding position. He recently completed a 12-week high-volume training block (15–18 hours/week on the bike).</p><p>Right-sided T5–T8 ache (5/10), worse after prolonged riding sessions and deep breathing at high intensity. Tenderness over right ribs 6–8 posterolaterally. He notes the pain is more focal and sharp than his usual thoracic stiffness. Positive lateral rib compression test per GP. No systemic symptoms.</p><p>No prior thoracic history. BMI 21. GP referred after focal rib tenderness noted — X-ray normal (as expected acutely). On no medications. High-priority return to competition.</p>`,
        ],
        advanced: [
          `<p>A 68-year-old male retired accountant with a <strong>history of prostate cancer</strong> (PSA "within normal range" 14 months ago) presents with <strong>6 weeks of progressive mid-thoracic pain</strong>, initially activity-related but now constant, present at rest, and waking him at night.</p><p>4 kg unintentional weight loss over 2 months. Increasing fatigue. He reports his legs feel "heavy" walking and has had two episodes of urinary urgency. Focal spinal percussion tenderness at T7. No prior physiotherapy. On tamsulosin and atorvastatin. Distressed — attributes pain to "bad posture."</p><p>GP prescribed analgesia and referred for further assessment. MRI has been arranged but not yet available. GP letter documents progressive neurological and constitutional symptoms. Referred for baseline neurological assessment.</p>`,
          `<p>A 62-year-old female with a <strong>history of breast cancer</strong> (treated 5 years ago, reportedly in remission) presents with a <strong>2-month history of mid-thoracic pain</strong> that she has been attributing to a "pulled muscle" from gardening. Pain is now constant, 6/10 at rest.</p><p>She reports night pain that wakes her, and has noticed progressive difficulty walking up stairs. She denies bowel changes but reports mild urinary urgency. Weight loss of 3 kg over 6 weeks. She is visibly distressed — she delayed presenting as she feared bad news. Focal T8 percussion tenderness.</p><p>GP unaware of new symptoms — she presented directly. On letrozole and calcium/vitamin D supplements. No anticoagulants. No prior physiotherapy for thoracic pain. Requesting further medical assessment.</p>`,
          `<p>A 74-year-old male presents with <strong>sudden onset severe thoracic pain</strong> after minor lifting — he bent over to pick up a bag of groceries and felt immediate sharp T8 pain. He is known to have osteoporosis (DEXA T-score –3.2) and is currently on bisphosphonate therapy.</p><p>Pain is severe (8/10), central thoracic, worsens significantly with any movement and deep breathing. He is reluctant to mobilise. He has had two prior vertebral compression fractures (T11, L1) — both managed conservatively. He lives alone and is concerned about independence.</p><p>GP X-ray: possible new compression at T8 — "query fracture." On alendronate, calcium, vitamin D, and ramipril. Referred for physiotherapy assessment and management planning. Prognosis discussion requested.</p>`,
        ],
      },
      Lumbar: {
        beginner: [
          `<p>A 34-year-old male delivery driver presents with <strong>acute low back pain</strong> of 5 days duration following a heavy lifting incident at work. He felt immediate sharp low back pain lifting a 30 kg parcel from a van. Pain has not allowed him to return to work.</p><p>Central and bilateral L4–S1 pain (7/10 at worst), with right buttock referral not extending below the knee. Provoked by lumbar flexion, prolonged sitting, and rising from a chair. Relieved by lying supine with knees bent. Morning stiffness about 30 minutes. No leg tingling or weakness. No bowel/bladder changes.</p><p>No prior back history. On alternating paracetamol and ibuprofen. BMI 27. Asking about return to work timeline.</p>`,
          `<p>A 28-year-old female fitness instructor presents with <strong>right-sided low back pain</strong> of 2 weeks duration with no specific injury — it began insidiously during a period of significantly increased class load (from 8 to 20 classes/week during a colleague's sick leave).</p><p>Right-sided lumbar ache (5/10), provoked by extension-based movements (back bends, deadlifts, single-leg loading). Eases with rest and flexion. Morning stiffness of 10 minutes. Occasional right buttock ache but no leg symptoms. She has continued teaching but modified impact activities.</p><p>No prior back history. BMI 21. On no regular medications. Concerned about impact on income. No red flag features.</p>`,
          `<p>A 40-year-old male office manager presents with <strong>central low back pain</strong> of 6 weeks duration. He cannot identify a specific cause — the pain has built gradually since he started a new role requiring 9 hours/day of sitting. He describes the pain as a dull, persistent ache.</p><p>Central lumbar ache (4/10), constant with worsening at end of day. Provoked by prolonged sitting and relieved by walking and standing. No leg symptoms. No morning stiffness beyond 5 minutes. He has started going for evening walks which help temporarily. No neurological symptoms. No trauma.</p><p>No prior back history. BMI 30. Sedentary lifestyle. GP cleared serious pathology. On no medications. Requesting advice on posture and management.</p>`,
        ],
        intermediate: [
          `<p>A 45-year-old male office worker presents with a <strong>6-week history of right low back pain and right leg symptoms</strong>. Initial low back pain after a long drive has progressively spread down the right posterior thigh and calf. The leg pain now dominates.</p><p>Burning, shooting right leg pain (6/10), aggravated by sitting, coughing, and sneezing. Partial relief with lying flat. Intermittent pins and needles to the right foot. No weakness. He finds standing more comfortable than sitting. Morning back stiffness 20 minutes. No bowel/bladder changes.</p><p>No prior lumbar history. On diclofenac with limited relief. MRI not yet done. GP referred for physiotherapy assessment and management.</p>`,
          `<p>A 38-year-old female school teacher presents with <strong>left leg pain and low back stiffness</strong> of 5 weeks duration following an episode of heavy garden work. She strained her back initially, and over 3 weeks left leg symptoms developed.</p><p>Left posterior thigh and calf pain (5/10), burning quality, worsened by sitting and relieved by walking. Occasional left foot tingling (sole and heel). No weakness reported but she finds climbing stairs effortful. Lumbar flexion limited and reproduces leg symptoms. Slump positive on left.</p><p>No prior back surgery. BMI 24. Paracetamol and naproxen taken with limited benefit. No bowel/bladder changes. GP referred — MRI arranged for next week.</p>`,
          `<p>A 55-year-old male retired police officer presents with a <strong>3-month history of bilateral buttock and leg heaviness</strong> worsening with walking. He can walk approximately 200 metres before bilateral calf tightness and heaviness forces him to stop. Sitting and leaning forward (e.g. shopping trolley position) relieves symptoms within 2 minutes.</p><p>Low back ache (3/10) is less significant than the bilateral leg heaviness (6/10). No acute leg pain at rest. Symptoms are entirely positional and load-dependent. He denies tingling or weakness at rest. Background of hypertension and type 2 diabetes well-controlled. Mild bilateral absent ankle reflexes.</p><p>GP arranged X-ray showing multilevel degenerative change. Referred for physiotherapy assessment. On metformin, lisinopril, and atorvastatin. No prior lumbar surgery.</p>`,
        ],
        advanced: [
          `<p>A 44-year-old male manual labourer presents via GP referral with a <strong>72-hour history of rapidly progressive bilateral leg weakness</strong> and low back pain following a heavy lifting incident. Initially severe low back pain; over 48 hours he has developed bilateral leg heaviness and two episodes of urinary retention requiring catheterisation.</p><p>Altered sensation inner thighs and perineum. Cannot stand from a chair unassisted. Bilateral calf pain at rest. Pain 9/10. Distressed and frightened. Prior L4/5 disc herniation 3 years ago managed conservatively.</p><p>GP commenced dexamethasone. MRI arranged but not yet available. Referred for physiotherapy baseline neurological assessment before specialist review.</p>`,
          `<p>A 36-year-old female presents after waking with <strong>bilateral leg weakness, perineal numbness, and urinary incontinence</strong> this morning. She had increasing low back pain for 3 weeks after lifting furniture during a house move. She went to bed with 6/10 low back pain and woke unable to walk normally.</p><p>She cannot dorsiflex either ankle (bilateral foot drop). Perineal sensation markedly reduced. Has wet herself twice this morning. Crying and frightened. Pain 7/10 in low back, bilateral posterior thigh heaviness. No prior back surgery. Not on anticoagulants.</p><p>GP assessed her this morning and provided a referral letter. Hospital imaging is pending. Physiotherapy role requested: baseline neurological documentation.</p>`,
          `<p>A 62-year-old male with <strong>known lumbar spinal stenosis</strong> (previous MRI showing L3/4 and L4/5 central stenosis) presents with acute deterioration over 4 days — he has gone from walking 500 metres to being unable to take 20 steps without bilateral leg collapse.</p><p>He also reports new urinary urgency and has had one episode of incontinence. Bilateral L4/5 dermatomal sensory loss. Knee reflexes 1+ bilaterally, ankle reflexes absent. He is in significant distress. Bilateral hip flexion strength 4/5. Prior conservative management only — no surgery.</p><p>On tramadol, pregabalin, and irbesartan. GP referred with a covering letter documenting rapid deterioration and new urinary symptoms. Specialist review is pending and MRI is booked for today.</p>`,
        ],
      },
      Elbow: {
        beginner: [
          `<p>A 34-year-old female amateur tennis player presents with <strong>right lateral elbow pain</strong> of 6 weeks duration following a weekend tournament (8 matches over 2 days). She recently switched to a stiffer racquet frame.</p><p>Pain over the lateral epicondyle (5/10) provoked by backhand strokes, gripping, lifting a coffee mug with elbow extended, and wringing towels. Eases within 30 minutes of stopping activity. No neck pain, no arm tingling, no swelling. No prior elbow history. Tried topical anti-inflammatory — minimal benefit.</p><p>Works part-time as a hairdresser. Right hand dominant. On no medications. No red flag features. Keen to continue playing but willing to modify load.</p>`,
          `<p>A 42-year-old male carpenter presents with a <strong>3-month history of right lateral elbow pain</strong>. The pain developed insidiously during a long kitchen fitting project involving prolonged screwdriving and hammer use. He has tried resting for 2 weeks with partial improvement but pain returns on resuming work.</p><p>Lateral elbow pain (6/10) provoked by resisted wrist extension, screwdriving, gripping power tools, and lifting anything heavier than a mug. No neck symptoms. No forearm or hand tingling. Mild stiffness in the morning. His livelihood depends on manual work.</p><p>No prior elbow history. BMI 27. On no medications. GP referred. X-ray normal. Not on anticoagulants. Requesting assessment and exercise programme.</p>`,
          `<p>A 28-year-old female desk worker and recreational badminton player presents with <strong>right lateral elbow pain</strong> of 4 weeks duration. She increased badminton from once to three times per week during a social tournament. Pain came on during her third session and has persisted.</p><p>Lateral elbow pain (4/10), provoked by backhand smashes, overhead clears, prolonged typing, and shaking hands firmly. Absent at rest. No tingling in the arm. No swelling. She can play through but the pain worsens significantly. No prior elbow history.</p><p>Works as an analyst (heavy keyboard use). Right hand dominant. On oral contraceptive pill. No other medications. Requesting physiotherapy for load management and rehabilitation.</p>`,
        ],
        intermediate: [
          `<p>A 40-year-old male rock climber presents with a <strong>3-month history of medial elbow pain and right hand tingling</strong> after increasing training intensity (4+ sessions/week). Medial elbow pain began insidiously and is compounded by desk work requiring prolonged elbow flexion.</p><p>Medial epicondyle and flexor forearm pain (5/10). Intermittent tingling in ring and little fingers — worse after climbing or prolonged typing. Tried rest for 2 weeks with partial improvement but symptoms return immediately on resuming climbing. No lateral elbow symptoms. GP X-ray normal. On ibuprofen with partial benefit.</p><p>No prior elbow surgery. BMI 23. Right hand dominant. Refers to himself as a "serious climber" — high motivation to return. Requesting assessment and management plan.</p>`,
          `<p>A 48-year-old female office manager and golfer presents with a <strong>5-week history of right medial elbow pain</strong> beginning after starting golf lessons and an intensive practice period (2 hours/day for 3 weeks). She also types 7 hours/day.</p><p>Medial epicondyle pain (4/10), provoked by resisted wrist flexion, gripping the golf club, and pushing up from a chair. Mild tingling in the right ring finger intermittently after prolonged mouse use. No lateral elbow symptoms. Morning stiffness of 10 minutes. No swelling, no locking.</p><p>No prior elbow history. BMI 25. Right hand dominant. GP referred. On no medications. Asking whether she should stop golf entirely or can modify activity.</p>`,
          `<p>A 55-year-old male presents with <strong>6 weeks of right medial elbow pain following a fall</strong> — he slipped and landed on an outstretched right hand with a valgus stress to the elbow. Initial severe medial pain settled, but medial instability symptoms have persisted.</p><p>Medial elbow ache (4/10) that worsens significantly during throwing movements (he coaches junior cricket). The elbow feels "loose" during throwing. Tenderness specifically at the sublime tubercle, not the epicondyle. No forearm tingling. No lateral symptoms. No prior elbow injury.</p><p>GP X-ray: no fracture. BMI 26. Right hand dominant. On aspirin (cardiac). Requesting physiotherapy assessment and management guidance.</p>`,
        ],
        advanced: [
          `<p>A 45-year-old male CrossFit athlete presents after feeling a "pop" in the right elbow 3 days ago during a heavy barbell curl at maximum load. Immediate sharp anterior elbow pain. He noticed visible deformity — "the muscle bunched up toward my shoulder" (Popeye sign).</p><p>Significant anterior elbow bruising and swelling. Can flex the elbow but resisted supination strength is markedly reduced and painful. Anterior elbow aching at rest (4/10), severe with resisted supination (9/10). He is asking directly whether surgery is needed and what his prognosis is.</p><p>No prior elbow surgery. GP X-ray: no fracture. Referred for assessment and management recommendation. Right hand dominant. On no anticoagulants. Competition in 8 weeks.</p>`,
          `<p>A 38-year-old male professional baseball pitcher presents with <strong>sudden complete loss of right elbow function</strong> during a maximal effort pitch 1 week ago. He felt a tearing sensation medially and a loud pop. Immediate severe medial pain and inability to continue pitching. His velocity dropped suddenly before the incident.</p><p>Currently unable to throw at any intensity. Medial elbow pain (6/10) at rest, 9/10 with any attempted throwing. Marked medial laxity on valgus stress testing. No ulnar nerve symptoms currently. He is an established professional and this presentation has career implications.</p><p>Prior medial elbow soreness managed conservatively 18 months ago. GP referred — MR arthrography arranged. On no medications. Requesting surgical consultation guidance.</p>`,
          `<p>A 52-year-old male presents after an elbow dislocation 10 days ago (reduced in ED) following a fall from a bicycle. Post-reduction X-ray showed a small coronoid fragment. He was immobilised in a backslab for 5 days and is now referred for rehabilitation.</p><p>Currently in a hinged brace. Elbow flexion 95°, extension –25°. Significant medial and lateral swelling. He reports medial instability feelings with any valgus load. Neurological screen: mild ulnar nerve sensory changes in ring and little finger. He is highly anxious about permanent stiffness and wants to return to cycling and work (accountant).</p><p>No prior elbow history. On NSAIDs and low-molecular-weight heparin. Referred by orthopaedic surgeon for rehabilitation under their protocol. Complex injury — collaborative management required.</p>`,
        ],
      },
      Hip: {
        beginner: [
          `<p>A 26-year-old female university student presents with <strong>right anterior groin and hip pain</strong> of 10 days duration after returning to a gym programme (heavy squats and walking lunges) following a 2-year break from structured exercise. She felt a sharp pull in the front of the hip during a deep lunge.</p><p>Anterior groin and hip crease pain (3/10 at rest, 7/10 with loading), occasionally into the proximal anterior thigh. Provoked by hip flexion under load (stairs, lunges, step-ups), brisk walking, and getting in/out of a car. Eases with relative rest and gentle walking. No clicking, locking, or giving way. Works as a primary school teacher. BMI 22. On no medications. No red flag features.</p><p>No prior hip history. Eager to continue gym. Requesting assessment and exercise modification guidance.</p>`,
          `<p>A 32-year-old male presents with <strong>left anterior groin pain</strong> of 2 weeks duration after a maximal sprint and shot during a social football match. He felt an immediate "grab" in the left hip flexor and stopped playing.</p><p>Left anterior groin pain (4/10 at rest, 7/10 with loading) is provoked by resisted hip flexion, accelerating, kicking, stair climbing, and high-knee movements. Walking is mildly uncomfortable but weight-bearing is full. No clicking, locking, or true instability. No back or knee symptoms.</p><p>No prior hip history. Works as a project manager (sedentary). BMI 24. Tried ibuprofen with partial benefit. GP referred. Asking about return to football.</p>`,
          `<p>A 38-year-old female yoga instructor presents with <strong>right anterior hip pain</strong> of 5 weeks duration after repeatedly demonstrating high-knee transitions and deep lunge flows during an intensive workshop weekend. She noticed a sharp pull at the front of the right hip during class, followed by persistent pain with activity.</p><p>Anterior hip and groin pain (2/10 at rest, up to 6/10 with loading), provoked by active hip flexion, step-ups, stair climbing, and prolonged sitting over 45 minutes. Symptoms ease with reduced activity and light movement. No back or leg radiation. No clicking or instability.</p><p>No prior hip history. Fit and flexible. BMI 20. On no medications. Concerned that the condition may limit her teaching. No red flag features.</p>`,
        ],
        intermediate: [
          `<p>A 46-year-old female distance runner presents with a <strong>4-month history of right lateral hip and thigh pain</strong> during marathon training (70 km/week). Pain has worsened progressively over 3 months and is present the day after long runs.</p><p>Lateral hip pain provoked by leg crossing, lying on the right, sitting cross-legged, and single-leg loading. She notices a Trendelenburg lurch on long runs. Standing on the right leg for >10 seconds reproduces lateral hip pain. No groin or knee symptoms. GP X-ray: mild degenerative change greater trochanter region. Tried 3 weeks rest — symptoms returned on first run back. On no medications.</p><p>No prior hip pathology. BMI 23. Requesting return-to-running plan for upcoming marathon.</p>`,
          `<p>A 52-year-old male retired AFL player presents with a <strong>6-month history of deep right groin and anterior hip pain</strong>. He can no longer play social golf due to pain with rotation and walking. He attributes it to a career of hip impacts in football but the pain has worsened significantly over the past 2 months.</p><p>Deep anterior groin and hip pain (5/10), worse with prolonged walking, standing, pivoting, and deep squat. Morning stiffness >30 minutes. Visible antalgic gait and reduced hip IR clinically. No back symptoms. No leg radiation. X-ray: moderate joint space narrowing right hip. BMI 29.</p><p>On ibuprofen and paracetamol regularly. No prior hip surgery. Asking about management options including whether he is "heading for a hip replacement."</p>`,
          `<p>A 40-year-old female presents with a <strong>3-month history of bilateral lateral hip pain</strong> that began after starting a sit-stand work station and spending prolonged periods in hip adduction (standing with weight shifted). She is a former competitive dancer.</p><p>Bilateral greater trochanteric region pain (right > left), aggravated by leg crossing, lying on either side, sitting in low chairs, and prolonged standing with weight on one leg. Pressing on the greater trochanter reproduces familiar pain. No groin symptoms. No back or leg radiation. Single-leg stance test positive bilaterally within 15 seconds.</p><p>No prior hip pathology. BMI 22. GP X-ray: unremarkable. On no medications. Requesting assessment and load management strategy.</p>`,
        ],
        advanced: [
          `<p>A 22-year-old female elite triathlete presents with a <strong>3-week history of progressive right groin pain</strong> that has rapidly escalated. She was in a high-volume training block (18 hours/week). Pain is now present at rest, wakes her at night, and she cannot run or fully weight-bear. Single-leg hop aborted due to severe pain.</p><p>Deep, constant right groin pain (6/10 rest, 9/10 loading). Irregular menstrual history over 6 months. No trauma. GP X-ray: no fracture seen. Prior tibial stress reaction 2 years ago. Race in 6 weeks. On no medications. Very anxious about prognosis.</p><p>MRI has been requested before progressing loading assessment. Full weight-bearing assessment has not yet been completed.</p>`,
          `<p>A 65-year-old male presents with a <strong>4-month progressive history of deep right hip and anterior thigh pain</strong>. The pain has changed in character recently — from activity-related to now present at night. He was told 6 months ago he had "mild OA" on X-ray.</p><p>Constant deep hip and thigh ache (6/10), worse at night and in the morning. He has lost 11 lb over 3 months without dietary change. He attributes this to "cutting back activity due to pain." Progressive difficulty weight-bearing. Focal pelvis/hip percussion tenderness. No prior cancer history but is a long-term heavy smoker.</p><p>Updated imaging was arranged by his GP and he was sent for same-week follow-up. On paracetamol and tramadol.</p>`,
          `<p>A 68-year-old female with <strong>known osteoporosis</strong> (DEXA T-score –3.1, on bisphosphonates) presents after a low-energy fall (tripped on a rug) with immediate severe right hip and groin pain and inability to weight-bear. Ambulance transferred from home — fully alert and oriented. Extreme pain with any hip movement.</p><p>Right leg in external rotation and apparent shortening on observation. Severe pain (9/10) with any attempt at hip ROM. She lives alone, is a retired nurse, and is frightened about loss of independence. On alendronate, calcium/vitamin D, and ramipril.</p><p>Initial X-rays were obtained before referral paperwork was completed. She was sent for further acute assessment and pre-operative counseling.</p>`,
        ],
      },
      Ankle: {
        beginner: [
          `<p>A 24-year-old female recreational netball player presents with <strong>right lateral ankle pain and swelling</strong> following an inversion injury 3 days ago — she rolled her ankle landing from a jump. She felt immediate sharp lateral ankle pain, heard a crack, and rapid swelling developed within 30 minutes.</p><p>Currently antalgic gait. Pain over the ATFL region (5/10 rest, 7/10 loading). Provoked by inversion, uneven terrain, and plantarflexion. Eased by elevation and ice. No medial pain. No bony tenderness per triage. Ottawa rules negative. Able to weight-bear with limp.</p><p>No prior ankle injury. Works as a physiotherapy receptionist (on her feet 6 hours/day). On no medications. Keen to return to netball. Requesting assessment and return-to-sport timeline.</p>`,
          `<p>A 32-year-old male trail runner presents with <strong>left ankle pain</strong> of 2 days duration after twisting his ankle on a trail root during an early morning run. He continued running for 5 km before pain forced him to stop — "it didn't feel that bad at first."</p><p>Lateral ankle pain (4/10 rest, 6/10 loading). Swelling over the lateral malleolus. Antalgic gait but able to weight-bear. Provoked by inversion, pushing off, and uneven ground. No medial ankle pain. Ottawa rules negative. He has had two prior left ankle sprains (last one 18 months ago, managed with rest only).</p><p>BMI 23. On no medications. He is training for an ultramarathon in 8 weeks. Requesting return-to-running plan with appropriate rehab.</p>`,
          `<p>A 18-year-old female presents with <strong>right ankle pain</strong> sustained during a football training session — she was tackled from the side while the foot was planted, resulting in a forced inversion mechanism. She was able to finish training but pain worsened overnight.</p><p>Lateral ankle pain and mild swelling (5/10). Antalgic gait. Ottawa rules negative per triage. No medial pain. No bony tenderness. She feels the ankle is "a bit wobbly" going down stairs. No prior ankle injuries. On no medications.</p><p>Plays state junior football — high motivation to return quickly. Parent accompanying. Requesting assessment, management, and return-to-sport guidance for upcoming state trials in 3 weeks.</p>`,
        ],
        intermediate: [
          `<p>A 28-year-old male football player presents with <strong>anterior ankle pain and difficulty pushing off</strong> following a tackle 4 days ago — forced dorsiflexion with external rotation of the foot while the knee was flexed. Immediate deep anterior ankle pain but no initial swelling. He continued playing but has worsened since.</p><p>Anterior and medial ankle pain (6/10). Mild anterior swelling. Provoked by DF with ER, single-leg calf raise, and pivoting. Ottawa rules negative per triage. He notes the ankle feels different to his prior lateral sprains — "more stuck than unstable." Tenderness over the anteroinferior tibiofibular ligament. Prior left lateral ankle sprain 18 months ago.</p><p>State league player with finals imminent. GP cleared fracture on X-ray. On no medications. Requesting assessment and return-to-play guidance.</p>`,
          `<p>A 44-year-old female trail runner presents with a <strong>5-week history of medial ankle and arch pain</strong> following a period of significantly increased trail running volume on hilly terrain. Pain developed insidiously over 2 weeks of a high-volume training block.</p><p>Medial ankle and arch pain (4/10), provoked by prolonged running, single heel raise (painful after 10 reps), and descending hills. Tenderness along the tibialis posterior tendon from medial malleolus to navicular. She notices progressive flatfoot appearance on prolonged weight-bearing. No prior ankle history. BMI 26. On no medications. Preparing for an ultramarathon in 10 weeks.</p><p>GP referred. X-ray normal. Requesting return-to-running plan.</p>`,
          `<p>A 36-year-old male basketball player presents with <strong>chronic right ankle instability</strong> of 12 months duration following an inadequately rehabilitated lateral ankle sprain. He has had 6 further "giving way" episodes since, including 2 this month.</p><p>Lateral ankle instability and occasional ache (3/10 at rest). The ankle gives way on cutting movements, landing, and uneven terrain. He has compensated by avoiding lateral movements during play. Balance on the right leg is visibly reduced compared to the left. No current acute swelling. The ankle feels "loose" compared to the left.</p><p>Works as a physiotherapy student — understands the diagnosis. No prior physiotherapy for the ankle specifically. On no medications. High-priority return to competitive basketball. Requesting structured instability rehabilitation programme.</p>`,
        ],
        advanced: [
          `<p>A 42-year-old male recreational badminton player presents after sudden posterior ankle pain during a lunge 2 days ago — he heard and felt a loud pop, immediately collapsed, and could not weight-bear. He describes it as feeling like someone "kicked the back of his ankle." No prior Achilles history.</p><p>Currently on crutches. Significant posterior ankle swelling and bruising. Cannot perform a single heel raise. Pain 4/10 at rest (reduced since onset), severe with any plantarflexion attempt. Thompson test performed by GP: positive. X-ray: no fracture. Not on fluoroquinolones or corticosteroids.</p><p>GP referred for assessment and management recommendation. On no regular medications. Trip planned in 8 weeks. Highly anxious about prognosis.</p>`,
          `<p>A 55-year-old female presents with an <strong>acute Achilles injury</strong> sustained during her first Zumba class in 10 years. She stepped awkwardly in dorsiflexion, felt an immediate tearing sensation at the posterior ankle, and a loud pop was heard by adjacent participants. Immediate inability to weight-bear.</p><p>Currently on crutches. Palpable gap at the Achilles tendon approximately 4 cm proximal to the calcaneal insertion. Thompson test positive. Significant swelling posteriorly. Pain 6/10 at rest. She is a type 2 diabetic (oral agents, HbA1c 58). No prior Achilles history. Not on fluoroquinolones.</p><p>GP referred. X-ray: no fracture. Orthopaedic review arranged. Requesting physiotherapy assessment for management planning. Highly distressed — has not exercised in years and was hoping to begin a rehabilitation journey.</p>`,
          `<p>A 67-year-old male with a <strong>history of two prior corticosteroid injections</strong> to the right Achilles (last one 4 months ago) presents after a low-energy mechanism — simply stepping off a kerb — caused an immediate pop and collapse. He had been experiencing Achilles pain for 8 months prior and is aware the injections were "not best practice" in retrospect.</p><p>Currently non-weight-bearing. Thompson test positive. Palpable gap at mid-portion tendon. Bruising extending to the heel. Pain 5/10 at rest. He is on long-term prednisolone (5 mg/day) for polymyalgia rheumatica — a significant complication factor for healing. BMI 31.</p><p>GP referred — orthopaedic consultation arranged. Requesting physiotherapy for assessment and management planning. Complex case: steroid use, prior injections, and age all affect surgical and conservative decision-making.</p>`,
        ],
      },
    };

    const regionV = V[region];
    if (!regionV) {
      return `<p>A patient presents with <strong>${region.toLowerCase()} symptoms</strong> requiring clinical differentiation.</p><p>Pain is provoked by activity and relieved by rest. No immediate red flag features are reported on initial screening.</p>`;
    }
    const levelV = regionV[level];
    if (!levelV) return `<p>A patient presents with <strong>${region.toLowerCase()} pain</strong>.</p>`;
    return levelV[seedIndex] ?? levelV[0];
  }

  function makeInfo(level, seedIndex) {
    const ageByLevel = { beginner: 28, intermediate: 45, advanced: 62 };
    const occupations = ['Office worker', 'Tradesperson', 'Retired teacher'];
    const durations = ['Subacute', 'Chronic', 'Acute'];
    const onsets = ['4 weeks', '3 months', '1 week'];
    const age = ageByLevel[level] + seedIndex * 3;
    return {
      age: String(age),
      sex: seedIndex === 0 ? 'Female' : (seedIndex === 1 ? 'Male' : 'Female'),
      occupation: occupations[seedIndex % 3],
      onset: onsets[seedIndex % 3],
      duration: durations[seedIndex % 3]
    };
  }

  function makeExam(level, region) {
    const E = {
      Knee: {
        beginner: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait analysis', result: 'Mild antalgic pattern. Slight knee valgus during single-leg loading phase. Contralateral hip drop present.', valence: 'neutral' },
            { name: 'Static posture / limb alignment', result: 'Increased Q-angle bilaterally. Mild bilateral pes planus. Slight anterior pelvic tilt.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Knee flexion / extension ROM', result: 'Full and pain-free bilaterally. No restriction in passive range.', valence: 'neg' },
            { name: 'Hip IR / ER ROM', result: 'Full range bilaterally. Mild hip flexor tightness on Thomas test.', valence: 'neutral' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Patellar facet palpation', result: 'Mild tenderness medial and inferior patellar facet on right. Reproduces familiar anterior knee pain.', valence: 'pos' },
            { name: 'Joint line palpation', result: 'No medial or lateral joint line tenderness. Meniscal involvement less likely.', valence: 'neg' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Clarke\'s sign (patellar grind)', result: 'Positive right — pain with patellar compression during quad contraction. Confirms patellofemoral irritation.', valence: 'pos' },
            { name: 'Single-leg squat (5 reps)', result: 'Dynamic valgus collapse at the knee bilaterally, right > left. Contralateral hip drop visible.', valence: 'pos' },
            { name: 'Hip abductor strength (side-lying)', result: 'Right hip abductors 4/5, left 5/5. Proximal weakness contributing to dynamic valgus.', valence: 'pos' },
            { name: 'McMurray test', result: 'Negative — no pain or click with valgus/varus stress and rotation. Meniscal pathology excluded.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation and reflexes', result: 'Intact L3–S2 dermatomal distribution bilaterally. Patellar and Achilles reflexes normal and symmetric.', valence: 'neg' },
          ]},
        ],
        intermediate: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait analysis', result: 'Mild antalgic pattern with reduced knee flexion in swing phase. Slight lateral trunk lean over affected side.', valence: 'neutral' },
            { name: 'Effusion assessment', result: 'Small to moderate effusion right knee. Positive patellar tap. Ballotement positive.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Knee flexion ROM (active)', result: 'Right: 0–105° (pain and restriction 90–105°). Left: 0–135°. End-range loading reproduces medial pain.', valence: 'pos' },
            { name: 'Knee extension ROM', result: 'Full extension achieved bilaterally. Mild pain at terminal extension right.', valence: 'neutral' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Medial joint line palpation', result: 'Exquisite tenderness medial joint line mid-point. Reproduces familiar deep knee pain.', valence: 'pos' },
            { name: 'Lateral joint line / LCL palpation', result: 'No lateral tenderness. LCL not implicated.', valence: 'neg' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'McMurray test (medial)', result: 'Positive — medial joint line pain reproduced with valgus stress and external rotation. Medial meniscus involvement likely.', valence: 'pos' },
            { name: 'Thessaly test (20°)', result: 'Positive right — medial joint line discomfort with rotational loading at 20° flexion. Supports meniscal pathology.', valence: 'pos' },
            { name: 'Valgus stress test (0° and 30°)', result: 'Negative — no medial joint opening. MCL intact. Pain on test is intra-articular, not ligamentous.', valence: 'neg' },
            { name: 'Lachman test', result: 'Negative — firm end-feel, no anterior tibial translation. ACL intact.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation and reflexes', result: 'Intact bilaterally. No neurological deficit identified.', valence: 'neg' },
          ]},
        ],
        advanced: [
          { name: 'Observation & Gait', items: [
            { name: 'Observation at rest', result: 'Large haemarthrosis right knee. Significant swelling anterior and lateral compartments. Held in 20° of flexion — unable to fully extend.', valence: 'pos' },
            { name: 'Weight-bearing status', result: 'Non-weight-bearing on crutches. Cannot tolerate single-leg loading on right.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Knee flexion / extension ROM', result: 'Flexion: 0–65° limited by pain and effusion. Extension: lacks 15° full extension — possible mechanical block or splinting.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Anterior knee / joint line palpation', result: 'Global tenderness with effusion. Medial joint line tender. No focal bony tenderness to suggest fracture.', valence: 'neutral' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Lachman test', result: 'Positive — significant anterior tibial translation with soft end-feel. ACL integrity compromised.', valence: 'pos' },
            { name: 'Anterior drawer test', result: 'Positive at 90° — anterior translation confirmed. Consistent with ACL disruption.', valence: 'pos' },
            { name: 'Valgus stress test (0° and 30°)', result: 'Negative at 0°. Mild laxity at 30° — isolated ACL injury without MCL involvement likely.', valence: 'neutral' },
            { name: 'McMurray test', result: 'Unable to complete fully due to effusion and ROM restriction. Inconclusive for meniscal pathology at this stage.', valence: 'neutral' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation / peroneal nerve screen', result: 'Intact bilaterally. No peroneal nerve involvement. Neurovascularly intact.', valence: 'neg' },
          ]},
        ],
      },
      Shoulder: {
        beginner: [
          { name: 'Observation & Posture', items: [
            { name: 'Shoulder posture / scapular position', result: 'Mild bilateral forward shoulder posture. Slight right scapular elevation and protraction. No wasting.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Active shoulder flexion / elevation', result: 'Painful arc 70–120°. Full range achieved (170°) with pain at end range. Scapular rhythm mildly disrupted right.', valence: 'pos' },
            { name: 'Active ER / IR', result: 'ER full and pain-free. IR slightly reduced right (60° vs 75° left) — mild posterior capsular tightness.', valence: 'neutral' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Subacromial region / greater tuberosity', result: 'Mild tenderness over the supraspinatus insertion at the greater tuberosity. Reproduces familiar ache.', valence: 'pos' },
            { name: 'AC joint palpation', result: 'No AC joint tenderness. AC joint not implicated.', valence: 'neg' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Hawkins-Kennedy test', result: 'Positive — subacromial pain reproduced with IR in forward flexion.', valence: 'pos' },
            { name: 'Neer impingement sign', result: 'Positive — anterior shoulder pain with passive forward flexion and ER.', valence: 'pos' },
            { name: 'Empty can (supraspinatus) strength', result: 'Mild pain but 5/5 strength. No weakness. Tendon load sensitivity without strength deficit.', valence: 'neutral' },
            { name: 'External rotation lag test', result: 'Negative — no lag, full strength. Full-thickness RC tear excluded.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Upper limb sensation and reflexes', result: 'Intact bilaterally. Biceps and triceps reflexes normal and symmetric. No arm tingling.', valence: 'neg' },
          ]},
        ],
        intermediate: [
          { name: 'Observation & Posture', items: [
            { name: 'Shoulder posture / muscle bulk', result: 'Mild right supraspinatus / posterior cuff wasting. Forward shoulder posture bilateral. GIRD pattern on right.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Active shoulder ROM (all planes)', result: 'Full elevation pain-free. IR right 55° (left 75°) — significant GIRD. Cross-body adduction restricted and painful right.', valence: 'pos' },
            { name: 'Passive glenohumeral IR (sleeper stretch position)', result: 'Restricted right — 45° vs 70° left. Posterior capsular contracture confirmed.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Bicipital groove palpation (10° IR)', result: 'Exquisite tenderness over bicipital groove at 10° internal rotation. Reproduces familiar anterior shoulder pain.', valence: 'pos' },
            { name: 'Supraspinatus / posterior cuff palpation', result: 'Mild posterior cuff tenderness consistent with chronic overload pattern. No focal AC or GH joint tenderness.', valence: 'neutral' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Speed\'s test', result: 'Positive — anterior shoulder pain with resisted forward flexion. LHB tendon implicated.', valence: 'pos' },
            { name: 'Yergason\'s test', result: 'Positive — pain at bicipital groove with resisted supination. Confirms LHB involvement.', valence: 'pos' },
            { name: 'External rotation lag test', result: 'Negative — no lag, full ER strength. Full-thickness RC tear excluded.', valence: 'neg' },
            { name: 'Apprehension / relocation test', result: 'Negative — no instability or apprehension. GH instability excluded.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Upper limb tension test / sensation', result: 'Negative bilaterally. No cervical neural contribution identified.', valence: 'neg' },
          ]},
        ],
        advanced: [
          { name: 'Observation & Posture', items: [
            { name: 'Shoulder observation / muscle bulk', result: 'Significant supraspinatus and infraspinatus fossa wasting right shoulder. Held in protected internal rotation and adduction.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Active shoulder elevation', result: 'Active: 30° before shrug substitution. Passive: 155° with pain. Significant active–passive discrepancy — suggests structural failure.', valence: 'pos' },
            { name: 'Active ER / IR', result: 'Active ER: severely limited (15°). Passive ER: 60° — pain at end range. IR full.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Supraspinatus / greater tuberosity palpation', result: 'Exquisite tenderness over supraspinatus insertion and greater tuberosity. Bony contour change palpable.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'External rotation lag test', result: 'Positive — cannot maintain ER against gravity. Significant lag sign. Full-thickness infraspinatus/supraspinatus tear suspected.', valence: 'pos' },
            { name: 'Drop arm sign', result: 'Positive — arm cannot be lowered slowly from 90°. Massive RC tear pattern.', valence: 'pos' },
            { name: 'Empty can (supraspinatus) strength', result: 'Positive — pain and 3/5 weakness with resisted abduction in scapular plane. Significant rotator cuff deficit.', valence: 'pos' },
            { name: 'GH instability screen', result: 'Negative — no apprehension. Not an instability pattern. Structural tear is the primary diagnosis.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Upper limb sensation and reflexes', result: 'Intact bilaterally. No cervical or axillary nerve involvement identified.', valence: 'neg' },
          ]},
        ],
      },
      Hip: {
        beginner: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait analysis', result: 'Mild antalgic gait. Reduced stride length on right. Slight anterior pelvic tilt during single-leg loading.', valence: 'neutral' },
            { name: 'Lumbar posture', result: 'Increased lumbar lordosis consistent with hip flexor dominance and anterior pelvic tilt.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Hip flexion ROM (active and passive)', result: 'Painful at end-range active hip flexion right (110° vs 125° left). Passive hip flexion full but mild anterior groin discomfort at end range.', valence: 'pos' },
            { name: 'Hip extension ROM (prone)', result: 'Reduced right hip extension — 5° vs 15° left. Iliopsoas tightness confirmed. Key biomechanical contributor.', valence: 'pos' },
            { name: 'Hip IR / ER ROM', result: 'Full range bilaterally. No provocation of groin pain with rotation.', valence: 'neg' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Iliopsoas tendon palpation (medial to ASIS)', result: 'Tender on deep palpation over iliopsoas at the hip crease. Reproduces familiar groin ache.', valence: 'pos' },
            { name: 'Greater trochanter / lateral hip palpation', result: 'No tenderness. Gluteal tendon not the primary pain source.', valence: 'neg' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Resisted hip flexion (seated)', result: 'Right hip flexion 4/5 — pain and weakness with resisted flexion. Confirms iliopsoas load sensitivity.', valence: 'pos' },
            { name: 'Thomas test (hip flexor length)', result: 'Positive right — inability to flatten lumbar spine with right hip extension. Iliopsoas / rectus femoris tightness confirmed.', valence: 'pos' },
            { name: 'FADIR test', result: 'Negative — no sharp groin pain. Intra-articular hip pathology excluded.', valence: 'neg' },
            { name: 'Trendelenburg test', result: 'Positive right — contralateral pelvic drop during right single-leg stance. Gluteus medius weakness present.', valence: 'pos' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation and reflexes', result: 'Intact bilaterally. No lumbar referral pattern identified.', valence: 'neg' },
          ]},
        ],
        intermediate: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait analysis', result: 'Trendelenburg lurch right — lateral trunk deviation over right stance phase. Reduced step length on longer distances.', valence: 'pos' },
            { name: 'Single-leg stance observation', result: 'Positive right at 12 seconds — lateral hip pain reproduced. Left: full 30 seconds pain-free.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Hip flexion / extension ROM', result: 'Full active hip ROM bilaterally. No ROM restriction. Pain is load-sensitive rather than position-sensitive.', valence: 'neg' },
            { name: 'Hip IR / ER ROM', result: 'Full bilaterally. Hip rotation ROM not the driver of symptoms.', valence: 'neg' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Greater trochanter / gluteal tendon palpation', result: 'Significant tenderness on deep palpation over the greater trochanter and gluteal tendon insertions. Reproduces lateral hip pain.', valence: 'pos' },
            { name: 'Adductor origin / groin palpation', result: 'No adductor or groin tenderness. Adductor pathology excluded.', valence: 'neg' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'FADER test (compressive load test)', result: 'Positive — lateral hip pain reproduced with hip flexion, adduction, and ER. Gluteal tendon compression confirmed.', valence: 'pos' },
            { name: 'Hip abductor strength (side-lying)', result: 'Right 3+/5, left 5/5. Significant hip abductor strength deficit on symptomatic side.', valence: 'pos' },
            { name: 'FADIR test', result: 'Mild lateral hip discomfort only — no groin pain. Intra-articular pathology excluded as primary diagnosis.', valence: 'neutral' },
            { name: 'Hip scour / quadrant test', result: 'Negative — no groin pain with axial load and circumduction. Hip OA excluded as primary driver.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation and reflexes', result: 'Intact bilaterally. No lumbar or neural referral pattern.', valence: 'neg' },
          ]},
        ],
        advanced: [
          { name: 'Observation & Gait', items: [
            { name: 'Weight-bearing status / gait', result: 'Significantly antalgic — unable to bear full weight right. Walking with a severe limp. Cannot perform single-leg stance on right without severe pain.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Hip flexion / extension ROM (supine)', result: 'Right hip flexion 80° (pain-limited). Extension minimal — severe pain prevents prone positioning. All hip movements painful.', valence: 'pos' },
            { name: 'Hip IR / ER ROM', result: 'IR and ER both restricted and painful. Log roll test positive — deep groin pain with passive rotation.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Femoral neck / groin palpation', result: 'Deep anterior groin tenderness on palpation. Percussion along femoral shaft reproduces deep groin pain.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Fulcrum test', result: 'Strongly positive — deep groin pain reproduced with examiner\'s arm as fulcrum under distal femur. High sensitivity for femoral neck stress fracture.', valence: 'pos' },
            { name: 'Single-leg hop test', result: 'ABORTED — unable to complete. Severe groin pain prevented single-leg loading. Bone stress injury pattern.', valence: 'pos' },
            { name: 'FADIR test', result: 'Positive — deep groin pain. Note: positive in both labral tears AND femoral neck stress fracture. Imaging mandatory to differentiate.', valence: 'pos' },
            { name: 'FABER test', result: 'Positive — deep groin pain. Non-specific at this stage. Cannot exclude structural diagnosis without MRI.', valence: 'pos' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation and reflexes', result: 'Intact bilaterally. No neurological deficit. Urgent imaging required before further assessment.', valence: 'neg' },
          ]},
        ],
      },
      Lumbar: {
        beginner: [
          { name: 'Observation & Posture', items: [
            { name: 'Lumbar posture / movement quality', result: 'Reduced lumbar lordosis. Protective lateral shift right. Movement guarding evident on forward flexion attempt.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Lumbar flexion ROM', result: 'Significantly limited — fingertip to floor 32 cm. Severe pain reproduction at mid-range with protective guarding.', valence: 'pos' },
            { name: 'Lumbar extension ROM', result: 'Limited and painful (15°). Extension increases pain — not a directional preference at this stage.', valence: 'pos' },
            { name: 'Side flexion ROM', result: 'Bilaterally restricted. Right side flexion more limited and painful.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Lumbar paraspinal / joint palpation', result: 'Significant tenderness and hypertonicity L4–S1 bilaterally, right > left. PA pressure reproduces familiar pain at L4/5.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'SLR — Ipsilateral (straight leg raise)', result: 'Negative bilaterally at 75°. No radicular leg pain reproduced. Neural tension not contributing.', valence: 'neg' },
            { name: 'Active SLR (Mens test)', result: 'Pain with active SLR right — suggests lumbopelvic load transfer deficit.', valence: 'neutral' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb myotomes, dermatomes, reflexes', result: 'Intact bilaterally. 5/5 strength all key myotomes. Normal reflexes. No neurological deficit.', valence: 'neg' },
          ]},
        ],
        intermediate: [
          { name: 'Observation & Posture', items: [
            { name: 'Lumbar posture / lateral shift', result: 'Mild protective lateral shift toward the left. Reduced lumbar lordosis. Antalgic posture noted from standing.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Lumbar flexion ROM', result: 'Limited (fingertips to upper shin) with reproduction of right leg pain at mid-range. Peripheralisation noted.', valence: 'pos' },
            { name: 'Lumbar extension ROM', result: 'Limited (20°) but pain centralises slightly with extension — directional preference toward extension noted.', valence: 'neutral' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Lumbar PA spring testing', result: 'Stiffness and pain at L4/5 and L5/S1. L4/5 PA pressure reproduces right leg pain — positive concordant sign.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'SLR — Ipsilateral (straight leg raise)', result: 'Positive right at 45° — reproduction of right posterior thigh and calf pain. Neural tension confirmed.', valence: 'pos' },
            { name: 'Slump test', result: 'Positive right — leg pain reproduced in full slump, eased with cervical extension. Confirms neural mechanosensitivity.', valence: 'pos' },
            { name: 'SI provocation — thigh thrust', result: 'Negative — no posterior pelvic pain. SI joint not the primary driver.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'L4–S1 myotomes', result: 'Right EHL extension 4/5 (L5 myotome). Right ankle plantarflexion 5/5. Right knee extension 5/5.', valence: 'pos' },
            { name: 'Dermatomes / reflexes', result: 'Reduced pin-prick sensation right L5 dermatome (dorsum of foot). Achilles reflex 1+ right, 2+ left. Mild L5 neurological deficit.', valence: 'pos' },
          ]},
        ],
        advanced: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait / weight-bearing', result: 'EMERGENCY PRESENTATION. Bilateral foot drop pattern. Grossly ataxic gait — requires bilateral support. Cannot walk unassisted.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Lumbar ROM (limited assessment)', result: 'Unable to complete full ROM assessment due to pain and neurological deficits. Severe pain with any lumbar movement. Assessment limited to neurological priority.', valence: 'pos' },
          ]},
          { name: 'Neurological Assessment', items: [
            { name: 'Perineal / saddle sensation', result: 'POSITIVE — bilateral reduced pin-prick sensation S3–S5 dermatome (perineum, inner thighs). Cauda equina sign.', valence: 'pos' },
            { name: 'Bilateral lower limb myotomes', result: 'Hip flexors: 4/5 bilateral. Knee extensors: 4/5 bilateral. Ankle DF: 3/5 bilateral. Plantarflexion: 3/5 bilateral.', valence: 'pos' },
            { name: 'Lower limb reflexes', result: 'Patellar reflexes 1+ bilaterally. Achilles reflexes absent bilaterally. UMN signs absent. LMN / cauda equina pattern.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Bladder / bowel function screen', result: 'POSITIVE — patient reports two episodes of urinary retention. Urinary catheterisation performed. Cauda equina syndrome pattern.', valence: 'pos' },
            { name: 'SLR (limited)', result: 'Bilateral positive at 30° — severe bilateral leg pain. Bilateral neural tension. Massive disc herniation pattern.', valence: 'pos' },
          ]},
        ],
      },
      Cervical: {
        beginner: [
          { name: 'Observation & Posture', items: [
            { name: 'Cervical posture / head position', result: 'Significant forward head posture (FHP). Upper cross syndrome pattern — protracted shoulders, chin poke. Measured FHP ~5 cm from plumb line.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Cervical ROM (all planes)', result: 'Rotation: right 65° / left 50° (restricted left). Flexion and extension mildly restricted. Side flexion symmetric but stiff.', valence: 'pos' },
            { name: 'Cervical quadrant test', result: 'Mild posterior neck ache with right extension-rotation combined. No arm symptoms reproduced.', valence: 'neutral' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Posterior cervical / suboccipital palpation', result: 'Significant tenderness and hypertonicity C1–C3 right, bilateral upper trapezius and suboccipital muscles. Palpation reproduces right-sided headache.', valence: 'pos' },
            { name: 'C4–C7 joint palpation (PA spring)', result: 'Stiffness and local pain at C5/C6 right. No arm referral reproduced.', valence: 'neutral' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Spurling\'s test', result: 'Negative — no arm pain or paresthesia with compression and lateral flexion. No nerve root compromise.', valence: 'neg' },
            { name: 'Cranio-cervical flexion test (CCFT)', result: 'Positive — unable to maintain pressure beyond 24 mmHg without superficial muscle substitution (SCM visible). Deep neck flexor endurance deficit.', valence: 'pos' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Upper limb sensation and reflexes', result: 'Intact bilaterally. Biceps, brachioradialis, triceps reflexes normal. No upper limb neurological deficit.', valence: 'neg' },
          ]},
        ],
        intermediate: [
          { name: 'Observation & Posture', items: [
            { name: 'Cervical posture / muscle bulk', result: 'Forward head posture. Mild right-side neck muscle guarding and hypertonicity. No visible wasting.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Cervical ROM (all planes)', result: 'Right rotation limited to 55° (normal 70°) with end-range right arm pain reproduction. Extension limited 35° with arm symptom provocation.', valence: 'pos' },
            { name: 'Cervical distraction test', result: 'Positive — right arm pain eases with manual cervical traction. Supports foraminal/root mechanism.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'C5–C7 PA spring testing (right)', result: 'Stiffness and right arm referral reproduction at C5/6 and C6/7 PA pressure. Concordant sign for disc/foraminal involvement.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Spurling\'s test', result: 'Positive right — right arm burning pain reproduced with ipsilateral cervical compression and lateral flexion. C6 or C7 nerve root compromised.', valence: 'pos' },
            { name: 'ULTT1 (median nerve)', result: 'Positive right at 45° shoulder abduction — right forearm and thumb/index paresthesia reproduced. Median nerve mechanosensitivity confirmed.', valence: 'pos' },
            { name: 'Shoulder abductor relief sign', result: 'Positive — arm pain reduced with hand placed on head. Foraminal decompression pattern.', valence: 'pos' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'C6 / C7 myotomes and reflexes', result: 'Mild right wrist extension weakness (4+/5 — C6/7). Brachioradialis reflex 1+ right vs 2+ left. Mild C6 neurological deficit pattern.', valence: 'pos' },
            { name: 'Dermatomes (C5–T1)', result: 'Reduced pin-prick sensation right thumb and index finger (C6 distribution). Confirms C6 root involvement.', valence: 'pos' },
          ]},
        ],
        advanced: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait and balance assessment', result: 'Wide-based, unsteady gait. Positive Romberg sign. Unable to tandem walk. Gross proprioceptive deficit. UPPER MOTOR NEURON PATTERN.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Cervical ROM', result: 'Reduced all planes — guarded. Lhermitte\'s sign POSITIVE — electric shock sensation down the spine with cervical flexion. Cord irritation confirmed.', valence: 'pos' },
          ]},
          { name: 'Neurological Assessment', items: [
            { name: 'Upper limb reflexes', result: 'HYPERREFLEXIA — biceps and triceps reflexes 3+ bilaterally. Inverted supinator reflex present. Upper motor neuron signs confirmed.', valence: 'pos' },
            { name: 'Hoffmann\'s sign', result: 'POSITIVE bilaterally — reflex finger flexion on flicking middle finger nail. Confirms upper motor neuron involvement.', valence: 'pos' },
            { name: 'Lower limb reflexes', result: 'Knee and ankle reflexes 3+ bilaterally. Bilateral clonus (4+ beats). Significant UMN signs in lower limbs.', valence: 'pos' },
            { name: 'Babinski / plantar response', result: 'POSITIVE bilaterally — upgoing toes. Pathological UMN sign confirmed.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Grip-release test (10 seconds)', result: 'Positive — fewer than 20 grip-release cycles in 10 seconds bilaterally. Cervical myelopathy hand sign confirmed.', valence: 'pos' },
            { name: 'Bilateral upper limb sensation', result: 'Reduced bilateral hand sensation — glove distribution. Bilateral hand clumsiness with button and pen tests. Central cord pattern.', valence: 'pos' },
          ]},
        ],
      },
      Thoracic: {
        beginner: [
          { name: 'Observation & Posture', items: [
            { name: 'Thoracic posture / kyphosis', result: 'Increased thoracic kyphosis. Mild right-sided thoracic paraspinal guarding. Forward shoulder posture. Reduced thoracic mobility on visual assessment.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Thoracic rotation ROM (seated)', result: 'Right rotation limited 22° (normal ~40°). Left 35°. Stiff and painful at end range right. Symptomatic side restricted.', valence: 'pos' },
            { name: 'Thoracic flexion / extension', result: 'Flexion restricted 50% range — familiar interscapular ache. Extension mildly restricted but pain-relieving at end range.', valence: 'neutral' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Thoracic PA spring testing (T5–T8)', result: 'Significant stiffness and local pain at T5–T7. PA at T6 reproduces right interscapular pain — concordant response.', valence: 'pos' },
            { name: 'Costovertebral joint palpation', result: 'Tender over right costovertebral joints T5–T7. Rotation of those ribs reproduces local pain.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Rib compression test (lateral)', result: 'Negative — no pain with lateral rib compression. Rib fracture excluded.', valence: 'neg' },
            { name: 'Scapular stability assessment', result: 'Positive — right scapular winging and reduced lower trapezius activity noted on resisted arm elevation.', valence: 'pos' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Upper and lower limb neurological screen', result: 'Intact bilaterally. No radicular or myelopathic signs. Serious pathology features absent.', valence: 'neg' },
          ]},
        ],
        intermediate: [
          { name: 'Observation & Posture', items: [
            { name: 'Thoracic posture / kyphosis', result: 'Significant thoracic hyperkyphosis — measured kyphosis angle increased. Bilateral scapular protraction. Forward head posture. Upper cross syndrome.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Thoracic rotation ROM (seated)', result: 'Bilaterally restricted — right 25°, left 28° (normal ~40°). Stiffness is the predominant symptom rather than pain. Familiar tightness at end range.', valence: 'pos' },
            { name: 'Deep breathing / thoracic expansion', result: 'Mildly reduced chest expansion bilaterally (measured 3 cm vs normal 4–6 cm). Consistent with thoracic mobility restriction.', valence: 'neutral' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Thoracic PA spring testing (T3–T7)', result: 'Generalised stiffness T3–T7 bilateral — symmetrically restricted. Pain provocation at T4/5 and T5/6.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Thoracic mobility screen (FABER equivalent)', result: 'Positive — significant restrictions at T4–T6 with palpation-confirmed hypomobility.', valence: 'pos' },
            { name: 'Rib compression test (lateral)', result: 'Negative — no rib pain. Rib fracture excluded.', valence: 'neg' },
            { name: 'Neurodynamic screen (ULTT1)', result: 'Negative bilaterally — no arm symptoms. Thoracic outlet and cervical neural involvement excluded.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Upper and lower limb neurological screen', result: 'Intact bilaterally. No neurological deficit. Bilateral normal reflexes. No myelopathic signs.', valence: 'neg' },
          ]},
        ],
        advanced: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait and movement observation', result: 'URGENT PRESENTATION. Spastic scissor gait pattern. Wide-based, stiff, effortful walking. Consistent with thoracic myelopathy.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Thoracic spinous process percussion', result: 'POSITIVE — exquisite focal bony tenderness at T7/T8 on direct percussion. Highly consistent with vertebral metastasis or pathological fracture.', valence: 'pos' },
          ]},
          { name: 'Neurological Assessment', items: [
            { name: 'Sensory level testing (pin-prick)', result: 'POSITIVE — bilateral reduced sensation from T8 dermatome inferiorly. Clear sensory level at T8. Confirms cord compression at this level.', valence: 'pos' },
            { name: 'Lower limb reflexes', result: 'HYPERREFLEXIA — knee and ankle reflexes 3+ bilaterally. Bilateral ankle clonus present. Bilateral Babinski positive. Upper motor neuron signs.', valence: 'pos' },
            { name: 'Bladder / bowel function screen', result: 'POSITIVE — urinary urgency and two incontinence episodes in past week. Sphincter dysfunction — MSCC criteria met.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Slump test (neural tension)', result: 'Positive bilateral — bilateral leg symptoms reproduced. Combined with UMN signs, confirms cord-level pathology. MANUAL THERAPY CONTRAINDICATED.', valence: 'pos' },
          ]},
        ],
      },
      Elbow: {
        beginner: [
          { name: 'Observation', items: [
            { name: 'Elbow observation / carrying angle', result: 'No swelling. Normal carrying angle. No bruising. No deformity. Held in mild flexion (30°) protective posture.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Elbow flexion / extension ROM', result: 'Full and pain-free bilaterally. No restriction. Pain is load-specific, not position-specific.', valence: 'neg' },
            { name: 'Forearm pronation / supination', result: 'Full and pain-free bilaterally. Rotation not provocative.', valence: 'neg' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Lateral epicondyle / ECRB palpation', result: 'Exquisite point tenderness at the ECRB footprint — just anterior and distal to the lateral epicondyle. Reproduces familiar elbow ache.', valence: 'pos' },
            { name: 'Radial tunnel zone (4 cm distal)', result: 'No tenderness 4 cm distal to epicondyle. Radial tunnel / posterior interosseous nerve not implicated.', valence: 'neg' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Cozen\'s test', result: 'Positive — lateral elbow pain with resisted wrist extension in pronation. ECRB load sensitivity confirmed.', valence: 'pos' },
            { name: 'Mill\'s test', result: 'Positive — pain at lateral epicondyle with passive wrist flexion and elbow extension (stretching ECRB).', valence: 'pos' },
            { name: 'Grip strength dynamometry', result: 'Right: 28 kg, Left: 44 kg. 36% deficit symptomatic side. Functional impairment confirmed.', valence: 'pos' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Upper limb sensation and reflexes', result: 'Intact bilaterally. No radial, median, or ulnar nerve involvement. No cervical radiculopathy features.', valence: 'neg' },
          ]},
        ],
        intermediate: [
          { name: 'Observation', items: [
            { name: 'Elbow observation', result: 'Mild medial elbow fullness. No bruising. No deformity. Mild protective flexion posture.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Elbow flexion / extension ROM', result: 'Full and pain-free. Extension: 0°. Flexion: 140°. No restriction.', valence: 'neg' },
            { name: 'Wrist flexion / extension ROM', result: 'Full and pain-free. Passive wrist extension does reproduce mild medial elbow ache at end range.', valence: 'neutral' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Medial epicondyle / common flexor origin', result: 'Significant tenderness at the common flexor-pronator origin. Reproduces familiar medial elbow pain.', valence: 'pos' },
            { name: 'Ulnar nerve / cubital tunnel palpation', result: 'Mild tenderness over the ulnar nerve posterior to medial epicondyle. Tingling in ring/little finger with palpation.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Resisted wrist flexion (medial epicondyle origin)', result: 'Positive — medial elbow pain reproduced with resisted wrist flexion. Flexor-pronator tendon load sensitivity confirmed.', valence: 'pos' },
            { name: 'Elbow flexion test (cubital tunnel)', result: 'Positive — ring/little finger tingling after 60 seconds of sustained elbow flexion. Cubital tunnel involvement present.', valence: 'pos' },
            { name: 'Moving valgus stress test', result: 'Negative — no medial laxity or instability reproduced. UCL integrity maintained.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Ulnar nerve sensory distribution', result: 'Mildly reduced pin-prick sensation ring and little finger right. Consistent with cubital tunnel neural involvement.', valence: 'pos' },
            { name: 'Ulnar intrinsic strength', result: 'Mild right interossei weakness (finger abduction 4+/5). Early ulnar motor involvement.', valence: 'pos' },
          ]},
        ],
        advanced: [
          { name: 'Observation', items: [
            { name: 'Elbow observation / deformity', result: 'Positive "Popeye sign" — biceps muscle belly bunched toward shoulder. Significant anterior elbow bruising. Ecchymosis extending to forearm. Marked swelling.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Elbow flexion / extension ROM', result: 'Flexion: 0–120° (pain-limited). Extension: full. Flexion strength markedly reduced.', valence: 'pos' },
            { name: 'Forearm supination ROM and strength', result: 'Supination range full but SEVERELY WEAK and painful. Resisted supination 2/5. Distal biceps function severely compromised.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Distal biceps tendon palpation (anterior fossa)', result: 'POSITIVE — palpable gap/absence at the distal biceps tendon insertion in the antecubital fossa. No tendon palpable. Confirms complete rupture.', valence: 'pos' },
            { name: 'Biceps squeeze test (Hook test)', result: 'POSITIVE — cannot hook finger under distal biceps tendon. Confirms complete distal biceps tendon rupture.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Resisted elbow flexion strength', result: 'Right elbow flexion 4/5 (brachialis compensating). Significantly reduced compared to contralateral limb.', valence: 'pos' },
            { name: 'Lateral epicondyle / MCL screen', result: 'No lateral elbow tenderness. No medial instability. Isolated distal biceps tendon injury confirmed.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Radial / median / ulnar nerve screen', result: 'Intact bilaterally. No nerve entrapment. Neurovascularly intact.', valence: 'neg' },
          ]},
        ],
      },
      Ankle: {
        beginner: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait analysis / weight-bearing', result: 'Antalgic gait — reduced push-off right. Mild lateral ankle swelling. Ecchymosis over lateral malleolus. Able to weight-bear with limp.', valence: 'neutral' },
            { name: 'Swelling / bruising assessment', result: 'Localised swelling over ATFL region. Grade I–II ecchymosis. No bony tenderness noted on initial inspection.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Ankle dorsiflexion / plantarflexion ROM', result: 'Dorsiflexion: 8° right (15° left) — restricted and mildly painful. Plantarflexion: full and pain-free.', valence: 'neutral' },
            { name: 'Inversion / eversion ROM', result: 'Inversion restricted 50% and painful at end range (reproduces lateral ankle pain). Eversion full and pain-free.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'ATFL / lateral ligament complex palpation', result: 'Significant tenderness over ATFL (anterior talofibular ligament) — reproduces familiar lateral ankle pain. CFL mildly tender.', valence: 'pos' },
            { name: 'Ottawa ankle rules assessment', result: 'Negative — no posterior malleolar or navicular bone tenderness. Able to weight-bear 4 steps. Fracture excluded clinically.', valence: 'neg' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Anterior drawer test (ankle)', result: 'Positive right — anterior talar translation present with soft end-feel compared to left. ATFL laxity confirmed.', valence: 'pos' },
            { name: 'Talar tilt test', result: 'Negative — no asymmetric talar tilt. CFL integrity maintained. Grade I-II ATFL sprain likely.', valence: 'neg' },
            { name: 'Single-leg balance test', result: 'Right single-leg balance 8 seconds (left 25+ seconds). Significant proprioceptive deficit post-sprain.', valence: 'pos' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation / peroneal screen', result: 'Intact bilaterally. No peroneal nerve involvement. Neurovascularly intact.', valence: 'neg' },
          ]},
        ],
        intermediate: [
          { name: 'Observation & Gait', items: [
            { name: 'Gait analysis', result: 'Antalgic gait — restricted push-off and toe-off. Mild anterior ankle swelling. Cautious landing pattern.', valence: 'neutral' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Ankle dorsiflexion with ER provocation', result: 'Pain reproduced with combined dorsiflexion and external rotation at 15°. Positive DF-ER stress test for syndesmosis.', valence: 'pos' },
            { name: 'Ankle plantarflexion / inversion', result: 'Full and pain-free plantarflexion and inversion. Lateral ligament complex not the primary structure.', valence: 'neg' },
          ]},
          { name: 'Palpation', items: [
            { name: 'AITFL palpation (anterior syndesmosis)', result: 'Exquisite tenderness over the AITFL — 1 cm proximal and anterior to fibula. Reproduces familiar anterior ankle pain.', valence: 'pos' },
            { name: 'Lateral malleolus / ATFL palpation', result: 'Mild ATFL tenderness but NOT the primary pain site. Lateral ligament not the primary structure.', valence: 'neutral' },
            { name: 'Proximal fibula palpation (Maisonneuve screen)', result: 'No proximal fibula tenderness. Maisonneuve fracture excluded. AITFL disruption without associated fracture.', valence: 'neg' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Squeeze test (fibular compression)', result: 'Positive — proximal fibular compression reproduces distal anterolateral ankle pain. Syndesmosis injury confirmed.', valence: 'pos' },
            { name: 'External rotation stress test', result: 'Positive — dorsiflexion with passive ER reproduces anterolateral ankle pain. Syndesmosis load sensitivity confirmed.', valence: 'pos' },
            { name: 'Anterior drawer test (ATFL)', result: 'Negative — no anterior talar translation. ATFL intact. Confirms isolated syndesmosis injury.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation / reflexes', result: 'Intact bilaterally. No neurological deficit.', valence: 'neg' },
          ]},
        ],
        advanced: [
          { name: 'Observation & Gait', items: [
            { name: 'Observation at rest', result: 'NON-WEIGHT-BEARING on crutches. Significant posterior ankle and heel bruising. Diffuse swelling posterior and lateral ankle. Held in mild plantarflexion.', valence: 'pos' },
          ]},
          { name: 'ROM / Movement', items: [
            { name: 'Ankle plantarflexion (active)', result: 'Severely limited active plantarflexion — 5° only. No power through range. Passive plantarflexion 30° with loss of spring feel.', valence: 'pos' },
            { name: 'Single heel raise test', result: 'UNABLE — cannot load through the ankle. Single heel raise not possible. Complete plantarflexion power loss.', valence: 'pos' },
          ]},
          { name: 'Palpation', items: [
            { name: 'Achilles tendon palpation', result: 'POSITIVE — palpable gap in Achilles tendon approximately 4–5 cm proximal to calcaneal insertion. Confirms complete tendon disruption.', valence: 'pos' },
            { name: 'Thompson test', result: 'POSITIVE — no ankle plantarflexion with calf squeeze. Complete Achilles tendon rupture confirmed.', valence: 'pos' },
          ]},
          { name: 'Special Tests', items: [
            { name: 'Palpation of tendon gap level', result: 'Maximum gap at mid-portion level (4–6 cm proximal to insertion). Mid-portion rupture pattern. Insertional rupture excluded.', valence: 'pos' },
            { name: 'Ottawa ankle rules', result: 'Negative for fracture — no bony malleolar or midfoot tenderness. Soft tissue injury confirmed. Achilles rupture pattern.', valence: 'neg' },
          ]},
          { name: 'Neurological Screen', items: [
            { name: 'Lower limb sensation / sural nerve screen', result: 'Intact bilaterally. No sural nerve involvement. Neurovascularly intact.', valence: 'neg' },
          ]},
        ],
      },
    };

    const regionE = E[region];
    if (!regionE) {
      return [
        { name: 'Observation', items: [{ name: 'General presentation', result: 'Mild guarding and protective posturing noted.', valence: 'neutral' }] },
        { name: 'ROM / Movement', items: [{ name: 'Primary movement testing', result: 'Reproduction of primary symptoms with end-range loading.', valence: 'pos' }] },
        { name: 'Special Tests', items: [{ name: 'Screening', result: level === 'advanced' ? 'Concerning findings requiring escalation.' : 'No major deficits on brief screen.', valence: level === 'advanced' ? 'pos' : 'neg' }] }
      ];
    }
    const levelE = regionE[level];
    if (!levelE) return regionE['beginner'];

    // Each level has 3 identical exam sets (seeds differ by vignette/demographics, not exam)
    return levelE;
  }

  function makeAdditionalTests(level, region) {
    const regionTests = {
      'Knee':     [{name:'Patellar grind test',result:'Negative — no crepitus or pain with patellar compression.',valence:'neg'},{name:'Valgus stress test (0° and 30°)',result:'Negative — no medial joint opening. MCL intact.',valence:'neg'},{name:'Trendelenburg test',result:'Positive — contralateral pelvic drop confirms hip abductor weakness contributing to knee loading.',valence:'pos'},{name:'Thomas test',result:'Mildly positive — hip flexor tightness identified as a biomechanical contributor.',valence:'pos'}],
      'Shoulder': [{name:'External rotation lag test',result:'Negative — no lag, full strength at end-range ER. Full-thickness RC tear excluded.',valence:'neg'},{name:'Apprehension test',result:'Negative — no instability or apprehension with ER. GH instability excluded.',valence:'neg'},{name:'O\u2019Brien test (SLAP)',result:'Equivocal — mild discomfort but no reduction on supination. Not conclusive for SLAP.',valence:'neutral'},{name:'Posterior capsule tightness',result:'Positive — restriction on cross-body adduction. Posterior capsular tightness contributing to mechanics.',valence:'pos'}],
      'Hip':      [{name:'FADIR test',result:'Negative — no groin pain with flexion, adduction, internal rotation. Intra-articular hip pathology excluded.',valence:'neg'},{name:'FABER test',result:'Negative — no groin or SI pain. Hip and SI joint pathology not implicated.',valence:'neg'},{name:'Single-leg stance (20 sec)',result:'Positive — lateral hip pain reproduced within 15 seconds. Confirms load-sensitive gluteal/hip tendon involvement.',valence:'pos'},{name:'Hip scour test',result:'Negative — no groin pain or catching with circumduction under load.',valence:'neg'}],
      'Lumbar':   [{name:'SLR — Ipsilateral',result:'Negative at 80° bilaterally — no radicular leg pain. Disc herniation excluded.',valence:'neg'},{name:'Slump test',result:'Negative — no neural tension signs. Radiculopathy excluded.',valence:'neg'},{name:'SI provocation — thigh thrust',result:'Negative — no posterior pelvic pain. SI joint dysfunction not the primary driver.',valence:'neg'},{name:'Prone instability test',result:'Positive — pain reduced with active extension. Suggests segmental instability component.',valence:'pos'}],
      'Cervical': [{name:"Spurling's test",result:'Negative — no arm pain with cervical compression. Radiculopathy excluded.',valence:'neg'},{name:'ULTT1 (median nerve)',result:'Negative bilaterally — no arm symptoms. Neurodynamic involvement excluded.',valence:'neg'},{name:'Cervical flexion-rotation test',result:'Restricted rotation to the symptomatic side at C1/C2. Supports upper cervical joint contribution.',valence:'pos'},{name:'Cranio-cervical flexion test',result:'Positive — deep neck flexor endurance deficit confirmed. Motor control impairment present.',valence:'pos'}],
      'Thoracic': [{name:'Rib compression test (lateral)',result:'Negative — no rib pain with lateral compression. Rib fracture excluded.',valence:'neg'},{name:'Scapular assistance test',result:'Positive — passive scapular upward rotation reduces pain. Scapular stabiliser weakness confirmed.',valence:'pos'},{name:'Slump test',result:'Negative — no distal neural tension signs. Thoracic disc herniation excluded.',valence:'neg'},{name:'Thoracic rotation mobility',result:'Restricted bilaterally. Reduced segmental mobility at symptomatic levels confirmed.',valence:'pos'}],
      'Elbow':    [{name:'Radial tunnel screen (4 cm distal)',result:'Negative — no tenderness at radial tunnel. Posterior interosseous nerve entrapment excluded.',valence:'neg'},{name:'Grip strength dynamometry',result:'Significant deficit on symptomatic side. Confirms functional impairment from tendinopathy.',valence:'pos'},{name:'Elbow flexion test',result:'Negative — no ulnar tingling with sustained flexion. Cubital tunnel syndrome excluded.',valence:'neg'},{name:"Tinel's sign (ulnar nerve)",result:'Negative — no paresthesia with ulnar groove tapping. Ulnar neuropathy excluded.',valence:'neg'}],
      'Ankle':    [{name:'Anterior drawer test (ankle)',result:'Negative — firm end-feel, no anterior talar translation. ATFL intact.',valence:'neg'},{name:'Talar tilt test',result:'Negative — no asymmetric talar tilt. CFL intact.',valence:'neg'},{name:"Tinel's sign (posterior tibial nerve)",result:'Negative — no tingling posterior to medial malleolus. Tarsal tunnel syndrome excluded.',valence:'neg'},{name:'Navicular drop test',result:'Positive — excessive navicular drop identified. Pronation contributing to load distribution.',valence:'pos'}],
    };
    const tests = (regionTests[region] || regionTests['Knee']).slice();
    // Same-region distractors: plausible-looking but not indicated for this specific presentation
    const distractorMap = {
      'Knee':     { name: 'Patellar tap test (effusion)',        result: 'Negative \u2014 no ballotable effusion. Intra-articular swelling absent, pointing away from acute structural joint pathology.', valence: 'neg' },
      'Shoulder': { name: 'Lift-off test (subscapularis)',       result: 'Negative \u2014 able to lift hand off lower back against resistance. Subscapularis not implicated in this presentation.', valence: 'neg' },
      'Hip':      { name: 'Inguinal canal palpation',            result: 'Negative \u2014 no inguinal canal tenderness or Valsalva pain. Sports hernia / athletic pubalgia excluded.', valence: 'neg' },
      'Lumbar':   { name: 'Femoral nerve tension test',          result: 'Negative \u2014 no anterior thigh pain with prone knee bend. L2/L3/L4 roots not involved.', valence: 'neg' },
      'Cervical': { name: 'Adson test (thoracic outlet)',        result: 'Negative \u2014 no pulse change or arm symptoms. Thoracic outlet syndrome excluded.', valence: 'neg' },
      'Thoracic': { name: 'ULTT1 (median nerve)',                result: 'Negative bilaterally \u2014 no arm symptoms reproduced. Cervical or thoracic outlet neural involvement excluded.', valence: 'neg' },
      'Elbow':    { name: 'Resisted supination (radial tunnel)', result: 'Negative \u2014 no pain at radial tunnel with resisted supination. Posterior interosseous nerve entrapment excluded.', valence: 'neg' },
      'Ankle':    { name: 'Ottawa ankle rules assessment',       result: 'Negative \u2014 no malleolar bone tenderness, able to weight-bear 4 steps. Fracture excluded. Soft tissue injury pattern.', valence: 'neg' },
    };
    const dist = distractorMap[region] || { name: 'Differential screen', result: 'Negative \u2014 no additional findings.', valence: 'neg' };
    tests.push({ name: dist.name, result: dist.result, valence: dist.valence, isDistractor: true });
    return tests;
  }

  const GENERATED_CASE_ID_RE = /^[bia][A-Z][0-9]{2}$/;

  function _deepClone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function _caseLibraryPlainText(html) {
    return String(html || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function _durationFromOnsetText(onsetText, fallbackDuration) {
    const txt = String(onsetText || '').toLowerCase().replace(/-/g, ' ');
    if (!txt) return fallbackDuration || '';
    const nMatch = txt.match(/(\d+(?:\.\d+)?)/);
    const n = nMatch ? parseFloat(nMatch[1]) : null;
    if (/hour|day|week/.test(txt)) return 'Acute';
    if (/month/.test(txt)) {
      if (n !== null && n <= 3) return 'Subacute';
      return 'Chronic';
    }
    if (/year/.test(txt)) return 'Chronic';
    return fallbackDuration || '';
  }

  function _deriveInfoFromVignette(vignette, fallbackInfo) {
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

    const plain = _caseLibraryPlainText(vignette || '');
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
      out.duration = _durationFromOnsetText(out.onset, out.duration);
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
      // Guard against sex/demographic tokens being misread as occupation.
      if (/^(?:male|female|man|woman|patient|person)$/i.test(occupation)) return '';
      occupation = occupation.replace(/^(?:male|female|man|woman)\b[\s,/:-]*/i, '').trim();
      if (!occupation || /^(?:patient|person)$/i.test(occupation)) return '';
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

  function _dxKey(v) {
    return String(v || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function _dxKeySet(name, aliases) {
    const keys = new Set();
    const list = [name].concat(Array.isArray(aliases) ? aliases : []);
    list.forEach(label => {
      const key = _dxKey(label);
      if (key) keys.add(key);
    });
    return keys;
  }

  function _regionMatches(caseRegion, targetRegion) {
    return String(caseRegion || '').includes(targetRegion);
  }

  function _buildTemplateCandidate(region, profileLevel, seedIndex) {
    const bank = DX_BANK[region][profileLevel];
    const vignette = makeVignette(profileLevel, region, seedIndex);
    const fallbackInfo = makeInfo(profileLevel, seedIndex);
    return {
      title: `${region} Case ${String(seedIndex + 1).padStart(2, '0')}`,
      info: _deriveInfoFromVignette(vignette, fallbackInfo),
      dxName: bank.name,
      dxAliases: _deepClone(bank.aliases || []),
      redFlags: _deepClone(redFlagList(profileLevel, region)),
      vignette,
      examCategories: _deepClone(makeExam(profileLevel, region)),
      additionalTests: _deepClone(makeAdditionalTests(profileLevel, region)),
      keyDifferentials: ['Alternative musculoskeletal pathology', 'Neural involvement', 'Referred pain source'],
      keyFindings: [{ icon: '✓', text: '<strong>Pattern recognition</strong> - symptoms and exam align with the intended presentation.' }],
      rubric: baseRubric(bank.name),
      expertReasoningPrompt: `This is a ${profileLevel} ${region} template case designed to assess pattern recognition, differential reasoning, and appropriate management including red flag screening.`
    };
  }

  function _buildRegionCandidatePool(region, seedIndex) {
    const pool = [];

    // 1) Template candidates from all levels for broad diagnosis variety.
    LEVELS.forEach((profileLevel, idx) => {
      pool.push(_buildTemplateCandidate(region, profileLevel, (seedIndex + idx) % 3));
    });

    // 2) Curated authored cases from any level for diagnosis-specific realism.
    LEVELS.forEach(srcLevel => {
      (CASE_LIBRARY[srcLevel] || []).forEach(src => {
        if (!src || GENERATED_CASE_ID_RE.test(String(src.id || ''))) return;
        if (!_regionMatches(src.region, region)) return;
        pool.push({
          title: src.title,
          info: _deriveInfoFromVignette(src.vignette, src.info || makeInfo(srcLevel, 0)),
          dxName: src.correctDx,
          dxAliases: _deepClone(src.correctDxAliases || []),
          redFlags: _deepClone(src.redFlags || []),
          vignette: src.vignette,
          examCategories: _deepClone(src.examCategories || []),
          additionalTests: _deepClone(src.additionalTests || []),
          keyDifferentials: _deepClone(src.keyDifferentials || ['Alternative musculoskeletal pathology', 'Neural involvement', 'Referred pain source']),
          keyFindings: _deepClone(src.keyFindings || [{ icon: '✓', text: '<strong>Pattern recognition</strong> - symptoms and exam align with the intended presentation.' }]),
          rubric: _deepClone(src.rubric || baseRubric(src.correctDx || `${region} condition`)),
          expertReasoningPrompt: src.expertReasoningPrompt || `Clinical pattern aligns with ${src.correctDx || `${region} condition`}.`,
        });
      });
    });

    // De-duplicate candidates by diagnosis + aliases while preserving order.
    const seen = new Set();
    return pool.filter(p => {
      const keys = _dxKeySet(p.dxName, p.dxAliases);
      if (!keys.size) return false;
      for (const key of keys) {
        if (seen.has(key)) return false;
      }
      keys.forEach(key => seen.add(key));
      return true;
    });
  }

  function idExists(level, id) {
    return (CASE_LIBRARY[level] || []).some(c => c && c.id === id);
  }

  LEVELS.forEach(level => {
    REGIONS.forEach(region => {
      for (let i = 0; i < 3; i++) {
        const seed = SEEDS[i];
        const prefix = level === 'beginner' ? 'b' : (level === 'intermediate' ? 'i' : 'a');
        const id = `${prefix}${region[0]}${seed.code}`;

        if (idExists(level, id)) continue;

        let bank = DX_BANK[region][level];
        let generatedRedFlags = redFlagList(level, region);
        let generatedVignette = makeVignette(level, region, i);
        let generatedExam = makeExam(level, region);
        let generatedAdditionalTests = makeAdditionalTests(level, region);
        let generatedTitle = `${region} Case ${seed.code}`;
        let generatedInfo = makeInfo(level, i);
        let generatedKeyDifferentials = ['Alternative musculoskeletal pathology', 'Neural involvement', 'Referred pain source'];
        let generatedKeyFindings = [
          { icon: '✓', text: '<strong>Pattern recognition</strong> - symptoms and exam align with the intended presentation.' }
        ];
        let generatedRubric = baseRubric(bank.name);
        let generatedExpertReasoning = `This is a ${level} ${region} template case designed to assess pattern recognition, differential reasoning, and appropriate management including red flag screening.`;

        // Global rule: keep diagnoses unique within each level+region bucket.
        // Pull from a mixed pool (templates + curated region-matched cases) to maximize variety
        // while keeping subjective/objective content diagnosis-consistent.
        if (!(level === 'beginner' && region === 'Knee')) {
          const existingDxKeys = new Set();
          (CASE_LIBRARY[level] || [])
            .filter(c => c && _regionMatches(c.region, region))
            .forEach(c => {
              _dxKeySet(c.correctDx, c.correctDxAliases).forEach(key => existingDxKeys.add(key));
            });
          const candidates = _buildRegionCandidatePool(region, i);
          const rotated = candidates.slice(i).concat(candidates.slice(0, i));
          const picked = rotated.find(p => {
            const keys = _dxKeySet(p.dxName, p.dxAliases);
            for (const key of keys) {
              if (existingDxKeys.has(key)) return false;
            }
            return true;
          });

          if (!picked) continue;

          bank = { name: picked.dxName, aliases: picked.dxAliases && picked.dxAliases.length ? picked.dxAliases : [picked.dxName] };
          generatedTitle = picked.title || generatedTitle;
          generatedInfo = _deepClone(picked.info || generatedInfo);
          generatedRedFlags = _deepClone(picked.redFlags || generatedRedFlags);
          generatedVignette = picked.vignette || generatedVignette;
          generatedExam = _deepClone(picked.examCategories || generatedExam);
          generatedAdditionalTests = _deepClone(picked.additionalTests || generatedAdditionalTests);
          generatedKeyDifferentials = _deepClone(picked.keyDifferentials || generatedKeyDifferentials);
          generatedKeyFindings = _deepClone(picked.keyFindings || generatedKeyFindings);
          generatedRubric = _deepClone(picked.rubric || baseRubric(bank.name));
          generatedExpertReasoning = picked.expertReasoningPrompt || generatedExpertReasoning;
        }

        // Ensure beginner knee generated templates are diagnosis-diverse (no duplicates).
        if (level === 'beginner' && region === 'Knee') {
          const kneeBeginnerCases = [
            {
              title: 'Anterior inferior patellar pain in a volleyball player',
              info: { age: '21', sex: 'Male', occupation: 'Volleyball player', onset: '6 weeks', duration: 'Subacute' },
              dxName: 'Patellar Tendinopathy (Jumper\'s Knee)',
              dxAliases: ['patellar tendinopathy', 'jumper\'s knee', 'patellar tendon', 'inferior pole tendinopathy'],
              redFlags: ['Night pain unrelated to loading', 'Large traumatic effusion', 'True locking', 'Constitutional symptoms'],
              vignette: `<p>A 21-year-old male volleyball player presents with <strong>gradual onset anterior knee pain</strong> at the inferior patellar pole over 6 weeks during a period of increased jumping volume and plyometric work.</p><p>Pain is sharp at take-off and landing (6/10), localised with one finger to the inferior patellar pole, and eases with rest. He has no locking, no giving way, and no major swelling. Pain is worst after back-to-back training days and with deep loaded squats.</p><p>No major trauma. No prior knee surgery. He wants to continue the season and requests a load-managed rehab plan.</p>`,
              examCategories: [
                { name: 'Observation', items: [
                  { name: 'Static alignment', result: 'Mild dynamic valgus tendency on right single-leg tasks. No visible effusion.', valence: 'neutral' },
                  { name: 'Gait', result: 'Normal walking gait. Mild pain on jog acceleration.', valence: 'neutral' },
                ]},
                { name: 'ROM / Movement', items: [
                  { name: 'Knee flexion / extension ROM', result: 'Full ROM. End-range loaded flexion reproduces anterior tendon pain.', valence: 'pos' },
                  { name: 'Deep squat (double-leg)', result: 'Pain rises beyond 60-70 degrees flexion at the inferior patellar pole.', valence: 'pos' },
                ]},
                { name: 'Palpation', items: [
                  { name: 'Patellar tendon palpation (inferior pole)', result: 'Exquisite focal tenderness at inferior patellar pole and proximal tendon insertion.', valence: 'pos' },
                  { name: 'Medial/lateral joint line palpation', result: 'No joint line tenderness.', valence: 'neg' },
                ]},
                { name: 'Special Tests', items: [
                  { name: 'Single-leg decline squat test', result: 'Positive right - familiar tendon pain reproduced, left minimal symptoms.', valence: 'pos' },
                  { name: 'Hop test (single-leg)', result: 'Pain on repeated hops localized to patellar tendon insertion.', valence: 'pos' },
                  { name: 'McMurray test', result: 'Negative - no click or joint line pain.', valence: 'neg' },
                  { name: 'Lachman test', result: 'Negative - firm endpoint, no laxity.', valence: 'neg' },
                ]},
                { name: 'Neurological Screen', items: [
                  { name: 'Lower limb sensation and reflexes', result: 'Intact bilaterally. No neurological deficit.', valence: 'neg' },
                ]},
              ],
              additionalTests: [
                { name: 'Resisted knee extension at 30 degrees', result: 'Positive - focal inferior pole pain with high tendon load.', valence: 'pos' },
                { name: 'Patellar grind test', result: 'Negative - does not reproduce primary pain pattern.', valence: 'neg' },
                { name: 'Valgus stress test (0 and 30 degrees)', result: 'Negative - MCL stable.', valence: 'neg' },
                { name: 'Tibial tuberosity palpation', result: 'Negative - no apophyseal tenderness or bony prominence.', valence: 'neg', isDistractor: true },
              ],
              keyDifferentials: ['Patellofemoral Pain Syndrome (PFPS)', 'Osgood-Schlatter Disease', 'Fat pad impingement'],
              keyFindings: [
                { icon: '✓', text: '<strong>Focal inferior pole tenderness</strong> — localises the pain source to the proximal patellar tendon.' },
                { icon: '✓', text: '<strong>Load-provoked pain with jumping and decline squat</strong> — classic tendon loading pattern.' },
                { icon: '✗', text: '<strong>Negative meniscal and ligament tests</strong> — reduces suspicion of intra-articular and ligament injury.' },
              ],
              expertReasoningPrompt: `The correct diagnosis is Patellar Tendinopathy (Jumper's Knee). The decisive pattern is focal tenderness at the inferior pole of the patella plus pain with high tendon-load tasks (jumping, decline squat, repeated hops), without instability or joint locking. Negative McMurray and Lachman findings reduce suspicion of meniscal or ACL pathology. Management should prioritize load modification and progressive tendon loading rather than complete rest.`,
            },
            {
              title: 'Medial knee pain with catching after a pivot injury',
              info: { age: '29', sex: 'Male', occupation: 'Recreational footballer', onset: '10 days', duration: 'Acute' },
              dxName: 'Meniscal Tear (Medial, Traumatic Pattern)',
              dxAliases: ['meniscal tear', 'meniscus injury', 'medial meniscus tear', 'traumatic meniscal tear'],
              redFlags: ['True locked knee (cannot extend)', 'Large immediate haemarthrosis', 'Inability to weight-bear after trauma', 'Hot swollen joint'],
              vignette: `<p>A 29-year-old male recreational footballer presents with <strong>medial knee pain</strong> after a twisting pivot on a planted foot 10 days ago.</p><p>He reports intermittent catching, pain with turning, and mild swelling after activity. Descending stairs and squatting past 90 degrees are painful. No clear giving way episodes and no previous major knee injury.</p><p>He is weight-bearing but limited with sport and wants a diagnosis-focused plan.</p>`,
              examCategories: [
                { name: 'Observation & Gait', items: [
                  { name: 'Gait analysis', result: 'Mild antalgic gait with reduced stance time on affected side.', valence: 'neutral' },
                  { name: 'Effusion check', result: 'Small joint effusion present.', valence: 'pos' },
                ]},
                { name: 'ROM / Movement', items: [
                  { name: 'Knee flexion ROM', result: 'Painful and restricted in terminal flexion (0-115 degrees).', valence: 'pos' },
                  { name: 'Knee extension ROM', result: 'Near full extension with end-range discomfort, no hard block.', valence: 'neutral' },
                ]},
                { name: 'Palpation', items: [
                  { name: 'Medial joint line palpation', result: 'Exquisite tenderness at medial joint line reproducing primary pain.', valence: 'pos' },
                  { name: 'MCL palpation', result: 'No focal tenderness along superficial MCL fibers.', valence: 'neg' },
                ]},
                { name: 'Special Tests', items: [
                  { name: 'McMurray test (medial)', result: 'Positive - medial joint line pain with rotational loading.', valence: 'pos' },
                  { name: 'Thessaly test (20 degrees)', result: 'Positive - reproduces catching discomfort on rotational weight-bearing.', valence: 'pos' },
                  { name: 'Valgus stress test (0 and 30 degrees)', result: 'Negative - no laxity. MCL sprain less likely.', valence: 'neg' },
                  { name: 'Lachman test', result: 'Negative - firm endpoint, no ACL laxity.', valence: 'neg' },
                ]},
                { name: 'Neurological Screen', items: [
                  { name: 'Distal sensation and reflexes', result: 'Intact and symmetrical.', valence: 'neg' },
                ]},
              ],
              additionalTests: [
                { name: 'Apley compression test', result: 'Positive - medial joint line pain reproduced with tibial rotation under compression.', valence: 'pos' },
                { name: 'Patellar tendon palpation', result: 'Negative - no inferior pole tenderness.', valence: 'neg' },
                { name: 'Posterior drawer test', result: 'Negative - no posterior tibial sag or laxity.', valence: 'neg' },
                { name: 'Patellar apprehension test', result: 'Negative - no instability/apprehension pattern.', valence: 'neg', isDistractor: true },
              ],
              keyDifferentials: ['MCL Sprain', 'ACL Sprain / Tear', 'Patellofemoral Pain Syndrome (PFPS)'],
              keyFindings: [
                { icon: '✓', text: '<strong>Twisting mechanism + medial joint line tenderness</strong> — classic meniscal injury profile.' },
                { icon: '✓', text: '<strong>Positive McMurray and Thessaly tests</strong> — supports meniscal involvement under rotational load.' },
                { icon: '✗', text: '<strong>Negative Lachman and valgus stress tests</strong> — lowers ACL and MCL likelihood.' },
              ],
              expertReasoningPrompt: `The correct diagnosis is a traumatic medial meniscal tear pattern. The combination of pivoting mechanism, medial joint line tenderness, and positive McMurray/Thessaly findings is the key discriminator. The knee is painful but not grossly unstable, and ACL/MCL tests are negative, which helps narrow the diagnosis. Management should focus on irritability-guided loading, swelling control, and criteria-based return to cutting activity.`,
            },
            {
              title: 'Medial proximal tibial pain in a new walking program',
              info: { age: '54', sex: 'Female', occupation: 'Not specified', onset: '7 weeks', duration: 'Subacute' },
              dxName: 'Pes Anserine Bursitis',
              dxAliases: ['pes anserine bursitis', 'anserine bursitis', 'medial proximal tibial bursitis'],
              redFlags: ['Hot swollen knee with fever', 'Rapid unexplained weight loss', 'Night pain not eased by position', 'Acute trauma with inability to weight-bear'],
              vignette: `<p>A 54-year-old female presents with <strong>medial knee pain</strong> for 7 weeks after starting a daily hill-walking program.</p><p>The pain is localised to the inner upper shin area, about 2-3 cm below the knee joint line, and is worse climbing stairs, getting up from low chairs, and at night when lying on that side. No locking, no giving way, and no acute injury.</p><p>She has mild early knee OA on prior imaging and asks if this is a meniscus problem.</p>`,
              examCategories: [
                { name: 'Observation', items: [
                  { name: 'Standing posture', result: 'Mild genu valgum and foot pronation bilaterally.', valence: 'neutral' },
                  { name: 'Gait', result: 'Mildly antalgic on prolonged walking.', valence: 'neutral' },
                ]},
                { name: 'ROM / Movement', items: [
                  { name: 'Knee ROM', result: 'Near full ROM. Mild discomfort at end-range flexion only.', valence: 'neutral' },
                  { name: 'Step-down test', result: 'Medial proximal tibial pain reproduced on repeated step-downs.', valence: 'pos' },
                ]},
                { name: 'Palpation', items: [
                  { name: 'Pes anserine palpation (2-3 cm below medial joint line)', result: 'Maximal focal tenderness with mild local warmth over pes anserine region.', valence: 'pos' },
                  { name: 'Medial joint line palpation', result: 'No clear joint line tenderness.', valence: 'neg' },
                ]},
                { name: 'Special Tests', items: [
                  { name: 'Valgus stress test (0 and 30 degrees)', result: 'Negative - no MCL laxity or medial opening.', valence: 'neg' },
                  { name: 'McMurray test', result: 'Negative - no click or meniscal reproduction.', valence: 'neg' },
                  { name: 'Thessaly test', result: 'Negative to equivocal only, no catching pattern.', valence: 'neg' },
                ]},
                { name: 'Strength & Functional', items: [
                  { name: 'Hip abductor strength (side-lying)', result: 'Mild deficit on symptomatic side (4/5).', valence: 'neutral' },
                  { name: 'Hamstring flexibility', result: 'Bilateral hamstring tightness, symptomatic side greater.', valence: 'pos' },
                ]},
              ],
              additionalTests: [
                { name: 'Resisted knee flexion at 30 degrees', result: 'Mild medial proximal tibial pain, consistent with pes tendon irritation.', valence: 'pos' },
                { name: 'Patellar grind test', result: 'Negative - no clear retropatellar pain pattern.', valence: 'neg' },
                { name: 'Lachman test', result: 'Negative - stable ACL endpoint.', valence: 'neg' },
                { name: 'Joint line compression test', result: 'Negative - does not reproduce primary pain location.', valence: 'neg', isDistractor: true },
              ],
              keyDifferentials: ['MCL Sprain', 'Medial Meniscal Tear', 'Knee Osteoarthritis Flare'],
              keyFindings: [
                { icon: '✓', text: '<strong>Point tenderness distal to the medial joint line</strong> — localizes symptoms to pes anserine bursa/tendon region.' },
                { icon: '✓', text: '<strong>Pain pattern with stairs and prolonged walking</strong> — consistent with load-sensitive anserine irritation.' },
                { icon: '✗', text: '<strong>Negative meniscal and ligament tests</strong> — makes intra-articular and collateral ligament injury less likely.' },
              ],
              expertReasoningPrompt: `The correct diagnosis is Pes Anserine Bursitis. The defining feature is focal tenderness over the medial proximal tibia below the joint line, rather than true joint-line tenderness. Negative McMurray, Thessaly, and valgus stress tests make meniscal and MCL pathology less likely as primary drivers. Management should combine local irritability reduction with progressive hip/knee load tolerance work and flexibility restoration.`,
            },
          ];

          const selected = kneeBeginnerCases[i % kneeBeginnerCases.length];
          if (selected) {
            bank = { name: selected.dxName, aliases: selected.dxAliases };
            generatedTitle = selected.title || generatedTitle;
            generatedInfo = _deepClone(selected.info || generatedInfo);
            generatedRedFlags = Array.isArray(selected.redFlags) ? selected.redFlags.slice() : generatedRedFlags;
            generatedVignette = selected.vignette || generatedVignette;
            generatedExam = Array.isArray(selected.examCategories)
              ? JSON.parse(JSON.stringify(selected.examCategories))
              : generatedExam;
            generatedAdditionalTests = Array.isArray(selected.additionalTests)
              ? JSON.parse(JSON.stringify(selected.additionalTests))
              : generatedAdditionalTests;
            generatedKeyDifferentials = Array.isArray(selected.keyDifferentials)
              ? selected.keyDifferentials.slice()
              : generatedKeyDifferentials;
            generatedKeyFindings = Array.isArray(selected.keyFindings)
              ? JSON.parse(JSON.stringify(selected.keyFindings))
              : generatedKeyFindings;
            generatedRubric = baseRubric(bank.name);
            generatedExpertReasoning = selected.expertReasoningPrompt || generatedExpertReasoning;
          }
        }

        // Lock Shoulder beginner Case 01 primary diagnosis to impingement terminology
        // so debrief wording and scoring labels stay aligned for this template.
        if (id === 'bS01') {
          bank = {
            name: 'Shoulder Impingement Syndrome (Subacromial)',
            aliases: [
              'shoulder impingement',
              'shoulder impingement syndrome',
              'subacromial impingement',
              'subacromial pain syndrome',
              'impingement',
              'rotator cuff tendinopathy',
              'rotator cuff tendinopathy (shoulder tendon pain)',
              'rc tendinopathy',
              'rotator cuff related shoulder pain'
            ]
          };
          generatedRubric = baseRubric(bank.name);
          generatedKeyDifferentials = [
            'Rotator Cuff Tendinopathy (Shoulder Tendon Pain)',
            'Subacromial Bursitis',
            'AC Joint Pathology'
          ];
          generatedExpertReasoning =
            'This template is scored with Shoulder Impingement Syndrome (Subacromial) as the primary diagnosis. Rotator cuff tendinopathy/subacromial pain terms are clinically overlapping and accepted as related terminology.';
        }

        generatedInfo = _deriveInfoFromVignette(generatedVignette, generatedInfo);

        const caseObj = {
          id,
          title: generatedTitle,
          region,
          info: generatedInfo,
          vignette: generatedVignette,
          redFlags: generatedRedFlags,
          examCategories: generatedExam,
          additionalTests: generatedAdditionalTests,
          correctDx: bank.name,
          correctDxAliases: bank.aliases,
          keyDifferentials: generatedKeyDifferentials,
          keyFindings: generatedKeyFindings,
          rubric: generatedRubric,
          expertReasoningPrompt: generatedExpertReasoning
        };

        if (!CASE_LIBRARY[level]) CASE_LIBRARY[level] = [];
        CASE_LIBRARY[level].push(caseObj);
      }
    });
  });

  // Final pass: keep every case's info cards aligned to the authored vignette text.
  LEVELS.forEach(level => {
    (CASE_LIBRARY[level] || []).forEach(c => {
      if (!c || !c.vignette) return;
      c.info = _deriveInfoFromVignette(c.vignette, c.info || {});
    });
  });
}
// Keep level-select meta counts in sync with CASE_LIBRARY
generateCaseLibraryPack3(); // Fill any region/level gaps with generated cases
(function() {
  const tokens = { beginner: 8, intermediate: 6, advanced: 5 };
  const ids = { beginner: 'csMetaBeginner', intermediate: 'csMetaIntermediate', advanced: 'csMetaAdvanced' };
  Object.keys(ids).forEach(level => {
    const el = document.getElementById(ids[level]);
    if (el) el.innerHTML = `${(CASE_LIBRARY[level] || []).length} cases<br>${tokens[level]} tokens each`;
  });
})();
// ══════════════════════════════════════════════════════════════════════════

window.EIDOS_CASES = Object.assign({}, window.EIDOS_CASES || {}, {
  CASE_LIBRARY,
  generateCaseLibraryPack3
});

})();
