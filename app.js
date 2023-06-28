const express = require('express');
const bootcamps = require('./routes/bootcampRoute');
// morgan is also another middleware logger that can be used
const logger = require('./middlewares/logger'); 

const app = express();

app.use(logger)

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`))