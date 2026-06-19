const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const FamilyMember = require('../../models/FamilyMember');
const Prescription = require('../../models/Prescription');
const Patient = require('../../models/Patient');
const MedicalRecord = require('../../models/MedicalRecord');

/**
 * Get all family members
 * @route GET /api/patient/family
 * @access Private (Patient only)
 */
exports.getFamilyMembers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find patient by userId
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const familyMembers = await FamilyMember.find({ patientId: patient._id });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        familyMembers,
        'Family members fetched successfully',
      ),
    );
});

/**
 * Add a family member
 * @route POST /api/patient/family
 * @access Private (Patient only)
 */
exports.addFamilyMember = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, relation, dob, bloodGroup, allergies, photo } = req.body;

  // Find patient by userId
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const familyMember = await FamilyMember.create({
    patientId: patient._id,
    name,
    relation,
    dob,
    bloodGroup,
    allergies,
    photo,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, familyMember, 'Family member added successfully'),
    );
});

/**
 * Edit a family member
 * @route PUT /api/patient/family/:memberId
 * @access Private (Patient only)
 */
exports.editFamilyMember = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { memberId } = req.params;
  const { name, relation, dob, bloodGroup, allergies, photo } = req.body;

  // Find patient by userId
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const familyMember = await FamilyMember.findOne({
    _id: memberId,
    patientId: patient._id,
  });

  if (!familyMember) {
    throw new ApiError(404, 'Family member not found');
  }

  familyMember.name = name || familyMember.name;
  familyMember.relation = relation || familyMember.relation;
  familyMember.dob = dob || familyMember.dob;
  familyMember.bloodGroup = bloodGroup || familyMember.bloodGroup;
  familyMember.allergies = allergies || familyMember.allergies;
  if (photo !== undefined) familyMember.photo = photo;

  await familyMember.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, familyMember, 'Family member updated successfully'),
    );
});

/**
 * Delete a family member
 * @route DELETE /api/patient/family/:memberId
 * @access Private (Patient only)
 */
exports.deleteFamilyMember = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { memberId } = req.params;

  // Find patient by userId
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const familyMember = await FamilyMember.findOneAndDelete({
    _id: memberId,
    patientId: patient._id,
  });

  if (!familyMember) {
    throw new ApiError(404, 'Family member not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Family member deleted successfully'));
});

/**
 * Get family member's medical records
 * @route GET /api/patient/family/:memberId/records
 * @access Private (Patient only)
 */
exports.getFamilyRecords = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { memberId } = req.params;

  // Find patient by userId
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  // Verify family member belongs to this patient
  const familyMember = await FamilyMember.findOne({
    _id: memberId,
    patientId: patient._id,
  });

  if (!familyMember) {
    throw new ApiError(404, 'Family member not found');
  }

  // Find medical records for this family member
  const records = await MedicalRecord.find({ familyMemberId: memberId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'doctorId',
      select: 'name email photo',
      populate: { path: 'doctorProfile', select: 'specialization fullName' },
    })
    .populate('clinicId', 'name address phone');

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        records,
        'Family member records fetched successfully',
      ),
    );
});

/**
 * Add a family member medical record (patient-uploaded)
 * @route POST /api/patient/family/:memberId/records
 * @access Private (Patient only)
 */
exports.addFamilyRecord = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { memberId } = req.params;
  const { title, diagnosis, doctorName, clinicName, date, notes, fileUrl } =
    req.body;

  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const familyMember = await FamilyMember.findOne({
    _id: memberId,
    patientId: patient._id,
  });

  if (!familyMember) {
    throw new ApiError(404, 'Family member not found');
  }

  if (!title || !diagnosis || !fileUrl) {
    throw new ApiError(400, 'Title, diagnosis, and attachment are required');
  }

  const record = await MedicalRecord.create({
    patientId: patient._id,
    doctorId: userId,
    familyMemberId: familyMember._id,
    visitDate: date || new Date(),
    chiefComplaint: title,
    diagnosis,
    externalDoctorName: doctorName || '',
    externalClinicName: clinicName || '',
    notes: notes || '',
    attachments: [
      {
        fileName: title,
        fileUrl,
        fileType: 'document',
      },
    ],
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, record, 'Family member record added successfully'),
    );
});

/**
 * Delete a family member medical record
 * @route DELETE /api/patient/family/:memberId/records/:recordId
 * @access Private (Patient only)
 */
exports.deleteFamilyRecord = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { memberId, recordId } = req.params;

  const patient = await Patient.findOne({ userId });
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const familyMember = await FamilyMember.findOne({
    _id: memberId,
    patientId: patient._id,
  });

  if (!familyMember) {
    throw new ApiError(404, 'Family member not found');
  }

  const record = await MedicalRecord.findOneAndDelete({
    _id: recordId,
    familyMemberId: familyMember._id,
    patientId: patient._id,
  });

  if (!record) {
    throw new ApiError(404, 'Family record not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Family record deleted successfully'));
});
