import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.pdfgen import canvas

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
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1F6F5F"))
        self.drawString(40, 805, "ASVANNA (අස්වැන්න)")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(135, 805, "— Master System Architecture, Codebase & QA Manual")
        
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(40, 798, 555, 798)
        
        # Running Footer
        self.line(40, 42, 555, 42)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(40, 30, "Division of Information Technology, ITUM — Final Year Project 2026")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 30, page_text)
        
        self.restoreState()

def build_pdf():
    pdf_path = "/mnt/d/Data/projects/Aswanna - Final_year_poject/Asvenna/docs/ASVANNA_COMPLETE_SYSTEM_MANUAL.pdf"
    
    # Page width: 595.27 pt, usable width = 595.27 - 80 = 515.27 pt
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
    
    # Color Palette
    c_primary = colors.HexColor("#1F6F5F")
    c_secondary = colors.HexColor("#2FA084")
    c_dark = colors.HexColor("#0F172A")
    c_light_bg = colors.HexColor("#F8FAFC")
    c_card_bg = colors.HexColor("#F1F5F9")
    c_border = colors.HexColor("#CBD5E1")
    c_accent = colors.HexColor("#16A34A")
    c_danger = colors.HexColor("#DC2626")
    c_singlish = colors.HexColor("#0369A1")

    # Typography
    t_title = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=24, leading=28, textColor=c_primary, alignment=1, spaceAfter=8)
    t_sub = ParagraphStyle('DocSub', parent=styles['Normal'], fontName='Helvetica', fontSize=11, leading=15, textColor=colors.HexColor("#475569"), alignment=1, spaceAfter=20)
    
    h1 = ParagraphStyle('H1', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=c_primary, spaceBefore=14, spaceAfter=8, keepWithNext=True)
    h2 = ParagraphStyle('H2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=c_secondary, spaceBefore=10, spaceAfter=6, keepWithNext=True)
    h3 = ParagraphStyle('H3', parent=styles['Heading3'], fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=c_dark, spaceBefore=8, spaceAfter=4, keepWithNext=True)
    
    body = ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12.5, textColor=colors.HexColor("#1E293B"), spaceAfter=6)
    body_bold = ParagraphStyle('BodyBold', parent=body, fontName='Helvetica-Bold')
    
    singlish = ParagraphStyle('Singlish', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12.5, textColor=c_singlish, spaceAfter=6)
    callout = ParagraphStyle('Callout', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8.5, leading=12, textColor=colors.HexColor("#0F766E"))
    code_inline = ParagraphStyle('CodeInline', parent=styles['Normal'], fontName='Courier', fontSize=7.5, leading=10, textColor=colors.HexColor("#0F172A"))
    diagram_style = ParagraphStyle('Diagram', parent=styles['Normal'], fontName='Courier', fontSize=7, leading=9, textColor=colors.HexColor("#0F172A"))

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
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        return t

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 20))
    story.append(Paragraph("🌾 ASVANNA (අස්වැන්න)", t_title))
    story.append(Paragraph("<b>The Zero-Waste Marketplace: Guided by Real-Time Data from Seed to Harvest Distribution</b><br/>Comprehensive System Architecture, Deep Codebase Reference, Group 15 Role Allocations & QA Manual", t_sub))
    story.append(HRFlowable(width="100%", thickness=2.5, color=c_primary, spaceBefore=4, spaceAfter=16))

    cover_meta = [
        [Paragraph("<b>Academic Institution:</b>", body_bold), Paragraph("Division of Information Technology, Institute of Technology, University of Moratuwa (ITUM)", body)],
        [Paragraph("<b>Academic Program:</b>", body_bold), Paragraph("National Diploma in Information Technology (NDIT) — 2025 / 2026", body)],
        [Paragraph("<b>Project Supervisor:</b>", body_bold), Paragraph("Mrs. Uthpala Athukorala (Division of Information Technology, ITUM)", body)],
        [Paragraph("<b>Target Geographic Pilot:</b>", body_bold), Paragraph("Bandarawela Agrarian Services Division, Badulla District, Sri Lanka", body)],
        [Paragraph("<b>Target Agricultural Sector:</b>", body_bold), Paragraph("Upcountry Perishable Vegetables (Leeks, Cabbage, Carrot, Beetroot, Potato, Knol Khol, Tomato, Bell Pepper)", body)],
    ]
    story.append(make_table(cover_meta, [140, 375]))
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Group 15 — Team Members & Assigned Modules:</b>", body_bold))
    team_data = [
        [Paragraph("<b>#</b>", body_bold), Paragraph("<b>Student Name</b>", body_bold), Paragraph("<b>Student ID</b>", body_bold), Paragraph("<b>Assigned Engineering Module & Responsibility</b>", body_bold)],
        [Paragraph("1", body), Paragraph("W. N. A. Wedikkara", body), Paragraph("23IT0544", body), Paragraph("System Architecture, Auth (JWT/RBAC), PostgreSQL Schema, Predictive Risk Engine", body)],
        [Paragraph("2", body), Paragraph("K. A. H. I. Lakshitha", body), Paragraph("23IT0503", body), Paragraph("Smart Crop Recommendation Engine, 4-Factor Weighted Agro-Suitability Scorer", body)],
        [Paragraph("3", body), Paragraph("G. W. T. Jayampathi", body), Paragraph("23IT0487", body), Paragraph("Divisional Officer Portal, Proxy Data Entry, Trilingual Localization, Broadcast Alerts", body)],
        [Paragraph("4", body), Paragraph("R. R. L. Geeganage", body), Paragraph("23IT0476", body), Paragraph("Farmer Mobile App (Flutter), GPS Field Logging, Offline Storage Queue & Sync", body)],
        [Paragraph("5", body), Paragraph("K. H. M. Dewanga", body), Paragraph("23IT0467", body), Paragraph("Phase 2 Geo-Fenced 5 km Surplus Marketplace, Haversine Engine & Negotiation State Machine", body)],
    ]
    t_team = Table(team_data, colWidths=[20, 115, 65, 315])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_team)
    story.append(Spacer(1, 12))
    story.append(Paragraph("<i>Manual Guide: This document is crafted for non-technical stakeholders (farmers, agrarian officers) and technical academic evaluators. It contains plain English, Sinhala & Singlish explanations, system diagrams, and file-by-file code breakdowns.</i>", callout))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 1: NON-TECHNICAL & STAKEHOLDER GUIDE
    # =========================================================================
    story.append(Paragraph("1. Plain-Language Executive Summary (For Non-IT Persons & Farmers)", h1))
    story.append(Paragraph(
        "In Sri Lanka's central hill country (Bandarawela, Welimada, Nuwara Eliya), farming families lose an estimated <b>30% to 40% of their annual crop yield</b> (equivalent to over Rs. 180 Billion in national waste). "
        "The root cause is <b>'Trend Planting' (වගා රැල්ල)</b>. When leeks or cabbage reach high prices at Dambulla or Manning Market, hundreds of farmers simultaneously plant the same vegetable. Months later, thousands of tons reach harvest on the exact same week, causing disastrous market surpluses and catastrophic price collapse.",
        body
    ))
    
    story.append(Paragraph("<b>🇱🇰 Sinhala & Singlish Simple Explanation (ගොවි මහතුන්ට සහ සාමාන්‍ය පරිශීලකයන්ට):</b>", body_bold))
    story.append(Paragraph(
        "<i>'ගොවි මහත්තුරු වෙළඳපොළේ අද තියෙන මිල බලලා හැමෝම එකම බෝගය (උදා: ලීක්ස්, ගෝවා) එකවර වගා කරනවා. මාස 3කට පස්සේ හැමෝගෙම අස්වැන්න එකම සතියේ වෙළඳපොළට ආවම මිල රුපියල් 20-30ට බහිනවා. මේකට තමයි වගා රැල්ල කියන්නේ. ASVANNA කියන්නේ මේ ප්‍රශ්නය මුලින්ම විසඳන ඩිජිටල් පද්ධතියක්.'</i>",
        singlish
    ))
    story.append(Paragraph(
        "<i>'1. ගොවියා බීජ දාන්න කලින් ඇප් එකෙන් බලනවා තමන්ගේ කලාපයේ ඒ බෝගය දැනටමත් කොච්චර වගා කරලා තියෙනවද කියලා.<br/>"
        "2. වගාව 85% ඉක්මවා ඇත්නම් (Over-Planted), පද්ධතිය රතු එළියක් දල්වා වැඩි ලාභයක් ලබාගත හැකි වෙනත් බෝග (බීට්රූට්, නෝකෝල්) නිර්දේශ කරයි.<br/>"
        "3. ස්මාර්ට්ෆෝන් නැති ගොවි මහතුන්ගේ දත්ත ගොවිජන සේවා නිලධාරියා (DO Officer) විසින් වෙබ් පද්ධතියට ඇතුළත් කරයි (Proxy Entry).<br/>"
        "4. ඉතිරි වන අතිරික්ත අස්වැන්න කිලෝමීටර් 5ක් ඇතුළත හෝටල්, වෙළඳුන්ට කෙළින්ම විකුණා ගැනීමට සෘජු වෙළඳපොළක් සපයයි.'</i>",
        singlish
    ))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 2: SYSTEM ARCHITECTURE & VISUAL FLOW CHARTS
    # =========================================================================
    story.append(Paragraph("2. System Architecture & Visual Process Diagrams", h1))
    story.append(Paragraph("The ASVANNA ecosystem operates across three functional tiers connected via high-speed RESTful APIs and real-time event sockets:", body))

    diag_arch = """
 +-----------------------------------------------------------------------------------+
 |                             PRESENTATION TIER (CLIENTS)                           |
 |  +-------------------------------------+   +------------------------------------+ |
 |  |   Farmer & Buyer Mobile App (Flutter)|   |  Divisional Officer Portal (React) | |
 |  |   - GPS Planting Logger             |   |  - Cultivation Map & Saturation    | |
 |  |   - Over-Planting Push Alerts (FCM) |   |  - Officer Proxy Data Entry Form   | |
 |  |   - Offline Queue Storage           |   |  - Multi-Channel Warning Broadcast | |
 |  |   - 5 km Surplus Produce Feed       |   |  - Trilingual UI (EN / SI / TA)    | |
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
 |  |  +-------------------------------------------------------------------------+ | |
 |  +------------------------------------------------------------------------------+ |
 +-----------------------------------------------------------------------------------+
                       | Relational SQL            | Realtime Sync
 +-----------------------------------------------------------------------------------+
 |                                 DATA PERSISTENCE TIER                             |
 |  +------------------------------------+   +-------------------------------------+ |
 |  | PostgreSQL 15 Database (Port 5432) |   | Firebase Realtime Database (Cloud)  | |
 |  | - 10 Relational Tables & Indexes   |   | - Live produce listing sync         | |
 |  +------------------------------------+   +-------------------------------------+ |
 +-----------------------------------------------------------------------------------+
    """
    story.append(make_diagram_box("System Architecture Diagram (Multi-Tier)", diag_arch))
    story.append(Spacer(1, 8))

    diag_risk = """
 [Farmer logs planting: Crop=Leeks, Area=1.5 Acres]
                     |
                     v
 [Calculate Supply: 1.5 ac * 8,500 kg/ac = 12,750 kg]
                     |
                     v
 [Query CROPIX Regional Demand Benchmark: e.g. 95,000 kg]
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
                [OVER-PLANTED (Red)]   [AT-RISK (Amber)]
                          |
                          v
         * Trigger Push & SMS Warning Broadcast
         * Activate Smart Crop Recommendations (Beetroot, Knol Khol)
    """
    story.append(make_diagram_box("Predictive Risk Engine Decision Flowchart", diag_risk))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: 5 MEMBERS ALLOCATION & CODE WALKTHROUGH
    # =========================================================================
    story.append(Paragraph("3. Group 15 — 5 Team Members' Technical Deep Dives & Testing Guide", h1))

    # Member 1 Deep Dive
    story.append(Paragraph("Member 1: W. N. A. Wedikkara (23IT0544)", h2))
    story.append(Paragraph("<b>Assigned System Component:</b> Architecture, PostgreSQL 15 Schema, JWT Role-Based Access Control, and Predictive Risk Engine.", body_bold))
    story.append(Paragraph(
        "<b>Core Implementation Details:</b><br/>"
        "• Engineered <code>backend/src/database/schema.sql</code> creating 10 normalized tables (users, master crops, planting_records, cropix_demand_benchmarks, risk_assessments, marketplace_listings, etc.).<br/>"
        "• Built <code>backend/src/middlewares/authMiddleware.js</code> enforcing JWT authentication with role-specific expiration (24h for Farmers, 8h for Officers).<br/>"
        "• Implemented <code>backend/src/services/riskEngineService.js</code> which aggregates active plot acreage, computes supply density against monthly CROPIX regional quotas, and determines 3-tier risk states.",
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
    story.append(Paragraph("<code>cd backend && npm run migrate && npm run seed && curl -X GET http://localhost:5000/api/v1/risk/crop/1</code>", code_inline))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=6, spaceAfter=8))

    # Member 2 Deep Dive
    story.append(Paragraph("Member 2: K. A. H. I. Lakshitha (23IT0503)", h2))
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
    story.append(Paragraph("<b>Assigned System Component:</b> Divisional Officer (DO) React Web Portal, Digital Inclusivity Proxy Data Entry & Broadcast Warning Alerts.", body_bold))
    story.append(Paragraph(
        "<b>Core Implementation Details:</b><br/>"
        "• Developed React.js admin portal (<code>frontend/src/pages/Dashboard.jsx</code>, <code>RegionalMonitoring.jsx</code>, <code>FarmerDirectory.jsx</code>).<br/>"
        "• Built <code>frontend/src/components/ProxyDataModal.jsx</code> enabling agrarian officers to manually register plot records for offline farmers without smartphones.<br/>"
        "• Implemented <code>frontend/src/components/BroadcastModal.jsx</code> and <code>backend/src/services/notificationService.js</code> for dispatching emergency warnings via Firebase Cloud Messaging (FCM) with SMS fallback.<br/>"
        "• Implemented complete trilingual localization in <code>frontend/src/locales/</code> (English, Sinhala, Tamil).",
        body
    ))
    story.append(Paragraph("<b>Evaluator Verification:</b> Open <code>http://localhost:3000</code>, login with <code>0771234567 / asvanna123</code>, click '+ Proxy Data Entry' and test language switcher.", body))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=6, spaceAfter=8))

    # Member 4 Deep Dive
    story.append(Paragraph("Member 4: R. R. L. Geeganage (23IT0476)", h2))
    story.append(Paragraph("<b>Assigned System Component:</b> Cross-Platform Flutter Mobile Application, Automatic GPS Field Logger & Offline Queue.", body_bold))
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
    story.append(Paragraph("<b>Assigned System Component:</b> Phase 2 Geo-Fenced Zero-Waste Surplus Marketplace, 5 km Proximity Radius Matching & Order Negotiation Machine.", body_bold))
    story.append(Paragraph(
        "<b>Core Implementation Details:</b><br/>"
        "• Developed <code>backend/src/utils/haversine.js</code> and <code>backend/src/services/geofencingService.js</code> calculating great-circle distances between farmer surplus plots and local commercial buyers.<br/>"
        "• Developed <code>backend/src/services/marketplaceService.js</code> syncing listings with Firebase Realtime Database for instant push updates.<br/>"
        "• Engineered <code>backend/src/controllers/marketplaceController.js</code> enforcing a 30-minute response deadline for buyer-farmer price counter-offers.<br/>"
        "• Created marketplace buyer interfaces in <code>frontend/src/pages/MarketplaceSurplus.jsx</code> and <code>mobile/lib/features/marketplace/</code>.",
        body
    ))
    story.append(Paragraph("<b>Evaluator Verification:</b> Query <code>GET /api/v1/marketplace/search-nearby?lat=6.8258&lng=80.9982&radius_km=5</code>.", code_inline))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: COMPLETE FILE-BY-FILE CODEBASE EXPLANATION
    # =========================================================================
    story.append(Paragraph("4. Comprehensive File-by-File Codebase Directory", h1))
    story.append(Paragraph("Every file in the ASVANNA repository is documented below with zero overlapping text, detailing its purpose, dependencies, required environment settings, and code logic:", body))

    full_files = [
        ("backend/src/server.js", "Server Entry Point", "Bootstraps the Express HTTP server, listens on PORT, and handles graceful SIGTERM termination.", "app.js, config.js", "PORT=5000", "node src/server.js"),
        ("backend/src/app.js", "Express App Configuration", "Configures security middleware (Helmet, CORS), JSON body parsers, logging (Morgan), and mounts API v1 route modules.", "express, cors, helmet, routes", "None", "npm start"),
        ("backend/src/config/config.js", "Configuration Hub", "Centralizes environment variables (.env) with safe defaults for PostgreSQL, JWT, Risk Thresholds, and Firebase.", "dotenv", "DB_*, JWT_*, RISK_*", "node -e 'require(\"./src/config/config\")'"),
        ("backend/src/config/database.js", "PostgreSQL Pool", "Creates a reusable PostgreSQL client connection pool using 'pg'. Handles idle errors and query logging.", "pg, config.js", "DB_HOST, DB_NAME", "npm run migrate"),
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
        ("backend/src/services/marketplaceService.js", "Marketplace Realtime Sync", "Synchronizes active produce listings to Firebase Realtime Database for live client feeds.", "firebase.js", "FIREBASE_DATABASE_URL", "Publish surplus listing"),
        ("backend/src/controllers/authController.js", "Auth Controller", "Handles user registration, login, bcrypt password hashing, session tokens, and profile retrieval.", "bcryptjs, jsonwebtoken", "JWT_SECRET", "POST /api/v1/auth/login"),
        ("backend/src/controllers/plantingController.js", "Planting Controller", "Logs GPS planting records, supports Officer proxy entries, and immediately updates risk.", "database.js, riskEngine", "None", "POST /api/v1/planting/log"),
        ("backend/src/controllers/riskEngineController.js", "Risk API Controller", "Exposes endpoints for individual crop risk assessment and district-wide saturation summaries.", "riskEngineService.js", "None", "GET /api/v1/risk/regional-summary"),
        ("backend/src/controllers/recommendationController.js", "Recommendation Controller", "Exposes endpoints for ranking alternative crops when regional saturation occurs.", "recommendationService.js", "None", "GET /api/v1/recommendations"),
        ("backend/src/controllers/marketplaceController.js", "Marketplace Controller", "Manages surplus listings, proximity search, and direct buyer order negotiation.", "geofencingService.js", "None", "POST /api/v1/marketplace/orders"),
        ("backend/src/controllers/officerController.js", "Officer Directory Controller", "Provides farmer directory queries and proxy farmer registration for smartphone-less users.", "database.js, bcryptjs", "None", "GET /api/v1/officer/farmers"),
        ("backend/src/controllers/broadcastController.js", "Broadcast Alert Controller", "Dispatches officer emergency notices to farmers with severity tags and multi-channel alerts.", "notificationService.js", "None", "POST /api/v1/broadcasts"),
        ("frontend/src/App.jsx", "React Router Root", "Defines client-side routes, protected route authentication guards, and layout hierarchy.", "react-router-dom, contexts", "None", "npm run dev"),
        ("frontend/src/context/AuthContext.jsx", "Auth State Context", "Manages user login state, JWT token storage in localStorage, and logout lifecycle.", "api.js", "asvanna_token", "Login / Logout actions"),
        ("frontend/src/context/LanguageContext.jsx", "Language State Context", "Manages trilingual switching (EN, SI, TA) across all web dashboard components.", "locales/*.json", "asvanna_lang", "Navbar language toggle"),
        ("frontend/src/pages/Dashboard.jsx", "Officer Dashboard Page", "Displays regional KPI cards, crop saturation progress bars, and quick action modals.", "StatCard, Modals", "None", "View http://localhost:3000"),
        ("frontend/src/pages/RegionalMonitoring.jsx", "Cultivation Map View", "Displays GPS planting plots across Bandarawela, Haputale, and Ella divisions.", "api.js", "None", "View /monitoring"),
        ("frontend/src/pages/RiskAnalytics.jsx", "Risk Analytics View", "Visualizes saturation thresholds and 4-factor composite scores for recommended crops.", "api.js", "None", "View /risk-analytics"),
        ("frontend/src/pages/FarmerDirectory.jsx", "Farmer Directory View", "Searchable list of registered farmers with contact information and planting counts.", "api.js", "None", "View /farmers"),
        ("frontend/src/pages/Broadcasts.jsx", "Broadcast Warnings View", "Displays broadcast warning history and lets officers dispatch emergency alerts.", "BroadcastModal.jsx", "None", "View /broadcasts"),
        ("frontend/src/pages/MarketplaceSurplus.jsx", "Surplus Marketplace View", "Displays active 5 km surplus produce batches for local trade.", "api.js", "None", "View /marketplace"),
        ("frontend/src/components/ProxyDataModal.jsx", "Proxy Data Entry Modal", "Modal form for officers to input cultivation data for offline farmers without phones.", "api.js", "None", "Click '+ Proxy Data Entry'"),
        ("frontend/src/components/BroadcastModal.jsx", "Broadcast Warning Modal", "Modal for drafting and dispatching trilingual warning notices with severity levels.", "api.js", "None", "Click 'Broadcast Warnings'"),
        ("mobile/lib/main.dart", "Flutter Entry Point", "Initializes Flutter framework, sets up theme colors, and configures trilingual localization.", "flutter_localizations", "None", "flutter run"),
        ("mobile/lib/core/services/location_service.dart", "GPS Location Service", "Queries device GPS coordinates via Geolocator with fallback to Bandarawela Agrarian Center.", "geolocator", "GPS Permission", "Trigger on mobile"),
        ("mobile/lib/core/services/offline_storage_service.dart", "Offline Storage Queue", "Caches pending planting records locally in SharedPreferences when offline.", "shared_preferences", "None", "Test in Airplane mode"),
        ("mobile/lib/features/home/farmer_home_screen.dart", "Farmer Home Screen", "Main mobile UI showing weather, over-planting alerts, and active plantings.", "planting, recs, market", "None", "Bottom nav switcher"),
        ("mobile/lib/features/planting/log_planting_screen.dart", "Planting Form Screen", "Farmer plot logging form with automatic GPS coordinate detection.", "location_service.dart", "None", "Tap 'Log Planting'"),
        ("mobile/lib/features/recommendations/smart_crop_recommendation_screen.dart", "Smart Recs Screen", "Mobile feed of ranked alternative crops with suitability score and Sinhala rationale.", "app_colors.dart", "None", "Tap 'Recommendations' tab"),
        ("mobile/lib/features/marketplace/marketplace_feed_screen.dart", "Marketplace Feed Screen", "Surplus produce feed showing listings within 5 km radius.", "list_surplus_screen.dart", "None", "Tap 'Marketplace' tab"),
        ("docker-compose.yml", "Docker Orchestration", "Single-command deployment for PostgreSQL 15, Node.js API server, and React Admin dashboard.", "Docker Engine", "POSTGRES_DB, PORT", "docker-compose up --build -d"),
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
            ('BACKGROUND', (0,1), (0,-1), c_light_bg),
            ('PADDING', (0,0), (-1,-1), 3.5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(t_file)
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 5: STEP-BY-STEP QA & EVALUATION PLAYBOOK
    # =========================================================================
    story.append(Paragraph("5. Master Testing & QA Verification Playbook", h1))
    story.append(Paragraph("Follow this sequential playbook to test and verify every module of the ASVANNA ecosystem:", body))

    test_steps = [
        ("Step 1: Automated Unit & Math Verification", "node backend/test/test_all_endpoints.js", "Executes 4 automated unit tests verifying Haversine calculations, 3-tier risk logic, and composite recommendation weight sums. Must output 4/4 Tests Passed."),
        ("Step 2: PostgreSQL Database Migration & Master Seeding", "cd backend && npm run migrate && npm run seed", "Initializes PostgreSQL schema (10 tables) and inserts 8 upcountry crops, 5 demo accounts, and monthly CROPIX demand quotas."),
        ("Step 3: Backend REST API Server Launch", "cd backend && npm run dev", "Starts server on http://localhost:5000. Verify health endpoint at http://localhost:5000/health (returns JSON { success: true, status: 'UP' })."),
        ("Step 4: Web Admin Dashboard Launch", "cd frontend && npm run dev", "Starts React dashboard on http://localhost:3000. Login with Officer credentials (0771234567 / asvanna123) to test proxy entry & broadcast warnings."),
        ("Step 5: Flutter Mobile Application Launch", "cd mobile && flutter pub get && flutter run", "Launches the mobile app on an Android emulator or device for Farmer plot logging, GPS capture, and Surplus marketplace browsing."),
        ("Step 6: Single-Command Docker Orchestration", "docker-compose up --build -d", "Spins up the full multi-tier ecosystem (PostgreSQL, Backend API, Web Admin) in isolated Docker containers."),
    ]

    for step_title, step_cmd, step_desc in test_steps:
        story.append(Paragraph(f"<b>{step_title}</b>", h3))
        step_table = [
            [Paragraph("<b>Command:</b>", body_bold), Paragraph(f"<code>{step_cmd}</code>", code_inline)],
            [Paragraph("<b>Verification:</b>", body_bold), Paragraph(step_desc, body)]
        ]
        story.append(make_table(step_table, [100, 415]))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=8, spaceAfter=10))
    story.append(Paragraph("<b>End of Master System Documentation</b> — Division of Information Technology, ITUM Final Year Project 2026.", ParagraphStyle('FooterNote', parent=body, alignment=1, fontName='Helvetica-Oblique', textColor=colors.HexColor("#64748B"))))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ Enhanced PDF System Manual generated successfully at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
