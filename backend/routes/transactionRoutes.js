const express = require('express');
const router = express.Router();
const { issueBook, returnBook, getUserTransactions } = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/transactions/issue
// @desc    Issue a book to a user
// @access  Protected (Librarian/Admin)
router.post('/issue', protect, authorize('Librarian', 'Admin'), issueBook);

// @route   POST /api/transactions/return
// @desc    Return an issued book
// @access  Protected (Librarian/Admin)
router.post('/return', protect, authorize('Librarian', 'Admin'), returnBook);

// @route   GET /api/transactions/user/:userId
// @desc    Get all transactions for a specific user
// @access  Protected (User themselves or Librarian/Admin)
router.get('/user/:userId', protect, getUserTransactions);

module.exports = router;
