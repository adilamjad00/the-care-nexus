const Doctor = require('../../models/Doctor');
const Prescription = require('../../models/Prescription');
const Appointment = require('../../models/Appointment');
const RevenueEntry = require('../../models/RevenueEntry');
const User = require('../../models/User');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { reverseRevenueEntry } = require('../../utils/revenue');

/**
 * @desc    Get doctor's revenue statistics with periodicity
 * @route   GET /api/doctor/revenue
 * @access  Private (Doctor only)
 */
exports.getRevenue = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id });
  const { period = 'month' } = req.query; // period: day, month, year

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  // Guard: revenue may be undefined for old documents created before the field existed
  const revenue = doctor.revenue || {
    total: 0,
    monthly: new Map(),
    daily: new Map(),
  };
  const monthlyMap =
    revenue.monthly instanceof Map ? revenue.monthly : new Map();
  const dailyMap = revenue.daily instanceof Map ? revenue.daily : new Map();
  const revenueEntries = await RevenueEntry.find({ doctorUserId: req.user._id })
    .select('doctorShare occurredAt')
    .lean();

  const derivedMonthly = new Map();
  const derivedDaily = new Map();
  let derivedTotal = 0;

  for (const entry of revenueEntries) {
    const amount = Number(entry.doctorShare || 0);
    if (!amount) continue;

    const when = new Date(entry.occurredAt || new Date());
    const monthKey = `${when.getFullYear()}-${String(when.getMonth() + 1).padStart(2, '0')}`;
    const dayKey = `${when.getFullYear()}-${String(when.getMonth() + 1).padStart(2, '0')}-${String(when.getDate()).padStart(2, '0')}`;

    derivedTotal += amount;
    derivedMonthly.set(monthKey, (derivedMonthly.get(monthKey) || 0) + amount);
    derivedDaily.set(dayKey, (derivedDaily.get(dayKey) || 0) + amount);
  }

  const effectiveMonthlyMap = monthlyMap.size ? monthlyMap : derivedMonthly;
  const effectiveDailyMap = dailyMap.size ? dailyMap : derivedDaily;
  const effectiveTotal =
    Number(revenue.total || 0) > 0 ? revenue.total : derivedTotal;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthRevenue = effectiveMonthlyMap.get(currentMonth) || 0;

  // Convert Map to plain object for JSON response
  const monthlyRevenueObj = {};
  effectiveMonthlyMap.forEach((value, key) => {
    monthlyRevenueObj[key] = value;
  });

  const dailyRevenueObj = {};
  effectiveDailyMap.forEach((value, key) => {
    dailyRevenueObj[key] = value;
  });

  // Generate trend data based on period
  const revenueData = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Normalize to start of day

  if (period === 'year') {
    // Show the current calendar year (Jan -> Dec) in chronological order.
    const year = currentDate.getFullYear();
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      revenueData.push({
        label: date.toLocaleString('default', { month: 'short' }),
        date: monthKey,
        revenue: monthlyRevenueObj[monthKey] || 0,
      });
    }
  } else if (period === 'month') {
    // Show the full current month from day 1 to month end.
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      revenueData.push({
        label: date.getDate().toString(),
        date: dayKey,
        revenue: dailyRevenueObj[dayKey] || 0,
      });
    }
  } else if (period === 'week' || period === 'day') {
    // Show last 7 days in chronological order.
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i,
      );
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const label = date.toLocaleDateString('en-US', { weekday: 'short' });

      revenueData.push({
        date: dayKey,
        label: label,
        revenue: dailyRevenueObj[dayKey] || 0,
      });
    }
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        total: effectiveTotal || 0,
        monthly: monthlyRevenueObj,
        thisMonth: thisMonthRevenue,
        chartData: revenueData,
      },
      'Revenue analytics fetched successfully',
    ),
  );
});

/**
 * @desc    Get revenue by date range
 * @route   GET /api/doctor/revenue/range
 * @access  Private (Doctor only)
 */
exports.getRevenueByRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const filter = {
    doctorId: req.user._id,
    status: 'completed',
    dateTime: {},
  };

  if (startDate) {
    filter.dateTime.$gte = new Date(startDate);
  }
  if (endDate) {
    filter.dateTime.$lte = new Date(endDate);
  }

  const Appointment = require('../../models/Appointment');
  const appointments = await Appointment.find(filter);
  const doctor = await Doctor.findOne({ userId: req.user._id });

  const fee = doctor?.consultationFee || 0;
  const totalRevenue = appointments.length * (fee * 0.8);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRevenue,
        count: appointments.length,
        startDate,
        endDate,
      },
      'Revenue by range fetched successfully',
    ),
  );
});

exports.getRevenueHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [entries, total] = await Promise.all([
    RevenueEntry.find({ doctorUserId: req.user._id })
      .sort({ occurredAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('patientUserId', 'name email')
      .lean(),
    RevenueEntry.countDocuments({ doctorUserId: req.user._id }),
  ]);

  let fallbackPrescriptions = [];
  if (total === 0) {
    fallbackPrescriptions = await Prescription.find({
      doctorId: req.user._id,
      totalCost: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('patientId', 'name email')
      .populate('clinicId', 'name')
      .lean();
  }

  const syntheticEntries = (fallbackPrescriptions || []).map(
    (prescription) => ({
      _id: `rx-${prescription._id}`,
      doctorUserId: req.user._id,
      clinicId: prescription.clinicId || null,
      patientUserId: prescription.patientId || null,
      appointmentId: prescription.appointmentId || null,
      prescriptionId: prescription._id,
      sourceType: 'manual_prescription',
      consultationFee: Number(prescription.consultationFee || 0),
      medicineCost: Number(prescription.medicineCost || 0),
      totalCost: Number(prescription.totalCost || 0),
      doctorShare: Number(prescription.totalCost || 0) * 0.8,
      clinicShare: Number(prescription.totalCost || 0) * 0.2,
      occurredAt: prescription.createdAt,
      patientUserId: prescription.patientId,
      patientName: prescription.patientId?.name || 'Patient',
    }),
  );

  const mergedEntries = entries.length ? entries : syntheticEntries;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        entries: mergedEntries,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: entries.length ? total : mergedEntries.length,
          pages: Math.ceil(
            (entries.length ? total : mergedEntries.length) / Number(limit),
          ),
        },
      },
      'Revenue history fetched successfully',
    ),
  );
});

exports.deleteRevenueHistoryRecord = asyncHandler(async (req, res) => {
  const record = await RevenueEntry.findOne({
    _id: req.params.id,
    doctorUserId: req.user._id,
  });

  if (!record) {
    throw new ApiError(404, 'Revenue history record not found');
  }

  await reverseRevenueEntry(record);
  await RevenueEntry.deleteOne({ _id: record._id });

  res
    .status(200)
    .json(
      new ApiResponse(200, null, 'Revenue history record deleted successfully'),
    );
});

exports.clearRevenueHistory = asyncHandler(async (req, res) => {
  const records = await RevenueEntry.find({ doctorUserId: req.user._id });

  for (const record of records) {
    await reverseRevenueEntry(record);
  }

  await RevenueEntry.deleteMany({ doctorUserId: req.user._id });

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Revenue history cleared successfully'));
});

module.exports = exports;
