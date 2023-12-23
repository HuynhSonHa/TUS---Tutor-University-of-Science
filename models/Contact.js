const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
  fullname: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  desiredGPA: {
    type: Number
  },
  comment: {
    type: String,
  },
  datePost: {
    type: Date,
    default: Date.now(),
  },


});

module.exports = mongoose.model('Contact', contactSchema);

