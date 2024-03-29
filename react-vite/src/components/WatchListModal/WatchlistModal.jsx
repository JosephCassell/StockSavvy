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
  
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <form onSubmit={handleSubmit}>
            <label>
              Watchlist Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    );
  };
export default WatchlistModal