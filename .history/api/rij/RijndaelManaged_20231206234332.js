"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class RijndaelManaged {
    constructor() {
        this.Key = crypto_1.default.randomBytes(32);
        this.IV = crypto_1.default.randomBytes(16);
        this.KeySize = 256;
        this.BlockSize = 128;
    }
}
exports.default = RijndaelManaged;
