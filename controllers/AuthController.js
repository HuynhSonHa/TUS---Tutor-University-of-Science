const passport = require('../middlewares/passport');
const User = require('../models/User');
const Course = require("../models/Course");

const Review = require("../models/Review");
const storage = require('../config/multer');
const { sendMail } = require("./mailAPI");
const { validationResult } = require("express-validator");
const UserService = require("../services/user");
require("dotenv").config();

//[GET] /
const getHomePage = async(req, res, next) => {
  try {
    //Tìm kiếm 3 bài review có rating cao nhất và viết comment dài nhất
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

    // Tìm kiếm 4 tutor có rating cao nhất dựa trên các bài review
    // Gọi service để tính average rating cho từng tutor
    const tutors = await User.find({ role: 'tutor' });
    let userList = await Promise.all(tutors.map(async (tutor) => {
      let averageRating = await UserService.getAverageRatingForTutor(tutor._id.toString());
      //console.log(averageRating);
      return {
        ...tutor.toObject(),
        averageRating: averageRating ? averageRating.averageRating : 0
      };
    }));
    // Sort danh sách tutor theo average rating đã tính ở trên
    userList.sort((a, b) => b.averageRating - a.averageRating);
    // Lấy ra 4 tutor có average rating cao nhất
    userList = userList.slice(0, 4);
    console.log(userList);

    // console.log(JSON.stringify(reviewList, null, 2));
    res.render('home/home', {  layout: 'guest', reviewList: reviewList, userList: userList});
  } catch (error) {
    console.error(error);
    next(error);
  }
  
};

//[GET] /signin
const getSignIn = (req, res, next) => {
  res.render("auth/signin");
};

//[POST] /signin
const postSignIn = (req, res, next) => {
  // passport.authenticate('local', {
  //   successRedirect: '/user/home',
  //   failureRedirect: '/signin',
  //   failureFlash: true,
  // })(req, res, next);// Thêm dòng này để gọi hàm authenticate

  // Verify user input by middleware express-validator
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  //Sử dụng passport.local để xác thực
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed, redirect to the sign-in page
      return res.status(400).json({ error: 'Đăng nhập thất bại' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Check user role and set the successRedirect accordingly
      let successRedirect;
      if (user.role === 'admin') successRedirect = '/admin';
      else if (user.role === 'tutor') successRedirect = '/tutor';
      else successRedirect = '/user';
      //const successRedirect = (user.role === 'tutor') ? '/tutor/' : '/user/';
      //return res.redirect(successRedirect);
      return res.status(200).json({ success: true, redirectUrl: successRedirect, msg: "Đăng nhập thành công!" });
    });
  })(req, res, next);
};

//[GET] /signup
const getSignUp = (req, res, next) => {
  res.render("auth/signup");
};

// [POST] /signup
const postSignUp = (req, res, next) => {
  // Verify user input by middleware express-validator
  const result = validationResult(req);
  console.log(result.array());
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  // Kiểm tra xem password và confirm password có khớp nhau không
  if (req.body.password != req.body.passwordConfirmation) {
    return res.status(400).json({ error: 'Confirm Password is not match with Password!' });
  }
  //Tìm trong db xem có user nào thỏa không
  User.findOne({ 'username': req.body.username })
    .then((user) => {
      //Nếu tồn tại, báo lỗi
      if (user) {
        return res.status(400).json({ error: 'Username is already in use.' });
      }
      else {
        //Tạo user mới
        var newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        //Hashing password
        newUser.password = newUser.encryptPassword(req.body.password);

        // Nếu có ảnh đại diện được tải lên
        // if (req.file) {
        //   // Gán id của ảnh đại diện cho user
        //   console.log(req.file.filename);
        //   newUser.avatar = req.file.filename;
        // }
        newUser.save()
          .then(() => {
            res.status(200).json({ success: true, redirectUrl: '/signin' });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
          });
      }

    })
    .catch(next);
};

//[GET] /forget-password
const getForgetPassword = (req, res, next) => {
  var messages = req.flash('error');
  res.render('auth/forgetPassword', {
    messages: messages,
    hasErrors: messages.length > 0,

  });
};

//[POST] /forget-password
const postForgetPassword = async (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    const { email } = req.body;
    console.log(email);
    //Tìm kiếm user đã đăng ký email này
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ error: "Email này không tồn tại" });
    }
    else {
      //const secret = process.env.JWT_SECRET + user.password;
      //const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "30m" });
      const resetPasswordLink = `${process.env.WEBSITE_URL}/reset-password?id=${user._id}`;
      // Nội dung gửi email
      const mailOption = {
        to: email,
        subject: "Reset Password",
        text: ``,
        html: `<h3>Dear ${user.username} </h3>, <br>
            <p>We will give user the reset link below:<br>
            ${resetPasswordLink}<br>
            access to this link reset your password.<br>
            Regrad</p>`
      }
      //Gọi hàm gửi email bên ./mailAPI.js
      sendMail(mailOption).then(result => { console.log(result) }).catch(e => { console.log(e) });
      res.send("Please check your email to reset password .....");
    }

  } catch (error) {
    next(error)
  }
};

//[GET] /reset-password?id=
const getResetPassword = async (req, res, next) => {
  try {
    const { id } = req.query;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ error: "Not found" });
    }
    else {
      // Successfull because error will throw 
      res.render("auth/resetPassword", { id: user._id })
    }
  } catch (error) {
    next(error);
  }
};

//[POST] /reset-password?id=
const postResetPassword = async (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    //Nhập password và confirm password mới
    const { password, password2 } = req.body;

    if (password !== password2) {
      res.status(400).json({ error: "New password and confirmation do not match" });
    }

    const { id } = req.query;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ error: "Not found user or id invalid!" });
    }
    else {

      user.password = user.encryptPassword(password);
      await user.save();

      res.status(200).send("Change password successfully!");
    }

  } catch (error) {
    next(error);
  }
};

const Logout = async (req, res) => {
  //Sử dụng passport
  req.logout(() => {
    res.redirect('/');
  });
};

module.exports = {
  getHomePage,
  getSignIn,
  postSignIn,
  getSignUp,
  postSignUp,
  getForgetPassword,
  postForgetPassword,
  getResetPassword,
  postResetPassword,
  Logout,
}

