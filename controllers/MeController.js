const Course = require("../models/Course");
<<<<<<< Updated upstream
const User = require("../models/User")
const { mutipleMongooseToObject } = require("../util/mongoose");


// [GET] /me/stored/courses/id
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

// [GET] /me/profile/id
const profile = async (req, res, next) => {
  try {
    const userId = req.params.id;

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

module.exports = {
  storedCourses,
  profile,
};
=======
const { mutipleMongooseToObject } = require("../util/mongoose");

class MeController {
  // [GET] /me/stored/courses
  async storedCourses(req, res, next) {
    Course.find({})
      .then((courses) => {
        res.render("me/stored-courses", {
          courses: mutipleMongooseToObject(courses),
        });
      })
      .catch(next);
    //res.render("me/stored-courses");
  }
}

module.exports = new MeController();
>>>>>>> Stashed changes
