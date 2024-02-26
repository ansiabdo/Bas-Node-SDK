// 'use strict';

var BAS_ENVIORMENT = 'TEST'; // 'PROD';   // PROD FOR PRODUCTION

var BAS_APP_ID_PROD = "8f4871cb-b5ed-487e-baae-b6301f29db08"
var BAS_APP_ID_TEST = "8f4871cb-b5ed-487e-baae-b6301f29db08"
var BAS_APP_ID = BAS_ENVIORMENT == 'TEST' ? BAS_APP_ID_TEST : BAS_APP_ID_PROD

var BAS_CLIENT_ID_PROD = '653ed1ff-59cb-41aa-8e7f-0dc5b885a024'
var BAS_CLIENT_ID_TEST = '653ed1ff-59cb-41aa-8e7f-0dc5b885a024'
var BAS_CLIENT_ID = BAS_ENVIORMENT == 'TEST' ? BAS_CLIENT_ID_TEST : BAS_CLIENT_ID_PROD

///////// Merchant API URLS ////////////////////////
var BASE_URL_PROD = "https://bas-node-sdk.onrender.com"
var BASE_URL_TEST = "http://localhost:3000"
var BASE_URL = BAS_ENVIORMENT == 'TEST' ? BASE_URL_TEST : BASE_URL_PROD


var CALLBACK_URL = BASE_URL + "/api/v1/callback"