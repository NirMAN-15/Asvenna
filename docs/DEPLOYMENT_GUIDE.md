# 🚀 ASVANNA Deployment & Operations Guide

## 1. Quick Start via Docker Compose

Run the entire ecosystem (Database, Node.js Backend API, and React Web Dashboard) with a single command:

```bash
docker-compose up --build -d
```

- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`
- **Web Admin Dashboard**: `http://localhost:3000`
- **PostgreSQL Database**: `localhost:5432`

## 2. Manual Service Setup

### Step 1: PostgreSQL Setup
```bash
createdb asvanna_db
psql -d asvanna_db -f backend/src/database/schema.sql
```

### Step 2: Backend REST API
```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

### Step 3: Web Admin Portal
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Mobile Application
```bash
cd mobile
flutter pub get
flutter run
```
