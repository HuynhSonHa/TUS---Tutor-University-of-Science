const Order = require("../models/Order");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// [POST] /order/store/:courseId
const store = async (req, res, next) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map(error => error.msg).join(', ');
      console.log(errors);
      res.status(400).json({ errors: result.array()});
      return;
    }
    try {
      // Prevent spam
      const checkOrder = await Order.find({ userId: req.user._id, courseId: req.params.id, status: "Subscribing" });
        if (checkOrder.length > 0) {
        console.log("Ban da dang ky khoa hoc roi!")
        return res.status(400).json({error: "Bạn đã đăng ký khóa học rồi! Hãy chờ tutor accept bạn vào khóa học!" })
        }
        const checkOrder1 = await Order.find({ userId: req.user._id, courseId: req.params.id, status: "Learning" });
        if (checkOrder1.length > 0) {
        console.log("Ban da dang ky khoa hoc roi!")
        return res.status(400).json({error: "Bạn đang học khóa học này rồi!" })
        }

      const formData = req.body;
      formData.courseId = req.params.id;
      formData.userId = req.user._id;
  
      const order = new Order(formData);
      await order.save();
      console.log(order)
      const roomChat = new RoomChat({
        OrderId: order._id,
      })
      console.log(roomChat)
      await roomChat.save();
      return res.status(200).json({msg: "đã gửi contact thành công! Vui lòng chờ đợi phản hồi" });
    }
    catch (err) {
      next(err);
    }
  }


module.exports = {
    store, 
};