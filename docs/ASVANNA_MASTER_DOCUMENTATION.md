# 🌾 ASVANNA (අස්වැන්න) — Master System Manual & Technical Documentation

> **The Zero-Waste Marketplace: Guided by Real-Time Data from Seed to Harvest Distribution**  
> **Institution**: Division of Information Technology, Institute of Technology, University of Moratuwa (ITUM)  
> **Course**: National Diploma in Information Technology (NDIT) — Final Year Project 2025/2026  
> **Project Supervisor**: Mrs. Uthpala Athukorala  

---

## 👥 Group 15 — Team Members & Module Allocations

| # | Student Name | Student ID | Core Engineering Responsibility |
|---|---|---|---|
| 1 | **W. N. A. Wedikkara** | `23IT0544` | System Architecture, Auth/RBAC, PostgreSQL Database & Predictive Risk Engine |
| 2 | **K. A. H. I. Lakshitha** | `23IT0503` | Smart Crop Recommendation Engine & Agro-Suitability 4-Factor Scoring Matrix |
| 3 | **G. W. T. Jayampathi** | `23IT0487` | Divisional Officer Web Portal, Proxy Data Entry & Broadcast Warning Alerts |
| 4 | **R. R. L. Geeganage** | `23IT0476` | Farmer Mobile Application (Flutter), GPS Field Plot Logging & Offline Queue |
| 5 | **K. H. M. Dewanga** | `23IT0467` | Geo-Fenced Zero-Waste Surplus Marketplace & 5 km Negotiation Engine |

---

## 📖 1. Non-Technical Executive Summary (Plain English & Singlish / Sinhala)

### 🇱🇰 English:
Sri Lanka’s upcountry vegetable farmers (Bandarawela, Nuwara Eliya, Badulla) face severe economic hardship due to **"Trend Planting" (වගා රැල්ල)**. When market prices for crops like Leeks or Carrots skyrocket, farmers collectively plant the exact same crops. Months later, synchronized harvesting creates a massive regional glut, driving prices down below harvesting costs and causing 30%–40% post-harvest loss (Rs. 180 Billion annual loss).

**ASVANNA** solves this through a dual-phase digital ecosystem:
1. **Pre-Cultivation Intelligence**: Warns farmers of saturation risks before they sow seed and provides profitable alternative crop suggestions tailored to climate, soil, and market gaps.
2. **Post-Harvest Zero-Waste Marketplace**: Direct geo-fenced local trade within 5 km connecting farmers with buyers.
3. **Digital Inclusivity**: Agrarian Divisional Officers enter proxy records for offline farmers without smartphones.

### 🇱🇰 Singlish & Sinhala Explanation:
> *"Govi mahathwaru market eke ada thiyena ganan balala ekama boga wargaya (e.g. Leeks, Cabbage) ekawara wawanawa. Ethakota mas 3kin ekawara aswanna labunama market eka pirila mila bahinawa. ASVANNA kiyanne meka nawathwana digital platform ekak. Farmer boga wawanna kalin app eken log kalama, system eka national market demand eka (CROPIX) ekka compare karala warning ekak denawa. Saturation eka 85% wadi nam wena labadayaka boga (Beetroot, Knol Khol) recommend karanawa. Ithuru wena aswanna 5km athule buyerslata kelinma wikunanna marketplace ekakuth meke thiyanawa."*

---

## 🏛️ 2. Individual Member Deep-Dive & Evaluation Guide

### 👨‍💻 Member 1: W. N. A. Wedikkara (23IT0544)
- **Module**: System Architecture, Database Schema, Authentication & Predictive Risk Engine
- **Authored Code Files**:
  - `backend/src/database/schema.sql` (10 PostgreSQL tables, UUID, foreign keys, indexes)
  - `backend/src/database/migrate.js` & `seed.js`
  - `backend/src/config/database.js` & `config.js`
  - `backend/src/middlewares/authMiddleware.js` (JWT & RBAC)
  - `backend/src/services/riskEngineService.js`
  - `backend/src/controllers/riskEngineController.js`
