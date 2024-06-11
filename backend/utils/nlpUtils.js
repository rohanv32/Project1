const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
    const result = sentiment.analyze(text);
    return result.score;
};

module.exports = { analyzeSentiment };