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
<<<<<<< HEAD
        .notEmpty().withMessage("Please provide your school")
=======
        .notEmpty().withMessage("Please provide your student course")
>>>>>>> 5da7463c6313585d3b43e600f6a8b9ffe1f94b4a
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