const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Connected to MySQL for migration...');

        const [columns] = await connection.query('SHOW COLUMNS FROM laws');
        const columnNames = columns.map(c => c.Field);

        const missingColumns = [
            { name: 'explanation', type: 'TEXT' },
            { name: 'media_urls', type: 'TEXT' },
            { name: 'pdf_url', type: 'VARCHAR(500)' }
        ];

        for (const col of missingColumns) {
            if (!columnNames.includes(col.name)) {
                console.log(`Adding missing column: ${col.name}`);
                await connection.query(`ALTER TABLE laws ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        console.log('Database migration completed successfully.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
