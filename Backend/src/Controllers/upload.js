const patientModel = require("../Models/Patient.js");
const doctorModel = require("../Models/Doctor.js");
const potentialDoctorModel = require("../Models/PotentialDoctor.js");
const adminModel = require("../Models/Adminstrator");
const multer = require("multer");
const PDFDocument = require('pdfkit');

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
    const patient = await patientModel.findById(req.user.id).lean();

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const medicalHistoryBeforeUpload = patient.medicalHistory || []; // Save the medical history

    upload(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
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

      await patientModel.findByIdAndUpdate(
        req.user.id,
        { $set: { medicalHistory: patient.medicalHistory } },
        { new: true } // Return the updated document
      );

      const updatedPatient = await patientModel.findById(req.user.id).lean();

      const medicalHistoryAfterUpload = updatedPatient.medicalHistory || []; // Get the updated medical history

      console.log(
        medicalHistoryBeforeUpload.length +
          " files before upload, " +
          medicalHistoryAfterUpload.length +
          " files after upload"
      );

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
    const patient = await patientModel.findById(req.user.id).lean();

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const passwordBeforeDelete = patient.password; // Save the password

    const filenameToDelete = req.query.filename;

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
    await patientModel.findByIdAndUpdate(
      req.user.id,
      { $set: { medicalHistory: patient.medicalHistory } },
      { new: true, lean: true } // Return the updated document as plain JavaScript object
    );

    // Restore the original password
    const updatedPatient = await patientModel.findById(req.user.id);
    updatedPatient.password = passwordBeforeDelete;
    await patientModel.findByIdAndUpdate(req.user.id, updatedPatient);

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

    const requestedFilename = req.query.filename;

    const requestedFile = medicalHistory.find(
      (file) => file.filename === requestedFilename
    );

    if (!requestedFile) {
      return res
        .status(404)
        .json({ message: "File not found in the patient's medical history." });
    }

    const { buffer, mimetype, filename } = requestedFile;
    // console.log("Buffer size:", buffer.length);

    const sanitizedFilename = encodeURIComponent(filename);

    // Set the Content-Type header to application/pdf
    res.setHeader("Content-Type", "application/pdf");
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
    // console.log("Buffer size:", buffer.length);

    const sanitizedFilename = encodeURIComponent(filename);

    // Set the Content-Type header to application/pdf
    res.setHeader("Content-Type", "application/pdf");
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

    const potentialDoctor = await potentialDoctorModel
      .findOne({
        username: username,
      })
      .lean(); // Use lean() to get a plain JavaScript object

    if (!potentialDoctor) {
      return res.status(404).json({ error: "PotentialDoctor not found" });
    }

    const passwordBeforeUpload = potentialDoctor.password; // Save the password

    upload(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: "File upload failed" });
      }

      potentialDoctor.documents = potentialDoctor.documents || [];
      req.files.forEach((file) => {
        potentialDoctor.documents.push({
          filename: file.originalname,
          mimetype: file.mimetype,
          buffer: file.buffer,
        });
      });

      await potentialDoctorModel.findOneAndUpdate(
        { username: username },
        { $set: { documents: potentialDoctor.documents } },
        { new: true } // Return the updated document
      );

      const updatedPotentialDoctor = await potentialDoctorModel
        .findOne({
          username: username,
        })
        .lean(); // Use lean() again

      const passwordAfterUpload = updatedPotentialDoctor.password;

      console.log(
        passwordBeforeUpload +
          " before upload bta3 el potential doctor, " +
          passwordAfterUpload +
          " after upload bta3 el potential doctor"
      );

      res
        .status(200)
        .json({ message: "Files uploaded and associated with the patient." });
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
    const patient = await patientModel.findById(patientId).lean();

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const passwordBeforeUpload = patient.password;

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
        console.error("Multer error:", err);
        return res.status(400).json({ error: "File upload failed" });
      }

      const updatedPatient = await patientModel.findByIdAndUpdate(
        patientId,
        {
          $push: {
            medicalHistory: {
              $each: req.files.map((file) => ({
                filename: file.originalname,
                mimetype: file.mimetype,
                buffer: file.buffer,
              })),
            },
          },
        },
        { new: true, lean: true } // Return the updated document as a plain JavaScript object
      );

      // Restore the original password
      updatedPatient.password = passwordBeforeUpload;
      await patientModel.findByIdAndUpdate(patientId, updatedPatient);

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
const viewPtlDocDocumentsbyAdmins = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.user.id);
    const PotentialDoctorID = req.body.id;
    const requestedFilename = req.body.filename;
    const PotentialDoctor =
      await potentialDoctorModel.findById(PotentialDoctorID);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    if (!PotentialDoctor) {
      return res.status(404).json({ error: "PotentialDoctor not found" });
    }

    const douments = PotentialDoctor.documents;

    if (!douments || douments.length === 0) {
      return res
        .status(404)
        .json({ message: "No douments  found for the PotentialDoctor." });
    }

    const requestedFile = douments.find(
      (file) => file.filename === requestedFilename
    );

    if (!requestedFile) {
      return res.status(404).json({
        message: "File not found in the PotentialDoctor's Documents.",
      });
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
const downloadPrescriptions = async (req, res) => {
  try {
    const PrescriptionId = req.query.id;
    const prescription = await prescriptionsModel.findById(PrescriptionId);

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    const sanitizedFilename = encodeURIComponent(`${PrescriptionId}_Prescription`);
    const buffer = await generatePdfBuffer(prescription);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizedFilename}.pdf"`
    );
    res.end(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generatePdfBuffer = async (prescription) => {
  const doc = new PDFDocument();
  const buffer = [];

  doc.on('data', (chunk) => {
    buffer.push(chunk);
  });
  const pdfPromise = new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffer));
    });
  });
  doc.text(`Medicine: ${prescription.medicine.join(', ')}`);
  doc.text(`Doctor ID: ${prescription.doctorID}`);
  doc.text(`Patient ID: ${prescription.patientID}`);
  doc.text(`Status: ${prescription.status}`);
  doc.text(`Date: ${prescription.date}`);
  doc.text(`Doctor Name: ${prescription.doctorName}`);
  doc.end();
  return pdfPromise;
};


module.exports = {
  uploadFiles,
  deleteFileFromMedicalHistory,
  viewPatientMedicalHistory,
  viewPatientMedicalHistoryForDoctors,
  uploadFilesForPotentialDoctor,
  uploadFilesbyDoctors,
  viewMedicalRecords,
  viewPtlDocDocumentsbyAdmins,
  downloadPrescriptions
};
