import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransferMoney, fetchInitialBalance } from '../../redux/transferActions';
import "./TransferModal.css";

function TransferModal({ onClose, userId, onSuccess }) {
  const [amount, setAmount] = useState(0);
  const [transferType, setTransferType] = useState('deposit');
  const balance = useSelector((state) => state.account.balance);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInitialBalance(userId));
  }, [dispatch, userId])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const transferAmount = transferType === 'deposit' ? parseFloat(amount) : -parseFloat(amount);
    const data = dispatch(TransferMoney(userId, transferAmount));
    if (data) {
      onSuccess(transferType === 'deposit' ? 'Deposit successful' : 'Withdrawal successful');
      dispatch(fetchInitialBalance(userId));
    }
    onClose();
  };

  const isAmountValid = () => {
    const num = parseFloat(amount);
    if (transferType === 'deposit') {
      return num > 0;
    } else {
      return num > 0 && num <= balance;
    }
  };

  const getButtonTitle = () => {
    if (!isAmountValid() && transferType === 'withdraw' && parseFloat(amount) > balance) {
      return 'Error: You cannot withdraw more funds than are in your account';
    }
    return '';
  };

  return (
    <div className="modal-background">
      <div className="transfer-modal-content">
      <h3>Current Balance: ${balance.toFixed(2)}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="radio"
              id="deposit"
              name="transferType"
              value="deposit"
              checked={transferType === 'deposit'}
              onChange={(e) => setTransferType(e.target.value)}
            />
            <label htmlFor="deposit">Deposit to your account</label>
          </div>
          <div>
            <input
              type="radio"
              id="withdraw"
              name="transferType"
              value="withdraw"
              checked={transferType === 'withdraw'}
              onChange={(e) => setTransferType(e.target.value)}
            />
            <label htmlFor="withdraw">Withdraw from your account</label>
          </div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />
          <button type="submit" disabled={!isAmountValid()} className={!isAmountValid() ? 'disabled' : ''} title={getButtonTitle()}>
            Transfer
          </button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default TransferModal;

