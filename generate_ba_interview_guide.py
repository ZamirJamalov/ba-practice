#!/usr/bin/env python3
"""
BA CV Musahibe Təqdimat Guide - A1 Seviyyə
How to present BA experience compellingly in interviews.
"""

import os, hashlib
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, KeepTogether, HRFlowable, CondPageBreak
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Font Registration ──
pdfmetrics.registerFont(TTFont('Microsoft YaHei', '/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SarasaMonoSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Calibri', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/chinese/SarasaMonoSC-Bold.ttf'))

registerFontFamily('Microsoft YaHei', normal='Microsoft YaHei', bold='Microsoft YaHei')
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
pdfmetrics.registerFont(TTFont('TNR-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='TNR-Bold')
pdfmetrics.registerFont(TTFont('Calibri-Bold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
registerFontFamily('Calibri', normal='Calibri', bold='Calibri-Bold')

# ── Color Palette ──
ACCENT = colors.HexColor('#24738d')
TEXT_PRIMARY = colors.HexColor('#232527')
TEXT_MUTED = colors.HexColor('#787e85')
BG_SURFACE = colors.HexColor('#d6dadf')
BG_PAGE = colors.HexColor('#f1f3f4')

TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT = colors.white
TABLE_ROW_EVEN = colors.white
TABLE_ROW_ODD = BG_SURFACE

# ── Styles ──
styles = getSampleStyleSheet()

cover_title = ParagraphStyle(
    name='CoverTitle', fontName='Calibri', fontSize=32, leading=42,
    textColor=ACCENT, alignment=TA_CENTER, spaceAfter=12
)
cover_subtitle = ParagraphStyle(
    name='CoverSubtitle', fontName='Calibri', fontSize=16, leading=22,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER, spaceAfter=8
)
cover_meta = ParagraphStyle(
    name='CoverMeta', fontName='Calibri', fontSize=12, leading=16,
    textColor=TEXT_MUTED, alignment=TA_CENTER
)

h1_style = ParagraphStyle(
    name='H1', fontName='Calibri', fontSize=20, leading=26,
    textColor=ACCENT, spaceBefore=18, spaceAfter=10,
    alignment=TA_LEFT
)
h2_style = ParagraphStyle(
    name='H2', fontName='Calibri', fontSize=15, leading=20,
    textColor=TEXT_PRIMARY, spaceBefore=14, spaceAfter=8,
    alignment=TA_LEFT
)
h3_style = ParagraphStyle(
    name='H3', fontName='Calibri', fontSize=12, leading=16,
    textColor=ACCENT, spaceBefore=10, spaceAfter=6,
    alignment=TA_LEFT
)
body_style = ParagraphStyle(
    name='Body', fontName='Calibri', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceAfter=6, alignment=TA_JUSTIFY
)
body_left = ParagraphStyle(
    name='BodyLeft', fontName='Calibri', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceAfter=6, alignment=TA_LEFT
)
quote_style = ParagraphStyle(
    name='Quote', fontName='Calibri', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceAfter=6, alignment=TA_LEFT,
    leftIndent=24, borderPadding=8,
    backColor=colors.HexColor('#eef5f8'),
    borderColor=ACCENT, borderWidth=2, borderRadius=4
)
tip_style = ParagraphStyle(
    name='Tip', fontName='Calibri', fontSize=10, leading=16,
    textColor=ACCENT, spaceAfter=6, alignment=TA_LEFT,
    leftIndent=12
)
bullet_style = ParagraphStyle(
    name='Bullet', fontName='Calibri', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceAfter=4, alignment=TA_LEFT,
    leftIndent=18, bulletIndent=6
)
example_style = ParagraphStyle(
    name='Example', fontName='Calibri', fontSize=10, leading=16,
    textColor=TEXT_MUTED, spaceAfter=4, alignment=TA_LEFT,
    leftIndent=18
)
header_cell = ParagraphStyle(
    name='HeaderCell', fontName='Calibri', fontSize=10,
    textColor=colors.white, alignment=TA_CENTER
)
cell_style = ParagraphStyle(
    name='Cell', fontName='Calibri', fontSize=9.5,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, leading=14
)
cell_center = ParagraphStyle(
    name='CellCenter', fontName='Calibri', fontSize=9.5,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER, leading=14
)

# ── TOC Document Template ──
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

# ── Helpers ──
def heading(text, style, level=0):
    key = 'h_%s' % hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/>%s' % (key, text), style)
    p.bookmark_name = text
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def add_h1(text):
    return [
        CondPageBreak(100),
        heading('<b>%s</b>' % text, h1_style, level=0),
    ]

def add_h2(text):
    return [heading('<b>%s</b>' % text, h2_style, level=1)]

def add_h3(text):
    return [heading('<b>%s</b>' % text, h3_style, level=2)]

def body(text):
    return [Paragraph(text, body_style)]

def body_l(text):
    return [Paragraph(text, body_left)]

def quote(text):
    return [Paragraph(text, quote_style)]

def tip(text):
    return [Paragraph(text, tip_style)]

def bullet(text):
    return [Paragraph(text, bullet_style)]

def example(text):
    return [Paragraph(text, example_style)]

def spacer(h=12):
    return [Spacer(1, h)]

def hr():
    return [Spacer(1, 6), HRFlowable(width="100%", thickness=0.5, color=BG_SURFACE, spaceAfter=6)]

# ── Build Document ──
OUTPUT = '/home/z/my-project/download/BA_CV_Musahibe_Teqdimat_Guide.pdf'
W, H = A4
LM, RM, TM, BM = 1.8*cm, 1.8*cm, 2*cm, 2*cm
AW = W - LM - RM

doc = TocDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM
)

story = []

# ════════════════════════════════════════════
# COVER PAGE
# ════════════════════════════════════════════
story.append(Spacer(1, 120))
story.append(Paragraph('<b>BA CV Musahibe</b>', cover_title))
story.append(Paragraph('<b>Teqdimat Guide</b>', cover_title))
story.append(Spacer(1, 20))
story.append(HRFlowable(width="40%", thickness=2, color=ACCENT, spaceAfter=20))
story.append(Paragraph('Musahibede ozunu necə mohtesem teqdim etmeli', cover_subtitle))
story.append(Paragraph('Stakeholder, IT komanda ve pain points hekayeleri', cover_subtitle))
story.append(Spacer(1, 40))
story.append(Paragraph('Zamir Jamalov', cover_meta))
story.append(Paragraph('IT Business Analyst | E-Commerce & Fintech', cover_meta))
story.append(PageBreak())

# ════════════════════════════════════════════
# TABLE OF CONTENTS
# ════════════════════════════════════════════
toc = TableOfContents()
toc.levelStyles = [
    ParagraphStyle(name='TOC1', fontName='Calibri', fontSize=12, leftIndent=20, leading=20, spaceAfter=4),
    ParagraphStyle(name='TOC2', fontName='Calibri', fontSize=10, leftIndent=40, leading=16, spaceAfter=2),
]
story.append(Paragraph('<b>Mundaricat</b>', h1_style))
story.append(Spacer(1, 12))
story.append(toc)
story.append(PageBreak())

# ════════════════════════════════════════════
# SECTION 1: INTRODUCTION
# ════════════════════════════════════════════
story.extend(add_h1('1. Bu Guide Nedir ve Nece Istifade Etmeli'))
story.extend(spacer(6))
story.extend(body(
    'Bu guide senin CV-indəki hər bir təcrübəni musahibədə necə danışmağın lazım olduğunu göstərir. '
    'Sadə dildə, A1 səviyyəsində yazılıb. Amma musahibədə bunları ingiliscə danışacaqsan. '
    'Burada hər bir bölmə üçün konkret ifadələr, misallar və strategiyalar var. '
    'Məqsəd budur: musahibəçi səni dinləyəndə deyəcək ki, "bu adam bu işi görə bilər, '
    'həm də komanda ilə yaxşı işləyə bilər."'
))
story.extend(body(
    'Əsas prinsip: CV-də yazılanlar sadəcə "nə etdim"dir. Amma musahibədə onlar "necə etdim", '
    '"kimlərlə işlədim", "harda çətinlik çəkdim" suallarını verir. Sənin vəzifən budur ki, '
    'hər bir layihəni bir hekayə kimi danış. Hekayədə bunlar olmalıdır: problem, insanlar, '
    'çətinlik, həll, nəticə. Musahibəçilər məhz bunları eşitmək istəyir.'
))
story.extend(spacer(6))

story.extend(add_h2('1.1. "Task List" Yox, "Hekaye" Danis'))
story.extend(body(
    'Bir çox namizəd musahibədə belə danışır: "Mən BRD yazdım, API spec hazırladım, '
    'UAT koordinasiya etdim." Bu sadəcə tapşırıq siyahısıdır. Heç bir maraq oyatmır. '
    'Musahibəçi bundan sonra "hansı API?", "neyin üçün?", "kimlə işlədin?" deyə soruşmalı olur. '
    'Yəni sən onlara əsl hekayəni özün danışmalısən, gözləməməlisən ki soruşsunlar.'
))
story.extend(body(
    'Düzgün yanaşma belədir: "Bizdə kredit scoring sistemi var idi, amma risk komandası deyirdi ki, '
    'müştərilərə cavab çox gec gəlir - ortalıq 3 gün. Mən risk komandası ilə oturdum, onların '
    'gözləntilərini anladım. Sonra developer-lərlə görüşdüm, hansı məlumat lazımdır, hansı '
    'API-lar var, bunları öyrəndim. BRD-də hər bir qaydanı REQ-101 formatında yazdım ki, '
    'heç kim "mən bunu bilmirdim" deməsin. Nəticədə kredit qərarı 3 gündən 1 güne düşdü." '
    'Gördüyün kimi, eyni iş amma fərqli təsir.'
))
story.extend(spacer(6))

story.extend(add_h2('1.2. STAR Metodu: Hekayenin Strukturu'))
story.extend(body(
    'Hər bir hekayəni STAR formatında qur. Bu dünya üzrə ən çox istifadə olunan intervıu '
    'teknikasıdır və musahibəçilər bunu gözləyir:'
))
# STAR table
star_data = [
    [Paragraph('<b>Hissə</b>', header_cell), Paragraph('<b>Ne deməkdir</b>', header_cell), Paragraph('<b>Misal</b>', header_cell)],
    [Paragraph('<b>S</b>ituation', cell_style), Paragraph('Vəziyyət: harda işləyirdin, problem nə idi', cell_style), Paragraph('Embafinans-da BNPL scoring sistemi var idi, amma kredit qərarı 3 gün çəkirdi', cell_style)],
    [Paragraph('<b>T</b>ask', cell_style), Paragraph('Vəzifən: səndən nə istənilirdi', cell_style), Paragraph('Bu prosesi 2x sürətləndirmək və avtomatlaşdırmaq lazım idi', cell_style)],
    [Paragraph('<b>A</b>ction', cell_style), Paragraph('Hərəkətin: sən nə etdin, kimlə işlədin', cell_style), Paragraph('Risk komandası ilə 3 session etdim, developer-lərə API spec yazdım...', cell_style)],
    [Paragraph('<b>R</b>esult', cell_style), Paragraph('Nəticə: rəqəmlə, effectlə', cell_style), Paragraph('Kredit qərarı 1 güne düşdü, 2x sürətləndi', cell_style)],
]
star_table = Table(star_data, colWidths=[AW*0.14, AW*0.38, AW*0.48], hAlign='CENTER')
star_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0,0), (-1,0), TABLE_HEADER_TEXT),
    ('BACKGROUND', (0,1), (-1,1), TABLE_ROW_EVEN),
    ('BACKGROUND', (0,2), (-1,2), TABLE_ROW_ODD),
    ('BACKGROUND', (0,3), (-1,3), TABLE_ROW_EVEN),
    ('BACKGROUND', (0,4), (-1,4), TABLE_ROW_ODD),
    ('GRID', (0,0), (-1,-1), 0.5, TEXT_MUTED),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(Spacer(1, 12))
story.append(star_table)
story.append(Spacer(1, 18))

story.extend(add_h2('1.3. En Vacib Qayda: "Biz" Deyil "Mən"'))
story.extend(body(
    'Bəzən insanlar deyir "biz etdik, komanda etdi". Bu yanlışdır. Musahibəçi səni sorğu-sual edir, '
    'komandanı deyil. Sən "mən" deməlisən, amma ətraflı şəkildə: "Mən risk komandası ilə 3 session '
    'apardım", "Mən developer-lərə API spec hazırladım". Yəni sən konkret nə etmisən, onu de. '
    'Amma başqa insanların töhfəsini də tanı: "Risk komandası scoring qaydalarını təmin etdi, '
    'developer-lər backend-i qurdular, mən isə bu iki tərəfi birləşdirdim və process-i koordinasiya etdim."'
))
story.extend(body(
    'Bu yanaşma sənin leadership qabiliyyətini göstərir. Sən sadəcə tapşırıq yerinə yetirməyib, '
    'fərqli komandaları bir araya gətirib, rabitə qurub, prosesi idarə edib. Məhz bu BA rolunun '
    'əsas dəyəridir - sən texniki və biznes tərəfləri bağlayırsan.'
))

# ════════════════════════════════════════════
# SECTION 2: EMBATFINAS - PROJECTS
# ════════════════════════════════════════════
story.extend(add_h1('2. Embafinans Layiheleri - Detalli Hekayeler'))

# --- Project 1: BNPL ---
story.extend(add_h2('2.1. BNPL Credit Scoring & Pre-Screen Risk Assessment'))
story.extend(spacer(4))
story.extend(add_h3('Bu layihe haqqinda qisa'))
story.extend(body(
    'Bu layihədə "Buy Now Pay Later" (indi al, sonra ödə) kredit scoring sistemi quruldu. '
    'Əsas problem: kredit müraciətlərinə cavab çox ləng idi - ortalıq 3 gün. Risk komandası '
    'bunu sürətləndirmək istəyirdi. Məsələ bundan ibarət idi ki, risk analyst-lər hər bir '
    'müraciəti əllə yoxlayırdılar. Sistemin avtomatlaşdırılması lazım idi.'
))
story.extend(spacer(4))
story.extend(add_h3('Pain Points (Agri noqteleri)'))
story.extend(bullet('<b>Problem 1:</b> Kredit qərarı 3 gün çəkirdi - müştərilər gözləyirdi, bəzən başqa yerə gedirdi'))
story.extend(bullet('<b>Problem 2:</b> Risk komandası hər bir müraciəti əllə yoxlayırdı - vaxt itirirdilər'))
story.extend(bullet('<b>Problem 3:</b> Standart scoring modeli yox idi - hər analyst özü qərar verirdi'))
story.extend(bullet('<b>Problem 4:</b> Data axını draftəları mövcud deyildi - heç kim bilirdi ki data hardan gəlir'))
story.extend(spacer(4))
story.extend(add_h3('Stakeholder-lar ve onlarin Derdi'))
story.extend(body(
    'Bu layihədə bir neçə fərqli komanda ilə işləmək lazım idi. Hər komandanın öz dərdi, '
    'öz gözləntisi vardı. Sənin rolu bu fərqli gözləntiləri bir araya gətirmək idi:'
))
# Stakeholder table for BNPL
bnpl_sh_data = [
    [Paragraph('<b>Kim</b>', header_cell), Paragraph('<b>Nə istəyirdi</b>', header_cell), Paragraph('<b>Sən necə kömək etdin</b>', header_cell)],
    [Paragraph('Risk Komandası', cell_style),
     Paragraph('Avtomatik scoring - əllə yoxlamağa son. Hər müraciət üçün 1 gün əvəzinə dəqiqələr.', cell_style),
     Paragraph('Onlarla 3 workshop etdim, scoring qaydalarını çıxartdım, BRD-yə REQ formatında yazdım.', cell_style)],
    [Paragraph('Sales Komandası', cell_style),
     Paragraph('Daha çox kredit təsdiq - daha çox satış. Rədd edilmə azalsın.', cell_style),
     Paragraph('Sales-in nəticə məlumatlarını topladım, riskə təqdim etdim. Pre-screen modeli təklif etdim.', cell_style)],
    [Paragraph('Developer-lər', cell_style),
     Paragraph('Aydın spec - "nə yazaq?" sualı olmasın. Data mapping bəlli olsun.', cell_style),
     Paragraph('Swagger API spec yazdım, sequence diagram çəkdim, data mapping document hazırladım.', cell_style)],
    [Paragraph('Operations', cell_style),
     Paragraph('Dashboard lazım - hər şeyi gore bilsinlər. Error azalsın.', cell_style),
     Paragraph('UAT-da onları iştirak etdirdim, bug triage meetings-lərdə onların feedback-lərini developer-ə çatdırdım.', cell_style)],
]
bnpl_table = Table(bnpl_sh_data, colWidths=[AW*0.18, AW*0.38, AW*0.44], hAlign='CENTER')
bnpl_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0,0), (-1,0), TABLE_HEADER_TEXT),
    *[('BACKGROUND', (0,i), (-1,i), TABLE_ROW_EVEN if i%2==1 else TABLE_ROW_ODD) for i in range(1,5)],
    ('GRID', (0,0), (-1,-1), 0.5, TEXT_MUTED),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(Spacer(1, 10))
story.append(bnpl_table)
story.append(Spacer(1, 12))

story.extend(add_h3('Musahibede Nece Danismali'))
story.extend(body(
    'Bu layihəni danışarkən əvvəlcə problemdən başla. Musahibəçinin marağını çəkmək üçün:'
))
story.extend(quote(
    '"Bizdə kredit müraciətləri 3 gün çəkirdi. Müştəri müraciət edirdi, 3 gün gözləyirdi, '
    'bəzən sabredə bilmirdi və başqa şirkətə gedirdi. Risk komandası deyirdi ki, əgər avtomatlaşdırarsaq, '
    'bu 1 güne enə bilər. Amma risk komandasının özü də bilmirdi ki, avtomatlaşdırma necə olmalı. '
    'Mən hər şeyi başdan axırı planlaşdırmaq lazım idi."'
))
story.extend(spacer(4))
story.extend(body(
    'Sonra sənin hərəkətlərini danış - amma "mən BRD yazdım" yox, belə de:'
))
story.extend(quote(
    '"İlk həftə risk komandası ilə 3 session etdim. Onlar çox müxtəlif scoring qaydaları istifadə edirdilər '
    '- hər analyst özü qərar verirdi. Mən onların hər birini dinlədim, sonra bu qaydaları standartlaşdırdım. '
    'Hər bir qaydani REQ-101 nömrəsi ilə BRD-yə yazdım. Niyə REQ formatı? Çünki 4 fərqli developer '
    'çalışırdı və heç kim "mən bunu eşitmədim" deməməli idi. Hər şey yazılı olmalı idi."'
))
story.extend(spacer(4))
story.extend(body(
    'Developer-lərlə işini belə çatdır:'
))
story.extend(quote(
    '"Risk komandası nə istəyirəm dedi, amma developer-lər isə bu texniki olaraq mümkün deyil dedilər. '
    'Mən bu iki tərəf arasında oldum. Developer-lərlə oturdum, harda çətinlik var, harda data çatışmır '
    'bunları anladım. Sonra Swagger-da API spec yazdım ki, hər kəs eyni səhifəyə baxsın. Sequence '
    'diagram çəkdim ki, data hardan gəlir, harda gedir hamı görsün. Data mapping document hazırladım. '
    'Developer-lər sonra dedilər ki, bu bizim işimizi çox asanlaşdırdı."'
))
story.extend(spacer(4))
story.extend(body(
    'Nəticəni rəqəmlə ver:'
))
story.extend(quote(
    '"Nəticədə kredit qərarı 3 gündən 1 güne düşdü. Risk komandası artıq əllə yoxlamağa ehtiyac duymur. '
    'Pre-screen modeli ilə əvvəlcədən filtrlənir və yalnız real namizədlər irəli gedir."'
))
story.extend(spacer(4))
story.extend(tip('> Tip: "I authored BRD" deyəndə maraq yoxdur. "Risk komandası 3 fərqli qayda istifadə edirdi, mən onları standartlaşdırdım" de - musahibəçinin gözü parlayır.'))

# --- Project 2: B2C Sales & Payment ---
story.extend(add_h2('2.2. B2C Sales Channel & Payment Gateway Integration'))
story.extend(spacer(4))
story.extend(add_h3('Bu layihe haqqinda qisa'))
story.extend(body(
    'Embafinans üçün online satış kanalı və payment gateway inteqrasiyası quruldu. '
    'Əvvəl müştərilər fiziki olaraq ofisə gəlməli idilər - kredit üçün, ödəniş üçün, '
    'sənəd üçün hamısı ofisdə. Bu layihə ilə hər şey online oldu. Gündə 300-500 müraciət '
    'online gəlməyə başladı.'
))
story.extend(spacer(4))
story.extend(add_h3('Pain Points'))
story.extend(bullet('<b>Problem 1:</b> Müştərilər ofisə gəlmək məcburiyyətində idi - bu çox rahatsız idi'))
story.extend(bullet('<b>Problem 2:</b> Online ödəniş yox idi - nağd və ya bank köçürməsi ilə işləyirdi'))
story.extend(bullet('<b>Problem 3:</b> Satış kanalı məhdud idi - yalnız ofisdən satış olurdu'))
story.extend(bullet('<b>Problem 4:</b> Payment gateway inteqrasiyası çox mürəkkəb idi - çoxlu təhlükəsizlik tələbləri'))
story.extend(spacer(4))
story.extend(add_h3('Stakeholder-lar ve Dərdləri'))
story.extend(body(
    'Bu layihədə stakeholder-lar daha çox idi çünki payment ilə bağlı hər kəs maraqlı idi:'
))
story.extend(bullet('<b>Sales:</b> Online kanal istəyirdilər - daha çox müştəri, daha çox satış'))
story.extend(bullet('<b>Finance/Treasury:</b> Payment-in doğru çalışmasını istəyirdilər - heç bir pul itirmək istəmirdilər'))
story.extend(bullet('<b>Compliance:</b> KYC/AML qaydalarına riayət istəyirdilər - online da eyni qaydalar olmalı idi'))
story.extend(bullet('<b>IT Security:</b> Payment data təhlükəsiz olmalı idi - PCI DSS standartları'))
story.extend(bullet('<b>Developer-lər:</b> Aydın inteqrasiya spec lazım idi - hansı API, hansı data format'))
story.extend(spacer(4))
story.extend(add_h3('Musahibede Nece Danismali'))
story.extend(quote(
    '"Embafinans-da satış yalnız ofisdə olurdu. Müştəri gəlməli, növbə gözləməli, sənəd verəndən '
    'sonra kredit alınmalı idi. Sales komandası deyirdi ki, online kanal qursaq, satış 3-4 qat artar. '
    'Amma problem bundan ibarət idi ki, online satış üçün payment gateway lazımdır, və bu çox '
    'mürəkkəb bir inteqrasiyadır. Security, compliance, finance - hamısı müdaxilə etməlidir."'
))
story.extend(spacer(4))
story.extend(quote(
    '"Mən əvvəlcə hər bir komandanı ayrı-ayrılıqda ziyarət etdim. Sales-a dedim: hər şeyi asanlaşdıracağıq. '
    'Finance-a dedim: hər qəpi izləyə biləcəksiniz. Compliance-a dedim: KYC online da eyni qaydalar. '
    'Security-ə dedim: PCI DSS standartlarına tam uyğun olacaq. Hər kəsin narahatlığını dinlədim, '
    'sonra bunları bir BRD-da birləşdirdim."'
))
story.extend(spacer(4))
story.extend(quote(
    '"Developer-lərə REST API spec yazdım - hər endpoint-u Swagger-da təsvir etdim. Payment provider-in '
    'API-sini öyrəndim, bizim backend-lə matching etdim. Hər bir field-ı data mapping document-də '
    'qeyd etdim. Nəticədə developer-lər 2 həftədə inteqrasiyanı tamamladılar - çünki onlara '
    'heç bir sual yox idi, hər şey spec-də var idi."'
))
story.extend(spacer(4))
story.extend(quote(
    '"Go-live-dan sonra gündəlik 300-500 online müraciət gəlməyə başladı. Sales komandası çox '
    'məmnun idi. Finance dashboard-dan hər şeyi real-time görürdü. UAT-da hər bir stakeholder '
    'iştirak etdi və on-time sign-off aldım."'
))
story.extend(spacer(4))
story.extend(tip('> Tip: "Payment gateway integration" deyəndə texniki səslənir. Amma sənin dəyərin texniki deyil - sən 5 fərqli komandanı bir araya gətirib, hər kəsin narahatlığını həll edib. Bunu vurğula.'))

# --- Project 3: Goods Loan Dashboard ---
story.extend(add_h2('2.3. Goods Loan Delivery Tracking Dashboard'))
story.extend(spacer(4))
story.extend(add_h3('Bu layihe haqqinda qisa'))
story.extend(body(
    'Mal krediti verildikdən sonra malların çatdırılmasını izləmək üçün dashboard quruldu. '
    'Əvvəl malların harada olduğunu heç kim bilmirdi - müştəri zəng edirdi, əməkdaşlar excel-lə '
    'baxırdı, error-lar çox olurdu. Dashboard ilə hər şey real-time görünməyə başladı və '
    'error sayı 2x azaldı.'
))
story.extend(spacer(4))
story.extend(add_h3('Pain Points'))
story.extend(bullet('<b>Problem 1:</b> Malların harada olduğu məlum deyildi - izləmə sistemi yox idi'))
story.extend(bullet('<b>Problem 2:</b> Müştəri xidməti hər gün "mal haradadır?" sualı alırdı'))
story.extend(bullet('<b>Problem 3:</b> Excel-lə izləmə var idi amma error çox olurdu - 2x səhv'))
story.extend(bullet('<b>Problem 4:</b> E-imza prosesi yox idi - fiziki sənəd imzalanmalı idi'))
story.extend(spacer(4))
story.extend(add_h3('Musahibede Nece Danismali'))
story.extend(quote(
    '"Mal krediti verildikdən sonra mallar anbara gedir, sonra müştəriyə çatdırılırı. Amma bu '
    'prosesi heç kim izləyə bilmirdi. Müştəri zəng edirdi: malım haradadır? Əməkdaşlar excel-lə '
    'baxırdı amma data tez-tez səhv olurdu - 2x error dərəcəsi var idi. E-imza da yox idi - '
    'hər şey fiziki sənədlə həll olunurdu."'
))
story.extend(spacer(4))
story.extend(quote(
    '"Mən operations komandası ilə oturdum, onların gündəlik workflow-unu öyrəndim. Hər addımı '
    'BPMN diagramında çəkdim - As-Is və To-Be. As-Is-də 12 addım var idi, To-Be-də 7 addıma '
    'endirdim. Operations dedi ki, bu çox yaxşıdır. Sonra developer-lərə dashboard tələblərini '
    'FRD formatında yazdım - hər bir widget üçün aydın acceptance criteria verdim. E-imza '
    'inteqrasiyası üçün isə vendor ilə danışdım, API-lərini öyrəndim, spec hazırladım."'
))
story.extend(spacer(4))
story.extend(quote(
    '"Nəticədə real-time monitoring dashboard hazır oldu. Error rate 2x azaldı. E-imza ilə fiziki '
    'sənəd lazım deyildi. Müştəri xidməti artıq dashboard-a baxıb cavab verə bilirdi - '
    'zəng sayı azaldı."'
))
story.extend(spacer(4))
story.extend(tip('> Tip: Operations komandası ilə işləmək BA üçün çox önəmlidir. Bu göstərir ki, sən yalnız IT deyil, biznes tərəflə də anlayırsən. BPMN diagramı çəkmək sənin analitik düşünməsini sübut edir.'))

# --- Project 4: Credit Lifecycle ---
story.extend(add_h2('2.4. End-to-End Credit Lifecycle'))
story.extend(spacer(4))
story.extend(add_h3('Bu layihe haqqinda qisa'))
story.extend(body(
    'Bu ən böyük layihə idi - kreditin tam dövrünü əhatə edirdi: müraciət, təsdiq, pul '
    'verilməsi, və geri qaytarılması (collection). Əvvəl hər mərhələ ayrı sistemdə idi, '
    'bir-biri ilə bağlı deyildi. Cross-functional komanda ilə işləmək lazım oldu.'
))
story.extend(spacer(4))
story.extend(add_h3('Pain Points'))
story.extend(bullet('<b>Problem 1:</b> Hər mərhələ ayrı sistemdə - müraciət bir yerdə, scoring başqa, collection üçüncü'))
story.extend(bullet('<b>Problem 2:</b> Data bir-birinə uyğun deyildi - "müştəri adı sistemlər arasında fərqli idi"'))
story.extend(bullet('<b>Problem 3:</b> Cross-functional - risk, sales, operations, IT hamısı iştirak etməli idi'))
story.extend(bullet('<b>Problem 4:</b> Heç kim tam prosesi görmürdü - hər kəs öz hissəsini bilirdi amma bütünü yox'))
story.extend(spacer(4))
story.extend(add_h3('Musahibede Nece Danismali'))
story.extend(quote(
    '"Bu ən çətin layihəm idi çünki cross-functional idi - yəni 4 fərqli komanda eyni vaxtda iştirak edirdi. '
    'Risk komandası scoring-i istəyirdi, sales asan process istəyirdi, operations izləmək istəyirdi, '
    'IT isə inteqrasiya çətinlikləri yaşayırdı. Hər kəsin öz prioriteti var idi və bəzən bu prioritetlar '
    'ziddiyət təşkil edirdi."'
))
story.extend(spacer(4))
story.extend(quote(
    '"Mən SQL-də data analysis etdim. Risk deyirdi ki, bu qayda lazımdır, sales deyirdi ki, yox bu lazımdır. '
    'Mən hər iki tərəfin data-sını çıxardım, analiz etdim, və sübut etdim ki, hansı variant daha çox '
    'biznes dəyəri gətirir. Risk komandası data-nı gördükdən sonra razı oldu. SQL biliklərim burada çox '
    'faydalı oldu - BA olaraq data-əsaslı qərar vermək vacibdir."'
))
story.extend(spacer(4))
story.extend(quote(
    '"RICE framework istifadə etdim - Reach, Impact, Confidence, Effort. Hər bir feature-ı bu 4 '
    'kriteriya ilə scoredum. Bu sayədə sprint planning-də hər kəs razı oldu - çünki rəqəmlər '
    'göstərirdi ki, nə əvvəl etmək daha səmərəlidir. Bu framework-backlog prioritetləşdirmək üçün '
    'çox güclü alətdir."'
))

# ════════════════════════════════════════════
# SECTION 3: DELIVERY METHODOLOGY
# ════════════════════════════════════════════
story.extend(add_h1('3. Delivery Metodolojiya - Sen Necə İşləyirsən'))
story.extend(body(
    'CV-də "Delivery Methodology" bölməsi çox vacibdir. Amma musahibədə bunları sadəcə oxumaq yox, '
    'hər birini real misalla izah etmək lazımdır. Aşağıda hər bir metodu necə təqdim edəcəyini göstərirəm.'
))

story.extend(add_h2('3.1. Discovery & Process Modeling'))
story.extend(quote(
    '"Layihənin əvvəlində mən həmişə discovery edirəm. Yəni stakeholder-ları ziyarət edirəm, '
    'onların gündəlik işini müşahidə edirəm. Məsələn, operations komandası ilə oturdum və onların '
    'har bir addımı izlədim. Sonra bu addımları BPMN diagramında çəkdim - As-Is (hal-hazırda) və '
    'To-Be (yeni versiya). Bu diagram sənədlərimizin əsasını təşkil edir - hər kəs eyni səhifəyə baxır."'
))
story.extend(spacer(4))
story.extend(tip('> Musahibəçi burada "nə üçün BPMN?" deyə bilər. Cavab: "Çünki BPMN hər kəsə aydındır - biznes, IT, management hamısı anlayır. UML yalnız developer-lər üçündür."'))

story.extend(add_h2('3.2. Requirements Documentation'))
story.extend(quote(
    '"Mən BRD, FRD və SRS yazıram. Amma sadəcə dokument yazmaq deyil - hər bir requirement-i '
    'REQ-101 formatında nömrələşdirirəm. Niyə? Çünki developer A deyir ki, mən bunu etdim, '
    'developer B deyir mən bunu bilmirdim. REQ formatında hər şey izləniləndir. User Stories '
    'yazıram, Gherkin-də Acceptance Criteria verirəm - yəni Given-When-Then formatında. Bu '
    'developer-lərə və QA-ya çox kömək edir - hər kəs eyni şəkildə test edir."'
))
story.extend(spacer(4))
story.extend(tip('> Gherkin nümunəsi ver: "Given müştəri kredit müraciəti edib, When scoring modeli işləyib, Then 1 gün ərzində cavab gəlməlidir." Musahibəçi bu formatı eşidəndə səni peşəkar biləcək.'))

story.extend(add_h2('3.3. Technical Specification'))
story.extend(quote(
    '"BA kimi mən developer-lərə API spec təqdim edirəm. Swagger/OpenAPI 3.0-da hər bir endpoint-ı '
    'təsvir edirəm - method, URL, request body, response, error codes hamısı var. Bundan əlavə '
    'sequence diagram çəkirəm - məsələn, müştəri request göndərir, backend processing edir, '
    'risk servisə gedir, scoring qaydaları yoxlanılır, cavab qayıdır - bu axını göstərir. '
    'Data mapping document da hazırlayıram - hansı field hansı database column-a uyğundur."'
))
story.extend(spacer(4))
story.extend(tip('> Bu bölmə sənin "bridge" rolunu göstərir - sən biznes və IT arasında körpüsən. Musahibəçilər məhz bunu axtarır.'))

story.extend(add_h2('3.4. UAT & Delivery Coordination'))
story.extend(quote(
    '"UAT mənim ən vacib fazamdır çünki orada hər şey yoxlanılır. Business stakeholder-ları '
    'test senario-ları ilə gətirirəm. Onlar test edir, bug tapırlar. Mən bug triage meeting aparıram - '
    'QA, developer, stakeholder bir araya gəlir, hər bug-u müzakirə edirik. Prioritetləşdirirəm: '
    'Critical bug-ları dərhal həll edirik, minor bug-ları sonraya saxlayırıq. On-time sign-off '
    'almaq üçün hər release cycle-da clear plan olmalıdır."'
))
story.extend(spacer(4))
story.extend(tip('> "On-time sign-off" ifadəsi çox güclüdür. Bu göstərir ki, sən yalnız iş görmürsən, həm də vaxtında bitirirsən. Project management bacarığını nümayiş etdirir.'))

story.extend(add_h2('3.5. Backlog Prioritization'))
story.extend(quote(
    '"RICE framework istifadə edirəm - Reach, Impact, Confidence, Effort. Bu 4 metriki hər bir '
    'user story üçün hesablayıram. Məsələn, pre-screen modeli yüksək Reach (hər müraciətə təsir '
    'edir), yüksək Impact (2x sürətlənmə), yüksək Confidence (data var), orta Effort (2 sprint). '
    'Bu rəqəmlərlə sprint planning-də asanlıqla razılıq əldə edirəm - heç kim "niyə bu əvvəl?" '
    'deyə bilmir çünki rəqəmlər göstərir."'
))

story.extend(add_h2('3.6. Data-Driven Decision Making'))
story.extend(quote(
    '"Bəzən stakeholder-lar ziddiyətli tələblər verir. Risk deyir ki, scoring-i sıxlaşdıraq, '
    'sales deyir ki, sərfəli saxlayaq. Mən SQL-də data çıxıram, analiz edirəm, və təqdim edirəm. '
    'Məsələn, scoring-i 10% sıxlaşdırsaq, rədd dərəcəsi 15% artar amma default riski yalnız 2% '
    'azalacaq - bu rəqəmləri SQL-lə hesablayıram. Risk komandası baxıb deyir ki, bəli bu sərfəli deyil. '
    'Beləliklə, data ilə konsensus əldə edirəm - emosiyalarla deyil, sübutlarla."'
))
story.extend(spacer(4))
story.extend(tip('> SQL biliyi BA üçün super gücdür. Əksər BA-lar SQL bilmir. Sənin SQL biliyin səni digər namizədlərdən fərqləndirir. Musahibədə bunu mütləq vurğula.'))

# ════════════════════════════════════════════
# SECTION 4: BIRBONUS
# ════════════════════════════════════════════
story.extend(add_h1('4. Birbonus - Loyalty Bonus System'))
story.extend(body(
    'Bu layihə fərqli idi çünki fintech deyil, e-commerce idi. Müştəri alış-veriş edəndə bonus '
    'qazanır, bu bonusları partner mağazalarda xərcləyə bilər. Sadəcə bir bonus sistemi deyil - '
    'partner settlement workflow da var idi.'
))
story.extend(spacer(4))
story.extend(add_h3('Pain Points'))
story.extend(bullet('<b>Problem 1:</b> Müştəri loyallığı az idi - tez-tez başqa platformaya keçirdi'))
story.extend(bullet('<b>Problem 2:</b> Bonus qaydaları mürəkkəb idi - hər kəs fərqli başa düşürdü'))
story.extend(bullet('<b>Problem 3:</b> Partner settlement manual idi - hər ay excel-lə hesablanırdı'))
story.extend(spacer(4))
story.extend(add_h3('Musahibede Nece Danismali'))
story.extend(quote(
    '"Birbonus-da müştəri loyallığı problemi var idi. İnsanlar platformaya gəlirdi, alış-veriş edirdi, '
    'amma qayıtmırdı. Menecerlik dedi ki, bonus sistemi qursaq. Amma bonus sistemi sadəcə pula verirəm '
    'deyil - earning rules, eligibility, partner settlement - bunların hamısını düşünmək lazımdır."'
))
story.extend(spacer(4))
story.extend(quote(
    '"Mən product manager ilə oturdum, earning qaydalarını müəyyənləşdirdik. Finance ilə partner '
    'settlement workflow-u dizayn etdik. Operations ilə eligibility criteria-ları müəyyənləşdirdik. '
    'Hər stakeholder-in tələbini BRD-da REQ formatında yazdım. API spec hazırladım ki, '
    'partner mağazalar da inteqrasiya edə bilsin."'
))

# ════════════════════════════════════════════
# SECTION 5: UMICO
# ════════════════════════════════════════════
story.extend(add_h1('5. Umico - PostgreSQL Developer & L2 Support'))
story.extend(body(
    'Bu rol fərqli idi - BA yox, developer. Amma musahibədə bunu da düzgün təqdim etmək lazımdır '
    'çünki bu sənin technical background-ını göstərir. BA kimi technical biliyin çox vacibdir.'
))
story.extend(spacer(4))
story.extend(add_h3('Musahibede Nece Danismali'))
story.extend(quote(
    '"Umico-da developer kimi çalışırdım - PostgreSQL backend features yazırdım. Amma ən maraqlı '
    'təcrübəm L2 production support idi. Gündəlik production incident-lar olur, mən ELK Stack ilə '
    'log analysis edirdim. Source code oxuyub root cause tapırdım. Bu təcrübə mənə BA kimi çox '
    'kömək edir - çünki production-da nə baş verir, bunu bilirəm."'
))
story.extend(spacer(4))
story.extend(quote(
    '"Məsələn, developer deyir ki, bu feature belə etmək olmaz, çünki database performance. Amma '
    'mən bilirəm ki, why - çünki özüm production support etmişəm. Developer-larla eyni dildə '
    'danışa bilirəm. Bu mənə BA kimi böyük üstünlük verir - gap yoxdur mənim və IT arasında."'
))
story.extend(spacer(4))
story.extend(tip('> Bu nöqtə çox vacibdir. BA-ların əksəriyyəti technical bilmir. Sənin developer keçmişin səni "teknik BA" edir. Bu fərqləndirici xüsusiyyət kimi təqdim et.'))

# ════════════════════════════════════════════
# SECTION 6: TECHNICAL FOUNDATION
# ════════════════════════════════════════════
story.extend(add_h1('6. Technical Foundation - 15+ Il Tecrube'))
story.extend(body(
    'CV-də 15+ illik texniki təcrübə qeyd olunub. Bu musahibədə çox güclü kartdır. Amma bunu '
    'doğru təqdim etmək lazımdır - "mən 15 il developer idim" yox, "bu 15 il mənə BA kimi '
    'nə qədər kömək edir" şəklində.'
))
story.extend(spacer(4))
story.extend(add_h2('6.1. Merkezi Bank, Unibank, ASAN Service'))
story.extend(quote(
    '"15 il əvvəl Merkezi Bankda başladım. Orada C# backend development edirdim. Government Payment '
    'Portal-da integrator kimi çalışdım. Sonra Unibank-da Mobile Banking-in backend-ini yazdım. '
    'ASAN Service-də system integration etdim. Bu təcrübələr mənə bir neçə şey öyrətdi: birincisi, '
    'böyük sistemlərdə necə işləmək olar, ikincisi, banking domain-ini dərin bilirəm, üçüncüsü, '
    'production incident-larla necə mübarizə olmaq."'
))
story.extend(spacer(4))
story.extend(add_h2('6.2. Bu tecrube BA-ya Necə Komek Edir'))
story.extend(body(
    'Musahibəçi bilmək istəyir ki, bu 15 il developer təcrübəsi BA rolunda necə faydalıdır. '
    'Aşağıdakı cədvəl bunu aydın göstərir:'
))
tech_data = [
    [Paragraph('<b>Developer Tecrubesi</b>', header_cell), Paragraph('<b>BA rolda necə komek edir</b>', header_cell)],
    [Paragraph('C# backend development', cell_style), Paragraph('API spec-ləri anlayırsan, developer-lərin dilini danışırsan', cell_style)],
    [Paragraph('Oracle, MSSQL, PostgreSQL, MongoDB', cell_style), Paragraph('Data modelləşdirmə, SQL ile data analysis, data mapping', cell_style)],
    [Paragraph('System integration', cell_style), Paragraph('Fərqli sistemlərin necə bağlanacağını bilirsən', cell_style)],
    [Paragraph('CI/CD pipelines', cell_style), Paragraph('Release prosesini anlayırsan, deployment coordination', cell_style)],
    [Paragraph('Production support', cell_style), Paragraph('Root cause analysis, bug triage, incident management', cell_style)],
    [Paragraph('Git', cell_style), Paragraph('Version control, code review, technical documentation', cell_style)],
]
tech_table = Table(tech_data, colWidths=[AW*0.40, AW*0.60], hAlign='CENTER')
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0,0), (-1,0), TABLE_HEADER_TEXT),
    *[('BACKGROUND', (0,i), (-1,i), TABLE_ROW_EVEN if i%2==1 else TABLE_ROW_ODD) for i in range(1,7)],
    ('GRID', (0,0), (-1,-1), 0.5, TEXT_MUTED),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(Spacer(1, 10))
