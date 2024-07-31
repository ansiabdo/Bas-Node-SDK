
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
            /****** Response Example ******/
            /*
            {
                "status":1,
                "data":{
                    "auth_id":"FD268ED889B7DFB008093D04809E8B7FC26B821421B278",
                    "authid":"FD268ED889B7DFB008093D04809E8B7FC26B821421B278",
                    "openid":"null",
                    "return_url":"null"},
                "messages":["تمت العملية بنجاح"]
            }
            */
            /****** End Response Example ******/
            // alert(JSON.stringify(result))
            console.log("getBasAuthCode Result:", JSON.stringify(result));
            if (result) {
                return result;
            } else {
                return null
            }
        });
}

const getBasPayment = async (data) => {
    let paymentParams = {
        "amount": {
            "value": data.order?.amount?.totalAmount ?? '0',
            "currency": data.order?.amount?.currency ?? 'YER',
        },
        "orderId": data.order?.orderId ?? '111',
        "trxToken": data.trxToken,
        // "merchantId": BAS_CLIENT_ID,
        "appId": BAS_APP_ID
    }
    // let paymentParams = {
    //     "amount": {
    //         "value": data.order?.amount?.totalAmount ?? '0',
    //         "currency": data.order?.amount?.currency ?? 'YER',
    //     },
    //     "orderId": data.order?.orderId ?? '111',
    //     "transactionToken": data.trxToken,
    //     "merchantId": BAS_CLIENT_ID,
    //     "appId": BAS_APP_ID
    // }
    console.log("========== getBasPayment Params :", JSON.stringify(paymentParams))
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
