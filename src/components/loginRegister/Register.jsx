import { createRef, Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import emailImg from "../../img/at.png";
import usernameImg from "../../img/user.png";
import passwordImg from "../../img/key.png";
import { register } from "../../global/userRequests";
import axios from "axios";

class Register extends Component {
  state = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    emailError: 0,
    usernameError: 0,
    passwordError: 0,
    confirmPasswordError: 0,
    passwordHint: "Your password must be 8-16 characters long and contain at least one number and one letter.",
    usernameHint: "Your username can only contain letters and numbers and can only be changed once every 6 months.",
    response: {
      data: ".",
      color: "#dfdfdf",
    },
  };
  recaptchaRef = createRef();
  cancelToken = axios.CancelToken.source();

  componentWillUnmount() {
    this.cancelToken.cancel("Request is being canceled");
  }

  async reGister() {
    const captchaVal = this.recaptchaRef.current.getValue();

    const payload = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      captcha: captchaVal,
    };

    this.recaptchaRef.current.reset();

    try {
      const res = await register(payload, this.cancelToken);
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
            response: { color: "red", data: "Registration failed." },
          });
        }
      } else {
        this.setState({
          response: { color: "red", data: "Registration failed." },
        });
      }
    } catch (e) {}
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (document.getElementById("email") === document.activeElement) this.setState({ emailError: 0 });
    else if (document.getElementById("username") === document.activeElement) this.setState({ usernameError: 0 });
    else if (document.getElementById("password") === document.activeElement) this.setState({ passwordError: 0 });
    else if (document.getElementById("confirmPassword") === document.activeElement)
      this.setState({ confirmPasswordError: 0 });

    this.clearResponse();
  };

  clearResponse() {
    this.setState({ response: { data: ".", color: "#dfdfdf" } });
  }

  validate = () => {
    let emailError = 0;
    let usernameError = 0;
    let passwordError = 0;
    let confirmPasswordError = 0;
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;
    const alphanum = /^[a-zA-Z0-9]+$/;

    if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) || this.state.email.length > 60) {
      emailError = 1;
    }

    if (!this.state.username || !this.state.username.match(alphanum) || this.state.username.length > 20) {
      usernameError = 1;
    }

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

    if (emailError || usernameError || passwordError || confirmPasswordError) {
      this.setState({ emailError, usernameError, passwordError, confirmPasswordError });
      return false;
    }

    return true;
  };

  handleFocus = (e) => e.target.select();

  handleSubmit = (e) => {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) this.setState({ response: { data: "Registering user...", color: "#1faacd" } }, () => this.reGister());
  };

  render() {
    return (
      <div className="container">
        <h2>Register</h2>
        <form className="form" id="register-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <img className="form-input-icon" src={emailImg} alt=":(" />
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
              placeholder="email"
              maxLength="60"
              value={this.state.email}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <img className="form-input-icon" src={usernameImg} alt=":(" />
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
              placeholder="username"
              maxLength="20"
              value={this.state.username}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
            />
            <span className="hint-tooltip">{this.state.usernameHint}</span>
          </div>
          <div className="form-group">
            <img className="form-input-icon" src={passwordImg} alt=":(" />
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
          <div
            className="form-group"
            style={{
              marginTop: 20,
              marginRight: 0,
              marginBottom: 0,
              marginLeft: 38,
            }}
          >
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
          <div className="form-group">
            <ReCAPTCHA
              ref={this.recaptchaRef}
              sitekey="6LfnzsoUAAAAAEIhX6yNXpGNXvQjAFlyYh54pJPn"
              style={{
                transform: "scale(0.7)",
                WebkitTransform: "scale(0.7)",
                width: 260,
              }}
            />
          </div>
        </form>
        <div className="response" style={{ color: this.state.response.color }}>
          {this.state.response.data}
        </div>
        <button type="submit" form="register-form" className="blue-button">
          Create Account
        </button>
      </div>
    );
  }
}

export default Register;
