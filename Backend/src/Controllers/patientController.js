const patientModel = require("../Models/Patient.js");
const { default: mongoose } = require("mongoose");
const doctorModel = require("../Models/Doctor.js");
const familyMemberModel = require("../Models/FamilyMember.js");
const packagesModel = require("../Models/Packages.js");
const prescriptionModel = require("../Models/Prescription.js");
const appointmentModel = require("../Models/Appointment.js");

const doctorDetails = async (req, res) => {
  const { name } = req.body;

  try {
    const doctor = await doctorModel.findOne({ name });
    const affiliation = doctor.affiliation;
    const educationalBackground = doctor.educationalBackground;
    const speciality = doctor.speciality;
    const output = { name, affiliation, educationalBackground, speciality };

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    return res.status(200).json({ output });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const searchDoctors = async (req, res) => {
  const { name, speciality } = req.body;

  try {
    let query = {};

    // Use regex for partial name search
    if (name) {
      const nameRegex = new RegExp(name, "i");
      query.name = { $regex: nameRegex };
    }

    if (speciality) {
      query.speciality = speciality;
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
    //  const doctorTrial = await doctorModel.find({speciality: "Neurology"});
    //  console.log(doctorTrial);

    const doctors = await doctorModel.find({
      speciality: { $in: specialties },
    });
    console.log(doctors);

    //const doctors = await doctorModel.find({ speciality: speciality });

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
          doctor.speciality.toString() === speciality.toString()
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
    const patientID = req.body._id;

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
    const id = req.body._id;

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
    const patientID = req.body.patientID;

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
  const patientID = req.body._id;

  try {
    const patient = await patientModel.findOne({ _id: patientID });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const familyMembers = await familyMemberModel.find({ patientID });

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
  const id = req.body.patientID;

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
    const newFamilyMember = await familyMemberModel.create(req.body);
    console.log("Family member Created!");
    res.status(200).send(newFamilyMember);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
const viewPackages = async (req, res) => {
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
    speciality: "Cardiology",
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
    speciality: "Orthopedics",
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
    speciality: "Neurology",
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
    speciality: "Oncology",
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
    speciality: "Neurology",
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
    speciality: "Pediatrics",
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
    speciality: "Oncology",
    photoLink:
      "https://images.drlogy.com/assets/uploads/img/user/home/health/Doctors.webp",
  },
];

const getDoctorsWithSessionPrice = async (req, res) => {
  try {
    const { _id } = req.body; // Assuming _id is in the request body
    const patient = await patientModel.findById(_id);

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
    speciality: "Cardiology",
    photoLink:
      "https://media.licdn.com/dms/image/C4E03AQFg161EE_9n0Q/profile-displayphoto-shrink_800_800/0/1540403513741?e=2147483647&v=beta&t=zODGGNsdmZ03iwtSrHJEMR_Qxd_NkEQueFjKfd9JrOE",
  },
  {
    name: "Emily Johnson",
    speciality: "Pediatrician",
    photoLink:
      "https://media.licdn.com/dms/image/C4E03AQHJ_sJIJWxHpw/profile-displayphoto-shrink_800_800/0/1529980129766?e=2147483647&v=beta&t=yH7Pz2hfrso5nXNCFilmjOnvL7OVcLML5vOsvA7nWDM",
  },
  {
    name: "Michael Brown",
    speciality: "Dermatologist",
    photoLink:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAi46IZubvG3_2P4upQgk2zqAqzySmQ7Yx8qmgUOuWdnth2Yoy7BXbSxHTEqpD8_11aeI&usqp=CAU",
  },
  {
    name: "Sarah Wilson",
    speciality: "Oncologist",
    photoLink:
      "https://media.licdn.com/dms/image/C4D03AQF3MdVSGuXrDw/profile-displayphoto-shrink_800_800/0/1525397028366?e=2147483647&v=beta&t=Ai6blaPhh7JFpMGwn1ltvfk40FHEupx1txBM6Qda7AY",
  },
  {
    name: "David Lee",
    speciality: "Neurologist",
    photoLink:
      "https://www.woodlandshospital.in/images/doctor-img/ravi-kant-saraogi.jpg",
  },
  {
    name: "Lisa Miller",
    speciality: "Orthopedic Surgeon",
    photoLink:
      "https://media.licdn.com/dms/image/D4D03AQGtRNtcH_1kFg/profile-displayphoto-shrink_400_400/0/1688449652391?e=1700697600&v=beta&t=XeEjFVmqBXMPwoCUZtqDLzw1_eA3FAICAT2APwaBHHM",
  },
  {
    name: "Karen Davis",
    speciality: "Psychiatrist",
    photoLink:
      "https://images.drlogy.com/assets/uploads/img/user/home/health/Doctors.webp",
  },
];

const viewAllDoctorsForPatients = async (req, res) => {
  try {
    // Query the database to get real doctors
    const realDoctors = await doctorModel.find({}, { name: 1, speciality: 1 });

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
          doctor.speciality.toString() === speciality.toString()
      )
    );

    res.status(200).json({ availableDoctors });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const viewAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find();

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const filterDoctorsAfterSearchDocName = async (req, res) => {
  const { name, speciality, date, time } = req.query;

  query = { date, time, status: "free" };

  try {
    const doctors = await doctorModel.find({
      speciality: speciality,
      name: name,
    });

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

    // const availableAppointments = appointments.filter(
    //   (appointment) => appointment.status !== "filled"
    // );
    const availableDoctors = doctors.filter((doctor) =>
      appointments.some(
        (appointment) =>
          appointment.doctorID.toString() === doctor._id.toString() &&
          doctor.speciality.toString() === speciality.toString()
      )
    );

    res.status(200).json({ availableDoctors });
    res.status(200).json(appointments);
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
  viewPackages,
  viewAllDoctorsForPatients,
  getDoctorsWithSessionPrice,
  addAppointment,
  filterDoctorsAfterSearch,
  viewAllAppointments,
  filterDoctorsAfterSearchDocName,
};
