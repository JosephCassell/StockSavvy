import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../redux/profileActions';
import { fetchWatchlists, createWatchlist, removeStockFromWatchlist} from '../../redux/watchlistActions';
import WatchlistModal from '../WatchListModal/WatchlistModal';
import WatchlistStockModal from '../WatchlistStockModal/WatchlistStockModal';
import StockChart from "../StockChart/StockChart";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const watchlists = useSelector((state) => state.watchlists.watchlists);
  const user = useSelector((state) => state.session.user);
  const [activeTab, setActiveTab] = useState('stocks');
  const [showModal, setShowModal] = useState(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchUserProfile());
    if (user && user.id) {
      dispatch(fetchWatchlists(user.id));
    }
  }, [dispatch, user]);

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    return Number.isInteger(number) ? `$${number}` : `$${number.toFixed(2)}`;
  };

  const totalEquity = profile.stocks.reduce((total, stock) => {
    return total + (stock.quantity * stock.current_price);
  }, 0);
  
  const handleAddStockClick = (watchlistId) => {
    setSelectedWatchlistId(watchlistId);
    setShowStockModal(true);
  };

  const totalBalance = parseFloat(profile.balance.toFixed(2)) + parseFloat(totalEquity.toFixed(2));
  console.log('watchlists', watchlists)
  return (
    <div className='profile-page'>
      <div className="profile-header">
        <h2>{user.first_name} {user.last_name}</h2>
        <div className="tabs">
          <button onClick={() => setActiveTab('stocks')} className={activeTab === 'stocks' ? 'active' : ''}>Stocks</button>
          <button onClick={() => setActiveTab('watchlist')} className={activeTab === 'watchlist' ? 'active' : ''}>Watchlists</button>
          <button onClick={() => setActiveTab('portfolio')} className={activeTab === 'portfolio' ? 'active' : ''}>Portfolios</button>
        </div>
      </div>
      <p>Cash: {formatCurrency(profile.balance)}</p>
      <p>Stocks: {formatCurrency(totalEquity)}</p>
      <p>Total Balance: {formatCurrency(totalBalance)}</p>

      {activeTab === 'stocks' && (
        <div>
          <h3>Stocks</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Average Cost</th>
                <th>Total Return</th>
                <th>Equity</th>
              </tr>
            </thead>
            <tbody>
              {profile.stocks.map((stock) => {
                const equity = stock.quantity * stock.current_price;
                const totalReturn = (stock.current_price - stock.average_cost) * stock.quantity;
                return (
                  <tr key={stock.id} onClick={() => navigate(`/stockDetails/${stock.symbol}`)}>
                    <td>{stock.name}</td>
                    <td>{stock.symbol}</td>
                    <td>{stock.quantity}</td>
                    <td>{formatCurrency(stock.current_price)}</td>
                    <td>{formatCurrency(stock.average_cost)}</td>
                    <td>{formatCurrency(totalReturn)}</td>
                    <td>{formatCurrency(equity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'watchlist' && watchlists && (
        <div>
          <h3>Watchlists <button onClick={() => setShowModal(true)}>+</button></h3>
            {watchlists?.map((watchlist) => (
              <div key={watchlist.id}>
                <h4>{watchlist.name}</h4>
                <button onClick={() => handleAddStockClick(watchlist.id)}>Add Stock</button>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Symbol</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlist.watchlist_stocks?.map((stock) => (
                      <tr key={stock.id} onClick={() => navigate(`/stockDetails/${stock.stock.symbol}`)}>
                        <td>{stock.stock.name}</td>
                        <td>{stock.stock.symbol}</td>
                        <td>{formatCurrency(stock.stock.current_price)}</td>
                        <td>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeStockFromWatchlist(watchlist.id, stock.stock_id));
                          }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      )}
      {activeTab === 'portfolio' && (
        <div>
          <h3>Portfolios</h3>
          {/* Render portfolio content here */}
        </div>
      )}
      <WatchlistModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={(name) => {
          dispatch(createWatchlist(name));
        }}
      />
      <WatchlistStockModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        watchlistId={selectedWatchlistId}
      />
  </div>
  );
};

export default Profile;
