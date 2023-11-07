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

module.exports = uploadFiles;
