import { Component } from "react";
import logInImg from "../../img/login.png";
import emailImg from "../../img/at.png";
import passwordImg from "../../img/key.png";
import ForgotPassword from "../loginRegister/ForgotPassword";
import { login } from "../../global/userRequests";
import { connect } from "react-redux";
import { storeUserData } from "../../actions/actions";
import axios from "axios";

class Login extends Component {
  state = {
    showForgotPassword: false,
    email: "",
    password: "",
    emailError: 0,
    passwordError: 0,
    response: {
      data: ".",
      color: "#dfdfdf",
    },
  };
  cancelToken = axios.CancelToken.source();

  componentWillUnmount() {
    this.cancelToken.cancel("Request is being canceled");
  }

  async logIn() {
    const payload = {
      email: this.state.email,
      password: this.state.password,
    };

    try {
      const res = await login(payload, this.cancelToken);
      if (res) {
        if (res.status === 200) {
          this.props.storeUserData({
            isLogged: true,
          });
        } else if (res.status === 401) {
          this.setState({
            response: { color: "red", data: res.data },
          });
        } else {
          this.setState({
            response: { data: "Login failed.", color: "red" },
          });
        }
      } else {
        this.setState({
          response: { data: "Login failed.", color: "red" },
        });
      }
    } catch (e) {}
  }

  toggleForgotPassword = () =>
    this.setState((state) => ({
      showForgotPassword: !state.showForgotPassword,
    }));

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === "email") this.setState({ emailError: 0 });

    if (document.getElementById("password") === document.activeElement) this.setState({ passwordError: 0 });

    this.clearResponse();
  };

  clearResponse() {
    this.setState({ response: { data: ".", color: "#dfdfdf" } });
  }

  validate = () => {
    let emailError = 0;
    let passwordError = 0;
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;

    if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) || this.state.email.length > 60) {
      emailError = 1;
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

    if (emailError || passwordError) {
      this.setState({ emailError, passwordError });
      return false;
    }

    return true;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) this.setState({ response: { data: "Logging in...", color: "#1faacd" } }, () => this.logIn());
  };

  handleFocus = (e) => e.target.select();

  render() {
    return (
      <>
        {this.state.showForgotPassword && <ForgotPassword toggleForgotPassword={this.toggleForgotPassword} />}
        <div className="container">
          <h2>Log in</h2>
          <img className="container-icon" src={logInImg} alt=":(" />
          <form className="form" id="login-form" onSubmit={this.handleSubmit}>
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
                name="email"
                id="email"
                placeholder="email"
                maxLength="60"
                value={this.state.email}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
              />
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
            </div>
          </form>
          <div className="response" style={{ color: this.state.response.color }}>
            {this.state.response.data}
          </div>
          <div className="buttons-list">
            <button type="submit" form="login-form" className="green-button">
              Log in
            </button>
            <button
              type="button"
              className="forgot-password-button"
              onClick={() => {
                this.toggleForgotPassword();
              }}
            >
              Lost Password?
            </button>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {
  storeUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
