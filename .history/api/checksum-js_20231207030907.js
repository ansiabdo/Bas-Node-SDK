"use strict";

const Rijndael = require('rijndael-js');
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const CryptoJS = require("crypto-js");

const padder = require('pkcs7-padding');
class BasChecksumJS {


    static encrypt25622(plaintext, key) {
        let encrypted = 'pAyO2mgGDcos6TKaYt34XIVM9tPDcc4KHQCWGBOn2Ue/mGZVJmbBsyOzhjaxQXz87bWUmcQGemJ1c98se96jeKJS4Epe8jhmYl4g8+tV7+o='
        key = 'R0Biem8wOUIySkJxNGd6cQ=='
        plaintext = "a570f6d353a409291fd9c3db1b9d8b4b06cac6cd5b5a31318c41b151432115deaaaa"
        // const crypto = require('crypto')
        const data = Buffer.from(plaintext, 'base64')
        const key2 = crypto.createHash('sha256').update(key).digest()
        // const iv ='dddd888855556666' //data.slice(0, 16)
        const initVector = BasChecksumJS.iv;
        const iv = Buffer.from(initVector, "utf8");
        const cipher = crypto.createCipheriv('aes-256-cbc', key2, initVector)
        cipher.setAutoPadding(true)
        let encrypt = cipher.update(data)
        console.log('============== encrypt25622 encrypt:', encrypt.toString("base64"))
        console.log('============== encrypt25622 encrypt:', Buffer.from(encrypt.toString("base64")).toString("base64"))
        const retData = Buffer.concat([encrypt, cipher.final()]);
        // const retData = (retData + cipher.final('base64')).replace(/\0*$/, '')
        console.log('============== encrypt25622 retData:', retData.toString("base64"))
        BasChecksumJS.decrypt25622(retData.toString("base64"), key)
        BasChecksumJS.decrypt25622(encrypted, key)
        return retData.toString("base64")
    }

    static decrypt25622(encrypted, key) {
        ////Ready 100%
        const data = Buffer.from(encrypted, 'base64')
        const key2 = crypto.createHash('sha256').update(key).digest()
        const initVector = BasChecksumJS.iv;
        const iv = Buffer.from(initVector, "utf8");
        const decipher = crypto.createDecipheriv('aes-256-cbc', key2, iv)
        // const decrypted = decipher.update(data, null, 'utf8')
        // const retData = (decrypted + decipher.final('utf8')).replace(/\0*$/, '')
        decipher.setAutoPadding(true)
        const decrypted = decipher.update(data, "ascii")
        console.log('============== decrypt25622 11 decrypted:', decrypted.toString("base64"))

        const retData = Buffer.concat([decrypted, decipher.final()])
        try {
            // console.log('============== decrypt25622 11 btoa(retData):', Buffer.from(retData,"binary").toString("ascii"))
            console.log('============== decrypt25622 22 retData:', Buffer.from(retData.toString()).toString("utf8"))

        } catch (error) {
            console.log('============== decrypt25622 00 retData:', retData)
        }
        return retData
    }

