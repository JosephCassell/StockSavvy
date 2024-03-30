import { useState } from 'react';

const PortfolioModal = ({ isOpen, onClose, onCreate }) => {
    const [portfolioName, setPortfolioName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(portfolioName);
        setPortfolioName('');
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
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
                    <div className="modal-actions">
                        <button type="submit">Create</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PortfolioModal;
