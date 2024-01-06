const passport = require("passport");
const crypto = require("crypto");
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
require('dotenv').config();



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


// login with google
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_MAILER_CLIENT_ID,
    clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
    callbackURL: "http://localhost:10000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    try {
      const user = await User.findOne({ googleId: profile.id });
      console.log("User: " + user);
      if (!user) {
        const newProfile = {
          username: crypto.randomBytes(16).toString('hex'),
          password: crypto.randomBytes(16).toString('hex'),
          fullname: profile._json.name,
          email: profile._json.email,
          avatar: profile._json.picture,
          fullname: profile._json.name,
          active: profile._json.email_verified,
          googleId: profile.id,
          status: "active",
        }
        const newUser = await User.create(newProfile);
        console.log("new User: ", newUser);
        cb(null, newUser);
      }
      else {
        User.findOneAndUpdate({ googleId: profile.id }, {
          avatar: profile._json.picture,
          fullname: profile._json.name,
          active: profile._json.email_verified,
          googleId: profile.id,
          status: "active",
        })
        cb(null, user);
      }

    } catch (err) {
      console.log("error: ", err);
      cb(err, null);
    }
  }
));
module.exports = passport;
  