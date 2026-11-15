const User = require("../models/user.js");

module.exports.renderSignupFrom = async (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);

    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (er) {
    req.flash("error", er.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginFrom = async (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to wanderlust!");
  let redirectUrl = res.locals.redirecturl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = async (req, res) => {
  req.flash("success", "welcome back to wanderlust!");
  let redirectUrl = res.locals.redirecturl || "/listings";
  res.redirect(redirectUrl);
};
