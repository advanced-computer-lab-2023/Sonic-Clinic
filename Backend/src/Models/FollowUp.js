const { timeStamp, time } = require("console");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followUpSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    status: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

followUpSchema.virtual("patient", {
  ref: "Patient",
  localField: "patientID",
  foreignField: "_id",
  justOne: true,
});

followUpSchema.set("toObject", { virtuals: true });
followUpSchema.set("toJSON", { virtuals: true });

followUpSchema.virtual("doctor", {
  ref: "Doctor",
  localField: "doctorID",
  foreignField: "_id",
});

followUpSchema.set("toObject", { virtuals: true });
followUpSchema.set("toJSON", { virtuals: true });

const FollowUp = mongoose.model("FollowUp", followUpSchema);
module.exports = FollowUp;
