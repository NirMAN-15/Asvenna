# 🏛️ ASVANNA System Architecture & Design Specification

## 1. Architectural Overview

ASVANNA is organized around a multi-tier, decoupled architecture designed for high availability, offline resilience in rural agricultural zones, and real-time synchronization.

```mermaid
graph TD
    subgraph Presentation Tier
        MobileApp["Farmer & Buyer Mobile App<br/>(Flutter / Dart)"]
        WebAdmin["Divisional Officer & Admin Portal<br/>(React.js / Vite / Tailwind)"]
    end

    subgraph Application Tier
        APIGateway["Express.js RESTful API Server"]
        RiskEngine["Predictive Risk Engine<br/>(Demand vs Supply Analyzer)"]
        RecEngine["Smart Crop Recommendation Engine<br/>(Composite 4-Factor Scorer)"]
        GeoService["Geofencing & Proximity Engine<br/>(Haversine 5km - 20km)"]
        NotifyService["Notification & Broadcast Service<br/>(FCM & SMS Fallback)"]
    end

    subgraph Data Tier
        PostgreSQL[("PostgreSQL 15<br/>Relational Persistence")]
        FirebaseRTDB[("Firebase Real-time DB<br/>Live Synchronization")]
        LocalCache[("Local SQLite / Storage<br/>Offline First Queue")]
    end

    subgraph External Services
        CROPIX["CROPIX National Demand API"]
        WeatherAPI["OpenWeatherMap API"]
        SMSGateway["Dialog/Mobitel SMS Gateway"]
    end

    MobileApp <--> APIGateway
    MobileApp <--> FirebaseRTDB
    MobileApp <--> LocalCache
    WebAdmin <--> APIGateway

    APIGateway <--> RiskEngine
    APIGateway <--> RecEngine
    APIGateway <--> GeoService
    APIGateway <--> NotifyService

    APIGateway <--> PostgreSQL
    NotifyService <--> SMSGateway
    RiskEngine <--> CROPIX
    RecEngine <--> WeatherAPI
```

---

## 2. Predictive Risk Engine Mathematical Model

The risk calculation algorithm monitors regional crop saturation:

$$\text{Estimated Regional Supply (kg)} = \sum (\text{Planted Acres}_i \times \text{Average Yield per Acre (kg)})$$

$$\text{Risk Ratio (\%)} = \left( \frac{\text{Estimated Regional Supply (kg)}}{\text{CROPIX Regional Demand Benchmark (kg)}} \right) \times 100$$

### Risk Tiers:
1. **Safe Level (Green)**: $\text{Risk Ratio} < 70\%$
2. **At-Risk Warning (Amber)**: $70\% \le \text{Risk Ratio} \le 85\%$
3. **Over-Planted Critical (Red)**: $\text{Risk Ratio} > 85\%$ *(Triggers emergency warning push broadcasts and crop substitution recommendation)*

---

## 3. Recommendation Composite Score Formula

$$\text{Composite Score} = (0.35 \times S_{\text{market\_gap}}) + (0.25 \times S_{\text{soil}}) + (0.20 \times S_{\text{weather}}) + (0.20 \times S_{\text{price\_trend}})$$
