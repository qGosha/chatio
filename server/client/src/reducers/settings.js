import {
  CHANGE_AVATAR_START,
  CHANGE_AVATAR,
  ERROR,
  CHANGE_SETTINGS,
  HIDE_SUCCESS_SETTINGS_UPDATE
} from "../actions/types";

const initialState = {
  isAvatarUploading: false,
  showSuccessUpdate: false,
};

export function settings(state = initialState, action) {
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
    case CHANGE_SETTINGS:
      return {
        ...state,
        showSuccessUpdate: true
      };
    case HIDE_SUCCESS_SETTINGS_UPDATE:
      return {
        ...state,
        showSuccessUpdate: false
      };
    case ERROR:
      return initialState;
    default:
      return state;
  }
}
