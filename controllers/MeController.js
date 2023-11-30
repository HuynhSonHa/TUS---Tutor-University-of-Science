const Course = require("../models/Course");
const { mutipleMongooseToObject } = require("../util/mongoose");


// [GET] /me/stored/courses
const storedCourses = async (req, res, next) => {
  Course.find({})
  .then((courses) => {
    res.render("me/stored-courses", {
      courses: mutipleMongooseToObject(courses),
    });
  })
  .catch(next);
  //res.render("me/stored-courses");
}


module.exports = {
  storedCourses,
};
