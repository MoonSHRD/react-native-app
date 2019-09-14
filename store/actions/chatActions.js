import { SET_ROOM_ID, SET_END, SET_START, GET_MESSAGE_HISTORY, GET_MESSAGE_HISTORY_SUCCESS, GET_MESSAGE_HISTORY_FAILURE, GET_UPDATED_MESSAGE_HISTORY, UPDATE_MESSAGE_HISTORY, PUSH_NEW_MESSAGE, PUSH_NEW_MESSAGE_SUCCESS, PUSH_NEW_MESSAGE_FAILURE, NEW_MESSAGE, HANDLE_MESSAGE_CHANGE, PUSH_NEW_MESSAGE_TO_HISTORY } from '../actions/constants'
import MatrixClient from '../../native/MatrixClient';  

export function getDirectChatHistory(roomId) {
    return (dispatch) => {
      const promise = MatrixClient.getHistoryMessage(roomId, null)
      promise.then((data) => {
        const jsonData = JSON.parse(data)

        // parsing json object from matrix for rendering
        const messageHistory = new Object()
        const time = new Date()
        messageHistory.end = jsonData.end
        messageHistory.start = jsonData.start
        
        messageHistory.messages = jsonData.messages.filter((data) => {
          if (data.content.body == null) {
            return false
          }
          return true
        }).map(data => {
          var message = new Object()

          message._id = `f${(~~(Math.random()*1e8)).toString(16)}`
          message.text = data.content.body
          message.createdAt = time - data.age
          message.status = data.m_sent_state

          return message
        })

        dispatch(getMessageHistory())
        dispatch(setEnd(messageHistory.end))
        dispatch(setStart(messageHistory.start))
        dispatch(getMessageHistorySuccess(messageHistory))
        console.log(messageHistory)
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

        // parsing json object from matrix for rendering

        const messageHistory = new Object()
        const time = new Date()
        messageHistory.end = jsonData.end
        messageHistory.start = jsonData.start

        messageHistory.messages = jsonData.messages.filter((data) => {
          if (data.content.body == null) {
            return false
          }
          return true
        }).map(data => {
          var message = new Object()

          message._id = `f${(~~(Math.random()*1e8)).toString(16)}`
          message.text = data.content.body
          message.createdAt = time - data.age
          message.status = data.m_sent_state

          return message
        })

        dispatch(getMessageHistory())
        dispatch(setEnd(messageHistory.end))
        dispatch(setStart(messageHistory.start))
        dispatch(getUpdatedMessageHistory(messageHistory))
        dispatch(updateMessageHistory())
        console.log(messageHistory)
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

        var newMessage = new Object()

        newMessage._id = `f${(~~(Math.random()*1e8)).toString(16)}`
        newMessage.text = message
        newMessage.createdAt = new Date(),
        newMessage.status = 'SENT'

        dispatch(newMessage(newMessage))
        dispatch(pushNewMessageToHistory())
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

  export function pushNewMessageToHistory() {
    return {
      type: PUSH_NEW_MESSAGE_TO_HISTORY,
    }
  }

  export function handleMessageChange(data) {
    return {
        type: HANDLE_MESSAGE_CHANGE,
        data
    }
  }