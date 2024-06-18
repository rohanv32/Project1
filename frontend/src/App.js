import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import debounce from 'lodash.debounce';
import Home from './components/Home';
import LoadingSpinner from './components/LoadingSpinner';

const NewsList = lazy(() => import('./components/NewsList'));
const SentimentAnalysis = lazy(() => import('./components/SentimentAnalysis'));
const JournalistRating = lazy(() => import('./components/JournalistRating'));
const StockInfo = lazy(() => import('./components/StockInfo'));

function App() {
    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [journalistRating, setJournalistRating] = useState(null);
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(debounce(async (ticker, journalist, startDate, endDate) => {
        setLoading(true);
        setActiveTab('news');

        try {
            const [newsResponse, stockResponse, journalistResponse] = await Promise.all([
                fetch(`/api/news?ticker=${encodeURIComponent(ticker)}&from=${startDate}&to=${endDate}`),
                fetch(`/api/stock/${encodeURIComponent(ticker)}`),
                fetch(`/api/news/journalist/${encodeURIComponent(journalist)}`)
            ]);

            if (!newsResponse.ok || !stockResponse.ok || !journalistResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const [newsData, stockData, journalistData] = await Promise.all([
                newsResponse.json(),
                stockResponse.json(),
                journalistResponse.json()
            ]);

            setNews(newsData.articles);
            setStockData(stockData);
            setJournalistRating(journalistData.rating);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, 300), []);

    return (
        <div className="App">
            <h1>News Sentiment Analysis</h1>
            <div className="tabs">
                <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>Home</button>
                <button onClick={() => setActiveTab('news')} className={activeTab === 'news' ? 'active' : ''}>News</button>
                <button onClick={() => setActiveTab('sentiment')} className={activeTab === 'sentiment' ? 'active' : ''}>Sentiment Analysis</button>
                <button onClick={() => setActiveTab('stock')} className={activeTab === 'stock' ? 'active' : ''}>Stock Info</button>
            </div>
            {activeTab === 'home' && <Home onSearch={handleSearch} />}
            <Suspense fallback={<LoadingSpinner />}>
                {activeTab === 'news' && <NewsList news={news} />}
                {activeTab === 'sentiment' && <SentimentAnalysis headlines={news.map(article => article.title)} />}
                {activeTab === 'stock' && <StockInfo stockData={stockData} />}
            </Suspense>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default App;
