const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ error: "All fields are required" });

        // Check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ error: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, password_hash]);

        res.status(201).json({ id: result.insertId, username, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleBookmark = async (req, res) => {
    try {
        const { user_id, law_id } = req.body;

        // Check if exists
        const [exists] = await db.query('SELECT * FROM bookmarks WHERE user_id = ? AND law_id = ?', [user_id, law_id]);

        if (exists.length > 0) {
            // Remove
            await db.query('DELETE FROM bookmarks WHERE user_id = ? AND law_id = ?', [user_id, law_id]);
            res.json({ message: "Bookmark removed" });
        } else {
            // Add
            await db.query('INSERT INTO bookmarks (user_id, law_id) VALUES (?, ?)', [user_id, law_id]);
            res.json({ message: "Bookmark added" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserBookmarks = async (req, res) => {
    try {
        const { user_id } = req.params;
        const [rows] = await db.query(
            `SELECT laws.* FROM bookmarks 
             JOIN laws ON bookmarks.law_id = laws.id 
             WHERE bookmarks.user_id = ?`,
            [user_id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
