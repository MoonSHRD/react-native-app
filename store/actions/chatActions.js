import { SET_ROOM_ID, SET_END, SET_START, GET_MESSAGE_HISTORY, GET_MESSAGE_HISTORY_SUCCESS, GET_MESSAGE_HISTORY_FAILURE, GET_UPDATED_MESSAGE_HISTORY, UPDATE_MESSAGE_HISTORY, PUSH_NEW_MESSAGE, PUSH_NEW_MESSAGE_SUCCESS, PUSH_NEW_MESSAGE_FAILURE, NEW_MESSAGE, HANDLE_MESSAGE_CHANGE } from '../actions/constants'
import MatrixClient from '../../native/MatrixClient';  

export function getDirectChatHistory(roomId) {
    return (dispatch) => {
      const promise = MatrixClient.getHistoryMessage(roomId, null)
      promise.then((data) => {
        const jsonData = JSON.parse(data)
        dispatch(getMessageHistory())
        dispatch(getMessageHistorySuccess(jsonData))
        console.log(jsonData)
        },
        (error) => {
        dispatch(getMessageHistoryFailure())
        console.log(error);
        }
      );
    }
  }  

  export function updateDirectChatHistory(roomId, end) {
    return (dispatch) => {
      const promise = MatrixClient.getHistoryMessage(roomId, end)
      promise.then((data) => {
        const jsonData = JSON.parse(data)
        dispatch(getMessageHistory())
        dispatch(getUpdatedMessageHistory(jsonData))
        dispatch(updateMessageHistory())
        console.log(jsonData)
        },
        (error) => {
        dispatch(getMessageHistoryFailure())
        console.log(error);
        }
      );
    }
  }  

  export function sendMessage(message, roomId) {
    return (dispatch) => {
      const promise = MatrixClient.sendMessage(message, roomId)
      promise.then((data) => {
        console.log(data)
        dispatch(pushNewMessage())
        dispatch(pushNewMessageSuccess())
        },
        (error) => {
        console.log(error);
        dispatch(pushNewMessageFailure())
        }
      );
    }
  }  

  export function setRoomId(data) {
    return {
      type: SET_ROOM_ID,
      data
    }
  }

  export function setEnd(data) {
    return {
      type: SET_END,
      data
    }
  }

  export function setStart(data) {
    return {
      type: SET_START,
      data
    }
  }

  export function getMessageHistory() {
    return {
      type: GET_MESSAGE_HISTORY,
    }
  }

  export function getMessageHistoryFailure() {
    return {
      type: GET_MESSAGE_HISTORY_FAILURE,
    }
  }

  export function getMessageHistorySuccess(data) {
    return {
      type: GET_MESSAGE_HISTORY_SUCCESS,
      data
    }
  }

  export function getUpdatedMessageHistory(data) {
    return {
      type: GET_UPDATED_MESSAGE_HISTORY,
      data
    }
  }

  export function updateMessageHistory() {
      return {
          type: UPDATE_MESSAGE_HISTORY,
      }
  }

  export function pushNewMessage() {
    return {
        type: PUSH_NEW_MESSAGE,
    }
  }

  export function pushNewMessageSuccess() {
    return {
        type: PUSH_NEW_MESSAGE_SUCCESS,
    }
  }

  export function pushNewMessageFailure() {
    return {
        type: PUSH_NEW_MESSAGE_FAILURE,
    }
  }

  export function newMessage(data) {
    return {
        type: NEW_MESSAGE,
        data
    }
  }

  export function handleMessageChange(data) {
    return {
        type: HANDLE_MESSAGE_CHANGE,
        data
    }
  }