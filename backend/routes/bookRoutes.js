const express = require('express');
const router = express.Router();
const { getAllBooks, getBook, addBook, updateBook, deleteBook, getPopularBooks } = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllBooks);
router.get('/popular', getPopularBooks);
router.get('/:id', getBook);
router.post('/', protect, authorize('Admin', 'Librarian'), addBook);
router.put('/:id', protect, authorize('Admin', 'Librarian'), updateBook);
router.delete('/:id', protect, authorize('Admin', 'Librarian'), deleteBook);

module.exports = router;
