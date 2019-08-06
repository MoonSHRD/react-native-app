import * as types from '../actions/constants';
import initialState from './initialState';
 
export default function authReducer(state = initialState.profile, action) {
    switch(action.type) {
        case types.GET_TOKEN: {
            return {
                ...state,
                accessToken: [...state.accessToken, action.accessToken]
            }
        } 
        case types.SAVE_TOKEN: {    
            return {
                ...state, 
                accessToken: {
                    ...state.accessToken, ...action.accessToken 
                }
            }
        }
        case types.REMOVE_TOKEN: {
            return {
                ...state,
                accessToken: [...state.accessToken, action.accessToken]
            }
        }
        case types.LOADING: {
            return {
                ...state,
                isLoading: [...state.isLoading, action.isLoading]
            }
        }
        case types.ERROR: {
            return {
                ...state,
                error: [...state.error, action.error]
            }
        }
 
        default: return state;
    }
}