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
const http = require("http");
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
  payPrescriptionStripe,
  payPrescriptionWallet,
  handlePrescreptionStripe,
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
  viewMedicines,
  addMedicineToPrescription,
  removeMedicineFromPrescription,
  updatePrescription,
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
  viewChat,
  viewChats,
  sendMessage,
  addChat,
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
const port = process.env.PORT || "8000";
const app = express();
const server = app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
//3lashan lw i am running haga fi el port el awlani yb2a fi option tany

//require el models (schema) basamih kol ma aktb user refer to el schema user model
const patient = require("./Models/Patient.js");
const doctor = require("./Models/Doctor.js");
const adminstrator = require("./Models/Adminstrator");
const potentialDoctor = require("./Models/PotentialDoctor");
const appointment = require("./Models/Appointment");
//const pdfSchema = require('./Models/pdf.js'); // Import the PDF model
//////////////////////////////////////////////////////////////////////////////////////

//login
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);
//login
app.post("/login", login);
app.get("/logout", logout);

// configurations
// Mongo DB

// Set up Multer for file uploads
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket id :", socket.id);
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// Connect to MongoDB using Mongoose
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
  })
  .catch((err) => console.log(err));

/*
                                                    Start of your code
*/
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

// #Routing to userController here
app.use(express.json());

////////////////////////////////////////////////POST//////////////////////////////////
app.post("/otp", otp);
app.post("/verifyOtp", verifyOtp);
//admin
app.post("/addAdmin", addAdmin);
app.post("/addDoctor", addDoctor);
app.post("/addPackage", addPackage);
app.post("/changePasswordForAdmin", requireAuth, changePasswordForAdmin);

//guest
app.post("/acceptPotientialDoc", acceptPotientialDoc);
app.post("/addPatient", addPatient);
app.post("/addPotentialDoctor", addPotentialDoctor);
//doctor
app.get("/acceptContract", requireAuth, acceptContract);
app.post("/addPrescription", requireAuth, addPrescription);
app.post("/addAvailableSlots", requireAuth, addAvailableSlots);
app.post("/changePasswordForPatient", requireAuth, changePasswordForPatient);
app.post("/addAppointmentByPatientID", requireAuth, addAppointmentByPatientID);
app.post("/changePasswordForDoctorForget", changePasswordForDoctorForget);
app.post("/viewPrescriptionsDoc", requireAuth, viewPrescriptionsDoc);
app.post("/cancelAppointmentDoc", requireAuth, cancelAppointmentDoc);
app.post("/viewNotifications", requireAuth, viewNotifications);
app.post("/viewChat", requireAuth, viewChat);
app.post("/viewChats", requireAuth, viewChats);
app.post("/sendMessage", requireAuth, sendMessage);
app.get("/addChat", addChat);
//patient
app.post("/addFamilyMember", requirePatientAuth, addFamilyMember);
app.post("/addAppointment", requireAuth, addAppointment);
app.post("/subscribeHealthPackage", requireAuth, subscribeHealthPackageStripe);
app.post("/subscribeHealthPackageFam", requireAuth, subscribeHealthPackageFam);
app.post("/changePasswordForPatient", requireAuth, changePasswordForPatient);
app.post(
  "/addAppointmentForMyselfOrFam",
  requireAuth,
  addAppointmentForMyselfOrFam
);
app.post("/changePasswordForPatientForget", changePasswordForPatientForget);
app.post("/payAppointmentWallet", requireAuth, payAppointmentWallet);
app.post("/payAppointmentStripe", requireAuth, payAppointmentStripe);
app.get("/viewMedicalRecords", requireAuth, viewMedicalRecords);

app.post("/handlePackageStripe", requireAuth, handlePackageStripe);
app.post("/handleAppointmentStripe", requireAuth, handleAppointmentStripe);
app.post("/viewPrescriptionDetails", requireAuth, viewPrescriptionDetails);
app.post("/cancelAppointmentPatient", requireAuth, cancelAppointmentPatient);
app.post("/reqFollowUpForMyselfOrFam", requireAuth, reqFollowUpForMyselfOrFam);
app.post("/viewFollowUpsReq", requireAuth, viewFollowUpsReq);
app.post("/acceptFollowUp", requireAuth, acceptFollowUp);
app.post("/rejectFollowUp", requireAuth, rejectFollowUp);
app.post("/notificationFlag", requireAuth, notificationFlag);
app.post(
  "/rescheduleAppForMyselfOrFam",
  requireAuth,
  rescheduleAppForMyselfOrFam
);

app.post("/rescheduleAppDoc", requireAuth, rescheduleAppDoc);
// app.post("/addMedicineToPrescription", requireAuth, addMedicineToPrescription);
// app.post(
//   "/removeMedicineFromPrescription",
//   requireAuth,
//   removeMedicineFromPrescription
// );
// app.post("/updatePrescription", requireAuth, updatePrescription);
// app.post("/addDosage", requireAuth, addDosage);
app.post("/rescheduleAppDoc", requireAuth, rescheduleAppDoc);
app.post("/addMedicineToPrescription", requireAuth, addMedicineToPrescription);
app.post(
  "/removeMedicineFromPrescription",
  requireAuth,
  removeMedicineFromPrescription
);
app.post("/updatePrescription", requireAuth, updatePrescription);

