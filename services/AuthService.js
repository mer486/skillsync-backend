const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  static instance;

  constructor() {
    if (AuthService.instance) return AuthService.instance;
    AuthService.instance = this;
  }

 async register({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed,  role: role.toLowerCase(),}); // no subscription here
  await user.save();
  return user;
}


  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return { user, token };
  }
}

module.exports = new AuthService();  // Singleton instance
