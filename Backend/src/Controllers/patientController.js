const patientModel = require('../Models/Patient.js');
const { default: mongoose } = require('mongoose');
const doctorModel = require('../Models/Doctor.js');
const familyMemberModel = require('../Models/FamilyMember.js');
const packagesModel = require('../Models/Packages.js');

const doctorDetails = async (req, res) => {
  const { name: doctorName } = req.query;

  try {
    const doctor = await doctorModel.findOne({ name: doctorName });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    res.status(200).json({ doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const searchDoctors = async (req, res) => {
  const { name, speciality } = req.body;

  try {
    let query = {};

    if (name && speciality) {
      query = { name, speciality };
    } else if (name) {
      query.name = name;
      query.speciality = { $exists: true }; 
    } else if (speciality) {
      query.speciality = speciality;
      query.name = { $exists: true }; 
    }

    const doctors = await doctorModel.find(query);

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found.' });
    }

    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



const filterDoctors= async (req,res)=>{
   const { speciality, date, time } = req.query;
   let query = {};

   if (speciality) {
     query.speciality = { $regex: new RegExp(speciality, 'i') }; 
   }

   try {
     // Find doctors based on speciality
     let doctors = await doctorModel.find(query);

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
     const patient = await patientModel.findOne({ username: req.user.username }); // Assuming you're using authentication to get the patient's username

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
      const patient = await patientModel.findOne({ username: req.user.username });

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
      const patient = await patientModel.findOne({ username: req.user.username });

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
  const familyMembers = await familyMemberModel.find({ patientUsername });

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
     const patient = await patientModel.findOne({ username: req.user.username });

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
const addFamilyMember = async(req,res) => {
   try{
      const newFamilyMember = await familyMemberModel.create(req.body);
      console.log("Family member Created!")
      res.status(200).send(newFamilyMember);

   }
   catch(error){
      res.status(400).send({error:error.message});

   }
}
const viewPackages= async(req,res)=>{
  try {
    const packages = await packagesModel.find();
    if (!packages || packages.length === 0) {
      return res.status(404).json({ message: 'No packages found.' });
    }
    res.status(200).json(packages);
    
  }
  catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = {selectPrescription,viewFamilyMembers,filterPrescriptions,
  viewPrescriptions,filterApointmentsByDateAndStatus,filterDoctors,
  searchDoctors,doctorDetails,addFamilyMember,viewPackages};
