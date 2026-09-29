const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String },
    isbn: { type: String },
    subject: { type: String },
    reason: { type: String },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Ordered'],
        default: 'Pending'
    },
    librarianNotes: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
