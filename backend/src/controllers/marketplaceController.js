const db = require('../config/database');
const GeofencingService = require('../services/geofencingService');
const MarketplaceService = require('../services/marketplaceService');
const realtimeStore = require('../services/realtimeStore');
const ApiResponse = require('../utils/apiResponse');

class MarketplaceController {
  static async createListing(req, res, next) {
    try {
      const { crop_id, quantity_kg, price_per_kg, available_from, available_to, latitude, longitude, pickup_address, description } = req.body;
      const userId = req.user ? req.user.id : 2;

      let listing;
      if (db.query) {
        const result = await db.query(
          `INSERT INTO marketplace_listings
           (farmer_id, crop_id, quantity_kg, price_per_kg, available_from, available_to, latitude, longitude, pickup_address, description, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'AVAILABLE')
           RETURNING *`,
          [userId, crop_id, quantity_kg, price_per_kg, available_from || '2026-08-25', available_to || '2026-09-05', latitude, longitude, pickup_address, description]
        );
        listing = result.rows[0];
      }

      if (!listing) {
        listing = {
          id: Date.now(),
          farmer_id: userId,
          farmer_name: 'Sunil Shantha',
          crop_id: Number(crop_id),
          quantity_kg: Number(quantity_kg),
          price_per_kg: Number(price_per_kg),
          pickup_address,
          latitude: Number(latitude),
          longitude: Number(longitude),
          description,
          status: 'AVAILABLE',
          created_at: new Date().toISOString()
        };
        if (db.fileDb) {
          db.fileDb.marketplace_listings.unshift(listing);
          if (db.saveDb) db.saveDb(db.fileDb);
        }
      }

      return ApiResponse.success(res, listing, 'Surplus listing published to zero-waste marketplace', 201);
    } catch (err) {
      next(err);
    }
  }

  static async searchNearby(req, res, next) {
    try {
      const { lat = 6.8322, lng = 80.9980, radius_km = 5.0, crop_id } = req.query;

      let listings = [];
      if (db.query) {
        const result = await db.query(`SELECT * FROM marketplace_listings WHERE status = 'AVAILABLE'`);
        listings = result.rows;
      }
      if (!listings || listings.length === 0) {
        const fileDb = db.fileDb || { marketplace_listings: [] };
        listings = fileDb.marketplace_listings;
      }

      const nearbyListings = GeofencingService.filterByProximity(parseFloat(lat), parseFloat(lng), listings, parseFloat(radius_km));
      return ApiResponse.success(res, nearbyListings);
    } catch (err) {
      next(err);
    }
  }

  static async placeOrder(req, res, next) {
    try {
      const { listing_id, requested_quantity_kg, offered_price_per_kg, notes } = req.body;
      const userId = req.user ? req.user.id : 3;

      const responseDeadline = new Date(Date.now() + 30 * 60 * 1000);
      const order = {
        id: Date.now(),
        listing_id: Number(listing_id),
        buyer_id: userId,
        requested_quantity_kg: Number(requested_quantity_kg),
        offered_price_per_kg: Number(offered_price_per_kg),
        status: 'PENDING',
        response_deadline: responseDeadline.toISOString(),
        notes: notes || 'Direct order from local buyer'
      };

      if (db.fileDb) {
        db.fileDb.marketplace_orders.unshift(order);
        if (db.saveDb) db.saveDb(db.fileDb);
      }

      // Push initial system chat message
      realtimeStore.addChatMessage(listing_id, order.id, userId, 'Bandarawela Wholesale Buyer', 'BUYER', `Order placed for ${requested_quantity_kg}kg at Rs ${offered_price_per_kg}/kg.`);

      return ApiResponse.success(res, order, 'Order offer submitted successfully (30-minute window)', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getMessages(req, res, next) {
    try {
      const { orderId } = req.params;
      const history = realtimeStore.getChatHistory(orderId);
      return ApiResponse.success(res, history);
    } catch (err) {
      next(err);
    }
  }

  static async sendMessage(req, res, next) {
    try {
      const { orderId } = req.params;
      const { text, listingId = 1 } = req.body;
      const user = req.user || { id: 3, full_name: 'Bandarawela Buyer', role: 'BUYER' };

      const msg = realtimeStore.addChatMessage(listingId, orderId, user.id, user.full_name, user.role, text);
      return ApiResponse.success(res, msg, 'Message sent', 201);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MarketplaceController;
