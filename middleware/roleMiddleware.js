const apiResponse = require('../utils/apiResponse');

/**
 * Middleware to restrict access to specific roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          apiResponse(
            false,
            `User role ${req.user?.role} is not authorized to access this route`
          )
        );
    }
    next();
  };
};

module.exports = { authorize };
