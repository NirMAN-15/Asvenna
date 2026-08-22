# 📱 ASVANNA Mobile Application (Flutter)

Cross-platform mobile application designed for Sri Lankan Upcountry Farmers and Local Commercial Buyers.

## ✨ Key Capabilities

- **On-field Planting Logger**: Simple, icon-rich UI with automatic GPS location detection for registering plot land area and crop type.
- **Offline Mode & Sync Queue**: Local caching of planting entries via SharedPreferences/Hive with automatic cloud background sync upon re-establishing network connectivity.
- **Over-Planting Warnings**: Real-time push alert notifications when regional planting saturation exceeds 85% of market demand.
- **Smart Crop Recommendation Engine**: Instant alternative crop suggestions with multi-factor scoring (CROPIX gap, soil, weather, price trends).
- **Geo-Fenced Zero-Waste Marketplace (Phase 2)**: 5 km radius buyer proximity feed and surplus produce trade.
- **Trilingual Accessibility**: Full language localization across English (`en`), Sinhala (`si`), and Tamil (`ta`).

## 🛠️ Tech Stack

- **Framework**: Flutter 3.x / Dart SDK 3.x
- **State Management**: Provider / BLoC
- **Networking**: Dio HTTP Client
- **GPS & Maps**: Geolocator, Google Maps SDK
- **Notifications**: Firebase Cloud Messaging (FCM)

## 🏃 Local Setup

```bash
# 1. Get Flutter dependencies
flutter pub get

# 2. Run on connected device or Android emulator
flutter run
```
