import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY, GET_MATCHES, GET_ALL_P2CHATS, GET_ALL_P2CHATS_FAILURE, GET_ALL_P2CHATS_SUCCESS, GET_CHAT_MEMBERS, HANDLE_P2CHAT_MESSAGE_CHANGE, SET_START_P2CHAT, SET_END_P2CHAT, GET_P2CHAT_MESSAGE_HISTORY, GET_P2CHAT_MESSAGE_HISTORY_FAILURE, GET_P2CHAT_MESSAGE_HISTORY_SUCCESS, GET_P2CHAT_UPDATED_MESSAGE_HISTORY } from '../actions/constants'
import P2Chat from '../../native/P2Chat';

export function getCurrentTopics() {
    return (dispatch) => {
        const promise = P2Chat.getCurrentTopics()
        promise.then((data) => {
            const jsonData = JSON.parse(data)
            console.log(jsonData)
            dispatch(getAllTopics(jsonData))
        },
        (error) => {
            console.log(error);
        });
    }
}

export function subcribeToTopic(topic) {
    return (dispatch) =>  {
        const promise = P2Chat.subscribeToTopic(topic)
        promise.then((data) => {
            console.log(data)
        },
        (error) => {
            console.log(error);
        });    
    }
}

export function unsubscribeFromTopic(topic) {
    return (dispatch) => {
        const promise = P2Chat.unsubscribeFromTopic(topic)
        promise.then((data) => {
            console.log(data)
        },
        (error) => {
            console.log(error);
        });
    }
}

export function getAllP2Chats() {
    return (dispatch) => {
        const promise = P2Chat.getLocalChats()
        promise.then((data) => {
            jsonData = JSON.parse(data)
            console.log(jsonData)
            dispatch(getAllChats())
            dispatch(getAllChatsSuccess(jsonData))
        },
        (error) => {
            dispatch(getAllChatsFailure())
            console.log(error);
        });
    }
}

export function getChatMembers(topic) {
    return (dispatch) => {
        const promise = P2Chat.getLocalChatMembers(topic)
        promise.then((data) => {
            console.log(data)
            jsonData = JSON.parse(data)
            console.log(jsonData)
            dispatch(getAllChatMembers(jsonData))
        },
        (error) => {
            console.log(error);
        });
    }
}

export function sendMessage(topic, message) {
    return (dispatch) => {
        const promise = P2Chat.sendMessage(topic, message)
        promise.then((data) => {
            jsonData = JSON.parse(data)
            console.log(jsonData)
        },
        (error) => {
            console.log(error);
        });
    }
}

export function getP2ChatMessageHistory(topic) {
    return (dispatch) => {
        const promise = P2Chat.loadMoreMessages(topic, null)
        promise.then((data) => {
            jsonData = JSON.parse(data)
            dispatch(getMessageHistory())
            dispatch(setEnd(jsonData.end))
            dispatch(setStart(jsonData.start))
            dispatch(getMessageHistorySuccess(jsonData))
            console.log(jsonData)
        },
        (error) => {
            dispatch(getMessageHistoryFailure())
            console.log(error);
        });
    }
}

export function getP2ChatUpdatedMessageHistory(topic, token) {
    return (dispatch) => {
        const promise = P2Chat.loadMoreMessages(topic, token)
        promise.then((data) => {
            jsonData = JSON.parse(data)
            dispatch(getMessageHistory())
            dispatch(setEnd(jsonData.end))
            dispatch(getUpdatedMessageHistory(jsonData))
            console.log(jsonData)
        },
        (error) => {
            dispatch(getMessageHistoryFailure())
            console.log(error);
        });
    }
}

export function getAllTopics(data) {
    return {
        type: GET_ALL_TOPICS,
        data
    }
} 

export function getTopic(data) {
    return {
        type: GET_TOPIC,
        data
    }
}

export function newTopic(data) {
    return {
        type: NEW_TOPIC,
        data
    }
}

export function addTopicToArray(data) {
    return {
        type: ADD_TOPIC_TO_ARRAY,
        data
    }
}

export function getMatches(data) {
    return {
        type: GET_MATCHES,
        data
    }
}

export function getAllChats() {
    return {
        type: GET_ALL_P2CHATS,
    }
}
export function getAllChatsSuccess(data) {
    return {
        type: GET_ALL_P2CHATS_SUCCESS,
        data
    }
}
export function getAllChatsFailure() {
    return {
        type: GET_ALL_P2CHATS_FAILURE,
    }
}

export function getAllChatMembers() {
    return {
        type: GET_CHAT_MEMBERS,
        data
    }
}

export function handleMessageChange(data) {
    return {
        type: HANDLE_P2CHAT_MESSAGE_CHANGE,
        data
    }
  }

  export function setStart() {
    return {
        type: SET_START_P2CHAT,
        data
    }
}

export function setEnd() {
    return {
        type: SET_END_P2CHAT,
        data
    }
}

export function getMessageHistory() {
    return {
      type: GET_P2CHAT_MESSAGE_HISTORY,
    }
  }

  export function getMessageHistoryFailure() {
    return {
      type: GET_P2CHAT_MESSAGE_HISTORY_FAILURE,
    }
  }

  export function getMessageHistorySuccess(data) {
    return {
      type: GET_P2CHAT_MESSAGE_HISTORY_SUCCESS,
      data
    }
  }

  export function getUpdatedMessageHistory(data) {
    return {
      type: GET_P2CHAT_UPDATED_MESSAGE_HISTORY,
      data
    }
  }
