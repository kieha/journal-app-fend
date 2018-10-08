import PropTypes from 'prop-types';
import h from 'react-hyperscript';
import { noop } from 'lodash-es';
import TextInput from '../elements/TextInput';

const Form = ({
  entry, handleInputChange, handleSubmit, title,
}) => (
  h('.container', { style: { paddingTop: 46 } }, h('form', { onSubmit: handleSubmit }, [
    h('.form-group', [
      h('label', 'Title'),
      h(TextInput, {
        name: 'title',
        onChange: handleInputChange,
        placeholder: 'Journal Entry Title',
        required: true,
        value: title,
      }),
    ]),
    h('.form-group', [
      h('label', 'Journal Entry'),
      h('textarea.form-control', {
        name: 'entry',
        onChange: handleInputChange,
        required: true,
        rows: 5,
        value: entry,
      }),
    ]),
    h('button.btn.btn-primary', { type: 'submit' }, 'Submit Journal Entry'),
  ]))
);

Form.propTypes = {
  entry: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  title: PropTypes.string.isRequired,
};

Form.defaultProps = {
  handleInputChange: noop,
  handleSubmit: noop,
};

export default Form;
