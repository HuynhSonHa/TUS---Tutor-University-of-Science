require("dotenv").config();
const Course = require("../models/Course.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
//const uploadToCloudinary = require("../config/cloudinary.js");

const mongoose = require("mongoose");

const filteredAndGetPagingReviews = async function (courseId, page) {
    try {
        if (mongoose.isValidObjectId(courseId)) {
            console.log("filter");
            const options = {
                page: parseInt(page, 10),
                limit: 5,
                sort: { datePost: -1 },
                populate: 'userId'
            }
            const result = await Review.paginate({ courseId: new mongoose.Types.ObjectId(courseId) }, options);
            console.log(result);
            return result;
        }
        else {
            return null;
        }
    } catch (error) {
        console.log("Error in filter and get paging from review");
        throw error;
    }
}



module.exports = {
    filteredAndGetPagingReviews,


}