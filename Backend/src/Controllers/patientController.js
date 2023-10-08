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

    if (name && speciality) {
      query = { name, speciality };
    } else if (name) {
      query.name = name;
      query.speciality = { $exists: true };
    } else if (speciality) {
      query.speciality = speciality;
      query.name = { $exists: true };
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
  const { speciality, date, time } = req.query;

  query = { date, time, status: "not filled" };

  try {
    const doctors = await doctorModel.find({ speciality: speciality });

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

const filterApointmentsByDateOrStatus = async (req, res) => {
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
    console.log(id);

    // Check if a patient with the provided username exists
    const prescriptions = await prescriptionModel.findOne({ patientID: id });

    if (!prescriptions) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // const prescriptions = patient.prescriptions;

    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const filterPrescriptions = async (req, res) => {
  const { doctorID, status, date } = req.query;

  try {
    // Retrieve username from the session
    const patientID = req.body._id;

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
  const username = req.body.username;

  try {
    const patient = await patientModel.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const patientID = patient._id;

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
  const { prescriptionId } = req.query;
  const id = req.body._id;

  try {
    const prescription = await prescriptionModel.findOne({ patientID: id });

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

const calculateSessionPrice = (hourlyRate, patientPackage) => {
  const discountPercentages = {
    silver: 0.4,
    gold: 0.6,
    platinum: 0.8,
  };

  const discount = discountPercentages[patientPackage.toLowerCase()] || 0;
  return hourlyRate * 1.1 * (1- discount);
};

const getDoctorsWithSessionPrice = async (req, res) => {
  try {
    // Fetch all doctors from the database
    const doctors = await doctorModel.find();

    if(!doctors){
      return res.status(404).json({ message: "No doctors found." });
    }

    // Calculate session price for each doctor
    const doctorsWithSessionPrice = doctors.map((doctor) => {
      const sessionPrice = calculateSessionPrice(
        doctor.hourlyRate,
        req.body.package
      );

      return {
        name: doctor.name,
        speciality: doctor.speciality,
        sessionPrice: sessionPrice,
      };
    });

    res.status(200).json({ doctorsWithSessionPrice });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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
    name: "Dr. John Smith",
    speciality: "Cardiologist",
    photoLink:
      "https://media.licdn.com/dms/image/C4E03AQFg161EE_9n0Q/profile-displayphoto-shrink_800_800/0/1540403513741?e=2147483647&v=beta&t=zODGGNsdmZ03iwtSrHJEMR_Qxd_NkEQueFjKfd9JrOE",
  },
  {
    name: "Dr. Emily Johnson",
    speciality: "Pediatrician",
    photoLink:
      "https://media.licdn.com/dms/image/C4E03AQHJ_sJIJWxHpw/profile-displayphoto-shrink_800_800/0/1529980129766?e=2147483647&v=beta&t=yH7Pz2hfrso5nXNCFilmjOnvL7OVcLML5vOsvA7nWDM",
  },
  {
    name: "Dr. Michael Brown",
    speciality: "Dermatologist",
    photoLink:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAi46IZubvG3_2P4upQgk2zqAqzySmQ7Yx8qmgUOuWdnth2Yoy7BXbSxHTEqpD8_11aeI&usqp=CAU",
  },
  {
    name: "Dr. Sarah Wilson",
    speciality: "Oncologist",
    photoLink:
      "https://media.licdn.com/dms/image/C4D03AQF3MdVSGuXrDw/profile-displayphoto-shrink_800_800/0/1525397028366?e=2147483647&v=beta&t=Ai6blaPhh7JFpMGwn1ltvfk40FHEupx1txBM6Qda7AY",
  },
  {
    name: "Dr. David Lee",
    speciality: "Neurologist",
    photoLink:
      "https://www.woodlandshospital.in/images/doctor-img/ravi-kant-saraogi.jpg",
  },
  {
    name: "Dr. Lisa Miller",
    speciality: "Orthopedic Surgeon",
    photoLink:
      "https://media.licdn.com/dms/image/D4D03AQGtRNtcH_1kFg/profile-displayphoto-shrink_400_400/0/1688449652391?e=1700697600&v=beta&t=XeEjFVmqBXMPwoCUZtqDLzw1_eA3FAICAT2APwaBHHM",
  },
  {
    name: "Dr. Karen Davis",
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
        return res.status(404).json({ message: 'No doctors found.' });
      }
  
      res.status(200).json({ doctors: allDoctors });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
  

module.exports = {
  selectPrescription,
  viewFamilyMembers,
  filterPrescriptions,
  viewPrescriptions,
  filterApointmentsByDateOrStatus,
  filterDoctors,
  searchDoctors,
  doctorDetails,
  addFamilyMember,
  viewPackages,
  viewAllDoctorsForPatients,
  getDoctorsWithSessionPrice,
  addAppointment,
};
