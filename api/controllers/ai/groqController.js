const groqService = require('../../services/groqService');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const Prescription = require('../../models/Prescription');
const MedicalRecord = require('../../models/MedicalRecord');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const Clinic = require('../../models/Clinic');

const EMERGENCY_KEYWORDS = [
  'chest pain',
  "can't breathe",
  'unconscious',
  'stroke',
  'heart attack',
  'سینے میں درد',
  'سانس نہیں',
];

/**
 * @desc    Chat with Groq AI
 * @route   POST /api/ai/groq/chat
 * @access  Private (Patient-Only)
 */
exports.chat = asyncHandler(async (req, res) => {
  const { message, conversationHistory, language } = req.body;
  const userId = req.user._id;

  if (!message || message.trim().length === 0) {
    throw new ApiError(400, 'Message is required');
  }

  // Emergency Safety Guardrail
  const isEmergency = EMERGENCY_KEYWORDS.some((k) =>
    message.toLowerCase().includes(k.toLowerCase()),
  );
  if (isEmergency) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          reply:
            '🚨 **This sounds like a medical emergency.** Please call emergency services (1122 in Pakistan) immediately or go to the nearest emergency room. Do not wait.',
          isEmergency: true,
        },
        'Emergency response triggered',
      ),
    );
  }

  // Fetch full patient context
  let patientContext = '';
  try {
    const [
      patientProfile,
      prescriptions,
      upcomingAppointments,
      pastAppointments,
    ] = await Promise.all([
      Patient.findOne({ userId }),
      Prescription.find({ patientId: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
          path: 'doctorId',
          select: 'name',
          populate: {
            path: 'doctorProfile',
            select: 'fullName specialization',
          },
        })
        .populate('clinicId', 'name address'),
      Appointment.find({
        patientId: userId,
        dateTime: { $gte: new Date() },
        status: { $in: ['pending', 'confirmed', 'reserved'] },
      })
        .sort({ dateTime: 1 })
        .limit(5)
        .populate({
          path: 'doctorId',
          select: 'name',
          populate: {
            path: 'doctorProfile',
            select: 'fullName specialization',
          },
        })
        .populate('clinicId', 'name address'),
      Appointment.find({ patientId: userId, dateTime: { $lt: new Date() } })
        .sort({ dateTime: -1 })
        .limit(5)
        .populate({
          path: 'doctorId',
          select: 'name',
          populate: {
            path: 'doctorProfile',
            select: 'fullName specialization',
          },
        })
        .populate('clinicId', 'name'),
    ]);

    let records = [];
    if (patientProfile) {
      records = await MedicalRecord.find({ patientId: patientProfile._id })
        .sort({ visitDate: -1 })
        .limit(5);
    }

    // Patient profile basics
    if (patientProfile) {
      patientContext += `PATIENT PROFILE:\n`;
      patientContext += `- Name: ${patientProfile.name || req.user.name || 'N/A'}\n`;
      patientContext += `- Blood Group: ${patientProfile.bloodGroup || 'N/A'}\n`;
      patientContext += `- Gender: ${patientProfile.gender || 'N/A'}\n`;
      patientContext += `- DOB: ${patientProfile.dob ? new Date(patientProfile.dob).toLocaleDateString() : 'N/A'}\n`;
      if (patientProfile.allergies?.length > 0) {
        patientContext += `- Allergies: ${patientProfile.allergies.join(', ')}\n`;
      }
    }

    // Upcoming appointments
    if (upcomingAppointments.length > 0) {
      patientContext += `\nUPCOMING APPOINTMENTS (${upcomingAppointments.length}):\n`;
      upcomingAppointments.forEach((a, i) => {
        const drName =
          a.doctorId?.doctorProfile?.fullName || a.doctorId?.name || 'Doctor';
        const spec = a.doctorId?.doctorProfile?.specialization || '';
        const clinic = a.clinicId?.name || 'Clinic';
        const addr = a.clinicId?.address || '';
        const dt = a.dateTime
          ? new Date(a.dateTime).toLocaleString('en-PK', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : 'TBD';
        patientContext += `${i + 1}. ${dt} — Dr. ${drName}${spec ? ` (${spec})` : ''} at ${clinic}${addr ? `, ${addr}` : ''}. Status: ${a.status}.\n`;
        if (a.reason) patientContext += `   Reason: ${a.reason}\n`;
      });
    } else {
      patientContext += `\nUPCOMING APPOINTMENTS: None scheduled.\n`;
    }

    // Past appointments
    if (pastAppointments.length > 0) {
      patientContext += `\nPAST APPOINTMENTS (recent ${pastAppointments.length}):\n`;
      pastAppointments.forEach((a) => {
        const drName =
          a.doctorId?.doctorProfile?.fullName || a.doctorId?.name || 'Doctor';
        const clinic = a.clinicId?.name || 'Clinic';
        const dt = a.dateTime
          ? new Date(a.dateTime).toLocaleDateString('en-PK')
          : 'N/A';
        patientContext += `- ${dt}: Dr. ${drName} at ${clinic}. Status: ${a.status}.\n`;
      });
    }

    // Prescriptions
    if (prescriptions.length > 0) {
      patientContext += `\nPRESCRIPTIONS (recent ${prescriptions.length}):\n`;
      prescriptions.forEach((p) => {
        const drName =
          p.doctorId?.doctorProfile?.fullName || p.doctorId?.name || 'Doctor';
        const clinic = p.clinicId?.name || '';
        const meds = (p.medicines || [])
          .map(
            (m) =>
              `${m.name}${m.dosage ? ` ${m.dosage}` : ''}${m.frequency ? ` ${m.frequency}` : ''}`,
          )
          .join(', ');
        patientContext += `- ${new Date(p.createdAt).toLocaleDateString()}: Diagnosis: ${p.diagnosis}. Dr. ${drName}${clinic ? ` @ ${clinic}` : ''}.\n`;
        if (meds) patientContext += `  Medicines: ${meds}.\n`;
        if (p.notes) patientContext += `  Notes: ${p.notes}.\n`;
        if (p.followUpDate)
          patientContext += `  Follow-up: ${new Date(p.followUpDate).toLocaleDateString()}.\n`;
      });
    }

    // Medical records
    if (records.length > 0) {
      patientContext += `\nMEDICAL RECORDS:\n`;
      records.forEach((r) => {
        patientContext += `- ${new Date(r.visitDate).toLocaleDateString()}: ${r.chiefComplaint}. Diagnosis: ${r.diagnosis}.\n`;
      });
    }
  } catch (ctxError) {
    console.error('Failed to fetch patient context for AI:', ctxError);
  }

  try {
    const reply = await groqService.chat(
      message,
      conversationHistory || [],
      patientContext,
      language,
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reply, isEmergency: false },
          'Groq AI response generated successfully',
        ),
      );
  } catch (error) {
    console.error('Groq AI Chat Error:', error);
    throw new ApiError(
      500,
      error.message || 'Failed to process AI request with Groq',
    );
  }
});

