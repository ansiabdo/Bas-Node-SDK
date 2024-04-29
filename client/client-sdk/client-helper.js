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
    const data = await ans.json();
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
    const data = await ans.json();
    /****** Response Example ******/
    /*
    {
        "trxStatusId": 1001,
        "trxStatus": "received",
        "trxId": "35146363-a00a-4b33-baf0-22c32e6dce4a",
        "trxToken": "dRIehnBo3IhjYxQ1CqAzS7rwIsMubc5KUFkxMTExMzk3OTIx",
        "authenticated": true,
        "order": {
            "appId": "8f4871cb-b5ed-487e-baae-b6301f29db08",
            "orderId": "1111397921",
            "orderType": "PayBill",
            "amount": {
                "value": 1100,
                "currency": "YER"
            },
            "description": "Pay bill, reference no PayBill to 1111397921",
            "callBackUrl": "mla3b.com",
            "creationDate": "2024-04-29T20:19:27.5535752+03:00",
            "orderDetails": {
                "Id": "1111397921",
                "Products": [],
                "Currency": "YER",
                "TotalPrice": 1100
            }
        }
    }
    */
    /****** End Response Example ******/
    console.log('data :', JSON.stringify(data));
    if (data) {
        return data;
    }

}

async function checkPaymentStatus(orderId) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var url = `${BASE_URL}/order/status/${orderId}`
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    console.log("params :", url, orderId);
    const ans = await fetch(url, requestOptions)
    const data = await ans.json();
    console.log('data :', data);

    if (data) {
        return data;
    }

}

//#endregion