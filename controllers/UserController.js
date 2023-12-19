const Course = require("../models/Course");
const User = require("../models/User")
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

    res.render('me/profile', { user });
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
}
}

const getPremium = (req, res, next) => {
  res.render('user/signuptotutor', { user: req.user });
}

const getFormTutor = (req, res, next) => {
  res.render('user/formbetutor', { user: req.user });
}

//[GET] /user/home
const getHomePage = (req, res, next) => {
  res.render('home/userHome', { user: req.user });
}

module.exports = {
  storedCourses,
  profile,
  getPremium,
  getFormTutor,
  getHomePage,
};
