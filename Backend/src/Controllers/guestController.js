const { default: mongoose } = require("mongoose");

const potentialDoctorModel = require("../Models/PotentialDoctor.js");
const patientModel = require("../Models/Patient.js");
const doctorModel = require("../Models/Doctor.js");
const chatModel = require("../Models/Chat.js");
const appointmentModel = require("../Models/Appointment.js");
const bcrypt = require("bcrypt");
const Pharmacist = require("../Models/Pharmacist.js");

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
  let isDoctor = false;
  let isPharmacist = false;

  try {
    // Check if the user is a doctor
    const doctor = await doctorModel.findById(userID);
    if (doctor) {
      isDoctor = true;
    } else {
      // Check if the user is a pharmacist
      const pharmacist = await Pharmacist.findById(userID);
      if (pharmacist) {
        isPharmacist = true;
      }
    }

    // Determine the user field (doctorID, patientID, or pharmacistID) based on the user type
    let userID2, recipientID2;

    if (isDoctor) {
      userID2 = recipientID;
      recipientID2 = userID;
    } else if (isPharmacist) {
      userID2 = recipientID;
      recipientID2 = userID;
    } else {
      const patient = await patientModel.findById(userID);
      if (patient) {
        userID2 = recipientID;
        recipientID2 = userID;
      } else {
        // The user is neither a doctor nor a pharmacist, so handle the case accordingly
        return res.status(404).json("Invalid user type");
      }
    }

    const chat = await chatModel.findOne({
      $or: [
        { patientID: userID2, doctorID: recipientID2 },
        { patientID: recipientID2, doctorID: userID2 },
        // Add conditions for pharmacist chat if needed
      ],
    });

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
  let isDoctor = false;
  let isPharmacist = false;

  try {
    // Check if the user is a doctor
    const doctor = await doctorModel.findById(userID);
    if (doctor) {
      isDoctor = true;
    } else {
      // Check if the user is a pharmacist
      const pharmacist = await Pharmacist.findById(userID);
      if (pharmacist) {
        isPharmacist = true;
      }
    }

    // Extract names from the populated data
    let chatNames = [];

    if (isDoctor) {
      // User is a doctor, get all patients
      const patients = doctor.patients;
      for (const patient of patients) {
        const currPatient = await patientModel.findById(patient);
        if (currPatient) {
          chatNames.push(currPatient.name + "-" + currPatient._id);
        }
      }
      const allPharmacists = await Pharmacist.find();
      console.log(allPharmacists);
      if (allPharmacists) {
        for (const pharmacist of allPharmacists) {
          chatNames.push(
            "Pharmacist " + pharmacist.name + "-" + pharmacist._id
          );
        }
      }
    } else if (isPharmacist) {
      // User is a pharmacist, get all patients and all doctors
      const allPatients = await patientModel.find();
      for (const currPatient of allPatients) {
        chatNames.push(currPatient.name + "-" + currPatient._id);
      }

      const allDoctors = await doctorModel.find();
      for (const doc of allDoctors) {
        chatNames.push("Dr. " + doc.name + "-" + doc._id);
      }
    } else {
      // User is neither a doctor nor a pharmacist
      const appointments = await appointmentModel.find({ patientID: userID });
      for (const appointment of appointments) {
        const doctorID = appointment.doctorID;
        const doc = await doctorModel.findById(doctorID);
        if (doc) {
          chatNames.push("Dr. " + doc.name + "-" + doc._id);
        }
      }
      const allPharmacists = await Pharmacist.find();
      console.log(allPharmacists);
      if (allPharmacists) {
        for (const pharmacist of allPharmacists) {
          chatNames.push(
            "Pharmacist " + pharmacist.name + "-" + pharmacist._id
          );
        }
      }
    }

    chatNames = Array.from(new Set(chatNames));
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

  let senderTitle;
  let isDoctor = false;
  let isPharmacist = false;

  let isDoctor2 = false;
  let isPharmacist2 = false;

  let patient;
  let doctor;
  let pharmacist;

  try {
    // Check if the user is a patient
    patient = await patientModel.findById(userID);
    if (patient) {
      isDoctor = false;
      isPharmacist = false;
      senderTitle = "patient";
    } else {
      // Check if the user is a doctor
      doctor = await doctorModel.findById(userID);
      if (doctor) {
        isDoctor = true;
        isPharmacist = false;
        senderTitle = "doctor";
      } else {
        // Check if the user is a pharmacist
        pharmacist = await Pharmacist.findById(userID);
        if (pharmacist) {
          isDoctor = false;
          isPharmacist = true;
          senderTitle = "pharmacist";
        }
      }
    }

    // Check if the recipient is a doctor
    doctor = await doctorModel.findById(recipientID);
    if (doctor) {
      isDoctor2 = true;
      isPharmacist2 = false;
    } else {
      // Check if the recipient is a pharmacist
      pharmacist = await Pharmacist.findById(recipientID);
      if (pharmacist) {
        isDoctor2 = false;
        isPharmacist2 = true;
      }
    }

    // Check if there is an existing chat
    const existingChat = await chatModel.findOne({
      $or: [
        { patientID: recipientID, doctorID: userID },
        { patientID: userID, doctorID: recipientID },
        { patientID: recipientID, pharmacistID: userID },
        { patientID: userID, pharmacistID: recipientID },
        { doctorID: recipientID, pharmacistID: userID },
        { doctorID: userID, pharmacistID: recipientID },
      ],
    });

    if (!existingChat) {
      // Create a new chat
      const newChatData = {
        patientID: isDoctor2 ? null : isPharmacist2 ? null : recipientID,
        doctorID: isDoctor2 ? (isPharmacist2 ? null : userID) : null,
        pharmacistID: isPharmacist2 ? (isDoctor2 ? null : userID) : null,
        messages: [[senderTitle, currDate, currTime, message]],
      };

      const newChat = await chatModel.create(newChatData);
      await newChat.save();

      return res.status(200).json(newChat);
    } else {
      // Add message to the existing chat
      existingChat.messages.push([senderTitle, currDate, currTime, message]);
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

const getPharmacists = async (req, res) => {
  try {
    const pharmacists = await Pharmacist.find({ state: "Active" });

    res.status(200).json(pharmacists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPotentialDoctor,
  addPatient,
  acceptPotientialDoc,
  viewChat,
  viewChats,
  sendMessage,
  addChat,
  getPharmacists,
};
