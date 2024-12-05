const Place = require("../models/place");
const { placeSchema } = require("../schemas/place");
const PlaceController = require("../controllers/place");
const wrapAsync = require("../utils/wrapAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const express = require("express");
const isValidObject = require("../middlewares/isValidObject");
const isAuth = require("../middlewares/isAuth");
const { isAuthorPlace } = require("../middlewares/isAuthor");
const { validatePlaces } = require("../middlewares/validator");
const upload = require("../configs/multer");

const router = express.Router();

router
  .route("/")
  .get(
    wrapAsync(async (req, res) => {
      const places = await Place.find();
      res.render("places/index", { places });
    })
  )
  .post(
    isAuth,
    upload.array("image", 5),
    validatePlaces,
    wrapAsync(PlaceController.store)
  );

router.get("/create", isAuth, (req, res) => {
  res.render("places/create");
});

router
  .route("/:id")
  .get(isValidObject("/places"), wrapAsync(PlaceController.show))
  .put(
    isAuth,
    isAuthorPlace,
    isValidObject("/places"),
    upload.array("image", 5),
    validatePlaces,
    wrapAsync(PlaceController.update)
  )
  .delete(
    isAuth,
    isAuthorPlace,
    isValidObject("/places"),
    wrapAsync(PlaceController.destroy)
  );

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObject("/places"),
  wrapAsync(PlaceController.edit)
);

router.delete(
  "/:id/images",
  isAuth,
  isAuthorPlace,
  isValidObject("/places"),
  wrapAsync(PlaceController.destroyImages)
);
module.exports = router;
