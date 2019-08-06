import {createStore, compose} from 'redux';
import rootReducer from './reducers';
import initialState from './reducers/initialState';

// const enhancerList = [];
// const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

// if (typeof devToolsExtension === 'function') {
//   enhancerList.push(devToolsExtension());
// }

// const composedEnhancer = compose(...enhancerList);

const initStore = () => createStore(rootReducer, initialState);

module.exports = {
  initStore
};
