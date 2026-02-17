const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

router.post('/admin', async (req, res) => {
    const { setupKey, username, email, password } = req.body;

    if (setupKey !== process.env.JWT_SECRET) {
        return res.status(403).json({ error: 'Unauthorized setup request' });
    }

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await db.query(`
            INSERT INTO users (username, email, password_hash, role) 
            VALUES (?, ?, ?, 'admin')
            ON DUPLICATE KEY UPDATE role = 'admin', password_hash = ?
        `, [username, email, password_hash, password_hash]);

        res.json({ message: 'Admin user created/updated successfully', username, email });
    } catch (error) {
        console.error('Admin setup failed:', error);
        res.status(500).json({ error: 'Admin setup failed', details: error.message });
    }
});

module.exports = router;
