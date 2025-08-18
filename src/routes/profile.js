const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require("../utils/validation");
 profileRouter.get("/profile/view", userAuth , async(req , res)=>{
   try{
    // validate my token 
    const user = req.user;
    res.send(user);
    }catch(err){
        res.status(400).send("ERROR :"+err.message);
    }
   });
 
  profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error("Request body is empty or invalid");
        }

        if (!req.user) {
            throw new Error("User not authenticated");
        }

        if (!validateEditProfileData(req)) {
            throw new Error("Invalid fields in request body");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, profile edited successfully`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

   module.exports = profileRouter;