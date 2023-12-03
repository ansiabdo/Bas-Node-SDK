let isJSBridgeReady = false
console.log("Start ClientSDK Script");

// var BASE_URL = require('../config/config.js')

async function initBas() {
    console.log("initBas() STARTED");

    window.addEventListener("JSBridgeReady", async (event) => {
        console.log("JSBridgeReady fired ");
        isJSBridgeReady = true
        //to do anything you want after SDK is ready
        await getBasAuthCode(BAS_CLIENT_ID);
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

            authData = result
            // alert(JSON.stringify(result))
            console.log("Result 2:", JSON.stringify(result));
            try {
                let div = document.createElement("div");
                let heading1 = document.createElement("h6");
                heading1.innerText = `Auth Data :\n${result?.data?.authId}`;
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



async function getUserInfo(authId) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "authid": authId
    });

    var url = `${BASE_URL}/auth/userinfo`
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    console.log("params :", url, raw);
    const ans = await fetch(url, requestOptions)
    const data = ans.json();
    console.log('data :', data);
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

