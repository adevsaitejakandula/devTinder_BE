const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decodedObj = await jwt.verify(token, "DEVSAITEJA");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (user) {
        req.user = user
      next();
    } else {
      res.status(401).json({
        message: "User not found"
      })
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = userAuth;