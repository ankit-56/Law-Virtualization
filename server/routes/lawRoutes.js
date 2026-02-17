const express = require('express');
const router = express.Router();
const lawController = require('../controllers/lawController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', lawController.getAllLaws);
router.get('/search', lawController.searchLaws);
router.get('/:id', lawController.getLawById);

// Protected Admin Routes
router.post('/', authMiddleware, adminMiddleware, lawController.createLaw);
router.post('/bulk', authMiddleware, adminMiddleware, lawController.bulkCreateLaws);
router.put('/:id', authMiddleware, adminMiddleware, lawController.updateLaw);
router.delete('/:id', authMiddleware, adminMiddleware, lawController.deleteLaw);

module.exports = router;
