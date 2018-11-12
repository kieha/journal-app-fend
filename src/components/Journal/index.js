import { connect } from 'react-redux';
import Journal from './Journal';
import { fetchJournalEntries } from '../../actions/journals';

const mapStateToProps = state => ({
  entries: state.entries.journalEntries,
});

const mapDispatchToProps = dispatch => ({
  fetchEntries: () => dispatch(fetchJournalEntries()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
