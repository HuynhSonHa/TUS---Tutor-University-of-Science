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
    type: String,
    //required: [true, 'Please provide fullname'],
  },
  email: {
    type: String,
    //required: [true, 'Please provide email'],
  },
  phoneNumber: {
    type: String,
    //required: [true, 'Please provide phone number'],
  },
  
  datePost: {
    type: Date,
    default: Date.now(),
  },


});

module.exports = mongoose.model('Contact', contactSchema);

