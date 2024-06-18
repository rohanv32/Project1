import React from 'react';

function JournalistRating({ rating }) {
    return (
        <div>
            <h2>Journalist Rating</h2>
            <p>Credibility Score: {rating !== null ? rating : 'No data available'}</p>
        </div>
    );
}

export default JournalistRating;