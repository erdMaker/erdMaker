import { Component } from "react";
import changePwdImg from "../../img/password-change.png";
import { LinkButton } from "../../global/globalComponents";
import { resetpassword } from "../../global/userRequests";
import axios from "axios";

class ResetPassword extends Component {
  state = {
    password: "",
    confirmPassword: "",
    passwordError: 0,
    confirmPasswordError: 0,
    passwordHint: "Password must be 8-16 characters long and contain at least one number and one letter.",
    response: {
      data: ".",
      color: "#dfdfdf",
    },
  };
  cancelToken = axios.CancelToken.source();

  componentDidMount() {
    document.title = "ERD Maker - Password Reset";
  }

  componentWillUnmount() {
    this.cancelToken.cancel("Request is being canceled");
  }

  resetPassword() {
    const token = window.location.pathname.split("/")[2];
    const newPass = {
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      token: token,
    };

    //this.setState({
    //  password: "",
    //  confirmPassword: "",
    //});

    resetpassword(newPass, this.cancelToken)
      .then((res) => {
        if (res && res.status === 200) {
          this.setState({
            response: { color: "green", data: res.data },
          });
        } else {
          this.setState({
            response: { color: "red", data: "Something went wrong." },
          });
        }
      })
      .catch(() => {});
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (document.getElementById("password") === document.activeElement) this.setState({ passwordError: 0 });
    else if (document.getElementById("confirmPassword") === document.activeElement)
      this.setState({ confirmPasswordError: 0 });

    this.clearResponse();
  };

  clearResponse() {
    this.setState({ response: { data: ".", color: "#dfdfdf" } });
  }

  validate = () => {
    let passwordError = 0;
    let confirmPasswordError = 0;
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;

    if (
      this.state.password.length >= 8 &&
      this.state.password.length <= 16 &&
      this.state.password.match(numbers) &&
      (this.state.password.match(lowerCaseLetters) || this.state.password.match(upperCaseLetters))
    ) {
      passwordError = 0;
    } else {
      passwordError = 1;
    }

    if (!this.state.confirmPassword || this.state.password !== this.state.confirmPassword) {
      confirmPasswordError = 1;
    }

    if (passwordError || confirmPasswordError) {
      this.setState({ passwordError, confirmPasswordError });
      return false;
    }

    return true;
  };

  handleFocus = (e) => e.target.select();

  handleSubmit = (e) => {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid)
      this.setState({ response: { data: "Changing Password...", color: "#1faacd" } }, () => this.resetPassword());
  };

  render() {
    return (
      <div className="reset-password">
        <div className="container">
          <h2>Reset Password</h2>
          <img className="container-icon" src={changePwdImg} alt=":(" />
          <form className="form" id="reset-password" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                style={
                  this.state.passwordError
                    ? {
                        border: "2px solid red",
                        backgroundColor: "#f2a1a8",
                      }
                    : null
                }
                type="password"
                name="password"
                id="password"
                maxLength="16"
                placeholder="password"
                value={this.state.password}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
              />
              <span className="hint-tooltip">{this.state.passwordHint}</span>
            </div>
            <div className="form-group">
              <input
                style={
                  this.state.confirmPasswordError
                    ? {
                        border: "2px solid red",
                        backgroundColor: "#f2a1a8",
                      }
                    : null
                }
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                maxLength="16"
                placeholder="confirm password"
                value={this.state.confirmPassword}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
              />
            </div>
          </form>
          <div className="response" style={{ color: this.state.response.color }}>
            {this.state.response.data}
          </div>
          <div className="buttons-sideBySide">
            <button type="submit" form="reset-password" className="blue-button" style={{ marginRight: 20 }}>
              Confirm
            </button>
            <LinkButton className="red-button" style={{ marginLeft: 20 }} label="Home" useSpan={false} pathname="/" />
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
