import React, { useEffect, useState } from 'react';
import Sentiment from 'sentiment'; // Import the Sentiment library

function SentimentAnalysis({ headlines }) {
    const [recommendation, setRecommendation] = useState('Hold');
    const [averageScore, setAverageScore] = useState(0);

    useEffect(() => {
        const analyzeSentiment = () => {
            const sentiment = new Sentiment();
            let totalScore = 0;

            headlines.forEach(headline => {
                const result = sentiment.analyze(headline);
                totalScore += result.score;
            });

            const averageScore = totalScore / headlines.length;
            setAverageScore(averageScore);

            if (averageScore > 0) {
                setRecommendation('Buy');
            } else if (averageScore < 0) {
                setRecommendation('Sell');
            } else {
                setRecommendation('Hold');
            }
        };

        analyzeSentiment();
    }, [headlines]);

    return (
        <div className="sentiment-analysis">
            <h2>Sentiment Analysis</h2>
            <p>Average Score: {averageScore.toFixed(2)}</p>
            <p>Recommendation: {recommendation}</p>
        </div>
    );
}

export default SentimentAnalysis;