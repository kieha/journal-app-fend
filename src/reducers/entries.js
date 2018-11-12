/* eslint-disable no-underscore-dangle */
import {
  FETCH_JOURNAL_ENTRIES_SUCCESS,
  SAVE_JOURNAL_ENTRY_SUCCESS,
  UPDATE_JOURNAL_ENTRY_FAILURE,
  UPDATE_JOURNAL_ENTRY_SUCCESS,
} from '../actions';

const initialState = {
  errorMessage: null,
  journalEntries: [],
};

export default function journalReducer(state = initialState, action) {
  switch (action.type) {
  case FETCH_JOURNAL_ENTRIES_SUCCESS:
    return Object.assign({}, state, {
      errorMessage: null,
      journalEntries: action.entries,
    });
  case SAVE_JOURNAL_ENTRY_SUCCESS:
    return Object.assign({}, state, {
      errorMessage: null,
      journalEntries: [...state.journalEntries.filter(entry => entry._id !== action.entry._id), action.entry],
    });
  case UPDATE_JOURNAL_ENTRY_SUCCESS:
    return Object.assign({}, state, {
      errorMessage: null,
      journalEntries: [...state.journalEntries.filter(entry => entry._id !== action.entry._id), action.entry],
    });
  case UPDATE_JOURNAL_ENTRY_FAILURE:
    return Object.assign({}, state, {
      errorMessage: action.error,
    });
  default:
    return state;
  }
}
