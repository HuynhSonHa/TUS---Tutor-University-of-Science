const Course = require("../models/Course");
const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Review");
const { validationResult } = require("express-validator");
const { mutipleMongooseToObject, mongooseToObject } = require("../util/mongoose");
const BeTutor = require("../models/BeTutor");
const CourseService = require("../services/product");
const UserService = require("../services/user");
const profileService = require("../services/profile");
const RoomChat = require("../models/Roomchat");


// [GET] /tutor/stored/courses
const storedCourses = async (req, res, next) => {
  //tính toán phân trang
  const pageSize = 4;
  //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
  const coursesFull = await Course.find({ tutor: req.user._id });
  const totalCourses = coursesFull.length;
  const totalPages = Math.ceil(totalCourses / pageSize);
  const pageNumber = parseInt(req.query.page) || 1;
  const skipAmount = (pageNumber - 1) * pageSize;
  //const courses = await Course.find({ tutor: req.user._id })

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
  var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
  var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;
  console.log(coursesFull.length);

  const userId = req.user._id;
  const user = await User.findById(userId).populate('avatar');
  const namePage = "courses";
  console.log(user)
  //Tìm những khóa học của tutor này đăng
  Course.find({ tutor: req.user._id }).skip(skipAmount).limit(pageSize)
    .then((courses) => {
      res.render("tutormode/viewCourseList", {
        courses: mutipleMongooseToObject(courses),
        user: mongooseToObject(user),
        pages: pages,
        prevPage: prevPage,
        currentPage: currentPage,
        nextPage: nextPage,
        namePage: namePage,
        layout: 'tutor',

      });
    })
    .catch(next);
  //res.render("me/stored-courses");
}

