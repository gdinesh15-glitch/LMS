const express = require('express');
const router = express.Router();
const { 
    getStudents, 
    getUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus, 
    getDashboardStats,
    getMe,
    updateMe,
    changePassword
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Static routes MUST come before /:id parameterized routes
router.get('/students', protect, authorize('Admin', 'Faculty', 'Librarian'), getStudents);
router.get('/stats', protect, getDashboardStats);
router.get('/dashboard-stats', protect, getDashboardStats);

// Profile routes
router.get('/profile/me', protect, getMe);
router.put('/profile/me', protect, updateMe);
router.put('/profile/change-password', protect, changePassword);

router.get('/', protect, authorize('Admin', 'Faculty', 'Librarian'), getUsers);
router.post('/', protect, authorize('Admin', 'Faculty', 'Librarian'), createUser);

// Parameterized routes come last
router.put('/:id/status', protect, authorize('Admin', 'Faculty', 'Librarian'), toggleUserStatus);
router.put('/:id', protect, authorize('Admin', 'Faculty', 'Librarian'), updateUser);
router.delete('/:id', protect, authorize('Admin', 'Faculty', 'Librarian'), deleteUser);

module.exports = router;
