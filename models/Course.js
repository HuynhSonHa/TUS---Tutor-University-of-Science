const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CourseScheme = new Schema({
    // catalogId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Catalog' // Tham chiếu đến schema danh mục sản phẩm (Catalog)
    // },
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide name"],
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: 0
    },
    description: {
        type: String,
        trim: true,
        default: "None",
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    createDay: {
        type: Date,
        default: Date.now(),
    },
    view: {
        type: Number,
        default: 0,
        min: 0
    },
    // nhà sản xuất
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // sort theo tống số lần mua
    totalPurchase: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        required: [true, `Please provide status`],
        default: "Available"
    },
    faculty: {
        type: String,
    },
    school: {
        type: String,
    },
    studentCourse: {
        type: String,
    },
    average: {
        type: Number,
        default: 0,
        get: v => Math.round(v * 100) / 100, // Lấy giá trị với 2 số sau dấu thập phân
        set: v => Math.round(v * 100) / 100, // Set giá trị với 2 số sau dấu thập phân
    },
    schedule: [
        {
            type: String,
        }
    ],

});


module.exports = mongoose.model('Course', CourseScheme);