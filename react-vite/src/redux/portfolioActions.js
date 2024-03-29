export const LOAD_PORTFOLIOS = 'portfolio/LOAD_PORTFOLIO'

const loadPortfolios = portfolios => {
    return {
        type: LOAD_PORTFOLIOS,
        portfolios
    };
};

export const fetchPortfolio = userId => async dispatch => {
    const res = await fetch(`/api/portfolios/user/${userId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadPortfolios(data));
        return data;
    }
};
