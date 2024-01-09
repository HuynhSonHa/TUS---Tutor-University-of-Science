const Order = require("../models/Order");
const { body, check } = require('express-validator');

const postValidator = [
  
    body("email").trim()
    .notEmpty().withMessage("Email must not be empty")
    .isEmail().withMessage("Email is invalid")
    .escape(),
    // .custom(async value => {
     
    //     const foundedUser = await User.findOne({ email: value });
    //     if (!foundedUser) {
    //         return true;
    //     }
    //     else {
    //         throw new Error("Email is already registered");
    //     }
    // })
    body("fullname")
        .notEmpty().withMessage("Please provide full name")
        .escape(),
    body("phoneNumber")
        .notEmpty().withMessage("Please provide phone number")
        .escape(),
    body("GPA")
        .notEmpty().withMessage("Please provide GPA")
        .isNumeric().withMessage("GPA is a number")
        .isFloat({ min: 0, max: 4 }).withMessage("GPA must be between 0 and 4")
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