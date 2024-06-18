import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Import the CSS file for styling

function Home({ onSearch }) {
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [topArticles, setTopArticles] = useState([]);

    useEffect(() => {
        fetchTopArticles(); // Fetch top articles initially (when component mounts)
    }, []);

    const handleSearch = async () => {
        console.log('Search button clicked');
        try {
            await onSearch(ticker, startDate, endDate);
            fetchTopArticles(); // Fetch top articles after search
        } catch (error) {
            console.error('Error searching news:', error);
        }
    };

    const fetchTopArticles = async () => {
        try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=40ccd287886f49769f03b939245a2e11`);
            const articles = response.data.articles;
            const articlesWithRatings = await Promise.all(articles.map(async (article) => {
                const journalist = article.author; // Assuming author field contains journalist name
                const journalistRating = await fetchJournalistRating(journalist);
                return {
                    ...article,
                    authorScore: journalistRating
                };
            }));
            setTopArticles(articlesWithRatings);
        } catch (error) {
            console.error('Error fetching top articles:', error);
        }
    };

    const fetchJournalistRating = async (journalist) => {
        try {
            const response = await axios.get(`/api/news/journalist/${encodeURIComponent(journalist)}`);
            return response.data.rating;
        } catch (error) {
            console.error(`Error fetching journalist rating for ${journalist}:`, error);
            return null;
        }
    };

    return (
        <div className="home">
            <div className="search-bar">
                <input 
                    type="text" 
                    value={ticker} 
                    onChange={(e) => setTicker(e.target.value)} 
                    placeholder="Stock ticker..."
                />
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                />
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="top-articles">
                <h2>Top Articles</h2>
                <ul className="article-list">
                    {topArticles.map((article, index) => (
                        <li key={index} className="article">
                            <h3><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h3>
                            <p>{article.description}</p>
                            <p>Author: {article.author}</p>
                            <p>Journalist Rating: {typeof article.authorScore === 'number' ? article.authorScore.toFixed(2) : 'No rating available'}</p>
                            <p>Published At: {article.publishedAt}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;