//////////////////////////////////////////// GET/////////////////////////////////////
//admin
app.get("/viewAllPatients", requireAuth, viewAllPatients);
app.get("/viewAllDoctors", requireAuth, viewAllDoctors);
app.get("/viewPotentialDoctors", requireAuth, viewPotentialDoctors);
app.get("/viewPackagesAdmin", requireAuth, viewPackagesAdmin);
app.get("/viewAllAdmins", requireAuth, viewAllAdmins);
app.get("/viewAllDocApp", requireAuth, viewAllDocApp);
//patient
app.post("/doctorDetails", requireAuth, doctorDetails);
app.post("/viewPrescriptions", requireAuth, viewPrescriptions);
app.post("/viewFamilyMembers", requireAuth, viewFamilyMembers);
app.post("/selectPrescription", requireAuth, selectPrescription);
app.post("/filterPrescriptions", requireAuth, filterPrescriptions);
app.post(
  "/filterAppointmentsByDateOrStatus",
  requireAuth,
  filterAppointmentsByDateOrStatus
);
app.post("/searchDoctors", requireAuth, searchDoctors);
app.post(
  "/viewAllAppointmentsOfDoctor",
  requireAuth,
  viewAllAppointmentsOfDoctor
);
app.get("/filterDoctors", requireAuth, filterDoctors);
app.get("/viewAvailablePackages", requireAuth, viewAvailablePackages);
app.get("/viewAllDoctorsByPatients", requireAuth, viewAllDoctorsForPatients);
app.get("/viewHealthPackages", requireAuth, viewHealthPackages);
app.get("/viewWalletAmount", requireAuth, viewWalletAmount);
app.post(
  "/getDoctorsWithSessionPrice",
  requireAuth,
  getDoctorsWithSessionPrice
);
app.post("/filterDoctorsAfterSearch", requireAuth, filterDoctorsAfterSearch);
app.post(
  "/viewAllAppointmentsPatient",
  requireAuth,
  viewAllAppointmentsPatient
);
app.post(
  "/filterDoctorsAfterSearchDocName",
  requireAuth,
  filterDoctorsAfterSearchDocName
);
app.post(
  "/viewAvailableAppointmentsOfDoctor",
  requireAuth,
  viewAvailableAppointmentsOfDoctor
);
app.post("/cancelHealthPackage", requireAuth, cancelHealthPackage);
app.post("/cancelHealthPackageFam", requireAuth, cancelHealthPackageFam);
app.post("/changePasswordForDoctor", requireAuth, changePasswordForDoctor);
app.post("/addFamilyMemberExisting", requireAuth, addFamilyMemberExisting);
//app.post("/uploadPdf",requireAuth, uploadPDF);
//app.post("/addFamilyMemberExisting", requireAuth, addFamilyMemberExisting);
//app.post("/uploadFiles",requireAuth, uploadFiles);
app.get("/viewWalletPatient", requireAuth, viewWalletPatient);
app.post(
  "/subscribeHealthPackageWallet",
  requireAuth,
  subscribeHealthPackageWallet
);

app.post("/payPrescriptionStripe", requireAuth, payPrescriptionStripe);
app.post("/payPrescriptionWallet", requireAuth, payPrescriptionWallet);
app.post("/handlePrescreptionStripe", requireAuth, handlePrescreptionStripe);

//doctor
app.get("/viewAvailableSlots", requireAuth, viewAvailableSlots);
app.post("/selectPatient", requireAuth, selectPatient);
app.post("/viewInfoAndHealthRecord", requireAuth, viewInfoAndHealthRecord);
app.post("/viewPatients", requireAuth, viewPatients);
app.post(
  "/filterApointmentsByDateOrStatusDoc",
  requireAuth,
  filterApointmentsByDateOrStatusDoc
);
app.post(
  "/filterPatientsByAppointments",
  requireAuth,
  filterPatientsByAppointments
);
app.get("/searchPatientByName", requireAuth, searchPatientByName);
app.post("/viewDocApp", requireAuth, viewDocApp);
app.post("/viewSubscribedPackage", requireAuth, viewSubscribedPackages);
//app.post("/viewSubscribedPackageFam", requireAuth, viewSubscribedPackageFam);
app.get("/viewAllAppointmentsDoctor", requireAuth, viewAllAppointmentsDoctor);
app.get("/viewWalletDoc", requireAuth, viewWalletDoc);
//upload
app.post("/uploadFilesForPotentialDoctor", uploadFilesForPotentialDoctor);
app.post("/uploadFiles", requireAuth, uploadFiles);
app.post("/uploadFilesbyDoctors", requireAuth, uploadFilesbyDoctors);
app.post(
  "/viewPatientMedicalHistoryForDoctors",
  requireAuth,
  viewPatientMedicalHistoryForDoctors
);
app.post("/downloadPrescriptions", requireAuth, downloadPrescriptions);

app.post(
  "/viewPtlDocDocumentsbyAdmins",
  requireAuth,
  viewPtlDocDocumentsbyAdmins
);

app.get("/viewPatientMedicalHistory", requireAuth, viewPatientMedicalHistory);
app.delete(
  "/deleteFileFromMedicalHistory",
  requireAuth,
  deleteFileFromMedicalHistory
);
app.get("/viewMedicines", requireAuth, viewMedicines);

//auth
////////////////////////////////////////////////////PUT////////////////////////////////////////
//admin
app.put("/updatePackage", requireAuth, updatePackage);
//doctor
app.put("/updateDoctorProfile", requireAuth, updateDoctorProfile);

////////////////////////////////////////////////DELETE/////////////////////////////////////////
//admin
app.delete("/deletePackage", requireAuth, deletePackage);
app.delete("/removeDoctor", requireAuth, removeDoctor);
app.delete("/removePatient", requireAuth, removePatient);
app.delete("/removeAdmin", requireAuth, removeAdmin);
app.delete("/rejectDoctor", requireAuth, rejectPotentialDoctor);
app.delete("/removeFamilyMember", requireAuth, removeFamilyMember);

/////handling el payment///////
app.post("/create-payment-intent", async (req, res) => {
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
