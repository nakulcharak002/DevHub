const express = require('express');
const app = express();
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
 connectDB().then(() =>{
    console.log("connection establised to database");
     app.listen(7778, () => {
     console.log('Server is running on http://localhost:7778');
});
 })
.catch((err) =>{
 console.error("database cannot be connected");
 });

