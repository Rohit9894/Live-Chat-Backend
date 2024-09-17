const jwt = require("jsonwebtoken");
const User = require("../features/models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "hush");

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).send("Not authorized, token failed");
    }
  } else {
    res.send("token is missing");
  }
});
module.exports = protect;
