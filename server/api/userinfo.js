var express = require('express');
require('dotenv').config()
var BasAuth = require('./server-sdk/basauth');

const router = express.Router();

router.post('/userinfo', async (req, res) => {
    // Your logic to handle payment initiation
    var { authid } = req.body
    console.log("userinfo req :", req.body)

    if (authid) {
        await BasAuth.getBasToken(authid).then(async (response) => {
            let data = await response.json()
            console.log("================== getBasToken data :", JSON.stringify(data))
            access_token = data.access_token
            await BasAuth.getBasUserInfo(access_token).then(async (user) => {
                let userData = await user.json()
                console.log("================== getBasUserInfo userData :", JSON.stringify(userData))
                return res.status(200).json(userData)
            }).catch((error) => {
                let errdata = error //.response.data
                console.error("Error :", errdata)
                return res.status(409).send(errdata)
            })
        }).catch((error) => {
            let errdata = error.response.data
            console.error("Error :", errdata)
            return res.status(409).send(errdata)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "Authid Required" })
    }


});


router.post('/userinfov2', async (req, res) => {
    // Your logic to handle payment initiation
    var { authid } = req.body
    console.log("userinfov2 req :", req.body)

    if (authid) {
        await BasAuth.getBasUserInfoV2(authid).then(async (response) => {
            let userData = await response.json()
            console.log("================== userinfov2 userData :", JSON.stringify(userData))
            return res.status(200).json(userData)
        }).catch((error) => {
            let errdata = error.response.data
            console.error("Error in userinfov2 :", errdata)
            return res.status(409).send(errdata)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "Authid Required" })
    }


});



module.exports = router;