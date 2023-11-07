const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

var uploadFiles = multer({
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
    fileSize: 1024 * 1024 * 2, //2MB
  },
});

module.exports = uploadFiles;
