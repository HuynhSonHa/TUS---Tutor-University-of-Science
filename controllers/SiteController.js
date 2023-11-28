const Course = require("../models/Course");
const { mutipleMongooseToObject } = require("../../util/mongoose");

class SiteController {
  // [GET] /home
  async index(req, res, next) {
    Course.find({})
      .then((courses) => {
        res.render("home", {
          courses: mutipleMongooseToObject(courses),
        });
      })
      .catch(next);
    // Course.find({})
    //   .lean()
    //   .then((courses) => {
    //     Course.find({}).lean();
    //     res.render("home", { courses: courses });
    //   })
    //   .catch((error) => {
    //     next(error);
    //   });
    // Course.find({}, function (err, courses) {
    //   if (!err) {
    //     res.json(courses);
    //   } else {
    //     next(err);
    //     //res.status(400).json({ err: "ERROR!!!" });
    //   }
    // });
    // try {
    //   const courses = await Course.find({});
    //   res.json(courses);
    // } catch (error) {
    //   res.status(400).json({ err: "ERROR!!!" });
    // }
    //res.render("home  ")
  }

  // [GET] /search
  search(req, res) {
    res.render("search");
  }
}

module.exports = new SiteController();
