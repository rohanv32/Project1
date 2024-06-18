import React, { useState } from 'react';

function NewsSearch({ onSearch }) {
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSearch = async () => {
        console.log('Search button clicked');
        try {
            await onSearch(ticker, startDate, endDate);
        } catch (error) {
            console.error('Error searching news:', error);
        }
    };

    return (
        <div className="news-search">
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
    );
}

export default NewsSearch;