- **Core Formula**:
  $$\text{Estimated Regional Supply} = \sum (\text{Planted Acres} \times \text{Average Yield per Acre})$$
  $$\text{Risk Ratio (\%)} = \left( \frac{\text{Estimated Supply}}{\text{CROPIX Regional Demand}} \right) \times 100$$
  - `SAFE`: $< 70\%$
  - `WARNING`: $70\% - 85\%$
  - `OVER_PLANTED`: $> 85\%$
- **How to Test Member 1's Work**:
  ```bash
  # 1. Test database migration & seed
  cd backend && npm run migrate && npm run seed
  # 2. Test Risk calculation endpoint
  curl -X GET http://localhost:5000/api/v1/risk/crop/1 \
    -H "Authorization: Bearer <TOKEN>"
  ```

---

### 👨‍💻 Member 2: K. A. H. I. Lakshitha (23IT0503)
- **Module**: Smart Crop Recommendation Engine & Agro-Suitability Multi-Factor Matrix
- **Authored Code Files**:
  - `backend/src/services/recommendationService.js`
  - `backend/src/controllers/recommendationController.js`
  - `backend/src/routes/recommendationRoutes.js`
  - `frontend/src/pages/RiskAnalytics.jsx`
- **Core Formula**:
  $$\text{Composite Score} = (0.35 \times S_{\text{market\_gap}}) + (0.25 \times S_{\text{soil}}) + (0.20 \times S_{\text{weather}}) + (0.20 \times S_{\text{price\_trend}})$$
- **How to Test Member 2's Work**:
  ```bash
  curl -X GET "http://localhost:5000/api/v1/recommendations?district=Badulla&cropId=1" \
    -H "Authorization: Bearer <TOKEN>"
  ```

---

### 👨‍💻 Member 3: G. W. T. Jayampathi (23IT0487)
- **Module**: Divisional Officer Web Portal, Proxy Data Entry & Multi-Channel Broadcast Warnings
- **Authored Code Files**:
  - `frontend/src/pages/Dashboard.jsx`
  - `frontend/src/pages/RegionalMonitoring.jsx`
  - `frontend/src/pages/FarmerDirectory.jsx`
  - `frontend/src/pages/Broadcasts.jsx`
  - `frontend/src/components/ProxyDataModal.jsx`
  - `frontend/src/components/BroadcastModal.jsx`
  - `backend/src/services/notificationService.js`
  - `frontend/src/locales/` (`en.json`, `si.json`, `ta.json`)
- **How to Test Member 3's Work**:
  1. Start web portal: `cd frontend && npm run dev`.
  2. Open `http://localhost:3000` and log in as DO Officer (`0771234567 / asvanna123`).
  3. Submit a proxy planting entry on behalf of a smartphone-less farmer.
  4. Dispatch a broadcast warning and test the multi-language UI switcher (EN/සිං/தமி).

---

### 👨‍💻 Member 4: R. R. L. Geeganage (23IT0476)
- **Module**: Flutter Cross-Platform Farmer Mobile Application, GPS Field Logging & Offline Sync
- **Authored Code Files**:
  - `mobile/lib/main.dart`
  - `mobile/lib/core/services/location_service.dart` (Geolocator GPS)
  - `mobile/lib/core/services/offline_storage_service.dart` (Local caching)
  - `mobile/lib/features/home/farmer_home_screen.dart`
  - `mobile/lib/features/planting/log_planting_screen.dart`
  - `mobile/lib/features/recommendations/smart_crop_recommendation_screen.dart`
  - `mobile/lib/l10n/` (`app_en.arb`, `app_si.arb`, `app_ta.arb`)
- **How to Test Member 4's Work**:
  ```bash
  cd mobile
  flutter pub get
  flutter run
  ```
  - Test GPS auto-detection on planting entry.
  - Test offline queue by toggling airplane mode on the emulator.

---

### 👨‍💻 Member 5: K. H. M. Dewanga (23IT0467)
- **Module**: 5 km Geo-Fenced Zero-Waste Surplus Marketplace & Direct Negotiation Engine
- **Authored Code Files**:
  - `backend/src/services/geofencingService.js` (Haversine trigonometric distance)
  - `backend/src/services/marketplaceService.js` (Firebase RTDB sync)
  - `backend/src/controllers/marketplaceController.js`
  - `backend/src/routes/marketplaceRoutes.js`
  - `frontend/src/pages/MarketplaceSurplus.jsx`
  - `mobile/lib/features/marketplace/marketplace_feed_screen.dart`
  - `mobile/lib/features/marketplace/list_surplus_screen.dart`
