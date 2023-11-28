const meRouter = require("./me");
const newsRouter = require("./news");
const siteRouter = require("./site");
const courseRouter = require("./courses");
const loginRouter = require("./login");

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
  app.use("/me", meRouter);
  app.use("/courses", courseRouter);
  app.use("/home", siteRouter);
  app.use("/", loginRouter);
}

module.exports = route;
