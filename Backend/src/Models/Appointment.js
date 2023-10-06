const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    date: {
        type: Date,
        required: true,
      },
    description: {
        type: String,
        required: true,
      },
      patientID: {
        type: String,
        required: true,
      },
      doctorID: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;