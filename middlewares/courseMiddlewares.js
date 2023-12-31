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
        .notEmpty().withMessage("Please provide your school")
        .escape(),
    body("price")
        .notEmpty().withMessage("Please provide price")
        .escape(),
    body("description")
        .notEmpty().withMessage("Please provide description of course")
        .escape(),

];

module.exports = {
    createValidator,
}