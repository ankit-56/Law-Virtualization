const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

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
