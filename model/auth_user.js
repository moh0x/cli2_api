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
			minLength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		token:{
			type:String,
			default:null
		},
        phoneNumber:{
            type:String,
            required:true,
            maxlength:15
        },
        address:{
            type:String
        },
        isOnline:{
            type:Boolean,
            default:false
        },
		profileImg:{
			type:String,
			default: "data:image/png;base64,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",
		},
		verifyCode:{
			type:String,
			maxlength:6
		},
		resetPasswordCode:{
			 type:String,
			maxlength:6
		},
		isVerified:{
			type:Boolean,
			default:false
		}
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = {User}