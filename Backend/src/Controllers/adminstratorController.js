const { default: mongoose } = require('mongoose');

const administratorModel = require('../Models/Adminstrator.js');
const packagesModel = require('../Models/Packages.js');
const doctorModel = require('../Models/Doctor.js');
const patientModel = require('../Models/Patient.js');
const potentialDoctorModel = require('../Models/PotentialDoctor.js');

const addAdmin = async(req,res) => {
   try{
      const newAdmin = await adminstratorModel.create(req.body);
      console.log("Admin Created!")
      res.status(200).send(newAdmin);

   }
   catch(error){
      res.status(400).send({error:error.message});

   }
}
const addDoctor = async(req,res) => {
   try{
      const newDoctor = await doctorModel.create(req.body);
      console.log("Doctor Created!")
      res.status(200).send(newDoctor);

   }
   catch(error){
      res.status(400).send({error:error.message});

   }
}

const addPackage = async(req,res) => {
   try{
      const newPackage = await packagesModel.create(req.body);
      console.log("Package Created!")
      res.status(200).send(newPackage);

   }
   catch(error){
      res.status(400).send({error:error.message});

   }
}
   const updatePackage = async(req,res) => {
      try{
         const {type,price,service}=req.body;
         const updatedPackage = await packagesModel.findOneAndUpdate(
            {type},
            {type,price,service},
            {new: true}
         );
         if(!updatedPackage){
            return res.status(404).json({ message: 'Package not found' });
         }
         return res.status(200).json(updatedPackage);
   
      }
      catch(error){
         return res.status(500).send({error:error.message});
   
      }

}
const viewPotentialDoctors = async (req, res) => {
   try {
     const potentialDoctors = await potentialDoctorModel.find({});
 
     if (!potentialDoctors || potentialDoctors.length === 0) {
       return res.status(404).json({ message: 'No potential doctors found.' });
     }
 
     res.status(200).json({ potentialDoctors });
   } catch (error) {
     res.status(500).json({ message: 'Server Error' });
   }
 };
 
const deletePackage = async(req,res) => {
   try{
      const packageType = req.body.type;
      const deletedPackage = await packagesModel.findOneAndDelete({ type: packageType });

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    return res.status(200).json({ message: 'Package deleted successfully' });
   }
   catch(error){
   console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
   }
}
const rejectPotentialDoctor = async(req,res) => {
   try{
      const username = req.body.username;
      const rejectedDoctor = await potentialDoctorModel.findOneAndDelete({ username: username });

    if (!rejectedDoctor) {
      return res.status(404).json({ message: 'Potential Doctor not found' });
    }
    return res.status(200).json({ message: 'Potential Doctor rejected' });
   }
   catch(error){
   console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
   }
}

const removeDoctor = async(req,res) => {
   try{
      const username = req.body.username;
      const removedDoctor = await doctorModel.findOneAndDelete({ username: username });

    if (!removedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.status(200).json({ message: 'Doctor removed successfully' });
   }
   catch(error){
   console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
   }
}
const removePatient = async(req,res) => {
   try{
      const username = req.body.username;
      const removedPatient = await patientModel.findOneAndDelete({ username: username });

    if (!removedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    return res.status(200).json({ message: 'Patient removed successfully' });
   }
   catch(error){
   console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
   }
}
const removeAdmin = async(req,res) => {
   try{
      const username = req.body.username;
      const removedAdmin = await administratorModel.findOneAndDelete({ username: username });

    if (!removedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    return res.status(200).json({ message: 'Admin removed successfully' });
   }
   catch(error){
   console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
   }
}

const viewAllPatients= async(req,res)=>{
   try {
      const patients = await patientModel.find();

      if (!patients || patients.length === 0) {
        return res.status(404).json({ message: 'No patients found.' });
      }

      res.status(200).json({ patients });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
}

const viewAllDoctors= async(req,res)=>{
   try {
      const doctors = await doctorModel.find();

      if (!doctors || doctors.length === 0) {
        return res.status(404).json({ message: 'No doctors found.' });
      }

      res.status(200).json({ doctors });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
}
module.exports = {addAdmin,addPackage,addDoctor,updatePackage,deletePackage,removeDoctor,removePatient,removeAdmin,viewAllPatients,viewAllDoctors,
   viewPotentialDoctors,rejectPotentialDoctor};
