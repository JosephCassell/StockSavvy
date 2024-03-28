import { useState, useEffect } from "react";
import StockChart from "../StockChart/StockChart";
import './PortfolioWatchlistSidebar.css'

const PortfolioWatchlistSidebar = ({ portfolio, watchlists }) => {
    const [showPortfolios, setShowPortfolios] = useState(false);
    const [showWatchlists, setShowWatchlists] = useState(false);
    const [watchlistVisibility, setWatchlistVisibility] = useState({});

    useEffect(() => {
        if (Array.isArray(watchlists)) {
            const initialVisibility = watchlists.reduce((acc, watchlist) => ({
                ...acc,
                [watchlist.id]: false,
            }), {});
            setWatchlistVisibility(initialVisibility);
        }
    }, [watchlists]);

    const togglePortfolios = () => setShowPortfolios(!showPortfolios);
    const toggleWatchlists = () => setShowWatchlists(!showWatchlists);
    const toggleWatchlist = (id) => setWatchlistVisibility(prev => ({
        ...prev,
        [id]: !prev[id],
    }));
    const addWatchlist = () => console.log("Add watchlist");
    return (
        <div className="collapsible-containers">
            <button className="collapsible-toggle" onClick={togglePortfolios}>
                Portfolio
            </button>
            <div className={`collapsible-content ${showPortfolios ? 'show' : ''}`}>
                {portfolio ? (
                    <div key={portfolio.id} className='portfolio'>
                        {portfolio.portfolio_stocks && portfolio.portfolio_stocks.map(portfolioStock => (
                            <li key={portfolioStock.stock_id} className='portfolio-stock'>
                                <p className='stock-symbol'>
                                    {portfolioStock.stock.symbol}
                                </p>
                                <StockChart symbol={portfolioStock.stock.symbol} />
                                <p className='stock-price'>
                                    {portfolioStock.stock.current_price.toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </div>
                ) : <p>No portfolio available.</p>}
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
                {watchlists ? watchlists.map(watchlist => (
                    <div key={watchlist.id} className='watchlist'>
                        <button className="collapsible-toggle" onClick={() => toggleWatchlist(watchlist.id)}>
                            {watchlist.name}
                        </button>
                        <div className={`collapsible-content ${watchlistVisibility[watchlist.id] ? 'show' : ''}`}>
                            {watchlist.watchlist_stocks && watchlist.watchlist_stocks.map(watchlistStock => (
                                <li key={watchlistStock.stock_id} className='watchlist-stock'>
                                    <p className='stock-symbol'>
                                        {watchlistStock.stock.symbol}
                                    </p>
                                    <StockChart symbol={watchlistStock.stock.symbol} />
                                    <p className='stock-price'>
                                        {watchlistStock.stock.current_price.toFixed(2)}
                                    </p>
                                </li>
                            ))}
                        </div>
                    </div>
                )) : <p>No watchlists available.</p>}
            </div>
        </div>
    );
};

export default PortfolioWatchlistSidebar;
