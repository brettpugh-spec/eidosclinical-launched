const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Expose-Headers': 'Content-Type, Content-Disposition, Cache-Control, X-Eidos-PDF-Proxy, X-Eidos-PDF-Upstream-Host, X-Eidos-PDF-Upstream-Content-Type, X-Eidos-PDF-Template-SHA256, X-Eidos-PDF-Template-Id, X-Eidos-PDF-Generator',
};

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

function getHostName(url) {
  try {
    return new URL(url).host || '';
  } catch (_) {
    return '';
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let payload;
  try {
    payload = await request.json();
    if (!payload || typeof payload !== 'object') {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }
  } catch (_) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const upstream =
    (env && (env.PDF_EXPORT_UPSTREAM_URL || env.PDF_EXPORT_API_URL)) || '';

  if (!upstream) {
    return jsonResponse(
      {
        error: 'PDF export backend not configured',
        detail:
          'Set PDF_EXPORT_UPSTREAM_URL to your Flask endpoint (for example: https://api.yourdomain.com/api/case/export-pdf).',
      },
      501
    );
  }

  const upstreamHost = getHostName(upstream);

  let upstreamResponse;
  try {
    upstreamResponse = await fetch(upstream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return jsonResponse(
      {
        error: 'PDF export upstream request failed',
        detail: err && err.message ? err.message : 'network_error',
      },
      502
    );
  }

  if (!upstreamResponse.ok) {
    const detail = await upstreamResponse.text().catch(() => '');
    const upstreamTemplateSha = upstreamResponse.headers.get('X-Eidos-PDF-Template-SHA256') || '';
    const upstreamTemplateId = upstreamResponse.headers.get('X-Eidos-PDF-Template-Id') || '';
    const upstreamGenerator = upstreamResponse.headers.get('X-Eidos-PDF-Generator') || '';
    return jsonResponse(
      {
        error: 'PDF export upstream returned error',
        status: upstreamResponse.status,
        detail: detail || 'upstream_error',
      },
      upstreamResponse.status,
      {
        'X-Eidos-PDF-Proxy': 'pages-function-v2',
        'X-Eidos-PDF-Upstream-Host': upstreamHost,
        'X-Eidos-PDF-Template-SHA256': upstreamTemplateSha,
        'X-Eidos-PDF-Template-Id': upstreamTemplateId,
        'X-Eidos-PDF-Generator': upstreamGenerator,
      }
    );
  }

  const pdfBytes = await upstreamResponse.arrayBuffer();
  const upstreamContentType = upstreamResponse.headers.get('Content-Type') || '';
  const upstreamTemplateSha = upstreamResponse.headers.get('X-Eidos-PDF-Template-SHA256') || '';
  const upstreamTemplateId = upstreamResponse.headers.get('X-Eidos-PDF-Template-Id') || '';
  const upstreamGenerator = upstreamResponse.headers.get('X-Eidos-PDF-Generator') || '';
  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=eidos-case-report.pdf',
      'Cache-Control': 'no-store',
      'X-Eidos-PDF-Proxy': 'pages-function-v2',
      'X-Eidos-PDF-Upstream-Host': upstreamHost,
      'X-Eidos-PDF-Upstream-Content-Type': upstreamContentType,
      'X-Eidos-PDF-Template-SHA256': upstreamTemplateSha,
      'X-Eidos-PDF-Template-Id': upstreamTemplateId,
      'X-Eidos-PDF-Generator': upstreamGenerator,
      ...corsHeaders,
    },
  });
}
