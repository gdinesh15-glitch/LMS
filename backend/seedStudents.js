require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vemu-library')
  .then(async () => {
    console.log('Connected to DB');
    
    const seedStudent = async (userId, name) => {
        const exists = await User.findOne({ userId });
        if (!exists) {
            await User.create({
                userId,
                name,
                password: 'password123',
                role: 'Student',
                department: 'CSE',
                year: '3',
                email: `${userId.toLowerCase()}@vemu.edu.in`,
                phone: '9876543210'
            });
            console.log('Seeded:', userId);
        } else {
            console.log('Already exists:', userId);
        }
    };
    
    await seedStudent('STU-001', 'John Doe');
    await seedStudent('STU-002', 'Jane Smith');
    
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
