const asyncHandler = require("express-async-handler");
const User = require("../features/models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const genrateToken = require("../config/genrateToken");
const protect = require("../middlewares/authMiddleware");

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  if (!name || !email || !password) {
    return res.send({ msg: "Please Enter all the fields" });
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.send({ msg: "User already exist" });
  }
  bcrypt.hash(password, 4, async (err, hash) => {
    const user = new User({
      ...req.body,
      password: hash,
    });
    await user.save();
    res.status(201).send({ user, msg: "Register sucessfully" });
  });
});
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send({ msg: "Please Enter all the fields" });
    return;
  }
  const user = await User.findOne({ email });

  if (user) {
    const hashed_password = user.password;
    bcrypt.compare(password, hashed_password, async (err, result) => {
      if (result) {
        res.send({
          msg: "login successfully",
          data: {
            userId: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: genrateToken(user._id),
          },
        });
      } else {
        res.send({ msg: "Incorrect Password" });
      }
    });
  } else {
    res.send({ msg: "Email not registred" });
  }
});
module.exports = { registerUser, authUser, allUsers };
