const multer = require("multer");
const path = require("path");

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check the fieldname for the appropriate directory
    if (file.fieldname === "thumbnail" || file.fieldname.startsWith("img")) {
      // All image files (img1, img2, ... img8) will be stored in the 'uploads' folder
      cb(null, "media/uploads");
    } else if (file.fieldname === "video") {
      // Video files will be stored in the 'video' folder
      cb(null, "media/video");
    } else {
      cb(new Error("Invalid fieldname"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadFields = multer({ storage }).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "img1", maxCount: 1 },
  { name: "img2", maxCount: 1 },
  { name: "img3", maxCount: 1 },
  { name: "img4", maxCount: 1 },
  { name: "img5", maxCount: 1 },
  { name: "img6", maxCount: 1 },
  { name: "img7", maxCount: 1 },
  { name: "img8", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

module.exports = uploadFields;
