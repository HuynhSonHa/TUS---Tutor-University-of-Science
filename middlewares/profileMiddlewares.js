const Review = require("../models/Review");
const { body, check } = require('express-validator');

const postValidator = [
    // Custom validator for avatar
    body('avatar')
        .custom((value, { req }) => {
            if (!req.file) {
                return true; // Skip validation if avatar is undefined
            }

            // Allowed mime types for images
            const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                throw new Error('Only image files are allowed');
            }

            return true; // Validation passed
        }),
];

module.exports = {
    postValidator,
}