const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');

require('dotenv').config();

//?Connect Database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));
app.use(cors());

//Test initial connection
app.get('/', (req, res) => {
    console.log('we got it');
    return res.send('API running now');
});

app.use('/api/tournament', require('./routes/api/tournamentStatistics'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
