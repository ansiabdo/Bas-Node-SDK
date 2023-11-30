'use strict';

var PAYTM_STAG_URL = 'https://pguat.paytm.com';
var PAYTM_PROD_URL = 'https://secure.paytm.in';
var MID = 'WorldP64425807474247';
var PAYTM_ENVIORMENT = 'TEST';   // PROD FOR PRODUCTION
var PAYTM_MERCHANT_KEY = 'kbzk1DSbJiV_O3p5';
var WEBSITE = 'worldpressplg';
var CHANNEL_ID =  'WEB';
var INDUSTRY_TYPE_ID = 'Retail';
var PAYTM_FINAL_URL = '';
if (PAYTM_ENVIORMENT== 'TEST') {
  PAYTM_FINAL_URL = 'https://securegw-stage.paytm.in/theia/processTransaction';
}else{
  PAYTM_FINAL_URL = 'https://securegw.paytm.in/theia/processTransaction';
}

module.exports = {

    MID: MID,
    PAYTM_MERCHANT_KEY :PAYTM_MERCHANT_KEY,
    PAYTM_FINAL_URL :PAYTM_FINAL_URL,
    WEBSITE: WEBSITE,
    CHANNEL_ID: CHANNEL_ID,
    INDUSTRY_TYPE_ID: INDUSTRY_TYPE_ID

};
