import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addStockForPortfolio, fetchPortfolios, fetchTotalShares} from '../../redux/portfolioActions';
import './PortfolioStockModal.css';

const PortfolioStockModal = ({ isOpen, onClose, portfolioId, userStocks, user, totalShares}) => {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isOpen) {
        dispatch(fetchTotalShares(user.id));
    }
  }, [isOpen, dispatch, user.id]);

  useEffect(() => {
      if (!isOpen) {
          setSelectedStocks([]);
      }
  }, [isOpen]);

  const handleSelectStock = (stock) => {
    const isChecked = selectedStocks.some(s => s.symbol === stock.symbol);
    if (isChecked) {
      setSelectedStocks(selectedStocks.filter(s => s.symbol !== stock.symbol));
    } else {
      const totalInPortfolios = totalShares[stock.symbol] || 0;
      const maxQuantity = Math.max(0, stock.quantity - totalInPortfolios);
      if (maxQuantity > 0) {
        setSelectedStocks([...selectedStocks, { ...stock, quantity: maxQuantity }]);
      }
    }
  };
  

  const handleInputChange = (event) => {
      event.stopPropagation();
  };

  const handleChangeQuantity = (symbol, quantity) => {
    setSelectedStocks(selectedStocks.map(stock => {
        if (stock.symbol === symbol) {
            const userStock = userStocks.find(s => s.symbol === symbol);
            const totalInPortfolios = totalShares[symbol] || 0;
            const maxQuantity = userStock ? userStock.quantity - totalInPortfolios : 0;
            const newQuantity = Math.min(quantity, maxQuantity);
            return { ...stock, quantity: newQuantity };
        }
        return stock;
    }));
  };

  const handleAddStocks = () => {
      Promise.all(selectedStocks.map(stock => {
          return dispatch(addStockForPortfolio(portfolioId, stock.symbol, stock.quantity));
      })).then(() => {
          dispatch(fetchPortfolios(user.id)).then(() => {
              onClose();
          });
      });
  };

  if (!isOpen) {
      return null;
  }
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  return (
    <div className="portfolioStock-modal" onClick={handleBackgroundClick}>
          <div className="portfolioStock-modal-content">
              <h2>Add Stocks to your Portfolio</h2>
              <div className="select-all-checkbox">
                  <label className='add-all-shares'>
                      <input
                          type="checkbox"
                          checked={selectedStocks.length === userStocks.length && selectedStocks.every((selectedStock, index) => selectedStock.quantity === userStocks[index].quantity)}
                          onChange={(e) => {
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                  setSelectedStocks(userStocks.map(stock => {
                                      const totalInPortfolios = totalShares[stock.symbol] || 0;
                                      const maxQuantity = Math.max(0, stock.quantity - totalInPortfolios);
                                      return { ...stock, quantity: maxQuantity };
                                  }));
                              } else {
                                  setSelectedStocks([]);
                              }
                          }}
                      />
                      Add All Shares to your Portfolio
                  </label>
              </div>
              <div className="stock-list">
                  {userStocks.map(stock => (
                      <div key={stock.symbol} className="stock-item" onClick={() => handleSelectStock(stock)}>
                          <input
                              type="checkbox"
                              checked={selectedStocks.some(s => s.symbol === stock.symbol)}
                              readOnly
                          />
                          {stock?.name} ({stock?.symbol})<br />
                          Quantity: <input
                              type="number"
                              min={1}
                              max={userStocks ? Math.max(0, userStocks.quantity - (totalShares[stock.symbol] || 0)) : 0}
                              value={selectedStocks.find(s => s.symbol === stock.symbol)?.quantity || ''}
                              onChange={(e) => handleChangeQuantity(stock.symbol, parseInt(e.target.value))}
                              onClick={handleInputChange}
                          />
                      </div>
                  ))}
              </div>
              <div className="add-selected-stocks">
              <button onClick={handleAddStocks} disabled={selectedStocks.length === 0 || selectedStocks.some(stock => stock.quantity === 0)}>
                  Add Selected Stocks
              </button>
              <button className="portfolioStock-close-btn" onClick={onClose}>Close</button>
              </div>
          </div>
      </div>
  );
}

export default PortfolioStockModal;

