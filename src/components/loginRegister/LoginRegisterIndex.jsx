import React from "react";
import Login from "./Login";
import Register from "./Register";
import { connect } from "react-redux";

class LoginRegisterIndex extends React.Component {
  state = {
    isLoginActive: true,
  };

  componentDidMount() {
    this.slidingTogglePanel.classList.add("right");
  }

  // Moves the sliding panel from one side to the other
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
        marginLeft: window.innerWidth / 50,
        marginRight: window.innerWidth / 50,
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
