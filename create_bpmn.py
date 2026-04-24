import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, RegularPolygon
import numpy as np

# Font setup
plt.rcParams['font.sans-serif'] = ['DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# Colors
C = {
    'start': '#4CAF50', 'end': '#F44336', 'task': '#3B5998',
    'task_fill': '#FFFFFF', 'gateway': '#FF9800', 'gateway_fill': '#FFF3E0',
    'timer': '#FF5722', 'service': '#E3F2FD', 'service_border': '#1976D2',
    'swim1': '#F8F9FA', 'swim2': '#FFFFFF', 'swim3': '#F0F4F8',
    'annotation': '#FFF9C4', 'arrow': '#555555', 'text': '#1A1A1A',
    'reject': '#FFCDD2', 'lane_label': '#ECEFF1'
}

def draw_rounded_box(ax, x, y, w, h, text, fill='white', border='#3B5998', fontsize=7, bold=False):
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                         boxstyle="round,pad=0.05", facecolor=fill,
                         edgecolor=border, linewidth=1.5)
    ax.add_patch(box)
    weight = 'bold' if bold else 'normal'
    ax.text(x, y, text, ha='center', va='center', fontsize=fontsize,
            color=C['text'], wrap=True, weight=weight,
            bbox=dict(facecolor='none', edgecolor='none', pad=0))

def draw_circle(ax, x, y, r, fill, label='', fontsize=7):
    circle = Circle((x, y), r, facecolor=fill, edgecolor='#333333', linewidth=1.5)
    ax.add_patch(circle)
    if label:
        ax.text(x, y, label, ha='center', va='center', fontsize=fontsize,
                color='white', weight='bold')

def draw_diamond(ax, x, y, size, text, fontsize=6):
    diamond = RegularPolygon((x, y), numVertices=4, radius=size,
                             orientation=np.pi/4, facecolor=C['gateway_fill'],
                             edgecolor=C['gateway'], linewidth=1.5)
    ax.add_patch(diamond)
    ax.text(x, y, text, ha='center', va='center', fontsize=fontsize,
            color=C['text'], weight='bold')

def draw_arrow(ax, x1, y1, x2, y2, label='', color='#555555'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=1.3))
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx+0.15, my+0.1, label, fontsize=6, color=C['gateway'],
                weight='bold', style='italic')

def draw_timer(ax, x, y, r, text, fontsize=6):
    circle = Circle((x, y), r, facecolor='#FFF3E0', edgecolor=C['timer'],
                    linewidth=2, linestyle='--')
    ax.add_patch(circle)
    ax.text(x, y+0.05, text, ha='center', va='center', fontsize=fontsize,
            color=C['timer'], weight='bold')

# =============================================================================
# AS-IS DIAGRAM
# =============================================================================
fig, ax = plt.subplots(1, 1, figsize=(20, 9))
ax.set_xlim(-0.5, 19.5)
ax.set_ylim(-0.5, 5.5)
ax.set_aspect('equal')
ax.axis('off')

# Title
ax.text(9.5, 5.2, 'As-Is: Manual Product Return Process', fontsize=16,
        ha='center', weight='bold', color=C['task'])
ax.text(9.5, 4.85, 'Current state — phone-based, paper forms, no tracking',
        fontsize=9, ha='center', color='#777777', style='italic')

# Swimlanes
lanes = [
    ('Customer', 3.8, 4.2, C['swim1']),
    ('Support Agent (Phone)', 2.6, 3.4, C['swim2']),
    ('Store / Warehouse', 1.4, 2.2, C['swim3']),
    ('Finance', 0.2, 1.0, C['swim1']),
]
for name, y_bottom, y_top, color in lanes:
    rect = FancyBboxPatch((0, y_bottom), 19, y_top - y_bottom,
                          boxstyle="square,pad=0", facecolor=color,
                          edgecolor='#CCCCCC', linewidth=0.8)
    ax.add_patch(rect)
    ax.text(0.1, (y_bottom+y_top)/2, name, fontsize=8, va='center',
            weight='bold', color='#444444',
            bbox=dict(facecolor=C['lane_label'], edgecolor='#CCCCCC', pad=2, boxstyle='round'))

