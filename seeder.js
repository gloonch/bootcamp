const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({path: './config/config.env'});

// Load models
const bootcamp = require('./models/Bootcamp');
const Bootcamp = require('./models/Bootcamp');

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// Import into the db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data imported from files...');
    } catch (error) {
        console.error(error);
    }
}


// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
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
