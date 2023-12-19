// Middleware to check if user is authenticated
const isUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const isTutor = (req, res, next) => {
  if (req.isAuthenticated()) {
    if(req.user.role === "tutor") {
      return next();
    }
    res.redirect('user/premium');
  }
  res.redirect('/login');
};

module.exports = {isUser, isTutor,};