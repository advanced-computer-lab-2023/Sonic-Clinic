// External variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const stripe = require("stripe")(
  "sk_test_51O9lZ0IQTS4vUIMWJeAJ5Ds71jNbeQFj6v8mO7leS2cDIJuLy1fwNzoiXPKZV5KdoMpfzocfJ6hBusxPIjbGeveF00RTnmVYCX"
);

//const Grid = require('gridfs-stream');
//const GridFS = Grid(mongoose.connection.db, mongoose.mongo);

//const multer = require('multer');

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
  viewAllAppointmentsPatient,
  filterDoctorsAfterSearchDocName,
  removeFamilyMember,
  viewHealthPackages,
  viewWalletAmount,
  viewAllAppointmentsOfDoctor,
  subscribeHealthPackageStripe,
  subscribeHealthPackageFam,
  viewAvailableAppointmentsOfDoctor,
  cancelHealthPackage,
  cancelHealthPackageFam,
  viewSubscribedPackages,

  changePasswordForPatient,
  //uploadPDF,
  addFamilyMemberExisting,
  addAppointmentForMyselfOrFam,
  changePasswordForPatientForget,
  viewWalletPatient,
  subscribeHealthPackageWallet,
  payAppointmentWallet,
  payAppointmentStripe,
  handlePackageStripe,
  handleAppointmentStripe,
  viewPrescriptionDetails,
  cancelAppointmentPatient,
  reqFollowUpForMyselfOrFam,
  rescheduleAppForMyselfOrFam,
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
  addAvailableSlots,
  viewAllAppointmentsDoctor,
  changePasswordForDoctor,
  addAppointmentByPatientID,
  viewAvailableSlots,
  viewWalletDoc,
  acceptContract,
  changePasswordForDoctorForget,
  viewPrescriptionsDoc,
  cancelAppointmentDoc,
  viewFollowUpsReq,
  acceptFollowUp,
  rejectFollowUp,
  viewNotifications,
  notificationFlag,
  rescheduleAppDoc,
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
  changePasswordForAdmin,
} = require("./Controllers/adminstratorController");

////////////////////////////////guestController///////////////////////////////////////////
const {
  addPatient,
  addPotentialDoctor,
  acceptPotientialDoc,
} = require("./Controllers/guestController");

////////////////////////////////authorizationController///////////////////////////////////////////

const {
  login,
  requireAuth,
  logout,
  otp,
  verifyOtp,
  requireAdminAuth,
  requirePatientAuth,
  requireDoctorAuth,
} = require("./Controllers/authorization");
////////////////////////////////uploadController///////////////////////////////////////////
const {
  uploadFiles,
  deleteFileFromMedicalHistory,
  viewPatientMedicalHistory,
  viewPatientMedicalHistoryForDoctors,
  uploadFilesForPotentialDoctor,
  viewMedicalRecords,
  uploadFilesbyDoctors,
  viewPtlDocDocumentsbyAdmins,
  downloadPrescriptions,
} = require("./Controllers/upload");

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
//const pdfSchema = require('./Models/pdf.js'); // Import the PDF model
//////////////////////////////////////////////////////////////////////////////////////

//login
server.use(cookieParser());
server.use(bodyParser.json());
server.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);
//login
server.post("/login", login);
server.get("/logout", logout);

// configurations
// Mongo DB

// Set up Multer for file uploads
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

// Connect to MongoDB using Mongoose
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
server.post("/otp", otp);
server.post("/verifyOtp", verifyOtp);
//admin
server.post("/addAdmin", addAdmin);
server.post("/addDoctor", addDoctor);
server.post("/addPackage", addPackage);
server.post("/changePasswordForAdmin", requireAuth, changePasswordForAdmin);

