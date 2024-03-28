export const STOCK_DETAILS_REQUEST = 'stock/STOCK_DETAILS_REQUEST';
export const STOCK_DETAILS_SUCCESS = 'stock/STOCK_DETAILS_SUCCESS';
export const STOCK_DETAILS_FAIL = 'stock/STOCK_DETAILS_FAIL';

export const STOCK_HISTORY_ALL_REQUEST = 'stock/STOCK_HISTORY_ALL_REQUEST';
export const STOCK_HISTORY_ALL_SUCCESS = 'stock/STOCK_HISTORY_ALL_SUCCESS';
export const STOCK_HISTORY_ALL_FAIL = 'stock/STOCK_HISTORY_ALL_FAIL';

export const STOCK_HISTORY_1D_REQUEST = 'stock/STOCK_HISTORY_1D_REQUEST';
export const STOCK_HISTORY_1D_SUCCESS = 'stock/STOCK_HISTORY_1D_SUCCESS';
export const STOCK_HISTORY_1D_FAIL = 'stock/STOCK_HISTORY_1D_FAIL';

export const STOCK_HISTORY_1W_REQUEST = 'stock/STOCK_HISTORY_1W_REQUEST';
export const STOCK_HISTORY_1W_SUCCESS = 'stock/STOCK_HISTORY_1W_SUCCESS';
export const STOCK_HISTORY_1W_FAIL = 'stock/STOCK_HISTORY_1W_FAIL';

export const STOCK_HISTORY_1M_REQUEST = 'stock/STOCK_HISTORY_1M_REQUEST';
export const STOCK_HISTORY_1M_SUCCESS = 'stock/STOCK_HISTORY_1M_SUCCESS';
export const STOCK_HISTORY_1M_FAIL = 'stock/STOCK_HISTORY_1M_FAIL';

export const UPDATE_STOCKS = 'stock/updateStocks';

export const SET_OWNERSHIP = 'stock/setOwnership';

// Fetch historical data for 1d
export const fetchStockHistory1D = (symbol) => async (dispatch) => {
  try {
    dispatch({ type: STOCK_HISTORY_1D_REQUEST });
    const response = await fetch(`/stockDetails/${symbol}/history/1d`);
    const data = await response.json();
    dispatch({ type: STOCK_HISTORY_1D_SUCCESS, payload: { symbol, data } });
  } catch (error) {
    dispatch({ type: STOCK_HISTORY_1D_FAIL, payload: error.message });
  }
};

// Fetch historical data for 1w
export const fetchStockHistory1W = (symbol) => async (dispatch) => {
  try {
    dispatch({ type: STOCK_HISTORY_1W_REQUEST });
    const response = await fetch(`/stockDetails/${symbol}/history/1w`);
    const data = await response.json();
    dispatch({ type: STOCK_HISTORY_1W_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: STOCK_HISTORY_1W_FAIL, payload: error.message });
  }
};

// Fetch historical data for 1m
export const fetchStockHistory1M = (symbol) => async (dispatch) => {
  try {
    dispatch({ type: STOCK_HISTORY_1M_REQUEST });
    const response = await fetch(`/stockDetails/${symbol}/history/1m`);
    const data = await response.json();
    dispatch({ type: STOCK_HISTORY_1M_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: STOCK_HISTORY_1M_FAIL, payload: error.message });
  }
};

// Fetch name and price
export const fetchStockDetails = (symbol) => async (dispatch) => {
  try {
    dispatch({ type: STOCK_DETAILS_REQUEST });
    const response = await fetch(`/stockDetails/stocks/${symbol}`);
    const data = await response.json();
    dispatch({ type: STOCK_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: STOCK_DETAILS_FAIL, payload: error.message });
  }
};
// Fetch routes for 3M-All
export const fetchStockHistoryAll = (symbol) => async (dispatch) => {
  try {
    dispatch({ type: STOCK_HISTORY_ALL_REQUEST });
    const response = await fetch(`/stockDetails/${symbol}/history/all`);
    const data = await response.json();
    dispatch({ type: STOCK_HISTORY_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: STOCK_HISTORY_ALL_FAIL, payload: error.message });
  }
};

export const updateStocks = (stock) => ({
  type: UPDATE_STOCKS,
  payload: stock
});
// Buy a stock
export const buyStock = (symbol, quantity) => async (dispatch) => {
  try {
    const response = await fetch('/updateStocks/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, quantity })
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(updateStocks(data.stocks));
      return data;
    } else {
      const errorData = await response.json();
      console.error('Error buying stock:', errorData.error);
      return { error: errorData.error };
    }
  } catch (error) {
    console.error('Error buying stock:', error);
    return { error: 'Network error' };
  }
};

// Sell a stock
export const sellStock = (symbol, quantity) => async (dispatch) => {
  try {
    const response = await fetch('/updateStocks/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, quantity })
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(updateStocks(data.stocks));
      return data;
    } else {
      const errorData = await response.json();
      console.error('Error selling stock:', errorData.error);
      return { error: errorData.error };
    }
  } catch (error) {
    console.error('Error selling stock:', error);
    return { error: 'Network error' };
  }
};


export const setOwnership = (ownsStock) => ({
  type: SET_OWNERSHIP,
  payload: ownsStock
});

// Get current user's stock by symbol
export const checkOwnership = (symbol) => async (dispatch) => {
  try {
    const response = await fetch(`/updateStocks/user/${symbol}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setOwnership(data.owns_stock));
      return data.owns_stock;
    } else {
      console.error('Error checking ownership: Response not OK');
      return false;
    }
  } catch (error) {
    console.error('Error checking ownership:', error);
    return false;
  }
};
