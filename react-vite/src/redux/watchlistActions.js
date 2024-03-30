export const LOAD_WATCHLISTS = 'watchlist/LOAD_WATCHLISTS'

const loadWatchlists = watchlists => {
    return {
        type: LOAD_WATCHLISTS,
        watchlists
    };
};

export const fetchWatchlists = userId => async dispatch => {
    const res = await fetch(`/api/watchlists/user/${userId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadWatchlists(data));
        return data;
    }
};
