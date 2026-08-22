import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
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
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header
        self.drawString(54, 750, "ASVANNA (අස්වැන්න) — Master System Manual & Technical Documentation")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 742, 540, 742)
        
        # Footer
        self.line(54, 50, 540, 50)
        self.drawString(54, 38, "Institute of Technology, University of Moratuwa — Final Year Project 2026")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(540, 38, page_text)
        self.restoreState()

def build_pdf():
    pdf_path = "/mnt/d/Data/projects/Aswanna - Final_year_poject/Asvenna/docs/ASVANNA_COMPLETE_SYSTEM_MANUAL.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=64,
        bottomMargin=64
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#1F6F5F")
    c_secondary = colors.HexColor("#2FA084")
    c_dark = colors.HexColor("#0F172A")
    c_light_bg = colors.HexColor("#F8FAFC")
    c_accent = colors.HexColor("#16A34A")
    c_warning = colors.HexColor("#D97706")
    c_danger = colors.HexColor("#DC2626")

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_primary,
        alignment=1, # Center
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_secondary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_dark,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=8
    )

    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0F766E")
    )

    code_style = ParagraphStyle(
        'Code_Block',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )

    singlish_style = ParagraphStyle(
        'Singlish_Explanation',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0369A1")
    )

    story = []

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("🌾 ASVANNA (අස්වැන්න)", title_style))
    story.append(Paragraph("<b>The Zero-Waste Marketplace: Guided by Real-Time Data from Seed to Harvest Distribution</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=3, color=c_primary, spaceBefore=10, spaceAfter=25))

    cover_meta = [
        [Paragraph("<b>Academic Institution:</b>", body_bold), Paragraph("Division of Information Technology, Institute of Technology, University of Moratuwa (ITUM)", body_style)],
        [Paragraph("<b>Qualification:</b>", body_bold), Paragraph("National Diploma in Information Technology (NDIT)", body_style)],
        [Paragraph("<b>Academic Year:</b>", body_bold), Paragraph("Final Year Project 2025 / 2026", body_style)],
        [Paragraph("<b>Project Supervisor:</b>", body_bold), Paragraph("Mrs. Uthpala Athukorala", body_style)],
        [Paragraph("<b>Document Purpose:</b>", body_bold), Paragraph("Complete System Architecture, File-by-File Code Documentation, Member Allocation & QA Test Manual", body_style)],
    ]
    t_cover = Table(cover_meta, colWidths=[150, 330])
    t_cover.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_bg),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_cover)
    story.append(Spacer(1, 20))

    story.append(Paragraph("<b>Group 15 — Team Members & Student Registration Numbers:</b>", body_bold))
    team_data = [
        ["#", "Student Name", "Student ID", "Assigned Core Engineering Module"],
        ["1", "W. N. A. Wedikkara", "23IT0544", "System Architecture, Auth/RBAC, DB & Risk Engine"],
        ["2", "K. A. H. I. Lakshitha", "23IT0503", "Smart Crop Recommendation & Agro-Scoring Engine"],
        ["3", "G. W. T. Jayampathi", "23IT0487", "Divisional Officer Portal, Proxy Entry & Broadcast Alerts"],
        ["4", "R. R. L. Geeganage", "23IT0476", "Farmer Mobile App (Flutter), GPS Logging & Offline Queue"],
        ["5", "K. H. M. Dewanga", "23IT0467", "5 km Geo-Fenced Zero-Waste Surplus Marketplace"],
    ]
    t_team = Table(team_data, colWidths=[25, 130, 75, 250])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('PADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_light_bg]),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (2,0), (2,-1), 'CENTER'),
    ]))
    story.append(t_team)
    
    story.append(Spacer(1, 30))
    story.append(Paragraph("<i>This document provides a dual-audience manual: non-technical agricultural stakeholders (farmers, agrarian officers) and technical academic evaluators (software engineers, examiners). Explanations are presented in English with complementary Singlish & Sinhala insights.</i>", callout_style))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 1: NON-TECHNICAL OVERVIEW & SYSTEM PURPOSE
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Plain-Language Overview", h1_style))
    story.append(Paragraph(
        "Sri Lanka's upcountry vegetable farmers (Bandarawela, Nuwara Eliya, Badulla) suffer massive recurring losses (estimated at 30%–40% post-harvest waste, exceeding Rs. 180 Billion annually). This happens because of <b>'Trend Planting' (වගා රැල්ල)</b> — when carrot or leeks prices rise at Dambulla or Manning Market, hundreds of farmers simultaneously cultivate the same crop. Months later, thousands of tons flood the market at the exact same week, causing disastrous price crashes and produce dumping.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Singlish / Sinhala Explanation (Non-IT Person Guide):</b><br/>"
        "<i>'Govi mahathwaru market eke ada thiyena ganan balala ekama boga wargaya (e.g. Leeks, Cabbage) ekawara wawanawa. Ethakota mas 3kin ekawara aswanna labunama market eka pirila mila bahinawa. ASVANNA kiyanne meka nawathwana digital platform ekak. Farmer boga wawanna kalin app eken log kalama, system eka national market demand eka (CROPIX) ekka compare karala warning ekak denawa. Saturation eka 85% wadi nam wena labadayaka boga (Beetroot, Knol Khol) recommend karanawa. Ithuru wena aswanna 5km athule buyerslata kelinma wikunanna marketplace ekakuth meke thiyanawa.'</i>",
        singlish_style
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("Key Ecosystem Pillars:", h2_style))
    pillars = [
        [Paragraph("<b>Pillar 1: Regional Cultivation Monitoring</b>", body_bold), Paragraph("Real-time GPS plotting of active planting plots across agrarian divisions.", body_style)],
        [Paragraph("<b>Pillar 2: Predictive Risk Engine</b>", body_bold), Paragraph("Calculates supply density against national demand (CROPIX) to give 3-tier alerts: Safe (<70%), At-Risk (70–85%), Over-Planted (>85%).", body_style)],
        [Paragraph("<b>Pillar 3: Smart Recommendations</b>", body_bold), Paragraph("4-factor composite scoring: Market Gap (35%), Soil Suitability (25%), Weather (20%), Price Trend (20%).", body_style)],
        [Paragraph("<b>Pillar 4: Zero-Waste Marketplace</b>", body_bold), Paragraph("Geo-fenced 5 km direct trade connecting farmers with local hoteliers, caterers, and bulk buyers for surplus produce.", body_style)],
        [Paragraph("<b>Pillar 5: Digital Inclusivity (Proxy Entry)</b>", body_bold), Paragraph("Divisional Officers enter cultivation records on behalf of farmers who lack smartphones, ensuring 100% regional map completeness.", body_style)],
    ]
    t_pillars = Table(pillars, colWidths=[160, 320])
    t_pillars.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('BACKGROUND', (0,0), (0,-1), c_light_bg),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_pillars)
    story.append(PageBreak())

    # =========================================================================
    # SECTION 2: 5 TEAM MEMBERS — INDIVIDUAL ROLES & TESTING GUIDE
    # =========================================================================
    story.append(Paragraph("2. Group 15 — Individual Member Breakdown & Evaluation Guide", h1_style))
    story.append(Paragraph("Each team member is responsible for a dedicated, modular tier of the ASVANNA ecosystem. Evaluators can test each student's specific contribution using the steps below:", body_style))

    # Member 1
    story.append(Paragraph("Member 1: W. N. A. Wedikkara (23IT0544)", h2_style))
    story.append(Paragraph("<b>Assigned Responsibility:</b> System Architecture, PostgreSQL Relational Schema, JWT Role-Based Access Control (RBAC), and Mathematical Predictive Risk Engine.", body_style))
    story.append(Paragraph("<b>Files Authored:</b> <code>backend/src/services/riskEngineService.js</code>, <code>backend/src/controllers/riskEngineController.js</code>, <code>backend/src/database/schema.sql</code>, <code>backend/src/middlewares/authMiddleware.js</code>, <code>backend/src/config/database.js</code>", code_style))
    story.append(Paragraph("<b>How Evaluators Can Test Member 1's Work:</b><br/>"
                           "1. Run <code>npm run migrate && npm run seed</code> in <code>backend/</code> to verify DB relational schemas, indices, and seed data.<br/>"
                           "2. Send a GET request to <code>http://localhost:5000/api/v1/risk/crop/1</code> to test the Leeks supply vs CROPIX demand calculation.<br/>"
                           "3. Verify that JWT tokens enforce 24-hour expiration for Farmers and 8-hour expiration for Officers.", body_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceBefore=8, spaceAfter=12))

    # Member 2
    story.append(Paragraph("Member 2: K. A. H. I. Lakshitha (23IT0503)", h2_style))
    story.append(Paragraph("<b>Assigned Responsibility:</b> Smart Crop Recommendation Engine, Multi-factor Weighted Scoring Algorithm (Market Gap 35%, Soil 25%, Weather 20%, Historical Price 20%), and Agronomic Suitability Models.", body_style))
    story.append(Paragraph("<b>Files Authored:</b> <code>backend/src/services/recommendationService.js</code>, <code>backend/src/controllers/recommendationController.js</code>, <code>backend/src/routes/recommendationRoutes.js</code>, <code>frontend/src/pages/RiskAnalytics.jsx</code>", code_style))
    story.append(Paragraph("<b>How Evaluators Can Test Member 2's Work:</b><br/>"
                           "1. Query <code>http://localhost:5000/api/v1/recommendations?district=Badulla&cropId=1</code>.<br/>"
                           "2. Verify that when Leeks (cropId 1) is at risk, candidate alternative crops like Beetroot (Score 92%) and Knol Khol (Score 88%) are ranked descending by composite score with Sinhala/Tamil/English rationales.", body_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceBefore=8, spaceAfter=12))

    # Member 3
    story.append(Paragraph("Member 3: G. W. T. Jayampathi (23IT0487)", h2_style))
    story.append(Paragraph("<b>Assigned Responsibility:</b> Divisional Officer (DO) Web Portal, Digital Inclusivity Proxy Data Entry, Regional Cultivation Heatmap & Broadcast Warning System with FCM Push & SMS Fallback.", body_style))
    story.append(Paragraph("<b>Files Authored:</b> <code>frontend/src/pages/Dashboard.jsx</code>, <code>frontend/src/pages/RegionalMonitoring.jsx</code>, <code>frontend/src/components/ProxyDataModal.jsx</code>, <code>frontend/src/components/BroadcastModal.jsx</code>, <code>backend/src/services/notificationService.js</code>, <code>frontend/src/locales/*</code>", code_style))
    story.append(Paragraph("<b>How Evaluators Can Test Member 3's Work:</b><br/>"
                           "1. Open <code>http://localhost:3000</code> and login using Officer credentials (<code>0771234567 / asvanna123</code>).<br/>"
                           "2. Click '+ Proxy Data Entry' and submit a record on behalf of an offline farmer.<br/>"
                           "3. Click 'Broadcast Warnings' to issue an emergency push notification to registered regional farmers.<br/>"
                           "4. Toggle between English, Sinhala, and Tamil languages in the navbar.", body_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceBefore=8, spaceAfter=12))

    # Member 4
    story.append(Paragraph("Member 4: R. R. L. Geeganage (23IT0476)", h2_style))
    story.append(Paragraph("<b>Assigned Responsibility:</b> Cross-Platform Flutter Mobile Application for Farmers, GPS-Tagged Field Logging, Offline SQLite/SharedPreferences Caching, and Auto-Sync Engine.", body_style))
    story.append(Paragraph("<b>Files Authored:</b> <code>mobile/lib/features/home/farmer_home_screen.dart</code>, <code>mobile/lib/features/planting/log_planting_screen.dart</code>, <code>mobile/lib/core/services/location_service.dart</code>, <code>mobile/lib/core/services/offline_storage_service.dart</code>, <code>mobile/lib/l10n/*</code>", code_style))
    story.append(Paragraph("<b>How Evaluators Can Test Member 4's Work:</b><br/>"
                           "1. Run <code>flutter run</code> inside <code>mobile/</code> directory.<br/>"
                           "2. Click 'Log Planting', verify that current GPS coordinates are automatically fetched.<br/>"
                           "3. Disconnect network on the emulator, submit a record to verify offline queuing, then reconnect to observe auto-sync.", body_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceBefore=8, spaceAfter=12))

    # Member 5
    story.append(Paragraph("Member 5: K. H. M. Dewanga (23IT0467)", h2_style))
    story.append(Paragraph("<b>Assigned Responsibility:</b> Geo-Fenced Zero-Waste Surplus Marketplace (Phase 2), Haversine 5 km Proximity Radius Matching, Direct Buyer-Farmer Negotiation & 30-Minute Counter-Offer State Machine.", body_style))
    story.append(Paragraph("<b>Files Authored:</b> <code>backend/src/services/geofencingService.js</code>, <code>backend/src/services/marketplaceService.js</code>, <code>backend/src/controllers/marketplaceController.js</code>, <code>frontend/src/pages/MarketplaceSurplus.jsx</code>, <code>mobile/lib/features/marketplace/*</code>", code_style))
    story.append(Paragraph("<b>How Evaluators Can Test Member 5's Work:</b><br/>"
                           "1. Send a POST request to <code>/api/v1/marketplace/list</code> to publish a surplus crop batch.<br/>"
                           "2. Send a GET to <code>/api/v1/marketplace/search-nearby?lat=6.8258&lng=80.9982&radius_km=5</code> to verify listings within 5 km.<br/>"
                           "3. Place a buyer order to verify the 30-minute deadline negotiation timer.", body_style))
    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: EXHAUSTIVE FILE-BY-FILE AUDIT & CODE EXPLANATION
    # =========================================================================
    story.append(Paragraph("3. Exhaustive File-by-File Codebase Documentation", h1_style))
    story.append(Paragraph("This section documents every single file in the repository, explaining its purpose, dependencies, line logic, and required configuration.", body_style))

    file_catalog = [
        # Root configs
        ("docker-compose.yml", "Root Orchestration", "Spins up PostgreSQL 15, Node.js REST API, and React Web Admin simultaneously.", "Docker Engine", "POSTGRES_DB, PORT", "Docker compose service blocks defining container dependencies and volume mounts.", "docker-compose up --build"),
        (".github/workflows/ci.yml", "Continuous Integration", "GitHub Actions CI pipeline running linting, tests, and build checks on pull requests.", "GitHub Runners", "NODE_ENV=test", "Defines backend-checks and frontend-checks workflows.", "git push origin main"),
        ("setup-individual-repos.sh", "Multi-repo Initializer", "Shell script to split the monorepo into 3 standalone Git repositories (backend, frontend, mobile).", "Bash, Git", "None", "Iterates through subdirectories and runs git init -b main.", "./setup-individual-repos.sh"),
        
        # Backend Config & DB
        ("backend/src/server.js", "Backend Entry Point", "Starts the HTTP server on configured port and listens for requests.", "app.js, config.js", "PORT=5000", "Initializes app.listen and handles graceful SIGTERM termination.", "npm start"),
        ("backend/src/app.js", "Express App Setup", "Configures security middleware (helmet, cors), routes, and global error handling.", "express, routes", "None", "Mounts /api/v1 endpoints and global 404/error handlers.", "npm run dev"),
        ("backend/src/config/config.js", "Configuration Module", "Centralizes all environment variables (.env) with safe fallback defaults.", "dotenv", "DB_*, JWT_*, RISK_*", "Parses process.env into structured JS objects.", "node -e 'require(\"./src/config/config\")'"),
        ("backend/src/config/database.js", "PostgreSQL Pool", "Creates a reusable PostgreSQL connection pool using 'pg'.", "pg, config.js", "DB_HOST, DB_NAME", "Exports pool.query method with automatic error logging.", "node src/config/database.js"),
        ("backend/src/config/firebase.js", "Firebase Admin SDK", "Initializes Firebase Cloud Messaging (FCM) & Realtime Database with fallback.", "firebase-admin", "FIREBASE_PRIVATE_KEY", "Initializes admin SDK if credentials present, otherwise falls back.", "node src/config/firebase.js"),
        ("backend/src/database/schema.sql", "PostgreSQL DDL", "Defines 10 core tables: users, crops, planting_records, cropix_benchmarks, risk, etc.", "PostgreSQL 12+", "asvanna_db", "SQL DDL with UUID, foreign keys, and indexes.", "psql -d asvanna_db -f schema.sql"),
        ("backend/src/database/migrate.js", "Migration Runner", "Executes schema.sql to initialize or update PostgreSQL tables.", "fs, database.js", "DB credentials", "Reads schema.sql and sends raw SQL via pool.query.", "npm run migrate"),
        ("backend/src/database/seed.js", "Pilot Seed Script", "Seeds 8 master upcountry crops, demo users, and CROPIX demand benchmarks.", "bcryptjs, database.js", "DB credentials", "Hashes default passwords and populates master data.", "npm run seed"),
        
        # Backend Middlewares & Utils
        ("backend/src/middlewares/authMiddleware.js", "JWT & RBAC Middleware", "Validates Bearer token and checks user role permissions.", "jsonwebtoken, config.js", "JWT_SECRET", "authenticate() verifies token, authorizeRoles() checks user.role.", "curl with Authorization: Bearer <token>"),
        ("backend/src/middlewares/errorHandler.js", "Global Error Handler", "Catches all uncaught server exceptions and returns standard JSON response.", "apiResponse.js", "NODE_ENV", "Extracts err.statusCode, formats message, hides stack in production.", "Trigger 404/500 endpoint"),
        ("backend/src/middlewares/validationMiddleware.js", "Request Validator", "Validates input schemas using express-validator.", "express-validator", "None", "Extracts validation errors and returns 400 Bad Request if invalid.", "Send empty POST payload"),
        ("backend/src/utils/haversine.js", "Haversine Distance Calculator", "Calculates great-circle distance (km) between two GPS points.", "Math library", "None", "Applies trigonometric Haversine formula on lat/lon coordinates.", "node backend/test/test_all_endpoints.js"),
        ("backend/src/utils/apiResponse.js", "Standard API Formatter", "Formats standard JSON responses: { success, message, data, timestamp }.", "None", "None", "Static success() and error() helper functions.", "Imported in controllers"),
        
        # Backend Services
        ("backend/src/services/riskEngineService.js", "Predictive Risk Engine", "Calculates regional supply vs CROPIX demand and evaluates 3-tier risk.", "database.js, config.js", "RISK_SAFE_THRESHOLD", "Aggregates planted acres * avg yield / target demand.", "curl /api/v1/risk/crop/1"),
        ("backend/src/services/recommendationService.js", "Smart Crop Recommender", "Ranks alternative crops using 4-factor composite scoring formula.", "riskEngineService.js", "None", "Calculates market gap, soil, weather, price scores and sorts descending.", "curl /api/v1/recommendations"),
        ("backend/src/services/geofencingService.js", "Geofencing Engine", "Filters marketplace listings within 5 km - 20 km radius.", "haversine.js", "GEOFENCE_RADIUS", "Maps items with distanceKm and filters by radius limit.", "curl /api/v1/marketplace/search-nearby"),
        ("backend/src/services/notificationService.js", "Notification & SMS Service", "Sends FCM push notifications with SMS fallback for offline farmers.", "firebase.js, database.js", "SMS_GATEWAY_URL", "Sends multicast push via FCM and logs SMS fallback dispatch.", "Trigger broadcast warning"),
        ("backend/src/services/marketplaceService.js", "Realtime Sync Service", "Synchronizes active produce listings with Firebase Realtime Database.", "firebase.js", "FIREBASE_DATABASE_URL", "Updates /marketplace_listings ref in Firebase RTDB.", "Publish new surplus listing"),
        
        # Backend Controllers & Routes
        ("backend/src/controllers/authController.js", "Authentication Logic", "Handles User Registration, Login, Password Hashing, Profile, and FCM token update.", "bcryptjs, jwt", "JWT_SECRET", "Registers user, verifies bcrypt hash, issues signed JWT.", "POST /api/v1/auth/login"),
        ("backend/src/controllers/plantingController.js", "Planting Controller", "Logs GPS planting records (Farmer/Officer proxy) and triggers risk recalculation.", "database.js, riskEngine", "None", "Inserts planting_records and returns updated risk assessment.", "POST /api/v1/planting/log"),
        ("backend/src/controllers/riskEngineController.js", "Risk API Controller", "Exposes endpoints for individual crop risk and regional district summaries.", "riskEngineService.js", "None", "Calls RiskEngineService and sends formatted response.", "GET /api/v1/risk/regional-summary"),
        ("backend/src/controllers/recommendationController.js", "Recommendation API", "Exposes smart crop recommendation endpoint.", "recommendationService.js", "None", "Returns top 5 ranked alternative crops.", "GET /api/v1/recommendations"),
        ("backend/src/controllers/marketplaceController.js", "Marketplace Controller", "Handles surplus listing creation, proximity search, and direct order offers.", "geofencingService.js", "None", "Manages listings, geofiltering, and order response deadlines.", "POST /api/v1/marketplace/list"),
        ("backend/src/controllers/officerController.js", "Officer Admin Controller", "Manages farmer directory and proxy registrations.", "database.js, bcryptjs", "None", "Queries farmers list and creates proxy farmer accounts.", "GET /api/v1/officer/farmers"),
        ("backend/src/controllers/broadcastController.js", "Broadcast Controller", "Creates officer warning announcements and triggers multi-channel alerts.", "notificationService.js", "None", "Inserts broadcast_warnings and notifies farmers.", "POST /api/v1/broadcasts"),
        
        # Frontend Web Admin
        ("frontend/src/App.jsx", "React Router & Root", "Main router configuring protected routes and layout hierarchy.", "react-router-dom, contexts", "None", "Conditionally renders Sidebar/Navbar or Login based on auth state.", "npm run dev"),
        ("frontend/src/context/AuthContext.jsx", "Auth State Provider", "Stores user token and profile state across the React app.", "services/api.js", "asvanna_token", "Provides user, login, logout, and token methods.", "Login / Logout actions"),
        ("frontend/src/context/LanguageContext.jsx", "Language State Provider", "Provides trilingual switching across EN, SI, and TA.", "locales/*.json", "asvanna_lang", "Provides t(key) translation function.", "Switch language in navbar"),
        ("frontend/src/pages/Dashboard.jsx", "Main Officer Dashboard", "Shows KPI summary cards, crop saturation progress bars, and quick modals.", "StatCard, Modals", "None", "Fetches /risk/regional-summary and displays stats.", "View http://localhost:3000"),
        ("frontend/src/pages/RegionalMonitoring.jsx", "Cultivation Map Page", "Displays GPS planting plots across Bandarawela sub-divisions.", "services/api.js", "None", "Renders interactive grid and filterable plots list.", "View /monitoring"),
        ("frontend/src/pages/RiskAnalytics.jsx", "Deep Risk Analytics", "Visualizes saturation thresholds and recommended crop alternatives.", "services/api.js", "None", "Renders risk cards and 4-factor composite scores.", "View /risk-analytics"),
        ("frontend/src/pages/FarmerDirectory.jsx", "Farmer Directory Page", "Searchable list of registered farmers (smartphone & proxy profiles).", "services/api.js", "None", "Filters farmers by name, phone, or NIC.", "View /farmers"),
        ("frontend/src/pages/Broadcasts.jsx", "Broadcast Warnings Page", "Displays warning history and lets officers dispatch new alerts.", "BroadcastModal.jsx", "None", "Fetches /broadcasts and displays severity tags.", "View /broadcasts"),
        ("frontend/src/pages/MarketplaceSurplus.jsx", "Surplus Marketplace View", "Displays active 5 km surplus produce batches for local trade.", "None", "None", "Lists available surplus produce cards with direct buy CTA.", "View /marketplace"),
        
        # Mobile Flutter App
        ("mobile/lib/main.dart", "Flutter Entry Point", "Initializes Flutter engine, localization delegates, and sets initial route.", "flutter_localizations", "None", "Sets up MaterialApp, ThemeData, and FarmerHomeScreen.", "flutter run"),
        ("mobile/lib/core/constants/app_colors.dart", "Mobile Theme Colors", "Centralizes agricultural emerald greens and risk color codes.", "flutter/material.dart", "None", "Defines primary, accent, riskSafe, riskWarning, riskOverPlanted.", "Referenced across UI"),
        ("mobile/lib/core/services/location_service.dart", "GPS Location Service", "Fetches device current GPS latitude/longitude using Geolocator.", "geolocator", "GPS Permission", "Queries Geolocator.getCurrentPosition() with Bandarawela fallback.", "Test on GPS device"),
        ("mobile/lib/core/services/offline_storage_service.dart", "Offline Queue Service", "Stores offline planting records locally in SharedPreferences.", "shared_preferences", "None", "Saves JSON string queue and provides clear/sync methods.", "Test in Airplane mode"),
        ("mobile/lib/features/home/farmer_home_screen.dart", "Farmer Home Screen", "Main mobile UI showing weather, over-planting alerts, and active plantings.", "planting, recs, market", "None", "Bottom navigation tabs for Home, Recommendations, and Marketplace.", "View on mobile emulator"),
        ("mobile/lib/features/planting/log_planting_screen.dart", "Planting Log Screen", "Farmer data entry form with auto GPS location tag and crop selection.", "location_service.dart", "None", "Submits planting payload to API or offline queue.", "Tap 'Log Planting' button"),
        ("mobile/lib/features/recommendations/smart_crop_recommendation_screen.dart", "Smart Recs Mobile View", "Displays ranked alternative crops with market gap and suitability score.", "constants/app_colors.dart", "None", "Renders recommendation cards with Sinhala rationale.", "Tap 'Recommendations' tab"),
        ("mobile/lib/features/marketplace/marketplace_feed_screen.dart", "Marketplace Feed Screen", "Lists surplus produce within 5 km radius for buyers and farmers.", "list_surplus_screen.dart", "None", "Displays produce listings with asking price and distance.", "Tap 'Marketplace' tab"),
    ]

    for item in file_catalog:
        f_path, f_title, f_desc, f_deps, f_config, f_logic, f_test = item
        
        story.append(Paragraph(f"📄 <code>{f_path}</code> — {f_title}", h3_style))
        file_table_data = [
            [Paragraph("<b>Primary Purpose:</b>", body_bold), Paragraph(f_desc, body_style)],
            [Paragraph("<b>Connected Files / Dependencies:</b>", body_bold), Paragraph(f"<code>{f_deps}</code>", code_style)],
            [Paragraph("<b>Required Configurations (.env):</b>", body_bold), Paragraph(f"<code>{f_config}</code>", code_style)],
            [Paragraph("<b>Code Logic Breakdown:</b>", body_bold), Paragraph(f_logic, body_style)],
            [Paragraph("<b>Verification / Test Command:</b>", body_bold), Paragraph(f"<code>{f_test}</code>", code_style)],
        ]
        t_file = Table(file_table_data, colWidths=[140, 340])
        t_file.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('BACKGROUND', (0,0), (0,-1), c_light_bg),
            ('PADDING', (0,0), (-1,-1), 4),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(t_file)
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: FULL SYSTEM TESTING & EVALUATION MANUAL
    # =========================================================================
    story.append(Paragraph("4. Comprehensive Testing & Verification Manual", h1_style))
    story.append(Paragraph("Step-by-step instructions to test and verify every tier of the ASVANNA platform:", body_style))

    test_steps = [
        ("Step 1: Automated Unit & Math Verification", "node backend/test/test_all_endpoints.js", "Executes 4 automated unit tests verifying Haversine calculations, 3-tier risk logic, and composite recommendation weight sums."),
        ("Step 2: Database Migration & Seeding", "cd backend && npm run migrate && npm run seed", "Initializes PostgreSQL schema (10 tables) and inserts 8 upcountry crops, 5 demo accounts, and monthly CROPIX demand quotas."),
        ("Step 3: Backend REST API Launch", "cd backend && npm run dev", "Starts server on http://localhost:5000. Verify health endpoint at http://localhost:5000/health."),
        ("Step 4: Web Admin Portal Launch", "cd frontend && npm run dev", "Starts React dashboard on http://localhost:3000. Login with Officer credentials (0771234567 / asvanna123)."),
        ("Step 5: Mobile App Launch", "cd mobile && flutter pub get && flutter run", "Launches the mobile app on an Android emulator or device for Farmer data logging and Surplus marketplace browsing."),
        ("Step 6: Docker Compose Launch", "docker-compose up --build -d", "Spins up the full multi-tier ecosystem (PostgreSQL, Backend API, Web Admin) in isolated Docker containers."),
    ]

    for step_title, step_cmd, step_desc in test_steps:
        story.append(Paragraph(f"<b>{step_title}</b>", h3_style))
        story.append(Paragraph(f"Command: <code>{step_cmd}</code>", code_style))
        story.append(Paragraph(f"Description: {step_desc}", body_style))
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=10, spaceAfter=15))
    story.append(Paragraph("<b>End of Master System Documentation</b> — Prepared for ITUM University of Moratuwa National Diploma in IT Final Year Evaluation 2026.", ParagraphStyle('FooterNote', parent=body_style, alignment=1, fontName='Helvetica-Oblique', textColor=colors.HexColor("#64748B"))))

    # Build Document with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"✅ PDF System Manual generated successfully at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
