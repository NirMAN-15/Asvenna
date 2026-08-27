import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register TrueType Unicode Fonts for Sinhala & Latin text rendering
FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts')
pdfmetrics.registerFont(TTFont('NotoSinhala', os.path.join(FONT_DIR, 'NotoSansSinhala-Regular.ttf')))
pdfmetrics.registerFont(TTFont('NotoSinhala-Bold', os.path.join(FONT_DIR, 'NotoSansSinhala-Bold.ttf')))

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page
        self.saveState()
        
        # Running Header
        self.setFont("NotoSinhala-Bold", 8)
        self.setFillColor(colors.HexColor("#1F6F5F"))
        self.drawString(40, 805, "ASVANNA (අස්වැන්න)")
        self.setFont("NotoSinhala", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(145, 805, "— Master System Architecture, Codebase & User Manual")
        
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(40, 798, 555, 798)
        
        # Running Footer
        self.line(40, 42, 555, 42)
        self.setFont("NotoSinhala", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(40, 30, "Division of Information Technology, ITUM — Final Year Project 2026")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 30, page_text)
        
        self.restoreState()

def build_pdf():
    pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ASVANNA_COMPLETE_SYSTEM_MANUAL.pdf")
    USABLE_W = 515
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=52,
        bottomMargin=52
    )

    styles = getSampleStyleSheet()
    
    # Theme Palette
    c_primary = colors.HexColor("#1F6F5F")
    c_secondary = colors.HexColor("#2FA084")
    c_dark = colors.HexColor("#0F172A")
    c_light_bg = colors.HexColor("#F8FAFC")
    c_border = colors.HexColor("#CBD5E1")
    c_singlish = colors.HexColor("#0369A1")
    c_callout = colors.HexColor("#0F766E")
    c_sinhala_hdr = colors.HexColor("#065F46")

    # Typography Styles Using TrueType NotoSinhala
    t_title = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontName='NotoSinhala-Bold', fontSize=22, leading=26, textColor=c_primary, alignment=1, spaceAfter=8)
    t_sub = ParagraphStyle('DocSub', parent=styles['Normal'], fontName='NotoSinhala', fontSize=10.5, leading=15, textColor=colors.HexColor("#475569"), alignment=1, spaceAfter=18)
    
    h1 = ParagraphStyle('H1', parent=styles['Heading1'], fontName='NotoSinhala-Bold', fontSize=13.5, leading=17, textColor=c_primary, spaceBefore=12, spaceAfter=7, keepWithNext=True)
    h2 = ParagraphStyle('H2', parent=styles['Heading2'], fontName='NotoSinhala-Bold', fontSize=11, leading=14.5, textColor=c_secondary, spaceBefore=9, spaceAfter=5, keepWithNext=True)
    h3 = ParagraphStyle('H3', parent=styles['Heading3'], fontName='NotoSinhala-Bold', fontSize=9.5, leading=13, textColor=c_dark, spaceBefore=7, spaceAfter=3, keepWithNext=True)
    
    body = ParagraphStyle('Body', parent=styles['Normal'], fontName='NotoSinhala', fontSize=8.5, leading=12.8, textColor=colors.HexColor("#1E293B"), spaceAfter=5)
    body_bold = ParagraphStyle('BodyBold', parent=body, fontName='NotoSinhala-Bold')
    
    sinhala_text = ParagraphStyle('SinhalaText', parent=styles['Normal'], fontName='NotoSinhala', fontSize=8.5, leading=13.5, textColor=colors.HexColor("#134E4A"), spaceAfter=5)
    sinhala_bold = ParagraphStyle('SinhalaBold', parent=sinhala_text, fontName='NotoSinhala-Bold', textColor=c_sinhala_hdr)
    singlish = ParagraphStyle('Singlish', parent=styles['Normal'], fontName='NotoSinhala', fontSize=8.5, leading=12.5, textColor=c_singlish, spaceAfter=5)
    callout = ParagraphStyle('Callout', parent=styles['Normal'], fontName='NotoSinhala', fontSize=8.5, leading=12.5, textColor=c_callout)
    code_inline = ParagraphStyle('CodeInline', parent=styles['Normal'], fontName='Courier', fontSize=7.5, leading=9.5, textColor=colors.HexColor("#0F172A"))
    diagram_style = ParagraphStyle('Diagram', parent=styles['Normal'], fontName='Courier', fontSize=7, leading=8.5, textColor=colors.HexColor("#0F172A"))

    story = []

    def make_table(data, widths, bg=c_light_bg):
        t = Table(data, colWidths=widths)
        t.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, c_border),
            ('BACKGROUND', (0,0), (-1,-1), bg),
            ('PADDING', (0,0), (-1,-1), 4),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        return t

    def make_diagram_box(title, text):
        box_data = [
            [Paragraph(f"<b>📊 {title}</b>", body_bold)],
            [Preformatted(text, diagram_style)]
        ]
        t = Table(box_data, colWidths=[USABLE_W])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94A3B8")),
            ('PADDING', (0,0), (-1,-1), 5),
        ]))
        return t

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 15))
    story.append(Paragraph("🌾 ASVANNA (අස්වැන්න)", t_title))
    story.append(Paragraph("<b>The Zero-Waste Marketplace: Guided by Real-Time Data from Seed to Harvest Distribution</b><br/>Comprehensive Technical Architecture, Codebase Catalog, Role Security, Sinhala Guides & QA Manual", t_sub))
    story.append(HRFlowable(width="100%", thickness=2.5, color=c_primary, spaceBefore=4, spaceAfter=14))

    cover_meta = [
        [Paragraph("<b>Academic Institution:</b>", body_bold), Paragraph("Division of Information Technology, Institute of Technology, University of Moratuwa (ITUM)", body)],
        [Paragraph("<b>Academic Program:</b>", body_bold), Paragraph("National Diploma in Information Technology (NDIT) — 2025 / 2026", body)],
        [Paragraph("<b>Project Supervisor:</b>", body_bold), Paragraph("Mrs. Uthpala Athukorala (Division of Information Technology, ITUM)", body)],
        [Paragraph("<b>Target Geographic Pilot:</b>", body_bold), Paragraph("Bandarawela Agrarian Services Division, Badulla District, Sri Lanka", body)],
        [Paragraph("<b>Target Agricultural Sector:</b>", body_bold), Paragraph("Upcountry Perishable Vegetables (Leeks, Cabbage, Carrot, Beetroot, Potato, Knol Khol, Tomato, Bell Pepper)", body)],
        [Paragraph("<b>Core User Ecosystem:</b>", body_bold), Paragraph("Divisional Agrarian Officers (DO), Upcountry Smallholder Farmers, Local Commercial Buyers", body)],
    ]
    story.append(make_table(cover_meta, [140, 375]))
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Group 15 — Team Members & Assigned Modules:</b>", body_bold))
    team_data = [
        [Paragraph("<b>#</b>", body_bold), Paragraph("<b>Student Name</b>", body_bold), Paragraph("<b>Student ID</b>", body_bold), Paragraph("<b>Assigned Engineering Module & Responsibility</b>", body_bold)],
        [Paragraph("1", body), Paragraph("W. N. A. Wedikkara", body), Paragraph("23IT0544", body), Paragraph("System Architecture, Auth (JWT/RBAC), PostgreSQL Schema, Predictive Risk Engine", body)],
        [Paragraph("2", body), Paragraph("R. R. L. Geeganage (Ravindi)", body), Paragraph("23IT0476", body), Paragraph("Smart Crop Recommendation Engine, 4-Factor Weighted Agro-Suitability Scorer", body)],
        [Paragraph("3", body), Paragraph("G. W. T. Jayampathi", body), Paragraph("23IT0487", body), Paragraph("Multi-Role Web Portal, Separate 3-Role Auth, Highland Fresh UI, Proxy Logging", body)],
        [Paragraph("4", body), Paragraph("K. A. H. I. Lakshitha (Imal)", body), Paragraph("23IT0503", body), Paragraph("Farmer & Buyer Mobile App (Flutter), GPS Field Logging, Offline Storage Queue & Sync", body)],
        [Paragraph("5", body), Paragraph("K. H. M. Dewanga", body), Paragraph("23IT0467", body), Paragraph("Phase 2 Geo-Fenced 5 km Surplus Marketplace, Haversine Engine & Negotiation Chat", body)],
    ]
    t_team = Table(team_data, colWidths=[20, 130, 65, 300])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_team)
    story.append(Spacer(1, 8))
    story.append(Paragraph("<i>Manual Guide: This document is crafted for non-technical agricultural stakeholders (farmers, agrarian officers) and technical academic evaluators. It contains English explanations, Sinhala (සිංහල) guidelines, Singlish guides, system diagrams, and codebase catalogs.</i>", callout))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 1: NON-TECHNICAL & STAKEHOLDER GUIDE WITH SINHALA FONTS
    # =========================================================================
    story.append(Paragraph("1. Plain-Language Agricultural Guide (ගොවි මහතුන් සහ නිලධාරීන් සඳහා සරල මඟපෙන්වීම)", h1))
    story.append(Paragraph(
        "In Sri Lanka's central hill country (Bandarawela, Welimada, Nuwara Eliya), farming families lose an estimated <b>30% to 40% of their annual crop yield</b> (equivalent to over Rs. 180 Billion in national waste). "
        "The root cause is <b>'Trend Planting' (වගා රැල්ල)</b>. When leeks or cabbage reach high prices at Dambulla or Manning Market, hundreds of farmers simultaneously plant the same vegetable. Months later, thousands of tons reach harvest on the exact same week, causing disastrous market surpluses and catastrophic price collapse.",
        body
    ))
    
    story.append(Paragraph("<b>🇱🇰 සිංහල පැහැදිලි කිරීම (Sinhala Stakeholder Explanation):</b>", sinhala_bold))
    story.append(Paragraph(
        "ගොවි මහත්වරු වෙළඳපොළේ අද පවතින ඉහළ මිල දැක සියලු දෙනා එකවර එකම බෝගය (උදා: ලීක්ස්, ගෝවා) වගා කිරීම නිසා මාස 3කට පසු සියලු අස්වැන්න එකවර වෙළඳපොළට පැමිණ මිල රුපියල් 20-30 දක්වා කඩා වැටේ. මෙය 'වගා රැල්ල' ලෙස හඳුන්වයි. <b>ASVANNA (අස්වැන්න)</b> පද්ධතිය මඟින් මෙම ගැටළුව ප්‍රධාන අදියර 2කින් විසඳනු ලබයි:",
        sinhala_text
    ))

    features_sinhala = [
        [Paragraph("<b>අදියර / විශේෂාංගය</b>", sinhala_bold), Paragraph("<b>සිංහල පැහැදිලි කිරීම (Sinhala Explanation)</b>", sinhala_bold), Paragraph("<b>Singlish Guide (Easy Read)</b>", sinhala_bold)],
        [
            Paragraph("<b>1. වගා රැල්ල වැළැක්වීම<br/>(Predictive Risk Radar)</b>", sinhala_bold),
            Paragraph("ගොවියා බීජ සිටුවීමට පෙර තම ප්‍රදේශයේ (බණ්ඩාරවෙල) දැනටමත් එම බෝගය කොපමණ වගා කර ඇත්දැයි පරීක්ෂා කරයි. වගාව 85% ඉක්මවා ඇත්නම් රතු අනතුරු ඇඟවීමක් ලැබේ.", sinhala_text),
            Paragraph("Bija danna kalin app eken balanawa thaman wawanawa wage anith ayath eka boga wawanawada kiyala. 85% ta wadi nam Over-Planted kiyala warning enawa.", singlish)
        ],
        [
            Paragraph("<b>2. විකල්ප බෝග නිර්දේශය<br/>(Smart Alternatives)</b>", sinhala_bold),
            Paragraph("ප්‍රධාන බෝගය අධික ලෙස වගා කර ඇත්නම්, වෙළඳපොළ හිඟය, පස, කාලගුණය සහ මිල ස්ථාවරත්වය මත පදනම්ව වැඩි ලාභයක් ලබාගත හැකි වෙනත් බෝග (බීට්රූට්, රාබු) නිර්දේශ කරයි.", sinhala_text),
            Paragraph("Pradhana bogaya over-planted nam, wadi laba ganna puluwan wena boga (Beetroot, Radish) 4-factor scoring eken rank karala farmer ta pennanawa.", singlish)
        ],
        [
            Paragraph("<b>3. සෘජු අතිරික්ත වෙළඳපොළ<br/>(5km Geo-Fenced Marketplace)</b>", sinhala_bold),
            Paragraph("අතිරික්ත අස්වැන්න අතරමැදියන් රහිතව කිලෝමීටර් 5ක් ඇතුළත හෝටල්, අවන්හල් සහ තොග ගැනුම්කරුවන්ට සෘජුව අලෙවි කිරීමට සහ මිල සාකච්ඡා කිරීමට ඉඩ සලසයි.", sinhala_text),
            Paragraph("Ithuru aswanna 5km athule thiyena hotel/buyerslata direct wikunala transport cost ithuru karagena direct chat eken mila thiranaya karaganna puluwan.", singlish)
        ],
        [
            Paragraph("<b>4. ස්මාර්ට්ෆෝන් නැති ගොවීන්<br/>(Proxy Data Entry)</b>", sinhala_bold),
            Paragraph("ස්මාර්ට් දුරකථන නොමැති ග්‍රාමීය ගොවි මහතුන් වෙනුවෙන් ගොවිජන සේවා නිලධාරියා (DO Officer) විසින් වෙබ් පද්ධතිය හරහා වගා තොරතුරු ඇතුළත් කරයි.", sinhala_text),
            Paragraph("Smart phone nathi govinta Divisional Agrarian Officer portal eken data enter karala 100% regional map eka update karanawa.", singlish)
        ],
    ]
    story.append(make_table(features_sinhala, [110, 235, 170]))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 2: MULTI-USER ROLES & AUTHENTICATION SEPARATION
    # =========================================================================
    story.append(Paragraph("2. Multi-User Architecture & Role Isolation (පරිශීලක භූමිකා 3 වෙන්කිරීම)", h1))
    story.append(Paragraph(
        "ASVANNA provides dedicated, isolated authentication portals and navigation layouts for the three distinct user personas. There is no cross-role visibility; each user is granted an independent operational portal:",
        body
    ))

    roles_data = [
        [Paragraph("<b>User Persona</b>", body_bold), Paragraph("<b>Auth URL & Fields Required</b>", body_bold), Paragraph("<b>Dedicated Dashboard Features & Capabilities</b>", body_bold)],
        [
            Paragraph("🏛️ <b>Divisional Agrarian Officer (DO)</b>", body_bold),
            Paragraph("<b>URL:</b> <code>/auth/officer</code><br/><b>Fields:</b> Full Name, NIC, Phone, Employee ID, District, Division, Password.", body),
            Paragraph("• Regional Cultivation GIS Heatmap (Bandarawela, Welimada, Haputale)<br/>• CROPIX Saturation Matrix & Over-Planting Gauge Radar<br/>• Smallholder Farmer Directory & 1-Click Proxy Data Logging<br/>• Multi-Channel Emergency Warning Broadcasts (Push + SMS)", body)
        ],
        [
            Paragraph("👨‍🌾 <b>Upcountry Smallholder Farmer</b>", body_bold),
            Paragraph("<b>URL:</b> <code>/auth/farmer</code><br/><b>Fields:</b> Full Name, NIC, Phone, District, Division, GND Division, Land Size (Acres), Password.", body),
            Paragraph("• Personal Land Acreage & Active Cultivation Tracker<br/>• Live Over-Planting Warning Popups (>85% Quota Alert)<br/>• 4-Factor Smart Alternative Crop Suggestions<br/>• Surplus Produce Seller Listing for 5 km Zero-Waste Marketplace", body)
        ],
        [
            Paragraph("🛒 <b>Local Commercial Buyer</b>", body_bold),
            Paragraph("<b>URL:</b> <code>/auth/buyer</code><br/><b>Fields:</b> Business Name, Contact Person, Phone, NIC, Business Type (Wholesale/Retail/Hotel), District, Password.", body),
            Paragraph("• 5 km Geo-Fenced Surplus Produce Proximity Search Slider<br/>• Direct Procurement Order Placement with 30-Min Window<br/>• Real-Time Buyer-Farmer Price Negotiation Chat Drawer<br/>• Order History & Delivery Logistics Tracking", body)
        ],
    ]
    story.append(make_table(roles_data, [125, 175, 215]))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 3: SYSTEM ARCHITECTURE & VISUAL FLOW CHARTS
    # =========================================================================
    story.append(Paragraph("3. System Architecture & Computational Flow Diagrams", h1))
    story.append(Paragraph("The ASVANNA ecosystem operates across three functional tiers connected via high-speed RESTful APIs and real-time event sockets:", body))

    diag_arch = """
 +-----------------------------------------------------------------------------------+
 |                             PRESENTATION TIER (CLIENTS)                           |
 |  +-------------------------------------+   +------------------------------------+ |
 |  |   Farmer & Buyer Mobile App (Flutter)|   |  Multi-Role Web Portal (React 18)  | |
 |  |   - GPS Planting Logger             |   |  - Landing Page Gateway (3 Cards)  | |
 |  |   - Over-Planting Push Alerts (FCM) |   |  - Role Portals (/auth/officer etc)| |
 |  |   - Offline Queue Storage           |   |  - Protected Route Security Guard  | |
 |  |   - 5 km Surplus Produce Feed       |   |  - Highland Fresh UI (No Blur)     | |
 |  |   - Real-Time Negotiation Chat      |   |  - Trilingual UI (EN / SI / TA)    | |
 |  +-------------------------------------+   +------------------------------------+ |
 +-----------------------------------------------------------------------------------+
                                          | REST API (HTTP/JSON)
 +-----------------------------------------------------------------------------------+
 |                              APPLICATION & LOGIC TIER                             |
 |  +------------------------------------------------------------------------------+ |
 |  | Node.js / Express.js REST API Server (Port 5000)                             | |
 |  |  +-------------------------------------------------------------------------+ | |
 |  |  |  PREDICTIVE RISK ENGINE      | Supply Density vs CROPIX Demand Analyzer | | |
 |  |  |  SMART RECOMMENDATION ENGINE | 4-Factor Composite Agro-Scoring Matrix   | | |
 |  |  |  GEOFENCING SERVICE          | Haversine 5 km Radius Matching Engine    | | |
 |  |  |  NOTIFICATION SERVICE        | Firebase Cloud Messaging + SMS Fallback  | | |
 |  |  |  REAL-TIME DATA STORE        | In-Memory Live Event Stream & Chat Store | | |
 |  |  +-------------------------------------------------------------------------+ | |
 |  +------------------------------------------------------------------------------+ |
 +-----------------------------------------------------------------------------------+
                       | Relational SQL            | Fallback / Realtime
 +-----------------------------------------------------------------------------------+
 |                                 DATA PERSISTENCE TIER                             |
 |  +------------------------------------+   +-------------------------------------+ |
 |  | PostgreSQL 15 Database (Port 5432) |   | Embedded Local File DB Engine       | |
 |  | - 10 Relational Tables & Indexes   |   | - Zero-config persistent JSON store | |
 |  +------------------------------------+   +-------------------------------------+ |
 +-----------------------------------------------------------------------------------+
    """
    story.append(make_diagram_box("System Architecture Diagram (Multi-Tier)", diag_arch))
    story.append(Spacer(1, 8))

    diag_risk = """
 [Farmer logs planting: Crop=Leeks, Area=1.5 Acres]
                     |
                     v
 [Calculate Supply: 1.5 ac * 8,000 kg/ac = 12,000 kg]
                     |
                     v
 [Query CROPIX Regional Demand Benchmark: e.g. 588,000 kg]
                     |
                     v
 [Calculate Saturation Ratio: (Total Plotted Supply / Demand) * 100]
                     |
       +-------------+-------------+
       |                           |
   Ratio < 70%                Ratio >= 70%
       |                           |
       v                           v
  [SAFE (Green)]           Is Ratio > 85%?
                           |             |
                         YES             NO
                          |               |
                          v               v
                [OVER-PLANTED (Red)]   [WARNING (Amber)]
                          |
                          v
         * Trigger Push & SMS Warning Broadcast
         * Activate Smart Crop Recommendations (Beetroot, Carrot, Radish)
    """
    story.append(make_diagram_box("Predictive Risk Engine Decision Flowchart", diag_risk))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: 5 MEMBERS ALLOCATION & CODE WALKTHROUGH
    # =========================================================================
    story.append(Paragraph("4. Group 15 — 5 Team Members' Technical Allocations & Testing Guide", h1))

    # Member 1 Deep Dive
    story.append(Paragraph("Member 1: W. N. A. Wedikkara (23IT0544)", h2))
    story.append(Paragraph("<b>Assigned System Component:</b> Architecture, PostgreSQL 15 Schema, Dual-DB Engine, JWT Role Access Control & Predictive Risk Engine.", body_bold))
    story.append(Paragraph(
        "<b>Core Implementation Details:</b><br/>"
        "• Engineered <code>backend/src/database/schema.sql</code> creating 10 normalized tables (users, crops, planting_records, cropix_demand_benchmarks, risk_assessments, marketplace_listings, etc.).<br/>"
        "• Built <code>backend/src/config/database.js</code> implementing zero-config persistent JSON storage with PostgreSQL pool failover.<br/>"
        "• Built <code>backend/src/middlewares/authMiddleware.js</code> and <code>backend/src/controllers/authController.js</code> supporting separate role registrations (<code>OFFICER</code>, <code>FARMER</code>, <code>BUYER</code>) with bcrypt hashing.<br/>"
        "• Implemented <code>backend/src/services/riskEngineService.js</code> aggregating active plot acreage against CROPIX quotas.",
        body
    ))
    story.append(Paragraph(
        "<b>Mathematical Formula:</b><br/>"
        "<code>Estimated_Supply = SUM(Planted_Acres * Avg_Yield_Per_Acre_Kg)</code><br/>"
        "<code>Risk_Percentage = (Estimated_Supply / CROPIX_Regional_Quota_Kg) * 100</code><br/>"
        "• Safe: &lt; 70% | Warning: 70% to 85% | Over-Planted: &gt; 85%",
        code_inline
    ))
    story.append(Paragraph("<b>Evaluator Verification Command:</b>", body_bold))
    story.append(Paragraph("<code>cd backend && npm run migrate && npm run seed && curl -X GET http://localhost:5000/api/v1/risk/regional-summary?district=Badulla</code>", code_inline))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=6, spaceAfter=8))

    # Member 2 Deep Dive (Ravindi - R. R. L. Geeganage)
    story.append(Paragraph("Member 2: R. R. L. Geeganage (Ravindi - 23IT0476)", h2))
    story.append(Paragraph("<b>Assigned System Component:</b> Smart Crop Recommendation Engine & Multi-Factor Agro-Suitability Matrix.", body_bold))
    story.append(Paragraph(
        "<b>Core Implementation Details:</b><br/>"
        "• Developed <code>backend/src/services/recommendationService.js</code> and <code>backend/src/controllers/recommendationController.js</code>.<br/>"
        "• When an area is flagged as Over-Planted, the algorithm iterates through candidate crops and evaluates 4 weighted factors:<br/>"
        "  1. Market Gap Score (35% Weight) — High regional demand deficiency from CROPIX.<br/>"
        "  2. Soil Suitability Score (25% Weight) — Bandarawela sandy/loam soil compatibility.<br/>"
        "  3. Weather & Temperature Suitability (20% Weight) — Upcountry 14°C–22°C temperature band.<br/>"
        "  4. Historical Price Trend (20% Weight) — Profit margin stability over 3 months.<br/>"
        "• Ranks top 5 alternative crops descending with Sinhala/Tamil/English rationales.",
        body
    ))
    story.append(Paragraph(
        "<b>Formula:</b> <code>Composite = (0.35 * MarketGap) + (0.25 * Soil) + (0.20 * Weather) + (0.20 * Price)</code>",
        code_inline
    ))
    story.append(Paragraph("<b>Evaluator Verification Command:</b>", body_bold))
    story.append(Paragraph("<code>curl -X GET \"http://localhost:5000/api/v1/recommendations?district=Badulla&cropId=1\"</code>", code_inline))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=6, spaceAfter=8))

    # Member 3 Deep Dive
    story.append(Paragraph("Member 3: G. W. T. Jayampathi (23IT0487)", h2))
    story.append(Paragraph("<b>Assigned System Component:</b> Multi-User Web Portal, Separate 3-Role Authentication (Officer, Farmer, Buyer), Highland Fresh UI Design System, Proxy Logging & Alerts.", body_bold))
    story.append(Paragraph(
        "<b>Core Implementation Details:</b><br/>"
        "• Developed React.js multi-role portal (<code>frontend/src/pages/LandingPage.jsx</code>, <code>Dashboard.jsx</code>, <code>RegionalMonitoring.jsx</code>, <code>FarmerDirectory.jsx</code>).<br/>"
        "• Built dedicated authentication portals for each user type with role-specific registration fields (<code>OfficerAuth.jsx</code>, <code>FarmerAuth.jsx</code>, <code>BuyerAuth.jsx</code>) and role route security (<code>ProtectedRoute.jsx</code>).<br/>"
        "• Created the 'Highland Fresh' UI design system in <code>frontend/src/index.css</code> featuring solid card surfaces, high contrast, clean typography, and role-colored accents.<br/>"
        "• Built <code>frontend/src/components/ProxyDataModal.jsx</code> enabling agrarian officers to manually register plot records for offline farmers without smartphones.<br/>"
        "• Implemented <code>frontend/src/components/BroadcastModal.jsx</code> and <code>backend/src/services/notificationService.js</code> for dispatching emergency warnings via Firebase Cloud Messaging (FCM) with SMS fallback.<br/>"
        "• Implemented complete trilingual localization in <code>frontend/src/locales/</code> (English, Sinhala, Tamil).",
        body
    ))
    story.append(Paragraph("<b>Evaluator Verification:</b> Open <code>http://localhost:3000</code>, choose any user card on the Landing Page, register or login with <code>asvanna123</code>, and verify role-isolated navigation.", body))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=6, spaceAfter=8))

    # Member 4 Deep Dive (Imal - K. A. H. I. Lakshitha)
    story.append(Paragraph("Member 4: K. A. H. I. Lakshitha (Imal - 23IT0503)", h2))
    story.append(Paragraph("<b>Assigned System Component:</b> Cross-Platform Flutter Mobile Application, Automatic GPS Field Logger & Offline Storage Queue.", body_bold))
    story.append(Paragraph(
        "<b>Core Implementation Details:</b><br/>"
        "• Engineered Flutter mobile client (<code>mobile/lib/main.dart</code>, <code>farmer_home_screen.dart</code>, <code>log_planting_screen.dart</code>).<br/>"
        "• Developed <code>mobile/lib/core/services/location_service.dart</code> integrating Geolocator for auto GPS coordinate capture during plot registration.<br/>"
        "• Implemented <code>mobile/lib/core/services/offline_storage_service.dart</code> using SharedPreferences to cache pending submissions locally when rural network coverage drops, auto-syncing upon reconnection.<br/>"
        "• Built ARB localization files in <code>mobile/lib/l10n/</code> supporting Sinhala, Tamil, and English.",
        body
    ))
    story.append(Paragraph("<b>Evaluator Verification:</b> Run <code>cd mobile && flutter run</code>, open planting form, toggle Airplane mode, and verify offline queue persistence.", body))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=6, spaceAfter=8))

    # Member 5 Deep Dive
    story.append(Paragraph("Member 5: K. H. M. Dewanga (23IT0467)", h2))
    story.append(Paragraph("<b>Assigned System Component:</b> Phase 2 Geo-Fenced Zero-Waste Surplus Marketplace, 5 km Proximity Radius Matching & Real-Time Negotiation Engine.", body_bold))
    story.append(Paragraph(
        "<b>Core Implementation Details:</b><br/>"
        "• Developed <code>backend/src/utils/haversine.js</code> and <code>backend/src/services/geofencingService.js</code> calculating great-circle distances between farmer surplus plots and local commercial buyers.<br/>"
        "• Developed <code>backend/src/services/realtimeStore.js</code> maintaining in-memory message logs and order state machines.<br/>"
        "• Engineered <code>backend/src/controllers/marketplaceController.js</code> enforcing a 30-minute response deadline for buyer-farmer price counter-offers.<br/>"
        "• Created marketplace buyer interfaces in <code>frontend/src/pages/MarketplaceSurplus.jsx</code> and <code>mobile/lib/features/marketplace/</code>.",
        body
    ))
    story.append(Paragraph("<b>Evaluator Verification:</b> Query <code>GET /api/v1/marketplace/search-nearby?lat=6.8258&lng=80.9982&radius_km=5</code>.", code_inline))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 5: COMPLETE FILE-BY-FILE CODEBASE DIRECTORY
    # =========================================================================
    story.append(Paragraph("5. Comprehensive File-by-File Codebase Directory", h1))
    story.append(Paragraph("Every file in the ASVANNA repository is documented below with zero overlapping text, detailing its purpose, dependencies, required environment settings, and code logic:", body))

    full_files = [
        ("backend/src/server.js", "Server Entry Point", "Bootstraps the Express HTTP server, listens on PORT, and handles graceful SIGTERM termination.", "app.js, config.js", "PORT=5000", "node src/server.js"),
        ("backend/src/app.js", "Express App Configuration", "Configures security middleware (Helmet, CORS), JSON body parsers, logging (Morgan), and mounts API v1 route modules.", "express, cors, helmet, routes", "None", "npm start"),
        ("backend/src/config/config.js", "Configuration Hub", "Centralizes environment variables (.env) with safe defaults for PostgreSQL, JWT, Risk Thresholds, and Firebase.", "dotenv", "DB_*, JWT_*, RISK_*", "node -e 'require(\"./src/config/config\")'"),
        ("backend/src/config/database.js", "Database Engine & Fallback", "Provides PostgreSQL connection pool with zero-config embedded file DB fallback for uninterrupted development.", "pg, config.js", "DB_HOST, DB_NAME", "npm run migrate"),
        ("backend/src/config/firebase.js", "Firebase Admin SDK", "Initializes Firebase Admin SDK for Realtime Database sync and FCM push notifications with fallback mode.", "firebase-admin", "FIREBASE_PRIVATE_KEY", "Trigger notifications"),
        ("backend/src/database/schema.sql", "PostgreSQL DDL Schema", "Defines 10 relational tables: users, crops, planting_records, cropix_benchmarks, risk, marketplace, broadcasts, audit.", "PostgreSQL 12+", "asvanna_db", "psql -d asvanna_db -f schema.sql"),
        ("backend/src/database/migrate.js", "Migration Runner", "Executes schema.sql against PostgreSQL to establish tables, relationships, and performance indexes.", "fs, database.js", "DB credentials", "npm run migrate"),
        ("backend/src/database/seed.js", "Pilot Seeder", "Seeds 8 master upcountry crops, 5 demo accounts (Officer, Farmer, Buyer, Admin), and monthly CROPIX quotas.", "bcryptjs, database.js", "DB credentials", "npm run seed"),
        ("backend/src/middlewares/authMiddleware.js", "JWT & RBAC Middleware", "Validates Bearer JWT tokens and enforces Role-Based Access Control (FARMER, OFFICER, BUYER, ADMIN).", "jsonwebtoken", "JWT_SECRET", "curl with Bearer Token"),
        ("backend/src/middlewares/errorHandler.js", "Global Error Middleware", "Catches all uncaught server exceptions and returns standard JSON error responses.", "apiResponse.js", "NODE_ENV", "Trigger 404 / 500 error"),
        ("backend/src/middlewares/validationMiddleware.js", "Request Validator", "Validates request body/query schemas using express-validator and returns 400 on error.", "express-validator", "None", "Send invalid payload"),
        ("backend/src/utils/haversine.js", "Haversine Distance Calculator", "Calculates great-circle distance (km) between two geographic GPS coordinates.", "Math library", "None", "node test/test_all_endpoints.js"),
        ("backend/src/utils/apiResponse.js", "API Response Standardizer", "Formats standardized JSON responses: { success, message, data, timestamp }.", "None", "None", "Imported in controllers"),
        ("backend/src/services/riskEngineService.js", "Predictive Risk Engine", "Calculates regional supply density, compares against CROPIX demand, and evaluates 3-tier risk.", "database.js, config.js", "RISK_SAFE_THRESHOLD", "GET /api/v1/risk/crop/1"),
        ("backend/src/services/recommendationService.js", "Smart Crop Recommender", "Calculates 4-factor composite recommendation scores (Market Gap, Soil, Weather, Price).", "riskEngineService.js", "None", "GET /api/v1/recommendations"),
        ("backend/src/services/geofencingService.js", "Geofencing Filter", "Filters and sorts marketplace produce listings within a 5 km - 20 km geographic radius.", "haversine.js", "DEFAULT_GEOFENCE_RADIUS_KM", "GET /marketplace/search-nearby"),
        ("backend/src/services/notificationService.js", "Push & SMS Dispatcher", "Dispatches FCM multicast push notifications with simulated SMS fallback for offline farmers.", "firebase.js, database.js", "SMS_GATEWAY_URL", "POST /api/v1/broadcasts"),
        ("backend/src/services/realtimeStore.js", "Realtime Event & Chat Store", "In-memory event streaming and buyer-farmer direct negotiation message buffer.", "None", "None", "Direct chat interaction"),
        ("backend/src/controllers/authController.js", "Auth Controller", "Handles role registration (OFFICER, FARMER, BUYER), login, password hashing, JWT sessions, and profile retrieval.", "bcryptjs, jsonwebtoken", "JWT_SECRET", "POST /api/v1/auth/register"),
        ("backend/src/controllers/plantingController.js", "Planting Controller", "Logs GPS planting records, supports Officer proxy entries, and immediately updates risk.", "database.js, riskEngine", "None", "POST /api/v1/planting/log"),
        ("backend/src/controllers/riskEngineController.js", "Risk API Controller", "Exposes endpoints for individual crop risk assessment and district-wide saturation summaries.", "riskEngineService.js", "None", "GET /api/v1/risk/regional-summary"),
        ("backend/src/controllers/recommendationController.js", "Recommendation Controller", "Exposes endpoints for ranking alternative crops when regional saturation occurs.", "recommendationService.js", "None", "GET /api/v1/recommendations"),
        ("backend/src/controllers/marketplaceController.js", "Marketplace Controller", "Manages surplus listings, proximity search, and direct buyer order negotiation.", "geofencingService.js", "None", "POST /api/v1/marketplace/orders"),
        ("backend/src/controllers/officerController.js", "Officer Directory Controller", "Provides farmer directory queries and proxy farmer registration for smartphone-less users.", "database.js, bcryptjs", "None", "GET /api/v1/officer/farmers"),
        ("backend/src/controllers/broadcastController.js", "Broadcast Alert Controller", "Dispatches officer emergency notices to farmers with severity tags and multi-channel alerts.", "notificationService.js", "None", "POST /api/v1/broadcasts"),
        ("frontend/src/pages/LandingPage.jsx", "Landing Page Gateway", "Public portal gateway presenting 3 large user selection cards (Officer, Farmer, Buyer) for registration and sign in.", "react-router-dom, lucide-react", "None", "View http://localhost:3000"),
        ("frontend/src/pages/auth/OfficerAuth.jsx", "Officer Auth Portal", "Dedicated authentication and registration view for Divisional Agrarian Officers with Employee ID validation.", "AuthContext.jsx", "None", "View /auth/officer"),
        ("frontend/src/pages/auth/FarmerAuth.jsx", "Farmer Auth Portal", "Dedicated authentication and registration view for Upcountry Smallholder Farmers with land acreage capture.", "AuthContext.jsx", "None", "View /auth/farmer"),
        ("frontend/src/pages/auth/BuyerAuth.jsx", "Buyer Auth Portal", "Dedicated authentication and registration view for Commercial Buyers with business category selection.", "AuthContext.jsx", "None", "View /auth/buyer"),
        ("frontend/src/components/ProtectedRoute.jsx", "Role Route Guard", "Guards application routes against unauthenticated and unauthorized role access.", "AuthContext.jsx", "None", "Direct URL navigation"),
        ("frontend/src/App.jsx", "React Router Root", "Defines client-side routes, role-based route security, and layout hierarchy.", "react-router-dom, contexts", "None", "npm run dev"),
        ("frontend/src/context/AuthContext.jsx", "Auth State Context", "Manages user login state, registration, JWT token storage in localStorage, and logout lifecycle.", "api.js", "asvanna_token", "Login / Logout actions"),
        ("frontend/src/context/LanguageContext.jsx", "Language State Context", "Manages trilingual switching (EN, SI, TA) across all web dashboard components.", "locales/*.json", "asvanna_lang", "Navbar language toggle"),
        ("frontend/src/index.css", "Highland Fresh Design", "Complete CSS design system with solid card surfaces, high contrast, clean typography, and role accents.", "Tailwind CSS", "None", "Global styling"),
        ("frontend/src/pages/Dashboard.jsx", "Multi-Role Dashboard", "Displays role-tailored KPI cards, crop saturation progress bars, land acreages, and quick action modals.", "StatCard, Modals", "None", "View /dashboard"),
        ("frontend/src/pages/RegionalMonitoring.jsx", "Cultivation Map View", "Displays GPS planting plots across Bandarawela, Haputale, and Ella divisions.", "api.js", "None", "View /monitoring"),
        ("frontend/src/pages/RiskAnalytics.jsx", "Risk Analytics View", "Visualizes saturation thresholds and 4-factor composite scores for recommended crops.", "api.js", "None", "View /risk-analytics"),
        ("frontend/src/pages/FarmerDirectory.jsx", "Farmer Directory View", "Searchable list of registered farmers with contact information and planting counts.", "api.js", "None", "View /farmers"),
        ("frontend/src/pages/Broadcasts.jsx", "Broadcast Warnings View", "Displays broadcast warning history and lets officers dispatch emergency alerts.", "BroadcastModal.jsx", "None", "View /broadcasts"),
        ("frontend/src/pages/MarketplaceSurplus.jsx", "Surplus Marketplace View", "Displays active 5 km surplus produce batches for local trade and real-time negotiation chat.", "api.js", "None", "View /marketplace"),
        ("frontend/src/components/ProxyDataModal.jsx", "Proxy Data Entry Modal", "Modal form for officers to input cultivation data for offline farmers without phones.", "api.js", "None", "Click '+ Proxy Data Entry'"),
        ("frontend/src/components/BroadcastModal.jsx", "Broadcast Warning Modal", "Modal for drafting and dispatching trilingual warning notices with severity levels.", "api.js", "None", "Click 'Broadcast Warnings'"),
        ("mobile/lib/main.dart", "Flutter Entry Point", "Initializes Flutter framework, sets up theme colors, and configures trilingual localization.", "flutter_localizations", "None", "flutter run"),
        ("mobile/lib/core/services/location_service.dart", "GPS Location Service", "Queries device GPS coordinates via Geolocator with fallback to Bandarawela Agrarian Center.", "geolocator", "GPS Permission", "Trigger on mobile"),
        ("mobile/lib/core/services/offline_storage_service.dart", "Offline Storage Queue", "Caches pending planting records locally in SharedPreferences when offline.", "shared_preferences", "None", "Test in Airplane mode"),
        ("mobile/lib/features/home/farmer_home_screen.dart", "Farmer Home Screen", "Main mobile UI showing weather, over-planting alerts, and active plantings.", "planting, recs, market", "None", "Bottom nav switcher"),
        ("mobile/lib/features/planting/log_planting_screen.dart", "Planting Form Screen", "Farmer plot logging form with automatic GPS coordinate detection.", "location_service.dart", "None", "Tap 'Log Planting'"),
        ("mobile/lib/features/recommendations/smart_crop_recommendation_screen.dart", "Smart Recs Screen", "Mobile feed of ranked alternative crops with suitability score and Sinhala rationale.", "app_colors.dart", "None", "Tap 'Recommendations' tab"),
        ("mobile/lib/features/marketplace/marketplace_feed_screen.dart", "Marketplace Feed Screen", "Surplus produce feed showing listings within 5 km radius.", "list_surplus_screen.dart", "None", "Tap 'Marketplace' tab"),
        ("docker-compose.yml", "Docker Orchestration", "Single-command deployment for PostgreSQL 15, Node.js API server, and React Multi-Role dashboard.", "Docker Engine", "POSTGRES_DB, PORT", "docker compose up --build -d"),
        (".github/workflows/ci.yml", "CI Pipeline", "Automated GitHub Actions workflow for backend unit tests, frontend build, and code verification.", "GitHub Actions", "NODE_ENV=test", "git push origin main"),
    ]

    for item in full_files:
        f_path, f_title, f_desc, f_deps, f_config, f_test = item
        
        file_table_data = [
            [Paragraph(f"<b>📄 {f_path}</b> — <i>{f_title}</i>", body_bold), Paragraph(f"<b>Test:</b> <code>{f_test}</code>", code_inline)],
            [Paragraph("<b>Purpose:</b>", body_bold), Paragraph(f_desc, body)],
            [Paragraph("<b>Dependencies:</b>", body_bold), Paragraph(f"<code>{f_deps}</code>", code_inline)],
            [Paragraph("<b>Configuration:</b>", body_bold), Paragraph(f"<code>{f_config}</code>", code_inline)],
        ]
        t_file = Table(file_table_data, colWidths=[130, 385])
        t_file.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, c_border),
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
            ('BACKGROUND', (0,1), (-1,-1), c_light_bg),
            ('PADDING', (0,0), (-1,-1), 3.5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(t_file)
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 6: STEP-BY-STEP QA & EVALUATION PLAYBOOK
    # =========================================================================
    story.append(Paragraph("6. Master Testing & QA Verification Playbook", h1))
    story.append(Paragraph("Follow this sequential playbook to test and verify every module of the ASVANNA ecosystem:", body))

    test_steps = [
        ("Step 1: Automated Unit & Math Verification", "node backend/test/test_all_endpoints.js", "Executes 4 automated unit tests verifying Haversine calculations, 3-tier risk logic, and composite recommendation weight sums. Must output 4/4 Tests Passed."),
        ("Step 2: Database Migration & Master Seeding", "cd backend && npm run migrate && npm run seed", "Initializes database schema (10 tables) and inserts 8 upcountry crops, demo accounts, and monthly CROPIX demand quotas."),
        ("Step 3: Backend REST API Server Launch", "cd backend && npm run dev", "Starts server on http://localhost:5000. Verify health endpoint at http://localhost:5000/health (returns JSON { success: true, status: 'UP' })."),
        ("Step 4: Multi-Role Web Portal Launch", "cd frontend && npm run dev", "Starts React portal on http://localhost:3000. Landing page displays 3 role cards. Test registering/logging into Officer, Farmer, and Buyer dashboards."),
        ("Step 5: Flutter Mobile Application Launch", "cd mobile && flutter pub get && flutter run", "Launches the mobile app on an Android emulator or device for Farmer plot logging, GPS capture, and Surplus marketplace browsing."),
        ("Step 6: Single-Command Docker Orchestration", "docker compose up --build -d", "Spins up the full multi-tier ecosystem (PostgreSQL, Backend API, Web Portal) in isolated Docker containers with automated health checks."),
    ]

    for step_title, step_cmd, step_desc in test_steps:
        story.append(Paragraph(f"<b>{step_title}</b>", h3))
        step_table = [
            [Paragraph("<b>Command:</b>", body_bold), Paragraph(f"<code>{step_cmd}</code>", code_inline)],
            [Paragraph("<b>Expected Result:</b>", body_bold), Paragraph(step_desc, body)],
        ]
        t_step = Table(step_table, colWidths=[120, 395])
        t_step.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, c_border),
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#E2E8F0")),
            ('BACKGROUND', (1,0), (1,-1), c_light_bg),
            ('PADDING', (0,0), (-1,-1), 4),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(t_step)
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Enhanced Unicode PDF System Manual generated successfully at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
