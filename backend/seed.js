const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const adminExists = await User.findOne({ userId: 'admin' });
        
        if (!adminExists) {
            const admin = new User({
                userId: 'admin',
                name: 'System Administrator',
                password: 'admin123',
                role: 'Admin',
                department: 'IT/Management',
                email: 'admin@vemu.edu',
                phone: '1234567890',
                status: 'Active'
            });
            await admin.save();
            console.log('Default Admin user created successfully!');
        }

        const mahathiExists = await User.findOne({ userId: 'mahathitarugu' });
        if (!mahathiExists) {
            const mahathi = new User({
                userId: 'mahathitarugu',
                name: 'Mahathi Tarugu',
                password: '1234',
                role: 'Admin',
                department: 'IT/Management',
                email: 'mahathi@vemu.edu',
                phone: '9999999999',
                status: 'Active'
            });
            await mahathi.save();
            console.log('Mahathi admin user created successfully!');
        }

        const librarianExists = await User.findOne({ userId: 'LIB-001' });
        if (!librarianExists) {
            await User.create({
                userId: 'LIB-001',
                name: 'Jane Smith',
                password: 'password123',
                role: 'Librarian',
                department: 'Central Library',
                email: 'jane.smith@vemu.edu',
                phone: '9876543210',
                status: 'Active'
            });
            console.log('Sample Librarian seeded!');
        }

        const facultyExists = await User.findOne({ userId: 'FAC-001' });
        if (!facultyExists) {
            await User.create({
                userId: 'FAC-001',
                name: 'Dr. Robert Brown',
                password: 'password123',
                role: 'Faculty',
                department: 'Computer Science',
                email: 'robert.brown@vemu.edu',
                phone: '9876543211',
                status: 'Active'
            });
            console.log('Sample Faculty seeded!');
        }

        const studentExists = await User.findOne({ userId: 'STU-001' });
        if (!studentExists) {
            await User.create({
                userId: 'STU-001',
                name: 'Alice Johnson',
                password: 'password123',
                role: 'Student',
                department: 'Computer Science',
                year: '3rd Year',
                email: 'alice.j@vemu.edu',
                phone: '9876543212',
                status: 'Active'
            });
            console.log('Sample Student seeded!');
        }
        
        console.log('Seeding complete.');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
