const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
   name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  emergencyFullName: {
    type: String,
    required: true
  },
  emergencyMobileNumber: {
    type: String,
    required: true
  }
}, { timestamps: true });

const User = mongoose.model('Patient', patientSchema);
module.exports = Patient;