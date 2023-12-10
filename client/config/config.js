// 'use strict';

var BAS_ENVIORMENT = 'PROD';   // PROD FOR PRODUCTION

var BAS_APP_ID_PROD = "469cc60f-c986-475c-87e7-3c5e7ea16ab8"
var BAS_APP_ID_TEST = "469cc60f-c986-475c-87e7-3c5e7ea16ab8"
var BAS_APP_ID = BAS_ENVIORMENT == 'TEST' ? BAS_APP_ID_TEST : BAS_APP_ID_PROD

var BAS_CLIENT_ID_PROD = 'af942f3a-3f14-4574-9235-99f4d4c6f46b'
var BAS_CLIENT_ID_TEST = 'af942f3a-3f14-4574-9235-99f4d4c6f46b'
var BAS_CLIENT_ID = BAS_ENVIORMENT == 'TEST' ? BAS_CLIENT_ID_TEST : BAS_CLIENT_ID_PROD

///////// Merchant API URLS ////////////////////////
var BASE_URL_PROD = "https://bas-node-sdk.onrender.com"
var BASE_URL_TEST = "http://localhost:3000"
var BASE_URL = BAS_ENVIORMENT == 'TEST' ? BASE_URL_TEST : BASE_URL_PROD


var CALLBACK_URL = BASE_URL + "/api/v1/callback"
