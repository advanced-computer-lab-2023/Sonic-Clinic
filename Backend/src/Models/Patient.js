const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditCardSchema = new Schema({
  cardNumber: {
    type: String,
    required: false,
  },
  cvv: {
    type: String,
    required: false,
  },
  expiryDate: {
    type: String, 
    required: false,
  },
});

const patientSchema = new Schema(
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
    gender: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    emergencyFullName: {
      type: String,
      required: true,
    },
    emergencyMobileNumber: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      required: false,
    },
    wallet: {
      type: Number,
      required: false,
    },
    creditCard: creditCardSchema,
  },
  { timestamps: true }
);
patientSchema.virtual("prescriptions", {
  ref: "Prescription",
  localField: "_id",
  foreignField: "patientID",
});


patientSchema.set("toObject", { virtuals: true });
patientSchema.set("toJSON", { virtuals: true });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
