import React, { useState } from 'react';
import NewsSearch from './components/NewsSearch';
import NewsList from './components/NewsList';
import SentimentAnalysis from './components/SentimentAnalysis';

function App() {
    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('news');

    const handleSearch = async (keyword, country, startDate, endDate) => {
      try {
          const query = `${keyword}${country ? ` ${country}` : ''}`;
          console.log('Fetching news with parameters:', { query, startDate, endDate });
          const response = await fetch(`/api/news?keyword=${encodeURIComponent(query)}&from=${startDate}&to=${endDate}`);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setNews(data.articles);
          setError(null);
      } catch (error) {
          setError(error.message);
      }
  };

    const switchTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="app">
            <header>
                <NewsSearch onSearch={handleSearch} />
            </header>
            {error && <p className="error">{error}</p>}
            <div className="tabs">
                <button className={activeTab === 'news' ? 'active' : ''} onClick={() => switchTab('news')}>News</button>
                <button className={activeTab === 'sentiment' ? 'active' : ''} onClick={() => switchTab('sentiment')}>Sentiment Analysis</button>
            </div>
            {activeTab === 'news' && <NewsList news={news} />}
            {activeTab === 'sentiment' && <SentimentAnalysis headlines={news.map(article => article.title)} />}
        </div>
    );
}

export default App;