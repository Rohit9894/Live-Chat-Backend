const jwt = require("jsonwebtoken");
const genrateToken = (id) => {
  return jwt.sign({ id }, "hush", {
    expiresIn: "30d",
  });
};
module.exports = genrateToken;
