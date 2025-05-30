const jwt = require("jsonwebtoken");

const generateToken = (UserID) => {
  return jwt.sign({ id: UserID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRED,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };