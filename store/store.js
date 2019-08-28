import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

// const enhancerList = [];
// const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

// if (typeof devToolsExtension === 'function') {
//   enhancerList.push(devToolsExtension());
// }

// const composedEnhancer = compose(...enhancerList);

export default Store = createStore(rootReducer, applyMiddleware(thunk))