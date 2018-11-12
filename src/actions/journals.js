import {
  FETCH_JOURNAL_ENTRIES_SUCCESS,
  SAVE_JOURNAL_ENTRY_SUCCESS,
  UPDATE_JOURNAL_ENTRY_SUCCESS,
  UPDATE_JOURNAL_ENTRY_FAILURE,
} from '.';

import {
  editEntry, createEntry, fetchEntries,
} from '../helpers/journalApi';

function fetchJournalEntriesSuccess(entries) {
  return { entries, type: FETCH_JOURNAL_ENTRIES_SUCCESS };
}

function saveJournalEntrySuccess(entry) {
  return { entry, type: SAVE_JOURNAL_ENTRY_SUCCESS };
}

function updateJournalEntrySuccess(entry) {
  return { entry, type: UPDATE_JOURNAL_ENTRY_SUCCESS };
}

function updateJournalEntryFailure(error) {
  return { error, type: UPDATE_JOURNAL_ENTRY_FAILURE };
}

export function editJournalTitle(id, title) {
  return dispatch => editEntry(id, title)
    .then(entry => dispatch(updateJournalEntrySuccess(entry)))
    .catch(error => dispatch(updateJournalEntryFailure(error)));
}

export function fetchJournalEntries() {
  return dispatch => fetchEntries().then((entries) => {
    if (entries.message) {
      dispatch(fetchJournalEntriesSuccess([]));
      return;
    }

    dispatch(fetchJournalEntriesSuccess(entries));
  });
}

export function createJournalEntry(journalEntry, journalTitle) {
  return dispatch => createEntry(journalEntry, journalTitle)
    .then(entry => dispatch(saveJournalEntrySuccess(entry.journal)));
}
