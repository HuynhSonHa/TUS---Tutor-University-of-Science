const meRouter = require("./me");
const newsRouter = require("./news");
const siteRouter = require("./site");
const courseRouter = require("./courses");
const authRouter = require("./auth");

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home/home');
});
=======
>>>>>>> Stashed changes
function route(app) {
  //   app.get("/news", function (req, res) {
  //     res.render("news");
  //   });
  app.use("/news", newsRouter);
<<<<<<< Updated upstream
=======
>>>>>>> 2e76e768c0cbd74c33f2b4a66789f6c4d15bc91a
>>>>>>> Stashed changes

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
  app.use("/me", meRouter);
  app.use("/courses", courseRouter);
  app.use("/home", siteRouter);
  app.use("/", authRouter);
}

module.exports = route;
