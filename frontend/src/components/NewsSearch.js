import React, { useState } from 'react';

function NewsSearch({ onSearch }) {
    const [keyword, setKeyword] = useState('');
    const [country, setCountry] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSearch = async () => {
        console.log('Search button clicked');
        try {
            console.log('Calling onSearch with:', { keyword, country, startDate, endDate });
            await onSearch(keyword, country, startDate, endDate);
        } catch (error) {
            console.error('Error searching news:', error);
        }
    };

    return (
        <div className="news-search">
            <input 
                type="text" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="Search news..."
            />
            <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                placeholder="Country..."
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