import { 
  STOCK_DETAILS_REQUEST, 
  STOCK_DETAILS_SUCCESS, 
  STOCK_DETAILS_FAIL, 
  
  STOCK_HISTORY_ALL_REQUEST, 
  STOCK_HISTORY_ALL_SUCCESS, 
  STOCK_HISTORY_ALL_FAIL,
 
  STOCK_HISTORY_1D_REQUEST,
  STOCK_HISTORY_1D_SUCCESS,
  STOCK_HISTORY_1D_FAIL,
  
  STOCK_HISTORY_1W_REQUEST,
  STOCK_HISTORY_1W_SUCCESS,
  STOCK_HISTORY_1W_FAIL,
  
  STOCK_HISTORY_1M_REQUEST,
  STOCK_HISTORY_1M_SUCCESS,
  STOCK_HISTORY_1M_FAIL 
} from './stockActions';

const initialState = {
  stock: {},
  loadingDetails: false,
  loadingHistory: false,
  errorDetails: null,
  errorHistory: null,
  historyAll: {},
  history1D: {},
  history1W: {},
  history1M: {}
};

const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOCK_DETAILS_REQUEST:
      return { ...state, loadingDetails: true, errorDetails: null };
    case STOCK_DETAILS_SUCCESS:
      return { ...state, loadingDetails: false, stock: action.payload };
    case STOCK_DETAILS_FAIL:
      return { ...state, loadingDetails: false, errorDetails: action.payload, stock: null };
    
    case STOCK_HISTORY_ALL_REQUEST:
        return { ...state, loadingHistory: true };
    case STOCK_HISTORY_ALL_SUCCESS:
        return { ...state, loadingHistory: false, historyAll: action.payload };
    case STOCK_HISTORY_ALL_FAIL:
        return { ...state, loadingHistory: false, errorHistory: action.payload };
    
    case STOCK_HISTORY_1D_REQUEST:
      return { ...state, loadingHistory: true };
    case STOCK_HISTORY_1D_SUCCESS:
      return { ...state, loadingHistory: false, history1D: action.payload };
    case STOCK_HISTORY_1D_FAIL:
      return { ...state, loadingHistory: false, errorHistory: action.payload };
    
    case STOCK_HISTORY_1W_REQUEST:
      return { ...state, loadingHistory: true };
    case STOCK_HISTORY_1W_SUCCESS:
      return { ...state, loadingHistory: false, history1W: action.payload };
    case STOCK_HISTORY_1W_FAIL:
      return { ...state, loadingHistory: false, errorHistory: action.payload };
  
    case STOCK_HISTORY_1M_REQUEST:
      return { ...state, loadingHistory: true };
    case STOCK_HISTORY_1M_SUCCESS:
      return { ...state, loadingHistory: false, history1M: action.payload };
    case STOCK_HISTORY_1M_FAIL:
      return { ...state, loadingHistory: false, errorHistory: action.payload };
    default:
      return state;
  }
};

export default stockReducer;
