import { LOAD_PORTFOLIOS } from "./portfolioActions";

const initialState = { portfolio: null }

const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PORTFOLIOS:
            return { ...state, portfolios: action.portfolios };
        default:
            return state;
    }
};

export default portfolioReducer;
