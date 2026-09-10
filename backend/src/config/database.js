const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('./config');

const dataDir = path.join(__dirname, '../../data');
const dbFilePath = path.join(dataDir, 'asvanna_db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial Default Dataset for Bandarawela Pilot
const initialDbState = {
  users: [
    { id: 1, full_name: 'W. M. Bandara', phone: '0771234567', nic: '851234567V', password_hash: '$2a$10$wN1aP0/zB00vA5zLz.vV/uE221122334455', role: 'OFFICER', district: 'Badulla', division: 'Bandarawela', language_preference: 'si' },
    { id: 2, full_name: 'Sunil Shantha', phone: '0712345678', nic: '782345678V', password_hash: '$2a$10$wN1aP0/zB00vA5zLz.vV/uE221122334455', role: 'FARMER', district: 'Badulla', division: 'Bandarawela', land_size: 2.5, language_preference: 'si' },
    { id: 3, full_name: 'Bandarawela Traders', phone: '0572222222', nic: '903456789V', password_hash: '$2a$10$wN1aP0/zB00vA5zLz.vV/uE221122334455', role: 'BUYER', district: 'Badulla', division: 'Bandarawela', language_preference: 'en' },
    { id: 4, full_name: 'System Admin', phone: '0770000000', nic: '990000000V', password_hash: '$2a$10$wN1aP0/zB00vA5zLz.vV/uE221122334455', role: 'ADMIN', district: 'Badulla', division: 'Bandarawela', language_preference: 'en' }
  ],
  crops: [
    { id: 1, crop_code: 'LEEKS', name_en: 'Leeks', name_si: 'ලීක්ස්', name_ta: 'லீக்ஸ்', category: 'Upcountry Vegetable', growth_duration_days: 90, avg_yield_per_acre_kg: 8000, standard_price_per_kg: 180.00 },
    { id: 2, crop_code: 'CABBAGE', name_en: 'Cabbage', name_si: 'ගෝවා', name_ta: 'முட்டைக்கோஸ்', category: 'Upcountry Vegetable', growth_duration_days: 75, avg_yield_per_acre_kg: 12000, standard_price_per_kg: 120.00 },
    { id: 3, crop_code: 'CARROT', name_en: 'Carrot', name_si: 'කැරට්', name_ta: 'கேரட்', category: 'Upcountry Vegetable', growth_duration_days: 85, avg_yield_per_acre_kg: 10000, standard_price_per_kg: 220.00 },
    { id: 4, crop_code: 'BEETROOT', name_en: 'Beetroot', name_si: 'බීට්රූට්', name_ta: 'பீட்ரூට්', category: 'Upcountry Vegetable', growth_duration_days: 70, avg_yield_per_acre_kg: 9000, standard_price_per_kg: 250.00 },
    { id: 5, crop_code: 'POTATO', name_en: 'Potato', name_si: 'අල', name_ta: 'உருளைக்கிழங்கு', category: 'Upcountry Vegetable', growth_duration_days: 100, avg_yield_per_acre_kg: 14000, standard_price_per_kg: 280.00 }
  ],
  planting_records: [
    { id: 1, farmer_id: 2, farmer_name: 'Sunil Shantha', crop_id: 1, name_en: 'Leeks', name_si: 'ලීක්ස්', land_size_acres: 2.0, expected_yield_kg: 16000, planting_date: '2026-08-01', expected_harvest_date: '2026-11-01', latitude: 6.8322, longitude: 80.9980, district: 'Badulla', division: 'Bandarawela', status: 'PLANTED', entered_by_type: 'FARMER' },
    { id: 2, farmer_id: 2, farmer_name: 'Sunil Shantha', crop_id: 2, name_en: 'Cabbage', name_si: 'ගෝවා', land_size_acres: 3.5, expected_yield_kg: 42000, planting_date: '2026-08-10', expected_harvest_date: '2026-10-25', latitude: 6.8350, longitude: 80.9995, district: 'Badulla', division: 'Bandarawela', status: 'PLANTED', entered_by_type: 'FARMER' }
  ],
  marketplace_listings: [
    { id: 1, farmer_id: 2, farmer_name: 'Sunil Shantha', farmer_phone: '0712345678', crop_id: 1, crop_name: 'Leeks (ලීක්ස්)', quantity_kg: 500, price_per_kg: 180.00, available_from: '2026-08-25', available_to: '2026-09-05', latitude: 6.8322, longitude: 80.9980, pickup_address: 'Main St, Bandarawela', status: 'AVAILABLE' },
    { id: 2, farmer_id: 2, farmer_name: 'Sunil Shantha', farmer_phone: '0712345678', crop_id: 3, crop_name: 'Carrot (කැරට්)', quantity_kg: 300, price_per_kg: 220.00, available_from: '2026-08-26', available_to: '2026-09-08', latitude: 6.8340, longitude: 80.9950, pickup_address: 'Agrarian Hub, Bandarawela', status: 'AVAILABLE' }
  ],
  marketplace_orders: [
    { id: 1788874100001, order_code: 'ASV-ORD-8812', listing_id: 1, buyer_id: 1788873169736, buyer_name: 'Miyuni Dewanga', crop_name: 'Carrots (කැරට්)', crop_key: 'Carrot', quantity_kg: 450, price_per_kg: 280, total_price: 126000, farmer_name: 'Sunil Shantha', farmer_phone: '0712345678', farmer_location: 'Green Valley Farms, Bandarawela North', date_received: '2026-09-08T10:30:00.000Z', status: 'DELIVERED', payment_method: 'Bank Transfer (Direct Agri-Pay)', pickup_address: 'Main St, Bandarawela North', notes: 'Procured Grade-A Carrots directly at farm gate with quality certificate', created_at: '2026-09-08T09:15:00.000Z' },
    { id: 1788874100002, order_code: 'ASV-ORD-8745', listing_id: 5, buyer_id: 1788873169736, buyer_name: 'Miyuni Dewanga', crop_name: 'Highland Leeks (ලීක්ස්)', crop_key: 'Leeks', quantity_kg: 650, price_per_kg: 180, total_price: 117000, farmer_name: 'P. Jayampathi', farmer_phone: '0771122334', farmer_location: 'Kinigama Valley, Bandarawela', date_received: '2026-09-05T08:15:00.000Z', status: 'DELIVERED', payment_method: 'Cash On Delivery (Hub Receipt)', pickup_address: 'Kinigama Valley Depot, Bandarawela', notes: 'Early morning harvest batch, washed and bundled in 25kg crates', created_at: '2026-09-05T07:00:00.000Z' },
    { id: 1788874100003, order_code: 'ASV-ORD-8620', listing_id: 4, buyer_id: 1788873169736, buyer_name: 'Miyuni Dewanga', crop_name: 'Red Onions (රතු ළූණු Grade A)', crop_key: 'Onion', quantity_kg: 300, price_per_kg: 310, total_price: 93000, farmer_name: 'K. G. Dharmasiri', farmer_phone: '0773344556', farmer_location: 'Welimada Agro Hub', date_received: '2026-09-02T14:20:00.000Z', status: 'DELIVERED', payment_method: 'Bank Transfer', pickup_address: 'Welimada Agro Hub Center', notes: 'Cured red onions from Welimada division, moisture level verified', created_at: '2026-09-02T12:00:00.000Z' },
    { id: 1788874100004, order_code: 'ASV-ORD-8511', listing_id: 3, buyer_id: 1788873169736, buyer_name: 'Miyuni Dewanga', crop_name: 'Bird\'s Eye Chili (නයි මිරිස්)', crop_key: 'Chili', quantity_kg: 85, price_per_kg: 720, total_price: 61200, farmer_name: 'G. W. Bandara', farmer_phone: '0714455667', farmer_location: 'Hillside Organic, Haputale Slopes', date_received: '2026-08-29T11:45:00.000Z', status: 'DELIVERED', payment_method: 'Direct Mobile Pay', pickup_address: 'Haputale Junction Collection Center', notes: 'High pungency green pods, certified organic harvest', created_at: '2026-08-29T09:30:00.000Z' },
    { id: 1788874100005, order_code: 'ASV-ORD-8430', listing_id: 2, buyer_id: 1788873169736, buyer_name: 'Miyuni Dewanga', crop_name: 'Nadu Paddy Bulk (වී)', crop_key: 'Paddy', quantity_kg: 550, price_per_kg: 145, total_price: 79750, farmer_name: 'Saman Kumara', farmer_phone: '0778899112', farmer_location: 'Wewathenna, Bandarawela', date_received: '2026-08-25T16:00:00.000Z', status: 'DELIVERED', payment_method: 'Agrarian Escrow', pickup_address: 'Wewathenna Paddy Mills, Bandarawela', notes: 'Bulk moisture-tested Nadu paddy grain bags delivered to warehouse', created_at: '2026-08-25T13:45:00.000Z' }
  ],
  broadcast_warnings: [
    { id: 1, officer_id: 1, officer_name: 'W. M. Bandara', title_en: 'Emergency Saturation Warning: Leeks', title_si: 'අධික වගා සීමාව පසුකිරීමේ අවවාදයයි: ලීක්ස්', title_ta: 'அவசர எச்சரிக்கை: லீக்ஸ்', message_en: 'Leek planting in Bandarawela region has reached 92% capacity. Avoid new leek sowing.', message_si: 'බණ්ඩාරවෙල කලාපයේ ලීක්ස් වගාව 92% සීමාවට පැමිණ ඇත.', severity: 'CRITICAL', target_district: 'Badulla', target_division: 'Bandarawela', sent_count: 142, created_at: new Date().toISOString() }
  ]
};

function loadDb() {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify(initialDbState, null, 2), 'utf-8');
    return initialDbState;
  }
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return initialDbState;
  }
}

