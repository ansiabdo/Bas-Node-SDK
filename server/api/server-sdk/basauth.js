var express = require('express');
require('dotenv').config()

class BasAuth {
    static async getBasToken(order) {
        return await getBasToken(order)
    }
    static async getBasUserInfo(Authid) {
        return await getBasUserInfo(Authid)
    }

    static async getBasUserInfoV2(Authid) {
        return await getBasUserInfoV2(Authid)
    }
}

const CLIENTID = process.env.BAS_CLIENT_ID //? ? "fbbc6c5d-c471-42dd-a46a-9a2bad1c99cd";
const CLIENT_SECRET = process.env.BAS_CLIENT_SECERT
const BASURL = process.env.BAS_BASE_URL

async function getBasToken(authid) {
    console.log("getBasToken :", authid)
    if (authid) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        console.log("getBasToken :", myHeaders)

        var urlencoded = new URLSearchParams();
        urlencoded.append("client_id", CLIENTID);
        urlencoded.append("client_secret", CLIENT_SECRET);
        urlencoded.append("grant_type", "authorization_code");
        urlencoded.append("code", authid);
        urlencoded.append("redirect_uri", `${BASURL}/api/v1/auth/callback`);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        var url = `${BASURL}/api/v1/auth/token`

        console.log("params :", url, urlencoded.toString());
        return await fetch(url, requestOptions)
    }
}

async function getBasUserInfo(token) {
    console.log("getBasUserInfo :", token)
    if (token) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        console.log("getBasUserInfo :", myHeaders)
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        var url = `${BASURL}/api/v1/auth/userinfo`
        console.log("params :", url);
        return await fetch(url, requestOptions)
    }
}


async function getBasUserInfoV2(authid) {
    console.log("getBasUserInfoV2 :", authid)
    if (authid) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        console.log("getBasUserInfoV2 :", myHeaders)

        var urlencoded = new URLSearchParams();
        urlencoded.append("client_id", CLIENTID);
        urlencoded.append("client_secret", CLIENT_SECRET);
        urlencoded.append("grant_type", "authorization_code");
        urlencoded.append("code", authid);
        urlencoded.append("redirect_uri", `${BASURL}/api/v1/auth/callback`);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        var url = `${BASURL}/api/v1/auth/secure/userinfo`

        console.log("params :", url, urlencoded.toString());
        return await fetch(url, requestOptions)
    }
}
module.exports = BasAuth;
// export default router;