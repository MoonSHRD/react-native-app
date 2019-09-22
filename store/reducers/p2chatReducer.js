import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY, GET_MATCHES, GET_ALL_P2CHATS, GET_ALL_P2CHATS_FAILURE, GET_ALL_P2CHATS_SUCCESS } from '../actions/constants'

const initialState = {
    topics: [],
    newTopic: {},
    topic: {},
    matches: {},
    p2chats: [],
    chatMembers: [],
    isLoading: false,
    error: false,
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
        default:
            return state               
    }
}  