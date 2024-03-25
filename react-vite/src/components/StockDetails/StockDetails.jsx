import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {fetchStockDetails,fetchStockHistoryAll,fetchStockHistory1D,fetchStockHistory1W,fetchStockHistory1M,} from '../../redux/stockActions';
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
      }, [dispatch, symbol, selectedRange]);
      
    
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
    };

    const handleMouseMove = (data) => {
        if (data && data.activePayload) {
            setHoveredPrice(data.activePayload[0].value);
        }
    };

    const handleMouseLeave = () => {
        setHoveredPrice(null);
    };
    const filteredData = (selectedRange === '1d' || selectedRange === '1w' || selectedRange === '1m') && Array.isArray(history)
        ? history.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            const diff = now - itemDate;
            const diffInDays = diff / (24 * 60 * 60 * 1000);

            switch (selectedRange) {
                case '1d': return diffInDays < 1;
                case '1w': return diffInDays < 7;
                case '1m': return diffInDays < 30;
                default: return true;
            }
        }).reverse()
        : Array.isArray(history.historical)
        ? history.historical.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            const diff = now - itemDate;
            const diffInDays = diff / (24 * 60 * 60 * 1000);

            switch (selectedRange) {
                case '3m': return diffInDays < 90;
                case 'YTD': return itemDate.getFullYear() === now.getFullYear();
                case '1y': return diffInDays < 365;
                default: return true;
            }
        }).reverse()
        : [];
    const closeValues = filteredData.map(item => item.close);
    const minValue = Math.min(...closeValues);
    const maxValue = Math.max(...closeValues);
    const buffer = (maxValue - minValue) * 0.05;
    const yAxisDomain = [minValue - buffer, maxValue + buffer];
    return (
       <div>
            <h2 className='header'>{symbol}</h2>
            <div className='price'>Price: ${hoveredPrice ? hoveredPrice.toFixed(2) : stockDetails.price}</div>
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
                <Line type="monotone" dataKey="close" stroke="#28a745" dot={false} />
            </LineChart>
            <div className="tabs">
                {tabOptions.map((option) => (
                    <button key={option.label} onClick={() => handleTabClick(option.range)}>
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StockDetails;
