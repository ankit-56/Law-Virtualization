const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000, // Extend timeout to 20 seconds
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

// Debug log (Safe)
console.log(`Attempting to connect to database at: ${process.env.DB_HOST ? process.env.DB_HOST.substring(0, 10) + '...' : 'UNDEFINED'} on port: ${process.env.DB_PORT || 3306}`);


const promisePool = pool.promise();

promisePool.getConnection()
    .then(conn => {
        console.log("Connected to MySQL Database");
        conn.release();
    })
    .catch(err => {
        console.error("Database connection failed:", err.message);
    });

module.exports = promisePool;
