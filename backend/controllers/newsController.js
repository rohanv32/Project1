const { fetchNews } = require('../services/newsService');
const yahooFinance = require('yahoo-finance2').default;
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

let journalistRatings = {}; // This should be populated with your journalist ratings data

const getNews = async (req, res) => {
    try {
        const { ticker, from, to } = req.query;
        //console.log('Fetching news with parameters:', { ticker, from, to });

        const newsResponse = await fetchNews(ticker, from, to);

        //console.log('Authors data:', newsResponse.authors);

        let processedArticles = await Promise.all(newsResponse.articles.map(async (article) => {
            const sentimentScore = sentiment.analyze(article.content).score || 0;
            const correlationScore = await calculateCorrelation(ticker, article.publishedAt, sentimentScore);
            const author = newsResponse.authors.find(author => author.name === article.author);
            const authorScore = author ? calculateAuthorCredibility(author) : 0;
            const articleCredibilityScore = calculateCredibilityScore(article, newsResponse.authors, journalistRatings);

            //console.log({
                //title: article.title,
                //sentimentScore,
                //correlationScore,
                //articleCredibilityScore,
                //authorScore
            //});

            return { 
                ...article, 
                sentimentScore, 
                correlationScore: correlationScore || 0, 
                articleCredibilityScore: articleCredibilityScore || 0,
                authorScore: authorScore // Include the author score
            };
        }));

        // Limit the number of articles to 20
        processedArticles = processedArticles.slice(0, 20);

        res.json({ articles: processedArticles });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news' });
    }
};

const calculateCorrelation = async (ticker, publishedAt, sentimentScore) => {
    try {
        const date = new Date(publishedAt);
        const startDate = new Date(date);
        startDate.setDate(date.getDate() - 3);
        const endDate = new Date(date);
        endDate.setDate(date.getDate() + 3);

        const stockData = await yahooFinance.historical(ticker, {
            period1: startDate.toISOString().split('T')[0],
            period2: endDate.toISOString().split('T')[0]
        });

        if (!Array.isArray(stockData) || stockData.length < 2) return 0;

        const initialPrice = stockData[0].close;
        const finalPrice = stockData[stockData.length - 1].close;
        const priceChange = (finalPrice - initialPrice) / initialPrice;

        const correlationValue = sentimentScore * priceChange;
        return correlationValue;
    } catch (error) {
        console.error('Error calculating correlation:', error);
        return 0;
    }
};

const calculateCredibilityScore = (article, authors, journalistRatings) => {
    const sentimentScore = article.sentimentScore || 0;
    const articleScore = 0.5 * (isNaN(sentimentScore) ? 0 : sentimentScore);
    const biasScore = calculateBias(article.content);

    const averageCorrelationScore = article.correlationScore / authors.length;

    const authorScores = authors.map(author => calculateAuthorCredibility(author));
    const journalistRating = journalistRatings[article.author] || 0;

    //console.log({
        //articleScore,
        //authorScores,
        //biasScore
    //});

    const totalAuthorScore = authorScores.reduce((total, score) => total + score, 0);
    return (0.6 * articleScore) + (0.3 * totalAuthorScore) + (0.1 * biasScore) + journalistRating;
};

const calculateAuthorCredibility = (author) => {
    const weights = {
        historical_accuracy: 0.4,
        publication_count: 0.1,
        engagement_score: 0.2,
        background_score: 0.3,
    };

    if (!author) return 0;

    const { historical_accuracy, publication_count, engagement_score, background_score } = author;

    const authorScore = (weights.historical_accuracy * (historical_accuracy || 0)) +
                        (weights.publication_count * (publication_count || 0)) +
                        (weights.engagement_score * (engagement_score || 0)) +
                        (weights.background_score * (background_score || 0));

    //console.log(`Author: ${author.name}, Score: ${authorScore}`);

    return authorScore;
};

const calculateBias = (content) => {
    const biasKeywords = [
        { word: 'always', bias: 0.1 },
        { word: 'never', bias: -0.1 },
        { word: 'everyone', bias: 0.05 },
        { word: 'no one', bias: -0.05 },
    ];

    return biasKeywords.reduce((bias, keyword) => {
        const regex = new RegExp(`\\b${keyword.word}\\b`, 'gi');
        const matches = content.match(regex);
        if (matches) {
            bias += keyword.bias * matches.length;
        }
        return bias;
    }, 0);
};

const getJournalistRatings = (req, res) => {
    const { journalist } = req.params;
    //console.log(`Fetching rating for journalist: ${journalist}`);

    const rating = journalistRatings[journalist] ? normalizeRating(journalistRatings[journalist]) : 'No data available';
    //console.log(`Rating for journalist ${journalist}: ${rating}`);
    res.json({ journalist, rating });
};

const storeJournalistRatings = (req, res) => {
    const { journalist, rating } = req.body;
    //console.log(`Storing rating for journalist: ${journalist} with rating: ${rating}`);

    const normalizedRating = denormalizeRating(rating);
    journalistRatings[journalist] = normalizedRating;
    res.json({ journalist, rating: normalizedRating });
};

const normalizeRating = (rating) => {
    return rating / 10; // Adjust based on your rating scale
};

const denormalizeRating = (normalizedRating) => {
    return normalizedRating * 10; // Adjust based on your rating scale
};

module.exports = { getNews, getJournalistRatings, storeJournalistRatings };
