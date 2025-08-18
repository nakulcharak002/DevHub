const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema =  new mongoose.Schema({
    firstName : {
       type: String,
       required: true,
       minLength : 4,
       index : true,
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
        enum :{
            values :["male" , "female" , "other"],
            message : `{VALUE} is not a  valid gender type`,
        },
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
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({_id: user._id} , "DEV@HUB$123" ,{expiresIn :"7d",});
    return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputByUser , passwordHash);
    return isPasswordValid;
}
module.exports =  mongoose.model("User" , userSchema);