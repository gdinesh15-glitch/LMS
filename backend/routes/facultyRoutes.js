const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getFacultyDashboard,
    reserveBook,
    submitRecommendation,
    getBorrowingHistory,
    getRecommendations,
    getReservations,
    cancelReservation,
    getMyLoans,
    getFacultyActivity
} = require('../controllers/facultyController');

router.use(protect);
router.use(authorize('Faculty'));

router.get('/dashboard', getFacultyDashboard);
router.get('/loans', getMyLoans);
router.get('/activity', getFacultyActivity);
router.post('/reserve', reserveBook);
router.post('/recommend', submitRecommendation);
router.get('/history', getBorrowingHistory);
router.get('/recommendations', getRecommendations);
router.get('/reservations', getReservations);
router.delete('/reserve/:id', cancelReservation);

module.exports = router;