story.append(tech_table)
story.append(Spacer(1, 18))

story.extend(add_h2('6.3. Musahibede Ifade'))
story.extend(quote(
    '"Mənim əsas gücüm budur: mən bilirəm ki, developer nə düşünür. Çünki özüm 15 il developer idim. '
    'API spec yazanda bilirəm ki, hər endpoint üçün nə lazımdır - çünki özüm də API yazmışam. '
    'Data mapping document hazırlayanda bilirəm ki, database column adları necə olmalıdır - '
    'çünki özüm də database dizayn etmişəm. BA kimi mənim gap-im yoxdur - mən həm biznesi anlayıram, '
    'həm də texniki tərəfi. Mən bridge-am."'
))

# ════════════════════════════════════════════
# SECTION 7: GENERAL STRATEGIES
# ════════════════════════════════════════════
story.extend(add_h1('7. Umumi Musahibe Strategiyalari'))

story.extend(add_h2('7.1. Evvel Problem, Sonra Həll'))
story.extend(body(
    'Hər suala cavab verəndə əvvəlcə problemi danış, sonra sənin həllini. Bunu etməsən, sənin '
    'cavabın "faydalı" səslənir amma "təsirli" deyil. Məsələn:'
))
story.extend(bullet('<b>Yanlış:</b> "Mən BRD yazdım, FRD hazırladım, UAT koordinasiya etdim."'))
story.extend(bullet('<b>Düzgün:</b> "Bizdə problem var idi - stakeholder-lar eyni səhifədə deyildi. Hər kəs fərqli başa düşürdü. Mən BRD yazdım ki, hər kəs eyni şeyi oxusun."'))
story.extend(spacer(4))
story.extend(body(
    'Fərq nədir? Birincidə sadəcə tapşırıq siyahısı var. İkincidə problem-həll hekayəsi var. '
    'Musahibəçi ikincini eşidəndə düşünür: "bu adam problemi anlayır, və həll edir." Birincidə '
    'ise düşünür: "bu adam tapşırıq yerinə yetirir, amma strateji düşünürmü?"'
))

