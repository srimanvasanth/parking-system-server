const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
    {
        slotNbr: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        vehicleType: {
            type: mongoose.Schema.Types.Number,
            required: true
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "vehicle"         
        },
        parkedDate: {
            type: Date,
        }
    
    },
    {
        collection: "parking"
    }
)

module.exports = mongoose.model("parking", parkingSchema)