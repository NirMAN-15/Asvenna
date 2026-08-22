-- ==============================================================================
-- ASVANNA - Complete PostgreSQL Database Schema
-- Institute of Technology, University of Moratuwa - Final Year Project
-- ==============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    nic VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('FARMER', 'OFFICER', 'BUYER', 'ADMIN')),
    language_preference VARCHAR(10) DEFAULT 'si' CHECK (language_preference IN ('si', 'ta', 'en')),
    district VARCHAR(100) DEFAULT 'Badulla',
    division VARCHAR(100) DEFAULT 'Bandarawela',
    gnd_division VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    fcm_token TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    crop_code VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_si VARCHAR(100) NOT NULL,
    name_ta VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Upcountry Vegetable',
    growth_duration_days INT NOT NULL,
    optimal_temp_min DECIMAL(4, 1),
    optimal_temp_max DECIMAL(4, 1),
    rainfall_min_mm INT,
    rainfall_max_mm INT,
    soil_type VARCHAR(100),
    avg_yield_per_acre_kg DECIMAL(10, 2) NOT NULL,
    standard_price_per_kg DECIMAL(8, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Planting Records Table
CREATE TABLE IF NOT EXISTS planting_records (
    id SERIAL PRIMARY KEY,
    farmer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id INT NOT NULL REFERENCES crops(id),
    land_size_acres DECIMAL(6, 2) NOT NULL CHECK (land_size_acres > 0),
    expected_yield_kg DECIMAL(10, 2) NOT NULL,
    planting_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    district VARCHAR(100) NOT NULL DEFAULT 'Badulla',
    division VARCHAR(100) NOT NULL DEFAULT 'Bandarawela',
    status VARCHAR(20) DEFAULT 'PLANTED' CHECK (status IN ('PLANTED', 'GROWING', 'HARVESTED', 'CANCELLED')),
    entered_by_type VARCHAR(20) DEFAULT 'FARMER' CHECK (entered_by_type IN ('FARMER', 'OFFICER')),
    officer_id INT REFERENCES users(id) ON DELETE SET NULL,
    sync_status VARCHAR(20) DEFAULT 'SYNCED' CHECK (sync_status IN ('PENDING', 'SYNCED', 'FAILED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CROPIX Demand Benchmarks Table
CREATE TABLE IF NOT EXISTS cropix_demand_benchmarks (
    id SERIAL PRIMARY KEY,
    crop_id INT NOT NULL REFERENCES crops(id),
    district VARCHAR(100) NOT NULL,
    target_month INT NOT NULL CHECK (target_month BETWEEN 1 AND 12),
    target_year INT NOT NULL,
    national_demand_kg DECIMAL(12, 2) NOT NULL,
    regional_quota_kg DECIMAL(12, 2) NOT NULL,
    current_market_gap_kg DECIMAL(12, 2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(crop_id, district, target_month, target_year)
);

-- 5. Predictive Risk Assessments Table
CREATE TABLE IF NOT EXISTS risk_assessments (
    id SERIAL PRIMARY KEY,
    crop_id INT NOT NULL REFERENCES crops(id),
    district VARCHAR(100) NOT NULL,
    total_planted_acres DECIMAL(10, 2) NOT NULL,
    estimated_supply_kg DECIMAL(12, 2) NOT NULL,
    target_demand_kg DECIMAL(12, 2) NOT NULL,
    risk_percentage DECIMAL(5, 2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('SAFE', 'WARNING', 'OVER_PLANTED')),
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Smart Crop Recommendations Table
CREATE TABLE IF NOT EXISTS crop_recommendations (
    id SERIAL PRIMARY KEY,
    crop_id INT NOT NULL REFERENCES crops(id),
    district VARCHAR(100) NOT NULL,
    suitability_score DECIMAL(5, 2) NOT NULL,
    market_gap_score DECIMAL(5, 2) NOT NULL,
    weather_score DECIMAL(5, 2) NOT NULL,
    price_trend_score DECIMAL(5, 2) NOT NULL,
    composite_score DECIMAL(5, 2) NOT NULL,
    rationale TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Zero-Waste Marketplace Listings Table
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id SERIAL PRIMARY KEY,
    farmer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id INT NOT NULL REFERENCES crops(id),
    quantity_kg DECIMAL(10, 2) NOT NULL CHECK (quantity_kg > 0),
    price_per_kg DECIMAL(8, 2) NOT NULL CHECK (price_per_kg > 0),
    available_from DATE NOT NULL,
    available_to DATE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    pickup_address TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'SOLD', 'EXPIRED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Marketplace Orders & Offers Table
CREATE TABLE IF NOT EXISTS marketplace_orders (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_quantity_kg DECIMAL(10, 2) NOT NULL,
    offered_price_per_kg DECIMAL(8, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'COUNTER_OFFER', 'COMPLETED', 'CANCELLED')),
    response_deadline TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Divisional Officer Broadcast Warnings Table
CREATE TABLE IF NOT EXISTS broadcast_warnings (
    id SERIAL PRIMARY KEY,
    officer_id INT NOT NULL REFERENCES users(id),
    title_en VARCHAR(200) NOT NULL,
    title_si VARCHAR(200) NOT NULL,
    title_ta VARCHAR(200) NOT NULL,
    message_en TEXT NOT NULL,
    message_si TEXT NOT NULL,
    message_ta TEXT NOT NULL,
    target_district VARCHAR(100) NOT NULL,
    target_division VARCHAR(100),
    target_crop_id INT REFERENCES crops(id),
    severity VARCHAR(20) DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    sent_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for Fast Queries
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_planting_farmer ON planting_records(farmer_id);
CREATE INDEX IF NOT EXISTS idx_planting_crop_dist ON planting_records(crop_id, district);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_location ON marketplace_listings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_risk_crop_district ON risk_assessments(crop_id, district);
