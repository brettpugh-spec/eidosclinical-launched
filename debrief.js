/**
 * Cloudflare Pages Function — /functions/debrief.js
 *
 * Proxies requests from the EIDOS frontend to the Anthropic API so the
 * API key is never exposed in the browser.
 *
 * Set ANTHROPIC_API_KEY in your Cloudflare Pages project:
 *   Dashboard → Pages → eidos → Settings → Environment variables
 *
 * Expected request:  POST /functions/debrief   { "prompt": "..." }
 * Expected response: 200                        { "text": "..." }
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // ── CORS — only needed if you ever call this from a different origin ──
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // ── Parse request body ──
  let prompt;
  try {
    const body = await request.json();
    prompt = body.prompt;
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── Guard: API key must be present ──
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── Call Anthropic ──
  let anthropicResponse;
  try {
    anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',  // fast + cost-effective for debrief feedback
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Upstream fetch failed', detail: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (!anthropicResponse.ok) {
    const errorText = await anthropicResponse.text();
    return new Response(JSON.stringify({ error: 'Anthropic API error', detail: errorText }), {
      status: anthropicResponse.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── Extract text and return ──
  const data = await anthropicResponse.json();
  const text = data?.content?.[0]?.text ?? '';

  return new Response(JSON.stringify({ text }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// Handle preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
