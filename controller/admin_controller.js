const {Admin} = require('../model/admin_model')
const httpStatus = require('../constant/httpStatus')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const signUp =async(req,res)=>{
    try {
        const valid = validationResult(req)
        if (!valid.isEmpty()) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
        }
        const {email,password} = req.body      
        const admin = await Admin.findOne({email:email});
        if (admin) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"user already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword =await bcrypt.hash(password,salt)
        const token = jwt.sign({email:email},"token")
        const newAdmin = new Admin({
            email:email,
            password:hashPassword,
            token:token
        })
        await newAdmin.save()  
              res.status(200).json({"status":httpStatus.SUCCESS,"data":newAdmin})     
    } catch (error) {
        console.log(error);
          res.status(400).json({"status":httpStatus.ERROR,"message":"error"})  
    }
}
const login =async(req,res)=>{
  try {
    const{email,password} = req.body
  const admin = await Admin.findOne({email : email},{__v:false});
 const valid = validationResult (req);

if (valid.isEmpty()) {
if (admin) {
   
 const passwordMatch = await bcrypt.compare(password,admin.password);
    if (passwordMatch == true) {
            const adminRet = await Admin.findOne({email : email},{__v:false,password:false});
            res.status(200).json({"status":httpStatus.SUCCESS,"data":adminRet});
        
    } else {
        res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"password not match"});
    }
   } else {
    res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no admin with this email"});
   }
} else {
res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
 } catch (error) {
  console.log(error);
  
    res.status(400).json({"status":httpStatus.ERROR,"data":null,"message":"error"});
 }

}



// const deleteUser = async (req,res)=>{
//   try {
//     const token = req.headers.token;
//     const user = await User.findOne({token:token},{password:false})
//        await User.findByIdAndDelete(user._id); 
//        res.status(200).json({"status":httpStatus.SUCCESS,"data":null });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }


module.exports = {signUp,login}
