const path = require("path");
const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Connect to DB
mongoose
  .connect("mongodb://127.0.0.1/yelping")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "itsasecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.err_msg = req.flash("err_msg");
  next();
});
//Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", require("./routes/auth"));
app.use("/places", require("./routes/place"));
app.use("/places/:place_id/reviews", require("./routes/review"));
app.use(express.static(path.join(__dirname, "public")));

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
