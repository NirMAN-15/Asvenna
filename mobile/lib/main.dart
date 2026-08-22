import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/login_screen.dart';
import 'features/home/farmer_home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AsvannaApp());
}

class AsvannaApp extends StatefulWidget {
  const AsvannaApp({super.key});

  @override
  State<AsvannaApp> createState() => _AsvannaAppState();
}

class _AsvannaAppState extends State<AsvannaApp> {
  Locale _locale = const Locale('si'); // Default Sinhala

  void setLocale(Locale locale) {
    setState(() {
      _locale = locale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ASVANNA (අස්වැන්න)',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      locale: _locale,
      supportedLocales: const [
        Locale('en', ''),
        Locale('si', ''),
        Locale('ta', ''),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: const FarmerHomeScreen(),
    );
  }
}
