"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  EIDOS — Case Simulation PDF Report Template                                ║
║                                                                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PURPOSE                                                                    ║
║  Generates a 2-page branded PDF for a case simulation debrief.             ║
║  Call generate_report(data, output_path) with a populated ReportData dict. ║
║                                                                              ║
║  DEPENDENCY                                                                  ║
║    pip install reportlab                                                     ║
║                                                                              ║
║  INTEGRATION NOTES FOR CODEX                                                ║
║  ─────────────────────────────────────────────────────────────────────────  ║
║  1. Import and call generate_report() from your backend export handler.     ║
║  2. The full data contract is defined in the ReportData TypedDict below.    ║
║  3. All fields marked REQUIRED must be populated; OPTIONAL fields can be    ║
║     omitted or set to None / empty list.                                    ║
║  4. rubric_rows controls the scoring table; score_color must be one of:     ║
║     "green" | "amber" | "red"                                               ║
║  5. expert_sections is an ordered list — render in the order provided.      ║
║  6. Output is a bytes buffer (io.BytesIO) — write it to disk or stream it   ║
║     directly as a PDF HTTP response.                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from __future__ import annotations

import io
import math
from typing import Any, List, Literal, Optional, TypedDict
from xml.sax.saxutils import escape as xml_escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

# ── Page dimensions ───────────────────────────────────────────────────────────
W, H = A4  # 595.27 × 841.89 pts

# ── EIDOS brand colour palette ────────────────────────────────────────────────
DARK_BG    = colors.HexColor("#0d1e2b")   # deep navy — full-page background
CARD_BG    = colors.HexColor("#132635")   # card / panel background
CARD_ALT   = colors.HexColor("#0f1f2d")   # alternating table row background
ACCENT     = colors.HexColor("#4ca3c8")   # primary teal-blue accent
ACCENT2    = colors.HexColor("#7ec8e3")   # lighter teal (secondary accent)
GOLD       = colors.HexColor("#c9a96e")   # warm gold
TEXT_MAIN  = colors.HexColor("#e8e4dc")   # primary off-white text
TEXT_MUTED = colors.HexColor("#7a94a6")   # secondary muted blue-grey
BORDER     = colors.HexColor("#1e3547")   # subtle divider / border
GREEN_OK   = colors.HexColor("#4caf8a")   # correct / full-credit
RED_MISS   = colors.HexColor("#e05c5c")   # incorrect / no credit
AMBER      = colors.HexColor("#d4956a")   # partial credit / warning

# Score-colour lookup — used by rubric rows
SCORE_COLOURS: dict[str, colors.Color] = {
    "green": GREEN_OK,
    "amber": AMBER,
    "red":   RED_MISS,
}

# Reused paragraph styles (constant style definitions; no visual change)
RUBRIC_CRITERION_STYLE = ParagraphStyle(
    "rc", fontName="Helvetica", fontSize=7, textColor=TEXT_MAIN, leading=10
)
RUBRIC_RESPONSE_STYLE = ParagraphStyle(
    "rr", fontName="Helvetica", fontSize=7, textColor=TEXT_MUTED, leading=10
)
EXPERT_BODY_STYLE = ParagraphStyle(
    "eb", fontName="Helvetica", fontSize=8, textColor=TEXT_MAIN, leading=12.5, leftIndent=10
)


# ══════════════════════════════════════════════════════════════════════════════
# DATA CONTRACT
# ══════════════════════════════════════════════════════════════════════════════

class RubricRow(TypedDict):
    criterion:    str                          # REQUIRED — criterion label (supports \n for line break)
    response:     str                          # REQUIRED — user's submitted response text
    score:        str                          # REQUIRED — display string e.g. "2/3", "0/2"
    score_color:  Literal["green","amber","red"]  # REQUIRED


class ScoreBreakdownRow(TypedDict):
    key:        str
    label:      str
    score:      int
    max_score:  int
    note:       str


class ExpertSection(TypedDict):
    number: str          # REQUIRED — e.g. "1", "2"
    title:  str          # REQUIRED — e.g. "Likely Diagnosis"
    color:  str          # REQUIRED — hex string e.g. "#4ca3c8" or one of the named palette keys:
                         #   "accent" | "accent2" | "gold" | "green" | "amber" | "red"
    body:   str          # REQUIRED — body text; supports basic ReportLab XML tags: <b>, <i>, <br/>


