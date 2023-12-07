"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const Rfc2898DeriveBytes_1 = __importDefault(require("./Rfc2898DeriveBytes"));
const RijndaelManaged_1 = __importDefault(require("./RijndaelManaged"));
const rijndael = (saltBytes, key, algorithm = 'AES-256-GCM') => {
    const rfc = new Rfc2898DeriveBytes_1.default(key, saltBytes);
    const rijAlg = new RijndaelManaged_1.default();
    rijAlg.Key = rfc.GetBytes(rijAlg.KeySize / 8);
    rijAlg.IV = rfc.GetBytes(rijAlg.BlockSize / 8);
    const cipher = crypto_1.default.createCipheriv(algorithm, rijAlg.Key, rijAlg.IV);
    return function encryptRijndael(text) {
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return encrypted.toString('base64');
    };
};
exports.default = rijndael;
