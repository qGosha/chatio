import axios from 'axios';
import { GET_PEERS } from './types';

export const getPeers = () => async dispatch => {
      const res = await axios.get('/api/search/allUsers');
      if(res.data.success) {
        dispatch({
          payload: res.data.message,
          type: GET_PEERS
        });
      }
    }
