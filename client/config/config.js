// 'use strict';

var BAS_ENVIORMENT = 'PROD';   // PROD FOR PRODUCTION

var BAS_APP_ID_PROD = "4bcb8478-cdf0-488d-ad42-00f7ffdc3d88"
var BAS_APP_ID_TEST = "4bcb8478-cdf0-488d-ad42-00f7ffdc3d88"
var BAS_APP_ID = BAS_ENVIORMENT == 'TEST' ? BAS_APP_ID_TEST : BAS_APP_ID_PROD

var BAS_CLIENT_ID_PROD = 'fbbc6c5d-c471-42dd-a46a-9a2bad1c99cd'
var BAS_CLIENT_ID_TEST = 'fbbc6c5d-c471-42dd-a46a-9a2bad1c99cd'
var BAS_CLIENT_ID = BAS_ENVIORMENT == 'TEST' ? BAS_CLIENT_ID_TEST : BAS_CLIENT_ID_PROD

///////// Merchant API URLS ////////////////////////
var BASE_URL_PROD = "https://bas-node-sdk.onrender.com"
var BASE_URL_TEST = "http://localhost:3000"
var BASE_URL = BAS_ENVIORMENT == 'TEST' ? BASE_URL_TEST : BASE_URL_PROD


var CALLBACK_URL = BASE_URL + "/api/v1/callback"
