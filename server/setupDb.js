const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            multipleStatements: true
        });

        console.log('Connected to MySQL server');

        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema.sql...');
        await connection.query(schemaSql);

        console.log('Database setup completed successfully.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error.message);
        console.error('Please check your .env file and ensure MySQL is running.');
        process.exit(1);
    }
}

setupDatabase();
