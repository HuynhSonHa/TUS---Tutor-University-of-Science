const Review = require("../models/Review");
const Order = require("../models/Order");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// [POST] /review/store/:courseId
const store = async (req, res, next) => {
    // Verify user input
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }
    try {
        const order = await Order.findOne({courseId: req.params.id, userId: req.user._id});
        if (!order) {
            return res.status(400).json({error: "Bạn chưa đăng ký khóa học!"});
        }
        else if (order && order.status === "Subscribing") {
            return res.status(400).json({error: "Hãy đợi tutor accept bạn vào khóa học!"});
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
            const course = await Course.findOne({_id: req.params.id});
            course.average = average;
            await course.save();
        }
        
        return res.status(200).json({ success: true, msg: "Thêm review thành công!" });
        //return res.send("Thêm review thành công!").redirect("/user/home");
    }
    catch (err) {
        next(err);
    }
}


module.exports = {
    store, 
};