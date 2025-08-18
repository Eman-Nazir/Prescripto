
import jwt from "jsonwebtoken"


// admin authentication middleware

const authAdmin = async (req,res,next) => {
    try{
    // logic to verify the toekn 
     // in  any request in header of we have the token then we allow the user to api call otherwise we terminate the api call 

       const {atoken} = req.headers
       if(!atoken){
        res.json({success:false,message:"Not Authorized Login Again"})
       }
        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ){
        res.json({success:false,message:"Invalid Token"})
        }
 
    //    if matching we simply call callabck next() function
      next()
    }
     catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
   }
}
export default authAdmin