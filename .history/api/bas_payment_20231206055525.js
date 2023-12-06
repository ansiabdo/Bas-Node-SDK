var express = require('express');
var BasChecksum = require('./baschecksum.js');
var PaytmChecksum = require('./PaytmChecksum.js');
const { genchecksumbystring, genchecksum } = require('./checksum.js');
var dotevnv = require("dotenv");
const axios = require("axios")
const crypto = require('crypto');

dotevnv.config();

const router = express.Router();

const BASURL = process.env.BAS_BASE_URL
const APPID = process.env.BAS_APP_ID
const MKEY = process.env.BAS_MKEY
const regex = /\t|\n|\r/g;

const CALLBACKURL = process.env.CALL_BACK_API_URL

const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return '1111' + Math.floor(Math.random() * 1000000);
};

router.post('/checkout', async (req, res) => {
    var { paymentProvider, orderDetails, customerInfo } = req.body
    // console.log("checkout req.body :", req.body)

    if (paymentProvider == "BAS_GATE") {
        await initPayment({ orderDetails, customerInfo }).then(async (response) => {
            console.log("response :", response.data)
            let data = response.data //await response.json()
            return res.status(200).json(data)
        }).catch((error) => {
            let data = error?.response?.data || error || '{}'
            console.error("Error checkout:", data)
            return res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "BAS_GATE Not Seleceted" })
    }


});
router.get('/status/:orderId', async (req, res) => {
    var { orderId } = req.params
    console.log("status req.params :", req.params)
    let x = BasChecksum.encrypt25622('', '')
    console.log("=============== body :", x);
    console.log("=============== body :", atob(x));
    return res.status(200).json(x)

    if (orderId) {
        await paymentStatus(orderId).then(async (response) => {
            console.log("response :", response.data)
            let data = response.data //await response.json()
            return res.status(200).json(data)
        }).catch((error) => {
            let data = error?.response?.data || error || '{}'
            console.error("Error :", data)
            return res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "BAS_GATE Not Seleceted" })
    }


});

async function initPayment(order) {
    const requestTimestamp = Date.now().toString() // "1701717164440" //
    const orderId = generateOrderId();
    var reqBody = `{"head":{"signature":"sigg","requestTimeStamp":"timess"},"body":bodyy}`
    var params = {}
    params.Body = {}
    params.Body["appId"] = APPID;
    params.Body["requestTimestamp"] = requestTimestamp
    params.Body["orderType"] = "PayBill";
    params.Body["callBackUrl"] = "null" //CALLBACKURL + `/${orderId}`;
    params.Body["customerInfo"] = {};
    params.Body["customerInfo"]["id"] = "75b32f99-5fe6-496f-8849-a5dedeb0a65f"//order.customerInfo.open_id.trim();
    params.Body["customerInfo"]["name"] = "Abdullah AlAnsi"//order.customerInfo.name.trim();
    params.Body["amount"] = {};
    params.Body["amount"]["value"] = "980000";
    params.Body["amount"]["currency"] = "YER"
    params.Body["orderId"] = orderId;
    params.Body["orderDetails"] = {}
    params.Body["orderDetails"]["Id"] = orderId;
    params.Body["orderDetails"]["Products"] = []
    params.Body["orderDetails"]["Products"][0] = {}
    params.Body["orderDetails"]["Products"][0]["Product"] = "IPHONE 14 PRO MAX"
    params.Body["orderDetails"]["Products"][0]["Type"] = "Unit"
    params.Body["orderDetails"]["Products"][0]["Price"] = 540000.0
    params.Body["orderDetails"]["Products"][0]["Qty"] = 1
    params.Body["orderDetails"]["Products"][0]["SubTotalPrice"] = 540000.0
    params.Body["orderDetails"]["Products"][1] = {}
    params.Body["orderDetails"]["Products"][1]["Product"] = "IPHONE 13 PRO MAX"
    params.Body["orderDetails"]["Products"][1]["Type"] = "Unit"
    params.Body["orderDetails"]["Products"][1]["Price"] = 440000.0
    params.Body["orderDetails"]["Products"][1]["Qty"] = 1
    params.Body["orderDetails"]["Products"][1]["SubTotalPrice"] = 440000.0

    params.Body["orderDetails"]["Currency"] = 'YER';
    params.Body["orderDetails"]["TotalPrice"] = 980000.0;

    var sign1, sign2, sign3, bodyStr;

    try {
        bodyStr = JSON.stringify(params.Body).trim().replace(regex, "")
        console.log("MKEY :", MKEY);
        console.log("=============== body :", bodyStr.length, bodyStr);

        sign2 = await BasChecksum.generateSignature(bodyStr, MKEY);
        sign3 = await PaytmChecksum.generateSignature(bodyStr, MKEY)
        console.log("=============== encrypt(bodyStr, MKEY) sign1: ", sign1);
        console.log("=============== generateSignature sign2: ", sign2);
        console.log("=============== genchecksumbystring sign3: ", sign3);
    } catch (error) {
        console.log("Error sign:", error);
    }

    // var newParams = JSON.stringify(params).trim().replace(regex, "")
    // var newParams = reqBody.replace("bodyy", JSON.stringify(JSON.parse(tmp))).replace("timess", requestTimestamp).replace("sigg", sign1)
    var newBody = JSON.stringify(params.Body).replace(regex, '').trim()
    var newParams = reqBody.replace("bodyy", newBody).replace("timess", requestTimestamp).replace("sigg", sign3)

    var url = `${BASURL}/api/v1/merchant/secure/transaction/initiate`

    console.log("url :", url);
    console.log("=======================newParams :", newParams);
    return await axios({
        method: 'post',
        url: url,
        data: newParams,
        headers: { "Content-Type": "application/json" }
    })
}

async function paymentStatus(orderId) {

    const requestTimestamp = Date.now().toString() // "1701717164440" //
    var reqBody = `{"head":{"signature":"sigg","requestTimeStamp":"timess"},"body":bodyy}`
    var params = {}
    params.Body = {}
    params.Body["appId"] = APPID;
    params.Body["orderId"] = orderId;
    params.Body["requestTimestamp"] = ''// requestTimestamp.toString();

    var sign, bodyStr;

    try {
        bodyStr = JSON.stringify(params.Body).trim().replace(regex, "")
        console.log("MKEY :", MKEY);
        console.log("=============== body :", bodyStr.length, bodyStr);

        // sign = await BasChecksum.generateSignature(bodyStr, MKEY);
        sign = await PaytmChecksum.generateSignature(bodyStr, MKEY)

        console.log("=============== generateSignature sign: ", sign);
    } catch (error) {
        console.log("Error sign:", error);
    }
    var newBody = JSON.stringify(params.Body).replace(regex, '').trim()
    var newParams = reqBody.replace("bodyy", newBody).replace("timess", requestTimestamp).replace("sigg", sign)

    var url = `${BASURL}/api/v1/merchant/secure/transaction/status`

    console.log("url :", url);
    console.log("=======================newParams :", newParams);
    return await axios({
        method: 'post',
        url: url,
        data: newParams,
        headers: { "Content-Type": "application/json" }
    })
}


// export default router;
module.exports = router;
