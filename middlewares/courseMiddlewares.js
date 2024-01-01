const Review = require("../models/Review");
const { body } = require('express-validator');

const createValidator = [
    
    body("name")
        .notEmpty().withMessage("Please provide name of course")
        .escape(),
    body("schedule")
        .notEmpty().withMessage("Please provide schedule")
        .escape(),
    body("faculty")
        .notEmpty().withMessage("Please provide your faculty")
        .escape(),
    body("studentCourse")
        .notEmpty().withMessage("Please provide your studentCourse")
        .escape(),
    body("price")
        .notEmpty().withMessage("Please provide price")
        .isNumeric().withMessage("Price is a number")
        .escape(),
    body("description")
        .notEmpty().withMessage("Please provide description of course")
        .escape(),

];

module.exports = {
    createValidator,
}