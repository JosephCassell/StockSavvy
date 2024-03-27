import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchStockDetails, fetchStockHistoryAll, fetchStockHistory1D, fetchStockHistory1W, fetchStockHistory1M, } from '../../redux/stockActions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './StockDetails.css';

const StockDetails = () => {
    const dispatch = useDispatch();
    const { symbol } = useParams();
    const stockDetails = useSelector((state) => state.stock.stock);
    const loading = useSelector((state) => state.stock.loading);
    const error = useSelector((state) => state.stock.error);
    const [hoveredPrice, setHoveredPrice] = useState(null);
    const [selectedRange, setSelectedRange] = useState('all');
    const [showPortfolios, setShowPortfolios] = useState(false);
    const [showWatchlists, setShowWatchlists] = useState(false);
    const [initialRangePrice, setInitialRangePrice] = useState(0);
    const [priceDifference, setPriceDifference] = useState({ amount: 0, percentage: 0 });

    const history = useSelector((state) => {
        switch (selectedRange) {
            case '1d':
                return state.stock.history1D;
            case '1w':
                return state.stock.history1W;
            case '1m':
                return state.stock.history1M;
            default:
                return state.stock.historyAll;
        }
    });

    const filteredData1D = useMemo(() => {
        return Array.isArray(history) ? history.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            return (now - itemDate) / (24 * 60 * 60 * 1000) < 1;
        }).reverse() : [];
    }, [history]);

    const filteredData1W = useMemo(() => {
        return Array.isArray(history) ? history.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            return (now - itemDate) / (24 * 60 * 60 * 1000) < 7;
        }).reverse() : [];
    }, [history]);

    const filteredData1M = useMemo(() => {
        return Array.isArray(history) ? history.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            return (now - itemDate) / (24 * 60 * 60 * 1000) < 30;
        }).reverse() : [];
    }, [history]);

    const filteredData3M = useMemo(() => {
        return history.historical ? history.historical.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            return (now - itemDate) / (24 * 60 * 60 * 1000) < 90;
        }).reverse() : [];
    }, [history]);

    const filteredDataYTD = useMemo(() => {
        const now = new Date();
        return history.historical ? history.historical.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === now.getFullYear();
        }).reverse() : [];
    }, [history]);

    const filteredData1Y = useMemo(() => {
        return history.historical ? history.historical.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            return (now - itemDate) / (24 * 60 * 60 * 1000) < 365;
        }).reverse() : [];
    }, [history]);

    const filteredDataAll = useMemo(() => {
        return history.historical ? history.historical.reverse() : [];
    }, [history]);


    const filteredData = useMemo(() => {
        switch (selectedRange) {
            case '1d':
                return filteredData1D;
            case '1w':
                return filteredData1W;
            case '1m':
                return filteredData1M;
            case '3m':
                return filteredData3M;
            case 'YTD':
                return filteredDataYTD;
            case '1y':
                return filteredData1Y;
            case 'all':
                return filteredDataAll;
            default:
                return [];
        }
    }, [selectedRange, filteredData1D, filteredData1W, filteredData1M, filteredData3M, filteredDataYTD, filteredData1Y, filteredDataAll]);


    const tabOptions = [
        { label: '1d', range: '1d' },
        { label: '1w', range: '1w' },
        { label: '1m', range: '1m' },
        { label: '3m', range: '3m' },
        { label: 'YTD', range: 'YTD' },
        { label: '1y', range: '1y' },
        { label: 'All', range: 'all' }
    ];

    useEffect(() => {
        const fetchStockData = () => {
            if (symbol) {
                dispatch(fetchStockDetails(symbol));
                switch (selectedRange) {
                    case '1d':
                        dispatch(fetchStockHistory1D(symbol));
                        break;
                    case '1w':
                        dispatch(fetchStockHistory1W(symbol));
                        break;
                    case '1m':
                        dispatch(fetchStockHistory1M(symbol));
                        break;
                    default:
                        dispatch(fetchStockHistoryAll(symbol));
                        break;
                }
            }
        };
        fetchStockData();
        const intervalId = setInterval(fetchStockData, 60000);

        return () => clearInterval(intervalId);
    }, [dispatch, symbol, selectedRange]);
    useEffect(() => {
        if (filteredData.length > 0) {
            const initialPriceForRange = filteredData[0].close;
            const currentPrice = filteredData[filteredData.length - 1].close;
            setInitialRangePrice(initialPriceForRange);
            setPriceDifference(currentPrice - initialPriceForRange);
        }
    }, [filteredData]);

    if (!history || history.length === 0) {
        return <div>Loading chart data...</div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!stockDetails) {
        return <div>No stock data available.</div>;
    }
    const handleTabClick = (range) => {
        setSelectedRange(range);
        switch (range) {
            case '1d':
                dispatch(fetchStockHistory1D(symbol));
                break;
            case '1w':
                dispatch(fetchStockHistory1W(symbol));
                break;
            case '1m':
                dispatch(fetchStockHistory1M(symbol));
                break;
            default:
                dispatch(fetchStockHistoryAll(symbol));
                break;
        }
    };

    const calculatePriceDifference = (newPrice) => {
        const difference = newPrice - initialRangePrice;
        const percentageChange = (difference / initialRangePrice) * 100;
        setPriceDifference({ amount: difference, percentage: percentageChange });
    };

    const handleMouseMove = (data) => {
        if (data && data.activePayload) {
            const newHoveredPrice = data.activePayload[0].value;
            setHoveredPrice(newHoveredPrice);
            calculatePriceDifference(newHoveredPrice);
        }
    };

    const handleMouseLeave = () => {
        setHoveredPrice(null);
        if (filteredData.length > 0) {
            const currentPrice = filteredData[0].close;
            calculatePriceDifference(currentPrice);
        }
    };

    const closeValues = filteredData.map(item => item.close);
    const minValue = Math.min(...closeValues);
    const maxValue = Math.max(...closeValues);
    const buffer = (maxValue - minValue) * 0.05;
    const yAxisDomain = [minValue - buffer, maxValue + buffer];
    const togglePortfolios = () => setShowPortfolios(!showPortfolios);
    const toggleWatchlists = () => setShowWatchlists(!showWatchlists);
    const addWatchlist = () => console.log("Add watchlist");
    return (
        <div className="stock-details-page">
            <div className="stock-chart-container">
                <h2 className='header'>{symbol}</h2>
                <div className='price'>${hoveredPrice ? hoveredPrice.toFixed(2) : stockDetails.price}
                    <div className={`price-difference ${priceDifference.amount > 0 ? 'positive' : priceDifference.amount < 0 ? 'negative' : ''}`}>
                        {priceDifference.amount !== undefined && priceDifference.percentage !== undefined ? (
                            `${priceDifference.amount.toFixed(2)} (${priceDifference.percentage.toFixed(2)}%)`) : ('Calculating...')}
                    </div>
                </div>
                <LineChart
                    width={600}
                    height={300}
                    data={filteredData}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="date" hide={true} />
                    <YAxis dataKey="close" hide={true} domain={yAxisDomain} />
                    <Tooltip />
                    <Line type="monotone" dataKey="close" stroke="#08BD20" dot={false} />
                </LineChart>
                <div className="tabs">
                    {tabOptions.map((option) => (
                        <button key={option.label} onClick={() => handleTabClick(option.range)}>
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="tabs-line"></div>
                <div className="market-movers-container">
                    <p className="market-movers-header">MARKET TOP / BOTTOM MOVERS</p>
                    {/* List of items representing movers */}
                </div>
            </div>
            <div className="collapsible-containers">
                <button className="collapsible-toggle" onClick={togglePortfolios}>
                    Portfolios
                </button>
                <div className={`collapsible-content ${showPortfolios ? 'show' : ''}`}>
                    {/* List of portfolios */}
                </div>
                <div className="watchlist-container">
                    <button className="collapsible-toggle" onClick={toggleWatchlists}>
                        Watchlists
                    </button>
                    <button className="add-watchlist-btn" onClick={addWatchlist}>
                        +
                    </button>
                </div>
                <div className={`collapsible-content ${showWatchlists ? 'show' : ''}`}>
                    {/* List of watchlists */}
                </div>
            </div>
        </div>

    );
};

export default StockDetails;
