<<<<<<< Updated upstream
const passport = require('../middlewares/passport');
const User = require('../models/User');
const storage = require('../config/multer');
//[GET] /
const getHomePage = (req, res, next) => {
  res.render('home/home');
};

//[GET] /signin
const getSignIn = (req, res, next) => {
=======
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/User');

//[GET] /
exports.index = function (req, res, next) {
  res.render('index');
};
//[GET] /signin
exports.getSignIn = function (req, res, next) {
>>>>>>> Stashed changes
  var messages = req.flash('error');
  res.render('login/signin', {
    messages: messages,
    hasErrors: messages.length > 0,
  });
};
<<<<<<< Updated upstream

//[POST] /signin
const postSignIn = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true,
  })(req, res, next);// Thêm dòng này để gọi hàm authenticate
};

//[GET] /signup
const getSignUp = (req, res, next) => {
=======
//[POST] /signin
exports.postSignIn = function(req, res, next){
  User.findOne({ 'username': req.body.username })
  .then((user) => {
    if (!user) {
      res.redirect("login/signin")
      res.status(400).json({ error: 'Not user found' });
    }
    else if (!user.validPassword(req.body.password)) {
      res.redirect("login/signin")
      res.status(400).json({ error: 'Wrong password' });
    }
    else {
      res.redirect("/home");
      //res.status(200).json({ message: 'Sign in successfully' });
    }
  })
  .catch(next);
};

//[GET] /signup
exports.getSignUp = function (req, res, next) {
>>>>>>> Stashed changes
  var messages = req.flash('error');
  res.render('login/signup', {
    messages: messages,
    hasErrors: messages.length > 0,
  });
};
<<<<<<< Updated upstream

// [POST] /signup
const postSignUp = (req, res, next) => {
  if(req.body.password != req.body.re_password) {
    return res.status(201).json({ error: 'Re_Password is not match with Password!' }).redirect("/signup");
  }
  User.findOne({ 'username': req.body.username })
  .then( (user) => {
    if (user) {
      return res.status(201).json({ error: 'Username is already in use.' });
    }
    else {
      var newUser = new User();
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.password = newUser.encryptPassword(req.body.password);
      newUser.fullname = req.body.fullname;
      // Nếu có ảnh đại diện được tải lên
      if (req.file) {
        // Gán id của ảnh đại diện cho user
        console.log(req.file.filename);
        newUser.avatar = req.file.filename;
      }
      newUser.save()
      .then(() => {
        res.status(201).redirect("/signin");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    }
    
  })
  .catch(next);
};

module.exports = {
  getHomePage,
  getSignIn,
  postSignIn,
  getSignUp, 
  postSignUp,
}

=======
// [POST] /signup
exports.postSignUp = function(req, res, next) {
  User.findOne({ 'username': req.body.username })
  .then( (user) => {
    if (user) {
      res.redirect("login/signup");
      return res.json({ error: 'Username is already in use.' });
    }
    var newUser = new User();
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(req.body.password);
    newUser.save()
    .then(() => {
      res.redirect('login/signin');
      res.json({ message: 'User registered successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("login/signup");
      res.json({ error: 'Internal Server Error' });
    });
  })
  .catch(next);
};
//res.session.user = user;
>>>>>>> Stashed changes
