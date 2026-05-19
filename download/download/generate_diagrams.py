#!/usr/bin/env python3
"""Generate Power BI visual diagrams for the workshop PDF."""

from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/home/z/my-project/download/powerbi_images"
os.makedirs(OUT, exist_ok=True)

# Fonts
def load_font(size, bold=False):
    if bold:
        paths = [
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ]
    else:
        paths = [
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

FONT_REG = load_font(14)
FONT_BOLD = load_font(14, bold=True)
FONT_SM = load_font(12)
FONT_TITLE = load_font(18, bold=True)
FONT_BIG = load_font(22, bold=True)
FONT_TINY = load_font(10)

# Colors
DARK_BLUE = (27, 58, 92)
MED_BLUE = (46, 117, 182)
LIGHT_BLUE = (217, 226, 243)
WHITE = (255, 255, 255)
LIGHT_GRAY = (240, 240, 240)
MED_GRAY = (200, 200, 200)
DARK_GRAY = (80, 80, 80)
BLACK = (30, 30, 30)
ACCENT_GREEN = (46, 125, 50)
ACCENT_ORANGE = (230, 81, 0)
ACCENT_RED = (211, 47, 47)
ACCENT_PURPLE = (106, 27, 154)
ACCENT_TEAL = (0, 131, 143)
PBI_YELLOW = (F2C811_hex := 0xF2, 0xC8, 0x11) # Power BI yellow-ish
PBI_BLACK = (45, 45, 48)
PBI_DARK = (51, 51, 51)
PBI_RIBBON_BG = (63, 63, 70)
PBI_CANVAS = (232, 232, 232)
PBI_SIDEBAR = (243, 243, 243)


def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    x1, y1, x2, y2 = bbox
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)


def draw_arrow(draw, start, end, color=DARK_GRAY, width=2):
    draw.line([start, end], fill=color, width=width)
    # arrowhead
    import math
    angle = math.atan2(end[1]-start[1], end[0]-start[0])
    arrow_len = 10
    a1 = angle + math.pi/6
    a2 = angle - math.pi/6
    p1 = (end[0] - arrow_len*math.cos(a1), end[1] - arrow_len*math.sin(a1))
    p2 = (end[0] - arrow_len*math.cos(a2), end[1] - arrow_len*math.sin(a2))
    draw.polygon([end, p1, p2], fill=color)


def draw_label_line(draw, text_start, label_pos, color=MED_BLUE, text_side="left"):
    """Draw a line from text_start to label_pos, then the label text there."""
    draw.line([text_start, label_pos], fill=color, width=2)
    # dot at start
    r = 4
    draw.ellipse([text_start[0]-r, text_start[1]-r, text_start[0]+r, text_start[1]+r], fill=color)


