import {
  GET_PEERS,
  USER_CHANGESTATUS,
  OPEN_DIALOG,
  ADD_MESSAGE,
  UPLOAD_MESSAGES_ONSCROLL,
  UPLOAD_MESSAGES_END,
  ADD_IMAGE_URL,
  LOGOUT_USER
} from '../actions/types';
const initialState = {
   allUsers: null,
   iHaveDialogWith: null,
   activeDialogWith: null,
   currentMessages: [],
   haveAllMessagesBeenFetched: false
}
export function dashboard(state = initialState, action) {
  const payload = action.payload;
 switch (action.type) {
 case GET_PEERS:
  return { ...state, allUsers:  payload.all, iHaveDialogWith: payload.iHaveDialogWith};
 case USER_CHANGESTATUS:
  return { ...state, allUsers:  payload };
 case OPEN_DIALOG:
  return {
    ...state,
    activeDialogWith: payload.peerId,
    currentMessages: payload.messages,
    iHaveDialogWith: payload.isNewContact ? [...state.iHaveDialogWith, payload.isNewContact] : state.iHaveDialogWith,
    haveAllMessagesBeenFetched: false
  };
 case UPLOAD_MESSAGES_ONSCROLL:
  return { ...state, currentMessages: [ ...state.currentMessages, ...payload.messages ] };
 case ADD_MESSAGE:
  return { ...state, currentMessages:  [ ...state.currentMessages, payload ] };
 case ADD_IMAGE_URL:
  const currentMessages = state.currentMessages.map( x => {
    if (x._id === payload._id) {
      return { ...x, ...payload }
      // x.message.text = payload.message.text;
      // x.message.image.uploaded = payload.message.image.uploaded;
    }
    return x;
  })
  return { ...state, currentMessages };
 case UPLOAD_MESSAGES_END:
  return { ...state, haveAllMessagesBeenFetched: true };
 case LOGOUT_USER:
  return initialState;  

 default: return state;
 }
}
