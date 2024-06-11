const { fetchNews } = require('../services/newsService');

const getNews = async (req, res) => {
    try {
        const { keyword, country, from, to } = req.query;
        console.log('Fetching news with parameters:', { keyword, country, from, to }); // Log the parameters
        let news = await fetchNews(keyword, country, from, to);
        res.json(news);  // Send the news response back
    } catch (error) {
        console.error('Error fetching news:', error); // More detailed error logging
        res.status(500).json({ message: 'Error fetching news' });
    }
};

module.exports = { getNews };