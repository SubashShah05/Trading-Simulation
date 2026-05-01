const express = require('express');
const { listStocks, getStockDetail } = require('../controllers/stocksController');

const router = express.Router();
router.get('/', listStocks);
router.get('/:symbol', getStockDetail);

module.exports = router;
