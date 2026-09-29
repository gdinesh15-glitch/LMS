const express = require('express');
const router = express.Router();
const { getLogs, clearLogs, deleteLog } = require('../controllers/activityLogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getLogs);
router.delete('/', protect, authorize('Admin'), clearLogs);
router.delete('/:id', protect, authorize('Admin'), deleteLog);

module.exports = router;
