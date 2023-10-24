const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt=require('bcrypt');

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


adminstratorSchema.pre('save',async function (next){
  const salt=await bcrypt.genSalt();
  this.password=await bcrypt.hash(this.password,salt);
  next();
});
const Adminstrator = mongoose.model('Adminstrator', adminstratorSchema);
module.exports = Adminstrator;