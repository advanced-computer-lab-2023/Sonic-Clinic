const { default: mongoose } = require("mongoose");

const potentialDoctorModel = require("../Models/PotentialDoctor.js");
const patientModel = require("../Models/Patient.js");
const doctorModel = require("../Models/Doctor.js");

const addPotentialDoctor = async (req, res) => {
  const { username } = req.body;

  try {
    const existingDoctor = await potentialDoctorModel.findOne({ username });
    if (existingDoctor) {
      return res
        .status(409)
        .send({ message: "Doctor with this username already exists." });
    }

    const newPotentialDoctor = await potentialDoctorModel.create(req.body);
    console.log("Doctor Request Sent!");
    res.status(201).json(newPotentialDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const addPatient = async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    dateOfBirth,
    gender,
    mobileNumber,
    emergencyFullName,
    emergencyMobileNumber,
    age,
    nationalID,
  } = req.body;

  // Set default values for non-required fields

  const package = req.body.package || "  ";

  try {
    const existingPatient = await patientModel.findOne({ username });
    if (existingPatient) {
      return res
        .status(409)
        .send({ message: "Patient with this username already exists." });
    }

    const newPatient = await patientModel.create({
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyFullName,
      emergencyMobileNumber,
      package, // Set the default value for package
      age,
      nationalID,
      wallet: 500000000,
    });

    console.log("Patient Created!");
    res.status(200).send(newPatient);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const acceptPotientialDoc = async (req, res) => {
  const { username } = req.body;

  try {
    const fakePotential = await doctorModel.findOne({ username });
    if (fakePotential) {
      return res.status(409).json("Doctor already got accepted");
    }

    const potentialDoctor = await potentialDoctorModel.findOne({ username });
    console.log(" potential pass " + potentialDoctor.password);

    if (!potentialDoctor) {
      return res.status(409).json({ message: "Invalid username" });
    }

    // Create a new doctor using the fields of the potential doctor
    const doctor = await doctorModel.create({
      username: potentialDoctor.username,
      name: potentialDoctor.name,
      email: potentialDoctor.email,
      password: potentialDoctor.password,
      dateOfBirth: potentialDoctor.dateOfBirth,
      hourlyRate: potentialDoctor.hourlyRate,
      affiliation: potentialDoctor.affiliation,
      educationalBackground: potentialDoctor.educationalBackground,
      specialty: potentialDoctor.specialty,
      documents: potentialDoctor.documents,
      contract: false,
      wallet: 0,
    });
    console.log(doctor.password + "encrypted password");

    // Save the new doctor to the doctorModel
    //await doctor.save();

    // Remove the potential doctor from the potentialDoctorModel
    await potentialDoctorModel.deleteOne({ username });

    res.status(201).json({ message: "Doctor created successfully", doctor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addPotentialDoctor, addPatient, acceptPotientialDoc };
