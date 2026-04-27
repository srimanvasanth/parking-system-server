const express = require("express");
const router = express.Router();
const parkingService = require("../service/parkingService");

router.get("/getAllSlots", async (req, res) => {
    try {
        const slots = await parkingService.getAllSlots();
        res.status(200).send({
            status: "success",
            data: slots
        })
    } catch (error) {
        res.status(500).send({
            status: "failure",
            message: error?.message || "Internal Server Error",
            data: []
        })
    }
    
})

router.post("/createSlots", async (req, res) => {
    try {
        const {vehicleType, nbrOfSlots} = req.body;
        const data = await parkingService.createSlots(vehicleType, nbrOfSlots);
        return res.status(200).send({
            status: "success",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            status: "failure",
            message: error?.message || error
        })
    }
})

router.post("/parkVehicle", async (req, res) => {
    const {plateNbr, vehicleType, slotNbr} = req.body;
    try {
        await parkingService.parkVehicle(plateNbr, vehicleType, slotNbr);
        return res.status(200).send({
            status: "success",
            data: "Vehicle Parked Successfully"
        })
    } catch (error) {
        res.status(500).send({
            status: "failure",   
            data: error?.message || error || "Parking Failed, Please Try Again"
        })
    }

})

router.post("/unparkVehicle", async (req, res) => {
    const {plateNbr, vehicleType} = req.body;
    try {
        
        await parkingService.unparkVehicle(plateNbr, vehicleType);
        res.status(200).send({
            status: "success",
            data: "Vehicle Unparked Successfully"
        })
    } catch (error) {
        res.status(500).send({
            status: "failure",
            data: error?.message || error || "Unparking Failed, Please try again"
        })
    }

    

})

module.exports = router;