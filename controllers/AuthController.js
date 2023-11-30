const passport = require('../middlewares/passport');
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
  })(req, res, next);// Thêm dòng này để gọi hàm authenticate
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
      newUser.save()
      .then(() => {
        res.status(201).redirect("/");
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

