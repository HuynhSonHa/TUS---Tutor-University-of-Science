const Course = require("../models/Course");
const User = require("../models/User");
const BeTutor = require("../models/BeTutor");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Contact = require("../models/Contact");
const CourseService = require("../services/product");

const { validationResult } = require("express-validator");
const { mutipleMongooseToObject, mongooseToObject } = require("../util/mongoose");
const UserService = require("../services/user");

// [GET] /user/stored/courses
const storedCourses = async (req, res, next) => {
  const orders = Order.find({ userId: req.user._id }).populate('courseId userId');
  
  const pageSize = 4;
  //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
  const totalCourses = orders.length;
  const totalPages = Math.ceil(totalCourses / pageSize);
  const pageNumber = parseInt(req.query.page) || 1;
  const skipAmount = (pageNumber - 1) * pageSize;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
  var nextPage = currentPage + 1; if(nextPage > totalPages) nextPage = totalPages;
  var prevPage = currentPage - 1; if(prevPage < 1) prevPage = 1;
  console.log(orders.length);

  const orderList = Order.find({ userId: req.user._id }).populate('courseId userId').skip(skipAmount).limit(pageSize);
  res.render("user/stored-courses", {
    orders: mutipleMongooseToObject(orderList),
    user: mongooseToObject(req.user),
    pages: pages,
    prevPage: prevPage,
    currentPage: currentPage,
    nextPage: nextPage,
    namePage: namePage,
    layout: 'user',
  });
}

// [GET] /user/stored/courses/Order._id
const detailCourses = async (req, res, next) => {
  const order = Order.findById(req.params.id).populate('courseId userId');
  res.render("user/stored-courses", {
    orders: mongooseToObject(order),
    layout: 'user',
  });
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

    res.render('tutormode/editprofile', { user: mongooseToObject(user), layout: 'user', });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
//[POST] /tutor/profile
const editProfile = async (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    if (req.file) {
      req.body.avatar = req.file.filename;
    }
    User.updateOne({ _id: req.user._id }, req.body)
      .then(res.status(200).json({ msg: 'Cập nhật thông tin thành công' }))
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

// [GET] /user/premium
const getPremium = (req, res, next) => {
  res.render('user/signuptotutor', { user: req.user, layout: 'user', });
}
// [GET] /user/formTutor/123
const getFormTutor = (req, res, next) => {
  let price;
  if (req.params.page == '1') { price = 199000 }
  else if (req.params.page == '2') { price = 1999000 }
  else if (req.params.page == '3') { price = 3999000 };

  res.render('user/formbetutor', {
    user: req.user,
    price: price,
    page: req.params.page,
    layout: 'user',
  });
}
// [POST] /user/formTutor/123
//fullname, phoneNumber, GPA, GPAfile
const postFormTutor = async (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }

  let price;

  if (req.params.page == '1') { price = 199000 }
  else if (req.params.page == '2') { price = 1999000 }
  else if (req.params.page == '3') { price = 3999000 };
  try {
    const { fullname, phoneNumber, GPA, comment } = req.body;
    var savedUser = {
      fullname: req.body.fullname,
      phoneNumber: req.body.phoneNumber,
      GPA: req.body.GPA,
    }
    if (req.file) {
      savedUser.GPAfile = req.file.filename;
    }

    // Lưu user vào database
    try {
      await User.updateOne({ _id: req.user._id }, savedUser);
    } catch (updateError) {
      console.error(updateError);
      return res.status(400).json({ success: false, error: 'Cập nhật thông tin không thành công' });
    }
    let newTutor;
    newTutor = new BeTutor({
      price: price,
      tutorId: req.user._id,
      comment: req.body.comment,
    });
    try {
      await newTutor.save();
    } catch (saveError) {
      console.error(saveError);
      return res.status(400).json({ success: false, error: 'Gửi thất bại' });
    }
    return res.status(200).json({ success: true, msg: "Đã gửi yêu cầu tới admin!" })

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
// [GET] /user/contact/courseId
const getContact = async (req, res, next) => {

  const course = await Course.findById(req.params.id).populate('tutor');
  console.log(course)
  if (!course) {
    return res.status(404).render("404"); // Handle the case where the product is not found
  }

  return res.status(200).json({ success: true, msg: `/user/contactToTutor/${req.params.id}` })
  //return res.status(200).json({ success: true, msg: `/user/contacttutor` })
}


const getContactToTutor = async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate('tutor');
  const reviews = await Review.find({ courseId: req.params.id }).populate('userId');
  let amountOfReviews;

  if (reviews === null || reviews.length === 0) {
    amountOfReviews = 0;
  } else {
    amountOfReviews = reviews.length;
  }
  console.log(amountOfReviews)
  res.render('user/contactToTutor', { 
    course: mongooseToObject(course), 
    amountOfReviews: amountOfReviews, 
    layout: 'user',
  });
}

const postContactToTutor = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    const formData = req.body;
    formData.courseId = req.params.id;
    formData.userId = req.user._id;
    
    const order = new Order(formData);
    await order.save();
    console.log(order)
    return res.status(200).json({ success: true, msg: "đã gửi contact thành công! Vui lòng chờ đợi phản hồi" });
    //return res.send("Thêm review thành công!").redirect("/user/home");
  }
  catch (err) {
    next(err);
  }
}

//[GET] /user/home
const getHomePage = async (req, res, next) => {
  const reviewList = await Review.aggregate([
    {
      $project: {
        courseId: 1, // Include other fields as needed
        userId: 1,
        rating: 1,
        comment: 1,
        datePost: 1,
        commentLength: { $strLenCP: "$comment" } // Calculate the length of comment
      }
    },
    {
      $sort: { rating: -1, commentLength: -1, } // Sort by comment length in ascending order
    }
  ]).skip(0).limit(3);
  //console.log(reviewList);

  const tutors = await User.find({role: 'tutor'});
  let userList = await Promise.all(tutors.map(async (tutor) => {
      let averageRating = await UserService.getAverageRatingForTutor(tutor._id.toString());
      //console.log(averageRating);
      return {
          ...tutor.toObject(),
          averageRating: averageRating ? averageRating.averageRating : 0
      };
  }));
  // Sort the userList based on averageRating in descending order
  userList.sort((a, b) => b.averageRating - a.averageRating);

  // Apply skip and limit - here skip 0 and limit 4
  userList = userList.slice(0, 4);
  //console.log(userList);

  res.render('home/userHome', { user: req.user, layout: 'user', reviewList: reviewList, userList: userList});
}
// [GET] /user/courses?page=*;
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
    const role = "user";
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
      layout: 'user',
      role: role,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    next(error);
  }
}

// [GET] /user/courses/:id
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
      layout: 'user',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  storedCourses,
  detailCourses,
  profile,
  editProfile,
  getPremium,
  getFormTutor,
  postFormTutor,
  getContact,
  getHomePage,
  getContactToTutor,
  postContactToTutor,
  showAll,
  detail,
};