story.extend(add_h2('7.2. Reqəmlə Danış - Her Zaman'))
story.extend(body(
    'Rəqəmlər inandırıcıdır. "Çox sürətləndirdim" deyəndə heç kim inanmır. "3 gündən 1 güne '
    'düşdü" deyəndə hər kəs inanır. Hər layihən üçün ən azı 2-3 rəqəm yadda saxla:'
))
story.extend(bullet('BNPL: 2x Faster credit decisions'))
story.extend(bullet('B2C: 300-500 daily online applications'))
story.extend(bullet('Dashboard: 2x fewer errors'))
story.extend(bullet('Lifecycle: End-to-end (application to collection)'))
story.extend(spacer(4))
story.extend(body(
    'Bu rəqəmləri musahibədə təbii şəkildə istifadə et. Məsələn: "Bizdə kredit qərarı 3 gün çəkirdi, '
    'mən bu prosesi 1 güne endirdim" de. "1 güne" sözü çox güclüdür.'
))

story.extend(add_h2('7.3. "Harda Cetinlik Cekdin" Suali'))
story.extend(body(
    'Bu ən çox verilən suallardan biridir. Musahibəçi bilir ki, hər layihədə problem olur. '
    'Əgər sən "heç bir problem yox idi" deyəsən, ya yalan danışırsan, ya da layihənin öhdəsindən '
    'gəlməmisən. Hazır ol bu suala.'
))
story.extend(quote(
    '"Ən çətin an BNPL layihəsində oldu. Risk komandası və developer-lar ziddiyətli idi. '
    'Risk deyirdi ki, hər müraciəti əvvəlcədən yoxlayaq - amma bu system performance-ə təsir edəcəkdi. '
    'Developer-lar deyirdi ki, bu server-i yükləyəcək. Mən ikisi arasında oldum. SQL-lə data analiz etdim, '
    'hansı müraciətlərin 90% rədd olunduğunu gördüm. Sonra pre-screen modeli təklif etdim - yəni sadəcə '
    'real namizədlər scoring-ə gedəcək. Hər iki tərəf razı oldu."'
))
story.extend(spacer(4))
story.extend(tip('> Bu cavab 3 şeyi göstərir: 1) Çətinlik tanıyırsan ( dürüstlük), 2) Data-əsaslı həll tapırsan (peşəkarlıq), 3) İki tərəfi razılaşa bilirsən (leadership). Məhz bunlar musahibəçinin eşitmək istədiyi şeylərdir.'))