//guest
server.post("/acceptPotientialDoc", acceptPotientialDoc);
server.post("/addPatient", addPatient);
server.post("/addPotentialDoctor", addPotentialDoctor);
//doctor
server.get("/acceptContract", requireAuth, acceptContract);
server.post("/addPrescription", requireAuth, addPrescription);
server.post("/addAvailableSlots", requireAuth, addAvailableSlots);
server.post("/changePasswordForPatient", requireAuth, changePasswordForPatient);
server.post(
  "/addAppointmentByPatientID",
  requireAuth,
  addAppointmentByPatientID
);
server.post("/changePasswordForDoctorForget", changePasswordForDoctorForget);
server.post("/viewPrescriptionsDoc", requireAuth, viewPrescriptionsDoc);
server.post("/cancelAppointmentDoc", requireAuth, cancelAppointmentDoc);
server.post("/viewNotifications", requireAuth, viewNotifications);
//patient
server.post("/addFamilyMember", requirePatientAuth, addFamilyMember);
server.post("/addAppointment", requireAuth, addAppointment);
server.post(
  "/subscribeHealthPackage",
  requireAuth,
  subscribeHealthPackageStripe
);
server.post(
  "/subscribeHealthPackageFam",
  requireAuth,
  subscribeHealthPackageFam
);
server.post("/changePasswordForPatient", requireAuth, changePasswordForPatient);
server.post(
  "/addAppointmentForMyselfOrFam",
  requireAuth,
  addAppointmentForMyselfOrFam
);
server.post("/changePasswordForPatientForget", changePasswordForPatientForget);
server.post("/payAppointmentWallet", requireAuth, payAppointmentWallet);
server.post("/payAppointmentStripe", requireAuth, payAppointmentStripe);
server.get("/viewMedicalRecords", requireAuth, viewMedicalRecords);

server.post("/handlePackageStripe", requireAuth, handlePackageStripe);
server.post("/handleAppointmentStripe", requireAuth, handleAppointmentStripe);
server.post("/viewPrescriptionDetails", requireAuth, viewPrescriptionDetails);
server.post("/cancelAppointmentPatient", requireAuth, cancelAppointmentPatient);
server.post(
  "/reqFollowUpForMyselfOrFam",
  requireAuth,
  reqFollowUpForMyselfOrFam
);
server.post("/viewFollowUpsReq", requireAuth, viewFollowUpsReq);
server.post("/acceptFollowUp", requireAuth, acceptFollowUp);
server.post("/rejectFollowUp", requireAuth, rejectFollowUp);
server.post("/notificationFlag", requireAuth, notificationFlag);
server.post(
  "/rescheduleAppForMyselfOrFam",
  requireAuth,
  rescheduleAppForMyselfOrFam
);
server.post("/rescheduleAppDoc", requireAuth, rescheduleAppDoc);
//////////////////////////////////////////// GET/////////////////////////////////////
//admin
server.get("/viewAllPatients", requireAuth, viewAllPatients);
server.get("/viewAllDoctors", requireAuth, viewAllDoctors);
server.get("/viewPotentialDoctors", requireAuth, viewPotentialDoctors);
server.get("/viewPackagesAdmin", requireAuth, viewPackagesAdmin);
server.get("/viewAllAdmins", requireAuth, viewAllAdmins);
server.get("/viewAllDocApp", requireAuth, viewAllDocApp);
//patient
server.post("/doctorDetails", requireAuth, doctorDetails);
server.post("/viewPrescriptions", requireAuth, viewPrescriptions);
server.post("/viewFamilyMembers", requireAuth, viewFamilyMembers);
server.post("/selectPrescription", requireAuth, selectPrescription);
server.post("/filterPrescriptions", requireAuth, filterPrescriptions);
server.post(
  "/filterAppointmentsByDateOrStatus",
  requireAuth,
  filterAppointmentsByDateOrStatus
);
server.post("/searchDoctors", requireAuth, searchDoctors);
server.post(
  "/viewAllAppointmentsOfDoctor",
  requireAuth,
  viewAllAppointmentsOfDoctor
);
server.get("/filterDoctors", requireAuth, filterDoctors);
server.get("/viewAvailablePackages", requireAuth, viewAvailablePackages);
server.get("/viewAllDoctorsByPatients", requireAuth, viewAllDoctorsForPatients);
server.get("/viewHealthPackages", requireAuth, viewHealthPackages);
server.get("/viewWalletAmount", requireAuth, viewWalletAmount);
server.post(
  "/getDoctorsWithSessionPrice",
  requireAuth,
  getDoctorsWithSessionPrice
);
server.post("/filterDoctorsAfterSearch", requireAuth, filterDoctorsAfterSearch);
server.post(
  "/viewAllAppointmentsPatient",
  requireAuth,
  viewAllAppointmentsPatient
);
server.post(
  "/filterDoctorsAfterSearchDocName",
  requireAuth,
  filterDoctorsAfterSearchDocName
);
server.post(
  "/viewAvailableAppointmentsOfDoctor",
  requireAuth,
  viewAvailableAppointmentsOfDoctor
);
server.post("/cancelHealthPackage", requireAuth, cancelHealthPackage);
server.post("/cancelHealthPackageFam", requireAuth, cancelHealthPackageFam);
server.post("/changePasswordForDoctor", requireAuth, changePasswordForDoctor);
server.post("/addFamilyMemberExisting", requireAuth, addFamilyMemberExisting);
//server.post("/uploadPdf",requireAuth, uploadPDF);
//server.post("/addFamilyMemberExisting", requireAuth, addFamilyMemberExisting);
//server.post("/uploadFiles",requireAuth, uploadFiles);
server.get("/viewWalletPatient", requireAuth, viewWalletPatient);
server.post(
  "/subscribeHealthPackageWallet",
  requireAuth,
  subscribeHealthPackageWallet
);

