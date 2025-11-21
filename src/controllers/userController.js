import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    verifyEmail(token, email); //send email here

    newUser.token = token;

    await newUser.save();
    return res.status(201).json({
      success: true,
      messsage: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verify = async(req,res)=>{

   try {
     const authHeader = req.headers.authorization

     if(!authHeader || !authHeader.startsWith("Bearer ")){
      res.status(400).json({
        success:false,
        message:'Authorization token is missing or invalid'
      })
     }

     const token = authHeader.split(" ")[1]//[Bearer, fgfjghreuigre]

     let decoded

     try {
       decoded = jwt.verify(token ,process.env.SECRET_KEY)
     } catch (error) {
       if(error.name === "TokenExpiredError"){
        return res.status(400).json({
          success:false,
          message:"the registration token has expired"
        })
       }
       return res.status(400).json({
        success:false,
        message:"token verification failed"
       })
     }

     const user = await User.findById(decoded.id)

     if(!user){
      return res.status(400).json({
        success:false,
        message:"user not found"
      })

     }

    
   } catch (error) {
    
   }

}


