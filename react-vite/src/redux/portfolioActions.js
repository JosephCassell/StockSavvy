export const LOAD_PORTFOLIOS = 'portfolio/LOAD_PORTFOLIOS'

const loadPortfolios = portfolios => {
    return {
        type: LOAD_PORTFOLIOS,
        portfolios
    };
};

export const fetchReviews = userId => async dispatch => {
    const res = await fetch(`/api/portfolios/user/${userId}`);

    if (res.ok) {
        const data = await res.json();
        console.log(data)
        dispatch(loadPortfolios(data));
        return data;
    }
};
