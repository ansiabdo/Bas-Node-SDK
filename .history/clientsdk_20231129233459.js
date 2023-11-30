const clientId = "fbbc6c5d-c471-42dd-a46a-9a2bad1c99cd"// "<MERCHANT CLIENTID>"
let isJSBridgeReady = false
let authData;
console.log("Start ClientSDK Script");

// window.addEventListener("JSBridgeReady", (event) => {
//     console.log("JSBridgeReady fired 11");
//     //to do anything you want after SDK is ready
//     basFetchAuthCode().then((v) => {
//         console.log("basFetchAuthCode v:", v);
//     });
// }, false);

//Only if the first listener not working
export async function initBas() {
    console.log("initBas() STARTED");

    window.addEventListener("JSBridgeReady", (event) => {
        console.log("JSBridgeReady fired 22");
        //to do anything you want after SDK is ready
        basFetchAuthCode().then((v) => {
            console.log("basFetchAuthCode v:", v);

        });
    }, false);
}

await initBas();

export async function basFetchAuthCode() {
    if (!isJSBridgeReady) await initBas();
    console.log("basFetchAuthCode() STARTED");

    JSBridge.call('basFetchAuthCode',
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
            console.log(JSON.stringify(result));
            try {
                let heading1 = document.createElement("h1");
                heading1.innerText = `Auth Data :\n${JSON.stringify(result)}`;
            } catch (error) {
                console.log("ERROR :", error)
            }

            if (result) {
                return result;
            }
        });
}

export const basFetchAuthCode2 = async () => {
    if (!isJSBridgeReady) await initBas();
    console.log("basFetchAuthCode() STARTED");

    JSBridge.call('basFetchAuthCode',
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
            console.log(JSON.stringify(result));
            try {
                let heading1 = document.createElement("h1");
                heading1.innerText = `Auth Data :\n${JSON.stringify(result)}`;
            } catch (error) {
                console.log("ERROR :", error)
            }

            if (result) {
                return result;
            }
        });
}

export async function getPayment(callback) {
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

async function sendData(res) {
    let keyArr = Object.keys(res.param_dict);
    let valArr = Object.values(res.param_dict);

    console.log("Keys:", keyArr);
    console.log("Values:", valArr);
    // when we start the payment verification we will hide our Product form


    // Lets create a form by DOM manipulation
    // display messages as soon as payment starts
    let heading1 = document.createElement("h1");
    heading1.innerText = "Auth Data :";
    // let heading2 = document.createElement("h1");
    // heading2.innerText = "Please do not refresh your page....";

    //create a form that will send necessary details to the paytm
    let frm = document.createElement("form");
    frm.action = "https://securegw-stage.paytm.in/order/process/";
    frm.method = "post";
    frm.id = "paytmForm";

    // we have to pass all the credentials that we've got from param_dict
    keyArr.forEach((k, i) => {
        // create an input element
        let inp = document.createElement("input");
        inp.key = i;
        inp.type = "hidden";
        // input tag's name should be a key of param_dict
        inp.name = k;
        // input tag's value should be a value associated with the key that we are passing in inp.name
        inp.value = valArr[i];
        // append those all input tags in the form tag
        frm.appendChild(inp);
    });

    // append all the above tags into the body tag
    document.body.appendChild(heading1);
    document.body.appendChild(heading2);
    document.body.appendChild(frm);
    // finally submit that form
    frm.submit();

}

// module.exports={
//     basFetchAuthCode,
//     getPayment,
// }