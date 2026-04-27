const mongoose = require("mongoose")

const vehicleSchema = new mongoose.Schema(
    {
        plateNbr: {
            type: mongoose.Schema.Types.String,
            unique: true,
            required: true,
            lowercase: true
        },
        vehicleType: {
            type: mongoose.Schema.Types.String,
            required: true
        }
    }, 
    {
        collection: "vehicle"
    })

    module.exports = mongoose.model("vehicle", vehicleSchema);