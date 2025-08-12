//  iN this   controlller function we will cretae   the api logic for  users like          
//  login register get profile   update profile book apppointments
// diplaying the book appointment and cancelling the appointment 
//  and also payment getway 



//  api to register user 
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/user.model.js'
import  jwt  from 'jsonwebtoken';

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

//    const loginUser = async (req,res) => {
//     try {
//        const {email,password} = req.body
//        const user = await userModel.findOne({email})
     
//     if(!user){
//     res.json({success:false, message:'User does not exist'})
//     }
//     const isMatch = await bcrypt.compare(password,user.password)
//     if(isMatch){
//         const token = jwt.sign({id:user._id},process.env.JWT_SECRET )
//         res.json({success:true,token})
//     }
//     else{
//     res.json({success:false, message:'Invalid Credentials'})
          
//     }




//    }
//     catch (error) {
//           console.log(error);
//     res.json({success:false, message:error.message})
//     }
    
//    }



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




export {registerUser , loginUser}