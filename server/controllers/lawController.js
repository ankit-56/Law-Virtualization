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
            'SELECT * FROM laws WHERE title LIKE ? OR description LIKE ? OR content LIKE ?',
            [searchTerm, searchTerm, searchTerm]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLaw = async (req, res) => {
    try {
        const { title, description, content, category_id } = req.body;
        // Basic validation
        if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

        const [result] = await db.query(
            'INSERT INTO laws (title, description, content, category_id) VALUES (?, ?, ?, ?)',
            [title, description, content, category_id]
        );
        res.status(201).json({ id: result.insertId, title, description, category_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLaw = async (req, res) => {
    try {
        const { title, description, content, category_id } = req.body;
        await db.query(
            'UPDATE laws SET title = ?, description = ?, content = ?, category_id = ? WHERE id = ?',
            [title, description, content, category_id, req.params.id]
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
