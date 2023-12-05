var express = require('express');
var BasChecksum = require('./baschecksum.js');
const { genchecksumbystring } = require('./checksum.js');
var dotevnv = require("dotenv");
const axios = require("axios")

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
            console.log("response :", data)
            return res.status(200).json(data)
        }).catch((error) => {
            let data = error?.response?.data ?? error ?? '{}'
            console.error("Error checkout:", data)
            return res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "BAS_GATE Not Seleceted" })
    }


});
// router.get('/status/:orderId', async (req, res) => {
//     var { orderId } = req.params
//     console.log("status req.params :", req.params)

//     if (orderId) {
//         await paymentStatus(orderId).then(async (response) => {
//             let data = await response.json()
//             console.log("response :", data)
//             return res.status(200).json(data)
//         }).catch((error) => {
//             let data = error?.response?.data ?? '{}'
//             console.error("Error :", data)
//             return res.status(409).send(data)
//         })
//     } else {
//         res.status(409).json({ status: 0, success: false, msg: "BAS_GATE Not Seleceted" })
//     }


// });

async function initPayment(order) {
    // console.log("initPayment order:", order)
    // if (order) {
    var myHeaders = new Headers();
    const requestTimestamp = Date.now().toString() //"1701717164440"
    myHeaders.append("Content-Type", "application/json");

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
    // params.Body["orderDetails"]["Products"] = JSON.stringify(params.Body["orderDetails"]["Products"])

    params.Body["orderDetails"]["Currency"] = 'YER';
    params.Body["orderDetails"]["TotalPrice"] = 980000.0;

    var sign1 = "FlSOENtqaNzZoFm5p7SpuzkCbbV2BHS0aNqPHbSlmKORKLtKFC1ZtIHbUyawBPFhDIQhcnZUGfsYntSSn7efBSAPvINO9iz4rOvCne7MbwE="
    var tmp = `{"appId":"4bcb8478-cdf0-488d-ad42-00f7ffdc3d88","requestTimestamp":"1701717164440","orderType":"PayBill","callBackUrl":"null","customerInfo":{"id":"75b32f99-5fe6-496f-8849-a5dedeb0a65f","name":"Abdullah AlAnsi"},"amount":{"value":"11340","currency":"YER"},"orderId":"1111855891","orderDetails":{"Id":"1111855891","Products":[{"Product":"APPLE GIFT CARD $10","Type":"Code","Price":5400,"Qty":1,"SubTotalPrice":5400},{"Product":"PUBG 60 UC","Type":"Code","Price":660,"Qty":9,"SubTotalPrice":5940}],"Currency":"YER","TotalPrice":11340}}`;
    var sign2, sign3;
    console.log("body :", JSON.stringify(params.Body));

    params.Body = {
        "RequestTimestamp": "1678695536",
        "appId": "4bcb8478-cdf0-488d-ad42-00f7ffdc3d88",
        "OrderType": "PayBill",
        "CustomerInfo": {
            "Id": "50",
            "Name": "Kamal"
        },
        "Amount": {
            "Value": "46980",
            "Currency": "YER"
        },
        "OrderId": "3a9b385b-c30b-4cd3-9b0e-e5887eda47b0",
        "CallBackUrl": "null",
        "orderDetails": {
            "Id": "3a9b385b-c30b-4cd3-9b0e-e5887eda47b0",
            "Products": [
                {
                    "Product": "APPLE GIFT CARD $10",
                    "Type": "Code",
                    "Price": 5400,
                    "Qty": 1,
                    "SubTotalPrice": 5400
                },
                {
                    "Product": "PUBG 60 UC",
                    "Type": "Code",
                    "Price": 660,
                    "Qty": 9,
                    "SubTotalPrice": 5940
                },
                {
                    "Product": "APPLE GIFT CARD $40",
                    "Type": "Code",
                    "Price": 23400,
                    "Qty": 1,
                    "SubTotalPrice": 23400
                },
                {
                    "Product": "PUBG 660 UC",
                    "Type": "Code",
                    "Price": 6120,
                    "Qty": 2,
                    "SubTotalPrice": 12240
                }
            ],
            "Currency": "YER",
            "TotalPrice": 46980
        }
    };

    try {
        console.log("MKEY :", MKEY);
        //  tmp = JSON.stringify(Body).trim().replace(regex, "")
        sign2 = await BasChecksum.generateSignature(params.Body, MKEY);
        console.log("generateSignature sign1: ", sign1);
        console.log("generateSignature sign2: ", sign2);
        // var verifyChecksum = BasChecksum.verifySignature(tmp, MKEY, sign1);
        sign3 = await genchecksumbystring(params.Body, atob(MKEY))
        console.log("genchecksumbystring data2: ", data2);
    } catch (error) {
        console.log("Error sign:", error);
    }

    console.log("Signature :", sign1);
    console.log("cpmpare :", JSON.stringify(params.Body).trim().replace(regex, "") == tmp);
    params.Head = {};
    params.Head["Signature"] = sign1;
    params.Head["RequestTimeStamp"] = requestTimestamp;
    // params.Head = {
    //     "Signature": "pAyO2mgGDcos6TKaYt34XIVM9tPDcc4KHQCWGBOn2Ue/mGZVJmbBsyOzhjaxQXz87bWUmcQGemJ1c98se96jeKJS4Epe8jhmYl4g8+tV7+o=",
    //     "RequestTimeStamp": 1678695536
    // }
    // var newParams = JSON.stringify(params).trim().replace(regex, "")
    // var newParams = reqBody.replace("bodyy", JSON.stringify(JSON.parse(tmp))).replace("timess", requestTimestamp).replace("sigg", sign1)
    var newBody = JSON.stringify(params.Body).replace(regex, '').trim()
    var newParams = reqBody.replace("bodyy", newBody).replace("timess", requestTimestamp).replace("sigg", sign1)
    // newParams.Body = JSON.parse(tmp)
    // newParams.Body['orderDetails']['Products'] = JSON.stringify(newParams.Body['orderDetails']['Products'])

    var bodyUtf8 = Buffer.from((newParams), "utf8")
    // var bodyUtf8 = Buffer.from((`{"Head":{"Signature":"pAyO2mgGDcos6TKaYt34XIVM9tPDcc4KHQCWGBOn2Ue/mGZVJmbBsyOzhjaxQXz87bWUmcQGemJ1c98se96jeKJS4Epe8jhmYl4g8+tV7+o=","RequestTimeStamp":1678695536},"Body":{"RequestTimestamp":"1678695536","appId":"4bcb8478-cdf0-488d-ad42-00f7ffdc3d88","OrderType":"PayBill","CustomerInfo":{"Id":"50","Name":"Kamal"},"Amount":{"Value":"46980","Currency":"YER"},"OrderId":"3a9b385b-c30b-4cd3-9b0e-e5887eda47b0","CallBackUrl":"null","orderDetails":{"Id":"3a9b385b-c30b-4cd3-9b0e-e5887eda47b0","Products":[{"Product":"APPLE GIFT CARD $10","Type":"Code","Price":5400.0,"Qty":1,"SubTotalPrice":5400.0},{"Product":"PUBG 60 UC","Type":"Code","Price":660.0,"Qty":9,"SubTotalPrice":5940.0},{"Product":"APPLE GIFT CARD $40","Type":"Code","Price":23400.0,"Qty":1,"SubTotalPrice":23400.0},{"Product":"PUBG 660 UC","Type":"Code","Price":6120.0,"Qty":2,"SubTotalPrice":12240.0}],"Currency":"YER","TotalPrice":46980.0}}}`), "utf8")

    var url = `${BASURL}/api/v1/merchant/secure/transaction/initiate`

    console.log("url :", url);
    console.log("myHeaders :", myHeaders);
    console.log("=======================bodyUtf8 :", bodyUtf8.toString("utf8"));
    console.log("=======================newParams :", JSON.parse(newParams));
    return await axios({
        method: 'post',
        url: url,
        data: newParams,//bodyUtf8.toString("utf8"),
        headers: { "Content-Type": "application/json" }
    })
    // return await fetch(url, requestOptions)
    // }
}

