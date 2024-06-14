import './RemoveStockModal.css'
const RemoveStockModal = ({ isOpen, onClose, onConfirm }) => {
    const handleModalContentClick = (e) => {
      e.stopPropagation();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="remove-stock-modal" onClick={onClose}>
        <div className="remove-stock-modal-content" onClick={handleModalContentClick}>
          <h3>Are you sure you want to remove this stock from your portfolio?</h3>
          <div className="remove-stock-modal-buttons">
            <button className="remove-stock-modal-yes" onClick={onConfirm}>Yes (Remove the Stock)</button>
            <button className="remove-stock-modal-no" onClick={onClose}>No (Keep the Stock)</button>
          </div>
        </div>
      </div>
    );
  };
export default RemoveStockModal;