/**
 * @desc    Get health advice from Groq
 * @route   POST /api/ai/groq/health-advice
 * @access  Private (Patient)
 */
exports.getHealthAdvice = asyncHandler(async (req, res) => {
  const { query, language } = req.body;
  const userId = req.user._id;

  if (!query || query.trim().length === 0) {
    throw new ApiError(400, 'Query is required');
  }

  // Fetch Patient Context
  let patientContext = '';
  try {
    const patientProfile = await Patient.findOne({ userId });
    const prescriptions = await Prescription.find({ patientId: userId })
      .sort({ createdAt: -1 })
      .limit(3);
    let records = [];
    if (patientProfile) {
      records = await MedicalRecord.find({ patientId: patientProfile._id })
        .sort({ visitDate: -1 })
        .limit(3);
    }

    if (prescriptions.length > 0 || records.length > 0) {
      patientContext = 'PATIENT HISTORY:\n';
      prescriptions.forEach((p) => {
        patientContext += `- Prescription (${new Date(p.createdAt).toLocaleDateString()}): ${p.diagnosis}. Medicines: ${p.medicines.map((m) => m.name).join(', ')}.\n`;
      });
      records.forEach((r) => {
        patientContext += `- Record (${new Date(r.visitDate).toLocaleDateString()}): ${r.chiefComplaint}. ${r.diagnosis}.\n`;
      });
    }
  } catch (ctxError) {
    console.error('Failed to fetch context for health advice:', ctxError);
  }

  try {
    const advice = await groqService.getHealthAdvice(
      query,
      patientContext,
      language,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { advice },
          'Health advice generated successfully with Groq',
        ),
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || 'Failed to get health advice with Groq',
    );
  }
});

