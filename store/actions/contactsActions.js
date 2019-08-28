import { FETCHING_CONTACTS, FETCHING_CONTACTS_SUCCESS, FETCHING_CONTACTS_FAILURE, SEARCH_BAR, SEARCH_LIST, CLEAR_SEARCH_BAR, SELECT_CONTACT, DESELECT_CONTACT, SELECT_CHAT, DESELECT_CHAT, ADD_SELECTOR, SELECTED_CONTACTS, SELECT_IN_CONTACTS} from './constants'
import MatrixClient from '../../native/MatrixClient';  

export function getContactList() {
  return (dispatch) => {
    const selector = false
    const promise = MatrixClient.getDirectChats()
    promise.then((data) => {
      const jsonData = JSON.parse(data)
      dispatch(getContacts())
      dispatch(getContactsSuccess(jsonData))
      console.log('sees')
      },
      (error) => {
      dispatch(getContactsFailure())
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
  