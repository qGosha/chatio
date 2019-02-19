import axios from 'axios';
import { DELETE_USER, CHANGE_AVATAR, ERROR, CHANGE_AVATAR_START, CHANGE_SETTINGS, CHANGE_SETTINGS_START } from './types';
import history from '../helpers/history';

export const deleteUser = () => async dispatch => {
      const res = await axios.get('/api/deleteProfile');
      if(res.data.success) {
        dispatch({type: DELETE_USER});
        history.push('/');
      }
    }

export const changeAvatar = data => async dispatch => {
  dispatch({
    type: CHANGE_AVATAR_START
  });
  try {
    const res = await axios.post('/api/profile/changeAvatar', data);
    if (!res.data.success) {
      throw(res.data.error);
    }
    dispatch({
      type: CHANGE_AVATAR,
      payload: res.data.message
    });
  } catch(e) {
    dispatch({
      payload: e,
      type: ERROR
    });
  }
}

export const changeSettings = values => async dispatch => {
  dispatch({
    type: CHANGE_SETTINGS_START
  });
  try {
    const res = await axios.post('/api/profile/changeSettings', {values});
    if (!res.data.success) {
      throw(res.data.error);
    }
    dispatch({
      type: CHANGE_SETTINGS,
      payload: res.data.message
    });
  } catch(e) {
    dispatch({
      payload: e,
      type: ERROR
    });
  }
}