/**
 * @desc    Doctor clinical AI chat
 * @route   POST /api/ai/doctor/chat
 * @access  Private (Doctor only)
 */
exports.doctorChat = asyncHandler(async (req, res) => {
  const { message, conversationHistory, language } = req.body;
  const userId = req.user._id;

  if (!message || message.trim().length === 0) {
    throw new ApiError(400, 'Message is required');
  }

  // Emergency guardrail
  const isEmergency = EMERGENCY_KEYWORDS.some((k) =>
    message.toLowerCase().includes(k.toLowerCase()),
  );
  if (isEmergency) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          reply:
            '🚨 **This sounds like a medical emergency.** Please call emergency services (1122 in Pakistan) immediately.',
          isEmergency: true,
        },
        'Emergency response triggered',
      ),
    );
  }

  // Build full doctor context
  let doctorContext = '';
  try {
    const [
      doctorProfile,
      todayAppointments,
      upcomingAppointments,
      recentPrescriptions,
    ] = await Promise.all([
      Doctor.findOne({ userId }).populate('clinicId', 'name address'),
      Appointment.find({
        doctorId: userId,
        dateTime: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      })
        .sort({ dateTime: 1 })
        .populate('patientId', 'name phone'),
      Appointment.find({
        doctorId: userId,
        dateTime: { $gte: new Date() },
        status: { $in: ['pending', 'confirmed', 'reserved'] },
      })
        .sort({ dateTime: 1 })
        .limit(10)
        .populate('patientId', 'name phone'),
      Prescription.find({ doctorId: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('patientId', 'name'),
    ]);

    if (doctorProfile) {
      doctorContext += `DOCTOR PROFILE:\n`;
      doctorContext += `- Name: ${doctorProfile.fullName || req.user.name || 'N/A'}\n`;
      doctorContext += `- Specialization: ${doctorProfile.specialization || 'N/A'}\n`;
      doctorContext += `- License: ${doctorProfile.licenseNo || 'N/A'}\n`;
      doctorContext += `- Consultation Fee: PKR ${doctorProfile.consultationFee || 0}\n`;
      doctorContext += `- Rating: ${doctorProfile.averageRating || 'N/A'} (${doctorProfile.totalReviews || 0} reviews)\n`;
      if (doctorProfile.clinicId) {
        doctorContext += `- Clinic: ${doctorProfile.clinicId.name}, ${doctorProfile.clinicId.address}\n`;
      }
      if (doctorProfile.bio) doctorContext += `- Bio: ${doctorProfile.bio}\n`;
    }

    if (todayAppointments.length > 0) {
      doctorContext += `\nTODAY'S APPOINTMENTS (${todayAppointments.length}):\n`;
      todayAppointments.forEach((a, i) => {
        const t = a.dateTime
          ? new Date(a.dateTime).toLocaleTimeString('en-PK', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'TBD';
        doctorContext += `${i + 1}. ${t} — ${a.patientId?.name || 'Patient'}${a.patientId?.phone ? ` (${a.patientId.phone})` : ''}. Status: ${a.status}. Reason: ${a.reason || 'N/A'}.\n`;
      });
    } else {
      doctorContext += `\nTODAY'S APPOINTMENTS: None.\n`;
    }

    if (upcomingAppointments.length > 0) {
      doctorContext += `\nUPCOMING APPOINTMENTS (next ${upcomingAppointments.length}):\n`;
      upcomingAppointments.forEach((a) => {
        const dt = a.dateTime
          ? new Date(a.dateTime).toLocaleString('en-PK', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : 'TBD';
        doctorContext += `- ${dt}: ${a.patientId?.name || 'Patient'}. Status: ${a.status}.\n`;
      });
    }

    if (recentPrescriptions.length > 0) {
      doctorContext += `\nRECENT PRESCRIPTIONS ISSUED (${recentPrescriptions.length}):\n`;
      recentPrescriptions.forEach((p) => {
        const meds =
          (p.medicines || [])
            .map((m) => `${m.name}${m.dosage ? ` ${m.dosage}` : ''}`)
            .join(', ') || 'N/A';
        doctorContext += `- ${new Date(p.createdAt).toLocaleDateString()}: Patient: ${p.patientId?.name || 'N/A'}. Diagnosis: ${p.diagnosis}. Medicines: ${meds}.\n`;
      });
    }
  } catch (ctxError) {
    console.error('Failed to fetch doctor context for AI:', ctxError);
  }

  try {
    const reply = await groqService.doctorChat(
      message,
      conversationHistory || [],
      doctorContext,
      language,
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reply, isEmergency: false },
          'Doctor AI response generated',
        ),
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || 'Failed to process doctor AI request',
    );
  }
});

