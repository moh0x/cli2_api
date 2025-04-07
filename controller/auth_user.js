const {User} = require('../model/auth_user')
const httpStatus = require('../constant/httpStatus')
const bcryptjs = require('bcryptjs')
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
        const {fullname,email,password,phoneNumber} = req.body
              
        const userEmail = await User.findOne({email:email});
        const fullName = await User.findOne({fullname:fullname});
     
        
        if (userEmail || fullName) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"user already exist"})
        }
        const salt = await bcryptjs.genSalt(10)
        const hashPassword =await bcryptjs.hash(password,salt)
        const token = jwt.sign({email:email,fullname:fullname},"token")
        const verifyCode = gen(5,"0123456789");
         const sendEmail = async () => {
          try {
                   const response = await axios.post(`${process.env.EMAIL_URL}`, {
                  sender: { email: "mybit.bitnova@gmail.com" },
                  to: [{email:req.body.email}],
                  subject: "verification code",
                  textContent: `your verify code is:${verifyCode}`
              }, {
                  headers: {
                      "api-key": `${process.env.EMAIL_API}`,
                      "Content-Type": "application/json"
                  }
              });
      
              console.log("Email sent:", response.data);
          } catch (error) {
              console.error("Error sending email:", error.response?.data || error.message);
          }
      };
         sendEmail()
        const newUser = new User({
            fullname:fullname,
            email:email,
            password:hashPassword,
            token:token,
            phoneNumber:phoneNumber,
            verifyCode:verifyCode,
            resetPasswordCode:null
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
    const user = await User.findOne({email : req.body.email},{__v:false});
 const valid = validationResult (req);
 const passwordMatch = await bcrypt.compare(req.body.password,user.password);
if (valid.isEmpty()) {
if (user) {
    if (passwordMatch == true) {
        if (user.isVerified) {
            const userRet = await User.findOne({email : req.body.email},{__v:false,password:false});
            res.status(200).json({"status":httpStatus.SUCCESS,"data":userRet});
        } else {
            const userRet = await User.findOne({email : req.body.email},{__v:false,password:false});
            const verifyCode = gen(5,"0123456789");
            const sendEmail = async () => {
             try {
                      const response = await axios.post(`${process.env.EMAIL_URL}`, {
                     sender: { email: "mybit.bitnova@gmail.com" },
                     to: [{email:req.body.email}],
                     subject: "verification code",
                     textContent: `your verify code is:${verifyCode}`
                 }, {
                     headers: {
                         "api-key": `${process.env.EMAIL_API}`,
                         "Content-Type": "application/json"
                     }
                 });
         
                 console.log("Email sent:", response.data);
             } catch (error) {
                 console.log("Error sending email:", error.response?.data || error.message);
             }
         };
            sendEmail()
           await User.findByIdAndUpdate(userRet._id,{
                $set:{
                    verifyCode:verifyCode
                }
            })
            await userRet.save()
            const userRetWithNewInfos = await User.findOne({email : req.body.email},{__v:false,password:false});
              res.status(200).json({"status":httpStatus.SUCCESS,"data":userRetWithNewInfos});
        }
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
	  console.log(erro)
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
    const {profilePic} = req.body;
    const userId = req.body.userId;
    const user = await User.findOne({token:token},{password:false})
    if (!profilePic) {
      return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"profilePic is required"})
    }
  const uploadRespone =  await cloudinary.uploader.upload(profilePic)
  await User.findByIdAndUpdate(user._id,{ 
    $set:{
      profileImg:uploadRespone.secure_url
    }
  })
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
const sendResetCodeFunc = async(req,res)=>{
  try {
    const valid = validationResult(req);
  if (valid.isEmpty()) {
    const user = await User.findOne({email:req.body.email},{__v:false,password:false,token:false});
    if (user) {
                const resetPasswordCode = gen(5,"0123456789");
                const sendEmail = async () => {
                  try {
                           const response = await axios.post(`${process.env.EMAIL_URL}`, {
                          sender: { email: "mybit.bitnova@gmail.com" },
                          to: [{email:req.body.email}],
                          subject: "reset password code",
                          textContent: `your verify code is:${resetPasswordCode}`
                      }, {
                          headers: {
                              "api-key": `${process.env.EMAIL_API}`,
                              "Content-Type": "application/json"
                          }
                      });
              
                      console.log("Email sent:", response.data);
                  } catch (error) {
                      console.error("Error sending email:", error.response?.data || error.message);
                  }
              };
                 sendEmail()
            await    User.findByIdAndUpdate(user._id,{
                    $set:{
                        resetPasswordCode:resetPasswordCode
                    }
                });  
                await user.save();
                const userWithNewInfos =   await User.findOne({email:req.body.email},{__v:false,password:false});
                  res.status(200).json({"status":httpsStatus.SUCCESS,"data":userWithNewInfos});
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"we don't have user with this email"});
    }
  } else {
    res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
  }
  } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const resetPasswordFunc = async(req,res)=>{
  try {     
      const email = req.body.email;
      const user = await User.findOne({email:email},{__v:false,password:false,token:false});
      const resetPasswordCode = req.body.resetPasswordCode;
      const password =await bcrypt.hash(req.body.password,10);
      const valid = validationResult (req);
if (valid.isEmpty()) {
  if (user) {
    if (resetPasswordCode == user.resetPasswordCode && user.resetPasswordCode != 0 ) {
      await User.findByIdAndUpdate(user._id,{
          $set:{
              isVerified:true,
              verifyCode:0,
              resetPasswordCode:0,
              password:password
          }
      });
      await user.save();
      const userWithNewInfos = await  User.findOne({email:email},{__v:false,password:false});
      res.status(200).json({"status":httpsStatus.SUCCESS,"data":userWithNewInfos});
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"verification code not match"});
    }
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
    }
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
 
  } catch (error) {
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
  }
}
const confirmAccountFunc = async(req,res)=>{
  try {    
    const valid = validationResult (req); 
     if (valid.isEmpty()) {
      const token = req.headers.token;
      const user = await User.findOne({token:token},{__v:false,password:false,token:false});
      const verifyCode = req.body.verifyCode;
if (user) {
if (user.isVerified == false && verifyCode == user.verifyCode && user.verifyCode != 0 ) {
  await User.findByIdAndUpdate(user._id,{
      $set:{
          isVerified:true,
          verifyCode:0,
          resetPasswordCode:0,
      }
  });
  await user.save();
  const userWithNewInfos = await User.findOne({token:token},{__v:false,password:false});
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":userWithNewInfos});;
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"verification code not match"});
}
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
}

     } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
     }
  } catch (error) {
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
  }
}
module.exports = {signUp,login,logout,updateProfile,userInfo,sendResetCodeFunc,resetPasswordFunc,confirmAccountFunc}
