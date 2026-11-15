const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const listingController = require("../controllers/review.js");

// Review Routes
// Posts Review Routes
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(listingController.createReview),
);

// delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(listingController.destroyReview),
);

// app.get("/listingtest",async (req,res)=>{
//     let list1 = new Listing({
//         title :"Lakshman",
//         description : "hi i am lakshman" ,
//         image :"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//         price : 1900,
//         location :"araku , andhra pradesh",
//         country :"India",
//     })
//         await list1.save();
//         console.log("sample was saved");
//         res.send("sucessful testing");

// })

module.exports = router;
