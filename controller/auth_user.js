const {User} = require('../model/auth_user')
const httpStatus = require('../constant/httpStatus')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const cloudinary=require( "cloudinary").v2;
const gen = require("@codedipper/random-code");
const axios = require('axios')
const signUp =async(req,res)=>{
    try {
        const valid = validationResult(req)
        if (!valid.isEmpty()) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
        }
        const {fullname,password,phoneNumber} = req.body
              
        const user = await User.findOne({phoneNumber:phoneNumber});
        if (user) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"user already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword =await bcrypt.hash(password,salt)
        const token = jwt.sign({phoneNumber:phoneNumber,fullname:fullname},"token")
        const newUser = new User({
            fullname:fullname,
            password:hashPassword,
            token:token,
            phoneNumber:phoneNumber,
        })
        await newUser.save()  
              res.status(200).json({"status":httpStatus.SUCCESS,"data":newUser})     
    } catch (error) {
        console.log(error);
          res.status(400).json({"status":httpStatus.ERROR,"message":"error"})  
    }
}
const login =async(req,res)=>{
  try {
    const{phoneNumber,password} = req.body
  const user = await User.findOne({phoneNumber : phoneNumber},{__v:false});
 const valid = validationResult (req);
 const passwordMatch = await bcrypt.compare(password,user.password);
if (valid.isEmpty()) {
if (user) {
    if (passwordMatch == true) {
            const userRet = await User.findOne({phoneNumber : phoneNumber},{__v:false,password:false});
            res.status(200).json({"status":httpStatus.SUCCESS,"data":userRet});
        
    } else {
        res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"password not match"});
    }
   } else {
    res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this email"});
   }
} else {
res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
 } catch (error) {
  console.log(error);
  
    res.status(400).json({"status":httpStatus.ERROR,"data":null,"message":"error"});
 }

}

const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const updateProfile =  async (req, res) => {
	try {
		const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
    const{logtitude,latitude,isOnline,status} = req.body
  await User.findByIdAndUpdate(user._id,{ 
    $set:{
      logtitude:logtitude,
      latitude:latitude,
      isOnline:isOnline ?? user.isOnline,
      status:status ?? user.status
    }
  })
  await user.save()
  res.status(200).json({"status":httpStatus.SUCCESS,"data":user})  
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const userInfo = async (req,res)=>{
  try {
    const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user})
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const updateNotificationToken =  async (req, res) => {
	try {
		const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
    const{tokenNotificatin} = req.body
  await User.findByIdAndUpdate(user._id,{ 
    $set:{
      tokenNotificatin:tokenNotificatin
    }
  })
  res.status(200).json({"status":httpStatus.SUCCESS,"data":user})  
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const deleteUser = async (req,res)=>{
  try {
    const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
       await User.findByIdAndDelete(user._id); 
       res.status(200).json({"status":httpStatus.SUCCESS,"data":null });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = {signUp,login,logout,updateProfile,userInfo,updateNotificationToken,deleteUser}
