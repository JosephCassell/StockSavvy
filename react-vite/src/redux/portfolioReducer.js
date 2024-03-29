import { LOAD_PORTFOLIO } from "./portfolioActions";

const initialState = { portfolio: null }

const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PORTFOLIO:
            return { ...state, portfolio: action.portfolio };
        default:
            return state;
    }
};

export default portfolioReducer;
