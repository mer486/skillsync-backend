// middleware/roleMiddleware.js

// Middleware to allow specific roles
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

// Middleware to restrict to a single role
const restrictToRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Export both functions together
module.exports = { allowRoles, restrictToRole };
