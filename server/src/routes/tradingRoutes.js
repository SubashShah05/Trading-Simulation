const express = require('express');
const { getPortfolio, placeOrder, getTransactions, leaderboard } = require('../controllers/tradingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);
router.get('/portfolio', getPortfolio);
router.post('/orders', placeOrder);
router.get('/transactions', getTransactions);
router.get('/leaderboard', leaderboard);

module.exports = router;
