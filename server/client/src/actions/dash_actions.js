import axios from 'axios';
import {
  GET_PEERS,
  USER_CHANGESTATUS,
  OPEN_DIALOG,
  ADD_MESSAGE,
  UPLOAD_MESSAGES_ONSCROLL,
  UPLOAD_MESSAGES_END,
  SEND_IMAGES,
  SHOW_LOADING,
  HIDE_LOADING,
  ADD_IMAGE_URL,
  CLOSE_DIALOG,
  MARK_MSG_READ
} from './types';

export const getPeers = () => async dispatch => {
      const res = await axios.get('/api/search/allUsers');
      if(res.data.success) {
        const { allUsers, iHaveDialogWith} = res.data.message
        let all = {}
        allUsers.forEach( user => {
          all[user._id] = user
        })
        dispatch({
          payload: { all, iHaveDialogWith },
          type: GET_PEERS
        });
      }
    }

export const userChangedStatus = (data) => async (dispatch, getState) => {
  const { dashboard } = getState();
  const { auth } = getState();
  const { id, online } = data;
  console.log(id, ' : ', online);
  const allUsers = dashboard.allUsers;
  const user = allUsers && allUsers[id];
  if (!user) return;
  user.online = online;
  allUsers[id] = user;
    if(data) {
      dispatch({
        payload: allUsers,
        type: USER_CHANGESTATUS
      });
    }
  }
  export const uploadMessagesOnScroll = (id, skip) => async dispatch => {
        const res = await axios.post('/api/chat/dialogs', { id, skip });
        if(res.data.success) {
          if(!res.data.message.length) {
            return dispatch({
              type: UPLOAD_MESSAGES_END
            })
          }
          dispatch({
            payload: { messages: res.data.message },
            type: UPLOAD_MESSAGES_ONSCROLL
          });
        }
      }


  export const openDialog = (id) => async dispatch => {
        const res = await axios.post('/api/chat/openDialog', { id });
        if(res.data.success) {
          dispatch({
            payload: { peerId: id, messages: res.data.message.messages, isNewContact: res.data.message.newContactInList},
            type: OPEN_DIALOG
          });
        }
      }
   export const closeDialog = () => async dispatch => {
     dispatch({
       type: CLOSE_DIALOG
     })
   }
  export const markMsgRead = (ids, updatedMsg) => async dispatch => {
    
     dispatch({
       payload: updatedMsg,
       type: MARK_MSG_READ
     })
   }

  export const addMessage = (message) => async (dispatch, getState) => {
    const { dashboard } = getState();
    const { currentMessages } = dashboard;
    // const isDuplicate = currentMessages.some( i => i._id === message._id);
    // if (isDuplicate) {
    //   console.log('DUPLICATE');
    //   return;
    // }
        if(message) {
          dispatch({
            payload: message,
            type: ADD_MESSAGE
          });
        }
      }
  export const addImageUrl = (message) => async dispatch => {
        if(message) {

          dispatch({
            payload: message,
            type: ADD_IMAGE_URL
          });
        }
      }

  export const sendImages = (data) => async dispatch => {
     // dispatch({
     //   type: SHOW_LOADING
     // });
    const res = await axios.post('/api/chat/uploadImages', data);
    // dispatch({
    //   type: HIDE_LOADING
    // });
      if(res.data.success) {
        dispatch({
          payload: {  },
          type: SEND_IMAGES
        });
      }
    }
