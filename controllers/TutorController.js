const Course = require("../models/Course");
const User = require("../models/User");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const { mutipleMongooseToObject, mongooseToObject } = require("../util/mongoose");
const BeTutor = require("../models/BeTutor");


// [GET] /tutor/stored/courses
const storedCourses = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate('avatar');
  console.log(user)
  Course.find({ tutor: req.user._id })
    .then((courses) => {
      res.render("tutormode/viewCourseList", {
        courses: mutipleMongooseToObject(courses),
        user: mongooseToObject(user),
      });
    })
    .catch(next);
  //res.render("me/stored-courses");
}

const storedCoursesAjax = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('avatar');
    console.log('cat1');

    Course.find({ tutor: req.user._id })
      .then((courses) => {
        console.log(courses);

        res.status(200).json({
          courses: mutipleMongooseToObject(courses),
        });
      })
      .catch(next);
  } catch (err) {
    // Handle errors specific to the initial user retrieval (e.g., user not found)
    console.error(err);
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
  const userId = req.user._id;
  const user = await User.findById(userId).populate('avatar');
  let amountOfStudents;
  if (orders === null || orders.length === 0) {
    amountOfStudents = 0;
  } else {
    amountOfStudents = orders.length;
  }
  console.log(orders);
  res.render("tutormode/studentWaittingList", {
    orders: mutipleMongooseToObject(orders),
    amountOfStudents: amountOfStudents,
    user: mongooseToObject(user),
  })
}


// [GET] /tutor/create
const createCourse = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate('avatar');
  console.log(user)
  res.render("tutormode/createcourse", { user: mongooseToObject(user) });

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

    res.render('tutormode/editprofile', { user: mongooseToObject(user) });
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


    res.render('tutormode/courseDetail', { course: mongooseToObject(course) });
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
  const beTutors = await BeTutor.find({ tutorId: req.user._id, status: "accepted" }).populate('tutorId');
  for (let i = 0; i < beTutors.length; i++) {
    const uploadDuration = beTutors[i].tutorId.amountDayUpload * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const timeSincePost = Date.now() - new Date(beTutors[i].datePost).getTime(); // Calculate time since post in milliseconds
    const temp = uploadDuration - timeSincePost;
    if (temp > 0 && temp < leftDay) leftDay = temp;
  }
  leftDay = leftDay === Number.MAX_SAFE_INTEGER ? 0 : Math.ceil(leftDay / (24 * 60 * 60 * 1000));
  console.log(leftDay);
  const user = await User.findById(req.user._id).lean();
  res.render('tutormode/tutormode', {
    user: user,
    leftDay: leftDay,
  });
}
//[GET] /tutor/
const getHomePage = (req, res, next) => {
  res.render('home/tutorhome');
}
//[GET] /tutor/waitingStudent/Order._Id
const getDetailStudent = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('userId courseId');

  res.render('tutormode/detailStudent', {
    order: mongooseToObject(order),
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
};
