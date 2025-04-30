const {User} = require('../model/auth_user')
const httpStatus = require('../constant/httpStatus')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const cloudinary=require( "cloudinary").v2;
const gen = require("@codedipper/random-code");
const axios = require('axios')
const { Admin } = require('../model/admin_model')
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

const getInActiveUsers = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    
       const inActiveUsers = await User.find({isVerified:false}).sort({createdAt:-1})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":inActiveUsers});
      
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const activeUser = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    const{_id}=req.body._id;
       const inActiveUser = await User.findOne({id:_id})
     if (!inActiveUser) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(inActiveUser.id,{
      $set:{
        isVerified:true
      }
     })
     await inActiveUser.save();
       const retUser = await User.findOne({id:_id})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":retUser});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const getActiveUsers = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    
       const activeUsers = await User.find({isVerified:true}).sort({createdAt:-1})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":activeUsers});
      
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const inActiveUser = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    const{_id}=req.body._id;
       const activeUser = await User.findOne({id:_id})
     if (!activeUser) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(activeUser.id,{
      $set:{
        isVerified:false
      }
     })
     await activeUser.save();
       const retUser = await User.findOne({id:_id})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":retUser});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {signUp,login,logout,updateProfile,userInfo,updateNotificationToken,deleteUser,getInActiveUsers,activeUser,getActiveUsers,inActiveUser}
