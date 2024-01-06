const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const CourseScheme = new Schema({
    // catalogId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Catalog' // Tham chiếu đến schema danh mục sản phẩm (Catalog)
    // },
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide name of course"],
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: 0
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please provide description of course'],
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
        
        default: "Available"
    },
    faculty: {
        type: String,
        required: [true, 'Please provide your faculty'],
    },
    school: {
        type: String,
        //required: [true, 'Please provide your school'],
        default: "HCMUS",
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
            required: [true, 'Please provide schedule'],
        }
    ],

});

CourseScheme.plugin(mongoosePaginate);

module.exports = mongoose.model('Course', CourseScheme);