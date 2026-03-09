from __future__ import annotations

import hashlib
from pathlib import Path

from flask import Flask, Response, jsonify, request

from eidos_pdf_report_template import generate_report

app = Flask(__name__)

TEMPLATE_PATH = Path(__file__).with_name("eidos_pdf_report_template.py")
try:
    TEMPLATE_SHA256 = hashlib.sha256(TEMPLATE_PATH.read_bytes()).hexdigest()
except OSError:
    TEMPLATE_SHA256 = "unavailable"
TEMPLATE_ID = f"{TEMPLATE_PATH.name}@{TEMPLATE_SHA256[:12]}"
GENERATOR_ID = "reportlab-template-v2"


@app.route("/api/case/export-pdf", methods=["POST", "OPTIONS"])
def export_case_pdf():
    if request.method == "OPTIONS":
        return Response(
            status=204,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Expose-Headers": "X-Eidos-PDF-Template-SHA256, X-Eidos-PDF-Template-Id, X-Eidos-PDF-Generator",
                "Cache-Control": "no-store",
            },
        )

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    try:
        pdf_bytes = generate_report(data)
    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": "PDF generation failed", "detail": str(exc)}), 500

    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=eidos-case-report.pdf",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Expose-Headers": "X-Eidos-PDF-Template-SHA256, X-Eidos-PDF-Template-Id, X-Eidos-PDF-Generator",
            "X-Eidos-PDF-Template-SHA256": TEMPLATE_SHA256,
            "X-Eidos-PDF-Template-Id": TEMPLATE_ID,
            "X-Eidos-PDF-Generator": GENERATOR_ID,
        },
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8787, debug=True)
