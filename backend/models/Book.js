const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    assetId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    edition: {
        type: String,
        trim: true,
        default: '1st Edition'
    },
    subject: {
        type: String,
        trim: true,
        default: ''
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    publisher: {
        type: String,
        trim: true,
        default: ''
    },
    totalCopies: {
        type: Number,
        default: 1,
        min: [0, 'Total copies cannot be negative']
    },
    availableCopies: {
        type: Number,
        default: 1,
        min: [0, 'Available copies cannot be negative']
    },
    shelfLocation: {
        type: String,
        trim: true,
        default: 'TBD'
    },
    status: {
        type: String,
        enum: ['Available', 'Low Stock', 'Out of Stock'],
        default: 'Available'
    },
    borrowCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Auto-generate assetId before saving if missing
bookSchema.pre('save', async function () {
    if (!this.assetId) {
        const count = await mongoose.model('Book').countDocuments();
        this.assetId = 'BK' + String(count + 1).padStart(4, '0');
    }
    // Auto-set status
    if (this.availableCopies <= 0) this.status = 'Out of Stock';
    else if (this.availableCopies <= 2) this.status = 'Low Stock';
    else this.status = 'Available';
});

module.exports = mongoose.model('Book', bookSchema);