// async function initPayment(order) {
//     // console.log("initPayment order:", order)
//     // if (order) {
//     var myHeaders = new Headers();
//     const requestTimestamp = "1701717164440"// Date.now()
//     myHeaders.append("Content-Type", "application/json");

//     const orderId = generateOrderId();
//     var params = {}
//     params.Body = {}
//     params.Body["appId"] = APPID;
//     params.Body["requestTimestamp"] = requestTimestamp
//     params.Body["orderType"] = "PayBill";
//     params.Body["callBackUrl"] = "null" //CALLBACKURL + `/${orderId}`;
//     params.Body["customerInfo"] = {};
//     params.Body["customerInfo"]["id"] = "75b32f99-5fe6-496f-8849-a5dedeb0a65f"//order.customerInfo.open_id.trim();
//     params.Body["customerInfo"]["name"] = "Abdullah AlAnsi"//order.customerInfo.name.trim();
//     params.Body["amount"] = {};
//     params.Body["amount"]["value"] = "980000";
//     params.Body["amount"]["currency"] = "YER"
//     params.Body["orderId"] = orderId;
//     params.Body["orderDetails"] = {}
//     params.Body["orderDetails"]["Id"] = orderId;
//     params.Body["orderDetails"]["Products"] = []
//     params.Body["orderDetails"]["Products"][0] = {}
//     params.Body["orderDetails"]["Products"][0]["Product"] = "IPHONE 14 PRO MAX"
//     params.Body["orderDetails"]["Products"][0]["Type"] = "Unit"
//     params.Body["orderDetails"]["Products"][0]["Price"] = 540000.0
//     params.Body["orderDetails"]["Products"][0]["Qty"] = 1
//     params.Body["orderDetails"]["Products"][0]["SubTotalPrice"] = 540000.0
//     params.Body["orderDetails"]["Products"][1] = {}
//     params.Body["orderDetails"]["Products"][1]["Product"] = "IPHONE 13 PRO MAX"
//     params.Body["orderDetails"]["Products"][1]["Type"] = "Unit"
//     params.Body["orderDetails"]["Products"][1]["Price"] = 440000.0
//     params.Body["orderDetails"]["Products"][1]["Qty"] = 1
//     params.Body["orderDetails"]["Products"][1]["SubTotalPrice"] = 440000.0
//     params.Body["orderDetails"]["Products"] = JSON.stringify(params.Body["orderDetails"]["Products"])

