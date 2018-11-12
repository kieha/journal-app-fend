import { Component } from 'react';
import PropTypes from 'prop-types';
import h from 'react-hyperscript';
import swal from 'sweetalert2';

const buttonTypes = Object.freeze({
  PRIMARY: 'btn-primary',
  SECONDARY: 'btn-secondary',
});

const buttonStyles = {
  background: 'none',
  border: 'none',
  color: '#6495ed',
  cursor: 'pointer',
  fontSize: '1.75em',
  marginBottom: 10,
  outline: 'none',
  textDecoration: 'dashed underline',
};

class JournalTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedTitle: '',
    };

    this.editTitle = this.editTitle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { value } = event.target;
    this.setState({ editedTitle: value });
  }

  editTitle() {
    const {
      editTitle, errorMessage, entryId, stopEditing,
    } = this.props;
    const { editedTitle } = this.state;
    console.log('EDITED TITLE', editedTitle);
    editTitle(entryId, editedTitle);
    console.log('ERROR MESSAGE', errorMessage);
    stopEditing();
  }

  render() {
    const {
      isEditingTitle, startEditing, stopEditing, title,
    } = this.props;

    if (isEditingTitle) {
      return h('.input-group', { style: { margin: 'auto', marginBottom: 19, maxWidth: 'fit-content' } }, [
        h('input.form-control', {
          defaultValue: title,
          name: 'editedTitle',
          onChange: this.handleInputChange,
          placeholder: 'Edit Title',
          type: 'text',
        }),
        [buttonTypes.PRIMARY, buttonTypes.SECONDARY].map(btnType => (
          h('span.input-group-btn', { key: btnType, style: { marginLeft: 12 } }, h(`button.btn.${btnType}`, {
            onClick: btnType === buttonTypes.PRIMARY ? this.editTitle : stopEditing,
            style: { border: '1px solid transparent', borderRadius: 2 },
            type: 'button',
          }, h(`i.fa.${btnType === buttonTypes.PRIMARY ? 'fa-check' : 'fa-times'}`), { ariaHidden: true }))
        )),
      ]);
    }

    return h('button', {
      onClick: startEditing,
      style: buttonStyles,
    }, title);
  }
}

JournalTitle.propTypes = {
  editTitle: PropTypes.func.isRequired,
  entryId: PropTypes.string.isRequired,
  isEditingTitle: PropTypes.bool.isRequired,
  startEditing: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default JournalTitle;
