const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt")

app.use(express.json());
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
        res.send("User login Successful!!!");
    }else{
        throw new Error("invalid credentials");
    }

  }catch(err){
    res.status(400).send("Error :"+err.message);
   }
});

   app.get("/user" , async(req , res)=>{
    const userEmail = req.body.emailId;
   try{
     const users = await User.find({emailId : userEmail});
     if(users.length === 0){
        res.status(404).send("User not found");
     }else{
        res.send(users);
     }
   }catch(err){
    res.status(400).send("something went wrong");
   }
   });

   app.get("/feed" , async(req , res)=>{
    try{
         const users = await User.find({});
         res.send(users);

    }catch(err){
    res.status(400).send("something went wrong");
   }
   });

   app.delete("/user" , async(req , res )=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id: userId});
         console.log(user);
        res.send("User deleted Sucessfully");

    }catch(err){
    res.status(400).send("something went wrong");
   }
   });
 app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATE =[
            "userId",
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATE.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error ("Update not allowed");
        }{
            if(data?.skills.length>10){
                throw  new Error("skills cannot be added more than 10")
            }
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data,{
            returnDocument :"after",
            runValidators: true,

        });
        console.log(user);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("UPDATE FAILED:" + err.message );
    }
});

 connectDB().then(() =>{
    console.log("connection establised to database");
     app.listen(7778, () => {
     console.log('Server is running on http://localhost:7778');
});
 })
.catch((err) =>{
 console.error("database cannot be connected");
 });

