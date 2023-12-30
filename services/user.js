const mongoose = require('mongoose');
const Course = require('../models/Course'); // Adjust the path according to your project structure
const Review = require('../models/Review');

const getAverageRatingForTutor = async function (tutorId) {
    try {
        const result = await Course.aggregate([
            // Match the courses taught by the tutor
            { $match: { tutor: mongoose.Types.ObjectId(tutorId) } },

            // Join with the Review collection
            { $lookup: {
                from: 'reviews', // This should be the name of the collection in the database
                localField: '_id',
                foreignField: 'courseId',
                as: 'reviews'
            } },

            // Unwind the reviews array
            { $unwind: {
                path: '$reviews',
                preserveNullAndEmptyArrays: true // Keeps courses without reviews in the pipeline
            }},

            // Group by tutor and calculate the average rating
            { $group: {
                _id: '$tutor',
                averageRating: { $avg: '$reviews.rating' }
            }},

            // Project the final output
            { $project: {
                _id: 0,
                tutorId: '$_id',
                averageRating: { $ifNull: ['$averageRating', 0] } // Set default value if no reviews
            }}
        ]);

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Error calculating average rating:', error);
        throw error;
    }
}
module.exports = {
    getAverageRatingForTutor,
}