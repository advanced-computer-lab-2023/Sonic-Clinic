const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packagesSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sessionDiscount: {
      type: Number,
      required: true,
    },
    medicineDiscount: {
      type: Number,
      required: true,
    },
    packageDiscountFM: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
    },
    renewalDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    patientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  { timestamps: true }
);

packagesSchema.pre("save", async function (next) {
  if (this.isNew) {
    // When a new package is saved, update the associated patient's package field
    try {
      const patient = await mongoose.model("Patient").findById(this.patientID);
      if (patient) {
        patient.package = this._id;
        await patient.save();
      }
    } catch (err) {
      console.error("Error updating patient's package: " + err);
    }
  }
  next();
});

const Packages = mongoose.model("Packages", packagesSchema);
module.exports = Packages;
