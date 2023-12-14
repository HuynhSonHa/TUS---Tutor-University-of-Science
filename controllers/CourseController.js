const Course = require("../models/Course");
const { mongooseToObject, mutipleMongooseToObject } = require("../util/mongoose");
const mongoose = require("mongoose");

// [GET] /courses?page=*;
const showAll = async (req, res, next) => {
  try {
    const pageSize = 10;
    //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
    const coursesFull = await Course.find();
    const totalCourses = coursesFull.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const courses = await Course.find().skip(skipAmount).limit(pageSize);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if(nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if(prevPage < 1) prevPage = 1;
    console.log(pages);
    res.render('catalog/category', {
      courses: mutipleMongooseToObject(courses),
      pages: pages,
      prevPage: prevPage,
      currentPage: currentPage,
      nextPage: nextPage,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    next(error);
  }
}

// [GET] /courses/:id
const detail = (req, res, next) => {
  Course.findById(req.params.id)
  .then((course) => {
    res.render("courses/show", {
      course: mongooseToObject(course),
    });
  })
  .catch(next);
  //res.send("COURSE" + req.params.slug);
}

// [GET] /courses/create
const create = (req, res, next) => {
  res.render("courses/create");
}

// [POST] /courses/store
const store = (req, res, next) => {
  //res.json(req.body);
  const formData = req.body;
  formData.image =
    "https://img.youtube.com/vi/" + req.body.videoID + "/sddefault.jpg";
  const course = new Course(formData);
  course.save().then;
  res.redirect("/home");
}

// [GET] /courses/:id/edit
const edit = (req, res, next) => {
  Course.findById(req.params.id)
  .then((course) =>
    res.render("courses/edit", {
      course: mongooseToObject(course),
    })
  )
  .catch(next);
}

// [PUT] /courses/:id
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
  showAll,
  detail,
  create,
  store,
  edit,
  update,
  destroy,
};
