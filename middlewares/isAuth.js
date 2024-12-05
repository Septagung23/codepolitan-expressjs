module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("err_msg", "You need to be logged in to do that");
    return res.redirect("/login");
  }

  next();
};
