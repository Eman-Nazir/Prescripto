//  iN this   controlller function we will cretae   the api logic for  users like          
//  login register get profile   update profile book apppointments
// diplaying the book appointment and cancelling the appointment 
//  and also payment getway 



//  api to register user 
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/user.model.js'
import  jwt  from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctor.model.js';
import appointmentModel from '../models/appointmentModel.js';

const registerUser = async (req,res) =>{
   try {
    const {name ,email,password} = req.body
    if(!name || !email || !password){
        return res.json({success:false,message:"Missing Details"})
    }

    if(!validator.isEmail(email)){
        return res.json({success:false,message:"Enter a valid email"})

    }

    if(password.length < 8 ){
        return res.json({success:false,message:"Enter a strong password"})
    }    


    //  hashing user password 
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt )


    const userData = {
        name,
        email,
        password : hashedPassword
    }

        const newUser = new userModel(userData) 
        const user = await newUser.save()          
        //    the suer in smae in data base we get _id with the help of this we can creaetr token 
        // so user can login the website 


        const token = jwt.sign({id:user._id} , process.env.JWT_SECRET)
        res.json({success:true , token})

    
   } catch (error) {

    console.log(error);
    res.json({success:false, message:error.message})
    
    
   }
}

//  API FOR USER LOGIN 




const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; 

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password); 

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid Credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//   API TO GET USER PROFILE DATA 

                          

const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.user.id).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



//  api to update user profile 


const updateProfile = async (req,res) => {
    try {
       
        const {name,phone,address,dob,gender} = req.body
         const imageFile = req.file
      if(!name || !phone || !dob || !gender){
        return res.json({success:false,message:'Data Missing'})
      }
        const userId = req.user.id
      await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
         
        if(imageFile){
            // upload image to the cloudinary

            const imageUplaod = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageUrl = imageUplaod.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageUrl})
        }

          res.json({success:true,message:'Profile Updated'})


    } catch (error) {
       console.log(error);
       res.json({ success: false, message: error.message });  
    }
}

//  Logic to the book appointment for the user





const  bookAppointment = async (req, res) => {
   try {
     const userId = req.user.id;
      const { docId, slotDate, slotTime } = req.body;
 
    // Fetch doctor data
    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' });
    }
    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' });
    }

    let slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    // Fetch user data
    const userData = await userModel.findById(userId).select('-password');

    // // Remove slots_booked before storing docData in appointment

const docDataCopy = JSON.parse(JSON.stringify(docData));
delete docDataCopy.slots_booked;


const appointmentData = {
  userId,
  docId,
  userData,
  docData: docDataCopy,
  amount: docData.fees,
  slotTime,
  slotDate,
  date: Date.now()
};



    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save updated doctor slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment booked successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//  All list of doctors that user have booked 
//  Api to get user appointment for frontened my-appointment page 


  const listAppointment = async (req,res) => {
    try {
        
        const userId = req.user.id;
        const appointments = await appointmentModel.find({userId})
        res.json({success:true,appointments})


    }
    
    catch (error) {
     console.log(error);
    res.status(500).json({ success: false, message: error.message });
    }
  }





//  API TP CANCEL APPOINTMENT 

const cancelAppointment = async (req,res) => {

    try {
        const userId = req.user.id;
        const {appointmentId} = req.body
         const appointmentData = await appointmentModel.findById(appointmentId)

    //  verify appointment user 

    if(appointmentData.userId !== userId){
        res.json({success:false,message:error.message})
    }
    
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      
//    when appointment is cancelled that time slots will be free 



         const {docId,slotDate,slotTime} = appointmentData
          
         const doctorData = await doctorModel.findById(docId)

         let slots_booked = doctorData.slots_booked

         slots_booked[slotDate] = slots_booked[slotDate].filter(e =>  e !== slotTime)


         await doctorModel.findByIdAndUpdate(docId,{slots_booked})

         res.json({success:false, message: 'Appointment Cancelled'})



    } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
    } 
    }

   




export {registerUser , loginUser,getProfile ,updateProfile, bookAppointment , listAppointment,cancelAppointment }