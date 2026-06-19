const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const Prescription = require('../../models/Prescription');
const Patient = require('../../models/Patient');

/**
 * Get all medical records (prescriptions)
 * @route GET /api/patient/records
 * @access Private (Patient only)
 */
exports.getRecords = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  // Find patient by userId - with fallback (matching dashboard)
  let patient = await Patient.findOne({ userId });
  if (!patient) {
    const User = require('../../models/User');
    const user = await User.findById(userId);
    if (user && user.roles.includes('patient')) {
      patient = await Patient.create({
        userId: user._id,
        name: user.name,
        email: user.email,
      });
    }
  }

  // Fetch in parallel
  const MedicalRecord = require('../../models/MedicalRecord');
  const [prescriptions, personalRecords] = await Promise.all([
    Prescription.find({ patientId: userId })
      .select(
        'doctorId clinicId diagnosis chiefComplaint attachments createdAt updatedAt',
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: 'doctorId',
        select: 'name',
      })
      .populate('clinicId', 'name')
      .lean(),
    patient
      ? MedicalRecord.find({ patientId: patient._id, prescriptionId: null })
          .select(
            'doctorId clinicId diagnosis chiefComplaint attachments createdAt updatedAt visitDate externalDoctorName externalClinicName',
          )
          .sort({ createdAt: -1 })
          .limit(limit)
          .populate('doctorId', 'name')
          .populate('clinicId', 'name')
          .lean()
      : [],
  ]);

  const compactAttachments = (attachments = []) =>
    Array.isArray(attachments)
      ? attachments.map((a) => ({ fileName: a.fileName, fileType: a.fileType }))
      : [];

  // Map to unified format
  const mappedPrescriptions = prescriptions.map((p) => ({
    ...p,
    attachments: compactAttachments(p.attachments),
    type: 'prescription',
    author: 'doctor',
    date: p.createdAt || p.updatedAt || new Date(),
  }));

  const mappedPersonal = personalRecords.map((r) => ({
    ...r,
    attachments: compactAttachments(r.attachments),
    type: 'document',
    author: 'patient',
    date: r.visitDate || r.createdAt || r.updatedAt || new Date(),
  }));

  // Combine and sort
  const allRecords = [...mappedPrescriptions, ...mappedPersonal]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  res
    .status(200)
    .json(new ApiResponse(200, allRecords, 'Records fetched successfully'));
});

/**
 * Get prescription detail by ID
 * @route GET /api/patient/records/:id
 * @access Private (Patient only)
 */
