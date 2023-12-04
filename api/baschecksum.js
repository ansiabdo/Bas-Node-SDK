"use strict";

var crypto = require('crypto');

class BasChecksum {

	static encrypt(input, key) {
		console.log("========= input, Key:", input, key)
		var cipher = crypto.createCipheriv('AES-192-CBC', key, BasChecksum.iv);
		var encrypted = cipher.update(input, 'binary', 'base64');
		console.log("========= encrypted:", encrypted)
		encrypted += cipher.final('base64');
		console.log("========= encrypted + cipher.final('base64'):", encrypted)
		return encrypted;
	}
	static decrypt(encrypted, key) {
		var decipher = crypto.createDecipheriv('AES-192-CBC', key, BasChecksum.iv);
		var decrypted = decipher.update(encrypted, 'base64', 'binary');
		try {
			decrypted += decipher.final('binary');
		}
		catch (e) {
			console.log(e);
		}
		return decrypted;
	}
	static generateSignature(params, key) {
		console.log(`=========== params :${params}\nkey:${key}`)
		if (typeof params !== "object" && typeof params !== "string") {
			var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if (typeof params !== "string") {
			params = BasChecksum.getStringByParams(params);
		}
		return BasChecksum.generateSignatureByString(params, key);
	}


	static verifySignature(params, key, checksum) {
		if (typeof params !== "object" && typeof params !== "string") {
			var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if (params.hasOwnProperty("CHECKSUMHASH")) {
			delete params.CHECKSUMHASH
		}
		if (typeof params !== "string") {
			params = BasChecksum.getStringByParams(params);
		}
		return BasChecksum.verifySignatureByString(params, key, checksum);
	}

	static async generateSignatureByString(params, key) {
		var salt = await BasChecksum.generateRandomString(4);
		return BasChecksum.calculateChecksum(params, key, salt);
	}

	static verifySignatureByString(params, key, checksum) {
		var paytm_hash = BasChecksum.decrypt(checksum, key);
		var salt = paytm_hash.substr(paytm_hash.length - 4);
		return (paytm_hash === BasChecksum.calculateHash(params, salt));
	}

	static generateRandomString(length) {
		return new Promise(function (resolve, reject) {
			crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
				if (!err) {
					var salt = buf.toString("base64");
					// resolve(salt);
					resolve('aaaa');
				}
				else {
					console.log("error occurred in generateRandomString: " + err);
					reject(err);
				}
			});
		});
	}

	static getStringByParams(params) {
		console.log('====== getStringByParams params:', JSON.stringify(params))
		var data = {};
		Object.keys(params).sort().forEach(function (key, value) {
			console.log('====== getStringByParams key:', key)
			if (params[key] !== null && typeof params[key] !== 'undefined') {
				data[key] = params[key] !== "null" ? params[key] : "";
			} else {
				data[key] = "";
			}
		});
		return Object.values(data).join('|');
	}

	static calculateHash(params, salt) {
		var finalString = params + "|" + salt;
		return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
	}
	static calculateChecksum(params, key, salt) {
		var hashString = BasChecksum.calculateHash(params, salt);
		console.log(`========== calculateChecksum() hashString\n${hashString}`)
		return BasChecksum.encrypt(hashString, key);
	}
}
BasChecksum.iv = '@@@@&&&&####$$$$';
// BasChecksum.iv = 'dddd888855556666';
module.exports = BasChecksum;