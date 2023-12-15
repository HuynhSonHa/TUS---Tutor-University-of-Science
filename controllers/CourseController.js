const Course = require("../models/Course");
const Review = require("../models/Review");
const { mongooseToObject, mutipleMongooseToObject } = require("../util/mongoose");
const CourseService = require("../services/product");
const mongoose = require("mongoose");

// [GET] /courses?page=*;
const showAll = async (req, res, next) => {
  try {
    const courseName = req.query.courseName;
    const tutorName = req.query.tutorName;
    const status = req.query.status;
    const faculty = req.query.faculty;
    const average = req.query.average;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const manufacturer = req.query.manufacturer;
    const sortByField = req.query.sortByField;
    const sortByOrder = req.query.sortByOrder;


    const pageSize = 12;
    //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
    const coursesFull = await CourseService.filteredAndSorted(
      courseName, tutorName, status, faculty, average, minPrice, maxPrice, sortByField, sortByOrder
    );
    const totalCourses = coursesFull.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const courses = await CourseService.filteredSortedPaging(
      courseName, tutorName, status, faculty, average, minPrice, maxPrice, sortByField, sortByOrder, skipAmount, pageSize
    );
      
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if(nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if(prevPage < 1) prevPage = 1;
    console.log(courses.length);
  
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
const detail = async(req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).render("404"); // Handle the case where the product is not found
    }

    const coursesListOfTutor = await Course.find({tutor: course.tutor});
    const reviews = await Review.find({ productId: req.params.id });
    const coursesListOfName = await Course.find({name: course.name});

    res.render("courses/detail", {
      course: mongooseToObject(course),
      coursesListOfTutor: mutipleMongooseToObject(coursesListOfTutor),
      reviews: mutipleMongooseToObject(reviews),
      coursesListOfName: mutipleMongooseToObject(coursesListOfName),
    });
  } catch (err) {
    next(err);
  }
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
