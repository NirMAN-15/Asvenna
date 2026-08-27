import os
import sys
import subprocess
import shutil

def generate_manual():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(base_dir, "master_manual.html")
    pdf_path = os.path.join(base_dir, "ASVANNA_COMPLETE_SYSTEM_MANUAL.pdf")

    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ASVANNA — Master System Manual & Technical Documentation</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Sinhala:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page {
    size: A4;
    margin: 18mm 14mm 18mm 14mm;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', 'Noto Sans Sinhala', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 9pt;
    line-height: 1.5;
    color: #1E293B;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cover-page {
    page-break-after: always;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 20px;
  }

  .cover-badge {
    display: inline-block;
    background: #E6F4EA;
    color: #0D652D;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 8.5pt;
    padding: 4px 14px;
    border-radius: 20px;
    border: 1px solid #A8DAB5;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cover-title {
    font-family: 'Outfit', 'Noto Sans Sinhala', sans-serif;
    font-size: 26pt;
    font-weight: 800;
    color: #0D5C3A;
    margin: 0 0 6px 0;
    letter-spacing: -0.5px;
  }

  .cover-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 11pt;
    color: #475569;
    margin: 0 0 16px 0;
    line-height: 1.4;
    font-weight: 500;
  }

  .hr-brand {
    border: none;
    border-top: 3px solid #0D5C3A;
    margin: 14px 0 18px 0;
  }

  .meta-table, .team-table, .content-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 14px;
    page-break-inside: avoid;
  }

  .meta-table th, .meta-table td,
  .team-table th, .team-table td,
  .content-table th, .content-table td {
    border: 1px solid #CBD5E1;
    padding: 6px 10px;
    text-align: left;
    vertical-align: top;
    font-size: 8.5pt;
  }

  .meta-table th, .team-table th, .content-table th {
    background-color: #0D5C3A;
    color: #FFFFFF;
    font-weight: 700;
    font-family: 'Outfit', 'Noto Sans Sinhala', sans-serif;
  }

  .meta-table td:first-child {
    background-color: #F8FAFC;
    font-weight: 700;
    width: 26%;
    color: #0F172A;
  }

  .team-table tr:nth-child(even), .content-table tr:nth-child(even) {
    background-color: #F8FAFC;
  }

  h1 {
    font-family: 'Outfit', 'Noto Sans Sinhala', sans-serif;
    font-size: 14pt;
    font-weight: 700;
    color: #0D5C3A;
    border-bottom: 2px solid #059669;
    padding-bottom: 4px;
    margin-top: 20px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }

  h2 {
    font-family: 'Outfit', 'Noto Sans Sinhala', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    color: #047857;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 9.5pt;
    font-weight: 700;
    color: #0F172A;
    margin-top: 10px;
    margin-bottom: 4px;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 7px 0;
    text-align: justify;
  }

  .sinhala-block {
    font-family: 'Noto Sans Sinhala', sans-serif;
    background-color: #F0FDF4;
    border-left: 4px solid #059669;
    padding: 8px 12px;
    margin: 8px 0 12px 0;
    border-radius: 0 6px 6px 0;
    font-size: 8.5pt;
    color: #064E3B;
    line-height: 1.6;
  }

  .sinhala-heading {
    font-family: 'Noto Sans Sinhala', sans-serif;
    font-weight: 700;
    color: #065F46;
  }

  .callout-box {
    background-color: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-left: 4px solid #0284C7;
    padding: 8px 12px;
    margin: 8px 0 12px 0;
    border-radius: 0 6px 6px 0;
    font-size: 8.5pt;
  }

  .diagram-box {
    background-color: #F8FAFC;
    border: 1px solid #94A3B8;
    border-radius: 6px;
    margin: 10px 0 14px 0;
    overflow: hidden;
    page-break-inside: avoid;
  }

  .diagram-header {
    background-color: #E2E8F0;
    padding: 4px 10px;
    font-weight: 700;
    font-size: 8.5pt;
    color: #1E293B;
    border-bottom: 1px solid #CBD5E1;
  }

  pre {
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 7.2pt;
    line-height: 1.25;
    margin: 0;
    padding: 8px 10px;
    color: #0F172A;
    white-space: pre;
    overflow-x: auto;
  }

  code {
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 7.8pt;
    background-color: #F1F5F9;
    padding: 1px 4px;
    border-radius: 3px;
    color: #0F172A;
    border: 1px solid #E2E8F0;
  }

  .badge-safe {
    background-color: #D1FAE5;
    color: #065F46;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 7.5pt;
  }

  .badge-warning {
    background-color: #FEF3C7;
    color: #92400E;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 7.5pt;
  }

  .badge-danger {
    background-color: #FEE2E2;
    color: #991B1B;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 7.5pt;
  }

  .page-break {
    page-break-after: always;
  }
