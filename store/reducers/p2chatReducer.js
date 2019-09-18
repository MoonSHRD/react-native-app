import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY, GET_MATCHES } from '../actions/constants'

const initialState = {
    topics: [],
    newTopic: {},
    topic: {},
    matches: {},
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
        default:
            return state               
    }
}  