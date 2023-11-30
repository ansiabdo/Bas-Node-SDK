import express from 'express';
import PaytmChecksum from 'paytmchecksum';

const router = express.Router();

const CLIENTID = process.env.BAS_CLIENT_ID ?? "fbbc6c5d-c471-42dd-a46a-9a2bad1c99cd";
const MKEY = process.env.BAS_MKEY ?? "R0Biem8wOUIySkJxNGd6cQ==";
const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return 'ORDER_' + Math.floor(Math.random() * 1000000);
};
router.post('/token', (req, res) => {
    // Your logic to handle payment initiation

    // Sample logic to generate a response with Paytm parameters
    const param_dict = {
        'MID': MID,
        'ORDER_ID': generateOrderId(),
        'TXN_AMOUNT': '10.00',
        'CUST_ID': 'CUSTOMER_ID',
        'INDUSTRY_TYPE_ID': 'Retail',
        'WEBSITE': 'WEBSTAGING',
        'CHANNEL_ID': 'WEB',
        'CALLBACK_URL': `${process.env.CALLBACK_URL}`
    };
    var params = {};

    /* initialize an array */
    params['MID'] = MID,
        params['WEBSITE'] = 'WEBSTAGING',
        params['CHANNEL_ID'] = 'WEB',
        params['INDUSTRY_TYPE_ID'] = 'Retail',
        params['ORDER_ID'] = generateOrderId(),
        params['CUST_ID'] = 'CUSTOMER_ID',
        params['TXN_AMOUNT'] = '10.00',
        params['CALLBACK_URL'] = 'https://maddening-face-production.up.railway.app/api/payment/handle_payment'
    // Generate checksum using PaytmChecksum library
    const body = { "mid": "OUEept11459745037985", "websiteName": "WEBSTAGING", "orderId": "ORDERIDHERE", "txnAmount": { "value": "10.00", "currency": "INR" }, "userInfo": { "custId": "CUSTOMERID_HERE" }, "callbackUrl": "https://maddening-face-production.up.railway.app/api/payment/handle_payment", "requestType": "Payment" }

    PaytmChecksum.generateSignature(params, MKEY)
        .then(checksum => {
            params['CHECKSUMHASH'] = checksum;
            // Sending the generated param_dict to the frontend
            res.json({ 'param_dict': params });
        })
        .catch(error => {
            console.error('Error during checksum generation:', error);
            res.status(500).send('Error during checksum generation');
        });
});

export default router;
