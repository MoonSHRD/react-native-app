import * as types from '../actions/constants';
import initialState from './initialState';
 
export default function contactReducer(state = initialState.contacts, action) {
    switch(action.type) {
        case types.ADD_CONTACT: {
            return {
                ...state,
                contactList: [...state.contactList, state.newContact]
            }
        } 
        case types.HANDLE_INPUT_CHANGE: {    
            return {
                ...state, 
                newContact: {
                    ...state.newContact, ...action.payload 
                }
            }
        }
        case types.DELETE_CONTACT: {
            return {
                ...state,
                contactList: [...state.contactList, state.contactList.filter((data, i) => i !== action.id)]
            }
        }
 
        default: return state;
    }
}