"use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Rfc2898DeriveBytes {
    constructor(password, Salt, iterations = 1000) {
        this.password = password;
        this.Salt = Salt;
        this.iterations = iterations;
        this.GetBytes = (cb) => {
            const bufferSlice = this.pbkdf2.slice(this.fromIndex, cb + this.fromIndex);
            this.fromIndex = cb;
            return bufferSlice;
        };
        this.fromIndex = 0;
        this.IterationCount = iterations;
        this.HashAlgorithm = 'sha1';
        this.pbkdf2 = crypto_1.pbkdf2Sync(password, this.Salt, iterations, 48, this.HashAlgorithm);
    }
}
module.exports.Rfc2898DeriveBytes = Rfc2898DeriveBytes;
