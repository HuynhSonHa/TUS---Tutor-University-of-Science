const Review = require("../models/Review");
const { body } = require('express-validator');

const postValidator = [
    // body("avatar")
    //     .notEmpty().withMessage("Please chose star rating")
    //     .escape(),

];

module.exports = {
    postValidator,
}