</style>
</head>
<body>

<!-- ========================================================================= -->
<!-- COVER PAGE                                                                -->
<!-- ========================================================================= -->
<div class="cover-page">
  <div class="cover-badge">Academic Project System Manual &bull; ITUM 2026</div>
  <div class="cover-title">🌾 ASVANNA (අස්වැන්න)</div>
  <div class="cover-subtitle">
    <b>The Zero-Waste Marketplace: Guided by Real-Time Data from Seed to Harvest Distribution</b><br>
    Master Technical Architecture, Multi-Role Security, Sinhala Stakeholder Manual & QA Playbook
  </div>
  
  <hr class="hr-brand">

  <table class="meta-table">
    <tr>
      <td>Academic Institution:</td>
      <td>Division of Information Technology, Institute of Technology, University of Moratuwa (ITUM)</td>
    </tr>
    <tr>
      <td>Academic Program:</td>
      <td>National Diploma in Information Technology (NDIT) — Final Year Project (2025 / 2026)</td>
    </tr>
    <tr>
      <td>Project Supervisor:</td>
      <td>Mrs. Uthpala Athukorala (Senior Lecturer, Division of Information Technology, ITUM)</td>
    </tr>
    <tr>
      <td>Target Pilot Region:</td>
      <td>Bandarawela Agrarian Services Division, Badulla District, Sri Lanka</td>
    </tr>
    <tr>
      <td>Focus Crops:</td>
      <td>Upcountry Perishable Vegetables (Leeks, Cabbage, Carrot, Beetroot, Knol Khol, Radish, Potato, Bell Pepper)</td>
    </tr>
    <tr>
      <td>Ecosystem Components:</td>
      <td>Express.js REST API &bull; Multi-Role Web Portal (React 18) &bull; Flutter Mobile App &bull; Dual Database Engine</td>
    </tr>
  </table>

  <h3 style="text-align: left; margin-bottom: 6px;">👥 Group 15 — Team Members & Assigned Modules</h3>
  <table class="team-table">
    <thead>
      <tr>
        <th style="width: 6%;">#</th>
        <th style="width: 25%;">Student Name</th>
        <th style="width: 15%;">Student ID</th>
        <th>Assigned Engineering Subsystem & Responsibility</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td><b>W. N. A. Wedikkara</b></td>
        <td><code>23IT0544</code></td>
        <td>Lead Architect, PostgreSQL 15 Relational Schema, Auth (JWT/RBAC), Mathematical Predictive Risk Engine</td>
      </tr>
      <tr>
        <td>2</td>
        <td><b>R. R. L. Geeganage (Ravindi)</b></td>
        <td><code>23IT0476</code></td>
        <td>Smart Crop Recommendation Engine, 4-Factor Weighted Agro-Suitability Scorer</td>
      </tr>
      <tr>
        <td>3</td>
        <td><b>G. W. T. Jayampathi</b></td>
        <td><code>23IT0487</code></td>
        <td>Multi-Role Web Portal, Separate 3-Role Authentication, Highland Fresh UI System, Proxy Data Entry & Broadcasts</td>
      </tr>
      <tr>
        <td>4</td>
        <td><b>K. A. H. I. Lakshitha (Imal)</b></td>
        <td><code>23IT0503</code></td>
        <td>Farmer & Buyer Mobile Application (Flutter 3.x), GPS Plot Logger, Offline Storage Queue & Auto-Sync</td>
      </tr>
      <tr>
        <td>5</td>
        <td><b>K. H. M. Dewanga</b></td>
        <td><code>23IT0467</code></td>
        <td>Phase 2 Geo-Fenced 5 km Surplus Marketplace, Haversine Distance Engine & Negotiation State Machine</td>
      </tr>
    </tbody>
  </table>

  <div class="callout-box" style="text-align: left; margin-top: 10px;">
    <b>ℹ️ Manual Scope:</b> This document provides technical and non-technical explanations for academic evaluators, agricultural officers, and farming communities. All Sinhala text is rendered using authentic <b>Noto Sans Sinhala</b> typography.
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 1: PLAIN-LANGUAGE STAKEHOLDER GUIDE                               -->
<!-- ========================================================================= -->
<h1>1. Plain-Language Agricultural Guide (ගොවි මහතුන් සහ නිලධාරීන් සඳහා සරල සිංහල මඟපෙන්වීම)</h1>

