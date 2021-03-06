import axios from "axios"
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
  ERROR,
  SET_SOCKET,
  OPEN_DIALOG_WITH_STRANGER,
  SORT_PEER_IDS,
  PEER_CHANGESTATUS,
  DELETE_DIALOG
} from "./types"
import history from "../helpers/history"

export const getPeers = () => async dispatch => {
  const res = await axios.get("/api/search/allUsers")
  if (res.data.success) {
    const {
      messagesForEveryContact,
      newMsgNotifictions,
      iHaveDialogWith,
      randomUsers,
      sortedPeerListForSidePanel
    } = res.data.message
    dispatch({
      payload: {
        messagesForEveryContact,
        newMsgNotifictions,
        iHaveDialogWith,
        randomUsers,
        sortedPeerListForSidePanel
      },
      type: GET_PEERS
    })
  }
}

export const userChangedStatus = data => async (dispatch, getState) => {
  const { auth } = getState()

  const { id, online } = data
  if (id === auth.user._id) {
    dispatch({
      payload: online,
      type: USER_CHANGESTATUS
    })
  } else {
    dispatch({
      payload: data,
      type: PEER_CHANGESTATUS
    })
  }
}
export const uploadMessagesOnScroll = (id, skip) => async dispatch => {
  const res = await axios.post("/api/chat/dialogs", {
    id,
    skip
  })
  if (res.data.success) {
    if (!res.data.message.length) {
      return dispatch({
        type: UPLOAD_MESSAGES_END
      })
    }
    dispatch({
      payload: {
        id,
        messages: res.data.message
      },
      type: UPLOAD_MESSAGES_ONSCROLL
    })
  }
}

export const openDialog = (id, newContact, contact) => async dispatch => {
  history.push("/dashboard/chat")
  if (newContact) {
    dispatch({
      payload: {
        peerId: id,
        newContact: contact
      },
      type: OPEN_DIALOG_WITH_STRANGER
    })
  } else {
    dispatch({
      payload: {
        peerId: id
      },
      type: OPEN_DIALOG
    })
  }
}

export const closeDialog = () => async dispatch => {
  dispatch({
    type: CLOSE_DIALOG
  })
}

export const removeConversation = id => async dispatch => {
  try {
    const res = await axios.post("/api/chat/deleteConversationForUser", { id })
    if (res.data.success) {
      dispatch({
        payload: id,
        type: DELETE_DIALOG
      })
    } else {
      throw new Error(res.data.error)
    }
  } catch (error) {
    dispatch({
      payload: error.message,
      type: ERROR
    })
  }
}

export const removeNotifications = id => async dispatch => {
  dispatch({
    payload: id,
    type: REMOVE_NOTIFICATIONS
  })
}

export const createNewConversation = id => async dispatch => {
  try {
    await axios.post("/api/chat/createNewConversation", { id })
  } catch (error) {
    dispatch({
      payload: error.message,
      type: ERROR
    })
  }
}

export const messageFromUnknown = id => async dispatch => {
  try {
    const res = await axios.post("/api/getSpecificUser", { id })
    if (res.data.success) {
      dispatch({
        payload: res.data.message,
        type: MSG_FROM_UNKNOWN
      })
    }
  } catch (error) {
    dispatch({
      payload: error.message,
      type: ERROR
    })
  }
}

export const markMsgRead = (ids, whose) => async dispatch => {
  await axios.post("/api/chat/markMsgRead", {
    ids,
    whose
  })
  dispatch({
    payload: { ids, whose },
    type: MARK_MSG_READ
  })
}

export const msgReadByPeer = (ids, whose) => async dispatch => {
  dispatch({
    payload: { ids, whose },
    type: MARK_MSG_READ
  })
}

export const newMessageForAnotherDialog = id => async dispatch => {
  dispatch({
    payload: id,
    type: NEW_MSG_NOTIFICATION
  })
}

export const addMessage = (message, activeDialogWith) => async dispatch => {
  let sender
  if (activeDialogWith && activeDialogWith === message.sender) {
    message.read = true
    const ids = [message._id]
    sender = message.sender
    const whose = activeDialogWith
    await axios.post("/api/chat/markMsgRead", {
      ids,
      whose
    })
  } else if (activeDialogWith && activeDialogWith === message.recipient) {
    sender = message.recipient
  } else {
    sender = message.sender
  }
  if (message) {
    return dispatch({
      payload: { sender, message },
      type: ADD_MESSAGE
    })
  }
}

export const sortSidePanelDialogs = () => async (dispatch, getState) => {
  const { dashboard } = getState()

  const { messagesForEveryContact, iHaveDialogWith } = dashboard
  const sorted = Object.keys(iHaveDialogWith).sort((a, b) => {
    const firstMessageA = messagesForEveryContact[a][0]
    const firstMessageB = messagesForEveryContact[b][0]
    return (
      new Date(firstMessageB && firstMessageB.timestamp) -
      new Date(firstMessageA && firstMessageA.timestamp)
    )
  })
  dispatch({
    payload: sorted,
    type: SORT_PEER_IDS
  })
}

export const addImageUrl = message => async (dispatch, getState) => {
  const { auth } = getState()
  if (message) {
    let idForUpdate =
      auth.user._id === message.sender ? message.recipient : message.sender
    dispatch({
      payload: { message, idForUpdate },
      type: ADD_IMAGE_URL
    })
  }
}

export const sendImages = data => async dispatch => {
  try {
    const res = await axios.post("/api/chat/uploadImages", data)
    if (!res.data.success) {
      throw new Error(res.data.error)
    }
  } catch (e) {
    dispatch({
      payload: e,
      type: ERROR
    })
  }
}
export const setSocket = socket => async dispatch => {
  dispatch({
    payload: socket,
    type: SET_SOCKET
  })
}
