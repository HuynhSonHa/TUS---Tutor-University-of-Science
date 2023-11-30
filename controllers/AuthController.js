const passport = require('passport');
const User = require('../models/User');

//[GET] /
const getHomePage = (req, res, next) => {
  res.render('home/home');
};

//[GET] /signin
const getSignIn = (req, res, next) => {
  var messages = req.flash('error');
  res.render('login/signin', {
    messages: messages,
    hasErrors: messages.length > 0,
  });
};

//[POST] /signin
const postSignIn = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true,
  })
};

//[GET] /signup
const getSignUp = (req, res, next) => {
  var messages = req.flash('error');
  res.render('login/signup', {
    messages: messages,
    hasErrors: messages.length > 0,
  });
};

// [POST] /signup
const postSignUp = (req, res, next) => {
  User.findOne({ 'username': req.body.username })
  .then( (user) => {
    if (user) {
      res.redirect("login/signup");
      return res.json({ error: 'Username is already in use.' });
    }
    else {
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
        res.redirect("login/signin");
        res.json({ error: 'Internal Server Error' });
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

