import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/providers/app_state_provider.dart';
import '../buyer/buyer_main_nav.dart';

class BuyerRegistrationScreen extends StatefulWidget {
  const BuyerRegistrationScreen({super.key});

  @override
  State<BuyerRegistrationScreen> createState() => _BuyerRegistrationScreenState();
}

class _BuyerRegistrationScreenState extends State<BuyerRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _businessNameController = TextEditingController(text: 'Grand Ella Catering Services');
  final _ownerNameController = TextEditingController(text: 'Niroshan Perera');
  final _phoneController = TextEditingController(text: '0778899001');
  final _locationController = TextEditingController(text: 'Bandarawela - Ella Road');
  final _capacityController = TextEditingController(text: '1200');

  String _selectedCategory = 'Event Catering';

  final List<String> _categories = [
    'Event Catering',
    'Hotel & Resort Restaurant',
    'Wholesale Bulk Distributor',
    'Local Retail Vendor',
    'Institutional Canteen',
  ];

  @override
  void dispose() {
    _businessNameController.dispose();
    _ownerNameController.dispose();
    _phoneController.dispose();
    _locationController.dispose();
    _capacityController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final capacity = double.tryParse(_capacityController.text) ?? 1000.0;
      final appState = Provider.of<AppStateProvider>(context, listen: false);
      
      appState.registerBuyer(
        businessName: _businessNameController.text.trim(),
        ownerName: _ownerNameController.text.trim(),
        phone: _phoneController.text.trim(),
        category: _selectedCategory,
        address: _locationController.text.trim(),
        weeklyCapacityKg: capacity,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Buyer profile created! Connecting you to local 5km surplus crops.'),
          backgroundColor: AppColors.accent,
        ),
      );

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const BuyerMainNav()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Buyer & Caterer Registration'),
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
                  color: AppColors.accent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.accent.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.storefront_rounded, color: AppColors.accent, size: 28),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Direct 5km Farm-to-Kitchen access: Buy fresh surplus vegetables at discounted farmgate prices.',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF004D40),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text('Business Profile', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),

              TextFormField(
                controller: _businessNameController,
                decoration: const InputDecoration(
                  labelText: 'Business / Company Name',
                  prefixIcon: Icon(Icons.business_outlined),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Please enter business name' : null,
              ),
              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Business Category',
                  prefixIcon: Icon(Icons.category_outlined),
                ),
                items: _categories.map((cat) {
                  return DropdownMenuItem(value: cat, child: Text(cat));
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _ownerNameController,
                decoration: const InputDecoration(
                  labelText: 'Contact Person / Manager Name',
                  prefixIcon: Icon(Icons.person_outline),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Please enter manager name' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Direct Contact Phone',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
                validator: (v) => v == null || v.isEmpty ? 'Please enter contact phone' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Operating Location / Kitchen Address',
                  prefixIcon: Icon(Icons.location_on_outlined),
                  hintText: 'e.g. Bandarawela, Ella, Haputale',
                ),
                validator: (v) => v == null || v.isEmpty ? 'Please enter operating location' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _capacityController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(
                  labelText: 'Weekly Vegetable Procurement Capacity (Kg)',
                  prefixIcon: Icon(Icons.shopping_bag_outlined),
                  suffixText: 'Kg / Week',
                ),
                validator: (v) => v == null || v.isEmpty ? 'Please enter procurement capacity' : null,
              ),
              const SizedBox(height: 32),

              ElevatedButton(
                onPressed: _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accent,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('Access Zero-Waste Marketplace', style: TextStyle(fontSize: 16)),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
