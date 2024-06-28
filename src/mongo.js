import { connect } from 'mongoose';

export const mongoConnect = () => {
    connect("mongodb+srv://dipu241999:<password>@cluster0.zjktaps.mongodb.net/Library?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
        });
} 
