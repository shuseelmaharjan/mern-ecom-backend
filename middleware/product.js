const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail" || file.fieldname.startsWith("img")) {
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
