const UPDATE_BALANCE = 'account/updateBalance';

const initialState = { balance: 0 };

function accountReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BALANCE:
      return { ...state, balance: action.payload };
    default:
      return state;
  }
}

export default accountReducer;
