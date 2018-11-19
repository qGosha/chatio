import { combineReducers } from 'redux';
import { auth } from './auth';
import { dashboard } from './dashboard';
import { isLoading } from './loading';
import { reducer as form} from 'redux-form';


const rootReducer = combineReducers({ auth, form, isLoading,dashboard });

export default rootReducer;
