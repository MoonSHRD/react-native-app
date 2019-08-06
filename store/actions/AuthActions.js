import { AsyncStorage } from "react-native";
export const USER_KEY = "auth-demo-key";

import * as types from './constants/ActionTypes';

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
    AsyncStorage.getItem(USER_KEY)
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
    AsyncStorage.setItem(USER_KEY, 'newToken')
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
    AsyncStorage.removeItem(USER_KEY)
        .then((data) => {
            dispatch(loading(false));
            dispatch(removeToken(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        })