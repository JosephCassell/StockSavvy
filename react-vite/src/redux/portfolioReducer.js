import { 
    LOAD_PORTFOLIOS,
    CREATE_PORTFOLIO,
    DELETE_PORTFOLIO,
    ADD_STOCK_TO_PORTFOLIO,
    REMOVE_STOCK_FROM_PORTFOLIO,
    SET_TOTAL_SHARES
} from "./portfolioActions";

const initialState = { portfolios: [], totalShares: {}};

const portfolioReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PORTFOLIOS:
            return { ...state, portfolios: action.portfolios };
        case CREATE_PORTFOLIO:
            return { ...state, portfolios: [...state.portfolios, action.portfolio] };
        case DELETE_PORTFOLIO:
            return { ...state, portfolios: state.portfolios.filter(portfolio => portfolio.id !== action.portfolioId) };
        case ADD_STOCK_TO_PORTFOLIO:
            return {
                ...state,
                portfolios: state.portfolios.map(portfolio => {
                    if (portfolio.id === action.portfolioId) {
                        return { ...portfolio, portfolio_stocks: [...portfolio.portfolio_stocks, action.stock] };
                    }
                    return portfolio;
                })
            };
        case REMOVE_STOCK_FROM_PORTFOLIO:
            return {
                ...state,
                portfolios: state.portfolios.map(portfolio => {
                    if (portfolio.id === action.portfolioId) {
                        return { 
                            ...portfolio, 
                            portfolio_stocks: portfolio.portfolio_stocks.filter(stock => stock.id !== action.stockId) 
                        };
                    }
                    return portfolio;
                })
            };
        case SET_TOTAL_SHARES:
            return {
                ...state,
                totalShares: action.totalShares,
            };
        default:
            return state;
    }
};

export default portfolioReducer;
