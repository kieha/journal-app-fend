import { combineReducers } from 'redux';
import entries from './entries';

const rootReducer = combineReducers({
  entries,
});

export default rootReducer;
