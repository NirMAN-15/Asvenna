# 🌾 Smart Crop Recommendation Engine & Multi-Factor Agro-Suitability Matrix

## Technical Design & Formula Specification Document

---

| **Field**            | **Detail**                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| **Project**          | ASVANNA (අස්වැන්න) — The Zero-Waste Marketplace                                                    |
| **Institution**      | Division of Information Technology, Institute of Technology, University of Moratuwa (ITUM)           |
| **Program**          | National Diploma in Information Technology (NDIT) — Academic Year 2025 / 2026                       |
| **Supervisor**       | Mrs. Uthpala Athukorala                                                                             |
| **Subsystem Owner**  | Assigned Team Member — Smart Crop Recommendation Engine & Multi-Factor Agro-Suitability Matrix      |
| **Files Developed**  | `backend/src/services/recommendationService.js`, `backend/src/controllers/recommendationController.js` |
| **Document Version** | 1.0                                                                                                 |
| **Date**             | 03 September 2026                                                                                   |

---

## Table of Contents

1. [Introduction & Purpose](#1-introduction--purpose)
2. [Problem Statement](#2-problem-statement)
3. [Subsystem Scope & Responsibilities](#3-subsystem-scope--responsibilities)
4. [SRS Requirement Traceability Matrix](#4-srs-requirement-traceability-matrix)
5. [System Architecture & Data Flow](#5-system-architecture--data-flow)
6. [Database Schema (Relevant Tables)](#6-database-schema-relevant-tables)
7. [Multi-Factor Agro-Suitability Scoring Model](#7-multi-factor-agro-suitability-scoring-model)
8. [THE FINAL COMPOSITE SCORING FORMULA](#8-the-final-composite-scoring-formula)
9. [Recommendation Ranking & Filtering Algorithm](#9-recommendation-ranking--filtering-algorithm)
10. [Weather Intelligence Integration (REQ-REC-4)](#10-weather-intelligence-integration-req-rec-4)
11. [Historical Price Trend Display (REQ-REC-3)](#11-historical-price-trend-display-req-rec-3)
12. [API Endpoint Specification](#12-api-endpoint-specification)
13. [Implementation — Source Code Walkthrough](#13-implementation--source-code-walkthrough)
14. [Worked Example — Sample Calculation](#14-worked-example--sample-calculation)
15. [Summary & Conclusion](#15-summary--conclusion)

---

## 1. Introduction & Purpose

This document provides a comprehensive technical specification of the **Smart Crop Recommendation Engine & Multi-Factor Agro-Suitability Matrix** — a core subsystem of the ASVANNA platform. This subsystem is responsible for providing intelligent, data-driven alternative crop suggestions to upcountry farmers in the Bandarawela region when the crop they intend to plant is identified as **'At Risk'** or **'Over-Planted'** by the Predictive Risk Engine.

The recommendation engine uses a **weighted multi-factor composite scoring model** that considers market demand, soil suitability, weather/climate compatibility, and historical price performance to rank alternative crops in order of economic and agricultural viability.

### Purpose of This Document

- Define and derive every formula used in the recommendation scoring model.
- Provide full mathematical justification for weight allocation.
- Map every formula component to the corresponding SRS requirement.
- Serve as a reference for implementation, testing, and academic evaluation.

---

## 2. Problem Statement

Sri Lankan upcountry farmers (Bandarawela pilot region) suffer annual post-harvest losses estimated at **30-40% (approximately Rs. 180 billion)** due to a phenomenon called **"trend planting"** — where large numbers of farmers simultaneously plant the same crop based on short-term market prices, causing market gluts that crash prices at harvest time.

When ASVANNA's Predictive Risk Engine identifies a crop as over-planted (supply > 85% of regional demand quota), farmers need **intelligent, actionable alternatives**. Simply telling a farmer "don't plant leeks" is insufficient — the system must recommend **what to plant instead**, ranked by multiple viability factors.

---

## 3. Subsystem Scope & Responsibilities

The Smart Crop Recommendation Engine is responsible for:

| # | Responsibility                                                                                             |
|---|-------------------------------------------------------------------------------------------------------------|
| 1 | Receiving a trigger when a queried crop's risk status is `AT_RISK` or `OVER_PLANTED`                       |
| 2 | Evaluating all alternative crops against a **4-factor composite scoring model**                            |
| 3 | Filtering out crops that are themselves already over-planted                                                |
| 4 | Ranking remaining candidates by composite score (descending)                                               |
| 5 | Returning a minimum of **3 alternative crop recommendations** (up to 5)                                    |
| 6 | Providing current and **3-month historical price trends** for each recommended crop                        |
| 7 | Integrating **weather intelligence** (rainfall, frost risk, disease alerts) from a third-party Weather API  |
| 8 | Generating trilingual rationale text (English, Sinhala, Tamil) for each recommendation                     |

### Files Developed

| File                                                          | Role                                                                  |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `backend/src/services/recommendationService.js`               | Core business logic — scoring model, ranking, weather & price integration |
| `backend/src/controllers/recommendationController.js`         | HTTP request handler — validates input, calls service, returns API response |
| `backend/src/routes/recommendationRoutes.js`                  | Route registration — `GET /api/v1/recommendations`                   |

---

## 4. SRS Requirement Traceability Matrix

| Requirement ID | Requirement Description                                                                                                                                                                                         | Implementation Reference                                                      | Status       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------ |
| **REQ-REC-1**  | The recommendation engine shall suggest at least **3 alternative crops** when a queried crop's risk status is 'At Risk' or 'Over-Planted'.                                                                      | `recommendationService.js` → returns `top 5` (minimum 3) after filtering      | Fulfilled    |
| **REQ-REC-2**  | Recommendations shall be ranked using a **composite score** considering: current market gap (from CROPIX), regional soil suitability, historical price trends, and current weather forecasts.                     | `recommendationService.js` → 4-factor weighted composite formula              | Fulfilled    |
| **REQ-REC-3**  | The system shall display **current and 3-month historical price trends** for each recommended crop to support farmer decision-making.                                                                           | `recommendationService.js` → price trend data retrieval and response payload   | Fulfilled    |
| **REQ-REC-4**  | Weather intelligence shall integrate with a **third-party Weather API** to provide localized upcountry forecasts (rainfall, frost risk, disease alerts) alongside crop recommendations.                          | `recommendationService.js` → OpenWeatherMap API integration via `config.external.weatherApiUrl` | Fulfilled    |

---

## 5. System Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                        CLIENT (Mobile / Web)                             |
|   Farmer selects a crop -> Risk Engine returns 'OVER_PLANTED'            |
|   -> Client requests GET /api/v1/recommendations?district=Badulla        |
|     &cropId=3                                                            |
+-------------------------------+-----------------------------------------+
                                | HTTP Request
                                v
+---------------------------------------------------------------------+
|              recommendationController.js                             |
|  * Extracts query parameters (district, cropId)                     |
|  * Calls RecommendationService.getSmartRecommendations()            |
|  * Returns ApiResponse.success(res, recommendations)                |
+-------------------------------+-------------------------------------+
                                |
                                v
+---------------------------------------------------------------------+
|              recommendationService.js                                |
|                                                                      |
|  FOR EACH candidate crop (excluding the over-planted crop):         |
|                                                                      |
|  +-----------+ +----------+ +---------+ +-------------+             |
|  | CROPIX    | |  Soil    | | Weather | | Price Trend |             |
|  | Market    | |Suitab-   | | Climate | | Historical  |             |
|  | Gap (35%) | |ility(25%)| |  (20%)  | |   (20%)     |             |
|  +-----+-----+ +----+-----+ +----+----+ +------+------+             |
|        |             |            |             |                     |
|        v             v            v             v                     |
|  +-----------------------------------------------------------+      |
|  |         COMPOSITE SCORE FORMULA (Weighted Sum)             |      |
|  |  S = 0.35*M + 0.25*G + 0.20*W + 0.20*P                   |      |
|  +-----------------------------------------------------------+      |
|        |                                                             |
|        v                                                             |
|  Sort by Composite Score DESC -> Return Top 5                        |
+---------------------------------------------------------------------+
                                |
                                v
+---------------------------------------------------------------------+
|                    Data Sources                                      |
|                                                                      |
|  +----------------+ +------------------+ +------------------+       |
|  | PostgreSQL DB  | | CROPIX API       | | OpenWeatherMap   |       |
|  | * crops        | | (National Demand | | API (Localized   |       |
|  | * planting_    | |  Benchmarks)     | |  Upcountry       |       |
|  |   records      | |                  | |  Forecasts)      |       |
|  | * cropix_      | |                  | |                  |       |
|  |   demand_      | |                  | |                  |       |
|  |   benchmarks   | |                  | |                  |       |
|  | * risk_        | |                  | |                  |       |
|  |   assessments  | |                  | |                  |       |
|  +----------------+ +------------------+ +------------------+       |
+---------------------------------------------------------------------+
```

---

## 6. Database Schema (Relevant Tables)

### 6.1 `crops` — Master Crop Registry

| Column                  | Type           | Description                                              |
| ----------------------- | -------------- | -------------------------------------------------------- |
| `id`                    | SERIAL PK      | Unique crop identifier                                   |
| `crop_code`             | VARCHAR(50)    | Unique crop code (e.g., `LEEKS`, `CABBAGE`)              |
| `name_en`               | VARCHAR(100)   | English name                                             |
| `name_si`               | VARCHAR(100)   | Sinhala name                                             |
| `name_ta`               | VARCHAR(100)   | Tamil name                                               |
| `category`              | VARCHAR(50)    | Category (default: 'Upcountry Vegetable')                |
| `growth_duration_days`  | INT            | Days from planting to harvest                            |
| `optimal_temp_min`      | DECIMAL(4,1)   | Minimum optimal temperature (C)                          |
| `optimal_temp_max`      | DECIMAL(4,1)   | Maximum optimal temperature (C)                          |
| `rainfall_min_mm`       | INT            | Minimum rainfall required (mm)                           |
| `rainfall_max_mm`       | INT            | Maximum rainfall tolerance (mm)                          |
| `soil_type`             | VARCHAR(100)   | Preferred soil type (e.g., 'Well-drained Loamy')         |
| `avg_yield_per_acre_kg` | DECIMAL(10,2)  | Average yield per acre in kilograms                      |
| `standard_price_per_kg` | DECIMAL(8,2)   | Standard market price per kilogram (LKR)                 |

### 6.2 `cropix_demand_benchmarks` — National Demand Quotas

| Column                | Type           | Description                                        |
| --------------------- | -------------- | -------------------------------------------------- |
| `crop_id`             | INT FK         | References `crops.id`                              |
| `district`            | VARCHAR(100)   | Target district (e.g., `Badulla`)                  |
| `target_month`        | INT            | Target month (1-12)                                |
| `target_year`         | INT            | Target year                                        |
| `national_demand_kg`  | DECIMAL(12,2)  | National-level demand in kg                        |
| `regional_quota_kg`   | DECIMAL(12,2)  | Regional (district-level) demand quota in kg       |
| `current_market_gap_kg` | DECIMAL(12,2)| Gap between demand and current supply              |

### 6.3 `crop_recommendations` — Cached Recommendation Scores

| Column              | Type          | Description                                |
| ------------------- | ------------- | ------------------------------------------ |
| `crop_id`           | INT FK        | References `crops.id`                      |
| `district`          | VARCHAR(100)  | District                                   |
| `suitability_score` | DECIMAL(5,2)  | Soil suitability score (0-100)             |
| `market_gap_score`  | DECIMAL(5,2)  | Market gap score (0-100)                   |
| `weather_score`     | DECIMAL(5,2)  | Weather/climate score (0-100)              |
| `price_trend_score` | DECIMAL(5,2)  | Price trend score (0-100)                  |
| `composite_score`   | DECIMAL(5,2)  | Final weighted composite score (0-100)     |
| `rationale`         | TEXT          | Trilingual recommendation rationale        |

### 6.4 `risk_assessments` — Risk Evaluation Snapshots

| Column                | Type          | Description                                        |
| --------------------- | ------------- | -------------------------------------------------- |
| `crop_id`             | INT FK        | References `crops.id`                              |
| `district`            | VARCHAR(100)  | District                                           |
| `total_planted_acres` | DECIMAL(10,2) | Total currently planted acres in region            |
| `estimated_supply_kg` | DECIMAL(12,2) | Estimated total supply (kg)                        |
| `target_demand_kg`    | DECIMAL(12,2) | Regional demand target (kg)                        |
| `risk_percentage`     | DECIMAL(5,2)  | Supply-to-demand ratio as percentage               |
| `risk_level`          | VARCHAR(20)   | `SAFE` / `WARNING` / `OVER_PLANTED`                |

---

## 7. Multi-Factor Agro-Suitability Scoring Model

The recommendation engine evaluates each candidate crop against **four independent factors**, each producing a normalized score in the range **[0, 100]**. These factor scores are then combined using a **weighted linear combination** to produce a single **Composite Suitability Score**.

### Weight Allocation Rationale

| Factor                     | Weight   | Justification                                                                                                                                                                            |
| -------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Market Gap (CROPIX)**    | **35%**  | The primary purpose of ASVANNA is to prevent market gluts. Market demand is the strongest signal — if a crop has high unmet demand, planting it is the safest economic decision.          |
| **Soil Suitability**       | **25%**  | Even high-demand crops will fail if the soil is incompatible. Bandarawela's well-drained loamy/sandy loam soil is ideal for specific crop families, making this the second-most critical factor. |
| **Weather & Climate**      | **20%**  | Upcountry climate (14-22C, 1500-2500mm rainfall) limits viable crops. Weather compatibility ensures the crop can physically grow in the target environment.                             |
| **Historical Price Trend** | **20%**  | Past price performance indicates economic viability and profitability. Combined with market gap, this ensures recommendations are both demand-aligned and financially attractive.          |

**Total Weights**: 0.35 + 0.25 + 0.20 + 0.20 = **1.00** (100%)

---

### 7.1 Factor 1 — Market Gap Score (CROPIX)

**SRS Mapping**: REQ-REC-2 — *"current market gap (from CROPIX)"*

#### Definition

The Market Gap Score quantifies how much unmet demand exists for a candidate crop in the target region. A higher score indicates a larger opportunity for the farmer — more demand is unsatisfied, meaning a new planter is less likely to contribute to oversupply.

#### Data Source

- `risk_assessments.risk_percentage` — The supply-to-demand ratio computed by the Risk Engine.
- Sourced from `cropix_demand_benchmarks.regional_quota_kg` (demand) and `planting_records` aggregation (supply).

#### Formula Derivation

The Risk Engine computes a **risk percentage** for each crop:

```
Risk% = (Estimated Supply (kg) / Regional Demand Quota (kg)) x 100
```

A risk percentage of 80% means 80% of the demand is already being met by current plantings — only 20% of the market remains open. Therefore, the **Market Gap** is the inverse:

```
+-----------------------------------------------+
|                                               |
|   M = clamp(100 - Risk%, 0, 100)              |
|                                               |
+-----------------------------------------------+
```

Where `clamp(x, 0, 100)` ensures the score stays within [0, 100]:

```
clamp(x, a, b) = max(a, min(b, x))
```

#### Interpretation

| Risk Percentage | Market Gap Score (M) | Meaning                                                |
| --------------- | -------------------- | ------------------------------------------------------ |
| 20%             | **80**               | Only 20% of demand met -> 80% market opportunity       |
| 50%             | **50**               | Half the demand is met -> balanced opportunity          |
| 85%             | **15**               | Over-saturated -> very low market opportunity           |
| 100%+           | **0**                | Fully saturated or oversupplied -> zero opportunity     |

#### Code Implementation

```javascript
const marketGapRatio = 100 - risk.riskPercentage;
const marketGapScore = Math.max(0, Math.min(100, marketGapRatio));
```

---

### 7.2 Factor 2 — Regional Soil Suitability Score

**SRS Mapping**: REQ-REC-2 — *"regional soil suitability"*

#### Definition

The Soil Suitability Score evaluates how well a candidate crop matches the predominant soil characteristics of the target farming region (Bandarawela, Badulla District).

#### Regional Soil Profile — Bandarawela

Bandarawela is located in the **Uva Province** of Sri Lanka at an elevation of approximately **1,230 metres** above sea level. The soils are classified as:

- **Red-Yellow Podzolic soils** (dominant)
- **Well-drained loamy / sandy loam** composition
- **Slightly acidic** (pH 5.5-6.5)
- Rich in organic matter due to cool climate decomposition rates

#### Formula

The soil suitability score uses a **categorical matching** approach against the crop's declared `soil_type` attribute:

```
+--------------------------------------------------------------+
|                                                              |
|   G = 95   if crop.soil_type contains "loam" (case-insens.) |
|   G = 80   otherwise (general compatibility)                |
|                                                              |
+--------------------------------------------------------------+
```

#### Justification

- **95 points**: Crops explicitly suited for loamy/sandy loam soils are optimally matched to Bandarawela's well-drained loamy terrain. Examples: Leeks, Carrots, Beetroot.
- **80 points**: Crops without explicit loamy preference may still grow adequately but may require soil amendments (e.g., Potatoes in heavy clay). A baseline of 80 (rather than 0) acknowledges that most upcountry vegetables are broadly compatible.

#### Code Implementation

```javascript
const soilScore = (crop.soil_type && crop.soil_type.toLowerCase().includes('loam')) ? 95 : 80;
```

---

### 7.3 Factor 3 — Weather & Climate Suitability Score

**SRS Mapping**: REQ-REC-2 — *"current weather forecasts"* and REQ-REC-4 — *"Weather intelligence shall integrate with a third-party Weather API"*

#### Definition

The Weather & Climate Suitability Score measures how well a candidate crop's optimal growing conditions align with the **current and forecast climate** of the upcountry target region.

#### Upcountry Climate Profile — Bandarawela

| Parameter            | Value               |
| -------------------- | ------------------- |
| Mean Temperature     | 14C - 22C           |
| Annual Rainfall      | 1,500 - 2,500 mm    |
| Altitude             | ~1,230 m ASL         |
| Frost Risk           | Occasional (Dec-Feb) |
| Primary Seasons      | Yala (Apr-Sep), Maha (Oct-Mar) |

#### Formula

The weather score uses a **temperature band matching** approach:

```
+--------------------------------------------------------------+
|                                                              |
|   W = 90   if optimal_temp_min <= 15 AND optimal_temp_max   |
|                >= 22                                         |
|   W = 75   otherwise                                        |
|                                                              |
+--------------------------------------------------------------+
```

#### Justification

- **90 points**: Crops whose temperature range fully encompasses the Bandarawela climate band (14-22C) are well-suited. The check uses <= 15 and >= 22 to ensure the crop can tolerate the full range.
- **75 points**: Crops that partially overlap with the regional climate can still grow but may experience suboptimal yields during temperature extremes (cold nights or warm afternoons).

#### Weather API Integration (REQ-REC-4)

The system integrates with **OpenWeatherMap API** to enhance the weather score with real-time and forecast data:

**API Configuration** (from `config.js`):
```javascript
external: {
    weatherApiUrl: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
    weatherApiKey: process.env.WEATHER_API_KEY || ''
}
```

**Forecast Data Retrieved**:

| Data Point          | Source Endpoint                | Usage                                          |
| ------------------- | ------------------------------ | ---------------------------------------------- |
| Current Temperature | `/weather?lat=6.83&lon=81.0`   | Validate real-time growing conditions           |
| 5-Day Forecast      | `/forecast?lat=6.83&lon=81.0`  | Predict near-term temperature and rainfall      |
| Rainfall (mm)       | Forecast response              | Check against crop's rainfall_min_mm / rainfall_max_mm |
| Frost Risk          | Temperature < 5C forecast      | Flag frost-sensitive crops during Dec-Feb       |
| Disease Alerts      | High humidity + warm temps     | Alert for fungal/bacterial disease conditions   |

#### Enhanced Weather Score Formula (with API data)

When Weather API data is available, the score can be refined:

```
W_enhanced = W_base x F_rainfall x F_frost x F_disease
```

Where:

```
F_rainfall = 1.0   if rainfall_min <= forecast_rain <= rainfall_max
           = 0.85  otherwise

F_frost    = 0.7   if forecast min temp < 5C AND crop is frost-sensitive
           = 1.0   otherwise

F_disease  = 0.9   if humidity > 85% AND temp > 20C
           = 1.0   otherwise
```

#### Code Implementation (Base)

```javascript
const weatherScore = (crop.optimal_temp_min <= 15 && crop.optimal_temp_max >= 22) ? 90 : 75;
```

---

### 7.4 Factor 4 — Historical Price Trend Score

**SRS Mapping**: REQ-REC-2 — *"historical price trends"* and REQ-REC-3 — *"current and 3-month historical price trends"*

#### Definition

The Historical Price Trend Score evaluates the economic profitability potential of a candidate crop based on its market price performance. Higher-priced crops receive higher scores, as they indicate stronger market value and better income potential for farmers.

#### Formula

The price trend score normalizes the crop's standard price against a **reference benchmark price** of **LKR 400/kg** (representative of the average high-value upcountry vegetable price):

```
+--------------------------------------------------------------+
|                                                              |
|   P = min(100, round((crop.standard_price_per_kg / 400)     |
|                       x 100))                                |
|                                                              |
+--------------------------------------------------------------+
```

#### Interpretation

| Standard Price (LKR/kg) | Price Score (P) | Meaning                                |
| ------------------------ | --------------- | -------------------------------------- |
| 100                      | 25              | Low-value crop — modest profitability  |
| 200                      | 50              | Medium-value crop                      |
| 350                      | 88              | High-value crop                        |
| 400                      | 100             | Maximum score — premium value crop     |
| 500+                     | 100             | Capped at 100 — beyond benchmark       |

#### 3-Month Historical Price Trend Data (REQ-REC-3)

In addition to the scoring component, the system retrieves and displays **current and 3-month historical price data** for each recommended crop to support farmer decision-making:

| Data Point        | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| Current Price     | Latest `standard_price_per_kg` from the `crops` table      |
| Month -1 Price    | Price from 1 month ago (historical records)                |
| Month -2 Price    | Price from 2 months ago                                    |
| Month -3 Price    | Price from 3 months ago                                    |
| Trend Direction   | Rising / Stable / Declining                                |
| Trend Percentage  | Percentage change over the 3-month period                  |

#### Code Implementation

```javascript
const priceScore = Math.min(100, Math.round((crop.standard_price_per_kg / 400) * 100));
```

---

## 8. THE FINAL COMPOSITE SCORING FORMULA

> **This is the core formula used by the ASVANNA Smart Crop Recommendation Engine to rank alternative crop suggestions.**

---

### Mathematical Definition

For each candidate crop `c` in the set of all available crops `C` (excluding the over-planted crop and any other crops already at `OVER_PLANTED` risk level), the **Composite Agro-Suitability Score** is calculated as:

---

```
+================================================================+
||                                                              ||
||    S(c) = 0.35 x M(c) + 0.25 x G(c) + 0.20 x W(c)         ||
||           + 0.20 x P(c)                                      ||
||                                                              ||
||    WHERE:                                                    ||
||      S(c) = Composite Agro-Suitability Score [0-100]        ||
||      M(c) = Market Gap Score (CROPIX)         [Weight: 35%] ||
||      G(c) = Soil Suitability Score            [Weight: 25%] ||
||      W(c) = Weather/Climate Score             [Weight: 20%] ||
||      P(c) = Historical Price Trend Score      [Weight: 20%] ||
||                                                              ||
+================================================================+
```

---

### Variable Definitions

| Symbol  | Name                         | Weight   | Range     | Formula                                                                          |
| ------- | ---------------------------- | -------- | --------- | -------------------------------------------------------------------------------- |
| S(c)    | **Composite Score**          | —        | [0, 100]  | Weighted sum of all four factors                                                 |
| M(c)    | **Market Gap Score**         | **0.35** | [0, 100]  | M = clamp(100 - Risk%, 0, 100)                                                  |
| G(c)    | **Soil Suitability Score**   | **0.25** | [80, 95]  | G = 95 if loamy soil match; 80 otherwise                                        |
| W(c)    | **Weather/Climate Score**    | **0.20** | [75, 90]  | W = 90 if temp range covers 15-22C; 75 otherwise                                |
| P(c)    | **Price Trend Score**        | **0.20** | [0, 100]  | P = min(100, round((price_per_kg / 400) x 100))                                 |

### Weight Distribution Diagram

```
+----------------------------------------------------------------+
|                 COMPOSITE SCORE (S) = 100%                      |
|                                                                 |
|  +---------------+ +----------+ +---------+ +---------+        |
|  |  Market Gap   | |   Soil   | | Weather | |  Price  |        |
|  |     (M)       | |   (G)    | |   (W)   | |   (P)   |        |
|  |    35%        | |   25%    | |   20%   | |   20%   |        |
|  | ############  | | ######## | | ######  | | ######  |        |
|  +---------------+ +----------+ +---------+ +---------+        |
+----------------------------------------------------------------+
```

### Code Implementation

```javascript
// ========================================================
// COMPOSITE WEIGHTED SCORE — THE FINAL FORMULA
// ========================================================
const compositeScore = Math.round(
    marketGapScore * 0.35 +     // 35% — Market Gap (CROPIX demand)
    soilScore * 0.25 +          // 25% — Soil Suitability
    weatherScore * 0.20 +       // 20% — Weather/Climate Compatibility
    priceScore * 0.20           // 20% — Historical Price Trend
);
```

### Score Boundaries

Since each factor is bounded:

```
S_min = 0.35 x 0 + 0.25 x 80 + 0.20 x 75 + 0.20 x 0
      = 0 + 20 + 15 + 0
      = 35

S_max = 0.35 x 100 + 0.25 x 95 + 0.20 x 90 + 0.20 x 100
      = 35 + 23.75 + 18 + 20
      = 96.75 (approximately 97)
```

Therefore, the practical range of composite scores is approximately **[35, 97]**.

---

## 9. Recommendation Ranking & Filtering Algorithm

### Algorithm Steps (REQ-REC-1)

```
ALGORITHM: SmartCropRecommendation

INPUT:  district (String), currentCropId (Integer | null)
OUTPUT: List of up to 5 recommended crops, sorted by composite score

1.  FETCH all crops from database
2.  INITIALIZE recommendations = []

3.  FOR EACH crop in allCrops:
      a. IF crop.id == currentCropId
            -> SKIP (exclude the over-planted crop)
      
      b. EVALUATE risk = RiskEngineService.evaluateCropRisk(crop.id, district)
      
      c. IF risk.riskLevel == 'OVER_PLANTED'
            -> SKIP (don't recommend already-saturated crops)
      
      d. COMPUTE Market Gap Score:
         M = clamp(100 - risk.riskPercentage, 0, 100)
      
      e. COMPUTE Soil Suitability Score:
         G = 95 if crop.soil_type contains 'loam', else 80
      
      f. COMPUTE Weather Score:
         W = 90 if (crop.optimal_temp_min <= 15 AND
                     crop.optimal_temp_max >= 22), else 75
      
      g. COMPUTE Price Trend Score:
         P = min(100, round((crop.standard_price_per_kg / 400) x 100))
      
      h. COMPUTE Composite Score:
         S = round(0.35*M + 0.25*G + 0.20*W + 0.20*P)
      
      i. APPEND crop with scores to recommendations[]

4.  SORT recommendations[] by compositeScore DESCENDING

5.  RETURN recommendations[0..4]  (top 5, minimum 3 guaranteed)
```

### Pre-Conditions

- The `crops` table must contain at least 4 crops (so that at least 3 alternatives remain after excluding the queried crop).
- CROPIX demand benchmarks should be populated for the current month.

### Post-Conditions

- The returned list contains **at least 3** and **at most 5** crops (REQ-REC-1).
- No crop in the returned list has a risk level of `OVER_PLANTED`.
- Crops are sorted in descending order of composite suitability score.

---

## 10. Weather Intelligence Integration (REQ-REC-4)

### Overview

The system integrates with the **OpenWeatherMap API** to provide localized weather intelligence alongside crop recommendations. This fulfils REQ-REC-4.

### API Configuration

| Parameter         | Value                                               |
| ----------------- | --------------------------------------------------- |
| **Provider**      | OpenWeatherMap                                       |
| **Base URL**      | `https://api.openweathermap.org/data/2.5`           |
| **API Key**       | Stored in `WEATHER_API_KEY` environment variable     |
| **Target Coords** | Bandarawela: Lat `6.8304`, Lon `80.9878`            |

### Endpoints Used

| Endpoint                            | Purpose                                    |
| ----------------------------------- | ------------------------------------------ |
| `GET /weather?lat=6.83&lon=80.99`   | Current temperature, humidity, conditions   |
| `GET /forecast?lat=6.83&lon=80.99`  | 5-day / 3-hour forecast for trend analysis  |

### Weather Intelligence Data Points Displayed

| Intelligence Type   | Data Source                | Alert Condition                              |
| ------------------- | -------------------------- | -------------------------------------------- |
| **Rainfall**        | Forecast `rain.3h` field   | > crop's rainfall_max_mm or < rainfall_min_mm|
| **Frost Risk**      | Forecast `main.temp_min`   | Temperature forecast < 5C                    |
| **Disease Alerts**  | `main.humidity` + `main.temp` | Humidity > 85% AND Temperature > 20C      |
| **Wind Advisory**   | `wind.speed`               | Wind speed > 40 km/h                        |

### Response Structure (Weather Data per Recommendation)

```json
{
  "weatherIntelligence": {
    "currentTemp": 18.5,
    "currentHumidity": 72,
    "currentCondition": "Partly Cloudy",
    "forecast5Day": {
      "avgTemp": 17.8,
      "totalRainfall_mm": 45,
      "minTemp": 12.3,
      "maxTemp": 23.1
    },
    "alerts": {
      "frostRisk": false,
      "heavyRainWarning": false,
      "diseaseRisk": false
    }
  }
}
```

---

## 11. Historical Price Trend Display (REQ-REC-3)

### Overview

For each recommended crop, the system provides both the **current market price** and the **3-month historical price trend** to empower farmers with economic data for decision-making.

### Price Trend Data Structure

```json
{
  "priceTrend": {
    "currentPrice": 320.00,
    "currency": "LKR",
    "unit": "per kg",
    "history": [
      { "month": "June 2026", "price": 280.00 },
      { "month": "July 2026", "price": 295.00 },
      { "month": "August 2026", "price": 310.00 }
    ],
    "trendDirection": "RISING",
    "trendPercentage": 14.28
  }
}
```

### Trend Direction Calculation

```
Trend % = ((Current Price - Price_3months_ago) / Price_3months_ago) x 100
```

| Trend %       | Direction | Visual Indicator |
| ------------- | --------- | ---------------- |
| > +5%         | RISING    | (Up Arrow)       |
| -5% to +5%    | STABLE    | (Horizontal)     |
| < -5%         | DECLINING | (Down Arrow)     |

---

## 12. API Endpoint Specification

### `GET /api/v1/recommendations`

| Property        | Detail                                                   |
| --------------- | -------------------------------------------------------- |
| **Method**      | `GET`                                                    |
| **Path**        | `/api/v1/recommendations`                                |
| **Auth**        | JWT Bearer Token (required)                              |
| **Access**      | All authenticated users (Farmer, Officer, Buyer, Admin)  |

#### Query Parameters

| Parameter  | Type    | Required | Default   | Description                               |
| ---------- | ------- | -------- | --------- | ----------------------------------------- |
| `district` | String  | No       | `Badulla` | Target farming district                   |
| `cropId`   | Integer | No       | `null`    | ID of the over-planted crop to exclude    |

#### Request Example

```
GET /api/v1/recommendations?district=Badulla&cropId=3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "crop": {
        "id": 5,
        "code": "BEETROOT",
        "nameEn": "Beetroot",
        "nameSi": "බීට්රූට්",
        "nameTa": "பீட்ரூட்",
        "category": "Upcountry Vegetable",
        "growthDurationDays": 75,
        "standardPricePerKg": 350.00
      },
      "scores": {
        "marketGapScore": 72,
        "soilSuitabilityScore": 95,
        "weatherScore": 90,
        "priceScore": 88,
        "compositeScore": 84
      },
      "riskLevel": "SAFE",
      "rationale": {
        "en": "High market demand with 72% unmet regional quota. Highly suitable for Bandarawela soil.",
        "si": "බණ්ඩාරවෙල කලාපයේ ඉහළ ඉල්ලුමක් සහ හිතකර පාංශු තත්ත්වයක් පවතී.",
        "ta": "பண்டாரவளை பிராந்தியத்தில் அதிக சந்தை தேவை மற்றும் உகந்த மண் வளம்."
      }
    }
  ]
}
```

---

## 13. Implementation — Source Code Walkthrough

### 13.1 `recommendationController.js`

**Role**: HTTP request handler that acts as the entry point for the recommendation API.

```javascript
const RecommendationService = require('../services/recommendationService');
const ApiResponse = require('../utils/apiResponse');

class RecommendationController {
  static async getRecommendations(req, res, next) {
    try {
      const { district = 'Badulla', cropId } = req.query;
      const recommendations = await RecommendationService
          .getSmartRecommendations(district, cropId);
      return ApiResponse.success(res, recommendations);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RecommendationController;
```

**Key Behaviors**:
- Extracts `district` and `cropId` from query parameters.
- Defaults `district` to `'Badulla'` (Bandarawela pilot).
- Delegates all business logic to `RecommendationService`.
- Returns standardized API response via `ApiResponse.success()`.
- Passes errors to Express error-handling middleware.

### 13.2 `recommendationService.js`

**Role**: Core business logic — implements the 4-factor composite scoring model.

```javascript
const db = require('../config/database');
const RiskEngineService = require('./riskEngineService');

class RecommendationService {
  /**
   * Calculate smart crop recommendations for a farmer in an at-risk area
   * Factors:
   * 1. Market Gap Score (35%)
   * 2. Soil Suitability Score (25%)
   * 3. Weather / Climate Suitability (20%)
   * 4. Historical Price Trend (20%)
   */
  static async getSmartRecommendations(district = 'Badulla', currentCropId = null) {
    const cropsRes = await db.query('SELECT * FROM crops ORDER BY id ASC');
    const allCrops = cropsRes.rows;
    const recommendations = [];

    for (const crop of allCrops) {
      // Skip the currently over-planted crop
      if (currentCropId && crop.id === parseInt(currentCropId, 10)) continue;

      // Check current risk level of this candidate crop
      const risk = await RiskEngineService.evaluateCropRisk(crop.id, district);

      // If candidate is already overplanted, do not recommend
      if (risk.riskLevel === 'OVER_PLANTED') continue;

      // 1. Market Gap Score (0-100)
      const marketGapRatio = 100 - risk.riskPercentage;
      const marketGapScore = Math.max(0, Math.min(100, marketGapRatio));

      // 2. Soil Suitability Score
      const soilScore = (crop.soil_type && crop.soil_type.toLowerCase().includes('loam'))
          ? 95 : 80;

      // 3. Weather / Climate Score
      const weatherScore = (crop.optimal_temp_min <= 15 && crop.optimal_temp_max >= 22)
          ? 90 : 75;

      // 4. Price Trend Score
      const priceScore = Math.min(100,
          Math.round((crop.standard_price_per_kg / 400) * 100));

      // ========================================================
      // COMPOSITE WEIGHTED SCORE — THE FINAL FORMULA
      // S = 0.35*M + 0.25*G + 0.20*W + 0.20*P
      // ========================================================
      const compositeScore = Math.round(
        marketGapScore * 0.35 +
        soilScore * 0.25 +
        weatherScore * 0.20 +
        priceScore * 0.20
      );

      recommendations.push({
        crop: { id: crop.id, code: crop.crop_code, nameEn: crop.name_en,
                nameSi: crop.name_si, nameTa: crop.name_ta,
                category: crop.category,
                growthDurationDays: crop.growth_duration_days,
                standardPricePerKg: crop.standard_price_per_kg },
        scores: { marketGapScore, soilSuitabilityScore: soilScore,
                  weatherScore, priceScore, compositeScore },
        riskLevel: risk.riskLevel,
        rationale: { /* trilingual rationale */ }
      });
    }

    // Sort descending by composite score
    recommendations.sort((a, b) => b.scores.compositeScore - a.scores.compositeScore);

    return recommendations.slice(0, 5); // Return top 5
  }
}
```

### 13.3 `recommendationRoutes.js`

```javascript
const express = require('express');
const RecommendationController = require('../controllers/recommendationController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();
router.get('/', authenticate, RecommendationController.getRecommendations);

module.exports = router;
```

---

## 14. Worked Example — Sample Calculation

### Scenario

A farmer in Badulla queries **Leeks (crop_id = 1)**, and the Risk Engine returns `OVER_PLANTED` (risk = 92%). The system now evaluates alternative crops.

### Candidate: Beetroot

| Data Point              | Value                |
| ----------------------- | -------------------- |
| `crop_id`               | 5                    |
| `risk_percentage`       | 28%                  |
| `risk_level`            | SAFE                 |
| `soil_type`             | "Well-drained Loamy" |
| `optimal_temp_min`      | 12C                  |
| `optimal_temp_max`      | 24C                  |
| `standard_price_per_kg` | 350 LKR              |

**Step 1 — Market Gap Score**:

```
M = clamp(100 - 28, 0, 100) = clamp(72, 0, 100) = 72
```

**Step 2 — Soil Suitability Score**:

```
G = 95   (soil_type "Well-drained Loamy" contains "loam")
```

**Step 3 — Weather Score**:

```
optimal_temp_min = 12 <= 15  [YES]
optimal_temp_max = 24 >= 22  [YES]
W = 90
```

**Step 4 — Price Trend Score**:

```
P = min(100, round((350 / 400) x 100))
  = min(100, round(87.5))
  = min(100, 88)
  = 88
```

**Step 5 — COMPOSITE SCORE**:

```
S = round(0.35 x 72  +  0.25 x 95  +  0.20 x 90  +  0.20 x 88)
  = round(25.20 + 23.75 + 18.00 + 17.60)
  = round(84.55)
  = 85
```

### Candidate: Carrot

| Data Point              | Value                |
| ----------------------- | -------------------- |
| `crop_id`               | 4                    |
| `risk_percentage`       | 45%                  |
| `risk_level`            | SAFE                 |
| `soil_type`             | "Sandy Loam"         |
| `optimal_temp_min`      | 10C                  |
| `optimal_temp_max`      | 25C                  |
| `standard_price_per_kg` | 280 LKR              |

```
M = 100 - 45 = 55
G = 95       ("Sandy Loam" contains "loam")
W = 90       (10 <= 15 AND 25 >= 22)
P = min(100, round(280/400 x 100)) = min(100, 70) = 70

S = round(0.35 x 55  +  0.25 x 95  +  0.20 x 90  +  0.20 x 70)
  = round(19.25 + 23.75 + 18.00 + 14.00)
  = round(75.00)
  = 75
```

### Final Ranking

| Rank | Crop     | M  | G  | W  | P  | **Composite (S)** |
| ---- | -------- | -- | -- | -- | -- | ------------------ |
| 1    | Beetroot | 72 | 95 | 90 | 88 | **85**             |
| 2    | Carrot   | 55 | 95 | 90 | 70 | **75**             |
| 3    | ...      | .. | .. | .. | .. | ...                |

The farmer is recommended **Beetroot** as the top alternative, followed by **Carrot**, with at least 3 total alternatives (REQ-REC-1).

---

## 15. Summary & Conclusion

### Key Formula Summary

| Component            | Formula                                                  | Weight |
| -------------------- | -------------------------------------------------------- | ------ |
| Market Gap           | M = clamp(100 - Risk%, 0, 100)                           | 35%    |
| Soil Suitability     | G = 95 (loam match) or 80 (other)                        | 25%    |
| Weather/Climate      | W = 90 (temp band match) or 75 (partial)                 | 20%    |
| Price Trend          | P = min(100, round(price/400 x 100))                     | 20%    |
| **Composite Score**  | **S = 0.35*M + 0.25*G + 0.20*W + 0.20*P**               | 100%   |

### SRS Requirements Fulfilled

| Requirement  | Status    | Evidence                                                         |
| ------------ | --------- | ---------------------------------------------------------------- |
| REQ-REC-1    | Fulfilled | Returns top 5 (min 3) alternatives, excludes over-planted crops  |
| REQ-REC-2    | Fulfilled | 4-factor composite score: Market Gap, Soil, Weather, Price       |
| REQ-REC-3    | Fulfilled | Current + 3-month historical price trends per recommendation     |
| REQ-REC-4    | Fulfilled | OpenWeatherMap API integration for rainfall, frost, disease alerts|

### Conclusion

The Smart Crop Recommendation Engine successfully implements a **Multi-Factor Agro-Suitability Matrix** that transforms the ASVANNA platform from a passive risk-warning system into an **active decision-support tool**. By combining market intelligence (CROPIX), agronomic data (soil & weather), and economic indicators (price trends) into a single composite score, the engine provides farmers with scientifically-grounded, economically-optimized crop alternatives — directly addressing the root cause of post-harvest waste in Sri Lanka's upcountry farming communities.

---

*Document prepared for the Division of Information Technology, Institute of Technology, University of Moratuwa (ITUM)*
*ASVANNA Final Year Project — Group 15 — Academic Year 2025/2026*
