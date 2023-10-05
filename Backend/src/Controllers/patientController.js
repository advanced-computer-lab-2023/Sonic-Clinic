const userModel = require('../Models/Patient.js');
const { default: mongoose } = require('mongoose');
const doctorModel = require('../Models/Doctor.js');
const familyMemberModel = require('../Models/FamilyMember.js');

const createPatient = async(req,res) => {
   //add a new user to the database with 
   //Name, Email and Age
}

const doctorDetails = async (req,res) => {
   const doctorName = req.params.name;

    try {
      const doctor = await Doctor.findOne({ name: doctorName });

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }

      res.status(200).json({ doctor });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
}

const searchDoctors= async (req,res) => {
   const { name, specialty } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }; 
    }

    if (specialty) {
      query.specialty = { $regex: new RegExp(specialty, 'i') }; 
    }

    try {
      const doctors = await Doctor.find(query);

      if (!doctors || doctors.length === 0) {
        return res.status(404).json({ message: 'No doctors found.' });
      }

      res.status(200).json({ doctors });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
}

const filterDoctors= async (req,res)=>{
   const { specialty, date, time } = req.query;
   let query = {};

   if (specialty) {
     query.specialty = { $regex: new RegExp(specialty, 'i') }; // Case-insensitive specialty search
   }

   try {
     // Find doctors based on specialty
     let doctors = await Doctor.find(query);

     if (!doctors || doctors.length === 0) {
       return res.status(404).json({ message: 'No doctors found.' });
     }

     // Filter doctors based on availability for the given date and time
     doctors = doctors.filter((doctor) => {
       const availableSlots = doctor.availability[date];

       if (!availableSlots) {
         return false;
       }

       return availableSlots.includes(time);
     });

     if (doctors.length === 0) {
       return res.status(404).json({ message: 'No doctors available for the given date and time.' });
     }

     res.status(200).json({ doctors });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
}

const filterApointmentsByDateAndStatus= async(req,res)=>{
   const { date, status } = req.query;

   const query = {};
   if (date) {
     query.date = date; // Assuming the date is stored as a string in the format 'YYYY-MM-DD'
   }

   if (status) {
     query.status = status;
   }

   try {
     const patient = await Patient.findOne({ username: req.user.username }); // Assuming you're using authentication to get the patient's username

     if (!patient) {
       return res.status(404).json({ message: 'Patient not found.' });
     }

     const appointments = patient.appointments.filter((appointment) => {
       return (!query.date || appointment.date === query.date) && (!query.status || appointment.status === query.status);
     });

     if (!appointments || appointments.length === 0) {
       return res.status(404).json({ message: 'No appointments found.' });
     }

     res.status(200).json({ appointments });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
}

const viewPrescriptions = async(req,res) =>{
   try {
      const patient = await Patient.findOne({ username: req.user.username });

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }

      const prescriptions = patient.prescriptions;

      res.status(200).json({ prescriptions });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
}

const filterPrescriptions = async(req,res) => {
   const { date, doctor, status } = req.query;

    const query = {};

    if (date) {
      query.date = date; // Assuming the date is stored as a string in the format 'YYYY-MM-DD'
    }

    if (doctor) {
      query.doctor = doctor; // Assuming doctor field in the prescription model
    }

    if (status) {
      query.status = status;
    }

    try {
      const patient = await Patient.findOne({ username: req.user.username });

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }

      let filteredPrescriptions = patient.prescriptions;

      if (Object.keys(query).length > 0) {
        filteredPrescriptions = patient.prescriptions.filter((prescription) => {
          return Object.keys(query).every((key) => prescription[key] === query[key]);
        });
      }

      res.status(200).json({ prescriptions: filteredPrescriptions });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
}

const viewFamilyMembers= async(req,res)=>{
const patientUsername = req.user.username; 

try {
  const familyMembers = await FamilyMember.find({ patientUsername });

  if (!familyMembers || familyMembers.length === 0) {
    return res.status(404).json({ message: 'No family members found.' });
  }

  res.status(200).json({ familyMembers });
} catch (error) {
  res.status(500).json({ message: 'Server Error' });
}
}

const selectPrescription= async (req,res) => {
   const { prescriptionId } = req.query;

   try {
     const patient = await Patient.findOne({ username: req.user.username });

     if (!patient) {
       return res.status(404).json({ message: 'Patient not found.' });
     }

     const selectedPrescription = patient.prescriptions.id(prescriptionId);

     if (!selectedPrescription) {
       return res.status(404).json({ message: 'Prescription not found.' });
     }

     res.status(200).json({ selectedPrescription });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
}

module.exports = {createPatient};
