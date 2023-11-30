import express from 'express';
import paymentInitiationRouter from './paymentInitiation.js';
import paymentResponseRouter from './paymentResponse.js';
import basAuth from './bas_auth.js';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.options('*', cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny')) //* Only used for print the action URL

// Use routers
app.use('/auth', basAuth);
app.use('/api/v1', paymentInitiationRouter);
app.use('/api/payment', paymentResponseRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use('/', (req, res) => {
    res.send("hello");
})