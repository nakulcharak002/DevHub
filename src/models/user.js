const mongoose = require('mongoose');
const validator = require("validator");

const userSchema =  new mongoose.Schema({
    firstName : {
       type: String,
       required: true,
       minLength : 4,
       maxLength : 50 ,
    },
    lastName: {
        type: String
    },
    emailId:{
        type: String,
        lowercase : true,
        required: true,
        unique : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Invalid email address: " + value)
            }
        }
    },
    password :{
       type: String,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error ("Enter a strong password : " + value);
            }
        }
    },
    age: {
        type: Number,
        min : 18,
    },
    gender :{
        type: String,
        validate(value){
            if(!["male" , "female" , "other"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl :{
        type: String,
        default :"https://www.kerthimmobilien.de/wp-content/uploads/2014/10/dummy-avatar.png",
         validate(value){
            if(!validator.isURL(value)){
                throw new Error ("Invalid Photo URL: " + value);
            }
        }
    },
     about :{
        type: String,
        default: "this is a default about of the user!"
    },
    skills :{
        type: [String],
    },
    
},{
    timestamps : true,
});
module.exports =  mongoose.model("User" , userSchema);