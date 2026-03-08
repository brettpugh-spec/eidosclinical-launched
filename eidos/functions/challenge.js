/**
 * Cloudflare Pages Function — /functions/challenge.js
 *
 * V1 challenge-link storage and comparison workflow for EIDOS case simulations.
 *
 * Optional bindings:
 *   CHALLENGE_KV (KV namespace)
 *
 * If CHALLENGE_KV is not configured, an in-memory fallback is used for local/dev
 * sessions (non-durable).
 */

const CHALLENGE_PREFIX = 'challenge:';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function randomToken(byteLength = 24) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function createId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function toAttemptView(attempt) {
  const a = attempt || {};
  const tests = Array.isArray(a.selected_tests)
    ? a.selected_tests.map((t) => ({
        name: t && (t.name || t.test || t.label || ''),
        category: t && t.category ? t.category : '',
        result: t && t.result ? t.result : '',
      }))
    : [];

  return {
    attempt_id: a.attempt_id || '',
    completed_at: a.completed_at || '',
    top_differentials: Array.isArray(a.top_differentials) ? a.top_differentials.filter(Boolean).slice(0, 6) : [],
    selected_tests: tests,
    final_diagnosis: a.final_diagnosis || '',
    final_conclusion: a.final_conclusion || '',
    confidence: Number.isFinite(Number(a.confidence)) ? Number(a.confidence) : null,
    management: a.management || '',
    imaging_suggestion: a.imaging_suggestion || '',
    expert_reasoning_html: a.expert_reasoning_html || '',
  };
}

function toPublicInvite(shareInvite) {
  return {
    id: shareInvite.id,
    token: shareInvite.token,
    created_by_user_id: shareInvite.created_by_user_id || null,
    original_attempt_id: shareInvite.original_attempt_id,
    case_id: shareInvite.case_id,
    created_at: shareInvite.created_at,
    expires_at: shareInvite.expires_at || null,
  };
}

