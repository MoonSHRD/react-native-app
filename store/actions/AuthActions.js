import { AsyncStorage } from "react-native";

import * as types from './constants';

export const getToken = (accessToken) => ({
    type: types.GET_TOKEN,
    accessToken,
});

export const saveToken = accessToken => ({
    type: types.SAVE_TOKEN,
    accessToken
});

export const removeToken = () => ({
    type: types.REMOVE_TOKEN,
});

export const isLoading = bool => ({
    type: types.LOADING,
    isLoading: bool,
});

export const error = error => ({
    type: types.ERROR,
    error,
});

export const getUserToken = () => dispatch => 
    AsyncStorage.getItem('userToken')
        .then((data) => {
            dispatch(isLoading(true));
            dispatch(getToken(data));
            dispatch(isLoading(false));
        })
        .catch((err) => {
            dispatch(isLoading(true));
            dispatch(error(err.message || 'ERROR'));
            dispatch(isLoading(false));
        })

export const saveUserToken = (data) => dispatch =>
    alert('Save Token')
    AsyncStorage.setItem('userToken', 'newToken')
        .then((data) => {
            dispatch(isLoading(true));
            dispatch(saveToken('token saved'));
            dispatch(isLoading(false));
        })
        .catch((err) => {
            dispatch(isLoading(true));
            dispatch(error(err.message || 'ERROR'));
            dispatch(isLoading(false));
        })

export const removeUserToken = () => dispatch =>
    AsyncStorage.removeItem('userToken')
        .then((data) => {
            dispatch(loading(false));
            dispatch(removeToken(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        })