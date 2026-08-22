import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../planting/log_planting_screen.dart';
import '../recommendations/smart_crop_recommendation_screen.dart';
import '../marketplace/marketplace_feed_screen.dart';

class FarmerHomeScreen extends StatefulWidget {
  const FarmerHomeScreen({super.key});

  @override
  State<FarmerHomeScreen> createState() => _FarmerHomeScreenState();
}

class _FarmerHomeScreenState extends State<FarmerHomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const FarmerDashboardTab(),
    const SmartCropRecommendationScreen(),
    const MarketplaceFeedScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ASVANNA (අස්වැන්න)'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_active),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('බණ්ඩාරවෙල කලාපයේ ලීක්ස් වගාව 85% ඉක්මවා ඇත!')),
              );
            },
          )
        ],
      ),
      body: _tabs[_currentIndex],
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const LogPlantingScreen()),
                );
              },
              backgroundColor: AppColors.primary,
              icon: const Icon(Icons.add_location_alt, color: Colors.white),
              label: const Text('වගාව සටහන් කරන්න', style: TextStyle(color: Colors.white)),
            )
          : null,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home),
            label: 'ප්‍රධාන පිටුව (Home)',
          ),
          NavigationDestination(
            icon: Icon(Icons.psychology),
            label: 'නිර්දේශ (Recommendations)',
          ),
          NavigationDestination(
            icon: Icon(Icons.storefront),
            label: 'වෙළඳපල (Marketplace)',
          ),
        ],
      ),
    );
  }
}

class FarmerDashboardTab extends StatelessWidget {
  const FarmerDashboardTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Weather & Location Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('📍 බණ්ඩාරවෙල කලාපය (Bandarawela)', style: TextStyle(color: Colors.white70, fontSize: 13)),
              SizedBox(height: 6),
              Text('21°C • සුළු වැසි තත්ත්වයක්', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(height: 4),
              Text('පස: මධ්‍යම ලෝම පස | තෙතමනය: 78%', style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Over-Planting Warning Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF2F2),
            border: Border.all(color: const Color(0xFFFCA5A5)),
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Colors.red, size: 32),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('ලීක්ස් අධික වගා අවදානම (88%)', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 14)),
                    SizedBox(height: 2),
                    Text('බණ්ඩාරවෙල කලාපයේ ලීක්ස් වගාව වෙළඳපල සීමාව ඉක්මවා ඇත.', style: TextStyle(fontSize: 12, color: Colors.black87)),
                  ],
                ),
              )
            ],
          ),
        ),
        const SizedBox(height: 20),

        const Text('මගේ වගා සටහන් (My Active Plantings)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 10),

        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          child: const ListTile(
            leading: CircleAvatar(backgroundColor: Color(0xFFDCFCE7), child: Icon(Icons.grass, color: AppColors.primary)),
            title: Text('කැරට් (Carrot)', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('අක්කර 1.0 • බලාපොරොත්තු අස්වැන්න: 9,500 kg'),
            trailing: Text('ආරක්ෂිතයි 🟢', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
          ),
        ),
        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          child: const ListTile(
            leading: CircleAvatar(backgroundColor: Color(0xFFFEE2E2), child: Icon(Icons.grass, color: Colors.red)),
            title: Text('ලීක්ස් (Leeks)', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('අක්කර 0.5 • බලාපොරොත්තු අස්වැන්න: 4,250 kg'),
            trailing: Text('අධික වගාව 🔴', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ),
        ),
      ],
    );
  }
}
