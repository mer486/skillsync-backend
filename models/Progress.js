const mongoose = require('mongoose');
const { Schema } = mongoose;

const progressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roadmap: { type: String, required: true }, // e.g., "frontend developer"
  completedSteps: [Number], // step indexes (0-based)
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);
