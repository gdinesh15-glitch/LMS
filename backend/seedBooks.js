const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const sampleBooks = [
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', isbn: '978-0132350884', publisher: 'Prentice Hall', totalCopies: 5, availableCopies: 3, shelfLocation: 'A-01' },
  { title: 'Java: The Complete Reference', author: 'Herbert Schildt', category: 'Java', isbn: '978-1260463422', publisher: 'McGraw Hill', totalCopies: 8, availableCopies: 6, shelfLocation: 'A-02' },
  { title: 'Data Structures Using C', author: 'Reema Thareja', category: 'Data Structures', isbn: '978-0198099307', publisher: 'Oxford', totalCopies: 10, availableCopies: 7, shelfLocation: 'B-01' },
  { title: 'React in Action', author: 'Mark Tielens Thomas', category: 'Web Development', isbn: '978-1617293856', publisher: 'Manning', totalCopies: 4, availableCopies: 2, shelfLocation: 'C-01' },
  { title: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Databases', isbn: '978-0078022159', publisher: 'McGraw Hill', totalCopies: 6, availableCopies: 4, shelfLocation: 'B-03' },
  { title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Operating Systems', isbn: '978-1119800361', publisher: 'Wiley', totalCopies: 7, availableCopies: 5, shelfLocation: 'B-04' },
  { title: 'Python Crash Course', author: 'Eric Matthes', category: 'Python', isbn: '978-1593279288', publisher: 'No Starch Press', totalCopies: 6, availableCopies: 4, shelfLocation: 'A-05' },
  { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Networking', isbn: '978-0132126953', publisher: 'Pearson', totalCopies: 5, availableCopies: 3, shelfLocation: 'C-02' },
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', category: 'AI/ML', isbn: '978-0134610993', publisher: 'Pearson', totalCopies: 4, availableCopies: 2, shelfLocation: 'D-01' },
  { title: 'Web Development with JavaScript', author: 'Jon Duckett', category: 'Web Development', isbn: '978-1118907443', publisher: 'Wiley', totalCopies: 5, availableCopies: 5, shelfLocation: 'C-03' },
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for book seeding...');

    const Book = require('./models/Book');
    const count = await Book.countDocuments();

    if (count > 0) {
      console.log(`Database already has ${count} books. Skipping seed.`);
      process.exit();
    }

    for (let i = 0; i < sampleBooks.length; i++) {
      const bookData = { ...sampleBooks[i], assetId: 'BK' + String(i + 1).padStart(4, '0') };
      await Book.create(bookData);
      console.log(`  ✓ Seeded: ${bookData.title}`);
    }

    console.log(`\nSeeded ${sampleBooks.length} sample books.`);
    process.exit();
  } catch (err) {
    console.error('Book seeding error:', err);
    process.exit(1);
  }
};

seedBooks();
