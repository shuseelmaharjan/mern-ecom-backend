const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Ensure the /profile directory exists
const uploadPath = path.join(__dirname, "../profile");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.memoryStorage();

const uploadProfile = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and JPG files are allowed."));
    }
  },
  limits: {
    fileSize: 5 * 6000 * 6000,
  },
});

const resizeAndSaveImage = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded."));
  }

  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${req.file.originalname}`;
    const outputPath = path.join(uploadPath, filename);

    const metadata = await sharp(req.file.buffer).metadata();
    const { width, height } = metadata;

    const targetWidth =
      width > height ? 500 : Math.round((500 * width) / height);
    const targetHeight =
      height > width ? 500 : Math.round((500 * height) / width);

    await sharp(req.file.buffer)
      .resize(targetWidth, targetHeight, {
        fit: sharp.fit.cover,
      })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    req.file.path = `/profile/${filename}`;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadProfile, resizeAndSaveImage };
