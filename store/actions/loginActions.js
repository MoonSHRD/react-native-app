import { LOGOUT, LOGINING, LOGIN_SUCCESS, LOGIN_FAILURE, IS_SIGNED_IN, INIT_APPLICATION } from './constants'
import MatrixLoginClient from '../native/MatrixLoginClient';
  

  export function login() {
    return {
      type: LOGINING,
    }
  }
  
  export function loginSuccess() {
    return {
      type: LOGIN_SUCCESS,
    }
  }
  
  export function loginFailure() {
    return {
      type: LOGIN_FAILURE
    }
  }

  export function logout() {
    return { 
        type: LOGOUT, 
    }
}
  
  export const handleInputChange = (name, data) => {
      return { 
          type: HANDLE_INPUT_CHANGE,
          data: { [name]: data}
      }
  }

  export function isSignedIn(data) {
      return {
          type: IS_SIGNED_IN,
          data
      }
  }

  export function initApplication(data) {
      return {
          type: INIT_APPLICATION,
          data
      }
  }
  
  export const initAppWithRealm = async () => {
    return (dispatch) => {
      const response = await MatrixLoginClient.onAppStart()
      await dispatch(initApplication(response))
    }
  }
