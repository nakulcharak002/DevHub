const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
authRouter.post("/signUp" , async (req ,res) =>{
   try{
    // validation of data
    validateSignUpData(req);
    // encrypt the password
    const {firstName , lastName , emailId,password} = req.body;
    const passwordHash = await bcrypt.hash(password , 10);
    console.log(passwordHash);


    // create a new instance of the user model
   const user = new User({
    firstName,
    lastName,
    emailId,
    password : passwordHash,
   });
     await user.save();
     res.send("User added Successfully");
   }catch(err){
    res.status(400).send("Error :"+err.message);
   }
   });
authRouter.post("/login" , async (req , res)=>{
  try{
    const {emailId , password} = req.body;
    const user =  await User.findOne({emailId : emailId});
    if(!user){
        throw new Error("invalid credentials");  
    }
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
        // create JWT Token 
        const token = await user.getJWT();
        // add the token to the cookie and send back the response to the user 
        res.cookie("token" , token ,{expires:new Date (Date.now()+8*3600000),})
        res.send("User login Successful!!!");
    }else{
        throw new Error("invalid credentials");
    }

  }catch(err){
    res.status(400).send("Error :"+err.message);
   }
});

authRouter.post("/logout" , async(req , res)=>{
  res.cookie("token" , null,{
    expires : new Date(Date.now()),
  });
  res.send("logout successful");
})


module.exports = authRouter;