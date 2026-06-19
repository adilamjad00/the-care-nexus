// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: `User is not authenticated`,
      });
    }

    // Support both role (string) and roles (array) for backwards compatibility
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.role];

    // Check if user has at least one of the required roles
    const hasRole = userRoles.some((userRole) => roles.includes(userRole));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `User roles [${userRoles.join(', ')}] are not authorized to access this route. Required: [${roles.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = { authorize };
