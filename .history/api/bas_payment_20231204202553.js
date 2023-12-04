var express = require('express');
var BasChecksum = require('./baschecksum.js');
const { genchecksumbystring } = require('./checksum.js');
var dotevnv = require("dotenv");


dotevnv.config();

const router = express.Router();

const BASURL = process.env.BAS_BASE_URL
const APPID = process.env.BAS_APP_ID
const MKEY = process.env.BAS_MKEY

const CALLBACKURL = process.env.CALL_BACK_API_URL

const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return '1111' + Math.floor(Math.random() * 1000000);
};

router.post('/checkout', async (req, res) => {
    var { paymentProvider, orderDetails, customerInfo } = req.body
    console.log("checkout req.body :", req.body)

    if (paymentProvider == "BAS_GATE") {
        await initPayment({ orderDetails, customerInfo }).then(async (response) => {
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
router.get('/status/:orderId', async (req, res) => {
    var { orderId } = req.params
    console.log("status req.params :", req.params)

    if (orderId) {
        await paymentStatus(orderId).then(async (response) => {
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

async function initPayment(order) {
    console.log("initPayment order:", order)
    if (order) {
        var myHeaders = new Headers();
        const requestTimestamp = Date.now()
        myHeaders.append("Content-Type", "application/json");

        const orderId = generateOrderId();
        // var body = {
        //     "appId": APPID,
        //     "requestTimestamp": requestTimestamp.toString(),
        //     "orderType": "PayBill",
        //     "callBackUrl": CALLBACKURL + `/${orderId}`,
        //     "customerInfo": {
        //         id: order.customerInfo.open_id,
        //         name: order.customerInfo.name
        //     },
        //     "amount": {
        //         "value": "1100",
        //         "currency": "YER"
        //     },
        //     // "orderId": orderId,
        //     "OrderId": "3a9b385b-c30b-4cd3-9b0e-e5887eda47b0",
        //     orderDetails: {
        //         "Id": "3a9b385b-c30b-4cd3-9b0e-e5887eda47b0",
        //         "Products": [
        //             {
        //                 "Product": "APPLE GIFT CARD $10",
        //                 "Type": "Code",
        //                 "Price": 5400.0,
        //                 "Qty": 1,
        //                 "SubTotalPrice": 5400.0
        //             },
        //             {
        //                 "Product": "PUBG 60 UC",
        //                 "Type": "Code",
        //                 "Price": 660.0,
        //                 "Qty": 9,
        //                 "SubTotalPrice": 5940.0
        //             },
        //             {
        //                 "Product": "APPLE GIFT CARD $40",
        //                 "Type": "Code",
        //                 "Price": 23400.0,
        //                 "Qty": 1,
        //                 "SubTotalPrice": 23400.0
        //             },
        //             {
        //                 "Product": "PUBG 660 UC",
        //                 "Type": "Code",
        //                 "Price": 6120.0,
        //                 "Qty": 2,
        //                 "SubTotalPrice": 12240.0
        //             }
        //         ],
        //         "Currency": "YER",
        //         "TotalPrice": 46980.0
        //     } //order.orderDetails
        // }

        var Head = {}
        var Body = {}
        Body["appId"] = APPID;
        Body["requestTimestamp"] = requestTimestamp.toString()
        Body["orderType"] = "PayBill";
        Body["callBackUrl"] = "null" //CALLBACKURL + `/${orderId}`;
        Body["customerInfo"] = {};

        Body["customerInfo"]["id"] = order.customerInfo.open_id;
        Body["customerInfo"]["name"] = order.customerInfo.name;
        Body["amount"] = {};
        Body["amount"]["value"] = "11340";
        Body["amount"]["currency"] = "YER"

        Body["orderId"] = orderId;
        Body["orderDetails"] = {}
        Body["orderDetails"]["Id"] = orderId;
        Body["orderDetails"]["Products"] = []
        Body["orderDetails"]["Products"][0] = {}
        Body["orderDetails"]["Products"][0]["Product"] = "APPLE GIFT CARD $10"
        Body["orderDetails"]["Products"][0]["Type"] = "Code"
        Body["orderDetails"]["Products"][0]["Price"] = 5400.0
        Body["orderDetails"]["Products"][0]["Qty"] = 1
        Body["orderDetails"]["Products"][0]["SubTotalPrice"] = 5400.0
        Body["orderDetails"]["Products"][1] = {}
        Body["orderDetails"]["Products"][1]["Product"] = "PUBG 60 UC"
        Body["orderDetails"]["Products"][1]["Type"] = "Code"
        Body["orderDetails"]["Products"][1]["Price"] = 660.0
        Body["orderDetails"]["Products"][1]["Qty"] = 9
        Body["orderDetails"]["Products"][1]["SubTotalPrice"] = 5940.0
        Body["orderDetails"]["Currency"] = 'YER';
        Body["orderDetails"]["TotalPrice"] = 11340.0;

        let sign
        try {
            console.log("MKEY :", MKEY);
            //atob("R0Biem8wOUIySkJxNGd6cQ==")
            sign = await BasChecksum.generateSignature(Body, MKEY);
            // await paytmChecksum.then(function (result) {
            console.log("generateSignature Returns: " + sign);
            //     sign = result
            var verifyChecksum = BasChecksum.verifySignature(Body, MKEY, sign);
            console.log("verifySignature Returns: " + verifyChecksum);
            // }).catch(function (error) {
            //     console.log(error);
            // });
            // sign = await genchecksumbystring(JSON.stringify(params), MKEY)
        } catch (error) {
            console.log("Error :", error);
        }
        console.log("Signature :", sign);
        Head["Signature"] = sign;
        Head["RequestTimeStamp"] = requestTimestamp;

        console.log("initPayment myHeaders:", myHeaders)
        var params = {}
        params['Body'] = Body
        params['Head'] = Head

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

async function paymentStatus(orderId) {
    console.log("initPayment order:", order)
    if (orderId) {
        var myHeaders = new Headers();
        const requestTimestamp = Date.now()
        myHeaders.append("Content-Type", "application/json");

        const orderId = generateOrderId();



        var sign
        try {
            console.log("MKEY :", MKEY);
            //atob("R0Biem8wOUIySkJxNGd6cQ==")
            sign = await BasChecksum.generateSignature(body, MKEY);
            // await paytmChecksum.then(function (result) {
            console.log("generateSignature Returns: " + sign);
            //     sign = result
            var verifyChecksum = await BasChecksum.verifySignature(body, MKEY, result);
            console.log("verifySignature Returns: " + verifyChecksum);
            // }).catch(function (error) {
            //     console.log(error);
            // });
            // sign = await genchecksumbystring(JSON.stringify(params), MKEY)
        } catch (error) {
            console.log("Error :", error);
        }
        console.log("signature :", sign);
        head["signature"] = sign;
        head["requestTimestamp"] = requestTimestamp;

        console.log("initPayment myHeaders:", myHeaders)
        var params = {
            head, body
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

// export default router;
module.exports = router;
