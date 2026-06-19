const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const reviewController = require('../controllers/patient/reviewController');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get all doctors with filters (Public)
 * @route   GET /api/public/doctors
 * @access  Public
 */
router.get(
  '/doctors',
  asyncHandler(async (req, res) => {
    const { specialization, city, minRating, minExperience, search } =
      req.query;

    const pipeline = [
      // 1. Join with User
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      // 2. Join with Clinic
      {
        $lookup: {
          from: 'clinics',
          localField: 'clinicId',
          foreignField: '_id',
          as: 'clinicDetails',
        },
      },
      { $unwind: { path: '$clinicDetails', preserveNullAndEmptyArrays: true } },
    ];

    const matchQuery = {};

    if (search) {
      matchQuery.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { 'userDetails.name': { $regex: search, $options: 'i' } },
        { 'userDetails.email': { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'clinicDetails.name': { $regex: search, $options: 'i' } },
        { 'clinicDetails.address': { $regex: search, $options: 'i' } },
      ];
    }

    if (specialization) {
      matchQuery.specialization = { $regex: specialization, $options: 'i' };
    }

    if (city && city !== 'All Cities' && city !== '') {
      matchQuery.$and = [
        ...(matchQuery.$and || []),
        {
          $or: [
            { 'location.city': { $regex: city, $options: 'i' } },
            { 'clinicDetails.address': { $regex: city, $options: 'i' } },
            { 'clinicDetails.name': { $regex: city, $options: 'i' } },
          ],
        },
      ];
      delete matchQuery.$or; // prevent conflict
    }

    if (minExperience && parseInt(minExperience) > 0) {
      matchQuery.experience = { $gte: parseInt(minExperience) };
    }

    if (minRating && parseFloat(minRating) > 0) {
      matchQuery.averageRating = { $gte: parseFloat(minRating) };
    }

    if (Object.keys(matchQuery).length > 0) {
      pipeline.push({ $match: matchQuery });
    }

    // Project output to match previous structure
    pipeline.push({
      $project: {
        userId: {
          _id: '$userDetails._id',
          name: '$userDetails.name',
          email: '$userDetails.email',
          photo: '$userDetails.photo',
        },
        clinicId: {
          _id: { $ifNull: ['$clinicDetails._id', null] },
          name: {
            $ifNull: [
              '$clinicDetails.name',
              { $ifNull: ['$location.address', 'Private Clinic'] },
            ],
          },
          address: {
            $ifNull: [
              '$clinicDetails.address',
              { $ifNull: ['$location.city', 'Global'] },
            ],
          },
          workingHours: '$clinicDetails.workingHours',
        },
        fullName: 1,
        specialization: 1,
        experience: 1,
        consultationFee: 1,
        averageRating: 1,
        totalReviews: 1,
        location: 1,
        isVerified: 1,
        bio: 1,
        education: 1,
        languages: 1,
      },
    });

    const doctors = await Doctor.aggregate(pipeline);

    res
      .status(200)
      .json(new ApiResponse(200, doctors, 'Doctors fetched successfully'));
  }),
);

/**
 * @desc    Get single doctor profile (Public)
 * @route   GET /api/public/doctors/:id
 * @access  Public
 */
router.get(
  '/doctors/:id',
  asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email phone photo',
      })
      .populate('clinicId');

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, doctor, 'Doctor profile fetched successfully'),
      );
  }),
);

/**
 * @desc    Get reviews for a doctor (Public)
 * @route   GET /api/public/doctors/:id/reviews
 * @access  Public
 */
router.get('/doctors/:id/reviews', reviewController.getPublicDoctorReviews);

module.exports = router;