story.extend(add_h2('7.4. "Neden BA?" Suali'))
story.extend(body(
    '15 il developer olub BA olmaq - musahibəçi mütləq bunu soruşacaq. Hazır cavab hazırla:'
))
story.extend(quote(
    '"15 il developer olaraq gördüm ki, ən böyük problem kommunikasiyadır. Developer-lər bilirdi ki, '
    'nə yazaq, amma bilmirdi ki, nə üçün. Business bilirdi ki, nə istəyir, amma bilmirdi ki, '
    'bu texniki olaraq necə olur. Mən bu gap-i dolduracağam deyə düşündüm. BA rolda mən hər iki '
    'tərəfi anlayıram və onları birləşdirə bilirəm. Developer kimi yazdığım code-lar yaxşı idi, '
    'amma BA kimi etdiyim reqirements ilə 5 developer-in işini koordinasiya edərkən daha böyük '
    'impact yaradıram."'
))
story.extend(spacer(4))
story.extend(tip('> Bu cavab çox güclüdür çünki: 1) Karyera dəyişikliyini məntiqi izah edir, 2) "Impact" sözünü istifadə edir, 3) BA rolunun dəyərini anladığını göstərir.'))

story.extend(add_h2('7.5. "Sənin ən böyük gücün nədir?"'))
story.extend(body(
    'Bu suala cavab üçün 3 şey seç - hamısını deyəcəksən, amma əvvəl ən güclünü:'
))
story.extend(spacer(4))
story.extend(bullet('<b>Güc 1: Technical bridge.</b> "Mən həm biznesi anlayıram, həm də texniki tərəfi. Developer-lərin dilində danışa bilirəm və business stakeholder-lara mürəkkəb texniki şeyləri sadə izah edə bilirəm."'))
story.extend(bullet('<b>Güc 2: Data-driven decision making.</b> "SQL bilirəm və data ilə qərar verirəm. Emosiyalarla deyil, sübutlarla. Ziddiyətli tələblər gələndə data analysis edirəm və konsensus əldə edirəm."'))
story.extend(bullet('<b>Güc 3: Process improvement.</b> "Mən həmişə gələcəyi düşünürəm. As-Is-i gördükdən sonra To-Be-i təsvir edirəm. Ancaq bug-fix etmirəm, prosesi yaxşılaşdırıram."'))

