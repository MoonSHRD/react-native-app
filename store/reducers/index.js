import { combineReducers } from 'redux';
import login from './loginReducer';
import contacts from './contactsReducer';
import appState from './appStateReducer';
import chat from './chatReducer';
import p2chat from './p2chatReducer';

const rootReducer = combineReducers({
    login,
    contacts,
    appState,
    chat,
    p2chat,
});

export default rootReducer