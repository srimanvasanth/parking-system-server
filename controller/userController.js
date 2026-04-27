const express = require("express");
const userRouter = express.Router();
const userService = require("../service/userService");
    
const saveUser = async (req, res) => { // Works only to create the first user in DB (for app setup)
    const {userName, userPassword, role} = req.body;
    try {
        await userService.createUser(userName, userPassword, role);
        res.status(200).send({
            status: "success",
            data: "User Created Successfully"
        });
    } catch (error) {
        res.status(500).send({
            status: "failure",
            data: error?.message || error || "Invalid User Details"
        })
    }
}

const loginHandler = async (req, res) => {
    const {userName, userPassword} = req.body;
    
    try {
        const loginResp = await userService.userLogin(userName, userPassword, res);
        
        if(loginResp){
            res.status(200).send({
                status: "success",
                data: loginResp
            })
        } else {
            res.status(200).send({
                status: "failure",
                data: "Wrong UserName/Password"
            })
        }
    } catch (error) {
        res.status(500).send({
            status: "failure",
            data: error?.message || error || "Login Failed"
        })
    }
}

userRouter.post("/saveUser", async (req, res) => {
    try {
        const {userName, userPassword, role} = req.body;
        await userService.saveUser(userName, userPassword, role);
        res.status(200).send({
            status: "success",
            data: "User Created Successfully"
        });
    } catch (error) {
        res.status(500).send({
            status: "failure",
            data: error?.message || error || "Invalid User Details"
        })
    }
})

userRouter.post("/deleteUser", async (req, res) => {
    try {
        const {userName, currUser} = req.body;
        await userService.deleteUser(userName, currUser);
        res.status(200).send({
            status: "success",
            data: "User Deleted Successfully"
        });
    } catch (error) {
        res.status(500).send({
            status: "failure",
            data: error?.message || error || "Invalid User Details"
        })
    }
})

userRouter.get("/checkAuth", (req, res) => {  // check if the req has valid auth
    res.status(200).send({status: "success", data: true});
})

userRouter.post("/getAllUsers", async (req, res) => {
    try {
        const body = req.body;
        const users = await userService.getAllUsers(body.userName);
        res.status(200).send({
            status: "success",
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failure",
            data: "Something went wrong"
        })
    }
    
})

userRouter.post("/logOut", async (req, res) => {
    const user = req.body?.username;
    const logout = await userService.logOutUser(user, res);
    if(logout){
        res.status(200).send({
            status: "success",
            data: "Logged Out Successfully"
        }) 
    } else {
        res.status(500).send({
            status: "failure",
            data: "Logout failed"
        })
    }
})

// userRouter.post("/userLogin", loginHandler)

module.exports = {userRouter, loginHandler, saveUser};