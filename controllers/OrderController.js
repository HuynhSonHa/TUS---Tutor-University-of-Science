const Order = require("../models/Order");
const mongoose = require("mongoose");

// [POST] /order/store/:courseId
const store = async (req, res, next) => {
    try {
        const formData = req.body;
        formData.courseId = req.params.id;
        formData.userId = req.user._id;
        const order = new Order(formData);
        order.save().then;
        res.send("Đã gửi yêu cầu đến tutor").redirect("/user/home");
    }
    catch (err) {
        next(err);
    }
}


module.exports = {
    store, 
};