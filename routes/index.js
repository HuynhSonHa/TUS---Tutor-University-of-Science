const userRouter = require("./user");
const newsRouter = require("./news");
const siteRouter = require("./site");
const courseRouter = require("./courses");
const authRouter = require("./auth");
const reviewRouter = require("./review");
const orderRouter = require("./order");
const tutorRouter = require("./tutor");
const adminRouter = require("./admin");
const guestRouter = require("./guest");


// /* GET home page. */
// router.get('/home', function(req, res, next) {
//   res.render('home/home');
// });

function route(app) {
  //   app.get("/news", function (req, res) {
  //     res.render("news");
  //   });
  app.use("/news", newsRouter);

  //   app.get("/search", function (req, res) {
  //     console.log(req.query.q);
  //     res.render("search");
  //   });

  app.post("/search", function (req, res) {
    console.log(req.body);
    res.send("");
  });
  //   app.get("/", function (req, res) {
  //     res.render("home");
  //   });
  app.use("/admin", adminRouter);
  app.use("/user", userRouter);
  app.use("/tutor", tutorRouter);
  app.use("/courses", courseRouter);
  app.use("/site", siteRouter);
  app.use("/review", reviewRouter);
  app.use("/order", orderRouter);
  app.use("/guest", guestRouter);
  app.use("/", authRouter);
}

module.exports = route;
