const { checkRefreshToken, refreshToken } = require("../service/userService");
const { verifyToken } = require("./jwt");

const authMiddleware = async (req, res, next) => {
    const accessToken = req?.cookies?.accessToken;
    res.removeHeader("Set-Cookie");

    if(accessToken) {
        const decodedPayload = verifyToken(accessToken);
        const now = Math.floor(Date.now()/1000);

        if(decodedPayload?.exp && decodedPayload?.exp > now){
            delete decodedPayload.exp;
            req.currUser = decodedPayload;
            next();
        } else if(decodedPayload) // Expired Access Token
        {
            const refreshPayload = verifyToken(req?.cookies?.refreshToken, "refresh");
            if(refreshPayload) {          
                if(refreshPayload && refreshPayload?.exp && refreshPayload?.exp > now) {
                    const tokenCheck = await checkRefreshToken(refreshPayload?.uName, refreshPayload?.userPwd);
                    if(tokenCheck === req?.cookies?.refreshToken) {
                        delete refreshPayload.exp;
                        await refreshToken(refreshPayload, res);                        
                    } else { // Refresh token modified (or) Refresh token does not match for current user
                        return res.status(403).send({ status: "failure", message: "Invalid/Expired Token "});
                    }
                    next();
                } else { // Refresh token expired
                    return res.status(403).send({ status: "failure", message: "Invalid/Expired Token "}); //Expired Token
                }
            } else { // Invalid Refresh Token (or) Refresh token modified
                return res.status(403).send({ status: "failure", message: "Invalid/Expired Token "}); //Expired Token
            }
        } else { // Invalid Access Token
            return res.status(403).send({ status: "failure", message: "Invalid/Expired Token "}); //Expired Token
        }        
    } else { // No token
        return res.status(401).send({ status: "failure", message: "Token Missing" });
    }
}

module.exports = authMiddleware;