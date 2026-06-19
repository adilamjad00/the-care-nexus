const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    bloodGroup: {
      type: String,
    },
    photo: {
      type: String, // URL of the uploaded image
    },
    allergies: [String],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
