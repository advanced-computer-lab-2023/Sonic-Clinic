//Di zi el main method lama bagy a run ba run el app js 3alatol
//use nodemon badal node 3lashan ma3odsh 22fl w aftah el server kol mara 

// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
//Declare ll methods el haktbha 
//patientController
const {selectPrescription,viewFamilyMembers,filterPrescriptions,viewPrescriptions,filterApointmentsByDateAndStatus,filterDoctors,searchDoctors,doctorDetails,addFamilyMember} = require("./Controllers/patientController");

//doctorController 
const {selectPatient,viewInfoAndHealthRecord,viewPatients,updateDoctorProfile,filterApointmentsByDateAndStatusDoc,filterPatientsByAppointments,searchPatientByName} = require("./Controllers/doctorController");

//adminstratorController
const {addAdmin,addPackage,addDoctor,
  updatePackage,deletePackage,removeDoctor,removePatient,removeAdmin,viewPotentialDoctors,rejectPotentialDoctor, viewAllDoctors,viewAllPatients
} = require("./Controllers/adminstratorController");

//guestController
const {addPatient,addPotentialDoctor} = require("./Controllers/guestController");
//el link bta3 el DB
const MongoURI = process.env.MONGO_URI ;

                     ///////////////////////////////////////////////////////////////////////////////////////
//App variables
//3lashan a3rf akteb b express
const server = express();
//3lashan lw i am running haga fi el port el awlani yb2a fi option tany 
const port = process.env.PORT || "8000";
//require el models (schema) basamih kol ma aktb user refer to el schema user model 
 const patient = require('./Models/Patient');
 const doctor = require('./Models/Doctor');
 const adminstrator = require('./Models/Adminstrator');
 const potentialDoctor = require('./Models/PotentialDoctor');
                      //////////////////////////////////////////////////////////////////////////////////////
// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 server.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));


/*
                                                    Start of your code
*/
server.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });

// #Routing to userController here
server.use(express.json())

///////////// POST
//admin
server.post("/addAdmin",addAdmin);
server.post("/addDoctor",addDoctor);
server.post("/addPackage",addPackage);
server.post("/addFamilyMember",addFamilyMember);
//guest
server.post("/addPatient",addPatient);
server.post("/addPotentialDoctor",addPotentialDoctor);
////////////// GET
//admin
server.get("/viewAllPatients", viewAllPatients);
server.get("/viewAllDoctors", viewAllDoctors);
server.get("/viewPotentialDoctors", viewPotentialDoctors);
//patient
server.get("/doctorDetails", doctorDetails);
 server.get("/viewPrescriptions", viewPrescriptions);
 server.get("/viewFamilyMembers", viewFamilyMembers);
 server.get("/selectPrescription", selectPrescription);
 server.get("/filterPrescriptions", filterPrescriptions);
 server.get("/filterApointmentsByDateAndStatus", filterApointmentsByDateAndStatus);
 server.get("/searchDoctors", searchDoctors);
 server.get("/filterDoctors", filterPrescriptions);
// //doctor
 server.get("/selectPatient", selectPatient);
 server.get("/viewInfoAndHealthRecord", viewInfoAndHealthRecord);
 server.get("/viewPatients", viewPatients);
 server.get("/filterApointmentsByDateAndStatusDoc", filterApointmentsByDateAndStatusDoc);
 server.get("/filterPatientsByAppointments", filterPatientsByAppointments);
 server.get("/searchPatientByName", searchPatientByName);
 //admin
 server.get("/viewPotentialDoctors", viewPotentialDoctors);
//////////////PUT
//admin
server.put("/updatePackage", updatePackage);
//docotr
// server.put("/updateDoctorProfile", updateDoctorProfile);
///////////// DELETE
//admin
server.delete("/deletePackage", deletePackage);
server.delete("/removeDoctor", removeDoctor);
server.delete("/removePatient", removePatient);
server.delete("/removeAdmin", removeAdmin);
server.delete("/rejectDoctor", rejectPotentialDoctor);

/*
                                                    End of your code
*/

