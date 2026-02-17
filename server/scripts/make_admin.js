const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const email = process.argv[2];

if (!email) {
    console.error('Usage: node scripts/make_admin.js <email>');
    process.exit(1);
}

async function makeAdmin() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log(`Connecting to database...`);

        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.error(`User with email ${email} not found.`);
            await connection.end();
            process.exit(1);
        }

        await connection.query('UPDATE users SET role = "admin" WHERE email = ?', [email]);
        console.log(`Success! User ${email} is now an ADMIN.`);
        console.log('Please logout and login again to see access.');

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

makeAdmin();
