import { Component } from "react";
import { connect } from "react-redux";
import { resend } from "../../global/userRequests";
import axios from "axios";
import { diagramLimit } from "../../global/constants.js";

class ConfirmEmailPrompt extends Component {
  state = {
    response: {
      data: ".",
      color: "#dfdfdf",
    },
  };
  cancelToken = axios.CancelToken.source();

  componentWillUnmount() {
    this.cancelToken.cancel("Request is being canceled");
  }

  clearResponse = () => {
    this.setState({ response: { data: ".", color: "#dfdfdf" } });
  };

  handleClick = () => {
    this.setState(
      {
        response: { data: "Sending confirmation e-mail...", color: "#1faacd" },
      },
      () => this.reSend()
    );
  };

  reSend = async () => {
    try {
      const res = await resend(this.cancelToken);
      if (res && res.status === 200) {
        this.setState({
          response: { color: "green", data: res.data },
        });
      } else {
        this.setState({
          response: {
            color: "red",
            data: "Could not send confirmation e-mail.",
          },
        });
      }
    } catch (e) {}
  };

  render() {
    return (
      <div className="confirm-email-prompt">
        By verifying your e-mail address, you can gain access to the cloud storage feature. You can save up to{" "}
        {diagramLimit} diagrams and access them from any computer and location.
        <div className="response" style={{ color: this.state.response.color }}>
          {this.state.response.data}
        </div>
        <button type="button" className="blue-button" onClick={this.handleClick}>
          Resend E-mail Confirmation
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  general: state.general,
});

export default connect(mapStateToProps, null)(ConfirmEmailPrompt);
