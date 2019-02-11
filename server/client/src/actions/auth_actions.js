import axios from 'axios';
import { FETCH_USER, LOGOUT_USER, ERROR, LOGIN_USER } from './types';
import history from '../helpers/history';
import { SubmissionError } from 'redux-form'

export const fetchUser = () => async dispatch => {
    const user = await axios.get('/api/current_user');
    if(user) {
      dispatch({type: FETCH_USER, payload: user.data});
      history.replace('/dashboard');
    } else {
      dispatch({type: ERROR, payload: user})
    }
  }

  export const localLoginUser = values => async dispatch => {
    try {
      const res = await axios.post('/api/login', values);
      const { data } = res;
      if(data.success) {
        dispatch({type: LOGIN_USER, payload: data.message});
        history.replace('/dashboard')
      } else {
        throw Error(data.message);
      }
    } catch (err) {
      throw new SubmissionError({ _error: err });
    }
  }


export const logoutUser = () => async dispatch => {
      await axios.get('/api/logout');
      dispatch({type: LOGOUT_USER});
      history.push('/');
    }
