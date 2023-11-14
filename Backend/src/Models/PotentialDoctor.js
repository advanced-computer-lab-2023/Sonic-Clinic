const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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

const potentialDoctorSchema = new Schema(
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
    specialty: {
      type: String,
      required: true,
    },
    documents: [fileSchema],
  },
  { timestamps: true }
);
potentialDoctorSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const PotentialDoctor = mongoose.model(
  "PotentialDoctor",
  potentialDoctorSchema
);
module.exports = PotentialDoctor;
