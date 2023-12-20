const Course = require("../models/Course");
const Review = require("../models/Review");
const { mongooseToObject, mutipleMongooseToObject } = require("../util/mongoose");
const CourseService = require("../services/product");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// [GET] /courses?page=*;
const showAll = async (req, res, next) => {
  try {
    const searchField = req.query.searchField;
    const courseName = req.query.courseName;
    const tutorName = req.query.tutorName;
    const faculty = req.query.faculty;
    const average = req.query.average;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sortByField = req.query.sortByField;
    const sortByOrder = req.query.sortByOrder;


    const pageSize = 12;
    //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
    const coursesFull = await CourseService.filteredAndSorted(
      searchField, courseName, tutorName, faculty, average, minPrice, maxPrice, sortByField, sortByOrder
    );
    const totalCourses = coursesFull.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const courses = await CourseService.filteredSortedPaging(
      searchField, courseName, tutorName, faculty, average, minPrice, maxPrice, sortByField, sortByOrder, skipAmount, pageSize
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
    const course = await Course.findById(req.params.id).populate('tutor');
    if (!course) {
      return res.status(404).render("404"); // Handle the case where the product is not found
    }

    const coursesListOfTutor = await Course.find({tutor: course.tutor}).populate('tutor');
    const reviews = await Review.find({ courseId: req.params.id }).populate('userId');
    let amountOfReviews;
    if (reviews === null || reviews.length === 0) {
      amountOfReviews = 0;
    } else {
      amountOfReviews = reviews.length;
    }
    const coursesListOfName = await Course.find({name: course.name}).populate('tutor');
    console.log(coursesListOfName);
    res.render("courses/detail", {
      course: mongooseToObject(course),
      coursesListOfTutor: mutipleMongooseToObject(coursesListOfTutor),
      reviews: mutipleMongooseToObject(reviews),
      amountOfReviews: amountOfReviews,
      coursesListOfName: mutipleMongooseToObject(coursesListOfName),
    });
  } catch (err) {
    next(err);
  }
}
// [GET] /courses/create
const createCourse = (req, res, next) => {
  res.render("tutormode/createcourse");
}
// [POST] /courses/store
const store = async(req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
  }
  //res.json(req.body);
  const checkList = await Course.find({name: req.body.name, tutor: req.user._id});
  if(checkList!=null) {
    return res.status(304).json({error: 'Bạn đã đăng khóa học này rồi!'})
  }
  const formData = req.body;
  
  const course = new Course(formData);
  course.save().then;
  return res.status(200).json({success: true, redirectUrl: '/tutor', msg: "Đăng khóa học thành công!"})
  //res.redirect("/tutor/");

}

// [GET] /courses/:id/edit
const edit = (req, res, next) => {
  Course.findById(req.params.id)
  .then((course) =>
    res.render("tutormode/editprofile", {
      course: mongooseToObject(course),
    })
  )
  .catch(next);
}

// [PUT] /courses/:id
const update = (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
  }
  Course.updateOne({ _id: req.params.id }, req.body)
  .then(() => res.status(200).json({success: true, redirectUrl: '/tutor', msg: "Chỉnh sửa khóa học thành công!"}))
  .catch(next);
  //res.json(req.body);
}

// [DELETE] /courses/:id
const destroy = (req, res, next) => {
  var id = new mongoose.Types.ObjectId(req.params.id);
  Course.deleteOne({ _id: id })
  .then(() => res.status(200).json({success: true, redirectUrl: '/tutor', msg: "Xóa khóa học thành công!"}))
  .catch((error) => {
    console.error("Lỗi khi xóa bản ghi:", error);
    next(error); // Chuyển error cho middleware xử lý lỗi
  });
}


module.exports = {
  showAll,
  detail,
  createCourse,
  store,
  edit,
  update,
  destroy,
};
