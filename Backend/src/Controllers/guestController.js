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

const viewChat = async (req, res) => {
  const userID = req.user.id;
  const recipientID=req.body._id;
  let isDoctor=true;
  try {
    // Check if the user is a doctor or a patient
    const patient = await patientModel.findById(userID) ;
    if(patient){
      isDoctor=false;
    }
    
    // Determine the user field (doctorID or patientID) based on the user type
    const userField = isDoctor ? 'doctorID' : 'patientID';
    const recipientField = isDoctor ? 'patientID' : 'doctorID';

    // Find all chats where the current user is involved
    const chat = await chatModel.findOne({ [userField]: userID , [recipientField]:recipientID});

    if(!chat){
      return res.status(404).json("No messages");
    }

    return res.status(200).json({ chat });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const viewChats = async (req, res) => {
  const userID = req.user.id;
  let isDoctor=true;
  try {
    // Check if the user is a doctor or a patient
    const patient = await patientModel.findById(userID) ;
    if(patient){
      isDoctor=false;
    }
    
    // Determine the user field (doctorID or patientID) based on the user type
    const userField = isDoctor ? 'doctorID' : 'patientID';

    // Find all chats where the current user is involved
    const chats = await chatModel.find({ [userField]: userID })
      .populate('patient', 'name') // Populate patient information
      .populate('doctor', 'name'); // Populate doctor information

    // Extract names from the populated data
    const chatNames = chats.map(chat => {
      const name = isDoctor ? chat.patient.name : chat.doctor.name;
      return name;
    });

    return res.status(200).json({ chatNames });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const sendMessage = async (req, res) => {
  const recipientID = req.body.recipientID;
  const message = req.body.message;
  const currentDate = new Date();
  const currDate = currentDate.toISOString().split('T')[0];
  const currTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  let isDoctor=true;
  try {
    // Check if the user is a doctor or a patient
    const patient = await patientModel.findById(recipientID) ;
    if(patient){
      isDoctor=false;
    }
    
    // Determine the user field (doctorID or patientID) based on the user type
    const userField = isDoctor ? 'doctorID' : 'patientID';
    const sender = isDoctor ? 'doctor' : 'patient';
    const existingChat= await chatModel.find({ [userField]: userID })

    if (!existingChat) {
      if(isDoctor){
      const newChat = new chatModel({
        patientID: recipientID,
        doctorID: user.req.id,
        messages: [['patient', currDate,currTime,message ]]
      });
      await newChat.save();
     }
      else{
        const newChat = new chatModel({
          patientID: user.req.id,
          doctorID: recipientID,
          messages: [[sender, currDate,currTime,message ]]
        });
        await newChat.save();
     }
      return res.status(201).json(newChat);
    } else {

      existingChat.messages.push([sender, currDate,currTime,message ]);
      await existingChat.save();

      return res.status(200).json( existingChat );
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addPotentialDoctor, addPatient, acceptPotientialDoc, viewChat,viewChats,sendMessage };
