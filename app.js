if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dns = require("node:dns");

dns.setServers(["8.8.8.8"]);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

const {MongoStore}  = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const usersRouter = require("./router/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};




async function main() {
    await mongoose.connect(dbUrl);
    console.log("Successfully connected to MongoDB Atlas");
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res) => {
//   res.send("the server is working");
// });

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email : "Student@gmail.com",
//     username : "sigma-student",
//   });

//   let registerUser = await User.register(fakeUser,"mypassword");
//   res.send(registerUser);
// })

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 404, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message);
});
main()
    .then(() => {
        app.listen(8080, () => {
            console.log("Server listening on port 8080");
        });
    })
    .catch((err) => {
        console.log("Database connection failed:", err);
    });

