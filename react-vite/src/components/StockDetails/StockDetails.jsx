import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchStockHistoryAll, fetchStockDetails, fetchStockHistory1D, fetchStockHistory1W, fetchStockHistory1M, buyStock, sellStock, checkOwnership } from '../../redux/stockActions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchTotalShares, updateStockForPortfolio, fetchPortfoliosWithStock } from '../../redux/portfolioActions';
import SellPortfolioStockModal from '../SellPortfolioStockModal/SellPortfolioStockModal';
import './StockDetails.css';

const StockDetails = () => {
    const dispatch = useDispatch();
    const { symbol } = useParams();
    const stockDetails = useSelector((state) => state.stock.stock);
    const user = useSelector((state) => state.session.user);
    const userOwnsStock = useSelector((state) => state.stock.ownsStock);
    const portfoliosWithStock = useSelector((state) => state.portfolio.portfoliosWithStock);
    const [popupMessage, setPopupMessage] = useState({ visible: false, content: '' });
    const [errorMessage, setErrorMessage] = useState({ visible: false, content: '' });
    const [hoveredPrice, setHoveredPrice] = useState(null);
    const [selectedRange, setSelectedRange] = useState('all');
    const [initialRangePrice, setInitialRangePrice] = useState(0);
    const [priceDifference, setPriceDifference] = useState({ amount: 0, percentage: 0 });
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalUserShares, setTotalUserShares] = useState(0);

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
        const symbolHistory = history[symbol] || [];
        return Array.isArray(symbolHistory) ? symbolHistory.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            return (now - itemDate) / (24 * 60 * 60 * 1000) < 1;
        }).reverse() : [];
    }, [history, symbol]);

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
        if (filteredData.length > 1) {
            const initialPriceForRange = filteredData[0].close;
            const currentPrice = filteredData[filteredData.length - 1].close;
            setInitialRangePrice(initialPriceForRange);
            const difference = currentPrice - initialPriceForRange;
            const percentageChange = (difference / initialPriceForRange) * 100;
            setPriceDifference({ amount: difference, percentage: percentageChange });
        }
    }, [filteredData]);

    useEffect(() => {
        if (symbol && user) {
            dispatch(checkOwnership(symbol));
            dispatch(fetchTotalShares(user.id));
            dispatch(fetchPortfoliosWithStock(user.id, symbol));
        }
    }, [dispatch, symbol, user]);

    useEffect(() => {
        const buySuccessMessage = localStorage.getItem('buySuccessMessage');
        const sellSuccessMessage = localStorage.getItem('sellSuccessMessage');
        if (buySuccessMessage) {
            setPopupMessage({ visible: true, content: buySuccessMessage });
            localStorage.removeItem('buySuccessMessage');
        } else if (sellSuccessMessage) {
            setPopupMessage({ visible: true, content: sellSuccessMessage });
            localStorage.removeItem('sellSuccessMessage');
        }
    }, []);

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
            const initialPriceForRange = filteredData[0].close;
            const finalPriceForRange = filteredData[filteredData.length - 1].close;
            setPriceDifference({
                amount: finalPriceForRange - initialPriceForRange,
                percentage: ((finalPriceForRange - initialPriceForRange) / initialPriceForRange) * 100,
            });
        }
    };

    const handleBuy = async () => {
        const response = await dispatch(buyStock(symbol, quantity));
        if (response && response.error) {
            setErrorMessage({ visible: true, content: response.error });
        } else if (response && response.message === 'Stock purchased successfully') {
            localStorage.setItem('buySuccessMessage', 'Purchase successful');
            window.location.reload();
        }
    };
    const handleSell = async () => {
        if (portfoliosWithStock.length > 0) {
            setIsModalOpen(true);
        } else {
            const response = await dispatch(sellStock(symbol, quantity));
            if (response && response.error) {
                setErrorMessage({ visible: true, content: response.error });
            } else if (response && response.message === 'Stock sold successfully') {
                localStorage.setItem('sellSuccessMessage', 'Sale successful');
                window.location.reload();
            }
        }
    };
    const handleConfirmSell = async (selectedPortfolios) => {
        const totalSellQuantity = selectedPortfolios.reduce((total, { quantity }) => total + quantity, 0);

        if (totalSellQuantity > quantity) {
            setErrorMessage({ visible: true, content: 'You cannot sell more shares than the quantity you have inputted.' });
            return;
        }

        const portfolioPromises = selectedPortfolios.map(({ portfolioId, quantity }) => {
            return dispatch(updateStockForPortfolio(portfolioId, portfoliosWithStock[0]?.stock.id, quantity));
        });

        Promise.all(portfolioPromises)
            .then(() => {
                return dispatch(sellStock(symbol, quantity));
            })
            .then((response) => {
                if (response && response.error) {
                    setErrorMessage({ visible: true, content: response.error });
                } else if (response && response.message === 'Stock sold successfully') {
                    localStorage.setItem('sellSuccessMessage', 'Sale successful');
                    window.location.reload();
                }
            })
            .catch((error) => {
                setErrorMessage({ visible: true, content: error.message });
            });
    };
    
    const closePopup = () => {
        setPopupMessage({ visible: false, content: '' });
    };

    const closeValues = filteredData.map(item => item.close);
    const minValue = Math.min(...closeValues);
    const maxValue = Math.max(...closeValues);
    const buffer = (maxValue - minValue) * 0.05;
    const yAxisDomain = [minValue - buffer, maxValue + buffer];

    return (
        <div className="stock-details-page">
            <div className="stock-chart-container">
                <h2 className='header'>{symbol}</h2>
                <div className='price'>${hoveredPrice ? hoveredPrice.toFixed(2) : Number(stockDetails.price).toFixed(2)}
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
                <div className="stock-info-container">
                    <p><strong>Market Cap: </strong> ${stockDetails.marketCap}</p>
                    <p><strong>CEO:</strong> {stockDetails.ceo}</p>
                    <p><strong>Sector:</strong> {stockDetails.sector}</p>
                    <p><strong>Address:</strong> {stockDetails.address}</p>
                    <p><strong>Exchange:</strong> {stockDetails.exchange}</p>
                    <p><strong>Description:</strong> {stockDetails.description}</p>
                </div>
            </div>
            <div className="stock-trade-container">
                <h3>Trade {symbol}</h3>
                <div>
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min={1}
                    />
                </div>
                <button onClick={handleBuy}>Buy</button>
                {userOwnsStock && <button onClick={handleSell}>Sell</button>}
            </div>
            <SellPortfolioStockModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSell}
                stockSymbol={symbol}
                totalUserShares={totalUserShares}
                initialQuantity={quantity}
            />
            {popupMessage.visible && (
                <div className="overlay" onClick={closePopup}>
                    <div className="popup-message" onClick={closePopup}>
                        {popupMessage.content}
                        <div>(click to close)</div>
                    </div>
                </div>
            )}
            {errorMessage.visible && (
                <div className="overlay" onClick={() => setErrorMessage({ visible: false, content: '' })}>
                    <div className="popup-message error" onClick={closePopup}>
                        {errorMessage.content}
                        <div>(click to close)</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockDetails;
