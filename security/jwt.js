const security = require("./security");

const generatejwt = (payload) => {

    const header = {
        alg: "HS256",
        typ: "JWT"
    }

    const exp = Math.floor(Date.now()/1000 + (60)); //expire in 30 mins
    payload = {...payload, exp};
    
    const encodedHeader = security.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = security.base64UrlEncode(JSON.stringify(payload));

    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = security.generateSignature(data, process.env.JWT_SECRET);
    return `${data}.${signature}`;
}

const generateRefreshToken = (payload) => {
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    }

    payload = {...payload, exp: Math.floor(Date.now()/1000 + (60*60*24*7))}; // expire in 7 days

    const encodedHeader = security.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = security.base64UrlEncode(JSON.stringify(payload));

    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = security.generateSignature(data, process.env.REFRESH_SECRET);
    return `${data}.${signature}`;
}

const verifyToken = (token, type) => {

    const tokenArr = token.split(".");

    if(tokenArr.length !== 3) {
        return false; //Invalid Token
    } else {
        const [header, payload, signature] = tokenArr;
        const data = `${header}.${payload}`;

        if(security.generateSignature(data, type === "refresh" ? process.env.REFRESH_SECRET : process.env.JWT_SECRET) === signature){
            const decodedPayload = JSON.parse(security.base64UrlDecode(payload));
            return decodedPayload;
        } else {
            return false; // Invalid Token
        }
    }
}

module.exports = {generatejwt, verifyToken, generateRefreshToken};


