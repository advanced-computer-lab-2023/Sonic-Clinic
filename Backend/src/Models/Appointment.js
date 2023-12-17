const { timeStamp, time } = require("console");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    date: {
      type: String,
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
    },
    time: {
      type: String,
      required: true,
    },
    parentID: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

appointmentSchema.virtual("patient", {
  ref: "Patient",
  localField: "patientID",
  foreignField: "_id",
  justOne: true,
});

appointmentSchema.set("toObject", { virtuals: true });
appointmentSchema.set("toJSON", { virtuals: true });

appointmentSchema.virtual("doctor", {
  ref: "Doctor",
  localField: "doctorID",
  foreignField: "_id",
});
appointmentSchema.virtual("familyMember", {
  ref: "FamilyMember",
  localField: "patientID",
  foreignField: "_id",
});

appointmentSchema.set("toObject", { virtuals: true });
appointmentSchema.set("toJSON", { virtuals: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
