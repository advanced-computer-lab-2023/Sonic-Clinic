const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pharmacistSchema = new Schema(
  {
    picture: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
      validate: {
        validator: function (value) {
          return value >= 0; // Ensure hourlyRate is a non-negative number
        },
        message: "Hourly rate must be a non-negative number",
      },
    },
    affiliation: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ["Active", "Inactive", "Rejected"],
      default: "Inactive",
    },
    files: {
      type: [String], // Assuming an array of strings for active ingredients
      default: [],
    },
    wallet: {
      type: Number,
      default: 0,
      required: true,
    },
    notifications: {
      type: [String],
      default: [],
      required: true,
    },
    newNotification: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);
module.exports = Pharmacist;
