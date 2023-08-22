const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const userModel = require("../model/userModel");

const authMiddleware = async (req, res, next) => {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.user = payload;
    next();
  });
};

module.exports = authMiddleware;
