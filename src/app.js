const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());
app.post("/signUp" , async (req ,res) =>{
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
app.post("/login" , async (req , res)=>{
  try{
    const {emailId , password} = req.body;
    const user =  await User.findOne({emailId : emailId});
    if(!user){
        throw new Error("invalid credentials");  
    }
    const isPasswordValid = await bcrypt.compare(password , user.password);
    if(isPasswordValid){
        // create JWT Token 
        const token = await jwt.sign({_id: user._id} , "DEV@HUB$123" ,{expiresIn :"1d",});
        
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

   app.get("/profile", userAuth , async(req , res)=>{
   try{
    // validate my token 
    const user = req.user;
    res.send(user);
    }catch(err){
        res.status(400).send("ERROR :"+err.message);
    }
   });

   app.post("/sendConnectionRequest" ,userAuth, async(req, res) =>{
    const user = req.user;
    // sending connection req 
    console.log(user.firstName +" send the connection req")
    console.log("Sending a connection request");
    res.send("Connection Request send");
   })
 connectDB().then(() =>{
    console.log("connection establised to database");
     app.listen(7778, () => {
     console.log('Server is running on http://localhost:7778');
});
 })
.catch((err) =>{
 console.error("database cannot be connected");
 });

