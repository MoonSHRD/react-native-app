import { combineReducers } from 'redux';
import login from './loginReducer';
import contacts from './contactsReducer';
import appState from './appStateReducer';

const rootReducer = combineReducers({
    login,
    contacts,
    appState,
});

export default rootReducer