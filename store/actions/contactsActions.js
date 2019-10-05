import { FETCHING_CONTACTS, FETCHING_CONTACTS_SUCCESS, FETCHING_CONTACTS_FAILURE, SEARCH_BAR, SEARCH_LIST, CLEAR_SEARCH_BAR, SELECT_CONTACT, DESELECT_CONTACT, SELECT_CHAT, DESELECT_CHAT, ADD_SELECTOR, SELECTED_CONTACTS, SELECT_IN_CONTACTS, FETCHING_CONTACT, FETCHING_CONTACT_SUCCESS, FETCHING_CONTACT_FAILURE, SAVE_MY_USERNAME, SAVE_MY_USER_ID, SET_MY_PROFILE, FETCHING_MATCHED_CONTACTS_SUCCESS } from './constants'
import MatrixClient from '../../native/MatrixClient';  
import P2Chat from '../../native/P2Chat';  

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
      console.log(data)
      dispatch(getContact())
      dispatch(getContactSuccess(jsonData))
      console.log(jsonData)
      },
      (error) => {
      console.log(error);
      }
    );
  }
}

export function getMyUserId() {
  return (dispatch) => {
    const promise = MatrixClient.getMyMxId()
    promise.then((data) => {
      var userName = data.substring(0, data.indexOf(":matrix.moonshard.tech"));       
      var parsedName = userName.substring(1,)
      dispatch(saveMyUserID(data))
      dispatch(saveMyUserName(parsedName))
      console.log(data)
      },
      (error) => {
      console.log(error);
      }
    );
  }
}

export function getMyUserProfile() {
  return (dispatch) => {
    const promise = MatrixClient.getMyProfile()
    promise.then((data) => {
      const jsonData = JSON.parse(data)
      dispatch(saveMyProfile(jsonData))
      console.log(jsonData)
      },
      (error) => {
      console.log(error);
      });
  }
}

export function saveNewUserName(newName) {
  return (dispatch) => {
    const promise = MatrixClient.updateDisplayName(newName)
    promise.then((data) => {
      dispatch(getMyUserId())
      dispatch(getMyUserProfile())
      console.log(data)
      },
      (error) => {
      console.log(error);
      });
  }
}

export function saveNewAvatar(newAvatar) {
  return (dispatch) => {
    const promise = MatrixClient.updateAvatar(newAvatar)
    promise.then((data) => {
      dispatch(getMyUserId())
      dispatch(getMyUserProfile())
      console.log(data)
      },
      (error) => {
      console.log(error);
      });
  }
}

export function searchUserById(data) {
  return (dispatch) => {
    const promise = MatrixClient.searchUserById(data, 1)
    promise.then((data) => {
      const jsonData = JSON.parse(data)
      dispatch(changeContactList(jsonData))
      console.log(jsonData)
      },
      (error) => {
      console.log(error);
      }
    );
  }
}

export function createDirectChat(userId) {
  return () => {
    const promise = MatrixClient.createDirectChat(userId)
    promise.then((data) => {
      console.log(data)
      },
      (error) => {
      console.log(error);
      }
    );
  }
}

export function getMatchedContactList() {
  return (dispatch) => {
    console.log('getMatchedContactList')
    const promise = P2Chat.getMatchedChats()
    promise.then((data) => {
      console.log(data)
      const jsonData = JSON.parse(data)
      dispatch(getMatchedContactsSuccess(jsonData))
      console.log(jsonData)
      },
      (error) => {
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

  export function getMatchedContactsSuccess(data) {
    return {
      type: FETCHING_MATCHED_CONTACTS_SUCCESS,
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

  export function saveMyUserID(data) {
    return {
      type: SAVE_MY_USER_ID,
      data
    }
  }

  export function saveMyProfile(data) {
    return {
      type: SET_MY_PROFILE,
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
  