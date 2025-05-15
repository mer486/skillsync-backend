const ChatRequest = require('../models/ChatRequest');
const User = require('../models/User');

// Students send chat requests
exports.requestChat = async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Allow only one free request
    const existing = await ChatRequest.find({ user: userId });
    if (user.subscription === 'free' && existing.length >= 1) {
      return res.status(403).json({ message: 'Free users can only request 1 chat as trial' });
    }

    const newRequest = new ChatRequest({
      user: userId,
      message,
      status: 'accepted' // Default to accepted as per your request
    });

    await newRequest.save();
    res.status(201).json({ message: 'Chat request sent successfully', chat: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send chat request', error: err.message });
  }
};

// Admin or mentor fetches all chat requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ChatRequest.find().populate('user', 'name email');
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat requests', error: err.message });
  }
};
