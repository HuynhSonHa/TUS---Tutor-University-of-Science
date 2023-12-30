const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  price: {
    type: Number,
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến schema người dùng (User)
    required: true
  },
  comment: {
    type: String,
    required: [true, 'Please provide comment'],
  },
  datePost: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "waiting", 
  },
});

module.exports = mongoose.model('BeTutor', tutorSchema);