//doctor
server.get("/viewAvailableSlots", requireAuth, viewAvailableSlots);
server.post("/selectPatient", requireAuth, selectPatient);
server.post("/viewInfoAndHealthRecord", requireAuth, viewInfoAndHealthRecord);
server.post("/viewPatients", requireAuth, viewPatients);
server.post(
  "/filterApointmentsByDateOrStatusDoc",
  requireAuth,
  filterApointmentsByDateOrStatusDoc
);
server.post(
  "/filterPatientsByAppointments",
  requireAuth,
  filterPatientsByAppointments
);
server.get("/searchPatientByName", requireAuth, searchPatientByName);
server.post("/viewDocApp", requireAuth, viewDocApp);
server.post("/viewSubscribedPackage", requireAuth, viewSubscribedPackages);
//server.post("/viewSubscribedPackageFam", requireAuth, viewSubscribedPackageFam);
server.get(
  "/viewAllAppointmentsDoctor",
  requireAuth,
  viewAllAppointmentsDoctor
);
server.get("/viewWalletDoc", requireAuth, viewWalletDoc);
//upload
server.post("/uploadFilesForPotentialDoctor", uploadFilesForPotentialDoctor);
server.post("/uploadFiles", requireAuth, uploadFiles);
server.post("/uploadFilesbyDoctors", requireAuth, uploadFilesbyDoctors);
server.post(
  "/viewPatientMedicalHistoryForDoctors",
  requireAuth,
  viewPatientMedicalHistoryForDoctors
);
server.post(
  "/downloadPrescriptions",
  requireAuth,
  downloadPrescriptions
);

server.post(
  "/viewPtlDocDocumentsbyAdmins",
  requireAuth,
  viewPtlDocDocumentsbyAdmins
);

server.get(
  "/viewPatientMedicalHistory",
  requireAuth,
  viewPatientMedicalHistory
);
server.delete(
  "/deleteFileFromMedicalHistory",
  requireAuth,
  deleteFileFromMedicalHistory
);

//auth
////////////////////////////////////////////////////PUT////////////////////////////////////////
//admin
server.put("/updatePackage", requireAuth, updatePackage);
//doctor
server.put("/updateDoctorProfile", requireAuth, updateDoctorProfile);

////////////////////////////////////////////////DELETE/////////////////////////////////////////
//admin
server.delete("/deletePackage", requireAuth, deletePackage);
server.delete("/removeDoctor", requireAuth, removeDoctor);
server.delete("/removePatient", requireAuth, removePatient);
server.delete("/removeAdmin", requireAuth, removeAdmin);
server.delete("/rejectDoctor", requireAuth, rejectPotentialDoctor);
server.delete("/removeFamilyMember", requireAuth, removeFamilyMember);

/////handling el payment///////
server.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
                                                    End of your code
*/
