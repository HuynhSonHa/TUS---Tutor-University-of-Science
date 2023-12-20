const Course = require("../models/Course");
const User = require("../models/User");
const BeTutor = require("../models/BeTutor");
const { validationResult } = require("express-validator");
const { mutipleMongooseToObject } = require("../util/mongoose");


// [GET] /user/stored/courses/id
const storedCourses = async (req, res, next) => {
  Course.find({manufacturer: req.params.id})
  .then((courses) => {
    res.render("me/stored-courses", {
      courses: mutipleMongooseToObject(courses),
    });
  })
  .catch(next);
  //res.render("me/stored-courses");
}

// [GET] /user/profile
const profile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Tìm user trong database dựa vào userId
    const user = await User.findById(userId).populate('avatar');

    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.render('tutormode/editprofile', { user });
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
}
}
//[POST] /tutor/profile
const editProfile = async(req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
  }
  try {
    User.updateOne({_id: req.user._id}, req.body)
    .then(res.status(200).json({msg: 'Cập nhật thông tin thành công'}))
  } catch(error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

// [GET] /user/premium
const getPremium = (req, res, next) => {
  res.render('user/signuptotutor', { user: req.user });
}
// [GET] /user/formTutor/123
const getFormTutor = (req, res, next) => {
  let price;
  if(req.params.page == '1') {price = 199000} 
  else if(req.params.page == '2') {price = 1999000} 
  else if(req.params.page == '3') {price = 3999000};

  res.render('user/formbetutor', { 
    user: req.user,
    price: price, 
    page: req.params.page,
  });
}
// [POST] /user/formTutor/123
//fullname, phoneNumber, GPA, GPAfile
const postFormTutor = async(req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
  }

  let price;
  console.log('haha')
  if(req.params.page == '1') {price = 199000} 
  else if(req.params.page == '2') {price = 1999000} 
  else if(req.params.page == '3') {price = 3999000};
  try {
    const { fullname, phoneNumber, GPA, comment } = req.body;
    var savedUser = {
      fullname: req.body.fullname,
      phoneNumber: req.body.phoneNumber,
      GPA: req.body.GPA,
    }
    if (req.file) {
      savedUser.GPAfile = req.file.filename;
    }

    // Lưu user vào database
    try {
      await User.updateOne({_id: req.user._id}, savedUser);
    } catch (updateError) {
      console.error(updateError);
      return res.status(400).json({ success: false, error: 'Cập nhật thông tin không thành công' });
    }
    let newTutor;
    newTutor = new BeTutor({
      price: price,
      tutorId: req.user._id,
      comment: req.body.comment,
    });
    try {
      await newTutor.save();
    } catch (saveError) {
      console.error(saveError);
      return res.status(400).json({ success: false, error: 'Gửi thất bại' });
    }
    return res.status(200).json({ success: true, msg: "Đã gửi yêu cầu tới admin!"})
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
// [GET] /user/formTutor/courseId
const getContact = async(req, res, next) => {
  const course = await Course.findById(req.params.id).populate('tutor');
    if (!course) {
      return res.status(404).render("404"); // Handle the case where the product is not found
    }

  res.render('user/contacttutor', { 
    user: req.user,
    course: course,
  });
}

//[GET] /user/home
const getHomePage = (req, res, next) => {
  res.render('home/userHome', { user: req.user });
}

module.exports = {
  storedCourses,
  profile,
  editProfile,
  getPremium,
  getFormTutor,
  postFormTutor,
  getContact,
  getHomePage,
};