class ReportData(TypedDict):
    # ── Header / meta ─────────────────────────────────────────────────────────
    case_title:        str          # REQUIRED  e.g. "Cervical Case 03"
    case_subtitle:     str          # REQUIRED  e.g. "Intermediate Template"
    case_breadcrumb:   str          # REQUIRED  e.g. "CERVICAL  ·  ADVANCED  ·  CASE 03"
    generated_date:    str          # REQUIRED  e.g. "Generated  Mar 7, 2026"

    # ── Score ─────────────────────────────────────────────────────────────────
    score:             int           # REQUIRED  raw score  e.g. 5
    score_total:       int           # REQUIRED  max score  e.g. 11
    verdict_title:     str           # REQUIRED  e.g. "Developing reasoning"
    verdict_subtitle:  str           # REQUIRED  short description shown beside ring

    # ── Diagnosis comparison ──────────────────────────────────────────────────
    user_diagnosis:         str      # REQUIRED  e.g. "Cervical Whiplash / MCI"
    user_confidence:        str      # REQUIRED  e.g. "Moderate confidence  50%"
    correct_diagnosis:      str      # REQUIRED  e.g. "Cervical Radicular Pain"
    correct_diagnosis_sub:  str      # OPTIONAL  e.g. "(suspected)"

    # ── Weighted scoring breakdown ────────────────────────────────────────────
    score_breakdown:   List[ScoreBreakdownRow]  # OPTIONAL preferred when available
    reasoning_summary: str                      # OPTIONAL short clinical reasoning summary
    selected_differential: List[str]            # OPTIONAL learner-selected differential list
    selected_tests:     List[str]               # OPTIONAL learner-selected tests list

    # ── Rubric compatibility fallback ─────────────────────────────────────────
    rubric_rows:       List[RubricRow]  # REQUIRED

    # ── Page 2 expert reasoning ───────────────────────────────────────────────
    expert_diagnosis_title: str         # REQUIRED  large heading e.g. "Cervical Radicular Pain"
    expert_diagnosis_sub:   str         # OPTIONAL  e.g. "(suspected)"
    expert_sections:        List[ExpertSection]  # REQUIRED

    # ── Footer disclaimer ─────────────────────────────────────────────────────
    disclaimer:        Optional[str]    # OPTIONAL  override default disclaimer text


# ══════════════════════════════════════════════════════════════════════════════
# INTERNAL DRAWING HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def _resolve_color(value: str) -> colors.Color:
    """Accept a hex string OR a named palette key and return a ReportLab Color."""
    named = {
        "accent": ACCENT, "accent2": ACCENT2, "gold": GOLD,
        "green": GREEN_OK, "amber": AMBER, "red": RED_MISS,
        "muted": TEXT_MUTED, "main": TEXT_MAIN,
    }
    if value in named:
        return named[value]
    return colors.HexColor(value)


def _safe_int(value: Any, default: int = 0) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def _safe_text(value: Any, fallback: str = "") -> str:
    if value is None:
        return fallback
    text = str(value).strip()
    return text if text else fallback


def _safe_text_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    out: list[str] = []
    for item in value:
        text = _safe_text(item, "")
        if text:
            out.append(text)
    return out


def _score_color_from_values(score: int, max_score: int) -> Literal["green", "amber", "red"]:
    if score <= 0:
        return "red"
    if max_score > 0 and score >= max_score:
        return "green"
    return "amber"


