const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');
const Patient = require('../models/Patient');
const RevenueEntry = require('../models/RevenueEntry');

/**
 * Update revenue for doctor and clinic
 * @param {string} doctorUserId - The User ID of the doctor
 * @param {number} totalCost - The total cost of the consultation/prescription
 * @param {string} optClinicId - Optional clinic ID associated with the revenue
 * @param {string} patientUserId - The User ID of the patient
 */
const updateRevenue = async (
  doctorUserId,
  totalCost,
  optClinicId = null,
  patientUserId = null,
  meta = {},
) => {
  console.log(
    `Updating revenue: Dr=${doctorUserId}, Cost=${totalCost}, Clinic=${optClinicId}, Patient=${patientUserId}`,
  );
  if (!totalCost || totalCost <= 0) {
    console.warn(`Revenue update skipped: totalCost is ${totalCost}`);
    return; // Exit if totalCost is invalid
  }

  let doctor = await Doctor.findById(doctorUserId);
  if (!doctor) {
    doctor = await Doctor.findOne({ userId: doctorUserId });
  }

  if (!doctor) {
    console.warn(
      `Doctor profile not found (tried ID and UserID) for: ${doctorUserId}`,
    );
    return;
  }

  // Generate local-accurate date keys
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const todayKey = `${year}-${month}-${day}`; // YYYY-MM-DD
  const currentMonth = `${year}-${month}`; // YYYY-MM

  // Calculate revenue splits (clinic gets 20%, doctor gets 80%)
  const clinicShare = totalCost * 0.2;
  const doctorShare = totalCost * 0.8;

  // Initialize revenue nested structure if missing (safely)
  if (!doctor.revenue) doctor.revenue = {};
  if (typeof doctor.revenue.total === 'undefined') doctor.revenue.total = 0;
  if (!doctor.revenue.monthly) doctor.revenue.monthly = new Map();
  if (!doctor.revenue.daily) doctor.revenue.daily = new Map();

  // Update doctor total revenue
  doctor.revenue.total += doctorShare;

  // Update doctor monthly revenue
  const monthlyRevenue = doctor.revenue.monthly.get(currentMonth) || 0;
  doctor.revenue.monthly.set(currentMonth, monthlyRevenue + doctorShare);

  // Update doctor daily revenue
  const dailyRevenue = doctor.revenue.daily.get(todayKey) || 0;
  doctor.revenue.daily.set(todayKey, dailyRevenue + doctorShare);

  // Track modifications for Mongoose
  doctor.markModified('revenue');

  await doctor.save();
  console.log(
    `[REVENUE] Doctor ${doctorUserId} updated: +${doctorShare} (Total: ${doctor.revenue.total})`,
  );

  // Update clinic revenue if doctor is associated with a clinic or appointment was at a clinic
  const effectiveClinicId = optClinicId || doctor.clinicId;
  if (effectiveClinicId) {
    try {
      const clinic = await Clinic.findById(effectiveClinicId);
      if (clinic) {
        if (!clinic.revenue) clinic.revenue = {};
        if (typeof clinic.revenue.total === 'undefined')
          clinic.revenue.total = 0;
        if (!clinic.revenue.monthly) clinic.revenue.monthly = new Map();
        if (!clinic.revenue.daily) clinic.revenue.daily = new Map();

        clinic.revenue.total += clinicShare;

        const clinicMonthlyRevenue =
          clinic.revenue.monthly.get(currentMonth) || 0;
        clinic.revenue.monthly.set(
          currentMonth,
          clinicMonthlyRevenue + clinicShare,
        );

        const clinicDailyRevenue = clinic.revenue.daily.get(todayKey) || 0;
        clinic.revenue.daily.set(todayKey, clinicDailyRevenue + clinicShare);

        clinic.markModified('revenue');
        await clinic.save();
        console.log(
          `[REVENUE] Clinic ${effectiveClinicId} updated: +${clinicShare} (Total: ${clinic.revenue.total})`,
        );
      }
    } catch (err) {
      console.error(
        `[REVENUE] Failed to update clinic revenue: ${err.message}`,
      );
    }
  }

  // Update patient total spent
  if (patientUserId) {
    try {
      const patient = await Patient.findOne({ userId: patientUserId });
      if (patient) {
        patient.totalSpent = (patient.totalSpent || 0) + totalCost;
        await patient.save();
        console.log(
          `[REVENUE] Patient ${patientUserId} totalSpent updated: +${totalCost} (Total: ${patient.totalSpent})`,
        );
      }
    } catch (err) {
      console.error(`[REVENUE] Failed to update patient spent: ${err.message}`);
    }
  }

  if (!meta?.skipEntry) {
    try {
      const consultationFee = Number(meta?.consultationFee || 0);
      const medicineCost = Number(meta?.medicineCost || 0);

      await RevenueEntry.create({
        doctorUserId: doctor.userId || doctorUserId,
        clinicId: effectiveClinicId || null,
        patientUserId: patientUserId || null,
        appointmentId: meta?.appointmentId || null,
        prescriptionId: meta?.prescriptionId || null,
        sourceType: meta?.sourceType || 'appointment_completed',
        consultationFee,
        medicineCost,
        totalCost,
        doctorShare,
        clinicShare,
        occurredAt: meta?.occurredAt || now,
      });
    } catch (err) {
      console.error(`[REVENUE] Failed to write revenue entry: ${err.message}`);
    }
  }
};

