const doctorModel = require("../Models/Doctor.js");
const { default: mongoose } = require("mongoose");
const patientModel = require("../Models/Patient.js");
const PrescriptionModel = require("../Models/Prescription.js");
const appointmentModel = require("../Models/Appointment.js");

const searchPatientByName = async (req, res) => {
  const { name } = req.query;

  try {
    // Create a regular expression to match partial names (case insensitive)
    const nameRegex = new RegExp(name, "i");

    // Find patients where the name matches partially
    const patients = await patientModel.find({ name: { $regex: nameRegex } });

    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found." });
    }

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const filterPatientsByAppointments = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne(req.user.id);
    console.log(doctor);
    if (!doctor) {
      return res.status(401).json({ error: "Doctor not authenticated" });
    }

    const today = new Date();
    const doctorAppointments = await appointmentModel.find({
      doctorID: doctor._id,
    });

    const upcomingAppointments = [];
    for (const appointment of doctorAppointments) {
      const appointmentDate = new Date(appointment.date);
      console.log(appointmentDate);
      console.log(today);
      if (appointmentDate > new Date(today)) {
        upcomingAppointments.push(appointment);
      }
    }
    console.log(upcomingAppointments);
    const patientIDs = upcomingAppointments.map(
      (appointment) => appointment.patientID
    );

    // Fetch patient information for the extracted IDs
    const patients = await patientModel.find({ _id: { $in: patientIDs } });

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const filterApointmentsByDateOrStatusDoc = async (req, res) => {
  const { date, status } = req.query;

  try {
    const doctorID = req.user.id;

    let query = { doctorID };

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

const updateDoctorProfile = async (req, res) => {
  const { email, hourlyRate, affiliation } = req.query; // Extract fields from req.query

  const id = req.user.id;

  try {
    const doctor = await doctorModel.findOne({ _id: id });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Update the specified fields
    if (email) doctor.email = email;
    if (hourlyRate) doctor.hourlyRate = hourlyRate;
    if (affiliation) doctor.affiliation = affiliation;

    // Save the updated doctor profile
    await doctor.save();

    res.status(200).json({ message: "Doctor profile updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const viewPatients = async (req, res) => {
  const id = req.user.id;

  try {
    const doctor = await doctorModel.findOne({ _id: id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const patients = doctor.patients;
    const actualPatients = [];

    for (const patientId of patients) {
      const patient = await patientModel
        .findOne({ _id: patientId })
        .populate("prescriptions");
      if (patient) {
        actualPatients.push(patient);
      }
    }

    res.status(200).json({ patients: actualPatients });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const viewInfoAndHealthRecord = async (req, res) => {
  const patientUsername = req.body.username;

  try {
    const patient = await patientModel.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Extract relevant information and health records
    const {
      username,
      name,
      email,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyFullName,
      emergencyMobileNumber,
      package,
      prescriptions,
      healthRecords,
    } = patient;

    res.status(200).json({
      username,
      name,
      email,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyFullName,
      emergencyMobileNumber,
      package,
      prescriptions,
      healthRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const selectPatient = async (req, res) => {
  const doctorId = req.user.id;
  const { patientUsername } = req.body;

  try {
    const doctor = await doctorModel
      .findOne({ _id: doctorId })
      .populate("patients");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const selectedPatient = doctor.patients.find(
      (patientId) => patientId.username === patientUsername
    );

    if (!selectedPatient) {
      return res.status(404).json({
        message: "Patient not found or not registered with this doctor.",
      });
    }

    res.status(200).json({ selectedPatient });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const addPrescription = async (req, res) => {
  try {
    const newPrescription = await PrescriptionModel.create(req.body);
    console.log("Prescription Created!");
    res.status(200).send(newPrescription);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
const viewDocApp = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ doctorID: req.user.id })
      .populate("patient");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

function parseDateString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
}

const addAvailableSlots = async (req, res) => {
  const doctorId = req.user.id;
  const { availableSlots } = req.body;

  try {
    // Find the doctor by ID
    const doctor = await doctorModel.findOne({ _id: doctorId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const slotsAsDates = availableSlots.map(
      (dateString) => new Date(dateString)
    );

    doctor.availableSlots = doctor.availableSlots.concat(slotsAsDates);

    // Save the updated doctor document
    await doctor.save();

    res.status(200).json({ message: "Available slots added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
const viewAllAppointmentsDoctor = async (req, res) => {
  try {
    const id = req.body._id;
    const appointments = await appointmentModel
      .find({ doctorID: id })
      .populate("patient");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const changePasswordForDoctor = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const doctorID = req.body._id;

  try {
    const doctor = await doctorModel.findById(doctorID);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      doctor.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Hash the new password and update it in the database
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    doctor.password = hashedPassword;
    await doctor.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
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
};
