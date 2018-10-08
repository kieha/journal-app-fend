/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from "react";
import request from "superagent";
import Moment from "react-moment";
import swal from "sweetalert2";

const styles = {
  buttonStyles: {
    color: "#6495ed",
    textDecoration: "dashed underline",
    fontSize: "1.75em",
    background: "none",
    border: "none",
    outline: "none",
    cursor: "pointer",
    marginBottom: 10,
  },
};

const buttonTypes = Object.freeze({
  DANGER: "btn-danger",
  PRIMARY: "btn-primary",
  SECONDARY: "btn-secondary",
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: undefined,
      title: "",
      entry: "",
      editedTitle: "",
      journalEntries: [],
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
      .get("http://localhost:8000/api/journals")
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
      .post("http://localhost:8000/api/journals/new")
      .send({
        title,
        entry,
      })
      .end((err, res) => {
        if (res.body.error) {
          swal({
            title: "Error",
            text: res.body.error,
            type: "error",
          });
        } else {
          swal({
            title: "Success",
            text: res.body.message,
            type: "success",
            confirmButtonText: "OK",
            allowOutsideClick: false,
          }).then(() => {
            this.setState({
              title: "",
              entry: "",
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
            title: "Error",
            text: res.body.error,
            type: "error",
          });
        } else {
          swal({
            title: "Success",
            text: res.body.message,
            type: "success",
            confirmButtonText: "OK",
            allowOutsideClick: false,
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
      type: "warning",
      text: "Are you sure you want to delete this entry?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
      allowOutsideClick: false,
      cancelButtonColor: "#d33",
    }).then(() => {
      request
        .delete(`http://localhost:8000/api/journals/${entryId}`)
        .end((err, res) => {
          if (res.body.error) {
            swal({
              title: "Error",
              text: res.body.error,
              type: "error",
            });
          } else {
            swal({
              title: "Success",
              text: res.body.message,
              type: "success",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            });
            this.fetchEntries();
          }
        });
    }).catch(swal.noop);
  }

  renderDelete(entryId) {
    return (
      <div className="delete-entry" style={{ position: "absolute" }}>
        <button
          className={`btn ${buttonTypes.DANGER}`}
          style={{ border: "1px solid transparent", borderRadius: 2 }}
          type="button"
          onClick={() => this.deleteEntry(entryId)}
        >
          Delete Entry
        </button>
      </div>
    );
  }

  renderTitle(title, entryId) {
    const { editing } = this.state;
    return editing === entryId
      ? (
        <div className="row editable-title">
          <div className="input-group" style={{ margin: "auto", marginBottom: 19, maxWidth: "fit-content" }}>
            <input
              style={{ borderRadius: 2 }}
              type="text"
              className="form-control"
              placeholder="Edit Title"
              ref={(input) => { this.input = input; }}
              name="editedTitle"
              defaultValue={title}
              onChange={this.handleEditField}
            />
            {[buttonTypes.PRIMARY, buttonTypes.SECONDARY].map(btnType => (
              <span className="input-group-btn" style={{ marginLeft: 12 }} key={btnType}>
                <button
                  className={`btn ${btnType}`}
                  style={{ border: "1px solid transparent", borderRadius: 2 }}
                  type="button"
                  onClick={btnType === buttonTypes.PRIMARY ? () => this.editTitle(entryId) : this.stopEditing}
                >
                  <i className={`fa ${btnType === buttonTypes.PRIMARY ? "fa-check" : "fa-times"}`} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>
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
        <div className="list-group" key={entry._id} style={{ marginTop: 20, marginBottom: 20 }}>
          <div
            className="list-group-item flex-column align-items-start"
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            {this.renderDelete(entry._id)}
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
        <div className="not-found" style={{ marginTop: 20, marginBottom: 20 }}>
          <h3 style={{ textAlign: "center" }}>No journal entries yet!</h3>
          <h4 style={{ textAlign: "center" }}>Insert an entry in the form above to get started</h4>
        </div>
      );
  }

  render() {
    const { title, entry } = this.state;
    return (
      <div>
        <div className="jumbotron jumbotron-fluid" style={{ textAlign: "center" }}>
          <h1>Jot It Down</h1>

          <div className="container" style={{ paddingTop: "46px" }}>

            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                {" "}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Journal Entry Title"
                  required
                  name="title"
                  value={title}
                  onChange={this.handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Journal Entry</label>
                <textarea
                  name="entry"
                  className="form-control"
                  required
                  rows="5"
                  value={entry}
                  onChange={this.handleInputChange}
                />
              </div>

              <button type="submit" className={`btn ${buttonTypes.PRIMARY}`}>Submit Journal Entry</button>
            </form>

          </div>
        </div>

        <div className="container-fluid">
          <h2 style={{ textAlign: "center" }}>Journal Entries</h2>
          {this.renderJournalList()}
        </div>
      </div>
    );
  }
}

export default App;
