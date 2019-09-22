import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY, GET_MATCHES, GET_ALL_P2CHATS, GET_ALL_P2CHATS_FAILURE, GET_ALL_P2CHATS_SUCCESS, GET_CHAT_MEMBERS, HANDLE_P2CHAT_MESSAGE_CHANGE, SET_START_P2CHAT, SET_END_P2CHAT, GET_P2CHAT_MESSAGE_HISTORY, GET_P2CHAT_MESSAGE_HISTORY_FAILURE, GET_P2CHAT_MESSAGE_HISTORY_SUCCESS, GET_P2CHAT_UPDATED_MESSAGE_HISTORY } from '../actions/constants'

const initialState = {
    topics: [],
    newTopic: {},
    topic: {},
    matches: {},
    p2chats: [],
    chatMembers: [],
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
                loading: false
            }    
        case GET_P2CHAT_MESSAGE_HISTORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
            }            
        case GET_P2CHAT_UPDATED_MESSAGE_HISTORY:
            return {
                ...state,
                newMessageHistory: action.data,
                loading: false
            }           
        default:
            return state               
    }
}  