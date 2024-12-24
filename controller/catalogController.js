const { Catalog } = require('../models/categories');

class CatalogController {

    // @desc Get all activities details performed on a category model
    // @route GET /api/v1/get-all-catalogs
    // @access Public - Only accessible by staff and admin
    async getAllCatalogs(req, res) {
        try {
            const catalogs = await Catalog.find()
                .sort({ timestamp: -1 })  // Sort in most recent first 
                .populate('performedBy', 'name email') 
                .exec();

            if (!catalogs || catalogs.length === 0) {
                return res.status(404).json({
                    message: 'No catalog entries found.',
                });
            }

            res.status(200).json({
                message: 'Catalog details retrieved successfully.',
                data: catalogs,
            });
        } catch (error) {
            res.status(500).json({
                message: 'An error occurred while fetching the catalog details.',
                error: error.message,
            });
        }
    }

    // @desc Get individual activities details performed on a category model
    // @route GET /api/v1/get-user-catalogs
    // @access Public - Only accessible by staff and admin
    async getUserCatalogs(req, res) {
        const userId = req.user.id;  

        try {
            const catalogs = await Catalog.find({ performedBy: userId })
                .sort({ timestamp: -1 })  // Sort in most recent first 
                .populate('performedBy', 'name email') 
                .exec();

            if (!catalogs || catalogs.length === 0) {
                return res.status(404).json({
                    message: 'No catalog entries found for this user.',
                });
            }

            res.status(200).json({
                message: 'Catalog details for the user retrieved successfully.',
                data: catalogs,
            });
        } catch (error) {
            res.status(500).json({
                message: 'An error occurred while fetching the user catalog details.',
                error: error.message,
            });
        }
    }
}

module.exports = new CatalogController();
