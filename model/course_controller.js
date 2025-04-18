const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
    {
        matricule: {
            type: String,
        },
        marque: {
            type: String,
        },
        phoneNumber: {
            type: String,
           minlength:10,
           maxlength:10
        },
        kilomitrage:{
            type:String,
        },
        Depart:{
            type:String,
            required:true,
            maxlength:10
        },
        Destination:{
            type:Number
        },
        isFinished:{
            type:Boolean,
            default:false
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    },
    { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = {Course}
