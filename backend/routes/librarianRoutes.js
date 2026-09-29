const express = require('express');
const router = express.Router();
const { 
    getLibrarianStats, 
    quickSearch, 
    issueBook, 
    returnBook, 
    renewBook,
    payFine,
    getReports 
} = require('../controllers/librarianController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', authorize('Librarian', 'Admin'), getLibrarianStats);
router.get('/search', authorize('Librarian', 'Admin'), quickSearch);
router.post('/issue', authorize('Librarian', 'Admin'), issueBook);
router.post('/issues', authorize('Librarian', 'Admin'), issueBook); // Alias
router.post('/return', authorize('Librarian', 'Admin'), returnBook);
router.post('/returns', authorize('Librarian', 'Admin'), returnBook); // Alias
router.post('/renew', authorize('Librarian', 'Admin'), renewBook);
router.post('/pay-fine', authorize('Librarian', 'Admin'), payFine);
router.get('/reports', authorize('Librarian', 'Admin'), getReports);

module.exports = router;
