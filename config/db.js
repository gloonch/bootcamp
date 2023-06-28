const mongoose = require('mongoose');
require('dotenv').config({path: './config/config.env'});


const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
}

module.exports = connectDB;