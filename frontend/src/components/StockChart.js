// StockChart.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';
import axios from 'axios';

const StockChart = ({ symbol, width, ratio }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData(symbol);
    }, [symbol]);

    const fetchData = (symbol) => {
        axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=finance`)
            .then(response => {
                const rawData = response.data.chart.result[0];
                const { timestamp, indicators } = rawData;
                const chartData = timestamp.map((time, index) => ({
                    date: new Date(time * 1000),
                    open: indicators.quote[0].open[index],
                    high: indicators.quote[0].high[index],
                    low: indicators.quote[0].low[index],
                    close: indicators.quote[0].close[index],
                    volume: indicators.quote[0].volume[index]
                }));
                setData(chartData);
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
            });
    };

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
    const { data: fittedData, xScale, xAccessor, displayXAccessor } = xScaleProvider(data);

    const height = 400;

    return (
        <ChartCanvas
            width={width}
            height={height}
            ratio={ratio}
            margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
            type='hybrid'
            seriesName="MSFT"
            data={fittedData}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
        >
            <Chart id={0} yExtents={[d => [d.high, d.low]]}>
                <XAxis axisAt="bottom" orient="bottom" ticks={6} />
                <YAxis axisAt="left" orient="left" ticks={5} />
                <MouseCoordinateX
                    at="bottom"
                    orient="bottom"
                    displayFormat={d => d.toLocaleDateString('en-US')}
                />
                <MouseCoordinateY
                    at="left"
                    orient="left"
                    displayFormat={d => `$${d.toFixed(2)}`}
                />
                <CandlestickSeries />
                <LineSeries yAccessor={d => d.close} stroke="#000000" />
            </Chart>
            <CrossHairCursor />
        </ChartCanvas>
    );
};

StockChart.propTypes = {
    symbol: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired
};

export default fitWidth(StockChart);