def _build_scoring_rows(d: ReportData) -> list[RubricRow]:
    rows: list[RubricRow] = []
    breakdown_rows = d.get("score_breakdown") if isinstance(d.get("score_breakdown"), list) else []

    for item in breakdown_rows or []:
        if not isinstance(item, dict):
            continue
        label = _safe_text(item.get("label") or item.get("key"), "Category")
        note = _safe_text(item.get("note"), "No additional feedback.")
        score = max(0, _safe_int(item.get("score"), 0))
        max_score = max(0, _safe_int(item.get("max_score"), 0))
        score_txt = f"{score}/{max_score}"
        rows.append(
            {
                "criterion": label,
                "response": note,
                "score": score_txt,
                "score_color": _score_color_from_values(score, max_score),
            }
        )

    if rows:
        return rows

    for row in d.get("rubric_rows", []):
        if not isinstance(row, dict):
            continue
        score_txt = _safe_text(row.get("score"), "0/0")
        bits = score_txt.replace(" ", "").split("/")
        score = _safe_int(bits[0], 0) if bits else 0
        max_score = _safe_int(bits[1], 0) if len(bits) > 1 else 0
        color = row.get("score_color")
        if color not in SCORE_COLOURS:
            color = _score_color_from_values(score, max_score)
        rows.append(
            {
                "criterion": _safe_text(row.get("criterion"), "Category"),
                "response": _safe_text(row.get("response"), "No response"),
                "score": score_txt,
                "score_color": color,
            }
        )
    return rows


def _rounded_rect(
    c: canvas.Canvas,
    x: float, y: float, w: float, h: float,
    r: float = 4 * mm,
    fill: colors.Color | None = None,
    stroke: colors.Color | None = None,
    lw: float = 0.5,
) -> None:
    """Draw a rounded rectangle with optional fill and/or stroke."""
    c.saveState()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(lw)
    path = c.beginPath()
    path.moveTo(x + r, y)
    path.lineTo(x + w - r, y)
    path.arcTo(x + w - 2 * r, y,          x + w,         y + 2 * r,  -90, 90)
    path.lineTo(x + w, y + h - r)
    path.arcTo(x + w - 2 * r, y + h - 2 * r, x + w,     y + h,        0, 90)
    path.lineTo(x + r, y + h)
    path.arcTo(x,              y + h - 2 * r, x + 2 * r, y + h,       90, 90)
    path.lineTo(x, y + r)
    path.arcTo(x,              y,             x + 2 * r, y + 2 * r,  180, 90)
    path.close()
    c.drawPath(path, fill=int(bool(fill)), stroke=int(bool(stroke)))
    c.restoreState()


def _score_ring(
    c: canvas.Canvas,
    cx: float, cy: float, radius: float,
    score: int, total: int,
) -> None:
    """Draw the circular progress ring with score text."""
    pct = score / total if total else 0
    c.saveState()
    # Background track
    c.setStrokeColor(BORDER)
    c.setLineWidth(6)
    c.circle(cx, cy, radius, fill=0, stroke=1)
    # Filled arc (drawn as many short line segments for compatibility)
    c.setStrokeColor(ACCENT)
    c.setLineWidth(6)
    c.setLineCap(1)
    start = 90.0
    sweep = 360.0 * pct
    steps = max(int(sweep / 2), 1)
    for i in range(steps):
        a1 = math.radians(start - i * sweep / steps)
        a2 = math.radians(start - (i + 1) * sweep / steps)
        c.line(
            cx + radius * math.cos(a1), cy + radius * math.sin(a1),
            cx + radius * math.cos(a2), cy + radius * math.sin(a2),
        )
    # Score numerals
    c.setFillColor(TEXT_MAIN)
    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(cx, cy + 4, str(score))
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(cx, cy - 10, f"/ {total} pts")
    c.restoreState()


def _para(
    c: canvas.Canvas,
    text: str,
    x: float, y: float, width: float,
    size: float = 8,
    color: colors.Color = TEXT_MAIN,
    leading: float = 12.5,
    align: int = TA_LEFT,
) -> float:
    """Draw a wrapped Paragraph and return its rendered height."""
    style = ParagraphStyle(
        "p", fontName="Helvetica", fontSize=size,
        textColor=color, leading=leading, alignment=align,
    )
    p = Paragraph(text, style)
    p.wrapOn(c, width, 9999)
    p.drawOn(c, x, y - p.height)
    return p.height


