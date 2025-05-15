const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatRequestSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'accepted' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatRequest', chatRequestSchema);
