import { Component } from 'react';
import PropTypes from 'prop-types';
import h from 'react-hyperscript';
import TextInput from '../elements/TextInput';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entry: '',
      title: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    const { createEntry } = this.props;
    const { entry, title } = this.state;
    return h('.container', { style: { paddingTop: 46 } }, h('form', {
      onSubmit: (event) => {
        event.preventDefault();
        createEntry(entry, title);
        this.setState({
          entry: '',
          title: '',
        });
      },
    }, [
      h('.form-group', [
        h('label', 'Title'),
        h(TextInput, {
          name: 'title',
          onChange: this.handleInputChange,
          placeholder: 'Journal Entry Title',
          required: true,
          value: title,
        }),
      ]),
      h('.form-group', [
        h('label', 'Journal Entry'),
        h('textarea.form-control', {
          name: 'entry',
          onChange: this.handleInputChange,
          required: true,
          rows: 5,
          value: entry,
        }),
      ]),
      h('button.btn.btn-primary', { type: 'submit' }, 'Submit Journal Entry'),
    ]));
  }
}

Form.propTypes = {
  createEntry: PropTypes.func.isRequired,
};

export default Form;
