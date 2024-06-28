import request from 'supertest';
import app from '../../index.js';
import Customer from '../models/customer.js';
import mongoose from 'mongoose';

describe('Return Books API', () => {
    beforeEach(async () => {
        await Customer.deleteMany({});
    });

    afterEach(async () => {
        await Customer.deleteMany({});
    });

    it('should calculate the correct charges for returned books', async () => {
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
                },
                {
                    book_id: 'validBookId2',
                    lend_date: new Date('2024-06-21'),
                    return_date: new Date('2024-07-26'),
                    count: 1
                }
            ]
        };

        await Customer.create(customerData);

        const res = await request(app)
            .post('/returnBooks')
            .send({
                customerId: customerId,
                booksToReturn: ['validBookId1', 'validBookId2']
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalCharges', 10);
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
