const Course = require("../models/Course");
const User = require("../models/User");
const Order = require("../models/Order");
const { mutipleMongooseToObject } = require("../util/mongoose");


// [GET] /tutor/stored/courses
const storedCourses = async (req, res, next) => {
  Course.find({tutor: req.user._id})
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
    res.render("tutormode/", {
        orders: orders,
        amountOfStudents: amountOfStudents,
    })
    // Course.find({manufacturer: req.params.id})
    // .then((courses) => {
    //   res.render("me/stored-courses", {
    //     courses: mutipleMongooseToObject(courses),
    //   });
    // })
    // .catch(next);
    //res.render("me/stored-courses");
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

    res.render('me/profile', { user });
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
}
}

//[GET] /tutor/home
const getHomePage = (req, res, next) => {
  res.render('home/tutorHome', { user: req.user });
}

module.exports = {
  storedCourses,
  storedStudents,
  profile,
  getHomePage,
};
