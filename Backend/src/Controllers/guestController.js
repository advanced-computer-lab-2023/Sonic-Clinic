const { default: mongoose } = require("mongoose");

const potentialDoctorModel = require("../Models/PotentialDoctor.js");
const patientModel = require("../Models/Patient.js");
const doctorModel = require("../Models/Doctor.js");
const bcrypt = require("bcrypt");

const addPotentialDoctor = async (req, res) => {
  const { username } = req.body;

  try {
    const existingDoctor = await potentialDoctorModel.findOne({ username });
    if (existingDoctor) {
      return res
        .status(409)
        .send({ message: "Doctor with this username already exists." });
    }
    console.log("password el katbaha wana potiential doc " + req.body.password);

    const newPotentialDoctor = await potentialDoctorModel.create(req.body);
    console.log(
      "password after creation el potential doc " + newPotentialDoctor.password
    );

    console.log("Doctor Request Sent!");
    res.status(201).json(newPotentialDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const addPatient = async (req, res) => {
  let password = req.body.password;
  const {
    username,
    name,
    email,

    dateOfBirth,
    gender,
    mobileNumber,
    emergencyFullName,
    emergencyMobileNumber,
    age,
    nationalID,
  } = req.body;
  const salt = await bcrypt.genSalt();
  const newPassword = await bcrypt.hash(password, salt);
  password = newPassword;

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
    let password = potentialDoctor.password;
    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(password, salt);
    password = newPassword;

    console.log(potentialDoctor.password + "Potenial Passs");

    if (!potentialDoctor) {
      return res.status(409).json({ message: "Invalid username" });
    }

    // Create a new doctor using the fields of the potential doctor
    const doctor = await doctorModel.create({
      username: potentialDoctor.username,
      name: potentialDoctor.name,
      email: potentialDoctor.email,
      password,
      dateOfBirth: potentialDoctor.dateOfBirth,
      hourlyRate: potentialDoctor.hourlyRate,
      affiliation: potentialDoctor.affiliation,
      educationalBackground: potentialDoctor.educationalBackground,
      specialty: potentialDoctor.specialty,
      contract: false,
      wallet: 0,
    });
    console.log(doctor.password + " potential doctor -> doctor");
    await potentialDoctorModel.deleteOne({ username });

    res.status(201).json({ message: "Doctor created successfully", doctor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addPotentialDoctor, addPatient, acceptPotientialDoc };
