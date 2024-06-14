import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserProfile } from '../../redux/profileActions';
import { fetchWatchlists, createWatchlist, removeStockFromWatchlist, deleteWatchlist} from '../../redux/watchlistActions';
import { fetchPortfolios, createPortfolio, deletePortfolio, deleteStockFromPortfolio, fetchTotalShares } from '../../redux/portfolioActions';
import WatchlistModal from '../WatchListModal/WatchlistModal';
import WatchlistStockModal from '../WatchlistStockModal/WatchlistStockModal';
import PortfolioModal from '../PortfolioModal/PortfolioModal';
import PortfolioStockModal from '../PortfolioStockModal/PortfolioStockModal';
import DeletePortfolioModal from '../DeletePortfolioModal/DeletePortfolioModal';
import RemoveStockModal from '../RemoveStockModal/RemoveStockModal';
import "./Profile.css";
const validTabNames = ['stocks', 'watchlist', 'portfolio'];

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const watchlists = useSelector((state) => state.watchlists.watchlists);
  const user = useSelector((state) => state.session.user);
  const portfolios = useSelector((state) => state.portfolio.portfolios);
  const [showModal, setShowModal] = useState(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [showPortfolioStockModal, setShowPortfolioStockModal] = useState(false);
  const [deleteWatchlistId, setDeleteWatchlistId] = useState(null);
  const [showDeletePortfolioModal, setShowDeletePortfolioModal] = useState(false);
  const [deletePortfolioId, setDeletePortfolioId] = useState(null);
  const [showRemoveStockModal, setShowRemoveStockModal] = useState(false); 
  const [removeStockInfo, setRemoveStockInfo] = useState({ portfolioId: null, stockId: null });
  const totalShares = useSelector((state) => state.portfolio.totalShares);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTabFromQuery = queryParams.get('tab');
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(
    validTabNames.includes(activeTabFromQuery) ? activeTabFromQuery : 'stocks'
  );
  
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    const handleModalContentClick = (e) => {
      e.stopPropagation();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="delete-watchlist-modal" onClick={onClose}>
        <div className="delete-watchlist-modal-content" onClick={handleModalContentClick}>
          <h3>Are you sure you want to delete your watchlist?</h3>
          <div className="delete-watchlist-modal-buttons">
            <button className = "delete-watchlist-modal-yes" onClick={onConfirm}>Yes (Delete my watchlist)</button>
            <button className = "delete-watchlist-modal-no" onClick={onClose}>No (Keep my watchlist)</button>
          </div>
        </div>
      </div>
    );
  };  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (validTabNames.includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('stocks');
    }
  }, [location.search]);
  
  
  useEffect(() => {
    dispatch(fetchUserProfile());
    if (user && user.id) {
      dispatch(fetchWatchlists(user.id));
      dispatch(fetchPortfolios(user.id));
      dispatch(fetchTotalShares(user.id));
    }
  }, [dispatch, user]);

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    return Number.isInteger(number) ? `$${number}` : `$${number.toFixed(2)}`;
  };
  
  const totalEquity = profile.stocks.reduce((total, stock) => {
    return total + (stock.quantity * stock.current_price);
  }, 0);
  
  const totalBalance = parseFloat(profile.balance.toFixed(2)) + parseFloat(totalEquity.toFixed(2));
  
  const handleAddStockClick = (watchlistId) => {
    setSelectedWatchlistId(watchlistId);
    setShowStockModal(true);
  };

  const handleDeleteWatchlist = () => {
    if (deleteWatchlistId) {
      dispatch(deleteWatchlist(deleteWatchlistId));
      setShowDeleteModal(false);
      setDeleteWatchlistId(null);
    }
  };
  const handleCreatePortfolio = (name) => {
    dispatch(createPortfolio(name)).then(() => {
      setShowPortfolioModal(false);
      if (user && user.id) {
        dispatch(fetchPortfolios(user.id));
      }
    });
  };

  const handleDeletePortfolio = () => {
    if (deletePortfolioId) {
      dispatch(deletePortfolio(deletePortfolioId));
      setShowDeletePortfolioModal(false);
      setDeletePortfolioId(null);
    }
  };

  const handleAddStocksToPortfolio = (portfolioId) => {
    setSelectedPortfolioId(portfolioId);
    setShowPortfolioStockModal(true);
  };

  const handleRemoveStock = () => {
    const { portfolioId, stockId } = removeStockInfo;
    if (portfolioId && stockId) {
      dispatch(deleteStockFromPortfolio(portfolioId, stockId)).then(() => {
        if (user && user.id) {
          dispatch(fetchPortfolios(user.id));
        }
        setShowRemoveStockModal(false);
        setRemoveStockInfo({ portfolioId: null, stockId: null });
      });
    }
  };
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
                <button onClick={() => {setDeleteWatchlistId(watchlist.id); setShowDeleteModal(true);}}>Delete Watchlist</button>
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
          <h3>Portfolios <button onClick={() => setShowPortfolioModal(true)}>+</button></h3>
          {portfolios && portfolios?.map((portfolio) => (
            <div key={portfolio.id}>
              <h4>{portfolio.name}</h4>
              <button onClick={() => handleAddStocksToPortfolio(portfolio.id)}>Add Stocks to Portfolio</button>
              <button onClick={() => { setDeletePortfolioId(portfolio.id); setShowDeletePortfolioModal(true); }}>Delete Portfolio</button>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {portfolio.portfolio_stocks?.map((stock) => (
                  <tr key={stock.id} onClick={() => navigate(`/stockDetails/${stock.stock.symbol}`)}>
                    <td>{stock.stock ? stock.stock.name : 'Loading...'}</td>
                    <td>{stock.stock ? stock.stock.symbol : 'Loading...'}</td>
                    <td>{stock.shares}</td>
                    <td>{formatCurrency(stock.stock ? stock.stock.current_price : 0)}</td>
                    <td>{formatCurrency(stock.average_cost)}</td>
                    <td>{formatCurrency(stock.total_return)}</td>
                    <td>{formatCurrency(stock.equity)}</td>
                    <td>
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRemoveStockInfo({ portfolioId: portfolio.id, stockId: stock.stock_id });
                            setShowRemoveStockModal(true);
                          }}
                        > Remove Stock 
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      <WatchlistModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={(name) => {
          dispatch(createWatchlist(name)).then(() => {
            setShowModal(false);
            setActiveTab('watchlist');
            if (user && user.id) {
              dispatch(fetchWatchlists(user.id));
            }
          });
        }}
      />
      <WatchlistStockModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        watchlistId={selectedWatchlistId}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteWatchlist}
      />
      <PortfolioModal
        isOpen={showPortfolioModal}
        onClose={() => setShowPortfolioModal(false)}
        onCreate={handleCreatePortfolio}
      />
      <PortfolioStockModal
        isOpen={showPortfolioStockModal}
        onClose={() => setShowPortfolioStockModal(false)}
        portfolioId={selectedPortfolioId}
        userStocks={profile.stocks}
        user={user}
        totalShares={totalShares} 
      />
      <DeletePortfolioModal
        isOpen={showDeletePortfolioModal}
        onClose={() => setShowDeletePortfolioModal(false)}
        onConfirm={handleDeletePortfolio}
      />
      <RemoveStockModal
        isOpen={showRemoveStockModal}
        onClose={() => setShowRemoveStockModal(false)}
        onConfirm={handleRemoveStock}
      />
  </div>
  );
};

export default Profile;
