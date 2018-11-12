import { render } from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import h from 'react-hyperscript';
import rootReducer from './reducers';
import Journal from './components/Journal';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; //eslint-disable-line
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, logger)));

render(h(Provider, { store }, h(Journal)), document.getElementById('root'));
