var BasChecksum = require('./server-sdk/baschecksum');
var express = require('express');
var BasPayment = require('./server-sdk/baspayment');
const router = express.Router();
require('dotenv').config()


const MKEY = process.env.BAS_MKEY //?? "cmJsckQ1Nlh1S0FZVjJqQg=="


router.post('/checkout', async (req, res) => {
    var { paymentProvider, orderDetails, customerInfo, amount, orderId } = req.body
    console.log("==================== /checkout STARTED ========================")

    if (paymentProvider == "BAS_GATE") {
        await BasPayment.initPayment({ orderDetails, customerInfo, amount, orderId }).then(async (response) => {
            console.log("/checkout response :", JSON.stringify(response.data))
            let data = response.data
            if (data.status == 1 && data.head.signature) {
                /*/////////////////////////////////////////////////////
                // #To Verfiy Signature You need only the following three fields
                // trxToken + trxStatus + order.orderId
                *//////////////////////////////////////////////////////
                let { trxToken, trxStatus, order } = data.body
                var input = trxToken + trxStatus + order.orderId
                var verfiy = BasChecksum.verifySignature(input, MKEY, data.head.signature)
                console.log("verfiy :", verfiy)

                if (verfiy) {
                    return res.status(200).json(data.body)
                } else {
                    return res.status(403).json(data.body)
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
    console.log(`==================== //status/${orderId} STARTED ========================`)
    if (orderId) {
        await BasPayment.paymentStatus(orderId).then(async (response) => {
            console.log("/status/:orderId response :", JSON.stringify(response.data))
            let data = response.data //await response.json()
            if (data.status == 1 && data.head.signature) {
                // Only these fields required trxToken + trxToken + order.orderId
                let { trxToken, trxStatus, order } = data.body
                var input = trxToken + trxStatus + order.orderId
                var verfiy = BasChecksum.verifySignature(input, MKEY, data.head.signature)
                if (verfiy) {
                    return res.status(200).json(data.body)
                } else {
                    return res.status(403).json(data.body)
                }
            } else {
                return res.status(403).json(data)
            }
        }).catch((error) => {
            let data = error.response.data || error || '{}'
            console.error("Error :", data)
            return res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "OrderId Not Seleceted" })
    }


});


module.exports = router;