import doctorModel from "../models/doctor.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";




const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.json({ success: false, message: message.error });
  }
};

//  Api fpr doctor login

const loginDoctor = async(req,res) => {
  try {
    
    const {email,password} = req.body
    const doctor = await doctorModel.findOne({email})
    
    if(!doctor){
      res.json({success:false, message:'Invalid Credentials '})
    }
    
    const isMatch =  await bcrypt.compare(password,doctor.password)

     if(isMatch) {
      const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
      res.json({success:true,token})
     }
    else{
      res.json({success:false, message:'Invalid Credentials '})
    }

  } 
  catch (error) {
    console.error("Error fetching doctors:", error);
    res.json({ success: false, message: message.error });
  }
}

//  Api to get doctor appointments for doctor panel 





const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctor.id;

    // match with schema field name
    const appointments = await appointmentModel.find({ docId: docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.json({ success: false, message: error.message });
  }
};


//  api to mark appointment completed  for doctor panel 


const appointmentComplete = async (req,res) => {
  try {
    const docId = req.doctor.id;
    const {appointmentId} = req.body

     const appointmentData = await appointmentModel.findById(appointmentId)
       
     if(appointmentData && appointmentData.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
      return res.json({success:true,message:'Appointment Completed' })
                                                                    
     } 
     else{
      return res.json({success:false,message:'Mark Failed' })
     }
  } 
  catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.json({ success: false, message: error.message });
  }
}



//  api to mark appointment cancelled  for doctor panel 


const appointmentCancel = async (req,res) => {
  try {
    const docId = req.doctor.id;
    const {appointmentId} = req.body

     const appointmentData = await appointmentModel.findById(appointmentId)
       
     if(appointmentData && appointmentData.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      return res.json({success:true,message:'Appointment Cancelled' })
                                                                    
     } 
     else{
      return res.json({success:false,message:'Cancellation Failed' })
     }
  } 
  catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.json({ success: false, message: error.message });
  } 
}


// API to get dashboard data for doctor panel
// const doctorDashboard = async (req, res) => {
//   try {

//     const appointments = await appointmentModel.find({ docId })

//     let earnings = 0

//     appointments.map((item) => {
//       if (item.isCompleted || item.payment) {
//         earnings += item.amount
//       }
//     })

//     let patients = []

//     appointments.map((item) => {
//       if (!patients.includes(item.userId)) {
//         patients.push(item.userId)
//       }
//     })

//     const dashData = {
//       earnings,
//       appointments: appointments.length,
//       patients: patients.length,
//       latestAppointments: appointments.reverse().slice(0, 5)
//     }

//     res.json({ success: true, dashData })
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }



const doctorDashboard = async (req, res) => {
  try {
    const docId = req.doctor.id  

    const appointments = await appointmentModel.find({ docId })

    let earnings = 0

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
    })

    let patients = []

    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}



  //  Api  to get doctor profile for doctor panel 


   const doctorProfile = async (req,res) => {
   try {
    const docId = req.doctor.id;
    const profileData = await doctorModel.findById(docId).select('-password') 
    res.json({success:true, profileData})
   }
   catch (error) {
   console.log(error)
    res.json({ success: false, message: error.message })
   }
}


//  Api to update doctor profile dat from doctor panel 


const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.doctor.id; 

    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};



                    
export { changeAvailablity, doctorList,loginDoctor,appointmentsDoctor ,appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,updateDoctorProfile };
