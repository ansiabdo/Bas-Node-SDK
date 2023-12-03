import express from 'express';
const { crypt } = await import('./crypt.js');
import qs from 'qs';
// require('dotenv').config()
import * as dotevnv from "dotenv";

dotevnv.config();

const router = express.Router();

const CLIENTID = process.env.BAS_CLIENT_ID ?? "fbbc6c5d-c471-42dd-a46a-9a2bad1c99cd";
const MKEY = process.env.BAS_MKEY ?? "R0Biem8wOUIySkJxNGd6cQ==";
const BASURL = process.env.BAS_BASE_URL

router.post('/userinfo', async (req, res) => {
    // Your logic to handle payment initiation
    var { authid } = req.body
    console.log("userinfo req :", req.body)

    if (authid) {
        await getToken(authid).then(async (response) => {
            let data = await response.json()
            console.log("response :", data)
            res.status(200).json(data)
        }).catch((error) => {
            let data = error?.response?.data ?? '{}'
            console.error("Error :", data)
            res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "Authid Required" })
    }


});

async function getToken(authid) {
    console.log("getToken :", authid)
    if (authid) {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        console.log("getToken :", myHeaders)


        var raw = {
            'client_id': CLIENTID,
            'client_secret': MKEY,
            'grant_type': 'authorization_code',
            'code': authid,
            'redirect_uri': `${BASURL}/api/v1/auth/callback`,
        };

        var url = `${BASURL}/api/v1/auth/token`

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: qs.stringify(raw),
            // redirect: 'follow'
        };

        console.log("params :", url, qs.stringify(raw));
        return await fetch(url, requestOptions)
    }
}

async function initPayment(authid) {
    if (authid) {
        var params = {};
        /* initialize an array */
        params['client_id'] = CLIENTID
        params['client_secret'] = MKEY
        params['grant_type'] = 'authorization_code'
        params['code'] = authid
        params['redirect_uri'] = `${BASURL}/api/v1/auth/callback`
        // params['redirect_uri'] = `https://stagebas.yk-bank.com:9101/api/v1/auth/callback`

        console.log("params :", params)

        await fetch(`${BASURL}/api/v1/auth/token`, {
            body: qs.stringify(params), method: "POST", headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        })
            .then(async (response) => {
                let data = await response.json()
                console.log("response :", data)
                res.status(200).json(data)
            }).catch((error) => {
                let data = error?.response?.data ?? '{}'
                console.error("Error :", data)
                res.status(500).send(data)
            })
    }
}

export default router;
