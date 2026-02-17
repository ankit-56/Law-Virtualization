const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Law Virtualization API is running');
});

// Routes
app.use('/api/laws', require('./routes/lawRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upgrade-schema', require('./routes/schemaUpgrade'));
// app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
