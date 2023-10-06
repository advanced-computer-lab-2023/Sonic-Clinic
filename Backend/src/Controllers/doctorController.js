const doctorModel = require('../Models/Doctor.js');
const { default: mongoose } = require('mongoose');
const patientModel = require('../Models/Patient.js');


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
     const patients = await patientModel.find({
       'appointments.date': { $gte: new Date() }
     });
 
     if (!patients || patients.length === 0) {
       return res.status(404).json({ message: 'No patients with upcoming appointments found.' });
     }
 
     res.status(200).json({ patients });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
 };
 

const filterApointmentsByDateAndStatusDoc= async(req,res) => {
   const { date, status } = req.query;
   const query = {};
   if (date) {
     query.date = date; // Assuming the date is a string in the format 'YYYY-MM-DD'
   }

   if (status) {
     query.status = status;
   }

   try {
     const appointments = await patientModel.find({ 'appointments.date': query.date, 'appointments.status': query.status });

     if (!appointments || appointments.length === 0) {
       return res.status(404).json({ message: 'No appointments found.' });
     }

     res.status(200).json({ appointments });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
}

const updateDoctorProfile= async(req,res)=>{
   const { email, hourlyRate, affiliation } = req.body;

    try {
      const doctor = await doctorModel.findOne({ username: req.user.username }); 

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
}

const viewPatients= async(req,res)=>{
   try {
      const doctor = await doctorModel.findOne({ username: req.user.username }).populate('patients');

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }

      const patients = doctor.patients;

      res.status(200).json({ patients });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
}

const viewInfoAndHealthRecord= async(req,res) =>{
   const { patientUsername } = req.query;

   try {
     const patient = await patientModel.findOne({ username: patientUsername });

     if (!patient) {
       return res.status(404).json({ message: 'Patient not found.' });
     }

     // Extract relevant information and health records
     const { username, name, email, dateOfBirth, gender, mobileNumber, emergencyFullName, emergencyMobileNumber, package, prescriptions, healthRecords } = patient;

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
       healthRecords 
     });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
}

const selectPatient = async(req,res) =>{
   const { patientUsername } = req.query;

   try {
     const doctor = await doctorModel.findOne({ username: req.user.username }).populate('patients');
     const selectedPatient = doctor.patients.find(patient => patient.username === patientUsername);

     if (!selectedPatient) {
       return res.status(404).json({ message: 'Patient not found or not registered with this doctor.' });
     }

     res.status(200).json({ selectedPatient });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
}

module.exports = {selectPatient,viewInfoAndHealthRecord,viewPatients,
  updateDoctorProfile,filterApointmentsByDateAndStatusDoc,
  filterPatientsByAppointments,searchPatientByName};
