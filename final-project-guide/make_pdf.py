#!/usr/bin/env python3
"""
Renders Final-Project-Guide.md to a print-ready PDF with ReportLab.

Supports the subset of Markdown the guide actually uses:
  # h1  ## h2  ### h3      headings
  ```code fences```        monospace blocks with a tinted background
  | tables |               simple grid tables
  - bullets, 1. numbered   lists
  > blockquote             indented note
  **bold**  `inline code`  [link](url)
  ---                      horizontal rule

Usage: PYTHONPATH=/tmp/pylibs python3 make_pdf.py
"""
import pathlib
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, CondPageBreak, Frame, KeepTogether,
                                PageBreak, PageTemplate, Paragraph, Preformatted,
                                Spacer, Table, TableStyle)

HERE = pathlib.Path(__file__).parent
SRC = HERE / "Final-Project-Guide.md"
OUT = HERE / "Final-Project-Guide.pdf"

FONT_DIR = pathlib.Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("Body", FONT_DIR / "DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("Body-Bold", FONT_DIR / "DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Mono", FONT_DIR / "DejaVuSansMono.ttf"))
pdfmetrics.registerFont(TTFont("Mono-Bold", FONT_DIR / "DejaVuSansMono-Bold.ttf"))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold")
pdfmetrics.registerFontFamily("Mono", normal="Mono", bold="Mono-Bold")

INK = colors.HexColor("#241f1a")
MUTED = colors.HexColor("#5f574c")
ACCENT = colors.HexColor("#b3421b")
RULE = colors.HexColor("#d9cfc0")
CODE_BG = colors.HexColor("#f6f1e9")
NOTE_BG = colors.HexColor("#fdf6ef")
TABLE_HEAD = colors.HexColor("#efe6d8")

MARGIN = 18 * mm
FRAME_W = A4[0] - 2 * MARGIN

S = {
    "h1": ParagraphStyle("h1", fontName="Body-Bold", fontSize=21, leading=25, textColor=INK,
                         spaceBefore=6, spaceAfter=8),
    "h2": ParagraphStyle("h2", fontName="Body-Bold", fontSize=15.5, leading=19, textColor=ACCENT,
                         spaceBefore=16, spaceAfter=6),
    "h3": ParagraphStyle("h3", fontName="Body-Bold", fontSize=12, leading=15, textColor=INK,
                         spaceBefore=11, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Body", fontSize=9.2, leading=13.6, textColor=INK,
                           alignment=TA_LEFT, spaceAfter=5),
    "bullet": ParagraphStyle("bullet", fontName="Body", fontSize=9.2, leading=13.4, textColor=INK,
                             leftIndent=12, bulletIndent=2, spaceAfter=2.5),
    "num": ParagraphStyle("num", fontName="Body", fontSize=9.2, leading=13.4, textColor=INK,
                          leftIndent=16, bulletIndent=2, spaceAfter=2.5),
    "note": ParagraphStyle("note", fontName="Body", fontSize=8.9, leading=13, textColor=colors.HexColor("#4a4034"),
                           leftIndent=8, rightIndent=8, spaceBefore=3, spaceAfter=3),
    "cell": ParagraphStyle("cell", fontName="Body", fontSize=8.1, leading=10.8, textColor=INK),
    "cellhead": ParagraphStyle("cellhead", fontName="Body-Bold", fontSize=8.1, leading=10.8, textColor=INK),
}

INLINE = [
    (re.compile(r"\*\*(.+?)\*\*"), r"<b>\1</b>"),
    (re.compile(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)"), r"<i>\1</i>"),
    (re.compile(r"`([^`]+?)`"), r'<font name="Mono" size="8.4" color="#8a3b18">\1</font>'),
    (re.compile(r"\[([^\]]+)\]\((https?://[^)]+)\)"), r'<link href="\2" color="#9a3816">\1</link>'),
]


def esc(text: str) -> str:
    return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def inline(text: str) -> str:
    """Escape, then apply inline markdown. Order matters: protect code spans first."""
    spans = []

    def stash(match):
        spans.append(match.group(1))
        return f"\x00{len(spans) - 1}\x00"

    text = re.sub(r"`([^`]+?)`", stash, text)
    text = esc(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", text)
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)",
                  r'<link href="\2" color="#9a3816"><u>\1</u></link>', text)

    # Bare autolinks: <https://example.com> -> clickable link, no brackets
    text = re.sub(r"&lt;(https?://[^&\s]+?)&gt;",
                  r'<link href="\1" color="#9a3816"><u>\1</u></link>', text)

    def unstash(match):
        body = esc(spans[int(match.group(1))])
        return f'<font name="Mono" size="8.4" color="#8a3b18">{body}</font>'

    return re.sub(r"\x00(\d+)\x00", unstash, text)


def code_block(lines):
    """One table row per source line, so ReportLab can split long files across pages."""
    body = [line.replace("\t", "    ") for line in lines] or [" "]
    body = [line if line.strip() else "\u00a0" for line in body]
    longest = max((len(line) for line in body), default=1)
    # DejaVu Sans Mono advances 0.602 em per character; keep every line inside the frame.
    size = min(7.4, (FRAME_W - 14) / (0.602 * max(longest, 1)))
    size = max(size, 5.4)
    style = ParagraphStyle("code", fontName="Mono", fontSize=size, leading=size * 1.3,
                           textColor=colors.HexColor("#2b2620"))
    data = [[Preformatted(line, style)] for line in body]
    table = Table(data, colWidths=[FRAME_W])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
        ("BOX", (0, 0), (-1, -1), 0.4, RULE),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, 0), 5),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 5),
    ]))
    return table


