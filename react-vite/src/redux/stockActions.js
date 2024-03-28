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
