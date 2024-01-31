var express = require('express');
var BasChecksum = require('./baschecksum.js');
const axios = require("axios")
require('dotenv').config()
// var dotevnv = require("dotenv");

// dotevnv.config();

const router = express.Router();

const BASURL = process.env.BAS_BASE_URL //?? "https://api-tst.basgate.com:4951"
const APPID = process.env.BAS_APP_ID
const CALLBACKURL = '/'
const MKEY = process.env.BAS_MKEY //?? "cmJsckQ1Nlh1S0FZVjJqQg=="
const regex = /\t|\n|\r/g;



const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return '1111' + Math.floor(Math.random() * 1000000);
};

router.post('/checkout', async (req, res) => {
    var { paymentProvider, orderDetails, customerInfo } = req.body

    if (paymentProvider == "BAS_GATE") {
        await initPayment({ orderDetails, customerInfo }).then(async (response) => {
            console.log("response :", response.data)
            let data = response.data
            let { trxToken, trxStatus, order } = data.body
            if (data.status == 1 && data.head?.signature) {
                // Only 
                var input = trxToken + trxToken + order.orderId
                var verfiy = BasChecksum.verifySignature(input, MKEY, data.head.signature)
                if (verfiy) {
                    return res.status(200).json(data)
                } else {
                    return res.status(403).json(data)
                }
            } else {
                return res.status(403).json(data)
            }

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

    if (orderId) {
        await paymentStatus(orderId).then(async (response) => {
            console.log("response :", response.data)
            let data = response.data //await response.json()
            if (data.status == 1 && data.head?.signature) {
                var verfiy = BasChecksum.verifySignature(data.body, MKEY, data.head.signature)
                if (verfiy) {
                    return res.status(200).json(data)
                } else {
                    return res.status(403).json(data)
                }
            } else {
                return res.status(403).json(data)
            }
        }).catch((error) => {
            let data = error?.response?.data || error || '{}'
            console.error("Error :", data)
            return res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "OrderId Not Seleceted" })
    }


});

async function initPayment(order) {
    //#region params
    const url = `${BASURL}/api/v1/merchant/secure/transaction/initiate`
    const requestTimestamp = Date.now().toString() // "1701717164440" //
    const orderId = generateOrderId();
    var reqBody = `{"head":{"signature":"sigg","requestTimeStamp":"timess"},"body":bodyy}`
    var params = {}
    params.Body = {}
    params.Body["appId"] = APPID;
    params.Body["requestTimestamp"] = requestTimestamp
    params.Body["orderType"] = "PayBill";
    params.Body["callBackUrl"] = CALLBACKURL + `${orderId}`;
    params.Body["customerInfo"] = {};
    params.Body["customerInfo"]["id"] = ("" + order.customerInfo.open_id).trim();
    params.Body["customerInfo"]["name"] = ("" + order.customerInfo.name).trim();
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

    var sign1, bodyStr;
    //#endregion

    try {
        bodyStr = JSON.stringify(params.Body).trim().replace(regex, "")
        console.log("MKEY :", MKEY);
        console.log("=============== body :", bodyStr.length, bodyStr);
        sign1 = BasChecksum.generateSignature(bodyStr, MKEY)
        console.log("=============== body sign1:", sign1);
    } catch (error) {
        console.log("Error sign:", error);
    }

    var newParams = reqBody.replace("bodyy", bodyStr).replace("timess", requestTimestamp).replace("sigg", sign1)

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
    //#region params
    const url = `${BASURL}/api/v1/merchant/secure/transaction/status`
    const requestTimestamp = Date.now().toString() // "1701717164440" //
    var reqBody = `{"head":{"signature":"sigg","requestTimeStamp":"timess"},"body":bodyy}`
    var params = {}
    params.Body = {}
    params.Body["appId"] = APPID;
    params.Body["orderId"] = orderId;
    params.Body["requestTimestamp"] = requestTimestamp.toString();

    var sign, bodyStr;
    //#endregion

    try {
        bodyStr = JSON.stringify(params.Body).trim().replace(regex, "")
        console.log("MKEY :", MKEY);
        console.log("=============== body :", bodyStr.length, bodyStr);
        sign = BasChecksum.generateSignature(bodyStr, MKEY)
        console.log("=============== generateSignature sign: ", sign);
    } catch (error) {
        console.log("Error sign:", error);
    }
    var newParams = reqBody.replace("bodyy", bodyStr).replace("timess", requestTimestamp).replace("sigg", sign)


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
