const httpStatus = require('../constant/httpStatus')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const { Course } = require('../model/course_controller')
const { User } = require('../model/auth_user')
const cloudinary=require( "cloudinary").v2;

const deleteCourse =  async (req, res) => {
	try {
    const course = await Course.findOne({_id:req.body._id})         
 if (course) {
  await Course.findByIdAndDelete(course._id)
  res.status(200).json({"status":httpStatus.SUCCESS,"data":null})  
 } else {
  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no course"})  
 }
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const addCourse =  async (req, res) => {
	try {
    const{userId,Destination,Depart,assurance,priceParKilomitre,kilomitrage,phoneNumber,marque,chauferName,matricule}=req.body
    const course = new Course({
      userId:userId,
      Destination:Destination,
      Depart:Depart,
      assurance:assurance,
      priceParKilomitre:priceParKilomitre,
      kilomitrage:kilomitrage,
      phoneNumber:phoneNumber,
      marque:marque,
      chauferName:chauferName,
      matricule:matricule
    })       

  await course.save();
  const user = await User.findOne({_id:userId});
  res.status(200).json({"status":httpStatus.SUCCESS,"data":course})  
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const courseInfo = async (req,res)=>{
  try {
    const courseId = req.params.id;
    const course = await Course.findOne({_id:courseId});
        res.status(200).json({"status":httpStatus.SUCCESS,"data":course})
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const courses = async (req,res)=>{
    try {
        const token = req.headers.token;
      const user = await User.findOne({token:token})
      const courses = await Course.find({userId:user._id}).sort({createdAt:-1});
      res.status(200).json({"status":httpStatus.SUCCESS,"data":courses})
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
}
const coursesAdmin = async (req,res)=>{
  try {
    const courses = await Course.find().sort({createdAt:-1});
    res.status(200).json({"status":httpStatus.SUCCESS,"data":courses})
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const startCourse =  async (req, res) => {
	try {
    const{longtitudeStart,latitudeStart,courseId}=req.body;
    const token = req.headers.token;
    const user = await User.findOne({token:token})
   const course = await Course.findById(courseId);
   if (!course) {
   return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Course Not Found" });
   }  
   if (course.userId != user.id) {
   return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Not Aauthorized" });
   }    
   await Course.findByIdAndUpdate(courseId,{
    $set:{
      longtitudeStart:longtitudeStart,
      latitudeStart:latitudeStart,
      dateStartJourney:Date.now(),
      isAccept:true
    }
   })
   await User.findByIdAndUpdate(user._id,{
    $set:{
      status:'online'
    }
   })
   await user.save();
  await course.save();
  res.status(200).json({"status":httpStatus.SUCCESS,"data":course})  
	} catch (error) {
		console.log("Error in start course controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const finishCourse =  async (req, res) => {
	try {
    const{longtitudeEnd,latitudeEnd,courseId,kilomitragePaid,cartGrisImage,priceParKilomitre}=req.body;
    const token = req.headers.token;
    const user = await User.findOne({token:token})
   const course = await Course.findById(courseId);
   if (!course) {
   return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Course Not Found" });
   }  
   if (course.userId != user.id) {
   return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Not Aauthorized" });
   }   
   await Course.findByIdAndUpdate(courseId,{
    $set:{
      longtitudeEnd:longtitudeEnd,
      latitudeEnd:latitudeEnd,
      dateEndJourney:Date.now(),
      kilomitragePaid:kilomitragePaid,
      cartGrisImage:cartGrisImage,
      priceParKilomitre:priceParKilomitre,
      isFinished:true
    }
   })
   await User.findByIdAndUpdate(user._id,{
    $set:{
      status:'online'
    }
   })
   await user.save();
  await course.save(); 
  res.status(200).json({"status":httpStatus.SUCCESS,"data":course})  
	} catch (error) {
		console.log("Error in start course controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const courseOneUser= async(req,res)=>{
  const{_id}= req.body
  
  const user = await User.findById(_id);
  
if (!user) {
  return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id"})
}
const courses = await Course.find({userId:user.id})
res.status(200).json({"status":httpStatus.SUCCESS,"data":courses})
}
module.exports = {deleteCourse,courseInfo,courses,addCourse,startCourse,finishCourse,coursesAdmin,courseOneUser}
