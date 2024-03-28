export const LOAD_PORTFOLIO = 'portfolio/LOAD_PORTFOLIO'

const loadPortfolio = portfolio => {
    return {
        type: LOAD_PORTFOLIO,
        portfolio
    };
};

export const fetchPortfolio = userId => async dispatch => {
    const res = await fetch(`/api/portfolios/user/${userId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadPortfolio(data));
        return data;
    }
};