def make_table(rows):
    header, body = rows[0], rows[1:]
    data = [[Paragraph(inline(c), S["cellhead"]) for c in header]]
    for row in body:
        data.append([Paragraph(inline(c), S["cell"]) for c in row])

    cols = len(header)
    weights = []
    for index in range(cols):
        longest = max(len(r[index]) if index < len(r) else 0 for r in rows)
        weights.append(max(longest, 8))
    total = sum(weights)
    widths = [FRAME_W * w / total for w in weights]
    # Keep narrow columns usable.
    widths = [max(w, 18 * mm) for w in widths]
    scale = FRAME_W / sum(widths)
    widths = [w * scale for w in widths]

    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEAD),
        ("TEXTCOLOR", (0, 0), (-1, 0), INK),
        ("GRID", (0, 0), (-1, -1), 0.35, RULE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#fcfaf6")]),
    ]))
    return table


def note_block(lines):
    inner = []
    for line in lines:
        inner.append(Paragraph(inline(line), S["note"]))
    table = Table([[inner]], colWidths=[FRAME_W])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NOTE_BG),
        ("LINEBEFORE", (0, 0), (0, -1), 2.2, ACCENT),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return table


def split_row(line):
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [cell.strip() for cell in line.split("|")]


def build():
    lines = SRC.read_text().splitlines()
    story = []
    index = 0

    while index < len(lines):
        line = lines[index]
        stripped = line.strip()

        # ---- fenced code
        if stripped.startswith("```"):
            index += 1
            block = []
            while index < len(lines) and not lines[index].strip().startswith("```"):
                block.append(lines[index])
                index += 1
            index += 1
            story.append(Spacer(1, 3))
            story.append(code_block(block))
            story.append(Spacer(1, 7))
            continue

        # ---- table
        if stripped.startswith("|") and index + 1 < len(lines) and set(lines[index + 1].strip()) <= set("|-: "):
            rows = [split_row(stripped)]
            index += 2
            while index < len(lines) and lines[index].strip().startswith("|"):
                rows.append(split_row(lines[index]))
                index += 1
            story.append(Spacer(1, 3))
            story.append(make_table(rows))
            story.append(Spacer(1, 8))
            continue

        # ---- blockquote
        if stripped.startswith(">"):
            paragraphs, current = [], []
            while index < len(lines) and lines[index].strip().startswith(">"):
                text = lines[index].strip()[1:].strip()
                if text:
                    current.append(text)
                elif current:
                    paragraphs.append(" ".join(current))
                    current = []
                index += 1
            if current:
                paragraphs.append(" ".join(current))
            story.append(Spacer(1, 3))
            story.append(note_block(paragraphs))
            story.append(Spacer(1, 7))
            continue

        # ---- headings
        if stripped.startswith("# "):
            story.append(CondPageBreak(60 * mm))
            story.append(Paragraph(inline(stripped[2:]), S["h1"]))
            story.append(Table([[""]], colWidths=[FRAME_W], rowHeights=[2],
                               style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), ACCENT)])))
            story.append(Spacer(1, 8))
            index += 1
            continue

        if stripped.startswith("## "):
            story.append(CondPageBreak(35 * mm))
            story.append(Paragraph(inline(stripped[3:]), S["h2"]))
            index += 1
            continue

        if stripped.startswith("### "):
            story.append(CondPageBreak(28 * mm))
            story.append(Paragraph(inline(stripped[4:]), S["h3"]))
            index += 1
            continue

        # ---- rules
        if stripped in {"---", "***", "___"}:
            story.append(Spacer(1, 5))
            story.append(Table([[""]], colWidths=[FRAME_W], rowHeights=[0.6],
                               style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), RULE)])))
            story.append(Spacer(1, 7))
            index += 1
            continue

        # ---- bullets (with one level of continuation)
        if re.match(r"^[-*] ", stripped):
            block = []
            while index < len(lines) and re.match(r"^[-*] ", lines[index].strip()):
                text = lines[index].strip()[2:]
                index += 1
                while index < len(lines) and lines[index].startswith("  ") and lines[index].strip() \
                        and not re.match(r"^[-*] ", lines[index].strip()):
                    text += " " + lines[index].strip()
                    index += 1
                block.append(text)
            for item in block:
                story.append(Paragraph(inline(item), S["bullet"], bulletText="•"))
            story.append(Spacer(1, 5))
            continue

        # ---- numbered list
        if re.match(r"^\d+\. ", stripped):
            while index < len(lines) and re.match(r"^\d+\. ", lines[index].strip()):
                number, text = lines[index].strip().split(". ", 1)
                index += 1
                while index < len(lines) and lines[index].startswith("   ") and lines[index].strip():
                    text += " " + lines[index].strip()
                    index += 1
                story.append(Paragraph(inline(text), S["num"], bulletText=f"{number}."))
            story.append(Spacer(1, 5))
            continue

        # ---- blank
        if not stripped:
            index += 1
            continue

        # ---- paragraph (join wrapped lines)
        block = [stripped]
        index += 1
        while index < len(lines):
            nxt = lines[index]
            n = nxt.strip()
            if (not n or n.startswith(("#", "|", ">", "```", "- ", "* "))
                    or re.match(r"^\d+\. ", n) or n in {"---", "***", "___"}):
                break
            block.append(n)
            index += 1
        story.append(Paragraph(inline(" ".join(block)), S["body"]))

    return story