//     params.Body["orderDetails"]["Currency"] = 'YER';
//     params.Body["orderDetails"]["TotalPrice"] = 980000.0;

//     var sign1 = "FlSOENtqaNzZoFm5p7SpuzkCbbV2BHS0aNqPHbSlmKORKLtKFC1ZtIHbUyawBPFhDIQhcnZUGfsYntSSn7efBSAPvINO9iz4rOvCne7MbwE="
//     var tmp = `{"appId":"4bcb8478-cdf0-488d-ad42-00f7ffdc3d88","requestTimestamp":"1701717164440","orderType":"PayBill","callBackUrl":"null","customerInfo":{"id":"75b32f99-5fe6-496f-8849-a5dedeb0a65f","name":"Abdullah AlAnsi"},"amount":{"value":"11340","currency":"YER"},"orderId":"1111855891","orderDetails":{"Id":"1111855891","Products":[{"Product":"APPLE GIFT CARD $10","Type":"Code","Price":5400,"Qty":1,"SubTotalPrice":5400},{"Product":"PUBG 60 UC","Type":"Code","Price":660,"Qty":9,"SubTotalPrice":5940}],"Currency":"YER","TotalPrice":11340}}`;
//     var sign2;
//     console.log("body :", JSON.stringify(params.Body));

//     params.Body = {
//         "RequestTimestamp": "1678695536",
//         "appId": "4bcb8478-cdf0-488d-ad42-00f7ffdc3d88",
//         "OrderType": "PayBill",
//         "CustomerInfo": {
//             "Id": "50",
//             "Name": "Kamal"
//         },
//         "Amount": {
//             "Value": "46980",
//             "Currency": "YER"
//         },
//         "OrderId": "3a9b385b-c30b-4cd3-9b0e-e5887eda47b0",
//         "CallBackUrl": "null",
//         "orderDetails": {
//             "Id": "3a9b385b-c30b-4cd3-9b0e-e5887eda47b0",
//             "Products": [
//                 {
//                     "Product": "APPLE GIFT CARD $10",
//                     "Type": "Code",
//                     "Price": 5400,
//                     "Qty": 1,
//                     "SubTotalPrice": 5400
//                 },
//                 {
//                     "Product": "PUBG 60 UC",
//                     "Type": "Code",
//                     "Price": 660,
//                     "Qty": 9,
//                     "SubTotalPrice": 5940
//                 },
//                 {
//                     "Product": "APPLE GIFT CARD $40",
//                     "Type": "Code",
//                     "Price": 23400,
//                     "Qty": 1,
//                     "SubTotalPrice": 23400
//                 },
//                 {
//                     "Product": "PUBG 660 UC",
//                     "Type": "Code",
//                     "Price": 6120,
//                     "Qty": 2,
//                     "SubTotalPrice": 12240
//                 }
//             ],
//             "Currency": "YER",
//             "TotalPrice": 46980
//         }
//     };

