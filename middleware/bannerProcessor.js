const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .jpg, .jpeg, .png files are allowed."));
    }
    cb(null, true);
  },
});

const processImage = async (req, res, next) => {
  if (!req.file) return next();

  const file = req.file;
  const originalSize = file.size;

  const currentDate = new Date().toISOString().split("T")[0];
  const outputDir = path.join(__dirname, "..", "banner", currentDate);

  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.originalname.split(".")[0]}.webp`;
  const outputFile = path.join(outputDir, fileName);

  try {
    // Ensure the directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (originalSize <= 250 * 1024) {
      await sharp(file.buffer).webp().toFile(outputFile);
    } else if (originalSize > 500 * 1024) {
      await sharp(file.buffer).webp({ quality: 70 }).toFile(outputFile);
    } else {
      await sharp(file.buffer).webp({ quality: 80 }).toFile(outputFile);
    }

    req.body.image = path.join("banner", currentDate, fileName);

    next();
  } catch (error) {
    next(new Error("Error processing image: " + error.message));
  }
};

module.exports = { upload, processImage };
