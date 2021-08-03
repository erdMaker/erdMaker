import { createRef, Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ShadowScreen } from "../../global/globalComponents";
import emailImg from "../../img/at.png";
import { forgotpassword } from "../../global/userRequests";
import axios from "axios";

class ForgotPassword extends Component {
  state = {
    email: "",
    emailError: 0,
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

  async forgotPassword() {
    const captchaVal = this.recaptchaRef.current.getValue();

    const payload = {
      email: this.state.email,
      captcha: captchaVal,
    };

    this.recaptchaRef.current.reset();

    try {
      const res = await forgotpassword(payload, this.cancelToken);
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

  clearForm() {
    this.setState({
      email: "",
      emailError: 0,
      response: {
        data: ".",
        color: "#dfdfdf",
      },
    });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === "email") this.setState({ emailError: 0 });

    this.clearResponse();
  };

  clearResponse() {
    this.setState({ response: { data: ".", color: "#d3d1d1" } });
  }

  validate = () => {
    let emailError = 0;

    if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) || this.state.email.length > 60) {
      emailError = 1;
    }

    if (emailError) {
      this.setState({ emailError });
      return false;
    }

    return true;
  };

  handleFocus = (e) => e.target.select();

  handleSubmit = (e) => {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) this.setState({ response: { data: "Please wait...", color: "#1faacd" } }, () => this.forgotPassword());
  };

  render() {
    return (
      <>
        <ShadowScreen />
        <div className="high-zindex-centered-container">
          <div className="container">
            <h2>Forgot Password</h2>
            <form className="form" id="forgot-password-form" onSubmit={this.handleSubmit}>
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
                  value={this.state.email}
                  placeholder="enter your email address"
                  maxLength="60"
                  onFocus={this.handleFocus}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <ReCAPTCHA
                  ref={this.recaptchaRef}
                  sitekey="6LfnzsoUAAAAAEIhX6yNXpGNXvQjAFlyYh54pJPn"
                  style={{
                    transform: "scale(0.75)",
                    WebkitTransform: "scale(0.75)",
                  }}
                />
              </div>
            </form>
            <div className="response" style={{ color: this.state.response.color }}>
              {this.state.response.data}
            </div>
            <div className="buttons-sideBySide">
              <button type="submit" form="forgot-password-form" className="blue-button" style={{ marginRight: 20 }}>
                Confirm
              </button>
              <button
                type="button"
                className="red-button"
                style={{ marginLeft: 20 }}
                onClick={() => {
                  this.props.toggleForgotPassword();
                  this.clearForm();
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ForgotPassword;
