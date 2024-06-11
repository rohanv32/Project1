import React from 'react';

function NewsList({ news }) {
    return (
        <div className="news-list">
            <h2>News List</h2>
            {news.map((article, index) => (
                <div key={index} className="news-article">
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
            ))}
        </div>
    );
}

export default NewsList;