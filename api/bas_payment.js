import express from 'express';
const { crypt } = await import('./crypt.js');
import qs from 'qs';
// require('dotenv').config()
import * as dotevnv from "dotenv";

dotevnv.config();

const router = express.Router();

const CLIENTID = process.env.BAS_CLIENT_ID
const CLIENT_SECRET = process.env.BAS_CLIENT_SECERT
const BASURL = process.env.BAS_BASE_URL
const APPID = process.env.BAS_APP_ID

const CALLBACKURL = process.env.CALL_BACK_API_URL

const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return 'ORDER_' + Math.floor(Math.random() * 1000000);
};

router.post('/checkout', async (req, res) => {
    var { paymentProvider, orderDetails } = req.body
    console.log("checkout req :", req.body)

    if (paymentProvider == "BAS_GATE") {
        await initPayment(orderDetails).then(async (response) => {
            let data = await response.json()
            console.log("response :", data)
            return res.status(200).json(data)
        }).catch((error) => {
            let data = error?.response?.data ?? '{}'
            console.error("Error :", data)
            return res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "BAS_GATE Not Seleceted" })
    }


});

async function initPayment(orderDetails) {
    console.log("initPayment orderDetails:", orderDetails)
    if (orderDetails) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("signature", "XXBASSIGNATUREXX");
        myHeaders.append("requestTimestamp", "XXBASTIMESTAMPXX");
        console.log("initPayment myHeaders:", myHeaders)

        let orderId = generateOrderId();
        let params = {
            "requestTimestamp": "XXBASTIMESTAMPXX",
            "appId": APPID,
            "orderType": "billpayment",
            "callBackUrl": CALLBACKURL + `/${orderId}`,
            "customerInfo": {
                "id": "50",
                "name": "Abdullah AlAnsi"
            },
            "amount": {
                "value": 1100.0,
                "currency": "YER"
            },
            "orderId": orderId,
            orderDetails: orderDetails
        }

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(params),
            redirect: 'follow'
        };

        var url = `${BASURL}/api/v1/merchant/secure/transaction/initiate`

        console.log("url :", url);
        console.log("params :", JSON.stringify(params));
        return await fetch(url, requestOptions)
    }
}

export default router;
