const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication using  jwt token
const authenticateToken = (req, res, next) => {
  const reqHeader = req.headers;
  try {
    if (!reqHeader) {
      return res.status(401).json({
        massage: "You are not authenticad",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRETE_KEY);
    const user = User.findOne({
      email: verifyToken.email,
      _id: verifyToken._id,
    });
    if (!user) {
      return res.status(401).json({ massage: "You are not Authenticated" });
    }
    req.userExist = { userId: verifyToken._id };
    next();
  } catch (error) {
    return res.status(401).json({
      massage: "You are not Authenticated",
      error,
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
