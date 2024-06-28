import express from 'express';
import { mongoConnect } from './src/mongo.js';
import router from './src/routes/bookRoutes.js';

const app = express();

app.use(express.json());
app.use(router);

mongoConnect();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
