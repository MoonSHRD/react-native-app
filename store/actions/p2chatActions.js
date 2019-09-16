import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY } from '../actions/constants'
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

export function subcribeToTopic() {
    return (dispatch) =>  {
        const promise = P2Chat.subcribeToTopic('moonshard')
        promise.then((data) => {
            console.log(data)
            // const jsonData = JSON.parse(data)
            // console.log(jsonData)
        },
        (error) => {
            console.log(error);
        });    
    }
}

export function unsubscribeFromTopic() {
    return (dispatch) => {
        const promise = P2Chat.unsubscribeFromTopic('test')
        promise.then((data) => {
            console.log(data)
            // const jsonData = JSON.parse(data)
            // console.log(jsonData)
        },
        (error) => {
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

