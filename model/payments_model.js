const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        userId:{
             type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "User",
        },
       chauferName:{
        type:String,
       },
       numberOfCourses:{
        type:Number
       },
       earnedOfCourses:{
        type:Number
       },
       cash:{
        type:Number
       },
       payFromCompany:{
        type:Number
       },
       commision:{
        type:Number
       },
       chauferPay:{
        type:Number
       },
       status:{
        type:String,
        enum:['start','finish'],
        default:"start"
       }
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = {Payment}

