import { connect } from 'react-redux';
import { find } from 'lodash-es';
import JournalTitle from './JournalTitle';
import { editJournalTitle } from '../../actions/journals';

const mapStateToProps = (state, ownProps) => ({
  entryId: ownProps.entryId,
  errorMessage: state.entries.errorMessage,
  title: find(state.entries.journalEntries, ['_id', ownProps.entryId]).title,
});

const mapDispatchToProps = dispatch => ({
  editTitle: (id, title) => dispatch(editJournalTitle(id, title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JournalTitle);
