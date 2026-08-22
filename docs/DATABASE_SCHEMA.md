# 🗄️ ASVANNA Database Schema (PostgreSQL 15)

## Entity Relationship Overview

- **users**: Farmers, Divisional Officers, Commercial Buyers, Super Admins.
- **crops**: Master dataset of upcountry crops (Leeks, Cabbage, Carrot, Beetroot, Potato, etc.).
- **planting_records**: GPS-tagged cultivation entries with status tracking (`PLANTED`, `GROWING`, `HARVESTED`).
- **cropix_demand_benchmarks**: Monthly regional demand quotas from the national digital platform.
- **risk_assessments**: Historic and evaluated risk calculation snapshots.
- **crop_recommendations**: Cached composite recommendation rankings.
- **marketplace_listings**: Surplus crop listings with expiration and location coordinates.
- **marketplace_orders**: Direct negotiation offers between buyers and farmers.
- **broadcast_warnings**: Multi-lingual officer warning broadcasts and recipient logs.
- **audit_logs**: Tamper-evident activity logs for administrative actions.