/**
 * @desc    Clinic admin operational AI chat
 * @route   POST /api/ai/clinic/chat
 * @access  Private (clinic_admin only)
 */
exports.clinicChat = asyncHandler(async (req, res) => {
  const { message, conversationHistory, language } = req.body;
  const userId = req.user._id;

  if (!message || message.trim().length === 0) {
    throw new ApiError(400, 'Message is required');
  }

  // Build clinic context
  let clinicContext = '';
  try {
    const clinic = await Clinic.findOne({ adminId: userId }).populate(
      'doctors',
      'fullName specialization',
    );

    if (clinic) {
      clinicContext += `CLINIC PROFILE:\n- Name: ${clinic.name || 'N/A'}\n- Address: ${clinic.address || 'N/A'}\n- Phone: ${clinic.phone || 'N/A'}\n- Doctors on staff: ${clinic.doctors?.length || 0}\n`;

      if (clinic.doctors?.length > 0) {
        clinicContext += '\nDOCTORS:\n';
        clinic.doctors.forEach((d) => {
          clinicContext += `- ${d.fullName || 'N/A'} (${d.specialization || 'N/A'})\n`;
        });
      }

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const doctorIds = (clinic.doctors || []).map((d) => d.userId || d._id);

      const todayCount = await Appointment.countDocuments({
        doctorId: { $in: doctorIds },
        dateTime: { $gte: todayStart, $lte: todayEnd },
      });

      const monthStart = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );
      const monthCount = await Appointment.countDocuments({
        doctorId: { $in: doctorIds },
        dateTime: { $gte: monthStart },
      });

      clinicContext += `\nOPERATIONS:\n- Appointments today: ${todayCount}\n- Appointments this month: ${monthCount}\n- Revenue (total): PKR ${clinic.revenue?.total?.toLocaleString() || 0}\n`;
    }
  } catch (ctxError) {
    console.error('Failed to fetch clinic context for AI:', ctxError);
  }

  try {
    const reply = await groqService.clinicChat(
      message,
      conversationHistory || [],
      clinicContext,
      language,
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reply, isEmergency: false },
          'Clinic AI response generated',
        ),
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || 'Failed to process clinic AI request',
    );
  }
});
