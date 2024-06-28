import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import Book from './src/models/book.js';
import Customer from './src/models/customer.js';

async function connectToMongoDB() {
    try {
        await mongoose.connect("mongodb+srv://dipu241999:deepeshbhopali@cluster0.zjktaps.mongodb.net/Library", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const migratedCount = await migrateData();
        console.log("Number of data migrated: ", migratedCount)
        if (migratedCount) {
            mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        }

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

function determineBookType(authorName) {
    if (authorName === "Yvette Koelpin-Stanton DDS") {
        return "Fiction";
    } else if (authorName === "Josh Cruickshank") {
        return "Novel";
    } else {
        return "Regular";
    }
}

// Function to start data migration
async function migrateData() {
    let migratedCount = 0
    try {
        const stream = fs.createReadStream('./customer_data.csv')
            .pipe(csv());
        console.log("Migration started")

        for await (const row of stream) {
            const customerName = row['customer_name'];
            const books = JSON.parse(row['books']);

            let customerBooks = [];

            for (let book of books) {
                let existingBook = await Book.findOne({ book_name: book.book_name, author_name: book.author_name });
                if (existingBook) {
                    existingBook.stockCount += 1;
                } else {
                    existingBook = new Book({
                        _id: book.book_id,
                        book_name: book.book_name,
                        author_name: book.author_name,
                        type: determineBookType(book.author_name),
                        stockCount: 1,
                        stock_in_date: new Date(new Date(book.lend_date).getTime() - 30 * 24 * 60 * 60 * 1000) // Taking stock_in_date as 30 days before the lend_date
                    });
                }

                customerBooks.push({
                    book_id: existingBook._id,
                    lend_date: new Date(book.lend_date),
                    return_date: new Date(new Date(book.lend_date).getTime() + book.days_to_return * 24 * 60 * 60 * 1000),
                    days_to_return: book.days_to_return,
                    count: 1
                });

                await existingBook.save();
            }

            let existingCustomer = await Customer.findOne({ customer_name: customerName });
            if (existingCustomer) {
                existingCustomer.books.push(...customerBooks);
            } else {
                existingCustomer = new Customer({
                    _id: new mongoose.Types.ObjectId(),
                    customer_name: customerName,
                    books: customerBooks
                });
            }

            await existingCustomer.save();
            migratedCount++
            // console.log("Migrated customer:", customerName);
        }

        console.log('CSV file successfully processed');
        return migratedCount
    } catch (error) {
        console.error('Error processing CSV file:', error);
        throw error;
    }
}

connectToMongoDB();
