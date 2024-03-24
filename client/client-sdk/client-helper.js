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