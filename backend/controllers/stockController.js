// stockController.js

const fetch = require('node-fetch');

const getStockDataByTicker = async (req, res) => {
    const { ticker } = req.params;
    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch stock data');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
};

module.exports = {
    getStockDataByTicker
};
