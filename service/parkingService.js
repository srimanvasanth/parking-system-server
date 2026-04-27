const connectDB = require("../config/dbConfig");
const parking = require("../modal/parking");
const vehicle = require("../modal/vehicle");

const getAllSlots = async () => {
    await connectDB();
    const allSlots = await parking.find().populate("vehicleId");
    return allSlots;
}

const createSlots = async(vehicleType, nbrOfSlots) => {
    let slots = [];
    vehicleType = parseInt(vehicleType);
    nbrOfSlots = parseInt(nbrOfSlots);

    if(vehicleType && ([2,4].includes(vehicleType))){
        if(nbrOfSlots && nbrOfSlots <= 20){
            for(i = 1; i <= nbrOfSlots; i++){
                slots.push({slotNbr: i, vehicleType});
            }
            await connectDB();
            await parking.deleteMany({vehicleType});
            await vehicle.deleteMany({vehicleType});
            await parking.insertMany(slots);
            return parking.find();
        } else {
            throw "Invalid Number of Slots";
        }
    } else {
        throw "Invalid Vehicle Type";
    }
} 

const parkVehicle = async (plateNbr, vehicleType, slotNbr) => {
    await connectDB();
    if(plateNbr){        
        const existingVehicle = await vehicle.findOne({plateNbr});
        if(!existingVehicle) {            
            const slot = await parking.findOne({slotNbr, vehicleId: undefined, vehicleType});
            if(slot) {
                const vehicleToPark = new vehicle({plateNbr, vehicleType});
                await vehicleToPark.save();
                slot.vehicleId = vehicleToPark._id;
                slot.parkedDate = Date.now();
                await slot.save();
            } else {
                throw "Slots Not Available";
            }
        } else {
            throw "Vehicle Already Parked";
        }
    } else{
        throw "Invalid Plate Number";
    }
}

const unparkVehicle = async (plateNbr, vehicleType) => {
    await connectDB();
    if(plateNbr){
        const parkedVehicle = await vehicle.findOne({plateNbr, vehicleType})
        if(parkedVehicle) {
            await parking.updateOne({vehicleId: parkedVehicle._id}, {$unset: {vehicleId: "", parkedDate: ""}});
            await vehicle.deleteOne(parkedVehicle);
        } else{
            throw "Vehicle is not Parked"
        }
    } else {
        throw "Invalid Plate Number";
    }
}

module.exports = {getAllSlots, createSlots, parkVehicle, unparkVehicle};