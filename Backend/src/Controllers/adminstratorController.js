const { default: mongoose } = require("mongoose");

const administratorModel = require("../Models/Adminstrator.js");
const packagesModel = require("../Models/Packages.js");
const doctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const potentialDoctorModel = require("../Models/PotentialDoctor.js");
const appointmentModel = require("../Models/Appointment.js");
const bcrypt = require("bcrypt");

const addAdmin = async (req, res) => {
  const { username } = req.body;

  try {
    let password = req.body.password;
    const { username, email, name } = req.body;
    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(password, salt);
    password = newPassword;

    console.log("creating admin " + newPassword);

    const existingAdmin = await administratorModel.findOne({ username });
    if (existingAdmin) {
      return res
        .status(409)
        .send({ message: "Admin with this username already exists." });
    }

    const newAdmin = await administratorModel.create({
      username,
      password,
      name,
      email,
    });
    console.log("Admin Created!");
    res.status(200).send(newAdmin);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const addPackage = async (req, res) => {
  try {
    const newPackage = await packagesModel.create(req.body);
    console.log("Package Created!");
    res.status(200).send(newPackage);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
const updatePackage = async (req, res) => {
  try {
    const id = req.query._id;
    const {
      type,
      price,
      sessionDiscount,
      medicineDiscount,
      packageDiscountFM,
    } = req.query; // Extract fields from req.query

    const updatedPackage = await packagesModel.findByIdAndUpdate(
      id,
      {
        type,
        price,
        sessionDiscount,
        medicineDiscount,
        packageDiscountFM,
      },
      { new: true, runValidators: true } // Use { new: true } to return the updated package
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.status(200).json(updatedPackage);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const viewPotentialDoctors = async (req, res) => {
  try {
    const potentialDoctors = await potentialDoctorModel.find({});

    if (!potentialDoctors || potentialDoctors.length === 0) {
      return res.status(404).json({ message: "No potential doctors found." });
    }

    res.status(200).json({ potentialDoctors });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deletePackage = async (req, res) => {
  try {
    const id = req.query._id;
    const deletedPackage = await packagesModel.findOneAndDelete({ _id: id });

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    return res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const rejectPotentialDoctor = async (req, res) => {
  try {
    const username = req.query.username;
    const rejectedDoctor = await potentialDoctorModel.findOneAndDelete({
      username: username,
    });

    if (!rejectedDoctor) {
      return res.status(404).json({ message: "Potential Doctor not found" });
    }
    return res.status(200).json({ message: "Potential Doctor rejected" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const removeDoctor = async (req, res) => {
  try {
    const username = req.query.username;
    const removedDoctor = await doctorModel.findOneAndDelete({
      username: username,
    });

    if (!removedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    return res.status(200).json({ message: "Doctor removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const removePatient = async (req, res) => {
  try {
    const username = req.query.username;
    const removedPatient = await patientModel.findOneAndDelete({
      username: username,
    });

    if (!removedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.status(200).json({ message: "Patient removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const removeAdmin = async (req, res) => {
  try {
    const username = req.query.username;
    const removedAdmin = await administratorModel.findOneAndDelete({
      username: username,
    });

    if (!removedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const viewAllPatients = async (req, res) => {
  try {
    const patients = await patientModel.find();

    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: "No patients found." });
    }

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Dummy data for 7 doctors with full schema attributes
// const dummyDoctors = [
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

const viewAllDoctors = async (req, res) => {
  try {
    // Query the database to get real doctors
    const realDoctors = await doctorModel.find();

    //const allDoctors = dummyDoctors.concat(realDoctors);

    if (realDoctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }

    res.status(200).json({ doctors: realDoctors });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const viewPackagesAdmin = async (req, res) => {
  try {
    const allPackages = await packagesModel.find();

    if (!allPackages || allPackages.length === 0) {
      return res.status(404).json({ message: "No packages found." });
    }

    // Filter packages based on the condition (split on space)
    const filteredPackages = allPackages.filter((package) => {
      const packageType = package.type || "";
      const typeElements = packageType.split(" ");
      return typeElements.length <= 1;
    });

    res.status(200).json(filteredPackages);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const viewAllAdmins = async (req, res) => {
  try {
    const admins = await administratorModel.find();

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "No admins found." });
    }

    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const viewAllDocApp = async (req, res) => {
  try {
    //const docApp = await doctorModel.find();
    const docPop = await doctorModel.find().populate("appointment");

    // const doctorsWithAppointments = await doctorModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "Appointment", // Name of the Appointment collection
    //       localField: "_id", // Field in the Doctor collection
    //       foreignField: "doctorID", // Field in the Appointment collection
    //       as: "appointments", // Alias for the joined data
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       username: 1,
    //       name: 1,
    //       email: 1,
    //       password: 1,
    //       dateOfBirth: 1,
    //       hourlyRate: 1,
    //       affiliation: 1,
    //       educationalBackground: 1,
    //       patients: 1,
    //       specialty: 1,
    //       appointments: 1,
    //     },
    //   },
    // ]);

    res.status(200).json(docPop);
  } catch (error) {
    console.error("Error fetching doctors with appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const changePasswordForAdmin = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminID = req.user.id;

  try {
    const Admin = await administratorModel.findById(adminID);
    console.log(Admin);

    if (!Admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      Admin.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }
    const salt = await bcrypt.genSalt();
    newPasswordHashed = await bcrypt.hash(newPassword, salt);
    Admin.password = newPasswordHashed;
    await Admin.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const addDoctor = async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    dateOfBirth,
    hourlyRate,
    affiliation,
    educationalBackground,
    specialty,
  } = req.body;
  try {
    const existingDoctor = await doctorModel.findOne({ username });
    if (existingDoctor) {
      return res
        .status(409)
        .send({ message: "Doctor with this username already exists." });
    }

    const newDoctor = await doctorModel.create({
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliation,
      educationalBackground,
      specialty,
      wallet: 0,
    });

    console.log("Doctor Created!");
    res.status(200).send(newDoctor);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  addAdmin,
  addPackage,
  addDoctor,
  updatePackage,
  deletePackage,
  removeDoctor,
  removePatient,
  removeAdmin,
  viewAllPatients,
  viewAllDoctors,
  viewPotentialDoctors,
  rejectPotentialDoctor,
  viewPackagesAdmin,
  viewAllAdmins,
  viewAllDocApp,
  changePasswordForAdmin,
};
