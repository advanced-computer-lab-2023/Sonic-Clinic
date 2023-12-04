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
      required: true,
    },
    doctorID: {
      type: String,
      required: true,
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
