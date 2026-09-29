const Book = require('../models/Book');
const { logActivity } = require('./activityLogController');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res) => {
    try {
        const { q } = req.query;
        let query = {};
        if (q) {
            query = {
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { author: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } },
                    { isbn: { $regex: q, $options: 'i' } }
                ]
            };
        }
        const books = await Book.find(query).sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        console.error('getAllBooks error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res) => {
    try {
        let book;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            book = await Book.findById(req.params.id);
        }
        if (!book) book = await Book.findOne({ assetId: req.params.id });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Protected (Admin, Librarian)
exports.addBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        await logActivity({ actionType: 'BOOK_CREATE', message: `Book added: ${book.title}`, module: 'Books', performedBy: req.user?.userId || 'System', role: req.user?.role || 'System', targetId: book.assetId || book._id, targetName: book.title });
        res.status(201).json(book);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Book with this ISBN or Asset ID already exists' });
        }
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Protected (Admin, Librarian)
exports.updateBook = async (req, res) => {
    try {
        let book;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            book = await Book.findById(req.params.id);
        }
        if (!book) book = await Book.findOne({ assetId: req.params.id });
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const fields = ['title', 'author', 'category', 'isbn', 'publisher', 'totalCopies', 'availableCopies', 'shelfLocation'];
        fields.forEach(f => { if (req.body[f] !== undefined) book[f] = req.body[f]; });

        await book.save();
        await logActivity({ actionType: 'BOOK_UPDATE', message: `Book updated: ${book.title}`, module: 'Books', performedBy: req.user?.userId || 'System', role: req.user?.role || 'System', targetId: book.assetId || book._id, targetName: book.title });
        res.json(book);
    } catch (err) {
        console.error('updateBook error:', err);
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Protected (Admin, Librarian)
exports.deleteBook = async (req, res) => {
    try {
        let book;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            book = await Book.findById(req.params.id);
        }
        if (!book) book = await Book.findOne({ assetId: req.params.id });
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const delTitle = book.title;
        const delId = book.assetId || book._id;
        await book.deleteOne();
        await logActivity({ actionType: 'BOOK_DELETE', message: `Book removed: ${delTitle}`, module: 'Books', performedBy: req.user?.userId || 'System', role: req.user?.role || 'System', targetId: delId, targetName: delTitle });
        res.json({ message: 'Book removed' });
    } catch (err) {
        console.error('deleteBook error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get popular books
// @route   GET /api/books/popular
// @access  Public
exports.getPopularBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ borrowCount: -1 }).limit(5);
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
