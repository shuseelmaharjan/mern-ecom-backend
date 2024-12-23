const ThemeAndLogo = require('../models/Theme');
const multer = require('multer'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

class ThemeAndLogoController {
    async updateThemeAndLogo(req, res) {
        const {
          primaryColor,
          secondaryColor,
          buttonColor,
          hoverButtonColor,
          backgroundColor,
        } = req.body;
    
        const logoImage = req.file ? `/uploads/${req.file.filename}` : null;
    
        try {
          const updatedDocument = await ThemeAndLogo.findOneAndUpdate(
            {},
            {
              primaryColor,
              secondaryColor,
              buttonColor,
              hoverButtonColor,
              backgroundColor,
              'logo.logoImage': logoImage,
              'logo.updatedAt': logoImage ? new Date() : null,
            },
            { new: true, runValidators: true, upsert: true }
          );
    
          res.status(200).json({
            message: 'Theme and logo updated successfully',
            data: updatedDocument,
            logoImageUrl: logoImage,
          });
        } catch (error) {
          res.status(500).json({
            message: 'An error occurred while updating theme and logo',
            error: error.message,
          });
        }
      }

  async removeLogo(req, res) {
    try {
      const updatedDocument = await ThemeAndLogo.findOneAndUpdate(
        {},
        {
          'logo.logoImage': null,
          'logo.updatedAt': null,
        },
        { new: true }
      );

      res.status(200).json({
        message: 'Logo removed successfully',
        data: updatedDocument,
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while removing the logo',
        error: error.message,
      });
    }
  }

  async getThemeAndLogo(req, res) {
    try {
      const data = await ThemeAndLogo.findOne(); 

      if (!data) {
        return res.status(404).json({
          message: 'No theme or logo data found',
        });
      }

      res.status(200).json({
        message: 'Theme and logo data retrieved successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while fetching theme and logo data',
        error: error.message,
      });
    }
  }
}

module.exports = {
  upload,
  controller: new ThemeAndLogoController(),
};
