import {
 CHANGE_AVATAR_START,
 CHANGE_AVATAR,
 CHANGE_SETTINGS_START,
 CHANGE_SETTINGS,
 ERROR
} from '../actions/types';

const initialState = {
   isAvatarUploading: false,
   isSettingsUploading: false
}

export function settings (state = initialState, action) {
  const payload = action.payload;
 switch (action.type) {
 case CHANGE_AVATAR_START:
   return {
     ...state,
     isAvatarUploading: true
   };
 case CHANGE_SETTINGS_START:
   return {
     ...state,
     isSettingsUploading: true
   };
 case CHANGE_AVATAR:
   return {
     ...state,
     isAvatarUploading: false
   };
 case CHANGE_SETTINGS:
   return {
     ...state,
     isSettingsUploading: false
   };
 case ERROR:
  return initialState;
 default:
  return state;
}
}
