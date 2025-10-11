const { errorResponse } = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return errorResponse(res, 401, "Unathorized Access");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      return errorResponse(res, 401, "Access Denied");
    }
    console.log(decoded);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    errorResponse(res, 500, "Invalid Token ", error);
  }
};

module.exports = verifyToken;
