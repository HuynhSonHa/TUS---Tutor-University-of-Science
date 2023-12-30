const Order = require("../models/Order");
const { body } = require('express-validator');

const postValidator = [
    body("fullname")
        .notEmpty().withMessage("Please provide full name")
        .escape(),
    body("email")
        .notEmpty().withMessage("Please provide email")
        .escape(),
    body("phoneNumber")
        .notEmpty().withMessage("Please provide phone number")
        .escape(),
    body("GPA")
        .notEmpty().withMessage("Please provide GPA")
        .escape(),
    
    body("comment")
        .notEmpty().withMessage("Please provide comment")
        .escape(),
    // body("GPAfile")
    //     .notEmpty().withMessage("Please provide images of your GPA")
    //     .escape(),
];

module.exports = {
    postValidator,
}