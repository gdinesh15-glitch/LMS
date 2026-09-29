const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/vemu-library')
  .then(async () => {
    const users = await User.find({ userId: { $in: ['admin', 'LIB-001', 'FAC-001', 'STU-001', 'STU-002'] } });
    for (let u of users) {
        if (u.userId === 'admin') u.password = 'admin123';
        else u.password = 'password123';
        await u.save();
        console.log('Reset password for', u.userId);
    }
    process.exit(0);
  });
