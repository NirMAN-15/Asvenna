import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/providers/app_state_provider.dart';
import '../farmer/farmer_main_nav.dart';

class FarmerRegistrationScreen extends StatefulWidget {
  const FarmerRegistrationScreen({super.key});

  @override
  State<FarmerRegistrationScreen> createState() => _FarmerRegistrationScreenState();
}

class _FarmerRegistrationScreenState extends State<FarmerRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController(text: 'Imal Lakshitha');
  final _phoneController = TextEditingController(text: '0771234567');
  final _nicController = TextEditingController(text: '200123456789');
  final _landAcresController = TextEditingController(text: '3.5');

  String _selectedDivision = 'Bandarawela';
  String _selectedGnd = 'Heeloya West (GND 142)';

  final List<String> _divisions = [
    'Bandarawela',
    'Welimada',
    'Nuwara Eliya',
    'Haputale',
    'Badulla',
  ];

  final List<String> _gndList = [
    'Heeloya West (GND 142)',
    'Kinigama (GND 145)',
    'Diyatalawa Central (GND 138)',
    'Bambaragala (GND 149)',
    'Kabillawela North (GND 151)',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _nicController.dispose();
    _landAcresController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final acres = double.tryParse(_landAcresController.text) ?? 2.0;
      final appState = Provider.of<AppStateProvider>(context, listen: false);
      
      appState.updateFarmerProfile(
        fullName: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        nic: _nicController.text.trim(),
        division: _selectedDivision,
        gnd: _selectedGnd,
        totalAcres: acres,
      );
      
      appState.setRole(UserRole.farmer);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Farmer profile registered successfully! Welcome to Asvanna.'),
          backgroundColor: AppColors.primary,
        ),
      );

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const FarmerMainNav()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Farmer Registration'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.verified_user_rounded, color: AppColors.primary, size: 28),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Connected directly to Department of Agrarian Development - Bandarawela Office.',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: AppColors.primaryDark,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text('Personal Details', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),

              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: Icon(Icons.person_outline),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Please enter your name' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Mobile Phone Number',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Please enter your phone number' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _nicController,
                decoration: const InputDecoration(
                  labelText: 'National Identity Card (NIC) / Farmer ID',
                  prefixIcon: Icon(Icons.badge_outlined),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Please enter your NIC number' : null,
              ),
              const SizedBox(height: 24),

              Text('Land & Agrarian Division', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),

              DropdownButtonFormField<String>(
                value: _selectedDivision,
                decoration: const InputDecoration(
                  labelText: 'Agrarian Services Division',
                  prefixIcon: Icon(Icons.location_city_outlined),
                ),
                items: _divisions.map((div) {
                  return DropdownMenuItem(value: div, child: Text(div));
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedDivision = val);
                },
              ),
              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
                value: _selectedGnd,
                decoration: const InputDecoration(
                  labelText: 'Grama Niladhari Division (GND)',
                  prefixIcon: Icon(Icons.map_outlined),
                ),
                items: _gndList.map((gnd) {
                  return DropdownMenuItem(value: gnd, child: Text(gnd));
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedGnd = val);
                },
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _landAcresController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(
                  labelText: 'Total Cultivable Land (Acres)',
                  prefixIcon: Icon(Icons.landscape_outlined),
                  suffixText: 'Acres',
                ),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Please enter your land size';
                  final val = double.tryParse(v);
                  if (val == null || val <= 0) return 'Please enter a valid acreage';
                  return null;
                },
              ),
              const SizedBox(height: 32),

              ElevatedButton(
                onPressed: _submit,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('Complete Farmer Registration', style: TextStyle(fontSize: 16)),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
