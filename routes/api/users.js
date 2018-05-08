const express = require("express");
const router = express.Router();

// now when we create a route instead of doing 'app.get' like in the server.js file
// we do 'router.get' or 'router.post' etc.
// there is also an invisible "/app/users" prepended to the first argument inside of router.get (e.g. "/app/users/test" for ex. below), bc of what we set up in the server.js file

// res.json is similar to res.send, but it will output JSON, which is what we want from this API

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

module.exports = router;
