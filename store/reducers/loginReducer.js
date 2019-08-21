import { HANDLE_INPUT_CHANGE, LOGOUT, LOGINING, LOGIN_SUCCESS, LOGIN_FAILURE, IS_SIGNED_IN, INIT_APPLICATION } from '../actions/constants'

const initialState = {
    loginInputs: {
        homeserverUri: 'https://matrix.moonshard.tech',
        identityUri: 'https://vector.im',    
        username: null,
        password: null,
    },
    errors: [],
    loading: false,
    signedIn: false,
    checkedSignIn: false,
}

export default function loginReducer (state = initialState, action) {
  switch (action.type) {
    case LOGINING:
      return {
        ...state,
        loading: true,
      }
    case HANDLE_INPUT_CHANGE:
      return {
        ...state,
        loginInputs: {
            ...state.loginInputs, ...action.data 
        }   
    }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
      }
    case LOGIN_FAILURE:
        return {
            ...state,
            loading: false,
            errors: true,
        }
    case LOGOUT:
        return {
            ...state,
            signedIn: false,
            checkedSignIn: true,
        }
    case IS_SIGNED_IN: 
        return {
            ...state,
            signedIn: action.data,
            checkedSignIn: true,
        }
    case INIT_APPLICATION:
        return {
            ...state,
            signedIn: action.data,
            checkedSignIn: true,
        }
    default:
      return state
  }
}