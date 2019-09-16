import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY } from '../actions/constants'

const initialState = {
    topics: [],
    newTopic: {},
    topic: {}
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
        default:
            return state               
    }
}  