const storedCoursesAjax = async (req, res, next) => {
  //Dùng để xử lý ajax trang phía trên
  try {
    const pageSize = 4;
    //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
    const coursesFull = await Course.find({ tutor: req.user._id });
    const totalCourses = coursesFull.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    //const courses = await Course.find({ tutor: req.user._id });
    console.log('abc')
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;

    const namePage = "courses";
    const userId = req.user._id;
    const user = await User.findById(userId).populate('avatar');
    console.log('cat1');
    const numCourse = coursesFull.length
    Course.find({ tutor: req.user._id }).skip(skipAmount).limit(pageSize)
      .then((courses) => {
        console.log(courses);
          console.log('cat2')
          console.log(pages)
          console.log(prevPage)
          console.log(nextPage)
          console.log(currentPage)
         
        res.status(200).json({
          courses: mutipleMongooseToObject(courses),
          numCourse: numCourse,
          pages: pages,
          prevPage: prevPage,
          currentPage: currentPage,
          nextPage: nextPage,
          namePage: namePage,
          layout: 'tutor',
        });
      })
      .catch(next);
  } catch (err) {
    // Handle errors specific to the initial user retrieval (e.g., user not found)
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const storedWaitingListAjax = async (req, res, next) => {
  //Dùng để xử lý ajax trang ở dưới
  try {
    const courses = await Course.find({ tutor: req.user._id }).select('_id');
    const courseIds = courses.map(course => course._id);

    const orders = await Order.find({ courseId: { $in: courseIds }, status: "Subscribing" }).populate('userId courseId');
   
    const orderIds = orders.map(order => order._id);
    const roomChats = await RoomChat.find({ OrderId: { $in: orderIds } }).populate('OrderId');
    const pageSize = 4;
    const totalCourses = orders.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const namePage = "waiting-list";
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;

    const userId = req.user._id;
    const user = await User.findById(userId).populate('avatar');

    let amountOfStudents = orders.length;

    const orderList = await Order.find({ courseId: { $in: courseIds }, status: "Subscribing" })
      .populate('userId courseId')
      .skip(skipAmount)
      .limit(pageSize);

    res.status(200).json({
      orders: mutipleMongooseToObject(orderList),
      amountOfStudents: amountOfStudents,
      roomChats: mutipleMongooseToObject(roomChats),
      pages: pages,
      prevPage: prevPage,
      currentPage: currentPage,
      nextPage: nextPage,
      namePage: namePage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// [GET] /tutor/stored/waiting-list
const storedStudents = async (req, res, next) => {
  //const orders = await Order.find({ courseId.tutor: req.user._id ,status: "Subscribing"}).populate('userId courseId');
  //TÌm ra những khóa học của chính tutor này. Sau đó lấy ra được 1 list courseId để đem qua order
  const courses = await Course.find({ tutor: req.user._id }).select('_id');
  const courseIds = courses.map(course => course._id);

  // Find orders for those courses
  const orders = await Order.find({ courseId: { $in: courseIds }, status: "Subscribing" }).populate('userId courseId');
  const roomChats = await RoomChat.find({}).populate('OrderId');

  //tính toán phân trang
  const pageSize = 4;
  //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
  const totalCourses = orders.length;
  const totalPages = Math.ceil(totalCourses / pageSize);
  const pageNumber = parseInt(req.query.page) || 1;
  const skipAmount = (pageNumber - 1) * pageSize;
  const namePage = "waiting-list";
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
  var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
  var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;
  console.log(orders.length);

  const userId = req.user._id;
  const user = await User.findById(userId).populate('avatar');
  let amountOfStudents;
  if (orders === null || orders.length === 0) {
    amountOfStudents = 0;
  } else {
    amountOfStudents = orders.length;
  }
  const orderList = await Order.find({ courseId: { $in: courseIds }, status: "Subscribing" }).populate('userId courseId').skip(skipAmount).limit(pageSize);
  //console.log(orders);
  console.log(amountOfStudents);
  console.log('hahahaha111');

  res.render("tutormode/studentWaittingList", {
    orders: mutipleMongooseToObject(orderList),
    amountOfStudents: amountOfStudents,
    user: mongooseToObject(user),
    pages: pages,
    roomChats: mutipleMongooseToObject(roomChats),
    prevPage: prevPage,
    currentPage: currentPage,
    nextPage: nextPage,
    namePage: namePage,
    layout: 'tutor',
  })
}


// [GET] /tutor/create
const createCourse = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate('avatar');
  console.log(user)
  res.render("tutormode/createcourse", { user: mongooseToObject(user), layout: 'tutor', });

}

const createNewCourse = async (req, res, next) => {
  try {

    const result = validationResult(req);
    console.log("haha", result.array());
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
    }
    const formData = req.body;
    formData.tutor = req.user._id;
    formData.discount = formData.price;
    console.log(req)
    const course = new Course(formData);
    await course.save();

    return res.status(200).json({ success: true, msg: "Add course successfully!" });
    //return res.send("Thêm review thành công!").redirect("/user/home");
  }
  catch (err) {
    next(err);
  }
}

// [GET] /tutor/profile
const profile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Tìm user trong database dựa vào userId
    const user = await User.findById(userId).populate('avatar');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    console.log(user)

    res.render('tutormode/editprofile', { user: mongooseToObject(user), layout: 'tutor', });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

const courseDetail = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    console.log(course)
    console.log('haha')
    if (!course) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }


    res.render('tutormode/courseDetail', { course: mongooseToObject(course), layout: 'tutor', });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
//[POST] /tutor/profile


const editProfile = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    if (req.file) {
      await profileService.cropImage(req.file.filename);
      req.body.avatar = req.file.filename;
    }
    await User.updateOne({ _id: req.user._id }, req.body);
    res.status(200).json({ msg: 'Cập nhật thông tin thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
//[GET] /tutor/tutor-mode
const getTutorMode = async (req, res, next) => {
  //Tính toán leftDay, leftCourse 
  var leftDay = Number.MAX_SAFE_INTEGER;
  var leftCourse = Number.MAX_SAFE_INTEGER;
  const beTutors = await BeTutor.find({ tutorId: req.user._id, status: "accepted" }).populate('tutorId');
  for (let i = 0; i < beTutors.length; i++) {
    const uploadDuration = beTutors[i].tutorId.amountDayUpload * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const timeSincePost = Date.now() - new Date(beTutors[i].datePost).getTime(); // Calculate time since post in milliseconds
    const temp = uploadDuration - timeSincePost;
    if (temp > 0 && temp < leftDay) leftDay = temp;

    const amountCourseUploaded = await Course.find({ tutor: req.user._id }).countDocuments();
    console.log(beTutors[i].tutorId.amountCourseUpload, amountCourseUploaded)
    const tempCourse = beTutors[i].tutorId.amountCourseUpload - amountCourseUploaded;
    if (tempCourse > 0 && tempCourse < leftCourse) leftCourse = tempCourse;
  }
  leftDay = leftDay === Number.MAX_SAFE_INTEGER ? 0 : Math.ceil(leftDay / (24 * 60 * 60 * 1000));
  leftCourse = leftCourse === Number.MAX_SAFE_INTEGER ? 0 : leftCourse;
  console.log(leftDay, leftCourse);
  if (leftDay > 90000) {
    leftDay = "Unlimited";
  }
  if (leftCourse > 90000) {
    leftCourse = "Unlimited";
  }
  console.log(leftDay, leftCourse)


  const user = await User.findById(req.user._id).lean();
  res.render('tutormode/tutormode', {
    user: user,
    leftDay: leftDay,
    leftCourse: leftCourse,
    layout: 'tutor',
  });
}
//[GET] /tutor/
const getHomePage = async (req, res, next) => {
  try {
    const reviewList = await Review.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course"
        }
      },
      {
        $unwind: "$course"
      },
      {
        $project: {
          courseId: 1,
          userId: 1,
          rating: 1,
          comment: 1,
          datePost: 1,
          commentLength: { $strLenCP: "$comment" },
          user: 1, // include all fields from the user document
          course: 1 // include all fields from the course document
        }
      },
      {
        $sort: { rating: -1, commentLength: -1 }
      }
    ]).limit(3);

    const tutors = await User.find({ role: 'tutor' });
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
    console.log(userList);


    // console.log(JSON.stringify(reviewList, null, 2));
    res.render('home/tutorhome', { user: req.user, layout: 'tutor', reviewList: reviewList, userList: userList });
  } catch (error) {
    console.error(error);
    next(error);
  }


}
//[GET] /tutor/waitingStudent/Order._Id
const getDetailStudent = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('userId courseId');

  res.render('tutormode/detailStudent', {
    order: mongooseToObject(order),
    layout: 'tutor',
  })
}
//[GET] /tutor/accepted/Order._id
const acceptStudent = async (req, res, next) => {
  console.log("click accepted");
  try {
    const order = await Order.findById(req.params.id).populate('userId courseId');
    if (!order) {
      console.log("Không tìm thấy thông tin");
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    order.status = "Learning";
    console.log("Learning");
    await order.save();
    const courseId = order.courseId._id;
    const course = await Course.findById(courseId);
    course.totalPurchase = course.totalPurchase + 1;
    console.log(course.totalPurchase);
    await course.save();
    console.log(course.totalPurchase);
    return res.status(200).json({ msg: 'Accepted thành công!' });
  } catch {
    //console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
//[GET] /tutor/denied/Order._id
const denyStudent = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId courseId');
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    //await order.deleteOne({ _id: req.params.id });
    order.status = "denied";
    await order.save();
    return res.status(200).json({ msg: 'Denied thành công!' });
  } catch {
    //console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
// [GET] /tutor/courses?page=*;
const showAll = async (req, res, next) => {
  try {
    //lấy về thông tin để filter và sort
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
    const role = "tutor"
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;
    console.log(courses.length);

    res.render('catalog/category', {
      courses: courses,
      pages: pages,
      prevPage: prevPage,
      currentPage: currentPage,
      nextPage: nextPage,
      role: role,
      layout: 'tutor',

    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    next(error);
  }
}

// [GET] /tutor/courses/:id
const detail = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('tutor');
    if (!course) {
      return res.status(404).render("404"); // Handle the case where the product is not found
    }

    course.view = course.view + 1;
    await course.save();

    const coursesListOfTutor = await Course.find({ tutor: course.tutor }).populate('tutor');
    const reviews = await Review.find({ courseId: req.params.id }).populate('userId');
    let amountOfReviews;
    if (reviews === null || reviews.length === 0) {
      amountOfReviews = 0;
    } else {
      amountOfReviews = reviews.length;
    }
    const coursesListOfName = await Course.find({ name: course.name }).populate('tutor');
    console.log(coursesListOfName);
    res.render("courses/detail", {
      course: mongooseToObject(course),
      coursesListOfTutor: mutipleMongooseToObject(coursesListOfTutor),
      reviews: mutipleMongooseToObject(reviews),
      amountOfReviews: amountOfReviews,
      coursesListOfName: mutipleMongooseToObject(coursesListOfName),
      layout: 'tutor',
    });
  } catch (err) {
    next(err);
  }
}
//Giống bên user
// [GET] /tutor/premium
const getPremium = (req, res, next) => {
  const role = req.user.role;
  res.render('user/signuptotutor', { user: req.user, layout: role, role: role });
}
// [GET] /tutor/formTutor/123
const getFormTutor = (req, res, next) => {
  let price;
  if (req.params.page == '1') { price = 199000 }
  else if (req.params.page == '2') { price = 1999000 }
  else if (req.params.page == '3') { price = 3999000 };

  const role = req.user.role;
  res.render('user/formbetutor', {
    user: req.user,
    price: price,
    page: req.params.page,
    layout: role,
    role: role,
  });
}
// [POST] /tutor/formTutor/123
//fullname, phoneNumber, GPA, GPAfile
const postFormTutor = async (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log(result.array());
    res.status(400).json({ errors: result.array() });
    return;
  }
  //chống spam
  const checkBeTutor = await BeTutor.find({ tutorId: req.user._id, status: "waiting" });
  if (checkBeTutor.length > 0) return res.status(400).json({error: "Bạn đã đăng ký rồi! Hãy chờ admin phản hồi bạn!" });

  var leftDay = Number.MAX_SAFE_INTEGER;
  var leftCourse = Number.MAX_SAFE_INTEGER;
  const beTutors = await BeTutor.find({ tutorId: req.user._id, status: "accepted" }).populate('tutorId');
  //tao tính 
  for (let i = 0; i < beTutors.length; i++) {
    const uploadDuration = beTutors[i].tutorId.amountDayUpload * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const timeSincePost = Date.now() - new Date(beTutors[i].datePost).getTime(); // Calculate time since post in milliseconds
    const temp = uploadDuration - timeSincePost;
    if (temp > 0 && temp < leftDay) leftDay = temp;

    const amountCourseUploaded = await Course.find({ tutor: req.user._id }).countDocuments();
    console.log(beTutors[i].tutorId.amountCourseUpload, amountCourseUploaded)
    const tempCourse = beTutors[i].tutorId.amountCourseUpload - amountCourseUploaded;
    if (tempCourse > 0 && tempCourse < leftCourse) leftCourse = tempCourse;
  }
  leftDay = leftDay === Number.MAX_SAFE_INTEGER ? 0 : Math.ceil(leftDay / (24 * 60 * 60 * 1000));
  leftCourse = leftCourse === Number.MAX_SAFE_INTEGER ? 0 : leftCourse;
  if (leftDay > 0 || leftCourse > 0) {
    return res.status(400).json({error: "Bạn đã là tutor rồi! Hãy chờ hết hạn để đăng ký mới!" });
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
      return res.status(401).json({ success: false, error: 'Gửi thất bại' });
    }
    return res.status(200).json({ success: true, msg: "Đã gửi yêu cầu tới admin!" })

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
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
  const role = req.user.role;
  res.render('user/contactToTutor', {
    course: mongooseToObject(course),
    amountOfReviews: amountOfReviews,
    layout: role,
    role: role,
  });
}




const postContactToTutor = async (req, res, next) => {

  const result = validationResult(req);
  if (!result.isEmpty()) {
   // const errors = result.array().map(error => error.msg).join(', ');
  
    res.status(400).json({ errors: result.array()});
    return;
  }
  try {
    // Prevent spam
    const checkOrder = await Order.find({ userId: req.user._id, courseId: req.params.id, status: "Subscribing" });
    if (checkOrder.length > 0) {
      console.log("Ban da dang ky khoa hoc roi!")
      return res.status(400).json({error: "Bạn đã đăng ký khóa học rồi! Hãy chờ tutor accept bạn vào khóa học!" })
    }
    const checkOrder1 = await Order.find({ userId: req.user._id, courseId: req.params.id, status: "Learning" });
    if (checkOrder1.length > 0) {
      console.log("Ban da dang ky khoa hoc roi!")
      return res.status(400).json({error: "Bạn đang học khóa học này rồi!" })
    }

    const formData = req.body;
    formData.courseId = req.params.id;
    formData.userId = req.user._id;

    const order = new Order(formData);
    await order.save();
    console.log(order)
    const roomChat = new RoomChat({
      OrderId: order._id,
    })
    console.log(roomChat)
    await roomChat.save();
    return res.status(200).json({msg: "đã gửi contact thành công! Vui lòng chờ đợi phản hồi" });
  }
  catch (err) {
    next(err);
  }
}

const getChat = async (req, res, next) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate('courseId').lean();
  const roomChat = await RoomChat.findOne({ OrderId: orderId }).populate('OrderId').lean();
  console.log(roomChat)
  res.render("tutormode/texting", { roomChat: roomChat, layout: 'tutor', order: order});

}
//[POST] /tutor/texting/:id
const postChat = async (req, res, next) => {
  const order = req.params.id;
  const roomChat = await RoomChat.findOne({ OrderId: order });
  console.log(req.body.message);
  roomChat.TutorMessage.push(req.body.message);
  roomChat.message.push(req.body.message);
  await roomChat.save();
  res.status(200).json({ roomChat: mongooseToObject(roomChat) });
}

const getChangePassword = async (req, res, next) => {
  const role = req.user.role;
  res.render('tutormode/updatePassword', { user: req.user, layout: role, role: role });
}
const postChangePassword = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: "New password and confirmation do not match" });
    }
    const user = await User.findById(req.user._id);
    const isMatch = await user.validPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Mật khẩu cũ không đúng' });
    }
    user.password = user.encryptPassword(newPassword);
    await user.save();
    return res.status(200).json({ success: true, msg: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

module.exports = {
  storedCourses,
  storedStudents,
  profile,
  editProfile,
  getTutorMode,
  getHomePage,
  createCourse,
  getDetailStudent,
  acceptStudent,
  denyStudent,
  createNewCourse,
  courseDetail,
  storedCoursesAjax,
  showAll,
  detail,
  storedWaitingListAjax,
  getPremium,
  getFormTutor,
  postFormTutor,
  getContactToTutor,
  postContactToTutor,
  getChat,
  postChat,
  getChangePassword,
  postChangePassword,
};
