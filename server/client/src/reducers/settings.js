import {
 CHANGE_AVATAR_START,
 CHANGE_AVATAR,
 ERROR
} from '../actions/types';

const initialState = {
   isAvatarUploading: false,
}

export function settings (state = initialState, action) {
 switch (action.type) {
 case CHANGE_AVATAR_START:
   return {
     ...state,
     isAvatarUploading: true
   };
 case CHANGE_AVATAR:
   return {
     ...state,
     isAvatarUploading: false
   };
 case ERROR:
  return initialState;
 default:
  return state;
}
}
