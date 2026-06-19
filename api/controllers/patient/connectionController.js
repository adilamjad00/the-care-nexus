const ConnectionRequest = require('../../models/ConnectionRequest');
const Notification = require('../../models/Notification');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * @desc    Get all connection requests for the patient
 * @route   GET /api/patient/connections/requests
 * @access  Private (Patient only)
 */
exports.getConnectionRequests = asyncHandler(async (req, res) => {
  const requests = await ConnectionRequest.find({
    toPatientId: req.user._id,
    status: 'pending'
  }).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, requests, 'Connection requests fetched successfully')
  );
});

/**
 * @desc    Approve or reject a connection request
 * @route   PUT /api/patient/connections/requests/:id
 * @access  Private (Patient only)
 */
exports.handleConnectionRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const requestId = req.params.id;

  if (!['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Status must be approved or rejected');
  }

  const request = await ConnectionRequest.findOne({
    _id: requestId,
    toPatientId: req.user._id,
    status: 'pending'
  });

  if (!request) {
    throw new ApiError(404, 'Connection request not found or already handled');
  }

  request.status = status;
  await request.save();

  // Notify the requester (doctor or clinic)
  await Notification.create({
    recipient: request.fromId,
    sender: req.user._id,
    title: `Connection Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `${req.user.name} has ${status} your connection request.`,
    type: status === 'approved' ? 'success' : 'warning',
    portal: request.fromRole === 'doctor' ? 'doctor' : 'clinic_admin'
  });

  // Emit socket event to the requester
  const io = req.app.get('io');
  if (io) {
    io.to(request.fromId.toString()).emit('connection_request_handled', {
      requestId: request._id,
      status: status,
      patientName: req.user.name
    });
  }

  res.status(200).json(
    new ApiResponse(200, request, `Connection request ${status} successfully`)
  );
});
