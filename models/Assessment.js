const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
  question: { type: String, required: true },
  category: { type: String, required: true }, // ✅ removed enum constraint
  answer: { type: String, required: true },
  score: { type: Number, required: true }
});

const assessmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [answerSchema],
  totalScore: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
