const Doctor = require('../../models/Doctor');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * @desc    Get doctor's schedule
 * @route   GET /api/doctor/schedule
 * @access  Private (Doctor only)
 */
exports.getSchedule = asyncHandler(async (req, res) => {
  const doctorProfile = await Doctor.findOne({ userId: req.user._id });

  if (!doctorProfile) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  const schedule = doctorProfile.schedule || {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  res
    .status(200)
    .json(new ApiResponse(200, { schedule }, 'Schedule fetched successfully'));
});

/**
 * @desc    Update doctor's schedule
 * @route   PUT /api/doctor/schedule
 * @access  Private (Doctor only)
 */
exports.updateSchedule = asyncHandler(async (req, res) => {
  const { schedule } = req.body;

  if (!schedule) {
    throw new ApiError(400, 'Schedule data is required');
  }

  const validDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  for (const day of Object.keys(schedule)) {
    if (!validDays.includes(day.toLowerCase())) {
      throw new ApiError(400, `Invalid day: ${day}`);
    }

    if (!Array.isArray(schedule[day])) {
      throw new ApiError(
        400,
        `Schedule for ${day} must be an array of time slots`,
      );
    }
  }

  const doctorProfile = await Doctor.findOne({ userId: req.user._id });

  if (!doctorProfile) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  doctorProfile.schedule = {
    monday: schedule.monday || [],
    tuesday: schedule.tuesday || [],
    wednesday: schedule.wednesday || [],
    thursday: schedule.thursday || [],
    friday: schedule.friday || [],
    saturday: schedule.saturday || [],
    sunday: schedule.sunday || [],
  };

  doctorProfile.markModified('schedule');
  await doctorProfile.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { schedule: doctorProfile.schedule },
        'Schedule updated successfully',
      ),
    );
});

/**
 * @desc    Update specific day schedule
 * @route   PUT /api/doctor/schedule/:day
 * @access  Private (Doctor only)
 */
exports.updateDaySchedule = asyncHandler(async (req, res) => {
  const { day } = req.params;
  const { isAvailable, slots } = req.body;

  const validDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  if (!validDays.includes(day.toLowerCase())) {
    throw new ApiError(400, 'Invalid day');
  }

  const doctorProfile = await Doctor.findOne({ userId: req.user._id });

  if (!doctorProfile) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  if (!doctorProfile.schedule) {
    doctorProfile.schedule = {};
  }

  doctorProfile.schedule[day] = {
    isAvailable: isAvailable !== undefined ? isAvailable : false,
    slots: slots || [],
  };

  await doctorProfile.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { schedule: doctorProfile.schedule },
        `${day} schedule updated successfully`,
      ),
    );
});

/**
 * @desc    Get available slots for a specific date
 * @route   GET /api/doctor/schedule/slots
 * @access  Public
 */
exports.getAvailableSlots = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    throw new ApiError(400, 'Doctor ID and date are required');
  }

  const doctorProfile = await Doctor.findOne({ userId: doctorId });

  if (!doctorProfile) {
    throw new ApiError(404, 'Doctor not found');
  }

  const requestedDate = new Date(date);
  const dayName = requestedDate
    .toLocaleLowerCase('en-US', { weekday: 'long' })
    .toLowerCase();

  const daySchedule = doctorProfile.schedule?.[dayName];

  if (!daySchedule || !daySchedule.isAvailable) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { availableSlots: [] },
          'No slots available for this day',
        ),
      );
  }

  // Here you could add logic to check for existing appointments and filter out booked slots
  // For now, returning all configured slots
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { availableSlots: daySchedule.slots },
        'Available slots fetched successfully',
      ),
    );
});

/**
 * @desc    Add a time slot to a specific day
 * @route   POST /api/doctor/schedule/:day/slots
 * @access  Private (Doctor only)
 */
exports.addSlot = asyncHandler(async (req, res) => {
  const { day } = req.params;
  const { startTime, endTime } = req.body;

  const validDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  if (!validDays.includes(day.toLowerCase())) {
    throw new ApiError(400, 'Invalid day');
  }

  if (!startTime || !endTime) {
    throw new ApiError(400, 'Start time and end time are required');
  }

  const doctorProfile = await Doctor.findOne({ userId: req.user._id });

  if (!doctorProfile) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  if (!doctorProfile.schedule) {
    doctorProfile.schedule = {};
  }

  if (!doctorProfile.schedule[day]) {
    doctorProfile.schedule[day] = { isAvailable: true, slots: [] };
  }

  doctorProfile.schedule[day].slots.push({ startTime, endTime });
  await doctorProfile.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { schedule: doctorProfile.schedule },
        'Slot added successfully',
      ),
    );
});

/**
 * @desc    Remove a time slot from a specific day
 * @route   DELETE /api/doctor/schedule/:day/slots/:slotIndex
 * @access  Private (Doctor only)
 */
exports.removeSlot = asyncHandler(async (req, res) => {
  const { day, slotIndex } = req.params;

  const validDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  if (!validDays.includes(day.toLowerCase())) {
    throw new ApiError(400, 'Invalid day');
  }

  const doctorProfile = await Doctor.findOne({ userId: req.user._id });

  if (!doctorProfile) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  if (!doctorProfile.schedule?.[day]?.slots) {
    throw new ApiError(404, 'No slots found for this day');
  }

  const index = parseInt(slotIndex);
  if (index < 0 || index >= doctorProfile.schedule[day].slots.length) {
    throw new ApiError(400, 'Invalid slot index');
  }

  doctorProfile.schedule[day].slots.splice(index, 1);
  await doctorProfile.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { schedule: doctorProfile.schedule },
        'Slot removed successfully',
      ),
    );
});
