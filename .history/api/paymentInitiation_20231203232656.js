import express from 'express';

const router = express.Router();

const MID = "OUEept11459745037985";
const MKEY = "1Ihx&s#y1St!Dk0m";
const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return 'ORDER_' + Math.floor(Math.random() * 1000000);
};
router.post('/start_payment', (req, res) => {

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
    const body = { "mid": "OUEept11459745037985", "websiteName": "WEBSTAGING", "orderId": "ORDERIDHERE", "txnAmount": { "value": "10.00", "currency": "INR" }, "userInfo": { "custId": "CUSTOMERID_HERE" }, "callbackUrl": "https://maddening-face-production.up.railway.app/api/payment/handle_payment", "requestType": "Payment", }

});

export default router;
