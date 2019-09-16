import { SET_ROOM_ID, SET_END, SET_START, GET_MESSAGE_HISTORY, GET_MESSAGE_HISTORY_SUCCESS, GET_MESSAGE_HISTORY_FAILURE, GET_UPDATED_MESSAGE_HISTORY, UPDATE_MESSAGE_HISTORY, PUSH_NEW_MESSAGE, PUSH_NEW_MESSAGE_SUCCESS, PUSH_NEW_MESSAGE_FAILURE, NEW_MESSAGE, HANDLE_MESSAGE_CHANGE, PUSH_NEW_MESSAGE_TO_HISTORY, RESET_NEW_MESSAGE } from '../actions/constants'

const initialState = {
    roomId: '',
    messageHistory: {
        end: '',
        messages: [],
        start: '',
    },
    messages: [],
    newMessageHistory: {
        end: '',
        messages: [],
        start: '',
    },
    end: '',
    start: '',
    newMessage: {},
    newTextMessage: '',
    loading: false,
    error: false,
}

export default function chatReducer (state = initialState, action) {
    switch (action.type) {
        case SET_ROOM_ID:
            return {
                ...state,
                roomId: action.data
            }
        case SET_END:
            return {
                ...state,
                end: action.data,
            }   
        case SET_START:
            return {
                ...state,
                start: action.data
            }
        case GET_MESSAGE_HISTORY: 
            return {
                ...state,
                loading: true,
            }
        case GET_MESSAGE_HISTORY_SUCCESS:
            return {
                ...state,
                messageHistory: action.data,
                loading: false
            }    
        case GET_MESSAGE_HISTORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
            }            
        case GET_UPDATED_MESSAGE_HISTORY:
            return {
                ...state,
                newMessageHistory: action.data,
                loading: false
            }    
        case UPDATE_MESSAGE_HISTORY:
            return {
                ...state,
                messageHistory: {
                    end: state.newMessageHistory.end,
                    messageHistory: [
                        ...state.messageHistory.messages, ...state.newMessageHistory.messages 
                    ],
                    start: state.messageHistory.start,
                }
            }
        case PUSH_NEW_MESSAGE:
            return {
                ...state,
                loading: true,
            }
        case PUSH_NEW_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false
            }
        case PUSH_NEW_MESSAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case NEW_MESSAGE:
            return {
                ...state,
                newMessage: action.data
            }
        case RESET_NEW_MESSAGE:
            return {
                ...state,
                newMessage: {}
            }
        case PUSH_NEW_MESSAGE_TO_HISTORY:
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
        case HANDLE_MESSAGE_CHANGE: {    
            return {
                ...state, 
                newTextMessage: action.data
            }
        }        
        default:
            return state               
    }
}  