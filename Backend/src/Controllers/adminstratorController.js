const administratorModel = require('../Models/Adminstrator.js');
const { default: mongoose } = require('mongoose');
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

module.exports = {addAdmin,addPackage,addPatient,addDoctor,updatePackage};
