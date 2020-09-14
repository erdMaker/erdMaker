import React from "react";
import Login from "./Login";
import Register from "./Register";
import { connect } from "react-redux";

class LoginRegisterIndex extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoginActive: true,
    };
  }

  componentDidMount() {
    this.slidingTogglePanel.classList.add("right");
  }

  changeState = () => {
    if (this.state.isLoginActive) {
      this.slidingTogglePanel.classList.remove("right");
      this.slidingTogglePanel.classList.add("left");
    } else {
      this.slidingTogglePanel.classList.remove("left");
      this.slidingTogglePanel.classList.add("right");
    }
    this.setState((state) => ({ isLoginActive: !state.isLoginActive }));
  };

  render() {
    const current = this.state.isLoginActive ? "Register" : "Log in";
    return (
      <div className="login-register">
        {this.state.isLoginActive && <Login />}
        {!this.state.isLoginActive && <Register />}
        <SlidingTogglePanel
          current={current}
          onClick={this.changeState}
          containerRef={(ref) => (this.slidingTogglePanel = ref)}
          screenWidth={this.props.stager.screenWidth}
        />
      </div>
    );
  }
}

const SlidingTogglePanel = (props) => (
  <div className="sliding-toggle-panel" ref={props.containerRef} onClick={props.onClick}>
    <div
      className="sliding-toggle-panel-text"
      style={{
        marginLeft: props.screenWidth / 50,
        marginRight: props.screenWidth / 50,
      }}
    >
      {props.current}
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  stager: state.stager,
});

export default connect(mapStateToProps, null)(LoginRegisterIndex);
