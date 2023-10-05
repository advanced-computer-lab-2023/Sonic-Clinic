const { default: mongoose } = require('mongoose');

const administratorModel = require('../Models/Adminstrator.js');
const packagesModel = require('../Models/Packages.js');
const doctorModel = require('../Models/Doctor.js');
const patientModel = require('../Models/Patient.js');

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
const addPatient = async(req,res) => {
   try{
      const newPatient = await patientModel.create(req.body);
      console.log("Patient Created!")
      res.status(200).send(newPatient);

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
module.exports = {addAdmin,addPackage,addPatient,addDoctor,updatePackage,deletePackage,removeDoctor,removePatient,removeAdmin};
