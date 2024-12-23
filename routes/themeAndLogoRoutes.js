const express = require('express');
const router = express.Router();
const { upload, controller } = require('../controller/themeAndLogoController');  

router.put('/v1/update-theme-and-logo', upload.single('logoImage'), controller.updateThemeAndLogo);  
router.get('/v1/get-theme-and-logo', controller.getThemeAndLogo);
router.delete('/v1/remove-logo', controller.removeLogo);

module.exports = router;
