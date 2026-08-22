class ApiEndpoints {
  static const String baseUrl = "http://10.0.2.2:5000/api/v1"; // Android Emulator localhost
  
  static const String login = "$baseUrl/auth/login";
  static const String register = "$baseUrl/auth/register";
  static const String profile = "$baseUrl/auth/me";
  static const String logPlanting = "$baseUrl/planting/log";
  static const String farmerPlantings = "$baseUrl/planting/farmer";
  static const String cropRisk = "$baseUrl/risk/crop";
  static const String recommendations = "$baseUrl/recommendations";
  static const String marketplaceSearch = "$baseUrl/marketplace/search-nearby";
  static const String listSurplus = "$baseUrl/marketplace/list";
  static const String placeOrder = "$baseUrl/marketplace/orders";
  static const String broadcasts = "$baseUrl/broadcasts";
}
