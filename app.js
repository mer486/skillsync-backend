const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const careerRoutes = require('./routes/careerRoutes');
const progressRoutes = require('./routes/progressRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mentorRoutes = require('./routes/mentorRoutes');

// Use routes
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/chats', require('./routes/chatRoutes'));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root route to test if server is working
app.get('/', (req, res) => {
  res.send('SkillSync Backend API is working');
});

// Export app
module.exports = app;
