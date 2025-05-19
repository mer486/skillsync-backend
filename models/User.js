const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  career: { type: String, default: null }, // ✅ Add this if missing
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'mentor', 'admin'], required: true },
  subscription: { type: String, enum: ['free', 'premium'], default: 'free' },
  observer: [{ type: Schema.Types.ObjectId, ref: 'Observer' }],
  lastResumeAnalysis: {
  skills: [String],
  organizations: [String],
  jobTitles: [String],
  suggestions: [String],
},


}, {
  discriminatorKey: 'role', // student, mentor, admin
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
