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
    desiredGPA: {
        type: Number,
        required: [true, 'Please provide desired GPA'],
    },
    comment: {
        type: String,
        required: [true, 'Please provide comment'],
    },
    status: {
        type: String,
        default: "Subscribing",
    },
    datePost: {
        type: Date,
        default: Date.now(),
    }
    
    
});


module.exports = mongoose.model('Order', OrderScheme);