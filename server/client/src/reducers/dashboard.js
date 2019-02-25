import {
  GET_PEERS,
  USER_CHANGESTATUS,
  OPEN_DIALOG,
  ADD_MESSAGE,
  UPLOAD_MESSAGES_ONSCROLL,
  UPLOAD_MESSAGES_END,
  ADD_IMAGE_URL,
  LOGOUT_USER,
  CLOSE_DIALOG,
  MARK_MSG_READ,
  NEW_MSG_NOTIFICATION,
  REMOVE_NOTIFICATIONS,
  MSG_FROM_UNKNOWN,
  CREATE_NEW_CONVERSATION,
  ERROR,
  SET_SOCKET
} from "../actions/types";

const initialState = {
  socket: null,
  allUsers: null,
  iHaveDialogWith: null,
  activeDialogWith: null,
  currentMessages: [],
  haveAllMessagesBeenFetched: false,
  newMsgNotifictions: {}
};
export function dashboard(state = initialState, action) {
  const payload = action.payload;
  switch (action.type) {
    case GET_PEERS:
      const {all, iHaveDialogWith, newMsgNotifictions} = payload;
      return {
        ...state,
        allUsers: all,
        iHaveDialogWith,
        newMsgNotifictions
      };
    case USER_CHANGESTATUS:
      return {...state, allUsers: payload};
    case SET_SOCKET:
      return {...state, socket: payload};
    case OPEN_DIALOG:
      return {
        ...state,
        activeDialogWith: payload.peerId,
        currentMessages: payload.messages,
        iHaveDialogWith: payload.isNewContact
          ? [...state.iHaveDialogWith, payload.isNewContact]
          : state.iHaveDialogWith,
        haveAllMessagesBeenFetched: false
      };
    case CLOSE_DIALOG:
      return {...state, activeDialogWith: null};
    case UPLOAD_MESSAGES_ONSCROLL:
      return {
        ...state,
        currentMessages: [...state.currentMessages, ...payload.messages]
      };
    case ADD_MESSAGE:
      return {...state, currentMessages: [...state.currentMessages, payload]};
    case ADD_IMAGE_URL:
      const currentMessages = state.currentMessages.map(x => {
        if (x._id === payload._id) {
          return {...x, ...payload};
        }
        return x;
      });
      return {...state, currentMessages};
    case UPLOAD_MESSAGES_END:
      return {...state, haveAllMessagesBeenFetched: true};
    case MARK_MSG_READ:
      return {...state, currentMessages: payload};
    case MSG_FROM_UNKNOWN:
      return {
        ...state,
        iHaveDialogWith: [...state.iHaveDialogWith, payload],
        newMsgNotifictions: {...state.newMsgNotifictions, [payload]: 1}
      };
    case CREATE_NEW_CONVERSATION:
      return {...state, iHaveDialogWith: [...state.iHaveDialogWith, payload]};
    case REMOVE_NOTIFICATIONS:
      return {
        ...state,
        newMsgNotifictions: {...state.newMsgNotifictions, [payload]: undefined}
      };
    case NEW_MSG_NOTIFICATION:
      let peer = state.newMsgNotifictions[payload];
      const newValue = peer ? ++peer : 1;
      return {
        ...state,
        newMsgNotifictions: {...state.newMsgNotifictions, [payload]: newValue}
      };
    case LOGOUT_USER:
      return initialState;

    default:
      return state;
  }
}
