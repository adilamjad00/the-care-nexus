const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Clinic = require('./models/Clinic');
const Appointment = require('./models/Appointment');

async function checkData() {
  console.log('Connecting to:', process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'the-care-nexus' });

  console.log('\n--- Recent Completed Appointments ---');
  const apps = await Appointment.find({ status: 'completed' })
    .sort({ updatedAt: -1 })
    .limit(10);
  if (apps.length === 0) console.log('No completed appointments found.');
  apps.forEach((a) =>
    console.log(
      `App ${a._id}: revenueProcessed = ${a.revenueProcessed}, patientId = ${a.patientId}, doctorId = ${a.doctorId}, status = ${a.status}, fee = ${a.consultationFee}`,
    ),
  );

  console.log('\n--- Patients ---');
  const patients = await Patient.find({}).limit(10);
  patients.forEach((p) =>
    console.log(`${p.name} (${p.userId}): totalSpent = ${p.totalSpent}`),
  );

  console.log('\n--- Doctors ---');
  const doctors = await Doctor.find({}).limit(10);

  doctors.forEach((d) => {
    const daily = d.revenue?.daily ? Object.fromEntries(d.revenue.daily) : {};
    const monthly = d.revenue?.monthly
      ? Object.fromEntries(d.revenue.monthly)
      : {};
    console.log(
      `${d.fullName || d.userId}: totalRevenue = ${d.revenue?.total}, dailyKeys = ${Object.keys(daily)}, monthlyKeys = ${Object.keys(monthly)}, fee = ${d.consultationFee}`,
    );
  });

  console.log('\n--- Clinics ---');
  const clinics = await Clinic.find({}).limit(10);

  clinics.forEach((c) => {
    const daily = c.revenue?.daily ? Object.fromEntries(c.revenue.daily) : {};
    console.log(
      `${c.name}: totalRevenue = ${c.revenue?.total}, dailyKeys = ${Object.keys(daily)}`,
    );
  });

  await mongoose.disconnect();
}

checkData().catch((e) => {
  console.error(e);
  process.exit(1);
});
