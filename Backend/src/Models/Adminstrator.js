const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminstratorSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }

}, { timestamps: true });

const User = mongoose.model('Adminstrator', adminstratorSchema);
module.exports = Adminstrator;