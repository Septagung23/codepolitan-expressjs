const express = require("express");
const Place = require("../models/place");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas/review");
const ErrorHandler = require("../utils/ErrorHandler");
const wrapAsync = require("../utils/wrapAsync");
const isValidObject = require("../middlewares/isValidObject");
const isAuth = require("../middlewares/isAuth");
const { isAuthorReview } = require("../middlewares/isAuthor");
const ReviewController = require("../controllers/review");
const { validateReviews } = require("../middlewares/validator");
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isValidObject("/places"),
  isAuth,
  validateReviews,
  wrapAsync(ReviewController.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObject("/places"),
  wrapAsync(ReviewController.destroy)
);

module.exports = router;