<p>
In Sri Lanka's central hill country (Bandarawela, Welimada, Nuwara Eliya), farming families lose an estimated <b>30% to 40% of their annual crop yield</b> (equivalent to over Rs. 180 Billion in national waste). The root cause is <b>"Trend Planting" (වගා රැල්ල)</b>. When leeks or cabbage reach temporary high prices at Dambulla or Manning Market, hundreds of farmers simultaneously cultivate that single crop. Months later, thousands of metric tons reach maturity in the exact same week, causing severe market gluts, transport losses, and catastrophic price collapse (e.g. dropping from Rs. 350/kg to Rs. 20/kg).
</p>

<div class="sinhala-block">
  <span class="sinhala-heading">🇱🇰 සිංහල පැහැදිලි කිරීම (Sinhala Stakeholder Explanation):</span><br>
  ගොවි මහත්වරු වෙළඳපොළේ අද පවතින ඉහළ මිල දැක සියලු දෙනා එකවර එකම බෝගය (උදා: ලීක්ස්, ගෝවා) වගා කිරීම නිසා මාස 3කට පසු සියලු අස්වැන්න එකවර වෙළඳපොළට පැමිණ මිල රුපියල් 20-30 දක්වා කඩා වැටේ. මෙය <b>"වගා රැල්ල"</b> ලෙස හඳුන්වයි. <b>ASVANNA (අස්වැන්න)</b> පද්ධතිය මඟින් මෙම ගැටළුව ප්‍රධාන අදියර 2කින් විසඳනු ලබයි:
</div>

<table class="content-table">
  <thead>
    <tr>
      <th style="width: 25%;">අදියර / විශේෂාංගය</th>
      <th style="width: 45%;">සිංහල පැහැදිලි කිරීම (Sinhala Explanation)</th>
      <th style="width: 30%;">Singlish Guide (Easy Read)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>1. වගා රැල්ල වැළැක්වීම<br>(Predictive Risk Radar)</b></td>
      <td>ගොවියා බීජ සිටුවීමට පෙර තම ප්‍රදේශයේ (බණ්ඩාරවෙල) දැනටමත් එම බෝගය කොපමණ වගා කර ඇත්දැයි පරීක්ෂා කරයි. වගාව 85% ඉක්මවා ඇත්නම් රතු අනතුරු ඇඟවීමක් ලැබේ.</td>
      <td>Bija danna kalin app eken balanawa thaman wawanawa wage anith ayath eka boga wawanawada kiyala. 85% ta wadi nam Over-Planted kiyala warning enawa.</td>
    </tr>
    <tr>
      <td><b>2. විකල්ප බෝග නිර්දේශය<br>(Smart Alternatives)</b></td>
      <td>ප්‍රධාන බෝගය අධික ලෙස වගා කර ඇත්නම්, වෙළඳපොළ හිඟය, පස, කාලගුණය සහ මිල ස්ථාවරත්වය මත පදනම්ව වැඩි ලාභයක් ලබාගත හැකි වෙනත් බෝග (බීට්රූට්, කැරට්, රාබු) නිර්දේශ කරයි.</td>
      <td>Pradhana bogaya over-planted nam, wadi laba ganna puluwan wena boga (Beetroot, Radish) 4-factor scoring eken rank karala farmer ta pennanawa.</td>
    </tr>
    <tr>
      <td><b>3. සෘජු අතිරික්ත වෙළඳපොළ<br>(5km Geo-Fenced Marketplace)</b></td>
      <td>අතිරික්ත අස්වැන්න අතරමැදියන් රහිතව කිලෝමීටර් 5ක් ඇතුළත හෝටල්, අවන්හල් සහ තොග ගැනුම්කරුවන්ට සෘජුව අලෙවි කිරීමට සහ මිල සාකච්ඡා කිරීමට ඉඩ සලසයි.</td>
      <td>Ithuru aswanna 5km athule thiyena hotel/buyerslata direct wikunala transport cost ithuru karagena direct chat eken mila thiranaya karaganna puluwan.</td>
    </tr>
    <tr>
      <td><b>4. ස්මාර්ට්ෆෝන් නැති ගොවීන්<br>(Proxy Data Entry)</b></td>
      <td>ස්මාර්ට් දුරකථන නොමැති ග්‍රාමීය ගොවි මහතුන් වෙනුවෙන් ගොවිජන සේවා නිලධාරියා (DO Officer) විසින් වෙබ් පද්ධතිය හරහා වගා තොරතුරු ඇතුළත් කරයි.</td>
      <td>Smart phone nathi govinta Divisional Agrarian Officer portal eken data enter karala 100% regional map eka update karanawa.</td>
    </tr>
  </tbody>
