const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/bookmarks', userController.toggleBookmark);
router.get('/:user_id/bookmarks', userController.getUserBookmarks);

module.exports = router;
