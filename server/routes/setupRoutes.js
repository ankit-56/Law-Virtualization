const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/setup', async (req, res) => {
    // Basic security check: simple secret key from env or a hardcoded one for this one-time task
    const { setupKey } = req.body;
    if (setupKey !== process.env.JWT_SECRET) {
        return res.status(403).json({ error: 'Unauthorized setup request' });
    }

    try {
        console.log('Starting remote database setup...');

        // 1. Create Tables
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS laws (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                content LONGTEXT,
                category_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS bookmarks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                law_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (law_id) REFERENCES laws(id) ON DELETE CASCADE,
                UNIQUE(user_id, law_id)
            )
        `);

        // 2. Seed Categories
        await db.query(`
            INSERT INTO categories (name, description) VALUES 
            ('Constitutional Law', 'Laws relating to the formulation and interpretation of the constitution'),
            ('Criminal Law', 'Laws concerned with punishment of individuals who commit crimes'),
            ('Civil Law', 'Laws concerned with private relations between members of a community'),
            ('Corporate Law', 'Laws governing the formation and conduct of corporations'),
            ('Family Law', 'Laws dealing with family matters and domestic relations')
            ON DUPLICATE KEY UPDATE description=VALUES(description)
        `);

        // 3. Seed Laws
        const laws = [
            ["The Constitution of India - Preamble", "Constitutional Law", "The Preamble to the Constitution of India...", "WE, THE PEOPLE OF INDIA..."],
            ["Article 21 - Protection of Life and Personal Liberty", "Constitutional Law", "No person shall be deprived of his life...", "Article 21 of the Constitution..."],
            ["Section 378 IPC - Theft", "Criminal Law", "Definition of Theft...", "Whoever, intending to take dishonestly..."],
            ["Section 302 IPC - Punishment for Murder", "Criminal Law", "Punishment for murder...", "Whoever commits murder..."]
        ];

        const [catRows] = await db.query('SELECT id, name FROM categories');
        const catMap = {};
        catRows.forEach(c => catMap[c.name] = c.id);

        for (const law of laws) {
            const [title, catName, desc, content] = law;
            await db.query(
                'INSERT INTO laws (title, description, content, category_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=title',
                [title, desc, content, catMap[catName]]
            );
        }

        res.json({ message: 'Database setup and seeding completed successfully' });
    } catch (error) {
        console.error('Setup failed:', error);
        res.status(500).json({ error: 'Database setup failed', details: error.message });
    }
});

module.exports = router;
