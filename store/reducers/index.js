import { combineReducers } from 'redux';
import login from './loginReducer';
import contacts from './contactsReducer';

const rootReducer = combineReducers({
    login,
    contacts,
});

export default rootReducer