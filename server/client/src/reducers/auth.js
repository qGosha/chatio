import { FETCH_USER, LOGOUT_USER, ERROR, LOGIN_USER, CONFIRM_USER, DELETE_USER, CHANGE_AVATAR } from '../actions/types';

export function auth(state = null, action) {
 switch (action.type) {
 case FETCH_USER:
  return { user: action.payload, isAuthenticated: !!action.payload };
 case LOGOUT_USER:
  return { user: null, isAuthenticated: false };
 case  DELETE_USER:
  return { user: null, isAuthenticated: false };
 case LOGIN_USER:
  return { user: action.payload, isAuthenticated: true, error: false };
 case CONFIRM_USER:
   return { user: action.payload, isAuthenticated: true, error: false };
 case ERROR:
  return { user: null, isAuthenticated: false, fetchError: action.payload };
 case CHANGE_AVATAR:
  const photos = state.user.photos;
  photos.unshift(action.payload)
  return { ...state, user: { ...state.user, photos } };
 default: return state;
 }
}
