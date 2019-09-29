import { SET_ROOM_ID, SET_END, SET_START, GET_MESSAGE_HISTORY, GET_MESSAGE_HISTORY_SUCCESS, GET_MESSAGE_HISTORY_FAILURE, GET_UPDATED_MESSAGE_HISTORY, UPDATE_MESSAGE_HISTORY, PUSH_NEW_MESSAGE, PUSH_NEW_MESSAGE_SUCCESS, PUSH_NEW_MESSAGE_FAILURE, NEW_MESSAGE, HANDLE_MESSAGE_CHANGE, PUSH_NEW_MESSAGE_TO_HISTORY, RESET_NEW_MESSAGE } from '../actions/constants'
import MatrixClient from '../../native/MatrixClient';  

export function getDirectChatHistory (roomId, callback) {
    return (dispatch) => {
      const promise = MatrixClient.getHistoryMessage(roomId, null)
      promise.then((data) => {
        const jsonData = JSON.parse(data)
        console.log(jsonData)

        // parsing json object from matrix for rendering
        const messageHistory = new Object()
        const time = new Date()
        messageHistory.end = jsonData.end
        messageHistory.start = jsonData.start
        
        messageHistory.messages = jsonData.messages.filter((data) => {
          if (data.event.content.body == null) {
            return false
          }
          return true
        }).map(data => {
          var message = new Object()

          message._id = data.event.event_id
          message.text = data.event.content.body
          message.createdAt = time - data.event.age
          message.status = data.event.m_sent_state

          var user = new Object()
          message.user = user
          user._id = data.event.sender

          if (data.user.avatarUrl != '') {
            let parts = data.user.avatarUrl.split('mxc://', 2);
            let urlWithoutMxc  = parts[1];
            let urlParts = urlWithoutMxc.split('/', 2)
            let firstPart = urlParts[0]
            let secondPart = urlParts[1] 
            let serverUrl = 'https://matrix.moonshard.tech/_matrix/media/r0/download/'
            let avatarLink =  serverUrl + firstPart + '/' + secondPart    
            user.avatar = avatarLink
          }
          
          user.name = data.user.name
          user.userId = data.user.userId
          user.avatarUrl = data.user.avatarUrl
          user.roomId = data.user.roomId
          return message
        })

        dispatch(getMessageHistory())
        dispatch(setEnd(messageHistory.end))
        dispatch(setStart(messageHistory.start))
        dispatch(getMessageHistorySuccess(messageHistory))
        console.log(messageHistory)
        callback(messageHistory)
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
        console.log(jsonData)

        // parsing json object from matrix for rendering

        const messageHistory = new Object()
        const time = new Date()
        messageHistory.end = jsonData.end
        messageHistory.start = jsonData.start

        messageHistory.messages = jsonData.messages.filter((data) => {
          if (data.event.content.body == null) {
            return false
          }
          return true
        }).map(data => {
          var message = new Object()

          message._id = data.event.event_id
          message.text = data.event.content.body
          message.createdAt = time - data.event.age
          message.status = data.event.m_sent_state
          var user = new Object()
          message.user = user
          user._id = data.event.sender

          if (data.user.avatarUrl != '') {
            let parts = data.user.avatarUrl.split('mxc://', 2);
            let urlWithoutMxc  = parts[1];
            let urlParts = urlWithoutMxc.split('/', 2)
            let firstPart = urlParts[0]
            let secondPart = urlParts[1] 
            let serverUrl = 'https://matrix.moonshard.tech/_matrix/media/r0/download/'
            let avatarLink =  serverUrl + firstPart + '/' + secondPart    
            user.avatar = avatarLink
          }

          user.name = data.user.name
          user.userId = data.user.userId
          user.avatarUrl = data.user.avatarUrl
          user.roomId = data.user.roomId

          return message
        })

        dispatch(getMessageHistory())
        dispatch(setEnd(messageHistory.end))
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
        // dispatch(pushNewMessage())
        // dispatch(pushNewMessageToHistory())
        // dispatch(pushNewMessageSuccess())
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

  export function setNewMessage(data) {
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

  export function resetNewMessage() {
    return {
      type: RESET_NEW_MESSAGE,
    }
  }

  export function handleMessageChange(data) {
    return {
        type: HANDLE_MESSAGE_CHANGE,
        data
    }
  }