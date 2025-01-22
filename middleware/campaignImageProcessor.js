const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .jpg, .jpeg, .png, .gif files are allowed."));
    }
    cb(null, true);
  },
});

const processFile = async (file, outputDir) => {
  const timestamp = Date.now();
  const extension = path.extname(file.originalname).toLowerCase();
  const baseName = file.originalname.split(".")[0];
  const isConvertToWebp = ![".gif", ".png"].includes(extension);
  const fileName = isConvertToWebp
    ? `${timestamp}-${baseName}.webp`
    : `${timestamp}-${baseName}${extension}`;
  const outputFile = path.join(outputDir, fileName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (isConvertToWebp) {
    await sharp(file.buffer).webp({ quality: 80 }).toFile(outputFile);
  } else {
    fs.writeFileSync(outputFile, file.buffer);
  }

  return `/uploads/${outputDir.split("uploads/")[1]}/${fileName}`;
};

const processImages = async (req, res, next) => {
  if (!req.files) return next();

  const { image, banner, poster } = req.files;

  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const baseDir = path.join(__dirname, "..", "uploads", currentDate);

    if (image) {
      req.body.image = await processFile(image[0], path.join(baseDir, "image"));
      console.log("Processed image:", req.body.image);
    }
    if (banner) {
      req.body.banner = await processFile(
        banner[0],
        path.join(baseDir, "banner")
      );
      console.log("Processed banner:", req.body.banner);
    }
    if (poster) {
      req.body.poster = await processFile(
        poster[0],
        path.join(baseDir, "poster")
      );
      console.log("Processed poster:", req.body.poster);
    }

    next();
  } catch (error) {
    console.error("Error processing files:", error);
    next(new Error("Error processing files: " + error.message));
  }
};

module.exports = {
  upload: upload,
  processImages,
};
