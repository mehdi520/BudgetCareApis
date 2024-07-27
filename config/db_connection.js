const mongoose = require('mongoose');
const connectDB = async() => {
    console.log(process.env.MONDO_URL);
    await mongoose.connect(process.env.MONDO_URL);
    console.log(` database connected on host ${mongoose.connection.host}`);
};

module.exports = connectDB;