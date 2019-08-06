import * as types from './constants/ActionTypes';

export function addContact() {
    return { 
        type: types.ADD_CONTACT, 
    }
    }

export function getContacts() {
    return { 
        type: types.GET_CONTACTS, 
    }
}

export const deleteContact = (id) => {
    return {
        type: types.DELETE_CONTACT,
        id: id
    }
}

export const handleInputChange = (name, value) => {
    return { 
        type: types.HANDLE_INPUT_CHANGE,
        payload: { [name]: value}
    }
}
