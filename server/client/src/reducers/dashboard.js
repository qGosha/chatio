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
  SET_SOCKET,
  OPEN_DIALOG_WITH_STRANGER,
  SORT_PEER_IDS
} from "../actions/types";

const initialState = {
  socket: null,
  allUsers: null,
  iHaveDialogWith: {},
  sortedPeerListForSidePanel: [],
  messagesForEveryContact: {},
  activeDialogWith: null,
  haveAllMessagesBeenFetched: false,
  newMsgNotifictions: {},
  randomUsers: []
};
export function dashboard(state = initialState, action) {
  const payload = action.payload;
  switch (action.type) {
    case GET_PEERS:
      const {messagesForEveryContact, newMsgNotifictions, iHaveDialogWith, randomUsers, sortedPeerListForSidePanel} = payload;
      return {
        ...state,
        messagesForEveryContact,
        newMsgNotifictions,
        iHaveDialogWith,
        randomUsers,
        sortedPeerListForSidePanel
      };
    case USER_CHANGESTATUS:
      return {...state, allUsers: payload};
    case SET_SOCKET:
      return {...state, socket: payload};
    case OPEN_DIALOG:
      return {
        ...state,
        activeDialogWith: payload.peerId,
        haveAllMessagesBeenFetched: false
      };
    case OPEN_DIALOG_WITH_STRANGER: {
      return {
        ...state,
        activeDialogWith: payload.peerId,
        iHaveDialogWith: {
          ...state.iHaveDialogWith,
          [payload.peerId]: payload.newContact
        },
        messagesForEveryContact: {
          ...state.messagesForEveryContact,
          [payload.peerId]: []
        },
        haveAllMessagesBeenFetched: false
      };
    }
    case CLOSE_DIALOG:
      return {...state, activeDialogWith: null};
    case UPLOAD_MESSAGES_ONSCROLL:
      return {
        ...state,
        messagesForEveryContact: {
          ...state.messagesForEveryContact,
          [payload.id]: [
            ...state.messagesForEveryContact[payload.id],
            ...payload.messages
          ]
         }
      };
    case ADD_MESSAGE:
    const {sender, message} = payload;
    const doesExist = state.messagesForEveryContact[sender];
      return {...state, messagesForEveryContact: {
        ...state.messagesForEveryContact,
        [sender]: doesExist && doesExist.length ?
        [
          ...state.messagesForEveryContact[sender],
          message
        ] : [message]
      }};
    case SORT_PEER_IDS:
      return {...state, sortedPeerListForSidePanel: payload};
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
      return {...state, messagesForEveryContact: {
        ...state.messagesForEveryContact,
        [payload.whose]: payload.updatedMsg
      }};
    case MSG_FROM_UNKNOWN:
      return {
        ...state,
        iHaveDialogWith: {
        ...state.iHaveDialogWith,
        [payload._id]: payload
        },
        newMsgNotifictions: {...state.newMsgNotifictions, [payload._id]: 1}
      };
    // case CREATE_NEW_CONVERSATION:
    //   return {...state, iHaveDialogWith: [...state.iHaveDialogWith, [payload._id]: payload]};
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
