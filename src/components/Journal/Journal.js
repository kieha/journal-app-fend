/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import Moment from 'react-moment';
import swal from 'sweetalert2';
import DeleteEntryButton from '../DeleteEntryButton';
import EmptyEntries from '../EmptyEntries';
import Form from '../Form';
import JournalTitle from '../JournalTitle';

class Journal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedTitle: '',
      editing: undefined,
      entry: '',
      title: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editField = this.editField.bind(this);
    this.handleEditField = this.handleEditField.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.editTitle = this.editTitle.bind(this);
  }

  componentDidMount() {
    const { fetchEntries } = this.props;
    fetchEntries();
  }

  fetchEntries() {
    request
      .get('http://localhost:8000/api/journals')
      .end((err, res) => {
        if (res.body.message) {
          this.setState({
            journalEntries: [],
          });
        } else {
          this.setState({
            journalEntries: res.body,
          });
        }
      });
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    const { entry, title } = this.state;
    event.preventDefault();
    request
      .post('http://localhost:8000/api/journals/new')
      .send({
        entry,
        title,
      })
      .end((err, res) => {
        if (res.body.error) {
          swal({
            text: res.body.error,
            title: 'Error',
            type: 'error',
          });
        } else {
          swal({
            allowOutsideClick: false,
            confirmButtonText: 'OK',
            text: res.body.message,
            title: 'Success',
            type: 'success',
          }).then(() => {
            this.setState({
              entry: '',
              title: '',
            });
          });
          this.fetchEntries();
        }
      });
  }

  editTitle(entryId) {
    const { editedTitle } = this.state;
    request
      .put(`http://localhost:8000/api/journals/${entryId}`)
      .send({
        title: editedTitle,
      })
      .end((err, res) => {
        if (res.body.error) {
          swal({
            text: res.body.error,
            title: 'Error',
            type: 'error',
          });
        } else {
          swal({
            allowOutsideClick: false,
            confirmButtonText: 'OK',
            text: res.body.message,
            title: 'Success',
            type: 'success',
          });
          this.stopEditing();
          this.fetchEntries();
        }
      });
  }

  editField(entryId) {
    this.setState({
      editing: entryId,
    });
  }

  handleEditField() {
    const { name, value } = this.input;
    console.log('NAME', name);
    console.log('VALUE', value);
    this.setState({
      [name]: value,
    });
  }

  stopEditing() {
    this.setState({
      editing: undefined,
    });
  }

  deleteEntry(entryId) {
    swal({
      allowOutsideClick: false,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancel',
      confirmButtonText: 'Yes, delete',
      showCancelButton: true,
      text: 'Are you sure you want to delete this entry?',
      type: 'warning',
    }).then(() => {
      request
        .delete(`http://localhost:8000/api/journals/${entryId}`)
        .end((err, res) => {
          if (res.body.error) {
            swal({
              text: res.body.error,
              title: 'Error',
              type: 'error',
            });
          } else {
            swal({
              allowOutsideClick: false,
              confirmButtonText: 'OK',
              text: res.body.message,
              title: 'Success',
              type: 'success',
            });
            this.fetchEntries();
          }
        });
    }).catch(swal.noop);
  }

  renderJournalList() {
    const { editing } = this.state;
    const { entries } = this.props;

    return entries.length
      ? entries.map(entry => (
        <div className="list-group" key={entry._id} style={{ marginBottom: 20, marginTop: 20 }}>
          <div
            className="list-group-item flex-column align-items-start"
            style={{ justifyContent: 'center', textAlign: 'center' }}
          >
            <DeleteEntryButton
              onClick={() => this.deleteEntry(entry._id)}
            />
            <JournalTitle
              startEditing={() => this.editField(entry._id)}
              handleEditTitle={() => this.editTitle(entry._id)}
              onChange={this.handleEditField}
              stopEditing={this.stopEditing}
              inputRef={(ref) => { this.input = ref; }}
              isEditingTitle={editing === entry._id}
              entryId={entry._id}
            />
            <h6>
              Created at:
              {<Moment format="HH:mm DD/MM/YYYY">{entry.createdAt}</Moment>}
            </h6>
            <p>{entry.entry}</p>
          </div>
        </div>
      ))
      : (
        <EmptyEntries />
      );
  }

  render() {
    return (
      <div>
        <div className="jumbotron jumbotron-fluid" style={{ textAlign: 'center' }}>
          <h1>Jot It Down</h1>
          <Form />
        </div>

        <div className="container-fluid">
          <h2 style={{ textAlign: 'center' }}>Journal Entries</h2>
          {this.renderJournalList()}
        </div>
      </div>
    );
  }
}

Journal.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    createdAt: PropTypes.string,
    entry: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  fetchEntries: PropTypes.func.isRequired,
};

export default Journal;
