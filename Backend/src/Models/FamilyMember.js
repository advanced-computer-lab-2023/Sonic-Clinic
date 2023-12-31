const mongoose = require("mongoose");
const { StringDecoder } = require("string_decoder");
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nationalID: {
      type: String,
      required: true,
      unique: [true, "this National ID is already registered"],
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    relationToPatient: {
      type: String,
      required: true,
    },
    patientID: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      required: false,
    },
    canceledHealthPackage: {
      type: [String],
      required: false,
    },
    unsubscribedHealthPackage: {
      type: [String],
      required: false,
    },
    patientRef: {
      type: String,
    },
  },
  { timestamps: true }
);

familyMemberSchema.virtual("packagesFamily", {
  ref: "Packages",
  localField: "package",
  foreignField: "_id",
});

familyMemberSchema.set("toObject", { virtuals: true });
familyMemberSchema.set("toJSON", { virtuals: true });

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);
module.exports = FamilyMember;
