import { LOAD_WATCHLISTS, ADD_WATCHLIST, ADD_STOCK_TO_WATCHLIST, REMOVE_STOCK_FROM_WATCHLIST } from "./watchlistActions";

const initialState = { watchlists: [] }

const watchlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_WATCHLISTS:
            return { ...state, watchlists: action.watchlists };
        case ADD_WATCHLIST:
            return { ...state, watchlists: [...state.watchlists, action.watchlist] };
        case ADD_STOCK_TO_WATCHLIST:
            return {
                ...state,
                watchlists: state.watchlists.map(watchlist => {
                    if (watchlist.id === action.watchlistId) {
                        return { ...watchlist, watchlist_stocks: [...watchlist.watchlist_stocks, action.stock] };
                    }
                    return watchlist;
                })
            };
        case REMOVE_STOCK_FROM_WATCHLIST:
            return {
                ...state,
                watchlists: state.watchlists.map(watchlist => {
                    if (watchlist.id === action.watchlistId) {
                        return {
                            ...watchlist,
                            watchlist_stocks: watchlist.watchlist_stocks.filter(stock => stock.stock_id !== action.stockId)
                        };
                    }
                    return watchlist;
                })
            };
        default:
            return state;
    }
};

export default watchlistReducer;
