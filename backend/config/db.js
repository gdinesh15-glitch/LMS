const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vemu-library';
    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error('\n========== MongoDB Connection Failed ==========');
        console.error('URI tried:', uri);
        console.error('Reason   :', error.message);
        console.error('Checklist:');
        console.error('  1. Is MongoDB running?  (open MongoDB Compass and connect to mongodb://127.0.0.1:27017)');
        console.error('  2. Use 127.0.0.1 instead of localhost (Node 18+ resolves localhost to IPv6 ::1).');
        console.error('  3. On Windows make sure the "MongoDB" service is started (services.msc).');
        console.error('================================================\n');
        process.exit(1);
    }
};

module.exports = connectDB;
