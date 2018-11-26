import { GET_PEERS, USER_CHANGESTATUS, OPEN_DIALOG } from '../actions/types';
const initialState = {
   allUsers: null,
   activeDialogWith: null,
   currentMessages: null
}
export function dashboard(state = initialState, action) {
  const payload = action.payload;
 switch (action.type) {
 case GET_PEERS:
  return { ...state, allUsers:  payload};
 case USER_CHANGESTATUS:
  return { ...state, allUsers:  payload };
 case OPEN_DIALOG:
  return { ...state, activeDialogWith: payload.peerId,  currentMessages: payload.messages };
 default: return state;
 }
}
