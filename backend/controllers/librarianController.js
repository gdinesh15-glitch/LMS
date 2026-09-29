const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Helper to log librarian activity
const logLibrarianActivity = async (req, action, details) => {
    try {
        await ActivityLog.create({
            actionType: action,
            message: details,
            module: 'Librarian',
            performedBy: req.user.userId,
            role: req.user.role,
            metadata: { ip: req.ip }
        });
    } catch (err) {
        console.error('Logging error:', err);
    }
};

// @desc    Get Librarian Dashboard Stats
// @route   GET /api/librarian/stats
// @access  Protected (Librarian/Admin)
exports.getLibrarianStats = async (req, res) => {
    try {
        const uniqueTitlesCount = await Book.countDocuments();
        
        const bookAgg = await Book.aggregate([
            { $group: { _id: null, total: { $sum: '$totalCopies' }, available: { $sum: '$availableCopies' } } }
        ]);
        const totalVolumes = bookAgg[0]?.total || 0;
        const availableVolumes = bookAgg[0]?.available || 0;
        const issuedVolumes = totalVolumes - availableVolumes;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Returns today
        const returnsToday = await Transaction.countDocuments({
            status: 'Returned',
            returnDate: { $gte: todayStart }
        });

        // Overdue books
        const overdueCount = await Transaction.countDocuments({ status: 'Overdue' });

        // Pending Fines
        const fineAgg = await Transaction.aggregate([
            { $match: { fineAmount: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: '$fineAmount' }, count: { $sum: 1 } } }
        ]);
        const pendingFines = fineAgg[0]?.total || 0;
        const usersWithFines = fineAgg[0]?.count || 0;

        // Categories breakdown
        const categories = await Book.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Recent Transactions
        const recentTransactions = await Transaction.find()
            .populate('user', 'name userId')
            .populate('book', 'title assetId')
            .sort({ updatedAt: -1 })
            .limit(5);

        // Top Overdue
        const topOverdue = await Transaction.find({ status: 'Overdue' })
            .populate('user', 'name userId')
            .populate('book', 'title')
            .sort({ fineAmount: -1 })
            .limit(3);

        res.json({
            stats: {
                totalBooks: uniqueTitlesCount,
                totalVolumes: totalVolumes,
                issuedBooks: issuedVolumes,
                returnsToday,
                availableBooks: availableVolumes,
                pendingFines,
                overdueBooks: overdueCount,
                usersWithFines
            },
            categories: categories.map(c => ({ name: c._id, count: c.count })),
            recentTransactions: recentTransactions.map(t => ({
                id: t._id,
                type: t.status === 'Returned' ? 'Return' : 'Issue',
                book: t.book?.title,
                user: t.user?.name,
                userId: t.user?.userId,
                date: t.updatedAt
            })),
            topOverdue: topOverdue.map(t => ({
                book: t.book?.title,
                user: t.user?.name,
                userId: t.user?.userId,
                days: Math.ceil((new Date() - t.dueDate) / (1000 * 60 * 60 * 24))
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Quick Search for Issue Form (Users/Books)
// @route   GET /api/librarian/search
// @access  Protected (Librarian)
exports.quickSearch = async (req, res) => {
    const { q, type } = req.query;
    try {
        if (type === 'user') {
            const users = await User.find({
                $or: [
                    { userId: { $regex: q, $options: 'i' } },
                    { name: { $regex: q, $options: 'i' } },
                    { email: { $regex: q, $options: 'i' } }
                ]
            }).limit(5).select('userId name role department');
            return res.json(users);
        } else {
            const books = await Book.find({
                $or: [
                    { assetId: { $regex: q, $options: 'i' } },
                    { title: { $regex: q, $options: 'i' } },
                    { isbn: { $regex: q, $options: 'i' } }
                ],
                availableCopies: { $gt: 0 }
            }).limit(5).select('assetId title author availableCopies');
            return res.json(books);
        }
    } catch (err) {
        res.status(500).json({ message: 'Search failed' });
    }
};

// @desc    Librarian Issue Book
// @route   POST /api/librarian/issue
// @access  Protected (Librarian)
exports.issueBook = async (req, res) => {
    const { userId, bookId, dueDate } = req.body;
    try {
        const user = await User.findOne({ userId });
        const book = await Book.findOne({ assetId: bookId });

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.availableCopies <= 0) return res.status(400).json({ message: 'No copies available' });

        const transaction = await Transaction.create({
            user: user._id,
            book: book._id,
            dueDate: new Date(dueDate),
            status: 'Issued'
        });

        book.availableCopies -= 1;
        book.borrowCount += 1;
        await book.save();

        await logLibrarianActivity(req, 'BOOK_ISSUE', `Issued "${book.title}" to ${user.name} (${user.userId})`);

        res.json({ success: true, transaction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Librarian Return Book
// @route   POST /api/librarian/return
// @access  Protected (Librarian)
exports.returnBook = async (req, res) => {
    const { userId, bookId } = req.body;
    try {
        const user = await User.findOne({ userId });
        const book = await Book.findOne({ assetId: bookId });

        if (!user || !book) return res.status(404).json({ message: 'Record not found' });

        const transaction = await Transaction.findOne({
            user: user._id,
            book: book._id,
            status: { $in: ['Issued', 'Overdue'] }
        });

        if (!transaction) return res.status(404).json({ message: 'Active transaction not found' });

        // Fine calculation
        const today = new Date();
        const finePerDay = 5;
        let fine = 0;
        if (today > transaction.dueDate) {
            const diffDays = Math.ceil((today - transaction.dueDate) / (1000 * 60 * 60 * 24));
            fine = diffDays * finePerDay;
        }

        transaction.status = 'Returned';
        transaction.returnDate = today;
        transaction.fineAmount = fine;
        await transaction.save();

        book.availableCopies += 1;
        await book.save();

        await logLibrarianActivity(req, 'BOOK_RETURN', `Returned "${book.title}" from ${user.name}${fine > 0 ? ` with fine ₹${fine}` : ''}`);

        res.json({ success: true, message: 'Book returned successfully', fine });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Renew Book
// @route   POST /api/librarian/renew
// @access  Protected (Librarian)
exports.renewBook = async (req, res) => {
    const { transactionId, newDueDate } = req.body;
    try {
        const transaction = await Transaction.findById(transactionId).populate('user book');
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        transaction.dueDate = new Date(newDueDate);
        if (transaction.status === 'Overdue') transaction.status = 'Issued';
        await transaction.save();

        await logLibrarianActivity(req, 'BOOK_RENEW', `Renewed "${transaction.book?.title}" for ${transaction.user?.name}`);

        res.json({ success: true, message: 'Book renewed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Pay Fine
// @route   POST /api/librarian/pay-fine
// @access  Protected (Librarian)
exports.payFine = async (req, res) => {
    const { transactionId } = req.body;
    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        transaction.fineAmount = 0;
        await transaction.save();

        await logLibrarianActivity(req, 'FINE_PAYMENT', `Fine paid for transaction ${transactionId}`);

        res.json({ success: true, message: 'Fine paid' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get Reports
// @route   GET /api/librarian/reports
// @access  Protected (Librarian)
exports.getReports = async (req, res) => {
    const { type, startDate, endDate } = req.query;
    try {
        let query = {};
        if (startDate && endDate) {
            query.updatedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (type === 'issue') query.status = { $in: ['Issued', 'Overdue'] };
        else if (type === 'return') query.status = 'Returned';
        else if (type === 'fine') query.fineAmount = { $gt: 0 };

        const transactions = await Transaction.find(query)
            .populate('user', 'name userId')
            .populate('book', 'title assetId')
            .sort({ updatedAt: -1 });

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
