const doctorModel = require('../Models/Doctor.js');
const { default: mongoose } = require('mongoose');
const patientModel = require('../Models/Patient.js');
const PrescriptionModel = require('../Models/Prescription.js');
const appointmentModel= require('../Models/Appointment.js');



const searchPatientByName = async (req, res) => {
   const { name: patientName } = req.query;
 
   try {
     const patient = await patientModel.findOne({ name: patientName });
 
     if (!patient) {
       return res.status(404).json({ message: 'No patients found.' });
     }
 
     res.status(200).json({ patient });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
 };
 
 
 

 const filterPatientsByAppointments = async (req, res) => {
  try {
    const doctor = req.session.user; 
    if (!doctor) {
      return res.status(401).json({ error: 'Doctor not authenticated' });
    }

    const today = new Date();
    // Find upcoming appointments for the doctor
    const upcomingAppointments = await appointmentModel.find({
      doctorID: doctor._id,
      date: { $gte: today },
    });

    // Extract patient IDs from upcoming appointments
    const patientIDs = upcomingAppointments.map(appointment => appointment.patientID);

    // Fetch patient information for the extracted IDs
    const patients = await patientModel.find({ _id: { $in: patientIDs } });

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
 };
 

 const filterApointmentsByDateOrStatusDoc = async (req, res) => {
  const { date, status } = req.query;

  try {
    // Retrieve username from the session
    const doctorID = req.session.user._id;

    let query = { doctorID };

    if (date) {
      query.date = date;
    }

    if (status) {
      query.status = status;
    }

    const appointments = await appointmentModel.find(query);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found.' });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateDoctorProfile = async (req, res) => {
  const { email, hourlyRate, affiliation } = req.body;
  const username = req.session.user.username;

  try {
    const doctor = await doctorModel.findOne({ username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Update the specified fields
    if (email) doctor.email = email;
    if (hourlyRate) doctor.hourlyRate = hourlyRate;
    if (affiliation) doctor.affiliation = affiliation;

    // Save the updated doctor profile
    await doctor.save();

    res.status(200).json({ message: 'Doctor profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const viewPatients = async (req, res) => {
  try {
    const username = req.session.user.username;

    const doctor = await doctorModel.findOne({ username }).populate('patients');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const patients = doctor.patients;

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const viewInfoAndHealthRecord = async (req, res) => {
  const { patientUsername } = req.body;

  try {
    const patient = await patientModel.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Extract relevant information and health records
    const {
      username,
      name,
      email,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyFullName,
      emergencyMobileNumber,
      package,
      prescriptions,
      healthRecords,
    } = patient;

    res.status(200).json({
      username,
      name,
      email,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyFullName,
      emergencyMobileNumber,
      package,
      prescriptions,
      healthRecords,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const selectPatient = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ username: req.session.user.username }).populate('patients');
    const { patientUsername } = req.body;
    const selectedPatient = doctor.patients.find(patient => patient.username === patientUsername);

    if (!selectedPatient) {
      return res.status(404).json({ message: 'Patient not found or not registered with this doctor.' });
    }

    res.status(200).json({ selectedPatient });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const addPrescription = async(req,res) => {
  try{
     const newPrescription = await PrescriptionModel.create(req.body);
     console.log("Prescription Created!")
     res.status(200).send(newPrescription);

  }
  catch(error){
     res.status(400).send({error:error.message});

  }
}

module.exports = {selectPatient,viewInfoAndHealthRecord,viewPatients,
  updateDoctorProfile,filterApointmentsByDateOrStatusDoc,
  filterPatientsByAppointments,searchPatientByName,addPrescription};
