const crypto = require("crypto")

const base64UrlEncode = (str) => {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_"); 
}

const base64UrlDecode = (str) => {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(str, "base64").toString();
}

const generateSignature = (data, secret) => {
    return crypto
        .createHmac("sha256", secret)
        .update(data).digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

module.exports = {base64UrlEncode, base64UrlDecode, generateSignature};

