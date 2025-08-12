const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
app.post("/signUp" , async (req ,res) =>{
    const user = new User({
        firstName:"Nakul",
        lastName:"Charak",
        emailId: "nakulchark@gmail.com",
        password: "nakul@123",
    });
    await user.save();
    res.send("User added Successfully");
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

