"use strict";

// var { crypto } = require('crypto');
var crypto = require('node:crypto');
// const {createCipheriv, createDecipheriv, randomBytes, createHash } = require('node:crypto');

// var util = require('util');

var crypt = {
  // iv: '@@@@&&&&####$$$$',
  // iv : crypto.randomBytes(16),
  iv: 'dddd888855556666',
  // iv: Buffer.from([
  //   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  //   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  // ]),
  encrypt: function (data, custom_key) {
    var iv = this.iv;
    // var key = custom_key;
    const key = crypto.createHash('sha256',).update(custom_key).digest()

    console.log('======== encrypt.old key:', key.length, key)
    var algo = '256';
    switch (key.length) {
      case 16:
        algo = '128';
        break;
      case 24:
        algo = '192';
        break;
      case 32:
        algo = '256';
        break;

    }
    var cipher = crypto.createCipheriv('AES-' + algo + '-CBC', key, iv);
    var encrypted = cipher.update(data, 'binary', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  },

  decrypt: function (data, custom_key) {
    var iv = this.iv;
    var key = custom_key;
    var algo = '256';
    switch (key.length) {
      case 16:
        algo = '128';
        break;
      case 24:
        algo = '192';
        break;
      case 32:
        algo = '256';
        break;
    }
    var decipher = crypto.createDecipheriv('AES-' + algo + '-CBC', key, iv);
    var decrypted = decipher.update(data, 'base64', 'binary');
    try {
      decrypted += decipher.final('binary');
    } catch (e) {
      console.log(e);
    }
    return decrypted;
  },

  gen_salt: function (length, cb) {
    crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
      var salt;
      if (!err) {
        salt = buf.toString("base64");
        salt = 'aaaa'
      }
      //salt=Math.floor(Math.random()*8999)+1000;
      cb(err, salt);
    });
  },

  /* one way md5 hash with salt */
  md5sum: function (salt, data) {
    return crypto.createHash('md5').update(salt + data).digest('hex');
  },

  sha256sum: function (salt, data) {
    return crypto.createHash('sha256').update(data + salt).digest('hex');
  }
};

module.exports.crypt = crypt;

// (function () {
//   var i;

//   function logsalt(err, salt) {
//     if (!err) {
//       console.log('salt is ' + salt);
//     }
//   }

//   if (require.main === module) {
//     var enc = crypt.encrypt('One97');
//     console.log('encrypted - ' + enc);
//     console.log('decrypted - ' + crypt.decrypt(enc));

//     for (i = 0; i < 5; i++) {
//       crypt.gen_salt(4, logsalt);
//     }
//   }

// }());