def _header_bar(c: canvas.Canvas, margin: float, right_title: str, right_sub: str) -> None:
    """Render the shared top header bar used on both pages."""
    header_h = 52
    _rounded_rect(c, 0, H - header_h, W, header_h, r=0, fill=CARD_BG)
    c.setFillColor(ACCENT)
    c.rect(0, H - 2, W, 2, fill=1, stroke=0)
    c.saveState()
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(TEXT_MAIN)
    c.drawString(margin, H - 32, "EIDOS")
    c.setFont("Helvetica", 7)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin, H - 43, "CLINICAL INTELLIGENCE FOR MSK")
    c.drawRightString(W - margin, H - 32, right_title)
    c.drawRightString(W - margin, H - 43, right_sub)
    c.restoreState()


def _footer(c: canvas.Canvas, margin: float, page_label: str) -> None:
    """Render the shared bottom footer used on both pages."""
    fy = 14 * mm
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(margin, fy + 10, W - margin, fy + 10)
    c.saveState()
    c.setFont("Helvetica", 6.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin, fy, "EIDOS  ·  Clinical Intelligence for MSK")
    c.drawRightString(W - margin, fy, page_label)
    c.restoreState()


# ══════════════════════════════════════════════════════════════════════════════
# PAGE RENDERERS
# ══════════════════════════════════════════════════════════════════════════════