# ════════════════════════════════════════════
# SECTION 8: COMMON QUESTIONS
# ════════════════════════════════════════════
story.extend(add_h1('8. Tez-tez Verilen Suallara Cavablar'))

qna_data = [
    [Paragraph('<b>Sual</b>', header_cell), Paragraph('<b>Cavab Stratejiyasi</b>', header_cell)],
    [Paragraph('"BRD necə yazırsan?"', cell_style),
     Paragraph('REQ-101 format, user stories ilə, Gherkin acceptance criteria ilə. Traceability matrix saxlayıram ki, hər req-nin test coverage-ı olsun.', cell_style)],
    [Paragraph('"Stakeholder ilə narazılıq olanda nə edirsən?"', cell_style),
     Paragraph('Data ilə sübut edirəm. SQL analysis ilə rəqəmlər göstərirəm. Əgər razılaşmırlarsa, RICE framework ilə prioritetləşdirirəm.', cell_style)],
    [Paragraph('"Agile scrum-da BA rolun nədir?"', cell_style),
     Paragraph('Sprint planning-də user stories təqdim edirəm, daily standup-da block-ları bildirirəm, sprint review-da demo-ya hazırlanıram, retrospective-də process improvement təklif edirəm.', cell_style)],
    [Paragraph('"Nə vaxt reqirements deyişir, nə edirsən?"', cell_style),
     Paragraph('Change impact analysis edirəm - bu dəyişiklik hansı digər req-ləri təsir edəcək. RICE ilə yeni req-i prioritetləşdirirəm. Stakeholder-ları məlumatlandırıram.', cell_style)],
    [Paragraph('"Fərqli komandalarla necə işləyirsən?"', cell_style),
     Paragraph('Hər komanda ilə ayrı session aparıram, onların dili ilə danışiram. Risk-ə data göstərirəm, developer-ə spec göstərirəm, operations-a workflow göstərirəm.', cell_style)],
    [Paragraph('"UAT necə keçirirsən?"', cell_style),
     Paragraph('Test senario-larını stakeholder-larla birlikdə hazırlayıram. Gherkin formatında yazıram. Bug triage meeting aparıram - Critical, Major, Minor kimi prioritetləşdirirəm.', cell_style)],
    [Paragraph('"API haqqında nə bilirsən?"', cell_style),
     Paragraph('REST API-ləri yaxşı bilirəm. Swagger/OpenAPI 3.0-da spec yazıram. Postman ilə test edirəm. Developer kimi API-lər yaratdığım üçün structurunu yaxşı anlayıram.', cell_style)],
]
qna_table = Table(qna_data, colWidths=[AW*0.35, AW*0.65], hAlign='CENTER')
qna_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0,0), (-1,0), TABLE_HEADER_TEXT),
    *[('BACKGROUND', (0,i), (-1,i), TABLE_ROW_EVEN if i%2==1 else TABLE_ROW_ODD) for i in range(1,8)],
    ('GRID', (0,0), (-1,-1), 0.5, TEXT_MUTED),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(Spacer(1, 12))
