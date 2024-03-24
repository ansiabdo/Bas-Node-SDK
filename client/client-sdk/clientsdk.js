
//#region BAS SDK Client Side 
var isJSBridgeReady = false
console.log("Start Bas-ClientSDK Script");

async function initBas() {
    console.log("initBas() STARTED");

    window.addEventListener("JSBridgeReady", async (event) => {
        console.log("JSBridgeReady fired ");
        isJSBridgeReady = true
    }, false);
}

initBas();

const isBasSupperApp = () => {
    return isJSBridgeReady;
}

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
            "value": data.order?.amount?.totalAmount ?? '0',
            "currency": data.order?.amount?.currency ?? 'YER',
        },
        "orderId": data.order?.orderId ?? '111',
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
        console.log("basPayment Result:", JSON.stringify(result));
        if (result) {
            return result;
        } else {
            return null
        }
    });

}


//#endregion
