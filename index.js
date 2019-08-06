import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initStore} from './redux/store';
import {Provider} from 'react-redux';

const store = initStore();

class Application extends Component {
    render () {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
  }  

AppRegistry.registerComponent(appName, () => Application);
