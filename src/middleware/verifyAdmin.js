const { errorResponse } = require("../utils/responseHandler");

const verifyAdmin = async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      return errorResponse(res, 403, "Unauthorized. Access Denied!");
    }
    
    next();
  } catch (error) {
    errorResponse(res, 401, "Ivalid", error);
  }
};

module.exports = verifyAdmin;
