const Review = require("../models/Review");
const Order = require("../models/Order");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// [POST] /review/store/:courseId
const store = async (req, res, next) => {
    try {
        const order = await Order.findOne({courseId: req.params.id, userId: req.user._id});
        if (!order) {
            return res.status(400).send("Bạn chưa đăng ký khóa học!");
        }
        else if (order && order.status === "Subscribing") {
            return res.status(400).send("Hãy đợi tutor accept bạn vào khóa học!");
        }

        const formData = req.body;
        formData.courseId = req.params.id;
        formData.userId = req.user._id;
        const review = new Review(formData);
        await review.save();
        
        //Tính lại average của course
        const reviewList = await Review.find({courseId: req.params.id})
        const n = reviewList.length;
        let sum = 0;
        for(let i=0; i<n; i++) {
            sum += reviewList[i].rating;
        }
        if(n>0) {
            const average = sum / n;
            const course = await Course.findOne({courseId: req.params.id});
            course.average = average;
            await course.save();
        }
        
        return res.send("Thêm review thành công!");
    }
    catch (err) {
        next(err);
    }
}


module.exports = {
    store, 
};