"use strict";

const crypto = require('crypto');
const Rijndael = require('rijndael-js');
const padder = require('pkcs7-padding');
var AES = require('aes-js');
class BasChecksum {

	// static encrypt(input, key) {
	// 	console.log("=========192 input, Key:", input, key)
	// 	try {
	// 		const plainText = Buffer.from(input, 'utf8');
	// 		//Pad plaintext before encryption
	// 		const padded = padder.pad(plainText, 24); //Use 32 = 256 bits block sizes

	// 		const key2 = Buffer.from(key, "utf8"); //32 bytes key length
	// 		const iv = Buffer.from(BasChecksum.iv, "utf8")//crypto.randomBytes(16); //32 bytes IV
	// 		console.log("=========192 key2 , iv:", key2, iv)

	// 		const cipher = new Rijndael(key2, 'cbc'); //CBC mode
	// 		const encrypted = cipher.encrypt(padded, 192, iv);
	// 		console.log("=========192 encrypted:", encrypted)
	// 		console.log("=========192 encrypted-base64:", encrypted.toString("base64"))

	// 		return encrypted;
	// 	} catch (error) {
	// 		console.log("=========192 Error192:", error)

	// 	}
	// }

	static encrypt256(input, key) {
		const key2 = crypto.createHash('sha256',).update(key).digest()
		var cipher = crypto.createCipheriv('AES-256-CBC', key2, BasChecksum.iv);
		var encrypted = cipher.update(input, 'binary', 'base64');
		encrypted += cipher.final('base64');
		console.log("============== encrypt256 encrypted:", encrypted)
		return encrypted;
	}

	static encryptNew = function (input, key) {
		const keySize = 256;
		const key2 = crypto.createHash('sha256',).update(key).digest()
		console.log("============== encrypt key2:", key2)
		console.log("============== encrypt key2:", key2.toString("binary").length)
		const initVector = BasChecksum.iv;
		const initVectorBytes = Buffer.from(initVector, "utf8");
		// const plainText = Buffer.from(input, "ascii");
		console.log("============== encrypt iv:", initVectorBytes)
		console.log("============== encrypt input:", input)

		const cipher = crypto.createCipheriv(`aes-${keySize}-cbc`, key2, initVectorBytes);
		const output = Buffer.concat([cipher.update(input, "utf8"), cipher.final()]);
		console.log("============== encrypt output:", output)
		console.log("============== encrypt output-base64:", output.toString('base64'))

		return output.toString('base64');
	}

	static encrypt(input, key) {
		key = "R0Biem8wOUIySkJxNGd6cQ=="
		console.log("========= input, Key:", input, key)
		try {
			const key2 = crypto.createHash('sha256',).update(key).digest()
			const initVectorBytes = Buffer.from(BasChecksum.iv, "binary");
			console.log("========= Buffer.from Key ,iv :", Buffer.from(key, "utf8"), Buffer.from(BasChecksum.iv, "utf8"))
			console.log("========= key2:", Buffer.from(key2, "hex").toString("utf8").length, Buffer.from(key2, "ascii"), Buffer.from(key2, "hex").toString("hex").length, Buffer.from(key2, "hex").toString("hex"))
			var cipher = crypto.createCipheriv('AES-256-CBC', key2, initVectorBytes);
			var encrypted = cipher.update(input, "binary", 'base64');
			encrypted += cipher.final('base64');
			console.log("========= encrypted + cipher.final('base64'):", encrypted)
			return encrypted;
		} catch (error) {
			console.log("========= Error:", error)

		}
	}

