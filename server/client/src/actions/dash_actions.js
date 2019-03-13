import axios from "axios";
import {
  GET_PEERS,
  USER_CHANGESTATUS,
  OPEN_DIALOG,
  ADD_MESSAGE,
  UPLOAD_MESSAGES_ONSCROLL,
  UPLOAD_MESSAGES_END,
  ADD_IMAGE_URL,
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
} from "./types";
import history from "../helpers/history";

export const getPeers = () => async dispatch => {
  const res = await axios.get("/api/search/allUsers");
  if (res.data.success) {
    const {messagesForEveryContact, newMsgNotifictions, iHaveDialogWith, randomUsers, sortedPeerListForSidePanel} = res.data.message;
    dispatch({
      payload: {
        messagesForEveryContact,
        newMsgNotifictions,
        iHaveDialogWith,
        randomUsers,
        sortedPeerListForSidePanel
      },
      type: GET_PEERS
    });
  }
};

export const userChangedStatus = data => async (dispatch, getState) => {
  const {dashboard} = getState();

  const {id, online} = data;
  const allUsers = dashboard.allUsers;
  const user = allUsers && allUsers[id];
  if (!user) return;
  user.online = online;
  allUsers[id] = user;
  if (data) {
    dispatch({
      payload: allUsers,
      type: USER_CHANGESTATUS
    });
  }
};
export const uploadMessagesOnScroll = (id, skip) => async dispatch => {
  const res = await axios.post("/api/chat/dialogs", {
    id,
    skip
  });
  if (res.data.success) {
    if (!res.data.message.length) {
      return dispatch({
        type: UPLOAD_MESSAGES_END
      });
    }
    dispatch({
      payload: {
        id,
        messages: res.data.message
      },
      type: UPLOAD_MESSAGES_ONSCROLL
    });
  }
};

export const openDialog = (id, newContact, contact) => async dispatch => {
  if (newContact) {
    // const res = await axios.post("/api/chat/openDialog", {
    //   id
    // });
      dispatch({
        payload: {
          peerId: id,
          newContact: contact
        },
        type: OPEN_DIALOG_WITH_STRANGER
      });
  } else {
    dispatch({
      payload: {
        peerId: id
      },
      type: OPEN_DIALOG
    });
  }

  if (window.location.pathname !== "/dashboard") {
    history.push("/dashboard");
  }
};

export const closeDialog = () => async dispatch => {
  dispatch({
    type: CLOSE_DIALOG
  });
};

export const removeNotifications = id => async dispatch => {
  dispatch({
    payload: id,
    type: REMOVE_NOTIFICATIONS
  });
};

export const createNewConversation = id => async dispatch => {
  try {
    const res = await axios.post("/api/chat/createNewConversation", {id});
    if (res.data.success) {
      // dispatch({
      //   payload: res.data.message,
      //   type: CREATE_NEW_CONVERSATION
      // });
    } else {
      throw new Error(res.data.error);
    }
  } catch (error) {
    dispatch({
      payload: error.message,
      type: ERROR
    });
  }

};

export const messageFromUnknown = id => async dispatch => {
  try {
    const res = await axios.post('/api/getSpecificUser', { id });
    if (res.data.success) {
      dispatch({
        payload: res.data.message,
        type: MSG_FROM_UNKNOWN
      });
    }
  } catch (error) {
    dispatch({
      payload: error.message,
      type: ERROR
    });
  }

};

export const markMsgRead = (
  ids,
  updatedMsg,
  activeDialogWith
) => async dispatch => {
  await axios.post("/api/chat/markMsgRead", {
    ids,
    activeDialogWith
  });
  dispatch({
    payload: updatedMsg,
    type: MARK_MSG_READ
  });
};

export const msgReadByPeer = (updatedMsg, whose) => async dispatch => {
  dispatch({
    payload: {updatedMsg, whose},
    type: MARK_MSG_READ
  });
};

export const newMessageForAnotherDialog = id => async dispatch => {
  dispatch({
    payload: id,
    type: NEW_MSG_NOTIFICATION
  });
};

export const addMessage = (message, activeDialogWith) => async (dispatch, getState) => {
  let sender;
  if (activeDialogWith && activeDialogWith === message.sender) {
    message.read = true;
    const ids = [message._id];
    await axios.post("/api/chat/markMsgRead", {
      ids,
      activeDialogWith
    });
    sender = message.sender;
  } else if (activeDialogWith && activeDialogWith === message.recipient) {
    sender = message.recipient;
  } else  {
    sender = message.sender;
  }
  if (message) {
    dispatch({
      payload: {sender, message},
      type: ADD_MESSAGE
    });
  }
};

export const sortSidePanelDialogs = (iHaveDialogWith, messagesForEveryContact) => async dispatch => {
  // const { iHaveDialogWith, messagesForEveryContact } = props;
  const sorted = Object.keys(iHaveDialogWith).sort( (a, b) => {
      const lengthA = messagesForEveryContact[a].length;
      const lengthB = messagesForEveryContact[b].length;
      const firstMessageA = messagesForEveryContact[a][lengthA-1];
      const firstMessageB = messagesForEveryContact[b][lengthB-1];
      return new Date(firstMessageB && firstMessageB.timestamp) - new Date(firstMessageA && firstMessageA.timestamp);
    });
    dispatch({
      payload: sorted,
      type: SORT_PEER_IDS
    });
}

export const addImageUrl = message => async dispatch => {
  if (message) {
    dispatch({
      payload: message,
      type: ADD_IMAGE_URL
    });
  }
};

export const sendImages = data => async dispatch => {
  try {
    const res = await axios.post("/api/chat/uploadImages", data);
    if (!res.data.success) {
      throw new Error(res.data.error);
    }
  } catch (e) {
    dispatch({
      payload: e,
      type: ERROR
    });
  }
};
export const setSocket = socket => async dispatch => {
  dispatch({
    payload: socket,
    type: SET_SOCKET
  });
};
