const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://nakulcharak280:Hy0GzgRnuW24k9oX@devhub.mgfgkba.mongodb.net/DevHub");
};

module.exports = connectDB;
