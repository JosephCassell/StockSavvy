import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockDetails, fetchStockHistory1D } from '../../redux/stockActions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const StockChart = ({ symbol }) => {
    const dispatch = useDispatch();
    const history = useSelector((state) => state.stock.history1D[symbol]);

    const filteredData1D = useMemo(() => {
        return Array.isArray(history) ? history.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            return (now - itemDate) / (24 * 60 * 60 * 1000) < 1;
        }).reverse() : [];
    }, [history]);

    useEffect(() => {
        const fetchStockData = () => {
            if (symbol) {
                dispatch(fetchStockDetails(symbol));
                dispatch(fetchStockHistory1D(symbol));
            }
        };
        fetchStockData();
        const intervalId = setInterval(fetchStockData, 60000);

        return () => clearInterval(intervalId);
    }, [dispatch, symbol]);

    const closeValues = filteredData1D.map(item => item.close);
    const minValue = Math.min(...closeValues);
    const maxValue = Math.max(...closeValues);
    const buffer = (maxValue - minValue) * 0.05;
    const yAxisDomain = [minValue - buffer, maxValue + buffer];
    return (
        <LineChart
            width={100}
            height={50}
            data={filteredData1D}
        >
            <CartesianGrid stroke="none" />
            <XAxis dataKey="date" hide={true} />
            <YAxis dataKey="close" hide={true} domain={yAxisDomain} />
            <Line type="monotone" dataKey="close" stroke="#08BD20" dot={false} />
        </LineChart>
    );
};

export default StockChart;
