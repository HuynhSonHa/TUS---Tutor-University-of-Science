require("dotenv").config();
const Course = require("../models/Course.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
//const uploadToCloudinary = require("../config/cloudinary.js");

const mongoose = require("mongoose");

const filteredAndGetPagingCourse = async function (page) {
    try {
       
            console.log("filter");
            const options = {
                page: parseInt(page, 10),
                limit: 10,
                sort: { datePost: -1 },
                populate: 'tutor'
            }
            const result = await Course.paginate({},options);
            console.log(result);
            return result;

    } catch (error) {
        console.log("Error in filter and get paging from review");
        throw error;
    }
}



module.exports = {
    filteredAndGetPagingCourse,


}