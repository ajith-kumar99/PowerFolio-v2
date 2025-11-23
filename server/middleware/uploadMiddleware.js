import multer from 'multer';
import path from 'path';

// Use Memory Storage for Cloud Uploads
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|mp4|mov/; // Added PDF just in case
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images and Videos only!');
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;