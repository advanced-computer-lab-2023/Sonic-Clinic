// External variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const session = require("express-session");
const jwt = require("jsonwebtoken");

mongoose.set("strictQuery", false);
require("dotenv").config();

//Declare ll methods el haktbha
///////////////////////////////patientController//////////////////////////////////////////
const {
  selectPrescription,
  viewFamilyMembers,
  filterPrescriptions,
  viewPrescriptions,
  filterAppointmentsByDateOrStatus,
  filterDoctors,
  searchDoctors,
  doctorDetails,
  addFamilyMember,
  viewAvailablePackages,
  viewAllDoctorsForPatients,
  getDoctorsWithSessionPrice,
  addAppointment,
  filterDoctorsAfterSearch,
  viewAllAppointments,
  filterDoctorsAfterSearchDocName,
  removeFamilyMember,
  viewHealthPackages,
  viewWalletAmount,
} = require("./Controllers/patientController");

/////////////////////////////////doctorController//////////////////////////////////////////
const {
  selectPatient,
  viewInfoAndHealthRecord,
  viewPatients,
  updateDoctorProfile,
  filterApointmentsByDateOrStatusDoc,
  filterPatientsByAppointments,
  searchPatientByName,
  addPrescription,
  viewDocApp,
} = require("./Controllers/doctorController");

///////////////////////////////adminstratorController//////////////////////////////////////
const {
  addAdmin,
  addPackage,
  addDoctor,
  updatePackage,
  deletePackage,
  removeDoctor,
  removePatient,
  removeAdmin,
  viewPotentialDoctors,
  rejectPotentialDoctor,
  viewAllDoctors,
  viewAllPatients,
  viewPackagesAdmin,
  viewAllAdmins,
  viewAllDocApp,
} = require("./Controllers/adminstratorController");

////////////////////////////////guestController///////////////////////////////////////////
const {
  addPatient,
  addPotentialDoctor,
} = require("./Controllers/guestController");

//el link bta3 el DB
const MongoURI = process.env.MONGO_URI;

///////////////////////////////////////////////////////////////////////////////////////
//App variables
//3lashan a3rf akteb b express
const server = express();
//3lashan lw i am running haga fi el port el awlani yb2a fi option tany
const port = process.env.PORT || "8000";
//require el models (schema) basamih kol ma aktb user refer to el schema user model
const patient = require("./Models/Patient.js");
const doctor = require("./Models/Doctor.js");
const adminstrator = require("./Models/Adminstrator");
const potentialDoctor = require("./Models/PotentialDoctor");
const appointment = require("./Models/Appointment");
//////////////////////////////////////////////////////////////////////////////////////

//login

server.use(bodyParser.json());
server.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);

server.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const doctor1 = await doctor.findOne({ username, password });
    const patient1 = await patient.findOne({ username, password });
    const admin1 = await adminstrator.findOne({ username, password });

    if (doctor1) {
      // Save user data in session
      req.session.user = doctor1;
      return res.status(200).json({ message: "Doctor", user: doctor1 });
    }

    if (patient1) {
      // Save user data in session
      req.session.user = patient1;
      return res.status(200).json({ message: "Patient", user: patient1 });
    }

    if (admin1) {
      // Save user data in session
      req.session.user = admin1;
      return res.status(200).json({ message: "Admin", user: admin1 });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// configurations
// Mongo DB
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    server.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

/*
                                                    Start of your code
*/
server.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

// #Routing to userController here
server.use(express.json());

////////////////////////////////////////////////POST//////////////////////////////////
//admin
server.post("/addAdmin", addAdmin);
server.post("/addDoctor", addDoctor);
server.post("/addPackage", addPackage);

//guest
server.post("/addPatient", addPatient);
server.post("/addPotentialDoctor", addPotentialDoctor);
//doctor
server.post("/addPrescription", addPrescription);

//patient
server.post("/addFamilyMember", addFamilyMember);
server.post("/addAppointment", addAppointment);
//////////////////////////////////////////// GET/////////////////////////////////////
//admin
server.get("/viewAllPatients", viewAllPatients);
server.get("/viewAllDoctors", viewAllDoctors);
server.get("/viewPotentialDoctors", viewPotentialDoctors);
server.get("/viewPackagesAdmin", viewPackagesAdmin);
server.get("/viewAllAdmins", viewAllAdmins);
server.get("/viewAllDocApp", viewAllDocApp);
//patient
server.post("/doctorDetails", doctorDetails);
server.post("/viewPrescriptions", viewPrescriptions);
server.post("/viewFamilyMembers", viewFamilyMembers);
server.post("/selectPrescription", selectPrescription);
server.post("/filterPrescriptions", filterPrescriptions);
server.post(
  "/filterAppointmentsByDateOrStatus",
  filterAppointmentsByDateOrStatus
);
server.post("/searchDoctors", searchDoctors);
server.get("/filterDoctors", filterDoctors);
server.get("/viewAvailablePackages", viewAvailablePackages);
server.get("/viewAllDoctorsByPatients", viewAllDoctorsForPatients);
server.get(
  "/viewHealthPackages",
  viewHealthPackages
);
server.get("/viewWalletAmount", viewWalletAmount);
server.post("/getDoctorsWithSessionPrice", getDoctorsWithSessionPrice);
server.post("/filterDoctorsAfterSearch", filterDoctorsAfterSearch);
server.post("/viewAllAppointments", viewAllAppointments);
server.post(
  "/filterDoctorsAfterSearchDocName",
  filterDoctorsAfterSearchDocName
);

//doctor
server.post("/selectPatient", selectPatient);
server.post("/viewInfoAndHealthRecord", viewInfoAndHealthRecord);
server.post("/viewPatients", viewPatients);
server.post(
  "/filterApointmentsByDateOrStatusDoc",
  filterApointmentsByDateOrStatusDoc
);
server.post("/filterPatientsByAppointments", filterPatientsByAppointments);
server.get("/searchPatientByName", searchPatientByName);
server.post("/viewDocApp", viewDocApp);

////////////////////////////////////////////////////PUT////////////////////////////////////////
//admin
server.put("/updatePackage", updatePackage);
//doctor
server.put("/updateDoctorProfile", updateDoctorProfile);

////////////////////////////////////////////////DELETE/////////////////////////////////////////
//admin
server.delete("/deletePackage", deletePackage);
server.delete("/removeDoctor", removeDoctor);
server.delete("/removePatient", removePatient);
server.delete("/removeAdmin", removeAdmin);
server.delete("/rejectDoctor", rejectPotentialDoctor);
server.delete("/removeFamilyMember", removeFamilyMember);

/*
                                                    End of your code
*/