//     try {
//         console.log("MKEY :", MKEY);
//         //  tmp = JSON.stringify(Body).trim().replace(regex, "")
//         sign2 = await BasChecksum.generateSignature(params.Body, MKEY);
//         console.log("generateSignature sign1: ", sign1);
//         console.log("generateSignature sign2: ", sign2);
//         // var verifyChecksum = BasChecksum.verifySignature(tmp, MKEY, sign1);
//         let data2 = await genchecksumbystring(params.Body, atob(MKEY))
//         console.log("genchecksumbystring data2: ", data2);
//     } catch (error) {
//         console.log("Error sign:", error);
//     }

//     console.log("Signature :", sign1);
//     console.log("cpmpare :", JSON.stringify(params.Body).trim().replace(regex, "") == tmp);
//     params.Head = {};
//     params.Head["Signature"] = sign1;
//     params.Head["RequestTimeStamp"] = requestTimestamp;
//     params.Head = {
//         "Signature": "pAyO2mgGDcos6TKaYt34XIVM9tPDcc4KHQCWGBOn2Ue/mGZVJmbBsyOzhjaxQXz87bWUmcQGemJ1c98se96jeKJS4Epe8jhmYl4g8+tV7+o=",
//         "RequestTimeStamp": 1678695536
//     }
//     // var newParams = JSON.stringify(params).trim().replace(regex, "")
//     var newParams = { ...params }
//     // newParams.Body = JSON.parse(tmp)
//     // newParams.Body['orderDetails']['Products'] = JSON.stringify(newParams.Body['orderDetails']['Products'])

//     var bodyUtf8 = Buffer.from(JSON.stringify(newParams), "utf8")

//     // myHeaders.append("Content-Length", bodyUtf8.byteLength)
//     var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: bodyUtf8.toString("utf8"),
//         redirect: 'follow'
//     };

//     var url = `${BASURL}/api/v1/merchant/secure/transaction/initiate`

//     console.log("url :", url);
//     console.log("myHeaders :", myHeaders);
//     console.log("newParams :", JSON.stringify(newParams));
//     return await fetch(url, requestOptions)
//     // }
// }

// async function paymentStatus(orderId) {
//     // console.log("initPayment order:", order)
//     if (orderId) {
//         var myHeaders = new Headers();
//         const requestTimestamp = Date.now()
//         myHeaders.append("Content-Type", "application/json");

//         const orderId = generateOrderId();



//         var sign
//         try {
//             console.log("MKEY :", MKEY);
//             //atob("R0Biem8wOUIySkJxNGd6cQ==")
//             sign = await BasChecksum.generateSignature(body, MKEY);
//             // await paytmChecksum.then(function (result) {
//             console.log("generateSignature Returns: " + sign);
//             //     sign = result
//             var verifyChecksum = await BasChecksum.verifySignature(body, MKEY, result);
//             console.log("verifySignature Returns: " + verifyChecksum);
//             // }).catch(function (error) {
//             //     console.log(error);
//             // });
//             // sign = await genchecksumbystring(JSON.stringify(params), MKEY)
//         } catch (error) {
//             console.log("Error :", error);
//         }
//         console.log("signature :", sign);
//         head["signature"] = sign;
//         head["requestTimestamp"] = requestTimestamp;

//         console.log("initPayment myHeaders:", myHeaders)
//         var params = {
//             head, body
//         }
//         var requestOptions = {
//             method: 'POST',
//             headers: myHeaders,
//             body: JSON.stringify(params),
//             redirect: 'follow'
//         };

//         var url = `${BASURL}/api/v1/merchant/secure/transaction/initiate`

//         console.log("url :", url);
//         console.log("params :", JSON.stringify(params));
//         return await fetch(url, requestOptions)
//     }
// }

// export default router;
module.exports = router;
