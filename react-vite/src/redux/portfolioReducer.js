import { LOAD_PORTFOLIOS } from "./portfolioActions";

const initialState = { portfolios: null }

const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PORTFOLIOS:
            return { ...state, portfolios: action.payload };
        default:
            return state;
    }
};

export default portfolioReducer;
