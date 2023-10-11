const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
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
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    affiliation: {
      type: String,
      required: true,
    },
    educationalBackground: {
      type: String,
      required: true,
    },
    patients: {
      type: Array,
      required: false,
    },
    speciality: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

doctorSchema.virtual("appointment", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "doctorID",
});

doctorSchema.set("toObject", { virtuals: true });
doctorSchema.set("toJSON", { virtuals: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
