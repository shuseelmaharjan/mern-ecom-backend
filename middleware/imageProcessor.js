const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

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

  const outputPath = path.join(
    "uploads",
    `${Date.now()}-${file.originalname.split(".")[0]}.webp`
  );

  try {
    if (originalSize <= 250 * 1024) {
      await sharp(file.buffer).webp().toFile(outputPath);
    } else if (originalSize > 500 * 1024) {
      await sharp(file.buffer).webp({ quality: 70 }).toFile(outputPath);
    } else {
      await sharp(file.buffer).webp({ quality: 80 }).toFile(outputPath);
    }

    req.body.image = outputPath;
    next();
  } catch (error) {
    next(new Error("Error processing image: " + error.message));
  }
};

module.exports = { upload, processImage };
