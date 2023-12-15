const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    messages: {
      type: [[String, String, String,String]],
      required: true,
    },
    patientID: {
      type: String,
      required: false,
    },
    doctorID: {
      type: String,
      required: false,
    },
    pharmacistID: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

chatSchema.virtual("patient", {
    ref: "Patient",
    localField: "patientID",
    foreignField: "_id",
    justOne: true,
});

chatSchema.virtual("doctor", {
    ref: "Doctor",
    localField: "doctorID",
    foreignField: "_id",
    justOne: true,
});
const Chat = mongoose.model(
    "Chat",
  chatSchema
  );
module.exports = Chat;
