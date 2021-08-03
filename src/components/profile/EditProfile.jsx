import { Component } from "react";
import { editprofile, changepassword } from "../../global/userRequests";
import { connect } from "react-redux";
import axios from "axios";

class EditProfile extends Component {
  state = {
    firstName: this.props.user.firstName,
    lastName: this.props.user.lastName,
    email: this.props.user.email,
    username: this.props.user.username,
    emailError: 0,
    usernameError: 0,
    firstNameError: 0,
    lastNameError: 0,
    nameHint: "Your name can only contain letters.",
    usernameHint: "Your username can only contain letters and numbers and can only be changed once every 6 months.",
    response: {
      data: ".",
      color: "#dfdfdf",
    },
  };
  cancelToken = axios.CancelToken.source();

  componentWillUnmount() {
    this.cancelToken.cancel("Request is being canceled");
  }

  handleChangePasswordClick = () => {
    this.setState({ response: { data: "Sending confirmation e-mail...", color: "#1faacd" } }, () =>
      this.changePassword()
    );
  };

  async changePassword() {
    try {
      const res = await changepassword(this.cancelToken);
      if (res && res.status === 200) {
        this.setState({
          response: { color: "green", data: res.data },
        });
      } else {
        this.setState({
          response: { color: "red", data: "Something went wrong." },
        });
      }
    } catch (e) {}
  }

  async editProfile() {
    const payload = {
      username: this.state.username,
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };

    try {
      const res = await editprofile(payload, this.cancelToken);
      if (res) {
        if (res.status === 200) {
          this.setState({
            response: { color: "green", data: res.data },
          });
        } else if (res.status === 400) {
          this.setState({
            response: { color: "red", data: res.data },
          });
        } else {
          this.setState({
            response: { color: "red", data: "Something went wrong." },
          });
        }
      } else {
        this.setState({
          response: { color: "red", data: "Something went wrong." },
        });
      }
    } catch (e) {}
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === "email") this.setState({ emailError: 0 });
    else if (document.getElementById("username") === document.activeElement) this.setState({ usernameError: 0 });
    else if (document.getElementById("firstName") === document.activeElement) this.setState({ firstNameError: 0 });
    else if (document.getElementById("lastName") === document.activeElement) this.setState({ lastNameError: 0 });

    this.clearResponse();
  };

  clearResponse() {
    this.setState({ response: { data: ".", color: "#dfdfdf" } });
  }

  validate = () => {
    let emailError = 0;
    let usernameError = 0;
    let firstNameError = 0;
    let lastNameError = 0;
    const englishGreek = /^[a-zA-ZΑ-Ωα-ωίϊΐόάέύϋΰήώ' ]+$/;
    const alphanum = /^[a-zA-Z0-9]+$/;

    if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) || this.state.email.length > 60) {
      emailError = 1;
    }

    if (!this.state.username || !this.state.username.match(alphanum) || this.state.username.length > 20) {
      usernameError = 1;
    }

    if (this.state.firstName && !this.state.firstName.match(englishGreek)) firstNameError = 1;

    if (this.state.lastName && !this.state.lastName.match(englishGreek)) lastNameError = 1;

    if (emailError || usernameError || firstNameError || lastNameError) {
      this.setState({ emailError, usernameError, firstNameError, lastNameError });
      return false;
    }

    return true;
  };

  handleFocus = (e) => e.target.select();

  handleSubmit = (e) => {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      this.setState({ response: { data: "Applying changes...", color: "#1faacd" } }, () => this.editProfile());
    }
  };

  render() {
    const mobile = window.innerWidth <= 768 ? true : false;
    return (
      <div className="container">
        <h2>Edit Profile</h2>
        <form className="form" id="edit-profile-form" onSubmit={this.handleSubmit}>
          <div
            className="form-group"
            style={{
              flexDirection: mobile ? "column" : "row",
              marginRight: 0,
            }}
          >
            <label className="container-text" htmlFor="firstName">
              First Name:
            </label>
            <input
              style={
                this.state.firstNameError
                  ? {
                      border: "2px solid red",
                      backgroundColor: "#f2a1a8",
                    }
                  : null
              }
              type="text"
              name="firstName"
              id="firstName"
              maxLength="20"
              value={this.state.firstName || ""}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
            />
            <span className="hint-tooltip">{this.state.nameHint}</span>
          </div>
          <div
            className="form-group"
            style={{
              flexDirection: mobile ? "column" : "row",
              marginRight: 0,
            }}
          >
            <label className="container-text" htmlFor="lastName">
              Last Name:
            </label>
            <input
              style={
                this.state.lastNameError
                  ? {
                      border: "2px solid red",
                      backgroundColor: "#f2a1a8",
                    }
                  : null
              }
              type="text"
              name="lastName"
              id="lastName"
              maxLength="20"
              value={this.state.lastName || ""}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
            />
            <span className="hint-tooltip">{this.state.nameHint}</span>
          </div>
          <div
            className="form-group"
            style={{
              flexDirection: mobile ? "column" : "row",
              marginRight: 0,
            }}
          >
            <label className="container-text" htmlFor="email">
              Email:
            </label>
            <input
              style={
                this.state.emailError
                  ? {
                      border: "2px solid red",
                      backgroundColor: "#f2a1a8",
                    }
                  : null
              }
              type="email"
              id="email"
              name="email"
              maxLength="60"
              value={this.state.email || ""}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
            />
          </div>
          <div
            className="form-group"
            style={{
              flexDirection: mobile ? "column" : "row",
              marginRight: 0,
            }}
          >
            <label className="container-text" htmlFor="username">
              Username:
            </label>
            <input
              style={
                this.state.usernameError
                  ? {
                      border: "2px solid red",
                      backgroundColor: "#f2a1a8",
                    }
                  : null
              }
              type="text"
              name="username"
              id="username"
              maxLength="20"
              value={this.state.username || ""}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
            />
            <span className="hint-tooltip">{this.state.usernameHint}</span>
          </div>
        </form>
        <button
          type="button"
          className="blue-button"
          style={{ marginTop: 20 }}
          onClick={() => {
            this.handleChangePasswordClick();
          }}
        >
          Change Password
        </button>
        <div className="response" style={{ color: this.state.response.color }}>
          {this.state.response.data}
        </div>
        <button type="submit" form="edit-profile-form" className="green-button">
          Save
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(EditProfile);
