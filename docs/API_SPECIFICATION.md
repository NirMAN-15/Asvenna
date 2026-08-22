# 📡 ASVANNA REST API Specification (v1)

Base URL: `http://localhost:5000/api/v1`

## 1. Authentication Endpoints (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new Farmer, Buyer, or Officer |
| `POST` | `/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/auth/me` | Authenticated | Fetch current user session profile |
| `POST` | `/auth/fcm-token` | Authenticated | Register/update device FCM token |

## 2. Planting & Cultivation Endpoints (`/planting`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/planting/log` | Farmer / Officer | Log GPS plot planting data (or Proxy) |
| `GET` | `/planting/farmer/:farmerId?` | Authenticated | Retrieve farmer planting history |
| `GET` | `/planting/regional-map` | Authenticated | Query aggregated regional cultivation plots |

## 3. Predictive Risk Engine Endpoints (`/risk`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/risk/crop/:cropId` | Authenticated | Calculate instantaneous risk for specific crop |
| `GET` | `/risk/regional-summary` | Authenticated | Get full district crop saturation summary |

## 4. Smart Crop Recommendations (`/recommendations`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/recommendations` | Authenticated | Get 4-factor composite crop alternatives |

## 5. Zero-Waste Marketplace (`/marketplace`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/marketplace/list` | Farmer | Publish surplus produce listing |
| `GET` | `/marketplace/search-nearby`| Authenticated | Haversine proximity search (default 5 km) |
| `POST` | `/marketplace/orders` | Buyer | Submit direct purchase / counter-offer |

## 6. Divisional Officer Management (`/officer` & `/broadcasts`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/officer/farmers` | Officer / Admin | Retrieve full farmer directory |
| `POST` | `/officer/register-farmer-proxy` | Officer / Admin | Register farmer profile without smartphone |
| `POST` | `/broadcasts` | Officer / Admin | Dispatch emergency warning (FCM + SMS) |
| `GET` | `/broadcasts` | Authenticated | View active broadcast announcements |
