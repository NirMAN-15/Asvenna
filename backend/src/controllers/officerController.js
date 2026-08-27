const bcrypt = require('bcryptjs');
const db = require('../config/database');
const ApiResponse = require('../utils/apiResponse');

class OfficerController {
  static async getFarmerDirectory(req, res, next) {
    try {
      let farmers = [];
      if (db.query) {
        const result = await db.query(`SELECT id, full_name, phone, nic, district, division, is_active FROM users WHERE role = 'FARMER'`);
        farmers = result.rows;
      }
      if (!farmers || farmers.length === 0) {
        const fileDb = db.fileDb || { users: [] };
        farmers = fileDb.users.filter(u => u.role === 'FARMER');
      }

      return ApiResponse.success(res, farmers);
    } catch (err) {
      next(err);
    }
  }

  static async registerFarmerProxy(req, res, next) {
    try {
      const { full_name, phone, nic, district = 'Badulla', division = 'Bandarawela', gnd_division, address } = req.body;
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = await bcrypt.hash('asvanna123', salt);

      let newFarmer;
      if (db.query) {
        const result = await db.query(
          `INSERT INTO users (full_name, phone, nic, password_hash, role, district, division, gnd_division, address, is_verified)
           VALUES ($1, $2, $3, $4, 'FARMER', $5, $6, $7, $8, true)
           RETURNING id, full_name, phone, nic, district, division, gnd_division, is_verified, created_at`,
          [full_name, phone, nic, defaultPassword, district, division, gnd_division, address]
        );
        newFarmer = result.rows[0];
      }

      if (!newFarmer) {
        newFarmer = {
          id: Date.now(),
          full_name,
          phone,
          nic,
          password_hash: defaultPassword,
          role: 'FARMER',
          district,
          division,
          gnd_division: gnd_division || 'Bandarawela Central',
          address: address || 'Bandarawela',
          is_verified: true,
          created_at: new Date().toISOString()
        };
        if (db.fileDb) {
          db.fileDb.users.unshift(newFarmer);
          if (db.saveDb) db.saveDb(db.fileDb);
        }
      }

      return ApiResponse.success(res, newFarmer, 'Farmer registered via proxy by Divisional Officer', 201);
    } catch (err) {
      next(err);
    }
  }

  static async exportReport(req, res, next) {
    try {
      const report = {
        title: 'Department of Agriculture - Bandarawela Regional Cultivation Summary',
        generatedAt: new Date().toISOString(),
        officer: 'W. M. Bandara (DO Bandarawela)',
        district: 'Badulla',
        division: 'Bandarawela',
        activeFarmers: 142,
        totalCultivatedAcres: 184.5,
        cropDistribution: [
          { crop: 'Leeks', acreage: 68.0, riskStatus: 'OVER_PLANTED', riskPercentage: 92.5 },
          { crop: 'Cabbage', acreage: 45.5, riskStatus: 'WARNING', riskPercentage: 78.0 },
          { crop: 'Carrot', acreage: 38.0, riskStatus: 'SAFE', riskPercentage: 54.2 },
          { crop: 'Beetroot', acreage: 33.0, riskStatus: 'SAFE', riskPercentage: 42.1 }
        ]
      };
      return ApiResponse.success(res, report, 'Regional cultivation report generated');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OfficerController;
