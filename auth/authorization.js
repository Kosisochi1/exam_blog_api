const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication using  jwt token
const authenticateToken = async (req, res, next) => {
  const reqHeader = req.headers;
  try {
    if (!reqHeader) {
      return res.status(404).json({
        massage: "You are not authenticad",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedValue = await jwt.verify(token, process.env.SECRETE_KEY);
    const user = await User.findOne({
      email: decodedValue.email,
      _id: decodedValue._id,
    });
    if (!user) {
      return res.status(404).json({ massage: "You are not Authenticated" });
    }
    req.user = {
      email: decodedValue.email,
      _id: decodedValue._id,
      role: decodedValue.role,
    };
    next();
  } catch (error) {
    return res.status(404).json({
      massage: "You are not Authenticated",
    });
  }
};
// authentication using cookies
const authenticateCookie = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decodeValue = await jwt.verify(token, process.env.SECRETE_KEY);
      req.user = {
        email: decodeValue.email,
        _id: decodeValue._id,
        role: decodeValue.role,
      };
      next();
    } catch (error) {
      res.status(404).json({ massage: "Unauthenticated" });
    }
  } else {
    res.status(404).json({ massage: "Unauthenticated" });
  }
};

// authentication in Ejs for web display

const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decodedValue = await jwt.verify(token, process.env.SECRETE_KEY);

      res.locals.loginUser = { _id: decodedValue._id };
      next();
    } catch (error) {
      res.redirect("index");
    }
  } else {
    res.redirect("index");
  }
};

const auhtorisePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(401).json({ msg: "Unauthorised" });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authenticate,
  authenticateCookie,
  auhtorisePermission,
};
