// import * as config from './../config/config.js';
// const {BAS_CLIENT_ID}=require("../config/config.js")

// const clientId = BAS_CLIENT_ID // "<MERCHANT CLIENTID>"
let isJSBridgeReady = false
// let authData;
console.log("Start ClientSDK Script");

async function initBas() {
    console.log("initBas() STARTED");

    window.addEventListener("JSBridgeReady", async (event) => {
        console.log("JSBridgeReady fired ");
        isJSBridgeReady = true
        //to do anything you want after SDK is ready
        await getBasAuthCode();
        // .then((v) => {
        //     console.log("getBasAuthCode v:", v);

        // });
    }, false);
}

initBas();

const getBasAuthCode = async (clientId) => {
    if (!isJSBridgeReady) await initBas();
    console.log("getBasAuthCode() STARTED");

    return JSBridge.call('basFetchAuthCode',
        {
            clientId: clientId
        }).then(function (result) {
            /****** Response Example ******/
            /* {
            "status": 1,
            "data": {
            "authId": "",
            "openId": ""
            },
            "messages": [""]
            }*/
            /****** End Response Example ******/
            authData = result
            // alert(JSON.stringify(result))
            console.log("Result 2:", JSON.stringify(result));
            try {
                let div = document.createElement("div");
                let heading1 = document.createElement("h6");
                heading1.innerText = `Auth Data :\n${result.data.authId}`;
                div.appendChild(heading1)
                document.body.appendChild(div);
            } catch (error) {
                console.log("ERROR :", error)
            }

            if (result) {
                return result;
            }
        });
}

// async function getToken(authData) {
//     console.log("yes");
//     const ans = await fetch(`${BASE_URL}/auth/token`, {
//         method: "POST",
//         body: authData,
//     })

//     const data = await ans.json();
//     console.log('start_payment :', data.param_dict);
//     if (data) {
//         return data;
//     }

// }

async function getUserInfo(authId) {

    let params = {
        authid: authId
    }
    console.log("params :", JSON.stringify(params));
    const ans = await fetch(`${BASE_URL}/auth/userinfo`, {
        method: "POST",
        body: JSON.stringify(params)
    })

    const data = await ans.json();
    console.log('start_payment :', data.param_dict);
    if (data) {
        return data;
    }

}

async function getPayment(callback) {
    console.log("yes");
    const ans = await fetch('https://maddening-face-production.up.railway.app/api/payment/start_payment', {
        method: "POST",
    })
    const data = await ans.json();
    console.log('start_payment :', data.param_dict);
    if (data) {
        callback(data);
    }

}

