import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import stockReducer from './stockReducer';
import portfolioReducer from "./portfolioReducer";
import watchlistReducer from "./watchlistReducer";
import transferReducer from './transferReducer';
import profileReducer from "./profileReducer";
const rootReducer = combineReducers({
  session: sessionReducer,
  stock: stockReducer,
  portfolio: portfolioReducer,
  watchlists: watchlistReducer,
  account: transferReducer,
  profile: profileReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
