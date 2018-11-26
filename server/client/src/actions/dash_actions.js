import axios from 'axios';
import { GET_PEERS, USER_CHANGESTATUS, OPEN_DIALOG } from './types';

export const getPeers = () => async dispatch => {
      const res = await axios.get('/api/search/allUsers');
      if(res.data.success) {
        dispatch({
          payload: res.data.message,
          type: GET_PEERS
        });
      }
    }

export const userChangedStatus = (data) => async (dispatch, getState) => {
  const { dashboard } = getState();
  const { id, online } = data;
  const allUsers = dashboard && dashboard.allUsers && dashboard.allUsers.map( user => {
    if(user._id === id) {
      user.online = online
    }
    return user;
  })
    if(data) {
      dispatch({
        payload: allUsers,
        type: USER_CHANGESTATUS
      });
    }
  }


  export const openDialog = (id) => async dispatch => {
        const res = await axios.post('/api/chat/dialogs', { id });
        if(res.data.success) {
          dispatch({
            payload: { peerId: id, messages: res.data.message },
            type: OPEN_DIALOG
          });
        }
      }