- **How to Test Member 5's Work**:
  ```bash
  # 1. Publish surplus batch
  curl -X POST http://localhost:5000/api/v1/marketplace/list \
    -H "Authorization: Bearer <TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"crop_id":1, "quantity_kg":450, "price_per_kg":240, "available_from":"2026-08-25", "available_to":"2026-08-30", "latitude":6.8258, "longitude":80.9982, "pickup_address":"Bandarawela Road"}'

  # 2. Search nearby within 5 km
  curl -X GET "http://localhost:5000/api/v1/marketplace/search-nearby?lat=6.8258&lng=80.9982&radius_km=5.0" \
    -H "Authorization: Bearer <TOKEN>"
  ```

---

## 🗂️ 3. Complete File-by-File Catalog

| File Path | Component | Description & Value | Dependencies |
|---|---|---|---|
| `backend/src/server.js` | Backend Entry | Boots Express server on Port 5000 | `app.js`, `config.js` |
| `backend/src/app.js` | Express Setup | Security middleware (Helmet, CORS) & Router mounting | `express`, `routes` |
| `backend/src/config/config.js` | Configuration | Environment variables centralization | `dotenv` |
| `backend/src/config/database.js` | DB Pool | PostgreSQL connection pool | `pg` |
| `backend/src/config/firebase.js` | Firebase SDK | FCM push and Realtime Database | `firebase-admin` |
| `backend/src/database/schema.sql` | SQL DDL | 10 Relational tables with indexes | PostgreSQL 15 |
| `backend/src/database/seed.js` | Master Seeder | Seeds Bandarawela pilot crops & demo users | `bcryptjs` |
| `backend/src/services/riskEngineService.js` | Risk Engine | Computes saturation ratio & 3-tier alerts | `database.js` |
| `backend/src/services/recommendationService.js`| Crop Recommender | Computes 4-factor composite scores | `riskEngineService.js` |
| `backend/src/services/geofencingService.js` | Geofencing | Haversine distance proximity filtering | `haversine.js` |
| `backend/src/services/notificationService.js` | Alerts | FCM multicast & SMS fallback dispatch | `firebase.js` |
| `frontend/src/App.jsx` | React Root | Client routes and layout wrapper | `react-router-dom` |
| `frontend/src/pages/Dashboard.jsx` | Officer Dashboard | Regional crop saturation matrix & KPI stats | React, Lucide |
| `frontend/src/pages/RegionalMonitoring.jsx`| Map Portal | Live GPS planting clusters grid | React, Leaflet |
| `frontend/src/locales/` | Localization | Trilingual JSON dictionary (EN, SI, TA) | Context API |
| `mobile/lib/main.dart` | Flutter Root | Mobile app entry point & theme setup | Flutter SDK |
| `mobile/lib/features/home/` | Mobile Home | Farmer overview, weather card & risk alerts | Dart, Flutter |
| `mobile/lib/features/planting/` | Field Logger | GPS-tagged planting entry screen | Geolocator |
| `mobile/lib/features/marketplace/`| Surplus Feed | 5 km local surplus browsing & order offers | Mobile UI |
| `docker-compose.yml` | Orchestration | Multi-container setup for DB, API, and Web | Docker |

---

## 🧪 4. Automated Testing & Verification Suite

Run all automated math, distance, and threshold unit tests:

```bash
node backend/test/test_all_endpoints.js
```

Expected Output:
```
🧪 Starting ASVANNA Test Suite...

  ✅ PASS: Haversine: Calculates exact distance between Bandarawela and Ella (approx 8.5 km)
  ✅ PASS: Haversine: Returns 0 for identical coordinates
  ✅ PASS: Risk Engine Logic: Below 70% is SAFE, 70-85% is WARNING, >85% is OVER_PLANTED
  ✅ PASS: Smart Recommendation: Composite weighting formula sums correctly

📊 Test Summary: 4/4 Tests Passed.
🎉 All core algorithms and calculation formulas verified successfully!
```

---
*Prepared by Group 15 for ITUM University of Moratuwa NDIT Final Year Evaluation 2026.*
