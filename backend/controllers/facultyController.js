const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Recommendation = require('../models/Recommendation');
const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, action, details) => {
    try {
        await ActivityLog.create({
            actionType: action,
            message: details,
            module: 'Faculty',
            performedBy: req.user.userId,
            role: req.user.role
        });
    } catch (err) { console.error(err); }
};

// @desc    Get Faculty Dashboard Stats
// @route   GET /api/faculty/dashboard
exports.getFacultyDashboard = async (req, res) => {
    try {
        const activeLoans = await Transaction.find({ user: req.user._id, status: { $in: ['Issued', 'Overdue'] } }).populate('book');
        const reservations = await Transaction.find({ user: req.user._id, status: 'Reserved' }).populate('book');
        const recommendations = await Recommendation.find({ faculty: req.user._id });
        const historyCount = await Transaction.countDocuments({ user: req.user._id });
        
        const overdueItems = activeLoans.filter(l => l.status === 'Overdue').length;
        const dueSoon = activeLoans.filter(l => {
            const diff = (new Date(l.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
            return diff > 0 && diff <= 3;
        }).length;

        res.json({
            stats: {
                activeLoans: activeLoans.length,
                reservations: reservations.length,
                pendingRecommendations: recommendations.filter(r => r.status === 'Pending').length,
                borrowingLimit: 10, // Faculty limit
                overdueItems,
                dueSoon,
                borrowingHistoryCount: historyCount
            },
            recentLoans: activeLoans.slice(0, 5),
            notifications: [
                { id: 1, type: 'info', message: 'New Research Journal added to Engineering section' },
                { id: 2, type: 'warning', message: 'You have a book due in 2 days' }
            ]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Reserve a Book
// @route   POST /api/faculty/reserve
exports.reserveBook = async (req, res) => {
    const { bookId } = req.body;
    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.availableCopies <= 0) return res.status(400).json({ message: 'No copies available for reservation' });

        const existing = await Transaction.findOne({ user: req.user._id, book: bookId, status: { $in: ['Reserved', 'Issued', 'Overdue'] } });
        if (existing) return res.status(400).json({ message: 'You already have an active transaction for this book' });

        const transaction = await Transaction.create({
            user: req.user._id,
            book: bookId,
            status: 'Reserved',
            dueDate: new Date(Date.now() + 7*86400000) // Reserve for 7 days to pick up
        });

        book.availableCopies -= 1;
        await book.save();

        await logActivity(req, 'BOOK_RESERVE', `Reserved book: ${book.title}`);
        res.json({ success: true, transaction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Submit Recommendation
// @route   POST /api/faculty/recommend
exports.submitRecommendation = async (req, res) => {
    try {
        const recommendation = await Recommendation.create({
            ...req.body,
            faculty: req.user._id
        });
        await logActivity(req, 'BOOK_RECOMMEND', `Recommended book: ${req.body.title}`);
        res.json({ success: true, recommendation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get Borrowing History
// @route   GET /api/faculty/history
exports.getBorrowingHistory = async (req, res) => {
    try {
        const history = await Transaction.find({ user: req.user._id }).populate('book').sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get My Active Loans
// @route   GET /api/faculty/loans
exports.getMyLoans = async (req, res) => {
    try {
        const loans = await Transaction.find({ user: req.user._id, status: { $in: ['Issued', 'Overdue'] } }).populate('book').sort({ createdAt: -1 });
        res.json(loans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get My Activity Logs
// @route   GET /api/faculty/activity
exports.getFacultyActivity = async (req, res) => {
    try {
        const logs = await ActivityLog.find({ performedBy: req.user.userId }).sort({ createdAt: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get My Recommendations
// @route   GET /api/faculty/recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ faculty: req.user._id }).sort({ createdAt: -1 });
        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get My Reservations
// @route   GET /api/faculty/reservations
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Transaction.find({ user: req.user._id, status: 'Reserved' }).populate('book').sort({ createdAt: -1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Cancel Reservation
// @route   DELETE /api/faculty/reserve/:id
exports.cancelReservation = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id, status: 'Reserved' }).populate('book');
        if (!transaction) return res.status(404).json({ message: 'Reservation not found' });

        const book = await Book.findById(transaction.book._id || transaction.book);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        const bookTitle = transaction.book?.title || transaction.book;
        await transaction.deleteOne();
        await logActivity(req, 'RESERVATION_CANCEL', `Canceled reservation for book: ${bookTitle}`);
        res.json({ success: true, message: 'Reservation canceled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