</table>

<!-- ========================================================================= -->
<!-- SECTION 2: MULTI-USER ROLE ISOLATION                                      -->
<!-- ========================================================================= -->
<h1>2. Multi-User Architecture & Role Isolation (පරිශීලක භූමිකා 3 වෙන්කිරීම)</h1>

<p>
The ASVANNA web portal provides dedicated, isolated authentication gateways and workspaces for all three user personas. Each user accesses only features appropriate to their operational role:
</p>

<table class="content-table">
  <thead>
    <tr>
      <th style="width: 25%;">User Persona</th>
      <th style="width: 35%;">Authentication URL & Form Fields</th>
      <th>Dedicated Dashboard Capabilities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🏛️ <b>Divisional Agrarian Officer (DO)</b></td>
      <td><b>URL:</b> <code>/auth/officer</code><br><b>Fields:</b> Full Name, NIC, Phone, Employee ID, District, Division, Password</td>
      <td>
        &bull; Regional Cultivation GIS Heatmap (Bandarawela, Welimada, Haputale)<br>
        &bull; CROPIX Saturation Matrix & Over-Planting Gauge Radar<br>
        &bull; Smallholder Farmer Directory & 1-Click Proxy Data Logging<br>
        &bull; Multi-Channel Emergency Warning Broadcasts (Push + SMS)
      </td>
    </tr>
    <tr>
      <td>👨‍🌾 <b>Upcountry Smallholder Farmer</b></td>
      <td><b>URL:</b> <code>/auth/farmer</code><br><b>Fields:</b> Full Name, NIC, Phone, District, Division, GND Division, Land Size (Acres), Password</td>
      <td>
        &bull; Personal Land Acreage & Active Cultivation Tracker<br>
        &bull; Live Over-Planting Warning Popups (>85% Quota Alert)<br>
        &bull; 4-Factor Smart Alternative Crop Suggestions<br>
        &bull; Surplus Produce Seller Listing for 5 km Zero-Waste Marketplace
      </td>
    </tr>
    <tr>
      <td>🛒 <b>Local Commercial Buyer</b></td>
      <td><b>URL:</b> <code>/auth/buyer</code><br><b>Fields:</b> Business Name, Contact Person, Phone, NIC, Business Type (Wholesale/Retail/Hotel), District, Password</td>
      <td>
        &bull; 5 km Geo-Fenced Surplus Produce Proximity Search Slider<br>
        &bull; Direct Procurement Order Placement with 30-Min Response Window<br>
        &bull; Real-Time Buyer-Farmer Price Negotiation Chat Drawer<br>
        &bull; Order History & Delivery Logistics Tracking
      </td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 3: SYSTEM ARCHITECTURE & DIAGRAMS                                 -->
<!-- ========================================================================= -->
<h1>3. System Architecture & Computational Flow Diagrams</h1>

