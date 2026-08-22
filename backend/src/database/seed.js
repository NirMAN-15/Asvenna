const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seedData() {
  console.log('🌱 Seeding initial data for ASVANNA (Bandarawela Pilot)...');
  try {
    // 1. Seed Master Crops (Upcountry Perishable Vegetables)
    const crops = [
      { code: 'LEEKS', en: 'Leeks', si: 'ලීක්ස්', ta: 'லீக்ஸ்', duration: 90, tempMin: 12, tempMax: 22, rainMin: 1200, rainMax: 2000, soil: 'Sandy Loam', yieldPerAcre: 8500, price: 280.00 },
      { code: 'CABBAGE', en: 'Cabbage', si: 'ගෝවා', ta: 'முட்டைக்கோஸ்', duration: 75, tempMin: 15, tempMax: 24, rainMin: 1000, rainMax: 1800, soil: 'Clay Loam', yieldPerAcre: 12000, price: 190.00 },
      { code: 'CARROT', en: 'Carrot', si: 'කැරට්', ta: 'கேரட்', duration: 80, tempMin: 14, tempMax: 22, rainMin: 1000, rainMax: 1600, soil: 'Deep Loam', yieldPerAcre: 9500, price: 320.00 },
      { code: 'BEETROOT', en: 'Beetroot', si: 'බීට්රූට්', ta: 'பீட்ரூட்', duration: 70, tempMin: 15, tempMax: 25, rainMin: 800, rainMax: 1500, soil: 'Well-drained Loam', yieldPerAcre: 7800, price: 240.00 },
      { code: 'POTATO', en: 'Upcountry Potato', si: 'අර්තාපල්', ta: 'உருளைக்கிழங்கு', duration: 100, tempMin: 12, tempMax: 20, rainMin: 1200, rainMax: 1800, soil: 'Loose Rich Loam', yieldPerAcre: 11000, price: 380.00 },
      { code: 'KNOL_KHOL', en: 'Knol Khol', si: 'නෝකෝල්', ta: 'நோல்கோல்', duration: 60, tempMin: 14, tempMax: 24, rainMin: 900, rainMax: 1500, soil: 'Loamy', yieldPerAcre: 6500, price: 160.00 },
      { code: 'BELL_PEPPER', en: 'Bell Pepper (Capsicum)', si: 'මාළු මිරිස්', ta: 'குடைமிளகாய்', duration: 85, tempMin: 18, tempMax: 28, rainMin: 900, rainMax: 1400, soil: 'Rich Loam', yieldPerAcre: 7200, price: 420.00 },
      { code: 'TOMATO', en: 'Tomato', si: 'තක්කාලි', ta: 'தக்காளி', duration: 75, tempMin: 18, tempMax: 27, rainMin: 800, rainMax: 1300, soil: 'Sandy Clay Loam', yieldPerAcre: 10000, price: 210.00 }
    ];

    for (const crop of crops) {
      await db.query(
        `INSERT INTO crops (crop_code, name_en, name_si, name_ta, growth_duration_days, optimal_temp_min, optimal_temp_max, rainfall_min_mm, rainfall_max_mm, soil_type, avg_yield_per_acre_kg, standard_price_per_kg)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (crop_code) DO NOTHING`,
        [crop.code, crop.en, crop.si, crop.ta, crop.duration, crop.tempMin, crop.tempMax, crop.rainMin, crop.rainMax, crop.soil, crop.yieldPerAcre, crop.price]
      );
    }
    console.log('✅ Master crops seeded');

    // 2. Seed Default Users
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('asvanna123', salt);

    const users = [
      { name: 'Super Admin', phone: '0770000000', nic: '199500000000', email: 'admin@asvanna.lk', role: 'ADMIN', dist: 'Badulla', div: 'Bandarawela', lat: 6.8258, lng: 80.9982, verified: true },
      { name: 'Sunil Weerasinghe (DO Officer)', phone: '0771234567', nic: '198512345678', email: 'officer.bandarawela@agrarian.gov.lk', role: 'OFFICER', dist: 'Badulla', div: 'Bandarawela', lat: 6.8290, lng: 80.9995, verified: true },
      { name: 'Kapila Bandara (Farmer)', phone: '0712345678', nic: '197823456789', email: 'kapila.farmer@gmail.com', role: 'FARMER', dist: 'Badulla', div: 'Bandarawela', lat: 6.8320, lng: 81.0120, verified: true },
      { name: 'Chaminda Silva (Farmer)', phone: '0719876543', nic: '198234567890', email: 'chaminda.farmer@gmail.com', role: 'FARMER', dist: 'Badulla', div: 'Bandarawela', lat: 6.8150, lng: 80.9850, verified: true },
      { name: 'Bandarawela Grand Hotel (Buyer)', phone: '0572222222', nic: '200134567890', email: 'purchase@grandbandarawela.com', role: 'BUYER', dist: 'Badulla', div: 'Bandarawela', lat: 6.8265, lng: 80.9970, verified: true }
    ];

    for (const u of users) {
      await db.query(
        `INSERT INTO users (full_name, phone, nic, email, password_hash, role, district, division, latitude, longitude, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (phone) DO NOTHING`,
        [u.name, u.phone, u.nic, u.email, defaultPassword, u.role, u.dist, u.div, u.lat, u.lng, u.verified]
      );
    }
    console.log('✅ Demo users seeded (Password: asvanna123)');

    // 3. Seed CROPIX Benchmarks
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const cropixDemands = [
      { cropId: 1, natDemand: 450000, regQuota: 95000, gap: 15000 },  // Leeks
      { cropId: 2, natDemand: 600000, regQuota: 120000, gap: 5000 },  // Cabbage
      { cropId: 3, natDemand: 520000, regQuota: 110000, gap: 28000 }, // Carrot
      { cropId: 4, natDemand: 380000, regQuota: 75000, gap: 32000 },  // Beetroot
      { cropId: 5, natDemand: 700000, regQuota: 150000, gap: 40000 }, // Potato
      { cropId: 6, natDemand: 250000, regQuota: 50000, gap: 18000 },  // Knol Khol
      { cropId: 7, natDemand: 320000, regQuota: 65000, gap: 22000 },  // Bell Pepper
      { cropId: 8, natDemand: 580000, regQuota: 115000, gap: 8000 }   // Tomato
    ];

    for (const d of cropixDemands) {
      await db.query(
        `INSERT INTO cropix_demand_benchmarks (crop_id, district, target_month, target_year, national_demand_kg, regional_quota_kg, current_market_gap_kg)
         VALUES ($1, 'Badulla', $2, $3, $4, $5, $6)
         ON CONFLICT (crop_id, district, target_month, target_year) DO UPDATE
         SET national_demand_kg = EXCLUDED.national_demand_kg, regional_quota_kg = EXCLUDED.regional_quota_kg, current_market_gap_kg = EXCLUDED.current_market_gap_kg`,
        [d.cropId, currentMonth, currentYear, d.natDemand, d.regQuota, d.gap]
      );
    }
    console.log('✅ CROPIX demand benchmarks seeded');

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedData();
