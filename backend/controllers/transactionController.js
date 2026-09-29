const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

// Helper to calculate fines and update overdue status
const updateOverdueTransactions = async (transactions) => {
    const today = new Date();
    const finePerDay = 5;

    for (let transaction of transactions) {
        if (transaction.status === 'Issued' && today > transaction.dueDate) {
            const diffTime = Math.abs(today - transaction.dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            transaction.status = 'Overdue';
            transaction.fineAmount = diffDays * finePerDay;
            await transaction.save();
        } else if (transaction.status === 'Overdue') {
            const diffTime = Math.abs(today - transaction.dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            transaction.fineAmount = diffDays * finePerDay;
            await transaction.save();
        }
    }
    return transactions;
};

// @desc    Issue a book
// @route   POST /api/transactions/issue
// @access  Protected (Librarian)
exports.issueBook = async (req, res) => {
    const { userId, bookId } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book || book.availableCopies <= 0) {
            return res.status(400).json({ message: 'Book not available' });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate due date (15 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15);

        const transaction = await Transaction.create({
            user: user._id,
            book: bookId,
            dueDate
        });

        // Update book stats
        book.availableCopies -= 1;
        book.borrowCount += 1;
        await book.save();

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Return a book
// @route   POST /api/transactions/return
// @access  Protected (Librarian)
exports.returnBook = async (req, res) => {
    const { transactionId } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction || transaction.status === 'Returned') {
            return res.status(400).json({ message: 'Invalid transaction' });
        }

        // Update transaction
        transaction.status = 'Returned';
        transaction.returnDate = new Date();
        await transaction.save();

        // Update book availability
        const book = await Book.findById(transaction.book);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        res.json({ message: 'Book returned successfully', transaction });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get transactions for a specific user
// @route   GET /api/transactions/user/:userId
// @access  Protected
exports.getUserTransactions = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let transactions = await Transaction.find({ user: user._id })
            .populate('book', 'title author')
            .sort({ issueDate: -1 });

        // Update overdue status and fines before returning
        transactions = await updateOverdueTransactions(transactions);

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
