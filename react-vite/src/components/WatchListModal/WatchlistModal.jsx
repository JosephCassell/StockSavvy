import { useState } from 'react';
import './WatchlistModal.css';
const WatchlistModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onCreate(name);
      onClose();
    };
  
    if (!isOpen) return null;
    const handleBackgroundClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }
    
    return (
      <div className="watchlist-modal" onClick={handleBackgroundClick}>
        <div className="watchlist-modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
          <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="watchlistName">Watchlist Name:</label>
            <input type="text" id="watchlistName" name="watchlistName"value={name} onChange={(e) => setName(e.target.value)} />
          </div>
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
    );
  };
export default WatchlistModal