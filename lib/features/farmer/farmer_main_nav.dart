import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import 'screens/farmer_dashboard_screen.dart';
import 'screens/pre_planting_risk_screen.dart';
import 'screens/price_trends_screen.dart';
import 'screens/notice_board_screen.dart';
import 'screens/officer_contact_screen.dart';

class FarmerMainNav extends StatefulWidget {
  const FarmerMainNav({super.key});

  @override
  State<FarmerMainNav> createState() => _FarmerMainNavState();
}

class _FarmerMainNavState extends State<FarmerMainNav> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    FarmerDashboardScreen(),
    PrePlantingRiskScreen(),
    PriceTrendsScreen(),
    NoticeBoardScreen(),
    OfficerContactScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          backgroundColor: Colors.white,
          indicatorColor: AppColors.primarySoft,
          elevation: 0,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.dashboard_outlined),
              selectedIcon: Icon(Icons.dashboard, color: AppColors.primary),
              label: 'Dashboard',
            ),
            NavigationDestination(
              icon: Icon(Icons.analytics_outlined),
              selectedIcon: Icon(Icons.analytics, color: AppColors.primary),
              label: 'Risk Engine',
            ),
            NavigationDestination(
              icon: Icon(Icons.trending_up_outlined),
              selectedIcon: Icon(Icons.trending_up, color: AppColors.primary),
              label: 'Market & Prices',
            ),
            NavigationDestination(
              icon: Icon(Icons.notifications_outlined),
              selectedIcon: Icon(Icons.notifications, color: AppColors.primary),
              label: 'Notices',
            ),
            NavigationDestination(
              icon: Icon(Icons.support_agent_outlined),
              selectedIcon: Icon(Icons.support_agent, color: AppColors.primary),
              label: 'Officer Link',
            ),
          ],
        ),
      ),
    );
  }
}
