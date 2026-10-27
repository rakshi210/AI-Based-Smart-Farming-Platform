import { validatePassword } from '../utils/passwordValidator.js';
import { recommendCrop } from '../services/cropRecommendationEngine.js';
import { recommendIrrigation } from '../services/irrigationEngine.js';
import { recommendFertilizer } from '../services/fertilizerEngine.js';
import { evaluatePestAndFieldRisk } from '../services/alertEngine.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ''}`);
  }
}

console.log('\n============================================================');
console.log('🧪 RUNNING COMPREHENSIVE SMART FARMING UNIT TESTS');
console.log('============================================================\n');

// 1. Password Validation Tests (Section 5 requirements)
console.log('--- PASSWORD VALIDATION TESTS ---');

// Test 1: Empty password
const p1 = validatePassword('');
assert(!p1.isValid, 'Reject empty password');

// Test 2: Invalid password - less than 8 chars (Smart@1 has 7 chars)
const p2 = validatePassword('Smart@1');
assert(!p2.isValid && !p2.rules.minLength, 'Reject password shorter than 8 characters (Smart@1)');

// Test 3: Invalid password - does not start with capital (smart@123)
const p3 = validatePassword('smart@123');
assert(!p3.isValid && !p3.rules.startsWithCapital, 'Reject password not starting with capital letter (smart@123)');

// Test 4: Invalid password - no lowercase (SMART@123)
const p4 = validatePassword('SMART@123');
assert(!p4.isValid && !p4.rules.hasLowercase, 'Reject password without lowercase letter (SMART@123)');

// Test 5: Invalid password - no number (Smart@abc)
const p5 = validatePassword('Smart@abc');
assert(!p5.isValid && !p5.rules.hasNumber, 'Reject password without number (Smart@abc)');

// Test 6: Invalid password - no special symbol (Smart1234)
const p6 = validatePassword('Smart1234');
assert(!p6.isValid && !p6.rules.hasSpecial, 'Reject password without special symbol (Smart1234)');

// Test 7: Invalid password - contains space (Smart @123)
const p7 = validatePassword('Smart @123');
assert(!p7.isValid && !p7.rules.noSpaces, 'Reject password with spaces (Smart @123)');

// Test 8: Valid password (Smart@123)
const p8 = validatePassword('Smart@123');
assert(p8.isValid, 'Accept valid password (Smart@123)');

// Test 9: Valid password (Farmer#999)
const p9 = validatePassword('Farmer#999');
assert(p9.isValid, 'Accept valid password (Farmer#999)');

// 2. Crop Recommendation Engine Tests (Section 19)
console.log('\n--- CROP RECOMMENDATION TESTS ---');

// High rain, warm, clay -> Rice
const cropRice = recommendCrop({
  nitrogen: 90,
  phosphorus: 45,
  potassium: 40,
  soilPh: 6.2,
  temperature: 28,
  humidity: 85,
  rainfall: 1400,
  soilType: 'Clay',
  location: 'Wetland Basin',
});
assert(cropRice.recommendedCrop === 'Rice', 'Recommend Rice for high rain and clayey wetland conditions');
assert(cropRice.confidence >= 80, `High confidence for Rice: ${cropRice.confidence}%`);
assert(cropRice.alternativeCrops.length > 0, 'Generates viable alternative crops');

// Cool, moderate rain, alluvial -> Wheat
const cropWheat = recommendCrop({
  nitrogen: 110,
  phosphorus: 55,
  potassium: 45,
  soilPh: 6.8,
  temperature: 18,
  humidity: 58,
  rainfall: 500,
  soilType: 'Alluvial',
  location: 'Northern Plains',
});
assert(cropWheat.recommendedCrop === 'Wheat', 'Recommend Wheat for cool winter temperatures and alluvial soil');

// 3. Irrigation Engine Tests (Section 20)
console.log('\n--- IRRIGATION ENGINE TESTS ---');

// Low moisture (20%) + High temp (36°C) + 0 rainfall -> YES
const irr1 = recommendIrrigation({
  crop: 'Rice',
  soilMoisture: 20,
  temperature: 36,
  humidity: 35,
  rainfall: 0,
});
assert(irr1.irrigationRequired === 'YES', 'Recommend YES for low moisture and elevated heat stress');

// High moisture (75%) + Rain (30mm) -> NO
const irr2 = recommendIrrigation({
  crop: 'Wheat',
  soilMoisture: 75,
  temperature: 22,
  humidity: 70,
  rainfall: 30,
});
assert(irr2.irrigationRequired === 'NO', 'Recommend NO for saturated soil and recent rainfall');

// 4. Fertilizer Recommendation Tests (Section 21)
console.log('\n--- FERTILIZER ENGINE TESTS ---');

// Deficient in Nitrogen & Phosphorus
const fert1 = recommendFertilizer({
  crop: 'Wheat',
  nitrogen: 35,
  phosphorus: 20,
  potassium: 60,
  soilPh: 6.5,
});
assert(
  fert1.deficientNutrients.includes('Nitrogen (N)') && fert1.deficientNutrients.includes('Phosphorus (P)'),
  'Identify deficient Nitrogen and Phosphorus in Wheat'
);
assert(fert1.advisoryWarning.includes('Warning'), 'Includes mandatory agricultural advisory warning disclaimer');

// 5. Pest Risk & Field Decision Support Engine Tests (Sections 18-24)
console.log('\n--- PEST RISK & DECISION SUPPORT TESTS ---');

// High humidity (88%) + warm (28°C) in Tomato -> High Risk of blight/pests
const pestHigh = evaluatePestAndFieldRisk({
  crop: 'Tomato',
  temperature: 28,
  humidity: 88,
  soilMoisture: 45,
  rainfall: 10,
});
assert(
  pestHigh.some((a) => a.riskLevel === 'High' && a.riskStatus === 'Risk Detected'),
  'Trigger High Pest Risk for Tomato under warm & very humid conditions'
);
assert(
  pestHigh[0].immediateAction.length > 10 && pestHigh[0].recommendedManagement.includes('Integrated Pest Management'),
  'Provide actionable immediate steps and IPM guidance'
);
assert(
  pestHigh[0].alternativeOption.length > 5 && pestHigh[0].monitoringAdvice.length > 5,
  'Provide safe non-chemical alternatives and monitoring advice'
);

// Low moisture (18%) -> Drought/Wilt Risk
const droughtRisk = evaluatePestAndFieldRisk({
  crop: 'Rice',
  temperature: 32,
  humidity: 50,
  soilMoisture: 18,
  rainfall: 0,
});
assert(
  droughtRisk.some((a) => a.riskLevel === 'High' && a.title.includes('Moisture')),
  'Trigger Moisture Deficit Alert for soil moisture < 20%'
);

// Balanced parameters -> Low Risk scenario (Section 23)
const lowRisk = evaluatePestAndFieldRisk({
  crop: 'Wheat',
  temperature: 22,
  humidity: 55,
  soilMoisture: 45,
  rainfall: 5,
  cropHealth: 'Good',
});
assert(
  lowRisk.length > 0 && lowRisk[0].riskLevel === 'Low' && lowRisk[0].riskStatus === 'Low Risk',
  'Return Low Risk when field conditions are within safe agronomic ranges'
);
assert(
  lowRisk[0].immediateAction.includes('Continue regular monitoring'),
  'Advise continuation of regular monitoring without false alarm'
);

console.log('\n============================================================');
console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} PASSED, ${failedTests} FAILED`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL UNIT & BUSINESS LOGIC TESTS PASSED SUCCESSFULLY!\n');
}
