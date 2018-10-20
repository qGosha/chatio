import { SHOW_LOADING, HIDE_LOADING, FETCH_USER } from '../actions/types';

export function isLoading(state = false, action) {
 switch (action.type) {
 case FETCH_USER:
  return false;
 case SHOW_LOADING:
  return true;
 case HIDE_LOADING:
  return false;
 default: return state;
 }
}
