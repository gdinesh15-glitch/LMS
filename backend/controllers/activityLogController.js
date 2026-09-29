const ActivityLog = require('../models/ActivityLog');

// Helper: call from other controllers to log actions automatically
exports.logActivity = async ({ actionType, message, module, performedBy, role, targetId, targetName, status }) => {
    try {
        await ActivityLog.create({ actionType, message, module, performedBy, role, targetId, targetName, status: status || 'success' });
    } catch (err) {
        console.error('Activity logging failed:', err.message);
    }
};

// @desc    Get all activity logs
// @route   GET /api/activity-logs
// @access  Protected
exports.getLogs = async (req, res) => {
    try {
        const { module: mod, status, search, limit = 100 } = req.query;
        const filter = {};
        if (mod) filter.module = mod;
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { message: { $regex: search, $options: 'i' } },
                { performedBy: { $regex: search, $options: 'i' } },
                { targetName: { $regex: search, $options: 'i' } },
                { actionType: { $regex: search, $options: 'i' } },
            ];
        }

        const logs = await ActivityLog.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalLogs, todayLogs, successLogs, failedLogs] = await Promise.all([
            ActivityLog.countDocuments(),
            ActivityLog.countDocuments({ createdAt: { $gte: today } }),
            ActivityLog.countDocuments({ status: 'success' }),
            ActivityLog.countDocuments({ status: 'failed' }),
        ]);

        res.json({
            logs,
            stats: { totalLogs, todayLogs, successLogs, failedLogs }
        });
    } catch (err) {
        console.error('getLogs error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Clear all logs
// @route   DELETE /api/activity-logs
// @access  Protected (Admin)
exports.clearLogs = async (req, res) => {
    try {
        await ActivityLog.deleteMany({});
        res.json({ message: 'All logs cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete single log
// @route   DELETE /api/activity-logs/:id
// @access  Protected (Admin)
exports.deleteLog = async (req, res) => {
    try {
        await ActivityLog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Log deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