<p>
The ASVANNA platform is engineered with a high-performance multi-tier architecture, combining RESTful microservices, geospatial filtering, and dual-database persistence:
</p>

<div class="diagram-box">
  <div class="diagram-header">📊 Multi-Tier System Architecture Diagram</div>
  <pre>
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
  </pre>
</div>

<div class="diagram-box">
  <div class="diagram-header">📊 Predictive Risk Engine Decision Flowchart</div>
  <pre>
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
  <span class="badge-safe">SAFE (Green)</span>             Is Ratio > 85%?
                           |             |
                         YES             NO
                          |               |
                          v               v
                <span class="badge-danger">OVER-PLANTED (Red)</span>   <span class="badge-warning">WARNING (Amber)</span>
                          |
                          v
         * Trigger Push & SMS Warning Broadcast
         * Activate Smart Crop Recommendations (Beetroot, Carrot, Radish)
  </pre>
</div>

<!-- ========================================================================= -->
<!-- SECTION 4: 5 MEMBERS' ALLOCATIONS & TECHNICAL DETAILS                     -->
<!-- ========================================================================= -->
<h1>4. Group 15 — 5 Team Members' Technical Deep Dives</h1>

<h2>Member 1: W. N. A. Wedikkara (23IT0544)</h2>
<p><b>Assigned Subsystem:</b> Architecture, PostgreSQL 15 Schema, Dual-DB Engine, JWT Role Access Control & Predictive Risk Engine.</p>
<p>
&bull; Engineered <code>backend/src/database/schema.sql</code> defining 10 normalized relational tables.<br>
&bull; Built <code>backend/src/config/database.js</code> implementing zero-config persistent JSON storage with PostgreSQL pool failover.<br>
&bull; Implemented <code>backend/src/middlewares/authMiddleware.js</code> and <code>backend/src/controllers/authController.js</code> supporting role registration (<code>OFFICER</code>, <code>FARMER</code>, <code>BUYER</code>) with bcrypt hashing.<br>
&bull; Developed <code>backend/src/services/riskEngineService.js</code> calculating live saturation ratios.
</p>
<p><b>Mathematical Formula:</b> <code>Risk % = (SUM(Planted_Acres * Avg_Yield_Per_Acre) / CROPIX_Demand) * 100</code></p>
<p><b>Verification:</b> <code>cd backend && npm run migrate && npm run seed && curl -X GET http://localhost:5000/api/v1/risk/regional-summary?district=Badulla</code></p>
<hr style="border: none; border-top: 1px solid #CBD5E1; margin: 8px 0;">

<h2>Member 2: R. R. L. Geeganage (Ravindi - 23IT0476)</h2>
<p><b>Assigned Subsystem:</b> Smart Crop Recommendation Engine & Multi-Factor Agro-Suitability Matrix.</p>
<p>
&bull; Developed <code>backend/src/services/recommendationService.js</code> and <code>backend/src/controllers/recommendationController.js</code>.<br>
&bull; Evaluates 4 weighted factors when regional saturation exceeds 85%:<br>
&nbsp;&nbsp;1. <b>Market Gap Score (35% Weight)</b> — High regional demand deficit from CROPIX.<br>
&nbsp;&nbsp;2. <b>Soil Suitability Score (25% Weight)</b> — Bandarawela sandy/loam soil compatibility.<br>
&nbsp;&nbsp;3. <b>Weather & Temperature Suitability (20% Weight)</b> — Upcountry 14°C–22°C temperature band.<br>
&nbsp;&nbsp;4. <b>Historical Price Trend (20% Weight)</b> — Profit margin stability over 3 months.
</p>
<p><b>Formula:</b> <code>Composite = (0.35 * MarketGap) + (0.25 * Soil) + (0.20 * Weather) + (0.20 * Price)</code></p>
<p><b>Verification:</b> <code>curl -X GET "http://localhost:5000/api/v1/recommendations?district=Badulla&cropId=1"</code></p>
<hr style="border: none; border-top: 1px solid #CBD5E1; margin: 8px 0;">

