import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    book_name: { type: String, required: true },
    author_name: { type: String, required: true },
    stockCount: { type: Number, default: 0 },
    stockInDate: { type: Date, default: Date.now },
    type: { type: String, enum: ['Regular', 'Fiction', 'Novel'], default: 'Regular' },
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
