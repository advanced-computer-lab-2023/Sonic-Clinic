const mongoose = require("mongoose");
const Appointment = require("./Appointment");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const FollowUp = require("./FollowUp");

const fileSchema = new Schema({
  filename: {
    type: String,
    required: false,
  },
  mimetype: {
    type: String,
    required: false,
  },
  buffer: {
    type: Buffer,
    required: false,
  },
});

const doctorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "this username is taken, please enter another username"],
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "this email is taken, please enter another email"],
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
      type: [String],
      required: false,
    },
    specialty: {
      type: String,
      required: true,
    },
    appointments: {
      type: [Object],
      required: false,
    },
    availableSlots: {
      type: [String],
      required: false,
    },
    wallet: {
      type: Number,
      required: false,
    },
    contract: {
      type: Boolean,
      required: false,
    },
    followUps: {
      type: [Object],
      required: false,
    },
    // documents: [fileSchema],
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

doctorSchema.virtual("followUp", {
  ref: "FollowUp",
  localField: "_id",
  foreignField: "doctorID",
});

doctorSchema.set("toObject", { virtuals: true });
doctorSchema.set("toJSON", { virtuals: true });

doctorSchema.methods.getAppointments = async function () {
  try {
    const appointments = await Appointment.find({ doctorID: this._id });
    this.appointments = appointments;
  } catch (error) {
    throw error;
  }
};
doctorSchema.methods.getFollowUps = async function () {
  try {
    const followUps = await FollowUp.find({ doctorID: this._id });
    this.followUps = followUps;
  } catch (error) {
    throw error;
  }
};

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