def _render_page1(c: canvas.Canvas, d: ReportData, margin: float) -> None:
    """Page 1: Score hero, diagnosis comparison, weighted breakdown, and summary."""
    cw = W - 2 * margin

    c.setFillColor(DARK_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    _header_bar(c, margin, "CASE SIMULATION REPORT", d["generated_date"])

    header_h = 52
    y = H - header_h - 10

    # ── Case breadcrumb + title ───────────────────────────────────────────────
    c.saveState()
    c.setFont("Helvetica", 7)
    c.setFillColor(ACCENT)
    c.drawString(margin, y - 14, d["case_breadcrumb"])
    c.restoreState()
    title_h = _para(
        c,
        xml_escape(_safe_text(d.get("case_title"), "Clinical Case")),
        margin,
        y - 20,
        width=cw - 170,
        size=14,
        color=TEXT_MAIN,
        leading=16,
    )
    c.saveState()
    c.setFont("Helvetica", 10)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin, y - title_h - 24, d["case_subtitle"])
    c.restoreState()

    # ── Score ring (top-right) ────────────────────────────────────────────────
    ring_cx = W - margin - 42
    ring_cy = y - 38
    _score_ring(c, ring_cx, ring_cy, 28, _safe_int(d.get("score"), 0), _safe_int(d.get("score_total"), 100))

    verdict_x = ring_cx - 44
    c.saveState()
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(AMBER)
    c.drawRightString(verdict_x, ring_cy + 6, _safe_text(d.get("verdict_title"), "Debrief"))
    c.restoreState()
    _para(
        c,
        xml_escape(_safe_text(d.get("verdict_subtitle"), "Clinical reasoning summary.")),
        verdict_x - 130,
        ring_cy - 4,
        width=130,
        size=7.5,
        color=TEXT_MUTED,
        leading=11,
        align=TA_RIGHT,
    )

    rule_y = y - max(72, title_h + 30)
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(margin, rule_y, W - margin, rule_y)
    y = rule_y - 14

    # ── Section: Diagnosis comparison ─────────────────────────────────────────
    c.saveState()
    c.setFont("Helvetica", 6.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin, y, "DIAGNOSIS COMPARISON")
    c.restoreState()
    y -= 14

    card_w = (cw - 8) / 2
    card_h = 56

    _rounded_rect(c, margin, y - card_h, card_w, card_h, r=3 * mm, fill=CARD_BG, stroke=BORDER)
    c.saveState()
    c.setFont("Helvetica", 6)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin + 10, y - 12, "YOUR DIAGNOSIS")
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(AMBER)
    diag_lines = _split_text(_safe_text(d.get("user_diagnosis"), "Not submitted"), 28)
    for li, ln in enumerate(diag_lines[:3]):
        c.drawString(margin + 10, y - 26 - li * 12, ln)
    pill_y = y - card_h + 6
    _rounded_rect(c, margin + 10, pill_y, 98, 13, r=2 * mm, fill=colors.HexColor("#1e3547"))
    c.setFillColor(AMBER)
    c.setFont("Helvetica", 6.3)
    c.drawString(margin + 15, pill_y + 3, _safe_text(d.get("user_confidence"), "No confidence submitted"))
    c.restoreState()

    cx2 = margin + card_w + 8
    _rounded_rect(
        c,
        cx2,
        y - card_h,
        card_w,
        card_h,
        r=3 * mm,
        fill=colors.HexColor("#0d2218"),
        stroke=GREEN_OK,
        lw=0.8,
    )
    c.saveState()
    c.setFont("Helvetica", 6)
    c.setFillColor(GREEN_OK)
    c.drawString(cx2 + 10, y - 12, "CORRECT DIAGNOSIS")
    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(GREEN_OK)
    c.drawString(cx2 + 10, y - 26, _safe_text(d.get("correct_diagnosis"), "Not specified"))
    if d.get("correct_diagnosis_sub"):
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        c.drawString(cx2 + 10, y - 39, _safe_text(d.get("correct_diagnosis_sub"), ""))
    c.restoreState()

    y -= card_h + 10

    # ── Section: Clinical reasoning summary ───────────────────────────────────
    c.saveState()
    c.setFont("Helvetica", 6.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin, y, "CLINICAL REASONING SUMMARY")
    c.restoreState()
    y -= 12

    summary_text = _safe_text(d.get("reasoning_summary") or d.get("verdict_subtitle"), "Clinical reasoning summary.")
    summary_style = ParagraphStyle("summary", fontName="Helvetica", fontSize=7.6, textColor=TEXT_MAIN, leading=10.5)
    summary_p = Paragraph(xml_escape(summary_text), summary_style)
    summary_p.wrapOn(c, cw - 16, 9999)
    summary_h = max(26, summary_p.height + 12)
    _rounded_rect(c, margin, y - summary_h, cw, summary_h, r=2.5 * mm, fill=CARD_BG, stroke=BORDER)
    summary_p.drawOn(c, margin + 8, y - summary_h + (summary_h - summary_p.height) / 2)
    y -= summary_h + 12

    # ── Section: Scoring breakdown ────────────────────────────────────────────
    c.saveState()
    c.setFont("Helvetica", 6.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin, y, "SCORING BREAKDOWN")
    c.restoreState()
    y -= 12

    row_h = 24
    col_w = [cw * 0.33, cw * 0.49, cw * 0.18]

    _rounded_rect(c, margin, y - row_h + 4, cw, row_h - 4, r=2 * mm, fill=BORDER)
    hx = margin
    for hi, hdr in enumerate(["Category", "Feedback", "Score"]):
        c.saveState()
        c.setFont("Helvetica-Bold", 6.5)
        c.setFillColor(TEXT_MUTED)
        if hi == 2:
            c.drawRightString(hx + col_w[hi] - 6, y - row_h + 12, hdr.upper())
        else:
            c.drawString(hx + 6, y - row_h + 12, hdr.upper())
        c.restoreState()
        hx += col_w[hi]
    y -= row_h

    score_rows = _build_scoring_rows(d)
    if not score_rows:
        score_rows = [
            {"criterion": "Differential Diagnosis", "response": "No score data available.", "score": "0/40", "score_color": "red"},
            {"criterion": "Test Selection", "response": "No score data available.", "score": "0/25", "score_color": "red"},
            {"criterion": "Red Flag Recognition", "response": "No score data available.", "score": "0/15", "score_color": "red"},
            {"criterion": "Diagnostic Efficiency", "response": "No score data available.", "score": "0/20", "score_color": "red"},
        ]

    for ri, row in enumerate(score_rows[:8]):
        p = Paragraph(xml_escape(_safe_text(row.get("criterion"), "Category")).replace("\n", "<br/>"), RUBRIC_CRITERION_STYLE)
        p.wrapOn(c, col_w[0] - 12, 9999)
        p2 = Paragraph(xml_escape(_safe_text(row.get("response"), "No response")), RUBRIC_RESPONSE_STYLE)
        p2.wrapOn(c, col_w[1] - 12, 9999)
        dynamic_h = max(24, p.height + 10, p2.height + 10)
        if y - dynamic_h < 125:
            break

        bg = CARD_BG if ri % 2 == 0 else CARD_ALT
        _rounded_rect(c, margin, y - dynamic_h, cw, dynamic_h, r=0, fill=bg)

        rx = margin
        c.saveState()
        p.drawOn(c, rx + 6, y - dynamic_h + (dynamic_h - p.height) / 2)
        rx += col_w[0]
        p2.drawOn(c, rx + 6, y - dynamic_h + (dynamic_h - p2.height) / 2)
        rx += col_w[1]

        score_label = _safe_text(row.get("score"), "0/0")
        sc = SCORE_COLOURS.get(_safe_text(row.get("score_color"), "amber"), AMBER)
        pw = max(28, min(56, 12 + (len(score_label) * 4.2)))
        ph = 14
        px = rx + col_w[2] - pw - 6
        py = y - dynamic_h / 2 - ph / 2
        _rounded_rect(c, px, py, pw, ph, r=7, fill=colors.Color(sc.red, sc.green, sc.blue, alpha=0.2))
        c.setFillColor(sc)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(px + pw / 2, py + 3.5, score_label)
        c.restoreState()

        c.setStrokeColor(BORDER)
        c.setLineWidth(0.3)
        c.line(margin, y - dynamic_h, W - margin, y - dynamic_h)
        y -= dynamic_h

    y -= 8

    selected_diff = _safe_text_list(d.get("selected_differential"))[:8]
    selected_tests = _safe_text_list(d.get("selected_tests"))[:14]

    def _draw_selection_block(label: str, items: list[str], empty_text: str, y_cursor: float) -> float:
        c.saveState()
        c.setFont("Helvetica", 6.5)
        c.setFillColor(TEXT_MUTED)
        c.drawString(margin, y_cursor, label)
        c.restoreState()
        y_cursor -= 12

        body_text = ", ".join(items) if items else empty_text
        body_style = ParagraphStyle("sel", fontName="Helvetica", fontSize=7.1, textColor=TEXT_MAIN, leading=10)
        p_body = Paragraph(xml_escape(body_text), body_style)
        p_body.wrapOn(c, cw - 16, 9999)
        block_h = max(24, p_body.height + 12)
        _rounded_rect(c, margin, y_cursor - block_h, cw, block_h, r=2 * mm, fill=CARD_BG, stroke=BORDER)
        p_body.drawOn(c, margin + 8, y_cursor - block_h + (block_h - p_body.height) / 2)
        return y_cursor - block_h - 8

    y = _draw_selection_block("SELECTED DIFFERENTIAL", selected_diff, "No differential submitted.", y)
    y = _draw_selection_block("SELECTED TESTS", selected_tests, "No tests selected.", y)

    _footer(c, margin, "Page 1 of 2")


