const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const adminstratorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "this username is taken, please enter another username"],
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Adminstrator = mongoose.model("Adminstrator", adminstratorSchema);
module.exports = Adminstrator;
