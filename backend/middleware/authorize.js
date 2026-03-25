const { createHttpError } = require("../utils/httpError");

const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(createHttpError(401, "Authentication required"));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(createHttpError(403, "You do not have permission"));
  }

  next();
};

module.exports = { authorize };
