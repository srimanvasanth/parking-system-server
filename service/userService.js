const connectDB = require("../config/dbConfig")
const userModel = require("../modal/user");
const bcrypt = require("bcrypt")
const { generatejwt, generateRefreshToken } = require("../security/jwt");

const createUser = async (uName, pwd, role) => {
    await connectDB();
    const users = await userModel.find();
    if(users.length === 0){
        const newUser = await userModel.findOne({uName});
        if(!newUser) {
            const saltRounds = 10;
            const userPwd = await bcrypt.hash(pwd.toString(), saltRounds);
            const addUser = new userModel({uName, userPwd, role});
            await addUser.save();
        } else {
            throw "Username Already Exists"
        }
    } else {
        throw "This API is for initial setup only. Users already exist in DB. Cannot create user"
    }
}

const saveUser = async (uName, pwd, role) => {
    await connectDB();
    const newUser = await userModel.findOne({uName});
    if(!newUser) {
        const saltRounds = 10;
        const userPwd = await bcrypt.hash(pwd.toString(), saltRounds);
        const addUser = new userModel({uName, userPwd, role});
        await addUser.save();
    } else {
        throw "Username Already Exists"
    }
}

const deleteUser = async (uName, currUser) => {
    if(uName === currUser){
        throw "Can't delete logged in user"
    }
    await connectDB();
    const currUserData = await userModel.findOne({uName: currUser});
    console.log(currUser)
    if(currUserData.role === "admin") {
        await userModel.deleteOne({uName});
    } else {
        throw "Only admin Users can delete other users"
    }
}

const getAllUsers = async (uName) => {
    await connectDB();
    const currUser = await userModel.findOne({uName});
    if(currUser && currUser.role === "admin"){
        const users = await userModel.find({}, {uName:1, role:1, _id: false});
        const userData = []
        users.map((user) => {
            let data = {
                userName: user?.uName,
                role: user.role
            };
            userData.push(data);
        })
        return userData;
    } else {
        throw "Not an admin/Invalid User"
    }
    
}

const checkRefreshToken = async (uName, userPwd) => {
    await connectDB();
    const currUser = await userModel.findOne({uName, userPwd});
    if(currUser && currUser?.refreshToken){
        return currUser?.refreshToken;
    } else {
        return false;
    }
}

const generateToken = (payload) => {
    const jwtToken = generatejwt(payload);
    const refToken = generateRefreshToken(payload);
    return {jwtToken, refToken};
}

const refreshToken = async (payload, res) => {
    await connectDB();
    const tokenData = generateToken(payload);
    await userModel.updateOne({uName: payload?.uName, userPwd: payload?.userPwd}, {$set: {refreshToken: tokenData.refToken}});
    res.cookie("accessToken", tokenData.jwtToken, { httpOnly: true, secure: true, sameSite: "none" }); 
    res.cookie("refreshToken", tokenData.refToken, { httpOnly: true, secure: true, sameSite: "none" });
}

const userLogin = async (uName, userPwd, res) => {
    await connectDB();
    if(uName && userPwd){
        const currUser = await userModel.findOne({uName});
        if(currUser) {
            const isUser = await bcrypt.compare(userPwd.toString(), currUser.userPwd);
            if(!isUser) {
                return false;
            }
            const userObj = {
                uName: currUser.uName,
                userPwd: currUser.userPwd
            }
            const tokenData = generateToken(userObj);
            res.cookie("accessToken", tokenData.jwtToken, { httpOnly: true, secure: true, sameSite: "none" });
            // currUser.refreshToken = refreshToken;
            const ttt = await userModel.updateOne({uName, userPwd: currUser.userPwd}, {$set: {refreshToken: tokenData.refToken}});
            console.log(ttt)
            res.cookie("refreshToken", tokenData.refToken, { httpOnly: true, secure: true, sameSite: "none" });
            const currUserObj = {
                userName: currUser.uName,
                role: currUser.role
            }
            return currUserObj;
        } else {
            return false;
        }
    } else {
        throw "Username/Password is Invalid"
    }
}

const logOutUser = async (uName, res) => {
    await connectDB();
    await userModel.updateOne({uName}, {$set: {refreshToken: undefined}});
    res.cookie("accessToken", "", { httpOnly: true, secure: true, sameSite: "none", maxAge: 0 }); 
    res.cookie("refreshToken", "", { httpOnly: true, secure: true, sameSite: "none", maxAge: 0 }); 
    return true;
}

module.exports = {createUser, userLogin, checkRefreshToken, refreshToken, getAllUsers, logOutUser, saveUser, deleteUser};
