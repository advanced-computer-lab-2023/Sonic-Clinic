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
    const doctor = await doctorModel.find(req.body);
    if (!doctor) {
      return res.status(401).json({ error: "Doctor not authenticated" });
    }

    const today = new Date();
    // Find upcoming appointments for the doctor
    const upcomingAppointments = await appointmentModel.find({
      doctorID: doctor._id,
      date: { $gte: today },
    });

    // Extract patient IDs from upcoming appointments
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
    const doctorID = req.body._id;

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

  const id = req.query._id;

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
  const id = req.body._id;

  try {
    const doctor = await doctorModel.findOne({ _id: id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const patients = doctor.patients;
    const actualPatients = [];

    for (const patientId of patients) {
      const patient = await patientModel.findOne({ _id: patientId });
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
  const doctorId = req.query._id;
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
      .find({ doctorID: req.body._id })
      .populate("patients");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).send({ error: error.message });
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
};