<h2>Member 3: G. W. T. Jayampathi (23IT0487)</h2>
<p><b>Assigned Subsystem:</b> Multi-User Web Portal, Separate 3-Role Authentication, Highland Fresh UI System, Proxy Logging & Broadcasts.</p>
<p>
&bull; Developed React.js multi-role portal (<code>LandingPage.jsx</code>, <code>Dashboard.jsx</code>, <code>RegionalMonitoring.jsx</code>, <code>FarmerDirectory.jsx</code>).<br>
&bull; Built dedicated authentication portals for each user type with role-specific registration fields (<code>OfficerAuth.jsx</code>, <code>FarmerAuth.jsx</code>, <code>BuyerAuth.jsx</code>) and route security (<code>ProtectedRoute.jsx</code>).<br>
&bull; Created the "Highland Fresh" UI design system in <code>frontend/src/index.css</code> with solid card surfaces, high contrast, clean typography, and role accents.<br>
&bull; Built <code>ProxyDataModal.jsx</code> for proxy data logging for offline farmers.<br>
&bull; Implemented <code>BroadcastModal.jsx</code> for dispatching emergency saturation warnings (Push + SMS).
</p>
<p><b>Verification:</b> Open <code>http://localhost:3000</code>, choose any user card on the Landing Page, register or login with <code>asvanna123</code>, and verify role-isolated navigation.</p>
<hr style="border: none; border-top: 1px solid #CBD5E1; margin: 8px 0;">

<h2>Member 4: K. A. H. I. Lakshitha (Imal - 23IT0503)</h2>
<p><b>Assigned Subsystem:</b> Cross-Platform Flutter Mobile Application, Automatic GPS Field Logger & Offline Storage Queue.</p>
<p>
&bull; Engineered Flutter mobile client (<code>mobile/lib/main.dart</code>, <code>farmer_home_screen.dart</code>, <code>log_planting_screen.dart</code>).<br>
&bull; Developed <code>location_service.dart</code> integrating Geolocator for auto GPS coordinate capture during plot registration.<br>
&bull; Implemented <code>offline_storage_service.dart</code> caching pending submissions locally in SharedPreferences when rural network drops, auto-syncing upon reconnection.<br>
&bull; Built ARB localization in <code>mobile/lib/l10n/</code> supporting Sinhala, Tamil, and English.
</p>
<p><b>Verification:</b> Run <code>cd mobile && flutter run</code>, open planting form, toggle Airplane mode, and verify offline queue persistence.</p>
<hr style="border: none; border-top: 1px solid #CBD5E1; margin: 8px 0;">

<h2>Member 5: K. H. M. Dewanga (23IT0467)</h2>
<p><b>Assigned Subsystem:</b> Phase 2 Geo-Fenced Zero-Waste Surplus Marketplace, 5 km Proximity Radius Matching & Real-Time Negotiation Chat.</p>
<p>
&bull; Developed <code>haversine.js</code> and <code>geofencingService.js</code> calculating great-circle distances between surplus plots and local buyers.<br>
&bull; Developed <code>realtimeStore.js</code> maintaining in-memory message logs and order state machines.<br>
&bull; Engineered <code>marketplaceController.js</code> enforcing a 30-minute response window for price negotiations.<br>
&bull; Created marketplace interfaces in <code>MarketplaceSurplus.jsx</code> and <code>mobile/lib/features/marketplace/</code>.
</p>
<p><b>Verification:</b> Query <code>GET /api/v1/marketplace/search-nearby?lat=6.8258&lng=80.9982&radius_km=5</code>.</p>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 5: COMPREHENSIVE FILE DIRECTORY                                   -->
<!-- ========================================================================= -->
<h1>5. Comprehensive File-by-File Codebase Directory</h1>

