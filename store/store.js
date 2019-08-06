import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers/index';
import initialState from './reducers/initialState';
import thunk from 'redux-thunk';

// const enhancerList = [];
// const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

// if (typeof devToolsExtension === 'function') {
//   enhancerList.push(devToolsExtension());
// }

// const composedEnhancer = compose(...enhancerList);

const initStore = () => createStore(rootReducer, initialState, applyMiddleware(thunk));

module.exports = {
  initStore
};
