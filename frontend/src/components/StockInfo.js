// StockInfo.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const StockInfo = ({ stockData }) => {
    const [chartData, setChartData] = useState([]);
    const [change, setChange] = useState(1);

    useEffect(() => {
        if (stockData) {
            fetchStockChartData(stockData.chart.result[0].meta.symbol);
        }
    }, [stockData]);

    const fetchStockChartData = (symbol) => {
        axios.get(`/api/proxy/stock?ticker=${symbol}`)
            .then(res => {
                const timestamps = res.data.chart.result[0].timestamp;
                const values = res.data.chart.result[0].indicators.quote[0].close;

                const changeValue = values[values.length - 1] / values[0];
                setChange(changeValue);

                const chartData = {
                    x: timestamps.map(timestamp => new Date(timestamp * 1000)),
                    y: values,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { color: 'blue' },
                };

                setChartData([chartData]);
            })
            .catch(error => {
                console.error('Error fetching stock chart data:', error);
                setChartData([]);
            });
    };

    let color = 'blue';
    if (change >= 1.01) color = 'green';
    if (change <= 0.99) color = 'red';

    if (!stockData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{stockData.chart.result[0].meta.symbol} ({change.toFixed(2)})</h2>
            <p>Price: {stockData.chart.result[0].meta.regularMarketPrice}</p>
            <p>52 Week High: {stockData.chart.result[0].meta.fiftyTwoWeekHigh}</p>
            <p>52 Week Low: {stockData.chart.result[0].meta.fiftyTwoWeekLow}</p>
            <Plot
                data={chartData}
                layout={{
                    width: '100%',
                    height: '300px',
                    title: `Stock Chart for ${stockData.chart.result[0].meta.symbol}`,
                    xaxis: {
                        title: 'Date',
                        tickformat: '%Y-%m-%d'
                    },
                    yaxis: {
                        title: 'Price'
                    },
                    autosize: true,
                    margin: {
                        l: 40,
                        r: 10,
                        t: 40,
                        b: 40
                    },
                    plot_bgcolor: '#f9f9f9',
                    paper_bgcolor: '#f9f9f9',
                }}
            />
        </div>
    );
};

export default StockInfo;