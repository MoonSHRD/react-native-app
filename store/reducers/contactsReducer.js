import { FETCHING_CONTACTS, FETCHING_CONTACTS_SUCCESS, FETCHING_CONTACTS_FAILURE, ADD_CONTACT, HANDLE_INPUT_CHANGE, DELETE_CONTACT, SEARCH_BAR, SEARCH_LIST, CLEAR_SEARCH_BAR, SELECT_CONTACT, DESELECT_CONTACT, SELECT_CHAT, DESELECT_CHAT, ADD_SELECTOR, SELECTED_CONTACTS,SELECT_IN_CONTACTS } from '../actions/constants'

const initialState = {
  contactList: [],
  searchList: [],
  search:'',
  searchChanged: false,
  selectedContact: null,
  selectedChat: null,
  selectedContacts: [],
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
    case ADD_SELECTOR: {
      return {
        ...state,
        contactList: [...state.contactList, state.contactList.filter((data, i) => data.isSelected = 's')]
      }
    }
    case SELECTED_CONTACTS: {
      return {
        ...state,
        selectedContacts: action.data
      }
    }
    case SELECT_IN_CONTACTS: {
      return {
        ...state, 
        selectedContacts: state.selectedContacts.map(
            (item, i) => i === action.index ? {...item, isSelected: !item.isSelected}
                                    : item
        )
       }
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
    case SEARCH_BAR: {
      return {
        ...state,
        search: action.data,
        searchChanged: true,
      }
    }
    case SEARCH_LIST: {
      return {
        ...state,
        searchList: action.data
      }
    }
    case CLEAR_SEARCH_BAR:  {
      return {
        ...state,
        search: '',
        searchChanged: false,
      }
    }
    case SELECT_CONTACT: {
      return {
        ...state,
        selectedContact: action.data,
      }
    }
    case DESELECT_CONTACT: {
      return {
        ...state,
        selectedContact: null,
      }
    }
    case SELECT_CHAT: {
      return {
        ...state,
        selectedChat: action.data,
      }
    }
    case DESELECT_CHAT: {
      return {
        ...state,
        selectedChat: null,
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