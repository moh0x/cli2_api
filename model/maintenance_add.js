const mongoose = require('mongoose')

const maintenanceSchema = new mongoose.Schema(
    {
        userId:{
             type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "User",
        },
       fullName:{
        type:String,
       },
       typeOfMaintenance:{
        type:String,
        enum: ['كهرباء', 'سباكة', 'نجارة'],
       },
        fullName:{
        type:String,
       },
       details:{
        type:String
       }
    },
    { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
module.exports = {Maintenance}