# --- Customer Lane (y=4.0) ---
draw_circle(ax, 1.0, 4.0, 0.25, C['start'], 'S')
ax.text(1.0, 4.55, 'Call\nhotline', fontsize=6, ha='center', color='#333')

draw_circle(ax, 18.0, 4.0, 0.25, C['end'], 'E')
ax.text(18.0, 4.55, 'Receive\nrefund\n(no tracking)', fontsize=6, ha='center', color='#333')

# --- Support Agent Lane (y=3.0) ---
draw_rounded_box(ax, 2.5, 3.0, 1.8, 0.5, 'Receive call\nask order number')
draw_rounded_box(ax, 4.5, 3.0, 1.8, 0.5, 'Check order\nin Excel')

draw_diamond(ax, 6.5, 3.0, 0.45, '14 days?')

draw_rounded_box(ax, 8.5, 3.0, 1.8, 0.5, 'Tell customer\nto bring product')

# Arrows in support lane
draw_arrow(ax, 1.5, 3.8, 1.5, 3.25)  # customer call -> receive call
draw_arrow(ax, 3.4, 3.0, 3.6, 3.0)
draw_arrow(ax, 5.4, 3.0, 6.05, 3.0)
draw_arrow(ax, 6.95, 3.0, 7.6, 3.0, 'YES', C['start'])
draw_arrow(ax, 6.5, 2.55, 6.5, 1.8, 'NO', C['end'])  # reject path

# Reject end event
draw_circle(ax, 6.5, 1.5, 0.2, C['end'], 'X')
ax.text(6.5, 1.1, 'Return\nexpired', fontsize=5.5, ha='center', color='#333')

# --- Store Lane (y=1.8) ---
draw_rounded_box(ax, 10.5, 1.8, 1.8, 0.5, 'Receive product\nmanual inspection')
draw_diamond(ax, 12.8, 1.8, 0.45, 'Product\nOK?')

draw_rounded_box(ax, 15.0, 1.8, 1.8, 0.5, 'Fill paper\nreturn form')
draw_rounded_box(ax, 17.0, 1.8, 1.6, 0.5, 'Send form photo\nvia WhatsApp')

# Arrows to store lane
draw_arrow(ax, 8.5, 2.75, 9.5, 2.05)  # tell customer -> receive product
draw_arrow(ax, 11.4, 1.8, 12.35, 1.8)
draw_arrow(ax, 13.25, 1.8, 14.1, 1.8, 'YES', C['start'])

# NO path from product check
draw_rounded_box(ax, 12.8, 0.6, 1.8, 0.45, 'Send to supplier\nfor assessment')
draw_arrow(ax, 12.8, 1.35, 12.8, 0.83, 'NO', C['end'])

# Store lane arrows
draw_arrow(ax, 15.9, 1.8, 16.2, 1.8)

# --- Finance Lane (y=0.6) ---
draw_timer(ax, 9.5, 0.6, 0.3, '1-3\ndays')
draw_rounded_box(ax, 12.0, 0.6, 1.8, 0.5, 'Process refund\nmanually in 1C')
draw_rounded_box(ax, 14.5, 0.6, 1.8, 0.5, 'Bank transfer\n3-5 bus. days')

# Arrow from supplier to finance
draw_arrow(ax, 13.7, 0.6, 11.1, 0.6)

# Arrow from store WhatsApp to finance timer
draw_arrow(ax, 17.0, 1.55, 10.0, 0.9)

# Arrow finance to customer end
draw_arrow(ax, 15.4, 0.85, 17.7, 3.75)

# Annotation
annot = FancyBboxPatch((0.3, -0.4), 5.5, 0.35, boxstyle="round,pad=0.05",
                        facecolor=C['annotation'], edgecolor='#F9A825', linewidth=1)
ax.add_patch(annot)
ax.text(3.05, -0.22, 'Average processing time: 8-15 days | No customer tracking',
        fontsize=7.5, ha='center', color='#333', weight='bold')

