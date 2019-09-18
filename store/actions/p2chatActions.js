import { GET_ALL_TOPICS, GET_TOPIC, NEW_TOPIC, ADD_TOPIC_TO_ARRAY, GET_MATCHES } from '../actions/constants'
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
        const promise = P2Chat.subcribeToTopic(topic)
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

export function getAllMatches() {
    return (dispatch) => {
        const promise = P2Chat.getAllMatches()
        promise.then((data) => {
            jsonData = JSON.parse(data)
            dispatch(getMatches(jsonData))
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

export function getMatches(data) {
    return {
        type: GET_MATCHES,
        data
    }
}