<table class="content-table">
  <thead>
    <tr>
      <th style="width: 28%;">File Path & Title</th>
      <th style="width: 42%;">Purpose & Architectural Responsibility</th>
      <th style="width: 30%;">Dependencies & Verification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>backend/src/server.js</code><br><b>Server Entry Point</b></td>
      <td>Bootstraps Express HTTP server on PORT 5000, initializes database connections, and handles graceful SIGTERM shutdown.</td>
      <td><code>app.js, config.js</code><br><code>node src/server.js</code></td>
    </tr>
    <tr>
      <td><code>backend/src/config/database.js</code><br><b>Database Engine</b></td>
      <td>Dual database engine providing PostgreSQL connection pool with zero-config embedded file DB fallback (<code>asvanna_db.json</code>).</td>
      <td><code>pg, config.js</code><br><code>npm run migrate</code></td>
    </tr>
    <tr>
      <td><code>backend/src/controllers/authController.js</code><br><b>Auth Controller</b></td>
      <td>Handles role-based registration (OFFICER, FARMER, BUYER), login, bcrypt password hashing, and signed JWT sessions.</td>
      <td><code>bcryptjs, jsonwebtoken</code><br><code>POST /api/v1/auth/register</code></td>
    </tr>
    <tr>
      <td><code>backend/src/services/riskEngineService.js</code><br><b>Predictive Risk Engine</b></td>
      <td>Calculates regional supply density, compares against CROPIX demand, and evaluates 3-tier risk (Safe, Warning, Over-Planted).</td>
      <td><code>database.js, config.js</code><br><code>GET /api/v1/risk/crop/1</code></td>
    </tr>
    <tr>
      <td><code>backend/src/services/recommendationService.js</code><br><b>Smart Recommender</b></td>
      <td>Computes 4-factor composite recommendation scores (Market Gap, Soil, Weather, Price) for profitable alternatives.</td>
      <td><code>riskEngineService.js</code><br><code>GET /api/v1/recommendations</code></td>
    </tr>
    <tr>
      <td><code>backend/src/services/geofencingService.js</code><br><b>Geofencing Filter</b></td>
      <td>Filters and sorts marketplace produce listings within a 5 km to 20 km geographic radius using Haversine trigonometry.</td>
      <td><code>haversine.js</code><br><code>GET /marketplace/search-nearby</code></td>
    </tr>
    <tr>
      <td><code>frontend/src/pages/LandingPage.jsx</code><br><b>Landing Gateway</b></td>
      <td>Public portal gateway presenting 3 large user selection cards (Officer, Farmer, Buyer) for registration and sign in.</td>
      <td><code>react-router-dom, lucide-react</code><br><code>View http://localhost:3000</code></td>
    </tr>
    <tr>
      <td><code>frontend/src/pages/auth/OfficerAuth.jsx</code><br><b>Officer Auth Portal</b></td>
      <td>Dedicated authentication and registration view for Divisional Agrarian Officers with Employee ID validation.</td>
      <td><code>AuthContext.jsx</code><br><code>View /auth/officer</code></td>
    </tr>
    <tr>
      <td><code>frontend/src/pages/auth/FarmerAuth.jsx</code><br><b>Farmer Auth Portal</b></td>
      <td>Dedicated authentication and registration view for Upcountry Smallholder Farmers with land acreage capture.</td>
      <td><code>AuthContext.jsx</code><br><code>View /auth/farmer</code></td>
    </tr>
    <tr>
      <td><code>frontend/src/pages/auth/BuyerAuth.jsx</code><br><b>Buyer Auth Portal</b></td>
      <td>Dedicated authentication and registration view for Commercial Buyers with business category selection.</td>
      <td><code>AuthContext.jsx</code><br><code>View /auth/buyer</code></td>
    </tr>
    <tr>
      <td><code>frontend/src/components/ProtectedRoute.jsx</code><br><b>Role Route Guard</b></td>
      <td>Guards application routes against unauthenticated and unauthorized role access.</td>
      <td><code>AuthContext.jsx</code><br><code>Direct URL navigation</code></td>
    </tr>
    <tr>
      <td><code>frontend/src/index.css</code><br><b>Highland Fresh Design</b></td>
      <td>Clean, crisp UI design system with solid card surfaces, high contrast typography, and role-colored visual accents.</td>
      <td><code>Tailwind CSS</code><br><code>Global styling</code></td>
    </tr>
    <tr>
      <td><code>frontend/src/pages/Dashboard.jsx</code><br><b>Multi-Role Dashboard</b></td>
      <td>Displays role-tailored KPI cards, crop saturation progress bars, land acreages, and quick action modals.</td>
      <td><code>StatCard, Modals</code><br><code>View /dashboard</code></td>
    </tr>
    <tr>
      <td><code>frontend/src/pages/MarketplaceSurplus.jsx</code><br><b>Zero-Waste Marketplace</b></td>
      <td>Displays active 5 km surplus produce batches for local trade and real-time negotiation chat drawer.</td>
      <td><code>api.js, realtimeStore</code><br><code>View /marketplace</code></td>
    </tr>
    <tr>
      <td><code>docker-compose.yml</code><br><b>Docker Orchestration</b></td>
      <td>Single-command deployment for PostgreSQL 15, Node.js API server, and React Multi-Role dashboard.</td>
      <td><code>Docker Engine</code><br><code>docker compose up --build -d</code></td>
    </tr>
  </tbody>
