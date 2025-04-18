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
      const user = await User.findOne({token:token},{password:false})
      const courses = await Course.find({userId:user._id});
      res.status(200).json({"status":httpStatus.SUCCESS,"data":courses})
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = {deleteCourse,courseInfo,courses}
