const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const potientialDoctorSchema = new Schema({
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
  hourlyRate: {
    type: Number,
    required: true
  },
  affiliation: {
    type: String,
    required: true
  },
  educationalBackground: {
    type: String,
    required: true
  },
  patients: {
    type: Array,
    required: true
  }

}, { timestamps: true });

const PotientialDoctor = mongoose.model('PotientialDoctor', potientialDoctorSchema);
module.exports = PotientalDoctor;