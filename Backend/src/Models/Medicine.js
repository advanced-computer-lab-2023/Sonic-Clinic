const mongoose = require("mongoose");
//const { MedicinalUseArray } = require("./MedicinalUse");
//const Pharmacist = require("./Pharmacist"); // Import the Pharmacist model

const medicineSchema = new mongoose.Schema({
  picture: {
    type: String,
    required: false,
  }, // Store the image source as a string
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sales: {
    type: Number,
    required: true,
    default: 10,
  },

  salesData: {
    type: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
    required: true,
    default: [],
  },
  activeIngredients: {
    type: [String],
    required: true,
  },
  medicinalUse: {
    type: String,
    // enum: MedicinalUseArray,
    required: true,
  },
  state: {
    type: String,
    enum: ["Active", "Archived"],
    default: "Active",
  },
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
