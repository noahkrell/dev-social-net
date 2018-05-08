const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

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

// @route GET api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
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
  const email = req.body.email;
  const password = req.body.password;

  // Find the user by email
  User.findOne({ email }) // same as {email: email} in JS6
    .then(user => {
      // check for User
      if (!user) {
        return res.status(404).json({ email: "User not found" });
      }

      // check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // the user matched, create payload for jwt
          const payload = { id: user.id, name: user.name, avatar: user.avatar };

          // sign the JSON web token - pass payload (user info), secret/key, expiration
          jwt.sign(
            payload,
            keys.secretKey,
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
          return res.status(400).json({ password: "Password Incorrect" });
        }
      });
    });
});

module.exports = router;
