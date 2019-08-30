import { NOTIFICATIONS, SET_NIGHT_THEME, TEXT_SIZE, CHAT_BACKGROUND } from '../actions/constants'

const initialState = {
    nightTheme: false,
    notifications: false,
    textSize: 0.3,
    chatBackground: 'white',
    language: 'en',
}

export default function appStateReducer (state = initialState, action) {
    switch (action.type) {
        case NOTIFICATIONS:
            return {
                ...state,
                notifications: action.data
            }
        case SET_NIGHT_THEME:
            return {
                ...state,
                nightTheme: action.data,
            }   
        case TEXT_SIZE:
            return {
                ...state,
                textSize: action.data
            }
        case CHAT_BACKGROUND:
            return {
                ...state,
                chatBackground: action.data
            }
        default:
            return state               
    }
}  