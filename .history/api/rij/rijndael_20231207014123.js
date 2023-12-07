"use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });

const crypto_1 = require("crypto");
const { Rfc2898DeriveBytes } = require("./Rfc2898DeriveBytes");
const { RijndaelManaged } = require("./RijndaelManaged");
const rijndael = (saltBytes, key, algorithm = 'AES-256-GCM') => {
    const rfc = new Rfc2898DeriveBytes(key, saltBytes);
    const rijAlg = new RijndaelManaged();
    rijAlg.Key = rfc.GetBytes(rijAlg.KeySize / 8);
    rijAlg.IV = rfc.GetBytes(rijAlg.BlockSize / 8);
    const cipher = crypto_1.createCipheriv('aes-256-cbc', rijAlg.Key, rijAlg.IV);
    return function encryptRijndael(text) {
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return encrypted.toString('base64');
    };
};
module.exports.rijndael = rijndael;
