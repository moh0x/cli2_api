const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
       isFinished:{
        type:Boolean,
        default:false
       }
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = {Payment}
