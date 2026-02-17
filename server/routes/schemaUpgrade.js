const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
    const { setupKey } = req.body;
    if (setupKey !== process.env.JWT_SECRET) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        console.log('Upgrading database schema for rich content...');

        // Add explanation column
        await db.query(`ALTER TABLE laws ADD COLUMN IF NOT EXISTS explanation TEXT AFTER content`);

        // Add media_urls for diagrams/images
        await db.query(`ALTER TABLE laws ADD COLUMN IF NOT EXISTS media_urls JSON AFTER explanation`);

        // Add pdf_url for document linking
        await db.query(`ALTER TABLE laws ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(500) AFTER media_urls`);

        res.json({ message: 'Schema upgraded successfully to support Diagrams, PDFs, and Easy Explanations' });
    } catch (error) {
        console.error('Schema upgrade failed:', error);
        res.status(500).json({ error: 'Upgrade failed', details: error.message });
    }
});

module.exports = router;
