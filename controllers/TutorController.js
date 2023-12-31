const Course = require("../models/Course");
const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Review");
const { validationResult } = require("express-validator");
const { mutipleMongooseToObject, mongooseToObject } = require("../util/mongoose");
const BeTutor = require("../models/BeTutor");
const CourseService = require("../services/product");
const UserService = require("../services/user");

// [GET] /tutor/stored/courses
const storedCourses = async (req, res, next) => {
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
  try {
    const courses = await Course.find({ tutor: req.user._id }).select('_id');
    const courseIds = courses.map(course => course._id);

    const orders = await Order.find({ courseId: { $in: courseIds }, status: "Subscribing" }).populate('userId courseId');

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
  const courses = await Course.find({ tutor: req.user._id }).select('_id');
  const courseIds = courses.map(course => course._id);

  // Find orders for those courses
  const orders = await Order.find({ courseId: { $in: courseIds }, status: "Subscribing" }).populate('userId courseId');

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
    const formData = req.body;
    formData.tutor = req.user._id;
    const course = new Course(formData);
    await course.save();

    return res.status(200).json({ success: true, msg: "Thêm course thành công!" });
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
//[GET] /tutor/tutor-mode
const getTutorMode = async (req, res, next) => {
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
  try {
    const order = await Order.findById(req.params.id).populate('userId courseId');
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    order.status = "Learning";
    await order.save();
    return res.status(200).json({ msg: 'Accepted thành công!' });
  } catch {
    console.error(error);
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
    await order.deleteOne({ _id: req.params.id });
    return res.status(200).json({ msg: 'Denied thành công!' });
  } catch {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
// [GET] /tutor/courses?page=*;
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
};
