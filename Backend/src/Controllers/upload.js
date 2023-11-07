const path = require('path');
const multer = require('multer');
const patientModel = require('./patientModel');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadFiles = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

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

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }

      const filePaths = req.files.map((file) => `Uploads/${file.filename}`);
      patient.medicalHistory = patient.medicalHistory ? [...patient.medicalHistory, ...filePaths] : filePaths;

      await patient.save();

      res.status(200).json({ message: 'Files uploaded and associated with the patient.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = uploadFiles;