function saveDb(dbData) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database file:', err);
  }
}

const fileDb = loadDb();

let pool = null;
try {
  pool = new Pool(config.db);
  pool.on('connect', () => console.log('📦 Connected to PostgreSQL database:', config.db.database));
} catch (e) {
  // Silence error
}

module.exports = {
  query: async (text, params = []) => {
    if (pool) {
      try {
        const res = await pool.query(text, params);
        if (res && res.rows) return res;
      } catch (e) {
        // Fallback to Persistent Local File DB
      }
    }

    const lower = text.toLowerCase();

    // SELECT Queries
    if (lower.includes('select * from users where phone') || lower.includes('from users where phone')) {
      const phoneVal = params[0];
      const found = fileDb.users.filter(u => u.phone === phoneVal);
      return { rows: found };
    }
    if (lower.includes('select * from users')) {
      return { rows: fileDb.users };
    }
    if (lower.includes('select * from crops')) {
      return { rows: fileDb.crops };
    }
    if (lower.includes('select * from planting_records')) {
      return { rows: fileDb.planting_records };
    }
    if (lower.includes('select * from marketplace_listings')) {
      return { rows: fileDb.marketplace_listings };
    }
    if (lower.includes('select * from broadcast_warnings')) {
      return { rows: fileDb.broadcast_warnings };
    }
    if (lower.includes('select * from marketplace_orders')) {
      return { rows: fileDb.marketplace_orders };
    }

    // INSERT Queries
    if (lower.includes('insert into users')) {
      const newUser = {
        id: Date.now(),
        full_name: params[0],
        phone: params[1],
        nic: params[2],
        password_hash: params[3],
        role: params[4] || 'FARMER',
        district: params[5] || 'Badulla',
        division: params[6] || 'Bandarawela',
        gnd_division: params[7] || 'Bandarawela Central',
        address: params[8] || 'Bandarawela',
        is_verified: true,
        created_at: new Date().toISOString()
      };
      fileDb.users.unshift(newUser);
      saveDb(fileDb);
      return { rows: [newUser] };
    }

    if (lower.includes('insert into planting_records')) {
      const newPlanting = {
        id: Date.now(),
        farmer_id: params[0] || 2,
        farmer_name: 'Sunil Shantha',
        crop_id: Number(params[1]),
        land_size_acres: Number(params[2]),
        expected_yield_kg: Number(params[3]),
        planting_date: params[4] || new Date().toISOString().split('T')[0],
        expected_harvest_date: params[5] || '2026-11-01',
        latitude: Number(params[6] || 6.8322),
        longitude: Number(params[7] || 80.9980),
        district: params[8] || 'Badulla',
        division: params[9] || 'Bandarawela',
        status: 'PLANTED',
        entered_by_type: params[10] || 'FARMER',
        created_at: new Date().toISOString()
      };
      fileDb.planting_records.unshift(newPlanting);
      saveDb(fileDb);
      return { rows: [newPlanting] };
    }

    if (lower.includes('insert into marketplace_listings')) {
      const newListing = {
        id: Date.now(),
        farmer_id: params[0] || 2,
        farmer_name: 'Sunil Shantha',
        farmer_phone: '0712345678',
        crop_id: Number(params[1]),
        quantity_kg: Number(params[2]),
        price_per_kg: Number(params[3]),
        available_from: params[4] || '2026-08-25',
        available_to: params[5] || '2026-09-05',
        latitude: Number(params[6] || 6.8322),
        longitude: Number(params[7] || 80.9980),
        pickup_address: params[8] || 'Bandarawela',
        description: params[9] || '',
        status: 'AVAILABLE',
        created_at: new Date().toISOString()
      };
      fileDb.marketplace_listings.unshift(newListing);
      saveDb(fileDb);
      return { rows: [newListing] };
    }

    if (lower.includes('insert into broadcast_warnings')) {
      const newWarning = {
        id: Date.now(),
        officer_id: params[0] || 1,
        officer_name: 'W. M. Bandara',
        title_en: params[1],
        title_si: params[2],
        title_ta: params[3],
        message_en: params[4],
        message_si: params[5],
        message_ta: params[6],
        target_district: params[7] || 'Badulla',
        target_division: params[8] || 'Bandarawela',
        target_crop_id: params[9] ? Number(params[9]) : null,
        severity: params[10] || 'HIGH',
        sent_count: params[11] || 142,
        created_at: new Date().toISOString()
      };
      fileDb.broadcast_warnings.unshift(newWarning);
      saveDb(fileDb);
      return { rows: [newWarning] };
    }

    return { rows: [] };
  },
  fileDb,
  saveDb
};
