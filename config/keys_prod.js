// way of making this object available outside of this file
module.exports = {
  // connect to mLab db using user/pass that you initiated ("noah:noah")
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY
};
