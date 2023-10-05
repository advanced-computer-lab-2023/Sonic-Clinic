const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packagesSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  sessionDiscount: {
    type: Number,
    required: true
  },
  medicineDiscount: {
    type: Number,
    required: true
  },
  packageDiscountFM: {
    type: Number,
    required: true
  },

  

}, { timestamps: true });

const Packages = mongoose.model('Packages', packagesSchema);
module.exports = Packages;