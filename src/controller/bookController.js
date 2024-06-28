import Book from '../models/book.js';
import Customer from '../models/customer.js';

const returnBooks = async (req, res) => {
    const { customerId, booksToReturn } = req.body;

    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        let totalCharges = 0;
        booksToReturn.forEach(async bookToReturn => {
            const book = customer.books.find(b => b.book_id === bookToReturn);
            if (!book) {
                return res.status(404).json({ message: `Book not found` });
            }

            const libraryBook = await Book.findById(bookToReturn);
            if (!libraryBook) {
                return res.status(404).json({ message: `Book not found in library` });
            }

            const lendDate = new Date(book.lend_date);
            const returnDate = new Date(book.return_date);
            const diffTime = Math.abs(returnDate - lendDate);
            const diffDays = Math.max(0, Math.ceil((diffTime / (1000 * 60 * 60 * 24))));
            
            let perDayCharge = 0;
            switch (libraryBook.type) {
                case 'Regular':
                    if (diffDays > 0) {
                        if (diffDays <= 2) {
                            perDayCharge = Math.max(diffDays * 1, 2);
                        } else {
                            perDayCharge = (2 * 1) + ((diffDays - 2) * 1.5);
                        }
                    }
                    break;
                case 'Novel':
                    if (diffDays > 0) {
                        perDayCharge = Math.max(diffDays * 1.5, 4.5);
                    }
                    break;
                default:
                    perDayCharge = diffDays * 1.5;
                    break;
            }
            totalCharges += perDayCharge;

            // Removing book from the customer's books array and updating the stockCount in books
            const bookInDB = await Book.findById(book.book_id);
            if (bookInDB) {
                bookInDB.stockCount += 1;
                await bookInDB.save();
            }
        });

        const updatedBooks = customer.books.filter(b => !booksToReturn.includes(b.book_id));
        await Customer.findByIdAndUpdate(
            customerId,
            { books: updatedBooks },
            { new: true }
        );

        res.status(200).json({ message: 'Book returned successfully', totalCharges });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default returnBooks
