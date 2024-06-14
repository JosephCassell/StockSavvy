export const LOAD_PORTFOLIOS = 'portfolio/LOAD_PORTFOLIOS';
export const CREATE_PORTFOLIO = 'portfolio/CREATE_PORTFOLIO';
export const DELETE_PORTFOLIO = 'portfolio/DELETE_PORTFOLIO';
export const ADD_STOCK_TO_PORTFOLIO = 'portfolio/ADD_STOCK_TO_PORTFOLIO';
export const REMOVE_STOCK_FROM_PORTFOLIO = 'portfolio/REMOVE_STOCK_FROM_PORTFOLIO';
export const SET_TOTAL_SHARES = 'portfolio/SET_TOTAL_SHARES';
export const LOAD_PORTFOLIOS_WITH_STOCK = 'portfolio/LOAD_PORTFOLIOS_WITH_STOCK';
export const UPDATE_STOCK_IN_PORTFOLIO = 'portfolio/UPDATE_STOCK_IN_PORTFOLIO';

const updateStockInPortfolio = (portfolioId, stock) => ({
    type: UPDATE_STOCK_IN_PORTFOLIO,
    portfolioId,
    stock,
});

const loadPortfolios = (portfolios) => {
    return {
        type: LOAD_PORTFOLIOS,
        portfolios
    };
};
const loadPortfoliosWithStock = (portfolios) => {
    return {
        type: LOAD_PORTFOLIOS_WITH_STOCK,
        portfolios
    };
};

// Get Portfolios
export const fetchPortfolios = (userId) => async (dispatch) => {
    try {
        const res = await fetch(`/api/portfolios/user/${userId}`);

        if (res.ok) {
            const data = await res.json();
            dispatch(loadPortfolios(data));
            return data;
        } else {
            const error = await res.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error fetching portfolios:', error);
    }
};
const addPortfolio = (portfolio) => ({
    type: CREATE_PORTFOLIO,
    portfolio,
});
// Create portfolios
export const createPortfolio = (name) => async (dispatch) => {
    try {
        const response = await fetch('/api/portfolios/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        if (response.ok) {
            const newPortfolio = await response.json();
            dispatch(addPortfolio(newPortfolio));
            return newPortfolio;
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error creating portfolio:', error);
    }
};
const removePortfolio = (portfolioId) => ({
    type: DELETE_PORTFOLIO,
    portfolioId,
});
// Remove Portfolio
export const deletePortfolio = (portfolioId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/portfolios/${portfolioId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            dispatch(removePortfolio(portfolioId));
            return { message: 'Portfolio deleted successfully' };
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error deleting portfolio:', error);
    }
};
const addStockToPortfolio = (portfolioId, stock) => ({
    type: ADD_STOCK_TO_PORTFOLIO,
    portfolioId,
    stock,
});
// Add stock to portfolio
export const addStockForPortfolio = (portfolioId, symbol, quantity) => async (dispatch) => {
    try {
        const response = await fetch(`/api/portfolio_stocks/${portfolioId}/${symbol}/${quantity}`, {
            method: 'POST',
        });

        if (response.ok) {
            const newStock = await response.json();
            dispatch(addStockToPortfolio(portfolioId, newStock));
            return newStock;
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error adding stock to portfolio:', error);
    }
};

const removeStockFromPortfolio = (portfolioId, stockId) => ({
    type: REMOVE_STOCK_FROM_PORTFOLIO,
    portfolioId,
    stockId,
});
// Delete stock from portfolio
export const deleteStockFromPortfolio = (portfolioId, stockId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/portfolio_stocks/${portfolioId}/${stockId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            dispatch(removeStockFromPortfolio(portfolioId, stockId));
            return { message: 'Stock removed from portfolio successfully' };
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error removing stock from portfolio:', error);
    }
};
const setTotalShares = (totalShares) => ({
    type: SET_TOTAL_SHARES,
    totalShares,
});
// Get all shares from a portfolio
export const fetchTotalShares = (userId) => async (dispatch) => {
    const response = await fetch(`/api/portfolios/user/${userId}/total-shares`);
    if (response.ok) {
        const totalShares = await response.json();
        dispatch(setTotalShares(totalShares));
        return totalShares;
    } else {
        const errors = await response.json();
        console.error(errors);
    }
};
// Get all portfolios by a stock
export const fetchPortfoliosWithStock = (userId, stockSymbol) => async (dispatch) => {
    try {
        const res = await fetch(`/api/portfolios/user/${userId}/stock/${stockSymbol}`);

        if (res.ok) {
            const data = await res.json();
            dispatch(loadPortfoliosWithStock(data));
            return data;
        } else {
            const error = await res.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error fetching portfolios with stock:', error);
    }
};

// Update stock quantity in portfolio
export const updateStockForPortfolio = (portfolioId, stockId, quantity) => async (dispatch) => {
    console.log("stockId", stockId)
    const response = await fetch(`/api/portfolio_stocks/${portfolioId}/${stockId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
    });

    if (response.ok) {
        const updatedStock = await response.json();
        dispatch(updateStockInPortfolio(portfolioId, updatedStock));
        return updatedStock;
    } else {
        const text = await response.text();
        console.error('Error response text:', text);
        throw new Error('Failed to update stock in portfolio');
    }
};