def _render_page2(c: canvas.Canvas, d: ReportData, margin: float) -> None:
    """Page 2: Expert reasoning report."""
    cw = W - 2 * margin

    c.setFillColor(DARK_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    _header_bar(
        c, margin,
        "EXPERT REASONING REPORT",
        f"{d['case_title']}  ·  {d['case_subtitle']}",
    )

    header_h = 52
    y = H - header_h - 18

    # Eyebrow label
    c.saveState()
    c.setFont("Helvetica", 6.5)
    c.setFillColor(ACCENT)
    c.drawString(margin, y, "EXPERT REASONING REPORT")
    c.restoreState()
    y -= 16

    # Large diagnosis heading
    c.saveState()
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(TEXT_MAIN)
    c.drawString(margin, y, d["expert_diagnosis_title"])
    if d.get("expert_diagnosis_sub"):
        c.setFont("Helvetica", 10)
        c.setFillColor(TEXT_MUTED)
        c.drawString(margin, y - 14, d["expert_diagnosis_sub"])
    c.restoreState()
    y -= 34

    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(margin, y, W - margin, y)
    y -= 16

    # ── Expert sections ───────────────────────────────────────────────────────
    badge_r = 10
    for sec in d.get("expert_sections", []):
        if y < 72:
            break  # prevent overflow into footer area
        col = _resolve_color(sec["color"])
        # Numbered badge
        _rounded_rect(
            c, margin, y - badge_r * 2, badge_r * 2, badge_r * 2, r=badge_r,
            fill=colors.Color(col.red, col.green, col.blue, alpha=0.18),
        )
        c.saveState()
        c.setFillColor(col)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(margin + badge_r, y - badge_r + 2, sec["number"])
        # Section title
        c.setFont("Helvetica-Bold", 9)
        c.drawString(margin + badge_r * 2 + 8, y - badge_r + 3, sec["title"].upper())
        c.restoreState()
        y -= badge_r * 2 + 4

        # Body paragraph
        p = Paragraph(sec["body"], EXPERT_BODY_STYLE)
        p.wrapOn(c, cw - 10, 9999)
        p.drawOn(c, margin + 10, y - p.height)
        y -= p.height + 14

        c.setStrokeColor(BORDER)
        c.setLineWidth(0.3)
        c.line(margin + 10, y, W - margin, y)
        y -= 10

    # ── Disclaimer / signature block ──────────────────────────────────────────
    disclaimer = d.get("disclaimer") or (
        "This report is generated for educational and clinical training purposes. "
        "It does not constitute medical advice."
    )
    block_y = 28 * mm
    _rounded_rect(c, margin, block_y, cw, 28, r=3 * mm, fill=CARD_BG, stroke=BORDER)
    c.saveState()
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(ACCENT)
    c.drawString(margin + 10, block_y + 16, "EIDOS")
    c.setFont("Helvetica", 7.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(margin + 42, block_y + 16, "Clinical Intelligence for MSK  ·  Beta")
    c.setFont("Helvetica", 6.5)
    c.drawString(margin + 10, block_y + 5, disclaimer)
    c.restoreState()

    _footer(c, margin, "Page 2 of 2")


# ══════════════════════════════════════════════════════════════════════════════
# UTILITY
# ══════════════════════════════════════════════════════════════════════════════

def _split_text(text: str, max_chars: int) -> list[str]:
    """Naively split text into lines of at most max_chars characters."""
    words = text.split()
    lines, current = [], ""
    for w in words:
        if len(current) + len(w) + 1 <= max_chars:
            current = f"{current} {w}".strip()
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)
    return lines


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC API
# ══════════════════════════════════════════════════════════════════════════════

def generate_report(data: ReportData, output_path: str | None = None) -> bytes:
    """
    Generate the EIDOS case report PDF.

    Parameters
    ----------
    data        : Populated ReportData dict — see data contract above.
    output_path : If provided, the PDF is also written to this file path.

    Returns
    -------
    bytes — raw PDF bytes (suitable for streaming as an HTTP response).

    Usage (Flask example)
    ---------------------
        from eidos_pdf_report_template import generate_report, ReportData
        from flask import Response

        @app.route("/api/case/<id>/pdf")
        def export_pdf(id):
            data = build_report_data(id)   # your own function
            pdf_bytes = generate_report(data)
            return Response(pdf_bytes, mimetype="application/pdf",
                            headers={"Content-Disposition": f"attachment; filename=eidos-case-{id}.pdf"})
    """
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4, pageCompression=1)
    c.setTitle(f"EIDOS — {data.get('case_title', 'Case Report')}")

    margin = 18 * mm

    _render_page1(c, data, margin)
    c.showPage()
    _render_page2(c, data, margin)

    c.save()
    pdf_bytes = buf.getvalue()

    if output_path:
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)

    return pdf_bytes


