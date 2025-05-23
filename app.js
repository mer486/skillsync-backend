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
const roadmapRoutes = require('./routes/roadmapRoutes');

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
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/courses', require('./routes/courseRoutes'));

app.use('/api/user', userRoutes);



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // Exit if connection fails
});

// Root route to test server is alive
app.get('/', (req, res) => {
  res.send('SkillSync Backend API is running');
});





// Export app
module.exports = app;
