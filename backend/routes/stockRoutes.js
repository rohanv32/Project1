// stockRoutes.js

const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Define route to fetch stock data by ticker
router.get('/:ticker', stockController.getStockDataByTicker);

module.exports = router;
