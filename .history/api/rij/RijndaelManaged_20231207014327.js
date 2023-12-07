"use strict";

const crypto_1 = require("crypto");
class RijndaelManaged {
    constructor() {
        this.Key = crypto_1.randomBytes(32);
        this.IV = crypto_1.randomBytes(16);
        this.KeySize = 256;
        this.BlockSize = 128;
    }
}
module.exports.RijndaelManaged = RijndaelManaged;
