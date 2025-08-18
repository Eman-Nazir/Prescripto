
import jwt from "jsonwebtoken"


// user authentication middleware

const authUser = async (req, res, next) => {
  try {
    let token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: token_decode.id }; 
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser