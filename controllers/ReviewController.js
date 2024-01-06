const Review = require("../models/Review");
const Order = require("../models/Order");
const Course = require("../models/Course");
const ReviewService = require("../services/review");
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
        const order = await Order.findOne({ courseId: req.params.id, userId: req.user._id });
        //Kiểm tra xem user có được tutor accept vào khóa học không
        if (!order || (order && order.status === "denied")) {
            return res.status(400).json({ error: "Bạn chưa đăng ký khóa học!" });
        }
        else if (order && order.status === "Subscribing") {
            return res.status(400).json({ error: "Hãy đợi tutor accept bạn vào khóa học!" });
        }
        //Lưu review lại
        const formData = req.body;
        formData.courseId = req.params.id;
        formData.userId = req.user._id;
        const review = new Review(formData);
        await review.save();

        //Tính lại average của course
        const reviewList = await Review.find({ courseId: req.params.id })
        const n = reviewList.length;
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += reviewList[i].rating;
        }
        if (n > 0) {
            const average = sum / n;
            const course = await Course.findOne({ _id: req.params.id });
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

// [GET] /review/:id
const getReviewsForPaging = async (req, res, next) => {
    try {
        const courseId = req.params.id || "None"; // Lấy id từ req.params.id
        const page = req.query.page || 1;

        const reviews = await ReviewService.filteredAndGetPagingReviews(courseId, page);


        console.log(reviews);
        
        // const pageSize = 5;
        // const totalCourses = coursesFull.length;
        // const totalPages = Math.ceil(totalCourses / pageSize);
        // const pageNumber = parseInt(req.query.page) || 1;
        // const skipAmount = (pageNumber - 1) * pageSize;
        // const courses = await CourseService.filteredSortedPaging(
        //   searchField, courseName, tutorName, faculty, average, minPrice, maxPrice, sortByField, sortByOrder, skipAmount, pageSize
        // );
        // const role = "user";
        // const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        // const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
        // var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
        // var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;

        if (reviews) {
            res.status(200).json({ reviews, });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }


      
    }
    catch (err) {
        next(err); // Nếu có lỗi, chuyển lỗi đến middleware xử lý lỗi tiếp theo
    }
}


module.exports = {
    store,
    getReviewsForPaging,
};