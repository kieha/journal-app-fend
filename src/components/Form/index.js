import { connect } from 'react-redux';
import Form from './Form';
import { createJournalEntry } from '../../actions/journals';

const mapDispatchToProps = dispatch => ({
  createEntry: (entry, title) => dispatch(createJournalEntry(entry, title)),
});

export default connect(null, mapDispatchToProps)(Form);
