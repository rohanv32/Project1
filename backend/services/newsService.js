const axios = require('axios');

const fetchNews = async (ticker, from, to) => {
    try {
        const url = `https://newsapi.org/v2/everything?q=${ticker}&apiKey=40ccd287886f49769f03b939245a2e11&sortBy=popularity&from=${from}&to=${to}`;
        const response = await axios.get(url);

        if (!response.data || !Array.isArray(response.data.articles)) {
            throw new Error('Invalid response from news API');
        }

        const articles = response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            author: article.author || 'Unknown', // Ensure author is populated
            content: article.content,
            url: article.url,
            publishedAt: article.publishedAt
        }));

        const authors = articles.map(article => ({
            name: article.author,
            historical_accuracy: Math.random(), // Dummy data, replace with actual calculation
            publication_count: Math.random(), // Dummy data, replace with actual calculation
            engagement_score: Math.random(), // Dummy data, replace with actual calculation
            background_score: Math.random() // Dummy data, replace with actual calculation
        }));

        // Remove duplicate authors
        const uniqueAuthors = [...new Map(authors.map(author => [author.name, author])).values()];

        return { articles, authors: uniqueAuthors };
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

module.exports = { fetchNews };
