const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderScheme = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Tham chiếu đến user mà đặt hàng 
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Tham chiếu đến schema sản phẩm (Product)
        required: true
    },
    status: {
        type: String,
        default: "Subscribing",
    },
    datePost: {
        type: Date,
        default: Date.now(),
    }
    // subTotal: {
    //     type: Number,
    //     default: 0
    // },
    // discount: {
    //     type: Number,
    //     default: 0
    // },
    // shipping: {
    //     type: Number,
    //     default: 0
    // },
    // total: {
    //     type: Number,
    //     default: 0
    // },
    // phoneNumber: {
    //     type: String,
    //     required: [true, "Please provide phonenumber"]
    // },
    // fullname: {
    //     type: String,
    //     maxLength: 20,
    //     default: "full name",
    //     trim: true,
    // },
});


module.exports = mongoose.model('Order', OrderScheme);