const path = require('path');
const multer = require('multer');
const patientModel = require('./patientModel');
const GridFS = require('gridfs-stream');
const mongoose = require('mongoose');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      callback(null, true);
    } else {
      console.log('File type not supported!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
}).array('files', 5);

const gfs = GridFS(mongoose.connection.db, mongoose.mongo);

const uploadFiles = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }

      const filePromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const writeStream = gfs.createWriteStream({
            filename: file.originalname,
            mode: 'w',
            content_type: file.mimetype,
          });

          file.buffer
            .pipe(writeStream)
            .on('close', () => {
              resolve(writeStream._id); // Resolve with the GridFS ObjectID
            })
            .on('error', (err) => {
              reject(err);
            });
        });
      });

      const fileIDs = await Promise.all(filePromises);

      // Concatenate the new file IDs with existing medicalHistory (if any)
      patient.medicalHistory = patient.medicalHistory
        ? [...patient.medicalHistory, ...fileIDs]
        : fileIDs;

      await patient.save();

      res.status(200).json({ message: 'Files uploaded and associated with the patient.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const viewPatientMedicalHistory = async (req, res) => {
  try {
    const patientUsername = req.body.username;
    const patient = await patientModel.findById(patientUsername);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Retrieve and send the files from the medicalHistory
    const files = await Promise.all(patient.medicalHistory.map(async (fileId) => {
      const file = await gfs.find({ _id: fileId }).toArray();

      if (file.length === 0) {
        return null; // File not found in GridFS
      }

      return {
        filename: file[0].filename,
        contentType: file[0].contentType,
        data: await gfs.createReadStream({ _id: fileId }),
      };
    }));

    // Remove null entries (files not found)
    const validFiles = files.filter((file) => file !== null);

    // Send the valid files in the response
    res.status(200).json({ files: validFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const removeFileFromMedicalHistory = async (req, res) => {
  try {
   
    const fileIdToRemove = req.params.fileId;
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const index = patient.medicalHistory.indexOf(fileIdToRemove);

    if (index === -1) {
      return res.status(404).json({ error: 'File not found in medicalHistory' });
    }

    // Remove the fileId from the medicalHistory
    patient.medicalHistory.splice(index, 1);

    await patient.save();

    res.status(200).json({ message: 'File removed from medicalHistory' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { uploadFiles, viewPatientMedicalHistory, removeFileFromMedicalHistory,};
