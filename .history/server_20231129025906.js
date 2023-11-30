import express from 'express';
import paymentInitiationRouter from './paymentInitiation.js';
import paymentResponseRouter from './paymentResponse.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routers
app.use('/api/payment', paymentInitiationRouter);
app.use('/api/payment', paymentResponseRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use('/',(req,res)=>{
    res.send("hello");
})