const patientModel = require("../Models/Patient.js");
const { default: mongoose } = require("mongoose");
const doctorModel = require("../Models/Doctor.js");
const familyMemberModel = require("../Models/FamilyMember.js");
const packagesModel = require("../Models/Packages.js");
const prescriptionModel = require("../Models/Prescription.js");
const appointmentModel = require("../Models/Appointment.js");
const { updateUserInfoInCookie } = require("./authorization.js");

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
  const { name, specialty } = req.body;

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
  console.log(specialties);

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
    console.log(doctors);

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
    console.log(appointments);

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

    // const prescriptions = patient.prescriptions;

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
      console.log(status);
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
  const patientID = req.user.id;

  try {
    const patient = await patientModel.findOne({ _id: patientID });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const familyMembers = await familyMemberModel.find({
      patientID: patientID,
    });

    if (!familyMembers || familyMembers.length === 0) {
      return res.status(404).json({ message: "No family members found." });
    }

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

    // Create the new family member
    const newFamilyMember = await familyMemberModel.create({
      name,
      nationalID,
      age,
      gender,
      relationToPatient,
      patientID: patient.id, // Use patient's ID
    });

    // Update the patient's familyMembers array
    patient.familyMembers = patient.familyMembers || [];
    patient.familyMembers.push([newFamilyMember._id, newFamilyMember.name]);

    // Save the updated patient document
    await patient.save();

    console.log("Family member Created and added to the patient's familyMembers array!");
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

  try {
    let familyMember = await patientModel.findOne({ email });

    if (!familyMember) {
      familyMember = await patientModel.findOne({ phoneNumber });
    }

    if (!familyMember) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const { name, nationalID, gender, age } = familyMember;

    const fam = await familyMemberModel.create({
      name,
      nationalID,
      age,
      gender,
      relationToPatient,
      patientID: req.user.id, // Assuming patientModel has an _id field
    });
    patient.familyMembers = patient.familyMembers || [];
    patient.familyMembers.push([fam._id, name]);
    await patient.save();

    console.log("Family member added!");
    res.status(200).json(fam);
  } catch (error) {
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
    const packageInfo = await packagesModel.findOne({ type: patientPackage });
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

const dummyDoctorsSession = [
  {
    username: "drjohnsmith",
    name: "John Smith",
    email: "john.smith@example.com",
    password: "password123",
    dateOfBirth: "1980-05-15",
    hourlyRate: 150,
    sessionPrice: 150,
    appointments: [],
    affiliation: "City Hospital",
    educationalBackground: "M.D. from University of Medical Sciences",
    patients: [],
    specialty: "Cardiology",
    photoLink:
      "https://media.licdn.com/dms/image/C4E03AQFg161EE_9n0Q/profile-displayphoto-shrink_800_800/0/1540403513741?e=2147483647&v=beta&t=zODGGNsdmZ03iwtSrHJEMR_Qxd_NkEQueFjKfd9JrOE",
  },
  {
    username: "dremljohnson",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    password: "password456",
    dateOfBirth: "1975-08-22",
    hourlyRate: 120,
    sessionPrice: 120,
    appointments: [],
    affiliation: "Community Clinic",
    educationalBackground: "M.D. from Medical University",
    patients: [],
    specialty: "Orthopedics",
    photoLink:
      "https://media.licdn.com/dms/image/C4E03AQHJ_sJIJWxHpw/profile-displayphoto-shrink_800_800/0/1529980129766?e=2147483647&v=beta&t=yH7Pz2hfrso5nXNCFilmjOnvL7OVcLML5vOsvA7nWDM",
  },
  {
    username: "drmichaelbrown",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    password: "password789",
    dateOfBirth: "1983-03-10",
    hourlyRate: 170,
    sessionPrice: 170,
    appointments: [],
    affiliation: "General Hospital",
    educationalBackground: "M.D. from Health Sciences Institute",
    patients: [],
    specialty: "Neurology",
    photoLink:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAi46IZubvG3_2P4upQgk2zqAqzySmQ7Yx8qmgUOuWdnth2Yoy7BXbSxHTEqpD8_11aeI&usqp=CAU",
  },
  {
    username: "drsarahwilson",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    password: "password101",
    dateOfBirth: "1978-11-28",
    hourlyRate: 140,
    sessionPrice: 140,
    appointments: [],
    affiliation: "Medical Center",
    educationalBackground: "M.D. from Wellness University",
    patients: [],
    specialty: "Oncology",
    photoLink:
      "https://media.licdn.com/dms/image/C4D03AQF3MdVSGuXrDw/profile-displayphoto-shrink_800_800/0/1525397028366?e=2147483647&v=beta&t=Ai6blaPhh7JFpMGwn1ltvfk40FHEupx1txBM6Qda7AY",
  },
  {
    username: "drdavidlee",
    name: "David Lee",
    email: "david.lee@example.com",
    password: "password202",
    dateOfBirth: "1985-09-03",
    hourlyRate: 160,
    sessionPrice: 160,
    appointments: [],
    affiliation: "Health Clinic",
    educationalBackground: "M.D. from Healing Institute",
    patients: [],
    appointments: [],
    specialty: "Neurology",
    photoLink:
      "https://www.woodlandshospital.in/images/doctor-img/ravi-kant-saraogi.jpg",
  },
  {
    username: "drlisamiller",
    name: "Lisa Miller",
    email: "lisa.miller@example.com",
    password: "password303",
    dateOfBirth: "1973-12-18",
    hourlyRate: 180,
    sessionPrice: 180,
    appointments: [],
    affiliation: "Community Hospital",
    educationalBackground: "M.D. from Medical Excellence College",
    patients: [],
    specialty: "Pediatrics",
    photoLink:
      "https://media.licdn.com/dms/image/D4D03AQGtRNtcH_1kFg/profile-displayphoto-shrink_400_400/0/1688449652391?e=1700697600&v=beta&t=XeEjFVmqBXMPwoCUZtqDLzw1_eA3FAICAT2APwaBHHM",
  },
  {
    username: "drkarendavis",
    name: "Karen Davis",
    email: "karen.davis@example.com",
    password: "password404",
    dateOfBirth: "1976-07-07",
    hourlyRate: 130,
    sessionPrice: 130,
    appointments: [],
    affiliation: "General Medical Center",
    educationalBackground: "M.D. from Health Sciences Academy",
    patients: [],
    specialty: "Oncology",
    photoLink:
      "https://images.drlogy.com/assets/uploads/img/user/home/health/Doctors.webp",
  },
];

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
    const allDoctors = dummyDoctorsSession.concat(doctorsWithSessionPrice);

    res.status(200).json({ allDoctors });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addAppointment = async (req, res) => {
  try {
    // Create a new appointment
    const appointment = await appointmentModel.create(req.body);

    res
      .status(201)
      .json({ message: "Appointment added successfully.", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Dummy data for 7 doctors with photo links
const dummyDoctors = [
  {
    name: "John Smith",
    specialty: "Cardiology",
    photoLink:
      "https://media.licdn.com/dms/image/C4E03AQFg161EE_9n0Q/profile-displayphoto-shrink_800_800/0/1540403513741?e=2147483647&v=beta&t=zODGGNsdmZ03iwtSrHJEMR_Qxd_NkEQueFjKfd9JrOE",
  },
  {
    name: "Emily Johnson",
    specialty: "Pediatrician",
    photoLink:
      "https://media.licdn.com/dms/image/C4E03AQHJ_sJIJWxHpw/profile-displayphoto-shrink_800_800/0/1529980129766?e=2147483647&v=beta&t=yH7Pz2hfrso5nXNCFilmjOnvL7OVcLML5vOsvA7nWDM",
  },
  {
    name: "Michael Brown",
    specialty: "Dermatologist",
    photoLink:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAi46IZubvG3_2P4upQgk2zqAqzySmQ7Yx8qmgUOuWdnth2Yoy7BXbSxHTEqpD8_11aeI&usqp=CAU",
  },
  {
    name: "Sarah Wilson",
    specialty: "Oncologist",
    photoLink:
      "https://media.licdn.com/dms/image/C4D03AQF3MdVSGuXrDw/profile-displayphoto-shrink_800_800/0/1525397028366?e=2147483647&v=beta&t=Ai6blaPhh7JFpMGwn1ltvfk40FHEupx1txBM6Qda7AY",
  },
  {
    name: "David Lee",
    specialty: "Neurologist",
    photoLink:
      "https://www.woodlandshospital.in/images/doctor-img/ravi-kant-saraogi.jpg",
  },
  {
    name: "Lisa Miller",
    specialty: "Orthopedic Surgeon",
    photoLink:
      "https://media.licdn.com/dms/image/D4D03AQGtRNtcH_1kFg/profile-displayphoto-shrink_400_400/0/1688449652391?e=1700697600&v=beta&t=XeEjFVmqBXMPwoCUZtqDLzw1_eA3FAICAT2APwaBHHM",
  },
  {
    name: "Karen Davis",
    specialty: "Psychiatrist",
    photoLink:
      "https://images.drlogy.com/assets/uploads/img/user/home/health/Doctors.webp",
  },
];

const viewAllDoctorsForPatients = async (req, res) => {
  try {
    // Query the database to get real doctors
    const realDoctors = await doctorModel.find({}, { name: 1, specialty: 1 });

    const allDoctors = dummyDoctors.concat(realDoctors);

    if (!allDoctors || allDoctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    res.status(200).json({ doctors: allDoctors });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const filterDoctorsAfterSearch = async (req, res) => {
  const doctors = req.body;
  const { date, time } = req.query;

  query = { date, time, status: "not filled" };
  try {
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
const viewAllAppointmentsPatient = async (req, res) => {
  try {
    const id = req.user.id;
    const appointments = await appointmentModel
      .find({ patientID: id })
      .populate("doctor");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const filterDoctorsAfterSearchDocName = async (req, res) => {
  const name = req.query.name;
  const { specialty, date, time } = req.query;
  const status = "free";

  query = { date, time, status };

  const doctorQuery = { specialty };
  if (name) {
    doctorQuery.name = name;
  }

  try {
    const doctors = await doctorModel.find();
    if (specialty) {
      doctors = await doctorModel.find(doctorQuery);
    }

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    await doctors.forEach(async (doctor) => {
      await doctor.getAppointments();
    });
    console.log(doctors);

    if (date && !time) {
      return res.status(405).json({ message: "Please enter time" });
    }
    if (!date && time) {
      return res.status(406).json({ message: "Please enter date" });
    }

    const appointments = await appointmentModel.find(query);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    const availableDoctors = doctors.filter((doctor) =>
      appointments.some(
        (appointment) =>
          appointment.doctorID.toString() === doctor._id.toString() &&
          (specialty
            ? doctor.specialty.toString() === specialty.toString()
            : true)
      )
    );

    const patientId = req.user.id; // Assuming _id is in the request body
    const patient = await patientModel.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const doctorsWithSessionPrice = await Promise.all(
      availableDoctors.map(async (doctor) => {
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
    // res.status(200).json(appointments);
  } catch (error) {
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

    return res.status(200).json({ message: "Family member removed successfully" });
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

    // Create an array to store health packages
    const healthPackages = [];

    // Add the patient's package to the result
    const patientWithPackage = {
      name: patient.name,
      package: patient.package,
    };
    healthPackages.push(patientWithPackage);

    // Add family members and their health packages to the result if they exist
    if (familyMembers.length > 0) {
      familyMembers.forEach((familyMember) => {
        healthPackages.push({
          name: familyMember.name,
          package: familyMember.package,
        });
      });
    }

    res.status(200).json({ healthPackages });
  } catch (error) {
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
const subscribeHealthPackage = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    const package = req.query.type;
    if (patient.package !== package) {
      patient.package = package;
      await patient.save();
      return res.status(200).json({ patient });
    } else {
      return res
        .status(404)
        .json({ message: "You are already subscribed to that package." });
    }
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
      return res.status(404).json({ message: "This doctor has no available slots." });
    }

    return res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


const changePasswordForPatient = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const patientID = req.body._id;

  try {
    const patient = await patientModel.findById(patientID);

    if (!patient) {
      return res.status(404).json({ message: "patient not found." });
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

    // Hash the new password and update it in the database
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    patient.password = hashedPassword;
    await patient.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const changePasswordForPatientForget = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const patient = await patientModel.find({email:email});

    if (!patient) {
      return res.status(404).json({ message: "email does not exist" });
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

    // Hash the new password and update it in the database
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    patient.password = hashedPassword;
    await patient.save();

    res.status(200).json({ message: "Password changed successfully." });
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

const viewSubscribedPackage = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);
    if (patient.package != "") {
      const package = patient.populate("packagesPatient");
    }
    return res.status(200).json({ package });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const viewSubscribedPackageFam = async (req, res) => {
  try {
    const familyMember = await familyMemberModel.findById(req.query._id);
    if (familyMember.package != "") {
      const package = familyMember.populate("packagesPatient");
    }
    return res.status(200).json({ package });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const cancelHealthPackage = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    if (patient.package != "  ") {
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
  let patientID = req.user.id; // Use let to make it reassignable
  const { famID, doctorID, date, description, time } = req.body;
  
  try {
    const doctor = await doctorModel.findById(doctorID);
    const doctorAvailableSlots = doctor.availableSlots;

    // Check if the appointment date matches any of the doctor's available slots
    let isAvailableSlot = false;
    let slot2;
    for (const slot of doctorAvailableSlots) {
      const [dateS, timeS] = slot.split(" ");
      if (dateS === date && timeS === time) {
        slot2 = slot;
        isAvailableSlot = true;
        break; // Exiting the loop when a matching slot is found
      }
    }
    
    if (!isAvailableSlot) {
      return res.status(400).json({ message: "Appointment date is not available." });
    }

    // If the date is available, remove it from the doctor's available slots
    doctor.availableSlots = doctorAvailableSlots.filter(slot => {
      return slot !== slot2;
    });

    // Create the appointment and update the doctor's appointments
    if (famID) {
      patientID = famID;
    }
const status='upcoming'
    const appointment = await appointmentModel.create({
      date,
      description,
      patientID,
      doctorID,
      status,
      time,
    });

    await doctor.save();

    res.status(201).json({ message: "Appointment added successfully.", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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
  subscribeHealthPackage,
  subscribeHealthPackageFam,
  viewAvailableAppointmentsOfDoctor,
  changePasswordForPatient,
  cancelHealthPackage,
  cancelHealthPackageFam,
  viewSubscribedPackage,
  viewSubscribedPackageFam,
  addFamilyMemberExisting,
  addAppointmentForMyselfOrFam,
  changePasswordForPatientForget
};