function buildComparison(originalAttempt, invitedAttempt) {
  const original = toAttemptView(originalAttempt);
  const invited = toAttemptView(invitedAttempt);

  const origDdx = (original.top_differentials || []).map((v) => String(v || '').trim()).filter(Boolean);
  const invDdx = (invited.top_differentials || []).map((v) => String(v || '').trim()).filter(Boolean);
  const origTests = (original.selected_tests || []).map((t) => String(t && t.name ? t.name : '').trim()).filter(Boolean);
  const invTests = (invited.selected_tests || []).map((t) => String(t && t.name ? t.name : '').trim()).filter(Boolean);

  const origDdxSet = new Set(origDdx.map(normalizeText).filter(Boolean));
  const invDdxSet = new Set(invDdx.map(normalizeText).filter(Boolean));
  const origTestSet = new Set(origTests.map(normalizeText).filter(Boolean));
  const invTestSet = new Set(invTests.map(normalizeText).filter(Boolean));

  const ddxShared = origDdx.filter((v) => invDdxSet.has(normalizeText(v)));
  const ddxOrigOnly = origDdx.filter((v) => !invDdxSet.has(normalizeText(v)));
  const ddxInvOnly = invDdx.filter((v) => !origDdxSet.has(normalizeText(v)));

  const testsShared = origTests.filter((v) => invTestSet.has(normalizeText(v)));
  const testsOrigOnly = origTests.filter((v) => !invTestSet.has(normalizeText(v)));
  const testsInvOnly = invTests.filter((v) => !origTestSet.has(normalizeText(v)));

  const originalDx = String(original.final_diagnosis || '').trim();
  const invitedDx = String(invited.final_diagnosis || '').trim();
  const diagnosisMatch = !!(originalDx && invitedDx && normalizeText(originalDx) === normalizeText(invitedDx));

  return {
    original_attempt: original,
    invited_attempt: invited,
    agreement: {
      top_differentials: ddxShared,
      selected_tests: testsShared,
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
    generated_at: new Date().toISOString(),
  };
}

function getShareUrlFromRequest(request, token) {
  const url = new URL(request.url);
  const basePath = url.pathname.replace(/\/functions\/challenge\/?$/, '/');
  return `${url.origin}${basePath}?challenge=${encodeURIComponent(token)}`;
}

function getMemoryStore() {
  if (!globalThis.__EIDOS_CHALLENGE_MEM__) {
    globalThis.__EIDOS_CHALLENGE_MEM__ = new Map();
  }
  return globalThis.__EIDOS_CHALLENGE_MEM__;
}

async function storeGet(env, key) {
  if (env && env.CHALLENGE_KV && typeof env.CHALLENGE_KV.get === 'function') {
    const raw = await env.CHALLENGE_KV.get(key);
    return raw ? JSON.parse(raw) : null;
  }
  const mem = getMemoryStore();
  const raw = mem.get(key);
  return raw ? JSON.parse(raw) : null;
}

async function storePut(env, key, value) {
  const raw = JSON.stringify(value);
  if (env && env.CHALLENGE_KV && typeof env.CHALLENGE_KV.put === 'function') {
    await env.CHALLENGE_KV.put(key, raw);
    return;
  }
  const mem = getMemoryStore();
  mem.set(key, raw);
}

function isExpired(shareInvite) {
  if (!shareInvite || !shareInvite.expires_at) return false;
  const expiresMs = Date.parse(shareInvite.expires_at);
  return Number.isFinite(expiresMs) && Date.now() > expiresMs;
}

async function handleCreateInvite(context, body) {
  const { request, env } = context;
  const caseSnapshot = body.case_snapshot;
  const originalAttempt = body.original_attempt;

  if (!caseSnapshot || typeof caseSnapshot !== 'object') {
    return jsonResponse({ ok: false, error: 'missing_case_snapshot' }, 400);
  }
  if (!originalAttempt || typeof originalAttempt !== 'object') {
    return jsonResponse({ ok: false, error: 'missing_original_attempt' }, 400);
  }

  const token = randomToken(24);
  const ownerAccessKey = randomToken(24);
  const now = new Date().toISOString();

  const shareInvite = {
    id: createId(),
    token,
    created_by_user_id: body.created_by_user_id || null,
    original_attempt_id: body.original_attempt_id || originalAttempt.id || createId(),
    case_id: body.case_id || caseSnapshot.id || caseSnapshot.title || 'case',
    case_snapshot: caseSnapshot,
    created_at: now,
    expires_at: body.expires_at || null,
  };

  const record = {
    share_invite: shareInvite,
    owner_access_key: ownerAccessKey,
    original_attempt: originalAttempt,
    challenge_attempts: [],
    comparison: null,
    created_at: now,
    updated_at: now,
  };

  await storePut(env, `${CHALLENGE_PREFIX}${token}`, record);

  return jsonResponse({
    ok: true,
    share_invite: toPublicInvite(shareInvite),
    owner_access_key: ownerAccessKey,
    share_url: getShareUrlFromRequest(request, token),
  });
}

async function handleSubmitAttempt(context, body) {
  const { env } = context;
  const token = String(body.token || '').trim();
  const attempt = body.attempt;

  if (!token) return jsonResponse({ ok: false, error: 'missing_token' }, 400);
  if (!attempt || typeof attempt !== 'object') return jsonResponse({ ok: false, error: 'missing_attempt' }, 400);

  const key = `${CHALLENGE_PREFIX}${token}`;
  const record = await storeGet(env, key);
  if (!record || !record.share_invite) return jsonResponse({ ok: false, error: 'invite_not_found' }, 404);
  if (isExpired(record.share_invite)) return jsonResponse({ ok: false, error: 'invite_expired' }, 410);

  const challengeAttempt = {
    id: createId(),
    share_invite_id: record.share_invite.id,
    user_id: body.user_id || null,
    attempt_id: attempt.attempt_id || createId(),
    completed_at: attempt.completed_at || new Date().toISOString(),
    attempt,
  };

  if (!Array.isArray(record.challenge_attempts)) record.challenge_attempts = [];
  record.challenge_attempts.push(challengeAttempt);

  const comparison = buildComparison(record.original_attempt, challengeAttempt.attempt);
  record.comparison = comparison;
  record.updated_at = new Date().toISOString();

  await storePut(env, key, record);

  return jsonResponse({
    ok: true,
    challenge_attempt: {
      id: challengeAttempt.id,
      share_invite_id: challengeAttempt.share_invite_id,
      user_id: challengeAttempt.user_id,
      attempt_id: challengeAttempt.attempt_id,
      completed_at: challengeAttempt.completed_at,
    },
    comparison,
  });
}

async function handleGetComparison(context, body) {
  const { env } = context;
  const token = String(body.token || '').trim();
  const ownerAccessKey = String(body.owner_access_key || '').trim();

  if (!token) return jsonResponse({ ok: false, error: 'missing_token' }, 400);
  if (!ownerAccessKey) return jsonResponse({ ok: false, error: 'missing_owner_access_key' }, 400);

  const key = `${CHALLENGE_PREFIX}${token}`;
  const record = await storeGet(env, key);
  if (!record || !record.share_invite) return jsonResponse({ ok: false, error: 'invite_not_found' }, 404);
  if (record.owner_access_key !== ownerAccessKey) {
    return jsonResponse({ ok: false, error: 'unauthorized_owner_access' }, 403);
  }

  return jsonResponse({
    ok: true,
    share_invite: toPublicInvite(record.share_invite),
    comparison: record.comparison || null,
    status: record.comparison ? 'completed' : 'pending',
    invite_attempt_count: Array.isArray(record.challenge_attempts) ? record.challenge_attempts.length : 0,
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = String(url.searchParams.get('token') || '').trim();
  if (!token) return jsonResponse({ ok: false, error: 'missing_token' }, 400);

  const record = await storeGet(env, `${CHALLENGE_PREFIX}${token}`);
  if (!record || !record.share_invite) return jsonResponse({ ok: false, error: 'invite_not_found' }, 404);
  if (isExpired(record.share_invite)) return jsonResponse({ ok: false, error: 'invite_expired' }, 410);

  // Important: this route does not expose original attempt data.
  return jsonResponse({
    ok: true,
    share_invite: toPublicInvite(record.share_invite),
    case_snapshot: record.share_invite.case_snapshot,
    share_url: getShareUrlFromRequest(request, token),
  });
}

export async function onRequestPost(context) {
  const { request } = context;

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const action = String(body.action || '').trim();
  if (!action) return jsonResponse({ ok: false, error: 'missing_action' }, 400);

  if (action === 'create_invite') return handleCreateInvite(context, body);
  if (action === 'submit_attempt') return handleSubmitAttempt(context, body);
  if (action === 'get_comparison') return handleGetComparison(context, body);

  return jsonResponse({ ok: false, error: 'unknown_action' }, 400);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
