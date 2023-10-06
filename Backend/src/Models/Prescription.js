const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  medicine: {
    type: Array,
    required: true,
  },
  doctorName: {
    type: String,
    required: true
  },
  patientUsername: {
    type: String,
    required: true
  }

}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;