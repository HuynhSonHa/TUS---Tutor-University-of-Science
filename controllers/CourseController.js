const Course = require("../models/Course");
const { mongooseToObject } = require("../util/mongoose");
const mongoose = require("mongoose");

<<<<<<< Updated upstream

// [GET] /course/:slug
const show = (req, res, next) => {
  Course.findOne({ slug: req.params.slug })
  .then((course) => {
    res.render("courses/show", {
      course: mongooseToObject(course),
    });
  })
  .catch(next);
  //res.send("COURSE" + req.params.slug);
}

// [GET] /course/create
const create = (req, res, next) => {
  res.render("courses/create");
}

// [POST] /course/store
const store = (req, res, next) => {
  //res.json(req.body);
  const formData = req.body;
  formData.image =
    "https://img.youtube.com/vi/" + req.body.videoID + "/sddefault.jpg";
  const course = new Course(formData);
  course.save().then;
  res.redirect("/home");
}

// [GET] /course/:id/edit
const edit = (req, res, next) => {
  Course.findById(req.params.id)
  .then((course) =>
    res.render("courses/edit", {
      course: mongooseToObject(course),
    })
  )
  .catch(next);
}

// [PUT] /course/:id
const update = (req, res, next) => {
  Course.updateOne({ _id: req.params.id }, req.body)
  .then(() => res.redirect("/me/stored/courses"))
  .catch(next);
  //res.json(req.body);
}

// [DELETE] /courses/:id
const destroy = (req, res, next) => {
  var id = new mongoose.Types.ObjectId(req.params.id);
  Course.deleteOne({ _id: id })
  .then(() => res.redirect("back"))
  .catch((error) => {
    console.error("Lỗi khi xóa bản ghi:", error);
    next(error); // Chuyển error cho middleware xử lý lỗi
  });
}


module.exports = {
  show,
  create,
  store,
  edit,
  update,
  destroy,
};
=======
class CourseController {
  // [GET] /course/:slug
  show(req, res, next) {
    Course.findOne({ slug: req.params.slug })
      .then((course) => {
        res.render("courses/show", {
          course: mongooseToObject(course),
        });
      })
      .catch(next);
    //res.send("COURSE" + req.params.slug);
  }

  // [GET] /course/create
  create(req, res, next) {
    res.render("courses/create");
  }

  // [POST] /course/store
  store(req, res, next) {
    //res.json(req.body);
    const formData = req.body;
    formData.image =
      "https://img.youtube.com/vi/" + req.body.videoID + "/sddefault.jpg";
    const course = new Course(formData);
    course.save().then;
    res.redirect("/home");
  }

  // [GET] /course/:id/edit
  edit(req, res, next) {
    Course.findById(req.params.id)
      .then((course) =>
        res.render("courses/edit", {
          course: mongooseToObject(course),
        })
      )
      .catch(next);
  }

  // [PUT] /course/:id
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
    //res.json(req.body);
  }

  // [DELETE] /courses/:id
  destroy(req, res, next) {
    var id = new mongoose.Types.ObjectId(req.params.id);
    Course.deleteOne({ _id: id })
      .then(() => res.redirect("back"))
      .catch((error) => {
        console.error("Lỗi khi xóa bản ghi:", error);
        next(error); // Chuyển error cho middleware xử lý lỗi
      });
  }
}

module.exports = new CourseController();
>>>>>>> Stashed changes
