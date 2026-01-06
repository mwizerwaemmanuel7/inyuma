const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// 1. UPDATED MongoDB Connection
// ============================================
// Removed deprecated options: useNewUrlParser, useUnifiedTopology
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit process on DB connection failure
  });

// ============================================
// 2. Middleware
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// 3. REMOVED: Static file serving for uploads
// ============================================
// Comment out or delete this line entirely since we don't need it anymore:
// app.use('/uploads', express.static('uploads'));

// ============================================
// 4. Routes
// ============================================
const imagesRoute = require('./routes/images');
app.use('/api/images', imagesRoute);

// ============================================
// 5. Test route (updated with better response)
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'Backend is working!',
    status: 'success',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ============================================
// 6. Optional: Add 404 handler for undefined routes
// ============================================
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ============================================
// 7. Optional: Global error handler
// ============================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ============================================
// 8. Start the server
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
});
