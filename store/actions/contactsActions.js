import { FETCHING_CONTACTS, FETCHING_CONTACTS_SUCCESS, FETCHING_CONTACTS_FAILURE, SEARCH_BAR, SEARCH_LIST, CLEAR_SEARCH_BAR, SELECT_CONTACT, DESELECT_CONTACT, SELECT_CHAT, DESELECT_CHAT, ADD_SELECTOR, SELECTED_CONTACTS, SELECT_IN_CONTACTS, FETCHING_CONTACT, FETCHING_CONTACT_SUCCESS, FETCHING_CONTACT_FAILURE, SAVE_MY_USERNAME, } from './constants'
import MatrixClient from '../../native/MatrixClient';  

export function getContactList() {
  return (dispatch) => {
    const promise = MatrixClient.getDirectChats()
    promise.then((data) => {
      const jsonData = JSON.parse(data)
      dispatch(getContacts())
      dispatch(getContactsSuccess(jsonData))
      console.log(jsonData)
      },
      (error) => {
      dispatch(getContactsFailure())
      console.log(error);
      }
    );
  }
}

export function getContactInfo(userID) {
  return (dispatch) => {
    const promise = MatrixClient.getUserById(userID)
    promise.then((data) => {
      const jsonData = JSON.parse(data)
      dispatch(getContact())
      dispatch(getContactSuccess(jsonData))
      console.log(jsonData)
      },
      (error) => {
      dispatch(getContactFailure())
      console.log(error);
      }
    );
  }
}

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

  export function getContact() {
    return {
      type: FETCHING_CONTACTS
    }
  }

  export function getContactSuccess(data) {
    return {
      type: FETCHING_CONTACT_SUCCESS,
      data,
    }
  }
  
  export function getContactFailure() {
    return {
      type: FETCHING_CONTACT_FAILURE
    }
  }

  export function saveMyUserName(data) {
    return {
      type: SAVE_MY_USERNAME,
      data
    }
  }

  export function addSelector() {
    return {
      type: ADD_SELECTOR,
    }
  }

  export function selectInContacts(index) {
    return{
      type: SELECT_IN_CONTACTS,
      index,
    }
  }

  export function searchBar(data) {
    return {
      type: SEARCH_BAR,
      data,
    }
  }
  
  export function changeContactList(data) {
    return {
      type: SEARCH_LIST,
      data,
    }
  }

  export function clearSearchBar() {
    return {
      type: CLEAR_SEARCH_BAR,
    }
  }

  export function selectContact(data) {
    return {
      type: SELECT_CONTACT,
      data
    }
  }

  export function deselectContact() {
    return {
      type: DESELECT_CONTACT,
    }
  }

  export function selectChat(data) {
    return {
      type: SELECT_CHAT,
      data
    }
  }

  export function deselectChat() {
    return {
      type: DESELECT_CHAT,
    }
  }

  export function selectedContacts(data) {
    return {
      type: SELECTED_CONTACTS,
      data
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
  