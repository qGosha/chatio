import axios from 'axios';
import { DELETE_USER } from './types';
import history from '../helpers/history';

export const deleteUser = () => async dispatch => {
      const res = await axios.get('/api/deleteProfile');
      if(res.data.success) {
        dispatch({type: DELETE_USER});
        history.push('/');
      }
    }
