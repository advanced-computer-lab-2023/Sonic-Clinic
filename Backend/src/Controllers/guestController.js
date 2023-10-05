const { default: mongoose } = require('mongoose');


const potentialDoctorModel = require('../Models/PotentialDoctor.js');
const patientModel = require('../Models/Patient.js');


const addPotentialDoctor = async (req, res) => {
    try {
      const newPotentialDoctor = await potentialDoctorModel.create(req.body);
      console.log("Doctor Request Sent!");
      res.status(201).json(newPotentialDoctor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
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





module.exports = {addPotentialDoctor,addPatient};