const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  // index Route
  .get(wrapAsync(listingController.index))
  // create Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing),
  );

// new Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")

  // show Route
  .get(wrapAsync(listingController.showListing))

  // Update Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing),
  )

  // Delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// when going through hoopscotch make sure the content type is json

// app.post(
//   "/listings",
//   wrapAsync(async (req, res) => {
//     // instead of let {title , description , price} = req.body;
//     // let listing = req.body.listings;
//     // if (!req.body.listings) {
//     //   throw new ExpressError(400, "enter valid values");
//     // }

//     let result = listingSchema.validate(req.body);
//     console.log(result);
//     const newListing = new Listing(req.body.listing);

//     await newListing.save();
//     res.redirect("/listings");
//   }),
// );

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditFrom),
);

module.exports = router;
