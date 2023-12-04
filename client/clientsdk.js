
//#region BAS SDK Client Side 
let isJSBridgeReady = false
console.log("Start ClientSDK Script");

async function initBas() {
    console.log("initBas() STARTED");

    window.addEventListener("JSBridgeReady", async (event) => {
        console.log("JSBridgeReady fired ");
        isJSBridgeReady = true
        //to do anything you want after SDK is ready
        // await getBasAuthCode(BAS_CLIENT_ID);
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
            // alert(JSON.stringify(result))
            console.log("getBasAuthCode Result:", JSON.stringify(result));
            if (result) {
                return result;
            } else {
                return null
            }
        });
}

const basPayment = async (data) => {
    let paymentParams = {
        "amount": {
            "value": data.totalAmount,
            "currency": data.currency,
        },
        "orderId": data.orderId,
        "transactionToken": data.trxToken,
        "merchantId": BAS_CLIENT_ID,
        "appId": BAS_APP_ID
    }

    return JSBridge.call('basPayment', paymentParams).then(function (result) {
        /****** Response Example ******/
        /*{
        "merchantId": "",
        "orderId": "",
        "transactionId": "",
        "amount": {
        "value": 0,
        "currency": "YER"
        },
        "paymentType": "",
        "date": "",
        "status":1
        }*/
        /****** End Response Example ******/
        console.log(JSON.stringify(result));
    });

}
//#endregion

//#region Helper Functions 
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
    const data =await ans.json();
    console.log('data :', JSON.stringify(data));
    if (data) {
        return data;
    }
}

async function getPayment(order) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var url = `${BASE_URL}/order/checkout`
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(order),
        redirect: 'follow'
    };

    console.log("params :", url, JSON.stringify(order));
    const ans = await fetch(url, requestOptions)
    const data = ans.json();
    console.log('data :', data);
    if (data) {
        return data;
    }

}

//#endregion