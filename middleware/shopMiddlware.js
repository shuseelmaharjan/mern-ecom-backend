const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Resolve the /shop directory relative to the current script
        const uploadPath = path.resolve(__dirname, '../shop');
        
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Save to /shop directory
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.fieldname}${fileExtension}`;
        cb(null, filename); // Save with a unique filename
    }
});

// Initialize multer with the storage configuration
const shopMiddleware = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

module.exports = shopMiddleware;
