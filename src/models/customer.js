import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    books: [
        {
            book_id: { type: String, ref: 'Book' },
            lend_date: { type: Date, required: true },
            return_date: { type: Date, required: true },
            days_to_return: { type: Number, default: 30 },
            count: { type: Number, default: 0 },
        }
    ],
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
