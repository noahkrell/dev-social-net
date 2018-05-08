// ENTRY-POINT FILE

// bring in express
const express = require("express");
// bring in mongoose
const mongoose = require("mongoose");
//bring in body parser
const bodyParser = require("body-parser");

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

// simple route to homepage, just to get things going
app.get("/", (req, res) => res.send("hello, there!"));

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// say what port you want it to run on locally
// for heroku, want port to be process.env.PORT
const port = process.env.PORT || 5000;

// pass in port to listen function, print terminal running to terminal
app.listen(port, () => console.log(`Server running on port ${port}`));