# ══════════════════════════════════════════════════════════════════════════════
# EXAMPLE  —  run this file directly to regenerate the sample PDF
# ══════════════════════════════════════════════════════════════════════════════

SAMPLE_DATA: ReportData = {
    "case_title":       "Cervical Case 03",
    "case_subtitle":    "Intermediate Template",
    "case_breadcrumb":  "CERVICAL  ·  ADVANCED  ·  CASE 03",
    "generated_date":   "Generated  Mar 7, 2026",

    "score":            74,
    "score_total":      100,
    "verdict_title":    "Developing reasoning",
    "verdict_subtitle": "You identified the correct diagnosis and used useful discriminating tests, with room to improve efficiency.",
    "reasoning_summary": "You correctly identified the primary diagnosis. Your selected tests were mostly high-value, but two additional tests added limited value. You appropriately ruled out major red flags.",

    "user_diagnosis":       "Cervical Whiplash / Movement Coordination Impairment",
    "user_confidence":      "Moderate confidence  50%",
    "correct_diagnosis":    "Cervical Radicular Pain",
    "correct_diagnosis_sub": "(suspected)",

    "score_breakdown": [
        {"key": "differential", "label": "Differential Diagnosis", "score": 40, "max_score": 40, "note": "Correct diagnosis selected as primary."},
        {"key": "tests", "label": "Test Selection", "score": 19, "max_score": 25, "note": "Selected tests were mostly discriminating for this case."},
        {"key": "red_flags", "label": "Red Flag Recognition", "score": 15, "max_score": 15, "note": "Appropriately ruled out major red flags."},
        {"key": "efficiency", "label": "Diagnostic Efficiency", "score": 0, "max_score": 20, "note": "Additional low-value tests reduced diagnostic efficiency."},
    ],
    "selected_differential": [
        "Cervical Radicular Pain",
        "Cervical Whiplash / Movement Coordination Impairment",
        "Thoracic Outlet Syndrome",
    ],
    "selected_tests": [
        "Cervical distraction test",
        "Spurling's test",
        "ULTT1 median nerve",
        "Adson test",
    ],

    "rubric_rows": [
        {
            "criterion":   "Differential Diagnosis",
            "response":    "Correct diagnosis selected as primary.",
            "score":       "40/40",
            "score_color": "green",
        },
        {
            "criterion":   "Test Selection",
            "response":    "Selected tests were mostly discriminating for this case.",
            "score":       "19/25",
            "score_color": "amber",
        },
        {
            "criterion":   "Red Flag Recognition",
            "response":    "Appropriately ruled out major red flags.",
            "score":       "15/15",
            "score_color": "green",
        },
        {
            "criterion":   "Diagnostic Efficiency",
            "response":    "Additional low-value tests reduced diagnostic efficiency.",
            "score":       "0/20",
            "score_color": "red",
        },
    ],

    "expert_diagnosis_title": "Cervical Radicular Pain",
    "expert_diagnosis_sub":   "(suspected)",

    "expert_sections": [
        {
            "number": "1",
            "title":  "Likely Diagnosis",
            "color":  "accent",
            "body":   "<b>Cervical Radicular Pain (suspected)</b> — The clinical presentation is consistent with nerve root involvement at the cervical spine level, with a clear mechanism of injury and corroborating physical examination findings.",
        },
        {
            "number": "2",
            "title":  "Why This Diagnosis Fits",
            "color":  "accent2",
            "body":   "A 55-year-old male presents with right arm pain, weakness and clumsiness of 2 months duration following a minor rear-end MVA. Cervical ROM was reduced: right rotation limited to 55° (normal 70°) with end-range right arm pain; extension limited to 35° with arm symptom provocation. <b>Cervical distraction test was positive</b> — right arm pain eased with manual traction, supporting a foraminal/root mechanism.",
        },
        {
            "number": "3",
            "title":  "Why Other Common Causes Are Less Likely",
            "color":  "gold",
            "body":   "<b>Spurling's test</b>: Negative — no arm pain with compression. <b>ULTT1 median nerve</b>: Negative bilaterally — neurodynamic involvement excluded. <b>Adson test</b>: Negative — thoracic outlet syndrome excluded. These findings collectively reduce the likelihood of alternative musculoskeletal pathology or referred pain from a distal source.",
        },
        {
            "number": "4",
            "title":  "What This Means for Recovery",
            "color":  "green",
            "body":   "Most people with cervical radicular pain improve with structured loading and symptom-guided progression. Recovery is typically gradual over several weeks. Regular reassessment allows timely progression and helps identify cases that may warrant further investigation.",
        },
        {
            "number": "5",
            "title":  "Next Steps",
            "color":  "amber",
            "body":   "Continue clinician-guided rehabilitation. Track 24-hour symptom response after loading sessions and progress only when pain and function are steadily improving. Imaging is not indicated at this time given the clinical presentation and absence of red flag findings.",
        },
    ],

    "disclaimer": None,  # uses default
}


if __name__ == "__main__":
    out = "eidos-case-report-sample.pdf"
    generate_report(SAMPLE_DATA, output_path=out)
    print(f"Sample PDF written to: {out}")
