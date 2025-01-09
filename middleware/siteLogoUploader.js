const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const siteLogoUploader = multer({ storage, fileFilter });

module.exports = siteLogoUploader;