exports.getRecordDetail = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  // 1. Try finding in Prescription
  let record = await Prescription.findOne({
    _id: id,
    patientId: userId,
  })
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: {
        path: 'doctorProfile',
        select: 'specialization fullName licenseNumber',
      },
    })
    .populate('clinicId', 'name address phone email')
    .populate('patientId', 'name email dob');

  let type = 'prescription';

  // 2. If not found, try MedicalRecord
  if (!record) {
    const MedicalRecord = require('../../models/MedicalRecord');
    const patient = await Patient.findOne({ userId });
    if (patient) {
      record = await MedicalRecord.findOne({
        _id: id,
        patientId: patient._id,
      }).populate('clinicId', 'name address phone email');

      if (record) {
        type = 'document';
        // Mocking structure for detail page consistency
        record = record.toObject();
        record.diagnosis = record.diagnosis || record.chiefComplaint;
        // Use user data for patientId placeholder in documents
        const requesterUser =
          await require('../../models/User').findById(userId);
        record.patientId = {
          _id: userId,
          name: requesterUser?.name,
          email: requesterUser?.email,
        };
      }
    }
  }

  if (!record) {
    throw new ApiError(404, 'Medical record not found');
  }

  const recordObj = record.toObject ? record.toObject() : record;

  // 3. Robust Patient Profile Sync for Gender/BloodGroup
  let patientProfile;
  const pId = recordObj.patientId?._id || recordObj.patientId;

  if (type === 'prescription') {
    // For prescriptions, patientId is a User ID
    patientProfile = await Patient.findOne({ userId: pId });
  } else {
    // For MedicalRecord, check if pId exists in Patient model first, then User model
    patientProfile =
      (await Patient.findById(pId)) || (await Patient.findOne({ userId: pId }));
  }

  if (patientProfile) {
    // If patientId is still just an ID, transform it into an object
    if (
      !recordObj.patientId ||
      typeof recordObj.patientId !== 'object' ||
      !recordObj.patientId.name
    ) {
      const User = require('../../models/User');
      const patientUser = await User.findById(patientProfile.userId).select(
        'name email',
      );
      recordObj.patientId = {
        _id: patientProfile.userId,
        name: patientUser?.name || patientProfile.name,
        email: patientUser?.email || patientProfile.email,
      };
    }

    // Explicitly copy demographics from profile (fallback to profile name if necessary)
    if (!recordObj.patientId.name)
      recordObj.patientId.name = patientProfile.name;
    recordObj.patientId.gender = patientProfile.gender || 'N/A';
    recordObj.patientId.bloodGroup = patientProfile.bloodGroup || 'N/A';
    recordObj.patientId.contact =
      patientProfile.contact || patientProfile.phone || 'N/A';
    recordObj.patientId.dob = patientProfile.dob;
  }

  // Handle clinic/doctor name fallbacks for personal uploads
  if (type === 'document') {
    if (!recordObj.clinicId && recordObj.externalClinicName) {
      recordObj.clinicId = {
        name: recordObj.externalClinicName,
        isExternal: true,
      };
    }
    if (!recordObj.doctorId && recordObj.externalDoctorName) {
      recordObj.doctorId = {
        name: recordObj.externalDoctorName,
        isExternal: true,
      };
    }
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...recordObj, type },
        'Record details fetched successfully',
      ),
    );
});

/**
 * Upload a personal medical record (Lab report, imaging, etc)
 * @route POST /api/patient/records/upload
 * @access Private (Patient only)
 */
exports.uploadRecord = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { title, recordType, date, doctorName, clinicName, fileUrl, notes } =
    req.body;

  // Find patient by userId
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const MedicalRecord = require('../../models/MedicalRecord');
  const record = await MedicalRecord.create({
    patientId: patient._id,
    doctorId: userId, // Patient's own record, but model requires doctorId, using userId as placeholder
    visitDate: date || new Date(),
    chiefComplaint: title || 'Patient Uploaded Record',
    diagnosis: recordType || 'Lab Result',
    externalDoctorName: doctorName,
    externalClinicName: clinicName,
    notes: notes || '',
    attachments: fileUrl
      ? [
          {
            fileName: title || 'Medical Document',
            fileUrl: fileUrl,
            fileType: 'document',
          },
        ]
      : [],
  });

  res
    .status(201)
    .json(new ApiResponse(201, record, 'Medical record uploaded successfully'));
});

/**
 * Delete a medical record
 * @route DELETE /api/patient/records/:id
 * @access Private (Patient only)
 */
exports.deleteRecord = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  // Find patient
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const MedicalRecord = require('../../models/MedicalRecord');
  let deleted = await MedicalRecord.findOneAndDelete({
    _id: id,
    patientId: patient._id,
  });

  // If it's not a personal upload, allow deleting patient-owned prescription as well.
  if (!deleted) {
    const prescription = await Prescription.findOneAndDelete({
      _id: id,
      patientId: userId,
    });

    if (prescription) {
      await MedicalRecord.deleteMany({ prescriptionId: id });
      const Appointment = require('../../models/Appointment');
      await Appointment.updateMany(
        { prescriptionId: id, patientId: userId },
        { $unset: { prescriptionId: 1 } },
      );
      deleted = prescription;
    }
  }

  if (!deleted) throw new ApiError(404, 'Record not found or already deleted');

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Record deleted successfully'));
});
