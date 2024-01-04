const Order = require("../models/Order");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// [POST] /order/store/:courseId
const store = async (req, res, next) => {
    // Verify user input
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }
    try {
        //Chống spam
        const checkOrder = await Order.find({userId: req.user._id, courseId: req.params.id, status: "Subscribing"});
        if(checkOrder) return res.status(304).json({success: true, error: "Bạn đã đăng ký khóa học rồi! Hãy chờ tutor accept bạn vào khóa học!"})
        //Lưu Order mới
        const formData = req.body;
        formData.courseId = req.params.id;
        formData.userId = req.user._id;
        const order = new Order(formData);
        order.save().then;
        const successRedirect = (user.role === 'tutor') ? '/tutor/' : '/user/';
        return res.status(200).json({ success: true, redirectUrl: successRedirect, msg: "Đã đặt chỗ thành công. Hãy chờ tutor accept bạn nhé!"});
        //return res.status(200).json({success: true, redirectUrl: '/tutor'});
    }
    catch (err) {
        next(err);
    }
}


module.exports = {
    store, 
};