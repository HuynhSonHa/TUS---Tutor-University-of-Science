const Course = require("../models/Course");
const User = require("../models/User");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const { mutipleMongooseToObject, mongooseToObject } = require("../util/mongoose");


// [GET] /tutor/stored/courses
const storedCourses = async (req, res, next) => {
  Course.find({ tutor: req.user._id })
    .then((courses) => {
      res.render("me/stored-courses", {
        courses: mutipleMongooseToObject(courses),
      });
    })
    .catch(next);
  //res.render("me/stored-courses");
}

// [GET] /tutor/stored/waiting-list
const storedStudents = async (req, res, next) => {
  const orders = await Order.find({ 'courseId.tutor': req.user._id }).populate('userId courseId');
  let amountOfStudents;
  if (orders === null || orders.length === 0) {
    amountOfStudents = 0;
  } else {
    amountOfStudents = orders.length;
  }
  res.render("tutormode/waitingStudent", {
    orders: mutipleMongooseToObject(orders),
    amountOfStudents: amountOfStudents,
  })
}

// [GET] /tutor/create
const createCourse = (req, res, next) => {
  res.render("tutormode/createcourse");
}

const createNewCourse = async (req, res, next) => {
  console.log(req.body)
  try {
  
    const formData = req.body;
    formData.tutor = req.user._id;
    const course = new Course(formData);
    console.log('haha2')
    console.log(course)

    await course.save();


    return res.status(200).json({ success: true, msg: "Thêm course thành công!" });
    //return res.send("Thêm review thành công!").redirect("/user/home");
  }
  catch (err) {
    next(err);
  }
}

// [GET] /tutor/profile
const profile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Tìm user trong database dựa vào userId
    const user = await User.findById(userId).populate('avatar');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    console.log(user)

    res.render('tutormode/editprofile', { user: mongooseToObject(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
//[POST] /tutor/profile
const editProfile = async (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    if (req.file) {
      req.body.avatar = req.file.filename;
    }
    User.updateOne({ _id: req.user._id }, req.body)
      .then(res.status(200).json({ msg: 'Cập nhật thông tin thành công' }))
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
//[GET] /tutor/tutor-mode
const getTutorMode = (req, res, next) => {
  res.render('tutormode/tutormode', { user: req.user });
}
//[GET] /tutor/
const getHomePage = (req, res, next) => {
  res.render('home/tutorhome');
}
//[GET] /tutor/waitingStudent/Order._Id
const getDetailStudent = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('userId courseId');

  res.render('tutormode/detailStudent', {
    order: mongooseToObject(order),
  })
}
//[GET] /tutor/accepted/Order._id
const acceptStudent = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId courseId');
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    order.status = "Learning";
    await order.save();
    return res.status(200).json({ msg: 'Accepted thành công!' });
  } catch {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
//[GET] /tutor/denied/Order._id
const denyStudent = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId courseId');
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    await order.deleteOne({ _id: req.params.id });
    return res.status(200).json({ msg: 'Denied thành công!' });
  } catch {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
module.exports = {
  storedCourses,
  storedStudents,
  profile,
  editProfile,
  getTutorMode,
  getHomePage,
  createCourse,
  getDetailStudent,
  acceptStudent,
  denyStudent,
  createNewCourse,
};
