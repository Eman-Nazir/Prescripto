//  api for adding doctors
import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctor.model.js"
import jwt from "jsonwebtoken"

const addDoctor = async (req,res) => {
   try{
     const  {name,email,password,speciality, degree,experience, about,fees,address} = req.body
     const imageFile = req.file

     console.log({name,email,password,speciality, degree,experience, about,fees,address}, imageFile);
    //  to parse this form data we need a midleware so we created a multer middleware


    // checking for all data to add doctor 
      if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
      return res.json({success:false,message:"Missing Detailed "})
      }
    //   validating email format
       if(!validator.isEmail(email)){
      return res.json({success:false,message:"Please enter a valid email"})
       }

        // PASSWORD strong password

        if(password.length < 8) {
      return res.json({success:false,message:"Please enter a strong passowrd"})
        }


        //  to encrypt password hashing doctor passowrd 
        const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password,salt)
        

        //  upload imagr to cloudinary 
        const imageUpload = await cloudinary.uploader.upload(imageFile.path , {resource_type:"image"})
          const imageUrl = imageUpload.secure_url
         

       const doctorData = {
        name,
        email,
         image: imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        

        address:JSON.parse(address),
        date:Date.now()
       }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({success:true,message:"Doctor Added"})
   }
   catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
   }
}


//   API FOR ADMIN LOGIN


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//  API FOR GET ALL DOCTOR LSIT FOR ADMIN PANEL

 const allDoctors = async(req,res) => {
  try {
     const doctors = await doctorModel.find({}).select('-password')
     res.json({ success: true, doctors})
  } 
  catch (error) {
          console.log(error);
        res.json({ success: false, message: error.message });
  }
 }


export  {addDoctor, loginAdmin,allDoctors}