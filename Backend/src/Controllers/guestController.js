const { default: mongoose } = require("mongoose");

const potentialDoctorModel = require("../Models/PotentialDoctor.js");
const patientModel = require("../Models/Patient.js");


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
    nationalID
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
    nationalID
    }); 
    if(req.files){
      let path=''
      req.files.array.forEach(function(files,index,arr){
        path=path+files.path+','
      });
      path=path.substring(0,path.lastIndexOf(","))
      newPatient.medicalHistory=path
    }
    console.log("Patient Created!");
    res.status(200).send(newPatient);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { addPotentialDoctor, addPatient };
