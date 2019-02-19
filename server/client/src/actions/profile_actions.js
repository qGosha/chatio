import axios from 'axios';
import { DELETE_USER, CHANGE_AVATAR, ERROR } from './types';
import history from '../helpers/history';

export const deleteUser = () => async dispatch => {
      const res = await axios.get('/api/deleteProfile');
      if(res.data.success) {
        dispatch({type: DELETE_USER});
        history.push('/');
      }
    }

export const changeAvatar = data => async dispatch => {
  try {
    const res = await axios.post('/api/profile/changeAvatar', data);
    if (!res.data.success) {
      throw new Error(res.data.error);
    }
    dispatch({
      type: CHANGE_AVATAR,
      payload: res.message
    });
  } catch(e) {
    dispatch({
      payload: e,
      type: ERROR
    });
  }
}
