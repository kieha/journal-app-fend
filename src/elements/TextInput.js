import PropTypes from 'prop-types';
import h from 'react-hyperscript';
import { noop } from 'lodash-es';

const TextInput = ({
  name, onChange, placeholder, required, value,
}) => (
  h('input.form-control', {
    name,
    onChange,
    placeholder,
    required,
    type: 'text',
    value,
  })
);

TextInput.propTypes = {
  defaultValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

TextInput.defaultProps = {
  onChange: noop,
  required: false,
};

export default TextInput;
