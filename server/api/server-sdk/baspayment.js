var BasChecksum = require('./baschecksum.js');
const axios = require("axios")
require('dotenv').config()
// var dotevnv = require("dotenv");

// dotevnv.config();


class BasPayment {
    static async initPayment(order) {
        return await initPayment(order)
    }
    static async paymentStatus(orderId) {
        return await paymentStatus(orderId)
    }
}

const BASURL = process.env.BAS_BASE_URL //?? "https://api-tst.basgate.com:4951"
const APPID = process.env.BAS_APP_ID
const CALLBACKURL = '/'
const MKEY = process.env.BAS_MKEY //?? "cmJsckQ1Nlh1S0FZVjJqQg=="
const regex = /\t|\n|\r/g;

const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return '1111' + Math.floor(Math.random() * 1000000);
};

async function initPayment(order) {
    console.log(`==================== initPayment() STARTED ========================`)
    console.log(`order : `, order)

    //#region params
    const url = `${BASURL}/api/v1/merchant/secure/transaction/initiate`
    const requestTimestamp = Date.now().toString() // "1701717164440" //
    const orderId = order.orderId ? order.orderId : generateOrderId();
    var reqBody = `{"head":{"signature":"sigg","requestTimeStamp":"timess"},"body":bodyy}`
    var params = {}
    params.Body = {}
    params.Body["appId"] = APPID;// Mandatory
    params.Body["requestTimestamp"] = requestTimestamp// Mandatory
    params.Body["orderType"] = "PayBill";
    params.Body["callBackUrl"] = CALLBACKURL + `${orderId}`;// Mandatory
    params.Body["customerInfo"] = {};
    params.Body["customerInfo"]["id"] = ("" + order.customerInfo.open_id).trim();
    params.Body["customerInfo"]["name"] = ("" + order.customerInfo.name).trim();
    params.Body["amount"] = {};
    params.Body["amount"]["value"] = order.amount?.value ?? "19600";// Mandatory
    params.Body["amount"]["currency"] = order.amount?.currency ?? "YER"// Mandatory
    params.Body["orderId"] = orderId; // Mandatory
    params.Body["orderDetails"] = {}
    params.Body["orderDetails"]["Id"] = orderId;
    params.Body["orderDetails"]["Products"] = []
    params.Body["orderDetails"]["Products"][0] = {}
    params.Body["orderDetails"]["Products"][0]["Product"] = "IPHONE 14 PRO MAX"
    params.Body["orderDetails"]["Products"][0]["Type"] = "Unit"
    params.Body["orderDetails"]["Products"][0]["Price"] = 5400.0
    params.Body["orderDetails"]["Products"][0]["Qty"] = 1
    params.Body["orderDetails"]["Products"][0]["SubTotalPrice"] = 5400.0
    params.Body["orderDetails"]["Products"][1] = {}
    params.Body["orderDetails"]["Products"][1]["Product"] = "IPHONE 13 PRO MAX"
    params.Body["orderDetails"]["Products"][1]["Type"] = "Unit"
    params.Body["orderDetails"]["Products"][1]["Price"] = 4400.0
    params.Body["orderDetails"]["Products"][1]["Qty"] = 1
    params.Body["orderDetails"]["Products"][1]["SubTotalPrice"] = 4400.0

    params.Body["orderDetails"]["Currency"] = order.amount?.currency ?? 'YER';
    params.Body["orderDetails"]["TotalPrice"] = order.amount?.value ?? 19600.0;

    var sign1, bodyStr;
    //#endregion

    try {
        bodyStr = JSON.stringify(params.Body).trim().replace(regex, "")
        console.log("MKEY :", MKEY);
        console.log("=============== body :", bodyStr.length, bodyStr);
        sign1 = BasChecksum.generateSignature(bodyStr, MKEY)
        console.log("=============== body sign1:", sign1);
    } catch (error) {
        console.error("Error sign:", error);
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
    console.log(`==================== paymentStatus(${orderId}) STARTED ========================`)
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

module.exports = BasPayment;