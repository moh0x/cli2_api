const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
		},
		email: {
			type: String,
			default:"",
			unique: true,
		},
		token:{
			type:String,
			default:null
		},
        phoneNumber:{
            type:String,
            required:true,
            maxlength:10
        },
		latitude:{
			type:Number
		},
        logtitude:{
			type:Number
		},
        isOnline:{
            type:Boolean,
            default:false
        },
		isVerified:{
			type:Boolean,
			default:false
		},
		tokenNotificatin:{
			type:String
		},
		status:{
			type:String,
			enum:['offline','driving','online'],
			default:'offline'
		},
		city:{
			type:String,
			maxLength:50,
			
		}
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = {User}
