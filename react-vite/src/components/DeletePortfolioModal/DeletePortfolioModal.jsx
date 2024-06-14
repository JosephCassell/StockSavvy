import './DeletePortfolioModal.css'
const DeletePortfolioModal = ({ isOpen, onClose, onConfirm }) => {
    const handleModalContentClick = (e) => {
      e.stopPropagation();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="delete-portfolio-modal" onClick={onClose}>
        <div className="delete-portfolio-modal-content" onClick={handleModalContentClick}>
          <h3>Are you sure you want to delete your portfolio? This action cannot be undone.</h3>
          <div className="delete-portfolio-modal-buttons">
            <button className="delete-portfolio-modal-yes" onClick={onConfirm}>Yes (delete my portfolio)</button>
            <button className="delete-portfolio-modal-no" onClick={onClose}>No (Keep my portfolio)</button>
          </div>
        </div>
      </div>
    );
  };

export default DeletePortfolioModal;