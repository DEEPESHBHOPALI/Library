import request from 'supertest';
import app from '../../index.js';
import Customer from '../models/customer.js';
import mongoose from 'mongoose';
import Book from '../models/book.js';

describe('Return Books API', () => {
    beforeEach(async () => {
        await Customer.deleteMany({});
        await Book.deleteMany({});
    });

    afterEach(async () => {
        await Customer.deleteMany({});
        await Book.deleteMany({});
    });

    it('should calculate the correct charges for returned books', async () => {
        const customerId = new mongoose.Types.ObjectId();

        const customerData = {
            _id: customerId,
            customer_name: 'John Doe',
            books: [
                {
                    book_id: 'regularBookId',
                    lend_date: new Date('2024-06-20'),
                    return_date: new Date('2024-06-21'), // Rented for 1 day
                    days_to_return: 30,
                    type: 'Regular'
                },
                {
                    book_id: 'novelBookId',
                    lend_date: new Date('2024-06-20'),
                    return_date: new Date('2024-06-25'), // Rented for 5 days
                    days_to_return: 30,
                    type: 'Novel'
                },
                {
                    book_id: 'defaultBookId',
                    lend_date: new Date('2024-06-20'),
                    return_date: new Date('2024-06-26'), // Rented for 6 days
                    days_to_return: 30,
                    type: 'Fiction'
                }
            ]
        };

        const regularBookData = {
            _id: 'regularBookId',
            author_name: "Regular Author",
            book_name: "Regular Book",
            title: 'Regular Book',
            type: 'Regular',
            stockCount: 5
        };

        const novelBookData = {
            _id: 'novelBookId',
            author_name: "Novel Author",
            book_name: "Novel Book",
            title: 'Novel Book',
            type: 'Novel',
            stockCount: 5
        };

        const defaultBookData = {
            _id: 'defaultBookId',
            author_name: "Default Author",
            book_name: "Default Book",
            title: 'Default Book',
            type: 'Fiction',
            stockCount: 5
        };

        await Customer.create(customerData);
        await Book.create(regularBookData);
        await Book.create(novelBookData);
        await Book.create(defaultBookData);

        const res = await request(app)
            .post('/returnBooks')
            .send({
                customerId: customerId,
                booksToReturn: ['regularBookId', 'novelBookId', 'defaultBookId']
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalCharges', 18.5);
        // Expected total charges: 2 (Regular) + 7.5 (Novel) + 9 (Fiction)
    });
    
    it('should return 404 if customer is not found', async () => {
        const res = await request(app)
            .post('/returnBooks')
            .send({
                customerId: new mongoose.Types.ObjectId(),
                booksToReturn: ['nonexistentBookId']
            });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Customer not found');
    });

    it('should return 500 for internal server error', async () => {
        const originalFindById = Customer.findById;
        Customer.findById = jest.fn().mockRejectedValue(new Error('Internal server error'));

        const customerId = new mongoose.Types.ObjectId();
        const customerData = {
            _id: customerId,
            customer_name: 'John Doe',
            books: [
                {
                    book_id: 'validBookId1',
                    lend_date: new Date('2024-06-20'),
                    return_date: new Date('2024-07-25'),
                    count: 1
                }
            ]
        };

        await Customer.create(customerData);

        const res = await request(app)
            .post('/returnBooks')
            .send({
                customerId: customerId.toString(),
                booksToReturn: ['validBookId1']
            });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');

        Customer.findById = originalFindById;
    });

});
