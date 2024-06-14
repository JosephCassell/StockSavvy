import { useState } from 'react';
import "./PortfolioModal.css";
const PortfolioModal = ({ isOpen, onClose, onCreate }) => {
    const [portfolioName, setPortfolioName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(portfolioName);
        setPortfolioName('');
    };

    if (!isOpen) return null;
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }
    return (
        <div className="portfolio-modal" onClick={handleBackgroundClick}>
            <div className="portfolio-modal-content">
                <h2>Create Portfolio</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="portfolioName">Portfolio Name:</label>
                    <input
                        type="text"
                        id="portfolioName"
                        value={portfolioName}
                        onChange={(e) => setPortfolioName(e.target.value)}
                        required
                    />
                    <div className="portfolio-modal-actions">
                        <button type="submit">Create</button>
                        <button type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PortfolioModal;
