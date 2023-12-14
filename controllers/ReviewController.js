const Review = require("../models/Review");
const mongoose = require("mongoose");

// [POST] /review/store/:courseId
const store = async (req, res, next) => {
    try {
        //res.json(req.body);
        //res.json(req.params.id);
        const formData = req.body;
        formData.courseId = req.params.id;
        formData.userId = req.user._id;
        const review = new Review(formData);
        review.save().then;
        res.redirect("/user/home");
    }
    catch (err) {
        next(err);
    }
}


module.exports = {
    store, 
};