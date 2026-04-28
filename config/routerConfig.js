const express = require("express");
const router = express.Router();
const authMiddleware = require("../security/authMiddleware");

const parkingController = require("../controller/parkingController")
const { userRouter, loginHandler, saveUser } = require("../controller/userController");

router.post("/", (req, res) => {
  res.send("server up")
})
router.post("/userLogin", loginHandler);
router.post("/createUser", saveUser);  

router.use(authMiddleware);

router.use(parkingController);
router.use(userRouter);


module.exports = router;
