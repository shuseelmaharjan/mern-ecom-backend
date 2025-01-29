const multer = require("multer");
const mime = require("mime-types");

const storage = multer.memoryStorage();
const uploadFiles = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const fileType = mime.lookup(file.originalname);
    console.log(`File MIME Type: ${file.mimetype}`);
    console.log(`Determined MIME Type: ${fileType}`);

    if (
      fileType &&
      (fileType.startsWith("image/") || fileType.startsWith("video/"))
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type! Only images and videos are allowed."),
        false
      );
    }
  },
}).array("files", 10);

module.exports = uploadFiles;
