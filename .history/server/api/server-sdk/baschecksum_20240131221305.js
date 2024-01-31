const crypto = require('crypto');

class BasChecksum {
    static encryptString(plainText, key, iv) {
        const cipher = crypto.createCipheriv('aes-256-cbc', key.slice(0, 32), iv);
        let encrypted = cipher.update(plainText, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    static decryptString(cipherText, key, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key.slice(0, 32), iv);
        let decrypted = decipher.update(cipherText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    static generateSignature(input, key) {
        try {
            this.validateGenerateCheckSumInput(key);
            let stringBuilder = input;
            stringBuilder += '|';
            const randomString = this.generateRandomString(4);
            stringBuilder += randomString;
            const hash = this.getHashedString(stringBuilder);
            const hashRandom = hash + randomString;
            console.log("======generateSignature hashRandom ,key:", hashRandom ,key)
            const encrypt = this.encrypt(hashRandom, key);
            console.log("======generateSignature encrypt ,key:", encrypt ,key)
            return encrypt;
        } catch (ex) {
            this.showException(ex);
            return null;
        }
    }

    static verifySignature(input, key, checkSum) {
        try {
            this.validateVerifyCheckSumInput(checkSum, key);
            const str1 = this.decrypt(checkSum, key);
            if (str1 === null || str1.length < 4) {
                return false;
            }
            const str2 = str1.substring(str1.length - 4, str1.length);
            let stringBuilder = input;
            stringBuilder += '|';
            stringBuilder += str2;
            const source = this.getHashedString(stringBuilder);
            return str1 === source + str2;
        } catch (ex) {
            this.showException(ex);
            return false;
        }
    }

    static encrypt(input, key) {
        const mySHA256 = crypto.createHash('sha256');
        const key0 = mySHA256.update(key, 'utf8').digest();
        // console.log("============== encrypt key0:", key0)
        try {
            const cipher = crypto.createCipheriv(
                'aes-256-cbc',
                key0,
                Buffer.from([
                    64,
                    64,
                    64,
                    64,
                    38,
                    38,
                    38,
                    38,
                    35,
                    35,
                    35,
                    35,
                    36,
                    36,
                    36,
                    36,
                ])
            );
            let encrypted = cipher.update(input, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;
        } catch (ex) {
            this.showException(ex);
            return null;
        }
    }

    static decrypt(input, key) {
        const mySHA256 = crypto.createHash('sha256');
        const key0 = mySHA256.update(key, 'utf8').digest();
        try {
            const decipher = crypto.createDecipheriv(
                'aes-256-cbc',
                key0,
                Buffer.from([
                    64,
                    64,
                    64,
                    64,
                    38,
                    38,
                    38,
                    38,
                    35,
                    35,
                    35,
                    35,
                    36,
                    36,
                    36,
                    36,
                ])
            );
            let decrypted = decipher.update(input, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (ex) {
            this.showException(ex);
            return null;
        }
    }

    static validateGenerateCheckSumInput(key) {
        if (key === null) {
            throw new Error('Parameter cannot be null: Specified key');
        }
    }

    static validateVerifyCheckSumInput(checkSum, key) {
        if (key === null) {
            throw new Error('Parameter cannot be null: Specified key');
        }
        if (checkSum === null) {
            throw new Error('Parameter cannot be null: Specified checkSum');
        }
    }

    static getStringByParams(parameters) {
        if (parameters === null) {
            return '';
        }
        const sortedDictionary = Object.fromEntries(
            Object.entries(parameters).sort((a, b) => a[0].localeCompare(b[0]))
        );
        let stringBuilder = '';
        for (const [key, value] of Object.entries(sortedDictionary)) {
            const str = value || '';
            stringBuilder += str + '|';
        }
        return stringBuilder.substring(0, stringBuilder.length - 1);
    }

    static generateRandomString(length) {
        if (length <= 0) {
            return '';
        }
        const characters =
            '@#!abcdefghijklmonpqrstuvwxyz#@01234567890123456789#@ABCDEFGHIJKLMNOPQRSTUVWXYZ#@';
        let stringBuilder = '';
        for (let index = 0; index < length; index++) {
            const startIndex = Math.floor(Math.random() * characters.length);
            stringBuilder += characters.substring(startIndex, startIndex + 1);
        }
        return 'aaaa' //stringBuilder;
    }

    static getHashedString(inputValue) {
        const hash = crypto.createHash('sha256');
        hash.update(inputValue, 'utf8');
        return hash.digest('hex');
    }

    static showException(ex) {
        console.log('Message: ' + ex.message + '\nStackTrace: ' + ex.stack);
    }
}

module.exports = BasChecksum;

