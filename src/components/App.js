/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import request from 'superagent';
import Moment from 'react-moment';
import swal from 'sweetalert2';
import DeleteEntryButton from './DeleteEntryButton';
import EmptyEntries from './EmptyEntries';
import Form from './Form';
import JournalTitle from './JournalTitle';

const styles = {
  buttonStyles: {
    background: 'none',
    border: 'none',
    color: '#6495ed',
    cursor: 'pointer',
    fontSize: '1.75em',
    marginBottom: 10,
    outline: 'none',
    textDecoration: 'dashed underline',
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedTitle: '',
      editing: undefined,
      entry: '',
      journalEntries: [],
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
    this.fetchEntries();
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
          this.setState({
            editing: undefined,
          });
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

  renderTitle(title, entryId) {
    const { editing } = this.state;
    return editing === entryId
      ? (
        <JournalTitle
          editTitle={() => this.editTitle(entryId)}
          handleEditField={this.handleEditField}
          stopEditing={this.stopEditing}
          inputRef={(ref) => { this.input = ref; }}
          title={title}
        />
      )
      : (
        <button
          onClick={() => this.editField(entryId)}
          style={styles.buttonStyles}
          type="button"
        >
          {title}
        </button>
      );
  }

  renderJournalList() {
    const { journalEntries } = this.state;
    return journalEntries.length
      ? journalEntries.map(entry => (
        <div className="list-group" key={entry._id} style={{ marginBottom: 20, marginTop: 20 }}>
          <div
            className="list-group-item flex-column align-items-start"
            style={{ justifyContent: 'center', textAlign: 'center' }}
          >
            <DeleteEntryButton
              onClick={() => this.deleteEntry(entry._id)}
            />
            {this.renderTitle(entry.title, entry._id)}
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
    const { title, entry } = this.state;
    return (
      <div>
        <div className="jumbotron jumbotron-fluid" style={{ textAlign: 'center' }}>
          <h1>Jot It Down</h1>
          <Form
            entry={entry}
            handleInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
            title={title}
          />
        </div>

        <div className="container-fluid">
          <h2 style={{ textAlign: 'center' }}>Journal Entries</h2>
          {this.renderJournalList()}
        </div>
      </div>
    );
  }
}

export default App;
