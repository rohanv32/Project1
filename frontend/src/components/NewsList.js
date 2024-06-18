import React from 'react';
import axios from 'axios';
import './Home.css'; // Import the CSS file for styling

function NewsList({ news }) {
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
            <div className="top-articles">
                <h2>News Articles</h2>
                <ul className="article-list">
                    {news.map((article, index) => (
                        <li key={index} className="article">
                            <h3><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h3>
                            <p>{article.description}</p>
                            <p>Author: {article.author}</p>
                            <p>Journalist Rating: {article.authorScore ? article.authorScore.toFixed(2) : 'No rating available'}</p>
                            <p>Published At: {article.publishedAt}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default NewsList;
