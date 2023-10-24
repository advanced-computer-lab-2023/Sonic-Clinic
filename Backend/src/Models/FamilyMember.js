const mongoose = require("mongoose");
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
  },
  { timestamps: true }
);

familyMemberSchema.virtual("packages", {
  ref: "Packages",
  localField: "package",
  foreignField: "type",
});

familyMemberSchema.set("toObject", { virtuals: true });
familyMemberSchema.set("toJSON", { virtuals: true });

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);
module.exports = FamilyMember;
