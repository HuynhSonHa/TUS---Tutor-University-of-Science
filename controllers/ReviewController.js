const Review = require("../models/Review");
const Order = require("../models/Order");
const mongoose = require("mongoose");

// [POST] /review/store/:courseId
const store = async (req, res, next) => {
    try {
        const order = await Order.findOne({courseId: req.params.id, userId: req.user._id});
        if (!order) {
            return res.status(400).send("Bạn chưa đăng ký khóa học!");
        }
        else if (order && order.status == "Subscribing") {
            return res.status(400).send("Hãy đợi tutor accept bạn vào khóa học!");
        }
        
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