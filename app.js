const express = require('express');
const bootcamps = require('./routes/bootcampRoute');
const courses = require('./routes/courseRoute');
const auth = require('./routes/authRoute');
// morgan is also another middleware logger that can be used
const logger = require('./middlewares/logger'); 
const connectDB = require('./config/db')
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/error');
const fileUpload = require('express-fileupload');
const path = require("path");

connectDB();

dotenv.config({path: './config/config.env'})

const app = express();

app.use(express.json())
app.use(logger)
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

// Error handler middleware has to be after mounted routes so to get used
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`))
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`);
    // close server & exit process
    server.close(()=> process.exit(1));
})