story.append(qna_table)
story.append(Spacer(1, 18))

# ════════════════════════════════════════════
# SECTION 9: FINAL TIPS
# ════════════════════════════════════════════
story.extend(add_h1('9. Son Puntlar - Musahibeden Evvel Oxu'))

story.extend(add_h2('9.1. Heqiqetleri Yadda Saxla'))
story.extend(body(
    'Musahibədən əvvəl bu faktları yadda saxla. Bunlar sənin əsas silahındır:'
))
story.extend(bullet('Embafinans-da 4 production layihə verdiyin - hamısı go-live olub'))
story.extend(bullet('Risk, sales, operations, IT - 4 fərqli komanda ilə işləyibsən'))
story.extend(bullet('BRD, FRD, SRS, API spec, BPMN, sequence diagram, data mapping - hamısını bilirsən'))
story.extend(bullet('SQL data analysis - ziddiyətli tələbləri həll edə bilirsən'))
story.extend(bullet('RICE framework - backlog prioritetləşdirmək üçün'))
story.extend(bullet('UAT coordination - on-time sign-off'))
story.extend(bullet('15 il technical background - BA olaraq bu sənin super gücün'))
story.extend(spacer(4))

story.extend(add_h2('9.2. Etmə'))
story.extend(bullet('Hər cavabı problem-həll formatında ver - STAR metodu'))
story.extend(bullet('Rəqəmlə danış - "2x faster", "300-500 daily", "1 gün"'))
story.extend(bullet('"Mən" de, amma digər komanda üzvlərini də qeyd et'))
story.extend(bullet('Başlamazdan əvvəl 2 saniyə düşün - sualın mahiyyəti nədir'))
story.extend(bullet('Bilmediyini de - amma "biləcəyəm" deyə sonlandır'))
story.extend(spacer(4))

