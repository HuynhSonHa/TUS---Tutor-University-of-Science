const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Configure passport-local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      const result = await user.validPassword(password);
      if (result) {
        done(null, user);
      }
      else {
        done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  })
);
  
passport.serializeUser((user, done) => {
  done(null, user._id);
});
  
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
  