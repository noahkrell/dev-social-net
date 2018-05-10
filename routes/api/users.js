const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

// now when we create a route instead of doing 'app.get' like in the server.js file
// we do 'router.get' or 'router.post' etc.
// there is also an invisible "/app/users" prepended to the first argument inside of router.get (e.g. "/app/users/test" for ex. below), bc of what we set up in the server.js file

// res.json is similar to res.send, but it will output JSON, which is what we want from this API

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email alread exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", //rating
        d: "mm" // default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET api/users/login
// @desc Login User / Return JWT token
// @access Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find the user by email
  User.findOne({ email }) // same as {email: email} in JS6
    .then(user => {
      // check for User
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      // check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // the user matched, create payload for jwt
          const payload = { id: user.id, name: user.name, avatar: user.avatar };

          // sign the JSON web token - pass payload (user info), secret/key, expiration
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          // the user didn't match
          errors.password = "Password Incorrect";
          return res.status(400).json(errors);
        }
      });
    });
});

// @route GET api/users/current
// @desc Return the current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
