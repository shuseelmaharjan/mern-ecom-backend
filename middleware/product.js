const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail" || file.fieldname === "images") {
      cb(null, "media/uploads");
    } else if (file.fieldname === "video") {
      cb(null, "media/video");
    } else {
      cb(new Error("Invalid fieldname"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 1 },
]);

module.exports = uploadFields;
