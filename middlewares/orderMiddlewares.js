const Order = require("../models/Order");
const { body } = require('express-validator');

const postValidator = [
    body("desiredGPA")
        .notEmpty().withMessage("Please provide desired GPA")
        .isNumeric().withMessage("Desired GPA is a number")
        .escape(),
    body("comment")
        .notEmpty().withMessage("Please provide comment")
        .escape(),

];

module.exports = {
    postValidator,
}