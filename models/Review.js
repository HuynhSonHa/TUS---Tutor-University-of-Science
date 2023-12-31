const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const reviewSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Tham chiếu đến schema sản phẩm (Product)
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến schema người dùng (User)
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    required: [true, 'Please chose star rating'],
  },
  comment: {
    type: String,
    required: [true, 'Please provide comment'],
  },
  datePost: {
    type: Date,
    default: Date.now(),
  }
});


reviewSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Review', reviewSchema);

