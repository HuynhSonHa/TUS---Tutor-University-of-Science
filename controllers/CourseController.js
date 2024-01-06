const Course = require("../models/Course");
const User = require("../models/User");
const Review = require("../models/Review");
const Order = require("../models/Order");

const { mongooseToObject, mutipleMongooseToObject } = require("../util/mongoose");
const CourseService = require("../services/product");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// [GET] /courses?page=*;
const showAll = async (req, res, next) => {
  try {
    //Lấy giá trị trên query về để filter
    const searchField = req.query.searchField;
    const courseName = req.query.courseName;
    const tutorName = req.query.tutorName;
    const faculty = req.query.faculty;
    const studentCourse = req.query.studentCourse;
    const average = req.query.average;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sortByField = req.query.sortByField;
    const sortByOrder = req.query.sortByOrder;

    //tính toán phân trang
    const pageSize = 12;
    //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
    const coursesFull = await CourseService.filteredAndSorted(
      searchField, courseName, tutorName, faculty, studentCourse, average, minPrice, maxPrice, sortByField, sortByOrder
    );
    const totalCourses = coursesFull.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const courses = await CourseService.filteredSortedPaging(
      searchField, courseName, tutorName, faculty, studentCourse, average, minPrice, maxPrice, sortByField, sortByOrder, skipAmount, pageSize
    );
    const role = "guest";
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if(nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if(prevPage < 1) prevPage = 1;
    console.log(courses.length);
  
    res.render('catalog/category', {
      courses: courses,
      pages: pages,
      prevPage: prevPage,
      currentPage: currentPage,
      nextPage: nextPage,
      layout: 'guest',
      role: role,
    
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
    //Tìm kiếm những khóa học của cùng tutor
    const coursesListOfTutor = await Course.find({tutor: course.tutor}).populate('tutor');
    //Tìm kiếm những review của khóa học này
    const reviews = await Review.find({ courseId: req.params.id }).populate('userId');
    let amountOfReviews;
    if (reviews === null || reviews.length === 0) {
      amountOfReviews = 0;
    } else {
      amountOfReviews = reviews.length;
    }
    //TÌm kiếm những khóa học khác cùng môn học
    const coursesListOfName = await Course.find({name: course.name}).populate('tutor');
    console.log(coursesListOfName);
    res.render("courses/detail", {
      course: mongooseToObject(course),
      coursesListOfTutor: mutipleMongooseToObject(coursesListOfTutor),
      reviews: mutipleMongooseToObject(reviews),
      amountOfReviews: amountOfReviews,
      coursesListOfName: mutipleMongooseToObject(coursesListOfName),
      layout: 'guest',
    });
  } catch (err) {
    next(err);
  }
}
// [GET] /courses/create
const createCourse = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate('avatar');
  console.log(user)
  console.log('haha')
  res.render("tutormode/createcourse", { user: mongooseToObject(user),   layout: 'tutor', });
}
// [POST] /courses/store
const store = async(req, res, next) => {
  // Verify user input 
  // Kiểm tra bằng middleware xem người dùng nhập đúng không
  const result = validationResult(req);
  if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
  }
  //Kiểm tra spam
  const checkList = await Course.find({name: req.body.name, tutor: req.user._id});
  if(checkList!=null) {
    return res.status(304).json({error: 'Bạn đã đăng khóa học này rồi!'})
  }
  //Tạo khóa học mới
  const formData = req.body;
  formData.tutor = req.user._id;
  const course = new Course(formData);
  course.save().then;
  return res.status(200).json({success: true, redirectUrl: '/tutor', msg: "Đăng khóa học thành công!"})
  //res.redirect("/tutor/");

}

// [GET] /courses/edit/:id
const edit = (req, res, next) => {
  Course.findById(req.params.id).populate('tutor')
  .then((course) =>
    res.render("tutormode/editCourse", {
      course: mongooseToObject(course),
      layout: 'tutor',
    })
  )
  .catch(next);
}

// [GET] /courses/clone/:id
const clone = (req, res, next) => {
  Course.findById(req.params.id).populate('tutor')
  .then((course) =>
    res.render("tutormode/cloneCourse", {
      course: mongooseToObject(course),
      layout: 'tutor',
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
const destroy = async(req, res, next) => {
  var id = new mongoose.Types.ObjectId(req.params.id);
  //Xóa khóa học, cùng với các review và order liên quan đến nó 
  await Review.deleteMany({courseId: id});
  await Order.deleteMany({courseId: id});
  Course.deleteOne({ _id: id })
  .then(() => res.status(200).json({success: true, redirectUrl: '/tutor', msg: "Xóa khóa học thành công!"}))
  .catch((error) => {
    console.error("Lỗi khi xóa bản ghi:", error);
    next(error); // Chuyển error cho middleware xử lý lỗi
  });
}
const createNewCourse = async (req, res, next) => {
  try {
    const result = validationResult(req);
    console.log("haha", result.array());
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
    }
    console.log(req.body)
    //Tạo khóa học mới
    const formData = req.body;
    formData.tutor = req.user._id;
    const course = new Course(formData);
    console.log(course)
    await course.save();

    return res.status(200).json({ success: true, msg: "Thêm course thành công!" });
    //return res.send("Thêm review thành công!").redirect("/user/home");
  }
  catch (err) {

    next(err);
  }
}

module.exports = {
  showAll,
  detail,
  createCourse,
  store,
  edit,
  clone,
  update,
  destroy,
  createNewCourse,
};
