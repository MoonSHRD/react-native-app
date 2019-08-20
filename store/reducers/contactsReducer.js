import { FETCHING_CONTACTS, FETCHING_CONTACTS_SUCCESS, FETCHING_CONTACTS_FAILURE, ADD_CONTACT, HANDLE_INPUT_CHANGE, DELETE_CONTACT } from '../actions/constants'

const initialState = {
  contactList: [],
  newContact: {
    name: '',
    lastName: '',
    email: '',
    userId: '',
    lastSeen: '',
    lastMessage: '',
    avatar: null,
  },
  isLoading: false,
  error: false
}

export default function contactsReducer (state = initialState, action) {
  switch (action.type) {
    case FETCHING_CONTACTS:
      return {
        ...state,
        contactList: [],
        isLoading: true
      }
    case FETCHING_CONTACTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        contactList: action.data
      }
    case FETCHING_CONTACTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: true
      }
    case ADD_CONTACT: {
      return {
          ...state,
          contactList: [...state.contactList, state.newContact]
      }
    }
    case HANDLE_INPUT_CHANGE: {    
        return {
            ...state, 
            newContact: {
                ...state.newContact, ...action.data 
            }
        }
    }
    case DELETE_CONTACT: {
      return {
          ...state,
          contactList: [...state.contactList, state.contactList.filter((data, i) => i !== action.id)]
      }
    }
    default:
      return state
  }
}