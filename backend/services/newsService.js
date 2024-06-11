const axios = require('axios'); // Make sure to import Axios

const fetchNews = async (query, from, to) => {
    const API_KEY = '';
    let url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&sortBy=popularity`;

    if (from) {
        url += `&from=${from}`;
    }
    if (to) {
        url += `&to=${to}`;
    }

    console.log('Request URL:', url); // Log the URL for debugging

    try {
        const response = await axios.get(url);
        if (!response.data) {
            throw new Error('No data received from news API');
        }
        return response.data;
    } catch (error) {
        console.error('Error in fetchNews:', error); // More detailed error logging
        throw error;
    }
};

module.exports = { fetchNews };