# Legend
legend_items = [
    (C['start'], 'Start Event'),
    (C['end'], 'End Event'),
    (C['task'], 'Task'),
    (C['gateway'], 'Gateway'),
    (C['timer'], 'Timer'),
    ('#E3F2FD', 'Service/Auto'),
]
for i, (color, label) in enumerate(legend_items):
    lx = 14.5 + (i % 3) * 2.0
    ly = -0.25 if i < 3 else -0.45
    box = FancyBboxPatch((lx, ly-0.1), 0.25, 0.2, boxstyle="round,pad=0.02",
                          facecolor=color, edgecolor='#333', linewidth=0.8)
    ax.add_patch(box)
    ax.text(lx+0.4, ly, label, fontsize=6, va='center', color='#333')

plt.tight_layout()
plt.savefig('/home/z/my-project/ba-practice/02-process-modeling/as-is-returns-process.png',
            dpi=180, bbox_inches='tight', facecolor='white')
plt.close()
print("AS-IS diagram saved.")

# =============================================================================
# TO-BE DIAGRAM
# =============================================================================
fig2, ax2 = plt.subplots(1, 1, figsize=(20, 9))
ax2.set_xlim(-0.5, 19.5)
ax2.set_ylim(-0.5, 5.5)
ax2.set_aspect('equal')
ax2.axis('off')

ax2.text(9.5, 5.2, 'To-Be: Digital Product Return Process', fontsize=16,
         ha='center', weight='bold', color=C['task'])
ax2.text(9.5, 4.85, 'Target state — online self-service, automated status, real-time tracking',
         fontsize=9, ha='center', color='#777777', style='italic')

# Swimlanes
lanes2 = [
    ('Customer (Web/App)', 3.8, 4.2, C['swim1']),
    ('Support Agent (CRM)', 2.6, 3.4, C['swim2']),
    ('Warehouse', 1.4, 2.2, C['swim3']),
    ('Finance (Automated)', 0.2, 1.0, C['swim1']),
]
for name, y_bottom, y_top, color in lanes2:
    rect = FancyBboxPatch((0, y_bottom), 19, y_top - y_bottom,
                          boxstyle="square,pad=0", facecolor=color,
                          edgecolor='#CCCCCC', linewidth=0.8)
    ax2.add_patch(rect)
    ax2.text(0.1, (y_bottom+y_top)/2, name, fontsize=8, va='center',
             weight='bold', color='#444444',
             bbox=dict(facecolor=C['lane_label'], edgecolor='#CCCCCC', pad=2, boxstyle='round'))

# --- Customer Lane (y=4.0) ---
draw_circle(ax2, 1.0, 4.0, 0.25, C['start'], 'S')
ax2.text(1.0, 4.55, 'Submit\nreturn online', fontsize=6, ha='center', color='#333')

# System auto validate - service task
draw_rounded_box(ax2, 3.0, 4.0, 1.8, 0.5, 'Auto-validate\n(14-day check)',
                 fill=C['service'], border=C['service_border'])

draw_diamond(ax2, 5.0, 4.0, 0.45, 'Eligible?')

# Reject path
draw_circle(ax2, 5.0, 4.8, 0.18, C['end'], 'X')
ax2.text(5.0, 5.15, 'Show rejection\nreason', fontsize=5.5, ha='center', color='#333')
draw_arrow(ax2, 5.0, 4.45, 5.0, 4.62, 'NO', C['end'])

# Confirmation
draw_rounded_box(ax2, 6.8, 4.0, 1.6, 0.5, 'SMS confirmation\nwith RET-ID')

# Bring to store
draw_rounded_box(ax2, 14.0, 4.0, 1.8, 0.5, 'Bring product\nto store')

# End - track status
draw_circle(ax2, 18.0, 4.0, 0.25, C['start'], 'E')
ax2.text(18.0, 4.55, 'Track status\nonline anytime', fontsize=6, ha='center', color='#333')

# --- Support Agent Lane (y=3.0) ---
draw_rounded_box(ax2, 8.8, 3.0, 1.8, 0.5, 'Review request\nin dashboard')

draw_diamond(ax2, 11.0, 3.0, 0.45, 'Approve?')