story.extend(add_h2('9.3. Etmə'))
story.extend(bullet('CV-dəki hər sözü oxuma - hekayə danış'))
story.extend(bullet('Sadəcə tapşırıq siyahısı ver - "mən etdim, mən etdim"'))
story.extend(bullet('"Biz etdik" de və öz töhfəni gizlə'))
story.extend(bullet('Rəqəmsiz danış - "çox yaxşı oldu", "sürətləndi"'))
story.extend(bullet('Başqa şirkətləri pisləşdir'))
story.extend(spacer(4))

story.extend(add_h2('9.4. En Vacib Mesaj'))
story.extend(body(
    'Musahibənin sonunda sən aşağıdakı mesajı çatdırmalısan. Bunu birbaşa deməyin, amma hər '
    'cavabında bunu hiss etdirin:'
))
story.extend(quote(
    '"Mən sadəcə requirements yığan insan deyiləm. Mən problem həll edirəm. Fərqli komandaları '
    'bir araya gətirirəm. Data ilə qərar verirəm. 15 illik technical background-im ilə developer-lərlə '
    'eyni dildə danışırəm. Business stakeholder-lara isə mürəkkəb texniki şeyləri sadə izah edirəm. '
    'Mən bridge-am."'
))
story.extend(spacer(6))
story.extend(body(
    'Bu mesaj sənin bütün müsahibə boyunca nəql etdiyin hekayələrlə sübut olunmalıdır. Hər layihə '
    'hekayəsi bu mesajın bir parçasıdır. Musahibəçi çıxanda düşünməlidir: "bu adam bu şirkətdə '
    'real dəyər yaradacaq, çünki o sadəcə tapşırıq deyil, problem həll edir."'
))

# ── Build ──
doc.multiBuild(story)
print(f"PDF generated: {OUTPUT}")
print(f"Pages: {doc.page}")
