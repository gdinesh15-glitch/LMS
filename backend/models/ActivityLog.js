const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    actionType: {
        type: String,
        required: true,
        enum: [
            'USER_LOGIN', 'USER_LOGOUT',
            'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'USER_STATUS',
            'BOOK_CREATE', 'BOOK_UPDATE', 'BOOK_DELETE',
            'BOOK_ISSUE', 'BOOK_RETURN',
            'DONATION_ADD', 'DONATION_APPROVE', 'DONATION_REJECT',
            'SETTINGS_UPDATE', 'SYSTEM_SEED'
        ]
    },
    message: {
        type: String,
        required: true
    },
    module: {
        type: String,
        enum: ['Auth', 'Users', 'Books', 'Transactions', 'Donations', 'Settings', 'System'],
        default: 'System'
    },
    performedBy: {
        type: String,
        default: 'System'
    },
    role: {
        type: String,
        default: 'System'
    },
    targetId: {
        type: String,
        default: ''
    },
    targetName: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'info'],
        default: 'success'
    }
}, {
    timestamps: true
});

// Index for fast querying
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ module: 1 });
activityLogSchema.index({ actionType: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
