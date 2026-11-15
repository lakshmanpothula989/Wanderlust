const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  console.log(newListing);

  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings"); // must write the return keyword
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditFrom = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", " Listing Edited!");
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  let OriginalImageUrl = listing.image.url.replace(
    "/upload/",
    "/upload/h_20,w_20/",
  );
  res.render("listings/edit.ejs", { listing, OriginalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let listDeleted = await Listing.findByIdAndDelete(id);
  console.log(listDeleted);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
