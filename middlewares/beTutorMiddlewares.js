const Order = require("../models/Order");
const { body, check } = require('express-validator');

const postValidator = [
    body("fullname")
        .notEmpty().withMessage("Please provide full name")
        .escape(),
    body("phoneNumber")
        .notEmpty().withMessage("Please provide phone number")
        .escape(),
    body("GPA")
        .notEmpty().withMessage("Please provide GPA")
        .isNumeric().withMessage("GPA is a number")
        .escape(),

    body("comment")
        .notEmpty().withMessage("Please provide comment")
        .escape(),
    // Custom validator for GPAfile
    body('GPAfile')
        .custom((value, { req }) => {
            if (!req.file) { // Check if file is uploaded
                throw new Error('Please upload a file');
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