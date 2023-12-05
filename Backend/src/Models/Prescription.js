const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema(
  {
    medicine: {
      type: [Object],
      required: true,
      //  unique: [true, "This medicine is already created"],
    },
    doctorID: {
      type: String,
      required: true,
    },
    patientID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    submitted: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
