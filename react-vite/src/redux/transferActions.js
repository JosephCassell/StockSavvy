const UPDATE_BALANCE = 'account/updateBalance';

export const updateBalance = (newBalance) => ({
  type: UPDATE_BALANCE,
  payload: newBalance
});

export const TransferMoney = (userId, amount) => async (dispatch) => {
  let response; 
  try {
    response = await fetch('/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, amount: amount })
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(updateBalance(data.new_balance));
      return data;
    } else {
      console.error('Error transferring money: Response not OK');
      return null;
    }
  } catch (error) {
    console.error('Error transferring money:', error);
    return null; 
  }
};
export const fetchInitialBalance = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/transfer/get_balance/${userId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(updateBalance(data.balance));
    } else {
      console.error('Error fetching initial balance: Response not OK');
    }
  } catch (error) {
    console.error('Error fetching initial balance:', error);
  }
};

