import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY, GET_MATCHES, GET_ALL_P2CHATS, GET_ALL_P2CHATS_FAILURE, GET_ALL_P2CHATS_SUCCESS } from '../actions/constants'
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

// export function getAllMatches() {
//     return (dispatch) => {
//         console.log('22')
//         const promise = P2Chat.getAllMatches()
//         promise.then((data) => {
//             console.log(data)
//             jsonData = JSON.parse(data)
//             dispatch(getMatches(jsonData))
//             console.log(jsonData)
//         },
//         (error) => {
//             console.log(error);
//         });
//     }
// }

export function getAllP2Chats() {
    return (dispatch) => {
        const promise = P2Chat.getLocalChats()
        promise.then((data) => {
            console.log(data)
            jsonData = JSON.parse(data)
            console.log(jsonData)
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
            jsonData = JSON.parse(data)
            console.log(jsonData)
        },
        (error) => {
            dispatch(getAllChatsFailure())
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

