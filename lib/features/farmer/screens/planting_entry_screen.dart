import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/models/crop_model.dart';
import '../../../core/models/risk_analysis_model.dart';
import '../../../core/providers/app_state_provider.dart';
import '../../../core/localization/app_translations.dart';

class PlantingEntryScreen extends StatefulWidget {
  final Crop? preSelectedCrop;

  const PlantingEntryScreen({super.key, this.preSelectedCrop});

  @override
  State<PlantingEntryScreen> createState() => _PlantingEntryScreenState();
}

class _PlantingEntryScreenState extends State<PlantingEntryScreen> {
  final _formKey = GlobalKey<FormState>();
  late Crop _selectedCrop;
  final _acresController = TextEditingController(text: '1.0');
  
  DateTime _plantingDate = DateTime.now();
  late DateTime _expectedHarvestDate;

  @override
  void initState() {
    super.initState();
    final appState = Provider.of<AppStateProvider>(context, listen: false);
    _selectedCrop = widget.preSelectedCrop ?? appState.availableCrops.first;
    _expectedHarvestDate = _plantingDate.add(Duration(days: _selectedCrop.maturityDays));
  }

  @override
  void dispose() {
    _acresController.dispose();
    super.dispose();
  }

  void _onCropChanged(Crop newCrop) {
    setState(() {
      _selectedCrop = newCrop;
      _expectedHarvestDate = _plantingDate.add(Duration(days: newCrop.maturityDays));
    });
  }

  void _selectPlantingDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _plantingDate,
      firstDate: DateTime.now().subtract(const Duration(days: 30)),
      lastDate: DateTime.now().add(const Duration(days: 60)),
    );
    if (picked != null) {
      setState(() {
        _plantingDate = picked;
        _expectedHarvestDate = picked.add(Duration(days: _selectedCrop.maturityDays));
      });
    }
  }

  void _selectHarvestDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _expectedHarvestDate,
      firstDate: _plantingDate.add(const Duration(days: 15)),
      lastDate: _plantingDate.add(const Duration(days: 200)),
    );
    if (picked != null) {
      setState(() {
        _expectedHarvestDate = picked;
      });
    }
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final acres = double.tryParse(_acresController.text) ?? 1.0;
      final appState = Provider.of<AppStateProvider>(context, listen: false);

      final success = appState.addPlantingEntry(
        crop: _selectedCrop,
        allocatedAcres: acres,
        plantingDate: _plantingDate,
        expectedHarvestDate: _expectedHarvestDate,
      );

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${_selectedCrop.name} (${_selectedCrop.sinhalaName}) planting logged successfully! Shared with Agrarian Services.'),
            backgroundColor: AppColors.primary,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Cannot allocate $acres Acres. You only have ${appState.farmerProfile.availableAcres.toStringAsFixed(1)} Acres free.'),
            backgroundColor: AppColors.riskCritical,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppStateProvider>(context);
    final lang = appState.currentLanguage;
    String tr(String key) => AppTranslations.tr(lang, key);

    final farmer = appState.farmerProfile;
    final risk = appState.getRiskForCrop(_selectedCrop.id);
    final acres = double.tryParse(_acresController.text) ?? 1.0;
    final projectedYield = acres * _selectedCrop.expectedYieldKgPerAcre;
    final dateFormat = DateFormat('EEE, MMM dd, yyyy');

    return Scaffold(
      appBar: AppBar(
        title: Text(tr('log_planting_title')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Available Acreage Header
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      tr('available_free_land'),
                      style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    Text(
                      '${farmer.availableAcres.toStringAsFixed(1)} / ${farmer.totalLandAcres} Acres',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryDark,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Crop Selection Dropdown
              Text(tr('select_crop_to_plant'), style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              DropdownButtonFormField<Crop>(
                value: _selectedCrop,
                decoration: const InputDecoration(
                  labelText: 'Upcountry Vegetable',
                  prefixIcon: Icon(Icons.eco_outlined),
                ),
                items: appState.availableCrops.map((c) {
                  return DropdownMenuItem(
                    value: c,
                    child: Row(
                      children: [
                        Text(c.iconEmoji, style: const TextStyle(fontSize: 18)),
                        const SizedBox(width: 10),
                        Text('${c.name} (${c.sinhalaName})'),
                      ],
                    ),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) _onCropChanged(val);
                },
              ),
              const SizedBox(height: 14),

              // Risk Status Callout for Selected Crop
              if (risk != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: risk.riskLevel == CropRiskLevel.critical
                        ? AppColors.riskCriticalBg
                        : risk.riskLevel == CropRiskLevel.moderate
                            ? AppColors.riskModerateBg
                            : AppColors.riskSafeBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: risk.riskLevel == CropRiskLevel.critical
                          ? AppColors.riskCritical.withOpacity(0.4)
                          : AppColors.primary.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        risk.riskLevel == CropRiskLevel.critical
                            ? Icons.warning_amber_rounded
                            : Icons.check_circle_outline,
                        color: risk.riskLevel == CropRiskLevel.critical
                            ? AppColors.riskCritical
                            : AppColors.primary,
                        size: 24,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          '${risk.riskTitle}: ${risk.saturationPercentage.toStringAsFixed(0)}% regional saturation in ${farmer.agrarianDivision}.',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: risk.riskLevel == CropRiskLevel.critical
                                ? AppColors.riskCritical
                                : AppColors.primaryDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
              ],

              // Acreage Input
              Text(tr('allocated_land_area'), style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _acresController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(
                  labelText: 'Cultivated Area (Acres)',
                  prefixIcon: Icon(Icons.square_foot_outlined),
                  suffixText: 'Acres',
                ),
                onChanged: (v) => setState(() {}),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Please enter allocated acreage';
                  final val = double.tryParse(v);
                  if (val == null || val <= 0) return 'Enter a valid number';
                  if (val > farmer.availableAcres) {
                    return 'Exceeds available land (${farmer.availableAcres.toStringAsFixed(1)} Acres)';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 18),

              // Date Pickers
              Text(tr('cultivation_schedule'), style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),

              // Sowing Date
              InkWell(
                onTap: _selectPlantingDate,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFD6E2D6)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined, color: AppColors.primary, size: 20),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(tr('sowing_date'), style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted)),
                          Text(dateFormat.format(_plantingDate), style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const Spacer(),
                      const Icon(Icons.edit_calendar, size: 18, color: AppColors.textMuted),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Expected Harvest Date
              InkWell(
                onTap: _selectHarvestDate,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFD6E2D6)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.event_available_outlined, color: AppColors.badgeHarvest, size: 20),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${tr('expected_harvest_date')} (~${_selectedCrop.maturityDays} days)', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted)),
                          Text(dateFormat.format(_expectedHarvestDate), style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const Spacer(),
                      const Icon(Icons.edit_calendar, size: 18, color: AppColors.textMuted),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Harvest & Revenue Estimation Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFAFBF9),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2ECE2)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('${tr('projected_yield')}:', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text(
                          '~${projectedYield.toStringAsFixed(0)} Kg',
                          style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.primaryDark),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(tr('est_revenue'), style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text(
                          'Rs. ${(projectedYield * _selectedCrop.currentMarketPricePerKg).toStringAsFixed(0)}',
                          style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.secondary),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Submit Button
              ElevatedButton.icon(
                icon: const Icon(Icons.send_rounded),
                label: Text(tr('submit_planting_btn')),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                onPressed: _submit,
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
