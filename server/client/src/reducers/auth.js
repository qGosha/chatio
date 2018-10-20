import { FETCH_USER, LOGOUT_USER, ERROR, LOGIN_USER, CONFIRM_USER } from '../actions/types';

export function auth(state = null, action) {
 switch (action.type) {
 case FETCH_USER:
  return { user: action.payload, isAuthenticated: !!action.payload };
 case LOGOUT_USER:
  return { user: null, isAuthenticated: false };
 case LOGIN_USER:
  return { user: action.payload, isAuthenticated: true, error: false };
 case CONFIRM_USER:
   return { user: action.payload, isAuthenticated: true, error: false };
 case ERROR:
  return { user: null, isAuthenticated: false, fetchError: action.payload };
 default: return state;
 }
}
