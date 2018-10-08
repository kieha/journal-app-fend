import PropTypes from 'prop-types';
import h from 'react-hyperscript';

const buttonTypes = Object.freeze({
  PRIMARY: 'btn-primary',
  SECONDARY: 'btn-secondary',
});

const JournalTitle = ({
  editTitle, handleEditField, inputRef, stopEditing, title,
}) => (
  h('.row', [
    h('.input-group', { style: { margin: 'auto', marginBottom: 19, maxWidth: 'fit-content' } }, [
      h('input.form-control', {
        defaultValue: title,
        name: 'editedTitle',
        onChange: handleEditField,
        placeholder: 'Edit Title',
        ref: inputRef,
        type: 'text',
      }),
      [buttonTypes.PRIMARY, buttonTypes.SECONDARY].map(btnType => (
        h('span.input-group-btn', { key: btnType, style: { marginLeft: 12 } }, h(`button.btn.${btnType}`, {
          onClick: btnType === buttonTypes.PRIMARY ? editTitle : stopEditing,
          style: { border: '1px solid transparent', borderRadius: 2 },
          type: 'button',
        }, h(`i.fa.${btnType === buttonTypes.PRIMARY ? 'fa-check' : 'fa-times'}`), { ariaHidden: true }))
      )),
    ]),
  ])
);

JournalTitle.propTypes = {
  editTitle: PropTypes.func.isRequired,
  handleEditField: PropTypes.func.isRequired,
  inputRef: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default JournalTitle;
