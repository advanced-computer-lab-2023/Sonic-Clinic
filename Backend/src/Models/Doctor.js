const mongoose = require("mongoose");
const Appointment = require("./Appointment");
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
    specialty: {
      type: String,
      required: true,
    },
    appointments: {
      type: [Object],
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

doctorSchema.methods.getAppointments = async function () {
  try {
    // Use async/await with Appointment.find to retrieve appointments for the current doctor
    const appointments = await Appointment.find({ doctorID: this._id });
    // Add the appointments to the doctor document
    this.appointments = appointments;
  } catch (error) {
    throw error;
  }
};
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
