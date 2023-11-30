import express from 'express';
import * as checksum from './checksum.js';
import * as config from '../config/config.js';
const { crypt } = await import('./crypt.js');

const router = express.Router();

const CLIENTID = config.BAS_CLIENT_ID ?? "fbbc6c5d-c471-42dd-a46a-9a2bad1c99cd";
const MKEY = config.BAS_MKEY ?? "R0Biem8wOUIySkJxNGd6cQ==";
const BASURL = config.BAS_FINAL_URL
const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return 'ORDER_' + Math.floor(Math.random() * 1000000);
};
router.post('/token', (req, res) => {
    var params = {};

    /* initialize an array */
    params['MID'] = CLIENTID,
        params['WEBSITE'] = 'WEBSTAGING',
        params['CHANNEL_ID'] = 'WEB',
        params['INDUSTRY_TYPE_ID'] = 'Retail',
        params['ORDER_ID'] = generateOrderId(),
        params['CUST_ID'] = 'CUSTOMER_ID',
        params['TXN_AMOUNT'] = '10.00',
        params['CALLBACK_URL'] = 'https://maddening-face-production.up.railway.app/api/payment/handle_payment'

    const body = { "mid": "OUEept11459745037985", "websiteName": "WEBSTAGING", "orderId": "ORDERIDHERE", "txnAmount": { "value": "10.00", "currency": "INR" }, "userInfo": { "custId": "CUSTOMERID_HERE" }, "callbackUrl": "https://maddening-face-production.up.railway.app/api/payment/handle_payment", "requestType": "Payment" }

    // checksum.genchecksum(params, MKEY, function (value) {
    //     console.log('checksum.genchecksum() :', value)
    // })
    // checksum.generateSignature(params, MKEY)
    //     .then(checksum => {
    //         params['CHECKSUMHASH'] = checksum;
    //         // Sending the generated param_dict to the frontend
    //         res.json({ 'param_dict': params });
    //     })
    //     .catch(error => {
    //         console.error('Error during checksum generation:', error);
    //         res.status(500).send('Error during checksum generation');
    //     });
});

router.post('/userinfo', (req, res) => {
    // Your logic to handle payment initiation
    var data = req.body
    console.log("userinfo req :", req.body)

    if (data) {
        var params = {};
        /* initialize an array */
        params['client_id'] = CLIENTID
        params['client_secret'] = MKEY
        params['grant_type'] = 'authorization_code'
        params['code'] = 'data.data.authId'
        params['redirect_uri'] = `${BASURL}/api/v1/auth/callback`
        sendData(params).then((v) => {
            console.log("sendData :", v)
        })
    }

    // checksum.genchecksum(params, MKEY, function (value) {
    //     console.log('checksum.genchecksum() :', value)
    // })

});

async function sendData(res) {
    let keyArr = Object.keys(res.param_dict);
    let valArr = Object.values(res.param_dict);

    console.log("Keys:", keyArr);
    console.log("Values:", valArr);
    // when we start the payment verification we will hide our Product form

    // Lets create a form by DOM manipulation
    // display messages as soon as payment starts
    let heading1 = document.createElement("h1");
    heading1.innerText = "Auth Data :";
    // let heading2 = document.createElement("h1");
    // heading2.innerText = "Please do not refresh your page....";

    //create a form that will send necessary details to the paytm
    let frm = document.createElement("form");
    frm.action = `${BAS_FINAL_URL}/api/v1/auth/token`;
    frm.method = "post";
    frm.id = "basForm";

    // we have to pass all the credentials that we've got from param_dict
    keyArr.forEach((k, i) => {
        // create an input element
        let inp = document.createElement("input");
        inp.key = i;
        inp.type = "hidden";
        // input tag's name should be a key of param_dict
        inp.name = k;
        // input tag's value should be a value associated with the key that we are passing in inp.name
        inp.value = valArr[i];
        // append those all input tags in the form tag
        frm.appendChild(inp);
    });

    // append all the above tags into the body tag
    document.body.appendChild(heading1);
    document.body.appendChild(heading2);
    document.body.appendChild(frm);
    // finally submit that form
    frm.submit();

}

export default router;
