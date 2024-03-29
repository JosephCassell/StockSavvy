export const LOAD_WATCHLISTS = 'watchlist/LOAD_WATCHLISTS';
export const ADD_WATCHLIST = 'watchlist/ADD_WATCHLIST';
export const ADD_STOCK_TO_WATCHLIST = 'watchlist/ADD_STOCK_TO_WATCHLIST';
export const REMOVE_STOCK_FROM_WATCHLIST = 'watchlist/REMOVE_STOCK_FROM_WATCHLIST';

const addWatchlist = (watchlist) => ({
  type: ADD_WATCHLIST,
  watchlist,
});

const loadWatchlists = watchlists => {
    return {
        type: LOAD_WATCHLISTS,
        watchlists
    };
};

export const fetchWatchlists = userId => async dispatch => {
    const res = await fetch(`/api/watchlists/user/${userId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadWatchlists(data));
        return data;
    }
};

//Create a watchlist
export const createWatchlist = (name) => async (dispatch) => {
    const response = await fetch('/api/watchlists/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
  
    if (response.ok) {
      const newWatchlist = await response.json();
      dispatch(addWatchlist(newWatchlist));
      return newWatchlist;
    } else {
      const errors = await response.json();
      return Promise.reject(errors);
    }
  };

const addStockToWatchlistAction = (watchlistId, stock) => ({
    type: ADD_STOCK_TO_WATCHLIST,
    watchlistId,
    stock,
});

// Add a stock to a watchlist
export const addStockToWatchlist = (watchlistId, symbol) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}/stocks`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
    });

    if (response.ok) {
        const newStock = await response.json();
        dispatch(addStockToWatchlistAction(watchlistId, newStock));
        return newStock;
    } else {
        const errors = await response.json();
        return Promise.reject(errors);
    }
};

const removeStockFromWatchlistAction = (watchlistId, stockId) => ({
    type: REMOVE_STOCK_FROM_WATCHLIST,
    watchlistId,
    stockId,
});

//Sell a stock from a watchlist
export const removeStockFromWatchlist = (watchlistId, stockId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}/stocks/${stockId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(removeStockFromWatchlistAction(watchlistId, stockId));
        dispatch(fetchWatchlists(watchlistId));
        return { message: 'Stock removed from watchlist' };
    } else {
        const errors = await response.json();
        return Promise.reject(errors);
    }
};
