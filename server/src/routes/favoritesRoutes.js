const express = require('express');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoritesController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);
router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);

module.exports = router;
