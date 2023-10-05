const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packages = new Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  service: {
    type: String,
    required: true,
  }

}, { timestamps: true });

const Packages = mongoose.model('Packages', packagesSchema);
module.exports = Packages;