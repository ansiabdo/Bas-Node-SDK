var express = require('express');
require('dotenv').config()
var BasAuth = require('./server-sdk/basauth');

const router = express.Router();

router.post('/userinfo', async(req, res) => {
    // Your logic to handle payment initiation
    var { authid } = req.body
    console.log("userinfo req :", req.body)

    if (authid) {
        await BasAuth.getBasToken(authid).then(async(response) => {
            let data = await response.json()
            console.log("================== getBasToken data :", data)
            access_token = data.access_token
            await BasAuth.getBasUserInfo(access_token).then(async(user) => {
                let userData = await user.json()
                console.log("================== getBasUserInfo data :", data)
                return res.status(200).json(userData)
            }).catch((error) => {
                let data = error.response.data
                console.error("Error :", data)
                return res.status(409).send(data)
            })
        }).catch((error) => {
            let data = error.response.data
            console.error("Error :", data)
            return res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "Authid Required" })
    }


});


module.exports = router;