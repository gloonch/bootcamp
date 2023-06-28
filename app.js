const express = require('express');

const bootcamps = require('./routes/bootcampRoute');

const app = express();

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`))