	static encrypt128(input, key) {
		console.log("=========128 input, Key:", input, key.toString())
		try {
			const keyAscii = Buffer.from(key, "utf8")
			const plainText = Buffer.from(input, 'utf8');
			//Pad plaintext before encryption
			const padded = padder.pad(plainText, 32); //Use 32 = 256 bits block sizes
			console.log("=========128 keyAscii:", keyAscii)
			console.log("=========128 plainText:", plainText)
			const key2 = crypto.createHash('sha256',).update(keyAscii).digest()

			// const key2 = crypto.scryptSync(key, 'aaaa', 16)// Buffer.from(key, "utf8"); //32 bytes key length
			const iv = Buffer.from(BasChecksum.iv, "utf8")//crypto.randomBytes(16); //32 bytes IV
			const ivPadded = padder.pad(iv, 16); //Use 32 = 256 bits block sizes
			console.log("=========128 key2 , iv:", key2.byteLength, key2, ivPadded.byteLength, iv.byteLength)

			const cipher = new Rijndael(key2, 'cbc'); //CBC mode
			// const encrypted = cipher.encrypt(plainText, 256, ivPadded);
			const encrypted = cipher.encrypt(plainText, '256', ivPadded);
			console.log("=========128 encrypted:", encrypted)
			// var str = encrypted.map(c => String.fromCharCode(c))
			var enc_uft8 = encrypted.toString("utf8")
			var enc_base64 = Buffer.from(encrypted)
			// console.log("=========128 encrypted-string:", str)
			console.log("=========128 encrypted-utf8:", enc_uft8)
			console.log("=========128 encrypted-utf8-base64:", enc_base64.toString("base64"))

			return enc_base64.toString("base64");

			// var cipher128 = crypto.createCipheriv('AES-128-CBC', key, BasChecksum.iv);
			// var encrypted128 = cipher128.update(input, 'binary', 'base64');
			// console.log("========= encrypted128:", encrypted128)
			// encrypted128 += cipher128.final('base64');
			// console.log("========= encrypted128 + cipher.final('base64'):", encrypted128)
			// return encrypted128;
		} catch (error) {
			console.log("========= Error128:", error)

		}
	}


	static encryptAES = (data, token, cipherIV) => {
		// // Test Code:
		// var message = 'Hello world!';
		// var token = '01234567890123456789012345678901';
		// var cipherIV = '0123456789012345';
		// var result = encrypt(message, token, cipherIV);	
		const key2 = crypto.createHash('sha256',).update(token).digest("hex")
		const key = AES.utils.hex.toBytes(key2);
		console.log("============ encryptAES key:", key)
		const iv = AES.utils.utf8.toBytes(cipherIV);
		const aesCbc = new AES.ModeOfOperation.cbc(key, iv);
		const dataBytes = AES.utils.utf8.toBytes(data);
		console.log("============ encryptAES dataBytes:", dataBytes)
		const paddedData = AES.padding.pkcs7.pad(dataBytes);
		const encryptedBytes = aesCbc.encrypt(paddedData);
		console.log("============ encryptAES encryptedBytes:", encryptedBytes)
		console.log("============ encryptAES encryptedBytes.toString():", encryptedBytes.toString())
		console.log("============ encryptAES AES.utils.hex.fromBytes(encryptedBytes):", Buffer.from(encryptedBytes, "binary").toString("base64"))
		return Buffer.from(encryptedBytes, "binary").toString("base64")
	};



	static decrypt(encrypted, key) {
		var decipher = crypto.createDecipheriv('AES-128-CBC', key, BasChecksum.iv);
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
		console.log(`=========== params :${params.length}${params}\nkey:${key}`)
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
		console.log(`========== calculateChecksum() hashString:${hashString}`)

		// var enc = BasChecksum.encrypt(hashString, key);
		var encNew = BasChecksum.encryptNew(hashString, key);
		var enc128 = BasChecksum.encrypt128(hashString, key);
		var encAES = BasChecksum.encryptAES(hashString, key, BasChecksum.iv);
		var enc256 = BasChecksum.encrypt256(hashString, key);
		console.log(`========== calculateChecksum() encNew : ${encNew}`)
		console.log(`========== calculateChecksum() enc128 : ${enc128}`)
		console.log(`========== calculateChecksum() encAES : ${encAES}`)
		console.log(`========== calculateChecksum() 256:\n${enc256}`)

		return encAES;
	}
}
// BasChecksum.iv = '@@@@&&&&####$$$$';
BasChecksum.iv = 'dddd888855556666';
module.exports = BasChecksum;