import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  START_LOADING,
  STOP_LOADING,
  SIGN_OUT,
  USER_LOADED_SUCCESS,
} from './authTypes';
import { initialState } from '../auth';

const reducer = (state, action) => {
  switch (action.type) {
    case SIGN_OUT:
      return { ...action.payload };
    case LOGIN_SUCCESS:
      return { ...state, user: action.payload };
    case LOGIN_FAIL:
      return { ...initialState };
    case USER_LOADED_SUCCESS: {
      return { ...state, userData: action.payload };
    }
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };

    default:
      return { state };
  }
};

export default reducer;
