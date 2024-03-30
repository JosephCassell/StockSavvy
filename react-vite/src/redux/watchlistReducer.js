import { LOAD_WATCHLISTS } from "./watchlistActions";

const initialState = { portfolios: null }

const watchlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_WATCHLISTS:
            return { ...state, watchlists: action.watchlists }
        default:
            return state
    }
};

export default watchlistReducer;
