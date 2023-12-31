const patientModel = require("../Models/Patient.js");
const { default: mongoose } = require("mongoose");
const doctorModel = require("../Models/Doctor.js");
const familyMemberModel = require("../Models/FamilyMember.js");
const packagesModel = require("../Models/Packages.js");
const prescriptionModel = require("../Models/Prescription.js");
const appointmentModel = require("../Models/Appointment.js");
const chatModel = require("../Models/Chat.js");
const { updateUserInfoInCookie } = require("./authorization.js");
const bcrypt = require("bcrypt");
const stripe = require("stripe")(
  "sk_test_51O9lZ0IQTS4vUIMWJeAJ5Ds71jNbeQFj6v8mO7leS2cDIJuLy1fwNzoiXPKZV5KdoMpfzocfJ6hBusxPIjbGeveF00RTnmVYCX"
);
const administratorModel = require("../Models/Adminstrator.js");
const followUpModel = require("../Models/FollowUp.js");
const medicineModel = require("../Models/Medicine.js");
const Order = require("../Models/Order.js");
const Pharmacist = require("../Models/Pharmacist.js");

const doctorDetails = async (req, res) => {
  const { name } = req.body;

  try {
    const doctor = await doctorModel.findOne({ name });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const affiliation = doctor.affiliation;
    const educationalBackground = doctor.educationalBackground;
    const specialty = doctor.specialty;
    const output = { name, affiliation, educationalBackground, specialty };

    return res.status(200).json({ output });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const searchDoctors = async (req, res) => {
  const { name, specialty: specialty } = req.body;

  try {
    let query = {};

    // Use regex for partial name search
    if (name) {
      const nameRegex = new RegExp(name, "i");
      query.name = { $regex: nameRegex };
    }

    if (specialty) {
      query.specialty = specialty;
    }

    const doctors = await doctorModel.find(query);

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const filterDoctors = async (req, res) => {
  const { specialties, date, time } = req.query;

  query = { date, time, status: "not filled" };

  try {
    if (specialties.length === 0) {
      return res
        .status(405)
        .json({ message: "Please select at least one specialty" });
    }
    //  const doctorTrial = await doctorModel.find({specialty: "Neurology"});
    //  console.log(doctorTrial);

    const doctors = await doctorModel.find({
      specialty: { $in: specialties },
    });
    //console.log(doctors);

    //const doctors = await doctorModel.find({ specialty: specialty });

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    if (!date && !time) {
      res.status(200).json({ doctors });
    }
    if (date && !time) {
      return res.status(405).json({ message: "Please enter time" });
    }
    if (!date && time) {
      return res.status(406).json({ message: "Please enter date" });
    }

    const appointments = await appointmentModel.find(query);
    //console.log(appointments);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    const availableAppointments = appointments.filter(
      (appointment) => appointment.status !== "filled"
    );
    const availableDoctors = doctors.filter((doctor) =>
      availableAppointments.some(
        (appointment) =>
          appointment.doctorID.toString() === doctor._id.toString() &&
          doctor.specialty.toString() === specialty.toString()
      )
    );

    res.status(200).json({ availableDoctors });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const filterAppointmentsByDateOrStatus = async (req, res) => {
  const { date, status } = req.query;

  try {
    // Retrieve username from the session
    const patientID = req.user.id;

    let query = { patientID };

    if (date) {
      query.date = date;
    }

    if (status) {
      query.status = status;
    }

    const appointments = await appointmentModel.find(query);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const viewPrescriptions = async (req, res) => {
  try {
    // Extract the username from the session
    const id = req.user.id;

    // Check if a patient with the provided username exists
    const prescriptions = await prescriptionModel.find({ patientID: id });

    if (!prescriptions) {
      return res.status(404).json({ message: "Patient not found." });
    }
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const filterPrescriptions = async (req, res) => {
  const { doctorID, status, date } = req.query;

  try {
    // Retrieve username from the session
    const patientID = req.user.id;

    let query = { patientID };

    if (doctorID) {
      query.doctorID = doctorID;
    }

    if (status) {
      // console.log(status);
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    const prescriptions = await prescriptionModel.find(query);

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found." });
    }

    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const viewFamilyMembers = async (req, res) => {
  const patientId = req.user.id;

  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const familyMembers = await familyMemberModel.find({
      patientID: patientId,
    });

    if (!familyMembers || familyMembers.length === 0) {
      return res.status(404).json({ message: "No family members found." });
    }
    //console.log("fkkfnkdnfreg");

    await Promise.all(
      familyMembers.map(async (familyMember) => {
        if (familyMember.package !== "  ") {
          await familyMember.populate("packagesFamily");
        }
      })
    );

    res.status(200).json({ familyMembers });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const selectPrescription = async (req, res) => {
  const prescriptionId = req.body._id;
  const id = req.user.id;

  try {
    const prescription = await prescriptionModel.findOne({
      patientID: id,
      _id: prescriptionId,
    });

    if (!prescription) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({ prescription });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const addFamilyMember = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id); // Assuming req.user is a Mongoose model instance

    const name = req.body.name;
    const nationalID = req.body.nationalID;
    const age = req.body.age;
    const gender = req.body.gender;
    const relationToPatient = req.body.relationToPatient;

    // Check if the relation is husband or wife
    if (
      relationToPatient.toLowerCase() === "husband" ||
      relationToPatient.toLowerCase() === "wife"
    ) {
      // Check if the patient already has a family member with a husband/wife relation
      const existingHusbandOrWife = await familyMemberModel.findOne({
        patientID: patient.id,
        relationToPatient: { $in: ["husband", "wife"] },
      });

      if (existingHusbandOrWife) {
        return res
          .status(400)
          .send({ error: "Patient already has a husband/wife in the family." });
      }
    }

    // Create the new family member
    const newFamilyMember = await familyMemberModel.create({
      name,
      nationalID,
      age,
      gender,
      relationToPatient,
      patientID: patient.id,
      package: "  ", // Use patient's ID
    });

    // Update the patient's familyMembers array
    patient.familyMembers = patient.familyMembers || [];
    patient.familyMembers.push([newFamilyMember._id, newFamilyMember.name]);

    // Save the updated patient document
    await patient.save();

    res.status(200).send(newFamilyMember);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const addFamilyMemberExisting = async (req, res) => {
  const email = req.body.email;
  const relationToPatient = req.body.relationToPatient;
  const phoneNumber = req.body.phoneNumber;
  const patient = await patientModel.findById(req.user.id);
  let familyMember;

  try {
    familyMember = await patientModel.findOne({ email: email });

    if (!familyMember || !email || email === undefined) {
      familyMember = await patientModel.findOne({ mobileNumber: phoneNumber });
    }

    if (!familyMember) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Check if the relation is husband or wife
    if (
      relationToPatient.toLowerCase() === "husband" ||
      relationToPatient.toLowerCase() === "wife"
    ) {
      // Check if the patient already has a family member with a husband/wife relation
      const existingHusbandOrWife = await familyMemberModel.findOne({
        patientID: patient.id,
        relationToPatient: { $in: ["husband", "wife"] },
      });

      if (existingHusbandOrWife) {
        return res
          .status(400)
          .send({ error: "Patient already has a husband/wife in the family." });
      }
    }

    const name = familyMember.name;
    const nationalID = familyMember.nationalID;
    const gender = familyMember.gender;
    const dateOfBirth = familyMember.dateOfBirth; // Replace this with the actual date of birth
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - dateOfBirth;
    const age = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

    const fam = await familyMemberModel.create({
      name,
      nationalID,
      age,
      gender,
      relationToPatient,
      patientID: req.user.id,
      package: "  ",
      patientRef: familyMember._id,
    });
    patient.familyMembers = patient.familyMembers || [];
    patient.familyMembers.push([fam._id, name]);
    await patient.save();

    res.status(200).json(fam);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
};

const viewAvailablePackages = async (req, res) => {
  try {
    const packages = await packagesModel.find();
    if (!packages || packages.length === 0) {
      return res.status(404).json({ message: "No packages found." });
    }
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const calculateSessionPrice = async (hourlyRate, patientPackage) => {
  try {
    // Fetch the package information based on the patient's package

    if (patientPackage === "  ") {
      return hourlyRate;
    }
    const packageInfo = await packagesModel.findById(patientPackage);
    if (!packageInfo) {
      return hourlyRate;
    } else {
      // Calculate the session price based on the package discount
      const sessionPrice =
        hourlyRate * 1.1 * (1 - packageInfo.sessionDiscount * 0.01);

      return sessionPrice;
    }
  } catch (error) {
    // Handle any errors that occur during database query
    throw error;
  }
};

// const dummyDoctorsSession = [
//   {
//     username: "drjohnsmith",
//     name: "John Smith",
//     email: "john.smith@example.com",
//     password: "password123",
//     dateOfBirth: "1980-05-15",
//     hourlyRate: 150,
//     sessionPrice: 150,
//     appointments: [],

//     affiliation: "City Hospital",
//     educationalBackground: "M.D. from University of Medical Sciences",
//     patients: [],
//     specialty: "Cardiology",
//     photoLink:
//       "https://media.licdn.com/dms/image/C4E03AQFg161EE_9n0Q/profile-displayphoto-shrink_800_800/0/1540403513741?e=2147483647&v=beta&t=zODGGNsdmZ03iwtSrHJEMR_Qxd_NkEQueFjKfd9JrOE",
//   },
//   {
//     username: "dremljohnson",
//     name: "Emily Johnson",
//     email: "emily.johnson@example.com",
//     password: "password456",
//     dateOfBirth: "1975-08-22",
//     hourlyRate: 120,
//     sessionPrice: 120,
//     appointments: [],
//     affiliation: "Community Clinic",
//     educationalBackground: "M.D. from Medical University",
//     patients: [],
//     specialty: "Orthopedics",
//     photoLink:
//       "https://media.licdn.com/dms/image/C4E03AQHJ_sJIJWxHpw/profile-displayphoto-shrink_800_800/0/1529980129766?e=2147483647&v=beta&t=yH7Pz2hfrso5nXNCFilmjOnvL7OVcLML5vOsvA7nWDM",
//   },
//   {
//     username: "drmichaelbrown",
//     name: "Michael Brown",
//     email: "michael.brown@example.com",
//     password: "password789",
//     dateOfBirth: "1983-03-10",
//     hourlyRate: 170,
//     sessionPrice: 170,
//     appointments: [],
//     affiliation: "General Hospital",
//     educationalBackground: "M.D. from Health Sciences Institute",
//     patients: [],
//     specialty: "Neurology",
//     photoLink:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAi46IZubvG3_2P4upQgk2zqAqzySmQ7Yx8qmgUOuWdnth2Yoy7BXbSxHTEqpD8_11aeI&usqp=CAU",
//   },
//   {
//     username: "drsarahwilson",
//     name: "Sarah Wilson",
//     email: "sarah.wilson@example.com",
//     password: "password101",
//     dateOfBirth: "1978-11-28",
//     hourlyRate: 140,
//     sessionPrice: 140,
//     appointments: [],
//     affiliation: "Medical Center",
//     educationalBackground: "M.D. from Wellness University",
//     patients: [],
//     specialty: "Oncology",
//     photoLink:
//       "https://media.licdn.com/dms/image/C4D03AQF3MdVSGuXrDw/profile-displayphoto-shrink_800_800/0/1525397028366?e=2147483647&v=beta&t=Ai6blaPhh7JFpMGwn1ltvfk40FHEupx1txBM6Qda7AY",
//   },
//   {
//     username: "drdavidlee",
//     name: "David Lee",
//     email: "david.lee@example.com",
//     password: "password202",
//     dateOfBirth: "1985-09-03",
//     hourlyRate: 160,
//     sessionPrice: 160,
//     appointments: [],
//     affiliation: "Health Clinic",
//     educationalBackground: "M.D. from Healing Institute",
//     patients: [],
//     appointments: [],
//     specialty: "Neurology",
//     photoLink:
//       "https://www.woodlandshospital.in/images/doctor-img/ravi-kant-saraogi.jpg",
//   },
//   {
//     username: "drkarendavis",
//     name: "Karen Davis",
//     email: "karen.davis@example.com",
//     password: "password404",
//     dateOfBirth: "1976-07-07",
//     hourlyRate: 130,
//     sessionPrice: 130,
//     appointments: [],
//     affiliation: "General Medical Center",
//     educationalBackground: "M.D. from Health Sciences Academy",
//     patients: [],
//     specialty: "Oncology",
//     photoLink:
//       "https://images.drlogy.com/assets/uploads/img/user/home/health/Doctors.webp",
//   },
// ];

const getDoctorsWithSessionPrice = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const doctors = await doctorModel.find().populate("appointment");

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    // const doctorsWithFilledAndConfirmedAppointments = doctors.filter((doctor) =>
    //   doctor.appointments.some((appointment) => appointment.status === "free")
    // );

    const doctorsWithSessionPrice = await Promise.all(
      doctors.map(async (doctor) => {
        const sessionPrice = await calculateSessionPrice(
          doctor.hourlyRate,
          patient.package
        );

        // Include all fields from the doctor object along with sessionPrice
        return {
          ...doctor.toObject(),
          sessionPrice: sessionPrice,
        };
      })
    );
    //const allDoctors = dummyDoctorsSession.concat(doctorsWithSessionPrice);

    res.status(200).json({ allDoctors: doctorsWithSessionPrice });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.create(req.body);
    const doctor = await doctorModel.findById(req.body.doctorID);
    doctor.patients.push(req.body.patientID);
    await doctor.save();
    res
      .status(201)
      .json({ message: "Appointment added successfully.", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Dummy data for 7 doctors with photo links
// const dummyDoctors = [
//   {
//     name: "John Smith",
//     specialty: "Cardiology",
//     photoLink:
//       "https://media.licdn.com/dms/image/C4E03AQFg161EE_9n0Q/profile-displayphoto-shrink_800_800/0/1540403513741?e=2147483647&v=beta&t=zODGGNsdmZ03iwtSrHJEMR_Qxd_NkEQueFjKfd9JrOE",
//   },
//   {
//     name: "Emily Johnson",
//     specialty: "Pediatrician",
//     photoLink:
//       "https://media.licdn.com/dms/image/C4E03AQHJ_sJIJWxHpw/profile-displayphoto-shrink_800_800/0/1529980129766?e=2147483647&v=beta&t=yH7Pz2hfrso5nXNCFilmjOnvL7OVcLML5vOsvA7nWDM",
//   },
//   {
//     name: "Michael Brown",
//     specialty: "Dermatologist",
//     photoLink:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAi46IZubvG3_2P4upQgk2zqAqzySmQ7Yx8qmgUOuWdnth2Yoy7BXbSxHTEqpD8_11aeI&usqp=CAU",
//   },
//   {
//     name: "Sarah Wilson",
//     specialty: "Oncologist",
//     photoLink:
//       "https://media.licdn.com/dms/image/C4D03AQF3MdVSGuXrDw/profile-displayphoto-shrink_800_800/0/1525397028366?e=2147483647&v=beta&t=Ai6blaPhh7JFpMGwn1ltvfk40FHEupx1txBM6Qda7AY",
//   },
//   {
//     name: "David Lee",
//     specialty: "Neurologist",
//     photoLink:
//       "https://www.woodlandshospital.in/images/doctor-img/ravi-kant-saraogi.jpg",
//   },
//   {
//     name: "Karen Davis",
//     specialty: "Psychiatrist",
//     photoLink:
//       "https://images.drlogy.com/assets/uploads/img/user/home/health/Doctors.webp",
//   },
// ];

const viewAllDoctorsForPatients = async (req, res) => {
  try {
    // Query the database to get real doctors
    const realDoctors = await doctorModel.find({}, { name: 1, specialty: 1 });

    //const allDoctors = dummyDoctors.concat(realDoctors);

    if (realDoctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    res.status(200).json({ doctors: realDoctors });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const filterDoctorsAfterSearch = async (req, res) => {
  const doctors = req.body;
  const { date, time } = req.query;

  try {
    if (!date && !time) {
      return res.status(200).json({ doctors });
    }
    if (date && !time) {
      return res.status(405).json({ message: "Please enter time" });
    }
    if (!date && time) {
      return res.status(406).json({ message: "Please enter date" });
    }

    // Filter doctors based on available slots
    const availableDoctors = doctors.filter((doctor) =>
      doctor.availableSlots.some((slot) => {
        const [slotDate, slotTime] = slot.split(" ");
        return slotDate === date && slotTime === time;
      })
    );

    if (availableDoctors.length === 0) {
      return res.status(404).json({ message: "No available doctors found." });
    }

    res.status(200).json({ availableDoctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const viewAllAppointmentsPatient = async (req, res) => {
  try {
    const patientId = req.user.id;
    let familyMember;

    // Fetch the patient's family members
    const patient = await patientModel.findById(patientId);
    const familyMembers = patient.familyMembers || [];

    // Get the IDs of the patient and their family members
    const memberIds = [patientId, ...familyMembers.map(([id, _]) => id)];

    // Find appointments for the patient and their family members
    const appointments = await appointmentModel
      .find({ patientID: { $in: memberIds } })
      .populate("doctor");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }
    for (const app of appointments) {
      familyMember = await familyMemberModel.findById(app.patientID);
      if (familyMember) {
        await app.populate("familyMember");
      } else {
        await app.populate("patient");
      }
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const filterDoctorsAfterSearchDocName = async (req, res) => {
  const name = req.query.name;
  const { specialty, date, time } = req.query;

  const doctorQuery = { specialty };
  if (name) {
    doctorQuery.name = name;
  }

  try {
    let doctors;

    if (specialty) {
      doctors = await doctorModel.find(doctorQuery);
    } else {
      doctors = await doctorModel.find();
    }

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    const filteredDoctors = doctors.filter((doctor) =>
      doctor.availableSlots?.some((slot) => {
        if (!slot) {
          return false;
        }
        console.log(slot);
        const [slotDate, slotTime] = slot.split(" ");
        return (
          slotDate == date &&
          slotTime == time &&
          (!specialty || doctor.specialty.toString() == specialty.toString())
        );
      })
    );

    if (filteredDoctors.length === 0 || !filteredDoctors) {
      return res.status(404).json({ message: "No available doctors found." });
    }

    const patientId = req.user.id;
    const patient = await patientModel.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const doctorsWithSessionPrice = await Promise.all(
      filteredDoctors
        .filter((doctor) => typeof doctor === "object" && doctor !== null) // Check if doctor is an object
        .map(async (doctor) => {
          const sessionPrice = await calculateSessionPrice(
            doctor.hourlyRate,
            patient.package
          );

          // Include all fields from the doctor object along with sessionPrice
          return {
            ...doctor.toObject(),
            sessionPrice: sessionPrice,
          };
        })
    );

    res.status(200).json({ doctorsWithSessionPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const removeFamilyMember = async (req, res) => {
  try {
    const id = req.query._id;
    const removedFamilyMember = await familyMemberModel.findByIdAndDelete(id);

    if (!removedFamilyMember) {
      return res.status(404).json({ message: "Family member not found" });
    }

    // Remove the family member from the patient's familyMembers array
    const patient = await patientModel.findById(req.user.id);
    if (patient.familyMembers) {
      patient.familyMembers = patient.familyMembers.filter(
        (member) => member[0].toString() !== id
      );
    }

    // Save the updated patient document
    await patient.save();

    return res
      .status(200)
      .json({ message: "Family member removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const viewHealthPackages = async (req, res) => {
  const patientID = req.user.id;

  try {
    const patient = await patientModel.findOne({ _id: patientID });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const familyMembers = await familyMemberModel.find({ patientID });

    let healthPackages = [];

    if (patient.package && patient.package !== "  ") {
      const packagePatient = await packagesModel.findById(patient.package);
      const patientWithPackage = {
        name: patient.name,
        _id: patient._id,
        package: packagePatient,
      };
      healthPackages.push(patientWithPackage);
    }

    if (
      patient.canceledHealthPackage &&
      patient.canceledHealthPackage.length > 0
    ) {
      const cancelledPackagesPromises = patient.canceledHealthPackage.map(
        async (cancelledPackageId) => {
          const cancelledPackage =
            await packagesModel.findById(cancelledPackageId);
          return cancelledPackage;
        }
      );

      const cancelledPackages = await Promise.all(cancelledPackagesPromises);
      healthPackages.push({
        name: patient.name,
        _id: patient._id,
        package: cancelledPackages, // Add array of cancelled packages
      });
    }

    if (
      patient.unsubscribedHealthPackage &&
      patient.unsubscribedHealthPackage.length > 0
    ) {
      const unsubscribedPackagesPromises =
        patient.unsubscribedHealthPackage.map(async (unsubscribedPackageId) => {
          const unsubscribedPackage = await packagesModel.findById(
            unsubscribedPackageId
          );
          return unsubscribedPackage;
        });

      const unsubscribedPackages = await Promise.all(
        unsubscribedPackagesPromises
      );
      healthPackages.push({
        name: patient.name,
        _id: patient._id,
        package: unsubscribedPackages,
      });
    }

    if (familyMembers.length > 0) {
      const familyPromises = familyMembers.map(async (familyMember) => {
        let famWithPackage = [];
        if (
          familyMember.package &&
          familyMember.package !== "  " &&
          familyMember.package !== "undefined"
        ) {
          const packageFam = await packagesModel.findById(familyMember.package);

          famWithPackage.push({
            name: familyMember.name,
            _id: familyMember._id,
            package: packageFam,
          });
        }
        if (
          familyMember.canceledHealthPackage &&
          familyMember.canceledHealthPackage.length > 0
        ) {
          // If family member has cancelled health packages, retrieve them
          const cancelledPackagesPromises =
            familyMember.canceledHealthPackage.map(
              async (cancelledPackageId) => {
                const cancelledPackage =
                  await packagesModel.findById(cancelledPackageId);
                return cancelledPackage;
              }
            );

          const cancelledPackages = await Promise.all(
            cancelledPackagesPromises
          );
          famWithPackage.push({
            name: familyMember.name,
            _id: familyMember._id,
            package: cancelledPackages,
          });
        }

        if (
          familyMember.unsubscribedHealthPackage &&
          familyMember.unsubscribedHealthPackage.length > 0
        ) {
          const unsubscribedPackagesPromises =
            familyMember.unsubscribedHealthPackage.map(
              async (unsubscribedPackageId) => {
                const unsubscribedPackage = await packagesModel.findById(
                  unsubscribedPackageId
                );
                return unsubscribedPackage;
              }
            );

          const unsubscribedPackages = await Promise.all(
            unsubscribedPackagesPromises
          );
          famWithPackage.push({
            name: familyMember.name,
            _id: familyMember._id,
            package: unsubscribedPackages,
          });
        }
        return famWithPackage;
      });

      const familyResults = await Promise.all(familyPromises);

      healthPackages = healthPackages.concat(familyResults.filter(Boolean));
    }

    res.status(200).json({ healthPackages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const viewWalletAmount = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await patientModel.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (typeof patient.wallet === "undefined") {
      return res
        .status(404)
        .json({ message: "Patient does not have a wallet." });
    }

    const walletAmount = patient.wallet;

    res.status(200).json({ walletAmount });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const viewAllAppointmentsOfDoctor = async (req, res) => {
  const { name } = req.body;

  try {
    const doctor = await doctorModel.findOne({ name });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const appointments = doctor.appointments;

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const subscribeHealthPackageStripe = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);
    const packageName = req.query.type;
    const package = await packagesModel.findOne({ type: packageName });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    if (patient.package !== "  ") {
      const patientPackage = await packagesModel.findOne({
        _id: patient.package,
      });
      if (patientPackage.type.includes(packageName)) {
        return res
          .status(404)
          .json({ message: "You are already subscribed to this package." });
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: package.type },
            unit_amount: package.price * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.SERVER_URL}/patient/health-packages-success`,
      cancel_url: `${process.env.SERVER_URL}/patient/fail`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const subscribeHealthPackageFam = async (req, res) => {
  try {
    const familyMember = await familyMemberModel.findById(req.query._id);

    if (!familyMember) {
      return res.status(404).json({ message: "Family member not found." });
    }

    const package = req.query.type;
    familyMember.package = package;

    await familyMember.save();

    return res.status(200).json({ familyMember });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const viewAvailableAppointmentsOfDoctor = async (req, res) => {
  const doctorId = req.query._id;
  try {
    const doctor = await doctorModel.findOne({ _id: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Get the available slots of the doctor
    const availableSlots = doctor.availableSlots || [];

    if (availableSlots.length === 0) {
      return res
        .status(404)
        .json({ message: "This doctor has no available slots." });
    }

    return res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const changePasswordForPatient = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const patientID = req.user.id;

  try {
    const patient = await patientModel.findById(patientID);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      patient.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(newPassword, salt);

    patient.password = hashedPass;
    await patient.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const changePasswordForPatientForget = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and newPassword are required." });
    }

    let patient = await patientModel.findOne({ email });
    let doctor = await doctorModel.findOne({ email });
    let admin = await administratorModel.findOne({ email });
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(newPassword, salt);
    if (patient) {
      patient.password = hashedPass;
      await patient.save();
      res.status(200).json({ message: "Password changed successfully." });
    }
    if (admin) {
      admin.password = hashedPass;
      await admin.save();
      res.status(200).json({ message: "Password changed successfully." });
    }
    if (doctor) {
      const salt = await bcrypt.genSalt();
      newPasswordHashed = await bcrypt.hash(newPassword, salt);
      doctor.password = newPasswordHashed;
      await doctor.save();
      res.status(200).json({ message: "Password changed successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const cancelHealthPackageFam = async (req, res) => {
  try {
    const familyMember = await familyMemberModel.findById(req.query._id);

    if (!familyMember) {
      return res.status(404).json({ message: "Family member not found." });
    }
    if (familyMember.package != "  ") {
      familyMember.package = "  ";
      await familyMember.save();
      return res.status(200).json({ familyMember });
    } else {
      return res
        .status(404)
        .json({ message: "You are not subscribed to this package!" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const viewSubscribedPackages = async (req, res) => {
  try {
    let patient = await patientModel.findById(req.user.id);
    const familyMembers = patient.familyMembers;

    if (patient.package !== " ") {
      patient = await patientModel
        .findById(req.user.id)
        .populate("packagesPatient");
    }
    const familyMemberDetails = await Promise.all(
      familyMembers.map(async ([familyMemberId, relationship]) => {
        try {
          const familyMember = await familyMemberModel.findById(familyMemberId);
          if (familyMember.package !== " ") {
            await familyMember.populate("packagesFamily");
          }
          return {
            familyMember,
          };
        } catch (familyMemberError) {
          console.error("Error fetching family member:", familyMemberError);
          return {
            error: `Error fetching details for family member with ID ${familyMemberId}`,
          };
        }
      })
    );

    return res.status(200).json({ patient, familyMemberDetails });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const cancelHealthPackage = async (req, res) => {
  let patient;
  let cancel;
  try {
    const famID = req.body.famID;
    if (famID) {
      patient = await patientModel.findById(famID);
      if (!patient) {
        patient = await familyMemberModel.findById(famID);
      }
    } else {
      patient = await patientModel.findById(req.user.id);
    }
    if (!patient) {
      return res.status(404).json({ message: "User not found." });
    }
    // console.log("khara patient" + patient);

    if (patient.package !== "  ") {
      console.log(patient.package);
      cancel = await packagesModel.findById(patient.package);
      cancel.status = "Cancelled";
      const date = new Date().toLocaleDateString();
      cancel.endDate = date;
      await cancel.save();
      patient.canceledHealthPackage.push(patient.package);
      patient.package = "  ";
      await patient.save();
      return res.status(200).json({ patient });
    } else {
      return res
        .status(404)
        .json({ message: "You are not subscribed to this package!" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const addAppointmentForMyselfOrFam = async (req, res) => {
  let patientID = req.user.id;
  const { famID, doctorID, date, description, time } = req.body;

  let notificationDoc;
  let notificationPatient;

  try {
    const doctor = await doctorModel.findById(doctorID);
    const docName = doctor.name;
    const doctorAvailableSlots = doctor.availableSlots;

    let isAvailableSlot = false;
    let slot2;
    for (const slot of doctorAvailableSlots) {
      const [dateS, timeS] = slot.split(" ");
      if (dateS === date && timeS === time) {
        slot2 = slot;
        isAvailableSlot = true;
        break;
      }
    }

    if (!isAvailableSlot) {
      return res
        .status(400)
        .json({ message: "Appointment date is not available." });
    }

    // If the date is available, remove it from the doctor's available slots
    doctor.availableSlots = doctorAvailableSlots.filter((slot) => {
      return slot !== slot2;
    });

    // Create the appointment and update the doctor's appointments
    if (famID) {
      const family1 = await familyMemberModel.findById(famID);
      const familyName = family1.name;
      if (family1.patientRef) {
        patientID = family1.patientRef;
        const linkedP = await patientModel.findById(patientID);
        const linkedPName = linkedP.name;
        notificationPatient =
          "An appointment with Dr. " +
          docName +
          " has been scheduled on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time;
        linkedP.notifications.push(notificationPatient);
        linkedP.newNotifications = true;
        await linkedP.save();
        await notificationByMail(
          linkedP.email,
          "An appointment with Dr. " +
            doctor.name +
            " on " +
            date.split("-").reverse().join("/") +
            " at " +
            time +
            " has been reserved",
          "Appointment Reserved"
        );
        notificationDoc =
          "An appointment with " +
          linkedPName +
          " has been scheduled on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time;
        doctor.notifications.push(notificationDoc);
        doctor.newNotifications = true;
        await doctor.save();
        await notificationByMail(
          doctor.email,
          "An appointment with " +
            linkedPName +
            " on " +
            date.split("-").reverse().join("/") +
            " at " +
            time +
            " has been reserved",
          "New Appointment"
        );
      } else {
        patientID = famID;
        const parent = await patientModel.findById(req.user.id);
        notificationPatient =
          "An appointment with Dr. " +
          docName +
          " for " +
          familyName +
          " has been scheduled on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time;
        parent.notifications.push(notificationPatient);
        parent.newNotifications = true;
        await parent.save();
        await notificationByMail(
          parent.email,
          "An appointment with Dr. " +
            doctor.name +
            " on " +
            date.split("-").reverse().join("/") +
            " at " +
            time +
            " has been reserved",
          "Appointment Reserved"
        );

        notificationDoc =
          "An appointment with " +
          familyName +
          " has been scheduled on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time;
        doctor.notifications.push(notificationDoc);
        doctor.newNotifications = true;
        await doctor.save();
        await notificationByMail(
          doctor.email,
          "An appointment with " +
            familyName +
            " on " +
            date.split("-").reverse().join("/") +
            " at " +
            time +
            " has been reserved",
          "New Appointment"
        );
      }
    } else {
      const patient = await patientModel.findById(req.user.id);
      const pName = patient.name;
      notificationPatient =
        "An appointment with Dr. " +
        docName +
        " has been scheduled on " +
        date.split("-").reverse().join("/") +
        " at : " +
        time;
      patient.notifications.push(notificationPatient);
      patient.newNotifications = true;
      await patient.save();
      await notificationByMail(
        patient.email,
        "An appointment with Dr. " +
          doctor.name +
          " on " +
          date.split("-").reverse().join("/") +
          " at " +
          time +
          " has been reserved",
        "Appointment Reserved"
      );

      notificationDoc =
        "An appointment with " +
        pName +
        " has been scheduled on " +
        date.split("-").reverse().join("/") +
        " at : " +
        time;
      doctor.notifications.push(notificationDoc);
      doctor.newNotifications = true;
      await doctor.save();
      await notificationByMail(
        doctor.email,
        "An appointment with " +
          pName +
          " on " +
          date.split("-").reverse().join("/") +
          " at " +
          time +
          " has been reserved",
        "New Appointment"
      );
    }
    const status = "Upcoming";

    const appointment = await appointmentModel.create({
      date,
      description,
      patientID,
      doctorID,
      status,
      time,
      parentID: req.user.id,
    });
    let patient;
    patient = await patientModel.findById(patientID);
    if (!patient) {
      patient = await familyMemberModel.findById(famID);
    }
    if (!famID) {
      if (!doctor.patients.includes(patient._id)) {
        doctor.patients.push(patient._id);
      }
    } else {
      if (!doctor.patients.includes(famID)) {
        doctor.patients.push(famID);
      }
    }
    await doctor.save();
    const sessionPrice = await calculateSessionPrice(
      doctor.hourlyRate,
      patient.package
    );
    doctor.wallet += sessionPrice;
    await doctor.save();

    res
      .status(201)
      .json({ message: "Appointment added successfully.", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const viewWalletPatient = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);
    const wallet = patient.wallet;
    res.status(200).json(wallet);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const subscribeHealthPackageWallet = async (req, res) => {
  try {
    const id = req.body._id;
    let patient;
    const mainPatient = await patientModel.findById(req.user.id);

    if (!id) {
      patient = await patientModel.findById(req.user.id);
    } else {
      patient = await patientModel.findById(id);
      if (!patient) {
        patient = await familyMemberModel.findById(id);
      }
    }

    if (!patient) {
      return res.status(404).json({ message: "User not found." });
    }

    const packageName = req.query.type;
    if (patient.package !== "  ") {
      const patientPackage = await packagesModel.findOne({
        _id: patient.package,
      });
      if (patientPackage.type.includes(packageName)) {
        return res
          .status(404)
          .json({ message: "You are already subscribed to this package." });
      }
    }

    const originalPackage = await packagesModel.findOne({ type: packageName });
    const newType = packageName + " " + patient.username;

    let newPackage;
    let patientID = patient._id;
    if (id) {
      const family1 = await familyMemberModel.findById(id);
      if (family1.patientRef) {
        patientID = family1.patientRef;
      } else {
        patientID = id;
      }
    }

    if (mainPatient.wallet >= originalPackage.price) {
      newPackage = await packagesModel.create({
        type: newType,
        price: originalPackage.price,
        sessionDiscount: originalPackage.sessionDiscount,
        medicineDiscount: originalPackage.medicineDiscount,
        packageDiscountFM: originalPackage.packageDiscountFM,
        status: "Subscribed",
        renewalDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toLocaleDateString(),
        endDate: originalPackage.endDate,
        patientID,
      });
    }

    if (!newPackage) {
      return res.status(500).json({ message: "Insufficient funds" });
    }
    patient.package = newPackage._id;
    await patient.save();

    // Deduct package price from patient's wallet
    mainPatient.wallet = mainPatient.wallet - newPackage.price;

    await mainPatient.save();

    return res.status(200).json({
      originalPackage: originalPackage,
      wallet: mainPatient.wallet,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const payAppointmentWallet = async (req, res) => {
  let patientID = req.user.id; // Use let to make it reassignable

  const { famID, doctorID, date, description, time } = req.body;

  try {
    const doctor = await doctorModel.findById(doctorID);

    const patient = await patientModel.findById(req.user.id);
    const doctorAvailableSlots = doctor.availableSlots;

    // Check if the appointment date matches any of the doctor's available slots
    let isAvailableSlot = false;
    let slot2;
    for (const slot of doctorAvailableSlots) {
      const [dateS, timeS] = slot.split(" ");
      if (dateS === date && timeS === time) {
        slot2 = slot;
        isAvailableSlot = true;
        break;
      }
    }

    if (!isAvailableSlot) {
      return res
        .status(400)
        .json({ message: "Appointment date is not available." });
    }

    // If the date is available, remove it from the doctor's available slots
    doctor.availableSlots = doctorAvailableSlots.filter((slot) => {
      return slot !== slot2;
    });

    // Create the appointment and update the doctor's appointments
    if (famID) {
      const family1 = await familyMemberModel.findById(famID);
      const familyName = family1.name;
      if (family1.patientRef) {
        patientID = family1.patientRef;
        const linkedP = await patientModel.findById(patientID);
        const linkedPName = linkedP.name;
        notificationPatient =
          "An appointment with Dr. " +
          docName +
          " has been scheduled on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time;
        linkedP.notifications.push(notificationPatient);
        linkedP.newNotifications = true;
        await linkedP.save();
        await notificationByMail(
          linkedP.email,
          "An appointment with Dr. " +
            doctor.name +
            " on " +
            date.split("-").reverse().join("/") +
            " at " +
            time +
            " has been reserved",
          "Appointment Reserved"
        );
        notificationDoc =
          "An appointment with " +
          linkedPName +
          " has been scheduled on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time;
        doctor.notifications.push(notificationDoc);
        doctor.newNotifications = true;
        await doctor.save();
        await notificationByMail(
          doctor.email,
          "An appointment with " +
            linkedPName +
            " on " +
            date.split("-").reverse().join("/") +
            " at " +
            time +
            " has been reserved",
          "New Appointment"
        );
      } else {
        patientID = famID;
        const parent = await patientModel.findById(req.user.id);
        notificationPatient =
          "An appointment with Dr. " +
          doctor.name +
          " for " +
          familyName +
          " has been scheduled on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time;
        parent.notifications.push(notificationPatient);
        parent.newNotifications = true;
        await parent.save();
        await notificationByMail(
          parent.email,
          "An appointment with Dr. " +
            doctor.name +
            " on " +
            date.split("-").reverse().join("/") +
            " at " +
            time +
            " has been reserved",
          "Appointment Reserved"
        );

        notificationDoc =
          "An appointment with " +
          familyName +
          " has been scheduled on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time;
        doctor.notifications.push(notificationDoc);
        doctor.newNotifications = true;
        await doctor.save();
        /////////////mail
        await notificationByMail(
          doctor.email,
          "An appointment with " +
            familyName +
            " on " +
            date.split("-").reverse().join("/") +
            " at " +
            time +
            " has been reserved",
          "New Appointment"
        );
      }
    } else {
      const patient = await patientModel.findById(req.user.id);
      const pName = patient.name;
      notificationPatient =
        "An appointment with Dr. " +
        doctor.name +
        " has been scheduled on " +
        date.split("-").reverse().join("/") +
        " at : " +
        time;
      patient.notifications.push(notificationPatient);
      patient.newNotifications = true;
      await patient.save();

      await notificationByMail(
        patient.email,
        "An appointment with Dr. " +
          doctor.name +
          " on " +
          date.split("-").reverse().join("/") +
          " at " +
          time +
          " has been reserved",
        "Appointment Reserved"
      );

      notificationDoc =
        "An appointment with " +
        pName +
        " has been scheduled on " +
        date.split("-").reverse().join("/") +
        " at : " +
        time;
      doctor.notifications.push(notificationDoc);
      doctor.newNotifications = true;
      await doctor.save();

      await notificationByMail(
        doctor.email,
        "An appointment with " +
          pName +
          " on " +
          date.split("-").reverse().join("/") +
          " at " +
          time +
          " has been reserved",
        "New Appointment"
      );
    }
    const status = "Upcoming";
    const appointment = await appointmentModel.create({
      date,
      description,
      patientID,
      doctorID,
      status,
      time,
    });
    await appointment.save();
    if (!famID) {
      if (!doctor.patients.includes(patient._id)) {
        doctor.patients.push(patient._id);
      }
    } else {
      if (!doctor.patients.includes(famID)) {
        doctor.patients.push(famID);
      }
    }

    await doctor.save();

    const sessionPrice = await calculateSessionPrice(
      doctor.hourlyRate,
      patient.package
    );

    let docWallet;
    let patientWallet;

    if (patient.wallet >= sessionPrice) {
      patientWallet = patient.wallet - sessionPrice;
      patient.wallet = patientWallet;
      await patient.save();
      docWallet = doctor.wallet + sessionPrice;
      doctor.wallet = docWallet;
      await doctor.save();
      return res.status(200).json({ appointment });
    } else {
      return res.status(404).json({
        message: "Your funds are insufficient",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const payAppointmentStripe = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    const doctor = await doctorModel.findById(req.body.doctorID);
    const sessionPrice = await calculateSessionPrice(
      doctor.hourlyRate,
      patient.package
    );
    const amountInCents = Math.round(sessionPrice * 100);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: doctor.name, // Use 'name' instead of 'docName'
              description: doctor.specialty, // Use 'description' instead of 'specialty'
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.SERVER_URL}/patient/app-success`,
      cancel_url: `${process.env.SERVER_URL}/patient/fail`,
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const handlePackageStripe = async (req, res) => {
  try {
    const id = req.body._id;
    let patient;

    if (!id) {
      patient = await patientModel.findById(req.user.id);
    } else {
      patient = await patientModel.findById(id);
      if (!patient) {
        patient = await familyMemberModel.findById(id);
      }
    }

    if (!patient) {
      return res.status(404).json({ message: "User not found." });
    }

    const packageName = req.query.type;

    const originalPackage = await packagesModel.findOne({ type: packageName });
    const newType = packageName + " " + patient.name;

    let patientID = patient._id;
    if (id) {
      const family1 = await familyMemberModel.findById(id);
      if (family1.patientRef) {
        patientID = family1.patientRef;
      } else {
        patientID = id;
      }
    }

    const newPackage = await packagesModel.create({
      type: newType,
      price: originalPackage.price,
      sessionDiscount: originalPackage.sessionDiscount,
      medicineDiscount: originalPackage.medicineDiscount,
      packageDiscountFM: originalPackage.packageDiscountFM,
      status: "Subscribed",
      renewalDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toLocaleDateString(),
      endDate: originalPackage.endDate,
      patientID,
    });

    if (!newPackage) {
      console.error("Error creating the package");
      return res.status(500).json({ message: "Error creating the package" });
    }
    patient.package = newPackage._id;
    await patient.save();
    if (patient.package !== "  ") {
      await patient.populate({
        path: "packagesPatient",
        options: { strictPopulate: false },
      });
    }
    return res.status(200).json({ patient });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const handleAppointmentStripe = async (req, res) => {
  try {
    let patient;
    const id = req.body.famID;
    if (!id) {
      patient = await patientModel.findById(req.user.id);
    } else {
      patient = await patientModel.findById(id);
      if (!patient) {
        patient = await familyMemberModel.findById(id);
      }
    }
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    const appointment = await appointmentModel.findById(req.body._id);
    const doctor = await doctorModel.findById(appointment.doctorID);
    const sessionPrice = await calculateSessionPrice(
      doctor.hourlyRate,
      patient.package
    );
    let docWallet;
    docWallet = doctor.wallet + sessionPrice;
    doctor.wallet = docWallet;
    await doctor.save();
    return res.status(200).json({ patient });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const viewPrescriptionDetails = async (req, res) => {
  try {
    const prescriptionId = req.body;
    const prescription = await prescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: "No prescription found." });
    }
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const cancelAppointmentPatient = async (req, res) => {
  try {
    let patient;
    let notificationDoc;
    let notification;
    patient = await patientModel.findById(req.user.id);
    const appId = req.body.id;
    const appointment = await appointmentModel.findById(appId);
    if (!appointment) {
      return res.status(404).json({ message: "No appointment found." });
    }
    const doctor = await doctorModel.findById(appointment.doctorID);
    const docName = doctor.name;
    const date = appointment.date;
    const time = appointment.time;
    const dateTimeString = `${date}T${time}:00.000Z`;
    const inputDate = new Date(dateTimeString);
    const currentDate = new Date();
    const timeDifference = inputDate - currentDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    let package;
    if (req.user.id === appointment.patientID) {
      package = patient.package;
    } else {
      const famMem = await familyMemberModel.findById(appointment.patientID);
      if (famMem && !famMem.patientRef) {
        package = famMem.package;
      } else {
        const linkedP = await patientModel.findById(famMem.patientRef);
        package = linkedP.package;
      }
    }
    const sessionPrice = await calculateSessionPrice(
      doctor.hourlyRate,
      package
    );
    if (hoursDifference > 24) {
      doctor.wallet -= sessionPrice;
      await doctor.save();
      patient.wallet += sessionPrice;
      await patient.save();
    }
    appointment.status = "Cancelled";
    await appointment.save();

    const id = appointment.patientID;
    patient = await patientModel.findById(id);
    if (patient) {
      notification =
        "The appointment with Dr. " + docName + " has been cancelled";
      patient.notifications.push(notification);
      patient.newNotifications = true;
      await patient.save();
      await notificationByMail(
        patient.email,
        notification,
        "Appointment Cancelled"
      );
      notificationDoc =
        "The appointment with " + patient.name + " has been cancelled";
      doctor.notifications.push(notificationDoc);
      doctor.newNotifications = true;
      await doctor.save();
      await notificationByMail(
        doctor.email,
        notificationDoc,
        "Appointment Cancelled"
      );
    } else {
      const familyMem = await familyMemberModel.findById(appointment.patientID);
      if (familyMem) {
        const parent = await patientModel.findById(req.user.id);
        notification =
          "The appointment with Dr. " +
          doctor.name +
          " for " +
          familyMem.name +
          " has been cancelled ";
        parent.notifications.push(notification);
        parent.newNotifications = true;
        await parent.save();
        await notificationByMail(
          parent.email,
          notification,
          "Appointment Cancelled"
        );
        notificationDoc =
          "An appointment with " + familyMem.name + " has been cancelled";
        doctor.notifications.push(notificationDoc);
        doctor.newNotifications = true;
        await doctor.save();
        await notificationByMail(
          doctor.email,
          notificationDoc,
          "Appointment Cancelled"
        );
      }
      if (familyMem && familyMem.patientRef) {
        const linkedP = await patientModel.findById(familyMem.patientRef);
        notification =
          "Your appointment with Dr. " + doctor.name + " has been cancelled ";
        linkedP.notifications.push(notification);
        linkedP.newNotifications = true;
        await linkedP.save();
        await notificationByMail(
          linkedP.email,
          notification,
          "Appointment Cancelled"
        );
      }
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const reqFollowUpForMyselfOrFam = async (req, res) => {
  try {
    const { date, time, appId } = req.body;
    const appointment = await appointmentModel.findById(appId);
    let name;

    if (!appointment) {
      res.status(401).json("Appointment not found");
    }
    const doctor = await doctorModel.findById(appointment.doctorID);
    const patient = await patientModel.findById(appointment.patientID);
    if (patient) {
      name = patient.name;
    } else {
      famMem = await familyMemberModel.findById(appointment.patientID);
      name = famMem.name;
    }
    const followUp = await followUpModel.create({
      date,
      description: appointment.description,
      patientID: appointment.patientID,
      doctorID: appointment.doctorID,
      status: "Upcoming",
      time,
      doctorName: doctor.name,
      patientName: name,
    });
    doctor.followUps.push(followUp);
    await doctor.save();
    res.status(200).json(followUp);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const rescheduleAppForMyselfOrFam = async (req, res) => {
  try {
    let notification;
    let notificationDoc;
    let patient;
    const appId = req.body.appId;
    const date = req.body.date;
    const time = req.body.time;
    const appointment = await appointmentModel.findById(appId);
    const doctor = await doctorModel.findById(appointment.doctorID);
    appointment.date = date;
    appointment.time = time;
    appointment.status = "Upcoming";
    await appointment.save();
    patient = await patientModel.findById(req.body.id);

    const id = appointment.patientID;
    patient = await patientModel.findById(id);

    if (patient) {
      notification =
        "The appointment with Dr. " +
        doctor.name +
        " has been rescheduled to be on " +
        date.split("-").reverse().join("/") +
        " at : " +
        time;
      patient.notifications.push(notification);
      patient.newNotifications = true;
      await patient.save();
      await notificationByMail(
        patient.email,
        "An appointment with Dr. " +
          doctor.name +
          " has been rescheduled to be on " +
          date.split("-").reverse().join("/") +
          " at : " +
          time,
        "Appointment Rescheduled"
      );

      notificationDoc =
        "An appointment with " +
        patient.name +
        " has been rescheduled to be on " +
        date.split("-").reverse().join("/") +
        " at: " +
        time;
      doctor.notifications.push(notificationDoc);
      doctor.newNotifications = true;
      await doctor.save();
      await notificationByMail(
        doctor.email,
        "An appointment with " +
          patient.name +
          " has been rescheduled to be on " +
          date.split("-").reverse().join("/") +
          " at: " +
          time,
        "Appointment Rescheduled"
      );
    } else {
      const familyMem = await familyMemberModel.findById(appointment.patientID);
      if (familyMem) {
        const parent = await patientModel.findById(req.user.id);
        notification =
          "The appointment with Dr. " +
          doctor.name +
          " for " +
          familyMem.name +
          " has been rescheduled to be on " +
          date.split("-").reverse().join("/") +
          " at: " +
          time;
        parent.notifications.push(notification);
        parent.newNotifications = true;
        await parent.save();
        await notificationByMail(
          parent.email,
          "The appointment with Dr. " +
            doctor.name +
            " for " +
            familyMem.name +
            " has been rescheduled to be on " +
            date.split("-").reverse().join("/") +
            " at: " +
            time,
          "Appointment Rescheduled"
        );

        notificationDoc =
          "An appointment with " +
          familyMem.name +
          " has been rescheduled to be on " +
          date.split("-").reverse().join("/") +
          " at: " +
          time;
        doctor.notifications.push(notificationDoc);
        doctor.newNotifications = true;
        await doctor.save();
        await notificationByMail(
          doctor.email,
          notificationDoc,
          "Appointment Rescheduled"
        );
      }
      if (familyMem && familyMem.patientRef) {
        const linkedP = await patientModel.findById(familyMem.patientRef);
        notification =
          "Your appointment with Dr. " +
          doctor.name +
          " has been rescheduled to be on " +
          date.split("-").reverse().join("/") +
          " at: " +
          time;
        linkedP.notifications.push(notification);
        linkedP.newNotifications = true;
        await linkedP.save();
        await notificationByMail(
          linkedP.email,
          notification,
          "Appointment Rescheduled"
        );
      }
    }

    const doctorAvailableSlots = doctor.availableSlots;

    let isAvailableSlot = false;
    let slot2;
    for (const slot of doctorAvailableSlots) {
      const [dateS, timeS] = slot.split(" ");
      if (dateS === date && timeS === time) {
        slot2 = slot;
        isAvailableSlot = true;
        break;
      }
    }

    if (!isAvailableSlot) {
      return res
        .status(400)
        .json({ message: "Appointment date is not available." });
    }

    // If the date is available, remove it from the doctor's available slots
    doctor.availableSlots = doctorAvailableSlots.filter((slot) => {
      return slot !== slot2;
    });

    await doctor.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const nodemailer = require("nodemailer");
const emailService = "sarahhtawfik@outlook.com";
const emailUser = "sarahhtawfik@outlook.com";
const emailPassword = "Sarsoura2001";
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});
const notificationByMail = async (email, message, title) => {
  try {
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: title,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }

  // Introduce a delay between emails (adjust the duration as needed)
  await new Promise((resolve) => setTimeout(resolve, 3000));
};

const calculatePrescriptionPrice = async (prescription) => {
  try {
    const medicines = prescription.medicine;
    let totalPrice = 0;
    for (const medicineItem of medicines) {
      const medicine = await medicineModel.findOne({ name: medicineItem[0] });
      if (medicine) {
        totalPrice += medicine.price;
      }
    }
    return totalPrice;
  } catch (error) {
    // Handle any errors that occur during database query
    throw error;
  }
};

const payPrescriptionStripe = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    const prescription = await prescriptionModel.findOne({ _id: req.body.id });
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }
    const price = await calculatePrescriptionPrice(prescription);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "prescription" },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.SERVER_URL}/patient/prescreption-success`,
      cancel_url: `${process.env.SERVER_URL}/patient/fail`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const payPrescriptionWallet = async (req, res) => {
  try {
    const presId = req.body.id;
    const prescription = await prescriptionModel.findById(presId);
    if (!prescription) {
      return res.status(404).json({ message: "prescreption not found" });
    }
    const price = await calculatePrescriptionPrice(prescription);
    const patient = await patientModel.findById(req.user.id);
    if (patient.wallet < price) {
      return res.status(404).json({ message: "Insufficient funds in wallet." });
    }
    patient.wallet -= price;
    await patient.save();
    const prescreptions = patient.prescreptions;

    for (const prescreptionP of prescreptions) {
      console.log(prescreptionP._id + "  " + presId);
      if (prescreptionP._id == presId) {
        console.log("Inside the if statement");
        prescreptionP.status = "Filled";
        patient.markModified("prescreptions");
        await patient.save();
        console.log("Patient saved successfully");
      }
    }

    prescription.status = "Filled";
    await prescription.save();
    createOrderFromPrescription(prescription, "Wallet");
    await patient.save();

    return res.status(200).json(patient);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const handlePrescreptionStripe = async (req, res) => {
  try {
    const presId = req.body.id;
    const prescription = await prescriptionModel.findById(presId);
    if (!prescription) {
      return res.status(404).json({ message: "prescreption not found" });
    }
    prescription.status = "Filled";
    await prescription.save();
    const patient = await patientModel.findById(prescription.patientID);
    const prescreptions = patient.prescreptions;
    for (const prescreptionP of prescreptions) {
      if (prescreptionP._id == presId) {
        console.log("Inside the if statement");
        prescreptionP.status = "Filled";
        patient.markModified("prescreptions");
        await patient.save();
      }
    }

    await patient.save();
    createOrderFromPrescription(prescription, "Card");
    return res.status(200).json(prescription);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const notifyPharmacistsOutOfStock = async (medicine) => {
  try {
    const pharmacists = await ph.find();
    const mailOptions = {
      from: emailUser,
      to: pharmacists.map((pharmacist) => pharmacist.email).join(","),
      subject: "Medicine out of stock",
      text: `Please note that ${medicine} medicine is out of stock.`,
    };

    pharmacists.map((pharmacist) => {
      pharmacist.notifications.push(
        `Please note that ${medicine} medicine is out of stock.`
      );
      pharmacist.newNotification = true;
      pharmacist.save();
    });

    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.log(error.message);
  }
};
const createOrderFromPrescription = async (prescription, paymentMethod) => {
  try {
    let items = [];

    let medicineArr = prescription.medicine;
    let total = 0;
    const date = new Date();

    for (let i = 0; i < medicineArr.length; i++) {
      let medicine = await medicineModel.findOne({ name: medicineArr[i][0] });
      let item = {
        medicine: medicine._id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
      };
      items.push(item);
      total += medicine.price;
      medicine.sales += 1;
      medicine.quantity -= 1;
      medicine.salesData.push({
        quantity: item.quantity,
        date: date,
      });
      await medicine.save();

      if (medicine.quantity == 0) {
        //notify pharmacist that medicine is out of stock
        notifyPharmacistsOutOfStock(medicine.name);
      }
    }

    const count = await Order.countDocuments({
      patient: prescription.patientID,
    });
    const orderNumber = count + 1;

    //get delivery address
    const patient = await patientModel.findById(prescription.patientID);
    let address = "6 Ave, villa 3";
    if (patient.addresses.length > 0) address = patient.addresses[0];

    const orderData = {
      number: orderNumber,
      date: date,
      items: items,
      totalPrice: total + 50,
      status: "Pending",
      patient: prescription.patientID,
      address: address,
      paymentMethod: paymentMethod,
    };
    const order = await Order.create(orderData);
    //await order.save();
  } catch (error) {
    throw new Error("Failed to create the order : " + error.message);
  }
};
module.exports = {
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
  changePasswordForPatient,
  cancelHealthPackage,
  cancelHealthPackageFam,
  viewSubscribedPackages,
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
};
