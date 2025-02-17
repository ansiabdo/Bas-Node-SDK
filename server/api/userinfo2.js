var express = require('express');
require('dotenv').config()
var BasAuth = require('./server-sdk/basauth');

const router = express.Router();

router.post('/userinfo2', async (req, res) => {
    // Your logic to handle payment initiation
    var { authid } = req.body
    console.log("userinfo2 req :", req.body)

    if (authid) {
        await BasAuth.getBasUserInfoV2(authid).then(async (response) => {
            let userData = await response.json()
            console.log("================== userinfo2 userData :", JSON.stringify(userData))
            return res.status(200).json(userData)
        }).catch((error) => {
            let errdata = error.response.data
            console.error("Error in userinfo2 :", errdata)
            return res.status(409).send(errdata)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "Authid Required" })
    }


});


module.exports = router;