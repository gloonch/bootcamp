const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));

// Import into the db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        console.log('Data imported from files...');
    } catch (error) {
        console.error(error);
    }
}


// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log('Data deleted using files...');
    } catch (error) {
        console.error(error);
    }
}
// node seeder *-i*
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}
