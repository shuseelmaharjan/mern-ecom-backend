const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class FileService {
  static async saveMedia(files) {
    const uploadDir = path.join(__dirname, "../media");
    const today = new Date().toISOString().split("T")[0];
    const mediaDir = path.join(uploadDir, today);

    // Ensure the media directory exists
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

    let images = [];
    let video = null;

    for (let file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`;

      if (file.mimetype.startsWith("image")) {
        let finalPath = path.join(mediaDir, `${filename}.webp`);

        try {
          if (file.size > 500 * 1024) {
            // Convert large images to WebP and resize
            await sharp(file.buffer)
              .resize({ width: 800 })
              .toFormat("webp")
              .toFile(finalPath);
          } else {
            // Save without resizing
            await sharp(file.buffer).toFormat("webp").toFile(finalPath);
          }
          images.push(`/media/${today}/${filename}.webp`);
        } catch (err) {
          console.error(
            `Error processing image file: ${file.originalname}`,
            err
          );
        }
      } else if (file.mimetype.startsWith("video")) {
        let videoPath = path.join(mediaDir, `${filename}${ext}`);
        try {
          fs.writeFileSync(videoPath, file.buffer);
          video = `/media/${today}/${filename}${ext}`;
        } catch (err) {
          console.error(
            `Error processing video file: ${file.originalname}`,
            err
          );
        }
      }
    }

    return { images, video };
  }
}

module.exports = FileService;
