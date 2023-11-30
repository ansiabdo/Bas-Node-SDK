"use strict";

// import { crypt } from './crypt.js'
// var crypt = require('./crypt');
// var crypto = require('crypto');
const { createCipheriv, createDecipheriv, randomBytes, createHash } = await import('node:crypto');
const { crypt } = await import('./crypt.js');

//mandatory flag: when it set, only mandatory parameters are added to checksum

function paramsToString(params, mandatoryflag) {
  var data = '';
  var tempKeys = Object.keys(params);
  tempKeys.sort();
  tempKeys.forEach(function (key) {
    var n = params[key].includes("REFUND");
    var m = params[key].includes("|");
    if (n == true) {
      params[key] = "";
    }
    if (m == true) {
      params[key] = "";
    }
    if (key !== 'CHECKSUMHASH') {
      if (params[key] === 'null') params[key] = '';
      if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
        data += (params[key] + '|');
      }
    }
  });
  return data;
}


function genchecksum(params, key, cb) {
  var data = paramsToString(params);
  crypt.gen_salt(4, function (err, salt) {
    var sha256 = createHash('sha256').update(data + salt).digest('hex');
    var check_sum = sha256 + salt;
    var encrypted = crypt.encrypt(check_sum, key);
    params.CHECKSUMHASH = encrypted;
    cb(undefined, params);
  });
}

function genchecksumbystring(params, key, cb) {

  crypt.gen_salt(4, function (err, salt) {
    var sha256 = createHash('sha256').update(params + '|' + salt).digest('hex');
    var check_sum = sha256 + salt;
    var encrypted = crypt.encrypt(check_sum, key);

    var CHECKSUMHASH = encodeURIComponent(encrypted);
    CHECKSUMHASH = encrypted;
    cb(undefined, CHECKSUMHASH);
  });
}

function verifychecksum(params, key) {
  var data = paramsToString(params, false);
  //TODO: after PG fix on thier side remove below two lines
  if (params.CHECKSUMHASH) {
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\n', '');
    params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\r', '');

    var temp = decodeURIComponent(params.CHECKSUMHASH);
    var checksum = crypt.decrypt(temp, key);
    var salt = checksum.substr(checksum.length - 4);
    var sha256 = checksum.substr(0, checksum.length - 4);
    var hash = createHash('sha256').update(data + salt).digest('hex');
    if (hash === sha256) {
      return true;
    } else {
      console.log("checksum is wrong");
      return false;
    }
  } else {
    console.log("checksum not found");
    return false;
  }
}

function verifychecksumbystring(params, key, checksumhash) {

  var checksum = crypt.decrypt(checksumhash, key);
  var salt = checksum.substr(checksum.length - 4);
  var sha256 = checksum.substr(0, checksum.length - 4);
  var hash = createHash('sha256').update(params + '|' + salt).digest('hex');
  if (hash === sha256) {
    return true;
  } else {
    console.log("checksum is wrong");
    return false;
  }
}

function genchecksumforrefund(params, key, cb) {
  var data = paramsToStringrefund(params);
  crypt.gen_salt(4, function (err, salt) {
    var sha256 = createHash('sha256').update(data + salt).digest('hex');
    var check_sum = sha256 + salt;
    var encrypted = crypt.encrypt(check_sum, key);
    params.CHECKSUM = encodeURIComponent(encrypted);
    cb(undefined, params);
  });
}

function paramsToStringrefund(params, mandatoryflag) {
  var data = '';
  var tempKeys = Object.keys(params);
  tempKeys.sort();
  tempKeys.forEach(function (key) {
    var m = params[key].includes("|");
    if (m == true) {
      params[key] = "";
    }
    if (key !== 'CHECKSUMHASH') {
      if (params[key] === 'null') params[key] = '';
      if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
        data += (params[key] + '|');
      }
    }
  });
  return data;
}

// module.exports.genchecksum = genchecksum;
// module.exports.verifychecksum = verifychecksum;
// module.exports.verifychecksumbystring = verifychecksumbystring;
// module.exports.genchecksumbystring = genchecksumbystring;
// module.exports.genchecksumforrefund = genchecksumforrefund;
