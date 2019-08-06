import {combineReducers} from 'redux';
import contactsReducer from './contactsReducer';
import authReducer from './authReducer';

export default combineReducers({
    contacts: contactsReducer,
    auth: authReducer,
});
