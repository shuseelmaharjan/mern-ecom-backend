const express = require("express");
const SiteController = require("../controller/siteController");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/site-manager", upload.single("logo"), (req, res) => SiteController.insert(req, res));

router.put("/site-manager", upload.single("logo"), (req, res) => SiteController.update(req, res));
router.get("/site-manager", (req, res) => SiteController.getAll(req, res));


module.exports = router;
