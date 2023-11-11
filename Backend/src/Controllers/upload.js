const patientModel = require("../Models/Patient.js");
const doctorModel = require("../Models/Doctor.js");
const potentialDoctorModel = require("../Models/PotentialDoctor.js");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      callback(null, true);
    } else {
      console.log("File type not supported!");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
}).array("files", 5);

const uploadFiles = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed" });
      }
      patient.medicalHistory = patient.medicalHistory || [];
      req.files.forEach((file) => {
        patient.medicalHistory.push({
          filename: file.originalname,
          mimetype: file.mimetype,
          buffer: file.buffer,
        });
      });
      await patient.save();

      res
        .status(200)
        .json({ message: "Files uploaded and associated with the patient." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteFileFromMedicalHistory = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const filenameToDelete = req.params.filename;

    // Check if the specified filename exists in the patient's medicalHistory
    const fileToDeleteIndex = patient.medicalHistory.findIndex(
      (file) => file.filename === filenameToDelete
    );

    if (fileToDeleteIndex === -1) {
      return res.status(404).json({
        error: `File with the specified filename "${filenameToDelete}" not found in medicalHistory.`,
      });
    }

    // Remove the file from the medicalHistory
    patient.medicalHistory.splice(fileToDeleteIndex, 1);

    // Save the patient document with the updated medicalHistory field
    await patient.save();

    res.status(200).json({ message: "File removed from medicalHistory." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const viewPatientMedicalHistory = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const medicalHistory = patient.medicalHistory;

    if (!medicalHistory || medicalHistory.length === 0) {
      return res
        .status(404)
        .json({ message: "No medical records found for the patient." });
    }

    const requestedFilename = req.params.filename;

    const requestedFile = medicalHistory.find(
      (file) => file.filename === requestedFilename
    );

    if (!requestedFile) {
      return res
        .status(404)
        .json({ message: "File not found in the patient's medical history." });
    }

    const { buffer, mimetype, filename } = requestedFile;

    const sanitizedFilename = encodeURIComponent(filename);

    res.setHeader("Content-Type", mimetype);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizedFilename}"`
    );
    res.end(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const viewPatientMedicalHistoryForDoctors = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.user.id);
    const patientId = req.body.id;
    const requestedFilename = req.body.filename;
    const patient = await patientModel.findById(patientId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const isAssociated = doctor.patients.some(
      (patient) => patient.toString() === patientId
    );
    if (!isAssociated) {
      return res.status(403).json({
        error: "Access denied. This patient is not associated with the doctor.",
      });
    }
    const medicalHistory = patient.medicalHistory;

    if (!medicalHistory || medicalHistory.length === 0) {
      return res
        .status(404)
        .json({ message: "No medical records found for the patient." });
    }

    const requestedFile = medicalHistory.find(
      (file) => file.filename === requestedFilename
    );

    if (!requestedFile) {
      return res
        .status(404)
        .json({ message: "File not found in the patient's medical history." });
    }

    const { buffer, mimetype, filename } = requestedFile;

    const sanitizedFilename = encodeURIComponent(filename);

    res.setHeader("Content-Type", mimetype);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizedFilename}"`
    );
    res.end(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadFilesForPotentialDoctor = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "Username not provided" });
    }

    const PotentialDoctor = await potentialDoctorModel.findOne({
      username: username,
    });

    if (!PotentialDoctor) {
      return res.status(404).json({ error: "PotentialDoctor not found" });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed" });
      }
      PotentialDoctor.documents = PotentialDoctor.documents || [];

      req.files.forEach((file) => {
        PotentialDoctor.documents.push({
          filename: file.originalname,
          mimetype: file.mimetype,
          buffer: file.buffer,
        });
      });
      await PotentialDoctor.save();

      res.status(200).json({
        message: "Files uploaded and associated with the PotentialDoctor.",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadFilesbyDoctors = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.user.id);
    const patientId = req.query.id;
    const patient = await patientModel.findById(patientId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const isAssociated = doctor.patients.some(
      (patient) => patient.toString() === patientId
    );
    if (!isAssociated) {
      return res.status(403).json({
        error: "Access denied. This patient is not associated with the doctor.",
      });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed" });
      }
      patient.medicalHistory = patient.medicalHistory || [];
      req.files.forEach((file) => {
        patient.medicalHistory.push({
          filename: file.originalname,
          mimetype: file.mimetype,
          buffer: file.buffer,
        });
      });
      await patient.save();

      res
        .status(200)
        .json({ message: "Files uploaded and associated with the patient." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const viewMedicalRecords = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const medHistoryFilenames = patient.medicalHistory.map(
      (file) => file.filename
    );

    res.status(200).json({
      medHistory: medHistoryFilenames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  uploadFiles,
  deleteFileFromMedicalHistory,
  viewPatientMedicalHistory,
  viewPatientMedicalHistoryForDoctors,
  uploadFilesForPotentialDoctor,
  uploadFilesbyDoctors,
  viewMedicalRecords,
};
