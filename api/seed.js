/**
 * Care Nexus Database Seed Script — Pakistani Data
 *
 * Usage:  node seed.js
 *
 * Password for ALL accounts: Test@12345
 *
 * Creates:
 *   5 Clinics  (+ 5 clinic_admin users)
 *   20 Doctors (4 per clinic  + doctor User accounts)
 *   8 Patients (+ patient User accounts)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Clinic = require('./models/Clinic');
const Patient = require('./models/Patient');

// ─── helpers ────────────────────────────────────────────────────────────────

const PASSWORD = 'Test@12345';
// Do NOT pre-hash — User model's pre-save hook handles bcrypt hashing

const SCHEDULE = {
  monday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  thursday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  friday: ['09:00', '10:00', '11:00'],
  saturday: [],
  sunday: [],
};

// ─── raw data ────────────────────────────────────────────────────────────────

const CLINICS_DATA = [
  {
    name: 'Pakistan Medical Center Islamabad',
    address: 'F-10 Markaz, Islamabad',
    phone: '051-111222333',
    email: 'contact@pmc-isb.pk',
    city: 'Islamabad',
  },
  {
    name: 'South City Hospital Karachi',
    address: 'Clifton Block 5, Karachi',
    phone: '021-111444555',
    email: 'info@southcityhospital.pk',
    city: 'Karachi',
  },
  {
    name: 'Lahore Care & Diagnostic Clinic',
    address: 'Gulberg III, Lahore',
    phone: '042-111333222',
    email: 'support@lcdc.pk',
    city: 'Lahore',
  },
  {
    name: 'Rawalpindi Health Associates',
    address: 'Saddar, Rawalpindi',
    phone: '051-555666777',
    email: 'info@rha.pk',
    city: 'Rawalpindi',
  },
  {
    name: 'Faisalabad Medical Plaza',
    address: 'D Ground, Faisalabad',
    phone: '041-777888999',
    email: 'contact@fmp.pk',
    city: 'Faisalabad',
  },
];

const ADMINS_DATA = [
  {
    name: 'Dr. Hamza Iqbal',
    email: 'admin.isb@carenexus.pk',
    phone: '0300-1112233',
  },
  {
    name: 'Dr. Maryam Khan',
    email: 'admin.khi@carenexus.pk',
    phone: '0300-2223344',
  },
  {
    name: 'Dr. Ahmed Raza',
    email: 'admin.lhr@carenexus.pk',
    phone: '0300-3334455',
  },
  {
    name: 'Dr. Ayesha Malik',
    email: 'admin.rwp@carenexus.pk',
    phone: '0300-4445566',
  },
  {
    name: 'Dr. Usman Tariq',
    email: 'admin.fsd@carenexus.pk',
    phone: '0300-5556677',
  },
];

const DOCTORS_DATA = [
  // Islamabad
  {
    fullName: 'Dr. Hira Saeed',
    email: 'hira.saeed@thecarenexus.pk',
    phone: '0310-1001001',
    specialization: 'Cardiologist',
    fee: 3200,
    licenseNo: 'PMC-ISB-101',
    exp: 10,
    bio: 'Experienced cardiologist specializing in preventive heart care and lifestyle management.',
  },
  {
    fullName: 'Dr. Bilal Ahmed',
    email: 'bilal.ahmed@thecarenexus.pk',
    phone: '0310-1001002',
    specialization: 'Neurologist',
    fee: 3500,
    licenseNo: 'PMC-ISB-102',
    exp: 12,
    bio: 'Expert in neurological disorders including migraine, epilepsy, and stroke rehabilitation.',
  },
  {
    fullName: 'Dr. Areeba Khan',
    email: 'areeba.khan@thecarenexus.pk',
    phone: '0310-1001003',
    specialization: 'Pediatrician',
    fee: 2000,
    licenseNo: 'PMC-ISB-103',
    exp: 7,
    bio: 'Focused on child healthcare, vaccination programs, and neonatal care.',
  },
  {
    fullName: 'Dr. Omar Farooq',
    email: 'omar.farooq@thecarenexus.pk',
    phone: '0310-1001004',
    specialization: 'General Physician',
    fee: 1500,
    licenseNo: 'PMC-ISB-104',
    exp: 6,
    bio: 'Family medicine specialist providing general consultation and preventive care.',
  },

  // Karachi
  {
    fullName: 'Dr. Sana Javed',
    email: 'sana.javed@thecarenexus.pk',
    phone: '0320-2002001',
    specialization: 'Dermatologist',
    fee: 2800,
    licenseNo: 'PMC-KHI-201',
    exp: 9,
    bio: 'Specialist in skin disorders, acne treatment, and cosmetic dermatology.',
  },
  {
    fullName: 'Dr. Rehan Ali',
    email: 'rehan.ali@thecarenexus.pk',
    phone: '0320-2002002',
    specialization: 'Orthopedic Surgeon',
    fee: 4000,
    licenseNo: 'PMC-KHI-202',
    exp: 14,
    bio: 'Expert in bone injuries, joint replacement, and sports trauma care.',
  },
  {
    fullName: 'Dr. Hania Siddiqui',
    email: 'hania.siddiqui@thecarenexus.pk',
    phone: '0320-2002003',
    specialization: 'Gynecologist',
    fee: 2700,
    licenseNo: 'PMC-KHI-203',
    exp: 11,
    bio: "Specialist in women's health, fertility care, and pregnancy management.",
  },
  {
    fullName: 'Dr. Imran Qureshi',
    email: 'imran.qureshi@thecarenexus.pk',
    phone: '0320-2002004',
    specialization: 'ENT Specialist',
    fee: 2200,
    licenseNo: 'PMC-KHI-204',
    exp: 8,
    bio: 'Treats ear, nose, and throat conditions including hearing and sinus issues.',
  },

  // Lahore
  {
    fullName: 'Dr. Maheen Tariq',
    email: 'maheen.tariq@thecarenexus.pk',
    phone: '0330-3003001',
    specialization: 'Psychiatrist',
    fee: 3000,
    licenseNo: 'PMC-LHR-301',
    exp: 6,
    bio: 'Mental health expert focusing on anxiety, depression, and behavioral therapy.',
  },
  {
    fullName: 'Dr. Saad Malik',
    email: 'saad.malik@thecarenexus.pk',
    phone: '0330-3003002',
    specialization: 'Gastroenterologist',
    fee: 3200,
    licenseNo: 'PMC-LHR-302',
    exp: 10,
    bio: 'Specialist in digestive system disorders and liver diseases.',
  },
  {
    fullName: 'Dr. Alina Shah',
    email: 'alina.shah@thecarenexus.pk',
    phone: '0330-3003003',
    specialization: 'Ophthalmologist',
    fee: 2500,
    licenseNo: 'PMC-LHR-303',
    exp: 7,
    bio: 'Expert in eye surgery, vision correction, and cataract treatment.',
  },
  {
    fullName: 'Dr. Zain Abbas',
    email: 'zain.abbas@thecarenexus.pk',
    phone: '0330-3003004',
    specialization: 'Pulmonologist',
    fee: 2900,
    licenseNo: 'PMC-LHR-304',
    exp: 13,
    bio: 'Specialist in asthma, lung infections, and respiratory diseases.',
  },

  // Rawalpindi
  {
    fullName: 'Dr. Sarah Khan',
    email: 'sarah.khan@thecarenexus.pk',
    phone: '0340-4004001',
    specialization: 'Endocrinologist',
    fee: 3100,
    licenseNo: 'PMC-RWP-401',
    exp: 9,
    bio: 'Expert in diabetes, thyroid disorders, and hormonal imbalance treatment.',
  },
  {
    fullName: 'Dr. Hassan Raza',
    email: 'hassan.raza@thecarenexus.pk',
    phone: '0340-4004002',
    specialization: 'Urologist',
    fee: 3500,
    licenseNo: 'PMC-RWP-402',
    exp: 11,
    bio: 'Specialist in kidney stones, urinary tract issues, and urological surgery.',
  },
  {
    fullName: 'Dr. Nimra Ali',
    email: 'nimra.ali@thecarenexus.pk',
    phone: '0340-4004003',
    specialization: 'General Physician',
    fee: 1500,
    licenseNo: 'PMC-RWP-403',
    exp: 5,
    bio: 'Provides general healthcare and preventive medical consultations.',
  },
  {
    fullName: 'Dr. Usama Javed',
    email: 'usama.javed@thecarenexus.pk',
    phone: '0340-4004004',
    specialization: 'Cardiologist',
    fee: 3800,
    licenseNo: 'PMC-RWP-404',
    exp: 15,
    bio: 'Experienced cardiologist specializing in cardiac imaging and heart disease treatment.',
  },

  // Faisalabad
  {
    fullName: 'Dr. Zoya Hassan',
    email: 'zoya.hassan@thecarenexus.pk',
    phone: '0315-5005001',
    specialization: 'Gynecologist',
    fee: 2600,
    licenseNo: 'PMC-FSD-501',
    exp: 8,
    bio: "Focuses on reproductive health, pregnancy care, and women's wellness.",
  },
  {
    fullName: 'Dr. Daniyal Sheikh',
    email: 'daniyal.sheikh@thecarenexus.pk',
    phone: '0315-5005002',
    specialization: 'Orthopedic Surgeon',
    fee: 3600,
    licenseNo: 'PMC-FSD-502',
    exp: 12,
    bio: 'Expert in bone fractures, joint disorders, and orthopedic trauma surgery.',
  },
  {
    fullName: 'Dr. Emaan Fatima',
    email: 'emaan.fatima@thecarenexus.pk',
    phone: '0315-5005003',
    specialization: 'Dermatologist',
    fee: 2700,
    licenseNo: 'PMC-FSD-503',
    exp: 6,
    bio: 'Specialist in skin health, allergies, and cosmetic dermatology.',
  },
  {
    fullName: 'Dr. Hamza Qamar',
    email: 'hamza.qamar@thecarenexus.pk',
    phone: '0315-5005004',
    specialization: 'Pediatrician',
    fee: 2100,
    licenseNo: 'PMC-FSD-504',
    exp: 4,
    bio: 'Dedicated to child healthcare and neonatal treatment services.',
  },
];

const PATIENTS_DATA = [
  {
    name: 'Ali Raza',
    email: 'ali.raza@thecarenexus.pk',
    phone: '0301-9001001',
    dob: '1992-06-15',
    gender: 'male',
    bloodGroup: 'A+',
    address: 'G-11 Markaz, Islamabad',
  },
  {
    name: 'Sara Ahmed',
    email: 'sara.ahmed@thecarenexus.pk',
    phone: '0301-9001002',
    dob: '1996-09-21',
    gender: 'female',
    bloodGroup: 'B+',
    address: 'DHA Phase 6, Karachi',
  },
  {
    name: 'Usman Khalid',
    email: 'usman.khalid@thecarenexus.pk',
    phone: '0301-9001003',
    dob: '1989-02-10',
    gender: 'male',
    bloodGroup: 'O+',
    address: 'Johar Town, Lahore',
  },
  {
    name: 'Hina Tariq',
    email: 'hina.tariq@thecarenexus.pk',
    phone: '0301-9001004',
    dob: '2001-12-05',
    gender: 'female',
    bloodGroup: 'AB+',
    address: 'Satellite Town, Rawalpindi',
  },
  {
    name: 'Ahsan Malik',
    email: 'ahsan.malik@thecarenexus.pk',
    phone: '0301-9001005',
    dob: '1994-03-18',
    gender: 'male',
    bloodGroup: 'B-',
    address: 'Madina Town, Faisalabad',
  },
  {
    name: 'Zainab Noor',
    email: 'zainab.noor@thecarenexus.pk',
    phone: '0301-9001006',
    dob: '1999-07-27',
    gender: 'female',
    bloodGroup: 'O-',
    address: 'Gulshan-e-Iqbal, Karachi',
  },
  {
    name: 'Hamza Shah',
    email: 'hamza.shah@thecarenexus.pk',
    phone: '0301-9001007',
    dob: '1991-11-09',
    gender: 'male',
    bloodGroup: 'A-',
    address: 'Model Town, Lahore',
  },
  {
    name: 'Ayesha Riaz',
    email: 'ayesha.riaz@thecarenexus.pk',
    phone: '0301-9001008',
    dob: '2003-05-19',
    gender: 'female',
    bloodGroup: 'B+',
    address: 'Bahria Town, Rawalpindi',
  },
];

// ─── main seed ───────────────────────────────────────────────────────────────

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.\n');

  // ── wipe existing seed data ──────────────────────────────────────────────
  const seedEmails = [
    ...ADMINS_DATA.map((a) => a.email),
    ...DOCTORS_DATA.map((d) => d.email),
    ...PATIENTS_DATA.map((p) => p.email),
  ];

  const existingUsers = await User.find({ email: { $in: seedEmails } });
  const existingIds = existingUsers.map((u) => u._id);

  await Doctor.deleteMany({ userId: { $in: existingIds } });
  await Patient.deleteMany({ userId: { $in: existingIds } });

  const existingClinicAdminIds = existingUsers
    .filter((u) => u.roles.includes('clinic_admin'))
    .map((u) => u._id);
  await Clinic.deleteMany({ adminId: { $in: existingClinicAdminIds } });
  await User.deleteMany({ email: { $in: seedEmails } });

  console.log('Cleared previous seed data.\n');

  // ── 1. Create clinic admins + clinics ────────────────────────────────────
  const createdClinics = [];

  for (let i = 0; i < CLINICS_DATA.length; i++) {
    const adminData = ADMINS_DATA[i];
    const clinicData = CLINICS_DATA[i];

    const adminUser = await User.create({
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      password: PASSWORD,
      roles: ['clinic_admin'],
      authProvider: 'local',
      isVerified: true,
    });

    const clinic = await Clinic.create({
      name: clinicData.name,
      address: clinicData.address,
      phone: clinicData.phone,
      email: clinicData.email,
      adminId: adminUser._id,
      doctors: [],
      workingHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '13:00', closed: false },
        saturday: { open: '09:00', close: '13:00', closed: true },
        sunday: { open: '09:00', close: '13:00', closed: true },
      },
    });

    createdClinics.push(clinic);
    console.log(
      `  Clinic [${i + 1}] ${clinicData.name}  |  admin: ${adminData.email}`,
    );
  }

  console.log();

  // ── 2. Create doctors (4 per clinic) ─────────────────────────────────────
  for (let i = 0; i < DOCTORS_DATA.length; i++) {
    const d = DOCTORS_DATA[i];
    const clinicIdx = Math.floor(i / 4); // 4 doctors per clinic
    const clinic = createdClinics[clinicIdx];

    const userDoc = await User.create({
      name: d.fullName,
      email: d.email,
      phone: d.phone,
      password: PASSWORD,
      roles: ['doctor'],
      authProvider: 'local',
      isVerified: true,
    });

    const doctorProfile = await Doctor.create({
      userId: userDoc._id,
      fullName: d.fullName,
      specialization: d.specialization,
      licenseNo: d.licenseNo,
      bio: d.bio,
      clinicId: clinic._id,
      consultationFee: d.fee,
      experience: d.exp,
      schedule: SCHEDULE,
      averageRating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
      totalReviews: Math.floor(Math.random() * 80) + 10,
    });

    await Clinic.findByIdAndUpdate(clinic._id, {
      $push: { doctors: doctorProfile._id },
    });

    console.log(
      `  Doctor  ${d.fullName.padEnd(28)}  ${d.specialization.padEnd(22)}  clinic: ${clinic.name}`,
    );
  }

  console.log();

  // ── 3. Create patients ────────────────────────────────────────────────────
  for (const p of PATIENTS_DATA) {
    const userDoc = await User.create({
      name: p.name,
      email: p.email,
      phone: p.phone,
      password: PASSWORD,
      roles: ['patient'],
      authProvider: 'local',
      isVerified: true,
    });

    await Patient.create({
      userId: userDoc._id,
      name: p.name,
      email: p.email,
      contact: p.phone,
      dob: new Date(p.dob),
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      address: p.address,
      allergies: [],
    });

    console.log(`  Patient ${p.name.padEnd(22)}  ${p.email}`);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`
═══════════════════════════════════════════════════════════════
  SEED COMPLETE  —  Password for ALL accounts: ${PASSWORD}
═══════════════════════════════════════════════════════════════

  CLINIC ADMINS
  ┌─────────────────────────────────────────────────────────┐`);

  ADMINS_DATA.forEach((a, i) => {
    console.log(`  │  ${CLINICS_DATA[i].name.padEnd(36)} ${a.email}`);
  });

  console.log(`  └─────────────────────────────────────────────────────────┘

  DOCTORS  (${DOCTORS_DATA.length} total, 4 per clinic)
  ┌─────────────────────────────────────────────────────────┐`);

  DOCTORS_DATA.forEach((d) => {
    console.log(`  │  ${d.fullName.padEnd(28)} ${d.email}`);
  });

  console.log(`  └─────────────────────────────────────────────────────────┘

  PATIENTS  (${PATIENTS_DATA.length} total)
  ┌─────────────────────────────────────────────────────────┐`);

  PATIENTS_DATA.forEach((p) => {
    console.log(`  │  ${p.name.padEnd(22)} ${p.email}`);
  });

  console.log(`  └─────────────────────────────────────────────────────────┘
`);

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
