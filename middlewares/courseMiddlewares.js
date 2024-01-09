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
        .escape()
        .custom(async value => {
            if(value === "none"){
                throw new Error("Please choose your faculty");
            }
            return true;
        }),
    body("studentCourse")
        .notEmpty().withMessage("Please provide your studentCourse")
        .escape()
        .custom(async value => {
            if(value === "none"){
                throw new Error("Please choose your studentCourse");
            }
            return true;
        }),
    body("price")
        .notEmpty().withMessage("Please provide price")
        .isNumeric().withMessage("Price is a number")
        .isFloat({ min: 0 }).withMessage("Price must be a positive number")
        .escape(),
    body("description")
        .notEmpty().withMessage("Please provide description of course")
        .escape(),

];

module.exports = {
    createValidator,
}