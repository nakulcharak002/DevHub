const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());
app.post("/signUp" , async (req ,res) =>{
   
   const user = new User(req.body);

   try{
     await user.save();
     res.send("User added Successfully");
   }catch(err){
    res.status(400).send("Error saving the user :"+err.message);
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
 app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data);
        console.log(user);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
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

