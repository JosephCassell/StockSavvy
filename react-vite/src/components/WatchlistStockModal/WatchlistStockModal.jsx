import './WatchlistStockModal.css';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addStockToWatchlist } from '../../redux/watchlistActions';

const WatchlistStockModal = ({ isOpen, onClose, watchlistId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState({ visible: false, content: '' });
  const dispatch = useDispatch();
  const modalRef = useRef(); 
  
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
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setErrorMessage({ visible: false, content: '' });
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const handleAddStock = (symbol) => {
    dispatch(addStockToWatchlist(watchlistId, symbol))
        .then(() => {
            onClose();
        })
        .catch((errors) => {
            if (errors.errors.message === 'Stock already in watchlist') {
                setErrorMessage({ visible: true, content: 'Error: Stock already in watchlist' });
            }
        });
  };


  if (!isOpen) {
    return null;
  }

  
  return (
    <div className="watchlistStock-modal" ref={modalRef}>
      <div className="watchlistStock-modal-content">
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
        <button className="watchlistStock-close-btn" onClick={onClose}>Close</button>
        {errorMessage.visible && (
            <div className="overlay" onClick={() => setErrorMessage({ visible: false, content: '' })}>
                <div className="popup-message error" onClick={() => setErrorMessage({ visible: false, content: '' })}>
                    {errorMessage.content}
                    <div>(click to close)</div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistStockModal;
