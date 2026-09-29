const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const librarianRoutes = require('./routes/librarianRoutes');
const facultyRoutes = require('./routes/facultyRoutes');

const app = express();

// Middleware — allow all origins (works locally + on Render)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/librarian', librarianRoutes);
app.use('/api/faculty', facultyRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('VEMU Library Management System API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Wait for the DB to be ready BEFORE the API starts accepting requests
const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start();
