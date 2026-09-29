const User = require('../models/User');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const { logActivity } = require('./activityLogController');

// @desc    Get all users
// @route   GET /api/users
// @access  Protected (Admin, Faculty, Librarian)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        const mappedUsers = users.map(u => ({
            _id: u._id,
            id: u.userId, // Map for frontend compatibility
            userId: u.userId,
            name: u.name,
            role: u.role,
            department: u.department,
            year: u.year,
            email: u.email,
            phone: u.phone,
            status: u.status,
            createdAt: u.createdAt
        }));
        res.json(mappedUsers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all students
// @route   GET /api/users/students
// @access  Protected (Admin, Faculty, Librarian)
exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'Student' }).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Protected (Admin, Faculty, Librarian)
exports.createUser = async (req, res) => {
    try {
        const { userId, name, password, role, department, year, email, phone } = req.body;
        
        const userExists = await User.findOne({ userId });
        if (userExists) {
            return res.status(400).json({ message: 'User ID already exists' });
        }

        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        const user = await User.create({
            userId,
            name,
            password,
            role,
            department,
            year,
            email,
            phone
        });

        await logActivity({ actionType: 'USER_CREATE', message: `New ${role} registered: ${name}`, module: 'Users', performedBy: req.user?.userId || 'System', role: req.user?.role || 'System', targetId: user.userId, targetName: name });

        res.status(201).json({
            _id: user._id,
            id: user.userId,
            userId: user.userId,
            name: user.name,
            role: user.role,
            department: user.department,
            year: user.year,
            email: user.email,
            phone: user.phone,
            status: user.status,
            createdAt: user.createdAt
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Protected (Admin)
exports.updateUser = async (req, res) => {
    try {
        const { userId, name, password, role, department, year, email, phone } = req.body;
        
        let user;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findById(req.params.id);
        }
        if (!user) {
            user = await User.findOne({ userId: req.params.id });
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: 'Email already exists' });
        }

        user.name = name || user.name;
        user.role = role || user.role;
        user.department = department || user.department;
        user.year = year || user.year;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        if (password) user.password = password;

        await user.save();
        await logActivity({ actionType: 'USER_UPDATE', message: `Profile updated: ${user.name}`, module: 'Users', performedBy: req.user?.userId || 'System', role: req.user?.role || 'System', targetId: user.userId, targetName: user.name });
        res.json(user);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Protected (Admin)
exports.deleteUser = async (req, res) => {
    try {
        let user;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findById(req.params.id);
        }
        if (!user) {
            user = await User.findOne({ userId: req.params.id });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const deletedName = user.name;
        const deletedId = user.userId;
        await user.deleteOne();
        await logActivity({ actionType: 'USER_DELETE', message: `Identity removed: ${deletedName}`, module: 'Users', performedBy: req.user?.userId || 'System', role: req.user?.role || 'System', targetId: deletedId, targetName: deletedName });
        res.json({ message: 'User removed' });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle user status
// @route   PUT /api/users/:id/status
// @access  Protected (Admin)
exports.toggleUserStatus = async (req, res) => {
    try {
        let user;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findById(req.params.id);
        }
        if (!user) {
            user = await User.findOne({ userId: req.params.id });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
        await user.save();
        res.json({ status: user.status });
    } catch (err) {
        console.error("Toggle Status Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get dashboard stats (comprehensive)
// @route   GET /api/users/stats
// @access  Protected
exports.getDashboardStats = async (req, res) => {
    try {
        const [students, faculty, librarians, books, activeLoans, overdueLoans] = await Promise.all([
            User.countDocuments({ role: 'Student' }),
            User.countDocuments({ role: 'Faculty' }),
            User.countDocuments({ role: 'Librarian' }),
            Book.countDocuments(),
            Transaction.countDocuments({ status: 'Issued' }),
            Transaction.countDocuments({ status: 'Overdue' }),
        ]);

        // Available copies aggregate
        const availableAgg = await Book.aggregate([{ $group: { _id: null, total: { $sum: '$availableCopies' } } }]);
        const availableBooks = availableAgg[0]?.total || 0;

        // Book categories breakdown (for chart)
        const categoryAgg = await Book.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);
        const categories = categoryAgg.map(c => ({ name: c._id || 'Uncategorized', count: c.count }));

        // Recent users (for activity feed)
        const recentUsers = await User.find({ role: { $ne: 'Admin' } })
            .select('userId name role createdAt')
            .sort({ createdAt: -1 })
            .limit(6);

        const recentActivity = recentUsers.map(u => ({
            text: `New ${u.role} registered: ${u.name}`,
            userId: u.userId,
            ts: u.createdAt,
            type: 'user_add'
        }));

        // Users added per day (last 7 days) for chart
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dailyUsers = await User.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $group: {
                _id: { $dayOfWeek: '$createdAt' },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData = dayNames.map((name, i) => {
            const found = dailyUsers.find(d => d._id === i + 1);
            return { name, newUsers: found?.count || 0, usage: Math.floor(Math.random() * 300 + 200) };
        });

        res.json({
            students,
            faculty,
            librarians,
            books,
            issued: activeLoans,
            overdue: overdueLoans,
            availableBooks,
            donations: 0,
            categories,
            recentActivity,
            weeklyData
        });
    } catch (err) {
        console.error('getDashboardStats error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current user profile
// @route   GET /api/users/profile/me
// @access  Protected
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile/me
// @access  Protected
exports.updateMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, phone, department, userId } = req.body;
        
        if (userId && userId !== user.userId) {
            const userIdExists = await User.findOne({ userId });
            if (userIdExists) {
                return res.status(400).json({ message: 'User ID already taken' });
            }
            user.userId = userId;
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already taken' });
            }
            user.email = email;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.department = department || user.department;

        await user.save();
        
        await logActivity({ 
            actionType: 'USER_UPDATE', 
            message: `Profile updated by user: ${user.name}`, 
            module: 'Users', 
            performedBy: user.userId, 
            role: user.role, 
            targetId: user.userId, 
            targetName: user.name 
        });

        res.json({
            id: user._id,
            userId: user.userId,
            name: user.name,
            role: user.role,
            email: user.email,
            phone: user.phone,
            department: user.department,
            year: user.year,
            status: user.status
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Change password
// @route   PUT /api/users/profile/change-password
// @access  Protected
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();
        
        await logActivity({ 
            actionType: 'USER_UPDATE', 
            message: `Password changed by user: ${user.name}`, 
            module: 'Users', 
            performedBy: user.userId, 
            role: user.role, 
            targetId: user.userId, 
            targetName: user.name 
        });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
