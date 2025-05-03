const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
        token:{
            type:String,
            default:null
        },
    },
    { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = {Student}
