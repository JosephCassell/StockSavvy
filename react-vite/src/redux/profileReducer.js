const SET_USER_PROFILE = 'profile/setUserProfile';
const UPDATE_PROFILE_BALANCE = 'profile/updateBalance';
const initialState = {
  balance: 0,
  stocks: [],
  portfolios: []
};

function profileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        balance: action.payload.balance,
        stocks: action.payload.stocks,
        portfolios: action.payload.portfolios
      };
    case UPDATE_PROFILE_BALANCE:
      return {
        ...state,
        balance: action.payload
      };
    default:
      return state;
  }
}

export default profileReducer;