def decorate(canvas, doc):
    if doc.page == 1:
        return
    canvas.saveState()
    canvas.setFont("Body", 7.6)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 12 * mm, "Build It — Final Project Guide · Web Application with React")
    canvas.drawRightString(A4[0] - MARGIN, 12 * mm, str(doc.page))
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN, 15 * mm, A4[0] - MARGIN, 15 * mm)
    canvas.restoreState()


def main():
    doc = BaseDocTemplate(str(OUT), pagesize=A4,
                          leftMargin=MARGIN, rightMargin=MARGIN,
                          topMargin=MARGIN, bottomMargin=20 * mm,
                          title="Build It — Final Project Guide", author="Arena",
                          subject="Web Application with React — final project")
    frame = Frame(MARGIN, 20 * mm, FRAME_W, A4[1] - MARGIN - 20 * mm, id="body")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=decorate)])

    story = build()
    # Title page
    title = [
        Spacer(1, 45 * mm),
        Paragraph("Build It", ParagraphStyle("t", fontName="Body-Bold", fontSize=40, leading=44,
                                            textColor=INK, spaceAfter=6)),
        Paragraph("A Complete Step-by-Step Guide to the<br/>Final Project",
                  ParagraphStyle("t2", fontName="Body-Bold", fontSize=19, leading=24, textColor=ACCENT,
                                 spaceAfter=18)),
        Table([[""]], colWidths=[60 * mm], rowHeights=[2.4],
              style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), ACCENT)])),
        Spacer(1, 16),
        Paragraph("Web Application with React · 40% of the course grade · Deadline 13 November 2026",
                  ParagraphStyle("t3", fontName="Body", fontSize=11, leading=16, textColor=INK,
                                 spaceAfter=10)),
        Paragraph("A reference build of <i>Shelf</i>, a book discovery app on the Open Library API, "
                  "with every step tied to the rubric, every code file tested before it was "
                  "written down, and a report template at the end.",
                  ParagraphStyle("t4", fontName="Body", fontSize=10.2, leading=15, textColor=MUTED)),
        Spacer(1, 30 * mm),
        Paragraph("Contents overleaf · Work through it in order · Commit at every checkpoint",
                  ParagraphStyle("t5", fontName="Body", fontSize=8.6, leading=12, textColor=MUTED)),
        PageBreak(),
    ]
    doc.build(title + story)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
