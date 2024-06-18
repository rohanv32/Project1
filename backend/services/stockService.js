// stockService.js

const { fetchStockData } = require('../controllers/stockController');

const getStockData = async (ticker) => {
    try {
        const data = await fetchStockData(ticker);
        return data;
    } catch (error) {
        console.error('Error in stock service:', error);
        throw error;
    }
};

module.exports = {
    getStockData
};
