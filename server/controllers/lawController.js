const db = require('../config/db');

exports.getAllLaws = async (req, res) => {
    try {
        const { category_id } = req.query;
        let query = 'SELECT laws.*, categories.name as category_name FROM laws LEFT JOIN categories ON laws.category_id = categories.id';
        let params = [];

        if (category_id) {
            query += ' WHERE category_id = ?';
            params.push(category_id);
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLawById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT laws.*, categories.name as category_name FROM laws LEFT JOIN categories ON laws.category_id = categories.id WHERE laws.id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Law not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchLaws = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

        const searchTerm = `%${q}%`;
        const [rows] = await db.query(
            'SELECT * FROM laws WHERE title LIKE ? OR description LIKE ? OR content LIKE ? OR explanation LIKE ?',
            [searchTerm, searchTerm, searchTerm, searchTerm]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLaw = async (req, res) => {
    try {
        const { title, description, content, category_id, explanation, media_urls, pdf_url } = req.body;
        if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

        const [result] = await db.query(
            'INSERT INTO laws (title, description, content, category_id, explanation, media_urls, pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, content, category_id, explanation, JSON.stringify(media_urls || []), pdf_url]
        );
        res.status(201).json({ id: result.insertId, title, description, category_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bulkCreateLaws = async (req, res) => {
    try {
        const { laws } = req.body; // Array of law objects
        if (!Array.isArray(laws)) return res.status(400).json({ error: 'Expected an array of laws' });

        const results = [];
        for (const law of laws) {
            const { title, description, content, category_id, explanation, media_urls, pdf_url } = law;
            const [result] = await db.query(
                'INSERT INTO laws (title, description, content, category_id, explanation, media_urls, pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, description, content, category_id, explanation, JSON.stringify(media_urls || []), pdf_url]
            );
            results.push({ id: result.insertId, title });
        }

        res.status(201).json({ message: `${results.length} laws uploaded successfully`, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLaw = async (req, res) => {
    try {
        const { title, description, content, category_id, explanation, media_urls, pdf_url } = req.body;
        await db.query(
            'UPDATE laws SET title = ?, description = ?, content = ?, category_id = ?, explanation = ?, media_urls = ?, pdf_url = ? WHERE id = ?',
            [title, description, content, category_id, explanation, JSON.stringify(media_urls || []), pdf_url, req.params.id]
        );
        res.json({ message: "Law updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteLaw = async (req, res) => {
    try {
        await db.query('DELETE FROM laws WHERE id = ?', [req.params.id]);
        res.json({ message: "Law deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
