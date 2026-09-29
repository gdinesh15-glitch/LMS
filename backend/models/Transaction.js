const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Issued', 'Returned', 'Overdue', 'Reserved'],
        default: 'Issued'
    },
    notes: { type: String },
    fineAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