const decrementMapValue = (mapObj, key, amount) => {
  if (!mapObj || !key || !amount) return;
  const current = mapObj.get(key) || 0;
  const next = current - amount;
  if (next <= 0) {
    mapObj.delete(key);
  } else {
    mapObj.set(key, next);
  }
};

const reverseRevenueEntry = async (entry) => {
  if (!entry) return;

  const when = new Date(entry.occurredAt || entry.createdAt || new Date());
  const year = when.getFullYear();
  const month = String(when.getMonth() + 1).padStart(2, '0');
  const day = String(when.getDate()).padStart(2, '0');
  const monthKey = `${year}-${month}`;
  const dayKey = `${year}-${month}-${day}`;

  const doctor = await Doctor.findOne({ userId: entry.doctorUserId });
  if (doctor && doctor.revenue) {
    doctor.revenue.total = Math.max(
      0,
      (doctor.revenue.total || 0) - (entry.doctorShare || 0),
    );
    if (!doctor.revenue.monthly) doctor.revenue.monthly = new Map();
    if (!doctor.revenue.daily) doctor.revenue.daily = new Map();
    decrementMapValue(doctor.revenue.monthly, monthKey, entry.doctorShare || 0);
    decrementMapValue(doctor.revenue.daily, dayKey, entry.doctorShare || 0);
    doctor.markModified('revenue');
    await doctor.save();
  }

  if (entry.clinicId) {
    const clinic = await Clinic.findById(entry.clinicId);
    if (clinic && clinic.revenue) {
      clinic.revenue.total = Math.max(
        0,
        (clinic.revenue.total || 0) - (entry.clinicShare || 0),
      );
      if (!clinic.revenue.monthly) clinic.revenue.monthly = new Map();
      if (!clinic.revenue.daily) clinic.revenue.daily = new Map();
      decrementMapValue(
        clinic.revenue.monthly,
        monthKey,
        entry.clinicShare || 0,
      );
      decrementMapValue(clinic.revenue.daily, dayKey, entry.clinicShare || 0);
      clinic.markModified('revenue');
      await clinic.save();
    }
  }

  if (entry.patientUserId) {
    const patient = await Patient.findOne({ userId: entry.patientUserId });
    if (patient) {
      patient.totalSpent = Math.max(
        0,
        (patient.totalSpent || 0) - (entry.totalCost || 0),
      );
      await patient.save();
    }
  }
};

module.exports = { updateRevenue, reverseRevenueEntry };