</table>

<!-- ========================================================================= -->
<!-- SECTION 6: MASTER QA VERIFICATION PLAYBOOK                                -->
<!-- ========================================================================= -->
<h1>6. Master Testing & QA Verification Playbook</h1>

<p>
Follow this sequential playbook to test and verify every module of the ASVANNA ecosystem:
</p>

<table class="content-table">
  <thead>
    <tr>
      <th style="width: 25%;">Step & Target Subsystem</th>
      <th style="width: 35%;">Exact Execution Command</th>
      <th>Expected Operational Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Step 1: Automated Math Verification</b></td>
      <td><code>node backend/test/test_all_endpoints.js</code></td>
      <td>Executes 4 automated unit tests verifying Haversine calculations, 3-tier risk logic, and recommendation weights. Output: <code>4/4 Tests Passed</code>.</td>
    </tr>
    <tr>
      <td><b>Step 2: Database Migration & Seeding</b></td>
      <td><code>cd backend && npm run migrate && npm run seed</code></td>
      <td>Initializes schema (10 tables) and inserts 8 upcountry crops, demo accounts, and monthly CROPIX demand quotas.</td>
    </tr>
    <tr>
      <td><b>Step 3: Backend REST API Server</b></td>
      <td><code>cd backend && npm run dev</code></td>
      <td>Starts server on http://localhost:5000. Health check endpoint at <code>http://localhost:5000/health</code> returns <code>{ success: true, status: 'UP' }</code>.</td>
    </tr>
    <tr>
      <td><b>Step 4: Multi-Role Web Portal</b></td>
      <td><code>cd frontend && npm run dev</code></td>
      <td>Starts React portal on http://localhost:3000. Landing page displays 3 role cards. Test registering/logging into Officer, Farmer, and Buyer dashboards.</td>
    </tr>
    <tr>
      <td><b>Step 5: Flutter Mobile Application</b></td>
      <td><code>cd mobile && flutter pub get && flutter run</code></td>
      <td>Launches mobile app on Android emulator/device for Farmer plot logging, GPS capture, and Surplus marketplace browsing.</td>
    </tr>
    <tr>
      <td><b>Step 6: Docker Orchestration</b></td>
      <td><code>docker compose up --build -d</code></td>
      <td>Spins up the multi-tier ecosystem (PostgreSQL, Backend API, Web Portal) in isolated Docker containers with automated health checks.</td>
    </tr>
  </tbody>
</table>

</body>
</html>
"""

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"[OK] Master HTML manual created at: {html_path}")

    # Look for Chrome or Edge executable to render standard HarfBuzz-shaped Sinhala PDF
    browser_exe = None
    possible_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        shutil.which("chrome"),
        shutil.which("msedge")
    ]
    for p in possible_paths:
        if p and os.path.exists(p):
            browser_exe = p
            break

    if browser_exe:
        print(f"[INFO] Using browser engine for perfect Sinhala ligature shaping: {browser_exe}")
        file_url = f"file:///{html_path.replace(os.sep, '/')}"
        cmd = [
            browser_exe,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            file_url
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000:
            print(f"[OK] Master PDF generated via Chromium engine with perfect Sinhala rendering: {pdf_path}")
            print(f"[INFO] PDF File Size: {os.path.getsize(pdf_path)} bytes")
            return
        else:
            print(f"[WARN] Chromium PDF printing returned: {res.stderr}")
    
    # Fallback to reportlab if browser printing not available
    print("[INFO] Fallback to generate_pdf_manual.py")
    import generate_pdf_manual
    generate_pdf_manual.build_pdf()

if __name__ == "__main__":
    generate_manual()
