const { default: mongoose } = require("mongoose");

const potentialDoctorModel = require("../Models/PotentialDoctor.js");
const patientModel = require("../Models/Patient.js");
const doctorModel = require("../Models/Doctor.js");
const chatModel = require("../Models/Chat.js");
const appointmentModel = require("../Models/Appointment.js");
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

const viewChat = async (req, res) => {
  const userID = req.user.id;
  const recipientID = req.body._id;
  let isDoctor = true;
  try {
    // Check if the user is a doctor or a patient
    const patient = await patientModel.findById(userID);
    if (patient) {
      isDoctor = false;
    }

    // Determine the user field (doctorID or patientID) based on the user type
    const userID2 = isDoctor ? recipientID : userID;
    const recipientID2 = isDoctor ? userID : recipientID;
    const chat = await chatModel.findOne({
      patientID: userID2,
      doctorID: recipientID2,
    });
    console.log("patient " + userID2 + " doc " + recipientID2);

    if (!chat) {
      return res.status(404).json("No messages");
    }

    return res.status(200).json({ chat });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const viewChats = async (req, res) => {
  const userID = req.user.id;
  let isDoctor = true;
  try {
    // Check if the user is a doctor or a patient
    const patient = await patientModel.findById(userID);
    if (patient) {
      isDoctor = false;
    }
    // Extract names from the populated data
    let chatNames = [];

    if (isDoctor) {
      const doctor = await doctorModel.findById(userID);
      const patients = doctor.patients;
      for (const patient of patients) {
        const currPatient = await patientModel.findById(patient);
        if (currPatient) {
          chatNames.push(currPatient.name + "-" + currPatient._id);
        }
      }
    } else {
      const appointments = await appointmentModel.find({ patientID: userID });
      for (const appointment of appointments) {
        const doctorID = appointment.doctorID;
        const doc = await doctorModel.findById(doctorID);
        if (doc) {
          chatNames.push("Dr. " + doc.name + "-" + doc._id);
        }
      }
    }

    return res.status(200).json({ chatNames });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendMessage = async (req, res) => {
  const recipientID = req.body.recipientID;
  const message = req.body.message;
  const userID = req.user.id;
  const currentDate = new Date();
  const currDate = currentDate.toISOString().split("T")[0];
  const currTime = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  let isDoctor = true;
  try {
    // Check if the user is a doctor or a patient
    const patient = await patientModel.findById(userID);
    if (patient) {
      isDoctor = false;
    }

    // Determine the user field (doctorID or patientID) based on the user type
    const userID2 = isDoctor ? recipientID : userID;
    const recipientID2 = isDoctor ? userID : recipientID;
    const sender = isDoctor ? "doctor" : "patient";
    const existingChat = await chatModel.findOne({
      patientID: userID2,
      doctorID: recipientID2,
    });
    if (!existingChat) {
      if (isDoctor) {
        const newChat = await chatModel.create({
          patientID: recipientID,
          doctorID: userID,
          messages: [["patient", currDate, currTime, message]],
        });
        await newChat.save();
      } else {
        const newChat = await chatModel.create({
          patientID: userID,
          doctorID: recipientID,
          messages: [[sender, currDate, currTime, message]],
        });
        await newChat.save();
      }
      return res.status(200).json(newChat);
    } else {
      existingChat.messages.push([sender, currDate, currTime, message]);
      await existingChat.save();

      return res.status(200).json(existingChat);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addChat = async (req, res) => {
  const newChat = await chatModel.create({
    patientID: "21345678",
    doctorID: "31245678",
    messages: [["patient", "24-22-2002", "23:00", "lol"]],
  });
  return res.status(200).json(newChat);
};

module.exports = {
  addPotentialDoctor,
  addPatient,
  acceptPotientialDoc,
  viewChat,
  viewChats,
  sendMessage,
  addChat,
};
