import { FETCHING_CONTACTS, FETCHING_CONTACTS_SUCCESS, FETCHING_CONTACTS_FAILURE } from './constants'
  
  export function getContacts() {
    return {
      type: FETCHING_CONTACTS
    }
  }
  
  export function getContactsSuccess(data) {
    return {
      type: FETCHING_CONTACTS_SUCCESS,
      data,
    }
  }
  
  export function getContactsFailure() {
    return {
      type: FETCHING_CONTACTS_FAILURE
    }
  }

  export function addContact() {
    return { 
        type: types.ADD_CONTACT, 
    }
    }

    export const deleteContact = (id) => {
      return {
          type: types.DELETE_CONTACT,
          id: id
      }
  }
  
  export const handleInputChange = (name, data) => {
      return { 
          type: types.HANDLE_INPUT_CHANGE,
          data: { [name]: data}
      }
  }
  