# Reject
draw_circle(ax2, 11.0, 3.8, 0.18, C['end'], 'X')
ax2.text(11.0, 4.15, 'Reject + notify\ncustomer', fontsize=5.5, ha='center', color='#333')
draw_arrow(ax2, 11.0, 3.45, 11.0, 3.62, 'NO', C['end'])

# --- Warehouse Lane (y=1.8) ---
draw_rounded_box(ax2, 15.5, 1.8, 1.6, 0.5, 'Scan barcode\nreceive system',
                 fill=C['service'], border=C['service_border'])
draw_rounded_box(ax2, 12.8, 1.8, 1.6, 0.5, 'Inspect product\nupdate status')

draw_diamond(ax2, 10.5, 1.8, 0.45, 'Passed?')

# Failed path
draw_rounded_box(ax2, 10.5, 0.6, 1.8, 0.45, 'Route to supplier\nrefurbishment')
draw_arrow(ax2, 10.5, 1.35, 10.5, 0.83, 'NO', C['end'])

# --- Finance Lane (y=0.6) ---
draw_rounded_box(ax2, 14.0, 0.6, 1.8, 0.5, 'Auto-trigger\nrefund via API',
                 fill=C['service'], border=C['service_border'])
draw_rounded_box(ax2, 16.5, 0.6, 1.6, 0.5, 'SMS + Email:\nrefund initiated',
                 fill=C['service'], border=C['service_border'])

# Arrows - Customer lane
draw_arrow(ax2, 1.25, 4.0, 2.1, 4.0)
draw_arrow(ax2, 3.9, 4.0, 4.55, 4.0)
draw_arrow(ax2, 5.45, 4.0, 6.0, 4.0, 'YES', C['start'])
draw_arrow(ax2, 7.6, 4.0, 8.8, 3.25)  # to support review
draw_arrow(ax2, 11.45, 3.0, 13.0, 3.8)  # approve -> bring to store
draw_arrow(ax2, 14.9, 3.8, 17.75, 4.0)  # bring -> end track

# Support lane
draw_arrow(ax2, 9.7, 3.0, 10.55, 3.0)

# Warehouse lane
draw_arrow(ax2, 13.6, 3.8, 14.0, 2.05)  # bring product -> scan
draw_arrow(ax2, 14.7, 1.8, 13.6, 1.8)  # scan -> inspect
draw_arrow(ax2, 10.95, 1.8, 12.0, 1.8, 'YES', C['start'])

# Warehouse to finance
draw_arrow(ax2, 16.3, 1.8, 16.5, 1.1)  # scan -> doesn't connect... 
# Fix: inspection passed -> auto refund
draw_arrow(ax2, 13.6, 1.55, 14.0, 0.85)  # passed -> auto refund

# Finance arrows
draw_arrow(ax2, 14.9, 0.6, 15.7, 0.6)
draw_arrow(ax2, 17.3, 0.85, 17.7, 3.75)  # SMS -> end track

# Supplier to finance (conditional)
draw_arrow(ax2, 11.4, 0.6, 13.1, 0.6)

# Annotation
annot2 = FancyBboxPatch((0.3, -0.4), 5.5, 0.35, boxstyle="round,pad=0.05",
                         facecolor=C['annotation'], edgecolor='#F9A825', linewidth=1)
ax2.add_patch(annot2)
ax2.text(3.05, -0.22, 'Target processing time: 3-5 days | Full customer visibility',
         fontsize=7.5, ha='center', color='#333', weight='bold')

# Legend
for i, (color, label) in enumerate(legend_items):
    lx = 14.5 + (i % 3) * 2.0
    ly = -0.25 if i < 3 else -0.45
    box = FancyBboxPatch((lx, ly-0.1), 0.25, 0.2, boxstyle="round,pad=0.02",
                          facecolor=color, edgecolor='#333', linewidth=0.8)
    ax2.add_patch(box)
    ax2.text(lx+0.4, ly, label, fontsize=6, va='center', color='#333')

plt.tight_layout()
plt.savefig('/home/z/my-project/ba-practice/02-process-modeling/to-be-returns-process.png',
            dpi=180, bbox_inches='tight', facecolor='white')
plt.close()
print("TO-BE diagram saved.")
print("Done!")
