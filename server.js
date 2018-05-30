// ENTRY-POINT FILE

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

// resource vars for routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// initialize app variable set to express
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;
// connecto to MongoDB through mongoose, using a promise (then/catch)
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err)); // log errors, ex. if URI un/pass are incorrect

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport.js")(passport);

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // set a static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// say what port you want it to run on locally
// for heroku, want port to be process.env.PORT
const port = process.env.PORT || 5000;

// pass in port to listen function, print terminal running to terminal
app.listen(port, () => console.log(`Server running on port ${port}`));
