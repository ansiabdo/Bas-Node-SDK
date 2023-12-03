import express from 'express';
import * as checksum from './checksum.js';
import * as config from '../config/config.js';
import axios from 'axios';
const { crypt } = await import('./crypt.js');
import qs from 'qs';

const router = express.Router();

const CLIENTID = config.BAS_CLIENT_ID ?? "fbbc6c5d-c471-42dd-a46a-9a2bad1c99cd";
const MKEY = config.BAS_MKEY ?? "R0Biem8wOUIySkJxNGd6cQ==";
const BASURL = config.BAS_FINAL_URL
const generateOrderId = () => {
    // Logic to generate a unique order ID (you can use a library or custom logic)
    return 'ORDER_' + Math.floor(Math.random() * 1000000);
};

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
        myHeaders.append("Content-Type: application/x-www-form-urlencoded");

        console.log("getToken :", myHeaders)


        var raw = JSON.stringify({
            'client_id': CLIENTID,
            'client_secret': MKEY,
            'grant_type': 'authorization_code',
            'code': authid,
            'redirect_uri': `${BASURL}/api/v1/auth/callback`,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: qs.stringify(raw),
            redirect: 'follow'
        };

        console.log("params :", raw);
        return await fetch(`${BASURL}/api/v1/auth/token`, requestOptions)
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
