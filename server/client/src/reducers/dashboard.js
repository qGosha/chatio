
import { GET_PEERS } from '../actions/types';
const initialState = {
   allUsers: null
}
export function dashboard(state = initialState, action) {
 switch (action.type) {
 case GET_PEERS:
  return { allUsers:  action.payload};
 default: return state;
 }
}
