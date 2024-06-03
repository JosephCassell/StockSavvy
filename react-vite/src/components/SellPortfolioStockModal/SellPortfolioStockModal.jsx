import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../../redux/profileActions';
import { fetchPortfoliosWithStock, fetchTotalShares } from '../../redux/portfolioActions';
import './SellPortfolioStockModal.css';

const SellPortfolioStockModal = ({ isOpen, onClose, onConfirm, initialQuantity }) => {
    const dispatch = useDispatch();
    const { symbol } = useParams();
    const user = useSelector((state) => state.session.user);
    const userStocks = useSelector((state) => state.profile.stocks);
    const portfoliosWithStock = useSelector((state) => state.portfolio.portfoliosWithStock);
    const [selectedPortfolios, setSelectedPortfolios] = useState([]);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (isOpen && user && user.id) {
            dispatch(fetchPortfoliosWithStock(user.id, symbol));
            dispatch(fetchTotalShares(user.id));
        }
    }, [isOpen, dispatch, user, symbol]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedPortfolios([]);
        }
    }, [isOpen]);

    const getStockQuantityBySymbol = (symbol) => {
        const stock = userStocks.find(stock => stock.symbol === symbol);
        return stock ? stock.quantity : 0;
    };

    const handleSelectPortfolio = (portfolioId, shares) => {
        setSelectedPortfolios(prev => {
            const existing = prev.find(p => p.portfolioId === portfolioId);
            let updatedPortfolios;

            if (existing) {
                updatedPortfolios = prev.map(p => p.portfolioId === portfolioId ? { ...p, quantity: shares } : p);
            } else {
                updatedPortfolios = [...prev, { portfolioId, quantity: shares }];
            }

            const totalSelectedQuantity = updatedPortfolios.reduce((total, p) => total + p.quantity, 0);

            if (totalSelectedQuantity > initialQuantity) {
                return prev;
            }

            return updatedPortfolios;
        });
    };

    const handleSubmit = () => {
        const totalSelectedQuantity = selectedPortfolios.reduce((total, p) => total + p.quantity, 0);
        if (totalSelectedQuantity <= initialQuantity) {
            onConfirm(selectedPortfolios);
            onClose();
        }
    };

    const totalSelectedQuantity = selectedPortfolios.reduce((total, p) => total + p.quantity, 0);
    const totalPortfolioShares = portfoliosWithStock.reduce((total, portfolio) => total + portfolio.stock.shares, 0);
    const userStockQuantity = getStockQuantityBySymbol(symbol);
    const totalUserShares = userStockQuantity - initialQuantity;
    const portfolioShares = totalPortfolioShares - totalSelectedQuantity;
    const canConfirm = totalUserShares >= portfolioShares;
    if (!isOpen) {
        return null;
    }

    return (
        <div className="sell-portfolio-stock-modal-overlay" onClick={onClose}>
            <div className="sell-portfolio-stock-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Select Portfolios with {symbol}</h2>
                <ul>
                    {portfoliosWithStock.map(portfolio => (
                        <li key={portfolio.id}>
                            <label>
                                <input
                                    type="number"
                                    value={selectedPortfolios.find(p => p.portfolioId === portfolio.id)?.quantity || 0}
                                    onChange={(e) => handleSelectPortfolio(portfolio.id, Math.max(0, Math.min(Number(e.target.value), portfolio.stock.shares, initialQuantity)))}
                                />
                                {portfolio.name} - Shares: {portfolio.stock.shares}
                            </label>
                        </li>
                    ))}
                </ul>
                <p>Total shares owned: {userStockQuantity}</p>
                <button
                    className="sell-portfolio-stock-modal-confirm"
                    onClick={handleSubmit}
                    disabled={!canConfirm}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default SellPortfolioStockModal;
