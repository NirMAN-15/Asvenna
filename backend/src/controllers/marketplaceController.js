const db = require('../config/database');
const GeofencingService = require('../services/geofencingService');
const MarketplaceService = require('../services/marketplaceService');
const ApiResponse = require('../utils/apiResponse');

class MarketplaceController {
  static async createListing(req, res, next) {
    try {
      const { crop_id, quantity_kg, price_per_kg, available_from, available_to, latitude, longitude, pickup_address, description } = req.body;

      const result = await db.query(
        `INSERT INTO marketplace_listings
         (farmer_id, crop_id, quantity_kg, price_per_kg, available_from, available_to, latitude, longitude, pickup_address, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'AVAILABLE')
         RETURNING *`,
        [req.user.id, crop_id, quantity_kg, price_per_kg, available_from, available_to, latitude, longitude, pickup_address, description]
      );

      const listing = result.rows[0];
      await MarketplaceService.syncListingToFirebase(listing);

      return ApiResponse.success(res, listing, 'Surplus listing published to marketplace', 201);
    } catch (err) {
      next(err);
    }
  }

  static async searchNearby(req, res, next) {
    try {
      const { lat, lng, radius_km = 5.0, crop_id } = req.query;
      if (!lat || !lng) {
        return ApiResponse.error(res, 'Buyer coordinates (lat, lng) are required for proximity search', 400);
      }

      let query = `
        SELECT ml.*, c.name_en, c.name_si, c.name_ta, c.crop_code, u.full_name as farmer_name, u.phone as farmer_phone
        FROM marketplace_listings ml
        JOIN crops c ON ml.crop_id = c.id
        JOIN users u ON ml.farmer_id = u.id
        WHERE ml.status = 'AVAILABLE'
      `;
      const params = [];
      if (crop_id) {
        params.push(crop_id);
        query += ` AND ml.crop_id = $${params.length}`;
      }

      const result = await db.query(query, params);
      const nearbyListings = GeofencingService.filterByProximity(lat, lng, result.rows, parseFloat(radius_km));

      return ApiResponse.success(res, nearbyListings);
    } catch (err) {
      next(err);
    }
  }

  static async placeOrder(req, res, next) {
    try {
      const { listing_id, requested_quantity_kg, offered_price_per_kg, notes } = req.body;

      // 30 minute response window
      const responseDeadline = new Date(Date.now() + 30 * 60 * 1000);

      const result = await db.query(
        `INSERT INTO marketplace_orders
         (listing_id, buyer_id, requested_quantity_kg, offered_price_per_kg, status, response_deadline, notes)
         VALUES ($1, $2, $3, $4, 'PENDING', $5, $6)
         RETURNING *`,
        [listing_id, req.user.id, requested_quantity_kg, offered_price_per_kg, responseDeadline, notes]
      );

      return ApiResponse.success(res, result.rows[0], 'Order offer submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MarketplaceController;
