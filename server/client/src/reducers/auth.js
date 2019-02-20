import { FETCH_USER, LOGOUT_USER, ERROR, LOGIN_USER, CONFIRM_USER, DELETE_USER, CHANGE_AVATAR, CHANGE_SETTINGS } from '../actions/types';

export function auth(state = null, action) {
  const payload = action.payload;
 switch (action.type) {
 case FETCH_USER:
  return { user: payload, isAuthenticated: !!payload };
 case LOGOUT_USER:
  return { user: null, isAuthenticated: false };
 case  DELETE_USER:
  return { user: null, isAuthenticated: false };
 case LOGIN_USER:
  return { user: payload, isAuthenticated: true, error: false };
 case CONFIRM_USER:
   return { user: payload, isAuthenticated: true, error: false };
 case ERROR:
  return { user: null, isAuthenticated: false, fetchError: payload };
 case CHANGE_AVATAR:
  const photos = state.user.photos;
  photos.unshift(payload)
  return { ...state, user: { ...state.user, photos } };
 case CHANGE_SETTINGS:
  return { ...state,  user: payload }  
 default: return state;
 }
}
