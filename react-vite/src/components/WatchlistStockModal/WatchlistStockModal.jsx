import './WatchlistStockModal.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addStockToWatchlist } from '../../redux/watchlistActions';

const WatchlistStockModal = ({ isOpen, onClose, watchlistId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length > 1) {
        try {
          const response = await fetch(`/search/stocks?query=${searchQuery}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
          } else {
            console.error('Error fetching search results:', response.statusText);
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };
    handleSearch();
  }, [searchQuery]);
  
  const handleAddStock = (symbol) => {
    dispatch(addStockToWatchlist(watchlistId, symbol));
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add Stock to Watchlist</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a stock"
        />
        {searchResults.length > 0 && (
          <select onChange={(e) => handleAddStock(e.target.value)} size="5">
            {searchResults.map((stock) => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.name} ({stock.symbol})
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default WatchlistStockModal;
