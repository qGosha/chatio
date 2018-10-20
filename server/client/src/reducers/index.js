import { combineReducers } from 'redux';
import { auth } from './auth';
import { isLoading } from './loading';
import { reducer as form} from 'redux-form';


const rootReducer = combineReducers({ auth, form, isLoading });

export default rootReducer;