    static encrypt256(input, key) {
        const key2 = crypto.createHash('sha256',).update(key).digest()
        var cipher = crypto.createCipheriv('AES-256-CBC', key2, BasChecksumJS.iv);
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
        const initVector = BasChecksumJS.iv;
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
            const initVectorBytes = Buffer.from(BasChecksumJS.iv, "binary");
            console.log("========= Buffer.from Key ,iv :", Buffer.from(key, "utf8"), Buffer.from(BasChecksumJS.iv, "utf8"))
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
            const iv = Buffer.from(BasChecksumJS.iv, "utf8")//crypto.randomBytes(16); //32 bytes IV
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

            // var cipher128 = crypto.createCipheriv('AES-128-CBC', key, BasChecksumJS.iv);
            // var encrypted128 = cipher128.update(input, 'binary', 'base64');
            // console.log("========= encrypted128:", encrypted128)
            // encrypted128 += cipher128.final('base64');
            // console.log("========= encrypted128 + cipher.final('base64'):", encrypted128)
            // return encrypted128;
        } catch (error) {
            console.log("========= Error128:", error)

        }
    }


    static encryptAES = (data, key) => {
        const key256 = SHA256(key)
        console.log("============ encryptAES key256:", key256.toString())
        console.log("============ encryptAES key256:", key256.toString(CryptoJS.enc.Base64))
        console.log("============ encryptAES key256:", key256.toString(CryptoJS.enc.Hex))
        const key2 = key256 //CryptoJS.enc.Base64.parse(key256.toString());
        const iv2 = CryptoJS.enc.Utf8.parse(BasChecksumJS.iv);
        const data2 = CryptoJS.enc.Utf8.parse(data);
        console.log("============ encryptAES key2:", key2.sigBytes, key2.toString(CryptoJS.enc.Hex))
        console.log("============ encryptAES data2:", data2.sigBytes, data2.toString(CryptoJS.enc.Hex))
        // console.log("============ encryptAES key2:", key2.toString(CryptoJS.enc.Utf8))
        // console.log("============ encryptAES key2:", key2.toString(CryptoJS.enc.Base64))
        console.log("============ encryptAES iv2:", iv2.sigBytes, iv2.toString(CryptoJS.enc.Hex))
        var encrypted = CryptoJS.AES.encrypt(data2, key2, {
            iv: iv2,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        console.log("============ encryptAES encrypted:", encrypted.toString(CryptoJS.format.Hex))
        console.log("============ encryptAES encrypted:", BasChecksumJS.base64ToHex(encrypted.toString(CryptoJS.format.OpenSSL)))
        // console.log("============ encryptAES encryptedBytes.toString():", encryptedBytes.toString())
        // console.log("============ encryptAES AES.utils.hex.fromBytes(encryptedBytes):", Buffer.from(encryptedBytes, "binary").toString("base64"))
        return encrypted.toString()
    };

    static base64ToHex(str) {
        const raw = atob(str);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += hex.length === 2 ? hex : '0' + hex;
        }
        return result.toUpperCase();
    }

    static decrypt(encrypted, key) {
        var decipher = crypto.createDecipheriv('AES-128-CBC', key, BasChecksumJS.iv);
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
            params = BasChecksumJS.getStringByParams(params);
        }
        return BasChecksumJS.generateSignatureByString(params, key);
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
            params = BasChecksumJS.getStringByParams(params);
        }
        return BasChecksumJS.verifySignatureByString(params, key, checksum);
    }

    static async generateSignatureByString(params, key) {
        var salt = await BasChecksumJS.generateRandomString(4);
        return BasChecksumJS.calculateChecksum(params, key, salt);
    }

    static verifySignatureByString(params, key, checksum) {
        var paytm_hash = BasChecksumJS.decrypt(checksum, key);
        var salt = paytm_hash.substr(paytm_hash.length - 4);
        return (paytm_hash === BasChecksumJS.calculateHash(params, salt));
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
        var hashString = BasChecksumJS.calculateHash(params, salt);
        console.log(`========== calculateChecksum() hashString:${hashString}`)

        // var enc = BasChecksumJS.encrypt(hashString, key);
        // var encNew = BasChecksumJS.encryptNew(hashString, key);
        // var enc128 = BasChecksumJS.encrypt128(hashString, key);
        var encAES = BasChecksumJS.encryptAES(hashString, key);
        // var enc256 = BasChecksumJS.encrypt256(hashString, key);
        // console.log(`========== calculateChecksum() encNew : ${encNew}`)
        // console.log(`========== calculateChecksum() enc128 : ${enc128}`)
        console.log(`========== calculateChecksum() encAES : ${encAES}`)
        // console.log(`========== calculateChecksum() 256: ${enc256}`)

        return encAES;
    }
}
// BasChecksumJS.iv = '@@@@&&&&####$$$$';
BasChecksumJS.iv = 'dddd888855556666';
module.exports = BasChecksumJS;