def get_text_size(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def draw_text_centered(draw, x, y, w, text, font, fill=BLACK):
    tw, th = get_text_size(draw, text, font)
    draw.text((x + (w - tw)//2, y), text, font=font, fill=fill)


# ============================================================
# DIAGRAM 1: Power BI Desktop UI Overview
# ============================================================
def create_pbi_desktop_ui():
    W, H = 1200, 800
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    # Title bar
    draw_rounded_rect(d, (0, 0, W, 40), radius=0, fill=PBI_BLACK)
    d.text((15, 8), "Power BI Desktop - Financial Report", font=FONT_BOLD, fill=WHITE)
    # Window controls
    for i, c in enumerate([ACCENT_GREEN, ACCENT_ORANGE, ACCENT_RED]):
        cx = W - 30 - i*30
        d.ellipse([cx-6, 12, cx+6, 24], fill=c)

    # Ribbon area
    draw_rounded_rect(d, (0, 40, W, 120), radius=0, fill=PBI_RIBBON_BG)
    d.text((15, 48), "Home", font=FONT_BOLD, fill=WHITE)
    d.text((75, 48), "Insert", font=FONT_REG, fill=MED_GRAY)
    d.text((140, 48), "Modeling", font=FONT_REG, fill=MED_GRAY)
    d.text((220, 48), "View", font=FONT_REG, fill=MED_GRAY)

    # Ribbon buttons
    btn_labels = ["Get Data", "Recent Sources", "Enter Data", "Refresh"]
    bx = 15
    for bl in btn_labels:
        tw = get_text_size(d, bl, FONT_SM)[0]
        draw_rounded_rect(d, (bx, 75, bx+tw+16, 105), radius=4, fill=(80,80,90), outline=MED_GRAY)
        d.text((bx+8, 82), bl, font=FONT_SM, fill=WHITE)
        bx += tw + 30

    # More ribbon items right side
    rbtn = ["Format", "Sort", "Drill", "Focus"]
    bx2 = W - 200
    for rb in rbtn:
        tw = get_text_size(d, rb, FONT_SM)[0]
        draw_rounded_rect(d, (bx2, 75, bx2+tw+16, 105), radius=4, fill=(80,80,90), outline=MED_GRAY)
        d.text((bx2+8, 82), rb, font=FONT_SM, fill=WHITE)
        bx2 += tw + 24

    # Ribbon separator line
    d.line([(0, 120), (W, 120)], fill=MED_GRAY, width=1)

    # Left panel - Pages
    draw_rounded_rect(d, (0, 120, 220, H-35), radius=0, fill=PBI_SIDEBAR)
    d.line([(220, 120), (220, H-35)], fill=MED_GRAY, width=1)
    
    # Page tabs
    d.text((15, 130), "Pages", font=FONT_BOLD, fill=DARK_GRAY)
    pages = ["Page 1 - Overview", "Page 2 - Sales", "Page 3 - Products"]
    py = 155
    for i, p in enumerate(pages):
        color = MED_BLUE if i == 0 else DARK_GRAY
        bg = LIGHT_BLUE if i == 0 else PBI_SIDEBAR
        draw_rounded_rect(d, (10, py, 210, py+28), radius=4, fill=bg, outline=color)
        d.text((20, py+5), p, font=FONT_SM, fill=color)
        py += 34

    # Selections panel under pages
    d.text((15, py+15), "Selections", font=FONT_BOLD, fill=DARK_GRAY)
    d.text((15, py+38), "Visual: Bar Chart 1", font=FONT_TINY, fill=DARK_GRAY)
    d.text((15, py+54), "Data: Product, Sales", font=FONT_TINY, fill=DARK_GRAY)

    # Main canvas area
    canvas_x, canvas_y = 220, 120
    canvas_w = W - 220 - 310
    canvas_h = H - 120 - 35
    draw_rounded_rect(d, (canvas_x, canvas_y, canvas_x+canvas_w, canvas_y+canvas_h), radius=0, fill=PBI_CANVAS)
    
    # Sample chart on canvas - Bar Chart
    chart_x, chart_y = canvas_x + 20, canvas_y + 20
    chart_w, chart_h = 350, 250
    draw_rounded_rect(d, (chart_x, chart_y, chart_x+chart_w, chart_y+chart_h), radius=0, fill=WHITE, outline=MED_GRAY)
    d.text((chart_x+10, chart_y+8), "Sales by Product", font=FONT_BOLD, fill=DARK_GRAY)
    
    # Bar chart bars
    bar_colors = [MED_BLUE, ACCENT_GREEN, ACCENT_ORANGE, ACCENT_PURPLE, ACCENT_TEAL, (156, 39, 176)]
    bar_labels = ["A", "B", "C", "D", "E", "F"]
    bar_heights = [180, 120, 150, 80, 140, 100]
    bx_start = chart_x + 50
    for i, (bh, bl, bc) in enumerate(zip(bar_heights, bar_labels, bar_colors)):
        bw = 35
        by = chart_y + chart_h - 30 - bh
        bx = bx_start + i * 50
        draw_rounded_rect(d, (bx, by, bx+bw, chart_y+chart_h-30), radius=3, fill=bc)
        d.text((bx+12, chart_y+chart_h-25), bl, font=FONT_TINY, fill=DARK_GRAY)

    # Y-axis labels for bar chart
    for val, y in [("500K", chart_y+30), ("300K", chart_y+100), ("100K", chart_y+170)]:
        d.text((chart_x+5, y), val, font=FONT_TINY, fill=DARK_GRAY)

    # Sample - Card/KPI on canvas
    card_x, card_y = canvas_x + 400, canvas_y + 20
    draw_rounded_rect(d, (card_x, card_y, card_x+250, card_y+70), radius=8, fill=WHITE, outline=MED_BLUE, width=2)
    d.text((card_x+10, card_y+8), "Total Revenue", font=FONT_SM, fill=DARK_GRAY)
    d.text((card_x+10, card_y+32), "$4,250,000", font=FONT_BIG, fill=MED_BLUE)

    # Sample - Donut chart on canvas
    donut_cx = canvas_x + 520
    donut_cy = canvas_y + 200
    donut_r = 60
    for angle_start, color in [(0, MED_BLUE), (120, ACCENT_GREEN), (210, ACCENT_ORANGE), (290, ACCENT_PURPLE)]:
        import math
        for a in range(angle_start, angle_start+60):
            x1 = donut_cx + int(donut_r * math.cos(math.radians(a)))
            y1 = donut_cy + int(donut_r * math.sin(math.radians(a)))
            x2 = donut_cx + int((donut_r-20) * math.cos(math.radians(a)))
            y2 = donut_cy + int((donut_r-20) * math.sin(math.radians(a)))
            d.point((x1, y1), fill=color)

    d.text((donut_cx-35, donut_cy-80), "Segment Split", font=FONT_SM, fill=DARK_GRAY)

    # Sample - Line chart on canvas
    lc_x, lc_y = canvas_x + 20, canvas_y + 290
    lc_w, lc_h = 350, 180
    draw_rounded_rect(d, (lc_x, lc_y, lc_x+lc_w, lc_y+lc_h), radius=0, fill=WHITE, outline=MED_GRAY)
    d.text((lc_x+10, lc_y+8), "Revenue Trend", font=FONT_BOLD, fill=DARK_GRAY)
    # Grid lines
    for gy in range(lc_y+30, lc_y+lc_h-10, 30):
        d.line([(lc_x+40, gy), (lc_x+lc_w-10, gy)], fill=LIGHT_GRAY, width=1)
    # Line
    points = [(lc_x+50, lc_y+120), (lc_x+100, lc_y+90), (lc_x+150, lc_y+100), 
              (lc_x+200, lc_y+60), (lc_x+250, lc_y+70), (lc_x+300, lc_y+40)]
    for i in range(len(points)-1):
        d.line([points[i], points[i+1]], fill=MED_BLUE, width=3)
    for px, py in points:
        d.ellipse([px-4, py-4, px+4, py+4], fill=MED_BLUE)

    # Sample - Map on canvas
    map_x = canvas_x + 400
    map_y = canvas_y + 120
    draw_rounded_rect(d, (map_x, map_y, map_x+250, map_y+180), radius=0, fill=(200, 220, 240), outline=MED_GRAY)
    d.text((map_x+10, map_y+8), "Sales by Country", font=FONT_BOLD, fill=DARK_GRAY)
    # Simple map bubbles
    for pos, label, size in [((map_x+80, map_y+90), "USA", 20), ((map_x+150, map_y+70), "CAN", 15), 
                              ((map_x+190, map_y+100), "MEX", 12)]:
        d.ellipse([pos[0]-size, pos[1]-size, pos[0]+size, pos[1]+size], fill=(*MED_BLUE, 150), outline=WHITE)
        d.text((pos[0]-8, pos[1]+size+2), label, font=FONT_TINY, fill=DARK_GRAY)

    # Sample - Slicer on canvas
    sl_x, sl_y = canvas_x + 400, canvas_y + 320
    draw_rounded_rect(d, (sl_x, sl_y, sl_x+250, sl_y+150), radius=0, fill=WHITE, outline=MED_GRAY)
    d.text((sl_x+10, sl_y+8), "Country Slicer", font=FONT_BOLD, fill=DARK_GRAY)
    countries = ["USA", "Canada", "Germany", "France", "Mexico"]
    for i, c in enumerate(countries):
        cy = sl_y + 35 + i*22
        sel = i == 0
        bg = LIGHT_BLUE if sel else WHITE
        draw_rounded_rect(d, (sl_x+15, cy, sl_x+230, cy+18), radius=3, fill=bg, outline=MED_BLUE if sel else MED_GRAY)
        d.text((sl_x+25, cy+1), c, font=FONT_SM, fill=MED_BLUE if sel else DARK_GRAY)

    # Bottom status bar
    draw_rounded_rect(d, (0, H-35, W, H), radius=0, fill=PBI_DARK)
    d.text((15, H-28), "Ready", font=FONT_SM, fill=ACCENT_GREEN)
    d.text((100, H-28), "|  Rows: 700  |  Tables: 5  |  Memory: 145 MB", font=FONT_TINY, fill=MED_GRAY)

    # RIGHT PANEL - Visualizations
    viz_x = W - 310
    draw_rounded_rect(d, (viz_x, 120, W, 120+220), radius=0, fill=PBI_SIDEBAR)
    d.line([(viz_x, 120), (viz_x, 410)], fill=MED_GRAY, width=1)
    d.text((viz_x+10, 130), "Visualizations", font=FONT_BOLD, fill=DARK_GRAY)
    
    # Viz icons (simple shapes)
    viz_items = [
        ("Stacked Bar", "bar"), ("Line", "line"), ("Pie", "pie"), 
        ("Map", "map"), ("Table", "table"), ("Card", "card"),
        ("Slicer", "slicer"), ("Funnel", "funnel"), ("Scatter", "scatter")
    ]
    vx, vy = viz_x + 15, 158
    for i, (name, vtype) in enumerate(viz_items):
        cx = vx + (i % 5) * 56
        cy = vy + (i // 5) * 60
        # icon background
        highlight = (i == 0)
        fill = LIGHT_BLUE if highlight else WHITE
        outline = MED_BLUE if highlight else MED_GRAY
        draw_rounded_rect(d, (cx, cy, cx+48, cy+48), radius=6, fill=fill, outline=outline, width=2 if highlight else 1)
        
        # Simple icon shapes
        icx, icy = cx+24, cy+24
        if vtype == "bar":
            for j, h in enumerate([18, 10, 14]):
                draw_rounded_rect(d, (icx-12+j*9, icy-h, icx-6+j*9, icy+2), radius=2, fill=MED_BLUE)
        elif vtype == "line":
            d.line([(icx-12, icy+5), (icx-4, icy-8), (icx+4, icy-2), (icx+12, icy-12)], fill=MED_BLUE, width=2)
        elif vtype == "pie":
            d.ellipse([icx-14, icy-14, icx+14, icy+14], outline=MED_BLUE, width=2)
            d.line([(icx, icy), (icx+10, icy-8)], fill=MED_BLUE, width=2)
        elif vtype == "map":
            d.ellipse([icx-12, icy-10, icx+12, icy+10], outline=MED_BLUE, width=2)
        elif vtype == "table":
            for j in range(4):
                d.line([(icx-14, icy-10+j*7), (icx+14, icy-10+j*7)], fill=MED_BLUE, width=1)
        elif vtype == "card":
            draw_rounded_rect(d, (icx-14, icy-8, icx+14, icy+8), radius=3, fill=None, outline=MED_BLUE, width=1)
        elif vtype == "slicer":
            for j in range(4):
                draw_rounded_rect(d, (icx-12, icy-12+j*7, icx+12, icy-12+j*6+5), radius=2, fill=None, outline=MED_BLUE)
        elif vtype == "funnel":
            for j in range(3):
                w = 24 - j*6
                draw_rounded_rect(d, (icx-w//2, icy-10+j*7, icx+w//2, icy-10+j*7+6), radius=2, fill=MED_BLUE)
        elif vtype == "scatter":
            for dx, dy in [(-8, 4), (2, -6), (8, 2), (-3, -3), (6, -8)]:
                d.ellipse([icx+dx-3, icy+dy-3, icx+dx+3, icy+dy+3], fill=MED_BLUE)
    
    # RIGHT PANEL - Fields
    fields_y_start = 340
    draw_rounded_rect(d, (viz_x, fields_y_start, W, H-35), radius=0, fill=PBI_SIDEBAR)
    d.text((viz_x+10, fields_y_start+8), "Data", font=FONT_BOLD, fill=DARK_GRAY)
    
    # Field table
    fy = fields_y_start + 32
    table_name = "Financials"
    draw_rounded_rect(d, (viz_x+5, fy, W-5, fy+22), radius=3, fill=DARK_BLUE)
    d.text((viz_x+12, fy+3), table_name, font=FONT_SM, fill=WHITE)
    # toggle arrow
    d.polygon([(W-20, fy+6), (W-12, fy+6), (W-16, fy+14)], fill=WHITE)
    
    fields = [
        ("Date", "calendar", MED_BLUE),
        ("Product", "text", ACCENT_GREEN),
        ("Segment", "text", ACCENT_GREEN),
        ("Country", "text", ACCENT_GREEN),
        ("Units Sold", "number", ACCENT_ORANGE),
        ("Sales", "number", ACCENT_ORANGE),
        ("Profit", "number", ACCENT_ORANGE),
        ("Discounts", "number", ACCENT_ORANGE),
    ]
    for i, (fname, ftype, fcolor) in enumerate(fields):
        fy2 = fy + 26 + i * 24
        # Type icon
        icon_colors = {"calendar": ACCENT_TEAL, "text": ACCENT_GREEN, "number": ACCENT_ORANGE}
        d.text((viz_x+20, fy2+2), fname, font=FONT_SM, fill=DARK_GRAY)
        # Sigma icon for numeric
        if ftype == "number":
            d.text((W-25, fy2+2), "E", font=FONT_BOLD, fill=ACCENT_ORANGE)
        elif ftype == "calendar":
            d.text((W-22, fy2+2), "o", font=FONT_SM, fill=ACCENT_TEAL)

    # ===== LABELS WITH ARROWS =====
    label_color = ACCENT_ORANGE
    label_font = FONT_BOLD
    label_bg_color = (255, 248, 225)
    
    # Label: Title Bar
    lx, ly = 580, 2
    draw_rounded_rect(d, (lx, ly, lx+120, ly+24), radius=4, fill=label_bg_color, outline=label_color, width=2)
    d.text((lx+8, ly+3), "1. Title Bar", font=label_font, fill=label_color)

    # Label: Ribbon
    lx2, ly2 = 580, 58
    draw_rounded_rect(d, (lx2, ly2, lx2+120, ly2+24), radius=4, fill=label_bg_color, outline=label_color, width=2)
    d.text((lx2+8, ly2+3), "2. Ribbon", font=label_font, fill=label_color)
    d.line([(lx2, ly2+12), (480, ly2+12)], fill=label_color, width=2)

    # Label: Pages Panel
    lx3, ly3 = 0, H-28
    draw_rounded_rect(d, (lx3, ly3, lx3+130, ly3+24), radius=4, fill=label_bg_color, outline=label_color, width=2)
    d.text((lx3+8, ly3+3), "3. Pages Panel", font=label_font, fill=label_color)

    # Label: Report Canvas
    lx4, ly4 = 400, canvas_y + canvas_h - 10
    draw_rounded_rect(d, (lx4, ly4, lx4+150, ly4+24), radius=4, fill=label_bg_color, outline=label_color, width=2)
    d.text((lx4+8, ly4+3), "4. Report Canvas", font=label_font, fill=label_color)

    # Label: Visualizations
    lx5 = viz_x + 60
    ly5 = 125
    # already inside, use a floating label
    draw_rounded_rect(d, (viz_x-5, 100, viz_x+155, 118), radius=4, fill=label_bg_color, outline=label_color, width=2)
    d.text((viz_x+3, 101), "5. Visualizations", font=label_font, fill=label_color)

    # Label: Fields/Data
    draw_rounded_rect(d, (viz_x-5, fields_y_start-25, viz_x+100, fields_y_start-3), radius=4, fill=label_bg_color, outline=label_color, width=2)
    d.text((viz_x+3, fields_y_start-23), "6. Fields Pane", font=label_font, fill=label_color)

    # Label: Status Bar
    draw_rounded_rect(d, (350, H-28, 490, H-4), radius=4, fill=label_bg_color, outline=label_color, width=2)
    d.text((358, H-25), "7. Status Bar", font=label_font, fill=label_color)

    # Legend box at bottom-right
    legend_x = viz_x + 10
    legend_y = H - 95
    draw_rounded_rect(d, (legend_x, legend_y, W-5, H-38), radius=6, fill=WHITE, outline=MED_GRAY)
    d.text((legend_x+8, legend_y+4), "Legend:", font=FONT_BOLD, fill=DARK_GRAY)
    legends = [
        ("Calendar = Date field", ACCENT_TEAL),
        ("Abc = Text field", ACCENT_GREEN),
        ("123 = Number field", ACCENT_ORANGE),
    ]
    for i, (ltxt, lcol) in enumerate(legends):
        d.text((legend_x+10, legend_y+22+i*14), ltxt, font=FONT_TINY, fill=lcol)

    img.save(f"{OUT}/01_pbi_desktop_ui.png", dpi=(150, 150))
    print("Created: 01_pbi_desktop_ui.png")


# ============================================================
# DIAGRAM 2: Get Data / Navigator Dialog
# ============================================================
def create_navigator_dialog():
    W, H = 1000, 600
    img = Image.new("RGB", (W, H), (220, 220, 220))
    d = ImageDraw.Draw(img)

    # Dialog box
    dx, dy = 80, 30
    dw, dh = W-160, H-60
    draw_rounded_rect(d, (dx, dy, dx+dw, dy+dh), radius=8, fill=WHITE, outline=MED_GRAY, width=2)
    
    # Title bar
    draw_rounded_rect(d, (dx, dy, dx+dw, dy+40), radius=8, fill=DARK_BLUE)
    d.rectangle((dx, dy+20, dx+dw, dy+40), fill=DARK_BLUE)
    d.text((dx+15, dy+8), "Navigator", font=FONT_BIG, fill=WHITE)
    # Close button
    d.ellipse([dx+dw-30, dy+8, dx+dw-14, dy+24], fill=ACCENT_RED)

    # Left panel - file list
    lx = dx + 15
    ly = dy + 55
    lw = 280
    lh = dh - 100
    draw_rounded_rect(d, (lx, ly, lx+lw, ly+lh), radius=6, fill=PBI_SIDEBAR, outline=MED_GRAY)
    d.text((lx+10, ly+8), "Choose data to display:", font=FONT_BOLD, fill=DARK_GRAY)

    # Items
    items = [
        ("Financials", True, "700 rows, 12 columns"),
        ("Sheet1", False, "50 rows, 8 columns"),
    ]
    iy = ly + 35
    for name, selected, desc in items:
        bg = LIGHT_BLUE if selected else WHITE
        outline = MED_BLUE if selected else MED_GRAY
        draw_rounded_rect(d, (lx+8, iy, lx+lw-8, iy+55), radius=6, fill=bg, outline=outline, width=2 if selected else 1)
        # Checkbox
        if selected:
            draw_rounded_rect(d, (lx+18, iy+8, lx+32, iy+22), radius=3, fill=MED_BLUE)
            d.text((lx+20, iy+6), "V", font=FONT_SM, fill=WHITE)
        else:
            draw_rounded_rect(d, (lx+18, iy+8, lx+32, iy+22), radius=3, fill=WHITE, outline=MED_GRAY)
        d.text((lx+40, iy+6), name, font=FONT_BOLD, fill=MED_BLUE if selected else DARK_GRAY)
        d.text((lx+40, iy+26), desc, font=FONT_TINY, fill=DARK_GRAY)
        iy += 65

    # Right panel - Data Preview
    px = lx + lw + 15
    py = ly
    pw = dw - lw - 60
    ph = lh - 60
    draw_rounded_rect(d, (px, py, px+pw, py+ph), radius=6, fill=WHITE, outline=MED_GRAY)
    d.text((px+10, py+8), "Data Preview - Financials", font=FONT_BOLD, fill=DARK_GRAY)

    # Table header
    columns = ["Date", "Product", "Segment", "Country", "Sales", "Profit"]
    col_w = pw // len(columns)
    ty = py + 35
    draw_rounded_rect(d, (px+5, ty, px+pw-5, ty+25), radius=3, fill=DARK_BLUE)
    for i, col in enumerate(columns):
        d.text((px+10+i*col_w, ty+4), col, font=FONT_SM, fill=WHITE)
    
    # Table rows
    sample_data = [
        ["1/1/2013", "Montana", "Government", "USA", "$1,280", "$320"],
        ["1/1/2013", "Paseo", "Enterprise", "Canada", "$890", "$210"],
        ["1/1/2013", "Velo", "Midmarket", "Germany", "$650", "$180"],
        ["1/1/2013", "VTT", "Small Business", "France", "$420", "$95"],
        ["1/1/2013", "Carretera", "Government", "USA", "$1,100", "$275"],
        ["1/1/2013", "Montana", "Enterprise", "Mexico", "$980", "$245"],
    ]
    for j, row in enumerate(sample_data):
        ry = ty + 30 + j*24
        bg = LIGHT_GRAY if j % 2 == 0 else WHITE
        draw_rounded_rect(d, (px+5, ry, px+pw-5, ry+22), radius=0, fill=bg)
        for i, val in enumerate(row):
            d.text((px+10+i*col_w, ry+3), val, font=FONT_TINY, fill=DARK_GRAY)

    # Buttons
    by = dy + dh - 45
    draw_rounded_rect(d, (dx+dw-200, by, dx+dw-105, by+30), radius=4, fill=LIGHT_GRAY, outline=MED_GRAY)
    draw_text_centered(d, dx+dw-200, by+6, 95, "Cancel", FONT_BOLD, DARK_GRAY)
    
    draw_rounded_rect(d, (dx+dw-95, by, dx+dw-10, by+30), radius=4, fill=MED_BLUE, outline=MED_BLUE)
    draw_text_centered(d, dx+dw-95, by+6, 85, "Load", FONT_BOLD, WHITE)

    # Label
    draw_rounded_rect(d, (lx+lw//2-60, ly+lh+8, lx+lw//2+80, ly+lh+30), radius=4, fill=(255,248,225), outline=ACCENT_ORANGE, width=2)
    d.text((lx+lw//2-52, ly+lh+10), "Select Sheet", font=FONT_BOLD, fill=ACCENT_ORANGE)

    draw_rounded_rect(d, (px+pw//2-30, py+ph+8, px+pw//2+100, py+ph+30), radius=4, fill=(255,248,225), outline=ACCENT_ORANGE, width=2)
    d.text((px+pw//2-22, py+ph+10), "Data Preview", font=FONT_BOLD, fill=ACCENT_ORANGE)

    # Instruction text
    d.text((dx+15, by-25), "Select your data source, preview it, then click Load to bring data into Power BI.", font=FONT_SM, fill=DARK_GRAY)

    img.save(f"{OUT}/02_navigator_dialog.png", dpi=(150, 150))
    print("Created: 02_navigator_dialog.png")


# ============================================================
# DIAGRAM 3: Power Query Editor
# ============================================================
def create_power_query_editor():
    W, H = 1200, 750
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    # Title bar
    draw_rounded_rect(d, (0, 0, W, 40), radius=0, fill=PBI_BLACK)
    d.text((15, 8), "Power Query Editor - Financials", font=FONT_BOLD, fill=WHITE)
    for i, c in enumerate([ACCENT_GREEN, ACCENT_ORANGE, ACCENT_RED]):
        cx = W - 30 - i*30
        d.ellipse([cx-6, 12, cx+6, 24], fill=c)

    # Ribbon
    draw_rounded_rect(d, (0, 40, W, 110), radius=0, fill=(63, 63, 70))
    tabs = ["Home", "Transform", "Add Column", "View"]
    tx = 15
    for i, tab in enumerate(tabs):
        active = (i == 0)
        bg = MED_BLUE if active else (63,63,70)
        draw_rounded_rect(d, (tx, 42, tx+get_text_size(d, tab, FONT_BOLD)[0]+20, 65), radius=4, fill=bg)
        d.text((tx+10, 47), tab, font=FONT_BOLD, fill=WHITE)
        tx += get_text_size(d, tab, FONT_BOLD)[0] + 35

    # Ribbon tools
    tools = ["From Table/Range", "Remove Columns", "Split Column", "Merge Queries", "Close & Apply"]
    tbx = 15
    for t in tools:
        tw = get_text_size(d, t, FONT_SM)[0]
        draw_rounded_rect(d, (tbx, 72, tbx+tw+16, 100), radius=4, fill=(80,80,90), outline=MED_GRAY)
        d.text((tbx+8, 78), t, font=FONT_SM, fill=WHITE)
        tbx += tw + 30

    # Left panel - Queries
    draw_rounded_rect(d, (0, 110, 220, H-35), radius=0, fill=PBI_SIDEBAR)
    d.line([(220, 110), (220, H-35)], fill=MED_GRAY)
    d.text((15, 120), "Queries", font=FONT_BOLD, fill=DARK_GRAY)
    
    queries = ["Financials", "DimProduct", "DimCountry", "DimSegment", "Calendar"]
    qy = 150
    for i, q in enumerate(queries):
        sel = (i == 0)
        bg = LIGHT_BLUE if sel else PBI_SIDEBAR
        draw_rounded_rect(d, (10, qy, 210, qy+30), radius=4, fill=bg, outline=MED_BLUE if sel else MED_GRAY)
        # table icon
        d.rectangle((18, qy+7, 32, qy+23), outline=MED_BLUE if sel else DARK_GRAY)
        d.line([(18, qy+14), (32, qy+14)], fill=MED_BLUE if sel else DARK_GRAY)
        d.text((38, qy+6), q, font=FONT_SM, fill=MED_BLUE if sel else DARK_GRAY)
        qy += 36

    # Center - Data Preview
    data_x = 220
    data_y = 110
    data_w = W - 220 - 300
    data_h = H - 110 - 35
    
    # Formula bar
    draw_rounded_rect(d, (data_x, data_y, data_x+data_w, data_y+30), radius=0, fill=PBI_SIDEBAR)
    d.text((data_x+5, data_y+5), "fx", font=FONT_BOLD, fill=MED_BLUE)
    d.text((data_x+30, data_y+7), "= Table.AddColumn(#\"Previous Step\", \"NewColumn\", each ...)", font=FONT_SM, fill=DARK_GRAY)

    # Data table
    ty = data_y + 32
    columns = ["Date", "Product", "Segment", "Country", "Units Sold", "Sale Price", "Sales", "Profit"]
    col_w = data_w // len(columns)
    
    # Header
    draw_rounded_rect(d, (data_x, ty, data_x+data_w, ty+28), radius=0, fill=DARK_BLUE)
    for i, col in enumerate(columns):
        # Sort arrow for first column
        d.text((data_x+5+i*col_w, ty+5), col, font=FONT_SM, fill=WHITE)
        if i == 0:
            d.polygon([(data_x+5+get_text_size(d, col, FONT_SM)[0]+5, ty+8),
                       (data_x+5+get_text_size(d, col, FONT_SM)[0]+10, ty+5),
                       (data_x+5+get_text_size(d, col, FONT_SM)[0]+15, ty+8)], fill=ACCENT_ORANGE)
    d.line([(data_x, ty+28), (data_x+data_w, ty+28)], fill=MED_GRAY)
    
    # Rows
    rows = [
        ["1/1/2013", "Montana", "Government", "USA", "250", "$5.10", "$1,275", "$320"],
        ["1/1/2013", "Paseo", "Enterprise", "Canada", "200", "$4.45", "$890", "$210"],
        ["1/1/2013", "Velo", "Midmarket", "Germany", "150", "$4.33", "$650", "$180"],
        ["1/1/2013", "VTT", "Small Business", "France", "120", "$3.50", "$420", "$95"],
        ["1/1/2013", "Carretera", "Government", "USA", "220", "$5.00", "$1,100", "$275"],
        ["1/1/2013", "Montana", "Enterprise", "Mexico", "196", "$5.00", "$980", "$245"],
        ["1/1/2013", "Paseo", "Midmarket", "USA", "175", "$4.45", "$779", "$190"],
        ["1/1/2013", "Velo", "Government", "Canada", "140", "$4.33", "$606", "$155"],
    ]
    for j, row in enumerate(rows):
        ry = ty + 30 + j * 26
        bg = LIGHT_GRAY if j % 2 == 0 else WHITE
        for i, val in enumerate(row):
            x = data_x + 5 + i * col_w
            d.rectangle((x-2, ry, x+col_w-3, ry+24), fill=bg)
            d.text((x, ry+4), val, font=FONT_TINY, fill=DARK_GRAY)
            # Column separator
            d.line([(data_x + i*col_w, ry), (data_x + i*col_w, ry+24)], fill=MED_GRAY)

    # Right panel - Applied Steps
    steps_x = W - 300
    draw_rounded_rect(d, (steps_x, 110, W, H-35), radius=0, fill=PBI_SIDEBAR)
    d.line([(steps_x, 110), (steps_x, W)], fill=MED_GRAY)
    d.text((steps_x+10, 118), "APPLIED STEPS", font=FONT_BOLD, fill=DARK_GRAY)

    steps = [
        ("Source", "Connect to Excel file"),
        ("Navigation", "Select 'Financials' sheet"),
        ("Changed Type", "Set column data types"),
        ("Filtered Rows", "Remove empty rows"),
        ("Renamed Columns", "Clean column names"),
        ("Added Custom", "New calculated column"),
    ]
    sy = 148
    for i, (step, desc) in enumerate(steps):
        active = (i == len(steps)-1)
        bg = LIGHT_BLUE if active else WHITE
        border = MED_BLUE if active else MED_GRAY
        draw_rounded_rect(d, (steps_x+5, sy, W-10, sy+50), radius=4, fill=bg, outline=border, width=1 if not active else 2)
        # Gear icon
        draw_rounded_rect(d, (steps_x+10, sy+5, steps_x+26, sy+21), radius=2, fill=border)
        d.text((steps_x+12, sy+5), "X", font=FONT_TINY, fill=WHITE if active else DARK_GRAY)
        d.text((steps_x+32, sy+5), step, font=FONT_BOLD, fill=MED_BLUE if active else DARK_GRAY)
        d.text((steps_x+15, sy+28), desc, font=FONT_TINY, fill=DARK_GRAY)
        sy += 55

    # Status bar
    draw_rounded_rect(d, (0, H-35, W, H), radius=0, fill=PBI_DARK)
    d.text((15, H-28), "Applied Steps: 6  |  Rows: 700  |  Columns: 12  |  Errors: 0", font=FONT_TINY, fill=MED_GRAY)
    draw_rounded_rect(d, (W-140, H-30, W-10, H-8), radius=4, fill=MED_BLUE)
    draw_text_centered(d, W-140, H-27, 130, "Close & Apply", FONT_BOLD, WHITE)

    # Labels
    label_bg = (255, 248, 225)
    lc = ACCENT_ORANGE

    draw_rounded_rect(d, (steps_x+5, 88, steps_x+145, 108), radius=4, fill=label_bg, outline=lc, width=2)
    d.text((steps_x+13, 90), "3. Applied Steps", font=FONT_BOLD, fill=lc)

    draw_rounded_rect(d, (105, 88, 245, 108), radius=4, fill=label_bg, outline=lc, width=2)
    d.text((113, 90), "2. Query List", font=FONT_BOLD, fill=lc)

    draw_rounded_rect(d, (350, 88, 550, 108), radius=4, fill=label_bg, outline=lc, width=2)
    d.text((358, 90), "1. Data Preview + Formula Bar", font=FONT_BOLD, fill=lc)

    img.save(f"{OUT}/03_power_query_editor.png", dpi=(150, 150))
    print("Created: 03_power_query_editor.png")


# ============================================================
# DIAGRAM 4: Data Model / Relationships View
# ============================================================
def create_data_model():
    W, H = 1000, 700
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    # Title
    draw_rounded_rect(d, (0, 0, W, 45), radius=0, fill=DARK_BLUE)
    d.text((15, 10), "Data Model View - Star Schema", font=FONT_BIG, fill=WHITE)
    
    # Ribbon icons
    ribbons = ["Model", "Manage Relationships", "Create Hierarchy", "New Table", "New Measure"]
    rx = 300
    for r in ribbons:
        tw = get_text_size(d, r, FONT_SM)[0]
        draw_rounded_rect(d, (rx, 8, rx+tw+16, 36), radius=4, fill=MED_BLUE, outline=MED_BLUE)
        d.text((rx+8, 13), r, font=FONT_SM, fill=WHITE)
        rx += tw + 24

    # FACT TABLE (center)
    fx, fy = 380, 280
    fw, fh = 240, 200
    draw_rounded_rect(d, (fx, fy, fx+fw, fy+fh), radius=8, fill=WHITE, outline=ACCENT_ORANGE, width=3)
    # Header
    draw_rounded_rect(d, (fx, fy, fx+fw, fy+32), radius=8, fill=ACCENT_ORANGE)
    d.rectangle((fx, fy+20, fx+fw, fy+32), fill=ACCENT_ORANGE)
    draw_text_centered(d, fx, fy+6, fw, "FACT_Financials", FONT_BOLD, WHITE)
    
    fact_cols = ["Date", "ProductKey", "SegmentKey", "CountryKey", "Units Sold", "Sales", "COGS", "Profit"]
    for i, col in enumerate(fact_cols):
        cy = fy + 40 + i * 20
        is_key = "Key" in col
        if is_key:
            draw_rounded_rect(d, (fx+5, cy, fx+fw-5, cy+18), radius=3, fill=(255, 243, 224))
            d.text((fx+10, cy+2), "K " + col, font=FONT_SM, fill=ACCENT_ORANGE)
        else:
            d.text((fx+15, cy+2), col, font=FONT_SM, fill=DARK_GRAY)

    # DIM PRODUCT (top-left)
    dim_tables = [
        ("DIM_Product", ["ProductKey (PK)", "Product", "Category"], 80, 100, ACCENT_GREEN),
        ("DIM_Country", ["CountryKey (PK)", "Country", "Region"], 80, 460, ACCENT_PURPLE),
        ("DIM_Segment", ["SegmentKey (PK)", "Segment", "Industry"], 680, 100, ACCENT_TEAL),
        ("Calendar", ["DateKey (PK)", "Date", "Month", "Year"], 680, 460, MED_BLUE),
    ]

    for name, cols, dx, dy, color in dim_tables:
        dw2 = 200
        dh2 = 30 + len(cols) * 20
        draw_rounded_rect(d, (dx, dy, dx+dw2, dy+dh2), radius=8, fill=WHITE, outline=color, width=2)
        draw_rounded_rect(d, (dx, dy, dx+dw2, dy+30), radius=8, fill=color)
        d.rectangle((dx, dy+20, dx+dw2, dy+30), fill=color)
        draw_text_centered(d, dx, dy+5, dw2, name, FONT_BOLD, WHITE)
        for i, col in enumerate(cols):
            cy2 = dy + 35 + i * 20
            is_pk = "PK" in col
            if is_pk:
                draw_rounded_rect(d, (dx+5, cy2, dx+dw2-5, cy2+18), radius=3, fill=(232, 245, 233))
            d.text((dx+10, cy2+2), col, font=FONT_SM, fill=DARK_GRAY)

    # RELATIONSHIP LINES with arrows
    def draw_rel_line(start_table_pos, end_table_pos, start_col_y_offset, end_col_y_offset, label):
        sx = start_table_pos[0] + (start_table_pos[2] - start_table_pos[0])
        sy = start_table_pos[1] + start_col_y_offset
        ex = end_table_pos[0]
        ey = end_table_pos[1] + end_col_y_offset
        mid_x = (sx + ex) // 2
        # Draw line
        d.line([(sx, sy), (mid_x, sy), (mid_x, ey), (ex, ey)], fill=DARK_GRAY, width=2)
        # "1" on fact side
        d.text((sx-15, sy-5), "1", font=FONT_BOLD, fill=ACCENT_RED)
        # "*" on dim side
        d.text((ex+5, ey-5), "*", font=FONT_BOLD, fill=ACCENT_RED)
        # Label
        draw_rounded_rect(d, (mid_x-20, (sy+ey)//2-8, mid_x+20, (sy+ey)//2+8), radius=3, fill=LIGHT_BLUE, outline=MED_BLUE)
        draw_text_centered(d, mid_x-20, (sy+ey)//2-6, 40, label, FONT_TINY, MED_BLUE)

    # Fact -> Product
    draw_rel_line((fx, fy, fx+fw, fy+fh), (80, 100, 280, 190), 60, 55, "1:*")
    # Fact -> Segment  
    draw_rel_line((fx+fw, fy, fx+fw, fy+fh), (680, 100, 880, 190), 60, 55, "1:*")
    # Fact -> Country
    draw_rel_line((fx, fy, fx+fw, fy+fh), (80, 460, 280, 540), 80, 55, "1:*")
    # Fact -> Calendar
    draw_rel_line((fx+fw, fy, fx+fw, fy+fh), (680, 460, 880, 560), 40, 55, "1:*")

    # Labels
    label_bg = (255, 248, 225)
    lc = ACCENT_ORANGE

    # Fact label
    draw_rounded_rect(d, (fx+fw//2-40, fy+fh+10, fx+fw//2+100, fy+fh+30), radius=4, fill=label_bg, outline=lc, width=2)
    d.text((fx+fw//2-32, fy+fh+12), "Fact Table (Center)", font=FONT_BOLD, fill=lc)

    # Dim label
    draw_rounded_rect(d, (680, 70, 880, 92), radius=4, fill=label_bg, outline=lc, width=2)
    d.text((688, 72), "Dimension Tables", font=FONT_BOLD, fill=lc)

    # Relationship label
    draw_rounded_rect(d, (430, 240, 600, 262), radius=4, fill=label_bg, outline=lc, width=2)
    d.text((438, 242), "Relationship Lines", font=FONT_BOLD, fill=lc)

    # Star schema annotation
    draw_rounded_rect(d, (W-280, H-50, W-10, H-10), radius=6, fill=(232, 245, 233), outline=ACCENT_GREEN, width=2)
    d.text((W-272, H-45), "This is called a STAR SCHEMA", font=FONT_BOLD, fill=ACCENT_GREEN)
    d.text((W-272, H-28), "Best practice for data modeling!", font=FONT_SM, fill=ACCENT_GREEN)

    img.save(f"{OUT}/04_data_model.png", dpi=(150, 150))
    print("Created: 04_data_model.png")


# ============================================================
# DIAGRAM 5: Building a Visualization (drag & drop concept)
# ============================================================
def create_build_viz():
    W, H = 1100, 650
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    # Title
    d.text((W//2-150, 10), "How to Build a Visualization", font=FONT_BIG, fill=DARK_BLUE)
    d.line([(0, 45), (W, 45)], fill=MED_BLUE, width=2)

    # Step 1: Fields pane
    d.text((30, 60), "STEP 1", font=FONT_BIG, fill=ACCENT_ORANGE)
    d.text((30, 88), "Find your field", font=FONT_BOLD, fill=DARK_GRAY)
    d.text((30, 110), "In the Fields pane on the right,", font=FONT_SM, fill=DARK_GRAY)
    d.text((30, 128), "find the column you want to use.", font=FONT_SM, fill=DARK_GRAY)
    
    # Mini fields pane
    draw_rounded_rect(d, (30, 160, 220, 370), radius=8, fill=PBI_SIDEBAR, outline=MED_GRAY)
    d.text((42, 168), "Fields", font=FONT_BOLD, fill=DARK_GRAY)
    draw_rounded_rect(d, (38, 190, 212, 212), radius=4, fill=DARK_BLUE)
    d.text((46, 193), "Financials", font=FONT_SM, fill=WHITE)
    
    field_items = [
        ("Date", False), ("Product", False), ("Country", False), 
        ("Sales", True), ("Profit", False)
    ]
    for i, (f, highlight) in enumerate(field_items):
        fy = 218 + i*28
        bg = (255, 243, 224) if highlight else PBI_SIDEBAR
        outline = ACCENT_ORANGE if highlight else MED_GRAY
        draw_rounded_rect(d, (42, fy, 210, fy+24), radius=4, fill=bg, outline=outline, width=2 if highlight else 1)
        d.text((52, fy+4), f, font=FONT_SM, fill=ACCENT_ORANGE if highlight else DARK_GRAY)
        if highlight:
            d.text((190, fy+4), "123", font=FONT_TINY, fill=ACCENT_ORANGE)

    # Arrow 1
    draw_arrow(d, (240, 290), (340, 290), MED_BLUE, 3)
    d.text((260, 270), "Drag &", font=FONT_BOLD, fill=MED_BLUE)
    d.text((258, 288), "Drop!", font=FONT_BOLD, fill=MED_BLUE)

    # Step 2: Visual
    d.text((360, 60), "STEP 2", font=FONT_BIG, fill=ACCENT_ORANGE)
    d.text((360, 88), "Drop onto canvas", font=FONT_BOLD, fill=DARK_GRAY)
    d.text((360, 110), "Drag the field to the Report", font=FONT_SM, fill=DARK_GRAY)
    d.text((360, 128), "Canvas. Power BI creates a", font=FONT_SM, fill=DARK_GRAY)
    d.text((360, 146), "visualization automatically.", font=FONT_SM, fill=DARK_GRAY)

    # Mini canvas with bar chart appearing
    draw_rounded_rect(d, (360, 160, 720, 370), radius=8, fill=PBI_CANVAS, outline=MED_GRAY)
    # Animated-looking chart
    draw_rounded_rect(d, (380, 180, 700, 350), radius=6, fill=WHITE, outline=MED_BLUE, width=2)
    d.text((395, 188), "Sales by Product (Auto-created)", font=FONT_BOLD, fill=MED_GRAY)
    
    bar_colors_list = [MED_BLUE, ACCENT_GREEN, ACCENT_ORANGE]
    bar_heights_list = [120, 85, 105]
    bar_labels_list = ["Montana", "Paseo", "Velo"]
    for i, (bh, bl, bc) in enumerate(zip(bar_heights_list, bar_labels_list, bar_colors_list)):
        bx = 420 + i * 90
        by = 330 - bh
        draw_rounded_rect(d, (bx, by, bx+50, 330), radius=3, fill=bc)
        d.text((bx+8, 335), bl, font=FONT_TINY, fill=DARK_GRAY)

    # Arrow 2
    draw_arrow(d, (740, 270), (840, 270), MED_BLUE, 3)
    d.text((755, 250), "Click", font=FONT_BOLD, fill=MED_BLUE)
    d.text((755, 268), "Format", font=FONT_BOLD, fill=MED_BLUE)

    # Step 3: Format
    d.text((860, 60), "STEP 3", font=FONT_BIG, fill=ACCENT_ORANGE)
    d.text((860, 88), "Format & customize", font=FONT_BOLD, fill=DARK_GRAY)
    d.text((860, 110), "Use the Format pane to change", font=FONT_SM, fill=DARK_GRAY)
    d.text((860, 128), "colors, titles, labels, and", font=FONT_SM, fill=DARK_GRAY)
    d.text((860, 146), "make it look professional.", font=FONT_SM, fill=DARK_GRAY)

    # Mini format pane
    draw_rounded_rect(d, (860, 160, 1070, 370), radius=8, fill=PBI_SIDEBAR, outline=MED_GRAY)
    d.text((872, 168), "Format", font=FONT_BOLD, fill=DARK_GRAY)
    
    format_items = [
        ("Title", True),
        ("Data labels", False),
        ("Legend", False),
        ("X-axis", False),
        ("Y-axis", False),
        ("Colors", True),
    ]
    for i, (fi, expanded) in enumerate(format_items):
        fy2 = 192 + i*28
        d.text((875, fy2+4), ">" if expanded else "v", font=FONT_SM, fill=DARK_GRAY)
        d.text((895, fy2+4), fi, font=FONT_SM, fill=MED_BLUE if expanded else DARK_GRAY)
        if expanded:
            d.line([(872, fy2+24), (1060, fy2+24)], fill=LIGHT_GRAY)
            # Sub-options
            d.text((905, fy2+24), "  ON", font=FONT_TINY, fill=ACCENT_GREEN)

    # Final result at bottom
    d.line([(0, 400), (W, 400)], fill=MED_BLUE, width=2)
    d.text((W//2-100, 415), "FINAL RESULT", font=FONT_BIG, fill=ACCENT_GREEN)
    
    # Show final polished chart
    draw_rounded_rect(d, (200, 460, 900, 620), radius=10, fill=WHITE, outline=MED_BLUE, width=2)
    # Title
    draw_text_centered(d, 200, 468, 700, "Total Sales by Product Category", FONT_BOLD, DARK_BLUE)
    
    # Professional bar chart
    final_bars = [("Montana", 150, MED_BLUE), ("Paseo", 110, ACCENT_GREEN), 
                  ("Velo", 130, ACCENT_ORANGE), ("VTT", 80, ACCENT_PURPLE),
                  ("Carretera", 120, ACCENT_TEAL)]
    bx_start = 260
    for i, (label, h, color) in enumerate(final_bars):
        bw = 60
        bx = bx_start + i * 120
        by = 595 - h
        draw_rounded_rect(d, (bx, by, bx+bw, 595), radius=4, fill=color)
        # Value on top
        val = f"${h*10}K"
        tw = get_text_size(d, val, FONT_TINY)[0]
        d.text((bx + (bw-tw)//2, by-16), val, font=FONT_TINY, fill=DARK_GRAY)
        # Label
        tw2 = get_text_size(d, label, FONT_TINY)[0]
        d.text((bx + (bw-tw2)//2, 600), label, font=FONT_TINY, fill=DARK_GRAY)

    # Y axis
    for val, y in [("$1500K", 445), ("$1000K", 495), ("$500K", 545)]:
        d.text((215, y), val, font=FONT_TINY, fill=DARK_GRAY)
        d.line([(275, y+5), (870, y+5)], fill=LIGHT_GRAY, width=1)

    img.save(f"{OUT}/05_build_visualization.png", dpi=(150, 150))
    print("Created: 05_build_visualization.png")


# ============================================================
# DIAGRAM 6: Dashboard Layout (multi-page concept)
# ============================================================
def create_dashboard_layout():
    W, H = 1200, 500
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    d.text((W//2-180, 8), "Dashboard: Multiple Pages Example", font=FONT_BIG, fill=DARK_BLUE)
    d.line([(0, 42), (W, 42)], fill=MED_BLUE, width=2)

    # Page tabs at top
    pages = [("Overview", True), ("Sales Detail", False), ("Products", False)]
    px = 30
    for name, active in pages:
        bg = MED_BLUE if active else LIGHT_GRAY
        tc = WHITE if active else DARK_GRAY
        tw = get_text_size(d, name, FONT_BOLD)[0]
        draw_rounded_rect(d, (px, 52, px+tw+30, 80), radius=4, fill=bg, outline=bg)
        d.text((px+15, 56), name, font=FONT_BOLD, fill=tc)
        px += tw + 45

    # Page 1: Overview
    # Row 1: Cards
    cards = [
        ("Total Revenue", "$4.25M", "+12%", ACCENT_GREEN),
        ("Total Profit", "$1.8M", "+8%", ACCENT_GREEN),
        ("Units Sold", "42,500", "+15%", ACCENT_GREEN),
        ("Avg Discount", "5.2%", "-2%", ACCENT_RED),
    ]
    cx = 30
    for title, value, change, change_color in cards:
        draw_rounded_rect(d, (cx, 100, cx+270, 180), radius=8, fill=WHITE, outline=MED_GRAY, width=2)
        d.text((cx+15, 110), title, font=FONT_SM, fill=DARK_GRAY)
        d.text((cx+15, 135), value, font=FONT_BIG, fill=MED_BLUE)
        # Change indicator
        d.text((cx+190, 150), change, font=FONT_SM, fill=change_color)
        cx += 290

    # Row 2: Bar Chart + Pie Chart
    # Bar chart
    draw_rounded_rect(d, (30, 200, 600, 430), radius=8, fill=WHITE, outline=MED_GRAY, width=2)
    d.text((45, 210), "Sales by Product", font=FONT_BOLD, fill=DARK_GRAY)
    bars = [("A", 150, MED_BLUE), ("B", 100, ACCENT_GREEN), ("C", 130, ACCENT_ORANGE), 
            ("D", 80, ACCENT_PURPLE), ("E", 110, ACCENT_TEAL)]
    bx = 80
    for label, h, color in bars:
        by = 405 - h
        draw_rounded_rect(d, (bx, by, bx+50, 405), radius=3, fill=color)
        d.text((bx+15, 410), label, font=FONT_TINY, fill=DARK_GRAY)
        bx += 95

    # Pie/Donut chart
    draw_rounded_rect(d, (620, 200, 900, 430), radius=8, fill=WHITE, outline=MED_GRAY, width=2)
    d.text((635, 210), "Revenue by Segment", font=FONT_BOLD, fill=DARK_GRAY)
    
    import math
    pcx, pcy, pr = 760, 330, 65
    segments = [(0, 130, MED_BLUE, "Govt"), (130, 230, ACCENT_GREEN, "Ent"), 
                (230, 310, ACCENT_ORANGE, "Mid"), (310, 360, ACCENT_PURPLE, "SB")]
    for start, end, color, label in segments:
        # Draw arc approximation
        for a in range(start, end):
            x1 = pcx + int(pr * math.cos(math.radians(a)))
            y1 = pcy + int(pr * math.sin(math.radians(a)))
            x2 = pcx + int((pr-25) * math.cos(math.radians(a)))
            y2 = pcy + int((pr-25) * math.sin(math.radians(a)))
            d.line([(x1, y1), (x2, y2)], fill=color, width=2)
        mid_a = (start + end) // 2
        lx = pcx + int((pr+20) * math.cos(math.radians(mid_a)))
        ly = pcy + int((pr+20) * math.sin(math.radians(mid_a)))
        tw = get_text_size(d, label, FONT_TINY)[0]
        d.text((lx-tw//2, ly-5), label, font=FONT_TINY, fill=DARK_GRAY)

    # Line chart
    draw_rounded_rect(d, (920, 200, 1170, 430), radius=8, fill=WHITE, outline=MED_GRAY, width=2)
    d.text((935, 210), "Monthly Trend", font=FONT_BOLD, fill=DARK_GRAY)
    points = [(940, 400), (970, 370), (1000, 380), (1030, 340), (1060, 310), (1090, 290), (1120, 260)]
    for i in range(len(points)-1):
        d.line([points[i], points[i+1]], fill=MED_BLUE, width=2)
    for px2, py2 in points:
        d.ellipse([px2-3, py2-3, px2+3, py2+3], fill=MED_BLUE)
    d.text((940, 410), "Jan", font=FONT_TINY, fill=DARK_GRAY)
    d.text((1110, 410), "Jun", font=FONT_TINY, fill=DARK_GRAY)

    # Slicers row at bottom
    d.text((30, 445), "Filters:", font=FONT_BOLD, fill=DARK_GRAY)
    
    # Country slicer
    draw_rounded_rect(d, (100, 438, 400, 488), radius=6, fill=WHITE, outline=MED_BLUE, width=2)
    d.text((115, 442), "Country:", font=FONT_SM, fill=DARK_GRAY)
    countries = ["USA", "Canada", "Germany", "France", "Mexico"]
    scx = 185
    for i, c in enumerate(countries):
        sel = i == 0
        bg = LIGHT_BLUE if sel else LIGHT_GRAY
        draw_rounded_rect(d, (scx, 445, scx+38, 465), radius=12, fill=bg, outline=MED_BLUE if sel else MED_GRAY)
        d.text((scx+5, 448), c, font=FONT_TINY, fill=MED_BLUE if sel else DARK_GRAY)
        scx += 42

    # Legend at bottom-right
    draw_rounded_rect(d, (800, 440, 1170, 490), radius=6, fill=(240, 248, 255), outline=MED_BLUE)
    d.text((815, 448), "Tip: Click any slicer button to filter ALL charts on this page!", font=FONT_SM, fill=MED_BLUE)

    img.save(f"{OUT}/06_dashboard_layout.png", dpi=(150, 150))
    print("Created: 06_dashboard_layout.png")


# ============================================================
# DIAGRAM 7: Publish to Power BI Service flow
# ============================================================
def create_publish_flow():
    W, H = 1100, 450
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    d.text((W//2-180, 10), "Publishing Your Report: Desktop to Cloud", font=FONT_BIG, fill=DARK_BLUE)
    d.line([(0, 42), (W, 42)], fill=MED_BLUE, width=2)

    # Step boxes
    steps = [
        ("1. Build Report", "Create your dashboard\nin Power BI Desktop", MED_BLUE, 
         ["Design visuals", "Add measures", "Format charts"]),
        ("2. Click Publish", "Go to Home > Publish\nSelect your Workspace", ACCENT_GREEN,
         ["File menu", "Publish button", "Choose workspace"]),
        ("3. Power BI Service", "Your report appears\nin the cloud (online)", ACCENT_ORANGE,
         ["Open in browser", "app.powerbi.com", "Share with team"]),
        ("4. Share & Collaborate", "Others can view your\nreport online", ACCENT_PURPLE,
         ["Email link", "Set permissions", "Mobile app"]),
    ]

    sx = 30
    for i, (title, desc, color, items) in enumerate(steps):
        bx = sx + i * 270
        
        # Main box
        draw_rounded_rect(d, (bx, 65, bx+240, 230), radius=10, fill=WHITE, outline=color, width=3)
        # Header
        draw_rounded_rect(d, (bx, 65, bx+240, 105), radius=10, fill=color)
        d.rectangle((bx, 90, bx+240, 105), fill=color)
        draw_text_centered(d, bx, 70, 240, title, FONT_BOLD, WHITE)
        
        # Description
        lines = desc.split("\n")
        for j, line in enumerate(lines):
            draw_text_centered(d, bx, 115+j*18, 240, line, FONT_SM, DARK_GRAY)
        
        # Items
        for j, item in enumerate(items):
            iy = 160 + j * 20
            d.text((bx+20, iy), "> " + item, font=FONT_TINY, fill=color)
        
        # Arrow between steps
        if i < len(steps) - 1:
            ax = bx + 245
            ay = 148
            draw_arrow(d, (ax, ay), (ax+20, ay), DARK_GRAY, 3)

    # Bottom section: Power BI Service screen mockup
    d.line([(0, 260), (W, 260)], fill=MED_GRAY, width=1)
    d.text((W//2-100, 270), "Power BI Service (Online)", font=FONT_BIG, fill=MED_BLUE)
    
    # Browser-like mockup
    draw_rounded_rect(d, (100, 300, 1000, 430), radius=8, fill=WHITE, outline=MED_GRAY, width=2)
    # Browser bar
    draw_rounded_rect(d, (100, 300, 1000, 325), radius=8, fill=LIGHT_GRAY)
    d.rectangle((100, 315, 1000, 325), fill=LIGHT_GRAY)
    d.text((115, 305), "app.powerbi.com", font=FONT_SM, fill=MED_BLUE)
    # Browser dots
    d.ellipse([115, 308, 122, 315], fill=ACCENT_RED)
    d.ellipse([127, 308, 134, 315], fill=ACCENT_ORANGE)
    d.ellipse([139, 308, 146, 315], fill=ACCENT_GREEN)
    
    # Workspace content
    workspace_items = [
        ("Financial Report", "Report", MED_BLUE),
        ("Financial Dataset", "Dataset", ACCENT_GREEN),
        ("Sales Dashboard", "Dashboard", ACCENT_ORANGE),
    ]
    wx = 130
    for name, item_type, color in workspace_items:
        # icon
        if item_type == "Report":
            d.rectangle((wx+5, 345, wx+35, 375), outline=color, width=2)
            d.line([(wx+15, 355), (wx+28, 355)], fill=color, width=2)
            d.line([(wx+15, 362), (wx+25, 362)], fill=color, width=2)
        elif item_type == "Dataset":
            d.ellipse([wx+8, 348, wx+32, 372], outline=color, width=2)
            d.text((wx+14, 354), "DB", font=FONT_TINY, fill=color)
        else:
            draw_rounded_rect(d, (wx+5, 348, wx+35, 378), radius=4, fill=None, outline=color, width=2)
            d.line([(wx+10, 360), (wx+30, 360)], fill=color, width=1)
            d.line([(wx+10, 365), (wx+30, 365)], fill=color, width=1)
        
        d.text((wx+42, 350), name, font=FONT_BOLD, fill=DARK_GRAY)
        d.text((wx+42, 368), item_type, font=FONT_TINY, fill=color)
        wx += 260

    # Share button
    draw_rounded_rect(d, (880, 340, 980, 370), radius=6, fill=MED_BLUE)
    draw_text_centered(d, 880, 348, 100, "Share", FONT_BOLD, WHITE)

    img.save(f"{OUT}/07_publish_flow.png", dpi=(150, 150))
    print("Created: 07_publish_flow.png")


# ============================================================
# DIAGRAM 8: DAX Formula concept
# ============================================================
def create_dax_concept():
    W, H = 1000, 500
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    d.text((W//2-120, 10), "DAX Formula: Easy Explanation", font=FONT_BIG, fill=DARK_BLUE)
    d.line([(0, 42), (W, 42)], fill=MED_BLUE, width=2)

    # Formula breakdown
    formula = 'Total Sales = SUM(Financials[Sales])'
    
    # Measure name part
    d.text((30, 65), "A DAX formula has 3 parts:", font=FONT_BOLD, fill=DARK_GRAY)
    
    # Part 1: Measure Name
    draw_rounded_rect(d, (30, 95, 260, 145), radius=8, fill=(227, 242, 253), outline=MED_BLUE, width=2)
    d.text((45, 100), "PART 1: Name", font=FONT_BOLD, fill=MED_BLUE)
    d.text((45, 120), "Total Sales", font=FONT_BIG, fill=DARK_BLUE)
    d.text((270, 110), "This is the name you give", font=FONT_SM, fill=DARK_GRAY)
    d.text((270, 128), "to your calculation.", font=FONT_SM, fill=DARK_GRAY)
    draw_arrow(d, (260, 120), (268, 120), MED_BLUE, 2)

    # Part 2: Operator
    draw_rounded_rect(d, (30, 160, 260, 210), radius=8, fill=(255, 243, 224), outline=ACCENT_ORANGE, width=2)
    d.text((45, 165), "PART 2: Equals Sign", font=FONT_BOLD, fill=ACCENT_ORANGE)
    d.text((45, 185), "=", font=FONT_BIG, fill=ACCENT_ORANGE)
    d.text((270, 175), "Tells Power BI: calculate", font=FONT_SM, fill=DARK_GRAY)
    d.text((270, 193), "this value.", font=FONT_SM, fill=DARK_GRAY)
    draw_arrow(d, (260, 185), (268, 185), MED_BLUE, 2)

    # Part 3: Function + Column
    draw_rounded_rect(d, (30, 225, 260, 290), radius=8, fill=(232, 245, 233), outline=ACCENT_GREEN, width=2)
    d.text((45, 230), "PART 3: Calculation", font=FONT_BOLD, fill=ACCENT_GREEN)
    d.text((45, 250), "SUM(Financials[Sales])", font=FONT_BOLD, fill=ACCENT_GREEN)
    d.text((270, 240), "SUM = add up everything", font=FONT_SM, fill=DARK_GRAY)
    d.text((270, 258), "Financials[Sales] = column", font=FONT_SM, fill=DARK_GRAY)
    d.text((270, 276), "Result: Total of Sales column", font=FONT_SM, fill=DARK_GRAY)
    draw_arrow(d, (260, 260), (268, 260), MED_BLUE, 2)

    # Full formula
    d.line([(0, 310), (W, 310)], fill=MED_GRAY, width=1)
    d.text((W//2-200, 320), "Full Formula Together:", font=FONT_BIG, fill=DARK_BLUE)
    
    # Formula box with syntax highlighting
    draw_rounded_rect(d, (150, 360, 850, 420), radius=10, fill=(45, 45, 48))
    # Measure name (yellow)
    d.text((170, 375), "Total Sales", font=FONT_BIG, fill=(255, 235, 59))
    # Equals (white)
    d.text((365, 375), "=", font=FONT_BIG, fill=WHITE)
    # Function (light blue)
    d.text((400, 375), "SUM", font=FONT_BIG, fill=(100, 181, 246))
    # Parentheses and table/column
    d.text((470, 375), "( Financials [ Sales ] )", font=FONT_BIG, fill=(255, 255, 255))

    # Color legend
    ly = 435
    legends = [
        ((255, 235, 59), "= Your custom name"),
        ((100, 181, 246), "= DAX function (SUM, AVG, etc.)"),
        (WHITE, "= Table name and column name"),
    ]
    lx = 150
    for color, desc in legends:
        d.rectangle((lx, ly, lx+18, ly+18), fill=color, outline=MED_GRAY)
        d.text((lx+25, ly+1), desc, font=FONT_SM, fill=DARK_GRAY)
        lx += 260

    # Where to write DAX
    d.line([(0, 465), (W, 465)], fill=MED_BLUE, width=2)
    d.text((30, 472), "Where do you write DAX?", font=FONT_BOLD, fill=DARK_BLUE)
    d.text((300, 472), "Click: Home > New Measure  OR  Right-click on a table > New Measure", font=FONT_SM, fill=DARK_GRAY)

    img.save(f"{OUT}/08_dax_concept.png", dpi=(150, 150))
    print("Created: 08_dax_concept.png")


# ============================================================
# Run all diagram generators
# ============================================================
if __name__ == "__main__":
    create_pbi_desktop_ui()
    create_navigator_dialog()
    create_power_query_editor()
    create_data_model()
    create_build_viz()
    create_dashboard_layout()
    create_publish_flow()
    create_dax_concept()
    print("\nAll 8 diagrams created successfully!")
