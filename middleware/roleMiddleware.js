// middleware/roleMiddleware.js

const restrictToRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: unauthorized role' });
    }
    next();
  };
};

module.exports = { restrictToRole , allowRoles }; // ✅ correct named exports
