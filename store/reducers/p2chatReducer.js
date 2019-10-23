import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY, GET_MATCHES, GET_ALL_P2CHATS, GET_ALL_P2CHATS_FAILURE, GET_ALL_P2CHATS_SUCCESS, GET_CHAT_MEMBERS, HANDLE_P2CHAT_MESSAGE_CHANGE, SET_START_P2CHAT, SET_END_P2CHAT, GET_P2CHAT_MESSAGE_HISTORY, GET_P2CHAT_MESSAGE_HISTORY_FAILURE, GET_P2CHAT_MESSAGE_HISTORY_SUCCESS, GET_P2CHAT_UPDATED_MESSAGE_HISTORY, P2CHAT_PUSH_NEW_MESSAGE, P2CHAT_PUSH_NEW_MESSAGE_SUCCESS, P2CHAT_PUSH_NEW_MESSAGE_FAILURE, P2CHAT_NEW_MESSAGE, P2CHAT_RESET_NEW_MESSAGE, P2CHAT_PUSH_NEW_MESSAGE_TO_HISTORY, SET_MATCHED_USER, SET_VISIBLE, P2CHAT_SEARCH_BAR, P2CHAT_SEARCH_LIST, P2CHAT_CLEAR_SEARCH_BAR, FETCHING_MATCHED_CONTACTS_SUCCESS } from '../actions/constants'

const initialState = {
    topics: [],
    newTopic: {},
    topic: {},
    matches: {},
    p2chats: [],
    chatMembers: [],
    matchesList: [],
    messageHistory: {
        end: '',
        messages: [],
        start: '',
    },
    newMessageHistory: {
        end: '',
        messages: [],
        start: '',
    },
    matchedUser: {},
    isVisible: false,
    newMessage: {},
    isLoading: false,
    error: false,
    newTextMessage: '',
    end: null,
    start: null,
}

export default function p2chatReducer (state = initialState, action) {
    switch (action.type) {
        case GET_ALL_TOPICS:
            return {
                ...state,
                topics: action.data
            }
        case GET_TOPIC:
            return {
                ...state,
                topic: action.data,
            }   
        case NEW_TOPIC:
            return {
                ...state,
                newTopic: action.data
            }
        case ADD_TOPIC_TO_ARRAY:
            return {
                ...state,
                topics: [...state.topics, state.newTopic]
            }
        case GET_MATCHES:
            return {
                ...state,
                matches: action.data,
            }
        case GET_ALL_P2CHATS:
                return {
                    ...state,
                    isLoading: true,
                }        
        case GET_ALL_P2CHATS_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                    error: true,
                }        
        case GET_ALL_P2CHATS_SUCCESS:
            return {
                ...state,
                p2chats: action.data,
                isLoading: false,
                error: false,
            }
        case GET_CHAT_MEMBERS:
            return {
                ...state,
                chatMembers: action.data
            }
        case HANDLE_P2CHAT_MESSAGE_CHANGE: {    
            return {
                ...state, 
                newTextMessage: action.data
            }
        }    
        case SET_END_P2CHAT:
            return {
                ...state,
                end: action.data,
            }   
        case SET_START_P2CHAT:
            return {
                ...state,
                start: action.data
            } 
        case GET_P2CHAT_MESSAGE_HISTORY: 
            return {
                ...state,
                loading: true,
            }
        case GET_P2CHAT_MESSAGE_HISTORY_SUCCESS:
            return {
                ...state,
                messageHistory: action.data,
                isLoading: false
            }    
        case GET_P2CHAT_MESSAGE_HISTORY_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true,
            }            
        case GET_P2CHAT_UPDATED_MESSAGE_HISTORY:
            return {
                ...state,
                newMessageHistory: action.data,
                isLoading: false
            } 
        case P2CHAT_PUSH_NEW_MESSAGE:
            return {
                ...state,
                isLoading: true,
            }
        case P2CHAT_PUSH_NEW_MESSAGE_SUCCESS:
            return {
                ...state,
                isLoading: false
            }
        case P2CHAT_PUSH_NEW_MESSAGE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true
            }
        case P2CHAT_NEW_MESSAGE:
            return {
                ...state,
                newMessage: action.data
            }
        case P2CHAT_RESET_NEW_MESSAGE:
            return {
                ...state,
                newMessage: {}
            }
        case P2CHAT_PUSH_NEW_MESSAGE_TO_HISTORY:
            return {
                ...state,
                messageHistory: {
                    ...state.messageHistory,
                        end: state.messageHistory.end,
                        messages: [
                            state.newMessage,  ...state.messageHistory.messages
                        ],
                        start: state.messageHistory.start,
                },
            }  
        case SET_MATCHED_USER:
            return {
                ...state,
                matchedUser: action.data,
                isVisible: true,
            }       
        case SET_VISIBLE:
            return {
                ...state,
                isVisible: action.data,
            }     
        case P2CHAT_SEARCH_BAR: {
            return {
                ...state,
                search: action.data,
                searchChanged: true,
            }
        }
        case P2CHAT_SEARCH_LIST: {
            return {
                ...state,
                searchList: action.data
            }
        }
        case P2CHAT_CLEAR_SEARCH_BAR:  {
            return {
                ...state,
                search: '',
                searchChanged: false,
            }
        }
        case FETCHING_MATCHED_CONTACTS_SUCCESS:
            return {
              ...state,
              isLoading: false,
              matchesList: action.data,
              alreadyLoaded: true,
            }                      
        default:
            return state               
    }
}  