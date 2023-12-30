const Review = require("../models/Review");
const { body } = require('express-validator');

const postValidator = [
    body("rating")
        .notEmpty().withMessage("Please chose star rating")
        .escape(),
    body("comment")
        .notEmpty().withMessage("Please provide comment")
        .escape(),

];

module.exports = {
    postValidator,
}